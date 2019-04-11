/**
 * 游戏物体类，定义游戏中可以移动的物体
 */
class GameObject {
    /**
     * 创建新的游戏物体
     * @param {string} type 类型，目前有player和box
     * @param {number} row 行号
     * @param {number} col 列号
     * @param {number} width 图像宽度
     * @param {number} height 图像高度
     */
    constructor(type, row = 0, col = 0, width = gridWidth, height = gridHeight) {
        this.type = type; // 'player' or 'box'
        this.row = row;
        this.col = col;
        this.x = col * gridWidth;
        this.y = row * gridHeight;
        this.width = width;
        this.height = height;
        this.image = document.querySelector('img#' + type);
    }

    /**
     * 按指定方向移动物体
     * @param {number} drow 行号的偏移量
     * @param {number} dcol 列号的偏移量
     */
    async move(drow, dcol) {
        this.row += drow;
        this.col += dcol;
        for (let i = 0; i < spriteFrame - 1; i++) {
            this.x += dcol / spriteFrame * gridWidth;
            this.y += drow / spriteFrame * gridHeight;
            await timer(MSPF / spriteFrame);
        }
        this.x = this.col * gridWidth;
        this.y = this.row * gridHeight;
    }

    /**
     * 在canvas中绘制物体
     */
    draw() {
        gameContext.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}