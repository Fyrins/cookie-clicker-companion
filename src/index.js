/**
 * Cookie Clicker Companion
 *
 * All-in-one automation mod: auto-click (golden / wrath / big cookie), profitability
 * aware auto-buy, wrinkler collection, spell casting, fortune collection and dragon
 * levelling. It automates only repetitive actions and never alters progression values,
 * so achievements stay legitimate.
 *
 * Source layout (under src/):
 *   css.js         injected stylesheet
 *   features.js    feature catalogue (toggle ids, sections, unlock conditions)
 *   strings.js     loadStrings + English fallback
 *   ratios.js      calculateRatio / tierBundleRatio / updateRatios and helpers
 *   persistence.js save / load
 *   strategy.js    CLUSTER / PRESETS / MARKET / makeMarketParams
 *   dev.js         DEV_MODE + createDevTools (logging, snapshot, self-test)
 *   toggles/       one file per toggle, each exporting a factory(ctx)
 *   init.js        panel construction, toggle wiring, game hooks
 *
 * Runtime globals come from the game: `l(id)` is Cookie Clicker's getElementById
 * helper and `Game.*` is its public API.
 */
import { CSS } from './css.js';
import { FEATURES } from './features.js';
import { loadStrings } from './strings.js';
import { calculateRatio, tierBundleRatio, bulkFactor, updateRatios, createSpan, createColor } from './ratios.js';
import { save, load } from './persistence.js';
import { init } from './init.js';

Game.registerMod("cookie clicker companion", {

    values: new Array(20).fill(0),
    colors: ['#ff6666', '#ffff66', '#66ff66'],
    activeMode: 'manual', // strategy preset: 'manual' | 'grind' | 'investor' (persisted)

    CSS: CSS,
    FEATURES: FEATURES,
    loadStrings: loadStrings,
    calculateRatio: calculateRatio,
    tierBundleRatio: tierBundleRatio,
    bulkFactor: bulkFactor,
    updateRatios: updateRatios,
    createSpan: createSpan,
    createColor: createColor,
    save: save,
    load: load,
    init: init,
});
