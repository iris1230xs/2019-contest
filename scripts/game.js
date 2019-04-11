/**
 * 游戏类，控制一局游戏流程
 * @property {Object} keydowns 有哪些按键按下
 * @property {Object} actions 按键按下后的回调函数
 * @property {GameObject} player 玩家
 * @property {GameMap} map 游戏地图
 * @property {number} logicInterval 逻辑循环的辨识id
 * @property {number} refreshInterval 刷新循环的辨识id
 * @property {number} levelId 当前关卡编号
 * @property {number} difficulty 当前关卡难度
 */
class Game {
    /**
     * 构造一局新的游戏
     */
    constructor() {
        this.keydowns = {};
        this.actions = {};
        this.player = null;
        this.map = new GameMap();
        this.logicInterval = -1;
        this.refreshInterval = -1;
        this.levelId = -1;
        this.difficulty = -1;
    }

    /**
     * 设置关卡编号
     * @param {number} id 关卡编号
     */
    setLevel(id) {
        this.levelId = id % gameLevels.length;
        if (this.levelId < 0)
            this.levelId = (this.levelId + gameLevels.length) % gameLevels.length;
    }

    /**
     * 设置难度等级
     * @param {number} diff 难度等级
     */
    setDifficulty(diff) {
        this.difficulty = diff % diffCnt;
        if (this.difficulty < 0)
            this.difficulty = (this.difficulty + diffCnt) % diffCnt;
    }

    /**
     * 设置玩家
     * @param {Player} player 玩家
     */
    setPlayer(player) {
        this.player = player;
    }

    /**
     * 加载关卡
     * @returns {boolean} 是否加载成功
     */
    loadLevel() {
        if (this.player == null || this.levelId < 0) return false;
        this.map.clear();
        const level = gameLevels[this.levelId];
        const rowPad = Math.floor((rowCnt - level.layout.length) / 2);
        const colPad = Math.floor((colCnt - level.layout[0].length) / 2);
        if (rowPad < 0 || colPad < 0) return false;
        for (let i = 0; i < level.layout.length; i++) {
            const row = level.layout[i];
            for (let j = 0; j < row.length; j++) {
                const col = row[j];
                // The bits under the mask is the type of background
                this.map.setBackground(i + rowPad, j + colPad, intToMap[col & layoutMask]);
                if (layoutMask < col) { // Box exist
                    const box = new GameObject('box');
                    this.map.putObject(box, i + rowPad, j + colPad);
                }
            }
        }
        this.map.putObject(this.player, level.initRow + rowPad, level.initCol + colPad);
        this.map.stepLeft = level.diff[this.difficulty]; // Reset step
        return true;
    }

    /**
     * 进入指定关卡
     */
    goToLevel(id) {
        this.setLevel(id);
        this.restart();
    }

    /**
     * 开始一局游戏
     */
    start() {
        // Should bind context here, otherwise the function'll lose context!
        this.logicInterval = setInterval(this.doLogicOnce.bind(this), MSPF * spriteFrame);
        this.refreshInterval = setInterval(this.doRefreshOnce.bind(this), MSPF);
    }

    /**
     * 重新开始一局游戏
     */
    restart() {
        clearInterval(this.logicInterval);
        clearInterval(this.refreshInterval);
        this.loadLevel();
        this.start();
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
        if (this.map.isWin()) {
            this.end('win'); // Check win state first
        } else if (this.map.isLose()) {
            this.end('lose');
        }
    }

    /**
     * 以指定的游戏状态结束游戏
     * @param {string} state 游戏状态
     */
    end(state) {
        clearInterval(this.logicInterval);
        const width = Math.floor(sokoban.width * 3 / 8);
        const height = Math.floor(sokoban.height / 3);
        const x = Math.floor((sokoban.width - width) / 2);
        const y = Math.floor((sokoban.height - height) / 2);
        setTimeout(() => {
            const image = document.querySelector(`img#${state}`);
            gameContext.drawImage(image, x, y, width, height);
        }, MSPF);
        clearInterval(this.refreshInterval);
        this.logicInterval = setInterval(this.doActions.bind(this), MSPF * spriteFrame);
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
     * 执行一轮游戏逻辑的判断
     */
    doLogicOnce() {
        this.checkState();
        this.doActions();
    }

    /**
     * 刷新一次屏幕
     */
    doRefreshOnce() {
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