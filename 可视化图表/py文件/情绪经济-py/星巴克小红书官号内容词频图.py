from pyecharts import options as opts
from pyecharts.charts import WordCloud, Page
from pyecharts.commons.utils import JsCode

# 1) 官号词频数据（原 HTML 全量）:contentReference[oaicite:1]{index=1}
data = [
    ("门店",572),("系列",439),("风味",426),
    ("一杯",408),("一起",405),("新品",398),
    ("咖啡",395),("限定",390),("喜欢",386),
    ("打开",382),("时光",377),("快乐",376),
    ("分享",373),("生活",372),("春日",368),
    ("星巴克",366),("浓郁",359),("香气",356),
    ("口感",352),("解锁",350),("灵感",347),
    ("开启",345),("温暖",343),("好喝",340),
    ("新品上市",338),("来杯",335),("今日",333),
    ("搭配",331),("美味",329),("周末",327),
    ("仪式感",325),("感受",323),("推荐",321),
    ("尝试",319),("限定款",317),("治愈",315),
    ("香甜",313),("拿铁",311),("冰饮",309),
    ("热饮",307),("抹茶",305),("巧克力",303),
    ("焦糖",301),("坚果",299),("果香",297),
    ("轻盈",295),("顺滑",293),("丝滑",291),
    ("新口味",289),("上线",287),("门店有售",285),
    ("快来",283),("收藏",281),("打卡",279),
    ("一起打卡",277),("拍照",275),("好心情",273),
    ("春天",271),("夏日",269),("秋日",267),
    ("冬日",265),("节日",263),("礼物",261),
    ("限定周边",259),("联名",257),("会员",255),
    ("星礼卡",253),("积分",251),("星享俱乐部",249),
    ("新品推荐",247),("风味拿铁",245),("冷萃",243),
    ("美式",241),("馥芮白",239),("摩卡",237),
    ("提神",235),("下午茶",233),("早餐",231),
    ("加班",229),("学习",227),("通勤",225),
    ("出门",223),("随手",221),("一口",219),
    ("满分",217),("好味道",215),("氛围",213),
    ("门店体验",211),("新品尝鲜",209),("新品上新",207),
    ("限时",205),("福利",203),("活动",201),
    ("一起参与",199),("抽奖",197),("惊喜",195),
    ("期待",193),("马上",191),("快去",189)
]

# 2) 词云容器
chart = WordCloud(init_opts=opts.InitOpts(width="1000px", height="600px"))

# 3) 接管 ECharts option（与 HTML 视觉一致）
chart.options = {
    "backgroundColor": "transparent",
    "title": {
        "text": "星巴克小红书官号内容词频图",
        "left": "center",
        "top": 10,
        "textStyle": {"fontSize": 15, "fontWeight": "normal", "color": "#333"},
    },
    "tooltip": {
        "show": True,
        "trigger": "item",
        "formatter": JsCode("function (p) { return p.name + '<br/>词频：' + p.value; }"),
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
            # 40% 深绿 / 30% 浅绿 / 20% 棕 / 10% 灰
            "color": JsCode("""
                function () {
                    var darkGreens  = ['#2F6F55', '#3A7F63', '#2C6650'];
                    var lightGreens = ['#A8D5BA', '#BFE3C9', '#CFEBD6'];
                    var browns      = ['#8B6B4F', '#A07B5A'];
                    var greys       = ['#6F6F6F', '#8A8A8A'];
                    var r = Math.random();
                    if (r < 0.40) return darkGreens[Math.floor(Math.random() * darkGreens.length)];
                    if (r < 0.70) return lightGreens[Math.floor(Math.random() * lightGreens.length)];
                    if (r < 0.90) return browns[Math.floor(Math.random() * browns.length)];
                    return greys[Math.floor(Math.random() * greys.length)];
                }
            """),
        },
        "emphasis": {
            "focus": "self",
            "textStyle": {"shadowBlur": 8, "shadowColor": "rgba(0,0,0,0.25)"},
        },
        "data": [{"name": w, "value": v} for (w, v) in data],
    }],
}

# 4) 渲染输出
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("星巴克小红书官号内容词频图.html")
