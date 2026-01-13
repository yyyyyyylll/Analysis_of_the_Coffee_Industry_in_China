from pyecharts import options as opts
from pyecharts.charts import WordCloud, Page
from pyecharts.commons.utils import JsCode

# 1) 词云数据（HTML 里 const data 原样转写）:contentReference[oaicite:1]{index=1}
data = [
    ("联名",240),("打卡",127),("疯狂动物城",115),("新品",107),("卡皮巴拉",106),
    ("周边",101),("情绪",98),("活动",96),("可爱",92),("喜欢",86),
    ("门店",83),("快乐",79),("太好看",76),("拍照",74),("氛围",73),
    ("真的",72),("体验",70),("一起",69),("周末",67),("排队",66),
    ("出片",64),("限定",63),("治愈",62),("好喝",60),("咖啡",59),
    ("朋友",58),("礼物",56),("惊喜",55),("开心",54),("仪式感",53),
    ("现场",52),("热闹",51),("打卡点",50),("收藏",49),("推荐",48),
    ("分享",47),("想去",46),("期待",45),("好心情",44),("氛围感",43),
    ("节日",42),("福利",41),("抽奖",40),("参与",39),("互动",38),
    ("拍照打卡",37),("现场活动",36),("门店体验",35),("打工人",34),
    ("解压",33),("放松",33),("温暖",32),("陪伴",31),("治愈系",30),
    ("感觉",30),("城市",29),("上新",28),("打卡成功",28),("出门",27),
    ("逛街",27),("情绪价值",26),("满足感",26),("小确幸",25),("治愈一下",25),
    ("休息",24),("放空",24),("忙碌",23),("工作",23),("学习",22),
    ("通勤",22),("下午茶",21),("饮品",21),("甜品",20),("拿铁",20),
    ("冷萃",19),("美式",19),("抹茶",18),("巧克力",18),("焦糖",17),
    ("香气",17),("口感",16),("浓郁",16),("丝滑",15),("顺滑",15),
    ("果香",14),("坚果",14),("限时",13),("快来",13),("门店有售",12),
    ("新品上市",12),("来杯",11),("周边限定",11),("联名款",10),("打卡分享",10),
    ("朋友一起",9),("拍照好看",9),("一起参与",8),("幸运",8),("开心一下",7),
    ("买到",7),("太可爱",6),("排队也值",6),("拍照很好看",5),("门店打卡",5),
    ("城市打卡",4),("周边好可爱",4),("打卡必去",3),("活动现场",3),
    ("套餐",19),("自由",19),("别人",18)
]

# 2) 词云容器
chart = WordCloud(init_opts=opts.InitOpts(width="1000px", height="600px"))

# 3) 接管 ECharts option（保持你原 HTML 的视觉逻辑）
chart.options = {
    "backgroundColor": "transparent",
    "title": {
        "text": "瑞幸小红书-情绪经济反映",
        "subtext": "关键词：情绪、打卡、活动",
        "left": "center",
        "top": 8,
        "itemGap": 4,
        "textStyle": {"fontSize": 15, "fontWeight": "normal", "color": "#333"},
        "subtextStyle": {"fontSize": 12, "color": "#666"},
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
        "top": 50,
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
            "textStyle": {"shadowBlur": 8, "shadowColor": "rgba(0,0,0,0.25)"},
        },
        "data": [{"name": w, "value": v} for (w, v) in data],
    }],
}

# 4) 渲染输出
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("瑞幸小红书-情绪经济反映.html")
