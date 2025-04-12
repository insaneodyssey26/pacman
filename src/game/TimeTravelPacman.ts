import { GameState, TimePeriod, Position, Pacman, Ghost, TimeCrystal } from './types';

export class TimeTravelPacman {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gameState: GameState;
    private lastTime: number = 0;
    private readonly GRID_SIZE = 20;
    private readonly CELL_SIZE = 30;

    constructor(canvasId: string) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.gameState = this.initializeGameState();
        this.setupEventListeners();
    }

    private initializeGameState(): GameState {
        return {
            currentPeriod: 'medieval',
            score: 0,
            lives: 3,
            timeCrystals: this.generateTimeCrystals(),
            ghosts: this.createGhosts(),
            pacman: this.createPacman(),
            isGameOver: false,
            isPaused: false
        };
    }

    private createPacman(): Pacman {
        return {
            position: { x: 10, y: 10 },
            direction: { x: 1, y: 0 },
            speed: 5,
            mouthAngle: 0.2,
            timePeriod: 'medieval',
            timeEffects: [],
            score: 0,
            update: (deltaTime: number) => this.updatePacman(deltaTime),
            draw: (ctx: CanvasRenderingContext2D) => this.drawPacman(ctx)
        };
    }

    private createGhosts(): Ghost[] {
        const ghostTypes: TimePeriod[] = ['prehistoric', 'medieval', 'future'];
        return ghostTypes.map((period, index) => ({
            position: { x: 5 + index * 5, y: 5 },
            direction: { x: 1, y: 0 },
            speed: 4,
            timePeriod: period,
            state: 'chase',
            uniqueAbility: () => this.activateGhostAbility(period),
            update: (deltaTime: number) => this.updateGhost(deltaTime, period),
            draw: (ctx: CanvasRenderingContext2D) => this.drawGhost(ctx, period)
        }));
    }

    private generateTimeCrystals(): TimeCrystal[] {
        const crystals: TimeCrystal[] = [];
        const effects: Array<{ type: 'slow' | 'speed' | 'reverse', duration: number, magnitude: number }> = [
            { type: 'slow', duration: 5, magnitude: 0.5 },
            { type: 'speed', duration: 5, magnitude: 2 },
            { type: 'reverse', duration: 3, magnitude: 1 }
        ];

        for (let x = 0; x < this.canvas.width / this.CELL_SIZE; x++) {
            for (let y = 0; y < this.canvas.height / this.CELL_SIZE; y++) {
                if (Math.random() < 0.1) {
                    crystals.push({
                        position: { x, y },
                        collected: false,
                        timeEffect: effects[Math.floor(Math.random() * effects.length)],
                        update: () => {},
                        draw: (ctx: CanvasRenderingContext2D) => this.drawTimeCrystal(ctx, x, y)
                    });
                }
            }
        }
        return crystals;
    }

    private setupEventListeners(): void {
        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    private handleKeyPress(event: KeyboardEvent): void {
        if (this.gameState.isPaused) return;

        const directions: { [key: string]: Position } = {
            'ArrowUp': { x: 0, y: -1 },
            'ArrowDown': { x: 0, y: 1 },
            'ArrowLeft': { x: -1, y: 0 },
            'ArrowRight': { x: 1, y: 0 }
        };

        if (directions[event.key]) {
            this.gameState.pacman.direction = directions[event.key];
        }
    }

    public changeTimePeriod(): void {
        const periods: TimePeriod[] = ['prehistoric', 'medieval', 'future'];
        const currentIndex = periods.indexOf(this.gameState.currentPeriod);
        this.gameState.currentPeriod = periods[(currentIndex + 1) % periods.length];
        this.gameState.pacman.timePeriod = this.gameState.currentPeriod;
    }

    public togglePause(): void {
        this.gameState.isPaused = !this.gameState.isPaused;
    }

    public isPaused(): boolean {
        return this.gameState.isPaused;
    }

    public resetGame(): void {
        // Reset the game state
        this.gameState = this.initializeGameState();
        
        // Reset the last time to prevent large deltaTime on first frame
        this.lastTime = performance.now();
        
        // Clear any existing game over or pause state
        this.gameState.isGameOver = false;
        this.gameState.isPaused = false;
        
        // Reset the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Redraw the initial state
        this.draw();
        
        // Restart the game loop
        this.start();
    }

    private updatePacman(deltaTime: number): void {
        const pacman = this.gameState.pacman;
        pacman.position.x += pacman.direction.x * pacman.speed * deltaTime;
        pacman.position.y += pacman.direction.y * pacman.speed * deltaTime;
        pacman.mouthAngle = 0.2 + Math.sin(Date.now() * 0.01) * 0.1;

        // Keep Pacman within bounds
        pacman.position.x = Math.max(0, Math.min(this.canvas.width / this.CELL_SIZE - 1, pacman.position.x));
        pacman.position.y = Math.max(0, Math.min(this.canvas.height / this.CELL_SIZE - 1, pacman.position.y));
    }

    private updateGhost(deltaTime: number, period: TimePeriod): void {
        const ghost = this.gameState.ghosts.find(g => g.timePeriod === period)!;
        ghost.position.x += ghost.direction.x * ghost.speed * deltaTime;
        ghost.position.y += ghost.direction.y * ghost.speed * deltaTime;

        // Simple ghost AI - move towards Pacman
        const dx = this.gameState.pacman.position.x - ghost.position.x;
        const dy = this.gameState.pacman.position.y - ghost.position.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            ghost.direction = { x: Math.sign(dx), y: 0 };
        } else {
            ghost.direction = { x: 0, y: Math.sign(dy) };
        }
    }

    private drawPacman(ctx: CanvasRenderingContext2D): void {
        const pacman = this.gameState.pacman;
        ctx.save();
        ctx.translate(
            pacman.position.x * this.CELL_SIZE + this.CELL_SIZE / 2,
            pacman.position.y * this.CELL_SIZE + this.CELL_SIZE / 2
        );
        ctx.rotate(Math.atan2(pacman.direction.y, pacman.direction.x));
        
        ctx.beginPath();
        ctx.arc(0, 0, this.CELL_SIZE / 2, pacman.mouthAngle, Math.PI * 2 - pacman.mouthAngle);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.restore();
    }

    private drawGhost(ctx: CanvasRenderingContext2D, period: TimePeriod): void {
        const ghost = this.gameState.ghosts.find(g => g.timePeriod === period)!;
        ctx.save();
        ctx.translate(
            ghost.position.x * this.CELL_SIZE + this.CELL_SIZE / 2,
            ghost.position.y * this.CELL_SIZE + this.CELL_SIZE / 2
        );

        // Different ghost colors for different time periods
        const colors = {
            prehistoric: '#FF6B6B',
            medieval: '#4ECDC4',
            future: '#9B59B6'
        };

        ctx.fillStyle = colors[period];
        ctx.beginPath();
        ctx.arc(0, 0, this.CELL_SIZE / 2, Math.PI, 0);
        ctx.lineTo(this.CELL_SIZE / 2, this.CELL_SIZE / 2);
        ctx.lineTo(-this.CELL_SIZE / 2, this.CELL_SIZE / 2);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    private drawTimeCrystal(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        const crystal = this.gameState.timeCrystals.find(
            c => c.position.x === x && c.position.y === y && !c.collected
        );

        if (crystal) {
            ctx.save();
            ctx.translate(
                x * this.CELL_SIZE + this.CELL_SIZE / 2,
                y * this.CELL_SIZE + this.CELL_SIZE / 2
            );

            // Draw crystal with different colors based on effect
            const colors = {
                slow: '#4169E1',
                speed: '#FFD700',
                reverse: '#FF4500'
            };

            ctx.fillStyle = colors[crystal.timeEffect.type];
            ctx.beginPath();
            ctx.moveTo(0, -this.CELL_SIZE / 3);
            ctx.lineTo(this.CELL_SIZE / 3, 0);
            ctx.lineTo(0, this.CELL_SIZE / 3);
            ctx.lineTo(-this.CELL_SIZE / 3, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    private activateGhostAbility(period: TimePeriod): void {
        const ghost = this.gameState.ghosts.find(g => g.timePeriod === period)!;
        switch (period) {
            case 'prehistoric':
                // Prehistoric ghost can create temporary walls
                break;
            case 'medieval':
                // Medieval ghost can teleport
                ghost.position = {
                    x: Math.random() * (this.canvas.width / this.CELL_SIZE),
                    y: Math.random() * (this.canvas.height / this.CELL_SIZE)
                };
                break;
            case 'future':
                // Future ghost can phase through walls
                break;
        }
    }

    public start(): void {
        this.gameLoop();
    }

    private gameLoop(currentTime: number = 0): void {
        if (this.gameState.isGameOver) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (!this.gameState.isPaused) {
            this.update(deltaTime);
        }

        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }

    private update(deltaTime: number): void {
        this.gameState.pacman.update(deltaTime);
        this.gameState.ghosts.forEach(ghost => ghost.update(deltaTime));
        this.checkCollisions();
    }

    private checkCollisions(): void {
        // Check crystal collisions
        this.gameState.timeCrystals.forEach(crystal => {
            if (!crystal.collected &&
                Math.abs(this.gameState.pacman.position.x - crystal.position.x) < 0.5 &&
                Math.abs(this.gameState.pacman.position.y - crystal.position.y) < 0.5) {
                crystal.collected = true;
                this.gameState.pacman.timeEffects.push(crystal.timeEffect);
                this.gameState.score += 100;
            }
        });

        // Check ghost collisions
        this.gameState.ghosts.forEach(ghost => {
            if (Math.abs(this.gameState.pacman.position.x - ghost.position.x) < 0.5 &&
                Math.abs(this.gameState.pacman.position.y - ghost.position.y) < 0.5) {
                if (ghost.state === 'frightened') {
                    // Ghost is eaten
                    this.gameState.score += 200;
                } else {
                    // Pacman loses a life
                    this.gameState.lives--;
                    if (this.gameState.lives <= 0) {
                        this.gameState.isGameOver = true;
                    }
                }
            }
        });
    }

    private draw(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw dynamic background with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1e3c72'); // Start color
        gradient.addColorStop(1, '#2a5298'); // End color
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid with a modern design
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x < this.canvas.width; x += this.CELL_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.CELL_SIZE) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }

        // Draw game objects
        this.gameState.timeCrystals.forEach(crystal => crystal.draw(this.ctx));
        this.gameState.ghosts.forEach(ghost => ghost.draw(this.ctx));
        this.gameState.pacman.draw(this.ctx);

        // Draw UI
        this.drawUI();
    }

    private drawUI(): void {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.gameState.score}`, 10, 30);
        this.ctx.fillText(`Lives: ${this.gameState.lives}`, 10, 60);
        this.ctx.fillText(`Period: ${this.gameState.currentPeriod}`, 10, 90);

        if (this.gameState.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }

        if (this.gameState.isGameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
        }
    }
}