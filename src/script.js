$(document).ready(function() {
    // Add project input fields dynamically
    $('#addProject').click(function() {
        const projectEntry = `
            <div class="project-entry mb-3">
                <input type="text" class="form-control mb-2" placeholder="Project Title" required>
                <textarea class="form-control" placeholder="Project Description" rows="3" required></textarea>
            </div>`;
        $('#projectsContainer').append(projectEntry);
    });

    // Handle form submission
    $('#portfolioForm').submit(function(e) {
        e.preventDefault();
        generatePortfolio();
    });

    // Handle preview button
    $('#previewBtn').click(function() {
        generatePortfolio(true);
    });

    function generatePortfolio(isPreview = false) {
        const fullName = $('#fullName').val();
        const skills = $('#skills').val().split(',').map(s => s.trim());
        const projects = [];
        $('.project-entry').each(function() {
            const title = $(this).find('input').val();
            const description = $(this).find('textarea').val();
            if (title && description) {
                projects.push({ title, description });
            }
        });

        // Generate portfolio HTML
        const portfolioHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName}'s Portfolio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <style>
        body {
            font-family: 'Rajdhani', sans-serif;
            background: linear-gradient(135deg, #74ebd5, #acb6e5);
            min-height: 100vh;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            padding: 2rem;
        }
        .section-title {
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container my-5">
        <header class="glass-card mb-4 text-center">
            <h1>${fullName}</h1>
            <p>Web Developer | Portfolio</p>
        </header>

        <section class="glass-card mb-4">
            <h2 class="section-title">About Me</h2>
            <p>Hello! I'm ${fullName}, a passionate developer creating innovative solutions.</p>
        </section>

        <section class="glass-card mb-4">
            <h2 class="section-title">Projects</h2>
            ${projects.map(project => `
                <div class="mb-3">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                </div>
            `).join('')}
        </section>

        <section class="glass-card mb-4">
            <h2 class="section-title">Skills</h2>
            <ul>
                ${skills.map(skill => `<li>${skill}</li>`).join('')}
            </ul>
        </section>

        <section class="glass-card">
            <h2 class="section-title">Contact</h2>
            <p>Email: example@${fullName.toLowerCase().replace(' ', '')}.com</p>
            <p>GitHub: github.com/${fullName.toLowerCase().replace(' ', '')}</p>
        </section>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

        if (isPreview) {
            // Show preview in iframe
            $('#previewContainer').removeClass('d-none');
            const previewFrame = $('#previewFrame')[0];
            previewFrame.contentWindow.document.open();
            previewFrame.contentWindow.document.write(portfolioHtml);
            previewFrame.contentWindow.document.close();
        } else {
            // Trigger download
            const blob = new Blob([portfolioHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            $('#downloadLink').attr('href', url);
            $('#downloadLink')[0].click();
            URL.revokeObjectURL(url);
        }
    }
});