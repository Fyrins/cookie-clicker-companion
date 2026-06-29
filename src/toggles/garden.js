export default function createGarden(ctx) {
    return {
        configKey: 'autoGarden',
        t: ctx.makeToggle(function() {
            // Harvest mature plants near the end of their life (age >= 90 of 100) so
            // their value is banked, then replant the same species. The 10-point margin
            // absorbs a big age tick (and the speed-up from an adjacent immortal
            // Elderwort) so plants are not lost unharvested. Immortal plants never die,
            // so they are left untouched. WARNING: this destroys whatever is growing —
            // not for players running mutation gardens (mutations are pure RNG anyway).
            // The Golden Clover Garden and the Garden Breeder both own the whole plot when
            // active, so defer to either of them (precedence: breeder > clover field > garden).
            if (ctx.TOGGLES.breeder && ctx.TOGGLES.breeder.t.isActive()) return;
            if (ctx.TOGGLES.clovergarden && ctx.TOGGLES.clovergarden.t.isActive()) return;
            var m = Game.Objects['Farm'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Farm'])) return;
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 6; x++) {
                    var tile = m.plot[y][x];
                    if (tile[0] < 1) continue; // empty plot
                    var plant = m.plantsById[tile[0] - 1];
                    if (!plant || plant.immortal) continue;
                    if (tile[1] < plant.mature || tile[1] < 90) continue; // mature & near death only
                    var seed = tile[0] - 1, age = tile[1], pname = plant.name;
                    if (m.harvest(x, y, 1)) {
                        var replant = m.canPlant(m.plantsById[seed]);
                        if (replant) m.useTool(seed, x, y);
                        ctx.devLog('GARDEN harvest ' + pname + ' @' + x + ',' + y + ' age=' + age + (replant ? ' +replant' : ''));
                    }
                }
            }
        }, 1000, 'gardenOn', 'gardenOff'),
    };
}
