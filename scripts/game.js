class Game {
    constructor() {
        this.keydowns = {};
        this.actions = {};
        this.objects = [];
    }

    start() {
        // Should bind context here, otherwise the function'll lose context!
        const intervalId = setInterval(this.doLoop.bind(this), 1000 / 10);
    }

    clear() {
        gameContext.clearRect(0, 0, sokoban.width, sokoban.height);
    }

    draw() {
        this.objects.forEach(obj => obj.draw());
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
        this.doActions();
        this.clear();
        this.draw();
    }

    registerAction(key, action) {
        this.actions[key] = action;
    }
}