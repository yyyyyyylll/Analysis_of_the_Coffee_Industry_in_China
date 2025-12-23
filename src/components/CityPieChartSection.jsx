import React from 'react';
import ReactECharts from 'echarts-for-react';

const CityPieChartSection = () => {
  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '2025中国咖啡城市分布情况',
      left: 'center',
      top: 30,
      textStyle: {
        color: '#F0ECE5',
        fontSize: 16,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c}% ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '2025年咖啡城市分布',
        type: 'pie',
        radius: '55%',
        center: ['50%', '50%'],
        data: [
          { value: 14.1, name: '一线城市' },
          { value: 23.5, name: '新一线城市' },
          { value: 18.2, name: '二线城市' },
          { value: 44.2, name: '三四线及以下城市' }
        ],
        itemStyle: {
          borderColor: '#F0ECE5',
          borderWidth: 2
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.4)'
          }
        },
        label: {
          formatter: '{b}\n{c}%',
          color: '#F0ECE5'
        }
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default CityPieChartSection;
