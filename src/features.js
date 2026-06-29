import { TARGET_PRIORITY } from './breeder-recipes.js';

export const FEATURES = [
    { id: 'golden',       labelKey: 'golden',       section: 'clicks' },
    { id: 'wrath',        labelKey: 'wrath',        section: 'clicks', unlocked: function() { return Game.elderWrath > 0; } },
    { id: 'bigcookie',    labelKey: 'bigCookie',    section: 'clicks' },
    { id: 'buybuildings', labelKey: 'buyBuildings', section: 'auto'   },
    { id: 'buyupgrades',  labelKey: 'buyUpgrades',  section: 'auto'   },
    { id: 'wrinklers',    labelKey: 'wrinklers',    section: 'auto',   unlocked: function() { return Game.elderWrath > 0; } },
    { id: 'lumps',        labelKey: 'lumps',        section: 'auto',   unlocked: function() { return Game.canLumps(); } },
    { id: 'fortune',      labelKey: 'fortune',      section: 'auto',   unlocked: function() { return Game.Has('Fortune cookies'); } },
    { id: 'dragon',       labelKey: 'dragon',       section: 'auto',   unlocked: function() { return Game.Has('A crumbly egg'); } },
    { id: 'dragonsacrifice', labelKey: 'dragonSacrifice', section: 'auto', unlocked: function() { var r = l('ccc-row-dragon'); return Game.Has('A crumbly egg') && r && r.classList.contains('on'); } },
    { id: 'dragonaura',   labelKey: 'dragonAura',   section: 'auto',   unlocked: function() { return Game.Has('A crumbly egg') && Game.dragonLevel >= 19; } },
    { id: 'spell',        labelKey: 'spell',        section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Wizard tower']); } },
    { id: 'market',       labelKey: 'market',       section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Bank']); } },
    { id: 'office',       labelKey: 'office',       section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Bank']); } },
    { id: 'garden',       labelKey: 'garden',       section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Farm']); } },
    { id: 'breeder',      labelKey: 'breeder',      section: 'minigame', unlocked: function() {
        // Shown only while it has something to do: planting is FREE (Turbo-charged soil)
        // and at least one priority target seed is still locked. Once they are all
        // unlocked, this hides (and you switch to the Golden Clover Garden for the field).
        if (!Game.isMinigameReady(Game.Objects['Farm']) || !Game.Has('Turbo-charged soil')) return false;
        var m = Game.Objects['Farm'].minigame;
        if (!m) return false;
        for (var i = 0; i < TARGET_PRIORITY.length; i++) {
            var p = m.plants[TARGET_PRIORITY[i]];
            if (p && !p.unlocked) return true;
        }
        return false;
    } },
    { id: 'clovergarden', labelKey: 'cloverGarden', section: 'minigame', unlocked: function() {
        // Only viable when planting is FREE (Turbo-charged soil) and Golden clover is unlocked.
        if (!Game.isMinigameReady(Game.Objects['Farm']) || !Game.Has('Turbo-charged soil')) return false;
        var m = Game.Objects['Farm'].minigame;
        return !!(m && m.plants['goldenClover'] && m.plants['goldenClover'].unlocked);
    } },
    { id: 'pantheon',     labelKey: 'pantheon',     section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Temple']); } },
    { id: 'onemind',      labelKey: 'oneMind',      section: 'other',  unlocked: function() { return !!(Game.Upgrades['One mind'] && Game.Upgrades['One mind'].unlocked); } },
    { id: 'elderpact',    labelKey: 'elderPact',    section: 'other',  unlocked: function() { var r = l('ccc-row-onemind'); return !!(r && r.classList.contains('on')); } },
    { id: 'luckyreserve', labelKey: 'luckyReserve', section: 'other'  },
    { id: 'devlog',       labelKey: 'devLog',       section: 'other'  }, // DEV ONLY — hidden unless DEV_MODE/devActive()
];
