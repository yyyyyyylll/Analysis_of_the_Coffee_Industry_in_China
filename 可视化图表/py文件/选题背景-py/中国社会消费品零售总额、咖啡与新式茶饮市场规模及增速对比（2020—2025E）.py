from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
chart.options = {
    "title": {
        "text": "中国社会消费品零售总额、咖啡与新式茶饮市场规模及增速对比（2020—2025E）",
        "left": "center",
        "textStyle": {"fontSize": 16},
    },

    "color": [
        "#5470C6",  # 茶饮市场规模柱
        "#91CC75",  # 咖啡市场规模柱
        "#FF8C00",  # 社零增速线
        "#191970",  # 咖啡增速线
        "#87CEFA",  # 茶饮增速线（全局色盘；series里仍按原文件指定）
    ],

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "cross", "crossStyle": {"color": "#999"}},
        "formatter": JsCode(
            "function (params) {"
            "  let res = params[0].name + '<br/>';"
            "  params.forEach(function (item) {"
            "    let unit = '';"
            "    if (item.seriesName.includes('亿元')) {"
            "      unit = ' 亿元';"
            "    } else if (item.seriesName.includes('增长率') || item.seriesName.includes('增速')) {"
            "      unit = ' %';"
            "    }"
            "    res += item.marker + item.seriesName + ': ' + (item.value !== '-' ? item.value : '无数据') + unit + '<br/>';"
            "  });"
            "  return res;"
            "}"
        ),
    },

    "legend": {
        "data": [
            "中国新式茶饮市场规模（亿元）",
            "中国咖啡行业市场规模（亿元）",
            "中国社会消费品零售总额增长率（%）",
            "中国咖啡行业市场规模增长率（%）",
            "中国新式茶饮市场规模增长率（%）",
        ],
        "bottom": 5,
        "type": "scroll",
    },

    "xAxis": [
        {
            "type": "category",
            "data": ["2020", "2021", "2022", "2023", "2024", "2025E"],
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
        # 柱状图 1: 中国新式茶饮市场规模（亿元）
        {
            "name": "中国新式茶饮市场规模（亿元）",
            "type": "bar",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 亿元'; }")
            },
            "data": [1840.3, 2795.9, 2938.5, 3333.8, 3547.2, 3749.3],
        },

        # 柱状图 2: 中国咖啡行业市场规模（亿元）
        {
            "name": "中国咖啡行业市场规模（亿元）",
            "type": "bar",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 亿元'; }")
            },
            "data": [3000, 3817, 4895, 6235, 7893, 10027],
        },

        # 折线图 1: 中国社会消费品零售总额增长率（%）
        {
            "name": "中国社会消费品零售总额增长率（%）",
            "type": "line",
            "yAxisIndex": 1,
            "color": "#FF8C00",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' %'; }")
            },
            "data": ["-", 12.5, -0.2, 7.2, 3.5, 5],
        },

        # 折线图 2: 中国咖啡行业市场规模增长率（%）
        {
            "name": "中国咖啡行业市场规模增长率（%）",
            "type": "line",
            "yAxisIndex": 1,
            "color": "#191970",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' %'; }")
            },
            "data": ["-", 27.2, 28.2, 27.4, 26.6, 27.0],
        },

        # 折线图 3: 中国新式茶饮市场规模增长率（%）
        {
            "name": "中国新式茶饮市场规模增长率（%）",
            "type": "line",
            "yAxisIndex": 1,
            "color": "#ADD8E6",
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' %'; }")
            },
            "data": ["-", 51.9, 5.1, 13.5, 6.4, 5.7],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("中国社会消费品零售总额、咖啡与新式茶饮市场规模及增速对比（2020—2025E）.html")
