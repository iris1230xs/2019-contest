/**
 * 游戏类，控制一局游戏流程
 */
class Game {
    /**
     * 构造一局新的游戏
     */
    constructor() {
        this.keydowns = {};
        this.actions = {};
        this.map = new GameMap();
        this.intervalId = null;
    }

    /**
     * 开始一局游戏
     */
    start() {
        // Should bind context here, otherwise the function'll lose context!
        this.intervalId = setInterval(this.doLoop.bind(this), 1000 / 10);
    }

    /**
     * 清除canvas中的内容
     */
    clear() {
        gameContext.clearRect(0, 0, sokoban.width, sokoban.height);
    }

    /**
     * 重绘整个地图
     */
    draw() {
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
    listen() {
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
    doLoop() {
        this.checkState();
        this.doActions();
        this.clear();
        this.draw();
    }

    /**
     * 为某个键位注册事件
     * @param {string} key 键位
     * @param {Function} action 回调函数
     */
    registerAction(key, action) {
        this.actions[key] = action;
    }
}