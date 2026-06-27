export default function createWrinklers(ctx) {
    return {
        configKey: 'autoCollectWrinklers',
        t: ctx.makeToggle(function() {
            for (var i = 0; i < Game.getWrinklersMax(); i++) {
                if (Game.wrinklers[i].phase !== 2) return;
            }
            Game.CollectWrinklers();
        }, 1000, 'wrinklOn', 'wrinklOff'),
    };
}
