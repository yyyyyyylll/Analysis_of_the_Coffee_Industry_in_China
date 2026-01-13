from pyecharts import options as opts
from pyecharts.charts import WordCloud, Page
from pyecharts.commons.utils import JsCode

# 1) 词云数据（原 HTML const data 全量转写）:contentReference[oaicite:1]{index=1}
data = [
    ("活动",203),("打卡",106),("真的",104),("空间",104),("情绪",95),
    ("门店",89),("喜欢",87),("饮品",84),("拍照",79),("氛围",78),
    ("周末",74),("快乐",73),("体验",72),("治愈",71),("新品",70),
    ("朋友",66),("城市",64),("咖啡",64),("限定",63),("可爱",62),
    ("一起",62),("出片",61),("仪式感",60),("好看",59),("热闹",58),
    ("现场",57),("排队",56),("打卡点",55),("周边",55),("联名",54),
    ("惊喜",53),("开心",52),("好喝",52),("新品上市",51),("来杯",50),
    ("分享",50),("推荐",49),("收藏",49),("打工人",48),("解压",47),
    ("放松",47),("温暖",46),("陪伴",46),("治愈系",45),("感觉",45),
    ("想去",44),("期待",44),("好心情",43),("氛围感",43),("节日",42),
    ("礼物",42),("限定周边",41),("抽奖",41),("福利",40),("参与",40),
    ("互动",39),("拍照打卡",39),("现场活动",38),("门店体验",38),
    ("朋友一起",37),("走心",37),("上新",36),("打卡成功",36),("出门",35),
    ("逛街",35),("打卡分享",34),("情绪价值",34),("满足感",33),("小确幸",33),
    ("治愈一下",32),("休息",32),("放空",31),("忙碌",31),("工作",30),
    ("学习",30),("通勤",29),("下午茶",29),("甜品",28),("拿铁",28),
    ("冷萃",27),("美式",27),("抹茶",26),("巧克力",26),("焦糖",25),
    ("香气",25),("口感",24),("浓郁",24),("丝滑",23),("顺滑",23),
    ("果香",22),("坚果",22),("新品尝鲜",21),("限时",21),("门店有售",20),
    ("快来",20)
]

# 2) 词云容器
chart = WordCloud(init_opts=opts.InitOpts(width="1000px", height="600px"))

# 3) 接管 ECharts option（严格对齐你给的 HTML 配置）
chart.options = {
    "backgroundColor": "transparent",
    "title": {
        "text": "星巴克小红书-情绪经济反映",
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
page.render("星巴克小红书-情绪经济反映.html")
