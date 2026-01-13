from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/2023-2024 星巴克城市分布.txt :contentReference[oaicite:0]{index=0}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "2023-2024星巴克城市分布情况",
        "left": "center",
        "top": 10,
        "textStyle": {"color": "#000", "fontSize": 16, "fontWeight": "bold"},
    },

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "shadow"},
        "valueFormatter": JsCode(
            "function (v) { return (Math.round(v * 1000) / 10) + '%'; }"
        ),
    },

    "legend": {
        "top": 45,
        "data": ["一线城市", "新一线城市", "二线城市", "三线城市", "三线及以下城市"],
    },

    "grid": {
        "left": 100,
        "right": 80,
        "top": 80,
        "bottom": 60,
    },

    "xAxis": {
        "type": "category",
        "data": ["2023", "2024"],
        "axisPointer": {"type": "shadow"},
    },

    "yAxis": {
        "type": "value",
        "name": "百分比（%）",
        "min": 0,
        "max": 1,
        "axisLine": {"show": True},
        "splitLine": {
            "show": True,
            "lineStyle": {"type": "dashed"},
        },
        "axisLabel": {
            "formatter": JsCode("function (v) { return Math.round(v * 100) + '%'; }")
        },
    },

    "series": [
        {
            "name": "一线城市",
            "type": "bar",
            "stack": "total",
            "barWidth": "60%",
            "itemStyle": {"color": "#2E7D32"},
            "label": {
                "show": True,
                "formatter": JsCode(
                    "function (p) {"
                    "  if (p.value == null) return '';"
                    "  return (Math.round(p.value * 1000) / 10) + '%';"
                    "}"
                ),
            },
            "emphasis": {"focus": "series"},
            "data": [0.3310, 0.3170],
        },
        {
            "name": "新一线城市",
            "type": "bar",
            "stack": "total",
            "barWidth": "60%",
            "itemStyle": {"color": "#1565C0"},
            "label": {
                "show": True,
                "formatter": JsCode(
                    "function (p) {"
                    "  if (p.value == null) return '';"
                    "  return (Math.round(p.value * 1000) / 10) + '%';"
                    "}"
                ),
            },
            "emphasis": {"focus": "series"},
            "data": [0.3400, 0.3350],
        },
        {
            "name": "二线城市",
            "type": "bar",
            "stack": "total",
            "barWidth": "60%",
            "itemStyle": {"color": "#EF6C00"},
            "label": {
                "show": True,
                "formatter": JsCode(
                    "function (p) {"
                    "  if (p.value == null) return '';"
                    "  return (Math.round(p.value * 1000) / 10) + '%';"
                    "}"
                ),
            },
            "emphasis": {"focus": "series"},
            "data": [0.1860, 0.1900],
        },
        {
            "name": "三线城市",
            "type": "bar",
            "stack": "total",
            "barWidth": "60%",
            "itemStyle": {"color": "#6A1B9A"},
            "label": {
                "show": True,
                "formatter": JsCode(
                    "function (p) {"
                    "  if (p.value == null) return '';"
                    "  return (Math.round(p.value * 1000) / 10) + '%';"
                    "}"
                ),
            },
            "emphasis": {"focus": "series"},
            "data": [0.0900, 0.0960],
        },
        {
            "name": "三线及以下城市",
            "type": "bar",
            "stack": "total",
            "barWidth": "60%",
            "itemStyle": {"color": "#C62828"},
            "label": {
                "show": True,
                "formatter": JsCode(
                    "function (p) {"
                    "  if (p.value == null) return '';"
                    "  return (Math.round(p.value * 1000) / 10) + '%';"
                    "}"
                ),
            },
            "emphasis": {"focus": "series"},
            "data": [0.0530, 0.0620],
        },
    ],

    # 和你刚才说的一样：先不做 graphic 的 polygon 连接层（原文件是运行时动态算 points）
    # 需要的话我后面可以给你补一个“固定尺寸=1000x600”下的静态 points 版本。
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("2023-2024星巴克城市分布情况.html")
