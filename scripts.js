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

githubApp.addEventListener('click', () => {
  openApp('https://github.com/Teemunl');
});

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