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
    game.loadLevel();
    game.registerKeyAction('r', () => game.restart());
    game.registerKeyAction('=', () => game.nextLevel());
    game.registerKeyAction('-', () => {
        game.setLevel(game.levelId - 1);
        game.restart();
    });
    game.registerKeyAction('Enter', () => {
        if (game.map.isWin()) game.nextLevel();
    });
    game.listenKeyEvent();
    game.start();
}

main()