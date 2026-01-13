from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/2020-2025中国咖啡门店数量情况.txt :contentReference[oaicite:0]{index=0}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "2020-2025中国咖啡门店数量情况",
        "left": "center",
        "top": 10,
        "textStyle": {"color": "#000", "fontSize": 16, "fontWeight": "bold"},
    },

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {
            "type": "cross",
            "crossStyle": {"color": "#999"},
        },
    },

    "toolbox": {
        "feature": {
            "dataView": {"show": True, "readOnly": False},
            "magicType": {"show": True, "type": ["line", "bar"]},
            "restore": {"show": True},
            "saveAsImage": {"show": True},
        }
    },

    "legend": {
        "top": 45,
        "data": ["中国咖啡门店数量", "增长率"],
    },

    "grid": {
        "top": 90,
        "left": "8%",
        "right": "8%",
        "bottom": "12%",
        "containLabel": True,
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
            "name": "咖啡门店数量（家）",
            "axisLine": {"show": True},
            "splitLine": {
                "show": True,
                "lineStyle": {"type": "dashed"},
            },
            "axisLabel": {"formatter": "{value}"},
        },
        {
            "type": "value",
            "name": "增长率（%）",
            "min": 0,
            "max": 50,
            "axisLine": {"show": True},
            "splitLine": {"show": False},
            "axisLabel": {"formatter": "{value}%"},
        },
    ],

    "series": [
        {
            "name": "中国咖啡门店数量",
            "type": "bar",
            "barMaxWidth": 40,
            "itemStyle": {"color": "#A8D5A2"},
            "tooltip": {
                "valueFormatter": JsCode(
                    "function (value) { return value + ' 家'; }"
                )
            },
            "data": [108467, 110000, 120000, 170896, 190000, 254730],
        },
        {
            "name": "增长率",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#5B3A29", "width": 3},
            "itemStyle": {"color": "#5B3A29"},
            "emphasis": {"focus": "series"},
            "tooltip": {
                "valueFormatter": JsCode(
                    "function (value) { return value + ' %'; }"
                )
            },
            "data": [None, 1.41, 9.09, 42.42, 11.18, 34.07],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("2020-2025中国咖啡门店数量情况.html")
