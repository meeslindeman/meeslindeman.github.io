(function () {
  'use strict';

  // -------------------------------
  // Namespace (single global)
  // -------------------------------
  window.AcademicSite = window.AcademicSite || {};

  // -------------------------------
  // Color palettes (NAMESPACED)
  // -------------------------------
  const PALETTES = window.AcademicSite.PALETTES || {
    warm: {
      'color-primary': '#f59e0b',
      'color-primary-dark': '#f97316',
      'primary-rgb': '245, 158, 11',
      'color-text': '#374151',
      'color-text-light': '#6b7280',
      'color-text-dark': '#111827',
      'color-bg': '#fefefe',
      'color-bg-alt': '#f9fafb',
      'color-white': '#ffffff',
      'color-accent-bg': '#fef3e2',
      'color-accent-border': '#fed7aa',
      'color-border': '#f3f4f6',
      'color-muted': '#4b5563',
      'color-muted-2': '#d1d5db'
    },
    cool: {
      'color-primary': '#2563eb',
      'color-primary-dark': '#3b82f6',
      'primary-rgb': '37, 99, 235',
      'color-text': '#374151',
      'color-text-light': '#6b7280',
      'color-text-dark': '#0f172a',
      'color-bg': '#f9fafb',
      'color-bg-alt': '#ffffff',
      'color-white': '#ffffff',
      'color-accent-bg': '#e0f2fe',
      'color-accent-border': '#bae6fd',
      'color-border': '#e5e7eb',
      'color-muted': '#4b5563',
      'color-muted-2': '#cbd5e1'
    },
    natural: {
      'color-primary': '#10b981',
      'color-primary-dark': '#34d399',
      'primary-rgb': '16, 185, 129',
      'color-text': '#374151',
      'color-text-light': '#6b7280',
      'color-text-dark': '#111827',
      'color-bg': '#fdfdfb',
      'color-bg-alt': '#ffffff',
      'color-white': '#ffffff',
      'color-accent-bg': '#ecfdf5',
      'color-accent-border': '#a7f3d0',
      'color-border': '#e5e7eb',
      'color-muted': '#4b5563',
      'color-muted-2': '#d1d5db'
    },
    rose: {
      'color-primary': '#e11d48',
      'color-primary-dark': '#be123c',
      'primary-rgb': '225, 29, 72',
      'color-text': '#374151',
      'color-text-light': '#6b7280',
      'color-text-dark': '#111827',
      'color-bg': '#fffdfd',
      'color-bg-alt': '#ffffff',
      'color-white': '#ffffff',
      'color-accent-bg': '#ffe4e6',
      'color-accent-border': '#fecdd3',
      'color-border': '#f3f4f6',
      'color-muted': '#4b5563',
      'color-muted-2': '#d1d5db'
    },
    indigo: {
      'color-primary': '#4f46e5',
      'color-primary-dark': '#4338ca',
      'primary-rgb': '79, 70, 229',
      'color-text': '#374151',
      'color-text-light': '#6b7280',
      'color-text-dark': '#111827',
      'color-bg': '#f9fafb',
      'color-bg-alt': '#ffffff',
      'color-white': '#ffffff',
      'color-accent-bg': '#e0e7ff',
      'color-accent-border': '#c7d2fe',
      'color-border': '#e5e7eb',
      'color-muted': '#4b5563',
      'color-muted-2': '#d1d5db'
    },
    teal: {
      'color-primary': '#14b8a6',
      'color-primary-dark': '#0d9488',
      'primary-rgb': '20, 184, 166',
      'color-text': '#374151',
      'color-text-light': '#6b7280',
      'color-text-dark': '#111827',
      'color-bg': '#f9fafb',
      'color-bg-alt': '#ffffff',
      'color-white': '#ffffff',
      'color-accent-bg': '#ccfbf1',
      'color-accent-border': '#99f6e4',
      'color-border': '#e5e7eb',
      'color-muted': '#4b5563',
      'color-muted-2': '#d1d5db'
    },
    blackred: {
      'color-primary': '#dc2626',
      'color-primary-dark': '#b91c1c',
      'primary-rgb': '220, 38, 38',
      'color-text': '#111111',
      'color-text-light': '#6b7280',
      'color-text-dark': '#000000',
      'color-bg': '#f9fafb',
      'color-bg-alt': '#ffffff',
      'color-white': '#ffffff',
      'color-accent-bg': '#fee2e2',
      'color-accent-border': '#fecaca',
      'color-border': '#e5e7eb',
      'color-muted': '#374151',
      'color-muted-2': '#d1d5db'
    }
  };
  window.AcademicSite.PALETTES = PALETTES; // expose once

  // -------------------------------
  // Theme utilities
  // -------------------------------
  function applyPalette(name) {
    const palette = PALETTES[name];
    if (!palette) return;
    const root = document.documentElement;
    for (const [key, value] of Object.entries(palette)) {
      root.style.setProperty(`--${key}`, value);
    }
    localStorage.setItem('palette', name);
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-label', `Shuffle theme (current: ${name})`);
  }

  function pickRandomPalette(excludeName) {
    const names = Object.keys(PALETTES).filter(n => n !== excludeName);
    return names[Math.floor(Math.random() * names.length)];
  }

  function initThemeShuffle() {
    const saved = localStorage.getItem('palette');
    if (saved && PALETTES[saved]) {
        applyPalette(saved);
    } else {
        applyPalette('warm'); // default
    }

    // Handle all theme toggle buttons (desktop and mobile)
    const buttons = document.querySelectorAll('.theme-toggle');
    if (buttons.length === 0) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            const current = localStorage.getItem('palette') || 'warm';
            const next = pickRandomPalette(current);
            applyPalette(next);
            
            // Animate the clicked button
            btn.animate([
                { transform: 'scale(0.96)' }, 
                { transform: 'scale(1)' }
            ], { duration: 120 });
            
            // Update aria-label for all buttons
            buttons.forEach(button => {
                button.setAttribute('aria-label', `Shuffle theme (current: ${next})`);
            });
        });
    });

    // Set initial aria-label for all buttons
    const current = localStorage.getItem('palette') || 'warm';
    buttons.forEach(btn => {
        btn.setAttribute('aria-label', `Shuffle theme (current: ${current})`);
    });
  }

  // -------------------------------
  // Your existing features
  // -------------------------------
  function updateLastModified() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
      const date = new Date(document.lastModified);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      lastUpdatedElement.textContent = date.toLocaleDateString('en-US', options);
    }
  }

  function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (!(mobileToggle && mainNav)) return;

    mobileToggle.addEventListener('click', function (e) {
      e.preventDefault();
      mainNav.classList.toggle('active');
      const isExpanded = mainNav.classList.contains('active');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      const icon = mobileToggle.querySelector('i');
      if (icon) icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
    });

    document.addEventListener('click', function (event) {
      if (!mainNav.contains(event.target) && !mobileToggle.contains(event.target)) {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });

    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', function (event) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        event.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        history.pushState(null, null, targetId);
      });
    });
  }

  function initLoadingAnimations() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.content-item, .research-item, .news-item, .quick-link, .resume-item')
        .forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.classList.add('animate-in');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.content-item, .research-item, .news-item, .quick-link, .resume-item')
      .forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
      });
  }

  function handleExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      try {
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        if (linkUrl.hostname !== currentUrl.hostname) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      } catch (e) {
        console.warn('Invalid URL found:', link.href);
      }
    });
  }

  function initAccessibility() {
    improveKeyboardNavigation();
    addAriaLabels();
    initFocusManagement();
  }

  function improveKeyboardNavigation() {
    document.querySelectorAll('.quick-link, .research-item, .content-item').forEach(el => {
      if (!el.getAttribute('tabindex')) el.setAttribute('tabindex', '0');
      el.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const link = this.querySelector('a') || this;
          if (link.tagName === 'A') link.click();
        }
      });
    });
  }

  function addAriaLabels() {
    document.querySelectorAll('.social-links a').forEach(link => {
      if (!link.getAttribute('aria-label')) {
        const title = link.getAttribute('title');
        if (title) link.setAttribute('aria-label', title);
      }
    });

    const newsList = document.querySelector('.news-list');
    if (newsList) {
      newsList.setAttribute('role', 'list');
      newsList.querySelectorAll('.news-item').forEach(item => item.setAttribute('role', 'listitem'));
    }

    document.querySelectorAll('.content-list').forEach(list => {
      list.setAttribute('role', 'list');
      list.querySelectorAll('.content-item').forEach(item => item.setAttribute('role', 'listitem'));
    });
  }

  function initFocusManagement() {
    const mobileMenu = document.querySelector('.main-nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    if (!(mobileMenu && mobileToggle)) return;

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Tab' && mobileMenu.classList.contains('active')) {
        const focusable = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey) {
          if (document.activeElement === first) { event.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
      }
    });
  }

  function initEmailProtection() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      const email = link.textContent;
      if (email && email.includes('@')) {
        const obfuscated = email.split('').map(ch =>
          Math.random() > 0.5 ? '&#' + ch.charCodeAt(0) + ';' : ch
        ).join('');
        link.innerHTML = obfuscated;
      }
    });
  }

  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;

    if (!('IntersectionObserver' in window)) {
      images.forEach(img => { img.src = img.dataset.src; img.classList.remove('lazy'); img.classList.add('loaded'); });
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => { img.classList.add('lazy'); imageObserver.observe(img); });
  }

  function initPerformanceMonitoring() {
    window.addEventListener('load', function () {
      if (performance && performance.now) {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
      }
    });
  }

  function initErrorHandling() {
    window.addEventListener('error', e => console.error('JavaScript error:', e.error));
    window.addEventListener('unhandledrejection', e => console.error('Unhandled promise rejection:', e.reason));
  }

  function initAnalytics() {
    // placeholder for GA / Plausible etc.
  }

  function getThemeAwareColor(lightColor, darkColor) {
    const theme = document.body.getAttribute('data-theme');
    return theme === 'dark' ? darkColor : lightColor;
  }

  function initThemeDependentFeatures() {
    document.querySelectorAll('.animate-in').forEach(el => {
      el.style.setProperty('--animation-delay', '0.1s');
    });
  }

  function debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this, args = arguments;
      const later = function () { timeout = null; if (!immediate) func.apply(context, args); };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  function handleResize() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    }
  }

  // Debounced resize
  window.addEventListener('resize', debounce(handleResize, 250));

//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', async function () {
//       try {
//         const swUrl = '/sw.js';
//         const res = await fetch(swUrl, { cache: 'no-store' });
//         if (res.ok) {
//           await navigator.serviceWorker.register(swUrl);
//           console.log('SW registered');
//         } else {
//           console.log('SW not found; skipping registration');
//         }
//       } catch (e) {
//         console.log('SW registration skipped:', e.message);
//       }
//     });
//   }

  document.addEventListener('themeChange', function () {
    initThemeDependentFeatures();
  });

  // Expose just the utilities you want public
  Object.assign(window.AcademicSite, {
    getThemeAwareColor,
    initThemeDependentFeatures,
    debounce,
    applyPalette,          // optional public
    pickRandomPalette,     // optional public
    initThemeShuffle,      // optional public
  });

  // Print styles management
  window.addEventListener('beforeprint', function () {
    document.querySelectorAll('.theme-toggle, .mobile-menu-toggle')
      .forEach(el => { el.style.display = 'none'; });
  });
  window.addEventListener('afterprint', function () {
    document.querySelectorAll('.theme-toggle, .mobile-menu-toggle')
      .forEach(el => { el.style.display = ''; });
  });

  // -------------------------------
  // Boot
  // -------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    updateLastModified();
    initMobileMenu();
    initSmoothScrolling();
    initLoadingAnimations();
    handleExternalLinks();
    initAccessibility();
    initEmailProtection();
    initLazyLoading();
    initPerformanceMonitoring();
    initErrorHandling();
    initAnalytics();
    initThemeShuffle();
  });
})();
