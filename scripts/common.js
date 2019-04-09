/**
 * 推箱子游戏的canvas元素
 */
const sokoban = document.querySelector('canvas#sokoban');

/**
 * 推箱子游戏的2d context，用于图形绘制
 */
const gameContext = sokoban.getContext('2d');

const imgGameOver = document.querySelector('img#lose');
const imgYouWin = document.querySelector('img#win');

// Width and height in pixels of a single grid
const gridWidth = 50;
const gridHeight = 50;

// The total count of cols and rows of the game map
const colCnt = Math.floor(sokoban.width / gridWidth);
const rowCnt = Math.floor(sokoban.height / gridHeight);

/**
 * 计算给定行号和列号的哈希值
 * @param {number} row 行号
 * @param {number} col 列号
 * @returns {number} 哈希值
 */
function hashCode(row, col) {
    return row << 8 | col;
}