/**
 * Projects Page Loader - Handles loading and rendering all projects
 */

class ProjectsLoader {
    constructor() {
        this.projects = [];
        this.currentFilter = 'all';
    }

    /**
     * Load projects data
     */
    async loadProjectsData() {
        console.log('Loading projects data...');
        
        try {
            const response = await fetch('assets/data/projects.yml');
            if (!response.ok) {
                throw new Error(`Failed to load projects.yml: ${response.status}`);
            }
            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);
            
            this.projects = data.projects || [];
            console.log('Projects loaded successfully:', this.projects);
            
            this.hideLoading();
            this.renderProjects();
            this.initializeFilters();
            
        } catch (error) {
            console.error('Error loading projects:', error);
            this.showErrorState();
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
    }

    /**
     * Show error state
     */
    showErrorState() {
        const loadingContainer = document.getElementById('loading-container');
        if (loadingContainer) {
            loadingContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error Loading Projects</h3>
                    <p>Could not load projects data. Please try again later.</p>
                </div>
            `;
        }
    }

    /**
     * Render all projects
     */
    renderProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) {
            console.error('Projects grid container not found');
            return;
        }

        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No Projects Found</h3>
                    <p>No projects are currently available.</p>
                </div>
            `;
            return;
        }

        // Sort projects by date (most recent first)
        const sortedProjects = [...this.projects].sort((a, b) => {
            const dateA = new Date(a.date || '1970-01-01');
            const dateB = new Date(b.date || '1970-01-01');
            return dateB - dateA;
        });

        container.innerHTML = sortedProjects.map(project => this.createProjectCard(project)).join('');
        console.log('Projects rendered successfully');
    }

    /**
     * Create individual project card
     */
    createProjectCard(project) {
        const technologies = project.technologies ? 
            project.technologies.split(', ').map(tech => 
                `<span class="tech-tag">${tech.trim()}</span>`
            ).join('') : '';

        const statusIcon = {
            'ongoing': 'fas fa-play',
            'completed': 'fas fa-check',
            'planned': 'fas fa-clock'
        };

        const statusClass = project.status ? project.status.toLowerCase() : 'completed';
        const icon = statusIcon[statusClass] || 'fas fa-check';

        const links = [];
        if (project.url && project.url !== '') {
            const linkText = project.url.includes('github.com') ? 'GitHub' : 'View Project';
            const linkIcon = project.url.includes('github.com') ? 'fab fa-github' : 'fas fa-external-link-alt';
            links.push(`<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">
                <i class="${linkIcon}"></i> ${linkText}
            </a>`);
        }

        return `
            <article class="project-card ${project.featured ? 'featured' : ''}" data-status="${statusClass}" data-featured="${project.featured}">
                ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
                
                <div class="project-header">
                    <h3 class="project-title">${project.project}</h3>
                    <div class="project-meta">
                        <span class="project-role">${project.role}</span>
                        <span class="project-duration">${project.duration}</span>
                    </div>
                    ${project.misc ? `<div class="project-misc">${project.misc}</div>` : ''}
                </div>

                <div class="project-description">${project.description}</div>

                ${technologies ? `<div class="tech-tags">${technologies}</div>` : ''}

                <div class="project-footer">
                    <div class="project-status status-${statusClass}">
                        <i class="${icon}"></i>
                        <span>${project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Completed'}</span>
                    </div>
                    ${links.length > 0 ? `<div class="project-links">${links.join('')}</div>` : ''}
                </div>
            </article>
        `;
    }

    /**
     * Initialize filter functionality
     */
    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Apply filter
                const filter = button.dataset.filter;
                this.applyFilter(filter);
            });
        });
    }

    /**
     * Apply filter to projects
     */
    applyFilter(filter) {
        this.currentFilter = filter;
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            let shouldShow = false;
            
            switch (filter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'ongoing':
                    shouldShow = card.dataset.status === 'ongoing';
                    break;
                case 'completed':
                    shouldShow = card.dataset.status === 'completed';
                    break;
                case 'featured':
                    shouldShow = card.dataset.featured === 'true';
                    break;
                default:
                    shouldShow = true;
            }
            
            if (shouldShow) {
                card.style.display = 'block';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Update URL hash for bookmarking
        if (filter !== 'all') {
            window.location.hash = filter;
        } else {
            history.replaceState(null, null, window.location.pathname);
        }
    }

    /**
     * Initialize from URL hash
     */
    initializeFromHash() {
        const hash = window.location.hash.substring(1);
        if (hash && ['ongoing', 'completed', 'featured'].includes(hash)) {
            const button = document.querySelector(`[data-filter="${hash}"]`);
            if (button) {
                button.click();
            }
        }
    }
}

// Initialize projects loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const projectsLoader = new ProjectsLoader();
    projectsLoader.loadProjectsData().then(() => {
        // Initialize from URL hash after projects are loaded
        projectsLoader.initializeFromHash();
    });
});

// Export for use in other scripts
window.ProjectsLoader = ProjectsLoader;