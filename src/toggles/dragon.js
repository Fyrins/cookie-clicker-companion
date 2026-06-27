export default function createDragon(ctx) {
    return {
        configKey: 'autoDragon',
        t: ctx.makeToggle(function() {
            // Game.UpgradeDragon() levels Krumblor by paying the next level's
            // cost. IMPORTANT: levels 5-26 pay by SACRIFICING 100 buildings
            // each, and the routine does it silently with no confirmation.
            // We auto-level only when the next level is paid in cookies, so the
            // mod never sacrifices the player's buildings; sacrifice levels stay
            // a deliberate manual choice.
            var next = Game.dragonLevels[Game.dragonLevel];
            if (!next || typeof next.buy !== 'function') return;
            var isSacrifice = next.buy.toString().indexOf('sacrifice') !== -1;
            if (!isSacrifice || ctx.TOGGLES.dragonsacrifice.t.isActive()) {
                Game.UpgradeDragon();
            }
        }, 1000, 'dragonOn', 'dragonOff'),
    };
}
