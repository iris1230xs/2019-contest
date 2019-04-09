const sokoban = document.querySelector('canvas#sokoban');
const gameContext = sokoban.getContext('2d');

const gridWidth = 50;
const gridHeight = 50;

const colCnt = Math.floor(sokoban.width / gridWidth);
const rowCnt = Math.floor(sokoban.height / gridHeight);

function hashCode(row, col) {
    return row << 8 | col;
}