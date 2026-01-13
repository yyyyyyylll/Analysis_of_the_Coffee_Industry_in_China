from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/星巴克2022-2025运营费用情况.txt :contentReference[oaicite:1]{index=1}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "星巴克2022-2025运营费用情况",
        "left": "center",
        "top": 10,
        "textStyle": {"color": "#000", "fontSize": 16, "fontWeight": "bold"},
    },

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "cross", "crossStyle": {"color": "#999"}},
        "formatter": JsCode(
            "function (params) {"
            "  var year = params && params.length ? params[0].axisValue : '';"
            "  var lines = [year];"
            "  params.forEach(function (p) {"
            "    if (p.seriesName === '中国总运营费用') {"
            "      lines.push(p.marker + ' 中国总运营费用：' + p.value + ' 百万美元');"
            "    }"
            "    if (p.seriesName === '产品和分销成本占比') {"
            "      var cost1 = (p.data && p.data.cost != null) ? p.data.cost : '-';"
            "      lines.push(p.marker + ' ①中国产品和分销成本：' + cost1 + ' 百万美元');"
            "      lines.push('　　②产品和分销成本占比：' + p.value + '%');"
            "    }"
            "    if (p.seriesName === '门店运营费用占比') {"
            "      var cost2 = (p.data && p.data.cost != null) ? p.data.cost : '-';"
            "      lines.push(p.marker + ' ①中国门店运营费用：' + cost2 + ' 百万美元');"
            "      lines.push('　　②门店运营费用占比：' + p.value + '%');"
            "    }"
            "  });"
            "  return lines.join('<br/>');"
            "}"
        ),
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
        "data": ["中国总运营费用", "产品和分销成本占比", "门店运营费用占比"],
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
            "data": ["2022", "2023", "2024", "2025"],
            "axisPointer": {"type": "shadow"},
        }
    ],

    "yAxis": [
        {
            "type": "value",
            "name": "中国总运营费用（百万美元）",
            "axisLine": {"show": True},
            "splitLine": {"show": True, "lineStyle": {"type": "dashed"}},
            "axisLabel": {"formatter": "{value}"},
        },
        {
            "type": "value",
            "name": "占净收入比重（%）",
            "min": 0,
            "max": 100,
            "axisLine": {"show": True},
            "splitLine": {"show": False},
            "axisLabel": {"formatter": "{value}%"},
        },
    ],

    "series": [
        {
            "name": "中国总运营费用",
            "type": "bar",
            "barMaxWidth": 40,
            "itemStyle": {"color": "#A8D5A2"},
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 百万美元'; }")
            },
            "data": [2648.13, 2576.04, 2581.05, 2776.08],
        },
        {
            "name": "产品和分销成本占比",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#2F6BFF", "width": 3},
            "itemStyle": {"color": "#2F6BFF"},
            "emphasis": {"focus": "series"},
            "data": [
                {"value": 34.0, "cost": 1021.98},
                {"value": 34.8, "cost": 1073.48},
                {"value": 35.1, "cost": 1055.57},
                {"value": 35.2, "cost": 1111.47},
            ],
        },
        {
            "name": "门店运营费用占比",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#D64545", "width": 3},
            "itemStyle": {"color": "#D64545"},
            "emphasis": {"focus": "series"},
            "data": [
                {"value": 38.9, "cost": 1171.14},
                {"value": 36.9, "cost": 1136.32},
                {"value": 38.4, "cost": 1155.67},
                {"value": 39.5, "cost": 1247.20},
            ],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("星巴克2022-2025运营费用情况.html")
