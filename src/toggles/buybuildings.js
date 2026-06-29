export default function createBuybuildings(ctx) {
    return {
        configKey: 'autoBuyBuildings',
        t: ctx.makeToggle(function() {
            // Lucky Reserve = rawCpS × 6000 (≈100 min of steady-state CpS, the bank needed
            // to cap a Lucky golden). Use the RAW highest CpS, never Game.cookiesPs: the
            // buffed value septuples during a Frenzy, which would balloon the reserve past
            // the whole bank and FREEZE every purchase for the buff's duration (observed:
            // 15 min of frozen building growth with a 32-quadrillion idle bank).
            var spendable = Game.cookies - (ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6000 : 0);
            // Strict upgrade priority, but only for upgrades we can afford this
            // tick: defer to the upgrade auto-buy when an eligible upgrade is
            // actually purchasable now. An out-of-reach upgrade no longer freezes
            // building purchases (which would also stall milestone progress).
            if (ctx.TOGGLES.buyupgrades.t.isActive() && ctx.hasAffordableEligibleUpgrade(spendable)) return;
            // Unlock-first: own at least one of every affordable, UNLOCKED building type so
            // new tiers (and their upgrade lines + synergies) actually unlock. A brand-new
            // type scores a lower ratio than cheap synergy-boosted buildings, so pure
            // best-ratio never picks it, and the bank just grows the low tiers forever. Buy
            // one unit of the cheapest affordable unowned type, then fall through to ratio
            // buying. Locked (not-yet-available) types are skipped.
            var newType = null;
            for (var k in Game.Objects) {
                var nb = Game.Objects[k];
                if (nb.amount === 0 && !nb.locked && nb.price < spendable && (!newType || nb.price < newType.price)) newType = nb;
            }
            if (newType) {
                ctx.devLog('BUY bldg ' + newType.name + ' #1 price=' + Beautify(newType.price) + ' (unlock new type)');
                newType.buy(1);
                return;
            }
            // Score the highest-ratio building overall AND the highest-ratio one we can
            // afford right now. calculateRatio already factors milestone proximity (the
            // amortised tier ×2 score). Decision:
            //   - overall best affordable        -> buy it.
            //   - overall best NOT affordable and it is a NEW building (amount 0)
            //                                     -> save for it (the unlock of a new
            //                                        building + its upgrade line is worth
            //                                        waiting for — deliberate).
            //   - overall best NOT affordable but already owned
            //                                     -> buy the best affordable building so CPS
            //                                        keeps growing — BUT only if it clears the
            //                                        patience floor (ctx.BUY_FLOOR of the best
            //                                        ratio). A far-worse affordable unit is not
            //                                        worth locking cookies into; save instead.
            var best = null, bestRatio = 0, aff = null, affRatio = 0;
            for (var i in Game.Objects) {
                var building = Game.Objects[i];
                var ratio = ctx.MOD.calculateRatio(building);
                // calculateRatio returns 0 for unowned buildings; fall back to a
                // raw CPS/price estimate so the very first unit can still be scored.
                if (!ratio || isNaN(ratio)) ratio = (building.cps(building) * Game.globalCpsMult / building.price) * 100;
                if (ratio > bestRatio) { best = building; bestRatio = ratio; }
                if (building.price < spendable && ratio > affRatio) { aff = building; affRatio = ratio; }
            }
            if (!best) return;
            if (best.price < spendable) {
                ctx.devLog('BUY bldg ' + best.name + ' #' + (best.amount + 1) + ' price=' + Beautify(best.price) + ' ratio=' + Number(bestRatio).toPrecision(3) + ' (best)');
                best.buy(1);
            } else if (best.amount === 0) {
                return; // new building unlock: deliberately save for it
            } else if (aff && affRatio >= bestRatio * ctx.BUY_FLOOR) {
                ctx.devLog('BUY bldg ' + aff.name + ' #' + (aff.amount + 1) + ' price=' + Beautify(aff.price) + ' ratio=' + Number(affRatio).toPrecision(3) + ' (affordable; ' + best.name + '@' + Beautify(best.price) + ' deferred — already owned)');
                aff.buy(1);
            }
            // else: best affordable is far worse than the global best — hold and let the bank
            // build toward a worthwhile purchase rather than wasting cookies on a poor unit.
        }, 1000, 'buyBuildingsOn', 'buyBuildingsOff'),
    };
}
