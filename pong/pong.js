// Game elements
let gameState = 'menu'; // menu, start, play
let gameMode = 'single'; // single, multi
let botDifficulty = 'easy'; // easy, medium, hard
let lastTime = 0;
let deltaTime = 0;
let animationId;

// DOM elements
const paddle1 = document.querySelector('.paddle_1');
const paddle2 = document.querySelector('.paddle_2');
const board = document.querySelector('.board');
const ball = document.querySelector('.ball');
const score1 = document.querySelector('.player_1_score');
const score2 = document.querySelector('.player_2_score');
const message = document.querySelector('.message');
const menu = document.querySelector('.menu');

// Menu options
const singlePlayerOption = document.getElementById('single-player');
const multiplayerOption = document.getElementById('multiplayer');
const startGameOption = document.getElementById('start-game');
const easyMode = document.getElementById('easy-mode');
const mediumMode = document.getElementById('medium-mode');
const hardMode = document.getElementById('hard-mode');

// Game settings
let paddleSpeed = 0.6; // Increased for more responsive movement
let botReactionTime = 0.5; // Value between 0 and 1 (lower = faster)
let botErrorMargin = 50; // Pixels of error in prediction (higher = easier to beat)

// Game state
let board_coord = board.getBoundingClientRect();
let paddle1_coord = paddle1.getBoundingClientRect();
let paddle2_coord = paddle2.getBoundingClientRect();
let ball_coord = ball.getBoundingClientRect();
let initial_ball_coord = ball_coord;
let paddle_common = document.querySelector('.paddle').getBoundingClientRect();

// Ball movement
let dx = 5;
let dy = 5;
let dxd = Math.random() < 0.5 ? 0 : 1; // 0 = left, 1 = right
let dyd = Math.random() < 0.5 ? 0 : 1; // 0 = up, 1 = down

// Movement tracking for smooth controls
let keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Initialize the game
function init() {
    // Show menu on start
    menu.style.display = 'block';
    message.style.display = 'none';
    
    // Make sure menu items have proper focus
    singlePlayerOption.classList.add('selected');
    multiplayerOption.classList.remove('selected');
    
    // Set menu visibility
    if (gameState === 'menu') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
    
    // Menu option event listeners
    singlePlayerOption.addEventListener('click', () => {
        setGameMode('single');
    });
    
    multiplayerOption.addEventListener('click', () => {
        setGameMode('multi');
    });
    
    easyMode.addEventListener('click', () => {
        setBotDifficulty('easy');
    });
    
    mediumMode.addEventListener('click', () => {
        setBotDifficulty('medium');
    });
    
    hardMode.addEventListener('click', () => {
        setBotDifficulty('hard');
    });
    
    startGameOption.addEventListener('click', () => {
        startGame();
    });
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
    
    // Initial resize to set everything correctly
    handleResize();
    
    // Center the paddles and ball initially
    resetGame();
}

// Handle window resize
function handleResize() {
    resetBoardCoordinates();
    
    // Adjust game elements based on new size
    const paddleY = (board_coord.height - paddle_common.height) / 2;
    paddle1.style.top = `${paddleY}px`;
    paddle2.style.top = `${paddleY}px`;
    
    // Center ball
    const ballX = (board_coord.width - ball_coord.width) / 2;
    const ballY = (board_coord.height - ball_coord.height) / 2;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    
    // Update coordinates
    paddle1_coord = paddle1.getBoundingClientRect();
    paddle2_coord = paddle2.getBoundingClientRect();
    ball_coord = ball.getBoundingClientRect();
    
    // Adjust bot difficulty based on screen size
    adjustDifficultyForScreenSize();
}

// Adjust difficulty settings based on screen size
function adjustDifficultyForScreenSize() {
    // Scale error margin based on screen size
    const scaleFactor = Math.min(1, board_coord.width / 800);
    
    if (botDifficulty === 'easy') {
        botErrorMargin = 60 * scaleFactor;
    } else if (botDifficulty === 'medium') {
        botErrorMargin = 30 * scaleFactor;
    } else {
        botErrorMargin = 10 * scaleFactor;
    }
    
    // Adjust paddle speed based on screen size - ensure it's not too slow on any screen
    paddleSpeed = 0.8 * Math.max(0.8, Math.min(1.5, 800 / board_coord.width));
}

// Reset coordinates when screen resizes
function resetBoardCoordinates() {
    board_coord = board.getBoundingClientRect();
    paddle1_coord = paddle1.getBoundingClientRect();
    paddle2_coord = paddle2.getBoundingClientRect();
    ball_coord = ball.getBoundingClientRect();
    paddle_common = document.querySelector('.paddle').getBoundingClientRect();
    
    initial_ball_coord = {
        top: board_coord.height / 2 - ball_coord.height / 2,
        right: board_coord.width / 2 + ball_coord.width / 2,
        bottom: board_coord.height / 2 + ball_coord.height / 2,
        left: board_coord.width / 2 - ball_coord.width / 2,
        width: ball_coord.width,
        height: ball_coord.height
    };
}

// Set the game mode
function setGameMode(mode) {
    gameMode = mode;
    if (mode === 'single') {
        singlePlayerOption.classList.add('selected');
        multiplayerOption.classList.remove('selected');
        document.querySelector('.difficulty').style.display = 'block';
    } else {
        singlePlayerOption.classList.remove('selected');
        multiplayerOption.classList.add('selected');
        document.querySelector('.difficulty').style.display = 'block';
    }
}

// Set the bot difficulty
function setBotDifficulty(difficulty) {
    botDifficulty = difficulty;
    easyMode.classList.remove('selected');
    mediumMode.classList.remove('selected');
    hardMode.classList.remove('selected');
    
    if (difficulty === 'easy') {
        easyMode.classList.add('selected');
        botReactionTime = 0.6;
    } else if (difficulty === 'medium') {
        mediumMode.classList.add('selected');
        botReactionTime = 0.4;
    } else {
        hardMode.classList.add('selected');
        botReactionTime = 0.2;
    }
    
    // Apply screen size adjustments
    adjustDifficultyForScreenSize();
}

// Start the game
function startGame() {
    gameState = 'start';
    menu.style.display = 'none';
    message.style.display = 'block';
    message.innerHTML = 'Press Enter to Start';
    
    // Reset paddles and ball
    resetGame();
}

// Reset game elements
function resetGame() {
    // Reset scores if coming from menu
    if (gameState === 'menu') {
        score1.innerHTML = '0';
        score2.innerHTML = '0';
    }
    
    // Center paddles
    const paddleY = (board_coord.height - paddle_common.height) / 2;
    paddle1.style.top = `${paddleY}px`;
    paddle2.style.top = `${paddleY}px`;
    
    // Center ball
    const ballX = (board_coord.width - ball_coord.width) / 2;
    const ballY = (board_coord.height - ball_coord.height) / 2;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
    
    // Update coordinates
    paddle1_coord = paddle1.getBoundingClientRect();
    paddle2_coord = paddle2.getBoundingClientRect();
    ball_coord = ball.getBoundingClientRect();
    
    // Random starting direction
    dx = 5;
    dy = 5;
    dxd = Math.random() < 0.5 ? 0 : 1;
    dyd = Math.random() < 0.5 ? 0 : 1;
    
    // Scale speed based on screen size
    const speedScale = Math.min(1, board_coord.width / 800);
    dx = 5 * speedScale;
    dy = 5 * speedScale;
}

// Handle keydown events
function handleKeyDown(e) {
    if (gameState === 'menu') {
        handleMenuControls(e);
        return;
    }
    
    if (e.key === 'Enter') {
        if (gameState === 'start') {
            gameState = 'play';
            message.innerHTML = 'Game On!';
            requestAnimationFrame(gameLoop);
            setTimeout(() => {
                message.style.display = 'none';
            }, 1000);
        } else if (gameState === 'play') {
            gameState = 'start';
            message.style.display = 'block';
            message.innerHTML = 'Game Paused';
            cancelAnimationFrame(animationId);
        }
    }
    
    if (e.key in keys) {
        keys[e.key] = true;
        e.preventDefault(); // Prevent scrolling with arrow keys
    }
}

// Handle keyup events
function handleKeyUp(e) {
    if (e.key in keys) {
        keys[e.key] = false;
    }
}

// Handle menu navigation with keyboard
function handleMenuControls(e) {
    if (e.key === 'ArrowUp' || e.key === 'w') {
        if (document.activeElement === startGameOption || !document.activeElement.classList.contains('menu-option')) {
            // Focus on game mode
            if (gameMode === 'single') {
                singlePlayerOption.focus();
            } else {
                multiplayerOption.focus();
            }
        } else if (document.activeElement === multiplayerOption) {
            // Focus on single player
            setGameMode('single');
            singlePlayerOption.focus();
        }
        e.preventDefault(); // Prevent scrolling
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        if (document.activeElement === singlePlayerOption) {
            // Focus on multiplayer
            setGameMode('multi');
            multiplayerOption.focus();
        } else if (document.activeElement === multiplayerOption || !document.activeElement.classList.contains('menu-button')) {
            // Focus on start game
            startGameOption.focus();
        }
        e.preventDefault(); // Prevent scrolling
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        // Difficulty selection
        if (document.activeElement === mediumMode || document.activeElement === hardMode) {
            if (document.activeElement === mediumMode) {
                setBotDifficulty('easy');
            } else {
                setBotDifficulty('medium');
            }
        }
        e.preventDefault(); // Prevent scrolling
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        // Difficulty selection
        if (document.activeElement === easyMode || document.activeElement === mediumMode) {
            if (document.activeElement === easyMode) {
                setBotDifficulty('medium');
            } else {
                setBotDifficulty('hard');
            }
        }
        e.preventDefault(); // Prevent scrolling
    } else if (e.key === 'Enter' || e.key === ' ') {
        // Select focused option
        if (document.activeElement === singlePlayerOption) {
            setGameMode('single');
        } else if (document.activeElement === multiplayerOption) {
            setGameMode('multi');
        } else if (document.activeElement === startGameOption) {
            startGame();
        } else if (document.activeElement === easyMode) {
            setBotDifficulty('easy');
        } else if (document.activeElement === mediumMode) {
            setBotDifficulty('medium');
        } else if (document.activeElement === hardMode) {
            setBotDifficulty('hard');
        } else {
            // Default action if nothing is focused
            startGame();
        }
        e.preventDefault(); // Prevent form submission
    }
}

// Main game loop
function gameLoop(timestamp) {
    // Calculate delta time
    if (!lastTime) {
        lastTime = timestamp;
    }
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    // Skip if delta time is too high (tab was inactive)
    if (deltaTime > 100) {
        deltaTime = 16; // Use a reasonable default (around 60fps)
    }
    
    // Update paddle positions
    updatePaddles();
    
    // Bot AI (only in single player mode)
    if (gameMode === 'single') {
        updateBot();
    }
    
    // Update ball position
    updateBall();
    
    // Update coordinates
    paddle1_coord = paddle1.getBoundingClientRect();
    paddle2_coord = paddle2.getBoundingClientRect();
    ball_coord = ball.getBoundingClientRect();
    
    // Continue animation if game is still playing
    if (gameState === 'play') {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Update paddle positions based on keys
function updatePaddles() {
    // Scale movement by delta time for consistent speed
    const movement = paddleSpeed * deltaTime;
    
    // Player 1 (left paddle)
    if (keys.w) {
        movePaddleUp(paddle1, paddle1_coord, movement);
    }
    if (keys.s) {
        movePaddleDown(paddle1, paddle1_coord, movement);
    }
    
    // Player 2 (right paddle) - only in multiplayer mode
    if (gameMode === 'multi') {
        if (keys.ArrowUp) {
            movePaddleUp(paddle2, paddle2_coord, movement);
        }
        if (keys.ArrowDown) {
            movePaddleDown(paddle2, paddle2_coord, movement);
        }
    }
}

// Helper function to move paddle up
function movePaddleUp(paddle, paddleCoord, movement) {
    let newY = paddleCoord.top - movement;
    if (newY < board_coord.top) {
        newY = board_coord.top;
    }
    paddle.style.top = `${newY}px`;
}

// Helper function to move paddle down
function movePaddleDown(paddle, paddleCoord, movement) {
    let newY = paddleCoord.top + movement;
    if (newY + paddle_common.height > board_coord.bottom) {
        newY = board_coord.bottom - paddle_common.height;
    }
    paddle.style.top = `${newY}px`;
}

// Update bot position
function updateBot() {
    // Only move bot if the ball is moving towards it
    if (dxd === 1) {
        // Predict where the ball will be
        let futureBallY = predictBallY();
        
        // Add some randomness based on difficulty
        futureBallY += (Math.random() * botErrorMargin * 2) - botErrorMargin;
        
        // Calculate center of paddle
        const paddleCenter = paddle2_coord.top + (paddle_common.height / 2);
        
        // Only move if ball is far enough from paddle center
        if (Math.abs(paddleCenter - futureBallY) > paddle_common.height / 4) {
            // Scale movement by delta time and reaction time
            const movement = paddleSpeed * deltaTime * (1 - botReactionTime);
            
            if (paddleCenter < futureBallY) {
                // Move down
                movePaddleDown(paddle2, paddle2_coord, movement);
            } else {
                // Move up
                movePaddleUp(paddle2, paddle2_coord, movement);
            }
        }
    }
}

// Predict where the ball will intersect with the right side
function predictBallY() {
    if (dxd !== 1) return ball_coord.y + (ball_coord.height / 2);
    
    // Calculate how many bounces will occur
    let ballX = ball_coord.left;
    let ballY = ball_coord.top + (ball_coord.height / 2);
    let ballDX = dx * (dxd === 0 ? -1 : 1);
    let ballDY = dy * (dyd === 0 ? -1 : 1);
    
    // Calculate time to reach right side
    const distanceX = board_coord.right - paddle_common.width - ballX;
    const timeToReach = distanceX / ballDX;
    
    // Calculate Y position after that time
    let predictedY = ballY + (ballDY * timeToReach);
    
    // Account for bounces
    const boardHeight = board_coord.bottom - board_coord.top;
    predictedY = predictedY % (2 * boardHeight);
    if (predictedY < 0) predictedY += 2 * boardHeight;
    if (predictedY > boardHeight) predictedY = 2 * boardHeight - predictedY;
    
    return predictedY;
}

// Update ball position
function updateBall() {
    // Scale movement by delta time
    const moveX = dx * deltaTime * 0.1 * (dxd === 0 ? -1 : 1);
    const moveY = dy * deltaTime * 0.1 * (dyd === 0 ? -1 : 1);
    
    // Check for collisions with top/bottom
    if (ball_coord.top <= board_coord.top) {
        dyd = 1;
    }
    if (ball_coord.bottom >= board_coord.bottom) {
        dyd = 0;
    }
    
    // Check for collision with paddles
    if (
        ball_coord.left <= paddle1_coord.right &&
        ball_coord.top >= paddle1_coord.top &&
        ball_coord.bottom <= paddle1_coord.bottom
    ) {
        dxd = 1;
        // Increase difficulty slightly
        dx = Math.min(dx + 0.2, 10);
        dy = Math.min(dy + 0.2, 10);
        // Add angle based on where the ball hit the paddle
        calculateBounceAngle(paddle1_coord);
    }
    if (
        ball_coord.right >= paddle2_coord.left &&
        ball_coord.top >= paddle2_coord.top &&
        ball_coord.bottom <= paddle2_coord.bottom
    ) {
        dxd = 0;
        // Increase difficulty slightly
        dx = Math.min(dx + 0.2, 10);
        dy = Math.min(dy + 0.2, 10);
        // Add angle based on where the ball hit the paddle
        calculateBounceAngle(paddle2_coord);
    }
    
    // Check for scoring
    if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
        if (ball_coord.left <= board_coord.left) {
            // Player 2 scores
            score2.innerHTML = parseInt(score2.innerHTML) + 1;
        } else {
            // Player 1 scores
            score1.innerHTML = parseInt(score1.innerHTML) + 1;
        }
        
        // Reset for next round
        gameState = 'start';
        message.style.display = 'block';
        message.innerHTML = 'Press Enter to Continue';
        resetGame();
        return;
    }
    
    // Move the ball
    ball.style.left = `${ball_coord.left + moveX}px`;
    ball.style.top = `${ball_coord.top + moveY}px`;
}

// Calculate new ball direction based on where it hit the paddle
function calculateBounceAngle(paddle_coord) {
    // Get middle of the ball
    const ballMiddle = ball_coord.top + (ball_coord.height / 2);
    // Get middle of the paddle
    const paddleMiddle = paddle_coord.top + (paddle_coord.height / 2);
    // Calculate difference
    const difference = ballMiddle - paddleMiddle;
    // Normalize difference to get a value between -1 and 1
    const normalized = difference / (paddle_coord.height / 2);
    // Adjust dy based on where the ball hit
    dy = 5 + Math.abs(normalized) * 5;
    // Scale by board size
    dy = dy * Math.min(1, board_coord.width / 800);
    // Set direction based on whether ball hit above or below middle
    dyd = normalized > 0 ? 1 : 0;
}

// Return to menu function
function returnToMenu() {
    gameState = 'menu';
    cancelAnimationFrame(animationId);
    menu.style.display = 'block';
    message.style.display = 'none';
    resetGame();
}

// Initialize the game when the window loads
window.onload = init;

// Add Escape key to return to menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (gameState === 'play' || gameState === 'start')) {
        returnToMenu();
    }
});
