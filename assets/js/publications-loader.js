/**
 * Publications Loader - Clean list display
 */

class PublicationsLoader {
    constructor() {
        this.publications = [];
    }

    /**
     * Load publications data
     */
    async loadPublicationsData() {
        console.log('Loading publications data...');
        
        try {
            const response = await fetch('assets/data/publications.yml');
            if (!response.ok) {
                throw new Error(`Failed to load publications.yml: ${response.status}`);
            }
            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);
            
            this.publications = data.publications || [];
            console.log('Publications loaded successfully:', this.publications);
            
            this.hideLoading();
            this.renderPublications();
            
        } catch (error) {
            console.error('Error loading publications:', error);
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
                    <h3>Error Loading Publications</h3>
                    <p>Could not load publications data. Please try again later.</p>
                </div>
            `;
        }
    }

    /**
     * Render all publications as a clean list
     */
    renderPublications() {
        const container = document.getElementById('publications-list');
        if (!container) {
            console.error('Publications list container not found');
            return;
        }

        if (this.publications.length === 0) {
            container.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No Publications Found</h3>
                    <p>No publications are currently available.</p>
                </li>
            `;
            return;
        }

        // Sort publications by year (most recent first)
        const sortedPublications = [...this.publications].sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA;
        });

        container.innerHTML = sortedPublications.map(publication => this.createPublicationItem(publication)).join('');
        console.log('Publications rendered successfully');
    }

    /**
     * Create individual publication list item
     */
    createPublicationItem(publication) {
        // Handle authors - check if it's a string or array
        let authorsDisplay = '';
        if (typeof publication.authors === 'string') {
            // String format: highlight your name
            authorsDisplay = publication.authors.replace(/\bMees Lindeman\b/g, '<strong>Mees Lindeman</strong>');
        } else if (Array.isArray(publication.authors)) {
            // Array format: use the old logic
            authorsDisplay = publication.authors.map(author => 
                author.is_self ? `<strong>${author.name}</strong>` : author.name
            ).join(', ');
        }

        // Create links if available
        const links = [];
        if (publication.url) {
            links.push(`<a href="${publication.url}" target="_blank" rel="noopener noreferrer" class="item-link">
                <i class="fas fa-external-link-alt"></i> Paper
            </a>`);
        }
        if (publication.doi) {
            links.push(`<a href="https://doi.org/${publication.doi}" target="_blank" rel="noopener noreferrer" class="item-link">
                <i class="fas fa-link"></i> DOI
            </a>`);
        }

        return `
            <li class="content-item">
                <div class="item-header">
                    <h3 class="item-title">${publication.title}</h3>
                    ${authorsDisplay ? `<div class="item-meta">${authorsDisplay}</div>` : ''}
                    <div class="item-venue">
                        <em>${publication.venue}</em> (${publication.year})
                        ${publication.type ? ` • ${publication.type}` : ''}
                    </div>
                </div>

                ${publication.summary ? `<div class="item-summary">${publication.summary}</div>` : ''}

                ${links.length > 0 ? `<div class="item-links">${links.join('')}</div>` : ''}
            </li>
        `;
    }
}

// Initialize publications loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const publicationsLoader = new PublicationsLoader();
    publicationsLoader.loadPublicationsData();
});

// Export for use in other scripts
window.PublicationsLoader = PublicationsLoader;