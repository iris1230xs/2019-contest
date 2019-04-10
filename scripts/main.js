/**
 * 主要流程
 */
function main() {
    const game = new Game();

    const player = new GameObject('player');
    game.registerKeyAction('w', () => game.map.pushUp(player));
    game.registerKeyAction('a', () => game.map.pushLeft(player));
    game.registerKeyAction('s', () => game.map.pushDown(player));
    game.registerKeyAction('d', () => game.map.pushRight(player));
    game.setPlayer(player);

    game.setLevel(0);
    game.setDifficulty(0);
    game.loadLevel();

    game.registerKeyAction('r', () => game.restart());
    game.registerKeyAction('=', () => game.goToLevel(game.levelId + 1));
    game.registerKeyAction('-', () => game.goToLevel(game.levelId - 1));
    game.registerKeyAction('Enter', () => game.map.isWin() && game.goToLevel(game.levelId + 1));

    const levelSel = initLevelSelector();
    levelSel.onchange = () => game.goToLevel(levelSel.value);

    const diffSel = document.querySelector('select#diff');
    diffSel.onchange = () => {
        game.setDifficulty(diffSel.value);
        game.restart();
    };

    const reset = document.querySelector('button#reset');
    reset.onclick = () => game.restart();

    game.listenKeyEvent();
    game.start();
}

/**
 * 初始化关卡选择器
 * @returns {Element} 选关下拉菜单
 */
function initLevelSelector() {
    const selector = document.querySelector('select#level');
    for (let i = 0; i < gameLevels.length; i++) {
        const option = new Option('level ' + (i + 1), i);
        selector.appendChild(option);
    }
    return selector;
}

main()