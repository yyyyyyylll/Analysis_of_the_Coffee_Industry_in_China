import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import change1 from '../assets/change1.png';
import title2 from '../assets/part2-1素材/title2.png';
import image3 from '../assets/part2-1素材/3.png';
import image4 from '../assets/part2-1素材/4.png';
import image5 from '../assets/part2-1素材/5.png';
import image6 from '../assets/part2-1素材/6.png';
import image7 from '../assets/part2-1素材/7.png';
import image8 from '../assets/part2-1素材/8.png';
import image9 from '../assets/part2-1素材/9.png';
import image10 from '../assets/part2-1素材/10.png';
import imagePart2_2 from '../assets/part2-2素材/2.png';
import decoration3 from '../assets/part2-2素材/3.png';
import imagePart2_2_4 from '../assets/part2-2素材/4.png';
import paperBg from '../assets/part2-2素材/5.png';
import PriceWarTimeline from './PriceWarTimeline';
import {
  getLuckinRevenueOption,
  getLuckinProfitOption,
  getLuckinCostOption,
  getStarbucksRevenueOption,
  getStarbucksProfitOption,
  getStarbucksStoreOption,
  getStarbucksCostOption,
  getLuckinCityOption,
  getStarbucksCityOption,
  getFrequencyOption,
  getPriceAcceptanceOption,
  getMonthConsumptionOption,
  getLuckinWordCloudOption,
  getStarbucksWordCloudOption
} from './chartOptions';

const ResponsiveStarbucksCityChart = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isUpdatingGraphic = useRef(false);

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  const updateGraphic = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;
    
    // Avoid infinite loop: if we just triggered an update, ignore the finished event from that update
    if (isUpdatingGraphic.current) {
        isUpdatingGraphic.current = false;
        return;
    }

    const option = chart.getOption();
    const series = option.series;
    if (!series || series.length === 0) return;

    // Use convertToPixel to get exact coordinates regardless of layout
    // Assuming axis 0
    const p0 = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [0, 0]);
    const p1 = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [1, 0]);
    if (!p0 || !p1) return;

    // Calculate bar width in pixels (60% of band width)
    const categoryWidth = Math.abs(p1[0] - p0[0]);
    const barWidth = categoryWidth * 0.6;
    const halfBarWidth = barWidth / 2;

    const elements = [];
    const dataLen = series[0].data.length;

    // Iterate columns (gap between j-1 and j)
    for (let j = 1; j < dataLen; ++j) {
      // Get X coordinates for the gap
      const prevCenter = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [j - 1, 0]);
      const currCenter = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [j, 0]);
      
      const leftX = prevCenter[0] + halfBarWidth;
      const rightX = currCenter[0] - halfBarWidth;

      let prevStack = 0;
      let currStack = 0;

      // Iterate series (stack layers)
      for (let i = 0; i < series.length; ++i) {
        const prevVal = series[i].data[j - 1];
        const currVal = series[i].data[j];
        
        // Calculate cumulative stack values
        const prevTopVal = prevStack + prevVal;
        const currTopVal = currStack + currVal;

        // Get Y coordinates via convertToPixel
        // Use seriesIndex i for correctness (though axis mapping is same)
        const prevBottomPt = chart.convertToPixel({ seriesIndex: i }, [j - 1, prevStack]);
        const prevTopPt = chart.convertToPixel({ seriesIndex: i }, [j - 1, prevTopVal]);
        const currBottomPt = chart.convertToPixel({ seriesIndex: i }, [j, currStack]);
        const currTopPt = chart.convertToPixel({ seriesIndex: i }, [j, currTopVal]);

        // Points order: TopLeft, BottomLeft, BottomRight, TopRight
        // Note: Y increases downwards in screen pixels, but values increase upwards.
        // convertToPixel handles the mapping.
        // We want to fill the area between prev stack and curr stack.
        
        const points = [
          [leftX, prevTopPt[1]],     // Top Left
          [leftX, prevBottomPt[1]],  // Bottom Left
          [rightX, currBottomPt[1]], // Bottom Right
          [rightX, currTopPt[1]]     // Top Right
        ];

        elements.push({
          type: 'polygon',
          shape: { points },
          style: {
            fill: series[i].itemStyle.color,
            opacity: 0.18
          },
          silent: true
        });

        prevStack = prevTopVal;
        currStack = currTopVal;
      }
    }

    // Set the flag to ignore the next finished event caused by this setOption
    isUpdatingGraphic.current = true;
    chart.setOption({
      graphic: elements
    });
  };

  const onChartReady = (chart) => {
    chart.on('finished', updateGraphic);
  };

  // Only render chart if we have valid dimensions
  const shouldRender = dimensions.width > 0 && dimensions.height > 0;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {shouldRender && (
        <ReactECharts 
          ref={chartRef}
          option={getStarbucksCityOption(dimensions.width, dimensions.height)} 
          style={{ width: '100%', height: '100%' }} 
          opts={{ renderer: 'canvas' }}
          onChartReady={onChartReady}
        />
      )}
    </div>
  );
};

const ResponsiveLuckinCityChart = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isUpdatingGraphic = useRef(false);

  useEffect(() => {
    const observeTarget = containerRef.current;
    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(observeTarget);
    return () => resizeObserver.unobserve(observeTarget);
  }, []);

  const updateGraphic = () => {
    const chart = chartRef.current?.getEchartsInstance();
    if (!chart) return;
    
    // Avoid infinite loop
    if (isUpdatingGraphic.current) {
        isUpdatingGraphic.current = false;
        return;
    }

    const option = chart.getOption();
    const series = option.series;
    if (!series || series.length === 0) return;

    // Use convertToPixel to get exact coordinates regardless of layout
    const p0 = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [0, 0]);
    const p1 = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [1, 0]);
    if (!p0 || !p1) return;

    // Calculate bar width in pixels (60% of band width)
    const categoryWidth = Math.abs(p1[0] - p0[0]);
    const barWidth = categoryWidth * 0.6;
    const halfBarWidth = barWidth / 2;

    const elements = [];
    const dataLen = series[0].data.length;

    // Iterate columns (gap between j-1 and j)
    for (let j = 1; j < dataLen; ++j) {
      // Get X coordinates for the gap
      const prevCenter = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [j - 1, 0]);
      const currCenter = chart.convertToPixel({ xAxisIndex: 0, yAxisIndex: 0 }, [j, 0]);
      
      const leftX = prevCenter[0] + halfBarWidth;
      const rightX = currCenter[0] - halfBarWidth;

      let prevStack = 0;
      let currStack = 0;

      // Iterate series (stack layers)
      for (let i = 0; i < series.length; ++i) {
        const prevVal = series[i].data[j - 1];
        const currVal = series[i].data[j];
        
        // Calculate cumulative stack values
        const prevTopVal = prevStack + prevVal;
        const currTopVal = currStack + currVal;

        // Get Y coordinates via convertToPixel
        const prevBottomPt = chart.convertToPixel({ seriesIndex: i }, [j - 1, prevStack]);
        const prevTopPt = chart.convertToPixel({ seriesIndex: i }, [j - 1, prevTopVal]);
        const currBottomPt = chart.convertToPixel({ seriesIndex: i }, [j, currStack]);
        const currTopPt = chart.convertToPixel({ seriesIndex: i }, [j, currTopVal]);

        const points = [
          [leftX, prevTopPt[1]],     // Top Left
          [leftX, prevBottomPt[1]],  // Bottom Left
          [rightX, currBottomPt[1]], // Bottom Right
          [rightX, currTopPt[1]]     // Top Right
        ];

        elements.push({
          type: 'polygon',
          shape: { points },
          style: {
            fill: series[i].itemStyle.color,
            opacity: 0.18
          },
          silent: true
        });

        prevStack = prevTopVal;
        currStack = currTopVal;
      }
    }

    // Set the flag to ignore the next finished event caused by this setOption
    isUpdatingGraphic.current = true;
    chart.setOption({
      graphic: elements
    });
  };

  const onChartReady = (chart) => {
    chart.on('finished', updateGraphic);
  };

  const shouldRender = dimensions.width > 0 && dimensions.height > 0;

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {shouldRender && (
        <ReactECharts 
          ref={chartRef}
          option={getLuckinCityOption(dimensions.width, dimensions.height)} 
          style={{ width: '100%', height: '100%' }} 
          opts={{ renderer: 'canvas' }}
          onChartReady={onChartReady}
        />
      )}
    </div>
  );
};

// Helper Component for Full Width Text
const FullWidthText = ({ children, style }) => (
  <div style={{ 
    width: '100%', 
    marginBottom: '60px', 
    fontSize: '21px', 
    lineHeight: '42px', 
    color: '#4B3621',
    textAlign: 'justify',
    ...style
  }}>
    {children}
  </div>
);

// Helper Component for Scrollytelling Group
const ScrollyGroup = ({ items }) => {
  return (
    <div style={{ width: '100%', marginBottom: '60px' }}>
      {items.map((item, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '100px',
          minHeight: '480px'
        }}>
          {/* Text Section */}
          <div style={{ width: '40%', flexShrink: 0, paddingRight: '40px' }}>
            <div className="content-body-text" style={{ fontSize: '21px', lineHeight: '42px', color: '#4B3621' }}>
              {item.text}
            </div>
          </div>
          {/* Chart Section */}
          <div style={{ flex: 1, height: '480px' }}>
            {item.chart}
          </div>
        </div>
      ))}
    </div>
  );
};

const PageTwo = ({ onCupRef, hideCup = false }) => {
  // Cup is now handled by App.jsx floating element during transition
  const opacity = hideCup ? 0 : 1;
   return (
     <div className="page-two-content" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '85%' }}>
      {/* Intro Section */}
      <div style={{ marginTop: 'calc(50vh - 200px)', marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', marginRight: '-60px' }}>
        <img src={title2} alt="消费降级" style={{ width: '1000px', height: 'auto' }} />
      </div>
      <div style={{ textAlign: 'center', marginBottom: '40px', color: '#4B3621', marginTop: '-200px' }}>
        <p style={{ fontSize: '21px', lineHeight: '42px', marginBottom: '0', textAlign: 'center' }}>
          价格作为最直观的市场信号，与咖啡市场的高速增长紧密相连，成为推动市场渗透与重塑消费习惯的核心支点。
        </p>
        <p style={{ fontSize: '21px', lineHeight: '42px', marginTop: '0', textAlign: 'center' }}>
          这既体现在咖啡品牌的战略选择上，也反映在消费者端的需求变迁中。
        </p>
      </div>

      <div style={{ 
        width: '100vw', 
        marginLeft: 'calc(50% - 50vw)', 
        marginBottom: '60px',
        position: 'relative'
      }}>
        <img src={image3} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '10%',
          transform: 'translateY(calc(-50% + 200px))',
          width: '45%',
          color: '#4B3621',
          fontSize: '21px',
          letterSpacing: '2px',
          lineHeight: '42px',
          textAlign: 'justify'
        }}>
          <p style={{ marginBottom: '20px', fontSize: '21px', letterSpacing: '2px', lineHeight: '42px' }}>
            面对日益拥挤的咖啡赛道，低价成为品牌打开更广阔的消费市场的破局之刃。近年来，各大咖啡品牌的价格战已逐渐成为常态化竞争，其激烈与持久度远超外界想象。
          </p>
          <p style={{ fontSize: '21px', letterSpacing: '2px', lineHeight: '42px' }}>
            库迪咖啡在2023年率先掀起了“9.9元”的低价浪潮；瑞幸咖啡迅速应战，将9.9元的优惠价格从活动限定推向常态化。幸运咖、皮爷咖啡等品牌也在2024年陆续加入战局。进入2025年，价格内卷愈演愈烈，即使是面向中高端市场的星巴克也罕见地调低了多款产品的价格。这表明低价已经从短期的营销战术变为长期的战略选择。
          </p>
        </div>
      </div>

      {/* Price War Section */}
      <div className="subsection">
        <div className="media-placeholder" style={{ display: 'block', maxWidth: '100%', marginBottom: '80px' }}>
          <PriceWarTimeline />
        </div>
      </div>

      {/* Block 1: Intro to Charts */}
      <FullWidthText>
        <p style={{ fontWeight: 'bold', fontSize: '21px', marginBottom: '1em', textAlign: 'center' }}>
          企业敢于打持久价格战的底气，并非单纯依赖补贴或短期让利，而是建立在对成本结构和运营效率的系统性重塑之上。
        </p>
      </FullWidthText>

      {/* Three-column Layout: Image | Revenue | Profit */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', height: '400px', marginBottom: '60px', width: '100%' }}>
        <div style={{ width: '36%', flexShrink: 0, display: 'flex', alignItems: 'center', overflow: 'visible', justifyContent: 'flex-start', position: 'relative', marginTop: '-130px' }}>
          <img src={image4} alt="Analysis" style={{ width: '100%', height: 'auto', transform: 'scale(2, 2.7)', transformOrigin: 'left center', position: 'relative', zIndex: 10 }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, calc(-50% + 60px))',
            width: '70%', // Adjusted width to 70%
            padding: '20px',
            zIndex: 20,
            color: '#4B3621',
            fontSize: '18px',
            lineHeight: '36px',
            fontWeight: 'normal',
            textAlign: 'justify',
            fontFamily: '"SimSun", "Songti SC", serif', // Added Songti font
            textIndent: '2em'
          }}>
            以瑞幸为代表的新兴连锁品牌，构建了一套降本增效的战略模式。财报数据显示，其2019-2024年的营收规模持续扩大，5年以来净收入增长率保持高速增长，均维持在30%以上，且利润营利能力也得到显著改善，在2024年突破40亿。这一表现为其在价格层面的持续进攻提供了现实基础，也为后续通过规模扩张实现降本增效埋下伏笔。
          </div>
        </div>
        <div style={{ width: '36%', flexShrink: 0, position: 'relative', zIndex: 30 }}>
          <ReactECharts option={getLuckinRevenueOption()} style={{ height: '100%', width: '100%' }} />
        </div>
        <div style={{ width: '36%', flexShrink: 0, marginLeft: '-3%', position: 'relative', zIndex: 30 }}>
          <ReactECharts option={getLuckinProfitOption()} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Section: Luckin Cost */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'stretch', height: '450px', marginBottom: '60px', width: '100%', marginTop: '110px' }}>
        <div style={{ width: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', overflow: 'visible', justifyContent: 'flex-start', position: 'relative', marginTop: '-130px' }}>
          <img src={image4} alt="Analysis" style={{ width: '100%', height: 'auto', transform: 'scale(2, 1.88)', transformOrigin: 'left center', position: 'relative', zIndex: 10 }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, calc(-50% + 60px))',
            width: '70%',
            padding: '20px',
            zIndex: 20,
            color: '#4B3621',
            fontSize: '18px',
            lineHeight: '36px',
            fontWeight: 'normal',
            textAlign: 'justify',
            fontFamily: '"SimSun", "Songti SC", serif',
            textIndent: '2em'
          }}>
            从门店数据看，瑞幸在2021年后进入明显的加速扩张阶段，门店总数在2023年几乎翻倍。在这样的扩张节奏下，瑞幸的总运营费用快速上升并不意外，但关键在于其费用结构的变化：门店运营费用占比从接近60%下降到2023年最低40%，说明新增门店并未线性推高单位运营成本。结合门店扩张可见，瑞幸并非压缩投入降本，而是通过标准化运营与规模扩张摊薄单店成本，为低价策略提供可持续支撑。
          </div>
        </div>
        <div style={{ width: '50%', flexShrink: 0, position: 'relative', zIndex: 30, top: '25px' }}>
          <ReactECharts option={getLuckinCostOption()} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Inserted Image 5 */}
      <div style={{ 
        width: '100vw', 
        marginLeft: 'calc(50% - 50vw)', 
        marginBottom: '60px',
        position: 'relative',
        marginTop: '-210px'
      }}>
        <img src={image5} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      {/* Block: Starbucks Intro with Image 6 Background */}
       <div style={{ 
         position: 'relative',
         width: '100vw', 
         marginLeft: 'calc(50% - 50vw)', 
         marginBottom: '60px',
          overflow: 'visible',
          marginTop: '-140px'
        }}>
        {/* Background Decoration Image */}
        <img 
          src={image6} 
          alt="" 
          style={{ 
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(calc(-50% + 200px))',
            width: 'auto',
            height: '360%', // Scaled up 3x
            maxHeight: 'none',
            zIndex: 0,
            opacity: 0.8 // Slight transparency for background
          }} 
        />
        
        {/* Text Content */}
        <div style={{ 
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          width: '85%',
          margin: '0 auto',
          padding: '40px 0'
        }}>
          <p style={{ fontSize: '21px', lineHeight: '42px', textAlign: 'justify', textIndent: '2em', color: '#4B3621' }}>
            与本土连锁通过规模扩张实现增长不同，星巴克在中国市场近几年的整体经营表现呈现出明显的承压态势。从净收入和利润看，近五年星巴克中国区的收入与盈利均出现波动式下滑，在其全球体系中的收入和利润占比也由高位逐步回落。这表明，星巴克在中国的增长动能正在减弱，原有依赖品牌溢价和稳定客群的商业模式，可能难以应对消费环境变化带来的压力。
          </p>
        </div>
      </div>

      {/* Side-by-side Charts: Revenue & Profit */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch', marginBottom: '100px', marginTop: '-30px', width: '100%', gap: '40px' }}>
        <div style={{ flex: 1, height: '400px' }}>
          <ReactECharts option={getStarbucksRevenueOption()} style={{ height: '100%', width: '100%' }} />
        </div>
        <div style={{ flex: 1, height: '400px' }}>
          <ReactECharts option={getStarbucksProfitOption()} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      {/* Store Data Section with Decoration */}
        <div style={{ 
          position: 'relative',
          width: '100vw', 
          marginLeft: 'calc(50% - 50vw)', 
          marginBottom: '100px',
          overflow: 'visible',
          marginTop: '-55px'
        }}>
         {/* Decoration Image */}
          <img 
            src={image6} 
            alt="" 
            style={{ 
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(calc(-50% + 100px))',
              width: 'auto',
              height: '120%',
              maxHeight: 'none',
              zIndex: 0,
              opacity: 1
            }} 
          />
         
         {/* Content */}
         <div style={{ 
           position: 'relative',
           zIndex: 1,
           maxWidth: '1200px',
           width: '85%',
           margin: '0 auto',
           display: 'flex',
           alignItems: 'center',
           minHeight: '400px'
         }}>
            <div style={{ flex: 1, paddingRight: '40px' }}>
              <div className="content-body-text" style={{ color: '#4B3621', textAlign: 'justify' }}>
                <p style={{ fontSize: '21px', lineHeight: '42px' }}>
                  进一步结合门店数据可以发现，尽管星巴克仍在持续开店，但其门店扩张节奏相对温和，未形成通过快速铺店摊薄成本的规模效应。
                </p>
              </div>
            </div>
            <div style={{ flex: 1, height: '400px', width: '50%' }}>
              <ReactECharts option={getStarbucksStoreOption()} style={{ height: '100%', width: '100%' }} />
            </div>
         </div>
      </div>

      {/* Cost Data Section with Decoration */}
      <div style={{ 
        position: 'relative',
        width: '100vw', 
        marginLeft: 'calc(50% - 50vw)', 
        marginBottom: '100px',
        overflow: 'visible',
        marginTop: '-80px'
      }}>
         {/* Decoration Image 7 */}
          <img 
            src={image7} 
            alt="" 
            style={{ 
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'auto',
              height: '168%',
              maxHeight: 'none',
              zIndex: 0,
              opacity: 0.8
            }} 
          />

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '1200px',
          width: '85%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{ flex: 1, height: '400px', width: '50%' }}>
            <ReactECharts option={getStarbucksCostOption()} style={{ height: '100%', width: '100%' }} />
          </div>
          <div style={{ flex: 1, paddingLeft: '40px' }}>
            <div className="content-body-text" style={{ color: '#4B3621', textAlign: 'justify', fontFamily: '"SimSun", "Songti SC", serif' }}>
              <p style={{ fontSize: '21px', lineHeight: '42px' }}>
                在成本端，2022—2025 年间，其门店运营费用和产品分销成本占比始终处于较高水平，且并未随门店增加而显著下降。由此可见，星巴克并未建立起以规模化降本为核心的价格竞争能力，在价格敏感度不断上升的市场环境中，其经营模式对长期价格战的适应性相对受限。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Block 2: Intro to City Charts */}
      <FullWidthText>
        <p style={{ fontWeight: 'bold', marginBottom: '1em', fontSize: '21px', textAlign: 'center', marginTop: '175px' }}>
          两个品牌在城市层级上的布局差异，直接对应了各自对价格竞争和成本控制的承受能力。
        </p>
      </FullWidthText>

      {/* Luckin Section: Image 8 (Left) + Chart (Right) */}
      <div style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0px',
        marginTop: '-150px'
      }}>
        {/* Left: Image 8 */}
        <div style={{ width: '55%', flexShrink: 0, position: 'relative', marginTop: '-100px' }}>
          <img src={image8} alt="" style={{ 
            display: 'block', 
            width: '187%', // Scaled 1.1x from 170%
            height: '120%', // Scaled 6/7 from 140%
            maxWidth: 'none',
            objectFit: 'cover'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 'calc(5% + 50px)',
            transform: 'translateY(calc(-50% + 50px))',
            width: 'calc(80% - 150px)',
            color: '#4B3621',
            fontSize: '21px',
            lineHeight: '42px',
            textAlign: 'justify',
            zIndex: 10,
            textIndent: '0',
            fontFamily: '"SimSun", "Songti SC", serif'
          }}>
            瑞幸的门店分布明显更加分散，其增长重心持续向二线及以下城市外移。2024年，瑞幸在二线、三线及以下城市的门店占比合计已超过一半。这种布局意味着更低的租金和运营成本，也为高密度铺店和标准化复制提供了空间条件，使规模化降本在空间层面具备可行性。
          </div>
        </div>
        
        {/* Right: Luckin Chart */}
        <div style={{ width: 'calc(49.5% + 120px)', flexShrink: 0, marginLeft: '-100px', height: '500px', padding: '0 40px', boxSizing: 'border-box', position: 'relative', zIndex: 1, top: '20px' }}>
          <ResponsiveLuckinCityChart />
        </div>
      </div>

      <FullWidthText>
        <p style={{ fontWeight: 'bold', marginBottom: '1em', fontSize: '21px', textAlign: 'center', marginTop: '0px' }}>
          两个品牌在城市层级上的布局差异，直接对应了各自对价格竞争和成本控制的承受能力。
        </p>
      </FullWidthText>

      {/* Starbucks Section: Image 8 (Left) + Chart (Right) */}
      <div style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '60px',
        marginTop: '-150px'
      }}>
        {/* Left: Image 8 (Reused) */}
        <div style={{ width: '55%', flexShrink: 0, position: 'relative', marginTop: '-100px' }}>
          <img src={image8} alt="" style={{ 
            display: 'block', 
            width: '187%', 
            height: '120%', 
            maxWidth: 'none',
            objectFit: 'cover'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 'calc(5% + 50px)',
            transform: 'translateY(calc(-50% + 50px))',
            width: 'calc(80% - 150px)',
            color: '#4B3621',
            fontSize: '21px',
            lineHeight: '42px',
            textAlign: 'justify',
            zIndex: 10,
            textIndent: '0',
            fontFamily: '"SimSun", "Songti SC", serif'
          }}>
            相比之下，星巴克的门店结构高度集中在高线城市。一线与新一线城市始终占据其门店布局的绝对主体，二线及以下城市占比明显偏低。这种空间选择虽然有利于维持品牌形象和客单价，但也意味着更高的固定成本和更弱的成本弹性。
          </div>
        </div>
        
        {/* Right: Starbucks Chart */}
        <div style={{ width: 'calc(49.5% + 120px)', flexShrink: 0, marginLeft: '-100px', height: '500px', padding: '0 40px', boxSizing: 'border-box', position: 'relative', zIndex: 1, top: '20px' }}>
          <ResponsiveStarbucksCityChart />
        </div>
      </div>

      {/* Block 3: Conclusion 1 - Redesigned with Image 9 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        padding: '60px 0',
        overflow: 'visible',
        marginTop: '-130px'
      }}>
        {/* Left: Image 9 */}
        <div style={{ width: '50%', paddingLeft: '40px', boxSizing: 'border-box', overflow: 'hidden' }}>
          <img src={image9} alt="" style={{ width: '100%', height: 'auto', display: 'block', transform: 'scale(1.6)', transformOrigin: 'left center' }} />
        </div>
        
        {/* Right: Text */}
        <div style={{ width: '50%', paddingLeft: '20px', paddingRight: '100px', boxSizing: 'border-box', position: 'relative' }}>
          {/* Decoration Image 10 (Center) */}
          <img 
            src={image10} 
            alt="" 
            style={{ 
              position: 'absolute',
              top: 'calc(50% - 10px)',
              left: 'calc(50% - 190px)',
              transform: 'translate(-50%, -50%)',
              width: '106%', 
              height: 'auto', 
              opacity: 1.0,
              zIndex: 0
            }} 
          />
          
          {/* Decoration Image 7 (Bottom Right) */}
          <img 
            src={image7} 
            alt="" 
            style={{ 
              position: 'absolute',
              bottom: '-273px',
              right: '0',
              width: '172%', 
              height: 'auto', 
              zIndex: 0,
              opacity: 1
            }} 
          />

          <p style={{ fontSize: '21px', lineHeight: '42px', textAlign: 'justify', margin: 0, position: 'relative', zIndex: 1 }}>
            对比不同品牌可以发现，这一轮价格战并非单纯降价，而是以降本为前提的长期策略。通过快速开店和标准化运营摊薄成本，并向低线城市下沉以降低租金与人力支出，咖啡品牌为低价提供了可持续支撑。降价只是结果，门店扩张与市场下沉才是品牌顺应消费降级的核心机制。
          </p>
        </div>
      </div>

      {/* Image Part 2-2 */}
      <div style={{
        width: '97vw',
        marginLeft: 'calc(50% - 48.5vw)',
        position: 'relative',
        marginTop: '60px',
        marginBottom: '60px'
      }}>
        <img src={imagePart2_2} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '25%',
          width: 'calc(75% - 100px)',
          color: '#4B3621',
          fontSize: '24px',
          lineHeight: '48px',
          letterSpacing: '2px',
          textAlign: 'justify'
        }}>
          <p style={{ marginBottom: '40px', fontSize: '24px', lineHeight: '48px', letterSpacing: '2px' }}>
            如果说价格战首先是企业对消费环境变化的回应，那么它真正能否成立，还取决于消费者如何看待和使用这些更低价的咖啡。
          </p>
          <p style={{ fontSize: '24px', lineHeight: '48px', letterSpacing: '2px' }}>
            数据显示，全国咖啡消费者总数接近4亿人，咖啡年消费量达28万吨，中国人均咖啡饮用杯数也从2016年的约9杯/年，增长至2024年的22.24杯/年。
          </p>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '80px',
          color: '#4B3621',
          fontSize: '21px',
          fontFamily: '"Songti SC", "SimSun", serif',
          opacity: 0.8
        }}>
          （数据来源：2024中国城市咖啡发展报告）
        </div>
      </div>

      {/* Block 4: Intro to Consumption */}


      {/* Scrolly Group 3: Consumption Charts */}
      <ScrollyGroup items={[
        {
          text: (
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <p style={{ fontSize: '21px', lineHeight: '42px' }}>
                咖啡的饮用频率呈现上升趋势。每周喝一杯及以上咖啡的消费者占比超过六成，构成市场消费主力军，其中每天饮用一杯及以上的重度用户稳定在10个百分点以上，咖啡无疑成为了当代社会的生活必需品。
              </p>
              <img 
                src={decoration3} 
                alt="Decoration" 
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  marginLeft: '200px',
                  marginTop: '40px',
                  transform: 'translate(-50%, -50%)', 
                  width: '190%',
                  zIndex: -1,
                  opacity: 1
                }}  
              />
            </div>
          ),
          chart: <ReactECharts option={getFrequencyOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <p style={{ fontSize: '21px', lineHeight: '42px' }}>
                伴随咖啡成为生活刚需，人们对咖啡单杯的成本及价格的关注度随之而来。数据显示，消费者对单杯价格的接受度有所下降。对比2024年，2025年消费者可接受的价格区间明显向中低价位集中，11–20元区间占比上升，而21–30元这一传统主流区间占比下降，高价区间整体收缩。这表明消费者对咖啡的价格预期持续下移，性价比成为主要决策标准，价格敏感度上升，使低价现制咖啡更容易被纳入日常、高频的消费选择。
              </p>
              <img 
                src={decoration3} 
                alt="Decoration" 
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  marginLeft: '200px',
                  marginTop: '-30px',
                  transform: 'translate(-50%, -50%)', 
                  width: '190%',
                  zIndex: -1,
                  opacity: 1
                }}  
              />
            </div>
          ),
          chart: <ReactECharts option={getPriceAcceptanceOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <div style={{ position: 'relative', textAlign: 'center' }}>
              <p style={{ fontSize: '21px', lineHeight: '42px' }}>
                消费者的实际消费行为也呼应了这一现象。数据显示，2025年消费者每月在咖啡饮品上花费100元以内的消费者占比近半成，而月消费150元以上的高消费用户仅占8.96%，相比2022年的23.2%大幅下降。结合价格接受度来看，这意味着大多数消费者倾向于选择价格更低的咖啡品牌，通过降低单杯支出、提高消费频率来实现更频繁的咖啡饮用。
              </p>
              <img 
                src={decoration3} 
                alt="Decoration" 
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  marginLeft: '200px',
                  marginTop: '40px',
                  transform: 'translate(-50%, -50%)', 
                  width: '190%',
                  zIndex: -1,
                  opacity: 1
                }}  
              />
            </div>
          ),
          chart: <ReactECharts option={getMonthConsumptionOption()} style={{ height: '100%', width: '100%' }} />
        }
      ]} />

      {/* Inserted Image 4: Full Screen Break */}
      <div style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        overflow: 'hidden',
        lineHeight: 0,
        marginTop: '-80px',
        // marginBottom removed to avoid gap
      }}>
        <img 
          src={imagePart2_2_4} 
          alt="Decoration" 
          style={{ 
            width: '100%', 
            height: 'auto', 
            display: 'block' 
          }} 
        />
      </div>

      {/* Colored Background Section for the Rest of the Content */}
      <div style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        backgroundColor: '#e4c7c0',
        paddingTop: '60px',
        paddingBottom: '80px',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '-580px'
      }}>
        <div style={{ width: '85%', maxWidth: '1200px' }}>
          
          {/* Block 5: Intro to Wordcloud */}
          <FullWidthText>
            <p style={{ fontWeight: 'bold', marginBottom: '1em', fontSize: '21px', lineHeight: '42px' }}>
              同时，价格理性的提升，也催生了新的消费文化。在社交媒体上，随处可见年轻消费者自发形成的有关消费平价咖啡的讨论。
            </p>
          </FullWidthText>

          {/* Extracted Luckin Text */}
          <FullWidthText>
            <p style={{ fontSize: '21px', lineHeight: '42px' }}>
              围绕瑞幸的消费讨论高度集中在价格与省钱逻辑之上。“9.9”“便宜”“性价比”“优惠”“折扣”“薅羊毛”“划算”“省钱”等词汇占据核心位置，远高于对口感、风味或品质的描述。这表明消费者谈论瑞幸时，往往将其视为一种极致性价比的符号，“好喝”的前提是“便宜”，一旦价格优势不再，其品牌吸引力可能面临挑战。
            </p>
          </FullWidthText>

          {/* Charts Side-by-Side */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '60px' }}>
            {/* Luckin Chart */}
            <div style={{ width: '48%', height: '500px' }}>
              <ReactECharts option={getLuckinWordCloudOption()} style={{ height: '100%', width: '100%' }} />
            </div>
            {/* Starbucks Chart */}
            <div style={{ width: '48%', height: '500px' }}>
              <ReactECharts option={getStarbucksWordCloudOption()} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          {/* Extracted Starbucks Text */}
          <FullWidthText style={{ marginTop: '-50px' }}>
            <p style={{ fontSize: '21px', lineHeight: '42px' }}>
              相较于瑞幸，星巴克的词云呈现出一种更矛盾、也更拉扯的消费叙事。一方面，“价格”“性价比”“优惠”等价格相关词汇同样占据核心位置，说明在消费降级语境下，星巴克同样被纳入了比价和精打细算的讨论框架之中，消费者不再默认接受其原有定价，而是频繁计算贵不贵、有没有更便宜的买法。另一方面，与瑞幸相比，星巴克词云中“贵”“太贵”“不太值”“值不值”等评价性和犹疑性词汇更加突出，显示消费者对其价格的接受度存在更强分化。区别于瑞幸，星巴克更多被当作需要对比权衡，甚至寻找平替的对象，其品牌溢价的合理性正在被反复检验。
            </p>
          </FullWidthText>

          {/* Block 6: Conclusion 2 */}
          <div style={{
            width: 'calc(100vw - 100px)',
            marginLeft: 'calc(50% - 50vw + 100px)',
            backgroundImage: `url(${paperBg})`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            padding: '220px 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '30px',
            marginTop: '-200px'
          }}>
            <div style={{ maxWidth: '1200px', width: '85%', padding: '0 40px' }}>
              <p style={{
                 fontSize: '21px',
                 lineHeight: '42px',
                 margin: 0,
                 color: '#542410',
                 marginLeft: '160px',
                 transform: 'translateY(40px)'
              }}>
                总体来看，消费降级并未削弱咖啡需求，而是重塑了消费者的消费方式。随着价格敏感度上升，消费者通过压低单杯支出、提高饮用频率，将咖啡纳入可负担的日常开销之中。价格理性取代了品牌忠诚，性价比成为核心判断标准，这种以精打细算为特征的消费转向，构成了价格战能够持续的重要需求前提。
              </p>
            </div>
          </div>

          {/* Transition Trigger Element */}
          <div 
            className="transition-trigger-container" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: '-230px',
              minHeight: '100vh',
              marginBottom: '0',
              cursor: 'pointer'
            }}
          >
            <div 
              ref={onCupRef}
              className="coffee-cup-trigger"
              style={{
                position: 'relative',
                width: '1000px',
                height: '1000px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: opacity,
                transition: 'opacity 0.2s',
                backgroundColor: 'transparent'
              }}
            >
              <img 
                src={change1} 
                alt="Next Chapter" 
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  objectFit: 'contain'
                }} 
              />
              {/* Pulse effect or hint could go here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTwo;
