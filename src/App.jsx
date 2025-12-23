import React, { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';
import ChartSection from './components/ChartSection';
import ProportionChartSection from './components/ProportionChartSection';
import ComparisonChartSection from './components/ComparisonChartSection';
import StoreCountChartSection from './components/StoreCountChartSection';
import ProvinceBarChartSection from './components/ProvinceBarChartSection';
import CityPieChartSection from './components/CityPieChartSection';
import PageTwo from './components/PageTwo';
import PageThree from './components/PageThree';
import change1 from './assets/change1.png';
import pageOneTitle from './assets/part1 素材/1.png';
import pageOneImage2 from './assets/part1 素材/2.png';
import pageOneDecoration from './assets/part1 素材/3(左下角下标).png';
import pageOneDecoration2 from './assets/part1 素材/4.png';
import pageOneDecoration3 from './assets/part1 素材/5.png';
import pageOneDecoration6 from './assets/part1 素材/6.png';

// Data for Scrollytelling Sections
const SCROLLY_SECTIONS = [
  {
    id: 'market-growth',
    text: "近五年，我国社会消费品零售总额增速多次出现波动，甚至出现了负增长。虽然整体消费扩张放缓，咖啡和新式茶饮市场却维持着持续增长。数据显示，新式茶饮市场规模在2024年增长至超3500亿元，但其在2021年经历短期高增长后，近几年增速回落至5%—15%区间。相比而言，咖啡行业的增长更快也更稳定。中国咖啡行业整体市场规模在2024年增长至7893亿元，预计2025年将突破万亿元，且在增速上持续保持超过26%的增速，这一表现在当前消费环境中尤为亮眼。",
    chart: <ChartSection />
  },
  {
    id: 'proportion',
    text: "进一步拆分咖啡行业内部结构可以发现，咖啡行业的增长动力主要集中在现制咖啡领域。放眼整个咖啡行业，现制咖啡所占比重近年来持续上升。",
    chart: <ProportionChartSection />
  },
  {
    id: 'comparison',
    text: "且在 2021—2023 年间，现制咖啡市场规模连续保持超过 30% 的同比增长，增速显著。可见，现制咖啡正在从咖啡市场中的补充品类，逐步转变为推动咖啡行业增长的核心板块，其在整体咖啡消费结构中的地位不断强化。",
    chart: <ComparisonChartSection />
  },
  {
    id: 'store-count',
    text: "当现制咖啡逐渐成为行业增长的核心动力，这一变化也最直观地体现在线下门店的供给端。自2020年以来，现制咖啡的门店数量持续增长，2020年至2025年的整体数量规模扩大约2.3倍，门店扩张速度保持在10%以上。",
    chart: <StoreCountChartSection />
  },
  {
    id: 'province',
    text: "从省域分布来看，2025 年中国咖啡门店呈现出明显的区域集聚特征，整体集中于东部和南部沿海地区。经济体量大、人口密集、城市化水平较高的省份成为咖啡门店分布的高密度区域，其中广东省断层领先，咖啡门店数量达约42000家。而中西部和部分东北省份门店数量相对较少。",
    chart: <ProvinceBarChartSection />
  },
  {
    id: 'city',
    text: "从城市分布来看，咖啡门店的扩张已明显突破一线城市的传统边界。2025年，三四线及以下城市的咖啡门店占比已接近整体的一半，成为门店数量增长的主要承载空间，咖啡行业正在走向更广泛的城市体系。",
    chart: <CityPieChartSection />
  }
];

function App() {
  const [expanded, setExpanded] = useState(false);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [maxRadius, setMaxRadius] = useState(0);
  const [clipCenter, setClipCenter] = useState({ x: 0, y: 0 });
  
  const contentRef = useRef(null);
  const coverSectionRef = useRef(null);
  const canvasRef = useRef(null);
  const lastTouchY = useRef(0);
  const cupRef = useRef(null);
  const pageThreeRef = useRef(null);
  const floatingCupRef = useRef(null);
  
  // Refs for animation loop
  const targetRadius = useRef(0);
  const currentRadius = useRef(0);
  const clipCenterRef = useRef({ x: 0, y: 0 });
  const requestRef = useRef();

  useEffect(() => {
    const updateMaxRadius = () => {
      setMaxRadius(Math.hypot(window.innerWidth, window.innerHeight));
    };
    updateMaxRadius();
    window.addEventListener('resize', updateMaxRadius);
    return () => window.removeEventListener('resize', updateMaxRadius);
  }, []);

  // Animation Loop for Smooth Damping
  useEffect(() => {
    const animate = () => {
      // Linear Interpolation (Lerp): Move current towards target by 10% each frame
      currentRadius.current += (targetRadius.current - currentRadius.current) * 0.1;
      
      // Stop updating if close enough to save resources
      if (Math.abs(targetRadius.current - currentRadius.current) < 0.5) {
         currentRadius.current = targetRadius.current;
      }
      
      const r = currentRadius.current;
      const { x, y } = clipCenterRef.current;
      
      // Direct DOM manipulation
      if (pageThreeRef.current) {
          pageThreeRef.current.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
          pageThreeRef.current.style.visibility = r > 0 ? 'visible' : 'hidden';
          // Enable interaction only when fully expanded (matching original behavior)
          const isFullyExpanded = r >= maxRadius - 5; // buffer for float precision
          pageThreeRef.current.style.pointerEvents = isFullyExpanded ? 'auto' : 'none';
          pageThreeRef.current.style.overflowY = isFullyExpanded ? 'auto' : 'hidden';
      }

      if (floatingCupRef.current) {
          if (r > 0) {
              floatingCupRef.current.style.display = 'flex';
              floatingCupRef.current.style.top = `${y - r}px`;
              floatingCupRef.current.style.left = `${x}px`;
              floatingCupRef.current.style.opacity = Math.max(0, 1 - (r / (maxRadius * 0.8)));
          } else {
              floatingCupRef.current.style.display = 'none';
          }
      }

      // Update state only when transitioning state changes to minimize re-renders
      if (r > 0 && !isTransitionActive) {
          setIsTransitionActive(true);
      } else if (r <= 0 && isTransitionActive) {
          setIsTransitionActive(false);
      }

      if (contentRef.current) {
          contentRef.current.style.overflowY = r > 0 ? 'hidden' : 'auto';
      }

      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [maxRadius, isTransitionActive]); // Depend on maxRadius and isTransitionActive (for state toggle)

  useEffect(() => {
    const handleWheel = (e) => {
      // 1. Hero -> PageTwo
      if (!expanded && e.deltaY > 50) {
        setExpanded(true);
        return;
      }
      
      // 2. PageTwo -> Hero
      if (expanded && targetRadius.current <= 0 && contentRef.current && contentRef.current.scrollTop === 0 && e.deltaY < -50) {
        setExpanded(false);
        return;
      }

      // 3. PageTwo -> PageThree (Continuous Transition)
      if (expanded) {
        // Check Cup Position
         let isCupReady = false;
         if (cupRef.current) {
             const rect = cupRef.current.getBoundingClientRect();
             // Trigger when cup center is near or above 65% of viewport height (slightly below center)
             const cupCenterY = rect.top + rect.height / 2;
             // Trigger when cup is in the upper 75% of the screen (easier to reach)
             // Adjusted to ensure it triggers even with reduced bottom margin
             const triggerThreshold = window.innerHeight * 0.75;
             isCupReady = cupCenterY <= triggerThreshold;
         } else if (contentRef.current) {
             // Fallback
             const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
             isCupReady = scrollTop + clientHeight >= scrollHeight - 50;
        }

        // Initialize clip center if starting transition
        if (targetRadius.current <= 0 && isCupReady && e.deltaY > 0) {
             if (cupRef.current) {
               const rect = cupRef.current.getBoundingClientRect();
               const x = rect.left + rect.width / 2;
               const y = rect.top + rect.height / 2;
               setClipCenter({ x, y });
               clipCenterRef.current = { x, y };
             } else {
               const cx = window.innerWidth / 2;
               const cy = window.innerHeight / 2;
               setClipCenter({ x: cx, y: cy });
               clipCenterRef.current = { x: cx, y: cy };
             }
        }

        const isTransitioning = targetRadius.current > 0 && targetRadius.current < maxRadius;
        const isFullyRevealed = targetRadius.current >= maxRadius;

        // Case A: Transitioning (Circle growing or shrinking)
        if (isTransitioning) {
          e.preventDefault();
          const sensitivity = 2.5;
          targetRadius.current = Math.max(0, Math.min(maxRadius, targetRadius.current + e.deltaY * sensitivity));
          return;
        }

        // Case B: Fully Revealed (Interacting with Page Three or shrinking back)
        if (isFullyRevealed) {
          // If PageThree is at top and scrolling up -> Shrink circle
          if (pageThreeRef.current && pageThreeRef.current.scrollTop <= 0 && e.deltaY < 0) {
             e.preventDefault();
             const sensitivity = 2.5;
             targetRadius.current = Math.max(0, targetRadius.current + e.deltaY * sensitivity);
          }
          // Else let PageThree scroll naturally
          return;
        }

        // Case C: Start growing
        if (targetRadius.current <= 0 && isCupReady && e.deltaY > 0) {
           e.preventDefault();
           const sensitivity = 2.5;
           targetRadius.current = Math.max(0, Math.min(maxRadius, e.deltaY * sensitivity));
        }
      }
    };

    const handleTouchStart = (e) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY.current - currentY; // Drag up = positive delta
      lastTouchY.current = currentY;
      
      if (!expanded && deltaY > 50) {
        setExpanded(true);
        return; // Consumed
      }
      
      if (expanded) {
         // Check Cup Position
         let isCupReady = false;
         if (cupRef.current) {
             const rect = cupRef.current.getBoundingClientRect();
             const cupCenterY = rect.top + rect.height / 2;
             const triggerThreshold = window.innerHeight * 0.75;
             isCupReady = cupCenterY <= triggerThreshold;
         } else if (contentRef.current) {
             const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
             isCupReady = scrollTop + clientHeight >= scrollHeight - 50;
         }

         // Initialize center if starting
         if (targetRadius.current <= 0 && isCupReady && deltaY > 0) {
            if (cupRef.current) {
                const rect = cupRef.current.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top + rect.height / 2;
                setClipCenter({ x, y });
                clipCenterRef.current = { x, y };
            } else {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                setClipCenter({ x: cx, y: cy });
                clipCenterRef.current = { x: cx, y: cy };
            }
         }

         const isTransitioning = targetRadius.current > 0 && targetRadius.current < maxRadius;
         const isFullyRevealed = targetRadius.current >= maxRadius;

         if (isTransitioning) {
             // Prevent default done via passive: false in listener options
             if (e.cancelable) e.preventDefault();
             const sensitivity = 2.5;
             targetRadius.current = Math.max(0, Math.min(maxRadius, targetRadius.current + deltaY * sensitivity));
             return;
         }

         if (isFullyRevealed) {
             if (pageThreeRef.current && pageThreeRef.current.scrollTop <= 0 && deltaY < 0) {
                 if (e.cancelable) e.preventDefault();
                 const sensitivity = 2.5;
                 targetRadius.current = Math.max(0, targetRadius.current + deltaY * sensitivity);
             }
             return;
         }

         if (targetRadius.current <= 0 && isCupReady && deltaY > 0) {
             if (e.cancelable) e.preventDefault();
             const sensitivity = 2.5;
             targetRadius.current = Math.max(0, Math.min(maxRadius, deltaY * sensitivity));
         }
         
         // Standard PageTwo -> Hero logic
         if (targetRadius.current <= 0 && contentRef.current && contentRef.current.scrollTop === 0 && deltaY < -50) {
            setExpanded(false);
         }
      }
    };
    
    // Auto-expand on click (optional fallback)
    const triggerTransition = () => {
       // ... existing logic but using animate frame or interval? 
       // For now let's just jump or animate manually.
       // User asked for continuous state, so maybe click just starts it?
       // Let's implement a smooth auto-expand for click
       let start = null;
       const duration = 800;
       const initialRadius = targetRadius.current;
       const target = maxRadius;
       
       if (cupRef.current) {
            const rect = cupRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            setClipCenter({ x, y });
            clipCenterRef.current = { x, y };
       }

       const animate = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          // Ease in out
          const ease = progress < .5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          targetRadius.current = initialRadius + (target - initialRadius) * ease;
          
          if (progress < 1) {
             requestAnimationFrame(animate);
          }
       };
       requestAnimationFrame(animate);
    };
    // Expose triggerTransition if needed, but primarily logic is in handlers

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [expanded, maxRadius]);



  // Background Image Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = coverSectionRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = '/src/assets/bg1.png';

    const draw = () => {
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      
      canvas.width = containerWidth;
      canvas.height = containerHeight;

      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      
      // Scale image to fit width
      const scale = containerWidth / imgW;
      const scaledImgH = imgH * scale;
      
      // Draw Main Image
      ctx.drawImage(img, 0, 0, containerWidth, scaledImgH);
      
      // Prepare Slice (Bottom 10%)
      const sliceRatio = 0.1; 
      const sliceH_source = imgH * sliceRatio;
      const sliceH_draw = scaledImgH * sliceRatio;
      const sliceY_source = imgH - sliceH_source;
      
      // Overlap: 10% of the slice height
      const overlap = sliceH_draw * 0.10;
      
      // Start drawing slices from the bottom of the main image
      // First slice starts at: scaledImgH - overlap
      // We start loop from there.
      let currentY = scaledImgH - overlap;
      
      // Limit loop to avoid browser hang if overlap is 0 or negative (safety)
      if (sliceH_draw <= overlap) return; 

      while (currentY < containerHeight) {
        ctx.drawImage(
          img,
          0, sliceY_source, imgW, sliceH_source, // Source: bottom 10%
          0, currentY, containerWidth, sliceH_draw // Destination
        );
        
        // Next Y
        currentY += (sliceH_draw - overlap);
      }
    };

    if (img.complete) {
      draw();
    } else {
      img.onload = draw;
    }

    const observer = new ResizeObserver(draw);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  const MainContent = (
    <div className="main-scroll-container">
      {/* Section 1: Book Image (Intro) - Normal Scroll */}
      <div className="intro-section-wrapper" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="page-one-title" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem', marginTop: '2rem' }}>
        <img src={pageOneTitle} alt="Page One Title" style={{ width: '100%', height: 'auto' }} />
      </div>

      <div className="page-one-image-2" style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <img src={pageOneImage2} alt="Page One Content" style={{ width: '100%', height: 'auto' }} />
        <div style={{
            position: 'absolute',
            top: '45%',
            right: '7%',
            transform: 'translateY(-50%)',
            width: '50%',
            textAlign: 'justify',
            color: '#542410', 
            fontSize: '21px', 
            lineHeight: '2',
            fontWeight: 'bold',
            fontFamily: "'SimSun', 'Songti SC', serif"
        }}>
            <p style={{ margin: 0 }}>
              很长一段时间里，咖啡在中国更多集中于少数城市和人群，带有明显的场合属性。近几年，随着价格下降和供给扩张，咖啡变得更容易买到，也更频繁地进入日常生活。从消费频率、市场规模到门店密度与城市覆盖，咖啡在中国呈现出持续扩张的趋势，一个体量不断放大的行业正在形成。
            </p>
        </div>
      </div>

      {/* <div className="content-container intro-section" style={{ minHeight: 'auto' }}>
          <div className="content-image-wrapper">
            <img src="/src/assets/book.png" alt="Coffee History Book" className="content-image" />
          </div>
          <div className="content-text-wrapper">
            <p className="content-body-text">
              很长一段时间里，咖啡在中国并不属于日常消费的中心位置，它更多集中在少数城市和人群中，带有明显的场合属性。但近几年，这种距离正在被不断拉近，咖啡变得更容易被买到、更能够买得起，更频繁地进入日常生活。从消费频率到市场规模，从门店密度到城市覆盖，咖啡在中国的扩张呈现出一条持续上行的曲线。这条曲线背后，逐渐显现出一个体量庞大、结构复杂、正在快速演化的中国咖啡行业。
            </p>
          </div>
        </div> */ }
      </div>

      {/* Scrollytelling Container - Linear Layout */}
      <div className="scrolly-container-linear" style={{ display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto', width: '90%' }}>
        {SCROLLY_SECTIONS.map((section, index) => (
            <React.Fragment key={section.id}>
            {section.id === 'province' ? (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '80vh', 
                    marginBottom: '4rem',
                    width: '100%'
                }}>
                    <div style={{ width: '100%', marginTop: '-340px' }}>
                        {section.chart}
                    </div>
                </div>
            ) : (
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                minHeight: '80vh', 
                marginBottom: '4rem',
                paddingTop: section.id === 'store-count' ? '60px' : '0',
                marginTop: section.id === 'city' ? '-150px' : '0'
            }}>
                <div style={{ width: '40%', paddingRight: '2rem', boxSizing: 'border-box', position: 'relative' }}>
                    <p className="content-body-text" style={{ 
                        color: '#f0e7da', 
                        fontFamily: "'SimSun', 'Songti SC', serif", 
                        fontSize: '21px', 
                        lineHeight: '2',
                        position: 'relative',
                        zIndex: 1,
                        top: section.id === 'proportion' ? '-40px' : (section.id === 'comparison' ? '-30px' : (section.id === 'store-count' ? '-40px' : (section.id === 'city' ? '60px' : '0')))
                    }}>
                        {section.text}
                    </p>
                    {section.id === 'market-growth' && (
                        <img 
                            src={pageOneDecoration} 
                            alt="Decoration" 
                            style={{ 
                                position: 'absolute', 
                                bottom: '-150px', 
                                left: '-200px', 
                                width: '390px', 
                                height: 'auto',
                                opacity: 1,
                                zIndex: 0
                            }} 
                        />
                    )}
                    {section.id === 'proportion' && (
                        <img 
                            src={pageOneDecoration2} 
                            alt="Decoration" 
                            style={{ 
                                position: 'absolute', 
                                bottom: '-300px', 
                                right: '-370px', 
                                width: '800px', 
                                height: 'auto',
                                opacity: 1,
                                zIndex: 0
                            }}   
                        />
                    )}
                    {section.id === 'comparison' && (
                        <>
                            <img 
                                src={pageOneDecoration} 
                                alt="Decoration Left" 
                                style={{ 
                                    position: 'absolute', 
                                    bottom: '-300px', 
                                    left: '-200px', 
                                    width: '390px', 
                                    height: 'auto',
                                    opacity: 1,
                                    zIndex: 0
                                }} 
                            />
                            <img 
                                src={pageOneDecoration2} 
                                alt="Decoration Right" 
                                style={{ 
                                    position: 'absolute', 
                                    bottom: '-220px', 
                                    right: '-370px', 
                                    width: '800px', 
                                    height: 'auto',
                                    opacity: 1,
                                    zIndex: 0
                                }} 
                            />
                        </>
                    )}
                    {section.id === 'store-count' && (
                        <img 
                            src={pageOneDecoration3} 
                            alt="Decoration" 
                            style={{ 
                                position: 'absolute', 
                                bottom: '-240px', 
                                left: '-260px', 
                                width: '800px', 
                                height: 'auto',
                                opacity: 1,
                                zIndex: 0
                            }} 
                        />
                    )}
                </div>
                <div style={{ width: '60%' }}>
                    {section.chart}
                </div>
            </div>
            )}
            {section.id === 'store-count' && (
                <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '4rem', marginTop: '-240px' }}>
                    <img src={pageOneDecoration6} alt="Province Distribution Decoration" style={{ width: '115%', height: 'auto' }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -70%)',
                        width: '87%',
                        textAlign: 'justify',
                        color: '#f0e7da', 
                        fontSize: '21px', 
                        letterSpacing: '1.5px',
                        lineHeight: '1.8',
                        fontFamily: "'SimSun', 'Songti SC', serif",
                        fontWeight: 'bold'
                    }}>
                        从省域分布来看，2025年中国咖啡门店呈现出明显的区域集聚特征，整体集中于东部和南部沿海地区。经济体量大、人口密集、城市化水平较高的省份成为咖啡门店分布的集中区域，其中广东省断层领先，而中西部和部分东北省份门店数量相对较少。
                    </div>
                </div>
            )}
            </React.Fragment>
        ))}
      </div>

      {/* Section 8: Conclusion Text (Outro) - Sticky Wrapper */}
      <div className="outro-sticky-wrapper">
        <div className="content-container outro-section">
          <div className="content-image-wrapper">
            <img src="/src/assets/store.png" alt="Coffee Store" className="content-image" />
          </div>
          <div className="content-text-wrapper">
            <p className="content-body-text" style={{ 
                color: '#f0e7da', 
                fontFamily: "'SimSun', 'Songti SC', serif", 
                fontSize: '17.5px', 
                lineHeight: '2' 
            }}>
              综合来看，中国咖啡行业的快速扩张并非偶然，在整体消费增速放缓的背景下，呈现出一条与宏观趋势并不完全同步的增长曲线。这一变化指向一个值得追问的问题——在消费环境趋紧、支出选择更谨慎的情况下，为什么咖啡，尤其是现制咖啡，反而获得了更强的生命力？要理解这一现象，不能仅停留在表面的规模和数量层面，需要进一步深入消费逻辑本身。据此，我们聚焦消费降级与情绪经济两个维度，尝试拆解它们如何共同塑造近年来中国咖啡行业的增长路径。
            </p>
          </div>
        </div>
      </div>

      {/* Section 9: Cover Image (bg1.png) - Slides over */}
      <div 
        className="cover-section"
        ref={coverSectionRef}
        style={{ position: 'relative' }} 
      >
        <canvas 
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
        <PageTwo 
          onCupRef={cupRef} 
          hideCup={isTransitionActive}
        />
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
        style={{ 
           overflowY: 'auto'
        }}
      >
        <div 
          className="pull-text-indicator" 
          style={{ 
            opacity: expanded ? 0 : 1,
            height: expanded ? 0 : 'auto',
            marginTop: expanded ? 0 : '30px',
            marginBottom: expanded ? 0 : '20px',
            overflow: 'hidden',
            transition: 'all 0.5s',
            cursor: 'pointer' 
          }}
          onClick={() => setExpanded(true)}
        >
            <span className="arrow-icon">↑</span> 
             Pull to Explore 
            <span className="arrow-icon">↑</span>
        </div>
        <div className="slider-content" style={{ paddingTop: expanded ? '0' : '4rem', transition: 'padding-top 0.5s', backgroundColor: '#542410' }}>
           {MainContent}
        </div>
      </section>

      {/* Page Three Overlay */}
      <div 
        ref={pageThreeRef}
        className="page-three-overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 100,
          pointerEvents: 'none',
          clipPath: 'circle(0px at 0px 0px)',
          transition: 'none', // Continuous update
          visibility: 'hidden',
          overflowY: 'hidden',
          willChange: 'clip-path' // Optimize performance
        }}
      >
        <PageThree />
      </div>

      {/* Floating Cup Transition Element */}
      <div 
            ref={floatingCupRef}
            className="floating-cup-transition"
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '200px',
                height: '200px',
                transform: 'translate(-50%, -50%)',
                zIndex: 200, // Above PageThree (100)
                opacity: 0,
                pointerEvents: 'none',
                display: 'none',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'transparent'
            }}
        >
             <img 
                src={change1} 
                alt="Transition Cup" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'contain'
                }} 
              />
        </div>
    </div>
  );
}

export default App;
