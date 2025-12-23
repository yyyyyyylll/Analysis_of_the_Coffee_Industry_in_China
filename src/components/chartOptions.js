import * as echarts from 'echarts';

// Helper for wordcloud colors
const luckinColors = {
  darkBlues: ["#1F4E79", "#1E3A5F", "#2B579A"],
  lightBlues: ["#8EC1E8", "#A9D5F5", "#B7DFF7"],
  browns: ["#8B6B4F", "#A07B5A"],
  greys: ["#6F6F6F", "#8A8A8A"]
};

const starbucksColors = {
  darkGreens: ["#2F6F55", "#3A7F63", "#2C6650"],
  lightGreens: ["#A8D5BA", "#BFE3C9", "#CFEBD6"],
  browns: ["#8B6B4F", "#A07B5A"],
  greys: ["#6F6F6F", "#8A8A8A"]
};

function pickLuckinColor() {
  const r = Math.random();
  if (r < 0.40) return luckinColors.darkBlues[Math.floor(Math.random() * luckinColors.darkBlues.length)];
  if (r < 0.70) return luckinColors.lightBlues[Math.floor(Math.random() * luckinColors.lightBlues.length)];
  if (r < 0.90) return luckinColors.browns[Math.floor(Math.random() * luckinColors.browns.length)];
  return luckinColors.greys[Math.floor(Math.random() * luckinColors.greys.length)];
}

function pickStarbucksColor() {
  const r = Math.random();
  if (r < 0.40) return starbucksColors.darkGreens[Math.floor(Math.random() * starbucksColors.darkGreens.length)];
  if (r < 0.70) return starbucksColors.lightGreens[Math.floor(Math.random() * starbucksColors.lightGreens.length)];
  if (r < 0.90) return starbucksColors.browns[Math.floor(Math.random() * starbucksColors.browns.length)];
  return starbucksColors.greys[Math.floor(Math.random() * starbucksColors.greys.length)];
}

export const getLuckinRevenueOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '瑞幸2019-2024总净收入及增长率',
    left: 'center',
    top: 10,
    textStyle: { color: '#4B3621', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
  },
  legend: {
    top: 45,
    data: ['总净收入', '净收入增长率']
  },
  grid: {
    top: 90,
    left: '8%',
    right: '8%',
    bottom: '12%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['2019', '2020', '2021', '2022', '2023', '2024'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '总净收入（亿元）',
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '增长率（%）',
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '总净收入',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: { color: '#8EC1E8' },
      tooltip: { valueFormatter: value => value + ' 亿元' },
      data: [30.25, 40.33, 79.65, 132.93, 249.03, 326.89] // 2024E estimated as average or sum
    },
    {
      name: '净收入增长率',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#D64545', width: 3 },
      itemStyle: { color: '#D64545' },
      tooltip: { valueFormatter: value => value + ' %' },
      data: [259.8, 33.3, 97.5, 66.9, 87.3, 31.2]
    }
  ]
});

export const getLuckinProfitOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '瑞幸2019-2024营业利润及营业利润率',
    left: 'center',
    top: 10,
    textStyle: { color: '#000', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
  },
  legend: { top: 45, data: ['营业利润', '营业利润率'] },
  grid: { top: 90, left: '8%', right: '8%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['2019', '2020', '2021', '2022', '2023', '2024'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '营业利润（亿元）',
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '营业利润率（%）',
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '营业利润',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: {
        color: params => params.value >= 0 ? '#8EC1E8' : '#D6EAF8'
      },
      tooltip: { valueFormatter: value => value + ' 亿元' },
      data: [-32.12, -25.87, -5.39, 11.56, 30.26, 40.54]
    },
    {
      name: '营业利润率',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#D64545', width: 3 },
      itemStyle: { color: '#D64545' },
      tooltip: { valueFormatter: value => value + ' %' },
      data: [-106.2, -64.1, -6.8, 8.7, 12.1, 12.4]
    }
  ]
});

export const getLuckinCostOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '瑞幸2019-2024运营费用情况',
    left: 'center',
    top: 10,
    textStyle: { color: '#000', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
    formatter: function (params) {
      var year = params && params.length ? params[0].axisValue : '';
      var lines = [year];
      params.forEach(function (p) {
        if (p.seriesName === '总运营费用') lines.push(p.marker + ' 总运营费用：' + p.value + ' 亿元');
        if (p.seriesName === '材料成本占比') {
          var cost1 = (p.data && p.data.cost != null) ? p.data.cost : '-';
          lines.push(p.marker + ' ①材料成本：' + cost1 + ' 亿元');
          lines.push('　　②材料成本占比：' + p.value + '%');
        }
        if (p.seriesName === '门店运营费用占比') {
          var cost2 = (p.data && p.data.cost != null) ? p.data.cost : '-';
          lines.push(p.marker + ' ①门店运营费用：' + cost2 + ' 亿元');
          lines.push('　　②门店运营费用占比：' + p.value + '%');
        }
      });
      return lines.join('<br/>');
    }
  },
  legend: { top: 45, data: ['总运营费用', '材料成本占比', '门店运营费用占比'] },
  grid: { top: 90, left: '8%', right: '8%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['2019', '2020', '2021', '2022', '2023', '2024'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '总运营费用（亿元）',
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '占净收入比重（%）',
      min: 0,
      max: 100,
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '总运营费用',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: { color: '#8EC1E8' },
      data: [62.37, 66.20, 85.04, 121.37, 218.77, 286.35]
    },
    {
      name: '材料成本占比',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#2F6BFF', width: 3 },
      data: [
        { value: 47.9, cost: 14.49 },
        { value: 43.1, cost: 17.38 },
        { value: 40.5, cost: 32.26 },
        { value: 39.7, cost: 52.77 },
        { value: 45.3, cost: 112.81 },
        { value: 46.5, cost: 152.00 }
      ]
    },
    {
      name: '门店运营费用占比',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#D64545', width: 3 },
      data: [
        { value: 57.7, cost: 17.45 },
        { value: 58.0, cost: 23.39 },
        { value: 46.4, cost: 36.95 },
        { value: 43.9, cost: 58.35 },
        { value: 38.8, cost: 96.62 },
        { value: 40.8, cost: 133.37 }
      ]
    }
  ]
});

export const getStarbucksRevenueOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '星巴克2019-2025中国净收入及占国际净收入比重',
    left: 'center',
    top: 10,
    textStyle: { color: '#000', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
  },
  legend: { top: 45, data: ['中国净收入', '中国净收入占国际比重'] },
  grid: { top: 90, left: '8%', right: '8%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '中国净收入（百万美元）',
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '占国际比重（%）',
      min: 0,
      max: 100,
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '中国净收入',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: { color: '#A8D5A2' },
      tooltip: { valueFormatter: value => value + ' 百万美元' },
      data: [2872.0, 2582.8, 3674.8, 3008.3, 3081.5, 3008.2, 3160.8]
    },
    {
      name: '中国净收入占国际比重',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#5B3A29', width: 3 },
      itemStyle: { color: '#5B3A29' },
      tooltip: { valueFormatter: value => value + ' %' },
      data: [45.45, 49.38, 53.09, 43.35, 41.15, 40.99, 40.42]
    }
  ]
});

export const getStarbucksProfitOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '星巴克2019-2025利润情况及占全球利润比重',
    left: 'center',
    top: 10,
    textStyle: { color: '#000', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
  },
  legend: { top: 45, data: ['中国利润', '中国利润占全球利润比重'] },
  grid: { top: 90, left: '8%', right: '8%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '中国利润（百万美元）',
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '占全球利润比重（%）',
      min: 0,
      max: 100,
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '中国利润',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: { color: '#A8D5A2' },
      tooltip: { valueFormatter: value => value + ' 百万美元' },
      data: [1635.77, 458.38, 2229.48, 1422.46, 1697.43, 1541.59, 750.36]
    },
    {
      name: '中国利润占全球利润比重',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#5B3A29', width: 3 },
      itemStyle: { color: '#5B3A29' },
      tooltip: { valueFormatter: value => value + ' %' },
      data: [45.45, 49.38, 53.09, 43.35, 41.15, 40.99, 40.42]
    }
  ]
});

export const getStarbucksStoreOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '星巴克2017-2025中国门店总数及变化情况',
    left: 'center',
    top: 10,
    textStyle: { color: '#000', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
  },
  legend: { top: 45, data: ['中国门店总数', '中国新增门店数'] },
  grid: { top: 90, left: '8%', right: '8%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '门店总数（家）',
      max: 10000,
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '新增门店数（家）',
      max: 1000,
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}' }
    }
  ],
  series: [
    {
      name: '中国门店总数',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: { color: '#A8D5A2' },
      tooltip: { valueFormatter: value => value + ' 家' },
      data: [1540, 3521, 4123, 4704, 5358, 6019, 6804, 7594, 8009]
    },
    {
      name: '中国新增门店数',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#5B3A29', width: 3 },
      itemStyle: { color: '#5B3A29' },
      tooltip: { valueFormatter: value => value + ' 家' },
      data: [285, 528, 629, 613, 697, 724, 857, 855, 569]
    }
  ]
});

export const getStarbucksCostOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '星巴克2022-2025运营费用情况',
    left: 'center',
    top: 10,
    textStyle: { color: '#000', fontSize: 16, fontWeight: 'bold' }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
    formatter: function (params) {
      var year = params && params.length ? params[0].axisValue : '';
      var lines = [year];
      params.forEach(function (p) {
        if (p.seriesName === '中国总运营费用') lines.push(p.marker + ' 中国总运营费用：' + p.value + ' 百万美元');
        if (p.seriesName === '产品和分销成本占比') {
          var cost1 = (p.data && p.data.cost != null) ? p.data.cost : '-';
          lines.push(p.marker + ' ①中国产品和分销成本：' + cost1 + ' 百万美元');
          lines.push('　　②产品和分销成本占比：' + p.value + '%');
        }
        if (p.seriesName === '门店运营费用占比') {
          var cost2 = (p.data && p.data.cost != null) ? p.data.cost : '-';
          lines.push(p.marker + ' ①中国门店运营费用：' + cost2 + ' 百万美元');
          lines.push('　　②门店运营费用占比：' + p.value + '%');
        }
      });
      return lines.join('<br/>');
    }
  },
  legend: { top: 45, data: ['中国总运营费用', '产品和分销成本占比', '门店运营费用占比'] },
  grid: { top: 90, left: '8%', right: '8%', bottom: '12%', containLabel: true },
  xAxis: {
    type: 'category',
    data: ['2022', '2023', '2024', '2025'],
    axisPointer: { type: 'shadow' }
  },
  yAxis: [
    {
      type: 'value',
      name: '中国总运营费用（百万美元）',
      axisLine: { show: true },
      splitLine: { show: true, lineStyle: { type: 'dashed' } },
      axisLabel: { formatter: '{value}' }
    },
    {
      type: 'value',
      name: '占净收入比重（%）',
      min: 0,
      max: 100,
      axisLine: { show: true },
      splitLine: { show: false },
      axisLabel: { formatter: '{value}%' }
    }
  ],
  series: [
    {
      name: '中国总运营费用',
      type: 'bar',
      barMaxWidth: 40,
      itemStyle: { color: '#A8D5A2' },
      data: [2648.13, 2576.04, 2581.05, 2776.08]
    },
    {
      name: '产品和分销成本占比',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#2F6BFF', width: 3 },
      data: [{ value: 34, cost: 1021.98 }, { value: 34.8, cost: 1073.48 }, { value: 35.1, cost: 1055.57 }, { value: 35.2, cost: 1111.47 }]
    },
    {
      name: '门店运营费用占比',
      type: 'line',
      yAxisIndex: 1,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#D64545', width: 3 },
      data: [{ value: 38.9, cost: 1171.14 }, { value: 36.9, cost: 1136.32 }, { value: 38.4, cost: 1155.67 }, { value: 39.5, cost: 1247.2 }]
    }
  ]
});

// City Distribution Options (Simplified without complex polygon graphics for now to ensure stability)
export const getLuckinCityOption = (width = 600, height = 400) => {
  const rawData = [
    [0.18, 0.16], // 一线
    [0.27, 0.25], // 新一线
    [0.29, 0.30], // 二线
    [0.16, 0.18], // 三线
    [0.10, 0.11]  // 三线及以下
  ];
  const color = ['#2E7D32', '#1565C0', '#EF6C00', '#6A1B9A', '#C62828'];
  const seriesNames = ['一线城市', '新一线城市', '二线城市', '三线城市', '三线及以下城市'];
  
  // Transpose logic for stacked bar if needed, but here it's simpler
  // Data structure: each series has [2023_val, 2024_val]
  const series = seriesNames.map((name, sid) => ({
    name,
    type: 'bar',
    stack: 'total',
    barWidth: '60%',
    itemStyle: { color: color[sid] },
    label: { show: true, formatter: p => p.value ? (Math.round(p.value * 1000) / 10) + '%' : '' },
    data: rawData[sid]
  }));

  return {
    backgroundColor: 'transparent',
    title: { text: '2023-2024瑞幸城市分布情况', left: 'center', top: 10, textStyle: { fontSize: 16, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: v => (Math.round(v * 1000) / 10) + '%' },
    legend: { top: 45, data: seriesNames },
    grid: { left: '10%', right: '10%', top: 90, bottom: 60, containLabel: true },
    xAxis: { type: 'category', data: ['2023', '2024'] },
    yAxis: { type: 'value', name: '百分比（%）', min: 0, max: 1, axisLabel: { formatter: v => Math.round(v * 100) + '%' } },
    series
  };
};

export const getStarbucksCityOption = (width = 600, height = 400) => {
  const rawData = [
    [0.3008, 0.3165],
    [0.3091, 0.3350],
    [0.1688, 0.1899],
    [0.0820, 0.0963],
    [0.0479, 0.0623]
  ];
  const color = ['#2E7D32', '#1565C0', '#EF6C00', '#6A1B9A', '#C62828'];
  const seriesNames = ['一线城市', '新一线城市', '二线城市', '三线城市', '三线及以下城市'];
  
  const series = seriesNames.map((name, sid) => ({
    name,
    type: 'bar',
    stack: 'total',
    barWidth: '60%',
    itemStyle: { color: color[sid] },
    label: { show: true, formatter: p => p.value ? (Math.round(p.value * 1000) / 10) + '%' : '' },
    data: rawData[sid]
  }));

  return {
    backgroundColor: 'transparent',
    title: { text: '2023-2024星巴克城市分布情况', left: 'center', top: 10, textStyle: { fontSize: 16, fontWeight: 'bold' } },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, valueFormatter: v => (Math.round(v * 1000) / 10) + '%' },
    legend: { top: 45, data: seriesNames },
    grid: { left: '10%', right: '10%', top: 90, bottom: 60, containLabel: true },
    xAxis: { type: 'category', data: ['2023', '2024'] },
    yAxis: { type: 'value', name: '百分比（%）', min: 0, max: 1, axisLabel: { formatter: v => Math.round(v * 100) + '%' } },
    series
  };
};

export const getFrequencyOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '2025年中国消费者咖啡饮用频率',
    subtext: '内圈：大类占比 | 外圈：详细占比',
    left: 'center',
    top: 10,
    textStyle: { fontSize: 26, fontWeight: 'bold' }
  },
  tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
  series: [
    {
      name: '大类占比',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],
      label: { position: 'inner', fontSize: 14, color: '#fff' },
      labelLine: { show: false },
      data: [
        { value: 62.4, name: '一周一杯及以上', itemStyle: { color: '#5470c6' } },
        { value: 37.6, name: '一周不到一杯', itemStyle: { color: '#91cc75' } }
      ]
    },
    {
      name: '详细占比',
      type: 'pie',
      radius: ['45%', '60%'],
      labelLine: { length: 30 },
      label: {
        formatter: '{b|{b}}\n{hr|}\n{c|{c}%}',
        rich: {
          b: { fontSize: 16, lineHeight: 33, align: 'center' },
          hr: { borderColor: '#aaa', width: '100%', borderWidth: 0.5, height: 0 },
          c: { fontSize: 16, lineHeight: 33, align: 'center' }
        }
      },
      data: [
        { value: 11.2, name: '每天一杯及以上' },
        { value: 24.5, name: '每周2-3杯' },
        { value: 26.7, name: '每周一杯' },
        { value: 26.3, name: '每月2-3杯' },
        { value: 11.3, name: '每月一杯及以下' }
      ]
    }
  ]
});

export const getPriceAcceptanceOption = () => ({
  backgroundColor: 'transparent',
  title: {
    text: '2024-2025年中国消费者咖啡单杯价格接受度',
    left: 'center',
    top: 20,
    textStyle: { fontSize: 24, fontWeight: 'bold' }
  },
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: { top: 60, data: ['2024年', '2025年'] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true, top: 100 },
  xAxis: { type: 'value', boundaryGap: [0, 0.01], axisLabel: { formatter: '{value}%' } },
  yAxis: { type: 'category', data: ['50元以上', '41-50元', '31-40元', '21-30元', '11-20元', '10元以下'] },
  series: [
    {
      name: '2024年',
      type: 'bar',
      data: [1.3, 3.8, 18.6, 39.4, 28.5, 8.4],
      itemStyle: { color: '#91cc75' }
    },
    {
      name: '2025年',
      type: 'bar',
      data: [0.9, 2.5, 14.2, 35.6, 36.8, 10.0],
      itemStyle: { color: '#5470c6' }
    }
  ]
});

export const getMonthConsumptionOption = () => ({
  backgroundColor: 'transparent',
  color: ['rgba(120,120,120,0.55)', 'rgba(70,70,70,0.65)', '#d97a00'],
  title: {
    text: '消费者年度月均咖啡消费金额',
    subtext: "2022,2024与2025对比（单位：%）",
    left: 'center',
    top: 5,
    textStyle: { color: 'rgba(0,0,0,0.88)', fontSize: 20, fontWeight: 700 },
    subtextStyle: { fontSize: 12, color: "#777" }
  },
  grid: { left: 50, right: 20, top: 70, bottom: 80 },
  legend: { bottom: 10, left: 'center' },
  tooltip: {
    trigger: 'axis',
    formatter: (params) => {
      let s = `${params[0].axisValue}<br/>`;
      params.forEach(p => { s += `${p.marker}${p.seriesName}  ${p.value}%<br/>`; });
      return s;
    }
  },
  xAxis: {
    type: 'category',
    data: ['50元以下', '51-100元', '101-150元', '151-200元', '200元以上'],
    axisTick: { show: false },
    axisLine: { lineStyle: { color: 'rgba(0,0,0,0.18)' } }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 60,
    interval: 15,
    axisLabel: { formatter: v => `${v}%` },
    axisLine: { show: false },
    splitLine: { lineStyle: { color: 'rgba(0,0,0,0.10)', type: 'dashed' } }
  },
  series: [
    { name: '2022', type: 'line', data: [10.6, 39.3, 26.9, 13.4, 9.8], smooth: true, symbol: 'none', lineStyle: { width: 4, color: 'rgba(120,120,120,0.55)' } },
    { name: '2024', type: 'line', data: [12.58, 36.71, 37.32, 9.13, 4.26], smooth: true, symbol: 'none', lineStyle: { width: 4, color: 'rgba(70,70,70,0.65)' } },
    {
      name: '2025',
      type: 'line',
      data: [12.55, 37.13, 41.36, 5.89, 3.07],
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 6, color: '#d97a00' },
      areaStyle: {
        opacity: 1,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(217,122,0,0.30)' }, { offset: 1, color: 'rgba(217,122,0,0)' }])
      }
    }
  ]
});

export const getLuckinWordCloudOption = () => {
  const data = [{"name":"联名","value":195},{"name":"价格","value":122},{"name":"疯狂动物城","value":96},{"name":"奶茶","value":84},{"name":"消费者","value":82},{"name":"买","value":81},{"name":"...","value":76},{"name":"9.9","value":76},{"name":"新品","value":75},{"name":"贝果","value":75},{"name":"星巴克","value":72},{"name":"性价比","value":70},{"name":"便宜","value":68},{"name":"瑞幸","value":67},{"name":"活动","value":66},{"name":"优惠","value":64},{"name":"咖啡","value":63},{"name":"一杯","value":62},{"name":"真的","value":61},{"name":"打卡","value":60},{"name":"门店","value":59},{"name":"券","value":58},{"name":"薅羊毛","value":57},{"name":"会员","value":56},{"name":"划算","value":55},{"name":"折扣","value":54},{"name":"推荐","value":53},{"name":"买一送一","value":52},{"name":"便宜点","value":51},{"name":"套餐","value":50},{"name":"对比","value":49},{"name":"平替","value":48},{"name":"预算","value":47},{"name":"省钱","value":46},{"name":"贵","value":45},{"name":"值不值","value":44},{"name":"不太值","value":43},{"name":"太贵","value":42},{"name":"降价","value":41},{"name":"涨价","value":40},{"name":"积分","value":39},{"name":"星礼卡","value":38},{"name":"团购","value":37},{"name":"外卖","value":36},{"name":"自取","value":35},{"name":"下单","value":34},{"name":"平台","value":33},{"name":"促销","value":32},{"name":"限时","value":31},{"name":"秒杀","value":30},{"name":"囤","value":29},{"name":"日常","value":28},{"name":"通勤","value":27},{"name":"打工人","value":26},{"name":"学生","value":25},{"name":"买得起","value":24},{"name":"能省则省","value":23},{"name":"自己做","value":22},{"name":"在家","value":21},{"name":"办公室","value":20},{"name":"速溶","value":19},{"name":"咖啡豆","value":18},{"name":"挂耳","value":17},{"name":"美式","value":16},{"name":"拿铁","value":15},{"name":"冷萃","value":14},{"name":"抹茶","value":13},{"name":"巧克力","value":12},{"name":"焦糖","value":11},{"name":"香气","value":10},{"name":"口感","value":9},{"name":"浓郁","value":8},{"name":"丝滑","value":7},{"name":"顺滑","value":6},{"name":"果香","value":5},{"name":"坚果","value":4},{"name":"热量","value":3},{"name":"少糖","value":3},{"name":"加糖","value":3},{"name":"大杯","value":3},{"name":"中杯","value":3},{"name":"小杯","value":3},{"name":"量","value":3},{"name":"门店价","value":3},{"name":"外卖费","value":3},{"name":"配送费","value":3},{"name":"包装","value":3},{"name":"袋子","value":3},{"name":"吸管","value":3},{"name":"杯套","value":3},{"name":"纸巾","value":3},{"name":"服务","value":3},{"name":"态度","value":3},{"name":"排队","value":3},{"name":"等待","value":3},{"name":"慢","value":3},{"name":"快","value":3},{"name":"方便","value":3},{"name":"好喝","value":3},{"name":"难喝","value":3}];
  return {
    backgroundColor: 'transparent',
    title: {
      text: '瑞幸小红书-消费降级反映',
      subtext: '关键词：消费、买、价格',
      left: 'center',
      top: 8,
      itemGap: 4,
      textStyle: { fontSize: 15, fontWeight: 'normal', color: '#4B3621' },
      subtextStyle: { fontSize: 12, color: '#5D4037' }
    },
    tooltip: { trigger: 'item', formatter: p => `${p.name}<br/>词频：${p.value}` },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      sizeRange: [12, 72],
      rotationRange: [0, 0],
      rotationStep: 0,
      gridSize: 6,
      drawOutOfBound: false,
      top: 50,
      textStyle: {
        fontFamily: 'sans-serif',
        color: () => pickLuckinColor()
      },
      emphasis: { focus: 'self', textStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.25)' } },
      data
    }]
  };
};

export const getStarbucksWordCloudOption = () => {
  const data = [{"name":"价格","value":209},{"name":"消费","value":136},{"name":"一杯","value":130},{"name":"买","value":126},{"name":"真的","value":91},{"name":"性价比","value":90},{"name":"划算","value":90},{"name":"优惠","value":88},{"name":"杯子","value":88},{"name":"门店","value":77},{"name":"品牌","value":72},{"name":"味道","value":70},{"name":"好喝","value":70},{"name":"咖啡","value":69},{"name":"活动","value":69},{"name":"买一送一","value":67},{"name":"打折","value":65},{"name":"会员","value":65},{"name":"省钱","value":64},{"name":"便宜","value":64},{"name":"折扣","value":63},{"name":"券","value":62},{"name":"薅羊毛","value":61},{"name":"星巴克","value":61},{"name":"瑞幸","value":60},{"name":"对比","value":59},{"name":"选择","value":58},{"name":"平替","value":57},{"name":"想买","value":56},{"name":"推荐","value":55},{"name":"预算","value":55},{"name":"贵","value":54},{"name":"便宜点","value":53},{"name":"划不划算","value":52},{"name":"值不值","value":51},{"name":"价格差","value":50},{"name":"同款","value":50},{"name":"囤","value":49},{"name":"优惠券","value":49},{"name":"积分","value":48},{"name":"星礼卡","value":48},{"name":"套餐","value":47},{"name":"买咖啡","value":47},{"name":"买饮品","value":46},{"name":"打工人","value":46},{"name":"日常","value":45},{"name":"通勤","value":44},{"name":"周末","value":44},{"name":"不太值","value":43},{"name":"太贵","value":43},{"name":"便宜很多","value":42},{"name":"降价","value":42},{"name":"涨价","value":41},{"name":"涨","value":41},{"name":"奶茶","value":40},{"name":"饮品","value":40},{"name":"拿铁","value":39},{"name":"美式","value":39},{"name":"冷萃","value":38},{"name":"燕麦奶","value":38},{"name":"加糖","value":37},{"name":"少糖","value":37},{"name":"大杯","value":36},{"name":"中杯","value":36},{"name":"小杯","value":35},{"name":"量","value":35},{"name":"门店价","value":34},{"name":"外卖","value":34},{"name":"自取","value":33},{"name":"下单","value":33},{"name":"平台","value":32},{"name":"团购","value":32},{"name":"秒杀","value":31},{"name":"限时","value":31},{"name":"促销","value":30},{"name":"便宜点买","value":30},{"name":"省","value":29},{"name":"性价比高","value":29},{"name":"学生","value":29},{"name":"买得起","value":28},{"name":"能省则省","value":28},{"name":"自己做","value":27},{"name":"在家","value":27},{"name":"办公室","value":26},{"name":"速溶","value":26},{"name":"咖啡豆","value":25},{"name":"挂耳","value":25},{"name":"好玩","value":24},{"name":"好看","value":24},{"name":"拍照","value":23},{"name":"环境","value":23},{"name":"空间","value":22},{"name":"服务","value":22},{"name":"态度","value":21},{"name":"排队","value":20},{"name":"等待","value":20},{"name":"慢","value":19},{"name":"快","value":19},{"name":"方便","value":18}];
  return {
    backgroundColor: 'transparent',
    title: {
      text: '星巴克小红书-消费降级反映',
      subtext: '关键词：消费、买、价格',
      left: 'center',
      top: 8,
      itemGap: 4,
      textStyle: { fontSize: 15, fontWeight: 'normal', color: '#333' },
      subtextStyle: { fontSize: 12, color: '#666' }
    },
    tooltip: { trigger: 'item', formatter: p => `${p.name}<br/>词频：${p.value}` },
    series: [{
      type: 'wordCloud',
      shape: 'circle',
      sizeRange: [12, 72],
      rotationRange: [0, 0],
      rotationStep: 0,
      gridSize: 6,
      drawOutOfBound: false,
      top: 50,
      textStyle: {
        fontFamily: 'sans-serif',
        color: () => pickStarbucksColor()
      },
      emphasis: { focus: 'self', textStyle: { shadowBlur: 8, shadowColor: 'rgba(0,0,0,0.25)' } },
      data
    }]
  };
};
