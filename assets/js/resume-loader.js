/**
 * Resume Data Loader - Handles loading and rendering resume data
 */

class ResumeLoader {
    constructor() {
        this.data = {
            personal: null,
            resume: null,
            publications: null,
            projects: null
        };
    }

    /**
     * Load all required data for resume
     */
    async loadResumeData() {
        console.log('Loading resume data...');
        
        try {
            const loadPromises = [
                this.loadYAML('_data/personal.yml', 'personal'),
                this.loadYAML('_data/resume.yml', 'resume'),
                this.loadYAML('_data/publications.yml', 'publications'),
                this.loadYAML('_data/projects.yml', 'projects')
            ];

            await Promise.all(loadPromises);
            console.log('Resume data loaded successfully:', this.data);
            this.renderResumeContent();
        } catch (error) {
            console.error('Error loading resume data:', error);
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
            this.data[dataKey] = jsyaml.load(yamlText);
            console.log(`Loaded ${dataKey} data successfully`);
        } catch (error) {
            console.warn(`Could not load ${filepath}, using fallback data:`, error);
            this.data[dataKey] = this.getFallbackData(dataKey);
        }
    }

    /**
     * Get fallback data
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
                    bio: {
                        long: "I'm a Master's student in Artificial Intelligence at the University of Amsterdam with a strong interest in the conceptual and often overlooked questions in AI."
                    }
                }
            },
            resume: {
                jobs: [],
                education: [],
                skills: { programming: [], frameworks_tools: [], research_areas: [] },
                certificates: [],
                extracurricular: []
            },
            publications: { publications: [] },
            projects: { projects: [] }
        };
        return fallbacks[dataKey] || {};
    }

    /**
     * Render all resume content
     */
    renderResumeContent() {
        this.renderPersonalSummary();
        this.renderJobs();
        this.renderEducation();
        this.renderProjects();
        this.renderPublications();
        this.renderSkills();
        this.renderCertificates();
        this.renderExtracurricular();
    }

    /**
     * Render personal summary section
     */
    renderPersonalSummary() {
        const container = document.getElementById('personal-summary');
        if (!container) return;

        const personal = this.data.personal?.personal;
        if (!personal) return;

        const bio = personal.bio?.long || personal.bio?.short || '';
        const paragraphs = bio.split('\n\n');

        container.innerHTML = `
            <div class="personal-info-grid">
                <div class="personal-details">
                    <h3>${personal.name}</h3>
                    <div class="personal-bio">
                        ${paragraphs.map(p => `<p>${p.trim()}</p>`).join('')}
                    </div>
                </div>
                <div class="contact-grid">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <a href="mailto:${personal.email}">${personal.email}</a>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${personal.location}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-university"></i>
                        <span>${personal.institution}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-graduation-cap"></i>
                        <span>Expected Graduation: ${personal.graduation_year}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render jobs section
     */
    renderJobs() {
        const container = document.getElementById('jobs-content');
        if (!container) return;

        const jobs = this.data.resume?.jobs || [];

        if (jobs.length === 0) {
            container.innerHTML = '<p>No job experience available.</p>';
            return;
        }

        container.innerHTML = jobs.map(job => `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div class="resume-item-main">
                        <div class="resume-item-title">${job.position}</div>
                        <div class="resume-item-subtitle">${job.company}</div>
                        <div class="resume-item-meta">${job.location}</div>
                    </div>
                    <div class="resume-item-date">${job.duration}</div>
                </div>
                <div class="resume-item-description">${job.summary}</div>
            </div>
        `).join('');
    }

    /**
     * Render education section
     */
    renderEducation() {
        const container = document.getElementById('education-content');
        if (!container) return;

        const education = this.data.resume?.education || [];

        if (education.length === 0) {
            container.innerHTML = '<p>No education information available.</p>';
            return;
        }

        container.innerHTML = education.map(edu => `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div class="resume-item-main">
                        <div class="resume-item-title">${edu.degree}</div>
                        <div class="resume-item-subtitle">${edu.uni}</div>
                        <div class="resume-item-meta">
                            ${edu.location ? edu.location : ''}
                            ${edu.grade ? ` • ${edu.grade}` : ''}
                        </div>
                    </div>
                    <div class="resume-item-date">${edu.year}</div>
                </div>
                <div class="resume-item-description">${edu.summary}</div>
            </div>
        `).join('');
    }

    /**
     * Render projects section
     */
    renderProjects() {
        const container = document.getElementById('projects-content');
        if (!container) return;

        const projects = this.data.projects?.projects || [];

        if (projects.length === 0) {
            container.innerHTML = '<p>No projects available.</p>';
            return;
        }

        // Show only featured projects or top 3
        const displayProjects = projects.filter(p => p.featured).slice(0, 3);

        container.innerHTML = displayProjects.map(project => `
            <div class="resume-project">
                <div class="project-title">${project.project}</div>
                <div class="project-meta"><strong>Role:</strong> ${project.role}</div>
                <div class="project-duration">${project.duration}</div>
                ${project.technologies ? `
                    <div class="tech-tags">
                        ${project.technologies.split(', ').map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                ` : ''}
                <div class="project-description">${project.description}</div>
                ${project.misc ? `<div class="project-meta">${project.misc}</div>` : ''}
            </div>
        `).join('');
    }

    /**
     * Render publications section
     */
    renderPublications() {
        const container = document.getElementById('publications-content');
        if (!container) return;

        const publications = this.data.publications?.publications || [];

        if (publications.length === 0) {
            container.innerHTML = '<p>No publications available.</p>';
            return;
        }

        container.innerHTML = publications.map(pub => {
            const authors = pub.authors?.map(author => 
                author.is_self ? `<strong>${author.name}</strong>` : author.name
            ).join(', ') || '';

            return `
                <div class="resume-publication">
                    <div class="pub-title">${pub.title}</div>
                    ${authors ? `<div class="pub-authors">${authors}</div>` : ''}
                    <div class="pub-venue">${pub.venue}, ${pub.year}</div>
                    <div class="pub-abstract">${pub.abstract}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render skills section
     */
    renderSkills() {
        const container = document.getElementById('skills-content');
        if (!container) return;

        const skills = this.data.resume?.skills || {};

        if (Object.keys(skills).length === 0) {
            container.innerHTML = '<p>No skills information available.</p>';
            return;
        }

        const skillCategories = {
            programming: 'Programming Languages & Libraries',
            frameworks_tools: 'Frameworks & Tools',
            research_areas: 'Research Areas'
        };

        container.innerHTML = `
            <div class="skills-grid">
                ${Object.entries(skills).map(([category, skillList]) => `
                    <div class="skill-category">
                        <h4>${skillCategories[category] || category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                        <div class="skill-tags">
                            ${(skillList || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render certificates section
     */
    renderCertificates() {
        const container = document.getElementById('certificates-content');
        if (!container) return;

        const certificates = this.data.resume?.certificates || [];

        if (certificates.length === 0) {
            container.innerHTML = '<p>No certificates available.</p>';
            return;
        }

        container.innerHTML = certificates.map(cert => `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div class="resume-item-main">
                        <div class="resume-item-title">${cert.award}</div>
                        <div class="resume-item-subtitle">${cert.organization}</div>
                    </div>
                    <div class="resume-item-date">${cert.year}</div>
                </div>
                <div class="resume-item-description">${cert.summary}</div>
            </div>
        `).join('');
    }

    /**
     * Render extracurricular section
     */
    renderExtracurricular() {
        const container = document.getElementById('extracurricular-content');
        if (!container) return;

        const extracurricular = this.data.resume?.extracurricular || [];

        if (extracurricular.length === 0) {
            container.innerHTML = '<p>No extracurricular activities available.</p>';
            return;
        }

        container.innerHTML = extracurricular.map(activity => `
            <div class="resume-item">
                <div class="resume-item-header">
                    <div class="resume-item-main">
                        <div class="resume-item-title">${activity.organization}</div>
                        <div class="resume-item-subtitle">${activity.role}</div>
                    </div>
                    <div class="resume-item-date">${activity.year}</div>
                </div>
                <div class="resume-item-description">${activity.summary}</div>
            </div>
        `).join('');
    }

    /**
     * Render fallback content
     */
    renderFallbackContent() {
        console.warn('Using fallback content for resume');
        
        // Force render with fallback data
        this.renderPersonalSummary();
        this.renderJobs();
        this.renderEducation();
        this.renderProjects();
        this.renderPublications();
        this.renderSkills();
        this.renderCertificates();
        this.renderExtracurricular();
        
        console.log('Resume fallback content rendered');
    }
}

// Initialize resume loader when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const resumeLoader = new ResumeLoader();
    resumeLoader.loadResumeData();
});

// Export for use in other scripts
window.ResumeLoader = ResumeLoader;