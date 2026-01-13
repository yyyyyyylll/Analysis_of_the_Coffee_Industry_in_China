from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/中国咖啡行业市场规模及现制咖啡市场规模对比.txt :contentReference[oaicite:0]{index=0}
chart.options = {
    "title": {
        "text": "中国咖啡行业市场规模及现制咖啡市场规模对比（2020—2025E）",
        "left": "center",
        "textStyle": {"fontSize": 16},
    },

    "color": [
        "#5470C6",  # 柱1: 咖啡行业规模
        "#91CC75",  # 柱2: 现制咖啡规模
        "#EE6666",  # 线1: 行业增长率
        "#FAC858",  # 线2: 现制增长率
    ],

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "cross", "crossStyle": {"color": "#999"}},
        "formatter": JsCode(
            "function (params) {"
            "  let res = params[0].name + '<br/>';"
            "  params.forEach(function (item) {"
            "    let unit = '';"
            "    if (item.seriesName.includes('亿元')) { unit = ' 亿元'; }"
            "    else if (item.seriesName.includes('增长率')) { unit = ' %'; }"
            "    res += item.marker + item.seriesName + ': ' + (item.value !== '-' ? item.value : '无数据') + unit + '<br/>';"
            "  });"
            "  return res;"
            "}"
        ),
    },

    "legend": {
        "data": [
            "中国咖啡行业市场规模（亿元）",
            "中国现制咖啡市场规模（亿元）",
            "中国咖啡行业市场规模增长率（%）",
            "中国现制咖啡市场规模增长率（%）",
        ],
        "bottom": 5,
        "type": "scroll",
    },

    "xAxis": [
        {
            "type": "category",
            "data": ["2020", "2021", "2022", "2023", "2024", "2025"],
            "axisPointer": {"type": "shadow"},
        }
    ],

    "yAxis": [
        {
            "type": "value",
            "name": "市场规模 (亿元)",
            "min": 0,
            "axisLabel": {"formatter": "{value} 亿元"},
            "nameTextStyle": {"padding": [0, 0, 0, 50]},
        },
        {
            "type": "value",
            "name": "增长率 (%)",
            "axisLabel": {"formatter": "{value} %"},
            "nameTextStyle": {"padding": [0, 50, 0, 0]},
        },
    ],

    "series": [
        {
            "name": "中国咖啡行业市场规模（亿元）",
            "type": "bar",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 亿元'; }")
            },
            "data": [3000, 3817, 4895, 6235, 7893, 10027],
        },
        {
            "name": "中国现制咖啡市场规模（亿元）",
            "type": "bar",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 亿元'; }")
            },
            "data": [751.9, 924.5, 1223.1, 1623.5, 1930.4, 2238.4],
        },
        {
            "name": "中国咖啡行业市场规模增长率（%）",
            "type": "line",
            "yAxisIndex": 1,
            "color": "#EE6666",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' %'; }")
            },
            "data": ["-", 27.2, 28.2, 27.4, 26.6, 27.0],
        },
        {
            "name": "中国现制咖啡市场规模增长率（%）",
            "type": "line",
            "yAxisIndex": 1,
            "color": "#FAC858",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' %'; }")
            },
            "data": ["-", 23.0, 32.3, 32.7, 18.9, 16.0],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("中国咖啡行业市场规模及现制咖啡市场规模对比（2020—2025E）.html")
