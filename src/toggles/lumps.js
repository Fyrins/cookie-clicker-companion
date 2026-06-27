export default function createLumps(ctx) {
    return {
        configKey: 'autoLumps',
        t: ctx.makeToggle(function() {
            // Harvest a sugar lump only once it is ripe (age >= lumpRipeAge),
            // when the gain is a guaranteed +1. clickLump() is a no-op before
            // maturity; the ripe check also skips the random 20-23h window.
            if (Game.canLumps() && (Date.now() - Game.lumpT) >= Game.lumpRipeAge) {
                Game.clickLump();
            }
        }, 1000, 'lumpsOn', 'lumpsOff'),
    };
}
