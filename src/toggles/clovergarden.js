export default function createClovergarden(ctx) {
    return {
        configKey: 'autoCloverGarden',
        t: ctx.makeToggle(function() {
            // Fill and maintain the whole garden with Golden clover for a permanent
            // golden-cookie-frequency boost (+3% per mature tile, ×soil effMult; Clay
            // soil adds +25%). Planting is FREE only with the Turbo-charged soil
            // upgrade, so we hard-guard on a zero cost and NEVER spend cookies. Clovers
            // are short-lived: mature ones are left to run to the end (max boost) and
            // empty tiles are replanted. Non-clover MORTAL plants are harvested to
            // convert the plot; immortal plants are left untouched. The basic Garden
            // toggle defers to this one, so the two never fight over the plot.
            var m = Game.Objects['Farm'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Farm'])) return;
            var clover = m.plants['goldenClover'];
            if (!clover || !clover.unlocked) return;
            if (m.getCost(clover) > 0) return; // safety: only ever plant for free (Turbo-charged soil)
            var cloverTile = clover.id + 1;
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 6; x++) {
                    if (!m.isTileUnlocked(x, y)) continue;
                    var tile = m.plot[y][x];
                    if (tile[0] === cloverTile) continue; // already a clover — let it grow/mature
                    if (tile[0] > 0) {
                        var occ = m.plantsById[tile[0] - 1];
                        if (occ && occ.immortal) continue; // never destroy immortal plants
                        m.harvest(x, y, 1);                 // clear non-clover; replant next tick
                        ctx.devLog('CLOVER clear ' + (occ ? occ.key : '?') + ' @' + x + ',' + y);
                        continue;
                    }
                    if (m.useTool(clover.id, x, y)) ctx.devLog('CLOVER plant @' + x + ',' + y); // empty -> plant (free)
                }
            }
        }, 1000, 'cloverGardenOn', 'cloverGardenOff'),
    };
}
