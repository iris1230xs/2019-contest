/**
 * 主要流程
 */
function main() {
    const game = new Game();
    const player = new GameObject('player');
    game.registerAction('w', () => game.map.pushUp(player));
    game.registerAction('a', () => game.map.pushLeft(player));
    game.registerAction('s', () => game.map.pushDown(player));
    game.registerAction('d', () => game.map.pushRight(player));
    let level = levelMedium;
    loadLevel(game.map, player, level);
    game.listen();
    game.start();
}

main()