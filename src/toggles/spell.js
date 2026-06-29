export default function createSpell(ctx) {
    return {
        configKey: 'autoCastSpell',
        t: ctx.makeToggle(function() {
            // Safe-cast "Force the Hand of Fate". The spell's outcome is seeded by
            // Game.seed + '/' + spellsCastTotal (see minigameGrimoire castSpell), so we
            // can simulate the win/fail draw locally BEFORE committing: re-seed exactly
            // as the game does, peek the first roll using the game's own getFailChance,
            // then restore the RNG. No side effect on future draws (pure "scrying").
            var grimoire = Game.ObjectsById[7].minigame;
            if (!grimoire || grimoire.magic !== grimoire.magicM) return; // wait for full magic
            var spell = grimoire.spellsById[1]; // Force the Hand of Fate
            // Early ascension the magic pool can be full yet smaller than FtHoF's cost
            // (e.g. magic 5/5 vs cost ~23). Without this guard castSpell() would no-op
            // every tick while magic stays pinned full — busy-looping and (in dev mode)
            // flooding the log with phantom "cast FtHoF" lines that never advance N.
            if (grimoire.magic < grimoire.getSpellCost(spell)) return; // pool too small yet
            var failChance = grimoire.getFailChance(spell);
            Math.seedrandom(Game.seed + '/' + grimoire.spellsCastTotal);
            var willWin = Math.random() < (1 - failChance);
            Math.seedrandom();
            if (willWin) {
                ctx.devLog('GOLDEN predicted -> cast FtHoF (failChance=' + failChance.toFixed(3) + ', N=' + grimoire.spellsCastTotal + ')');
                grimoire.castSpell(spell); // predicted golden cookie: cast it
            } else {
                // Predicted backfire (wrath). The seed only changes when the spell-cast
                // counter advances, so staying put would loop on the same losing draw
                // forever. Burn one cheap Conjure Baked Goods to reshuffle fate (and bank
                // some cookies) instead of casting the doomed FtHoF.
                var skip = grimoire.spells['conjure baked goods'];
                if (skip && grimoire.magic >= grimoire.getSpellCost(skip)) {
                    ctx.devLog('BACKFIRE predicted -> skip FtHoF, cast Conjure (failChance=' + failChance.toFixed(3) + ', N=' + grimoire.spellsCastTotal + ')');
                    grimoire.castSpell(skip);
                } else {
                    ctx.devLog('BACKFIRE predicted -> skip, no mana for Conjure (failChance=' + failChance.toFixed(3) + ', N=' + grimoire.spellsCastTotal + ')');
                }
            }
        }, 1000, 'spellOn', 'spellOff'),
    };
}
