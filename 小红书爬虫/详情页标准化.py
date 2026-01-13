import pandas as pd
import re
import os
from datetime import datetime, timedelta

# 统一爬取日期
CRAWL_DATE = datetime(2025, 6, 9)

def detect_and_read_csv(file_path):
    """读取 CSV 文件"""
    encodings = ['utf-8-sig', 'utf-8', 'gb18030', 'gbk']
    for enc in encodings:
        try:
            df = pd.read_csv(file_path, encoding=enc)
            print(f" 成功使用编码 {enc} 读取文件")
            return df
        except Exception:
            continue
    raise ValueError("❌ 无法读取 CSV 文件")

def standardize_publish_time(text):
    """标准化发布时间为 YYYY-MM-DD"""
    if pd.isna(text):
        return None
    text = str(text).strip()
    text = re.sub(r'^编辑于\s*', '', text)

    if '昨天' in text:
        return (CRAWL_DATE - timedelta(days=1)).strftime('%Y-%m-%d')

    if re.match(r'\d+天前', text):
        days = int(re.match(r'(\d+)', text).group(1))
        return (CRAWL_DATE - timedelta(days=days)).strftime('%Y-%m-%d')

    if re.match(r'\d+小时前', text):
        hours = int(re.match(r'(\d+)', text).group(1))
        return (CRAWL_DATE - timedelta(hours=hours)).strftime('%Y-%m-%d')

    if re.match(r'\d{1,2}月\d{1,2}日', text):
        m, d = map(int, re.findall(r'\d+', text))
        return datetime(CRAWL_DATE.year, m, d).strftime('%Y-%m-%d')

    if re.match(r'\d{2}-\d{2}', text):
        m, d = map(int, re.findall(r'\d+', text))
        return datetime(CRAWL_DATE.year, m, d).strftime('%Y-%m-%d')

    if re.match(r'\d{4}/\d{1,2}/\d{1,2}', text):
        y, m, d = map(int, re.findall(r'\d+', text))
        return datetime(y, m, d).strftime('%Y-%m-%d')

    return text

def standardize_count(value, placeholder):
    """将互动数标准化为整数"""
    try:
        if pd.isna(value) or str(value).strip() in [placeholder, '', 'NaN']:
            return 0
        value = str(value).strip()
        if '万' in value:
            return int(float(value.replace('万', '')) * 10000)
        return int(float(value))
    except:
        return 0

def clean_dataframe(df):
    """执行所有字段标准化处理"""
    if '发布时间' in df.columns:
        df['发布时间'] = df['发布时间'].apply(standardize_publish_time)
    if '发布地点' in df.columns:
        df['发布地点'] = df['发布地点'].fillna('未知')
    if '点赞数' in df.columns:
        df['点赞数'] = df['点赞数'].apply(lambda x: standardize_count(x, '点赞'))
    if '收藏数' in df.columns:
        df['收藏数'] = df['收藏数'].apply(lambda x: standardize_count(x, '收藏'))
    if '评论数' in df.columns:
        df['评论数'] = df['评论数'].apply(lambda x: standardize_count(x, '评论'))
    return df

def process_csv(input_path):
    df = detect_and_read_csv(input_path)
    df = clean_dataframe(df)

    base, ext = os.path.splitext(input_path)
    output_path = f"{base}_标准化输出{ext}"
    df.to_csv(output_path, index=False, encoding='utf-8-sig')
    print(f" 已保存标准化结果：{output_path}")


process_csv('小红书_瑞幸 消费_帖子详情.csv')
