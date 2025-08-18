/**
 * Publications Page Loader - Handles loading and rendering all publications
 */

class PublicationsLoader {
    constructor() {
        this.publications = [];
        this.currentFilter = 'all';
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
            this.renderStatistics();
            this.renderPublications();
            this.initializeFilters();
            
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
     * Render statistics section
     */
    renderStatistics() {
        const statsContainer = document.getElementById('pub-stats');
        if (!statsContainer) return;

        const stats = this.calculateStatistics();
        
        statsContainer.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number">${stats.total}</div>
                    <div class="stat-label">Total Publications</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.published}</div>
                    <div class="stat-label">Published</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.underReview}</div>
                    <div class="stat-label">Under Review</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${stats.latestYear}</div>
                    <div class="stat-label">Latest Year</div>
                </div>
            </div>
        `;
    }

    /**
     * Calculate publication statistics
     */
    calculateStatistics() {
        const published = this.publications.filter(pub => 
            pub.status && (pub.status.toLowerCase() === 'published' || pub.status.toLowerCase() === 'accepted')
        ).length;

        const underReview = this.publications.filter(pub => 
            pub.status && pub.status.toLowerCase().includes('review')
        ).length;

        const years = this.publications.map(pub => parseInt(pub.year)).filter(year => !isNaN(year));
        const latestYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();

        return {
            total: this.publications.length,
            published,
            underReview,
            latestYear
        };
    }

    /**
     * Render all publications
     */
    renderPublications() {
        const container = document.getElementById('publications-list');
        if (!container) {
            console.error('Publications list container not found');
            return;
        }

        if (this.publications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-alt"></i>
                    <h3>No Publications Found</h3>
                    <p>No publications are currently available.</p>
                </div>
            `;
            return;
        }

        // Sort publications by year (most recent first)
        const sortedPublications = [...this.publications].sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA;
        });

        container.innerHTML = sortedPublications.map(pub => this.createPublicationItem(pub)).join('');
        console.log('Publications rendered successfully');
    }

    /**
     * Create individual publication item
     */
    createPublicationItem(pub) {
        // Handle authors - check if it's a string or array
        let authorsDisplay = '';
        if (typeof pub.authors === 'string') {
            // String format: highlight your name
            authorsDisplay = pub.authors.replace(/\bMees Lindeman\b/g, '<strong>Mees Lindeman</strong>');
        } else if (Array.isArray(pub.authors)) {
            // Array format: use the old logic
            authorsDisplay = pub.authors.map(author => 
                author.is_self ? `<strong>${author.name}</strong>` : author.name
            ).join(', ');
        }

        // Create status badge
        const statusClass = pub.status ? pub.status.toLowerCase().replace(/\s+/g, '-') : '';
        const statusBadge = pub.status ? `<span class="status-badge status-${statusClass}">${pub.status}</span>` : '';

        // Create links
        const links = [];
        if (pub.url) {
            links.push(`<a href="${pub.url}" target="_blank" rel="noopener noreferrer" class="pub-link primary">
                <i class="fas fa-external-link-alt"></i> Paper
            </a>`);
        }
        if (pub.doi) {
            links.push(`<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener noreferrer" class="pub-link">
                <i class="fas fa-link"></i> DOI
            </a>`);
        }

        // Determine publication type for filtering
        const pubType = this.getPublicationType(pub);

        return `
            <article class="publication-item" data-type="${pubType}" data-status="${statusClass}" data-year="${pub.year}">
                <div class="pub-header">
                    <h3 class="pub-title">
                        ${pub.title}
                        ${statusBadge}
                    </h3>
                    ${authorsDisplay ? `<div class="pub-authors">${authorsDisplay}</div>` : ''}
                    <div class="pub-venue-info">
                        <span class="pub-venue">${pub.venue}</span>
                        <span class="pub-year">(${pub.year})</span>
                        ${pub.type ? `<span class="pub-type">${pub.type}</span>` : ''}
                    </div>
                </div>

                ${pub.summary ? `<div class="pub-summary">${pub.summary}</div>` : ''}

                ${links.length > 0 ? `<div class="pub-links">${links.join('')}</div>` : ''}
            </article>
        `;
    }

    /**
     * Determine publication type for filtering
     */
    getPublicationType(pub) {
        if (!pub.type) return 'other';
        
        const type = pub.type.toLowerCase();
        if (type.includes('journal')) return 'journal';
        if (type.includes('conference')) return 'conference';
        if (type.includes('preprint')) return 'preprint';
        if (type.includes('thesis') || type.includes('report')) return 'thesis';
        if (type.includes('workshop')) return 'conference';
        
        return 'other';
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
     * Apply filter to publications
     */
    applyFilter(filter) {
        this.currentFilter = filter;
        const publicationItems = document.querySelectorAll('.publication-item');
        
        publicationItems.forEach(item => {
            let shouldShow = false;
            
            switch (filter) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'journal':
                    shouldShow = item.dataset.type === 'journal';
                    break;
                case 'conference':
                    shouldShow = item.dataset.type === 'conference';
                    break;
                case 'preprint':
                    shouldShow = item.dataset.type === 'preprint';
                    break;
                case 'thesis':
                    shouldShow = item.dataset.type === 'thesis';
                    break;
                default:
                    shouldShow = true;
            }
            
            if (shouldShow) {
                item.style.display = 'block';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 50);
            } else {
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.display = 'none';
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
        if (hash && ['journal', 'conference', 'preprint', 'thesis'].includes(hash)) {
            const button = document.querySelector(`[data-filter="${hash}"]`);
            if (button) {
                button.click();
            }
        }
    }
}

// Initialize publications loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const publicationsLoader = new PublicationsLoader();
    publicationsLoader.loadPublicationsData().then(() => {
        // Initialize from URL hash after publications are loaded
        publicationsLoader.initializeFromHash();
    });
});

// Export for use in other scripts
window.PublicationsLoader = PublicationsLoader;