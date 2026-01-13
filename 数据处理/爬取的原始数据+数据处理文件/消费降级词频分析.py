import pandas as pd
import jieba
import collections
import re
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import platform
import os

# ================= 配置区域 =================
INPUT_FILE = '瑞幸消费降级数据.csv'
OUTPUT_CSV = '瑞幸_词频统计_包含价格.csv'
OUTPUT_IMG = '瑞幸_词云_包含价格.png'

# 1. 【自定义词典】：强制 jieba 不切开这些词
# 你可以在这里添加任何你不想被切开的专有名词
CUSTOM_DICT = [
    '9.9', '9.9元', '9块9', '九块九',
    '酱香拿铁', '生椰拿铁', '马斯卡彭', '丝绒拿铁', '小蓝杯',
    '瑞幸', 'luckin', '咖啡', '狠狠', '冲冲冲','卡皮巴拉','鬼灭之刃','疯狂动物城'
]

# 2. 【同义词映射】：把不同的叫法统一成一个标准词
# 格式：'原词': '标准词'
SYNONYM_DICT = {

}

# 3. 【停用词】：过滤掉无意义的词
STOP_WORDS = {
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '去',
    '你',
    '吧', '啊', '吗', '呢', '哈', '那', '这', '对', '跟', '被', '为', '之', '与', '及', '等', '或', '可以', '这个',
    '那个',
    '因为', '所以', '但是', '如果', '就是', '我们', '你们', '他们', '它们', '自己', '什么', '怎么', '这里', '那里',
    '笔记', '小红书', '全文', '链接', '网页', '查看', '复制', '打开', '详情', '无标题', '展开', '发布', '时间','没有','一杯','今天','杯子','还是','不是','直接','现在','感觉','一下','然后','不能','比较','一天','真的','员工','工人','喝咖啡','工人','时候','开始'
}
# 情绪经济新加的：
# ================= 初始化 Jieba =================
# 将自定义词加入词库
for word in CUSTOM_DICT:
    jieba.add_word(word)


# ================= 字体设置 =================
def get_font_path():
    system = platform.system()
    if system == 'Darwin':
        # Mac 字体寻找逻辑
        font_candidates = [
            '/System/Library/Fonts/PingFang.ttc',
            '/System/Library/Fonts/Supplemental/Arial Unicode MS.ttf',
            '/System/Library/Fonts/STHeiti Light.ttc',
        ]
        for font in font_candidates:
            if os.path.exists(font): return font
        return 'Arial'
    elif system == 'Windows':
        return 'C:/Windows/Fonts/simhei.ttf'
    else:
        return None


# ================= 读取数据 =================
def load_data(filepath):
    try:
        df = pd.read_csv(filepath, encoding='utf-8-sig')
    except:
        try:
            df = pd.read_csv(filepath, encoding='gb18030')
        except Exception as e:
            print(f"❌ 读取失败: {e}")
            return None
    return df


# ================= 核心：文本处理与分词 =================
def process_text(df):
    print("✂️ 正在进行智能分词处理...")
    all_words = []

    # 拼接每一行的内容
    for _, row in df.iterrows():
        title = str(row['标题']) if pd.notna(row['标题']) else ''
        content = str(row['正文']) if pd.notna(row['正文']) else ''
        tags = str(row['标签']) if pd.notna(row['标签']) else ''

        full_text = f"{title} {content} {tags}"

        # --- 修改点 1: 正则清洗放宽 ---
        # 原来是 r'[^\w\s\u4e00-\u9fa5]' 会把小数点和数字过滤掉
        # 现在改为 r'[^\w\s\u4e00-\u9fa5\.]' 允许小数点，且不清洗数字
        full_text = re.sub(r'[^\w\s\u4e00-\u9fa5\.]', ' ', full_text)

        # Jieba 分词
        words = jieba.lcut(full_text)

        for word in words:
            word = word.strip()

            # 过滤掉长度为1的词，但保留特殊的单个字（如果有需要）
            if len(word) < 2:
                continue

            # --- 修改点 2: 同义词替换 ---
            if word in SYNONYM_DICT:
                word = SYNONYM_DICT[word]

            # --- 修改点 3: 智能过滤逻辑 ---
            # 如果在停用词表中，跳过
            if word in STOP_WORDS:
                continue

            # 如果是纯数字（如 2023, 12），通常是日期或无意义数字，跳过
            # 但是！如果它在我们定义的“保留名单”里（比如 9.9 虽然像数字，但我们已经替换成了 9.9元），或者就是我们想要的格式
            # 这里的逻辑是：如果是纯数字且不在自定义词典里，就过滤。
            # 但因为我们把 '9.9' 映射成了 '9.9元'，它就不再是纯数字了，会被保留。
            if word.replace('.', '').isdigit() and word not in CUSTOM_DICT:
                continue

            all_words.append(word)

    return all_words


# ================= 可视化 =================
def visualize(word_counts):
    font_path = get_font_path()

    # 词云
    print("☁️ 生成词云...")
    wc = WordCloud(
        font_path=font_path,
        width=1000, height=800,
        background_color='white',
        max_words=150,
        colormap='tab10'  # 换个颜色风格
    )
    wc.generate_from_frequencies(word_counts)
    wc.to_file(OUTPUT_IMG)
    print(f"   已保存: {OUTPUT_IMG}")

    # 柱状图
    print("📊 生成柱状图...")
    top_20 = word_counts.most_common(20)
    words = [x[0] for x in top_20]
    counts = [x[1] for x in top_20]

    if platform.system() == 'Darwin':
        plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'PingFang SC']
    else:
        plt.rcParams['font.sans-serif'] = ['SimHei']
    plt.rcParams['axes.unicode_minus'] = False

    plt.figure(figsize=(12, 6))
    plt.bar(words, counts, color='#ff7f0e')  # 橙色系，像瑞幸
    plt.title('Top 20 高频词 ', fontsize=15)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()


# ================= 主程序 =================
if __name__ == '__main__':
    if not os.path.exists(INPUT_FILE):
        print("❌ 文件不存在")
        exit()

    df = load_data(INPUT_FILE)
    if df is not None:
        clean_words = process_text(df)

        # 统计
        counter = collections.Counter(clean_words)
        print(f"✅ 统计完成，共 {len(counter)} 个独立词汇")

        # 打印前10个看看效果
        print("前10高频词:", counter.most_common(10))

        # 保存
        pd.DataFrame(counter.most_common(), columns=['词汇', '频次']).to_csv(OUTPUT_CSV, index=False,
                                                                             encoding='utf-8-sig')

        # 画图
        visualize(counter)