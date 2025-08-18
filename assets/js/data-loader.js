/**
 * Data Loader - Handles loading and rendering YAML data
 */

class DataLoader {
    constructor() {
        this.data = {
            personal: null,
            publications: null,
            projects: null,
            news: null
        };
        this.loadPromises = [];
    }

    /**
     * Load all YAML data files
     */
    async loadAllData() {
        try {
            this.loadPromises = [
                this.loadYAML('_data/personal.yml', 'personal'),
                this.loadYAML('_data/publications.yml', 'publications'),
                this.loadYAML('_data/projects.yml', 'projects'),
                this.loadYAML('_data/news.yml', 'news')
            ];

            await Promise.all(this.loadPromises);
            this.renderAllContent();
        } catch (error) {
            console.error('Error loading data:', error);
            this.renderFallbackContent();
        }
    }

    /**
     * Load individual YAML file
     */
    async loadYAML(filepath, dataKey) {
        try {
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filepath}: ${response.status}`);
            }
            const yamlText = await response.text();
            this.data[dataKey] = jsyaml.load(yamlText);
        } catch (error) {
            console.warn(`Could not load ${filepath}, using fallback data`);
            this.data[dataKey] = this.getFallbackData(dataKey);
        }
    }

    /**
     * Get fallback data if YAML files can't be loaded
     */
    getFallbackData(dataKey) {
        const fallbacks = {
            personal: {
                personal: {
                    name: "Mees Lindeman",
                    title: "MSc Student, Artificial Intelligence",
                    institution: "University of Amsterdam",
                    location: "Amsterdam, Netherlands",
                    email: "mees@lindeman.nu",
                    graduation_year: 2025,
                    social: {
                        linkedin: "#",
                        github: "https://github.com/meeslindeman",
                        scholar: "#",
                        orcid: "#"
                    },
                    bio: {
                        long: "I'm a Master's student in Artificial Intelligence at the University of Amsterdam with a strong interest in the conceptual and often overlooked questions in AI. I enjoy diving into complex problems, especially those that challenge standard assumptions or reveal unexpected structure in learning systems.\n\nMy main motivation lies in understanding how and why AI systems behave the way they do—and where they might be pushed in new directions. Alongside my academic work, I currently hold a part-time role focused on making AI more approachable to colleagues through research initiatives and educational workshops."
                    }
                }
            },
            publications: { publications: [] },
            projects: { projects: [] },
            news: { news: [] }
        };
        return fallbacks[dataKey] || {};
    }

    /**
     * Render all content sections
     */
    renderAllContent() {
        this.renderPersonalInfo();
        this.renderRecentUpdates();
    }

    /**
     * Render personal information in sidebar
     */
    renderPersonalInfo() {
        const personal = this.data.personal?.personal;
        if (!personal) return;

        // Update profile info
        const nameEl = document.getElementById('profile-name');
        const titleEl = document.getElementById('profile-title');
        if (nameEl) nameEl.textContent = personal.name;
        if (titleEl) titleEl.textContent = personal.title;

        // Render contact info
        this.renderContactInfo(personal);
        
        // Render social links
        this.renderSocialLinks(personal.social);
        
        // Render bio
        this.renderBio(personal.bio);
    }

    /**
     * Render contact information
     */
    renderContactInfo(personal) {
        const contactContainer = document.getElementById('contact-info');
        if (!contactContainer) return;

        const contactItems = [
            { icon: 'fas fa-envelope', text: personal.email, link: `mailto:${personal.email}` },
            { icon: 'fas fa-map-marker-alt', text: personal.location },
            { icon: 'fas fa-university', text: personal.institution },
            { icon: 'fas fa-graduation-cap', text: `Expected Graduation: ${personal.graduation_year}` }
        ];

        contactContainer.innerHTML = contactItems.map(item => `
            <div class="contact-item">
                <i class="${item.icon}"></i>
                ${item.link ? `<a href="${item.link}">${item.text}</a>` : `<span>${item.text}</span>`}
            </div>
        `).join('');
    }

    /**
     * Render social links
     */
    renderSocialLinks(social) {
        const socialContainer = document.getElementById('social-links');
        if (!socialContainer || !social) return;

        const socialIcons = {
            linkedin: { icon: 'fab fa-linkedin', title: 'LinkedIn' },
            github: { icon: 'fab fa-github', title: 'GitHub' },
            scholar: { icon: 'fas fa-graduation-cap', title: 'Google Scholar' },
            orcid: { icon: 'fab fa-orcid', title: 'ORCID' },
            twitter: { icon: 'fab fa-twitter', title: 'Twitter' },
            researchgate: { icon: 'fab fa-researchgate', title: 'ResearchGate' }
        };

        socialContainer.innerHTML = Object.entries(social)
            .filter(([key, url]) => url && url !== '#' && !url.includes('YOUR'))
            .map(([key, url]) => {
                const iconData = socialIcons[key];
                if (!iconData) return '';
                
                return `
                    <a href="${url}" title="${iconData.title}" aria-label="${iconData.title} Profile" target="_blank" rel="noopener noreferrer">
                        <i class="${iconData.icon}"></i>
                    </a>
                `;
            }).join('');
    }

    /**
     * Render bio content
     */
    renderBio(bio) {
        const bioContainer = document.getElementById('bio-content');
        if (!bioContainer || !bio) return;

        const bioText = bio.long || bio.short || '';
        const paragraphs = bioText.split('\n\n');
        
        bioContainer.innerHTML = paragraphs.map(p => 
            `<p class="intro-text">${p.trim()}</p>`
        ).join('');
    }

    /**
     * Render recent updates (only from news.yml)
     */
    renderRecentUpdates() {
        const updatesContainer = document.getElementById('recent-updates');
        if (!updatesContainer) return;

        // Get news items only
        const newsItems = this.data.news?.news || [];

        // Sort by date (most recent first)
        const sortedNews = newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Take only the 8 most recent
        const recentUpdates = sortedNews.slice(0, 8);

        if (recentUpdates.length === 0) {
            updatesContainer.innerHTML = '<li class="news-item"><span class="news-content">No recent updates available.</span></li>';
            return;
        }

        updatesContainer.innerHTML = recentUpdates.map(update => `
            <li class="news-item">
                <span class="news-date">${this.formatDate(update.date)}</span>
                <span class="news-content">
                    ${update.link && update.link !== '#' 
                        ? `<a href="${update.link}" target="_blank" rel="noopener noreferrer">${update.title || update.description}</a>`
                        : update.title || update.description
                    }
                </span>
            </li>
        `).join('');
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    /**
     * Render fallback content if data loading fails
     */
    renderFallbackContent() {
        console.warn('Using fallback content due to data loading issues');
        // Render basic fallback content here if needed
    }
}

// Initialize data loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const dataLoader = new DataLoader();
    dataLoader.loadAllData();
});

// Export for use in other scripts
window.DataLoader = DataLoader;