function main() {
    const game = new Game();
    const box = new GameObject('box');
    const player = new GameObject('player', 100, 100);
    game.objects.push(box);
    game.objects.push(player);
    game.registerAction('w', player.moveUp.bind(player));
    game.registerAction('a', player.moveLeft.bind(player));
    game.registerAction('s', player.moveDown.bind(player));
    game.registerAction('d', player.moveRight.bind(player));
    game.listen();
    game.start();
}

main()