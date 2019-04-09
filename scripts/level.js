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

/**
 * 所有游戏关卡
 */
const gameLevels = [
    {
        layout: [
            [2, 2, 2, 2, 2],
            [2, 4, 1, 1, 2],
            [2, 1, 9, 1, 2],
            [2, 1, 1, 1, 2],
            [2, 2, 2, 2, 2]
        ],
        initRow: 1, // The init row number of the player
        initCol: 1 // Init col number
    },
    {
        layout: [
            [0, 0, 2, 2, 2, 2, 2],
            [2, 2, 2, 1, 1, 1, 2],
            [2, 1, 1, 4, 9, 4, 2],
            [2, 1, 1, 9, 1, 9, 2],
            [2, 2, 2, 4, 9, 4, 2],
            [0, 0, 2, 1, 1, 1, 2],
            [0, 0, 2, 2, 2, 2, 2],
        ],
        initRow: 2,
        initCol: 1
    },
    {
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
    }
];

/**
 * 将指定关卡加载进游戏地图
 * @param {GameMap} gameMap 游戏地图
 * @param {GameObject} player 玩家
 * @param {Object} level 关卡
 * @returns {boolean} 是否加载成功
 */
function loadLevel(gameMap, player, level) {
    gameMap.clear();
    const rowPad = Math.floor((rowCnt - level.layout.length) / 2);
    const colPad = Math.floor((colCnt - level.layout[0].length) / 2);
    if (rowPad < 0 || colPad < 0) return false;
    for (let i = 0; i < level.layout.length; i++) {
        const row = level.layout[i];
        for (let j = 0; j < row.length; j++) {
            const col = row[j];
            // The lower 3 bit is the type of background
            gameMap.setBackground(i + rowPad, j + colPad, intToMap[col & 0x7]);
            if (8 <= col) { // Box exist
                const box = new GameObject('box');
                gameMap.putObject(box, i + rowPad, j + colPad);
            }
        }
    }
    gameMap.putObject(player, level.initRow + rowPad, level.initCol + colPad);
    return true;
}