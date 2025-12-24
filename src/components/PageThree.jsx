import React from 'react';
import ReactECharts from 'echarts-for-react';
import StickyWordCloudSection from './StickyWordCloudSection';
import CollabCardStack from './CollabCardStack';
import TimelineChart from './TimelineChart';
import coverImg from '../assets/数据新闻-part3素材/2.png';
import titleImg from '../assets/数据新闻-part3素材/3.png';
import section2Img from '../assets/数据新闻-part3素材/5.png';
// import CollabFrequencyChart from './CollabFrequencyChart';
import {
  getLuckinOfficialWordCloudOption,
  getStarbucksOfficialWordCloudOption,
  getConsumptionScenesOption,
  getLuckinUserEmotionWordCloudOption,
  getStarbucksUserEmotionWordCloudOption
} from './chartOptions';

const PageThree = () => {
  const commonTextStyle = {
    color: '#542410',
    fontFamily: '"SimSun", "Songti SC", serif',
    fontSize: '21px',
    lineHeight: '42px',
    textAlign: 'justify'
  };

  const sectionTitleStyle = {
    color: '#000000',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    width: '100%'
  };

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '40px'
  };

  const textColStyle = {
    width: '48%',
    ...commonTextStyle
  };

  const chartColStyle = {
    width: '48%',
    height: '400px',
    backgroundColor: 'transparent',
    borderRadius: '12px',
    padding: '10px'
  };

  const fullWidthTextStyle = {
    width: '100%',
    marginBottom: '40px',
    padding: '0 45px',
    boxSizing: 'border-box',
    ...commonTextStyle
  };

  return (
    <div className="page-three-container" style={{ 
      width: '100%', 
      minHeight: '100vh', 
      backgroundColor: '#f0d4b5', // Light beige background
      padding: '0',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Cover Image */}
      <div style={{ 
        width: '100vw', 
        overflow: 'hidden' 
      }}>
        <img 
          src={coverImg} 
          style={{ 
            width: '100%', 
            height: 'auto',
            display: 'block'
          }} 
          alt="Page Three Cover" 
        />
      </div>

      <div className="page-three-content" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        width: '85%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 0'
      }}>
        {/* Title Image with Overlay Text */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '60px',
          marginBottom: '40px',
          position: 'relative' // Enable absolute positioning for children
        }}>
          <img 
            src={titleImg} 
            style={{ 
              width: '145%', 
              maxWidth: 'none',
              height: 'auto',
              marginLeft: '0%'
            }} 
            alt="咖啡背后的情绪经济" 
          />
          
          {/* Text 1 Overlay */}
          <div style={{
            position: 'absolute',
            top: '35%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '110%', // Match image width scale roughly or keep it constrained
            maxWidth: '1200px', // Optional constraint
            padding: '0 40px',
            boxSizing: 'border-box',
            textAlign: 'justify',
            color: '#542410', // Dark brown color
            fontSize: '21px',
            lineHeight: '42px',
            fontFamily: '"SimSun", "Songti SC", serif'
          }}>
            <p style={{ margin: 0, marginLeft: '20px' }}>
              在“消费降级”的大背景下，咖啡逐渐被赋予新的角色，转变为一种承载情绪、连接文化、激活社交的载体。
            </p>
          </div>

          {/* Text 2 Overlay */}
          <div style={{
            position: 'absolute',
            top: '55%',
            left: 'calc(38% - 55px)', // Adjusted: Moved left by 5px from -50px to -55px
            width: 'calc(65% - 115px)', // Adjusted: Right moved right 20px -> Width increases by 25px (net -115px)
            textAlign: 'justify',
            color: '#542410', // Dark brown color
            fontSize: '21px',
            lineHeight: '42px',
            fontFamily: '"SimSun", "Songti SC", serif'
          }}>
             <p style={{ margin: 0 }}>
              随着现制咖啡价格持续下探，品牌在营销中不再只强调风味或配方，而是通过IP联名、限定活动等方式，为产品叠加文化与情感意涵，塑造更强的品牌吸引力与用户黏性。
            </p>
          </div>
        </div>

        <div style={{
            ...fullWidthTextStyle, 
            marginBottom: '20px',
            fontSize: '21px',
            lineHeight: '42px',
            padding: '0 45px',
            boxSizing: 'border-box',
            marginTop: '42px',
            color: '#542410'
        }}>
            从星巴克与瑞幸这两家代表性企业来看，联名与限定活动正从偶发性的营销事件，转变为常态化的产品策略。数据显示，星巴克自2022年起明显提高了联名与限定活动的频率。瑞幸的节奏则更为密集，近四年间，其联名活动频率更高，截至2025年11月，瑞幸本年度联名及限定次数达47次，月均超过4次。联名已不再是“试水”，而成为可复制、可预期的上新方式。
        </div>

        {/* Timeline Chart Section */}
        <div style={{ width: '100%', marginBottom: '40px' }}>
            <TimelineChart />
        </div>

        <div style={{
            ...fullWidthTextStyle, 
            marginBottom: '40px',
            fontSize: '21px',
            lineHeight: '42px',
            color: '#542410',
            padding: '0 45px',
            boxSizing: 'border-box'
        }}>
            这种策略的转变，也体现在品牌的内容传播中。从两者的小红书官方账号来看，瑞幸的传播重点落在“联名”、“新品”、“打卡”、“纸袋”等，与其快速上新、主打性价比的经营模式相契合。星巴克则更倾向于使用“快乐”、“一起”、“分享”等情感向词汇，呼应其强调社交互动与休闲体验的定位。
        </div>

        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            height: '400px',
            marginBottom: '40px'
        }}>
            <div style={{ width: '48%', height: '100%' }}>
               <ReactECharts option={getLuckinOfficialWordCloudOption()} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ width: '48%', height: '100%' }}>
               <ReactECharts option={getStarbucksOfficialWordCloudOption()} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>

        <p style={{
          ...fullWidthTextStyle,
          fontSize: '21px',
          lineHeight: '42px',
          color: '#542410',
          padding: '0 45px',
          boxSizing: 'border-box'
        }}>
          换言之，咖啡品牌正在通过联名营销与情绪化传播，将一杯咖啡包装为可打卡、可分享、可讨论的社交话题。在价格战日趋白热化的市场中，情绪价值正成为品牌差异化竞争的关键抓手。
        </p>

        {/* Section 2 */}
        <div style={{ 
            width: '120%', 
            marginLeft: '0%', 
            marginTop: '-160px',
            marginBottom: '40px',
            position: 'relative'
        }}>
            <img 
                src={section2Img} 
                style={{ width: '100%', height: 'auto', display: 'block' }} 
                alt="联名咖啡成为低门槛的消费者情绪补给" 
            />
            
            {/* Text Overlay for Section 2 */}
            <div style={{
                position: 'absolute',
                top: 'calc(25% + 100px)', // Adjusted: Moved down by 100px
                left: '10%', // Adjust based on visual needs
                width: '60%',
                color: '#f0e7da', // Updated color
                fontSize: '24px', // Updated font size
                lineHeight: '48px', // Updated line height
                fontFamily: '"SimSun", "Songti SC", serif',
                textAlign: 'justify',
                paddingRight: '50px', // Added right padding
                boxSizing: 'border-box'
            }}>
                当代都市生活中，咖啡已经超越提神饮料的功能，逐步演变为市民调节情绪、表达自我的一种日常仪式。无论是在通勤途中或是休闲时刻，越来越多人习惯用一杯咖啡来“续命”，也为这一寻常动作注入了情感意义。
            </div>
        </div>

        <div style={{ ...rowStyle, marginTop: '60px' }}>
          <div style={{ ...textColStyle, width: '40%', paddingLeft: '45px', boxSizing: 'border-box' }}>
            消费场景的数据印证了这一趋势。2025年，近半数（47.89%）消费者选择在学习或工作时饮用咖啡，另有45.2%的人在休闲放松时将咖啡作为精神补给。相比之下，传统印象中与商务、会议相关的场景并不突出。这说明咖啡的消费动机日益个人化、情绪化。
          </div>
          <div style={{ ...chartColStyle, height: '530px', width: '60%', boxSizing: 'border-box' }}>
            <ReactECharts option={getConsumptionScenesOption()} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        <p style={fullWidthTextStyle}>
          这种消费心态的转变，也深刻影响着年轻人的社交行为与自我表达。越来越多的消费者主动参与品牌联名打卡、收集限定周边、在社交平台分享专属搭配。<br/><br/>
          分析微博等社交平台的热度数据可见联名活动的爆发力，瑞幸与茅台的联名在2023年创造超3.8亿阅读量，与《猫和老鼠》的联名在2024年收获近2.5亿阅读；星巴克与MBTI、费翔等IP或人物的合作同样引发广泛讨论。这些联名之所以能吸引超高热度，正是因为它们触动了消费者的情感记忆与文化认同，让咖啡超越个人消费行为，成为人们记录情怀、表达身份、寻求共鸣的生活仪式。
        </p>

        <div style={{ width: '100%', marginBottom: '40px', marginTop: '-150px' }}>
          <CollabCardStack />
        </div>

        <StickyWordCloudSection 
          items={[
            {
              text: '广受欢迎的联名热潮也同样沉淀在小红书用户的日常讨论中，消费者围绕咖啡的叙事已高度情感化与场景化。在瑞幸的相关讨论中，“打卡”、“好看”、“可爱”与“打工人”高频出现，联名IP也被反复提起。',
              chartOption: getLuckinUserEmotionWordCloudOption()
            },
            {
              text: '星巴克的“氛围”、“仪式感”、“出片”、“治愈”等词则显示用户通过购买与分享获取即时情绪补给。对许多为了情怀买单的消费者而言，联名咖啡是具备情绪满足和收藏价值的记忆载体，回应了他们对情绪价值与社交表达的双重需求。',
              chartOption: getStarbucksUserEmotionWordCloudOption()
            }
          ]} 
        />

        <p style={fullWidthTextStyle}>
          情绪经济的成功，恰因它精准切中了现代生活的一种普遍心态：人们渴望在日常的微小消费中，获得即时的慰藉与确幸。用一杯平价的咖啡，换取片刻的情绪舒缓和无需言说的社交默契。这种广泛而真切的心理共鸣，让咖啡持续融入更多的生活场景与消费周期之中，为品牌创造了可持续的情感连接，进而支撑了整个市场的渗透与扩容。
        </p>
      </div>
    </div>
  );
};

export default PageThree;
