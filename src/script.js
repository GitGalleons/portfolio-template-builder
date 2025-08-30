/* Portfolio Builder logic using jQuery 3.7.0
   - dynamic projects
   - tags for skills
   - generate standalone portfolio HTML (preview + download)
*/

(function($){
  const $projectsList = $('#projects-list');
  const $addProjectBtn = $('#add-project');
  const $skillInput = $('#skill-input');
  const $addSkillBtn = $('#add-skill-btn');
  const $skillsTags = $('#skills-tags');
  const $previewFrame = $('#preview-frame');
  const $btnGenerate = $('#btn-generate, #btn-generate-2');
  const $btnDownload = $('#btn-download, #btn-generate-2');
  const $btnPreview = $('#btn-preview');
  const $btnOpenNew = $('#btn-open-new');
  const $githubSteps = $('#github-steps');
  const $btnGithubSteps = $('#btn-github-steps');
  const $toggleResponsive = $('#toggle-responsive');

  // State
  let skills = [];
  let projectIdCounter = 0;
  let lastBlobUrl = null;

  function createProjectItem(title = '', desc = '') {
    projectIdCounter += 1;
    const id = `project-${projectIdCounter}`;
    const $item = $(`
      <div class="project-item" data-id="${id}">
        <div class="d-flex mb-2">
          <input type="text" class="form-control form-control-sm me-2 project-title" placeholder="Project title" value="${escapeHtml(title)}">
          <div class="project-controls">
            <button type="button" class="btn btn-sm btn-outline-danger remove-project"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        <textarea class="form-control form-control-sm project-desc" rows="2" placeholder="Short project description">${escapeHtml(desc)}</textarea>
      </div>
    `);
    $projectsList.append($item);
  }

  function escapeHtml(text){
    if(!text) return '';
    return $('<div>').text(text).html();
  }

  function renderSkills() {
    $skillsTags.empty();
    skills.forEach((s, idx) => {
      const $t = $(`<span class="tag">${escapeHtml(s)} <i class="bi bi-x remove" data-index="${idx}"></i></span>`);
      $skillsTags.append($t);
    });
  }

  function collectFormData() {
    const name = $('#fullName').val().trim() || 'Your Name';
    const about = $('#about').val().trim() || '';
    const email = $('#contactEmail').val().trim() || '';
    const projects = [];
    $projectsList.find('.project-item').each(function(){
      const title = $(this).find('.project-title').val().trim();
      const desc = $(this).find('.project-desc').val().trim();
      if(title || desc) projects.push({ title, desc });
    });
    return { name, about, email, projects, skills: [...skills] };
  }

  function generatePortfolioHtml(data) {
    // Build a clean, standalone HTML. Use CDN links for bootstrap & fonts.
    const skillChips = data.skills.map(s => `<span class="skill-chip">${escapeHtml(s)}</span>`).join('\n');
    const projectsHtml = data.projects.map(p => `
      <div class="card project-card mb-3 shadow-sm">
        <div class="card-body">
          <h5 class="card-title mb-1">${escapeHtml(p.title)}</h5>
          <p class="card-text mb-0">${escapeHtml(p.desc)}</p>
        </div>
      </div>
    `).join('\n');

    // Inline minimal CSS for portability
    const inlineCss = `
      :root{ --accent: #7c5cff; font-family: 'Rajdhani',sans-serif; color:#0b1220; }
      body{ font-family: 'Rajdhani', sans-serif; background: linear-gradient(180deg,#eef2ff,#f8fbff); margin:0; padding:24px; }
      .site-wrap{ max-width:980px; margin:0 auto; }
      header{ display:flex; align-items:center; gap:16px; margin-bottom:20px; }
      .avatar{ width:84px; height:84px; border-radius:14px; background:linear-gradient(135deg,var(--accent),#4a86ff); display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:28px; }
      h1{ margin:0; font-size:28px; color:#071130; }
      .muted{ color:#41516a; }
      .skills { display:flex; gap:8px; flex-wrap:wrap; margin:8px 0; }
      .skill-chip{ background:rgba(124,92,255,0.12); color:#1b1f3b; padding:6px 10px; border-radius:999px; font-weight:600; }
      .project-card{ border-radius:12px; border:1px solid rgba(11,17,32,0.05); }
      footer{ margin-top:28px; color:#41516a; font-size:14px; }
      @media (max-width:600px){ body{ padding:12px } header{ gap:12px } h1{ font-size:22px } }
    `;

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(data.name)} — Portfolio</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${inlineCss}</style>
</head>
<body>
  <div class="site-wrap">
    <header>
      <div class="avatar">${escapeHtml(getInitials(data.name))}</div>
      <div>
        <h1>${escapeHtml(data.name)}</h1>
        <div class="muted">${escapeHtml(data.about || 'A brief introduction goes here.')}</div>
      </div>
    </header>

    <section>
      <h4>Projects</h4>
      <div class="projects-list">${projectsHtml || '<p class="muted">No projects yet.</p>'}</div>
    </section>

    <section class="mt-3">
      <h4>Skills</h4>
      <div class="skills">${skillChips || '<span class="muted">No skills listed.</span>'}</div>
    </section>

    <section class="mt-4">
      <h4>Contact</h4>
      <p class="muted">Email: <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email || 'your@email.com')}</a></p>
    </section>

    <footer>
      Generated with Portfolio Builder • ${new Date().getFullYear()}
    </footer>
  </div>
</body>
</html>`;
    return html;
  }

  function getInitials(name) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if(parts.length === 0) return 'P';
    if(parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length-1].charAt(0)).toUpperCase();
  }

  function updatePreview(html) {
    revokeLastBlob();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    lastBlobUrl = url;
    $previewFrame.attr('src', url);
  }

  function revokeLastBlob(){
    if(lastBlobUrl){
      try{ URL.revokeObjectURL(lastBlobUrl); }catch(e){}
      lastBlobUrl = null;
    }
  }

  function downloadHtml(html, filename = 'portfolio.html') {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 2000);
  }

  // ---- Event bindings ----
  $addProjectBtn.on('click', function(){
    createProjectItem('', '');
  });

  $projectsList.on('click', '.remove-project', function(){
    $(this).closest('.project-item').remove();
  });

  $addSkillBtn.on('click', function(){
    const v = $skillInput.val().trim();
    if(v) {
      skills.push(v);
      $skillInput.val('');
      renderSkills();
    }
  });

  $skillInput.on('keypress', function(e){
    if(e.key === 'Enter'){
      e.preventDefault();
      $addSkillBtn.click();
    }
  });

  $skillsTags.on('click', '.remove', function(){
    const idx = $(this).data('index');
    if(typeof idx === 'number') {
      skills.splice(idx, 1);
      renderSkills();
    }
  });

  // Generate and preview
  $btnGenerate.on('click', function(){
    const data = collectFormData();
    const html = generatePortfolioHtml(data);
    updatePreview(html);
    // show a quick toast? simple alert:
    // We won't use alert to keep UI clean — show a brief highlight on preview frame
    $previewFrame.parent().addClass('border-primary');
    setTimeout(()=> $previewFrame.parent().removeClass('border-primary'), 700);
  });

  // Download current generated HTML (if none generated, generate first)
  $btnDownload.on('click', function(){
    const data = collectFormData();
    const html = generatePortfolioHtml(data);
    downloadHtml(html, `${(data.name || 'portfolio').toLowerCase().replace(/\s+/g,'-')}.html`);
  });

  $btnPreview.on('click', function(){
    const data = collectFormData();
    const html = generatePortfolioHtml(data);
    updatePreview(html);
  });

  $btnOpenNew.on('click', function(){
    if(!lastBlobUrl){
      // generate first
      const data = collectFormData();
      const html = generatePortfolioHtml(data);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // schedule revoke later
      setTimeout(()=> URL.revokeObjectURL(url), 30000);
    } else {
      window.open(lastBlobUrl, '_blank');
    }
  });

  $btnGithubSteps.on('click', function(){
    $githubSteps.toggleClass('d-none');
  });

  $toggleResponsive.on('change', function(){
    if($(this).is(':checked')){
      $previewFrame.css({ width: '100%' });
    } else {
      $previewFrame.css({ width: '420px' });
    }
  });

  // Initialize with a single project slot
  $(function init(){
    createProjectItem('My Awesome Project', 'A short description of this project.');
    renderSkills();
    $toggleResponsive.trigger('change');
  });

  // Clean up blob URL on unload
  $(window).on('unload', function(){
    revokeLastBlob();
  });

})(jQuery);