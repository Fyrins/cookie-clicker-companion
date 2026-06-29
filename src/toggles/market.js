export default function createMarket(ctx) {
    // The $-price we last bought each good at. The Bank ticks ONCE A MINUTE but this
    // toggle runs every second, so without this we would re-buy the same price ~60×
    // and pile up stock without lowering the average. Session-only (a fresh reload may
    // re-buy once per good, harmless) — it is the average cost, not this, that matters.
    var lastBuy = {};

    return {
        configKey: 'autoMarket',
        t: ctx.makeToggle(function() {
            // Cost-averaging (DCA) on the Bank minigame. Buy below the resting (mean)
            // price; every buy lowers the weighted-average basis, so a smaller bounce
            // realises the whole stack. Sell the ENTIRE position once the price clears
            // our average buy-in by enough to beat the buy overhead. Mean-reversion
            // toward the resting value keeps carrying a below-mean basis back over that
            // line, and rawCpS is monotonic so the cookie payout only ever beats the
            // cookie cost. Surplus-only: buildings/upgrades always come first.
            var m = Game.Objects['Bank'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Bank'])) return;
            // Per-good cost basis { avgVal, units } — weighted-average $-price we paid and
            // the stock we believe we hold. Lives on MOD so it is PERSISTED through save()/
            // load(): a reload keeps the real average instead of re-adopting the current
            // price. Read fresh each tick so a load() that replaces the object is picked up.
            var basis = ctx.MOD.marketBasis || (ctx.MOD.marketBasis = {});
            var reserve   = ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6000 : 0; // RAW CpS: a Frenzy must not inflate the reserve and starve the market
            var spendable = Game.cookies - reserve; // never touch the Lucky reserve
            var overhead  = 1 + 0.01 * (20 * Math.pow(0.95, m.brokers));
            var canInvest = spendable > 0 && !ctx.autoBuyWillSpend(spendable);
            if (!canInvest && ctx.devActive()) ctx.MOD._mktStarvedTicks++; // track buildings-first deferrals
            // Brokers are the single biggest market lever: each shaves 5% off the buy
            // overhead PERMANENTLY and they are cheap (~20 min of CpS). Hire one per tick
            // up to the cap, gated only by the Lucky Reserve.
            if (m.brokers < m.getMaxBrokers()) {
                var brokerPrice = m.getBrokerPrice();
                if (brokerPrice <= spendable && Game.cookies >= brokerPrice) {
                    Game.Spend(brokerPrice);
                    m.brokers += 1;
                    ctx.devLog('MKT broker hired -> ' + m.brokers + ' (cost=' + Beautify(brokerPrice) + ')');
                }
            }
            m.goodsById.forEach(function(good) {
                if (!good.active) return;
                var resting = m.getRestingVal(good.id);
                var mp = ctx.marketParams();

                // Reconcile our tracked basis with the real stock (manual trades / reload):
                // no stock → forget it; stock with no basis → adopt the current price.
                if (good.stock <= 0) { if (basis[good.id]) delete basis[good.id]; delete lastBuy[good.id]; }
                else if (!basis[good.id]) { basis[good.id] = { avgVal: good.val, units: good.stock }; }
                var b = basis[good.id];

                // Take profit on the WHOLE position once price clears the average buy-in by
                // the overhead (+2% margin). On a fast downturn (mode 2/4) bail as soon as we
                // are merely above overhead, before the gain evaporates. Selling only adds
                // cookies, so it is never gated by the reserve or the auto-buy.
                if (b && good.stock > 0) {
                    var hitTarget = good.val >= b.avgVal * overhead * 1.02;
                    var reversal  = (good.mode === 2 || good.mode === 4) && good.val >= b.avgVal * overhead;
                    if (hitTarget || reversal) {
                        var soldQty = good.stock;
                        m.sellGood(good.id, 10000);
                        delete basis[good.id];
                        delete lastBuy[good.id];
                        ctx.devLog('MKT sell ' + good.name + ' val=' + good.val.toFixed(2) + ' avg=' + b.avgVal.toFixed(2) + ' qty=' + soldQty + ' total=' + Beautify(m.profit));
                        return;
                    }
                }

                // Cost-average IN, surplus only. Add to a position ONLY when:
                //  • the price is cheap vs the mean (val < resting × buyBelow),
                //  • it has MOVED since our last buy here (val !== lastBuy) — one add per
                //    market tick, never 60× the same second-priced lot,
                //  • and it sits below our average (new position, or a genuine dip that
                //    lowers the basis), so every add actually smooths the average down.
                var maxStock = (typeof m.getGoodMaxStock === 'function') ? m.getGoodMaxStock(good) : 1e9;
                if (canInvest && good.val < resting * mp.buyBelow && good.val !== lastBuy[good.id]
                    && (!b || good.val < b.avgVal) && good.stock < maxStock) {
                    var costPerUnit = Game.cookiesPsRawHighest * good.val * overhead;
                    if (costPerUnit <= 0) return;
                    var n = Math.floor((spendable * mp.cap) / costPerUnit);
                    var room = maxStock - good.stock;
                    if (n > room) n = room;
                    if (n > 0) {
                        var before = good.stock;
                        var prevAvg = b ? b.avgVal : good.val;
                        lastBuy[good.id] = good.val; // this price is now handled, whatever the fill
                        if (m.buyGood(good.id, n)) {
                            var added = good.stock - before; // actual fill (affordability/cap clamp)
                            if (added > 0) {
                                basis[good.id] = { avgVal: (prevAvg * before + good.val * added) / (before + added), units: good.stock };
                                ctx.devLog('MKT buy ' + good.name + ' val=' + good.val.toFixed(2) + ' rest=' + resting + ' qty=' + added + ' avg=' + basis[good.id].avgVal.toFixed(2));
                            }
                        }
                    }
                }
            });
        }, 1000, 'marketOn', 'marketOff'),
    };
}
