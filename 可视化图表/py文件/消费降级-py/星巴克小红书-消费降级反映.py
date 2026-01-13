from pyecharts import options as opts
from pyecharts.charts import WordCloud, Page
from pyecharts.commons.utils import JsCode

# 1. 准备词云数据 [cite: 21]
data = [
    ("价格", 209), ("消费", 136), ("一杯", 130), ("买", 126), ("真的", 91),
    ("性价比", 90), ("划算", 90), ("优惠", 88), ("杯子", 88), ("门店", 77),
    ("品牌", 72), ("味道", 70), ("好喝", 70), ("咖啡", 69), ("活动", 69),
    ("买一送一", 67), ("打折", 65), ("会员", 65), ("省钱", 64), ("便宜", 64),
    ("折扣", 63), ("券", 62), ("薅羊毛", 61), ("星巴克", 61), ("瑞幸", 60),
    ("对比", 59), ("选择", 58), ("平替", 57), ("想买", 56), ("推荐", 55),
    ("预算", 55), ("贵", 54), ("便宜点", 53), ("划不划算", 52), ("值不值", 51),
    ("价格差", 50), ("同款", 50), ("囤", 49), ("优惠券", 49), ("积分", 48),
    ("星礼卡", 48), ("套餐", 47), ("买咖啡", 47), ("买饮品", 46), ("打工人", 46),
    ("日常", 45), ("通勤", 44), ("周末", 44), ("不太值", 43), ("太贵", 43),
    ("便宜很多", 42), ("降价", 42), ("涨价", 41), ("涨", 41), ("奶茶", 40),
    ("饮品", 40), ("拿铁", 39), ("美式", 39), ("冷萃", 38), ("燕麦奶", 38),
    ("加糖", 37), ("少糖", 37), ("大杯", 36), ("中杯", 36), ("小杯", 35),
    ("量", 35), ("门店价", 34), ("外卖", 34), ("自取", 33), ("下单", 33),
    ("平台", 32), ("团购", 32), ("秒杀", 31), ("限时", 31), ("促销", 30),
    ("便宜点买", 30), ("省", 29), ("性价比高", 29), ("学生", 28), ("价格友好", 28),
    ("买得起", 27), ("控制预算", 27), ("能省则省", 26), ("自己做", 26), ("速溶", 25),
    ("咖啡豆", 25), ("挂耳", 24), ("在家", 24), ("办公室", 23), ("点单", 22),
    ("热量", 22), ("折", 22), ("便宜好喝", 21), ("必须", 20), ("员工", 20)
]

# 2. 创建词云图容器
chart = WordCloud(init_opts=opts.InitOpts(width="1000px", height="600px"))

# 3. 注入配置以匹配原始 HTML 的风格 [cite: 18, 22, 27]
chart.options = {
    "backgroundColor": "transparent",
    "title": {
        "text": "星巴克小红书-消费降级反映",
        "subtext": "关键词：消费、买、价格",
        "left": "center",
        "top": 8,
        "itemGap": 4,
        "textStyle": {"fontSize": 15, "fontWeight": "normal", "color": "#333"},
        "subtextStyle": {"fontSize": 12, "color": "#666"}
    },
    "tooltip": {
        "show": True,
        "trigger": "item",
        "formatter": JsCode("function (p) { return p.name + '<br/>词频：' + p.value; }")
    },
    "series": [{
        "type": "wordCloud",
        "shape": "circle",
        "sizeRange": [12, 72], # 词频越高字号越大 [cite: 29]
        "rotationRange": [0, 0], # 全部水平放置 [cite: 29]
        "gridSize": 6,
        "top": 50,
        "textStyle": {
            "fontFamily": "sans-serif",
            # 还原原始 HTML 的配色逻辑 (40%深绿, 30%浅绿, 20%棕, 10%灰) [cite: 22, 25]
            "color": JsCode("""
                function () {
                    var darkGreens = ['#2F6F55', '#3A7F63', '#2C6650'];
                    var lightGreens = ['#A8D5BA', '#BFE3C9', '#CFEBD6'];
                    var browns = ['#8B6B4F', '#A07B5A'];
                    var greys = ['#6F6F6F', '#8A8A8A'];
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
            "textStyle": {"shadowBlur": 8, "shadowColor": "rgba(0,0,0,0.25)"}
        },
        "data": [{"name": i[0], "value": i[1]} for i in data]
    }]
}

# 4. 渲染输出
page = Page(layout=Page.SimplePageLayout)
page.add(chart)
page.render("星巴克小红书-消费降级反映.html")