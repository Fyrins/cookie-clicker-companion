export default function createDragonaura(ctx) {
    return {
        configKey: 'autoDragonAura',
        t: ctx.makeToggle(function() {
            // Primary slot: keep the best available aura. Radiant Appetite (id 15, ×2 total
            // production) is the idle endgame aura, selectable from dragon level 19. Before
            // that, fall back to Breath of Milk (id 1, kittens +5%) so the slot is never
            // empty during the climb. Secondary slot: once Krumblor is fully trained he can
            // hold a second aura, so we add Breath of Milk there (Radiant Appetite + Breath
            // of Milk is the endgame idle pair). The game makes aura N selectable at
            // dragonLevel >= N + 4 (Game.SelectDragonAura) and the 2nd slot opens at the
            // final dragon level. Switching legitimately SACRIFICES the highest-level
            // building you own — the exact cost the in-game menu charges — so we pay it.
            // Each set is guarded as a one-shot and we do at most one switch per tick.
            function setAura(slot, auraId) {
                var highest = 0;
                for (var i in Game.Objects) { if (Game.Objects[i].amount > 0) highest = Game.Objects[i]; }
                if (highest !== 0) highest.sacrifice(1); // pay the real switching cost
                if (slot === 0) Game.dragonAura = auraId; else Game.dragonAura2 = auraId;
                Game.recalculateGains = 1;
                ctx.devLog('DRAGON aura' + (slot === 1 ? '2' : '') + ' set ' + Game.dragonAuras[auraId].name + ' (sacrificed ' + (highest !== 0 ? highest.name : 'none') + ')');
            }
            // Primary slot: Radiant Appetite from level 19, Breath of Milk from level 5.
            var target = Game.dragonLevel >= 19 ? 15 : (Game.dragonLevel >= 5 ? 1 : -1);
            if (target >= 0 && Game.dragonAura !== target) { setAura(0, target); return; }
            // Secondary slot: Breath of Milk, once fully trained and the primary already
            // holds Radiant Appetite (so the two slots never request the same aura).
            if (Game.dragonLevel >= Game.dragonLevels.length - 1 && Game.dragonAura === 15 && Game.dragonAura2 !== 1) {
                setAura(1, 1);
            }
        }, 1000, 'dragonAuraOn', 'dragonAuraOff'),
    };
}
