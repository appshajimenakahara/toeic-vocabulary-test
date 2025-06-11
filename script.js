const vocabularyDatabase = [
    { word: "abandon", options: ["放棄する", "獲得する", "維持する", "追求する"], correct: 0, level: 1 },
    { word: "acquire", options: ["失う", "獲得する", "破壊する", "忘れる"], correct: 1, level: 1 },
    { word: "contribute", options: ["妨げる", "消費する", "貢献する", "拒否する"], correct: 2, level: 1 },
    { word: "demonstrate", options: ["隠す", "疑う", "想像する", "実証する"], correct: 3, level: 1 },
    { word: "enhance", options: ["向上させる", "減少させる", "無視する", "複雑にする"], correct: 0, level: 2 },
    { word: "fundamental", options: ["表面的な", "基本的な", "一時的な", "装飾的な"], correct: 1, level: 2 },
    { word: "implement", options: ["延期する", "批判する", "実施する", "回避する"], correct: 2, level: 2 },
    { word: "significant", options: ["些細な", "曖昧な", "一般的な", "重要な"], correct: 3, level: 2 },
    { word: "comprehensive", options: ["包括的な", "部分的な", "簡潔な", "曖昧な"], correct: 0, level: 3 },
    { word: "deteriorate", options: ["改善する", "悪化する", "安定する", "評価する"], correct: 1, level: 3 },
    { word: "facilitate", options: ["複雑にする", "妨害する", "促進する", "無視する"], correct: 2, level: 3 },
    { word: "inevitable", options: ["予防可能な", "望ましい", "偶然の", "避けられない"], correct: 3, level: 3 },
    { word: "meticulous", options: ["細心の", "大雑把な", "急速な", "柔軟な"], correct: 0, level: 4 },
    { word: "paramount", options: ["些細な", "最重要の", "一時的な", "疑わしい"], correct: 1, level: 4 },
    { word: "scrutinize", options: ["賞賛する", "無視する", "精査する", "簡略化する"], correct: 2, level: 4 },
    { word: "unprecedented", options: ["伝統的な", "予測可能な", "一般的な", "前例のない"], correct: 3, level: 4 },
    { word: "ambiguous", options: ["曖昧な", "明確な", "単純な", "直接的な"], correct: 0, level: 5 },
    { word: "exacerbate", options: ["改善する", "悪化させる", "維持する", "説明する"], correct: 1, level: 5 },
    { word: "juxtapose", options: ["分離する", "混合する", "並置する", "削除する"], correct: 2, level: 5 },
    { word: "ubiquitous", options: ["稀な", "高価な", "複雑な", "遍在する"], correct: 3, level: 5 }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let timeLeft = 15;
let timerInterval;
let testQuestions = [];

const startScreen = document.getElementById('start-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const progressFill = document.getElementById('progress-fill');
const questionNumber = document.getElementById('question-number');
const timerDisplay = document.getElementById('timer');
const wordDisplay = document.getElementById('word');
const optionsContainer = document.getElementById('options');

startBtn.addEventListener('click', startTest);
retryBtn.addEventListener('click', resetTest);

function startTest() {
    testQuestions = shuffleArray([...vocabularyDatabase]).slice(0, 20);
    currentQuestionIndex = 0;
    correctAnswers = 0;
    
    startScreen.classList.remove('active');
    testScreen.classList.add('active');
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= testQuestions.length) {
        showResults();
        return;
    }
    
    const question = testQuestions[currentQuestionIndex];
    questionNumber.textContent = `問題 ${currentQuestionIndex + 1}/20`;
    progressFill.style.width = `${((currentQuestionIndex + 1) / 20) * 100}%`;
    
    wordDisplay.textContent = question.word;
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleOptionsWithCorrect(question.options, question.correct);
    
    shuffledOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option.text;
        button.addEventListener('click', () => selectAnswer(index, option.isCorrect));
        optionsContainer.appendChild(button);
    });
    
    startTimer();
}

function shuffleOptionsWithCorrect(options, correctIndex) {
    const optionsWithFlags = options.map((option, index) => ({
        text: option,
        isCorrect: index === correctIndex
    }));
    return shuffleArray(optionsWithFlags);
}

function selectAnswer(selectedIndex, isCorrect) {
    clearInterval(timerInterval);
    
    const options = document.querySelectorAll('.option');
    options[selectedIndex].classList.add(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
        correctAnswers++;
    } else {
        options.forEach((option, index) => {
            if (testQuestions[currentQuestionIndex].options[testQuestions[currentQuestionIndex].correct] === option.textContent) {
                option.classList.add('correct');
            }
        });
    }
    
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1500);
}

function startTimer() {
    timeLeft = 15;
    timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `残り時間: ${timeLeft}秒`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            currentQuestionIndex++;
            showQuestion();
        }
    }, 1000);
}

function showResults() {
    testScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    const accuracy = (correctAnswers / 20) * 100;
    const predictedScore = calculateTOEICScore(correctAnswers, testQuestions);
    
    document.getElementById('predicted-score').textContent = predictedScore;
    document.getElementById('correct-count').textContent = `正解数: ${correctAnswers}/20問`;
    document.getElementById('accuracy-rate').textContent = `正答率: ${accuracy.toFixed(1)}%`;
    document.getElementById('level-assessment').textContent = getLevelAssessment(predictedScore);
}

function calculateTOEICScore(correct, questions) {
    const baseScore = 200;
    const scorePerCorrect = 35;
    
    let levelBonus = 0;
    questions.forEach((q, index) => {
        if (index < correct) {
            levelBonus += q.level * 5;
        }
    });
    
    const rawScore = baseScore + (correct * scorePerCorrect) + levelBonus;
    
    return Math.min(990, Math.round(rawScore / 10) * 10);
}

function getLevelAssessment(score) {
    if (score >= 860) return "レベル: 上級者 - ビジネスで十分なコミュニケーションが可能";
    if (score >= 730) return "レベル: 中上級者 - 日常会話は問題なく、ビジネスでも対応可能";
    if (score >= 600) return "レベル: 中級者 - 日常会話で基本的なコミュニケーションが可能";
    if (score >= 470) return "レベル: 初中級者 - 簡単な日常会話が可能";
    return "レベル: 初級者 - 基礎からの学習が必要";
}

function resetTest() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}