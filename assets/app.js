/* NOVILL EMS — progressive enhancement only. The content works without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const siteHeader = document.getElementById('siteHeader');
  const kitToggle = document.getElementById('kitToggle');
  const kitNav = document.getElementById('kitNav');
  const themeToggle = document.getElementById('themeToggle');
  const progress = document.getElementById('readProgress');
  const navLinks = Array.from(document.querySelectorAll('.tool-link'));
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const fontButtons = Array.from(document.querySelectorAll('[data-font-option]'));
  const dialog = document.getElementById('searchDialog');
  const searchButton = document.getElementById('searchButton');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const hero = document.querySelector('.hero');

  function safeRead(key) { try { return window.localStorage.getItem(key); } catch { return null; } }
  function safeWrite(key, value) { try { window.localStorage.setItem(key, value); } catch { /* Storage may be disabled in FiveM NUI. */ } }

  const preferredTheme = safeRead('novill-ems-theme');
  const initialTheme = preferredTheme === 'dark' || preferredTheme === 'light' ? preferredTheme : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0d1724' : '#f4f5f2');
  }
  applyTheme(initialTheme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    safeWrite('novill-ems-theme', nextTheme);
  });

  function applyFontSize(size) {
    root.dataset.font = size;
    fontButtons.forEach(button => {
      const isSelected = button.dataset.fontOption === size;
      button.classList.toggle('selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
    });
  }
  const initialFont = safeRead('novill-ems-font');
  applyFontSize(['small','standard','large'].includes(initialFont) ? initialFont : 'standard');
  fontButtons.forEach(button => button.addEventListener('click', () => {
    const size = button.dataset.fontOption;
    applyFontSize(size);
    safeWrite('novill-ems-font', size);
  }));

  function setNavExpanded(opened) {
    siteHeader.classList.toggle('nav-open', opened);
    kitToggle.setAttribute('aria-expanded', String(opened));
    kitToggle.setAttribute('aria-label', opened ? '医療キットメニューを閉じる' : '医療キットメニューを開く');
    kitToggle.setAttribute('title', opened ? 'メニューを閉じる' : 'メニューを開く');
    kitNav.setAttribute('aria-hidden', String(!opened));
    if (opened) kitNav.removeAttribute('inert');
    else kitNav.setAttribute('inert', '');
  }
  setNavExpanded(false);
  kitToggle.addEventListener('click', () => setNavExpanded(!siteHeader.classList.contains('nav-open')));

  function setActiveSection(id) {
    navLinks.forEach(link => {
      const isActive = link.dataset.section === id;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  // Scroll-driven visual position is cheap, independent of IntersectionObserver event ordering,
  // and reliable for sections taller than the viewport.
  let rafPending = false;
  function updateScroll() {
    rafPending = false;
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.max(0, Math.min(1, scrollTop / total))})`;
    siteHeader.classList.toggle('is-scrolled', scrollTop > 18);
    const currentY = scrollTop + Math.min(window.innerHeight * .35, 275) + 40;
    let activeId = '';
    for (const section of sections) {
      if (section.offsetTop <= currentY) activeId = section.id;
    }
    setActiveSection(activeId);
    if (!reducedMotion.matches && scrollTop < hero.offsetHeight + 200) {
      const distance = Math.min(scrollTop, hero.offsetHeight);
      hero.style.setProperty('--parallax-slow', `${distance * .16}px`);
      hero.style.setProperty('--parallax-mid', `${distance * .33}px`);
    } else {
      hero.style.setProperty('--parallax-slow', '0px');
      hero.style.setProperty('--parallax-mid', '0px');
    }
  }
  function onScroll() {
    if (!rafPending) { rafPending = true; window.requestAnimationFrame(updateScroll); }
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  window.addEventListener('resize', onScroll, { passive:true });
  window.addEventListener('hashchange', onScroll);
  updateScroll();

  // Section navigation: glide the viewport itself instead of following the
  // browser's default #anchor jump. Keep the medical-kit menu expanded.
  let travelFrame = null;
  let travelToken = 0;
  function cancelTravel() {
    travelToken += 1;
    if (travelFrame !== null) window.cancelAnimationFrame(travelFrame);
    travelFrame = null;
    siteHeader.classList.remove('is-navigating');
  }
  ['wheel', 'touchstart', 'pointerdown'].forEach(type => {
    window.addEventListener(type, cancelTravel, { passive: true });
  });
  window.addEventListener('keydown', event => {
    if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key)) cancelTravel();
  });

  function syncUrl(id) {
    if (window.location.hash === `#${id}`) return;
    // Important: update the hash after the animation, not before. Certain
    // embedded CEF/file:// viewers otherwise perform an instant anchor jump.
    try { window.history.pushState(null, '', `#${id}`); }
    catch { /* Navigation still works in local file viewers without History API. */ }
  }

  function glideToSection(id, updateHistory = true) {
    const destination = document.getElementById(id);
    if (!destination) return false;
    cancelTravel();
    const token = travelToken;
    const fromY = window.scrollY || window.pageYOffset || 0;
    const headerHeight = siteHeader.getBoundingClientRect().height;
    const requestedY = destination.getBoundingClientRect().top + fromY - headerHeight - 26;
    const endY = Math.max(0, Math.min(requestedY, document.documentElement.scrollHeight - window.innerHeight));
    const delta = endY - fromY;

    function done() {
      window.scrollTo(0, endY);
      travelFrame = null;
      siteHeader.classList.remove('is-navigating');
      updateScroll();
      if (updateHistory) syncUrl(id);
    }
    if (Math.abs(delta) < 2 || reducedMotion.matches) {
      done();
      return true;
    }

    // 'しゅいーーん': A clearly visible travel across the intervening chapters.
    // Duration scales with distance; an ~5,300px jump now takes ~3.8 seconds,
    // rather than racing past the content in about one second.
    const duration = Math.min(4400, Math.max(1100, 900 + Math.abs(delta) / 1.85));
    const ramp = 0.18; // Smooth acceleration and braking, constant cruising speed in between.
    siteHeader.classList.add('is-navigating');
    let startedAt;
    function frame(now) {
      if (token !== travelToken) return;
      if (startedAt === undefined) startedAt = now;
      const t = Math.min(1, (now - startedAt) / duration);
      let eased;
      if (t < ramp) {
        eased = t * t / (2 * ramp * (1 - ramp));
      } else if (t > 1 - ramp) {
        eased = 1 - Math.pow(1 - t, 2) / (2 * ramp * (1 - ramp));
      } else {
        eased = (t - ramp / 2) / (1 - ramp);
      }
      window.scrollTo(0, fromY + delta * eased);
      if (t < 1) travelFrame = window.requestAnimationFrame(frame);
      else done();
    }
    travelFrame = window.requestAnimationFrame(frame);
    return true;
  }

  // Every navigation icon, CTA, and 'back to top' link uses the same motion.
  // Intercept the click before the browser follows href='#...' by itself.
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const id = link.getAttribute('href').slice(1);
      if (!document.getElementById(id)) return;
      event.preventDefault();
      if (link.dataset.section) setActiveSection(id);
      glideToSection(id);
    });
  });
  window.addEventListener('popstate', () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id && document.getElementById(id)) glideToSection(id, false);
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold:.06, rootMargin:'0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // Minimal client-side section search; never requires network or a backend.
  const indexed = sections.filter(s => s.id !== 'top').map(section => ({
    id: section.id,
    label: (section.querySelector('h2')?.textContent || section.id).replace(/。/g, '').trim(),
    body: (section.innerText || section.textContent || '').replace(/\s+/g,' ').toLowerCase()
  }));
  function search(query) {
    const term = query.trim().toLowerCase();
    const matches = !term ? indexed : indexed.filter(entry => entry.body.includes(term) || entry.label.toLowerCase().includes(term));
    searchResults.replaceChildren();
    if (!matches.length) {
      const p = document.createElement('p');
      p.className = 'search-empty';
      p.textContent = '一致する項目がありません。別のキーワードをお試しください。';
      searchResults.append(p);
      return;
    }
    matches.forEach(entry => {
      const anchor = document.createElement('a');
      anchor.className = 'search-result';
      anchor.href = `#${entry.id}`;
      const title = document.createElement('strong');
      title.textContent = entry.label;
      const hint = document.createElement('small');
      hint.textContent = '移動する →';
      anchor.append(title, hint);
      anchor.addEventListener('click', event => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        dialog.close();
        glideToSection(entry.id);
      });
      searchResults.append(anchor);
    });
  }
  if (dialog && typeof dialog.showModal === 'function') {
    searchButton.addEventListener('click', () => {
      dialog.showModal();
      searchInput.value = '';
      search('');
      searchInput.focus();
    });
    searchClose.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
    searchInput.addEventListener('input', () => search(searchInput.value));
  } else if (searchButton) {
    searchButton.hidden = true;
  }
})();
