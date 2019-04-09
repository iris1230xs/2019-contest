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
        }
        this.clear();
    }

    clear() {
        for (let i = 0; i < this.grids.length; i++) {
            for (let j = 0; j < this.grids[i].length; j++) {
                this.grids[i][j] = [Background.BLANK, null]
            }
        }
        this.goals = [];
        this.walls = {};
        for (let i = 0; i < colCnt; i++) {
            this.walls[hashCode(-1, i)] = true
            this.walls[hashCode(rowCnt, i)] = true
        }
        for (let i = 0; i < rowCnt; i++) {
            this.walls[hashCode(i, -1)] = true;
            this.walls[hashCode(i, colCnt)] = true;
        }
        this.boxCnt = 0;
    }

    put(object, row = object.row, col = object.col) {
        const grid = this.grids[row][col];
        if (grid[1] !== null) return false;
        grid[1] = object;
        object.row = row;
        object.col = col;
        if (object.type === 'box') this.boxCnt++;
        return true;
    }

    set(row, col, val) {
        switch (val) {
            case Background.FLOOR:
                this.setFloor(row, col);
                break;
            case Background.WALL:
                this.setWall(row, col);
                break;
            case Background.GOAL:
                this.setGoal(row, col);
                break;
            default:
                break;
        }
    }

    setWall(row, col) {
        const grid = this.grids[row][col];
        if (grid[0] === Background.WALL) return false;
        grid[0] = Background.WALL;
        this.walls[hashCode(row, col)] = true;
        return true;
    }

    setGoal(row, col) {
        const grid = this.grids[row][col];
        if (grid[0] === Background.GOAL) return false;
        grid[0] = Background.GOAL;
        this.goals.push([row, col]);
        return true;
    }

    setFloor(row, col) {
        const grid = this.grids[row][col];
        if (grid[0] === Background.FLOOR) return false;
        grid[0] = Background.FLOOR;
        return true;
    }

    checkUnmovable(object) {
        const up = this.walls[hashCode(object.row - 1, object.col)];
        const down = this.walls[hashCode(object.row + 1, object.col)];
        const left = this.walls[hashCode(object.row, object.col - 1)];
        const right = this.walls[hashCode(object.row, object.col + 1)];
        if ((up && right) || (right && down) || (down && left) || (left && up)) {
            this.walls[hashCode(object.row, object.col)] = true;
            return true;
        }
        return false;
    }

    move(object, drow, dcol) {
        const nrow = object.row + drow;
        const ncol = object.col + dcol;
        if (this.walls[hashCode(nrow, ncol)] === true) return false;
        const grid = this.grids[nrow][ncol];
        if (grid[1] !== null) return false;
        this.grids[object.row][object.col][1] = null;
        grid[1] = object;
        object.move(drow, dcol);
        const isWall = this.checkUnmovable(object);
        if (isWall && object.type === 'box') this.boxCnt--;
        return true;
    }

    moveUp(object) {
        return this.move(object, -1, 0);
    }

    moveDown(object) {
        return this.move(object, 1, 0);
    }

    moveLeft(object) {
        return this.move(object, 0, -1);
    }

    moveRight(object) {
        return this.move(object, 0, 1);
    }

    push(object, drow, dcol) {
        const nrow = object.row + drow;
        const ncol = object.col + dcol;
        if (this.walls[hashCode(nrow, ncol)] === true) return false;
        const grid = this.grids[nrow][ncol];
        if (grid[1] !== null && !this.move(grid[1], drow, dcol)) return false;
        this.grids[object.row][object.col][1] = null;
        grid[1] = object;
        object.move(drow, dcol);
        return true;
    }

    pushUp(object) {
        return this.push(object, -1, 0);
    }

    pushDown(object) {
        return this.push(object, 1, 0);
    }

    pushLeft(object) {
        return this.push(object, 0, -1);
    }

    pushRight(object) {
        return this.push(object, 0, 1);
    }

    isWin() {
        if (this.boxCnt < this.goals.length) return false;
        for (const goal of this.goals) {
            const grid = this.grids[goal[0]][goal[1]];
            if (grid[1] === null || grid[1].type !== 'box') return false;
        }
        return true;
    }

    isLose() {
        if (this.boxCnt < this.goals.length) return true;
        return false;
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