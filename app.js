import { getRandomQuestions, calculateTOEICScore, getLevelBreakdown } from './vocabulary-data.js';

class TOEICVocabularyTest {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = null;
    this.endTime = null;
    
    this.initializeElements();
    this.bindEvents();
    this.initializeFirebaseAnalytics();
  }

  initializeElements() {
    // Screens
    this.startScreen = document.getElementById('startScreen');
    this.testScreen = document.getElementById('testScreen');
    this.resultScreen = document.getElementById('resultScreen');
    
    // Start screen elements
    this.startBtn = document.getElementById('startBtn');
    
    // Test screen elements
    this.progressFill = document.getElementById('progressFill');
    this.currentQuestion = document.getElementById('currentQuestion');
    this.totalQuestions = document.getElementById('totalQuestions');
    this.questionWord = document.getElementById('questionWord');
    this.choices = document.getElementById('choices');
    this.nextBtn = document.getElementById('nextBtn');
    
    // Result screen elements
    this.toeicScore = document.getElementById('toeicScore');
    this.scoreRange = document.getElementById('scoreRange');
    this.accuracy = document.getElementById('accuracy');
    this.analysisChart = document.getElementById('analysisChart');
    this.levelBreakdown = document.getElementById('levelBreakdown');
    this.shareTwitter = document.getElementById('shareTwitter');
    this.shareFacebook = document.getElementById('shareFacebook');
    this.shareLine = document.getElementById('shareLine');
    this.retryBtn = document.getElementById('retryBtn');
  }

  bindEvents() {
    this.startBtn.addEventListener('click', () => this.startTest());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.retryBtn.addEventListener('click', () => this.resetTest());
    
    // Share buttons
    this.shareTwitter.addEventListener('click', () => this.shareOnTwitter());
    this.shareFacebook.addEventListener('click', () => this.shareOnFacebook());
    this.shareLine.addEventListener('click', () => this.shareOnLine());
  }

  async initializeFirebaseAnalytics() {
    try {
      // Initialize Firebase
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
      const { getAnalytics, logEvent } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js');
      
      const firebaseConfig = {
        // Replace with your Firebase config
        apiKey: "your-api-key",
        authDomain: "your-project.firebaseapp.com",
        projectId: "your-project-id",
        storageBucket: "your-project.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef123456",
        measurementId: "G-XXXXXXXXXX"
      };

      const app = initializeApp(firebaseConfig);
      this.analytics = getAnalytics(app);
      
      // Log page view
      logEvent(this.analytics, 'page_view', {
        page_title: 'TOEIC Vocabulary Test',
        page_location: window.location.href
      });
    } catch (error) {
      console.log('Firebase Analytics not configured');
    }
  }

  logAnalyticsEvent(eventName, parameters = {}) {
    if (this.analytics) {
      const { logEvent } = import('https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js').then(module => {
        module.logEvent(this.analytics, eventName, parameters);
      });
    }
  }

  startTest() {
    this.questions = getRandomQuestions(30);
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = new Date();
    
    this.showScreen(this.testScreen);
    this.displayQuestion();
    
    // Analytics
    this.logAnalyticsEvent('test_started', {
      total_questions: this.questions.length
    });
  }

  displayQuestion() {
    const question = this.questions[this.currentQuestionIndex];
    
    // Update progress
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    this.progressFill.style.width = `${progress}%`;
    
    // Update question counter
    this.currentQuestion.textContent = this.currentQuestionIndex + 1;
    this.totalQuestions.textContent = this.questions.length;
    
    // Display question
    this.questionWord.textContent = question.word;
    
    // Shuffle choices while keeping track of correct answer
    const shuffledChoices = [];
    const originalChoices = [...question.choices];
    const correctAnswer = question.choices[question.correct];
    
    // Create array of indices and shuffle them
    const indices = originalChoices.map((_, index) => index);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    
    // Map shuffled indices to choices
    let newCorrectIndex = -1;
    indices.forEach((originalIndex, newIndex) => {
      shuffledChoices.push(originalChoices[originalIndex]);
      if (originalIndex === question.correct) {
        newCorrectIndex = newIndex;
      }
    });
    
    // Store the new correct index for this display
    this.currentCorrectIndex = newCorrectIndex;
    
    // Display shuffled choices
    this.choices.innerHTML = '';
    shuffledChoices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      button.textContent = choice;
      button.addEventListener('click', () => this.selectAnswer(index));
      this.choices.appendChild(button);
    });
    
    this.nextBtn.style.display = 'none';
  }

  selectAnswer(selectedIndex) {
    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = selectedIndex === this.currentCorrectIndex;
    
    // Store answer
    this.userAnswers.push({
      word: question.word,
      selectedIndex,
      correct: isCorrect,
      correctAnswer: question.meaning
    });
    
    // Visual feedback
    const choices = this.choices.querySelectorAll('.choice-btn');
    choices.forEach((btn, index) => {
      btn.disabled = true;
      if (index === this.currentCorrectIndex) {
        btn.classList.add('correct');
      } else if (index === selectedIndex && !isCorrect) {
        btn.classList.add('incorrect');
      }
    });
    
    this.nextBtn.disabled = false;
    
    // Auto-advance to next question after 1.5 seconds
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  nextQuestion() {
    this.currentQuestionIndex++;
    
    if (this.currentQuestionIndex < this.questions.length) {
      this.displayQuestion();
    } else {
      this.endTest();
    }
  }

  endTest() {
    this.endTime = new Date();
    const timeTaken = (this.endTime - this.startTime) / 1000; // seconds
    
    this.displayResults();
    this.showScreen(this.resultScreen);
    
    // Analytics
    const correctAnswers = this.userAnswers.filter(answer => answer.correct).length;
    const accuracy = (correctAnswers / this.userAnswers.length) * 100;
    
    this.logAnalyticsEvent('test_completed', {
      score: calculateTOEICScore(this.userAnswers),
      accuracy: accuracy,
      time_taken: timeTaken,
      total_questions: this.questions.length,
      correct_answers: correctAnswers
    });
  }

  displayResults() {
    const correctAnswers = this.userAnswers.filter(answer => answer.correct).length;
    const accuracy = (correctAnswers / this.userAnswers.length) * 100;
    const toeicScore = calculateTOEICScore(this.userAnswers);
    const levelBreakdown = getLevelBreakdown(this.userAnswers);
    
    // Display main scores
    this.toeicScore.textContent = toeicScore;
    this.scoreRange.textContent = this.getScoreRange(toeicScore);
    this.accuracy.textContent = `${accuracy.toFixed(1)}%`;
    
    // Display level breakdown
    this.displayLevelBreakdown(levelBreakdown);
    
    // Create analysis chart
    this.createAnalysisChart(levelBreakdown);
    
    // Store results for sharing
    this.currentResults = {
      toeicScore,
      accuracy,
      correctAnswers,
      totalQuestions: this.userAnswers.length
    };
  }

  getScoreRange(score) {
    if (score >= 860) return "非常に高いレベル";
    if (score >= 730) return "高いレベル";
    if (score >= 470) return "中級レベル";
    if (score >= 220) return "初級レベル";
    return "基礎レベル";
  }

  displayLevelBreakdown(breakdown) {
    this.levelBreakdown.innerHTML = '';
    
    const levels = [
      { key: 'basic', name: '基礎レベル', color: '#4CAF50' },
      { key: 'intermediate', name: '中級レベル', color: '#2196F3' },
      { key: 'advanced', name: '上級レベル', color: '#FF9800' },
      { key: 'expert', name: '専門レベル', color: '#9C27B0' }
    ];
    
    levels.forEach(level => {
      const data = breakdown[level.key];
      if (data.total > 0) {
        const percentage = (data.correct / data.total) * 100;
        
        const levelDiv = document.createElement('div');
        levelDiv.className = 'level-item';
        levelDiv.innerHTML = `
          <div class="level-name">${level.name}</div>
          <div class="level-stats">
            <span class="level-score">${data.correct}/${data.total}</span>
            <span class="level-percentage">(${percentage.toFixed(1)}%)</span>
          </div>
          <div class="level-bar">
            <div class="level-fill" style="width: ${percentage}%; background-color: ${level.color}"></div>
          </div>
        `;
        
        this.levelBreakdown.appendChild(levelDiv);
      }
    });
  }

  createAnalysisChart(breakdown) {
    const ctx = this.analysisChart.getContext('2d');
    
    const levels = ['基礎', '中級', '上級', '専門'];
    const correctData = [
      breakdown.basic.correct,
      breakdown.intermediate.correct,
      breakdown.advanced.correct,
      breakdown.expert.correct
    ];
    const totalData = [
      breakdown.basic.total,
      breakdown.intermediate.total,
      breakdown.advanced.total,
      breakdown.expert.total
    ];
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: levels,
        datasets: [{
          label: '正解数',
          data: correctData,
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1
        }, {
          label: '出題数',
          data: totalData,
          backgroundColor: 'rgba(158, 158, 158, 0.3)',
          borderColor: 'rgba(158, 158, 158, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...totalData) + 1
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'レベル別正答率分析'
          }
        }
      }
    });
  }

  shareOnTwitter() {
    const { toeicScore, accuracy } = this.currentResults;
    const text = `TOEIC英単語診断テストで${toeicScore}点を獲得しました！正答率${accuracy.toFixed(1)}%でした。あなたも挑戦してみませんか？`;
    const url = encodeURIComponent(window.location.href);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`;
    
    window.open(twitterUrl, '_blank');
    
    this.logAnalyticsEvent('share', {
      method: 'twitter',
      score: toeicScore
    });
  }

  shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    window.open(facebookUrl, '_blank');
    
    this.logAnalyticsEvent('share', {
      method: 'facebook',
      score: this.currentResults.toeicScore
    });
  }

  shareOnLine() {
    const { toeicScore, accuracy } = this.currentResults;
    const text = `TOEIC英単語診断テストで${toeicScore}点を獲得！正答率${accuracy.toFixed(1)}%でした。`;
    const url = encodeURIComponent(window.location.href);
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${url}&text=${encodeURIComponent(text)}`;
    
    window.open(lineUrl, '_blank');
    
    this.logAnalyticsEvent('share', {
      method: 'line',
      score: toeicScore
    });
  }

  showScreen(targetScreen) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    targetScreen.classList.add('active');
  }

  resetTest() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.userAnswers = [];
    this.startTime = null;
    this.endTime = null;
    
    this.showScreen(this.startScreen);
    
    this.logAnalyticsEvent('test_restarted');
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TOEICVocabularyTest();
});