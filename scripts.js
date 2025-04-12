// Debug function
function debug(message) {
  console.log(`[DEBUG] ${message}`);
}

debug('Script loading...');

// Terminal elements
const terminal = document.getElementById('terminal');
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const terminalTitleBar = document.querySelector('.terminal-title-bar');
const terminalMinimizeBtn = document.querySelector('.terminal-minimize');
const terminalMaximizeBtn = document.querySelector('.terminal-maximize');
const terminalCloseBtn = document.querySelector('.terminal-close');

// GitHub window elements
const githubWindow = document.getElementById('github-window');
const githubContent = document.getElementById('github-content');
const githubTitleBar = document.querySelector('.window-title-bar');
const githubMinimizeBtn = document.querySelector('.window-minimize');
const githubMaximizeBtn = document.querySelector('.window-maximize');
const githubCloseBtn = document.querySelector('.window-close');

// Desktop and menu elements
const githubApp = document.getElementById('github-app');
const cvApp = document.getElementById('cv-app');
const simpleContainer = document.getElementById('simple-container');
const closeBtn = document.getElementById('close-btn');
const pongApp = document.getElementById('pong-app');
const startBtn = document.getElementById('start-btn');
const startMenu = document.getElementById('start-menu');
const terminalMenuItem = document.getElementById('terminal-menu-item');
const githubMenuItem = document.getElementById('github-menu-item');

// Add debug logging if elements aren't found
if (!terminal) debug('Terminal element not found!');
if (!githubWindow) debug('GitHub window element not found!');
if (!githubMenuItem) debug('GitHub menu item not found!');

// Window tracking variables
let isDragging = false;
let currentWindow = null;
let offsetX, offsetY;
let terminalLastPosition = { top: null, left: null, width: '500px', height: '300px' };
let githubLastPosition = { top: null, left: null, width: '600px', height: '400px' };

// Set initial size and position for windows
function setInitialPosition(windowEl, lastPosition, defaultWidth, defaultHeight) {
  // Default size
  windowEl.style.width = defaultWidth;
  windowEl.style.height = defaultHeight;
  
  // Default position (centered)
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  windowEl.style.left = `${(viewportWidth - parseInt(defaultWidth)) / 2}px`;
  windowEl.style.top = `${(viewportHeight - parseInt(defaultHeight)) / 2}px`;
  windowEl.style.bottom = 'auto';
  windowEl.style.right = 'auto';
  
  // Save this position as last valid
  lastPosition.top = windowEl.style.top;
  lastPosition.left = windowEl.style.left;
  lastPosition.width = windowEl.style.width;
  lastPosition.height = windowEl.style.height;
  
  return lastPosition;
}

// Keep windows within viewport bounds
function keepInBounds(windowEl, lastPosition) {
  const rect = windowEl.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let positionChanged = false;
  
  // Ensure window isn't positioned off-screen
  if (rect.right > viewportWidth) {
    windowEl.style.left = `${viewportWidth - rect.width}px`;
    positionChanged = true;
  }
  if (rect.bottom > viewportHeight) {
    windowEl.style.top = `${viewportHeight - rect.height}px`;
    positionChanged = true;
  }
  if (rect.left < 0) {
    windowEl.style.left = '0px';
    positionChanged = true;
  }
  if (rect.top < 0) {
    windowEl.style.top = '0px';
    positionChanged = true;
  }
  
  // Ensure minimum size
  if (rect.width < 300) {
    windowEl.style.width = '300px';
    positionChanged = true;
  }
  if (rect.height < 200) {
    windowEl.style.height = '200px';
    positionChanged = true;
  }
  
  // Ensure maximum size doesn't exceed viewport
  if (rect.width > viewportWidth) {
    windowEl.style.width = `${viewportWidth}px`;
    positionChanged = true;
  }
  if (rect.height > viewportHeight) {
    windowEl.style.height = `${viewportHeight}px`;
    positionChanged = true;
  }
  
  // Save current position as last valid if we have a good position
  if (!positionChanged && windowEl.style.top && windowEl.style.left) {
    lastPosition.top = windowEl.style.top;
    lastPosition.left = windowEl.style.left;
    lastPosition.width = windowEl.style.width;
    lastPosition.height = windowEl.style.height;
  }
  
  return !positionChanged;
}

// Initialize drag functionality for a window
function initDragWindow(windowEl, titleBarEl, lastPositionObj) {
  titleBarEl.addEventListener('mousedown', (e) => {
    // Ignore if clicking controls
    if (e.target.closest('.window-controls') || e.target.closest('.terminal-controls')) {
      return;
    }
    
    isDragging = true;
    currentWindow = windowEl;
    offsetX = e.clientX - windowEl.getBoundingClientRect().left;
    offsetY = e.clientY - windowEl.getBoundingClientRect().top;
    
    // Bring window to front
    windowEl.style.zIndex = 100;
    
    // Prevent text selection during drag
    e.preventDefault();
  });
}

// Initialize window controls
function initWindowControls(windowEl, minimizeBtn, maximizeBtn, closeBtn, lastPositionObj) {
  minimizeBtn.addEventListener('click', () => {
    windowEl.style.display = 'none';
  });
  
  maximizeBtn.addEventListener('click', () => {
    if (!windowEl.classList.contains('maximized')) {
      // Save current position and size for restore
      lastPositionObj.top = windowEl.style.top;
      lastPositionObj.left = windowEl.style.left;
      lastPositionObj.width = windowEl.style.width;
      lastPositionObj.height = windowEl.style.height;
      
      // Maximize
      windowEl.classList.add('maximized');
      windowEl.style.width = '100%';
      windowEl.style.height = '100%';
      windowEl.style.top = '0';
      windowEl.style.left = '0';
    } else {
      // Restore previous position
      windowEl.classList.remove('maximized');
      windowEl.style.width = lastPositionObj.width;
      windowEl.style.height = lastPositionObj.height;
      windowEl.style.top = lastPositionObj.top;
      windowEl.style.left = lastPositionObj.left;
      
      // Ensure restored position is within bounds
      keepInBounds(windowEl, lastPositionObj);
    }
  });
  
  closeBtn.addEventListener('click', () => {
    windowEl.style.display = 'none';
  });
  
  // Add a listener for resize events on the window
  windowEl.addEventListener('mouseup', () => {
    // If we just finished resizing, save valid position
    if (!isDragging && !windowEl.classList.contains('maximized')) {
      keepInBounds(windowEl, lastPositionObj);
    }
  });
}

// Initialize both windows
initDragWindow(terminal, terminalTitleBar, terminalLastPosition);
initDragWindow(githubWindow, githubTitleBar, githubLastPosition);

initWindowControls(terminal, terminalMinimizeBtn, terminalMaximizeBtn, terminalCloseBtn, terminalLastPosition);
initWindowControls(githubWindow, githubMinimizeBtn, githubMaximizeBtn, githubCloseBtn, githubLastPosition);

// Handle mouse movement for all windows
document.addEventListener('mousemove', (e) => {
  if (!isDragging || !currentWindow) return;
  
  // Don't move if maximized
  if (currentWindow.classList.contains('maximized')) return;
  
  const x = e.clientX - offsetX;
  const y = e.clientY - offsetY;
  
  currentWindow.style.left = `${x}px`;
  currentWindow.style.top = `${y}px`;
  currentWindow.style.bottom = 'auto';
  currentWindow.style.right = 'auto';
  
  // Track if position is valid based on which window we're moving
  if (currentWindow === terminal) {
    if (keepInBounds(terminal, terminalLastPosition)) {
      terminalLastPosition.top = terminal.style.top;
      terminalLastPosition.left = terminal.style.left;
      terminalLastPosition.width = terminal.style.width;
      terminalLastPosition.height = terminal.style.height;
    }
  } else if (currentWindow === githubWindow) {
    if (keepInBounds(githubWindow, githubLastPosition)) {
      githubLastPosition.top = githubWindow.style.top;
      githubLastPosition.left = githubWindow.style.left;
      githubLastPosition.width = githubWindow.style.width;
      githubLastPosition.height = githubWindow.style.height;
    }
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging && currentWindow) {
    isDragging = false;
    
    // Ensure we end with a valid position
    if (currentWindow === terminal) {
      keepInBounds(terminal, terminalLastPosition);
    } else if (currentWindow === githubWindow) {
      keepInBounds(githubWindow, githubLastPosition);
    }
    
    currentWindow = null;
  }
});

// Handle window resize events
window.addEventListener('resize', () => {
  if (terminal.style.display === 'block') {
    if (terminal.classList.contains('maximized')) {
      terminal.style.width = '100%';
      terminal.style.height = '100%';
      terminal.style.top = '0';
      terminal.style.left = '0';
    } else {
      keepInBounds(terminal, terminalLastPosition);
    }
  }
  
  if (githubWindow.style.display === 'block') {
    if (githubWindow.classList.contains('maximized')) {
      githubWindow.style.width = '100%';
      githubWindow.style.height = '100%';
      githubWindow.style.top = '0';
      githubWindow.style.left = '0';
    } else {
      keepInBounds(githubWindow, githubLastPosition);
    }
  }
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

// Open GitHub from start menu
githubMenuItem.addEventListener('click', () => {
  startMenu.style.display = 'none';
  openGitHubWindow();
});

// Open terminal with proper positioning
function openTerminal() {
  if (terminalOutput.textContent === '') {
    terminalOutput.textContent = 'Commands available: cls, help, cv, github\n';
  }
  
  // If we don't have a valid position, set initial
  if (!terminalLastPosition.top || !terminalLastPosition.left) {
    setInitialPosition(terminal, terminalLastPosition, '500px', '300px');
  } else {
    // Restore the last valid position
    terminal.style.top = terminalLastPosition.top;
    terminal.style.left = terminalLastPosition.left;
    terminal.style.width = terminalLastPosition.width;
    terminal.style.height = terminalLastPosition.height;
    terminal.style.bottom = 'auto';
    terminal.style.right = 'auto';
  }
  
  // Bring to front
  terminal.style.zIndex = 100;
  
  terminal.classList.remove('maximized');
  terminal.style.display = 'block';
  terminalInput.focus();
  
  // Double check bounds
  keepInBounds(terminal, terminalLastPosition);
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
      openGitHubWindow();
      break;
    default:
      terminalOutput.textContent += `Unknown command: ${command}\n`;
      terminalOutput.textContent += 'Commands available: cls, help, cv, github\n';
  }
}

// GitHub functionality
async function fetchGitHubData() {
  try {
    const response = await fetch('https://api.github.com/users/Teemunl');
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data');
    }
    const userData = await response.json();
    
    // Get repositories data
    const reposResponse = await fetch(userData.repos_url);
    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories data');
    }
    const reposData = await reposResponse.json();
    
    return { user: userData, repos: reposData };
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Opening GitHub as a window instead of simple container
async function openGitHubWindow() {
  // If we don't have a valid position, set initial
  if (!githubLastPosition.top || !githubLastPosition.left) {
    setInitialPosition(githubWindow, githubLastPosition, '600px', '400px');
  } else {
    // Restore the last valid position
    githubWindow.style.top = githubLastPosition.top;
    githubWindow.style.left = githubLastPosition.left;
    githubWindow.style.width = githubLastPosition.width;
    githubWindow.style.height = githubLastPosition.height;
    githubWindow.style.bottom = 'auto';
    githubWindow.style.right = 'auto';
  }
  
  // Bring to front
  githubWindow.style.zIndex = 100;
  
  githubWindow.classList.remove('maximized');
  githubWindow.style.display = 'block';
  
  // Double check bounds
  keepInBounds(githubWindow, githubLastPosition);
  
  // Show loading message
  githubContent.innerHTML = '<div style="text-align: center; padding: 20px;">Loading GitHub data...</div>';
  
  const data = await fetchGitHubData();
  if (data) {
    // Create a more visually appealing GitHub profile
    const { user, repos } = data;
    
    // Format repositories list
    let reposHTML = '';
    if (repos.length > 0) {
      reposHTML = '<h3>Repositories</h3><ul class="repo-list">';
      repos.slice(0, 5).forEach(repo => {
        reposHTML += `
          <li class="repo-item">
            <div class="repo-name">${repo.name}</div>
            <div class="repo-description">${repo.description || 'No description available'}</div>
            <div class="repo-meta">
              <span>⭐ ${repo.stargazers_count}</span>
              <span>🍴 ${repo.forks_count}</span>
              <span>${repo.language || 'No language data'}</span>
            </div>
          </li>
        `;
      });
      reposHTML += '</ul>';
    }
    
    const content = `
      <div class="github-profile">
        <img src="${user.avatar_url}" alt="${user.login}" />
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || ''}</p>
        
        <div class="github-stats">
          <div class="github-stat-item">
            <div class="value">${user.public_repos}</div>
            <div class="label">Repositories</div>
          </div>
          <div class="github-stat-item">
            <div class="value">${user.followers}</div>
            <div class="label">Followers</div>
          </div>
          <div class="github-stat-item">
            <div class="value">${user.following}</div>
            <div class="label">Following</div>
          </div>
        </div>
      </div>
      
      ${reposHTML}
      
      <div class="github-links">
        <a href="${user.html_url}" target="_blank" class="github-link">Visit Profile</a>
        <a href="${user.html_url}?tab=repositories" target="_blank" class="github-link">All Repositories</a>
      </div>
    `;
    
    githubContent.innerHTML = content;
  } else {
    githubContent.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #ff6b6b;">
        <h3>Failed to load GitHub data</h3>
        <p>Please check your internet connection or try again later.</p>
      </div>
    `;
  }
}

// Old GitHub functionality (kept for desktop icon click compatibility)
async function fetchGitHubDataOld() {
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

// Legacy mode for desktop icon clicks
function openGitHubLegacy() {
  openGitHubWindow();
}

// Event listeners
cvApp.addEventListener('click', () => {
  openCV();
});

githubApp.addEventListener('click', () => {
  openGitHubWindow();
});

pongApp.addEventListener('click', () => {
  openPong();
});

closeBtn.addEventListener('click', () => {
  closeApp();
});

function openCV() {
  const pdfRepoUrl = 'https://github.com/Teemunl/teemunl.github.io/raw/main/Liimatta_Teemu.pdf';
  const content = `
    <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(pdfRepoUrl)}&embedded=true" width="100%" height="540" frameborder="0"></iframe>
  `;
  
  document.getElementById('container-content').innerHTML = content;
  simpleContainer.style.display = 'block';
}

function openPong() {
  const content = `
    <iframe src="pong/index.html" width="100%" height="540" frameborder="0"></iframe>
  `;
  document.getElementById('container-content').innerHTML = content;
  simpleContainer.style.display = 'block';
}

function closeApp() {
  document.getElementById('container-content').innerHTML = '';
  simpleContainer.style.display = 'none';
}
