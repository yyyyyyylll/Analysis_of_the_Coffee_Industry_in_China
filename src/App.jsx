import React, { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';
import ChartSection from './components/ChartSection';
import ProportionChartSection from './components/ProportionChartSection';

function App() {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);
  const touchStart = useRef(0);

  useEffect(() => {
    const handleWheel = (e) => {
      // If NOT expanded and scrolling DOWN -> Expand
      if (!expanded && e.deltaY > 50) {
        setExpanded(true);
      }
      
      // If expanded and scrolling UP (and at top) -> Collapse
      if (expanded && contentRef.current && contentRef.current.scrollTop === 0 && e.deltaY < -50) {
        setExpanded(false);
      }
    };

    const handleTouchStart = (e) => {
      touchStart.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStart.current - touchY;

      // Swipe UP (deltaY > 0) -> Expand
      if (!expanded && deltaY > 50) {
        setExpanded(true);
      }

      // Swipe DOWN (deltaY < 0) -> Collapse
      if (expanded && contentRef.current && contentRef.current.scrollTop === 0 && deltaY < -50) {
        setExpanded(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [expanded]);

  const MainContent = (
    <div className="main-scroll-container">
      <div className="content-container">
        <div className="content-image-wrapper">
          {/* Using book.png as requested */}
          <img src="/src/assets/book.png" alt="Coffee History Book" className="content-image" />
        </div>
        <div className="content-text-wrapper">
          <p className="content-body-text">
            很长一段时间里，咖啡在中国并不属于日常消费的中心位置，它更多集中在少数城市和人群中，带有明显的场合属性。但近几年，这种距离正在被不断拉近，咖啡变得更容易被买到、更能够买得起，更频繁地进入日常生活。从消费频率到市场规模，从门店密度到城市覆盖，咖啡在中国的扩张呈现出一条持续上行的曲线。这条曲线背后，逐渐显现出一个体量庞大、结构复杂、正在快速演化的中国咖啡行业。
          </p>
        </div>
      </div>

      <div className="content-container">
        <div className="content-text-wrapper" style={{ flex: 2 }}>
          <p className="content-body-text">
            近五年，我国社会消费品零售总额增速多次出现波动，甚至出现了负增长，2024 年的增长率也仅恢复至3.5%。虽然整体消费扩张放缓，咖啡和新式茶饮市场却维持着持续增长。数据显示，新式茶饮市场规模在近五年间由 1840 亿元增长至 超3500亿元，但其在 2021 年经历短期高增长后，近几年增速回落至 5%—15% 区间。相比而言，咖啡行业的增长更快，也更稳定。中国咖啡行业整体市场规模在 2020—2024 年间由 3000 亿元增长至 7893 亿元，预计 2025 年将突破万亿元。在增速上，咖啡行业近几年持续保持超过 26%的增速，这一表现在当前消费环境中尤为亮眼。
          </p>
        </div>
        <div className="content-image-wrapper" style={{ minHeight: '500px', flex: 3 }}>
          <ChartSection />
        </div>
      </div>

      <div className="content-container">
        <div className="content-image-wrapper" style={{ minHeight: '500px', flex: 3 }}>
          <ProportionChartSection />
        </div>
        <div className="content-text-wrapper" style={{ flex: 2 }}>
          <p className="content-body-text">
            进一步拆分咖啡行业内部结构可以发现，咖啡行业的增长动力主要集中在现制咖啡领域。放眼整个咖啡行业，现制咖啡所占比重近年来持续上升。
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container-fixed">
      <div className="hero-section-fixed">
        <Hero />
      </div>
      
      <section 
        className={`main-content-fixed ${expanded ? 'expanded' : ''}`}
        ref={contentRef}
      >
        <div 
          className="pull-text-indicator" 
          style={{ 
            opacity: expanded ? 0 : 1,
            transition: 'opacity 0.3s',
            cursor: 'pointer' 
          }}
          onClick={() => setExpanded(true)}
        >
            <span className="arrow-icon">↑</span> 
             Pull to Explore 
            <span className="arrow-icon">↑</span>
        </div>
        <div className="slider-content">
           {MainContent}
        </div>
      </section>
    </div>
  );
}

export default App;
