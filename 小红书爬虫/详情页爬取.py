from DrissionPage import ChromiumPage, ChromiumOptions
import pandas as pd
import time
import os
import re

# ========== 参数设置 ==========
search_keyword = '瑞幸 消费'
image_save_folder = f'小红书_{search_keyword}_图片'
csv_input_file = '小红书_汇总详情链接.csv'
csv_output_detail = f'小红书_{search_keyword}_帖子详情.csv'
csv_output_comments = f'小红书_{search_keyword}_帖子评论.csv'
max_comments_to_scrape = 10
batch_write_size = 10


# ========== 读取函数 ==========
def robust_read_csv(file_path):
    try:
        df = pd.read_csv(file_path, encoding='utf-8-sig')
        print(" 使用 utf-8-sig 成功读取文件")
        return df
    except Exception:
        try:
            df = pd.read_csv(file_path, encoding='gb18030')
            print(" 使用 gb18030 成功读取文件")
            return df
        except Exception as e:
            print(f"❌ 无法读取 CSV：{e}")
            raise e


# ========== 文件名清洗==========
def sanitize_filename(name):
    """清洗文件名字符串"""
    if not name:
        return '未命名'
    sanitized_name = re.sub(r'[\\/*?:"<>|]', "", name)
    sanitized_name = sanitized_name.replace(' ', '_').replace('\n', '_')
    return sanitized_name[:100]


# ========== 写入CSV==========
def write_data_to_csv(data_list, filename):
    if not data_list:
        return
    header = not os.path.exists(filename)
    df = pd.DataFrame(data_list)
    df.to_csv(filename, mode='a', header=header, index=False, encoding='utf-8-sig')


# ========== 初始化浏览器 ==========
co = ChromiumOptions()
co.set_browser_path(r'C:\Program Files\Google\Chrome\Application\chrome.exe')
dp = ChromiumPage(co)
dp.get('https://www.xiaohongshu.com')
input(" 请在弹出的浏览器中手动完成登录，登录成功后按回车继续...")

# ========== 创建图片保存文件夹 ==========
os.makedirs(image_save_folder, exist_ok=True)
print(f" 图片将保存在 '{image_save_folder}' 文件夹中。")

# ========== 读取链接 ==========
try:
    df_links = robust_read_csv(csv_input_file)
    if '帖子链接' not in df_links.columns:
        raise ValueError("❌ CSV 文件中未找到 '帖子链接' 列")
    detail_links = df_links['帖子链接'].dropna().unique().tolist()
    print(f"成功读取 {len(detail_links)} 条详情链接")
except Exception as e:
    print(f"❌ 无法读取输入文件：{e}")
    exit(1)

# ========== 抓取信息 ==========
detail_results = []
comment_results = []
untitled_post_counter = 0

for i, url in enumerate(detail_links):
    try:
        dp.get(url)
        dp.wait.ele_displayed('css:#detail-title', timeout=10)

        # --- 帖子详情抓取
        profile_a = dp.ele('xpath://*[@id="noteContainer"]/div[4]/div[1]/div/div[1]/a[1]')
        user_home = profile_a.attr('href') if profile_a else '未找到'
        user_ele = dp.ele('css:span.username')
        user = user_ele.text.strip() if user_ele else ''
        title_ele = dp.ele('css:#detail-title')
        title = title_ele.text.strip() if title_ele else '无标题'

        content_element = dp.ele('css:#desc, .desc')
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
                tags_str = ''
        else:
            content = ''
            tags_str = ''
        if not tags_str:
            tag_eles = dp.eles('css:a#hash-tag')
            tags_str = ', '.join([t.text.strip().lstrip('#') for t in tag_eles])

        post_time = ''
        post_location = ''
        time_ele = dp.ele('css:.date')
        if time_ele:
            full_date_text = time_ele.text.strip()
            parts = full_date_text.split(' ')
            if len(parts) > 1 and re.fullmatch(r'[\u4e00-\u9fa5]+', parts[-1]):
                post_location = parts[-1]
                post_time = ' '.join(parts[:-1])
            else:
                post_time = full_date_text
                post_location = ''

        # --- 图片下载
        img_elements = dp.eles('css:div.swiper-slide:not(.swiper-slide-duplicate) img.note-slider-img')
        if img_elements:
            if title and title != '无标题':
                base_filename = sanitize_filename(title)
            else:
                untitled_post_counter += 1
                base_filename = f"无标题{untitled_post_counter}"
            print(f"发现 {len(img_elements)} 张图片，准备下载...")
            for j, img in enumerate(img_elements):
                src = img.attr('src')
                if not src: continue
                try:
                    img_response = dp.session.get(src, timeout=20)
                    content_type = img_response.headers.get('Content-Type', 'image/jpeg')
                    ext_map = {'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp'}
                    extension = ext_map.get(content_type, '.jpg')
                    image_filename = f"{base_filename}_{j + 1}{extension}"
                    save_path = os.path.join(image_save_folder, image_filename)
                    with open(save_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"    -    已保存图片：{image_filename}")
                except Exception as img_e:
                    print(f"    - ❌ 下载图片失败：{src}，原因：{img_e}")

        like_span = dp.ele('css:.engage-bar-container .like-wrapper .count')
        like_count = like_span.text.strip() if like_span else '0'
        collect_span = dp.ele('css:.engage-bar-container .collect-wrapper .count')
        collect_count = collect_span.text.strip() if collect_span else '0'
        comment_span = dp.ele('css:.engage-bar-container .chat-wrapper .count')
        comment_count = comment_span.text.strip() if comment_span else '0'
        detail_results.append({
            '详情链接': url, '用户': user, '用户主页': user_home, '标题': title,
            '正文': content, '标签': tags_str,
            '发布时间': post_time, '发布地点': post_location,
            '点赞数': like_count, '收藏数': collect_count, '评论数': comment_count
        })
        print(f"✔ 成功抓取详情：{title[:30]}...")

        # --- 评论抓取
        if comment_count in ['0', '无', '抢首评']:
            print("💬 该帖子没有评论，跳过。")
        else:
            scroll_area = dp.ele('css:.note-scroller')
            if not scroll_area:
                print("⚠️ 未找到评论滚动区域 '.note-scroller'，跳过评论抓取")
            else:
                scroll_area_selector = scroll_area.css_path
                seen_comments = set()
                total_scrolls = 0
                while len(seen_comments) < max_comments_to_scrape and total_scrolls < 20:
                    dp.run_js(
                        f'''let el = document.querySelector('{scroll_area_selector}'); if (el) {{ el.scrollTop = el.scrollHeight; }}''')
                    time.sleep(2.5)
                    total_scrolls += 1
                    comment_blocks = dp.eles('css:div.comment-item')
                    if not comment_blocks: break
                    initial_seen_count = len(seen_comments)
                    for c in comment_blocks:
                        try:
                            commenter_ele = c.ele('css:.author .name')
                            comment_text_ele = c.ele('css:.content .note-text')
                            if not (commenter_ele and comment_text_ele): continue
                            commenter = commenter_ele.text.strip()
                            comment_text = comment_text_ele.text.strip()
                            if not comment_text: continue
                            comment_id = (commenter, comment_text)
                            if comment_id in seen_comments: continue
                            seen_comments.add(comment_id)
                            comment_time_ele = c.ele('css:.info .date > span:first-child')
                            location_ele = c.ele('css:.info .location')
                            like_ele = c.ele('css:.interactions .like .count')
                            comment_results.append({
                                '帖子标题': title, '评论用户': commenter, '评论内容': comment_text,
                                '评论时间': comment_time_ele.text.strip() if comment_time_ele else '',
                                '评论地点': location_ele.text.strip() if location_ele else '',
                                '评论点赞数': like_ele.text.strip() if like_ele else '0', '详情链接': url
                            })
                            if len(seen_comments) >= max_comments_to_scrape: break
                        except Exception as e:
                            pass
                    if len(seen_comments) == initial_seen_count:
                        print("滚动后未发现新评论，结束本帖。")
                        break
                    if len(seen_comments) >= max_comments_to_scrape:
                        print(f"已抓满{max_comments_to_scrape}条评论，提前停止滚动。")
                        break
    except Exception as e:
        print(f"❌ 抓取失败：{url}，原因：{e}")

    # --- 批次写入逻辑 (保持不变) ---
    if (i + 1) % batch_write_size == 0 or (i + 1) == len(detail_links):
        print(f"\n已处理 {i + 1} 条帖子，达到批次大小，正在写入数据...")

        write_data_to_csv(detail_results, csv_output_detail)
        print(f"   - {len(detail_results)} 条帖子详情已追加到 {csv_output_detail}")
        detail_results.clear()

        write_data_to_csv(comment_results, csv_output_comments)
        print(f"   - {len(comment_results)} 条评论已追加到 {csv_output_comments}")
        comment_results.clear()

        print("...批次写入完成。\n")

print(f"\n 全部任务完成。")