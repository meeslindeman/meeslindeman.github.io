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
        console.log('Starting to load YAML data...');
        
        try {
            this.loadPromises = [
                this.loadYAML('assets/data/personal.yml', 'personal'),
                this.loadYAML('assets/data/publications.yml', 'publications'),
                this.loadYAML('assets/data/projects.yml', 'projects'),
                this.loadYAML('assets/data/news.yml', 'news')
            ];

            await Promise.all(this.loadPromises);
            console.log('All YAML data loaded successfully:', this.data);
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
            console.log(`Loading ${filepath}...`);
            const response = await fetch(filepath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filepath}: ${response.status}`);
            }
            const yamlText = await response.text();
            console.log(`Raw YAML content for ${dataKey}:`, yamlText.substring(0, 200) + '...');
            
            this.data[dataKey] = jsyaml.load(yamlText);
            console.log(`Parsed ${dataKey} data:`, this.data[dataKey]);
        } catch (error) {
            console.warn(`Could not load ${filepath}, using fallback data:`, error);
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
                        linkedin: "https://linkedin.com/in/meeslindeman",
                        github: "https://github.com/meeslindeman",
                        scholar: "https://scholar.google.com/citations?user=YOUR_ID",
                        orcid: "https://orcid.org/YOUR-ORCID-ID",
                        twitter: "https://twitter.com/meeslindeman",
                        researchgate: "https://www.researchgate.net/profile/Mees-Lindeman"
                    },
                    bio: {
                        long: "I'm a Master's student in Artificial Intelligence at the University of Amsterdam with a strong interest in the conceptual and often overlooked questions in AI. I enjoy diving into complex problems, especially those that challenge standard assumptions or reveal unexpected structure in learning systems.\n\nMy main motivation lies in understanding how and why AI systems behave the way they do—and where they might be pushed in new directions. Alongside my academic work, I currently hold a part-time role focused on making AI more approachable to colleagues through research initiatives and educational workshops."
                    }
                }
            },
            publications: { publications: [] },
            projects: { projects: [] },
            news: { 
                news: [
                    {
                        date: "2025-03-01",
                        type: "publication",
                        title: "Paper accepted to TMLR",
                        description: "Our reproducibility study on fairness attacks in Graph Neural Networks has been accepted to Transactions on Machine Learning Research (TMLR)",
                        link: "#"
                    },
                    {
                        date: "2025-02-15",
                        type: "talk",
                        title: "Selected for ML Reproducibility Challenge",
                        description: "Selected to present at the Machine Learning Reproducibility Challenge at Princeton University",
                        link: "#"
                    },
                    {
                        date: "2025-01-15",
                        type: "project",
                        title: "Started Master's Thesis",
                        description: "Began thesis project on vision-based robotic manipulation with learned 3D geometry",
                        link: "#"
                    },
                    {
                        date: "2024-12-01",
                        type: "project",
                        title: "Launched AI for Dummies",
                        description: "Started educational workshop series at HvA to make AI concepts accessible to colleagues",
                        link: "#"
                    }
                ]
            }
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
        if (!socialContainer) {
            console.error('Social links container not found');
            return;
        }
        
        if (!social) {
            console.warn('No social data provided');
            return;
        }

        console.log('Rendering social links with data:', social);

        const socialIcons = {
            linkedin: { icon: 'fab fa-linkedin', title: 'LinkedIn' },
            github: { icon: 'fab fa-github', title: 'GitHub' },
            scholar: { icon: 'fas fa-graduation-cap', title: 'Google Scholar' },
            orcid: { icon: 'fab fa-orcid', title: 'ORCID' },
            twitter: { icon: 'fab fa-twitter', title: 'Twitter' },
            researchgate: { icon: 'fab fa-researchgate', title: 'ResearchGate' }
        };

        const validLinks = Object.entries(social)
            .filter(([key, url]) => {
                const isValid = url && url !== '#' && !url.includes('YOUR');
                console.log(`Social link ${key}: ${url} - Valid: ${isValid}`);
                return isValid;
            });

        console.log('Valid social links:', validLinks);

        socialContainer.innerHTML = validLinks
            .map(([key, url]) => {
                const iconData = socialIcons[key];
                if (!iconData) {
                    console.warn(`No icon data found for social platform: ${key}`);
                    return '';
                }
                
                return `
                    <a href="${url}" title="${iconData.title}" aria-label="${iconData.title} Profile" target="_blank" rel="noopener noreferrer">
                        <i class="${iconData.icon}"></i>
                    </a>
                `;
            }).join('');

        console.log('Social links rendered successfully');
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
        if (!updatesContainer) {
            console.error('Recent updates container not found');
            return;
        }

        console.log('Rendering recent updates with data:', this.data.news);

        // Get news items only
        const newsItems = this.data.news?.news || [];
        console.log('News items found:', newsItems);

        if (newsItems.length === 0) {
            console.warn('No news items found, showing fallback message');
            updatesContainer.innerHTML = '<li class="news-item"><span class="news-content">No recent updates available. Check console for loading errors.</span></li>';
            return;
        }

        // Sort by date (most recent first)
        const sortedNews = newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Take only the 8 most recent
        const recentUpdates = sortedNews.slice(0, 8);

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

        console.log('Recent updates rendered successfully');
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
        
        // Force render with fallback data
        this.renderPersonalInfo();
        this.renderRecentUpdates();
        
        console.log('Fallback content rendered');
    }
}

// Initialize data loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const dataLoader = new DataLoader();
    dataLoader.loadAllData();
});

// Export for use in other scripts
window.DataLoader = DataLoader;