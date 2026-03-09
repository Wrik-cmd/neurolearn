// ============================================================
// auth.js — NeuroLearn Platform
// Handles login, signup, validation, and auth state
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- DETERMINE CURRENT PAGE ----
  const isLoginPage  = document.getElementById('login-form')  !== null;
  const isSignupPage = document.getElementById('signup-form') !== null;

  // ---- REDIRECT IF ALREADY LOGGED IN ----
  if ((isLoginPage || isSignupPage) && API.auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  // ---- INPUT ANIMATION: Focus Effects ----
  document.querySelectorAll('.form-group input').forEach(input => {
    input.addEventListener('focus', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      const group = input.closest('.form-group');
      if (group) group.classList.remove('focused');
    });
  });

  // ============================================================
  // LOGIN PAGE
  // ============================================================
  if (isLoginPage) {
    const form    = document.getElementById('login-form');
    const emailEl = document.getElementById('login-email');
    const passEl  = document.getElementById('login-password');
    const btn     = document.getElementById('login-btn');
    const errEl   = document.getElementById('login-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email    = emailEl.value.trim();
      const password = passEl.value;

      // Validation
      if (!validateEmail(email)) {
        showError(errEl, 'Please enter a valid email address.');
        shakeInput(emailEl);
        return;
      }
      if (password.length < 6) {
        showError(errEl, 'Password must be at least 6 characters.');
        shakeInput(passEl);
        return;
      }

      clearError(errEl);
      setLoading(btn, true, 'AUTHENTICATING...');

      try {
        const result = await API.auth.login(email, password);

        if (result.success) {
          showSuccess(btn, 'ACCESS GRANTED');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        } else {
          showError(errEl, result.message || 'Login failed. Please check your credentials.');
          setLoading(btn, false, 'LOGIN');
          shakeInput(emailEl);
          shakeInput(passEl);
        }
      } catch (err) {
        showError(errEl, 'Server error. Please try again later.');
        setLoading(btn, false, 'LOGIN');
      }
    });
  }

  // ============================================================
  // SIGNUP PAGE
  // ============================================================
  if (isSignupPage) {
    const form      = document.getElementById('signup-form');
    const nameEl    = document.getElementById('signup-name');
    const emailEl   = document.getElementById('signup-email');
    const passEl    = document.getElementById('signup-password');
    const confirmEl = document.getElementById('signup-confirm');
    const btn       = document.getElementById('signup-btn');
    const errEl     = document.getElementById('signup-error');
    const strengthEl= document.getElementById('password-strength');

    // Live password strength
    if (passEl && strengthEl) {
      passEl.addEventListener('input', () => {
        const strength = getPasswordStrength(passEl.value);
        renderStrength(strengthEl, strength);
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name     = nameEl?.value.trim();
      const email    = emailEl.value.trim();
      const password = passEl.value;
      const confirm  = confirmEl?.value;

      if (!name || name.length < 2) {
        showError(errEl, 'Please enter your full name.');
        shakeInput(nameEl); return;
      }
      if (!validateEmail(email)) {
        showError(errEl, 'Please enter a valid email address.');
        shakeInput(emailEl); return;
      }
      if (password.length < 8) {
        showError(errEl, 'Password must be at least 8 characters.');
        shakeInput(passEl); return;
      }
      if (password !== confirm) {
        showError(errEl, 'Passwords do not match.');
        shakeInput(confirmEl); return;
      }

      clearError(errEl);
      setLoading(btn, true, 'CREATING ACCOUNT...');

      try {
        const result = await API.auth.signup(name, email, password);
        if (result.success) {
          showSuccess(btn, 'WELCOME ABOARD!');
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        } else {
          showError(errEl, result.message || 'Signup failed. User may already exist.');
          setLoading(btn, false, 'CREATE ACCOUNT');
          shakeInput(emailEl);
        }
      } catch (err) {
        showError(errEl, 'Server error. Please try again later.');
        setLoading(btn, false, 'CREATE ACCOUNT');
      }
    });
  }

  // ---- HELPERS ----
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeInput(el) {
    if (!el) return;
    el.classList.add('input-shake');
    el.addEventListener('animationend', () => el.classList.remove('input-shake'), { once: true });
  }

  function showError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.style.animation = 'none';
    requestAnimationFrame(() => { el.style.animation = 'fadeInUp 0.3s ease'; });
  }

  function clearError(el) {
    if (!el) return;
    el.textContent = '';
    el.style.display = 'none';
  }

  function setLoading(btn, loading, text) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.original = btn.textContent;
      btn.innerHTML = `<span class="spinner-inline"></span> ${text}`;
    } else {
      btn.textContent = btn.dataset.original || text;
    }
  }

  function showSuccess(btn, text) {
    if (!btn) return;
    btn.disabled = true;
    btn.style.background = 'linear-gradient(135deg, var(--neon-green), rgba(50,200,10,0.8))';
    btn.innerHTML = `✓ ${text}`;
  }

  function getPasswordStrength(pass) {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.length >= 12) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  }

  function renderStrength(el, score) {
    const levels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const colors = ['', '#ff4466', '#ff6b35', '#ffd700', 'var(--neon-cyan)', 'var(--neon-green)'];
    el.textContent = levels[score] || '';
    el.style.color  = colors[score] || '';
  }

  // ---- TOGGLE PASSWORD VISIBILITY ----
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isPass = target.type === 'password';
      target.type = isPass ? 'text' : 'password';
      btn.textContent = isPass ? '🙈' : '👁️';
    });
  });

  // ---- DYNAMIC NAV CTA FOR LOGGED IN USERS ----
  if (API.auth.isLoggedIn()) {
    const navCta = document.querySelector('.nav-cta');
    if (navCta && navCta.querySelector('a[href="login.html"]')) {
      navCta.innerHTML = '<a href="#" data-action="logout" class="btn btn-outline btn-sm">Logout</a>';
    }
  }

  // ---- LOGOUT ----
  document.querySelectorAll('[data-action="logout"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      API.auth.logout();
    });
  });

  // ---- PROTECT PAGES (guard) ----
  const publicPages = ['index.html', 'login.html', 'signup.html', ''];
  const currentPage = window.location.pathname.split('/').pop();

  if (!publicPages.includes(currentPage) && !API.auth.isLoggedIn()) {
    window.location.href = 'login.html';
  }

  // ---- POPULATE USER INFO ----
  const user = API.auth.getUser();
  if (user) {
    document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = user.name || ''; });
    document.querySelectorAll('[data-user-email]').forEach(el => { el.textContent = user.email || ''; });
    document.querySelectorAll('[data-user-avatar]').forEach(el => { el.textContent = user.avatar || '??'; });
    document.querySelectorAll('[data-user-xp]').forEach(el => { el.textContent = user.xp || 0; });
    document.querySelectorAll('[data-user-level]').forEach(el => { el.textContent = user.level || 1; });
  }
});
