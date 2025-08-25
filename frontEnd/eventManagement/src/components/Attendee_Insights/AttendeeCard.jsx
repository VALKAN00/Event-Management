export default function AttendeeCard({
  icon,
  title,
  value,
  trend,
  trendValue,
  numberValue,
  bgColor = "bg-white",
}) {
  const getTrendColor = (trend) => {
    return trend === "increase" ? "text-green-500" : "text-red-500";
  };

  const getTrendIcon = (trend) => {
    return trend === "increase" ? "↗" : "↘";
  };

  return (
    <div
      className={`${bgColor} flex justify-between items-center p-4 rounded-2xl shadow-sm border border-gray-100`}
      style={{
        width: "300px",
        height: "120px",
      }}
    >
      {/* Left Section */}
      <div className="flex flex-col justify-between h-full">
        <div className="flex items-center gap-2 mb-2">
          {icon && <img src={icon} alt={title} className="w-5 h-5" />}
          <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
            {title}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-2xl font-bold text-gray-900 mb-1">{value}</span>
          {trend && trendValue && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)} {trendValue}
              </span>
              <span className="text-xs text-gray-500">
                {trend === "increase" ? "increase" : "decrease"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Number Value */}
      {numberValue && (
        <div className="flex flex-col gap-6 items-center justify-center">
          <img src="assets/EventDetails/Window Color.svg" alt="icon" />
          <span className="text-xl font-bold text-gray-900">
            {numberValue}
          </span>
        </div>
      )}
    </div>
  );
}
