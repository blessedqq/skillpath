/* ======================================
   SkillPath вЂ” Main JavaScript
   ====================================== */

(function () {
  'use strict';

  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  // HELPERS
  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  function escHtml(str) {
    return String(str || '').replace(/[&<>"']/g,
      m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function showToast(msg, type = 'success') {
    const t = document.createElement('div');
    t.className = `sp-toast sp-toast--${type}`;
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  const catColor = { dev:'#2563eb', data:'#7c3aed', design:'#db2777', soft:'#059669' };
  const catLabel = { dev:'Р Р°Р·СЂР°Р±РѕС‚РєР°', data:'Data & AI', design:'Р”РёР·Р°Р№РЅ', soft:'Soft Skills' };
  const lvlLabel = { beginner:'РќР°С‡РёРЅР°СЋС‰РёР№', intermediate:'РЎСЂРµРґРЅРёР№', advanced:'РџСЂРѕРґРІРёРЅСѓС‚С‹Р№' };

  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  // AUTH MODAL
  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  const authModal     = document.getElementById('authModal');
  const authOverlay   = document.getElementById('authOverlay');
  const authClose     = document.getElementById('authClose');
  const tabLogin      = document.getElementById('tabLogin');
  const tabRegister   = document.getElementById('tabRegister');
  const loginForm     = document.getElementById('loginForm');
  const registerForm  = document.getElementById('registerForm');
  const loginError    = document.getElementById('loginError');
  const registerError = document.getElementById('registerError');
  const loginSubmit   = document.getElementById('loginSubmit');
  const registerSubmit = document.getElementById('registerSubmit');
  const navActions    = document.getElementById('navActions');

  function openAuth(tab = 'login') {
    authModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchTab(tab);
    setTimeout(() => {
      (tab === 'login'
        ? document.getElementById('loginEmail')
        : document.getElementById('regName')
      )?.focus();
    }, 80);
  }

  function closeAuth() {
    authModal.classList.remove('open');
    document.body.style.overflow = '';
    loginError.textContent = '';
    registerError.textContent = '';
  }

  function switchTab(tab) {
    const isLogin = tab === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabRegister.classList.toggle('active', !isLogin);
    loginForm.classList.toggle('auth-form--hidden', !isLogin);
    registerForm.classList.toggle('auth-form--hidden', isLogin);
  }

  authOverlay?.addEventListener('click', closeAuth);
  authClose?.addEventListener('click', closeAuth);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeAuth(); closeCpm(); }
  });

  [tabLogin, tabRegister].forEach(btn =>
    btn?.addEventListener('click', () => switchTab(btn.dataset.tab))
  );
  document.querySelectorAll('.auth-switch__link').forEach(a =>
    a.addEventListener('click', e => { e.preventDefault(); switchTab(a.dataset.tab); })
  );

  if (new URLSearchParams(location.search).get('auth') === 'required') {
    history.replaceState({}, '', location.pathname);
    setTimeout(() => openAuth('login'), 400);
  }

  // в”Ђв”Ђ Nav based on auth state в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  function refreshNavAuth() {
    if (!Api || !navActions) return;
    if (Api.isLoggedIn()) {
      const user = Api.getUser();
      navActions.innerHTML = `
        <a href="dashboard.html" class="nav-user-pill" title="Р›РёС‡РЅС‹Р№ РєР°Р±РёРЅРµС‚">
          <div class="nav-user-avatar">${(user?.name || '?')[0].toUpperCase()}</div>
          <span class="nav-user-name">${escHtml(user?.name || 'РљР°Р±РёРЅРµС‚')}</span>
        </a>
        <button class="btn btn--ghost btn--sm" id="mainLogoutBtn" style="color:rgba(255,255,255,.6)">Р’С‹Р№С‚Рё</button>
      `;
      document.getElementById('mainLogoutBtn')?.addEventListener('click', async () => {
        try { await Api.logout(); } catch {}
        Api.clearSession();
        refreshNavAuth();
        showToast('Р’С‹ РІС‹С€Р»Рё РёР· Р°РєРєР°СѓРЅС‚Р°', 'success');
      });
    } else {
      navActions.innerHTML = `
        <button class="btn btn--ghost" id="navLoginBtn">Р’РѕР№С‚Рё</button>
        <button class="btn btn--primary" id="navRegisterBtn">РќР°С‡Р°С‚СЊ Р±РµСЃРїР»Р°С‚РЅРѕ</button>
      `;
      document.getElementById('navLoginBtn')?.addEventListener('click', () => openAuth('login'));
      document.getElementById('navRegisterBtn')?.addEventListener('click', () => openAuth('register'));
    }
  }

  // в”Ђв”Ђ Auth forms в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    loginError.textContent = '';
    loginSubmit.disabled = true;
    loginSubmit.textContent = 'Р’С…РѕРґРёРј...';
    try {
      const { token, user } = await Api.login(
        document.getElementById('loginEmail').value,
        document.getElementById('loginPassword').value
      );
      Api.saveSession(token, user);
      closeAuth();
      refreshNavAuth();
      showToast(`Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ, ${user.name}! рџ‘‹`, 'success');
    } catch (err) {
      loginError.textContent = err.message || 'РћС€РёР±РєР° РІС…РѕРґР°';
    } finally {
      loginSubmit.disabled = false;
      loginSubmit.textContent = 'Р’РѕР№С‚Рё';
    }
  });

  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    registerError.textContent = '';
    registerSubmit.disabled = true;
    registerSubmit.textContent = 'РЎРѕР·РґР°С‘Рј Р°РєРєР°СѓРЅС‚...';
    try {
      const { token, user } = await Api.register(
        document.getElementById('regName').value,
        document.getElementById('regEmail').value,
        document.getElementById('regPassword').value
      );
      Api.saveSession(token, user);
      closeAuth();
      refreshNavAuth();
      showToast(`РђРєРєР°СѓРЅС‚ СЃРѕР·РґР°РЅ! Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ, ${user.name} рџљЂ`, 'success');
    } catch (err) {
      registerError.textContent = err.message || 'РћС€РёР±РєР° СЂРµРіРёСЃС‚СЂР°С†РёРё';
    } finally {
      registerSubmit.disabled = false;
      registerSubmit.textContent = 'РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚';
    }
  });

  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  // COURSES вЂ” Р·Р°РіСЂСѓР·РєР° РёР· API Рё СЂРµРЅРґРµСЂ
  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  const coursesGrid   = document.getElementById('coursesGrid');
  const coursesFilter = document.getElementById('coursesFilter');
  let allCourses = [];
  let activeFilter = 'all';

  async function loadCourses() {
    try {
      const data = await Api.getCourses();
      allCourses = data.courses || (Array.isArray(data) ? data : []);
      renderCourses();
    } catch {
      if (coursesGrid) {
        coursesGrid.innerHTML = '<p style="color:var(--grey-500);padding:40px;text-align:center">РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєСѓСЂСЃС‹</p>';
      }
    }
  }

  function renderCourses(filter) {
    if (!coursesGrid) return;
    const f = filter !== undefined ? filter : activeFilter;
    activeFilter = f;
    const list = f === 'all' ? allCourses : allCourses.filter(c => c.category === f);
    coursesGrid.innerHTML = '';
    list.forEach((c, i) => {
      const col  = catColor[c.category] || '#2563eb';
      const card = document.createElement('div');
      card.className = 'course-card animate-on-scroll';
      card.dataset.cat = c.category || '';
      card.dataset.slug = c.slug || '';
      card.innerHTML = `
        <div class="course-card__video-wrap" style="cursor:pointer">
          ${c.previewUrl
            ? `<img class="course-card__thumb" src="${escHtml(c.previewUrl)}" alt="${escHtml(c.title)}" loading="lazy"
                    onerror="this.style.display='none'">`
            : ''}
          <div class="course-card__video-placeholder">
            <div class="course-card__play-btn" aria-label="РџСЂРѕСЃРјРѕС‚СЂРµС‚СЊ РєСѓСЂСЃ"></div>
            <span class="course-card__video-label">${escHtml(c.channel || 'YouTube')}</span>
          </div>
        </div>
        <div class="course-card__body">
          <div class="course-card__tags">
            ${c.tags && c.tags.length
              ? c.tags.slice(0,2).map(t =>
                  `<span class="tag" style="background:${col}22;color:${col}">${escHtml(t)}</span>`
                ).join('')
              : `<span class="tag" style="background:${col}22;color:${col}">${catLabel[c.category]||''}</span>`
            }
            ${c.level ? `<span class="tag tag--grey">${lvlLabel[c.level]||c.level}</span>` : ''}
          </div>
          <h3 class="course-card__title">${escHtml(c.title)}</h3>
          <p class="course-card__desc">${escHtml(c.description || '')}</p>
          <div class="course-card__footer">
            <div class="course-card__info">
              <span>${c.lessonsCount > 1 ? c.lessonsCount + ' СѓСЂРѕРєРѕРІ' : 'РџРѕР»РЅС‹Р№ РєСѓСЂСЃ'}</span>
              <span>В·</span>
              <span>${c.duration || ''}</span>
            </div>
            <button class="btn btn--primary btn--sm" data-slug="${escHtml(c.slug)}">Р—Р°РїРёСЃР°С‚СЊСЃСЏ</button>
          </div>
        </div>`;

      // РљР»РёРє РїРѕ РїСЂРµРІСЊСЋ в†’ РѕС‚РєСЂС‹С‚СЊ РјРѕРґР°Р»
      card.querySelector('.course-card__video-wrap').addEventListener('click', () => openCpm(c));

      // РљР»РёРє В«Р—Р°РїРёСЃР°С‚СЊСЃСЏВ»
      card.querySelector('button[data-slug]').addEventListener('click', e => {
        e.stopPropagation();
        handleEnroll(c.slug, e.currentTarget);
      });

      coursesGrid.appendChild(card);

      // Р°РЅРёРјР°С†РёСЏ РїРѕРѕС‡РµСЂС‘РґРЅРѕ
      requestAnimationFrame(() => {
        setTimeout(() => card.classList.add('visible'), i * 60);
      });
    });
  }

  // Courses filter buttons
  coursesFilter?.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    coursesFilter.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCourses(btn.dataset.filter);
  });

  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  // COURSE PREVIEW MODAL (cpm)
  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  const cpm        = document.getElementById('cpm');
  const cpmOverlay = document.getElementById('cpmOverlay');
  const cpmClose   = document.getElementById('cpmClose');
  const cpmPlayer  = document.getElementById('cpmPlayer');
  const cpmTitle   = document.getElementById('cpmTitle');
  const cpmChannel = document.getElementById('cpmChannel');
  const cpmDesc    = document.getElementById('cpmDesc');
  const cpmChips   = document.getElementById('cpmChips');
  const cpmMeta    = document.getElementById('cpmMeta');
  const cpmEnroll  = document.getElementById('cpmEnroll');
  const cpmYtLink  = document.getElementById('cpmYtLink');

  let cpmCurrentSlug = null;

  function openCpm(course) {
    cpmCurrentSlug = course.slug;

    // Р—Р°РїРѕР»РЅСЏРµРј РїРѕР»СЏ
    if (cpmTitle)   cpmTitle.textContent   = course.title || '';
    if (cpmChannel) cpmChannel.textContent = course.channel || 'YouTube';
    if (cpmDesc)    cpmDesc.textContent    = course.description || '';

    // Р§РёРїСЃС‹-С‚РµРіРё
    if (cpmChips) {
      cpmChips.innerHTML = '';
      (course.tags || []).forEach(t => {
        const sp = document.createElement('span');
        sp.className = 'tag'; sp.textContent = t;
        cpmChips.appendChild(sp);
      });
      if (course.level) {
        const sp = document.createElement('span');
        sp.className = 'tag tag--grey'; sp.textContent = lvlLabel[course.level] || course.level;
        cpmChips.appendChild(sp);
      }
    }

    // РњРµС‚Р°
    if (cpmMeta) {
      const parts = [];
      if (course.lessonsCount > 1) parts.push(`${course.lessonsCount} СѓСЂРѕРєРѕРІ`);
      else parts.push('РџРѕР»РЅС‹Р№ РєСѓСЂСЃ (1 РІРёРґРµРѕ)');
      if (course.duration) parts.push(course.duration);
      if (course.projectsCount) parts.push(`${course.projectsCount} РїСЂРѕРµРєС‚${course.projectsCount > 1 ? 'Р°' : ''}`);
      cpmMeta.textContent = parts.join(' В· ');
    }

    // YouTube СЃСЃС‹Р»РєР°
    if (cpmYtLink && course.videoUrl) {
      // videoUrl СЌС‚Рѕ embed URL, РїСЂРµРѕР±СЂР°Р·СѓРµРј РІ watch/playlist
      let ytUrl = course.videoUrl
        .replace('https://www.youtube.com/embed/videoseries?', 'https://www.youtube.com/playlist?')
        .replace('https://www.youtube.com/embed/', 'https://www.youtube.com/watch?v=');
      cpmYtLink.href = ytUrl;
      cpmYtLink.style.display = '';
    } else if (cpmYtLink) {
      cpmYtLink.style.display = 'none';
    }

    // Player вЂ” РІСЃС‚СЂР°РёРІР°РµРј РїР»РµР№Р»РёСЃС‚/РІРёРґРµРѕ С‡РµСЂРµР· iframe
    if (cpmPlayer) {
      if (course.videoUrl) {
        const sep = course.videoUrl.includes('?') ? '&' : '?';
        cpmPlayer.innerHTML = `<iframe
          src="${escHtml(course.videoUrl)}${sep}rel=0&modestbranding=1"
          allow="fullscreen; encrypted-media"
          allowfullscreen></iframe>`;
      } else if (course.previewUrl) {
        cpmPlayer.innerHTML = `<img src="${escHtml(course.previewUrl)}" style="width:100%;height:100%;object-fit:cover" alt="">`;
      } else {
        cpmPlayer.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,.3);font-size:3rem">рџЋ¬</div>`;
      }
    }

    // РљРЅРѕРїРєР° Р·Р°РїРёСЃРё
    if (cpmEnroll) {
      cpmEnroll.textContent = 'Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РєСѓСЂСЃ';
      cpmEnroll.disabled    = false;
      cpmEnroll.onclick     = () => handleEnroll(course.slug, cpmEnroll);
    }

    cpm.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCpm() {
    if (!cpm) return;
    cpm.classList.remove('open');
    document.body.style.overflow = '';
    if (cpmPlayer) cpmPlayer.innerHTML = ''; // РѕСЃС‚Р°РЅР°РІР»РёРІР°РµРј РІРёРґРµРѕ
    cpmCurrentSlug = null;
  }

  cpmClose?.addEventListener('click', closeCpm);
  cpmOverlay?.addEventListener('click', closeCpm);

  // в”Ђв”Ђ Р—Р°РїРёСЃСЊ РЅР° РєСѓСЂСЃ в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  async function handleEnroll(slug, btn) {
    if (!Api.isLoggedIn()) {
      closeCpm();
      openAuth('register');
      return;
    }
    btn.disabled = true;
    btn.textContent = '...';
    try {
      await Api.enroll(slug);
      showToast('Р’С‹ Р·Р°РїРёСЃР°РЅС‹! РћС‚РєСЂС‹РІР°РµРј Р»РёС‡РЅС‹Р№ РєР°Р±РёРЅРµС‚...', 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    } catch (err) {
      showToast(err.data?.message || 'РћС€РёР±РєР° Р·Р°РїРёСЃРё', 'error');
      btn.disabled = false;
      btn.textContent = 'Р—Р°РїРёСЃР°С‚СЊСЃСЏ РЅР° РєСѓСЂСЃ';
    }
  }

  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  // About вЂ” РєР»РёРєР°Р±РµР»СЊРЅС‹Рµ Р°Р№С‚РµРјС‹
  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  document.querySelectorAll('.about__item--link').forEach(item => {
    const handler = () => {
      const scrollTarget = item.dataset.scroll;
      const authTarget   = item.dataset.openAuth;
      if (scrollTarget) {
        document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth' });
      } else if (authTarget) {
        Api.isLoggedIn()
          ? (window.location.href = 'dashboard.html')
          : openAuth(authTarget);
      }
    };
    item.addEventListener('click', handler);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  // в”Ђв”Ђ Hero CTA buttons в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  const heroCta = document.querySelector('.hero__cta');
  if (heroCta) {
    heroCta.querySelector('.btn--primary')?.addEventListener('click', () =>
      document.getElementById('professions')?.scrollIntoView({ behavior: 'smooth' })
    );
    heroCta.querySelector('.btn--outline')?.addEventListener('click', () =>
      document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })
    );
  }

  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  // NAV / scroll / mobile
  // в•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђв•ђ
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger?.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu?.querySelectorAll('.mobile-menu__link').forEach(l =>
    l.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );

  // в”Ђв”Ђ Profession Tabs в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  document.querySelectorAll('.prof-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.prof-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.prof-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${tab.dataset.target}`);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.prof-card').forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            card.style.transition = 'opacity .3s ease, transform .3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        });
      }
    });
  });

  // в”Ђв”Ђ Hero snap on wheel в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  const heroEl = document.querySelector('.hero');
  const snapSections = Array.from(document.querySelectorAll('.hero, .professions, .courses, .about'));
  let snapLocked = false;

  function nudgeToSection(dir) {
    if (snapLocked) return;
    const current = snapSections.find(s => {
      const r = s.getBoundingClientRect();
      return r.top <= 80 && r.bottom > 80;
    });
    if (!current) return;
    const target = snapSections[snapSections.indexOf(current) + dir];
    if (!target) return;
    snapLocked = true;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => { snapLocked = false; }, 900);
  }

  let heroWheelTimer = null;
  window.addEventListener('wheel', e => {
    const heroRect = heroEl?.getBoundingClientRect();
    if (heroRect && heroRect.top <= 0 && heroRect.bottom > window.innerHeight * 0.5) {
      if (e.deltaY > 0) {
        e.preventDefault();
        clearTimeout(heroWheelTimer);
        heroWheelTimer = setTimeout(() => nudgeToSection(1), 60);
      }
    }
  }, { passive: false });

  // в”Ђв”Ђ Prof card CTA в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  document.querySelectorAll('.prof-card__btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.currentTarget.closest('.prof-card');
      if (Api.isLoggedIn()) {
        window.location.href = 'dashboard.html';
      } else {
        openAuth('register');
      }
    });
  });

  // в”Ђв”Ђ Init в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
  refreshNavAuth();
  loadCourses();

})();

/* в”Ђв”Ђ РђРЅРёРјР°С†РёРё (РґРѕР±Р°РІР»СЏСЋС‚СЃСЏ С‡РµСЂРµР· JS) в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ */
const _style = document.createElement('style');
_style.textContent = `
  .animate-on-scroll { opacity:0; transform:translateY(24px); transition:opacity .5s ease, transform .5s ease; }
  .animate-on-scroll.visible { opacity:1; transform:none; }
  @keyframes fadeInUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
`;
document.head.appendChild(_style);
