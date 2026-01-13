from pyecharts.charts import Pie, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Pie(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/2025中国咖啡城市分布情况.txt :contentReference[oaicite:0]{index=0}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "2025中国咖啡城市分布情况",
        "left": "center",
        "top": 10,
        "textStyle": {"color": "#000", "fontSize": 16, "fontWeight": "bold"},
    },

    "tooltip": {
        "trigger": "item",
        "formatter": "{b} : {c}% ({d}%)",
    },

    "legend": {
        "orient": "vertical",
        "left": "left",
        "top": "middle",
    },

    "series": [
        {
            "name": "2025年咖啡城市分布",
            "type": "pie",
            "radius": "55%",
            "center": ["50%", "55%"],
            "data": [
                {"value": 14.1, "name": "一线城市"},
                {"value": 23.5, "name": "新一线城市"},
                {"value": 18.2, "name": "二线城市"},
                {"value": 44.2, "name": "三四线及以下城市"},
            ],
            "itemStyle": {
                "borderColor": "#fff",
                "borderWidth": 2,
            },
            "emphasis": {
                "itemStyle": {
                    "shadowBlur": 10,
                    "shadowOffsetX": 0,
                    "shadowColor": "rgba(0, 0, 0, 0.4)",
                }
            },
            "label": {
                "formatter": "{b}\n{c}%",
                "color": "#333",
            },
        }
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("2025中国咖啡城市分布情况.html")
