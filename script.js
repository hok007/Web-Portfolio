
async function fetchProjects() {
    const response = await fetch('http://localhost:3000/api/projects');
    const projects = await response.json();
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = projects.map(project => `
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-bold">${project.title}</h3>
            <p>${project.description}</p>
        </div>
    `).join('');
}
