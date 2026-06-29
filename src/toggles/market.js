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
            var mp        = ctx.marketParams();     // per-tick, not per-good
            var reserve   = ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6000 : 0; // RAW CpS: a Frenzy must not inflate the reserve and starve the market
            var surplus   = Game.cookies - reserve; // bank above the Lucky reserve
            var overhead  = 1 + 0.01 * (20 * Math.pow(0.95, m.brokers));
            var rawCps    = Game.cookiesPsRawHighest;

            // Investable budget for averaging IN — the fix for issue #6 (the bot starved
            // because the reserve floor + buildings-first left no surplus to invest):
            //  • Investor (mp.budgetFrac): a dedicated slice of the bank, computed
            //    INDEPENDENTLY of the reserve floor and of the building auto-buy, so the
            //    market always has something to work with. The reserve still keeps a high
            //    bank for Lucky goldens; a position can be sold back any tick, so the only
            //    cost is a temporarily smaller bank — an accepted Investor tradeoff. Bounded
            //    to a fraction of the bank, so a buy can never overdraw it.
            //  • Manual/Grind (no budgetFrac): the legacy surplus above the reserve, and
            //    only when the building/upgrade auto-buy stands down this tick (buildings
            //    first). Byte-identical to v1.6.0.
            var budget, canInvest;
            if (mp.budgetFrac) {
                budget    = Game.cookies * mp.budgetFrac;
                canInvest = budget > 0;
            } else {
                budget    = surplus;
                canInvest = surplus > 0 && !ctx.autoBuyWillSpend(surplus);
            }
            if (!canInvest && ctx.devActive()) ctx.MOD._mktStarvedTicks++; // track starved/deferred ticks
            // Brokers are the single biggest market lever: each shaves 5% off the buy
            // overhead PERMANENTLY and they are cheap (~20 min of CpS). Hire one per tick
            // up to the cap, gated only by the Lucky Reserve (surplus), never by canInvest.
            if (m.brokers < m.getMaxBrokers()) {
                var brokerPrice = m.getBrokerPrice();
                if (brokerPrice <= surplus && Game.cookies >= brokerPrice) {
                    Game.Spend(brokerPrice);
                    m.brokers += 1;
                    ctx.devLog('MKT broker hired -> ' + m.brokers + ' (cost=' + Beautify(brokerPrice) + ')');
                }
            }
            // Total open exposure in cookies (Σ stock × rawCps × $-price). Capped to a
            // fraction of the budget so the bot does not pile capital into every good at
            // once. Investor only: absent maxExposureFrac, no cap (Manual/Grind unchanged).
            var exposure = 0;
            m.goodsById.forEach(function(g) { if (g.active && g.stock > 0) exposure += g.stock * rawCps * g.val; });
            var overExposed = mp.maxExposureFrac ? (exposure >= budget * mp.maxExposureFrac) : false;

            m.goodsById.forEach(function(good) {
                if (!good.active) return;
                var resting = m.getRestingVal(good.id);

                // Reconcile our tracked basis with the real stock (manual trades / reload):
                // no stock → forget it; stock with no basis → adopt the current price.
                if (good.stock <= 0) { if (basis[good.id]) delete basis[good.id]; delete lastBuy[good.id]; }
                else if (!basis[good.id]) { basis[good.id] = { avgVal: good.val, units: good.stock }; }
                var b = basis[good.id];

                // Take profit on the WHOLE position once price clears the average buy-in by
                // the LIVE overhead plus a profit margin. On a fast downturn (mode 2/4) bail
                // as soon as we are merely above overhead (break-even), before the gain
                // evaporates. Selling only adds cookies, so it is never gated by the reserve,
                // the budget or the auto-buy.
                if (b && good.stock > 0) {
                    var hitTarget = good.val >= b.avgVal * overhead * (1 + mp.profitMargin);
                    var reversal  = (good.mode === 2 || good.mode === 4) && good.val >= b.avgVal * overhead;
                    if (hitTarget || reversal) {
                        var soldQty = good.stock;
                        // Per-trade cookie P&L: cookies received now − cookie cost of the
                        // position at its average buy-in (incl. the buy overhead paid).
                        var pnl = (soldQty * good.val - soldQty * b.avgVal * overhead) * rawCps;
                        m.sellGood(good.id, 10000);
                        delete basis[good.id];
                        delete lastBuy[good.id];
                        ctx.devLog('MKT sell ' + good.name + ' val=' + good.val.toFixed(2) + ' avg=' + b.avgVal.toFixed(2) + ' qty=' + soldQty + ' pnl=' + (pnl >= 0 ? '+' : '') + Beautify(pnl) + ' total=' + Beautify(m.profit));
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
                if (canInvest && !overExposed && good.val < resting * mp.buyBelow && good.val !== lastBuy[good.id]
                    && (!b || good.val < b.avgVal) && good.stock < maxStock) {
                    var costPerUnit = rawCps * good.val * overhead;
                    if (costPerUnit <= 0) return;
                    var n = Math.floor((budget * mp.cap) / costPerUnit);
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
                                ctx.devLog('MKT buy ' + good.name + ' val=' + good.val.toFixed(2) + ' rest=' + resting + ' qty=' + added + ' avg=' + basis[good.id].avgVal.toFixed(2) + ' exp=' + Beautify(exposure));
                            }
                        }
                    }
                }
            });
        }, 1000, 'marketOn', 'marketOff'),
    };
}
