import React, { useState, useEffect } from 'react';

const AttendeeAgeChart = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Hook to detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Data matching the Figma exactly
  const data = [
    { date: '01', values: [19, 28, 51, 47] },
    { date: '02', values: [20, 31, 38, 0] },
    { date: '03', values: [23, 25, 39, 0] },
    { date: '04', values: [21, 28, 46, 0] },
    { date: '05', values: [24, 29, 43, 48] },
    { date: '06', values: [22, 29, 43, 49] },
    { date: '07', values: [18, 0, 41, 0] },
    { date: '08', values: [20, 31, 41, 0] },
    { date: '09', values: [21, 33, 37, 0] },
    { date: '10', values: [22, 32, 0, 52] },
    { date: '11', values: [18, 0, 36, 0] },
    { date: '12', values: [19, 29, 0, 0] },
    { date: '13', values: [20, 24, 38, 45] },
    { date: '14', values: [22, 33, 39, 46] },
    { date: '15', values: [21, 0, 41, 0] },
  ];

  // Show fewer data points on mobile to fit without slider
  const displayData = isMobile ? data.slice(0, 8) : data;

  const ageGroups = [
    { name: '18 - 24', color: '#3b82f6' },
    { name: '25 - 34', color: '#f59e0b' },
    { name: '35 - 44', color: '#ef4444' },
    { name: '45 +', color: '#10b981' },
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-3">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">ATTENDEE AGE</h3>
        
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-3">
          {ageGroups.map((group, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: group.color }}
              ></div>
              <span className="text-xs sm:text-sm text-gray-700">{group.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Container - takes remaining space */}
      <div className="flex-1 relative px-1 sm:px-2 pb-6" style={{ minHeight: '200px' }}>
        {/* Chart columns */}
        <div className="h-full flex justify-between items-end relative w-full">
          {displayData.map((item, index) => {
            const positions = item.values.map((value, i) => {
              if (value === 0) return null;
              return {
                value,
                color: ageGroups[i].color,
                // Mobile-responsive scaling - more compact
                bottom: 25 + (value * (isMobile ? 1.5 : 2.8)) + (i * (isMobile ? 4 : 8))
              };
            }).filter(pos => pos !== null);

            // Sort by bottom position to stack properly
            positions.sort((a, b) => a.bottom - b.bottom);

            return (
              <div key={index} className="relative flex flex-col items-center flex-1" style={{ maxWidth: isMobile ? '25px' : '50px', height: '100%' }}>
                {/* Vertical connecting lines */}
                {positions.length > 1 && (
                  <div className="absolute bg-gray-300" 
                       style={{ 
                         width: isMobile ? '1px' : '4px',
                         left: '50%', 
                         transform: 'translateX(-50%)',
                         bottom: `${positions[0].bottom}px`,
                         height: `${positions[positions.length - 1].bottom - positions[0].bottom}px`,
                         zIndex: 1
                       }} 
                  />
                )}

                {/* Circles for each data point */}
                {positions.map((pos, posIndex) => (
                  <div
                    key={posIndex}
                    className="absolute rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                    style={{
                      backgroundColor: pos.color,
                      bottom: `${pos.bottom}px`,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      zIndex: 10,
                      width: isMobile ? '20px' : '28px',
                      height: isMobile ? '20px' : '28px'
                    }}
                  >
                    <span className="text-white font-bold" style={{ fontSize: isMobile ? '8px' : '12px' }}>{pos.value}</span>
                  </div>
                ))}

                {/* Vertical line from bottom circle to baseline */}
                {positions.length > 0 && (
                  <div className="absolute bg-gray-300" 
                       style={{ 
                         width: isMobile ? '1px' : '4px',
                         left: '50%', 
                         transform: 'translateX(-50%)',
                         bottom: '18px',
                         height: `${positions[0].bottom - 18}px`,
                         zIndex: 1
                       }} 
                  />
                )}
                
                {/* Date label */}
                <span className="absolute bottom-0 text-xs text-gray-500" style={{ fontSize: isMobile ? '10px' : '12px' }}>{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AttendeeAgeChart;
