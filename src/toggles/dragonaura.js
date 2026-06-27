export default function createDragonaura(ctx) {
    return {
        configKey: 'autoDragonAura',
        t: ctx.makeToggle(function() {
            // Keep the primary aura on Radiant Appetite (id 15, ×2 total production),
            // the consensus idle aura. It is selectable from dragon level 19 (id+4).
            // Switching an aura legitimately SACRIFICES the highest-level building you
            // own — the exact cost the in-game menu charges — so we pay it and do this
            // only ONCE: the guard below makes it a no-op as soon as it is in place.
            var target = 15; // Radiant Appetite
            if (Game.dragonLevel < target + 4) return; // not selectable yet
            if (Game.dragonAura === target) return;     // already set: nothing to do
            var highest = 0;
            for (var i in Game.Objects) { if (Game.Objects[i].amount > 0) highest = Game.Objects[i]; }
            if (highest !== 0) highest.sacrifice(1); // pay the real switching cost
            Game.dragonAura = target;
            Game.recalculateGains = 1;
            ctx.devLog('DRAGON aura set Radiant Appetite (sacrificed ' + (highest !== 0 ? highest.name : 'none') + ')');
        }, 1000, 'dragonAuraOn', 'dragonAuraOff'),
    };
}
