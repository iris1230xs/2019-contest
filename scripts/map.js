/**
 * 背景类型和相应的HTMLImgElement之间的映射关系
 */
const Background = Object.freeze({
    WALL: document.querySelector('img#wall'),
    GOAL: document.querySelector('img#goal'),
    FLOOR: document.querySelector('img#floor'),
    BLANK: null
});

/**
 * 游戏地图类，负责物体位置的管理、碰撞检测和游戏状态的检测
 * @property {Array} grids 负责地图所有格子状态的储存
 * @property {Array} goals 储存所有终点的坐标，以便检查胜利状态
 * @property {Object} walls 储存所有无法移动的格子的坐标，以便碰撞和状态的检测
 * @property {number} boxCnt 剩余仍然可以移动的箱子数量
 */
class GameMap {
    /**
     * 初始化一张空白的游戏地图
     */
    constructor() {
        this.grids = new Array(rowCnt);
        for (let i = 0; i < this.grids.length; i++) {
            this.grids[i] = new Array(colCnt);
        }
        this.clear();
    }

    /**
     * 清空地图，回到初始状态
     */
    clear() {
        // Fill whole map with blank
        for (let i = 0; i < this.grids.length; i++) {
            for (let j = 0; j < this.grids[i].length; j++) {
                this.grids[i][j] = [Background.BLANK, null]
            }
        }
        this.goals = [];
        this.walls = {};
        // Treat the edge of the map as a wall
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

    /**
     * 将某个GameObject放置到地图的指定位置
     * @param {GameObject} object 物体
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {boolean} 是否放置成功
     */
    putObject(object, row = object.row, col = object.col) {
        const grid = this.grids[row][col];
        if (grid[1] !== null) return false;
        grid[1] = object;
        object.row = row;
        object.col = col;
        if (object.type === 'box') this.boxCnt++;
        return true;
    }

    /**
     * 设置地图指定位置的背景值
     * @param {number} row 行号
     * @param {number} col 列号
     * @param {HTMLImageElement} val 背景值
     * @returns {boolean} 是否设置成功
     */
    setBackground(row, col, val) {
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

    /**
     * 将地图指定位置设置为墙
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {boolean} 是否设置成功
     */
    setWall(row, col) {
        const grid = this.grids[row][col];
        if (grid[0] === Background.WALL) return false;
        grid[0] = Background.WALL;
        this.walls[hashCode(row, col)] = true;
        return true;
    }

    /**
     * 将地图指定位置设置为终点
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {boolean} 是否设置成功
     */
    setGoal(row, col) {
        const grid = this.grids[row][col];
        if (grid[0] === Background.GOAL) return false;
        grid[0] = Background.GOAL;
        this.goals.push([row, col]);
        return true;
    }

    /**
     * 将地图指定位置设置为地面
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {boolean} 是否设置成功
     */
    setFloor(row, col) {
        const grid = this.grids[row][col];
        if (grid[0] === Background.FLOOR) return false;
        grid[0] = Background.FLOOR;
        return true;
    }

    /**
     * 检查某个游戏物体是否无法移动，如果无法移动，加入walls字典
     * @param {GameObject} object 物体
     * @returns {boolean} 是否无法移动
     */
    checkUnmovable(object) {
        const up = this.walls[hashCode(object.row - 1, object.col)];
        const down = this.walls[hashCode(object.row + 1, object.col)];
        const left = this.walls[hashCode(object.row, object.col - 1)];
        const right = this.walls[hashCode(object.row, object.col + 1)];
        if (object.type === 'player') return up && down && left && right;
        if ((up && right) || (right && down) || (down && left) || (left && up)) {
            this.walls[hashCode(object.row, object.col)] = true;
            return true;
        }
        return false;
    }

    /**
     * 以给定的方向将指定物体在地图中移动，并检查物体是否无法再次移动
     * @param {GameObject} object 物体
     * @param {number} drow 行号的变化量
     * @param {number} dcol 列号的变化量
     * @returns {boolean} 是否移动成功
     */
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
        if (isWall && object.type === 'box' && grid[0] !== Background.GOAL) this.boxCnt--;
        return true;
    }

    /**
     * 将指定物体向上移动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否移动成功
     */
    moveUp(object) {
        return this.move(object, -1, 0);
    }

    /**
     * 将指定物体向下移动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否移动成功
     */
    moveDown(object) {
        return this.move(object, 1, 0);
    }

    /**
     * 将指定物体向左移动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否移动成功
     */
    moveLeft(object) {
        return this.move(object, 0, -1);
    }

    /**
     * 将指定物体向右移动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否移动成功
     */
    moveRight(object) {
        return this.move(object, 0, 1);
    }

    /**
     * 以给定的方向在地图中推动指定物体（此方法至多只能同时推动两个物体）
     * @param {GameObject} object 物体
     * @param {number} drow 行号的变化量
     * @param {number} dcol 列号的变化量
     * @returns {boolean} 是否推动成功
     */
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

    /**
     * 将指定物体向上推动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否推动成功
     */
    pushUp(object) {
        return this.push(object, -1, 0);
    }

    /**
     * 将指定物体向下推动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否推动成功
     */
    pushDown(object) {
        return this.push(object, 1, 0);
    }

    /**
     * 将指定物体向左推动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否推动成功
     */
    pushLeft(object) {
        return this.push(object, 0, -1);
    }

    /**
     * 将指定物体向右推动
     * @param {GameObject} object 物体
     * @returns {boolean} 是否推动成功
     */
    pushRight(object) {
        return this.push(object, 0, 1);
    }

    /**
     * 检查游戏是否胜利
     * @returns {boolean} 是否胜利
     */
    isWin() {
        if (this.boxCnt < this.goals.length) return false;
        for (const goal of this.goals) {
            const grid = this.grids[goal[0]][goal[1]];
            if (grid[1] === null || grid[1].type !== 'box') return false;
        }
        return true;
    }

    /**
     * 检查游戏是否失败
     * @returns {boolean} 是否失败
     */
    isLose() {
        if (this.boxCnt < this.goals.length) return true;
        return false;
    }

    /**
     * 绘制整个地图
     */
    draw() {
        for (let i = 0; i < this.grids.length; i++) {
            const row = this.grids[i];
            for (let j = 0; j < row.length; j++) {
                const col = row[j];
                this.drawGrid(col, j * gridWidth, i * gridHeight);
            }
        }
    }

    /**
     * 在给定的坐标上绘制某个格子
     * @param {Array} grid 格子
     * @param {number} x 横坐标
     * @param {number} y 纵坐标
     */
    drawGrid(grid, x, y) {
        // Draw background first
        if (grid[0] === null) gameContext.fillRect(x, y, gridWidth, gridHeight);
        else gameContext.drawImage(grid[0], x, y, gridWidth, gridHeight);
        // Draw player or box
        if (grid[1] !== null) {
            grid[1].draw();
            // If reaches goal, cover the box with green mask
            if (grid[1].type !== 'box' || grid[0] !== Background.GOAL) return;
            gameContext.fillStyle = 'rgba(0, 200, 0, 0.5)';
            gameContext.fillRect(x, y, grid[1].width, grid[1].height);
            gameContext.fillStyle = 'black';
        }
    }
}