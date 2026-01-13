import pyecharts.options as opts
from pyecharts.charts import Line, Page
from pyecharts.commons.utils import JsCode

# Data
x_data = ["10元及以下","11–20元","21–30元","31–40元","41–50元","50元以上"]
y2025 = [3.45, 30.34, 46.44, 17.24, 1.84, 0.69]
y2024 = [1.17, 25.78, 55.47, 11.72, 5.08, 0.78]

line = (
    Line(init_opts=opts.InitOpts(width="1000px", height="650px", bg_color="#ffffff"))
    .add_xaxis(x_data)
    .add_yaxis(
        "2024 接受度",
        y2024,
        is_smooth=True,
        symbol="none",
        itemstyle_opts=opts.ItemStyleOpts(color="#9aa3af"),
        linestyle_opts=opts.LineStyleOpts(width=3, type_="dashed", color="#9aa3af"),
        z=2
    )
    .add_yaxis(
        "2025 接受度",
        y2025,
        is_smooth=True,
        symbol="none",
        itemstyle_opts=opts.ItemStyleOpts(color="#b45309"),
        linestyle_opts=opts.LineStyleOpts(width=4, color="#b45309"),
        areastyle_opts=opts.AreaStyleOpts(
            opacity=1,
            color={
                "type": "linear",
                "x": 0,
                "y": 0,
                "x2": 0,
                "y2": 1,
                "colorStops": [
                    {"offset": 0, "color": "rgba(180,83,9,0.22)"},
                    {"offset": 1, "color": "rgba(180,83,9,0.00)"}
                ],
                "global": False
            }
        ),
        z=3
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="消费者可接受的单杯咖啡价格分布",
            subtitle="2024与2025对比（单位：%）",
            pos_left="center",
            pos_top="18",
            title_textstyle_opts=opts.TextStyleOpts(font_size=28, font_weight=700, color="#2c2c2c"),
            subtitle_textstyle_opts=opts.TextStyleOpts(font_size=16, color="#777", line_height=22),
            text_align="center"
        ),
        tooltip_opts=opts.TooltipOpts(
            trigger="axis",
            axis_pointer_type="line",
            value_formatter=JsCode("function (v) { return v + '%'; }")
        ),
        legend_opts=opts.LegendOpts(
            pos_left="center",
            pos_bottom="24",
            item_width=14,
            item_height=14,
            item_gap=28,
            textstyle_opts=opts.TextStyleOpts(font_size=16, color="#666"),
        ),
        xaxis_opts=opts.AxisOpts(
            type_="category",
            boundary_gap=False,
            axisline_opts=opts.AxisLineOpts(linestyle_opts=opts.LineStyleOpts(color="#ddd")),
            axistick_opts=opts.AxisTickOpts(is_show=False),
            axislabel_opts=opts.LabelOpts(color="#333", font_size=14, margin=14)
        ),
        yaxis_opts=opts.AxisOpts(
            type_="value",
            min_=0,
            max_=60,
            interval=15,
            axislabel_opts=opts.LabelOpts(color="#666", font_size=14, formatter="{value}%"),
            axisline_opts=opts.AxisLineOpts(is_show=False),
            axistick_opts=opts.AxisTickOpts(is_show=False),
            splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(color="#e9e9e9", type_="dashed"))
        ),
    )
)

# Explicitly set textAlign to center to ensure title and subtitle are aligned



# grid options
line.options["grid"] = {
    "left": 70,
    "right": 70,
    "top": 120,
    "bottom": 90
}

page = Page(layout=Page.SimplePageLayout)
page.add(line)
page.render("价格接受度.html")
