from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/瑞幸2019-2024利润及利润率.txt :contentReference[oaicite:1]{index=1}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "瑞幸2019-2024利润及利润率",
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
        "data": ["利润（千元）", "利润率（%）"],
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
            "data": ["2019", "2020", "2021", "2022", "2023", "2024"],
            "axisPointer": {"type": "shadow"},
        }
    ],

    "yAxis": [
        {
            "type": "value",
            "name": "利润（千元）",
            "axisLine": {"show": True},
            "splitLine": {"show": True, "lineStyle": {"type": "dashed"}},
            "axisLabel": {"formatter": "{value}"},
        },
        {
            "type": "value",
            "name": "利润率（%）",
            "min": -10,
            "max": 100,
            "axisLine": {"show": True},
            "splitLine": {"show": False},
            "axisLabel": {"formatter": "{value}%"},
        },
    ],

    "series": [
        {
            "name": "利润（千元）",
            "type": "bar",
            "barMaxWidth": 40,
            "itemStyle": {"color": "#A8D5A2"},
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 千元'; }")
            },
            "data": [-317294, -162324, -512178, 279201, 2887641, 4208349],
        },
        {
            "name": "利润率（%）",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#5B3A29", "width": 3},
            "itemStyle": {"color": "#5B3A29"},
            "emphasis": {"focus": "series"},
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' %'; }")
            },
            "data": [-7.3, -2.6, -4.1, 2.1, 8.2, 8.9],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("瑞幸2019-2024利润及利润率.html")
