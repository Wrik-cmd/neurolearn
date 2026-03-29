// ============================================================
// dashboard.js — NeuroLearn Platform
// Dashboard analytics, charts, and dynamic data
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  const isDashboard = document.getElementById('dashboard-main') !== null;
  if (!isDashboard) return;

  // ---- ELEMENTS ----
  const statsContainer    = document.getElementById('stats-container');
  const chartContainer    = document.getElementById('chart-container');
  const activityContainer = document.getElementById('activity-container');
  const weakContainer     = document.getElementById('weak-topics-container');
  const courseCards       = document.getElementById('course-cards');

  // ============================================================
  // LOAD ALL DATA
  // ============================================================
  async function loadDashboard() {
    await Promise.all([
      loadStats(),
      loadChart(),
      loadActivity(),
      loadWeakTopics(),
      loadCourses()
    ]);
  }

  // ============================================================
  // STATS CARDS
  // ============================================================
  async function loadStats() {
    if (!statsContainer) return;

    let stats = { quizzesTaken: 0, avgScore: 0, streak: 0, coursesEnrolled: 0 };
    try {
      const result = await API.dashboard.getStats();
      if (result.success && result.data) stats = result.data;
    } catch (err) {
      console.error('Failed to load stats', err);
    }

    const items = [
      { icon: '🎯', value: stats.quizzesTaken,    label: 'Quizzes Taken',   color: 'cyan' },
      { icon: '📊', value: `${stats.avgScore}%`,  label: 'Average Score',   color: 'purple' },
      { icon: '🔥', value: stats.streak,           label: 'Day Streak',      color: 'orange' },
      { icon: '📚', value: stats.coursesEnrolled,  label: 'Courses Enrolled',color: 'green' }
    ];

    statsContainer.innerHTML = items.map((item, i) => `
      <div class="glass-panel p-6 rounded-lg ring-1 ring-white/5 hover:bg-surface-container-highest/60 transition-colors anim-fade-up" style="animation-delay: ${i * 0.1}s">
        <span class="text-3xl mb-2 inline-block material-symbols-outlined text-primary/80">${item.icon}</span>
        <div class="text-3xl font-extrabold tracking-tight mb-1 text-white" data-count="${typeof item.value === 'number' ? item.value : ''}">${item.value}</div>
        <div class="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">${item.label}</div>
      </div>
    `).join('');

    // Animate numbers
    animateCounters();
  }

  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.dataset.count);
      if (isNaN(target)) return;
      let current = 0;
      const increment = target / 40;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) { current = target; clearInterval(interval); }
        el.textContent = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
      }, 30);
    });
  }

  // ============================================================
  // BAR CHART
  // ============================================================
  async function loadChart() {
    if (!chartContainer) return;

    let data = [0, 0, 0, 0, 0, 0, 0];
    try {
      const result = await API.dashboard.getChartData();
      if (result.success && result.data) data = result.data;
    } catch (err) {
      console.error('Failed to load chart', err);
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVal = Math.max(...data);

    chartContainer.innerHTML = `
      <div class="w-8 flex flex-col justify-between items-end text-[10px] font-bold text-on-surface-variant h-[180px]">
        ${[100,75,50,25,0].map(v => `<span>${v}</span>`).join('')}
      </div>
      <div class="flex-1 flex items-end gap-2 h-[180px] px-2 relative border-b border-white/5 pb-1 w-full">
        ${data.map((val, i) => `
          <div class="flex-1 flex flex-col items-center justify-end h-full gap-2 relative group mt-auto">
            <div class="w-full bg-primary/20 hover:bg-primary transition-all rounded-t-sm relative flex items-end justify-center anim-fade-up"
                 style="height: ${(val / maxVal) * 100}%; animation-delay: ${i * 0.07}s;"
                 data-tooltip="${val}%">
              <div class="absolute -top-6 bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${val}%</div>
            </div>
            <span class="absolute -bottom-6 text-[10px] font-bold text-on-surface-variant uppercase">${days[i] || ''}</span>
          </div>
        `).join('')}
      </div>
    `;
    chartContainer.className = "flex gap-2 w-full pt-4 pb-4 items-end";
  }

  // ============================================================
  // ACTIVITY FEED
  // ============================================================
  async function loadActivity() {
    if (!activityContainer) return;

    let activity = [];
    try {
      const result = await API.dashboard.getActivity();
      if (result.success && result.data) activity = result.data;
    } catch (err) {
      console.error('Failed to load activity', err);
    }

    if (!activity.length) {
      activityContainer.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;">No recent activity. Keep learning!</div>';
      return;
    }

    activityContainer.innerHTML = activity.map((item, i) => {
      const gColor = item.color === 'cyan' ? 'has-[primary]' : item.color === 'purple' ? 'has-[secondary]' : item.color === 'orange' ? 'has-[error]' : 'has-[tertiary]';
      const tailColor = item.color === 'cyan' ? 'primary' : item.color === 'purple' ? 'secondary' : item.color === 'orange' ? 'error' : 'tertiary';
      return `
      <div class="flex items-start gap-4 text-left anim-fade-up" style="animation-delay: ${i * 0.08}s">
        <div class="mt-1.5 w-2 h-2 rounded-full bg-${tailColor} shadow-[0_0_8px_var(--tw-shadow-color)] shadow-${tailColor}/50 shrink-0"></div>
        <div class="flex-1">
          <p class="text-on-surface font-medium text-sm leading-tight">${item.text}</p>
          <p class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">${item.time}</p>
        </div>
      </div>
      `;
    }).join('');
  }

  // ============================================================
  // WEAK TOPICS
  // ============================================================
  async function loadWeakTopics() {
    if (!weakContainer) return;

    let topics = [];
    try {
      const result = await API.dashboard.getWeakTopics();
      if (result.success && result.data) topics = result.data;
    } catch (err) {
      console.error('Failed to load weak topics', err);
    }

    if (!topics.length) {
      weakContainer.innerHTML = '<div style="color:var(--neon-green);font-size:0.85rem;">No weak topics detected. Great job!</div>';
      return;
    }

    weakContainer.innerHTML = topics.map((t, i) => {
      const gColor = t.score < 60 ? 'error' : t.score < 75 ? 'secondary' : 'primary';
      return `
      <div class="flex flex-col gap-2 anim-fade-up text-left" style="animation-delay: ${i * 0.1}s">
        <div class="flex justify-between items-end">
          <span class="text-sm font-bold text-white">${t.topic}</span>
          <span class="text-xs font-bold text-${gColor}">${t.score}%</span>
        </div>
        <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div class="h-full bg-${gColor}" style="width: ${t.score}%;"></div>
        </div>
        <div class="flex justify-between items-center mt-1">
          <span class="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border border-${gColor}/20 bg-${gColor}/10 text-${gColor}">${t.difficulty}</span>
          <a href="quiz.html?topic=${encodeURIComponent(t.topic)}" class="text-[10px] font-bold uppercase text-primary hover:text-white transition-colors">Practice →</a>
        </div>
      </div>
      `;
    }).join('<div class="h-px bg-white/5 my-4"></div>');
  }

  // ============================================================
  // COURSES
  // ============================================================
  async function loadCourses() {
    if (!courseCards) return;

    let courses = [];
    try {
      const result = await API.courses.getAll();
      if (result.success && result.data) courses = result.data;
    } catch (err) {
      console.error('Failed to load courses', err);
    }

    if (!courses.length) {
      courseCards.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;grid-column:1/-1;">No courses available at the moment.</div>';
      return;
    }

    courseCards.innerHTML = courses.map((c, i) => {
      const dColor = c.difficulty === 'Hard' ? 'error' : c.difficulty === 'Medium' ? 'secondary' : 'primary';
      return `
      <div class="glass-panel p-6 rounded-lg ring-1 ring-white/5 hover:border-primary/50 transition-colors text-left flex flex-col anim-fade-up" style="animation-delay: ${i * 0.08}s;">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-${dColor}/10 flex items-center justify-center text-2xl">${c.icon}</div>
          <div>
            <h3 class="font-headline font-bold text-white mb-1 leading-tight">${c.title}</h3>
            <div class="flex gap-2 items-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${dColor}/10 text-${dColor} border border-${dColor}/20">${c.difficulty}</span>
              <span class="text-[10px] text-on-surface-variant font-bold uppercase">${c.topics} topics</span>
            </div>
          </div>
        </div>
        <div class="mt-auto">
          <div class="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant mb-2">
            <span>Progress</span><span>${c.progress}%</span>
          </div>
          <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
            <div class="h-full bg-primary" style="width:${c.progress}%;"></div>
          </div>
          <a href="course.html?id=${c.id}" class="block w-full text-center py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">Continue →</a>
        </div>
      </div>
    `}).join('');
  }

  // ---- INIT ----
  loadDashboard();

  // ---- REFRESH EVERY 60s ----
  setInterval(loadActivity, 60000);
});
