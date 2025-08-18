// Theme Toggle Script - Works on ALL pages
(function() {
    'use strict';
    
    // Initialize theme immediately to prevent flash
    function initTheme() {
        const html = document.documentElement;
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', savedTheme);
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
    }
    
    // Initialize when DOM is ready
    function initialize() {
        const currentTheme = initTheme();
        updateToggleButton(currentTheme);
        
        // Add click listener to theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }
    
    // Run immediately to prevent flash
    initTheme();
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();