/**
 * 游戏类，控制一局游戏流程
 * @property {Object} keydowns 有哪些按键按下
 * @property {Object} actions 按键按下后的回调函数
 * @property {GameMap} map 游戏地图
 * @property {number} intervalId interval循环的辨识id
 */
class Game {
    /**
     * 构造一局新的游戏
     */
    constructor() {
        this.keydowns = {};
        this.actions = {};
        this.map = new GameMap();
        this.intervalId = -1;
    }

    /**
     * 开始一局游戏
     */
    start() {
        // Should bind context here, otherwise the function'll lose context!
        this.intervalId = setInterval(this.doLoopOnce.bind(this), 1000 / 10);
    }

    /**
     * 清除canvas中的内容
     */
    clearCanvas() {
        gameContext.clearRect(0, 0, sokoban.width, sokoban.height);
    }

    /**
     * 重绘整个地图
     */
    drawCanvas() {
        this.map.draw();
    }

    /**
     * 检查游戏的输赢状态
     */
    checkState() {
        if (this.map.isLose()) {
            console.error('You lose!');
            clearInterval(this.intervalId);
        } else if (this.map.isWin()) {
            console.log('You win!');
            clearInterval(this.intervalId);
        }
    }

    /**
     * 监听键盘输入事件
     */
    listenKeyEvent() {
        window.addEventListener('keydown', event => this.keydowns[event.key] = true);
    }

    /**
     * 执行已被触发的事件
     */
    doActions() {
        Object.keys(this.actions).filter(key => this.keydowns[key]).forEach(key => {
            this.keydowns[key] = false;
            this.actions[key]();
        })
    }

    /**
     * 执行一轮循环
     */
    doLoopOnce() {
        this.checkState();
        this.doActions();
        this.clearCanvas();
        this.drawCanvas();
    }

    /**
     * 为某个键位注册事件
     * @param {string} key 键位
     * @param {Function} action 回调函数
     */
    registerKeyAction(key, action) {
        this.actions[key] = action;
    }
}