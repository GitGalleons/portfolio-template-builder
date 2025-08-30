
        // Project management
        let projects = [];
        let skills = [];

        function addProject() {
            const projectId = Date.now();
            const projectHtml = `
                <div class="project-item" id="project-${projectId}">
                    <button class="remove-btn" onclick="removeProject(${projectId})">
                        <i class="bi bi-x"></i>
                    </button>
                    <div class="mb-2">
                        <input type="text" class="form-control mb-2" placeholder="Project Title" id="projectTitle-${projectId}">
                        <textarea class="form-control mb-2" placeholder="Project Description" rows="2" id="projectDesc-${projectId}"></textarea>
                        <input type="url" class="form-control" placeholder="Project URL (optional)" id="projectUrl-${projectId}">
                    </div>
                </div>
            `;
            $('#projectsList').append(projectHtml);
            projects.push(projectId);
        }

        function removeProject(id) {
            $(`#project-${id}`).fadeOut(300, function() {
                $(this).remove();
            });
            projects = projects.filter(p => p !== id);
        }

        function addSkill() {
            const skillInput = $('#skillInput');
            const skill = skillInput.val().trim();
            
            if (skill && !skills.includes(skill)) {
                skills.push(skill);
                const skillHtml = `
                    <span class="skill-tag" id="skill-${skill.replace(/\s/g, '-')}">
                        ${skill}
                        <i class="bi bi-x" style="cursor: pointer; margin-left: 5px;" onclick="removeSkill('${skill}')"></i>
                    </span>
                `;
                $('#skillsList').append(skillHtml);
                skillInput.val('');
            }
        }

        function removeSkill(skill) {
            $(`#skill-${skill.replace(/\s/g, '-')}`).fadeOut(300, function() {
                $(this).remove();
            });
            skills = skills.filter(s => s !== skill);
        }

        // Allow Enter key to add skills
        $('#skillInput').on('keypress', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                addSkill();
            }
        });

        function getFormData() {
            const projectsData = projects.map(id => ({
                title: $(`#projectTitle-${id}`).val() || 'Untitled Project',
                description: $(`#projectDesc-${id}`).val() || 'No description provided',
                url: $(`#projectUrl-${id}`).val() || '#'
            }));

            return {
                fullName: $('#fullName').val() || 'Your Name',
                title: $('#title').val() || 'Professional',
                email: $('#email').val() || '',
                github: $('#github').val() || '',
                about: $('#about').val() || 'Welcome to my portfolio!',
                projects: projectsData,
                skills: skills,
                theme: $('#colorTheme').val()
            };
        }

        function getThemeStyles(theme) {
            const themes = {
                'gradient-purple': 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
                'gradient-blue': 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);',
                'gradient-green': 'background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);',
                'gradient-sunset': 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);',
                'dark': 'background: linear-gradient(135deg, #232526 0%, #414345 100%);'
            };
            return themes[theme] || themes['gradient-purple'];
        }

        function generatePortfolioHTML(data) {
            const themeStyle = getThemeStyles(data.theme);
            
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Rajdhani', sans-serif;
            ${themeStyle}
            min-height: 100vh;
            color: white;
            overflow-x: hidden;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        header {
            text-align: center;
            padding: 80px 20px;
            animation: fadeInDown 1s ease-out;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        h1 {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .subtitle {
            font-size: 1.5rem;
            font-weight: 300;
            opacity: 0.9;
        }

        .contact-info {
            margin-top: 20px;
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
        }

        .contact-info a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s;
        }

        .contact-info a:hover {
            opacity: 1;
        }

        section {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            margin: 30px auto;
            max-width: 1000px;
            animation: fadeIn 1s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        h2 {
            font-size: 2rem;
            margin-bottom: 20px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.3);
            padding-bottom: 10px;
        }

        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .project-card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .project-card h3 {
            margin-bottom: 10px;
            color: white;
        }

        .project-card p {
            opacity: 0.9;
            line-height: 1.6;
        }

        .project-card a {
            display: inline-block;
            margin-top: 10px;
            color: white;
            text-decoration: none;
            border: 1px solid white;
            padding: 5px 15px;
            border-radius: 5px;
            transition: background 0.3s;
        }

        .project-card a:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }

        .skill-tag {
            background: rgba(255, 255, 255, 0.2);
            padding: 8px 20px;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            font-weight: 500;
        }

        footer {
            text-align: center;
            padding: 30px;
            opacity: 0.7;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.5rem;
            }
            
            section {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.fullName}</h1>
            <p class="subtitle">${data.title}</p>
            <div class="contact-info">
                ${data.email ? `<a href="mailto:${data.email}">✉ ${data.email}</a>` : ''}
                ${data.github ? `<a href="https://github.com/${data.github}" target="_blank">⚡ github.com/${data.github}</a>` : ''}
            </div>
        </header>

        ${data.about ? `
        <section>
            <h2>About Me</h2>
            <p>${data.about}</p>
        </section>
        ` : ''}

        ${data.projects.length > 0 ? `
        <section>
            <h2>Projects</h2>
            <div class="projects-grid">
                ${data.projects.map(project => `
                    <div class="project-card">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        ${project.url && project.url !== '#' ? `<a href="${project.url}" target="_blank">View Project →</a>` : ''}
                    </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        ${data.skills.length > 0 ? `
        <section>
            <h2>Skills</h2>
            <div class="skills-container">
                ${data.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </section>
        ` : ''}

        <footer>
            <p>© ${new Date().getFullYear()} ${data.fullName}. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>`;
        }

        function previewPortfolio() {
            const data = getFormData();
            const html = generatePortfolioHTML(data);
            
            const previewFrame = document.getElementById('previewFrame');
            const previewModal = document.getElementById('previewModal');
            
            previewModal.style.display = 'block';
            previewFrame.srcdoc = html;
        }

        function closePreview() {
            document.getElementById('previewModal').style.display = 'none';
        }

        function generatePortfolio() {
            const data = getFormData();
            const html = generatePortfolioHTML(data);
            
            // Show loading
            $('#loading').show();
            
            // Simulate processing
            setTimeout(() => {
                // Create blob and download
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'portfolio.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                $('#loading').hide();
                
                // Show success message
                alert('Portfolio generated successfully! Check your downloads folder.');
            }, 1000);
        }

        // Add sample project on load
        $(document).ready(function() {
            addProject();
        });

        // Close preview on ESC key
        $(document).keydown(function(e) {
            if (e.key === "Escape") {
                closePreview();
            }
        });