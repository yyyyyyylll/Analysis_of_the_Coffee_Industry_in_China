import pandas as pd
import re
import os
from datetime import datetime, timedelta

CRAWL_DATE = datetime(2025, 6, 9)


def detect_and_read_csv(file_path):
    for enc in ['utf-8-sig', 'utf-8', 'gb18030', 'gbk']:
        try:
            df = pd.read_csv(file_path, encoding=enc)
            print(f" 成功使用编码 {enc} 读取文件")
            return df
        except:
            continue
    raise ValueError("❌ 无法读取 CSV 文件，请确认文件编码")


def standardize_comment_time(raw_time):
    if pd.isna(raw_time):
        return None
    text = str(raw_time).strip()

    if '分钟前' in text or '小时前' in text:
        return CRAWL_DATE.strftime('%Y-%m-%d')

    if '昨天' in text:
        return (CRAWL_DATE - timedelta(days=1)).strftime('%Y-%m-%d')

    match_days = re.match(r'(\d+)天前', text)
    if match_days:
        days = int(match_days.group(1))
        return (CRAWL_DATE - timedelta(days=days)).strftime('%Y-%m-%d')

    match_chinese = re.match(r'(\d{1,2})月(\d{1,2})日', text)
    if match_chinese:
        m, d = map(int, match_chinese.groups())
        return datetime(CRAWL_DATE.year, m, d).strftime('%Y-%m-%d')

    return text


def standardize_like_count(val):
    try:
        if pd.isna(val) or str(val).strip() in ['点赞', '', 'NaN']:
            return 0
        val = str(val).strip()
        if '万' in val:
            return int(float(val.replace('万', '')) * 10000)
        return int(float(val))
    except:
        return 0


def clean_comment_dataframe(df):
    if '评论时间' in df.columns:
        df['评论时间'] = df['评论时间'].apply(standardize_comment_time)

    if '评论点赞数' in df.columns:
        df['评论点赞数'] = df['评论点赞数'].apply(standardize_like_count)

    if '评论地点' in df.columns:
        df['评论地点'] = df['评论地点'].fillna('未知')

    return df


def process_comment_csv(input_path):
    df = detect_and_read_csv(input_path)
    df = clean_comment_dataframe(df)

    base, ext = os.path.splitext(input_path)
    output_path = f"{base}_标准化输出{ext}"
    df.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f" 评论数据标准化完成，输出文件：{output_path}")


process_comment_csv('小红书_瑞幸 消费_帖子评论.csv')
