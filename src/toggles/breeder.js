import { CHAINS, TARGET_PRIORITY } from '../breeder-recipes.js';

// Garden Breeder — auto-cross-breed toward valuable locked seeds (multi-target).
//
// Strategy: keep the plot in a "breeding field" pattern — parent plants on a
// checkerboard with isolated EMPTY slots (odd,odd tiles) where mutations land —
// and let the game's once-a-second tick (Turbo-charged soil) roll the mutations.
// Each tick we pick the most valuable still-locked target (TARGET_PRIORITY), walk
// its chain to the first locked step, and plant that step's parents. When the step's
// target grows in a slot and matures, harvest it to unlock the seed (harvest only
// unlocks a MATURE plant); the next step (or next target) follows. Targets share the
// wheat→gildmillet spine, so progress on Golden clover carries over to shimmerlily,
// etc. Stops once every target is unlocked (the toggle then hides itself).
//
// Only runs when planting is FREE (Turbo-charged soil) — the field is replanted
// constantly, so it would otherwise bankrupt you. The basic Garden and Golden
// Clover Garden toggles defer to this one, so they never fight over the plot.
export default function createBreeder(ctx) {
    // Isolated mutation slots: odd/odd tiles are never adjacent to each other, so
    // every slot is fully surrounded by parent tiles (its 3×3 sees both parents).
    function isSlot(x, y) { return (x % 2 === 1) && (y % 2 === 1); }

    // Which parent a non-slot tile holds. One parent → that species everywhere;
    // two parents → checkerboard by (x+y) parity, so every slot's neighbourhood
    // contains both species.
    function parentForTile(x, y, pkeys) {
        return pkeys.length === 1 ? pkeys[0] : pkeys[(x + y) % 2];
    }

    return {
        configKey: 'autoBreeder',
        t: ctx.makeToggle(function() {
            var m = Game.Objects['Farm'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Farm'])) return;
            // Free-planting guard: never spend cookies (needs Turbo-charged soil).
            var wheat = m.plants['bakerWheat'];
            if (!wheat || m.getCost(wheat) > 0) return;

            // Pick the most valuable still-locked target, then the first locked step of
            // its chain (ancestors an earlier target already unlocked are skipped).
            var chain = null;
            for (var ti = 0; ti < TARGET_PRIORITY.length; ti++) {
                var tplant = m.plants[TARGET_PRIORITY[ti]];
                if (tplant && !tplant.unlocked) { chain = CHAINS[TARGET_PRIORITY[ti]]; break; }
            }
            if (!chain) return; // every target unlocked — nothing to do.
            var step = null;
            for (var i = 0; i < chain.length; i++) {
                var tp = m.plants[chain[i].target];
                if (tp && !tp.unlocked) { step = chain[i]; break; }
            }
            if (!step) return;

            // Need every parent species of this step unlocked to plant it; chain
            // order guarantees it, but guard so we never try to plant a locked seed.
            var pkeys = [];
            for (var key in step.parents) {
                var p = m.plants[key];
                if (!p || !p.unlocked) return;
                pkeys.push(key);
            }
            var targetKey = step.target;

            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 6; x++) {
                    if (!m.isTileUnlocked(x, y)) continue;
                    var tile = m.plot[y][x];

                    if (isSlot(x, y)) {
                        if (tile[0] === 0) continue; // empty slot waiting for a mutation
                        var occ = m.plantsById[tile[0] - 1];
                        if (occ && occ.key === targetKey) {
                            // Target grew here: harvest once mature to unlock the seed.
                            if (tile[1] >= occ.mature && m.harvest(x, y, 1)) {
                                ctx.devLog('BREED unlocked ' + targetKey + ' @' + x + ',' + y);
                            }
                            // still maturing → leave it to grow
                        } else if (occ && !occ.immortal) {
                            m.harvest(x, y, 1); // off-target sprout: clear the slot to retry
                        }
                    } else {
                        // Parent tile: ensure the right species is present (it matures,
                        // counts toward mutations, eventually dies → replanted free).
                        var pkey = parentForTile(x, y, pkeys);
                        if (tile[0] === 0) {
                            m.useTool(m.plants[pkey].id, x, y); // plant (free)
                        } else {
                            var occ2 = m.plantsById[tile[0] - 1];
                            if (occ2 && occ2.key !== pkey && !occ2.immortal) {
                                m.harvest(x, y, 1); // wrong species → clear, replant next tick
                            }
                        }
                    }
                }
            }
        }, 1000, 'breederOn', 'breederOff'),
    };
}
