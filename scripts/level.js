/**
 * layout数组中，每个数字的最低4bit与物体/背景类型的映射关系
 */
const intToMap = Object.freeze({
    0: Background.BLANK, // Means total empty
    1: Background.FLOOR,
    2: Background.WALL,
    4: Background.GOAL,
    8: 'box',
});

const levelMedium = {
    layout: [
        [0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
        [0, 0, 2, 2, 1, 1, 2, 1, 1, 2],
        [0, 0, 2, 1, 1, 1, 2, 9, 1, 2],
        [0, 0, 2, 9, 1, 9, 1, 1, 1, 2],
        [0, 0, 2, 1, 9, 2, 2, 1, 1, 2],
        [2, 2, 2, 1, 9, 1, 2, 1, 2, 2],
        [2, 4, 4, 4, 4, 4, 1, 1, 2, 0],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
    ],
    initRow: 3,
    initCol: 7
};

const levelHard = {
    layout: [
        [0, 0, 2, 2, 2, 2, 2],
        [2, 2, 2, 1, 1, 1, 2],
        [2, 1, 1, 4, 9, 4, 2],
        [2, 1, 1, 9, 1, 9, 2],
        [2, 2, 2, 4, 9, 4, 2],
        [0, 0, 2, 1, 1, 1, 2],
        [0, 0, 2, 2, 2, 2, 2],
    ],
    initRow: 2, // The init row number of the player
    initCol: 1 // Init col number
};

/**
 * 将指定关卡加载进游戏地图
 * @param {GameMap} gameMap 游戏地图
 * @param {GameObject} player 玩家
 * @param {Object} level 关卡
 */
function loadLevel(gameMap, player, level) {
    gameMap.clear();
    const rowPad = Math.floor((rowCnt - level.layout.length) / 2);
    const colPad = Math.floor((colCnt - level.layout[0].length) / 2);
    for (let i = 0; i < level.layout.length; i++) {
        const row = level.layout[i];
        for (let j = 0; j < row.length; j++) {
            const col = row[j];
            // The lower 3 bit is the type of background
            gameMap.set(i + rowPad, j + colPad, intToMap[col & 0x7]);
            if (8 <= col) { // Box exist
                const box = new GameObject('box');
                gameMap.put(box, i + rowPad, j + colPad);
            }
        }
    }
    gameMap.put(player, level.initRow + rowPad, level.initCol + colPad);
}