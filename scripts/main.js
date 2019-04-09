function main() {
    const game = new Game();
    loadLevel(game.map, level1);
    const player = new GameObject('player');
    game.map.put(player, 3, 2);
    game.registerAction('w', () => game.map.pushUp(player));
    game.registerAction('a', () => game.map.pushLeft(player));
    game.registerAction('s', () => game.map.pushDown(player));
    game.registerAction('d', () => game.map.pushRight(player));
    game.listen();
    game.start();
}

main()