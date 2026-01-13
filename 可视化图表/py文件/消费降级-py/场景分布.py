import pyecharts.options as opts
from pyecharts.charts import Bar, Page
from pyecharts.commons.utils import JsCode
import math

# Data
data = [
    { "name": "学习/工作", "value": 47.89, "description": "咖啡作为生产力工具，多用于提神醒脑与提升专注力。" },
    { "name": "休闲放松", "value": 45.20, "description": "以社交与放松为主，偏向享受型消费。" },
    { "name": "驾车出行", "value": 36.62, "description": "出行途中补充精力，降低疲劳感。" },
    { "name": "熬夜提神", "value": 33.29, "description": "加班或熬夜场景中的即时提神手段。" },
    { "name": "商务洽谈", "value": 33.16, "description": "会面与洽谈中的社交饮品与空间消费。" }
]

names = [d["name"] for d in data]
# Prepare data for series (include description for tooltip)
# In Pyecharts, if we pass a dict, it needs to be careful. 
# We'll pass dicts with 'value' and custom keys.
series_data = []
for d in data:
    series_data.append({
        "value": d["value"],
        "name": d["name"],
        "description": d["description"]
    })

max_val = max(d["value"] for d in data)
axis_max = math.ceil(max_val / 5) * 5

# Tooltip JS
tooltip_js = JsCode("""
    function (p) {
        /* p.data contains the item object if passed as dict */
        const d = p.data;
        return `
            <div style="padding:14px;min-width:260px">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
                <div style="width:8px;height:18px;border-radius:999px;background:#f59e0b"></div>
                <div style="font-size:18px;font-weight:650;color:#292524">${d.name}</div>
              </div>
              <div style="display:flex;align-items:baseline;gap:8px;margin:2px 0 10px 0">
                <div style="font-size:44px;font-weight:800;color:#d97706;line-height:1">${Number(d.value).toFixed(2)}</div>
                <div style="font-size:14px;color:#78716c;font-weight:600">%</div>
              </div>
              ${d.description ? `<div style="border-top:1px solid #f5f5f4;padding-top:10px;font-size:12px;line-height:1.6;color:#78716c">${d.description}</div>` : ``}
            </div>
        `;
    }
""")

# Gradient Color
color_js = JsCode("""
    new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#fbbf24' },
        { offset: 1, color: '#b45309' }
    ])
""")

bar = (
    Bar(init_opts=opts.InitOpts(width="1100px", height="620px", bg_color="#ffffff"))
    .add_xaxis(names)
    .add_yaxis(
        series_name="占比",
        y_axis=series_data,
        category_gap="5%",
        bar_width=80,
        itemstyle_opts=opts.ItemStyleOpts(
            color=color_js,
            border_radius=[18, 18, 12, 12],
        ),
        label_opts=opts.LabelOpts(
            is_show=True,
            position="top",
            distance=14,
            color="#78716c",
            font_size=14,
            font_weight=800,
            formatter=JsCode("function(p){ return Number(p.value).toFixed(2) + '%';}")
        ),
        is_show_background=True,
        background_style={
            "color": "#f5f5f4",
            "borderRadius": [18, 18, 12, 12]
        },
        emphasis_opts={
            "focus": "self",
            "itemStyle": {
                "color": "#f59e0b",
                "shadowBlur": 22,
                "shadowColor": "rgba(245,158,11,0.35)",
                "shadowOffsetX": 0,
                "shadowOffsetY": 10
            }
        },
        blur_opts={
            "itemStyle": { "opacity": 0.35 }
        }
    )
)

# Configured in set_global_opts
# Grid is set manually below because it is not in set_global_opts for Bar in some versions/contexts
# but straightforward assignment works.

bar.set_global_opts(
    title_opts=opts.TitleOpts(
        title="消费者咖啡饮用场景分布",
        pos_left="center",
        pos_top="3",
        title_textstyle_opts=opts.TextStyleOpts(font_size=30, font_weight=700, color="#1c1917")
    ),
    # Pass tooltip options as dict to support extraCssText
    tooltip_opts={
        "trigger": "item",
        "backgroundColor": "rgba(255,255,255,0.96)",
        "borderColor": "#e7e5e4",
        "borderWidth": 1,
        "extraCssText": "border-radius:16px; box-shadow:0 18px 40px rgba(0,0,0,0.12); backdrop-filter: blur(10px);",
        "textStyle": {"color": "#000"},
        "formatter": tooltip_js,
    },
    xaxis_opts=opts.AxisOpts(
        type_="category",
        axisline_opts=opts.AxisLineOpts(is_show=False),
        axistick_opts=opts.AxisTickOpts(is_show=False),
        axislabel_opts=opts.LabelOpts(color="#78716c", font_size=13, font_weight=650, margin=18)
    ),
    yaxis_opts=opts.AxisOpts(
        type_="value",
        max_=axis_max,
        axisline_opts=opts.AxisLineOpts(is_show=False),
        axistick_opts=opts.AxisTickOpts(is_show=False),
        axislabel_opts=opts.LabelOpts(is_show=False),
        splitline_opts=opts.SplitLineOpts(is_show=True, linestyle_opts=opts.LineStyleOpts(color="#e7e5e4", type_="dashed"))
    ),
    legend_opts=opts.LegendOpts(is_show=False),
)
bar.options["grid"] = opts.GridOpts(pos_left=40, pos_right=40, pos_top=80, pos_bottom=70).opts


page = Page(layout=Page.SimplePageLayout)
page.add(bar)
page.render("场景分布.html")
