// Fetch Personal Info
async function fetchPersonalInfo() {
    try {
        const response = await fetch('http://localhost:3000/api/personal-info', {
            headers: { 'Authorization': 'Bearer your-secret-api-key' }
        });
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
        const response = await fetch('http://localhost:3000/api/projects', {
            headers: { 'Authorization': 'Bearer your-secret-api-key' }
        });
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
        const response = await fetch('http://localhost:3000/api/personal-info', {
            headers: { 'Authorization': 'Bearer your-secret-api-key' }
        });
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
        const response = await fetch('http://localhost:3000/api/skills', {
            headers: { 'Authorization': 'Bearer your-secret-api-key' }
        });
        const skills = await response.json();
        const skillsList = document.getElementById('skills-list');
        skillsList.innerHTML = skills.map(skill => `
            <span class="bg-blue-600 text-white px-4 py-2 rounded">${skill.skill_name}</span>
        `).join('');
    } catch (error) {
        console.error('Error fetching skills:', error);
    }
}
