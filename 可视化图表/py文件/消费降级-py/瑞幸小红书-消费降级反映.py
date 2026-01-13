from pyecharts import options as opts
from pyecharts.charts import WordCloud, Page
from pyecharts.commons.utils import JsCode

# 1) 词云数据（HTML const data 全量转写）:contentReference[oaicite:1]{index=1}
data = [
    ("联名",195),("价格",122),("疯狂动物城",96),("奶茶",84),("消费者",82),
    ("买",81),("...",76),("9.9",76),("新品",75),("贝果",75),
    ("星巴克",72),("性价比",70),("便宜",68),("瑞幸",67),("活动",66),
    ("优惠",64),("咖啡",63),("一杯",62),("真的",61),("打卡",60),
    ("门店",59),("券",58),("薅羊毛",57),("会员",56),("划算",55),
    ("折扣",54),("推荐",53),("买一送一",52),("便宜点",51),("套餐",50),
    ("对比",49),("平替",48),("预算",47),("省钱",46),("贵",45),
    ("值不值",44),("不太值",43),("太贵",42),("降价",41),("涨价",40),
    ("积分",39),("星礼卡",38),("团购",37),("外卖",36),("自取",35),
    ("下单",34),("平台",33),("促销",32),("限时",31),("秒杀",30),
    ("囤",29),("日常",28),("通勤",27),("打工人",26),("学生",25),
    ("买得起",24),("能省则省",23),("自己做",22),("在家",21),("办公室",20),
    ("速溶",19),("咖啡豆",18),("挂耳",17),("美式",16),("拿铁",15),
    ("冷萃",14),("抹茶",13),("巧克力",12),("焦糖",11),("香气",10),
    ("口感",9),("浓郁",8),("丝滑",7),("顺滑",6),("果香",5),
    ("坚果",4),("热量",3),("少糖",3),("加糖",3),("大杯",3),
    ("中杯",2),("小杯",2),("量",2),("门店价",2),("优惠券",2),
    ("价格友好",2),("便宜很多",2),("便宜好喝",2),("买咖啡",2),("买饮品",2),
    ("点单",2),("周末",2),("想买",2),("选择",2),("同款",2),
    ("折",2),("省",2),("控制预算",2),("划不划算",2),("价格差",2),
    ("消费",2),("买到",1),("必须",1),("员工",1),("快来",1)
]

# 2) 词云容器
chart = WordCloud(init_opts=opts.InitOpts(width="1000px", height="600px"))

# 3) 接管 ECharts option（对齐你 HTML 配置）
chart.options = {
    "backgroundColor": "transparent",
    "title": {
        "text": "瑞幸小红书-消费降级反映",
        "subtext": "关键词：消费、买、价格",
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
page.render("瑞幸小红书-消费降级反映.html")
