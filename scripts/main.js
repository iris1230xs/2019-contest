function main() {
    const game = new Game();
    const gameMap = new GameMap();
    const box = new GameObject('box', 5, 5);
    const player = new GameObject('player', 4, 4);
    gameMap.put(box);
    gameMap.put(player);
    game.objects.push(gameMap);
    game.registerAction('w', () => gameMap.pushUp(player));
    game.registerAction('a', () => gameMap.pushLeft(player));
    game.registerAction('s', () => gameMap.pushDown(player));
    game.registerAction('d', () => gameMap.pushRight(player));
    game.listen();
    game.start();
}

main()