// ── Garden breeding chains (multi-target) ─────────────────────────
//
// Cross-breeding recipes lifted verbatim from the game's M.getMuts()
// (app/src/minigameGarden.js). A plant mutates into an EMPTY tile when its parent
// species sit MATURE in the 3×3 neighbourhood at the required counts. `parents` is
// the minimum count of each mature species an empty tile needs around it; the
// breeder's checkerboard layout puts 4 of each parent (2 species) or 8 of one
// species around every isolated slot, satisfying counts up to 8.
//
// Only Baker's wheat is plantable from the start, so every target is reached by
// walking its chain bottom-up, unlocking each locked ancestor in turn. We curate
// the chains that bootstrap purely from bakerWheat — the chocoroot/queenbeet lines
// are left out because they need brownMold/whiteMildew, which only appear from
// decay/weeds and cannot be produced by cross-breeding here.
//
// Shared prefixes (thumbcorn → cronerice → gildmillet → clover) repeat across chains
// on purpose: the breeder skips any step already unlocked, so later targets reuse the
// progress of earlier ones.
//
//   thumbcorn    ← 2× bakerWheat                 (L.642, 5%)
//   cronerice    ← 1× bakerWheat + 1× thumbcorn  (L.643, 1%)
//   gildmillet   ← 1× cronerice  + 1× thumbcorn  (L.645, 3%)
//   clover       ← 1× bakerWheat + 1× gildmillet (L.647, 3%)
//   goldenClover ← 1× bakerWheat + 1× gildmillet (L.647, 0.07%)
//   shimmerlily  ← 1× clover     + 1× gildmillet (L.648, 2%)
//   elderwort    ← 1× shimmerlily + 1× cronerice (L.651, 1%)

var THUMB = { target: 'thumbcorn',  parents: { bakerWheat: 2 } };
var CRONE = { target: 'cronerice',  parents: { bakerWheat: 1, thumbcorn: 1 } };
var GILD  = { target: 'gildmillet', parents: { cronerice: 1, thumbcorn: 1 } };
var CLOV  = { target: 'clover',     parents: { bakerWheat: 1, gildmillet: 1 } };
var SHIM  = { target: 'shimmerlily', parents: { clover: 1, gildmillet: 1 } };

export var CHAINS = {
    goldenClover: [THUMB, CRONE, GILD, { target: 'goldenClover', parents: { bakerWheat: 1, gildmillet: 1 } }],
    shimmerlily:  [THUMB, CRONE, GILD, CLOV, SHIM],
    elderwort:    [THUMB, CRONE, GILD, CLOV, SHIM, { target: 'elderwort', parents: { shimmerlily: 1, cronerice: 1 } }],
};

// Auto-target order: breed the most valuable still-locked seed first. Golden clover
// is the headline (golden-cookie frequency for the Golden Clover Garden); shimmerlily
// and elderwort are solid CpS seeds reachable on the same wheat→gildmillet spine.
export var TARGET_PRIORITY = ['goldenClover', 'shimmerlily', 'elderwort'];
