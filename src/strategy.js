// ── Strategy presets ─────────────────────────────────────────
// A preset configures the "strategic cluster" of toggles in one move to resolve
// the cookies tug-of-war between CPS growth and investment. The universally good
// toggles (golden, spell, wrinklers, …) are never touched. After applying a
// preset every toggle stays manually overridable; touching a cluster toggle by
// hand drops the selector back to Manual (handled at the row click listener).
export var CLUSTER = ['buybuildings', 'buyupgrades', 'luckyreserve', 'market', 'office', 'dragonaura', 'pantheon'];
export var PRESETS = {
    // Grind = pure CPS growth: buy everything, divert nothing to investment. Pantheon ON
    // for its free CpS line-up (Mokalsium + Jeremy); it spends worship swaps, not cookies.
    grind:    { buybuildings: true, buyupgrades: true, luckyreserve: false, market: false, office: false, dragonaura: true, pantheon: true },
    // Investor = max income: reserve + aggressive market + offices + brokers + the golden
    // pantheon line-up (Selebrak + Vomitrax: more frequent, longer golden cookies).
    investor: { buybuildings: true, buyupgrades: true, luckyreserve: true,  market: true,  office: true,  dragonaura: true, pantheon: true  },
};
// Market trading aggressiveness depends on the active mode. Investor buys closer
// to the mean, takes bigger positions and takes profit sooner; everything else
// keeps the conservative v1.6.0 profile (no regression in Manual/Grind).
//   buyBelow      — buy only under (mean × this)
//   cap           — fraction of the investable surplus committed per good
//   sellGain      — take profit once price ≥ buy-in × this
//   reversalFloor — on a downturn, only bail if the gain is at least this much;
//                   below it, hold and let mean-reversion carry price to the target
// NOTE: the Bank minigame only ticks ONCE A MINUTE and trends run for tens of
// minutes to hours, so this is a long-idle mechanic — cycles complete over hours,
// not over a short active session. The sell rule is anchored to our buy-in (not a
// falling trend) so a gain is realised whenever the slow drift clears the target.
// OVERHEAD CAVEAT (verified in the game's minigameMarket.js): buy/sell convert at
// `cookiesPsRawHighest × val`, and every BUY pays overhead = 1 + 0.2×0.95^brokers
// (≈1.088 at 16 brokers, ≈1.19 at 1). So a sale that clears the buy-in by less than
// the overhead LOSES cookies on the eventual rebuy. The real edge is riding the
// monotonic rawCpS up and realising before ascension — the $-price arbitrage is
// noise — so Investor takes profit LATER (higher sellGain) rather than churning, and
// market.js floors both exits at the live overhead (see minGain there).
// Cost-averaging (DCA) profile — market.js anchors the sell to our weighted-average
// buy-in × overhead. Knobs:
//   buyBelow        — buy only under (resting mean × this); lower = rarer, deeper discount
//   cap             — fraction of the investable BUDGET committed per good per lot
//   profitMargin    — take profit once price ≥ buy-in × overhead × (1 + this)
//   budgetFrac      — (Investor only) the market's investable budget as a fraction of the
//                     whole bank, computed INDEPENDENTLY of the Lucky Reserve floor and of
//                     the building auto-buy. This is the fix for issue #6: without it the
//                     market only saw `bank − reserve` minus whatever buildings spent, which
//                     at high CpS is ~0, so the bot starved and never traded. With a
//                     budgetFrac the bot always has a bounded slice to work; the reserve
//                     still keeps a high bank for Lucky goldens (a market buy can be sold
//                     back any tick, so the only cost is a temporarily smaller bank).
//                     Absent (conservative) → the legacy surplus-above-reserve, buildings-first.
//   maxExposureFrac — (Investor only) cap total capital held across all goods to this
//                     fraction of the budget; skip new buys above it. Absent → no cap.
// Investor averages a touch more aggressively (shallower dips, bigger lots) than the
// conservative profile used by Manual/Grind. Manual/Grind keep the exact v1.6.0 behaviour
// (no budgetFrac / maxExposureFrac; profitMargin 0.02 reproduces the old hardcoded ×1.02).
export var MARKET = {
    conservative: { buyBelow: 0.92, cap: 0.08, profitMargin: 0.02 },
    aggressive:   { buyBelow: 0.95, cap: 0.12, profitMargin: 0.02, budgetFrac: 0.15, maxExposureFrac: 0.60 },
};
export function makeMarketParams(MOD) {
    return function marketParams() { return MOD.activeMode === 'investor' ? MARKET.aggressive : MARKET.conservative; };
}
