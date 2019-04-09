const intToMap = Object.freeze({
    0: Background.BLANK,
    1: Background.FLOOR,
    2: Background.WALL,
    4: Background.GOAL,
    8: 'box',
});

const levelHard = {
    layout: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 2, 2, 2, 2, 0],
        [0, 2, 2, 2, 1, 1, 1, 2, 0],
        [0, 2, 1, 1, 4, 9, 4, 2, 0],
        [0, 2, 1, 1, 9, 1, 9, 2, 0],
        [0, 2, 2, 2, 4, 9, 4, 2, 0],
        [0, 0, 0, 2, 1, 1, 1, 2, 0],
        [0, 0, 0, 2, 2, 2, 2, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    initRow: 3,
    initCol: 2
};

/**
 * 将指定关卡加载进游戏地图
 * @param {GameMap} gameMap 游戏地图
 * @param {Object} level 关卡
 */
function loadLevel(gameMap, level) {
    gameMap.clear();
    for (let i = 0; i < level.layout.length; i++) {
        const row = level.layout[i];
        for (let j = 0; j < row.length; j++) {
            const col = row[j];
            gameMap.set(i, j, intToMap[col & 0x7]);
            if (8 <= col) {
                const box = new GameObject('box');
                gameMap.put(box, i, j);
            }
        }
    }
}