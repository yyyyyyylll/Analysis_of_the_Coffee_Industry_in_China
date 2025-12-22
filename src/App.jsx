import React, { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';

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
    <div className="content-placeholder">
      <h2>Our Story</h2>
      <p>
        Welcome to the world of premium coffee. We source the finest beans from around the globe to bring you the perfect cup.
      </p>
      <p>
        Experience the aroma, the taste, and the passion in every sip.
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <div style={{ height: '800px' }}>
         {/* Spacer to demonstrate scrolling within the second page */}
         <p>More content down here...</p>
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
