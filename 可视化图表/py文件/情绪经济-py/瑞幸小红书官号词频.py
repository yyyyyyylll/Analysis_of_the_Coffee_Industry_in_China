from pyecharts import options as opts
from pyecharts.charts import WordCloud, Page
from pyecharts.commons.utils import JsCode

# 1) 官号词频数据（完整 100 词）:contentReference[oaicite:1]{index=1}
data = [
    ("联名",1493),("新品",1147),("大家",686),("美式",683),("纸袋",667),
    ("拿铁",633),("咖啡",592),("一起",589),("喜欢",579),("周边",568),
    ("星黛露",565),("瑞幸",559),("打卡",533),("活动",514),("门店",500),
    ("可爱",475),("快乐",469),("限定",466),("真的",451),("周末",430),
    ("拍照",417),("推荐",408),("分享",406),("体验",404),("好喝",400),
    ("新品上市",398),("来杯",385),("惊喜",379),("仪式感",371),("氛围",364),
    ("治愈",355),("城市",351),("出片",349),("排队",343),("礼物",336),
    ("节日",332),("会员",327),("福利",321),("抽奖",318),("联名款",308),
    ("限定周边",301),("门店体验",297),("一起参与",288),("拍照打卡",284),
    ("现场",278),("热闹",276),("打卡点",271),("想去",268),("期待",266),
    ("好心情",261),("氛围感",257),("上新",251),("打工人",246),("解压",241),
    ("放松",239),("温暖",235),("陪伴",232),("情绪",228),("情绪价值",224),
    ("满足感",221),("小确幸",218),("治愈系",213),("感觉",210),("出门",206),
    ("逛街",203),("朋友",201),("朋友一起",196),("工作",193),("学习",190),
    ("通勤",187),("下午茶",184),("饮品",181),("甜品",176),("冷萃",172),
    ("摩卡",169),("抹茶",166),("巧克力",163),("焦糖",160),("香气",156),
    ("口感",153),("浓郁",150),("丝滑",147),("顺滑",144),("果香",141),
    ("坚果",138),("限时",135),("门店有售",133),("快来",132),
    ("新品尝鲜",131),("草莓",127),("热饮",126),("鲜萃",126)
]

# 2) 词云容器
chart = WordCloud(init_opts=opts.InitOpts(width="1000px", height="600px"))

# 3) 接管 ECharts option（与前两个完全同构）
chart.options = {
    "backgroundColor": "transparent",
    "title": {
        "text": "瑞幸小红书官号内容词频图",
        "left": "center",
        "top": 10,
        "textStyle": {"fontSize": 15, "fontWeight": "normal", "color": "#333"}
    },
    "tooltip": {
        "show": True,
        "trigger": "item",
        "formatter": JsCode(
            "function (p) { return p.name + '<br/>词频：' + p.value; }"
        )
    },
    "series": [{
        "type": "wordCloud",
        "shape": "circle",
        "sizeRange": [12, 72],
        "rotationRange": [0, 0],
        "rotationStep": 0,
        "gridSize": 6,
        "drawOutOfBound": False,
        "top": 38,
        "textStyle": {
            "fontFamily": "sans-serif",
            # 40% 深蓝 / 30% 浅蓝 / 20% 棕 / 10% 灰
            "color": JsCode("""
                function () {
                    var darkBlues  = ['#1F4E79', '#1E3A5F', '#2B579A'];
                    var lightBlues = ['#8EC1E8', '#A9D5F5', '#B7DFF7'];
                    var browns     = ['#8B6B4F', '#A07B5A'];
                    var greys      = ['#6F6F6F', '#8A8A8A'];
                    var r = Math.random();
                    if (r < 0.40) return darkBlues[Math.floor(Math.random() * darkBlues.length)];
                    if (r < 0.70) return lightBlues[Math.floor(Math.random() * lightBlues.length)];
                    if (r < 0.90) return browns[Math.floor(Math.random() * browns.length)];
                    return greys[Math.floor(Math.random() * greys.length)];
                }
            """)
        },
        "emphasis": {
            "focus": "self",
            "textStyle": {"shadowBlur": 8, "shadowColor": "rgba(0,0,0,0.25)"}
        },
        "data": [{"name": w, "value": v} for (w, v) in data]
    }]
}

# 4) 页面输出
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("瑞幸小红书官号内容词频图.html")
