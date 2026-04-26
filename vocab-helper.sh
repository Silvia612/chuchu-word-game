#!/bin/bash
# 单词打卡小助手 - 主程序
# 用法: ./vocab-helper.sh <命令> [参数]
# 命令:
#   upload <图片路径>  - 上传单词作业图片
#   learn             - 开始学习当天单词
#   report            - 生成打卡报告
#   stats             - 查看学习统计

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_FILE="$SCRIPT_DIR/data.json"

# 初始化数据文件
init_data() {
    if [ ! -f "$DATA_FILE" ]; then
        echo '{"student":{"name":"","teacher":""},"words":[],"currentTask":null,"history":[],"stats":{"totalDays":0,"totalWords":0,"correctRate":0,"streak":0}}' > "$DATA_FILE"
    fi
}

# 显示帮助信息
show_help() {
    echo "单词打卡小助手 - 使用说明"
    echo ""
    echo "命令:"
    echo "  upload <图片路径>  上传单词作业图片，自动识别单词"
    echo "  learn             开始游戏化学习今天的单词"
    echo "  report            生成打卡报告图片"
    echo "  stats             查看学习统计数据"
    echo "  set-name <名字>   设置学生姓名"
    echo "  set-teacher <名字> 设置老师姓名"
    echo ""
    echo "示例:"
    echo "  ./vocab-helper.sh upload ~/Desktop/homework.jpg"
    echo "  ./vocab-helper.sh learn"
    echo "  ./vocab-helper.sh report"
}

# 设置学生姓名
set_name() {
    local name="$1"
    if [ -z "$name" ]; then
        echo "请提供学生姓名"
        exit 1
    fi
    # 使用 jq 更新 JSON
    if command -v jq &> /dev/null; then
        local temp=$(mktemp)
        jq --arg name "$name" '.student.name = $name' "$DATA_FILE" > "$temp" && mv "$temp" "$DATA_FILE"
        echo "✓ 学生姓名已设置为: $name"
    else
        echo "需要安装 jq 工具来处理数据"
    fi
}

# 设置老师姓名
set_teacher() {
    local teacher="$1"
    if [ -z "$teacher" ]; then
        echo "请提供老师姓名"
        exit 1
    fi
    if command -v jq &> /dev/null; then
        local temp=$(mktemp)
        jq --arg teacher "$teacher" '.student.teacher = $teacher' "$DATA_FILE" > "$temp" && mv "$temp" "$DATA_FILE"
        echo "✓ 老师姓名已设置为: $teacher"
    else
        echo "需要安装 jq 工具来处理数据"
    fi
}

# 主逻辑
init_data

case "$1" in
    upload)
        if [ -z "$2" ]; then
            echo "请提供图片路径"
            echo "用法: ./vocab-helper.sh upload <图片路径>"
            exit 1
        fi
        echo "📸 正在识别图片中的单词..."
        echo "请将图片发送给 DuMate，它会帮你识别并保存单词"
        ;;
    learn)
        echo "🎮 开始游戏化学习..."
        echo "请对 DuMate 说: '开始学习今天的单词'"
        ;;
    report)
        echo "📊 生成打卡报告..."
        echo "请对 DuMate 说: '生成今天的打卡报告'"
        ;;
    stats)
        if [ -f "$DATA_FILE" ]; then
            echo "📈 学习统计:"
            cat "$DATA_FILE" | jq '.stats'
        else
            echo "暂无学习数据"
        fi
        ;;
    set-name)
        set_name "$2"
        ;;
    set-teacher)
        set_teacher "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        show_help
        ;;
esac
