const Background = Object.freeze({
    WALL: document.querySelector('img#wall'),
    GOAL: document.querySelector('img#goal'),
    FLOOR: document.querySelector('img#floor'),
    BLANK: null
});

class GameMap {
    constructor() {
        this.grids = new Array(rowCnt);
        for (let i = 0; i < this.grids.length; i++) {
            this.grids[i] = new Array(colCnt);
            for (let j = 0; j < this.grids[i].length; j++) {
                // Each grid has two layers, background and game obj
                this.grids[i][j] = [Background.BLANK, null]
            }
        }
    }

    put(object) {
        this.grids[object.row][object.col][1] = object;
    }

    move(object, drow, dcol) {
        const nrow = object.row + drow;
        const ncol = object.col + dcol;
        if (nrow < 0 || rowCnt <= nrow || ncol < 0 || colCnt <= ncol) return false;
        const grid = this.grids[nrow][ncol];
        if (grid[0] === Background.WALL) return false;
        if (grid[1] !== null) return false;
        this.grids[object.row][object.col][1] = null;
        grid[1] = object;
        object.move(drow, dcol);
        return true;
    }

    moveUp(object) {
        this.move(object, -1, 0);
    }

    moveDown(object) {
        this.move(object, 1, 0);
    }

    moveLeft(object) {
        this.move(object, 0, -1);
    }

    moveRight(object) {
        this.move(object, 0, 1);
    }

    push(object, drow, dcol) {
        const nrow = object.row + drow;
        const ncol = object.col + dcol;
        if (nrow < 0 || rowCnt <= nrow || ncol < 0 || colCnt <= ncol) return false;
        const grid = this.grids[nrow][ncol];
        if (grid[0] === Background.WALL) return false;
        if (grid[1] !== null && !this.move(grid[1], drow, dcol)) return false;
        this.grids[object.row][object.col][1] = null;
        grid[1] = object;
        object.move(drow, dcol);
        return true;
    }

    pushUp(object) {
        this.push(object, -1, 0);
    }

    pushDown(object) {
        this.push(object, 1, 0);
    }

    pushLeft(object) {
        this.push(object, 0, -1);
    }

    pushRight(object) {
        this.push(object, 0, 1);
    }

    draw() {
        for (let i = 0; i < this.grids.length; i++) {
            const row = this.grids[i];
            for (let j = 0; j < row.length; j++) {
                const col = row[j];
                this.drawGrid(col, j * gridWidth, i * gridHeight);
            }
        }
    }

    drawGrid(grid, x, y) {
        // Draw background first
        if (grid[0] === null) gameContext.fillRect(x, y, gridWidth, gridHeight);
        else gameContext.drawImage(grid[0], x, y, gridWidth, gridHeight);
        // Draw player or box
        if (grid[1] !== null) grid[1].draw();
    }
}