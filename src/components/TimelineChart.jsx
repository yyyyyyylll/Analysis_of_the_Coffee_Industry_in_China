import React, { useEffect, useState } from 'react';

const TimelineChart = () => {
  const [mounted, setMounted] = useState(false);
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setMounted(true), 100);
  }, []);

  const rawData = [
    { brand: '星巴克', year: '2022', count: 6, label: '2022' },
    { brand: '瑞幸', year: '2022', count: 17, label: '2022' },
    { brand: '星巴克', year: '2023', count: 14, label: '2023' },
    { brand: '瑞幸', year: '2023', count: 46, label: '2023' },
    { brand: '星巴克', year: '2024', count: 18, label: '2024' },
    { brand: '瑞幸', year: '2024', count: 37, label: '2024' },
    { brand: '星巴克', year: '2025（M1-11）', count: 18, label: '2025', sublabel: 'M1-11' },
    { brand: '瑞幸', year: '2025（M1-11）', count: 47, label: '2025', sublabel: 'M1-11' },
  ];

  // Group data by year
  const groupedData = rawData.reduce((acc, curr) => {
    const yearKey = curr.year.split('（')[0];
    if (!acc[yearKey]) {
      acc[yearKey] = [];
    }
    acc[yearKey].push(curr);
    return acc;
  }, {});

  const years = Object.keys(groupedData).sort();
  const MAX_COUNT = Math.max(...rawData.map(d => d.count)); // 47
  const MAX_BAR_WIDTH_PERCENT = 80; // Use more space within the half-container

  // Styles
  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: 'transparent', // Transparent background
    padding: '20px 20px', // Increased padding slightly
    fontFamily: '"SimSun", "Songti SC", serif', // Consistent with page font
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative'
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#542410', // Coffee brown
    marginBottom: '25px', // Increased margin slightly
    textAlign: 'center',
    // Removed textShadow
  };

  const legendStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '25px', // Increased margin slightly
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#542410'
  };

  const centerLineStyle = {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '0', // Start from top of relative container
    bottom: '0',
    width: '2px',
    backgroundColor: '#8B4513', // SaddleBrown
    opacity: 0.3,
    zIndex: 0,
    borderRadius: '2px'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          .bar-item {
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            cursor: pointer;
            /* Removed drop-shadow filter */
          }
          .bar-item:hover {
            transform: scale(1.02);
            /* Removed hover drop-shadow */
            z-index: 20;
          }
          .year-badge {
            transition: transform 0.3s ease;
          }
          .year-badge:hover {
            transform: translate(-50%, -50%) scale(1.05);
          }
        `}
      </style>

      <h1 style={titleStyle}>
        星巴克、瑞幸的联名次数(2022-2025M1-11)
      </h1>

      <div style={legendStyle}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '32px' }}>
          <div style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #006241 0%, #4ade80 100%)', // Starbucks Gradient
            marginRight: '8px',
            // Removed boxShadow
          }}></div>
          <span>星巴克 (Starbucks)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            width: '12px', height: '12px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, #0022AB 0%, #60a5fa 100%)', // Luckin Gradient
            marginRight: '8px',
            // Removed boxShadow
          }}></div>
          <span>瑞幸 (Luckin)</span>
        </div>
      </div>

      <div style={{ position: 'relative', padding: '0' }}>
        {/* Center Line */}
        <div style={centerLineStyle}></div>

        {years.map((year, index) => {
          const yearData = groupedData[year];
          const firstItem = yearData[0];
          const yearLabel = firstItem.label;
          const yearSublabel = firstItem.sublabel;

          // 2022(0)->Left, 2023(1)->Right, ...
          const stretchDirection = index % 2 === 0 ? 'left' : 'right';
          const isLeft = stretchDirection === 'left';

          return (
            <div key={year} style={{
              display: 'flex',
              width: '100%',
              position: 'relative',
              zIndex: 10,
              alignItems: 'center',
              marginBottom: '16px', // Increased spacing slightly
              flexDirection: 'row'
            }}>
              {/* Left Column */}
              <div style={{
                width: '50%',
                paddingRight: '60px', // Space for center axis
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-end' : 'flex-start', 
                boxSizing: 'border-box'
              }}>
                {isLeft && yearData.map((d, i) => (
                   <BarItem 
                     key={i} 
                     data={d} 
                     maxCount={MAX_COUNT} 
                     maxBarWidth={MAX_BAR_WIDTH_PERCENT} 
                     align="right" 
                     mounted={mounted}
                     onHover={setHoveredData}
                   />
                ))}
              </div>

              {/* Right Column */}
              <div style={{
                width: '50%',
                paddingLeft: '60px', // Space for center axis
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-end' : 'flex-start',
                boxSizing: 'border-box'
              }}>
                {!isLeft && yearData.map((d, i) => (
                   <BarItem 
                     key={i} 
                     data={d} 
                     maxCount={MAX_COUNT} 
                     maxBarWidth={MAX_BAR_WIDTH_PERCENT} 
                     align="left" 
                     mounted={mounted}
                     onHover={setHoveredData}
                   />
                ))}
              </div>

              {/* Year Badge (Center) */}
              <div 
                className="year-badge"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                  cursor: 'default'
                }}
              >
                <div style={{
                  background: '#fff',
                  border: '1px solid #8B4513', // Thinner border
                  color: '#542410',
                  padding: '4px 12px', // Slightly smaller padding
                  borderRadius: '16px', // Softer radius
                  fontSize: '18px', // Increased font size
                  fontWeight: 'bold',
                  textAlign: 'center',
                  // Removed boxShadow
                  minWidth: '50px'
                }}>
                  {yearLabel}
                  {yearSublabel && (
                    <div style={{ fontSize: '10px', fontWeight: 'normal', marginTop: '1px', opacity: 0.8 }}>
                      {yearSublabel}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: 'center', fontSize: '16px', color: '#8B4513', marginTop: '5px', opacity: 0.7 }}>
        数据来源: 星巴克&瑞幸微信公众号，2025年数据截至M11。
      </div>
    </div>
  );
};

const BarItem = ({ data, maxCount, maxBarWidth, align, mounted, onHover }) => {
  const widthPercent = (data.count / maxCount) * maxBarWidth;
  const isStarbucks = data.brand === '星巴克';
  
  // Softer Gradients
  // Starbucks: Green
  // Luckin: Blue
  
  const finalGradient = align === 'right' 
    ? (isStarbucks ? 'linear-gradient(90deg, #86efac 0%, #16a34a 100%)' : 'linear-gradient(90deg, #93c5fd 0%, #2563eb 100%)')
    : (isStarbucks ? 'linear-gradient(90deg, #16a34a 0%, #86efac 100%)' : 'linear-gradient(90deg, #2563eb 0%, #93c5fd 100%)');

  const textColor = isStarbucks ? '#14532d' : '#1e3a8a'; // Darker text for better contrast

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        margin: '2px 0', // Increased margin slightly
        flexDirection: align === 'right' ? 'row-reverse' : 'row',
        justifyContent: 'flex-start'
      }}
      onMouseEnter={() => onHover(data)}
      onMouseLeave={() => onHover(null)}
    >
      <div 
        className="bar-item"
        title={`${data.brand}: ${data.count} 次`}
        style={{
          height: '24px', // Increased height from 20px to 24px
          width: mounted ? `${widthPercent}%` : '0%',
          background: finalGradient,
          borderRadius: align === 'right' ? '10px 4px 4px 10px' : '4px 10px 10px 4px', // More rounded
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          minWidth: '10px',
          opacity: 0.9 // Slightly softer look
        }}
      >
      </div>
      
      {/* Count Number */}
      <span style={{
          fontSize: '13px', // Slightly smaller
          fontWeight: 'normal', // Not bold, less sharp
          color: textColor,
          padding: '0 8px',
          opacity: mounted ? 0.9 : 0, // Softer opacity
          transition: 'opacity 0.5s ease 0.2s',
          fontFamily: '"SimSun", "Songti SC", serif' // Use serif to match page style, softer than sans
      }}>
          {data.count}
      </span>
    </div>
  );
};

export default TimelineChart;
