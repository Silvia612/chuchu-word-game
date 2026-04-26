// 单词数据
const wordData = {
    student: {
        name: "楚楚",
        teacher: "小宝老师"
    },
    words: {
        "2026-04-22": [
            { id: 1, word: "It was lovely to hear from you", meaning: "很高兴收到你的来信", type: "phrase", phonetic: "" },
            { id: 2, word: "loads of", meaning: "许多", type: "phrase", phonetic: "/ləʊdz əv/" },
            { id: 3, word: "extracurricular activities", meaning: "课外活动", type: "phrase", phonetic: "/ˌekstrəkəˈrɪkjələr ækˈtɪvɪtiz/" },
            { id: 4, word: "peer", meaning: "同龄人", type: "n.", phonetic: "/pɪər/" },
            { id: 5, word: "bond with sb", meaning: "和某人建立亲密关系", type: "phrase", phonetic: "" }
        ],
        "2026-04-23": [
            { id: 6, word: "When it comes to", meaning: "当谈到...", type: "phrase", phonetic: "" },
            { id: 7, word: "recommend doing sth", meaning: "建议做某事", type: "phrase", phonetic: "/ˌrekəˈmend/" },
            { id: 8, word: "host activities", meaning: "主持活动", type: "phrase", phonetic: "/həʊst/" },
            { id: 9, word: "art workshop", meaning: "艺术工作坊", type: "phrase", phonetic: "/ˈwɜːkʃɒp/" },
            { id: 10, word: "transform ...into ...", meaning: "把……转变成……", type: "phrase", phonetic: "/trænsˈfɔːm/" }
        ],
        "2026-04-24": [
            { id: 11, word: "acquaintance", meaning: "熟人", type: "n.", phonetic: "/əˈkweɪntəns/" },
            { id: 12, word: "genuine friendship", meaning: "真正的友谊", type: "phrase", phonetic: "/ˈdʒenjuɪn/" },
            { id: 13, word: "settle in", meaning: "适应，安顿好", type: "phrase", phonetic: "/ˈsetl ɪn/" },
            { id: 14, word: "intimate", meaning: "亲密的", type: "adj.", phonetic: "/ˈɪntɪmət/" },
            { id: 15, word: "inner", meaning: "内部的、内心的", type: "adj.", phonetic: "/ˈɪnər/" }
        ],
        "2026-04-25": [
            { id: 16, word: "vivid", meaning: "生动的", type: "adj.", phonetic: "/ˈvɪvɪd/" },
            { id: 17, word: "plot", meaning: "情节", type: "n.", phonetic: "/plɒt/" },
            { id: 18, word: "appropriate", meaning: "适当的", type: "adj.", phonetic: "/əˈprəʊpriət/" },
            { id: 19, word: "endangered", meaning: "濒危的", type: "adj.", phonetic: "/ɪnˈdeɪndʒərd/" },
            { id: 20, word: "repair", meaning: "修理", type: "v.", phonetic: "/rɪˈpeər/" }
        ],
        "2026-04-26": [
            { id: 21, word: "reserve", meaning: "n. 保护区；v. 预留、预定", type: "n./v.", phonetic: "/rɪˈzɜːv/" },
            { id: 22, word: "original", meaning: "原始的、原创的", type: "adj.", phonetic: "/əˈrɪdʒənl/" },
            { id: 23, word: "come up with", meaning: "提出、想出", type: "phrase", phonetic: "" },
            { id: 24, word: "glamorous", meaning: "富有魅力的", type: "adj.", phonetic: "/ˈɡlæmərəs/" },
            { id: 25, word: "appeal to", meaning: "吸引、上诉", type: "phrase", phonetic: "/əˈpiːl tuː/" }
        ],
        "2026-04-27": [
            { id: 26, word: "regard A as B", meaning: "把A当作B", type: "phrase", phonetic: "" },
            { id: 27, word: "be determined to do sth", meaning: "决定做某事", type: "phrase", phonetic: "/dɪˈtɜːmɪnd/" },
            { id: 28, word: "feedback", meaning: "反馈", type: "n.", phonetic: "/ˈfiːdbæk/" },
            { id: 29, word: "constructive", meaning: "建设性的", type: "adj.", phonetic: "/kənˈstrʌktɪv/" },
            { id: 30, word: "critical", meaning: "关键的，批判性的", type: "adj.", phonetic: "/ˈkrɪtɪkl/" }
        ]
    },
    stats: {
        totalDays: 0,
        totalWords: 30,
        correctRate: 0,
        streak: 0
    }
};

// 获取今天的日期字符串
function getTodayStr() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 获取今天的单词
function getTodayWords() {
    const today = getTodayStr();
    return wordData.words[today] || [];
}

// 获取所有单词
function getAllWords() {
    let all = [];
    Object.values(wordData.words).forEach(dayWords => {
        all = all.concat(dayWords);
    });
    return all;
}
