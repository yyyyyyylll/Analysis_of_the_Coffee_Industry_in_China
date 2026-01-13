import pandas as pd

common_encodings = ['utf-8', 'utf-8-sig', 'gb18030', 'gbk', 'gb2312', 'big5']


def robust_convert_csv_to_utf8(input_path, output_path):
    for enc in common_encodings:
        try:
            print(f"尝试使用编码：{enc}")
            df = pd.read_csv(input_path, encoding=enc)
            df.to_csv(output_path, index=False, encoding='utf-8-sig')
            print(f"使用编码 {enc} 成功读取并转换为 UTF-8（含 BOM），保存至：{output_path}")
            return
        except Exception as e:
            print(f"❌ 编码 {enc} 失败：{e}")

    print("❌ 所有常见编码都无法读取该文件。请手动检查文件内容或使用专业工具打开。")


input_file = "小红书_瑞幸 消费_帖子详情.csv"
output_file = "小红书_瑞幸 消费_utf-8格式.csv"
robust_convert_csv_to_utf8(input_file, output_file)
