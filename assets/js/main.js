(function () {
  'use strict';

  // -------------------------------
  // Mobile Menu Navigation
  // -------------------------------
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
      if (icon) {
        icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
      if (!mainNav.contains(event.target) && !mobileToggle.contains(event.target)) {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });

    // Close menu when nav link is clicked
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

  // -------------------------------
  // External Links
  // -------------------------------
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

  // -------------------------------
  // Smooth Scrolling for Anchor Links
  // -------------------------------
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
        
        window.scrollTo({ 
          top: targetPosition, 
          behavior: 'smooth' 
        });
        
        history.pushState(null, null, targetId);
      });
    });
  }

  // -------------------------------
  // Responsive Menu Handling
  // -------------------------------
  function handleResize() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Close mobile menu if window is resized to desktop size
    if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      if (mobileToggle) {
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    }
  }

  // -------------------------------
  // Basic Accessibility
  // -------------------------------
  function initBasicAccessibility() {
    // Add aria-labels to social links if missing
    document.querySelectorAll('.footer-social a').forEach(link => {
      if (!link.getAttribute('aria-label')) {
        const title = link.getAttribute('title');
        if (title) link.setAttribute('aria-label', title);
      }
    });

    // Add list roles for screen readers
    const newsList = document.querySelector('.news-list');
    if (newsList) {
      newsList.setAttribute('role', 'list');
      newsList.querySelectorAll('.news-list__item').forEach(item => {
        item.setAttribute('role', 'listitem');
      });
    }

    document.querySelectorAll('.content-list').forEach(list => {
      list.setAttribute('role', 'list');
      list.querySelectorAll('.content-list__item').forEach(item => {
        item.setAttribute('role', 'listitem');
      });
    });
  }

  // -------------------------------
  // Utility: Debounce Function
  // -------------------------------
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // -------------------------------
  // Print Styles (hide interactive elements when printing)
  // -------------------------------
  function initPrintStyles() {
    window.addEventListener('beforeprint', function () {
      document.querySelectorAll('.mobile-menu-toggle')
        .forEach(el => { el.style.display = 'none'; });
    });
    
    window.addEventListener('afterprint', function () {
      document.querySelectorAll('.mobile-menu-toggle')
        .forEach(el => { el.style.display = ''; });
    });
  }

  // -------------------------------
  // Initialize Everything
  // -------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    initMobileMenu();
    handleExternalLinks();
    initSmoothScrolling();
    initBasicAccessibility();
    initPrintStyles();
  });

  // Debounced resize handler
  window.addEventListener('resize', debounce(handleResize, 250));

})();