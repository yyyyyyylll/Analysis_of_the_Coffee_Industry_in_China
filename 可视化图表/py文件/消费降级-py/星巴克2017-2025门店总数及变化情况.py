from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/星巴克2017-2025门店总数及变化情况.txt :contentReference[oaicite:1]{index=1}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "星巴克2017-2025中国门店总数及变化情况",
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
        "data": ["中国门店总数", "中国新增门店数"],
    },

    "grid": {
        "top": 90,
        "left": "8%",
        "right": "8%",
        "bottom": "12%",
        "containLabel": True,
    },

    "xAxis": {
        "type": "category",
        "data": ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
        "axisPointer": {"type": "shadow"},
    },

    "yAxis": [
        {
            "type": "value",
            "name": "门店总数（家）",
            "max": 10000,
            "axisLine": {"show": True},
            "splitLine": {"show": True, "lineStyle": {"type": "dashed"}},
            "axisLabel": {"formatter": "{value}"},
        },
        {
            "type": "value",
            "name": "新增门店数（家）",
            "max": 1000,
            "axisLine": {"show": True},
            "splitLine": {"show": False},
            "axisLabel": {"formatter": "{value}"},
        },
    ],

    "series": [
        {
            "name": "中国门店总数",
            "type": "bar",
            "barMaxWidth": 40,
            "itemStyle": {"color": "#A8D5A2"},
            "tooltip": {"valueFormatter": JsCode("function (value) { return value + ' 家'; }")},
            "data": [1540, 3521, 4123, 4704, 5358, 6019, 6804, 7594, 8009],
        },
        {
            "name": "中国新增门店数",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#5B3A29", "width": 3},
            "itemStyle": {"color": "#5B3A29"},
            "emphasis": {"focus": "series"},
            "tooltip": {"valueFormatter": JsCode("function (value) { return value + ' 家'; }")},
            "data": [285, 528, 629, 613, 697, 724, 857, 855, 569],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("星巴克2017-2025中国门店总数及变化情况.html")
