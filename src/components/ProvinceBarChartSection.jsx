import React from 'react';
import ReactECharts from 'echarts-for-react';
import '../assets/china.js';

const ProvinceBarChartSection = () => {
  const data = [
    {"name": "广东", "value": 41959, "itemStyle": {"areaColor": "#FF0000", "color": "#FF0000"}}, 
    {"name": "浙江", "value": 22496}, 
    {"name": "江苏", "value": 19729}, 
    {"name": "四川", "value": 14078}, 
    {"name": "山东", "value": 11015}, 
    {"name": "上海", "value": 10652}, 
    {"name": "云南", "value": 9975}, 
    {"name": "福建", "value": 8902}, 
    {"name": "北京", "value": 7335}, 
    {"name": "河南", "value": 7024}, 
    {"name": "湖南", "value": 6950}, 
    {"name": "广西", "value": 6812}, 
    {"name": "辽宁", "value": 6503}, 
    {"name": "湖北", "value": 6242}, 
    {"name": "安徽", "value": 6161}, 
    {"name": "河北", "value": 5088}, 
    {"name": "陕西", "value": 4792}, 
    {"name": "重庆", "value": 4414}, 
    {"name": "江西", "value": 4123}, 
    {"name": "贵州", "value": 4071}, 
    {"name": "海南", "value": 3906}, 
    {"name": "新疆", "value": 3498}, 
    {"name": "天津", "value": 3103}, 
    {"name": "吉林", "value": 2921}, 
    {"name": "黑龙江", "value": 2658}, 
    {"name": "山西", "value": 2349}, 
    {"name": "内蒙古", "value": 2147}, 
    {"name": "甘肃", "value": 1668}, 
    {"name": "西藏", "value": 1474}, 
    {"name": "宁夏", "value": 592}, 
    {"name": "青海", "value": 574}
  ];

  const nameMap = {
    "北京市": "北京", "天津市": "天津", "上海市": "上海", "重庆市": "重庆", 
    "新疆维吾尔自治区": "新疆", "广西壮族自治区": "广西", "宁夏回族自治区": "宁夏", 
    "内蒙古自治区": "内蒙古", "西藏自治区": "西藏", "香港特别行政区": "香港", 
    "澳门特别行政区": "澳门", "河北省": "河北", "山西省": "山西", "辽宁省": "辽宁", 
    "吉林省": "吉林", "黑龙江省": "黑龙江", "江苏省": "江苏", "浙江省": "浙江", 
    "安徽省": "安徽", "福建省": "福建", "江西省": "江西", "山东省": "山东", 
    "河南省": "河南", "湖北省": "湖北", "湖南省": "湖南", "广东省": "广东", 
    "海南省": "海南", "四川省": "四川", "贵州省": "贵州", "云南省": "云南", 
    "陕西省": "陕西", "甘肃省": "甘肃", "青海省": "青海", "台湾省": "台湾"
  };

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '2025中国各省份咖啡店数量',
      left: 'center',
      top: 20,
      textStyle: {
        color: '#F0ECE5',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        if (params.value) {
          return params.name + '<br/>咖啡店数量: ' + params.value + ' 家';
        } else {
          return params.name + '<br/>暂无数据';
        }
      }
    },
    toolbox: {
      show: false,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      },
      iconStyle: {
        borderColor: '#F0ECE5'
      }
    },
    visualMap: {
      show: false,
      min: 574,
      max: 22496,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#E0FFFF', '#B2EBF2', '#4DD0E1', '#00ACC1', '#006064']
      },
      left: 'left',
      bottom: '20',
      textStyle: { color: '#F0ECE5' }
    },
    series: [
      {
        name: '咖啡店数量',
        type: 'map',
        map: 'china',
        roam: false,
        zoom: 1.2,
        nameMap: nameMap,
        label: {
          show: true,
          color: 'rgba(0,0,0,0.7)',
          formatter: '{b}'
        },
        emphasis: {
          label: { show: true },
          itemStyle: { areaColor: '#FFD700' }
        },
        data: data
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '900px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default ProvinceBarChartSection;
