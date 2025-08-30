const User = require('../models/User');
const { sendTokenResponse } = require('../utils/auth');
const { asyncHandler, successResponse, errorResponse } = require('../utils/helpers');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return errorResponse(res, 'User already exists with this email', 400);
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'user'
  });

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = emailVerificationToken;
  await user.save();

  // Emit real-time update for new user registration
  if (global.io) {
    console.log('🔄 Emitting userCreated event for new registration');
    global.io.to('users').emit('userCreated', {
      type: 'registered',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  }

  // Send token response
  sendTokenResponse(user, 201, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Get user with password
  const user = await User.findByEmail(email);

  if (!user) {
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Check if account is locked
  if (user.isLocked) {
    return errorResponse(res, 'Account temporarily locked due to too many failed login attempts', 423);
  }

  // Check if user is active
  if (!user.isActive) {
    return errorResponse(res, 'Account is deactivated. Please contact support.', 403);
  }

  // Check password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    // Increment login attempts
    await user.incLoginAttempts();
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Reset login attempts and update last login
  await user.resetLoginAttempts();
  user.lastLogin = new Date();
  await user.save();

  // Send token response
  sendTokenResponse(user, 200, res, 'Login successful');
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  successResponse(res, null, 'User logged out successfully');
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  successResponse(res, user, 'User profile retrieved successfully');
});

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return errorResponse(res, 'Please provide current password and new password', 400);
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return errorResponse(res, 'Current password is incorrect', 400);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return errorResponse(res, 'Please provide email address', 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    return errorResponse(res, 'No user found with this email address', 404);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
  // Set expire time
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await user.save();

  // Create reset URL (in production, this would be sent via email)
  const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

  successResponse(res, 
    { resetUrl, resetToken }, 
    'Password reset token generated. Check your email for reset instructions.'
  );
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;

  if (!newPassword) {
    return errorResponse(res, 'Please provide new password', 400);
  }

  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return errorResponse(res, 'Invalid or expired reset token', 400);
  }

  // Set new password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerificationToken: token });

  if (!user) {
    return errorResponse(res, 'Invalid verification token', 400);
  }

  // Update user
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();

  successResponse(res, null, 'Email verified successfully');
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Private
const resendVerificationEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.emailVerified) {
    return errorResponse(res, 'Email is already verified', 400);
  }

  // Generate new verification token
  const emailVerificationToken = crypto.randomBytes(20).toString('hex');
  user.emailVerificationToken = emailVerificationToken;
  await user.save();

  // Create verification URL (in production, this would be sent via email)
  const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${emailVerificationToken}`;

  successResponse(res, 
    { verifyUrl, verificationToken: emailVerificationToken }, 
    'Verification email sent successfully'
  );
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail
};
