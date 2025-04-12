import { TimeTravelPacman } from './TimeTravelPacman';

// Create and initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = 800;
    canvas.height = 600;
    document.body.appendChild(canvas);

    // Add some basic styling
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #000;
            font-family: 'Arial', sans-serif;
        }
        #gameCanvas {
            border: 2px solid #333;
            background-color: #000;
            margin-bottom: 20px;
        }
        .controls-container {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        .game-button {
            background-color: #333;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }
        .game-button:hover {
            background-color: #555;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }
        .game-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
        }
        .game-button::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, 0.5);
            opacity: 0;
            border-radius: 100%;
            transform: scale(1, 1) translate(-50%);
            transform-origin: 50% 50%;
        }
        .game-button:focus:not(:active)::after {
            animation: ripple 1s ease-out;
        }
        @keyframes ripple {
            0% {
                transform: scale(0, 0);
                opacity: 0.5;
            }
            100% {
                transform: scale(20, 20);
                opacity: 0;
            }
        }
        .active {
            background-color: #4CAF50;
        }
        .instructions {
            color: white;
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);

    // Create and start the game
    const game = new TimeTravelPacman('gameCanvas');
    game.start();

    // Create control buttons
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    
    // Pause/Resume button
    const pauseButton = document.createElement('button');
    pauseButton.className = 'game-button';
    pauseButton.textContent = 'Pause';
    pauseButton.addEventListener('click', () => {
        game.togglePause();
        pauseButton.textContent = game.isPaused() ? 'Resume' : 'Pause';
        pauseButton.classList.toggle('active', game.isPaused());
    });
    
    // Change Time Period button
    const timeButton = document.createElement('button');
    timeButton.className = 'game-button';
    timeButton.textContent = 'Change Time';
    timeButton.addEventListener('click', () => {
        game.changeTimePeriod();
        // Add a visual feedback animation
        timeButton.classList.add('active');
        setTimeout(() => timeButton.classList.remove('active'), 300);
    });
    
    // Reset button
    const resetButton = document.createElement('button');
    resetButton.className = 'game-button';
    resetButton.textContent = 'Reset Game';
    resetButton.addEventListener('click', () => {
        // Reset the game
        game.resetGame();
        
        // Reset UI elements
        pauseButton.textContent = 'Pause';
        pauseButton.classList.remove('active');
        
        // Add a visual feedback animation for the reset button
        resetButton.classList.add('active');
        setTimeout(() => resetButton.classList.remove('active'), 300);
    });
    
    // Add buttons to container
    controlsContainer.appendChild(pauseButton);
    controlsContainer.appendChild(timeButton);
    controlsContainer.appendChild(resetButton);
    
    // Add container to body
    document.body.appendChild(controlsContainer);
    
    // Add instructions
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.innerHTML = `
        <p>Use arrow keys to move Pacman</p>
        <p>Collect time crystals to gain special abilities</p>
    `;
    document.body.appendChild(instructions);
}); 