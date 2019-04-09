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
    loadLevel(game.map, player, gameLevels[0]);
    game.listenKeyEvent();
    game.start();
}

main()