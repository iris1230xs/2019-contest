class GameObject {
    constructor(id, col = 0, row = 0, width = gridWidth, height = gridHeight) {
        this.col = col;
        this.row = row;
        this.width = width;
        this.height = height;
        this.image = document.querySelector('img#' + id);
    }

    move(drow, dcol) {
        this.row += drow;
        this.col += dcol;
    }

    draw() {
        gameContext.drawImage(this.image, this.col * gridWidth, this.row * gridHeight, this.width, this.height);
    }
}