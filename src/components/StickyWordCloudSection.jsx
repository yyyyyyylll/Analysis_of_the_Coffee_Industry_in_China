import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';

const StickyWordCloudSection = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const textRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveIndex(index);
          }
        });
      },
      {
        root: null,
        rootMargin: '-45% 0px -45% 0px', // Trigger when element is near center of viewport
        threshold: 0
      }
    );

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      if (textRefs.current) {
        textRefs.current.forEach((ref) => {
           if(ref) observer.unobserve(ref);
        });
      }
    };
  }, [items]);

  // Styles
  const containerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align top for sticky
    width: '100%',
    position: 'relative',
    marginBottom: '40px'
  };

  const textColStyle = {
    width: '48%',
    display: 'flex',
    flexDirection: 'column',
    // No large gap here, handled by minHeight of items
  };
  
  const textBlockStyle = {
    color: '#542410',
    fontFamily: '"SimSun", "Songti SC", serif',
    fontSize: '21px',
    lineHeight: '42px',
    textAlign: 'justify',
    minHeight: '80vh', // Ensure significant scroll distance for each item
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0'
  };

  const stickyContainerStyle = {
    width: '48%',
    height: '400px', // Fixed height for chart area
    position: 'sticky',
    top: 'calc(50vh - 200px)', // Center vertically in viewport
    backgroundColor: 'transparent',
    borderRadius: '12px',
    padding: '10px',
    overflow: 'hidden' // Hide overflowing transitions
  };

  return (
    <div style={containerStyle}>
      <div style={textColStyle}>
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => (textRefs.current[index] = el)}
            data-index={index}
            style={textBlockStyle}
          >
            {item.text}
          </div>
        ))}
      </div>
      
      <div style={stickyContainerStyle}>
        {items.map((item, index) => {
           const isActive = index === activeIndex;
           
           // Dissolve + Rise Logic
           // Entering: Opacity 0->1, TranslateY 30px->0
           // Exiting: Opacity 1->0, TranslateY 0->-30px
           
           let transform = 'translateY(30px)';
           let opacity = 0;
           
           if (isActive) {
             transform = 'translateY(0)';
             opacity = 1;
           } else if (index < activeIndex) {
             transform = 'translateY(-30px)'; // Moved up (Exited)
             opacity = 0;
           } else {
             transform = 'translateY(30px)'; // Waiting below
             opacity = 0;
           }

           return (
             <div
               key={index}
               style={{
                 position: 'absolute',
                 top: 10, left: 10, right: 10, bottom: 10,
                 opacity: opacity,
                 transform: transform,
                 transition: 'opacity 0.8s ease, transform 0.8s ease',
                 pointerEvents: isActive ? 'auto' : 'none',
                 zIndex: isActive ? 10 : 0,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center'
               }}
             >
               <ReactECharts option={item.chartOption} style={{ width: '100%', height: '100%' }} />
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default StickyWordCloudSection;
