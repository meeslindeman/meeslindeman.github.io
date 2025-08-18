// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Update last modified date
    updateLastModified();
    
    // Mobile menu functionality
    initMobileMenu();
    
    // Smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Add loading animations
    initLoadingAnimations();
    
    // Handle external links
    handleExternalLinks();
    
    // Initialize accessibility features
    initAccessibility();
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
        mobileToggle.addEventListener('click', function() {
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
                
                const headerHeight = document.querySelector('.site-header').offsetHeight;
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
 * Initialize loading animations
 */
function initLoadingAnimations() {
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
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate in
    const animatedElements = document.querySelectorAll('.research-item, .news-item, .quick-link');
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
        // Check if it's an external link (not same domain)
        const linkUrl = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        if (linkUrl.hostname !== currentUrl.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
            
            // Add external link icon if not already present
            if (!link.querySelector('.external-icon')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-external-link-alt external-icon';
                icon.style.marginLeft = '0.25rem';
                icon.style.fontSize = '0.8em';
                link.appendChild(icon);
            }
        }
    });
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Add skip link functionality
    addSkipLink();
    
    // Improve keyboard navigation
    improveKeyboardNavigation();
    
    // Add ARIA labels where needed
    addAriaLabels();
    
    // Handle focus management
    initFocusManagement();
}

/**
 * Add skip link for screen readers
 */
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
    `;
    
    // Show on focus
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add id to main content if not present
    const mainContent = document.querySelector('.main-content');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

/**
 * Improve keyboard navigation
 */
function improveKeyboardNavigation() {
    // Add keyboard support for custom interactive elements
    const interactiveElements = document.querySelectorAll('.quick-link, .research-item');
    
    interactiveElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        
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
        // Simple email obfuscation
        const email = link.href.replace('mailto:', '');
        const obfuscated = email.split('').map(char => 
            Math.random() > 0.5 ? '&#' + char.charCodeAt(0) + ';' : char
        ).join('');
        
        link.innerHTML = obfuscated;
    });
}

/**
 * Initialize theme toggle (if implementing dark mode)
 */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update button text/icon
            this.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Performance monitoring
 */
function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Optional: Send to analytics
        // analytics.track('page_load_time', { duration: loadTime });
    });
    
    // Monitor Core Web Vitals
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
    gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        respect_dnt: true
    });
    */
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initEmailProtection();
    initLazyLoading();
    initPerformanceMonitoring();
    initErrorHandling();
    initAnalytics();
});

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