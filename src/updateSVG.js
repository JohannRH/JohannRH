const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;  // Usa un token personal de GitHub

async function fetchGitHubData() {
    const username = 'JohannRH';  // Tu nombre de usuario en GitHub

    const headers = {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
    };

    // Obtener contribuciones a repositorios
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`, { headers });
    const repos = await reposResponse.json();

    const totalContributions = repos.reduce((total, repo) => total + repo.watchers_count, 0); // Solo ejemplo, puedes agregar más lógica

    // Obtener commits recientes
    const commitsResponse = await fetch(`https://api.github.com/users/${username}/events/public`, { headers });
    const commits = await commitsResponse.json();

    // Filtrar eventos de tipo commit
    const commitEvents = commits.filter(event => event.type === 'PushEvent');
    const totalCommits = commitEvents.length;

    // Actualizar el archivo SVG
    const svgPath = path.join(__dirname, 'updated-capy.svg');
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    const updatedSvgContent = svgContent.replace('<tspan x="580" y="560" class="value">                 . Video Games</tspan>', 
        `<tspan x="580" y="560" class="value">                 . Contribuciones: ${totalContributions}</tspan>
         <tspan x="580" y="580" class="value">                 . Commits: ${totalCommits}</tspan>`);
    
    // Guardar el SVG actualizado
    fs.writeFileSync(svgPath, updatedSvgContent);
}

fetchGitHubData().catch(console.error);
