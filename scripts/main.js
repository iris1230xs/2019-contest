function main() {
    const game = new Game();
    const player = new GameObject('player');
    game.registerAction('w', () => game.map.pushUp(player));
    game.registerAction('a', () => game.map.pushLeft(player));
    game.registerAction('s', () => game.map.pushDown(player));
    game.registerAction('d', () => game.map.pushRight(player));
    loadLevel(game.map, levelHard);
    game.map.put(player, levelHard.initRow, levelHard.initRow);
    game.listen();
    game.start();
}

main()