// Enhanced Theme Toggle Script - Forces color updates
(function() {
    'use strict';
    
    // Force update all colors after theme change
    function forceColorUpdate() {
        // Force body background and text color
        const html = document.documentElement;
        const body = document.body;
        
        // Get computed CSS variables
        const bgPrimary = getComputedStyle(html).getPropertyValue('--bg-primary').trim();
        const textPrimary = getComputedStyle(html).getPropertyValue('--text-primary').trim();
        
        // Force update body
        body.style.backgroundColor = bgPrimary;
        body.style.color = textPrimary;
        
        // Force update specific elements that might not inherit properly
        const elementsToUpdate = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            '.content-title', '.item-title', '.news-content',
            '.site-title', '.contact-item', '.profile-info h1'
        ];
        
        elementsToUpdate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.style.color = textPrimary;
            });
        });
        
        // Force update paragraphs and secondary text
        const textSecondary = getComputedStyle(html).getPropertyValue('--text-secondary').trim();
        const secondaryElements = document.querySelectorAll('p, .intro-text, .item-description, .item-summary');
        secondaryElements.forEach(el => {
            el.style.color = textSecondary;
        });
        
        console.log('Colors force updated:', { bgPrimary, textPrimary, textSecondary });
    }
    
    // Initialize theme immediately to prevent flash
    function initTheme() {
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
        
        // Force color update after a brief delay to ensure CSS is loaded
        setTimeout(forceColorUpdate, 100);
        
        return savedTheme;
    }
    
    // Update toggle button appearance
    function updateToggleButton(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const icon = themeToggle.querySelector('i');
        const text = themeToggle.querySelector('span');
        
        if (theme === 'dark') {
            if (icon) icon.className = 'fas fa-sun';
            if (text) text.textContent = 'Light';
        } else {
            if (icon) icon.className = 'fas fa-moon';
            if (text) text.textContent = 'Dark';
        }
    }
    
    // Toggle theme
    function toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleButton(newTheme);
        
        // Force color update after theme change
        setTimeout(forceColorUpdate, 50);
        
        console.log('Theme toggled to:', newTheme);
    }
    
    // Initialize when DOM is ready
    function initialize() {
        const currentTheme = initTheme();
        updateToggleButton(currentTheme);
        
        // Add click listener to theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
            console.log('Theme toggle initialized with theme:', currentTheme);
        } else {
            console.warn('Theme toggle button not found');
        }
        
        // Force color update when everything is loaded
        forceColorUpdate();
    }
    
    // Run immediately to prevent flash
    initTheme();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also force update when page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(forceColorUpdate, 200);
    });
    
    // Watch for theme attribute changes (fallback)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                setTimeout(forceColorUpdate, 50);
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
})();