import React, { useState, useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import change1 from '../assets/change1.png';
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
const FullWidthText = ({ children }) => (
  <div style={{ 
    width: '100%', 
    marginBottom: '60px', 
    fontSize: '18px', 
    lineHeight: '1.8', 
    color: '#4B3621',
    textAlign: 'justify'
  }}>
    {children}
  </div>
);

// Helper Component for Scrollytelling Group
const ScrollyGroup = ({ items }) => {
  const [activeSection, setActiveSection] = useState(0);
  const textRefs = useRef([]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.dataset.index);
          setActiveSection(index);
        }
      });
    }, observerOptions);

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      textRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [items]);

  return (
    <div className="scrolly-container" style={{ width: '100%', marginBottom: '60px', position: 'relative' }}>
      <div className="scrolly-left">
        {items.map((item, index) => (
          <div 
            key={index}
            className={`scrolly-text-block ${activeSection === index ? 'active' : ''}`}
            ref={el => textRefs.current[index] = el}
            data-index={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '80vh',
              paddingRight: '40px',
              transition: 'opacity 0.5s',
              opacity: activeSection === index ? 1 : 0.3
            }}
          >
            <div className="content-body-text" style={{ fontSize: '16px', lineHeight: '1.8', color: '#4B3621' }}>
              {item.text}
            </div>
          </div>
        ))}
      </div>

      <div className="scrolly-right" style={{ position: 'sticky', top: '15vh', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="chart-stack" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {items.map((item, index) => (
            <div 
              key={index}
              className={`chart-layer ${activeSection === index ? 'active' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: activeSection === index ? 1 : 0,
                transform: activeSection === index ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                pointerEvents: activeSection === index ? 'auto' : 'none',
                zIndex: activeSection === index ? 10 : 1,
                backgroundColor: 'transparent'
              }}
            >
              {item.chart}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PageTwo = ({ onCupRef, hideCup = false }) => {
  // Cup is now handled by App.jsx floating element during transition
  const opacity = hideCup ? 0 : 1;
   return (
     <div className="page-two-content" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '85%' }}>
      {/* Intro Section */}
      <h2 className="section-title" style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '50vh', marginBottom: '20px', textAlign: 'center' }}>二、消费降级：价格成为关键变量</h2>
      <p className="intro-text" style={{ fontSize: '18px', lineHeight: '1.8', marginBottom: '40px', textAlign: 'center', color: '#4B3621' }}>
        价格作为最直观的市场信号，与咖啡市场的高速增长紧密相连，成为推动市场渗透与重塑消费习惯的核心支点。这既体现在咖啡品牌的战略选择上，也反映在消费者端的需求变迁中。
      </p>

      {/* Price War Section */}
      <div className="subsection">
        <h3 className="subsection-title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', borderLeft: '5px solid #d97a00', paddingLeft: '15px', color: '#4B3621' }}>1. 价格战与降本增效</h3>
        
        <div style={{ marginBottom: '40px', fontSize: '16px', lineHeight: '1.8', color: '#4B3621' }}>
          <p style={{ marginBottom: '20px' }}>
            面对日益拥挤的咖啡赛道，低价成为品牌打开更广阔的消费市场的破局之刃。近年来，各大咖啡品牌的价格战已逐渐成为常态化竞争，其激烈与持久度远超外界想象。
          </p>
          <p style={{ marginBottom: '20px' }}>
            库迪咖啡在2023年率先掀起了“9.9元”的低价浪潮；瑞幸咖啡迅速应战，将9.9元的优惠价格从活动限定推向常态化。幸运咖、皮爷咖啡等品牌也在2024年陆续加入战局，将众多咖啡产品价格下探至个位数。进入2025年，价格内卷未见停歇，更有愈演愈烈的趋势，即使是面向中高端市场的星巴克也罕见地调低了数十款产品的价格。这一系列事件表明，低价已经从短期的营销战术变为长期的战略选择。
          </p>
        </div>
        
        <div className="media-placeholder" style={{ display: 'block', maxWidth: '100%', marginBottom: '80px' }}>
          <PriceWarTimeline />
        </div>
      </div>

      {/* Block 1: Intro to Charts */}
      <FullWidthText>
        <p style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '1em' }}>
          企业敢于打持久价格战的底气，并非单纯依赖补贴或短期让利，而是建立在对成本结构和运营效率的系统性重塑之上。
        </p>
      </FullWidthText>

      {/* Scrolly Group 1: Revenue/Profit/Cost */}
      <ScrollyGroup items={[
        {
          text: (
            <p>
              以瑞幸为代表的新兴连锁品牌，构建了一套降本增效的战略模式。财报数据显示，其2019-2024年的营收规模持续扩大，5年以来净收入增长率保持高速增长，均维持在30%以上。
            </p>
          ),
          chart: <ReactECharts option={getLuckinRevenueOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              且利润营利能力也得到显著改善，在2024年突破40亿。这一表现为其在价格层面的持续进攻提供了现实基础，也为后续通过规模扩张实现降本增效埋下伏笔。
            </p>
          ),
          chart: <ReactECharts option={getLuckinProfitOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              从门店数据看，瑞幸在 2021 年后进入明显的加速扩张阶段，门店总数在 2023 年几乎翻倍，增长率一度接近 100%。在这样的扩张节奏下，瑞幸的总运营费用快速上升并不意外，但关键在于其费用结构的变化：门店运营费用占比整体呈下降趋势，从接近60%下降到2023年最低40%，说明新增门店并未线性推高单位运营成本。结合门店增长情况可以推断，瑞幸的降本增效并不是通过压缩投入实现的，而是依靠标准化门店模型和集中采购，在规模迅速放大的过程中不断摊薄单店成本，从而支撑其低价策略的长期运转，通过规模化与精细化的运营有效缩减了成本，为持续的价格竞争提供了财务支撑。
            </p>
          ),
          chart: <ReactECharts option={getLuckinCostOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              与本土连锁通过规模扩张实现增长不同，星巴克在中国市场近几年的整体经营表现呈现出明显的承压态势。从净收入和利润看，2019—2025 年间，星巴克中国区的收入与盈利均出现波动式下滑，中国市场在其全球体系中的收入和利润占比也由高位逐步回落。
            </p>
          ),
          chart: <ReactECharts option={getStarbucksRevenueOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              这表明，星巴克在中国的增长动能正在减弱，原有依赖品牌溢价和稳定客群的商业模式，难以对冲消费环境变化带来的压力。
            </p>
          ),
          chart: <ReactECharts option={getStarbucksProfitOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              进一步结合门店数据可以发现，尽管星巴克仍在持续开店，但其门店扩张节奏相对温和，未形成通过快速铺店摊薄成本的规模效应。
            </p>
          ),
          chart: <ReactECharts option={getStarbucksStoreOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              在成本端，2022—2025 年间，其门店运营费用和产品分销成本占比始终处于较高水平，且并未随门店增加而显著下降。由此可见，星巴克并未建立起以规模化降本为核心的价格竞争能力，在价格敏感度不断上升的市场环境中，其经营模式对长期价格战的适应性相对受限。
            </p>
          ),
          chart: <ReactECharts option={getStarbucksCostOption()} style={{ height: '100%', width: '100%' }} />
        }
      ]} />

      {/* Block 2: Intro to City Charts */}
      <FullWidthText>
        <p style={{ fontWeight: 'bold', marginBottom: '1em' }}>
          两个品牌在城市层级上的布局差异，直接对应了各自对价格竞争和成本控制的承受能力。
        </p>
      </FullWidthText>

      {/* Scrolly Group 2: City Charts */}
      <ScrollyGroup items={[
        {
          text: (
            <p>
              瑞幸的门店分布明显更加分散，其增长重心持续向二线及以下城市外移。2023—2024 年间，瑞幸在二线、三线及以下城市的门店占比合计已超过一半，且低线城市占比仍在上升。这种布局意味着更低的租金、人力和运营成本，也为高密度铺店和标准化复制提供了空间条件，使规模化降本在空间层面具备可行性。
            </p>
          ),
          chart: <ResponsiveLuckinCityChart />
        },
        {
          text: (
            <p>
              相比之下，星巴克的门店结构高度集中在高线城市。一线与新一线城市始终占据其门店布局的绝对主体，二线及以下城市占比明显偏低。这种空间选择虽然有利于维持品牌形象和客单价，但也意味着更高的固定成本和更弱的成本弹性。
            </p>
          ),
          chart: <ResponsiveStarbucksCityChart />
        }
      ]} />

      {/* Block 3: Conclusion 1 */}
      <FullWidthText>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <p>
            对比不同品牌可以发现，这一轮价格战并非单纯降价，而是以降本为前提的长期策略。通过快速开店和标准化运营摊薄成本，并向低线城市下沉以降低租金与人力支出，咖啡品牌为低价提供了可持续支撑。降价只是结果，门店扩张与市场下沉才是其顺应消费降级的核心机制。
          </p>
        </div>
      </FullWidthText>

      {/* Block 4: Intro to Consumption */}
      <FullWidthText>
        <h3 className="subsection-title" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '30px', borderLeft: '5px solid #d97a00', paddingLeft: '15px', color: '#4B3621' }}>2. 价格理性下的咖啡消费需求</h3>
        <p>
          如果说价格战首先是企业对消费环境变化的回应，那么它真正能否成立，还取决于消费者如何看待和使用这些更低价的咖啡。
        </p>
        <p>
          数据显示，全国咖啡消费者总数接近4亿人，咖啡年消费量达28万吨，中国人均咖啡饮用杯数也从2016年的约9杯/年，增长至2024年的22.24杯/年。
        </p>
      </FullWidthText>

      {/* Scrolly Group 3: Consumption Charts */}
      <ScrollyGroup items={[
        {
          text: (
            <p>
              咖啡的饮用频率呈现上升趋势。每周喝一杯及以上咖啡的消费者占比超过六成，其中每天饮用一杯及以上的重度用户稳定在10个百分点以上，构成市场消费主力军，而基本不喝咖啡的群体占比则在逐年缩小，咖啡无疑成为了当代社会的生活必需品。
            </p>
          ),
          chart: <ReactECharts option={getFrequencyOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              伴随咖啡成为生活刚需，人们对咖啡单杯的成本及价格的关注度随之而来。艾媒咨询的调研数据显示，消费者对单杯价格的接受度有所下降。对比2024年，2025 年，消费者可接受的价格区间明显向中低价位集中，11–20 元区间占比上升，而 21–30 元这一传统主流区间占比下降，高价区间整体收缩。这表明，消费者的价格预期在下降，性价比成为决策的核心，他们更倾向于选择价格可控、性价比更高的产品。价格敏感度的上升，使低价现制咖啡更容易被纳入日常消费，也为前述价格战和高频消费提供了需求侧的现实基础。
            </p>
          ),
          chart: <ReactECharts option={getPriceAcceptanceOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              消费者的实际消费行为也呼应了这一现象。2025年数据显示，中国现制咖啡消费者每月在咖啡饮品上花费100元以内的消费者占比近半成，而月消费150元以上的高消费用户仅占8.96%，相比2022年的23.2%大幅下降。结合价格接受度来看，这意味着大多数消费者并非减少咖啡消费，而是通过选择价格更低的咖啡品牌，通过降低单杯支出、提高消费频率来控制总体预算，实现更频繁的咖啡饮用。
            </p>
          ),
          chart: <ReactECharts option={getMonthConsumptionOption()} style={{ height: '100%', width: '100%' }} />
        }
      ]} />

      {/* Block 5: Intro to Wordcloud */}
      <FullWidthText>
        <p style={{ fontWeight: 'bold', marginBottom: '1em' }}>
          同时，价格理性的提升，也催生了新的消费文化。在社交媒体上，随处可见年轻消费者自发形成的有关消费平价咖啡的讨论。
        </p>
      </FullWidthText>

      {/* Scrolly Group 4: Wordclouds */}
      <ScrollyGroup items={[
        {
          text: (
            <p>
              围绕瑞幸的消费讨论高度集中在价格与省钱逻辑之上。“9.9”“便宜”“性价比”“优惠”“折扣”“薅羊毛”“划算”“平替”“省钱”“预算”等词汇占据核心位置，远高于对口感、风味或品质的描述。这表明消费者谈论瑞幸时，首先关注的并非产品本身，而是价格是否足够低、是否值得买。与此同时，“日常”“通勤”“打工人”“学生”“买得起”等高频词，显示瑞幸已被嵌入一种以控制支出为前提的日常消费场景之中。整体来看，这张词云反映的并不是消费者减少咖啡消费，而是在消费降级语境下，消费者主动通过比价、囤券和选择低价品牌，将咖啡转化为一种可被精打细算地持续消费的日常支出。
            </p>
          ),
          chart: <ReactECharts option={getLuckinWordCloudOption()} style={{ height: '100%', width: '100%' }} />
        },
        {
          text: (
            <p>
              相较于瑞幸，星巴克的词云呈现出一种更矛盾、也更拉扯的消费叙事。一方面，价格相关词汇同样占据核心位置，“价格”“性价比”“优惠”“折扣”等高频出现，说明在消费降级语境下，星巴克同样被纳入了比价和精打细算的讨论框架之中，消费者不再默认接受其原有定价，而是频繁计算值不值、贵不贵、有没有更便宜的买法。另一方面，与瑞幸相比，星巴克词云中“贵”“太贵”“不太值”“值不值”“价格差”等评价性和犹疑性词汇更加突出，显示消费者对其价格的接受度存在更强分化。与瑞幸以低价日常消费为主的明确定位不同，星巴克在消费降级语境下更多被当作需要权衡、对比甚至寻找平替的对象，其品牌溢价正在被反复检验。
            </p>
          ),
          chart: <ReactECharts option={getStarbucksWordCloudOption()} style={{ height: '100%', width: '100%' }} />
        }
      ]} />

      {/* Block 6: Conclusion 2 */}
      <FullWidthText>
        <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <p>
            总体来看，消费降级并未削弱咖啡需求，而是重塑了消费者的消费方式。随着价格敏感度上升，消费者通过压低单杯支出、提高饮用频率，将咖啡重新纳入可负担的日常开销之中。价格理性取代品牌忠诚，性价比成为核心判断标准，低价现制咖啡由此获得稳定需求基础，而中高价咖啡则不断接受“值不值”的现实检验。这种以精打细算为特征的消费转向，构成了价格战能够持续的重要需求前提。
          </p>
        </div>
      </FullWidthText>

      {/* Transition Trigger Element */}
      <div 
        className="transition-trigger-container" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          marginTop: '80px',
          marginBottom: '30vh',
          cursor: 'pointer'
        }}
      >
        <div 
          ref={onCupRef}
          className="coffee-cup-trigger"
          style={{
            position: 'relative',
            width: '200px',
            height: '200px',
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
  );
};

export default PageTwo;
