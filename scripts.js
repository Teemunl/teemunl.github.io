const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const githubApp = document.getElementById('github-app');
const cvApp = document.getElementById('cv-app');
const simpleContainer = document.getElementById('simple-container');
const containerIframe = document.getElementById('container-iframe');
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
  containerIframe.src = url;
  simpleContainer.style.display = 'block';
}

function closeApp() {
  containerIframe.src = '';
  simpleContainer.style.display = 'none';
}

async function openGitHub() {
    const response = await fetch('https://api.github.com/Teemunl');
    const data = await response.json;


    const content = `
    <h2> ${data.name}</h2>
    <img src= "${data.avatar_url}" width ="100" height "100">
    <p> Username: ${data.login} </p>
    <p> Public Repositories: ${data.repos} </p>
    <p> Username: ${data.followers} </p>
    <p> Username: ${data.following} </p>
    <a href= "${data.html_url}" target = "_blank"> Visit Profile</a>
    `;

    document.getElementById('container-content').innerHTML = content;
    simpleContainer.style.display = 'block';
}

githubApp.addEventListener('click', () => {
    openGitHub();
});