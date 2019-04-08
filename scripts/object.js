class GameObject {
    constructor(id, x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.image = document.querySelector('img#' + id);
    }

    moveUp() {
        const y = this.y - this.height;
        if (0 <= y) this.y = y;
    }

    moveDown() {
        const y = this.y + this.height;
        if (y + this.height <= sokoban.height) this.y = y;
    }

    moveLeft() {
        const x = this.x - this.width;
        if (0 <= x) this.x = x;
    }

    moveRight() {
        const x = this.x + this.width;
        if (x + this.width <= sokoban.width) this.x = x;
    }

    draw() {
        gameContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}