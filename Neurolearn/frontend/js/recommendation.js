// ============================================================
// recommendation.js — NeuroLearn Platform
// Fetch and display AI recommendations
// ============================================================

document.addEventListener('DOMContentLoaded', async () => {
  const recGrid = document.getElementById('rec-grid');
  const recLoading = document.getElementById('rec-loading');
  if (!recGrid) return;

  // ============================================================
  // LOAD RECOMMENDATIONS
  // ============================================================
  async function loadRecommendations() {
    showLoading(true);

    let recs = API.mock.recommendations;
    try {
      const result = await API.recommendations.get();
      if (result.success) recs = result.data;
    } catch {}

    setTimeout(() => {
      showLoading(false);
      renderRecommendations(recs);
    }, 600); // slight delay for UX
  }

  // ============================================================
  // RENDER
  // ============================================================
  function renderRecommendations(recs) {
    if (!recs || recs.length === 0) {
      recGrid.innerHTML = `
        <div style="text-align:center;padding:3rem;grid-column:1/-1;">
          <div style="font-size:3rem;margin-bottom:1rem;">🎉</div>
          <div style="font-family:var(--font-display);font-size:1.1rem;color:var(--neon-cyan);">All caught up!</div>
          <div style="color:var(--text-muted);margin-top:0.5rem;">No new recommendations right now. Check back later.</div>
        </div>
      `;
      return;
    }

    recGrid.innerHTML = recs.map((rec, i) => `
      <div class="card rec-card fade-in-up" style="padding:1.75rem;animation-delay:${i*0.1}s;" data-id="${rec.id}">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:1rem;">
          <div class="rec-icon" style="font-size:2.5rem;animation:float 3s ease-in-out infinite;animation-delay:${i*0.5}s;">${rec.icon}</div>
          <span class="badge badge-${rec.difficulty === 'Hard' ? 'orange' : rec.difficulty === 'Medium' ? 'purple' : 'cyan'}">${rec.difficulty}</span>
        </div>
        <h3 style="font-family:var(--font-display);font-size:1rem;font-weight:600;margin-bottom:0.4rem;color:var(--text-primary);">
          Recommended Topic: <span style="color:var(--neon-cyan)">${rec.topic}</span>
        </h3>
        <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem;font-style:italic;">${rec.reason}</p>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;">
          <span style="font-size:0.75rem;color:var(--text-muted);">Difficulty Level:</span>
          <span style="font-family:var(--font-display);font-size:0.72rem;color:${rec.difficulty === 'Hard' ? 'var(--neon-orange)' : rec.difficulty === 'Medium' ? 'var(--neon-purple)' : 'var(--neon-green)'};">${rec.difficulty}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1.25rem;">
          <span style="color:var(--neon-green);font-size:0.8rem;">+${rec.xp} XP</span>
          <div class="notif-dot"></div>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <a href="quiz.html?topic=${encodeURIComponent(rec.topic)}" class="btn btn-primary btn-sm" style="flex:1;justify-content:center;">Start Quiz</a>
          <button class="btn btn-outline btn-sm dismiss-btn" data-id="${rec.id}" title="Dismiss">✕</button>
        </div>
      </div>
    `).join('');

    // Dismiss handlers
    recGrid.querySelectorAll('.dismiss-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = btn.dataset.id;
        const card = recGrid.querySelector(`[data-id="${id}"]`);
        if (card) {
          card.style.animation = 'dismissCard 0.4s ease forwards';
          setTimeout(() => card.remove(), 400);
        }
        try { await API.recommendations.dismiss(id); } catch {}
      });
    });
  }

  function showLoading(loading) {
    if (recLoading) recLoading.style.display = loading ? 'flex' : 'none';
    if (recGrid)    recGrid.style.display    = loading ? 'none' : 'grid';
  }

  loadRecommendations();
});

// Add dismiss animation
const style = document.createElement('style');
style.textContent = `
@keyframes dismissCard {
  to { opacity: 0; transform: scale(0.85) translateY(-10px); }
}
.rec-card {
  transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), border-color 0.3s, box-shadow 0.3s;
}
.rec-card:hover {
  border-color: rgba(180,79,255,0.5);
  box-shadow: 0 0 30px rgba(180,79,255,0.15);
}
#rec-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
`;
document.head.appendChild(style);
