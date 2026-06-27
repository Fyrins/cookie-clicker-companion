export default function createMarket(ctx) {
    return {
        configKey: 'autoMarket',
        t: ctx.makeToggle(function() {
            // Conservative trading on the Bank minigame: buy below the resting (mean)
            // price during an uptrend, take profit on a downturn once the price beats
            // our buy-in. Each good's `mode` is the game's trend signal (1 slow rise,
            // 3 fast rise, 2 slow fall, 4 fast fall). Future prices are not predictable,
            // so we lean on the trend + mean-reversion, never all-in.
            var m = Game.Objects['Bank'].minigame;
            if (!m || !Game.isMinigameReady(Game.Objects['Bank'])) return;
            var reserve   = ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0;
            var spendable = Game.cookies - reserve; // never touch the Lucky reserve
            var overhead  = 1 + 0.01 * (20 * Math.pow(0.95, m.brokers));
            // Buildings and upgrades come first: only invest cookies the auto-buy is not
            // about to spend this tick. Selling is always allowed (it only adds cookies).
            var canInvest = spendable > 0 && !ctx.autoBuyWillSpend(spendable);
            if (!canInvest && ctx.devActive()) ctx.MOD._mktStarvedTicks++; // track buildings-first deferrals
            // Hire a broker (one per tick) when affordable from the investable surplus:
            // each broker shaves 5% off the buy overhead. Same priority as stocks, so it
            // never outranks buildings/upgrades and never dips into the Lucky Reserve.
            if (canInvest && m.brokers < m.getMaxBrokers()) {
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
                // Take profit on the whole stock. Two exits, whichever comes first:
                //  (a) the slow drift has cleared our buy-in by the sellGain margin
                //      — lock the gain instead of waiting for the exact top (which is
                //      unpredictable), the main path on this once-a-minute clock;
                //  (b) a fast downturn (mode 2/4) starts while we are still in profit
                //      — bail before the gain evaporates.
                // Selling is never gated by the Lucky Reserve or the auto-buy: it only
                // adds cookies, so it always runs. (good.prev = our last buy price.)
                if (good.stock > 0 && good.last === 0 && good.prev > 0) {
                    var gain      = good.val / good.prev;
                    var hitTarget = gain >= mp.sellGain;
                    // Only bail on a downturn if there is a worthwhile gain to
                    // protect; below the floor, hold and let mean-reversion carry
                    // the price back toward the take-profit target.
                    var reversal  = (good.mode === 2 || good.mode === 4) && gain >= mp.reversalFloor;
                    if (hitTarget || reversal) {
                        var soldQty = good.stock;
                        m.sellGood(good.id, 10000);
                        ctx.devLog('MKT sell ' + good.name + ' mode=' + good.mode + ' val=' + good.val.toFixed(2) + ' prev=' + good.prev.toFixed(2) + ' gain=' + gain.toFixed(3) + ' qty=' + soldQty + ' total=' + Beautify(m.profit));
                        return;
                    }
                }
                // Buy cheap during a rise, but only with the surplus the auto-buy will
                // not use this tick (CPS-growing purchases keep priority).
                if (good.last === 0 && (good.mode === 1 || good.mode === 3) && good.val < resting * mp.buyBelow && canInvest) {
                    var costPerUnit = Game.cookiesPsRawHighest * good.val * overhead;
                    if (costPerUnit <= 0) return;
                    var n = Math.floor((spendable * mp.cap) / costPerUnit);
                    if (n > 0 && m.buyGood(good.id, n)) {
                        ctx.devLog('MKT buy ' + good.name + ' mode=' + good.mode + ' val=' + good.val.toFixed(2) + ' rest=' + resting + ' qty=' + n + ' cost=' + Beautify(costPerUnit * n));
                    }
                }
            });
        }, 1000, 'marketOn', 'marketOff'),
    };
}
