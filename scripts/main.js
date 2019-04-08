function main() {
    const game = new Game();
    const gameMap = new GameMap();
    const box = new GameObject('box', 0, 0);
    const player = new GameObject('player', 4, 4);
    gameMap.put(box);
    gameMap.put(player);
    game.objects.push(gameMap);
    game.registerAction('w', () => gameMap.moveUp(player));
    game.registerAction('a', () => gameMap.moveLeft(player));
    game.registerAction('s', () => gameMap.moveDown(player));
    game.registerAction('d', () => gameMap.moveRight(player));
    game.listen();
    game.start();
}

main()