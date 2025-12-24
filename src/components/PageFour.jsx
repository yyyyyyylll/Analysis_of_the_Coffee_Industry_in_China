import React from 'react';
import bgImg from '../assets/part4_assets/bg.png';
import titleImg from '../assets/part4_assets/3.png';
import img4 from '../assets/part4_assets/4.png';
import img5 from '../assets/part4_assets/5.png';
import img6 from '../assets/part4_assets/6.png';

const PageFour = () => {
  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      backgroundImage: `url(${bgImg})`,
      backgroundRepeat: 'repeat-y',
      backgroundSize: '100% auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '50px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '90%', marginBottom: '30px' }}>
          <img src={titleImg} alt="Page Four Title" style={{ width: '100%', display: 'block' }} />
          <div style={{ 
            position: 'absolute', 
            top: '0', 
            left: '0', 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <div style={{ width: '80%', color: '#f0e7da', fontFamily: '"SimSun", "Songti SC", serif', fontSize: '21px', lineHeight: '42px', textAlign: 'justify' }}>
              <p style={{ marginBottom: '20px', fontSize: '24px', lineHeight: '48px', marginLeft: '-20px', marginTop: '280px' }}>
                中国咖啡市场在宏观消费波动中表现出的增长韧性，是供需双方在价格理性与情绪感性之间达成新平衡的结果。
              </p>
              <p style={{ marginLeft: '400px', marginTop: '90px' }}>
                从供给端看，现制咖啡逐步成为行业扩容引擎。本土连锁品牌通过标准化运营、供应链优化和门店扩张，显著降低了单杯成本。其中，瑞幸在这一轮市场调整中展现出较强的适应能力，通过高密度的下沉市场布局以及规模效应带来的议价能力，实现了系统性降本。这种策略将咖啡从高溢价的品牌消费拉回到高频次的日常消费，使其在空间分布与价格门槛上均实现了对大众市场的深度渗透。
              </p>
            </div>
          </div>
        </div>
        
        <img src={img4} alt="Part 4 Illustration" style={{ width: '80%', height: 'auto', marginTop: '-85px', marginBottom: '30px', position: 'relative', zIndex: 2 }} />
        
        <div style={{ width: 'calc(80% - 80px)', color: '#f0e7da', fontFamily: '"SimSun", "Songti SC", serif', fontSize: '21px', lineHeight: '42px', textAlign: 'justify', marginBottom: '50px', marginTop: '-450px', position: 'relative', zIndex: 3 }}>
          <p style={{ textIndent: '2em' }}>
            不过，主打低价的发展模式未必适用于所有品牌。对于长期依赖品牌溢价和空间体验的企业而言，市场节奏的变化带来了明显压力。以星巴克为例，其在中国市场的经营表现近年出现波动。在价格竞争加剧、本土品牌加速扩张的环境下，原有模式的适应性受到挑战，相关业务调整也反映出其对市场变化的回应。
          </p>
        </div>
        
        <div style={{ width: '80%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px', position: 'relative', zIndex: 3, marginTop: '-340px' }}>
          <div style={{ width: '50%', color: '#f0e7da', fontFamily: '"SimSun", "Songti SC", serif', fontSize: '21px', lineHeight: '42px', textAlign: 'justify', paddingRight: '20px', paddingLeft: '40px', boxSizing: 'border-box' }}>
            <p style={{ textIndent: '2em' }}>
              从需求端看，消费者决策逻辑发生了明显转变。性价比已超越品牌光环成为主要决策依据，但在物质支出精简的同时，消费行为被赋予了更多的情感诉求。高频次的IP联名与社交媒体传播，契合都市人群对即时慰藉与文化认同的渴望。咖啡不再仅仅是功能性提神饮料，更通过低门槛的参与感，成为年轻群体进行情感调节与社交表达的仪式化载体。
            </p>
          </div>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'flex-end' }}>
            <img src={img5} alt="Part 4 Illustration 2" style={{ width: '200%', height: 'auto', display: 'block', maxWidth: 'none', marginRight: '-40px', clipPath: 'inset(0 0 50% 0)', marginTop: '300px' }} />
          </div>
        </div>
        
        <div style={{ width: '88%', marginTop: '-300px', marginBottom: '-70px', position: 'relative', zIndex: 3 }}>
          <img src={img6} alt="Part 4 Illustration 3" style={{ width: '100%', height: 'auto', display: 'block' }} />
          <div style={{
            position: 'absolute',
            top: 'calc(50% - 137px)',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            padding: '0 20px',
            boxSizing: 'border-box',
            color: '#542410',
            fontFamily: '"SimSun", "Songti SC", serif',
            fontSize: '24px',
            lineHeight: '48px',
            textAlign: 'justify'
          }}>
            <p style={{ margin: 0, textIndent: '2em' }}>
              总之，中国咖啡市场的竞争正从单纯的品牌区隔，转向效率、价格与附加价值的综合比拼。在价格敏感度持续上升的背景下，企业能否通过成本控制与运营调整保持产品吸引力，将在很大程度上影响其在未来市场中的位置。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageFour;
