class Game {
    constructor() {
        this.canvas = document.querySelector('canvas#sokoban')
        this.context = canvas.getContext('2d')
        this.keydowns = {}
        this.actions = {}
        this.objects = []
    }

    clear() {
        this.context.clearRect(0, 0, canvas.width, canvas.height)
    }

    draw() {
        objects.forEach(obj => obj.draw(this.context))
    }

    listen() {
        window.addEventListener('keydown', event => this.keydowns[event.key] = true)
    }
}