class Game {
    constructor() {
        this.keydowns = {};
        this.actions = {};
        this.map = new GameMap();
        this.intervalId = null;
    }

    start() {
        // Should bind context here, otherwise the function'll lose context!
        this.intervalId = setInterval(this.doLoop.bind(this), 1000 / 10);
    }

    clear() {
        gameContext.clearRect(0, 0, sokoban.width, sokoban.height);
    }

    draw() {
        this.map.draw();
    }

    checkState() {
        if (this.map.isLose()) {
            console.error('You lose!');
            clearInterval(this.intervalId);
        } else if (this.map.isWin()) {
            console.log('You win!');
            clearInterval(this.intervalId);
        }
    }

    listen() {
        window.addEventListener('keydown', event => this.keydowns[event.key] = true);
    }

    doActions() {
        Object.keys(this.actions).filter(key => this.keydowns[key]).forEach(key => {
            this.keydowns[key] = false;
            this.actions[key]();
        })
    }

    doLoop() {
        this.checkState();
        this.doActions();
        this.clear();
        this.draw();
    }

    registerAction(key, action) {
        this.actions[key] = action;
    }
}