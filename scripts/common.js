const sokoban = document.querySelector('canvas#sokoban');
const gameContext = sokoban.getContext('2d');

const gridWidth = 50;
const gridHeight = 50;

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