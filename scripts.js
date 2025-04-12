// Debug function
function debug(message) {
  console.log(`[DEBUG] ${message}`);
}

debug('Script loading...');

const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const githubApp = document.getElementById('github-app');
const cvApp = document.getElementById('cv-app');
const simpleContainer = document.getElementById('simple-container');
const closeBtn = document.getElementById('close-btn');
const pongApp = document.getElementById('pong-app');
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const terminalMenuItem = document.getElementById('terminal-menu-item');

// Add debug logging if elements aren't found
if (!terminal) debug('Terminal element not found!');
if (!terminalInput) debug('Terminal input not found!');
if (!startBtn) debug('Start button not found!');
if (!startMenu) debug('Start menu not found!');
if (!terminalMenuItem) debug('Terminal menu item not found!');

// Find all elements with terminal-* classes
const terminalTitleBar = document.querySelector('.terminal-title-bar');
const terminalMinimizeBtn = document.querySelector('.terminal-minimize');
const terminalMaximizeBtn = document.querySelector('.terminal-maximize');
const terminalCloseBtn = document.querySelector('.terminal-close');

// Add debug logging if elements aren't found
if (!terminalTitleBar) debug('Terminal title bar not found!');
if (!terminalMinimizeBtn) debug('Terminal minimize button not found!');
if (!terminalMaximizeBtn) debug('Terminal maximize button not found!');
if (!terminalCloseBtn) debug('Terminal close button not found!');

// Make terminal draggable
let isDragging = false;
let offsetX, offsetY;
let lastValidPosition = { top: null, left: null, width: '500px', height: '300px' };

// Set initial size and position for terminal
function setInitialTerminalPosition() {
  // Default size
  terminal.style.width = '500px';
  terminal.style.height = '300px';
  // Default position (centered)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  terminal.style.left = `${(viewportWidth - 500) / 2}px`;
  terminal.style.top = `${(viewportHeight - 300) / 2}px`;
  terminal.style.bottom = 'auto';
  terminal.style.right = 'auto';
  
  // Save this position as last valid
  lastValidPosition = {
    top: terminal.style.top,
    left: terminal.style.left,
    width: terminal.style.width,
    height: terminal.style.height
  };
}

// Keep terminal within viewport bounds
function keepTerminalInBounds() {
  const rect = terminal.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let positionChanged = false;
  
  // Ensure terminal isn't positioned off-screen
  if (rect.right > viewportWidth) {
    terminal.style.left = `${viewportWidth - rect.width}px`;
    positionChanged = true;
  }
  if (rect.bottom > viewportHeight) {
    terminal.style.top = `${viewportHeight - rect.height}px`;
    positionChanged = true;
  }
  if (rect.left < 0) {
    terminal.style.left = '0px';
    positionChanged = true;
  }
  if (rect.top < 0) {
    terminal.style.top = '0px';
    positionChanged = true;
  }
  
  // Ensure minimum size
  if (rect.width < 300) {
    terminal.style.width = '300px';
    positionChanged = true;
  }
  if (rect.height < 200) {
    terminal.style.height = '200px';
    positionChanged = true;
  }
  
  // Ensure maximum size doesn't exceed viewport
  if (rect.width > viewportWidth) {
    terminal.style.width = `${viewportWidth}px`;
    positionChanged = true;
  }
  if (rect.height > viewportHeight) {
    terminal.style.height = `${viewportHeight}px`;
    positionChanged = true;
  }
  
  // Save current position as last valid if we have a good position
  if (!positionChanged && terminal.style.top && terminal.style.left) {
    lastValidPosition = {
      top: terminal.style.top,
      left: terminal.style.left,
      width: terminal.style.width,
      height: terminal.style.height
    };
  }
  
  return !positionChanged;
}

terminalTitleBar.addEventListener('mousedown', (e) => {
  // Ignore if clicking controls
  if (e.target.closest('.terminal-controls')) {
    return;
  }
  
  isDragging = true;
  offsetX = e.clientX - terminal.getBoundingClientRect().left;
  offsetY = e.clientY - terminal.getBoundingClientRect().top;
  
  // Prevent text selection during drag
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  
  // Don't move if maximized
  if (terminal.classList.contains('maximized')) return;
  
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  
  terminal.style.left = `${x}px`;
  terminal.style.top = `${y}px`;
  terminal.style.bottom = 'auto';
  terminal.style.right = 'auto';
  
  // Track if position is valid
  if (keepTerminalInBounds()) {
    lastValidPosition = {
      top: terminal.style.top,
      left: terminal.style.left,
      width: terminal.style.width,
      height: terminal.style.height
    };
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    // Ensure we end with a valid position
    keepTerminalInBounds();
  }
});

// Add a listener for resize events on the terminal itself
terminal.addEventListener('mouseup', () => {
  // If we just finished resizing, save valid position
  if (!isDragging && !terminal.classList.contains('maximized')) {
    keepTerminalInBounds();
  }
});

// Handle window resize events
window.addEventListener('resize', () => {
  if (terminal.style.display === 'block') {
    if (terminal.classList.contains('maximized')) {
      // Update maximized size
      terminal.style.width = '100%';
      terminal.style.height = '100%';
      terminal.style.top = '0';
      terminal.style.left = '0';
    } else {
      // Keep terminal in bounds when window is resized
      keepTerminalInBounds();
    }
  }
});

// Terminal control buttons
terminalMinimizeBtn.addEventListener('click', () => {
  terminal.style.display = 'none';
});

terminalMaximizeBtn.addEventListener('click', () => {
  if (!terminal.classList.contains('maximized')) {
    // Save current position and size for restore
    lastValidPosition = {
      top: terminal.style.top,
      left: terminal.style.left,
      width: terminal.style.width,
      height: terminal.style.height
    };
    
    // Maximize
    terminal.classList.add('maximized');
    terminal.style.width = '100%';
    terminal.style.height = '100%';
    terminal.style.top = '0';
    terminal.style.left = '0';
  } else {
    // Restore previous position
    terminal.classList.remove('maximized');
    terminal.style.width = lastValidPosition.width;
    terminal.style.height = lastValidPosition.height;
    terminal.style.top = lastValidPosition.top;
    terminal.style.left = lastValidPosition.left;
    
    // Ensure restored position is within bounds
    keepTerminalInBounds();
  }
});

terminalCloseBtn.addEventListener('click', () => {
  terminal.style.display = 'none';
});

// Terminal input handling
terminalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = terminalInput.value.trim();
    terminalOutput.textContent += `\n> ${command}\n`;
    processCommand(command);
    terminalInput.value = '';
    
    // Auto-scroll to bottom
    terminalOutput.parentElement.scrollTop = terminalOutput.parentElement.scrollHeight;
  }
});

// Toggle start menu
startBtn.addEventListener('click', () => {
  if (startMenu.style.display === 'none' || startMenu.style.display === '') {
    startMenu.style.display = 'block';
  } else {
    startMenu.style.display = 'none';
  }
});

// Close start menu when clicking elsewhere on the page
document.addEventListener('click', (e) => {
  if (!startBtn.contains(e.target) && !startMenu.contains(e.target)) {
    startMenu.style.display = 'none';
  }
});

// Open terminal from start menu
terminalMenuItem.addEventListener('click', () => {
  startMenu.style.display = 'none';
  openTerminal();
});

// Open terminal with proper positioning
function openTerminal() {
  if (terminalOutput.textContent === '') {
    terminalOutput.textContent = 'Commands available: cls, help, cv, github\n';
  }
  
  // If we don't have a valid position, set initial
  if (!lastValidPosition.top || !lastValidPosition.left) {
    setInitialTerminalPosition();
  } else {
    // Restore the last valid position
    terminal.style.top = lastValidPosition.top;
    terminal.style.left = lastValidPosition.left;
    terminal.style.width = lastValidPosition.width;
    terminal.style.height = lastValidPosition.height;
    terminal.style.bottom = 'auto';
    terminal.style.right = 'auto';
  }
  
  terminal.classList.remove('maximized');
  terminal.style.display = 'block';
  terminalInput.focus();
  
  // Double check bounds
  keepTerminalInBounds();
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
