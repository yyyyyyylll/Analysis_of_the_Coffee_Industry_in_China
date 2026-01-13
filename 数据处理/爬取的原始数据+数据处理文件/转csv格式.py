import pandas as pd
import os


def xlsx_to_csv(source_path, output_path=None):
    """
    将 xlsx 文件转换为 csv 文件
    :param source_path: xlsx 文件路径
    :param output_path: 输出 csv 文件路径 (如果为空，默认在同目录下生成同名csv)
    """
    try:
        # 1. 读取 Excel
        # engine='openpyxl' 是读取 xlsx 的标准引擎
        df = pd.read_excel(source_path, engine='openpyxl')

        # 2. 确定输出路径
        if not output_path:
            output_path = os.path.splitext(source_path)[0] + '.csv'

        # 3. 写入 CSV
        # encoding='utf-8-sig' 是为了解决 Excel 打开中文 CSV 乱码的关键
        # index=False 代表不保存行索引号 (0, 1, 2...)
        df.to_csv(output_path, encoding='utf-8-sig', index=False)

        print(f"✅ 转换成功: {source_path} -> {output_path}")

    except Exception as e:
        print(f"❌ 转换失败 {source_path}: {e}")


def batch_convert(folder_path):
    """
    批量转换文件夹下所有 xlsx 文件
    """
    print(f"📂 正在扫描文件夹: {folder_path} ...")
    files = [f for f in os.listdir(folder_path) if f.endswith('.xlsx') and not f.startswith('~$')]

    if not files:
        print("   未找到 .xlsx 文件。")
        return

    print(f"   发现 {len(files)} 个文件，开始转换...")

    for file in files:
        full_path = os.path.join(folder_path, file)
        xlsx_to_csv(full_path)


# ================= 配置区域 =================

# 模式选择： 'single' (单文件) 或 'batch' (文件夹批量)
MODE = 'batch'

# 路径配置
# 如果是单文件模式，填文件路径，例如: r'C:\Data\test.xlsx'
# 如果是批量模式，填文件夹路径，例如: r'C:\Data'
TARGET_PATH = r'./'  # './' 代表当前脚本所在目录

# ================= 主程序 =================

if __name__ == '__main__':
    if MODE == 'single':
        if os.path.isfile(TARGET_PATH):
            xlsx_to_csv(TARGET_PATH)
        else:
            print("❌ 错误: 找不到指定的文件，请检查路径。")

    elif MODE == 'batch':
        if os.path.isdir(TARGET_PATH):
            batch_convert(TARGET_PATH)
        else:
            print("❌ 错误: 找不到指定的文件夹，请检查路径。")