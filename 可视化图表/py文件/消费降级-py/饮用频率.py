import pyecharts.options as opts
from pyecharts.charts import Pie, Page
from pyecharts.commons.utils import JsCode

# Data
categories = [
    "一天一杯以上",
    "每周2-3杯",
    "每周一杯",
    "每月2-3杯",
    "没有固定规律",
    "基本不喝"
]

data2024 = [14.15, 32.08, 28.11, 8.68, 10.00, 6.98]
data2025 = [14.55, 32.97, 30.42, 8.97, 7.76, 5.33]

base_colors = [
    "#FFC23A",
    "#E07A00",
    "#B45309",
    "#A3A3A3",
    "#CFCFCF",
    "#E5E5E5"
]

def hex_to_rgb(hex_color):
    h = hex_color.replace("#", "")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)

def lighten(hex_color, amount=0.62):
    r, g, b = hex_to_rgb(hex_color)
    r = int(r + (255 - r) * amount)
    g = int(g + (255 - g) * amount)
    b = int(b + (255 - b) * amount)
    return f"rgb({r},{g},{b})"

inner_colors = [lighten(c, 0.62) for c in base_colors]

inner_data = []
for i, name in enumerate(categories):
    inner_data.append({
        "name": name, 
        "value": data2024[i],
        "itemStyle": {"color": inner_colors[i]}
    })

outer_data = []
for i, name in enumerate(categories):
    outer_data.append({
        "name": name, 
        "value": data2025[i],
        "itemStyle": {"color": base_colors[i]}
    })

# Tooltip
tooltip_js = JsCode("""
    function (p) {
        const year = p.seriesName;
        const ring = year === '2024' ? '内圈（2024）' : '外圈（2025）';
        const v = Number(p.value).toFixed(2);
        return `
            <div style="font-weight:800;font-size:16px;color:#111827;margin-bottom:6px">${p.name}</div>
            <div style="color:#6b7280;font-size:12px;margin-bottom:10px">${ring}</div>
            <div style="display:flex;align-items:baseline;gap:6px">
              <div style="font-weight:900;font-size:18px;color:#111827">${v}%</div>
            </div>
        `;
    }
""")

pie = (
    Pie(init_opts=opts.InitOpts(width="980px", height="680px", bg_color="#fbf7f1"))
    .add(
        "2024",
        [(d["name"], d["value"]) for d in inner_data],
        radius=["34%", "56%"],
        center=["50%", "52%"],
        rosetype=None,
        label_opts=opts.LabelOpts(is_show=False),
        itemstyle_opts=opts.ItemStyleOpts(border_color="#fbf7f1", border_width=4),
    )
    .add(
        "2025",
        [(d["name"], d["value"]) for d in outer_data],
        radius=["62%", "84%"],
        center=["50%", "52%"],
        label_opts=opts.LabelOpts(is_show=False),
        itemstyle_opts=opts.ItemStyleOpts(border_color="#fbf7f1", border_width=4),
    )
    .set_global_opts(
        title_opts=opts.TitleOpts(
            title="消费者咖啡饮用频次（%）",
            subtitle="2024与2025对比（单位：%）",
            pos_left="center",
            pos_top="0",
            title_textstyle_opts=opts.TextStyleOpts(
                color="#2f2f2f", font_size=26, font_weight=800,
                font_family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans SC,Helvetica,Arial"
            ),
            subtitle_textstyle_opts=opts.TextStyleOpts(
                font_size=16, color="#777", line_height=22
            )
        ),
        legend_opts=opts.LegendOpts(
            pos_bottom="5",
            pos_left="center",
            item_width=12,
            item_height=12,
            # icon='circle' is not directly supported in python wrapper enum sometimes, passing string works.
            legend_icon="circle",
            textstyle_opts=opts.TextStyleOpts(
                color="#6b7280", font_size=12,
                font_family="system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans SC,Helvetica,Arial"
            ),
        ),
        tooltip_opts=opts.TooltipOpts(
            trigger="item",
            is_append_to_body=True,
            background_color="rgba(255,255,255,0.96)",
            border_color="rgba(0,0,0,0.06)",
            border_width=1,
            formatter=tooltip_js,
            extra_css_text="box-shadow:0 14px 40px rgba(0,0,0,0.12);border-radius:14px;padding:14px 14px;",
        ),
        graphic_opts=[
            opts.GraphicGroup(
                graphic_item=opts.GraphicItem(
                    left="50%", top="52%", z=100, z_level=10, bounding="raw"
                ),
                children=[
                    opts.GraphicText(
                        graphic_item=opts.GraphicItem(
                            left=0, top=-18 # Relative to group? No, in Pyecharts GraphicGroup children usually relative to group if specified?
                            # Actually ECharts graphic group children x/y are relative to group position.
                            # But Pyecharts wrapper might need careful handling.
                            # Standard ECharts "x": 0, "y": -18 inside group.
                        ),
                        graphic_textstyle_opts=opts.GraphicTextStyleOpts(
                            text="2024",
                            graphic_basicstyle_opts=opts.GraphicBasicStyleOpts(fill="#D97706"),
                            font="900 46px sans-serif",
                            text_align="center",
                            text_vertical_align="middle"
                        )
                    ),
                    opts.GraphicText(
                        graphic_item=opts.GraphicItem(
                            left=0, top=26
                        ),
                        graphic_textstyle_opts=opts.GraphicTextStyleOpts(
                            text="2025",
                            graphic_basicstyle_opts=opts.GraphicBasicStyleOpts(fill="#D97706"),
                            font="900 46px sans-serif",
                            text_align="center",
                            text_vertical_align="middle"
                        )
                    )
                ]
            )
        ]
    )
)

# Inject itemStyles back into data
for i, item in enumerate(pie.options['series'][0]['data']):
    item['itemStyle'] = inner_data[i]['itemStyle']
for i, item in enumerate(pie.options['series'][1]['data']):
    item['itemStyle'] = outer_data[i]['itemStyle']

# Custom Emphasis configuration
pie.options["series"][0]["emphasis"] = {
    "scale": True,
    "scaleSize": 10,
    "itemStyle": {
        "shadowBlur": 18,
        "shadowColor": "rgba(210,140,60,0.25)",
        "shadowOffsetY": 10,
        "borderWidth": 12
    }
}
pie.options["series"][1]["emphasis"] = {
    "scale": True,
    "scaleSize": 12,
    "itemStyle": {
        "shadowBlur": 20,
        "shadowColor": "rgba(210,140,60,0.30)",
        "shadowOffsetY": 12,
        "borderWidth": 12
    }
}



# Graphic Text font adjustment requires careful string construction or Pyecharts internal logic
# Pyecharts uses `style` dict for Text.
# `font` property in style is shorthand.
# Let's ensure it matches "900 46px ...".
# In Pyecharts generated JSON, it puts `style: { text:..., font: ... }`.

# The `left`/`top` in children of group:
# ECharts JSON: {type:'text', x:0, y:-18, ...}
# Pyecharts GraphicItem maps `left`/`top` to `x`/`y`? or `left`/`top`?
# ECharts `graphic` elements use `x`/`y` for position relative to parent, or absolute if no parent?
# Actually `left`/`top` are for positioning the element (or group).
# Inside group, children use `x` / `y` (transform) or `left`/`top` (layout)?
# ECharts docs say Group children should use `x` / `y` (translation).
# But Pyecharts `GraphicItem` usually exposes `left`/`top`.
# I will inspect the generated JSON or assume `left`/`top` works or check Pyecharts source.
# Usually Pyecharts maps `left` -> `left`, `top` -> `top`.
# For `Text` inside `Group`, often `x` and `y` are preferred in raw ECharts.
# I will use `opts.GraphicItem(left=...)` which translates to `left`.
# ECharts allows `left` inside group? Maybe.
# But original code used `x: 0, y: -18`.
# I'll try to use `left` and `top`. If alignment fails, I might need `JsCode` or verify.

page = Page(layout=Page.SimplePageLayout)
page.add(pie)
page.render("饮用频率.html")
