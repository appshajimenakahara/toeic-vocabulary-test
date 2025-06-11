const questions = [
    {
        id: 1,
        imageUrl: 'https://via.placeholder.com/600x400/4A90E2/FFFFFF?text=Office+Meeting',
        imageDescription: 'オフィスでの会議風景',
        statements: [
            "They are having a meeting in the conference room.",
            "They are eating lunch in the cafeteria.",
            "They are working individually at their desks.",
            "They are leaving the office building."
        ],
        correct: 0,
        audioTexts: [
            "(A) They are having a meeting in the conference room.",
            "(B) They are eating lunch in the cafeteria.",
            "(C) They are working individually at their desks.",
            "(D) They are leaving the office building."
        ]
    },
    {
        id: 2,
        imageUrl: 'https://via.placeholder.com/600x400/50C878/FFFFFF?text=Park+Bench',
        imageDescription: '公園のベンチ',
        statements: [
            "A man is painting the bench.",
            "People are sitting on the bench.",
            "The bench is located in a park.",
            "Children are playing near the bench."
        ],
        correct: 2,
        audioTexts: [
            "(A) A man is painting the bench.",
            "(B) People are sitting on the bench.",
            "(C) The bench is located in a park.",
            "(D) Children are playing near the bench."
        ]
    },
    {
        id: 3,
        imageUrl: 'https://via.placeholder.com/600x400/FFB347/FFFFFF?text=Restaurant+Kitchen',
        imageDescription: 'レストランのキッチン',
        statements: [
            "The chef is taking a break.",
            "The kitchen is being cleaned.",
            "Food is being prepared in the kitchen.",
            "Customers are entering the kitchen."
        ],
        correct: 2,
        audioTexts: [
            "(A) The chef is taking a break.",
            "(B) The kitchen is being cleaned.",
            "(C) Food is being prepared in the kitchen.",
            "(D) Customers are entering the kitchen."
        ]
    },
    {
        id: 4,
        imageUrl: 'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Airport+Terminal',
        imageDescription: '空港ターミナル',
        statements: [
            "Passengers are boarding the plane.",
            "People are waiting in the terminal.",
            "The plane is taking off.",
            "Luggage is being loaded onto the plane."
        ],
        correct: 1,
        audioTexts: [
            "(A) Passengers are boarding the plane.",
            "(B) People are waiting in the terminal.",
            "(C) The plane is taking off.",
            "(D) Luggage is being loaded onto the plane."
        ]
    },
    {
        id: 5,
        imageUrl: 'https://via.placeholder.com/600x400/9B59B6/FFFFFF?text=Library+Study',
        imageDescription: '図書館での学習',
        statements: [
            "Students are studying at the library.",
            "The librarian is organizing books.",
            "People are having a loud discussion.",
            "The library is closed for renovation."
        ],
        correct: 0,
        audioTexts: [
            "(A) Students are studying at the library.",
            "(B) The librarian is organizing books.",
            "(C) People are having a loud discussion.",
            "(D) The library is closed for renovation."
        ]
    },
    {
        id: 6,
        imageUrl: 'https://via.placeholder.com/600x400/3498DB/FFFFFF?text=Construction+Site',
        imageDescription: '建設現場',
        statements: [
            "The building has been completed.",
            "Workers are taking a lunch break.",
            "Construction work is in progress.",
            "The site is abandoned."
        ],
        correct: 2,
        audioTexts: [
            "(A) The building has been completed.",
            "(B) Workers are taking a lunch break.",
            "(C) Construction work is in progress.",
            "(D) The site is abandoned."
        ]
    }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let testStartTime;
let questionStartTime;

const startScreen = document.getElementById('start-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const nextBtn = document.getElementById('next-btn');
const playAudioBtn = document.getElementById('play-audio');

const currentQuestionEl = document.getElementById('current-question');
const photoEl = document.getElementById('photo');
const photoPlaceholder = document.getElementById('photo-placeholder');
const audioStatus = document.getElementById('audio-status');
const timeDisplay = document.getElementById('time-display');

const optionBtns = document.querySelectorAll('.option-btn');

startBtn.addEventListener('click', startTest);
retryBtn.addEventListener('click', resetTest);
nextBtn.addEventListener('click', nextQuestion);
playAudioBtn.addEventListener('click', playAudio);

optionBtns.forEach(btn => {
    btn.addEventListener('click', selectAnswer);
});

function startTest() {
    currentQuestionIndex = 0;
    userAnswers = [];
    testStartTime = Date.now();
    
    startScreen.classList.remove('active');
    testScreen.classList.add('active');
    
    showQuestion();
    startTimer();
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionStartTime = Date.now();
    
    currentQuestionEl.textContent = `Question ${currentQuestionIndex + 1}`;
    
    photoPlaceholder.style.display = 'block';
    photoEl.style.display = 'none';
    photoEl.src = question.imageUrl;
    photoEl.alt = question.imageDescription;
    
    photoEl.onload = () => {
        photoPlaceholder.style.display = 'none';
        photoEl.style.display = 'block';
    };
    
    optionBtns.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'incorrect');
        btn.disabled = false;
    });
    
    nextBtn.disabled = true;
    playAudioBtn.disabled = false;
    audioStatus.textContent = '再生待機中';
}

function playAudio() {
    playAudioBtn.disabled = true;
    audioStatus.textContent = '音声再生中...';
    
    const question = questions[currentQuestionIndex];
    let audioIndex = 0;
    
    function playNextStatement() {
        if (audioIndex < question.audioTexts.length) {
            audioStatus.textContent = `${question.audioTexts[audioIndex]} を再生中`;
            
            const utterance = new SpeechSynthesisUtterance(question.audioTexts[audioIndex]);
            utterance.lang = 'en-US';
            utterance.rate = 0.9;
            
            utterance.onend = () => {
                audioIndex++;
                if (audioIndex < question.audioTexts.length) {
                    setTimeout(playNextStatement, 1500);
                } else {
                    audioStatus.textContent = '再生完了 - 解答を選択してください';
                    enableAnswering();
                }
            };
            
            speechSynthesis.speak(utterance);
        }
    }
    
    setTimeout(playNextStatement, 1000);
}

function enableAnswering() {
    optionBtns.forEach(btn => {
        btn.disabled = false;
    });
}

function selectAnswer(e) {
    const selectedOption = e.target.closest('.option-btn');
    const selectedAnswer = selectedOption.dataset.option;
    const answerIndex = ['A', 'B', 'C', 'D'].indexOf(selectedAnswer);
    const question = questions[currentQuestionIndex];
    
    optionBtns.forEach(btn => btn.disabled = true);
    
    selectedOption.classList.add('selected');
    
    const isCorrect = answerIndex === question.correct;
    
    setTimeout(() => {
        if (isCorrect) {
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            optionBtns[question.correct].classList.add('correct');
        }
        
        userAnswers.push({
            questionId: question.id,
            selectedAnswer: answerIndex,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            timeSpent: Date.now() - questionStartTime
        });
        
        nextBtn.disabled = false;
    }, 500);
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= questions.length) {
        showResults();
    } else {
        showQuestion();
    }
}

function showResults() {
    testScreen.classList.remove('active');
    resultScreen.classList.add('active');
    
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const accuracy = (correctCount / questions.length) * 100;
    const totalTime = Date.now() - testStartTime;
    const convertedScore = calculateConvertedScore(correctCount);
    
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('converted-score').textContent = convertedScore;
    document.getElementById('accuracy-rate').textContent = `${accuracy.toFixed(0)}%`;
    document.getElementById('total-time').textContent = formatTime(totalTime);
    
    const feedbackText = getFeedback(correctCount);
    document.getElementById('feedback-text').textContent = feedbackText;
    
    displayAnswerReview();
}

function calculateConvertedScore(correctCount) {
    const conversionTable = {
        0: 5,
        1: 15,
        2: 25,
        3: 35,
        4: 45,
        5: 60,
        6: 80
    };
    
    return conversionTable[correctCount];
}

function getFeedback(correctCount) {
    if (correctCount === 6) {
        return "素晴らしい！Part1は完璧です。写真描写の理解力が非常に高いです。";
    } else if (correctCount >= 4) {
        return "良好な成績です。Part1の基本的な問題パターンを理解しています。";
    } else if (correctCount >= 2) {
        return "基礎的な理解はありますが、より多くの練習が必要です。写真の細部に注意を払いましょう。";
    } else {
        return "Part1の問題形式に慣れる必要があります。写真全体を観察し、音声を注意深く聞く練習をしましょう。";
    }
}

function displayAnswerReview() {
    const answerList = document.getElementById('answer-list');
    answerList.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = `answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        const options = ['A', 'B', 'C', 'D'];
        answerItem.innerHTML = `
            <span class="answer-number">問題 ${index + 1}</span>
            <span>あなたの解答: ${options[answer.selectedAnswer]}</span>
            <span>正解: ${options[answer.correctAnswer]}</span>
            <span class="answer-result">${answer.isCorrect ? '✓' : '✗'}</span>
        `;
        
        answerList.appendChild(answerItem);
    });
}

function startTimer() {
    setInterval(() => {
        if (testScreen.classList.contains('active')) {
            const elapsed = Date.now() - testStartTime;
            timeDisplay.textContent = formatTime(elapsed);
        }
    }, 1000);
}

function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function resetTest() {
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
}

if (!window.speechSynthesis) {
    alert('お使いのブラウザは音声合成機能に対応していません。Chrome、Safari、またはEdgeブラウザをご使用ください。');
}