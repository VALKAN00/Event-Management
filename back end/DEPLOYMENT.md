# EventX Studio Backend Deployment Guide

## Overview
This guide covers deployment options for the EventX Studio backend API on various platforms.

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure all environment variables are properly set:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_very_secure_jwt_secret_key_for_production
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
FRONTEND_URL=https://your-frontend-domain.com
```

### 2. Dependencies
All dependencies are listed in `package.json` and will be installed automatically.

### 3. MongoDB Setup
- Create a MongoDB Atlas cluster
- Whitelist deployment platform IPs
- Create database user with read/write permissions
- Get connection string

## Deployment Platforms

### 1. Render (Recommended)

**Step 1: Create Render Account**
- Sign up at [render.com](https://render.com)
- Connect your GitHub account

**Step 2: Create Web Service**
1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure settings:
   - **Name**: `eventx-studio-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (for testing) or `Starter` (for production)

**Step 3: Environment Variables**
Add the following environment variables in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

**Step 4: Deploy**
- Click "Create Web Service"
- Render will automatically build and deploy

### 2. Railway

**Step 1: Setup**
1. Sign up at [railway.app](https://railway.app)
2. Install Railway CLI: `npm install -g @railway/cli`
3. Login: `railway login`

**Step 2: Deploy**
```bash
# In your backend directory
railway init
railway add --database mongodb
railway up
```

**Step 3: Configure Environment**
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_jwt_secret
railway variables set FRONTEND_URL=https://your-frontend-domain.com
```

### 3. Heroku

**Step 1: Setup**
1. Install Heroku CLI
2. Login: `heroku login`

**Step 2: Create App**
```bash
# In your backend directory
heroku create eventx-studio-backend
```

**Step 3: Configure Environment**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

**Step 4: Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### 4. DigitalOcean App Platform

**Step 1: Create App**
1. Go to DigitalOcean Apps
2. Create new app from GitHub repository

**Step 2: Configure**
- **Source**: Your GitHub repository
- **Branch**: main
- **Build Phase**: `npm install`
- **Run Command**: `npm start`

**Step 3: Environment Variables**
Add environment variables in the app settings.

### 5. AWS (Advanced)

**Using AWS Elastic Beanstalk:**

1. Create `Dockerrun.aws.json`:
```json
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "node:18-alpine"
  },
  "Ports": [
    {
      "ContainerPort": "5000"
    }
  ]
}
```

2. Create `.ebextensions/environment.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
    PORT: 5000
```

3. Deploy using EB CLI

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

USER node

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

### Build and Run
```bash
# Build image
docker build -t eventx-studio-backend .

# Run container
docker run -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your_connection_string \
  -e JWT_SECRET=your_jwt_secret \
  eventx-studio-backend

# Or use docker-compose
docker-compose up -d
```

## Database Setup (MongoDB Atlas)

### 1. Create Cluster
1. Sign up at [mongodb.com](https://cloud.mongodb.com)
2. Create new cluster (Free tier available)
3. Choose cloud provider and region

### 2. Configure Security
1. **Database Access**: Create user with read/write permissions
2. **Network Access**: Add IP addresses (0.0.0.0/0 for all IPs or specific deployment IPs)

### 3. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password

## SSL Certificate (HTTPS)

Most deployment platforms provide SSL certificates automatically. For custom domains:

### Let's Encrypt (Free)
```bash
# Install certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d your-api-domain.com

# Update nginx configuration to use SSL
```

### Cloudflare (Recommended)
1. Add your domain to Cloudflare
2. Enable SSL/TLS encryption
3. Set up page rules for API subdomain

## Performance Optimization

### 1. Enable Compression
The API already includes compression middleware, but ensure it's enabled in production.

### 2. Database Indexing
Ensure MongoDB indexes are created:
```javascript
// In MongoDB shell or through code
db.users.createIndex({ email: 1 })
db.events.createIndex({ date: 1, status: 1 })
db.bookings.createIndex({ user: 1, event: 1 })
```

### 3. Caching
Consider implementing Redis for session storage and caching:
```bash
npm install redis connect-redis
```

### 4. Rate Limiting
The API includes rate limiting, but consider using a reverse proxy like Nginx for additional protection.

## Monitoring and Logging

### 1. Application Monitoring
```bash
# Install monitoring packages
npm install @newrelic/native-metrics newrelic
```

### 2. Error Tracking
```bash
# Install Sentry for error tracking
npm install @sentry/node
```

### 3. Log Management
```bash
# Install winston for better logging
npm install winston
```

## Backup Strategy

### 1. MongoDB Backup
```bash
# Create backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/database"

# Restore backup
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/database" dump/
```

### 2. Automated Backups
Set up automated backups using MongoDB Atlas backup service or third-party tools.

## Domain Configuration

### 1. Custom Domain
1. Purchase domain from registrar
2. Create A record pointing to your server IP
3. Or use CNAME for platform-specific deployments

### 2. Subdomain Setup
```
api.yourdomain.com → Your backend
app.yourdomain.com → Your frontend
```

## Health Checks

The API includes a health check endpoint:
```
GET /api/health
```

Configure your deployment platform to use this for health monitoring.

## Scaling Considerations

### 1. Horizontal Scaling
- Use load balancers
- Ensure stateless design
- Consider Redis for session storage

### 2. Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for read-heavy workloads
- Sharding for large datasets

### 3. CDN Integration
- Use CloudFlare or AWS CloudFront
- Cache static responses
- Optimize image delivery

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Security headers enabled (Helmet)
- [ ] Input validation active
- [ ] JWT secrets are strong
- [ ] Regular security updates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access settings
   - Ensure user permissions

2. **Environment Variables Not Loading**
   - Verify .env file in production
   - Check platform-specific env var settings
   - Ensure proper naming

3. **CORS Issues**
   - Update FRONTEND_URL in environment variables
   - Check CORS configuration in server.js

4. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration settings
   - Ensure consistent secret across instances

### Debugging Commands
```bash
# Check environment variables
node -p "process.env"

# Test MongoDB connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(console.error)"

# Check port availability
netstat -tlnp | grep :5000
```

## Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Health checks passing
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] Security measures in place
- [ ] Performance optimization done
- [ ] Documentation updated

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review application logs
3. Test health check endpoint
4. Verify environment variables
5. Check database connectivity

---

**Deployment Complete!** 🚀

Your EventX Studio backend is now live and ready to serve your React frontend and mobile applications!
