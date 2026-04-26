// 应用状态
let currentScreen = 'splash-screen';
let learningState = {
    words: [],
    currentIndex: 0,
    showMeaning: false
};
let testState = {
    words: [],
    currentIndex: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    hearts: 3,
    startTime: null,
    questions: []
};

// 显示指定屏幕
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;

    // 屏幕特定初始化
    if (screenId === 'home') {
        initHome();
    } else if (screenId === 'review') {
        initReview();
    } else if (screenId === 'stats') {
        initStats();
    }
}

// 初始化首页
function initHome() {
    const todayWords = getTodayWords();

    // 设置学生名字
    document.getElementById('studentName').textContent = wordData.student.name;

    // 设置今日日期
    const today = new Date();
    document.getElementById('todayDate').textContent = `${today.getMonth() + 1}月${today.getDate()}日`;

    // 设置今日单词数量
    document.getElementById('todayWordCount').textContent = todayWords.length;

    // 设置连续天数
    document.getElementById('streakCount').textContent = wordData.stats.streak;

    // 渲染本周单词
    renderWeekDays();
}

// 渲染本周单词列表
function renderWeekDays() {
    const container = document.getElementById('weekDays');
    container.innerHTML = '';

    const days = ['日', '一', '二', '三', '四', '五', '六'];
    const today = new Date();
    const todayStr = getTodayStr();

    // 本周的日期
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - today.getDay() + i);
        const dateStr = date.toISOString().split('T')[0];
        const words = wordData.words[dateStr] || [];

        if (words.length === 0) continue;

        const isToday = dateStr === todayStr;
        const dayName = `周${days[date.getDay()]}`;

        const item = document.createElement('div');
        item.className = `day-item${isToday ? ' today' : ''}`;
        item.innerHTML = `
            <span class="day-name">${dayName} (${date.getMonth() + 1}/${date.getDate()})</span>
            <span class="word-count-small">${words.length}个单词</span>
            <span class="status ${isToday ? '' : 'done'}">${isToday ? '今日' : '待学'}</span>
        `;

        if (!isToday) {
            item.onclick = () => startLearnDate(dateStr);
        }

        container.appendChild(item);
    }
}

// 开始学习今天的单词
function startLearn() {
    const todayWords = getTodayWords();
    if (todayWords.length === 0) {
        alert('今天没有单词任务！');
        return;
    }

    learningState.words = [...todayWords];
    learningState.currentIndex = 0;
    learningState.showMeaning = false;

    showScreen('learn');
    renderLearnCard();
}

// 学习指定日期的单词
function startLearnDate(dateStr) {
    const words = wordData.words[dateStr];
    if (!words || words.length === 0) return;

    learningState.words = [...words];
    learningState.currentIndex = 0;
    learningState.showMeaning = false;

    showScreen('learn');
    renderLearnCard();
}

// 渲染学习卡片
function renderLearnCard() {
    const word = learningState.words[learningState.currentIndex];

    document.getElementById('currentWordIndex').textContent = learningState.currentIndex + 1;
    document.getElementById('totalWords').textContent = learningState.words.length;
    document.getElementById('currentWord').textContent = word.word;
    document.getElementById('phonetic').textContent = word.phonetic || '';
    document.getElementById('wordType').textContent = word.type;
    document.getElementById('currentMeaning').textContent = learningState.showMeaning ? word.meaning : '点击下方显示含义';
}

// 显示含义
function showMeaning() {
    learningState.showMeaning = true;
    renderLearnCard();
}

// 下一个单词
function nextWord() {
    if (learningState.currentIndex < learningState.words.length - 1) {
        learningState.currentIndex++;
        learningState.showMeaning = false;
        renderLearnCard();
    } else {
        // 学习完成，开始测试
        startTest();
    }
}

// 发音
function speakWord() {
    const word = learningState.words[learningState.currentIndex];
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(word.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// 开始测试
function startTest() {
    testState.words = [...learningState.words];
    testState.currentIndex = 0;
    testState.score = 0;
    testState.correct = 0;
    testState.wrong = 0;
    testState.hearts = 3;
    testState.startTime = Date.now();
    testState.questions = generateQuestions();

    showScreen('test');
    renderQuestion();
    updateHearts();
}

// 生成测试题目
function generateQuestions() {
    const questions = [];
    const allWords = getAllWords();

    testState.words.forEach(word => {
        // 随机选择题型
        const type = Math.random() > 0.5 ? 'choice' : 'choice'; // 暂时只用选择题

        if (type === 'choice') {
            // 生成选项
            const wrongOptions = allWords
                .filter(w => w.id !== word.id)
                .sort(() => Math.random() - 0.5)
                .slice(0, 3)
                .map(w => w.meaning);

            const options = [word.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);

            questions.push({
                word: word,
                type: 'choice',
                question: `"${word.word}" 的中文意思是？`,
                options: options,
                answer: word.meaning
            });
        }
    });

    return questions;
}

// 渲染题目
function renderQuestion() {
    const question = testState.questions[testState.currentIndex];

    document.getElementById('questionType').textContent = question.type === 'choice' ? '选择题' : '填空题';
    document.getElementById('questionText').textContent = question.question;

    // 更新进度条
    const progress = ((testState.currentIndex) / testState.questions.length) * 100;
    document.getElementById('testProgressBar').style.width = `${progress}%`;

    // 更新分数
    document.getElementById('testScore').textContent = `${testState.score}分`;

    // 渲染选项
    const container = document.getElementById('optionsContainer');
    container.innerHTML = '';

    if (question.type === 'choice') {
        document.getElementById('optionsContainer').style.display = 'flex';
        document.getElementById('inputAnswer').style.display = 'none';

        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'option';
            btn.textContent = option;
            btn.onclick = () => selectOption(btn, option, question.answer);
            container.appendChild(btn);
        });
    } else {
        document.getElementById('optionsContainer').style.display = 'none';
        document.getElementById('inputAnswer').style.display = 'block';
    }
}

// 选择选项
function selectOption(btn, selected, answer) {
    const isCorrect = selected === answer;

    // 禁用所有选项
    document.querySelectorAll('.option').forEach(opt => {
        opt.onclick = null;
        if (opt.textContent === answer) {
            opt.classList.add('correct');
        }
    });

    if (isCorrect) {
        btn.classList.add('correct');
        testState.correct++;
        testState.score += 20;
        showFeedback(true);
    } else {
        btn.classList.add('wrong');
        testState.wrong++;
        testState.hearts--;
        updateHearts();
        showFeedback(false, answer);

        if (testState.hearts <= 0) {
            setTimeout(() => showResult(), 1500);
            return;
        }
    }
}

// 显示反馈
function showFeedback(isCorrect, correctAnswer = '') {
    const feedback = document.getElementById('feedback');
    const icon = document.getElementById('feedbackIcon');
    const text = document.getElementById('feedbackText');

    if (isCorrect) {
        icon.textContent = '✓';
        icon.style.color = '#4CAF50';
        text.textContent = '正确！太棒了！';
    } else {
        icon.textContent = '✗';
        icon.style.color = '#F44336';
        text.textContent = `正确答案：${correctAnswer}`;
    }

    feedback.style.display = 'flex';
}

// 下一题
function nextQuestion() {
    document.getElementById('feedback').style.display = 'none';

    if (testState.currentIndex < testState.questions.length - 1) {
        testState.currentIndex++;
        renderQuestion();
    } else {
        showResult();
    }
}

// 更新心形
function updateHearts() {
    const hearts = '❤️'.repeat(testState.hearts) + '🖤'.repeat(3 - testState.hearts);
    document.getElementById('hearts').textContent = hearts;
}

// 退出测试
function exitTest() {
    if (confirm('确定要退出测试吗？当前进度将不会保存。')) {
        showScreen('home');
    }
}

// 显示结果
function showResult() {
    const timeUsed = Math.floor((Date.now() - testState.startTime) / 1000);
    const minutes = Math.floor(timeUsed / 60);
    const seconds = timeUsed % 60;

    document.getElementById('finalScore').textContent = testState.score;
    document.getElementById('correctCount').textContent = testState.correct;
    document.getElementById('wrongCount').textContent = testState.wrong;
    document.getElementById('timeUsed').textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;

    // 根据分数显示不同图标和标题
    if (testState.score >= 80) {
        document.getElementById('resultIcon').textContent = '🎉';
        document.getElementById('resultTitle').textContent = '太棒了！';
    } else if (testState.score >= 60) {
        document.getElementById('resultIcon').textContent = '👍';
        document.getElementById('resultTitle').textContent = '继续加油！';
    } else {
        document.getElementById('resultIcon').textContent = '💪';
        document.getElementById('resultTitle').textContent = '再接再厉！';
    }

    showScreen('result');
}

// 生成打卡报告
function generateReport() {
    const today = new Date();
    document.getElementById('reportDate').textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    document.getElementById('reportScore').textContent = testState.score;

    // 渲染今日单词
    const wordsList = document.getElementById('reportWords');
    wordsList.innerHTML = '';
    learningState.words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = `${word.word} - ${word.meaning}`;
        wordsList.appendChild(li);
    });

    showScreen('report');
}

// 保存报告图片
function saveReport() {
    const reportCard = document.getElementById('reportCard');

    // 使用 html2canvas 库（需要引入）
    if (typeof html2canvas !== 'undefined') {
        html2canvas(reportCard).then(canvas => {
            const link = document.createElement('a');
            link.download = `单词打卡_${getTodayStr()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        alert('请截图保存报告，或长按屏幕保存图片');
    }
}

// 初始化复习页面
function initReview() {
    const container = document.getElementById('allWordsList');
    container.innerHTML = '';

    const allWords = getAllWords();
    allWords.forEach(word => {
        const item = document.createElement('div');
        item.className = 'word-item';
        item.innerHTML = `
            <div class="word-text">${word.word}</div>
            <div class="word-meaning">${word.meaning}</div>
        `;
        item.onclick = () => {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word.word);
                utterance.lang = 'en-US';
                utterance.rate = 0.8;
                speechSynthesis.speak(utterance);
            }
        };
        container.appendChild(item);
    });
}

// 初始化统计页面
function initStats() {
    document.getElementById('statTotalDays').textContent = wordData.stats.totalDays;
    document.getElementById('statTotalWords').textContent = wordData.stats.totalWords;
    document.getElementById('statCorrectRate').textContent = wordData.stats.correctRate + '%';
    document.getElementById('statStreak').textContent = wordData.stats.streak;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 延迟显示启动页
    setTimeout(() => {
        showScreen('home');
    }, 1500);
});
