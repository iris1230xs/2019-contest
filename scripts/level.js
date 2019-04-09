/**
 * layout数组中，每个数字的最低4bit与物体/背景类型的映射关系
 */
const intToMap = Object.freeze({
    0: Background.BLANK, // Means total empty
    1: Background.FLOOR,
    2: Background.WALL,
    4: Background.GOAL,
    8: 'box'
});

const layoutMask = 0x7;

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
            [0, 0, 2, 2, 2, 2, 2]
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
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 0]
        ],
        initRow: 3,
        initCol: 7
    }
];