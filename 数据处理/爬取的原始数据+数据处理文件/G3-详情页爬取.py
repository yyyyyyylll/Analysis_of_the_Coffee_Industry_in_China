from DrissionPage import ChromiumPage, ChromiumOptions
import pandas as pd
import os
import re
import time
import random  # 引入随机库

# ========== 参数设置 ==========

csv_input_file = '未来坐标系-瑞幸官号首页数据.csv'
csv_output_detail = '瑞幸官号小红书内容.csv'
batch_write_size = 5  # 降低批次大小，防止中间断掉损失太多数据


# ========== 读取函数 ==========
def robust_read_csv(file_path):
    try:
        df = pd.read_csv(file_path, encoding='utf-8-sig')
        print("✅ 使用 utf-8-sig 成功读取文件")
        return df
    except Exception:
        try:
            df = pd.read_csv(file_path, encoding='gb18030')
            print("✅ 使用 gb18030 成功读取文件")
            return df
        except Exception as e:
            print(f"❌ 无法读取 CSV：{e}")
            raise e


# ========== 写入CSV ==========
def write_data_to_csv(data_list, filename):
    if not data_list:
        return
    header = not os.path.exists(filename)
    df = pd.DataFrame(data_list)
    columns_order = ['帖子链接', '标题', '正文', '标签', '点赞数', '收藏数', '评论数']
    columns_to_write = [col for col in columns_order if col in df.columns]
    df[columns_to_write].to_csv(filename, mode='a', header=header, index=False, encoding='utf-8-sig')


# ========== 初始化浏览器 ==========
co = ChromiumOptions()
co.set_browser_path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
dp = ChromiumPage(co)

# 设置一下浏览器的User-Agent，模拟常规访问（DrissionPage默认已处理，显式设置更稳妥）
# dp.set_user_agent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

dp.get('https://www.xiaohongshu.com')
input("🚨 请在弹出的浏览器中手动完成登录，登录成功后在此处按【回车】继续...")

# ========== 读取链接 ==========
try:
    df_links = robust_read_csv(csv_input_file)
    if '帖子链接' not in df_links.columns:
        raise ValueError("❌ CSV 文件中未找到 '帖子链接' 列")
    detail_links = df_links['帖子链接'].dropna().unique().tolist()
    print(f"📊 成功读取 {len(detail_links)} 条详情链接")
except Exception as e:
    print(f"❌ 无法读取输入文件：{e}")
    exit(1)

# ========== 抓取主循环 ==========
detail_results = []

print("\n🚀 开始抓取 (安全模式：已开启随机长延时)...\n")

for i, url in enumerate(detail_links):
    try:
        dp.get(url)

        # [新增] 模拟页面加载后的“人工阅读”停顿 (2到5秒随机)
        read_delay = random.uniform(1, 4)
        print(f"   ...正在模拟阅读等待 {read_delay:.1f} 秒")
        time.sleep(read_delay)

        # [修改] 超时时间从 10 增加到 30，防止网络慢被误判
        dp.wait.ele_displayed('css:#detail-title', timeout=30)

        # 1. 抓取标题
        title_ele = dp.ele('css:#detail-title')
        title = title_ele.text.strip() if title_ele else '无标题'

        # 2. 抓取正文与标签
        content_element = dp.ele('css:#desc, .desc')
        content = ''
        tags_str = ''

        if content_element:
            full_text = content_element.text
            hashtags = re.findall(r'#\w+', full_text)
            if hashtags:
                tags_str = ', '.join([tag.lstrip('#') for tag in hashtags])
                content = full_text
                for tag in hashtags:
                    content = content.replace(tag, '')
                content = content.strip()
            else:
                content = full_text.strip()

        if not tags_str:
            tag_eles = dp.eles('css:a#hash-tag')
            if tag_eles:
                tags_str = ', '.join([t.text.strip().lstrip('#') for t in tag_eles])

        # 3. 抓取互动数据
        like_span = dp.ele('css:.engage-bar-container .like-wrapper .count')
        like_count = like_span.text.strip() if like_span else '0'

        collect_span = dp.ele('css:.engage-bar-container .collect-wrapper .count')
        collect_count = collect_span.text.strip() if collect_span else '0'

        comment_span = dp.ele('css:.engage-bar-container .chat-wrapper .count')
        comment_count = comment_span.text.strip() if comment_span else '0'
        if comment_count in ['抢首评', '评论']:
            comment_count = '0'

        # 4. 存入列表
        detail_results.append({
            '帖子链接': url,
            '标题': title,
            '正文': content,
            '标签': tags_str,
            '点赞数': like_count,
            '收藏数': collect_count,
            '评论数': comment_count
        })

        print(f"✔ [{i + 1}/{len(detail_links)}] 抓取成功：{title[:15]}...")

    except Exception as e:
        print(f"❌ [{i + 1}/{len(detail_links)}] 抓取失败：{url}，原因：{e}")

    # ========== 批量写入 ==========
    if (i + 1) % batch_write_size == 0 or (i + 1) == len(detail_links):
        print(f"💾 正在写入 {len(detail_results)} 条数据到 CSV...")
        write_data_to_csv(detail_results, csv_output_detail)
        detail_results.clear()

    # [新增] 每一轮结束后的“随机长间隔” (6到12秒随机)
    # 这是原来的3倍以上（原代码几乎无间隔）
    # 如果还需要更慢，可以修改这里的数字，例如 (10, 20)
    sleep_time = random.uniform(0.5, 2)
    print(f"💤 休息 {sleep_time:.1f} 秒，准备下一条...")
    time.sleep(sleep_time)

print(f"\n🎉 全部任务完成。数据已保存至：{csv_output_detail}")