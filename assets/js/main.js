// Complete Main JavaScript functionality for Jekyll Academic Site
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all functionality
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

/**
 * Update the last modified date in the footer
 */
function updateLastModified() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const lastModified = document.lastModified;
        const date = new Date(lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        lastUpdatedElement.textContent = date.toLocaleDateString('en-US', options);
    }
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            mainNav.classList.toggle('active');
            
            // Update aria-expanded attribute
            const isExpanded = mainNav.classList.contains('active');
            mobileToggle.setAttribute('aria-expanded', isExpanded);
            
            // Update icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-times' : 'fas fa-bars';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileToggle.focus();
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

/**
 * Initialize loading animations with theme-aware effects
 */
function initLoadingAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers - just show all elements
        const animatedElements = document.querySelectorAll('.content-item, .research-item, .news-item, .quick-link, .resume-item');
        animatedElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
        return;
    }

    // Add fade-in class to elements as they become visible
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll('.content-item, .research-item, .news-item, .quick-link, .resume-item');
    animatedElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });
}

/**
 * Handle external links - open in new tab and add security attributes
 */
function handleExternalLinks() {
    const links = document.querySelectorAll('a[href^="http"]');
    
    links.forEach(link => {
        try {
            const linkUrl = new URL(link.href);
            const currentUrl = new URL(window.location.href);
            
            if (linkUrl.hostname !== currentUrl.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                // icon injection removed
            }
        } catch (e) {
            console.warn('Invalid URL found:', link.href);
        }
    });
}


/**
 * Initialize accessibility features
 */
function initAccessibility() {
  improveKeyboardNavigation();
  addAriaLabels();
  initFocusManagement();
}


/**
 * Improve keyboard navigation
 */
function improveKeyboardNavigation() {
    // Add keyboard support for custom interactive elements
    const interactiveElements = document.querySelectorAll('.quick-link, .research-item, .content-item');
    
    interactiveElements.forEach(element => {
        if (!element.getAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        
        element.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const link = this.querySelector('a') || this;
                if (link.tagName === 'A') {
                    link.click();
                }
            }
        });
    });
}

/**
 * Add ARIA labels where needed
 */
function addAriaLabels() {
    // Add labels to social links if not present
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        if (!link.getAttribute('aria-label')) {
            const title = link.getAttribute('title');
            if (title) {
                link.setAttribute('aria-label', title);
            }
        }
    });
    
    // Add role to news list
    const newsList = document.querySelector('.news-list');
    if (newsList) {
        newsList.setAttribute('role', 'list');
        const newsItems = newsList.querySelectorAll('.news-item');
        newsItems.forEach(item => {
            item.setAttribute('role', 'listitem');
        });
    }
    
    // Add role to content lists
    const contentLists = document.querySelectorAll('.content-list');
    contentLists.forEach(list => {
        list.setAttribute('role', 'list');
        const items = list.querySelectorAll('.content-item');
        items.forEach(item => {
            item.setAttribute('role', 'listitem');
        });
    });
}

/**
 * Initialize focus management
 */
function initFocusManagement() {
    // Trap focus in mobile menu when open
    const mobileMenu = document.querySelector('.main-nav');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    
    if (mobileMenu && mobileToggle) {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Tab' && mobileMenu.classList.contains('active')) {
                const focusableElements = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
}

/**
 * Email obfuscation for spam protection
 */
function initEmailProtection() {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        // Simple email obfuscation - only obfuscate display text, not href
        const email = link.textContent;
        if (email && email.includes('@')) {
            const obfuscated = email.split('').map(char => 
                Math.random() > 0.5 ? '&#' + char.charCodeAt(0) + ';' : char
            ).join('');
            
            link.innerHTML = obfuscated;
        }
    });
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length === 0) return;
    
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        });
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
    
    images.forEach(img => {
        img.classList.add('lazy');
        imageObserver.observe(img);
    });
}

/**
 * Performance monitoring
 */
function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', function() {
        if (performance && performance.now) {
            const loadTime = performance.now();
            console.log(`Page loaded in ${Math.round(loadTime)}ms`);
            
            // Optional: Send to analytics
            // analytics.track('page_load_time', { duration: loadTime });
        }
    });
    
    // Monitor Core Web Vitals if available
    if ('web-vitals' in window) {
        // This would require the web-vitals library
        // webVitals.getLCP(console.log);
        // webVitals.getFID(console.log);
        // webVitals.getCLS(console.log);
    }
}

/**
 * Error handling
 */
function initErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        
        // Optional: Send to error tracking service
        // errorTracking.captureException(event.error);
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        console.error('Unhandled promise rejection:', event.reason);
        
        // Optional: Send to error tracking service
        // errorTracking.captureException(event.reason);
    });
}

/**
 * Initialize analytics (placeholder)
 */
function initAnalytics() {
    // Placeholder for analytics initialization
    // This would typically include Google Analytics, Plausible, etc.
    
    // Example with Google Analytics
    /*
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            anonymize_ip: true,
            respect_dnt: true
        });
    }
    */
}

/**
 * Theme-aware utilities
 */
function getThemeAwareColor(lightColor, darkColor) {
    const theme = document.body.getAttribute('data-theme');
    return theme === 'dark' ? darkColor : lightColor;
}

/**
 * Initialize theme-dependent features
 */
function initThemeDependentFeatures() {
    // Update any theme-dependent animations or colors
    const animatedElements = document.querySelectorAll('.animate-in');
    animatedElements.forEach(element => {
        // Add theme-aware styling if needed
        element.style.setProperty('--animation-delay', '0.1s');
    });
}

/**
 * Debounce function for performance
 */
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

/**
 * Handle resize events
 */
function handleResize() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768 && mainNav && mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        }
    }
}

// Add resize listener with debounce
window.addEventListener('resize', debounce(handleResize, 250));

// Service worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Listen for theme changes and update theme-dependent features
document.addEventListener('themeChange', function(event) {
    initThemeDependentFeatures();
});

// Expose utilities for other scripts
window.AcademicSite = {
    getThemeAwareColor: getThemeAwareColor,
    initThemeDependentFeatures: initThemeDependentFeatures,
    debounce: debounce
};

// Initialize print styles
window.addEventListener('beforeprint', function() {
    // Hide dynamic elements before printing
    const dynamicElements = document.querySelectorAll('.theme-toggle, .mobile-menu-toggle');
    dynamicElements.forEach(el => {
        el.style.display = 'none';
    });
});

window.addEventListener('afterprint', function() {
    // Restore dynamic elements after printing
    const dynamicElements = document.querySelectorAll('.theme-toggle, .mobile-menu-toggle');
    dynamicElements.forEach(el => {
        el.style.display = '';
    });
});

// ===== Color palette shuffle =====
const PALETTES = {
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
  modern: {
    'color-primary': '#111827',
    'color-primary-dark': '#f43f5e',
    'primary-rgb': '17, 24, 39',
    'color-text': '#111827',
    'color-text-light': '#6b7280',
    'color-text-dark': '#0b1220',
    'color-bg': '#f9fafb',
    'color-bg-alt': '#ffffff',
    'color-white': '#ffffff',
    'color-accent-bg': '#fef2f2',
    'color-accent-border': '#fecdd3',
    'color-border': '#e5e7eb',
    'color-muted': '#374151',
    'color-muted-2': '#d1d5db'
  },
    pastel: {
    'color-primary': '#ec4899',
    'color-primary-dark': '#db2777',
    'primary-rgb': '236, 72, 153',
    'color-text': '#374151',
    'color-text-light': '#6b7280',
    'color-text-dark': '#111827',
    'color-bg': '#fff7f9',
    'color-bg-alt': '#ffffff',
    'color-white': '#ffffff',
    'color-accent-bg': '#fce7f3',
    'color-accent-border': '#fbcfe8',
    'color-border': '#f3f4f6',
    'color-muted': '#6b7280',
    'color-muted-2': '#e5e7eb'
  },
  earthy: {
    'color-primary': '#92400e',
    'color-primary-dark': '#b45309',
    'primary-rgb': '146, 64, 14',
    'color-text': '#3f3f46',
    'color-text-light': '#6b7280',
    'color-text-dark': '#1c1917',
    'color-bg': '#fafaf9',
    'color-bg-alt': '#f5f5f4',
    'color-white': '#ffffff',
    'color-accent-bg': '#fef3c7',
    'color-accent-border': '#fde68a',
    'color-border': '#e7e5e4',
    'color-muted': '#57534e',
    'color-muted-2': '#d6d3d1'
  }
};

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
  // Apply saved palette if any
  const saved = localStorage.getItem('palette');
  if (saved && PALETTES[saved]) {
    applyPalette(saved);
  } else {
    // ensure defaults (warm) are set on first load so CSS vars exist inline
    applyPalette('warm');
  }

  const btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  btn.addEventListener('click', function() {
    const current = localStorage.getItem('palette') || 'warm';
    const next = pickRandomPalette(current);
    applyPalette(next);
    // Optional tiny click ripple/feedback
    btn.animate([{ transform: 'scale(0.96)' }, { transform: 'scale(1)' }], { duration: 120 });
  });
}
