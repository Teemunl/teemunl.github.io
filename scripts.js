const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const githubApp = document.getElementById('github-app');
const cvApp = document.getElementById('cv-app');
const simpleContainer = document.getElementById('simple-container');
const closeBtn = document.getElementById('close-btn');
const pongApp = document.getElementById('pong-app');

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
    
      terminalOutput.textContent += 'Commands available: cls, help, cv, github\n';
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
      terminalOutput.textContent += 'Commands available: cls, help, cv, github\n';
  }
}

cvApp.addEventListener('click', () => {
    openCV();
});

closeBtn.addEventListener('click', () => {
  closeApp();
});

function openCV() {
    const pdfRepoUrl = 'https://github.com/Teemunl/teemunl.github.io/raw/main/Liimatta_Teemu.pdf';
    const content = `
      <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(pdfRepoUrl)}&embedded=true" width="100%" height="540" frameborder="0"></iframe>
    `;
    
    document.getElementById('container-content').innerHTML= content;
    simpleContainer.style.display = 'block';
  }
  
  cvApp.addEventListener('click', () => {
    openCV();
  });
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
      <div style="background-color: white;">
      <h2>${"Teemu Liimatta"}</h2>
      <img src="${data.avatar_url}" width="100" height="100">
      <p>Username: ${data.login}</p>
      <p>Public Repositories: ${data.repos_url}</p>
      <p>Followers: ${data.followers}</p>
      <p>Following: ${data.following}</p>
      <a href="${data.html_url}" target="_blank">Visit Profile</a>
    </div>
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

pongApp.addEventListener('click', () => {
  const content = `
  <iframe src="pong/index.html" width="100%" height="540" frameborder="0"></iframe>
  `;
  document.getElementById('container-content').innerHTML = content;
  simpleContainer.style.display = 'block';
});
