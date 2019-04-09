const intToMap = Object.freeze({
    0: Background.BLANK,
    1: Background.FLOOR,
    2: Background.WALL,
    4: Background.GOAL,
    8: 'box',
});

const level1 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 2, 2, 2, 2, 0],
    [0, 2, 2, 2, 1, 1, 1, 2, 0],
    [0, 2, 1, 1, 4, 9, 4, 2, 0],
    [0, 2, 1, 1, 9, 1, 9, 2, 0],
    [0, 2, 2, 2, 4, 9, 4, 2, 0],
    [0, 0, 0, 2, 1, 1, 1, 2, 0],
    [0, 0, 0, 2, 2, 2, 2, 2, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function loadLevel(gameMap, level) {
    gameMap.clear();
    for (let i = 0; i < level.length; i++) {
        const row = level[i];
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