export default function createPantheon(ctx) {
    return {
        configKey: 'autoPantheon',
        t: ctx.makeToggle(function() {
            // Set-and-forget idle line-up: Mokalsium (mother) in diamond, Jeremy
            // (industry) in ruby. The jade slot is left EMPTY on purpose: the only
            // strong idle god for it, Holobore, un-slots itself (and drains every swap)
            // the instant a golden cookie is clicked — which our auto-clicker does
            // constantly — and every other candidate carries a net CpS malus. An empty
            // slot is guaranteed never-negative. slotGod() alone does not spend a swap
            // (that happens in the UI's dropGod), so we pay one real swap per assignment
            // to stay legitimate, one god per tick. Once placed, the guards make this a
            // no-op. Swaps recharge slowly (1h/4h/16h), so it takes a couple of ticks.
            var m = Game.Objects['Temple'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Temple'])) return;
            if (m.swaps <= 0) return; // out of swaps: wait for the recharge
            var plan = [['mother', 0], ['industry', 1]];
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
