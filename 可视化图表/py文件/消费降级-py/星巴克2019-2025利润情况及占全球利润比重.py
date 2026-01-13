from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/星巴克2019-2025利润情况及占全球利润比重.txt :contentReference[oaicite:1]{index=1}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "星巴克2019-2025利润情况及占全球利润比重",
        "left": "center",
        "top": 10,
        "textStyle": {"color": "#000", "fontSize": 16, "fontWeight": "bold"},
    },

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "cross", "crossStyle": {"color": "#999"}},
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
        "data": ["中国利润", "中国利润占全球利润比重"],
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
            "data": ["2019", "2020", "2021", "2022", "2023", "2024", "2025"],
            "axisPointer": {"type": "shadow"},
        }
    ],

    "yAxis": [
        {
            "type": "value",
            "name": "中国利润（百万美元）",
            "axisLine": {"show": True},
            "splitLine": {"show": True, "lineStyle": {"type": "dashed"}},
            "axisLabel": {"formatter": "{value}"},
        },
        {
            "type": "value",
            "name": "占全球利润比重（%）",
            "min": 0,
            "max": 100,
            "axisLine": {"show": True},
            "splitLine": {"show": False},
            "axisLabel": {"formatter": "{value}%"},
        },
    ],

    "series": [
        {
            "name": "中国利润",
            "type": "bar",
            "barMaxWidth": 40,
            "itemStyle": {"color": "#A8D5A2"},
            "tooltip": {
                "valueFormatter": JsCode(
                    "function (value) { return value + ' 百万美元'; }"
                )
            },
            "data": [1635.77, 458.38, 2229.48, 1422.46, 1697.43, 1541.59, 750.36],
        },
        {
            "name": "中国利润占全球利润比重",
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
            "data": [45.45, 49.38, 53.09, 43.35, 41.15, 40.99, 40.42],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("星巴克2019-2025利润情况及占全球利润比重.html")
