function main() {
    const game = new Game();
    const player = new GameObject('player');
    const box1 = new GameObject('box');
    const box2 = new GameObject('box');
    game.map.put(player, 4, 4);
    game.map.put(box1, 5, 5);
    game.map.put(box2, 6, 6);
    game.map.setGoal(10, 10);
    game.map.setGoal(10, 11);
    game.registerAction('w', () => game.map.pushUp(player));
    game.registerAction('a', () => game.map.pushLeft(player));
    game.registerAction('s', () => game.map.pushDown(player));
    game.registerAction('d', () => game.map.pushRight(player));
    game.listen();
    game.start();
}

main()