/**
 * 游戏物体类，定义游戏中可以移动的物体
 */
class GameObject {
    /**
     * 创建新的游戏物体
     * @param {string} type 类型，目前有player和box
     * @param {*} row 行号
     * @param {*} col 列号
     * @param {*} width 图像宽度
     * @param {*} height 图像高度
     */
    constructor(type, row = 0, col = 0, width = gridWidth, height = gridHeight) {
        this.type = type;
        this.row = row;
        this.col = col;
        this.width = width;
        this.height = height;
        this.image = document.querySelector('img#' + type);
    }

    move(drow, dcol) {
        this.row += drow;
        this.col += dcol;
    }

    draw() {
        gameContext.drawImage(this.image, this.col * gridWidth, this.row * gridHeight, this.width, this.height);
    }
}