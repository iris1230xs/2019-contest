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
 * 每层的编号
 */
const Layer = Object.freeze({
    BG: 0,
    OBJ: 1
});

/**
 * 游戏地图类，负责物体位置的管理、碰撞检测和游戏状态的检测
 * @property {Array} grids 负责地图所有格子状态的储存
 * @property {Array} objects 存储所有需要绘制的物体
 * @property {Array} goals 储存所有终点的坐标，以便检查胜利状态
 * @property {Object} walls 储存所有无法移动的格子的坐标，以便碰撞和状态的检测
 * @property {number} boxCnt 剩余仍然可以移动的箱子数量
 * @property {number} stepLeft 玩家可以移动的步数
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
        const layerCnt = Object.keys(Layer).length;
        for (let i = 0; i < this.grids.length; i++) {
            for (let j = 0; j < this.grids[i].length; j++) {
                const grid = new Array(layerCnt);
                grid[Layer.BG] = Background.BLANK;
                for (let i = Layer.BG + 1; i < layerCnt; i++) {
                    grid[i] = null;
                }
                this.grids[i][j] = grid;
            }
        }
        this.objects = [];
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
        this.stepLeft = 0;
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
        if (grid[Layer.OBJ] !== null) return false;
        grid[Layer.OBJ] = object;
        object.row = row;
        object.col = col;
        object.x = col * gridWidth;
        object.y = row * gridHeight;
        this.objects.push(object);
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
        const grid = this.grids[row][col];
        if (grid[Layer.BG] === val) return false;
        grid[Layer.BG] = val;
        switch (val) {
            case Background.FLOOR:
                break;
            case Background.WALL:
                this.walls[hashCode(row, col)] = true;
                break;
            case Background.GOAL:
                this.goals.push({row: row, col: col});
                break;
            default:
                break;
        }
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
        if (grid[Layer.OBJ] !== null) return false;
        this.grids[object.row][object.col][Layer.OBJ] = null;
        grid[Layer.OBJ] = object;
        object.move(drow, dcol);
        const isWall = this.checkUnmovable(object);
        if (isWall && object.type === 'box' && grid[Layer.BG] !== Background.GOAL) this.boxCnt--;
        return true;
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
        if (grid[Layer.OBJ] !== null && !this.move(grid[Layer.OBJ], drow, dcol)) return false;
        this.grids[object.row][object.col][Layer.OBJ] = null;
        grid[Layer.OBJ] = object;
        object.move(drow, dcol);
        this.stepLeft--;
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
            const grid = this.grids[goal.row][goal.col];
            if (grid[Layer.OBJ] === null || grid[Layer.OBJ].type !== 'box') return false;
        }
        return true;
    }

    /**
     * 检查游戏是否失败
     * @returns {boolean} 是否失败
     */
    isLose() {
        if (this.stepLeft === 0) return true;
        if (this.boxCnt < this.goals.length) return true;
        return false;
    }

    /**
     * 绘制整个地图
     */
    draw() {
        // Draw background first
        for (let i = 0; i < this.grids.length; i++) {
            const row = this.grids[i];
            for (let j = 0; j < row.length; j++) {
                const grid = row[j];
                const x = j * gridWidth, y = i * gridHeight;
                if (grid[Layer.BG] === Background.BLANK) {
                    gameContext.fillRect(x, y, gridWidth, gridHeight);
                } else {
                    gameContext.drawImage(grid[Layer.BG], x, y, gridWidth, gridHeight);
                }
            }
        }
        // Then draw objects
        this.objects.forEach(object => {
            object.draw();
            // Add green mask for the box on Background.GOAL
            if (object.type !== 'box') return;
            if (object.x !== object.col * gridWidth) return;
            if (this.grids[object.row][object.col][Layer.BG] !== Background.GOAL) return;
            gameContext.fillStyle = 'rgba(0, 200, 0, 0.5)';
            gameContext.fillRect(object.x, object.y, object.width, object.height);
            gameContext.fillStyle = backgroundStyle;
        });
        // At last, draw steps left
        this.drawStepLeft();
    }

    /**
     * 绘制剩余步数
     */
    drawStepLeft() {
        gameContext.fillStyle = 'white';
        gameContext.font = '30px monospace';
        gameContext.fillText(`Steps left: ${this.stepLeft}`, Math.floor(gridWidth / 2), gridHeight);
        gameContext.fillStyle = backgroundStyle;
    }
}