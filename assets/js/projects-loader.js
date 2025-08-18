/**
 * Simple Projects Loader - Clean list display
 */

class SimpleProjectsLoader {
    constructor() {
        this.projects = [];
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
     * Render all projects as a clean list
     */
    renderProjects() {
        const container = document.getElementById('projects-list');
        if (!container) {
            console.error('Projects list container not found');
            return;
        }

        if (this.projects.length === 0) {
            container.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h3>No Projects Found</h3>
                    <p>No projects are currently available.</p>
                </li>
            `;
            return;
        }

        // Sort projects by date (most recent first)
        const sortedProjects = [...this.projects].sort((a, b) => {
            const dateA = new Date(a.date || '1970-01-01');
            const dateB = new Date(b.date || '1970-01-01');
            return dateB - dateA;
        });

        container.innerHTML = sortedProjects.map(project => this.createProjectItem(project)).join('');
        console.log('Projects rendered successfully');
    }

    /**
     * Create individual project list item
     */
    createProjectItem(project) {
        const technologies = project.technologies ? 
            project.technologies.split(', ').map(tech => 
                `<span class="tech-tag">${tech.trim()}</span>`
            ).join('') : '';

        const links = [];
        if (project.url && project.url !== '') {
            const linkText = project.url.includes('github.com') ? 'GitHub' : 'View Project';
            const linkIcon = project.url.includes('github.com') ? 'fab fa-github' : 'fas fa-external-link-alt';
            links.push(`<a href="${project.url}" target="_blank" rel="noopener noreferrer" class="item-link">
                <i class="${linkIcon}"></i> ${linkText}
            </a>`);
        }

        return `
            <li class="content-item">
                <div class="item-header">
                    <h3 class="item-title">${project.project}</h3>
                    <div class="item-meta"><strong>Role:</strong> ${project.role}</div>
                    <div class="item-venue">${project.duration}</div>
                    ${project.misc ? `<div class="item-meta">${project.misc}</div>` : ''}
                </div>

                <div class="item-description">${project.description}</div>

                ${technologies ? `<div class="tech-tags">${technologies}</div>` : ''}

                ${links.length > 0 ? `<div class="item-links">${links.join('')}</div>` : ''}
            </li>
        `;
    }
}

// Initialize projects loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const projectsLoader = new SimpleProjectsLoader();
    projectsLoader.loadProjectsData();
});

// Export for use in other scripts
window.SimpleProjectsLoader = SimpleProjectsLoader;