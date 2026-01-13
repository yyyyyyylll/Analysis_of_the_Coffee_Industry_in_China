import pandas as pd
import jieba
import collections
import re
import matplotlib.pyplot as plt
from wordcloud import WordCloud
import platform
import os

# ================= 配置区域 =================
# 输入文件 (对应你刚才爬取的结果)
INPUT_FILE = '瑞幸官号小红书内容_标准化输出.csv'
# 输出词频统计表格
OUTPUT_CSV = '瑞幸_词频统计结果.csv'
# 词云图保存路径
OUTPUT_IMG = '瑞幸_词云图.png'

# 停用词列表 (不想统计的无意义词汇)
STOP_WORDS = {
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '去',
    '你',
    '吧', '啊', '吗', '呢', '哈', '那', '这', '对', '跟', '被', '为', '之', '与', '及', '等', '或', '可以', '这个',
    '那个',
    '因为', '所以', '但是', '如果', '就是', '我们', '你们', '他们', '它们', '自己', '什么', '怎么', '这里', '那里',
    '笔记', '小红书', '全文', '链接', '网页', '查看', '复制', '打开', '详情', '无标题', '展开','还有','轻轻','今天','这杯','今日','真的','起来','这么','即可','记得','没有'
}
#


# ================= 字体设置 (解决中文乱码) =================
def get_font_path():
    import os
    system = platform.system()

    if system == 'Darwin':  # macOS 系统
        # 定义一个字体“候选名单”，程序会从上往下找，找到哪个用哪个
        font_candidates = [
            '/System/Library/Fonts/PingFang.ttc',  # 现代 macOS 默认中文字体 (苹方)
            '/System/Library/Fonts/STHeiti Light.ttc',  # 较旧 macOS 的通用字体 (华文黑体)
            '/System/Library/Fonts/STHeiti Medium.ttc',
            '/System/Library/Fonts/Supplemental/Arial Unicode MS.ttf',  # 旧代码用的路径
            '/Library/Fonts/Arial Unicode.ttf',
        ]

        for font in font_candidates:
            if os.path.exists(font):
                print(f"✅ 已定位到中文字体: {font}")
                return font

        print("⚠️ 警告: 未在常见路径找到中文字体，词云图中文可能会乱码")
        return 'Arial'  # 最后的保底，但不支持中文

    elif system == 'Windows':
        # Windows 逻辑保持不变
        paths = [
            'C:/Windows/Fonts/simhei.ttf',  # 黑体
            'C:/Windows/Fonts/msyh.ttf',  # 微软雅黑
        ]
        for font in paths:
            if os.path.exists(font):
                return font
        return 'Arial'

    else:
        return None  # Linux


# ================= 1. 读取数据 =================
def load_data(filepath):
    try:
        df = pd.read_csv(filepath, encoding='utf-8-sig')
    except:
        try:
            df = pd.read_csv(filepath, encoding='gb18030')
        except Exception as e:
            print(f"❌ 读取文件失败: {e}")
            return None
    print(f"✅ 成功读取 {len(df)} 条数据")
    return df


# ================= 2. 文本清洗与分词 =================
def process_text(df):
    print("✂️ 正在进行文本清洗与分词...")
    text_content = ''

    # 拼接 标题 + 正文 + 标签
    for _, row in df.iterrows():
        # 将空值转为空字符串
        title = str(row['标题']) if pd.notna(row['标题']) else ''
        content = str(row['正文']) if pd.notna(row['正文']) else ''
        tags = str(row['标签']) if pd.notna(row['标签']) else ''

        # 简单清洗：去除特殊符号，只保留中文、英文、数字
        combined = f"{title} {content} {tags}"
        combined = re.sub(r'[^\w\s\u4e00-\u9fa5]', '', combined)
        text_content += combined

    # jieba 分词
    words = jieba.lcut(text_content)

    # 过滤停用词、单个字的词（通常无意义）、空白符
    clean_words = []
    for word in words:
        word = word.strip()
        if len(word) > 1 and word not in STOP_WORDS and not word.isnumeric():
            clean_words.append(word)

    return clean_words


# ================= 3. 生成图表 =================
def visualize(word_counts):
    font_path = get_font_path()

    # --- A. 生成词云图 ---
    print("☁️ 正在生成词云图...")
    wc = WordCloud(
        font_path=font_path,
        width=1000, height=800,
        background_color='white',
        max_words=75,
        colormap='viridis'  # 颜色风格
    )
    wc.generate_from_frequencies(word_counts)
    wc.to_file(OUTPUT_IMG)
    print(f"   已保存词云图: {OUTPUT_IMG}")

    # --- B. 生成柱状图 (前20个高频词) ---
    print("📊 正在生成柱状图...")
    top_20 = word_counts.most_common(20)
    words = [x[0] for x in top_20]
    counts = [x[1] for x in top_20]

    # 设置 matplotlib 字体
    if platform.system() == 'Darwin':
        plt.rcParams['font.sans-serif'] = ['Arial Unicode MS']
    else:
        plt.rcParams['font.sans-serif'] = ['SimHei']
    plt.rcParams['axes.unicode_minus'] = False

    plt.figure(figsize=(12, 6))
    plt.bar(words, counts, color='skyblue')
    plt.title('Top 20 高频词统计', fontsize=15)
    plt.xlabel('词汇')
    plt.ylabel('出现频次')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()  # 如果在 Jupyter 里运行会直接显示，脚本运行会弹窗


# ================= 主程序 =================
if __name__ == '__main__':
    # 1. 读取
    if not os.path.exists(INPUT_FILE):
        print(f"❌ 找不到文件: {INPUT_FILE}，请确认文件名是否正确。")
        exit()

    df = load_data(INPUT_FILE)

    if df is not None:
        # 2. 处理
        words = process_text(df)

        # 3. 统计
        word_counts = collections.Counter(words)
        print(f"✅ 统计完成，共提取到 {len(word_counts)} 个不同的词汇。")

        # 4. 导出 CSV
        result_df = pd.DataFrame(word_counts.most_common(), columns=['词汇', '频次'])
        result_df.to_csv(OUTPUT_CSV, index=False, encoding='utf-8-sig')
        print(f"💾 详细词频数据已保存至: {OUTPUT_CSV}")

        # 5. 可视化
        visualize(word_counts)
        print("\n🎉 分析全部完成！")