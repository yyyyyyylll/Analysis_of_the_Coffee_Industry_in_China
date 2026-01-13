import pandas as pd
import jieba
import collections
import re
import os

# ================= 配置区域 =================
INPUT_FILE = '瑞幸官号小红书内容_标准化输出.csv'
OUTPUT_FILE = '瑞幸_季度词频演变_2020-2025.csv'
TOP_N = 20  # 每个季度提取前多少个高频词

# 停用词 (根据之前的经验优化)
STOP_WORDS = {
    '的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '去',
    '你',
    '吧', '啊', '吗', '呢', '哈', '那', '这', '对', '跟', '被', '为', '之', '与', '及', '等', '或', '可以', '这个',
    '那个',
    '因为', '所以', '但是', '如果', '就是', '我们', '你们', '他们', '它们', '自己', '什么', '怎么', '这里', '那里',
    '笔记', '小红书', '全文', '链接', '点击', '查看', '展开', '详情', '无标题', '发布', '时间', '地点',
    '大家', '真的', '今天', '现在', '还是', '让', '给', '来', '用', '看', '好', '想', '做'
}


# ================= 数据加载与清洗 =================
def load_and_clean_data(filepath):
    # 1. 读取
    try:
        df = pd.read_csv(filepath, encoding='utf-8-sig')
    except:
        try:
            df = pd.read_csv(filepath, encoding='gb18030')
        except Exception as e:
            print(f"❌ 读取失败: {e}")
            return None

    print(f"原始数据量: {len(df)} 条")

    # 2. 处理日期
    # errors='coerce' 会把无法解析的日期变成 NaT (空值)
    df['datetime'] = pd.to_datetime(df['发布时间'], errors='coerce')

    # 去除日期为空的数据
    df = df.dropna(subset=['datetime'])

    # 3. 筛选 2020-2025 年的数据
    df = df[(df['datetime'].dt.year >= 2020) & (df['datetime'].dt.year <= 2025)]

    # 4. 创建 "季度" 列 (例如: 2023Q1)
    # to_period('Q') 会把日期转换成季度对象
    df['Quarter'] = df['datetime'].dt.to_period('Q')

    print(f"筛选后(2020-2025有效日期)数据量: {len(df)} 条")
    return df


# ================= 分词工具 =================
def get_words_from_text(text):
    if not isinstance(text, str):
        return []

    # 清洗：只留中文英文
    text = re.sub(r'[^\w\s\u4e00-\u9fa5]', '', text)

    # 分词
    words = jieba.lcut(text)

    # 过滤
    clean_words = [w for w in words if len(w) > 1 and w not in STOP_WORDS and not w.isnumeric()]
    return clean_words


# ================= 主程序 =================
if __name__ == '__main__':
    if not os.path.exists(INPUT_FILE):
        print(f"❌ 找不到文件: {INPUT_FILE}")
        exit()

    # 1. 加载数据
    df = load_and_clean_data(INPUT_FILE)
    if df is None or len(df) == 0:
        print("❌ 没有符合条件的日期数据，请检查 CSV 中的【发布时间】列格式是否正确。")
        exit()

    # 2. 按季度分组分析
    print("\n📅 开始按季度分析...")

    results = []

    # 按季度排序并分组
    quarters = sorted(df['Quarter'].unique())

    for q in quarters:
        # 获取该季度的数据
        sub_df = df[df['Quarter'] == q]

        # 拼接该季度所有文本 (标题+正文+标签)
        combined_text = sub_df['标题'].fillna('') + " " + sub_df['正文'].fillna('') + " " + sub_df['标签'].fillna('')
        full_text = " ".join(combined_text.tolist())

        # 分词统计
        words = get_words_from_text(full_text)
        counter = collections.Counter(words)
        top_words = counter.most_common(TOP_N)

        # 构建这一行的数据
        row_data = {
            '年份': q.year,
            '季度': f"Q{q.quarter}",
            '完整季度标识': str(q),
            '帖子数量': len(sub_df)
        }

        # 将 Top N 词填入列中
        for idx, (word, count) in enumerate(top_words):
            row_data[f'热词_{idx + 1}'] = f"{word} ({count})"

        results.append(row_data)
        print(f"   - {q}: 分析完成 (样本数: {len(sub_df)})")

    # 3. 导出结果
    result_df = pd.DataFrame(results)
    result_df.to_csv(OUTPUT_FILE, index=False, encoding='utf-8-sig')

    print(f"\n🎉 分析完成！")
    print(f"💾 结果已保存至: {OUTPUT_FILE}")
    print("👉 你可以打开 Excel，横向查看每个季度的热词变化，非常直观！")