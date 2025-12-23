import React from 'react';
import ReactECharts from 'echarts-for-react';

const ComparisonChartSection = () => {
  const csvData = {
    '年份': ['2020', '2021', '2022', '2023', '2024', '2025'],
    '中国咖啡行业市场规模（亿元）': [3000, 3817, 4895, 6235, 7893, 10027], 
    '中国咖啡行业市场规模增长率': ['', 0.272, 0.282, 0.274, 0.266, 0.27],
    '中国现制咖啡市场规模（亿元）': [751.9, 924.5, 1223.1, 1623.5, 1930.4, 2238.4],
    '中国现制咖啡市场规模增长率': ['', '23.0%', '0.323', '32.7%', '18.9%', '16.0%'] 
  };

  const formatGrowthRate = (data) => {
    return data.map(item => {
        if (!item || item === '') return '-';
        if (String(item).includes('%')) {
            return parseFloat(String(item).replace(/%E?$/, ''));
        }
        let value = parseFloat(item);
        if (!isNaN(value) && value < 2) { 
            return (value * 100).toFixed(1);
        }
        return item;
    });
  };

  const formattedData = {
    '年份': csvData['年份'],
    '中国咖啡行业市场规模（亿元）': csvData['中国咖啡行业市场规模（亿元）'],
    '中国现制咖啡市场规模（亿元）': csvData['中国现制咖啡市场规模（亿元）'],
    '中国咖啡行业市场规模增长率（%）': formatGrowthRate(csvData['中国咖啡行业市场规模增长率']),
    '中国现制咖啡市场规模增长率（%）': formatGrowthRate(csvData['中国现制咖啡市场规模增长率'])
  };

  const option = {
    backgroundColor: 'transparent',
    title: {
      text: '中国咖啡行业市场规模及现制咖啡市场规模对比（2020—2025E）',
      left: 'center',
      textStyle: { fontSize: 16, color: '#F0ECE5' }
    },
    color: [
      '#5470C6', // 柱状图 1
      '#91CC75', // 柱状图 2
      '#EE6666', // 折线图 1
      '#FAC858'  // 折线图 2
    ],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
      formatter: function (params) {
        if (!params || params.length === 0) return '';
        let res = params[0].name + '<br/>';
        params.forEach(function (item) {
            if (item.value !== null && item.value !== undefined) {
                let unit = '';
                if (item.seriesName && item.seriesName.includes('亿元')) { unit = ' 亿元'; } 
                else if (item.seriesName && item.seriesName.includes('增长率')) { unit = ' %'; }
                res += item.marker + item.seriesName + ': ' + item.value + unit + '<br/>';
            }
        });
        return res;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    legend: {
      data: [
        '中国咖啡行业市场规模（亿元）',
        '中国现制咖啡市场规模（亿元）',
        '中国咖啡行业市场规模增长率（%）',
        '中国现制咖啡市场规模增长率（%）'
      ],
      bottom: 0,
      width: '80%',
      left: 'center',
      textStyle: { color: '#F0ECE5' }
    },
    xAxis: [
      {
        type: 'category', 
        data: formattedData['年份'], 
        axisPointer: { type: 'shadow' },
        axisLabel: { color: '#F0ECE5' },
        axisLine: { lineStyle: { color: '#F0ECE5' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '市场规模 (亿元)',
        min: 0,
        axisLabel: { formatter: '{value}', color: '#F0ECE5' },
        nameTextStyle: { padding: [0, 0, 0, 50], color: '#F0ECE5' },
        axisLine: { lineStyle: { color: '#F0ECE5' } },
        splitLine: { lineStyle: { color: 'rgba(240, 236, 229, 0.2)' } }
      },
      {
        type: 'value',
        name: '增长率 (%)',
        axisLabel: { formatter: '{value} %', color: '#F0ECE5' },
        nameTextStyle: { padding: [0, 50, 0, 0], color: '#F0ECE5' },
        axisLine: { lineStyle: { color: '#F0ECE5' } },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '中国咖啡行业市场规模（亿元）', type: 'bar',
        tooltip: { valueFormatter: function (value) { return value + ' 亿元'; } },
        data: formattedData['中国咖啡行业市场规模（亿元）']
      },
      {
        name: '中国现制咖啡市场规模（亿元）', type: 'bar',
        tooltip: { valueFormatter: function (value) { return value + ' 亿元'; } },
        data: formattedData['中国现制咖啡市场规模（亿元）']
      },
      {
        name: '中国咖啡行业市场规模增长率（%）', type: 'line', yAxisIndex: 1, 
        color: '#EE6666', 
        tooltip: { valueFormatter: function (value) { return value + ' %'; } },
        data: formattedData['中国咖啡行业市场规模增长率（%）']
      },
      {
        name: '中国现制咖啡市场规模增长率（%）', type: 'line', yAxisIndex: 1, 
        color: '#FAC858', 
        tooltip: { valueFormatter: function (value) { return value + ' %'; } },
        data: formattedData['中国现制咖啡市场规模增长率（%）']
      }
    ]
  };

  return (
    <div style={{ width: '100%', height: '550px' }}>
      <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default ComparisonChartSection;
