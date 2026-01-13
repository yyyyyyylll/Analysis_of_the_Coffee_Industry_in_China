import pyecharts.options as opts
from pyecharts.charts import Line, Page
from pyecharts.commons.utils import JsCode

# Data
x = ["50元以下","51-100元","101-150元","151-200元","200元以上"]
y2022 = [10.6, 39.3, 26.9, 13.4, 9.8]
y2024 = [12.58, 36.71, 37.32, 9.13, 4.26]
y2025 = [12.55, 37.13, 41.36, 5.89, 3.07]

line = (
    Line(init_opts=opts.InitOpts(width="1200px", height="650px", bg_color="#fff"))
    .add_xaxis(x)
    .add_yaxis(
        "2022",
        y2022,
        is_smooth=True,
        symbol="none",
        linestyle_opts=opts.LineStyleOpts(width=4, color="rgba(120,120,120,0.55)"),
        z=2,
        itemstyle_opts=opts.ItemStyleOpts(color="rgba(120,120,120,0.55)")
    )
    .add_yaxis(
        "2024",
        y2024,
        is_smooth=True,
        symbol="none",
        linestyle_opts=opts.LineStyleOpts(width=4, color="rgba(70,70,70,0.65)"),
        z=3,
        itemstyle_opts=opts.ItemStyleOpts(color="rgba(70,70,70,0.65)")
    )
    .add_yaxis(
        "2025",
        y2025,
        is_smooth=True,
        symbol="none",
        linestyle_opts=opts.LineStyleOpts(width=6, color="#d97a00"),
        areastyle_opts=opts.AreaStyleOpts(
            opacity=1,
            color={
                "type": "linear",
                "x": 0,
                "y": 0,
                "x2": 0,
                "y2": 1,
                "colorStops": [
                    {"offset": 0, "color": "rgba(217,122,0,0.30)"},
                    {"offset": 1, "color": "rgba(217,122,0,0)"}
                ],
                "global": False
            }
        ),
        z=5,
        itemstyle_opts=opts.ItemStyleOpts(color="#d97a00")
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="消费者年度月均咖啡消费金额",
            subtitle="2022,2024与2025对比（单位：%）",
            pos_left="center",
            pos_top="5",
            title_textstyle_opts=opts.TextStyleOpts(color="rgba(0,0,0,0.88)", font_size=30, font_weight=700),
            subtitle_textstyle_opts=opts.TextStyleOpts(font_size=16, color="#777", line_height=22),
            text_align="center"
        ),
        tooltip_opts={
            "trigger": "axis",
            "axisPointer": {"type": "line", "lineStyle": {"color": "rgba(0,0,0,0.18)"}},
            "backgroundColor": "rgba(255,255,255,0.96)",
            "borderColor": "rgba(0,0,0,0.12)",
            "borderWidth": 1,
            "textStyle": {"color": "rgba(0,0,0,0.85)"},
            "formatter": JsCode("""
                function (params) {
                  const name = params[0].axisValue;
                  let s = `${name}<br/>`;
                  params.forEach(p => { s += `${p.marker}${p.seriesName}  ${p.value}%<br/>`; });
                  return s;
                }
            """)
        },
        legend_opts=opts.LegendOpts(
            pos_bottom="25",
            pos_left="center",
            item_width=18,
            item_height=18,
            textstyle_opts=opts.TextStyleOpts(color="rgba(0,0,0,0.55)", font_size=18)
        ),
        xaxis_opts=opts.AxisOpts(
            type_="category",
            axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="rgba(0,0,0,0.18)")),
            axistick_opts=opts.AxisTickOpts(is_show=False),
            axislabel_opts=opts.LabelOpts(color="rgba(0,0,0,0.75)", font_size=18, margin=18)
        ),
        yaxis_opts=opts.AxisOpts(
            type_="value",
            min_=0,
            max_=60,
            interval=15,
            axisline_opts=opts.AxisLineOpts(is_show=False),
            axistick_opts=opts.AxisTickOpts(is_show=False),
            axislabel_opts=opts.LabelOpts(color="rgba(0,0,0,0.75)", font_size=18, formatter="{value}%"),
            splitline_opts=opts.SplitLineOpts(linestyle_opts=opts.LineStyleOpts(color="rgba(0,0,0,0.10)", type_="dashed"))
        ),
    )
)

# Colors list explicitly set in option
line.options["color"] = [
    "rgba(120,120,120,0.55)",
    "rgba(70,70,70,0.65)",
    "#d97a00"
]

# Grid
line.options["grid"] = { "left": 70, "right": 70, "top": 90, "bottom": 120 }

page = Page(layout=Page.SimplePageLayout)
page.add(line)
page.render("月均消费金额.html")
