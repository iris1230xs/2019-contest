class Game {
    constructor() {
        this.canvas = document.querySelector('canvas#sokoban');
        this.context = this.canvas.getContext('2d');
        this.keydowns = {};
        this.actions = {};
        this.objects = [];
    }

    start() {
        // Should bind context here, otherwise the function'll lose context!
        const intervalId = setInterval(this.doLoop.bind(this), 1000 / 10);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw() {
        this.objects.forEach(obj => obj.draw(this.context));
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