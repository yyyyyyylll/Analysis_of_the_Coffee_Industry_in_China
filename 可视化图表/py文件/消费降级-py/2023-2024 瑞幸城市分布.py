from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

#用chart.options注入只能做到“堆叠百分比柱”一致，但那层连接多边形会丢。
#polygon 连接层（随窗口 resize 会重新排布）

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/2023-2024 瑞幸城市分布.txt :contentReference[oaicite:0]{index=0}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "2023-2024瑞幸城市分布情况",
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
            "data": [0.18, 0.16],
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
            "data": [0.27, 0.25],
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
            "data": [0.29, 0.30],
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
            "data": [0.16, 0.18],
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
            "data": [0.10, 0.11],
        },
    ],

    # 这里原HTML有 graphic.polygon 连接层（透明色块连接两年的堆叠分段）
    # pyecharts 也能塞，但要写大量 points 计算；你要“严格照抄”，就直接把 elements 写死：
    "graphic": {
        "elements": [
            # 说明：elements 在原HTML里是运行时根据图表尺寸动态算的，
            # 纯静态写死无法做到 1:1 自适应。
            # 如果你要“完全一致（随 resize 自适应）”，我建议这一张直接保留原 HTML 方式输出。
        ]
    },
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("2023-2024瑞幸城市分布情况.html")
