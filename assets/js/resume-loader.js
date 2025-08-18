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
                    graduation_year: 2025
                }
            },
            resume: {
                jobs: [
                    {
                        company: "Amsterdam University of Applied Sciences",
                        position: "IT Developer",
                        duration: "Sept, 2023 — Present",
                        location: "Amsterdam, The Netherlands",
                        summary: "Explored opportunities to integrate AI within the department by contributing to research initiatives and small-scale implementations. Developed a Microsoft Azure-based chatbot to assist employees with frequently asked questions and provided ongoing AI consultancy."
                    },
                    {
                        company: "Amsterdam University of Applied Sciences",
                        position: "Student Assistant", 
                        duration: "Oct, 2022 — Sept, 2023",
                        location: "Amsterdam, The Netherlands",
                        summary: "Conducted statistical research and provided IT support for student platforms. Assisted with small research projects and helped integrate AI solutions within the department, leading to a promotion to a more strategic role."
                    }
                ],
                education: [
                    {
                        degree: "MSc — Artificial Intelligence",
                        uni: "University of Amsterdam",
                        location: "Amsterdam, The Netherlands",
                        year: "2024 — 2026 (Expected)",
                        grade: "",
                        summary: "Covers advanced topics in machine learning, deep learning, natural language processing, information retrieval, and reinforcement learning."
                    },
                    {
                        degree: "BSc — Bèta Gamma, major Artificial Intelligence",
                        uni: "University of Amsterdam", 
                        location: "Amsterdam, The Netherlands",
                        year: "2019 — 2024",
                        grade: "GPA: 7.5/10",
                        summary: "Gained a strong foundation in logic, calculus, linear algebra, programming, and basic machine learning."
                    }
                ],
                skills: {
                    programming: ["Python", "PyTorch", "NumPy", "scikit-learn", "JavaScript", "HTML/CSS"],
                    frameworks_tools: ["Docker", "Microsoft Azure", "Node.js", "React", "Git"],
                    research_areas: ["Machine Learning", "Deep Learning", "Computer Vision", "NLP"]
                },
                certificates: [
                    {
                        award: "Language A: language and literature",
                        organization: "International Baccalaureate",
                        year: "2017",
                        summary: "Earned as part of the International Baccalaureate program, recognizing advanced skills in literary analysis and communication."
                    }
                ],
                extracurricular: [
                    {
                        organization: "Semester High School",
                        role: "Iowa, USA",
                        year: "2017 — 2018",
                        summary: "During a gap year in my studies, I attended a semester of High School in the United States, where I had the opportunity to enhance my English skills and embrace diverse experiences and cultures."
                    }
                ]
            },
            publications: { 
                publications: [
                    {
                        title: "Are Your Models Still Fair? Fairness Attacks on Graph Neural Networks via Node Injections: A Reproducibility Study",
                        authors: [
                            {name: "Mees Lindeman", is_self: true},
                            {name: "Ruben Figge", is_self: false}
                        ],
                        venue: "Transactions on Machine Learning Research (TMLR)",
                        year: 2025,
                        abstract: "This study evaluates the claims and results of fairness attacks on Graph Neural Networks via node injections."
                    }
                ]
            },
            projects: { 
                projects: [
                    {
                        project: "AI for Dummies",
                        role: "Creator & Instructor",
                        duration: "2025 — Present",
                        technologies: "Node.js, React, Python",
                        description: "AI for Dummies is an educational initiative I started to explain AI concepts to beginners.",
                        featured: true
                    }
                ]
            }
        };
        return fallbacks[dataKey] || {};
    }

    /**
     * Render all resume content
     */
    renderResumeContent() {
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
        if (!container) {
            console.error('Jobs container not found');
            return;
        }

        const jobs = this.data.resume?.jobs || [];
        console.log('Rendering jobs:', jobs);

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

        console.log('Jobs rendered successfully');
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