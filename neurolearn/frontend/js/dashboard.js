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
      <div class="card stat-card fade-in-up delay-${i + 1}">
        <span class="stat-icon">${item.icon}</span>
        <div class="stat-value" data-count="${typeof item.value === 'number' ? item.value : ''}">${item.value}</div>
        <div class="stat-label">${item.label}</div>
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
      <div class="chart-y-labels">
        ${[100,75,50,25,0].map(v => `<span>${v}</span>`).join('')}
      </div>
      <div class="chart-bars-wrap">
        ${data.map((val, i) => `
          <div class="chart-col">
            <div class="chart-bar"
                 style="height: ${(val / maxVal) * 100}%; animation-delay: ${i * 0.07}s;"
                 data-tooltip="${val}%">
            </div>
            <span class="chart-label">${days[i] || ''}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Extra: add chart grid lines
    const wrap = chartContainer.querySelector('.chart-bars-wrap');
    if (wrap) {
      wrap.style.cssText = `
        display: flex;
        align-items: flex-end;
        gap: 8px;
        height: 180px;
        flex: 1;
        padding: 0 0.5rem;
      `;
    }
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

    activityContainer.innerHTML = activity.map((item, i) => `
      <div class="activity-item fade-in-up" style="animation-delay: ${i * 0.08}s">
        <div class="activity-dot ${item.color}"></div>
        <span class="activity-text">${item.text}</span>
        <span class="activity-time">${item.time}</span>
      </div>
    `).join('');
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

    weakContainer.innerHTML = topics.map((t, i) => `
      <div class="weak-topic-item fade-in-up" style="animation-delay: ${i * 0.1}s">
        <div class="weak-topic-name">
          <span>${t.topic}</span>
          <span style="color: ${t.score < 60 ? '#ff4466' : t.score < 75 ? 'var(--neon-orange)' : 'var(--neon-green)'}">${t.score}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${t.score}%; background: linear-gradient(90deg, ${t.score < 60 ? '#ff4466' : t.score < 75 ? 'var(--neon-orange)' : 'var(--neon-cyan)'}, transparent);"></div>
        </div>
        <div style="display:flex; justify-content:space-between; margin-top:0.2rem;">
          <span class="badge badge-${t.difficulty === 'Hard' ? 'orange' : t.difficulty === 'Medium' ? 'purple' : 'cyan'}">${t.difficulty}</span>
          <a href="quiz.html?topic=${encodeURIComponent(t.topic)}" class="btn btn-sm btn-outline">Practice →</a>
        </div>
      </div>
    `).join('');
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

    courseCards.innerHTML = courses.map((c, i) => `
      <div class="card course-card fade-in-up" style="animation-delay: ${i * 0.08}s; padding: 1.5rem;">
        <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1rem;">
          <div class="course-icon" style="font-size:2rem;">${c.icon}</div>
          <div>
            <div style="font-family:var(--font-display);font-size:0.85rem;font-weight:600;margin-bottom:0.25rem;">${c.title}</div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              <span class="badge badge-${c.difficulty === 'Hard' ? 'orange' : c.difficulty === 'Medium' ? 'purple' : 'cyan'}">${c.difficulty}</span>
              <span style="font-size:0.72rem;color:var(--text-muted)">${c.topics} topics</span>
            </div>
          </div>
        </div>
        <div class="progress-bar" style="margin-bottom:0.5rem;">
          <div class="progress-fill" style="width:${c.progress}%;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <span style="font-size:0.75rem;color:var(--text-muted)">${c.progress}% complete</span>
          <a href="course.html?id=${c.id}" class="btn btn-sm btn-outline">Continue →</a>
        </div>
      </div>
    `).join('');
  }

  // ---- INIT ----
  loadDashboard();

  // ---- REFRESH EVERY 60s ----
  setInterval(loadActivity, 60000);
});
