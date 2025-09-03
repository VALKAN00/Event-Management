export default function NormalCard({ title, counter, text, icon, color, loading, growth }) {
  return (
    <div
      className="NormalCard bg-white flex justify-start items-center gap-3 sm:gap-7 p-3 sm:p-5 relative w-full min-h-[80px] sm:min-h-[107px]"
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {loading ? (
        // Loading skeleton
        <>
          <div 
            className="animate-pulse bg-gray-200 rounded flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14"
          />
          <div className="flex-1">
            <div className="animate-pulse bg-gray-200 h-3 sm:h-4 w-16 sm:w-20 mb-1 sm:mb-2 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 sm:h-6 w-12 sm:w-16 rounded"></div>
          </div>
        </>
      ) : (
        <>
          <img src={icon} alt={title} className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h2
              className="text-xs sm:text-sm"
              style={{ color: "rgba(0, 0, 0, 0.69)" }}
            >
              {title}
            </h2>
            <div className="flex items-baseline gap-1">
              <p className="text-lg sm:text-2xl font-bold truncate" style={{ color: color }}>
                {counter?.toLocaleString() || 0}
              </p>
              {text && (
                <p className="text-lg sm:text-2xl font-bold" style={{ color: color }}>
                  {text}
                </p>
              )}
            </div>
            {growth && (
              <div className="flex items-center mt-0.5 sm:mt-1">
                <span 
                  className="text-xs font-medium"
                  style={{ 
                    color: growth > 0 ? "#197920" : growth < 0 ? "#DC2626" : "#6B7280" 
                  }}
                >
                  {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1 hidden sm:inline">vs last period</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
