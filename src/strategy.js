// ── Strategy presets ─────────────────────────────────────────
// A preset configures the "strategic cluster" of toggles in one move to resolve
// the cookies tug-of-war between CPS growth and investment. The universally good
// toggles (golden, spell, wrinklers, …) are never touched. After applying a
// preset every toggle stays manually overridable; touching a cluster toggle by
// hand drops the selector back to Manual (handled at the row click listener).
export var CLUSTER = ['buybuildings', 'buyupgrades', 'luckyreserve', 'market', 'office', 'dragonaura', 'pantheon'];
export var PRESETS = {
    // Grind = pure CPS growth: buy everything, divert nothing to investment.
    grind:    { buybuildings: true, buyupgrades: true, luckyreserve: false, market: false, office: false, dragonaura: true, pantheon: false },
    // Investor = max income: reserve + aggressive market + offices + brokers + Mokalsium.
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
export var MARKET = {
    conservative: { buyBelow: 0.90, cap: 0.25, sellGain: 1.15, reversalFloor: 1.03 },
    aggressive:   { buyBelow: 0.95, cap: 0.50, sellGain: 1.08, reversalFloor: 1.03 },
};
export function makeMarketParams(MOD) {
    return function marketParams() { return MOD.activeMode === 'investor' ? MARKET.aggressive : MARKET.conservative; };
}
