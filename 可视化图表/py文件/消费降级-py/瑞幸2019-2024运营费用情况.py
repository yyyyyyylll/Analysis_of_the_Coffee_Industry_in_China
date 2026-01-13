from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import pyecharts.options as opts

# Create a minimal chart container
chart = Bar(init_opts=opts.InitOpts(width="1000px", height="600px"))

# Directly inject the EXACT options from the original HTML file
# This bypasses Pyecharts API to ensure 1:1 match with the source
# Source: /mnt/data/瑞幸2019-2024运营费用情况.txt :contentReference[oaicite:1]{index=1}
chart.options = {
    "backgroundColor": "transparent",

    "title": {
        "text": "瑞幸2019-2024运营费用情况",
        "left": "center",
        "top": 10,
        "textStyle": {"color": "#000", "fontSize": 16, "fontWeight": "bold"},
    },

    "tooltip": {
        "trigger": "axis",
        "axisPointer": {"type": "cross", "crossStyle": {"color": "#999"}},
        "formatter": JsCode(
            "function (params) {"
            "  const year = params && params.length ? params[0].axisValue : '';"
            "  const lines = [year];"
            "  params.forEach(function (p) {"
            "    if (p.seriesName === '总运营费用') {"
            "      lines.push(p.marker + ' 总运营费用：' + p.value + ' 千元');"
            "    }"
            "    if (p.seriesName === '门店运营费用占比') {"
            "      const cost = (p.data && p.data.cost != null) ? p.data.cost : '-';"
            "      lines.push(p.marker + ' ①门店运营费用：' + cost + ' 千元');"
            "      lines.push('　　②门店运营费用占比：' + p.value + '%');"
            "    }"
            "    if (p.seriesName === '材料成本费用占比') {"
            "      const cost = (p.data && p.data.cost != null) ? p.data.cost : '-';"
            "      lines.push(p.marker + ' ①材料成本费用：' + cost + ' 千元');"
            "      lines.push('　　②材料成本费用占比：' + p.value + '%');"
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
        "data": ["总运营费用", "门店运营费用占比", "材料成本费用占比"],
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
            "name": "总运营费用（千元）",
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
            "name": "总运营费用",
            "type": "bar",
            "barMaxWidth": 40,
            "itemStyle": {"color": "#A8D5A2"},
            "tooltip": {
                "valueFormatter": JsCode("function (value) { return value + ' 千元'; }")
            },
            "data": [6237049, 6620686, 8504377, 12136803, 21877548, 30936753],
        },
        {
            "name": "门店运营费用占比",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#1565C0", "width": 3},
            "itemStyle": {"color": "#1565C0"},
            "emphasis": {"focus": "series"},
            "data": [
                {"value": 62.9, "cost": 3920970},
                {"value": 54.2, "cost": 3585184},
                {"value": 52.5, "cost": 4463164},
                {"value": 51.4, "cost": 6232878},
                {"value": 47.1, "cost": 10294355},
                {"value": 50.8, "cost": 15702519},
            ],
        },
        {
            "name": "材料成本费用占比",
            "type": "line",
            "yAxisIndex": 1,
            "showSymbol": True,
            "symbol": "circle",
            "symbolSize": 8,
            "lineStyle": {"color": "#C62828", "width": 3},
            "itemStyle": {"color": "#C62828"},
            "emphasis": {"focus": "series"},
            "data": [
                {"value": 26.0, "cost": 1623324},
                {"value": 30.1, "cost": 1995380},
                {"value": 37.6, "cost": 3198552},
                {"value": 42.7, "cost": 5178963},
                {"value": 49.8, "cost": 10892214},
                {"value": 45.6, "cost": 14115299},
            ],
        },
    ],
}

# Render with Page layout for centering
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("瑞幸2019-2024运营费用情况.html")
