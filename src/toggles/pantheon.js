export default function createPantheon(ctx) {
    return {
        configKey: 'autoPantheon',
        t: ctx.makeToggle(function() {
            // Set-and-forget line-up, recomposed from the active PLAY STYLE — read straight
            // off the auto-click toggles, NOT the Grind/Investor mode (which only governs
            // cookie allocation). Two independent axes:
            //   golden ON  -> we auto-pop golden cookies, so farm them. Selebrak (seasons,
            //                 +frequency) only helps DURING an active season, so it goes in
            //                 diamond + Vomitrax (decadence, +duration) ruby ONLY when a
            //                 season is active. With no season Selebrak is dead weight (no
            //                 god raises golden frequency without a season, and the CpS gods
            //                 cut it), so we instead put Vomitrax in diamond for max golden
            //                 duration. Holobore is BANNED here — it un-slots itself and
            //                 burns every swap the instant a golden is clicked.
            //   golden OFF -> no goldens popped, so max raw CpS: Mokalsium (mother, +milk)
            //                 diamond + Holobore (asceticism, +base CpS — safe as long as no
            //                 golden is clicked) ruby. Holobore even rewards NOT clicking.
            //   bigcookie ON -> we click the big cookie 10x/s (≈huge late-game), so add
            //                 Muridal (labor, +click power) in the JADE slot. OFF -> jade
            //                 holds the idle filler (Jeremy) or stays empty in the golden
            //                 build (a CpS god there would cut golden frequency).
            // Keeping the productive gods in diamond/ruby and Muridal in jade means toggling
            // bigcookie only ever rewrites the jade slot = one swap. The diamond slot is
            // reserved for Godzamok (ruin) once the click-combo feature lands (see CLAUDE.md).
            // slotGod() alone does not spend a swap (that happens in the UI's dropGod), so we
            // pay one real swap per assignment to stay legitimate, one god per tick. A style
            // change re-slots over a couple of ticks; swaps recharge slowly (1h/4h/16h).
            var m = Game.Objects['Temple'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Temple'])) return;
            if (m.swaps <= 0) return; // out of swaps: wait for the recharge
            var T = ctx.TOGGLES;
            var clicking      = !!(T.bigcookie && T.bigcookie.t.isActive());
            var farmingGolden = !!(T.golden && T.golden.t.isActive());
            var plan;
            if (farmingGolden) {
                // Game.season is '' (falsy) when no season is active.
                var seasonActive = !!Game.season;
                if (seasonActive) {
                    plan = clicking ? [['seasons', 0], ['decadence', 1], ['labor', 2]]  // Golden + click, in season
                                    : [['seasons', 0], ['decadence', 1]];               // Golden idle, in season
                } else {
                    plan = clicking ? [['decadence', 0], ['labor', 2]]                  // Golden + click, no season
                                    : [['decadence', 0]];                               // Golden idle, no season
                }
            } else {
                plan = clicking ? [['mother', 0], ['asceticism', 1], ['labor', 2]]   // CpS + click
                                : [['mother', 0], ['asceticism', 1], ['industry', 2]]; // CpS idle
            }
            for (var i = 0; i < plan.length; i++) {
                var god  = m.gods[plan[i][0]];
                var slot = plan[i][1];
                if (!god || m.slot[slot] === god.id) continue; // missing god or already placed
                m.useSwap(1);          // pay the swap, mirroring dropGod
                m.slotGod(god, slot);
                ctx.devLog('PANTHEON ' + plan[i][0] + '@slot' + slot + ' swaps=' + m.swaps);
                return;                // one swap per tick
            }
        }, 1000, 'pantheonOn', 'pantheonOff'),
    };
}
