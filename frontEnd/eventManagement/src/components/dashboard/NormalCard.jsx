export default function NormalCard({ title, counter, text, icon, color, loading, growth }) {
  return (
    <div
      className="NormalCard bg-white flex justify-start items-center gap-7 p-5 relative"
      style={{
        width: "256px",
        height: "107px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {loading ? (
        // Loading skeleton
        <>
          <div 
            className="animate-pulse bg-gray-200 rounded"
            style={{ width: "55px", height: "55px" }}
          />
          <div className="flex-1">
            <div className="animate-pulse bg-gray-200 h-4 w-20 mb-2 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
          </div>
        </>
      ) : (
        <>
          <img src={icon} alt={title} style={{ width: "55px", height: "55px" }} />
          <div className="flex-1">
            <h2
              className="text-xl"
              style={{ color: "rgba(0, 0, 0, 0.69)", fontSize: "14px" }}
            >
              {title}
            </h2>
            <div className="flex items-baseline gap-1">
              <p style={{ color: color, fontSize: "24px", fontWeight: "bold" }}>
                {counter?.toLocaleString() || 0}
              </p>
              {text && (
                <p style={{ color: color, fontSize: "24px", fontWeight: "bold" }}>
                  {text}
                </p>
              )}
            </div>
            {growth && (
              <div className="flex items-center mt-1">
                <span 
                  className="text-xs font-medium"
                  style={{ 
                    color: growth > 0 ? "#197920" : growth < 0 ? "#DC2626" : "#6B7280" 
                  }}
                >
                  {growth > 0 ? "+" : ""}{growth.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
