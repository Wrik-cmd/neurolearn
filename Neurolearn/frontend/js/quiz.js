// ============================================================
// quiz.js — NeuroLearn Platform
// Full quiz engine: load, answer tracking, submit, timer
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) return;

  // ---- STATE ----
  let questions     = [];
  let currentIndex  = 0;
  let answers       = {};      // { questionId: selectedOptionIndex }
  let score         = 0;
  let timerInterval = null;
  let timeLeft      = 30;
  let quizStartTime = Date.now();
  const urlParams   = new URLSearchParams(window.location.search);
  const topicId     = urlParams.get('topic') || urlParams.get('topicId') || urlParams.get('course') || 'General';

  // ---- ELEMENTS ----
  const questionNumberEl = document.getElementById('question-number');
  const questionTextEl   = document.getElementById('question-text');
  const optionsList      = document.getElementById('options-list');
  const submitBtn        = document.getElementById('submit-btn');
  const nextBtn          = document.getElementById('next-btn');
  const prevBtn          = document.getElementById('prev-btn');
  const timerEl          = document.getElementById('timer-value');
  const timerCircle      = document.getElementById('timer-circle');
  const progressSteps    = document.getElementById('progress-steps');
  const currentQEl       = document.getElementById('current-q');
  const totalQEl         = document.getElementById('total-q');

  // ============================================================
  // INIT
  // ============================================================
  async function init() {
    showSkeleton();

    try {
      const result = await API.quiz.getQuestions(topicId);
      if (result.success && result.data && result.data.length > 0) {
        questions = result.data;
      } else {
        quizContainer.innerHTML = '<div style="text-align:center;padding:3rem;"><div style="color:#ff4466;font-size:1.2rem;">No questions available for this topic.</div><a href="dashboard.html" class="btn btn-outline mt-3">Back to Dashboard</a></div>';
        return;
      }
    } catch (err) {
      console.error('Failed to load questions', err);
      quizContainer.innerHTML = '<div style="text-align:center;padding:3rem;"><div style="color:#ff4466;font-size:1.2rem;">Failed to connect to the server.</div><a href="dashboard.html" class="btn btn-outline mt-3">Back to Dashboard</a></div>';
      return;
    }

    questions = questions.slice(0, 10); // max 10 per session
    renderProgressSteps();
    if (totalQEl) totalQEl.textContent = questions.length;
    renderQuestion();
    startTimer();
  }

  // ============================================================
  // RENDER QUESTION
  // ============================================================
  function renderQuestion() {
    const q = questions[currentIndex];
    if (!q) return;

    // Update meta
    if (questionNumberEl) questionNumberEl.textContent = `Question ${currentIndex + 1} of ${questions.length}`;
    if (questionTextEl)   questionTextEl.textContent = q.text;
    if (currentQEl)       currentQEl.textContent = currentIndex + 1;
    
    // Dynamic tag
    const questionTag = document.getElementById('question-tag');
    if (questionTag) questionTag.textContent = q.topic ? q.topic.toUpperCase() : 'GENERAL';

    // Slide animation
    if (optionsList) {
      optionsList.style.animation = 'none';
      requestAnimationFrame(() => {
        optionsList.style.animation = 'fadeInUp 0.4s ease';
      });
    }

    renderOptions(q);
    updateProgressSteps();
    updateNavButtons();
    resetTimer();
  }

  // ============================================================
  // RENDER OPTIONS
  // ============================================================
  function renderOptions(q) {
    if (!optionsList) return;
    const keys = ['A', 'B', 'C', 'D'];
    const selectedAnswer = answers[q.id];

    optionsList.innerHTML = q.options.map((opt, i) => {
      const isSelected = selectedAnswer === i;
      return `
        <li class="option-item ${isSelected ? 'selected' : ''}"
            data-index="${i}"
            role="button"
            tabindex="0"
            aria-pressed="${isSelected}">
          <span class="option-key">${keys[i]}</span>
          <span class="option-text">${opt}</span>
          <span class="option-indicator">${isSelected ? '●' : ''}</span>
        </li>
      `;
    }).join('');

    // Attach events
    optionsList.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', () => selectOption(item, q));
      item.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') selectOption(item, q);
      });
    });
  }

  // ============================================================
  // SELECT OPTION
  // ============================================================
  function selectOption(item, q) {
    const index = parseInt(item.dataset.index);
    answers[q.id] = index;

    // Update UI
    optionsList.querySelectorAll('.option-item').forEach(el => {
      el.classList.remove('selected');
      el.querySelector('.option-indicator').textContent = '';
    });

    item.classList.add('selected');
    item.querySelector('.option-indicator').textContent = '●';

    // Update step dot
    updateProgressSteps();

    // Enable submit
    if (submitBtn) submitBtn.disabled = false;
  }

  // ============================================================
  // PROGRESS STEPS
  // ============================================================
  function renderProgressSteps() {
    if (!progressSteps) return;
    progressSteps.innerHTML = questions.map((_, i) =>
      `<div class="step-dot ${i === 0 ? 'current' : ''}" data-step="${i}"></div>`
    ).join('');
  }

  function updateProgressSteps() {
    if (!progressSteps) return;
    questions.forEach((q, i) => {
      const dot = progressSteps.querySelector(`[data-step="${i}"]`);
      if (!dot) return;
      dot.className = 'step-dot';
      if (i === currentIndex) dot.classList.add('current');
      else if (answers[q.id] !== undefined) dot.classList.add('answered');
    });
  }

  // ============================================================
  // TIMER
  // ============================================================
  function startTimer() {
    timeLeft = 30;
    updateTimerUI();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerUI();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        autoAdvance();
      }
    }, 1000);
  }

  function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
  }

  function updateTimerUI() {
    if (timerEl) timerEl.textContent = timeLeft;
    if (timerCircle) {
      timerCircle.classList.toggle('warning', timeLeft <= 10);
    }
  }

  function autoAdvance() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  function updateNavButtons() {
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === questions.length - 1;
    if (submitBtn) {
      const q = questions[currentIndex];
      submitBtn.disabled = answers[q?.id] === undefined;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) { currentIndex--; renderQuestion(); }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < questions.length - 1) { currentIndex++; renderQuestion(); }
    });
  }

  // ============================================================
  // SUBMIT (current question reveal)
  // ============================================================
  const aiExplainBtn = document.getElementById('ai-explain-btn');
  let isAiExplaining = false;

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const q   = questions[currentIndex];
      const sel = answers[q.id];
      if (sel === undefined) return;

      // Show correct / wrong
      const items = optionsList.querySelectorAll('.option-item');
      items.forEach((item, i) => {
        if (i === q.correct) item.classList.add('correct');
        else if (i === sel && sel !== q.correct) {
            item.classList.add('wrong');
            // Show AI explain button if wrong
            if (aiExplainBtn) aiExplainBtn.classList.remove('hidden');
        }
      });

      // Disable further selection
      items.forEach(item => item.style.pointerEvents = 'none');
      submitBtn.disabled = true;

      // Track score
      if (sel === q.correct) score++;

      // Auto-advance after 1.5s (UNLESS AI is explaining)
      setTimeout(() => {
        if (!isAiExplaining) {
            advanceQuiz();
        }
      }, 1500);
    });
  }

  function advanceQuiz() {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      if (aiExplainBtn) aiExplainBtn.classList.add('hidden');
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  if (aiExplainBtn) {
    aiExplainBtn.addEventListener('click', () => {
        isAiExplaining = true;
        const q = questions[currentIndex];
        const sel = answers[q.id];
        const correctOpt = q.options[q.correct];
        const userOpt = q.options[sel];
        
        const message = `Explain why the correct answer to "${q.text}" is "${correctOpt}". I chose "${userOpt}", why is that incorrect?`;
        
        // Open sidebar if hidden (it's flex-lg but hidden on mobile, for now just send msg)
        sendAiMessage(message);
    });
  }

  // ============================================================
  // AI CHATBOT LOGIC
  // ============================================================
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatHistory = document.getElementById('chat-history');

  async function sendAiMessage(message) {
    if (!message) return;
    
    // Append User Msg
    const userHtml = `
        <div class="flex flex-col gap-3 mt-4">
            <div class="bg-primary/20 text-primary border border-primary/30 rounded-2xl rounded-tr-sm p-4 text-sm self-end shadow-[0_5px_15px_rgba(60,215,255,0.1)] ml-auto max-w-[85%] font-body">
                ${message}
            </div>
        </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', userHtml);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Wait item
    const waitId = 'wait-' + Date.now();
    const waitHtml = `
        <div id="${waitId}" class="flex flex-col gap-3 mt-4">
            <div class="bg-surface-container rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 shadow-lg border border-white/5 leading-relaxed self-start max-w-[85%]">
                 <span class="animate-pulse flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-primary" style="animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span> Neural link synchronizing...</span>
            </div>
        </div>
    `;
    chatHistory.insertAdjacentHTML('beforeend', waitHtml);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    try {
        const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000/api' : '/api';
        const res = await fetch(`${baseUrl}/chat/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const waitEl = document.getElementById(waitId);
        if(waitEl) waitEl.remove();
        
        const data = await res.json();
        
        if (res.ok) {
            const aiHtml = `
                <div class="flex flex-col gap-3 mt-4">
                    <div class="bg-surface-container rounded-2xl rounded-tl-sm p-4 text-sm text-slate-300 shadow-lg border border-white/5 leading-relaxed self-start max-w-[85%] font-body">
                        <span class="text-primary font-bold text-[10px] uppercase tracking-widest mb-2 block font-headline">Neural Assistant</span>
                        ${data.reply.replace(/\n/g, '<br/>')}
                    </div>
                </div>
            `;
            chatHistory.insertAdjacentHTML('beforeend', aiHtml);
            
            // Add "Got it, next" button if this was a quiz explanation
            if (isAiExplaining) {
                const nextHtml = `
                    <button id="resume-quiz-btn" class="btn btn-sm btn-primary mt-2 self-start" style="text-transform:none;">Resume Node →</button>
                `;
                chatHistory.insertAdjacentHTML('beforeend', nextHtml);
                document.getElementById('resume-quiz-btn').onclick = () => {
                    isAiExplaining = false;
                    advanceQuiz();
                };
            }

        } else {
            const aiHtml = `<div class="bg-error/10 text-error p-3 rounded-lg">${data.error}</div>`;
            chatHistory.insertAdjacentHTML('beforeend', aiHtml);
        }
    } catch (err) {
        const waitEl = document.getElementById(waitId);
        if(waitEl) waitEl.remove();
        chatHistory.insertAdjacentHTML('beforeend', `<div class="bg-error/10 text-error p-3 rounded-lg">Neural link failure.</div>`);
    }
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      const msg = chatInput.value.trim();
      if (msg) {
        chatInput.value = '';
        sendAiMessage(msg);
      }
    });
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') chatSendBtn.click();
    });
  }

  // ============================================================
  // FINISH QUIZ
  // ============================================================
  async function finishQuiz() {
    clearInterval(timerInterval);
    const timeTaken = Math.round((Date.now() - quizStartTime) / 1000);

    // Prepare final answers array
    const answersArray = questions.map(q => ({
      questionId: q.id,
      selected: answers[q.id] ?? -1,
      correct: q.correct,
      text: q.text
    }));

    // Calc final score
    const finalScore = answersArray.filter(a => a.selected === a.correct).length;
    const percentage = Math.round((finalScore / questions.length) * 100);

    // Try to submit to server
    try {
      await API.quiz.submitAnswers(topicId, answersArray);
    } catch {}

    // Store result in session for result page
    sessionStorage.setItem('quiz_result', JSON.stringify({
      score: finalScore,
      total: questions.length,
      percentage,
      timeTaken,
      topicId,
      answers: answersArray
    }));

    // Redirect to results
    window.location.href = 'result.html';
  }

  // ============================================================
  // SKELETON LOADER
  // ============================================================
  function showSkeleton() {
    if (questionTextEl) {
      questionTextEl.innerHTML = `<div class="skeleton" style="height:1.5em;width:80%;border-radius:4px;background:rgba(255,255,255,0.06);animation:skeletonPulse 1.5s ease-in-out infinite;"></div>`;
    }
  }

  // ---- START ----
  init();

  // ---- KEYBOARD SHORTCUTS ----
  document.addEventListener('keydown', (e) => {
    const keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
    const key = e.key.toLowerCase();
    if (keyMap[key] !== undefined) {
      const items = optionsList?.querySelectorAll('.option-item');
      if (items?.[keyMap[key]]) {
        const q = questions[currentIndex];
        selectOption(items[keyMap[key]], q);
      }
    }
    if (e.key === 'Enter' && submitBtn && !submitBtn.disabled) submitBtn.click();
    if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) nextBtn.click();
    if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) prevBtn.click();
  });
});
