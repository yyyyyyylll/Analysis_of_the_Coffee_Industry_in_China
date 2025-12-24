import React, { useRef, useEffect, useState } from 'react';
import cat2Img from '../assets/数据新闻-part3素材/cat2.png';
import yonexImg from '../assets/数据新闻-part3素材/yonex.png';
import maotaiImg from '../assets/数据新闻-part3素材/maotai.png';

const CollabCardStack = () => {
  const containerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  // Card data
  const cards = [
    {
      id: 1,
      title: "瑞幸 ✖ 猫和老鼠",
      type: "联名",
      readCount: "2.5亿",
      discussCount: "49.8万",
      date: "2023.10",
      image: cat2Img,
      color: "#FFF8F0", 
      textColor: "#542410", 
      direction: -1 
    },
    {
      id: 2,
      title: "星巴克 ✖ YONEX",
      type: "联名",
      readCount: "1.6亿",
      discussCount: "8万",
      date: "2024.07",
      image: yonexImg,
      color: "#FFF5E6", // Warm Cream
      textColor: "#8B4513", // Warm Brown
      direction: 1 
    },
    {
      id: 3,
      title: "瑞幸 ✖ 茅台",
      type: "联名",
      readCount: "3.8亿",
      discussCount: "15.8万",
      date: "2023.09",
      image: maotaiImg,
      color: "#FFEBEB", // Warm Light Red
      textColor: "#C0392B", // Deep Red
      direction: -1 
    }
  ];

  // We need n-1 scroll segments to reveal the last card.
  // The last card stays visible at the end.
  const totalCardsToMove = cards.length - 1;

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far we've scrolled into the container
      // Start counting when the top of container hits the top of viewport (or slightly before/after depending on sticky)
      // Since it's sticky, the 'top' will stay at 0 for a while.
      // We need the parent's position relative to the document or calculate based on rect.top.
      
      // Actually, standard sticky behavior:
      // When rect.top <= 0, we are in the sticky phase.
      // The container height is large (e.g. 300vh).
      // The sticky content tracks with us.
      // We want to map the scroll distance within the container to 0-1 progress.
      
      // rect.top is the distance from viewport top to container top.
      // When rect.top is 0, we start.
      // When rect.bottom is windowHeight, we end.
      // Total scrollable distance = containerHeight - windowHeight.
      // Scrolled amount = -rect.top (when rect.top < 0)
      
      const totalScrollableDistance = container.offsetHeight - windowHeight;
      
      let scrolled = -rect.top;
      if (scrolled < 0) scrolled = 0;
      if (scrolled > totalScrollableDistance) scrolled = totalScrollableDistance;
      
      const newProgress = totalScrollableDistance > 0 ? scrolled / totalScrollableDistance : 0;
      setProgress(newProgress);
    };

    // Find the scrollable parent dynamically
    let scrollParent = window;
    let el = containerRef.current;
    
    // Explicitly look for the known overlay class first
    const overlay = document.querySelector('.page-three-overlay');
    if (overlay) {
        scrollParent = overlay;
    } else {
        // Fallback heuristic
        while (el) {
            const style = window.getComputedStyle(el);
            if (['auto', 'scroll'].includes(style.overflowY)) {
                scrollParent = el;
                break;
            }
            el = el.parentElement;
        }
    }

    // Ensure we handle the case where overlay might be hidden initially but is the correct parent
    // If found via querySelector, we trust it.

    scrollParent.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => scrollParent.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: '400vh', // Adjust height to control scroll speed
        position: 'relative',
        width: '100%',
        marginBottom: '100px' // Space after
      }}
    >
      <div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100vw', // Full viewport width
          marginLeft: 'calc(50% - 50vw)', // Break out of parent container
          marginRight: 'calc(50% - 50vw)', // Break out of parent container
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        <div 
          style={{
            position: 'relative',
            width: '667px',
            height: '375px', // 2/3 of previous size
            perspective: '2000px'
          }}
        >
          {cards.map((card, index) => {
            // Logic to determine position based on progress
            // We want card 0 to move first, then card 1, etc.
            // Range for card i: [i / totalCardsToMove, (i+1) / totalCardsToMove]
            
            // Reverse index for rendering order (Last card at bottom of stack in DOM, but visually we want First card on Top)
            // Actually, if we use absolute positioning, the last one in DOM is on top by default.
            // So we should reverse the array for mapping if we want the first item in data to be on top.
            // OR use z-index. Let's use z-index.
            // Card 0: z-index 10
            // Card 1: z-index 9
            // ...
            
            const zIndex = cards.length - index;
            
            // Calculate movement for this specific card
            // Each card moves during its specific slice of the total progress
            const cardStart = index / totalCardsToMove;
            const cardEnd = (index + 1) / totalCardsToMove;
            
            // Normalize progress for this card to 0-1
            let cardProgress = (progress - cardStart) / (cardEnd - cardStart);
            if (cardProgress < 0) cardProgress = 0;
            if (cardProgress > 1) cardProgress = 1;
            
            // If it's the last card, it doesn't move away, it just stays.
            // Actually, the loop goes up to cards.length.
            // But we only want to move cards 0 to n-2. Card n-1 (last one) stays.
            const isLastCard = index === cards.length - 1;
            
            // Random rotation for the "messy stack" look in resting state
            // Use a deterministic "random" based on index so it doesn't jitter on re-render
            const restingRotation = (index * 7 % 10) - 5; // -5 to 5 degrees

            // Card width is 667px
            const CARD_WIDTH = 667;
            
            // Calculate max translation to leave 1/2 visible at the edge
            // Target position: Card center should be at ScreenEdge * direction
            // Distance = (window.innerWidth / 2)
            const maxTranslate = (window.innerWidth / 2);
            
            // Stack offset logic
            const STACK_OFFSET = 20; // pixels
            const centerOffset = (cards.length - 1) * STACK_OFFSET / 2;
            const initialX = index * STACK_OFFSET - centerOffset;
            const initialY = index * STACK_OFFSET - centerOffset;
            
            // Flat translation only, no rotation
            const targetX = card.direction * maxTranslate;
            const currentX = isLastCard ? initialX : (initialX + (targetX - initialX) * cardProgress);
            // Remove rotation for flat sliding look
            const currentRotate = 0; 
            const currentOpacity = 1; // Keep fully visible as requested

            return (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: card.color,
                  borderRadius: '20px',
                  border: '8px solid #8B4513', // Lighter Brown border
                  color: card.textColor,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: card.type === '联名' ? 'flex-start' : 'center',
                  alignItems: 'center',
                  zIndex: zIndex,
                  transform: `translate(${currentX}px, ${initialY}px) rotate(${currentRotate}deg)`,
                  opacity: currentOpacity,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)', // Soft shadow instead of hard black layer
                  padding: '0px', // Removed padding to maximize space
                   boxSizing: 'border-box',
                   transition: 'transform 0.1s linear, opacity 0.1s linear', // Smooth out slight jitters
                }}
              >
                {card.type === '联名' ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: '16px' }}>
                    {/* Background Pattern */}
                    {card.id === 1 ? (
                         <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `
                                repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 15deg, rgba(255, 200, 0, 0.12) 15deg, rgba(255, 200, 0, 0.12) 30deg)
                            `,
                            backgroundSize: '100% 100%',
                            zIndex: 0
                        }} />
                    ) : card.id === 2 ? (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `
                                repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 15deg, rgba(139, 69, 19, 0.08) 15deg, rgba(139, 69, 19, 0.08) 30deg)
                            `,
                            backgroundSize: '100% 100%',
                            zIndex: 0
                        }} />
                    ) : (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: `
                                repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 15deg, rgba(192, 57, 43, 0.08) 15deg, rgba(192, 57, 43, 0.08) 30deg)
                            `,
                            backgroundSize: '100% 100%',
                            zIndex: 0
                        }} />
                    )}

                    {/* Top Left Decor */}
                    {card.id === 1 ? (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            width: '100px',
                            height: '60px',
                            backgroundColor: '#fff',
                            borderRadius: '50px',
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                            zIndex: 0,
                            opacity: 0.8
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                left: '20px',
                                width: '40px',
                                height: '40px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                            }} />
                            <div style={{
                                position: 'absolute',
                                top: '-10px',
                                left: '50px',
                                width: '30px',
                                height: '30px',
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                            }} />
                        </div>
                    ) : card.id === 2 ? (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            fontSize: '60px',
                            color: '#FFD700',
                            filter: 'drop-shadow(3px 3px 0px rgba(0,0,0,0.1))',
                            zIndex: 0,
                            transform: 'rotate(-15deg)'
                        }}>
                            ⚡
                        </div>
                    ) : (
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#C0392B',
                            borderRadius: '5px',
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.1)',
                            zIndex: 0,
                            transform: 'rotate(-10deg)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff',
                            fontSize: '30px',
                            fontFamily: '"ZCOOL KuaiLe", cursive'
                        }}>
                            酱
                        </div>
                    )}

                    {/* Bottom Right Decor */}
                    {card.id === 1 ? (
                        <div style={{
                            position: 'absolute',
                            bottom: '30px',
                            right: '30px',
                            width: '60px',
                            height: '60px',
                            backgroundColor: '#FFE15D',
                            borderRadius: '50%',
                            zIndex: 0,
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.1)'
                        }} />
                    ) : card.id === 2 ? (
                        <div style={{
                             position: 'absolute',
                             bottom: '30px',
                             right: '30px',
                             width: 0,
                             height: 0,
                             borderLeft: '30px solid transparent',
                             borderRight: '30px solid transparent',
                             borderBottom: '60px solid #D35400',
                             transform: 'rotate(15deg)',
                             filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.1))',
                             zIndex: 0
                         }} />
                    ) : (
                        <div style={{
                             position: 'absolute',
                             bottom: '30px',
                             right: '30px',
                             fontSize: '60px',
                             color: '#FFD700',
                             zIndex: 0,
                             transform: 'rotate(15deg)',
                             filter: 'drop-shadow(4px 4px 0px rgba(0,0,0,0.1))'
                         }}>
                            ★
                         </div>
                    )}

                    {/* Fancy Title */}
                    <div style={{ 
                        position: 'absolute',
                        top: '25px',
                        left: card.id === 1 ? 'auto' : '30px',
                        right: card.id === 1 ? '30px' : 'auto',
                        fontSize: '42px', 
                        fontWeight: '400', 
                        fontFamily: '"ZCOOL KuaiLe", cursive',
                        color: card.id === 1 ? '#FFE15D' : (card.id === 2 ? '#FFFFFF' : '#C0392B'), 
                        WebkitTextStroke: card.id === 3 ? '2px #FFFFFF' : '2px #542410',
                        textShadow: card.id === 3 ? '4px 4px 0px #FFFFFF' : '4px 4px 0px #542410',
                        transform: card.id === 1 ? 'rotate(2deg)' : 'rotate(-2deg)',
                        zIndex: 10
                    }}>
                        {card.title}
                    </div>

                    {/* Main Image - Polaroid Style */}
                    <div style={{ 
                        position: 'absolute',
                        top: '100px',
                        left: card.id === 1 ? 'auto' : '40px',
                        right: card.id === 1 ? '40px' : 'auto',
                        width: '320px',
                        height: '220px',
                        backgroundColor: '#fff',
                        border: '3px solid #542410',
                        boxShadow: '8px 8px 0px rgba(84, 36, 16, 0.2)',
                        padding: '10px',
                        paddingBottom: '30px',
                        transform: card.id === 1 ? 'rotate(3deg)' : 'rotate(2deg)',
                        zIndex: 5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                         <div style={{ width: '100%', height: '100%', overflow: 'hidden', border: '1px solid #eee' }}>
                            <img 
                                src={card.image} 
                                alt={card.title} 
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'cover',
                                }} 
                            />
                         </div>
                    </div>
                    
                    {/* Sticker 1: Read Count */}
                    {card.id === 1 ? (
                        <div style={{
                            position: 'absolute',
                            top: '80px',
                            left: '50px',
                            width: '130px',
                            height: '130px',
                            backgroundColor: '#FF6B6B',
                            border: '3px solid #542410',
                            borderRadius: '50%', // Fallback
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff',
                            transform: 'rotate(-12deg)',
                            boxShadow: '6px 6px 0px #542410',
                            zIndex: 12,
                            overflow: 'visible'
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '1px 1px 0 #000' }}>微博阅读</div>
                            <div style={{ fontSize: '32px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '2px 2px 0 #000' }}>{card.readCount}</div>
                        </div>
                    ) : card.id === 2 ? (
                        <div style={{
                            position: 'absolute',
                            top: '70px',
                            right: '40px',
                            width: '120px',
                            height: '120px',
                            backgroundColor: '#FF6B6B', // Red for Yonex
                            border: '3px solid #542410',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#fff',
                            transform: 'rotate(-10deg)',
                            boxShadow: '6px 6px 0px #542410',
                            zIndex: 12,
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '1px 1px 0 #000' }}>微博阅读</div>
                            <div style={{ fontSize: '32px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '2px 2px 0 #000' }}>{card.readCount}</div>
                        </div>
                    ) : (
                        <div style={{
                            position: 'absolute',
                            top: '80px',
                            right: '50px',
                            width: '120px',
                            height: '120px',
                            backgroundColor: '#FFD700', // Gold
                            border: '3px solid #542410',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#C0392B',
                            transform: 'rotate(-5deg)',
                            boxShadow: '6px 6px 0px #542410',
                            zIndex: 12,
                            borderStyle: 'dashed'
                        }}>
                            <div style={{ fontSize: '16px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive' }}>微博阅读</div>
                            <div style={{ fontSize: '32px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive' }}>{card.readCount}</div>
                        </div>
                    )}

                    {/* Sticker 2: Discuss Count */}
                    {card.id === 1 ? (
                        <div style={{
                            position: 'absolute',
                            bottom: '50px',
                            left: '30px',
                            width: '160px',
                            padding: '15px 10px',
                            backgroundColor: '#FF9F43',
                            border: '3px solid #542410',
                            borderRadius: '20px',
                            color: '#fff',
                            transform: 'rotate(5deg)',
                            boxShadow: '6px 6px 0px #542410',
                            zIndex: 11,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '1px 1px 0 #000' }}>话题讨论</div>
                            <div style={{ fontSize: '28px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '2px 2px 0 #000' }}>{card.discussCount}</div>
                            {/* Bubble Tail */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-15px',
                                right: '40px',
                                width: '20px',
                                height: '20px',
                                backgroundColor: '#FF9F43',
                                borderRight: '3px solid #542410',
                                borderBottom: '3px solid #542410',
                                transform: 'rotate(45deg)'
                            }}></div>
                        </div>
                    ) : card.id === 2 ? (
                         <div style={{
                            position: 'absolute',
                            bottom: '60px',
                            right: '20px',
                            width: '140px',
                            padding: '10px 10px',
                            backgroundColor: '#E67E22', // Warm Orange
                            border: '3px solid #542410',
                            borderRadius: '10px',
                            color: '#fff',
                            transform: 'rotate(5deg)',
                            boxShadow: '6px 6px 0px #542410',
                            zIndex: 11,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '1px 1px 0 #000' }}>话题讨论</div>
                            <div style={{ fontSize: '28px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '2px 2px 0 #000' }}>{card.discussCount}</div>
                        </div>
                    ) : (
                        <div style={{
                            position: 'absolute',
                            bottom: '50px',
                            right: '30px',
                            width: '160px',
                            padding: '15px 10px',
                            backgroundColor: '#E74C3C', // Light Red
                            border: '3px solid #542410',
                            borderRadius: '50px',
                            color: '#fff',
                            transform: 'rotate(5deg)',
                            boxShadow: '6px 6px 0px #542410',
                            zIndex: 11,
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '14px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '1px 1px 0 #000' }}>话题讨论</div>
                            <div style={{ fontSize: '28px', fontWeight: '400', fontFamily: '"ZCOOL KuaiLe", cursive', textShadow: '2px 2px 0 #000' }}>{card.discussCount}</div>
                        </div>
                    )}

                    {/* Sticker 3: Date - Washi Tape Style */}
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '100px', // Moved to left under image
                        padding: '5px 25px',
                        backgroundColor: '#FFE66D',
                        color: '#542410',
                        fontWeight: '900',
                        fontSize: '20px',
                        transform: 'rotate(-2deg)',
                        zIndex: 15,
                        opacity: 0.9,
                        borderLeft: '2px dashed rgba(0,0,0,0.1)',
                        borderRight: '2px dashed rgba(0,0,0,0.1)',
                        boxShadow: '3px 3px 5px rgba(0,0,0,0.1)'
                    }}>
                        TIME: {card.date}
                    </div>

                    {/* Decorative Elements - "Pop" lines */}
                    <div style={{
                        position: 'absolute',
                        top: card.id === 3 ? '50%' : '50px',
                        right: card.id === 3 ? '210px' : '30px',
                        marginTop: card.id === 3 ? '-140px' : '0', // Adjust vertical center
                        fontSize: '40px',
                        color: '#FF6B6B',
                        zIndex: 1,
                        transform: card.id === 3 ? 'rotate(45deg)' : 'rotate(20deg)',
                        fontWeight: 'bold'
                    }}>
                        ✦
                    </div>
                    <div style={{
                        position: 'absolute',
                        bottom: '120px',
                        left: '20px',
                        fontSize: '30px',
                        color: '#FFE66D',
                        zIndex: 6,
                        transform: 'rotate(-10deg)',
                        fontWeight: 'bold'
                    }}>
                        ★
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>{card.title}</h3>
                    <div style={{ fontSize: '60px', fontWeight: 'bold' }}>+</div>
                    <div style={{ marginTop: '20px', fontSize: '18px', opacity: 0.8, fontWeight: 'bold' }}>Limited Edition</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollabCardStack;
