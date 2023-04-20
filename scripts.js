const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const githubApp = document.getElementById('github-app');
const cvApp = document.getElementById('cv-app');
const simpleContainer = document.getElementById('simple-container');
const closeBtn = document.getElementById('close-btn');

terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = terminalInput.value.trim();
    terminalOutput.textContent += `\n> ${command}\n`;
    processCommand(command);
    terminalInput.value = '';
  }
});

function toggleTerminal() {
  if (terminal.style.display === 'none') {
    terminal.style.display = 'block';
  } else {
    terminal.style.display = 'none';
  }
}

function processCommand(command) {
  switch (command.toLowerCase()) {
    case 'cls':
      terminalOutput.textContent = '';
      break;
    case 'help':
      terminalOutput.textContent += 'Commands available: cls, help, cv, github\n';
      break;
    case 'cv':
      window.open('Liimatta_Teemu.pdf', '_blank');
      break;
    case 'github':
      window.open('https://github.com/Teemunl', '_blank');
      break;
    default:
      terminalOutput.textContent += `Unknown command: ${command}\n`;
  }
}

cvApp.addEventListener('click', () => {
  openApp('Liimatta_Teemu.pdf');
});

closeBtn.addEventListener('click', () => {
  closeApp();
});

function openApp(url) {
        const content = `
          <iframe src="${url}" width="100%" height="100%" frameborder="0"></iframe>
        `;
        
        document.getElementById('container-content').innerHTML = content;
        simpleContainer.style.display = 'block';
}


function closeApp() {
        document.getElementById('container-content').innerHTML = '';
        simpleContainer.style.display = 'none';
}

async function fetchGitHubData() {
    try {
      const response = await fetch('https://api.github.com/users/Teemunl');
      if (!response.ok) {
        throw new Error('Failed to fetch GitHub data');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
async function openGitHub() {
    const data = await fetchGitHubData();
    if (data) {
      const content = `
        <h2>${data.name}</h2>
        <img src="${data.avatar_url}" width="100" height="100">
        <p>Username: ${data.login}</p>
        <p>Public Repositories: ${data.repos}</p>
        <p>Followers: ${data.followers}</p>
        <p>Following: ${data.following}</p>
        <a href="${data.html_url}" target="_blank">Visit Profile</a>
      `;
  
      document.getElementById('container-content').innerHTML = content;
      simpleContainer.style.display = 'block';
    } else {
      alert('Failed to fetch GitHub data. Please try again later.');
    }
  }

githubApp.addEventListener('click', () => {
    openGitHub();
});