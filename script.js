const apiKey = 'your-secret-api-key'; // Match server.js

// Highlight Active Section on Scroll
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('underline');
        if (link.getAttribute('data-scroll-to') === currentSection) {
            link.classList.add('underline');
        }
    });
}

// Fetch Personal Info
async function fetchPersonalInfo() {
    try {
        const response = await fetch('https://portfolio-api.onrender.com/api/personal-info', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const info = await response.json();
        document.getElementById('personal-name').textContent = `Hi, I'm ${info.name}`;
        document.getElementById('personal-passionate').textContent = info.passionate || 'A Passionate Developer';
        document.getElementById('personal-email').textContent = `Email: ${info.email}`;
        document.getElementById('personal-phone').textContent = `Phone: ${info.phone || 'Not provided'}`;
        const linkedinLink = document.getElementById('personal-linkedin').querySelector('a');
        linkedinLink.href = info.linkedin || '#';
        linkedinLink.textContent = `LinkedIn: ${info.linkedin || 'Not provided'}`;
        linkedinLink.target = '_blank';
        linkedinLink.rel = 'noopener noreferrer';
    } catch (error) {
        console.error('Error fetching personal info:', error);
    }
}

// Fetch Projects
async function fetchProjects() {
    try {
        const response = await fetch('https://portfolio-api.onrender.com/api/projects', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const projects = await response.json();
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = projects.map(project => `
            <div class="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between h-full">
                <div>
                    <h3 class="text-xl font-bold">${project.title}</h3>
                    <p>${project.description}</p>
                </div>
                <br>
                <a href="${project.link}" class="text-blue-500 hover:underline mt-auto">View Project</a>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

// Fetch Contact Info
async function fetchContactInfo() {
    try {
        const response = await fetch('https://portfolio-api.onrender.com/api/personal-info', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const contactInfoDiv = document.getElementById('contact-info');
        contactInfoDiv.innerHTML = `
            <p>Email: ${data.email}</p>
            <p>LinkedIn: <a href="${data.linkedin}" class="underline hover:text-blue-600" target="_blank" rel="noopener noreferrer">${data.linkedin}</a></p>
        `;
    } catch (error) {
        console.error('Error fetching contact info:', error);
    }
}

// Fetch Skills
async function fetchSkills() {
    try {
        const response = await fetch('https://portfolio-api.onrender.com/api/skills', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const skills = await response.json();
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = skills.map(skill => `
            <span class="bg-blue-600 text-white px-4 py-2 rounded">${skill.skill_name}</span>
        `).join('');
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-scroll-to]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('data-scroll-to');
            const section = document.getElementById(sectionId);
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    fetchPersonalInfo();
    fetchProjects();
    fetchContactInfo();
    fetchSkills();

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
});
