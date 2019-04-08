class Box {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.width = 50;
        this.height = 50;
        this.image = document.querySelector('img#box');
    }

    moveUp() {
        this.y -= this.height;
    }

    moveDown() {
        this.y += this.height;
    }

    moveLeft() {
        this.x -= this.width;
    }

    moveRight() {
        this.x += this.width;
    }

    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}