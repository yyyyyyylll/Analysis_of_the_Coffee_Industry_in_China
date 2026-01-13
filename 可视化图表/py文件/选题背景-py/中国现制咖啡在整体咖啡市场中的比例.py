from pyecharts.charts import Line, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Line(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/中国现制咖啡在整体咖啡市场中的比例.txt :contentReference[oaicite:0]{index=0}
chart.options = {
    "title": {
        "text": "中国现制咖啡在整体咖啡市场中的比例（2020-2024E）",
        "left": "center",
        "textStyle": {"fontSize": 16}
    },

    # Single line color
    "color": ["#191970"],

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "shadow"},
        "formatter": JsCode(
            "function (params) {"
            "  const item = params[0];"
            "  return `${item.name}<br/>${item.marker}${item.seriesName}: ${item.value} %`;"
            "}"
        )
    },

    "legend": {
        "data": ["比例"],
        "bottom": 10
    },

    "xAxis": {
        "type": "category",
        "data": ["2020", "2021", "2022", "2023", "2024E"],
        "axisLabel": {"interval": 0, "rotate": 0}
    },

    "yAxis": {
        "type": "value",
        "name": "比例 (%)",
        "min": 0,
        "max": 50,
        "interval": 10,
        "axisLabel": {"formatter": "{value} %"}
    },

    "series": [
        {
            "name": "比例",
            "type": "line",
            "itemStyle": {"color": "#191970"},
            "lineStyle": {"width": 3},
            "data": [18.5, 24.5, 31.1, 40.2, 44.6]
        }
    ]
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("中国现制咖啡在整体咖啡市场中的比例（2020-2024E）.html")
