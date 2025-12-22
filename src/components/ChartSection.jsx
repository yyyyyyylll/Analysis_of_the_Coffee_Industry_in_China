import React from 'react';
import ReactECharts from 'echarts-for-react';

const ChartSection = () => {
  // 整理后的数据
  const csvData = {
    '年份': ['2020', '2021', '2022', '2023', '2024', '2025E'],
    '中国社会消费品零售总额增长率（%）': ['-', 12.5, -0.2, 7.2, 3.5, '5'],
    '中国新式茶饮市场规模（亿元）': [1840.3, 2795.9, 2938.5, 3333.8, 3547.2, 3749.3],
    '中国新式茶饮市场规模增长率': ['-', 0.519, 0.051, 0.135, 0.064, 0.057],
    '中国咖啡行业市场规模（亿元）': [3000, 3817, 4895, 6235, 7893, 10027],
    '中国咖啡行业市场规模增长率': ['-', 0.272, 0.282, 0.274, 0.266, 0.27]
  };

  // 预处理数据：将原始增长率（如 0.519）转换为百分比
  const formatGrowthRate = (data) => {
    return data.map(item => {
      if (typeof item === 'number') {
        return (item * 100).toFixed(1);
      }
      return item; // 保持 '-' 或已有的百分比值不变
    });
  };

  const formattedData = {
    '年份': csvData['年份'],
    // 柱状图数据 (市场规模)
    '中国新式茶饮市场规模（亿元）': csvData['中国新式茶饮市场规模（亿元）'],
    '中国咖啡行业市场规模（亿元）': csvData['中国咖啡行业市场规模（亿元）'],
    // 折线图数据 (增长率)，转换为百分比
    '中国社会消费品零售总额增长率（%）': csvData['中国社会消费品零售总额增长率（%）'],
    '中国新式茶饮市场规模增长率（%）': formatGrowthRate(csvData['中国新式茶饮市场规模增长率']),
    '中国咖啡行业市场规模增长率（%）': formatGrowthRate(csvData['中国咖啡行业市场规模增长率'])
  };

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '中国社会消费品零售总额、咖啡与新式茶饮\n市场规模及增速对比（2020—2025E）',
      left: 'center',
      textStyle: {
        fontSize: 16,
        color: '#F0ECE5', // 使用浅色以在深色背景上显示
        fontFamily: 'sans-serif', // 清晰易读的字体
        lineHeight: 24
      },
      top: 0
    },
    // 设置新的颜色方案
    color: [
      '#5470C6', // 默认颜色 1 (用于茶饮市场规模柱)
      '#91CC75', // 默认颜色 2 (用于咖啡市场规模柱)
      '#FF8C00', // 橙色 (用于社会消费品增长率线)
      '#191970', // 深蓝色 (用于咖啡增长率线)
      '#87CEFA'  // 浅蓝色 (用于茶饮增长率线)
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: { color: '#999' }
      },
      formatter: function (params) {
        let res = params[0].name + '<br/>';
        params.forEach(function (item) {
          let unit = '';
          if (item.seriesName.includes('亿元')) {
            unit = ' 亿元';
          } else if (item.seriesName.includes('增长率') || item.seriesName.includes('增速')) {
            unit = ' %';
          }
          res += item.marker + item.seriesName + ': ' + (item.value !== '-' ? item.value : '无数据') + unit + '<br/>';
        });
        return res;
      }
    },
    legend: {
      data: [
        '中国新式茶饮市场规模（亿元）',
        '中国咖啡行业市场规模（亿元）',
        '中国社会消费品零售总额增长率（%）',
        '中国咖啡行业市场规模增长率（%）',
        '中国新式茶饮市场规模增长率（%）'
      ],
      bottom: 0,
      type: 'plain', // 取消翻页，显示全部
      width: '90%', // 增加宽度，确保能在一行或多行放下
      itemGap: 15,
      textStyle: {
          color: '#F0ECE5',
          fontSize: 10
      }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '12%', // 减小底部边距，让图例离图表更近
        containLabel: true,
        top: '18%' // 增加顶部边距，给两行标题留出空间
    },
    xAxis: [
      {
        type: 'category',
        data: formattedData['年份'],
        axisPointer: { type: 'shadow' },
        axisLabel: { color: '#F0ECE5' }
      }
    ],
    yAxis: [
      // Y轴 0: 市场规模 (亿元) - 对应柱状图
      {
        type: 'value',
        name: '市场规模 (亿元)',
        min: 0,
        axisLabel: { formatter: '{value}', color: '#F0ECE5' },
        nameTextStyle: { padding: [0, 0, 0, 0], color: '#F0ECE5' },
        splitLine: { 
          show: true, 
          lineStyle: { color: 'rgba(240, 236, 229, 0.2)' } 
        },
        axisLine: {
          show: true,
          lineStyle: { color: '#F0ECE5' }
        }
      },
      // Y轴 1: 增长率 (%) - 对应折线图
      {
        type: 'value',
        name: '增长率 (%)',
        axisLabel: { formatter: '{value} %', color: '#F0ECE5' },
        nameTextStyle: { padding: [0, 0, 0, 0], color: '#F0ECE5' },
        splitLine: { show: false },
        axisLine: {
          show: true,
          lineStyle: { color: '#F0ECE5' }
        }
      }
    ],
    series: [
      // 柱状图 1: 中国新式茶饮市场规模 (yAxis[0])
      {
        name: '中国新式茶饮市场规模（亿元）',
        type: 'bar',
        tooltip: { valueFormatter: function (value) { return value + ' 亿元'; } },
        data: formattedData['中国新式茶饮市场规模（亿元）']
      },
      // 柱状图 2: 中国咖啡行业市场规模 (yAxis[0])
      {
        name: '中国咖啡行业市场规模（亿元）',
        type: 'bar',
        tooltip: { valueFormatter: function (value) { return value + ' 亿元'; } },
        data: formattedData['中国咖啡行业市场规模（亿元）']
      },
      // 折线图 1: 社会消费品零售总额增长率 (yAxis[1], 橙色)
      {
        name: '中国社会消费品零售总额增长率（%）',
        type: 'line',
        yAxisIndex: 1,
        color: '#FF8C00', // 橙色
        tooltip: { valueFormatter: function (value) { return value + ' %'; } },
        data: formattedData['中国社会消费品零售总额增长率（%）']
      },
      // 折线图 2: 中国咖啡行业市场规模增长率 (yAxis[1], 深蓝色)
      {
        name: '中国咖啡行业市场规模增长率（%）',
        type: 'line',
        yAxisIndex: 1,
        color: '#DA70D6', // 淡紫色 - 原深蓝色在深底色下不可见
        tooltip: { valueFormatter: function (value) { return value + ' %'; } },
        data: formattedData['中国咖啡行业市场规模增长率（%）']
      },
      // 折线图 3: 中国新式茶饮市场规模增长率 (yAxis[1], 浅蓝色)
      {
        name: '中国新式茶饮市场规模增长率（%）',
        type: 'line',
        yAxisIndex: 1,
        color: '#ADD8E6', // 浅蓝色
        tooltip: { valueFormatter: function (value) { return value + ' %'; } },
        data: formattedData['中国新式茶饮市场规模增长率（%）']
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default ChartSection;
