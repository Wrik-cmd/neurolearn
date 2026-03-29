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

    let recs = [];
    try {
      const result = await API.recommendations.get();
      if (result.success && result.data) recs = result.data;
    } catch (err) {
      console.error('Failed to load recommendations', err);
    }

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

    recGrid.innerHTML = recs.map((rec, i) => {
      const gColor = rec.difficulty === 'Hard' ? 'error' : rec.difficulty === 'Medium' ? 'secondary' : 'primary';
      const gHex = rec.difficulty === 'Hard' ? '#ffb4ab' : rec.difficulty === 'Medium' ? '#d1bcff' : '#3cd7ff';
      const iconStr = rec.icon === '🔄' ? 'sync' : rec.icon === '💾' ? 'save' : rec.icon === '🌲' ? 'account_tree' : 'data_object';
      
      return `
      <div class="card p-6 flex flex-col items-start gap-4 hover:border-[${gHex}]/50 transition-all cursor-pointer group rec-card anim-fade-up" data-id="${rec.id}" style="animation-delay:${i*0.1}s;">
        <div class="w-12 h-12 rounded-xl bg-${gColor}/10 flex items-center justify-center text-${gColor} group-hover:scale-110 transition-transform">
          <span class="material-symbols-outlined">${iconStr}</span>
        </div>
        <div class="w-full">
          <h3 class="font-headline text-lg font-bold text-white mb-1">${rec.topic}</h3>
          <p class="text-sm text-slate-400 mb-4 line-clamp-2">${rec.reason}</p>
          <div class="flex items-center gap-2 mb-4">
            <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${gColor}/10 text-${gColor} border border-${gColor}/20">${rec.difficulty}</span>
            <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">+${rec.xp} XP</span>
          </div>
          <div class="flex gap-2 w-full mt-2">
            <a href="quiz.html?topic=${encodeURIComponent(rec.topic)}" class="flex-1 py-2 rounded-lg bg-surface-bright text-slate-300 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all text-center">Start Quiz</a>
            <button class="flex-1 py-2 rounded-lg bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest hover:bg-error hover:text-[#0f141b] transition-all text-center dismiss-btn" data-id="${rec.id}">Dismiss</button>
          </div>
        </div>
      </div>
    `}).join('');

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
