/* ======================================
   SkillPath — dashboard.js v3
   ====================================== */
(async () => {

  // ── Auth guard ────────────────────────────────────
  if (!window.Api || !Api.isLoggedIn()) {
    location.href = 'index.html?auth=required';
    return;
  }

  // ── DOM refs ───────────────────────────────────────
  const $  = id => document.getElementById(id);
  const qs = sel => document.querySelector(sel);

  const navLinks      = document.querySelectorAll('.dash-nav-link, .dash-sidebar__link');
  const sections      = document.querySelectorAll('.dash-section');

  const enrolledGrid  = $('enrolledGrid');
  const catalogGrid   = $('catalogGrid');
  const catalogFilter = $('catalogFilter');
  const profileForm   = $('profileForm');
  const profileMsg    = $('profileMsg');
  const profileName   = $('profileName');
  const profileEmail  = $('profileEmail');
  const profileAvatar = $('profileAvatar');
  const logoutBtn     = $('logoutBtn');

  const sidebarName   = $('sideName');
  const sidebarAvatar = $('sideAvatar');
  const navUserName   = $('navName');
  const navUserAvatar = $('navAvatar');

  const statCourses   = $('statCourses');
  const statAvgProg   = $('statAvgProgress');
  const enrolledBadge = $('enrolledBadge');

  const goCatalogBtn  = $('goCatalogBtn');
  const goCatalogBtn2 = $('goCatalogBtn2');

  // video modal
  const vmodal        = $('vmodal');
  const vmodalOverlay = $('vmodalOverlay');
  const vmodalClose   = $('vmodalClose');
  const vmodalPlayer  = $('vmodalPlayer');
  const vmodalTitle   = $('vmodalTitle');
  const vmodalChannel = $('vmodalChannel');
  const vmodalDesc    = $('vmodalDesc');
  const vmodalChips   = $('vmodalChips');
  const vmodalProgBlock = $('vmodalProgressBlock');
  const vmodalFill    = $('vmodalFill');
  const vmodalPct     = $('vmodalPct');
  const vmodalRange   = $('vmodalRange');
  const vmodalSave    = $('vmodalSave');

  let currentSlug = null;
  let catalog     = [];
  let enrolled    = [];   // [{slug, title, progress, previewUrl, channel, category, level, ...}]

  // ── Helpers ─────────────────────────────────────────
  const escHtml = s => String(s||'').replace(/[&<>"']/g,
    m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function toast(msg, type='') {
    const el = document.createElement('div');
    el.className = 'sp-toast' + (type ? ' sp-toast--'+type : '');
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  const initials = name => {
    const p = (name||'?').trim().split(/\s+/);
    return (p[0][0] + (p[1]?p[1][0]:'')).toUpperCase();
  };

  const catColor = { dev:'#2563eb', data:'#7c3aed', design:'#db2777', soft:'#059669' };
  const catLabel = { dev:'Разработка', data:'Data & AI', design:'Дизайн', soft:'Soft Skills' };
  const lvlLabel = { beginner:'Начинающий', intermediate:'Средний', advanced:'Продвинутый' };

  // ── Sections ─────────────────────────────────────────
  function showSection(id) {
    sections.forEach(s => s.style.display = 'none');
    navLinks.forEach(l => l.classList.remove('active'));
    const sec = document.getElementById('section-' + id);
    if (sec) sec.style.display = '';
    navLinks.forEach(l => { if (l.dataset.section === id) l.classList.add('active'); });
  }

  navLinks.forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    if (l.dataset.section) showSection(l.dataset.section);
  }));

  const goC = el => el && el.addEventListener('click', () => showSection('catalog'));
  goC(goCatalogBtn); goC(goCatalogBtn2);

  showSection('my-courses');

  // ── Stats ─────────────────────────────────────────────
  function updateStats() {
    const avg = enrolled.length
      ? Math.round(enrolled.reduce((s,e)=>s+(e.progress||0),0)/enrolled.length)
      : 0;
    if (statCourses)   statCourses.textContent   = enrolled.length;
    if (statAvgProg)   statAvgProg.textContent   = avg + '%';
    if (enrolledBadge) enrolledBadge.textContent = enrolled.length;
  }

  // ── Load user ─────────────────────────────────────────
  async function loadUser() {
    try {
      const data = await Api.getProfile();
      const u = data.user || data;
      enrolled = u.enrolledCourses || [];
      const ini = initials(u.name);
      if (sidebarAvatar)  sidebarAvatar.textContent  = ini;
      if (sidebarName)    sidebarName.textContent     = u.name || 'Пользователь';
      if (navUserAvatar)  navUserAvatar.textContent   = ini;
      if (navUserName)    navUserName.textContent     = u.name || '';
      if (profileAvatar)  profileAvatar.textContent   = ini;
      if (profileName)    profileName.value           = u.name || '';
      if (profileEmail)   profileEmail.value          = u.email || '';
      updateStats();
      renderEnrolled();
    } catch(err) {
      console.error(err);
      if (err.status === 401) { Api.clearSession(); location.href='index.html'; }
      else toast('Ошибка загрузки профиля', 'error');
    }
  }

  // ── Render enrolled ───────────────────────────────────
  function renderEnrolled() {
    if (!enrolledGrid) return;
    enrolledGrid.innerHTML = '';
    if (!enrolled.length) {
      enrolledGrid.innerHTML = `
        <div class="dash-empty">
          <div class="dash-empty__icon">📚</div>
          <div class="dash-empty__text">Вы ещё не записаны ни на один курс</div>
          <button class="btn btn--primary" id="inlineGoC">Перейти в каталог</button>
        </div>`;
      goC($('inlineGoC'));
      return;
    }
    enrolled.forEach(e => {
      const pct  = e.progress || 0;
      const card = document.createElement('div');
      card.className = 'dc-card';
      const col = catColor[e.category] || '#2563eb';
      card.innerHTML = `
        <div class="dc-card__thumb">
          ${e.previewUrl
            ? `<img src="${escHtml(e.previewUrl)}" alt="${escHtml(e.title)}" loading="lazy"
                    onerror="this.style.display='none'">`
            : ''}
          <div class="dc-card__thumb-overlay"><div class="dc-card__play"></div></div>
          ${e.channel ? `<span class="dc-card__channel-badge">${escHtml(e.channel)}</span>` : ''}
        </div>
        <div class="dc-card__body">
          <div class="dc-card__tags">
            ${e.category ? `<span class="tag" style="background:${col}22;color:${col}">${catLabel[e.category]||e.category}</span>` : ''}
            ${e.level    ? `<span class="tag">${lvlLabel[e.level]||e.level}</span>` : ''}
          </div>
          <div class="dc-card__title">${escHtml(e.title)}</div>
          <div class="dc-card__prog-wrap">
            <div class="dc-card__prog-label"><span>Прогресс</span><span>${pct}%</span></div>
            <div class="dc-card__prog-bar">
              <div class="dc-card__prog-fill" style="width:${pct}%"></div>
            </div>
          </div>
        </div>`;
      card.addEventListener('click', () => openModal(e.slug, true));
      enrolledGrid.appendChild(card);
    });
  }

  // ── Load catalog ──────────────────────────────────────
  async function loadCatalog() {
    if (!catalogGrid) return;
    try {
      const data = await Api.getCourses();
      catalog = data.courses || (Array.isArray(data) ? data : []);
      renderCatalog();
    } catch {
      catalogGrid.innerHTML = '<div class="dash-empty"><div class="dash-empty__text">Ошибка загрузки каталога</div></div>';
    }
  }

  function renderCatalog(filter) {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = '';
    const list = filter && filter!=='all'
      ? catalog.filter(c => c.category === filter)
      : catalog;
    if (!list.length) {
      catalogGrid.innerHTML = '<div class="dash-empty"><div class="dash-empty__text">Нет курсов</div></div>';
      return;
    }
    list.forEach(c => {
      const isE = enrolled.some(e => e.slug === c.slug);
      const col  = catColor[c.category] || '#2563eb';
      const card = document.createElement('div');
      card.className = 'cat-card';
      card.innerHTML = `
        <div class="cat-card__thumb" data-slug="${escHtml(c.slug)}" style="cursor:pointer">
          ${c.previewUrl
            ? `<img src="${escHtml(c.previewUrl)}" alt="${escHtml(c.title)}" loading="lazy"
                    onerror="this.style.display='none'">`
            : ''}
          <div class="cat-card__thumb-overlay"><div class="cat-card__yt-icon"></div></div>
          ${c.channel ? `<span class="cat-card__channel-badge">${escHtml(c.channel)}</span>` : ''}
        </div>
        <div class="cat-card__body">
          <div class="cat-card__tags">
            ${c.category ? `<span class="tag" style="background:${col}22;color:${col}">${catLabel[c.category]||c.category}</span>` : ''}
            ${c.level    ? `<span class="tag">${lvlLabel[c.level]||c.level}</span>` : ''}
          </div>
          <div class="cat-card__title">${escHtml(c.title)}</div>
          <div class="cat-card__desc">${escHtml(c.description||'')}</div>
          <div class="cat-card__footer">
            <span class="cat-card__meta">${c.lessonsCount||0} уроков · ${c.duration||''}</span>
            <button class="btn ${isE?'btn--secondary':'btn--primary'} btn--sm"
              data-slug="${escHtml(c.slug)}">${isE?'Открыть':'Записаться'}</button>
          </div>
        </div>`;
      card.querySelector('.cat-card__thumb').addEventListener('click', () => openModal(c.slug, false));
      const btn = card.querySelector('button[data-slug]');
      btn.addEventListener('click', ev => {
        ev.stopPropagation();
        if (isE) showSection('my-courses');
        else enrollCourse(c.slug, btn);
      });
      catalogGrid.appendChild(card);
    });
  }

  if (catalogFilter) {
    catalogFilter.addEventListener('click', e => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      catalogFilter.querySelectorAll('button').forEach(b => b.classList.remove('btn--primary'));
      btn.classList.add('btn--primary');
      renderCatalog(btn.dataset.filter);
    });
    // Default active
    const allBtn = catalogFilter.querySelector('[data-filter="all"]');
    if (allBtn) allBtn.classList.add('btn--primary');
  }

  // ── Enroll ────────────────────────────────────────────
  async function enrollCourse(slug, btn) {
    try {
      btn.disabled = true; btn.textContent = '...';
      const data = await Api.enroll(slug);
      enrolled = data.enrolledCourses || enrolled;
      toast('Вы записаны на курс!', 'success');
      updateStats();
      renderEnrolled();
      renderCatalog(qs('.dash-filter-row .btn--primary')?.dataset.filter);
    } catch(err) {
      toast(err.data?.message || 'Ошибка записи', 'error');
      btn.disabled = false; btn.textContent = 'Записаться';
    }
  }

  // ── Video modal ───────────────────────────────────────
  async function openModal(slug, showProgress) {
    currentSlug = slug;
    vmodalPlayer.innerHTML = `
      <div class="vmodal__player-placeholder">
        <div class="vmodal__player-placeholder-icon">▶</div>
        <div class="vmodal__player-placeholder-text">Загрузка...</div>
      </div>`;
    if (vmodalTitle)  vmodalTitle.textContent  = '...';
    if (vmodalChannel) vmodalChannel.textContent = '';
    if (vmodalDesc)   vmodalDesc.textContent   = '';
    if (vmodalChips)  vmodalChips.innerHTML    = '';
    if (vmodalProgBlock) vmodalProgBlock.style.display = 'none';
    vmodal.classList.add('open');
    document.body.style.overflow = 'hidden';

    try {
      const data = await Api.getCourse(slug);
      const c = data.course || data;

      if (vmodalTitle)   vmodalTitle.textContent   = c.title || '';
      if (vmodalChannel) vmodalChannel.textContent = c.channel || 'YouTube';
      if (vmodalDesc)    vmodalDesc.textContent    = c.description || '';

      if (vmodalChips && c.tags?.length) {
        c.tags.forEach(t => {
          const sp = document.createElement('span');
          sp.className = 'tag'; sp.textContent = t;
          vmodalChips.appendChild(sp);
        });
      }

      if (c.videoUrl) {
        const sep = c.videoUrl.includes('?') ? '&' : '?';
        vmodalPlayer.innerHTML = `<iframe
          src="${escHtml(c.videoUrl)}${sep}autoplay=1&rel=0"
          allow="autoplay; fullscreen; encrypted-media"
          allowfullscreen></iframe>`;
      } else {
        vmodalPlayer.innerHTML = `
          <div class="vmodal__player-placeholder">
            <div class="vmodal__player-placeholder-icon">🎬</div>
            <div class="vmodal__player-placeholder-text">Видео недоступно</div>
          </div>`;
      }

      if (showProgress && vmodalProgBlock) {
        const ec  = enrolled.find(e => e.slug === slug);
        const pct = ec ? (ec.progress || 0) : 0;
        vmodalProgBlock.style.display = '';
        if (vmodalRange) vmodalRange.value = pct;
        updateProgUI(pct);
      }
    } catch {
      vmodalPlayer.innerHTML = `
        <div class="vmodal__player-placeholder">
          <div class="vmodal__player-placeholder-text">Ошибка загрузки видео</div>
        </div>`;
    }
  }

  function updateProgUI(pct) {
    if (vmodalFill) vmodalFill.style.width = pct + '%';
    if (vmodalPct)  vmodalPct.textContent  = pct + '%';
  }

  function closeModal() {
    vmodal.classList.remove('open');
    document.body.style.overflow = '';
    vmodalPlayer.innerHTML = '';
    currentSlug = null;
  }

  if (vmodalClose)   vmodalClose.addEventListener('click', closeModal);
  if (vmodalOverlay) vmodalOverlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeModal(); });

  if (vmodalRange) {
    vmodalRange.addEventListener('input', () => updateProgUI(+vmodalRange.value));
  }

  if (vmodalSave) {
    vmodalSave.addEventListener('click', async () => {
      if (!currentSlug) return;
      const pct = vmodalRange ? +vmodalRange.value : 0;
      vmodalSave.disabled = true;
      try {
        await Api.saveProgress(currentSlug, pct);
        const ec = enrolled.find(e => e.slug === currentSlug);
        if (ec) ec.progress = pct;
        updateStats();
        renderEnrolled();
        toast('Прогресс сохранён ✓', 'success');
      } catch {
        toast('Ошибка сохранения', 'error');
      } finally {
        vmodalSave.disabled = false;
      }
    });
  }

  // ── Profile ───────────────────────────────────────────
  if (profileForm) {
    profileForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = profileName?.value.trim();
      if (!name) return;
      try {
        const data = await Api.updateProfile({ name });
        const u = data.user || data;
        const ini = initials(u.name || name);
        if (sidebarName)   sidebarName.textContent   = u.name || name;
        if (sidebarAvatar) sidebarAvatar.textContent = ini;
        if (navUserName)   navUserName.textContent   = u.name || name;
        if (navUserAvatar) navUserAvatar.textContent = ini;
        if (profileAvatar) profileAvatar.textContent = ini;
        if (profileMsg) {
          profileMsg.textContent = 'Сохранено!';
          setTimeout(() => { profileMsg.textContent = ''; }, 2500);
        }
        toast('Профиль обновлён', 'success');
      } catch {
        toast('Ошибка обновления профиля', 'error');
      }
    });
  }

  // ── Logout ────────────────────────────────────────────
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await Api.logout().catch(() => {});
      Api.clearSession();
      location.href = 'index.html';
    });
  }

  // ── Init ─────────────────────────────────────────────
  await loadUser();
  await loadCatalog();

})();
