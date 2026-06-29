// ── Ratio calculation (CPS/price + synergies) ──────────────────────

// Profitability score for one building: (CPS per owned unit × global multiplier)
// divided by the current price, ×100 and rounded to 3 significant figures, then
// scaled up by the building's active synergies. Higher means a better buy.
export function calculateRatio(building) {
    if (!building.amount) return 0;

    // Marginal raw CPS a synergy `partner` gains from ONE more unit of this building.
    // The synergy factor is linear in the building count, so the per-unit gain is just
    // partnerCps × perUnitWeight (the derivative). The previous version returned the
    // synergy's TOTAL boost over all owned units, which over-weighted buildings the more
    // you owned and skewed cross-type comparisons.
    function partnerMarginalCps(partner, perUnitWeight) {
        return partner.storedTotalCps * Game.globalCpsMult * perUnitWeight;
    }

    var ratio        = Number((((building.storedTotalCps / building.amount) * Game.globalCpsMult) / building.price * 100).toPrecision(3));
    var synergyBoost = 0;

    if (building.name === 'Grandma') {
        // Each owned grandma-synergy upgrade boosts its tied building.
        for (var i in Game.GrandmaSynergies) {
            if (Game.Has(Game.GrandmaSynergies[i])) {
                var partner = Game.Upgrades[Game.GrandmaSynergies[i]].buildingTie;
                synergyBoost += partnerMarginalCps(partner, 0.01 * (1 / (partner.id - 1)));
            }
        }
    } else if (building.name === 'Portal' && Game.Has('Elder Pact')) {
        // Elder Pact ties portals to the number of grandmas owned (marginal per portal).
        var grandmas = Game.Objects['Grandma'];
        synergyBoost += (0.05 * grandmas.amount) * Game.globalCpsMult;
    }

    // Generic building-to-building synergies (e.g. Bank/Temple pairs).
    for (var i in building.synergies) {
        var synergy = building.synergies[i];
        if (Game.Has(synergy.name)) {
            var isPrimary = (building === synergy.buildingTie1);
            var partner   = isPrimary ? synergy.buildingTie2 : synergy.buildingTie1;
            var weight    = isPrimary ? 0.001 : 0.05;
            synergyBoost += partnerMarginalCps(partner, weight);
        }
    }

    // Scale the base ratio by the synergies' share of total CPS (guard the start of a run
    // where cookiesPs is still 0).
    if (synergyBoost > 0 && Game.cookiesPs > 0) ratio = Number((ratio + (ratio * (synergyBoost / Game.cookiesPs))).toPrecision(3));

    // Take whichever is higher: buying one unit now, or committing to the
    // next tier threshold (the ×2 unlock). See tierBundleRatio for the math.
    return Math.max(ratio, this.tierBundleRatio(building));
}

// ── Threshold-aware amortisation (tier ×2 unlocks) ─────────────────
//
// The per-unit ratio above is myopic: it scores the *next single unit*
// and never sees the discrete ×2 jump a building gets when its count
// crosses a tier threshold (1, 5, 25, 50, 100, 150, … — Game.Tiers).
// This scores the whole "bundle": buy every unit up to the next
// threshold, then buy the ×2 tier upgrade. It self-regulates — far from a
// threshold the ×2 is spread over hundreds of costly units (bundle ≈ raw
// ratio), close to it the ×2 is reached cheaply (bundle ratio spikes), so
// taking max(perUnit, bundle) lets the auto-buy commit to a nearby palier
// only when it actually pays off. Returns 0 when no future tier exists.
export function tierBundleRatio(building) {
    var owned = building.amount;
    if (!owned) return 0;

    // Nearest not-yet-unlocked tier upgrade, restricted to the numeric
    // cookie tiers — the only ones that grant the ×2 building multiplier
    // (synergy and fortune tiers are skipped).
    var nextThreshold = Infinity, tierUpgrade = null;
    for (var key in building.tieredUpgrades) {
        var upgrade = building.tieredUpgrades[key];
        var tierDef = Game.Tiers[upgrade.tier];
        if (!tierDef || isNaN(Number(upgrade.tier))) continue; // numeric cookie tiers only
        if (upgrade.unlocked) continue;                        // threshold already reached
        if (tierDef.unlock <= owned) continue;                 // safety
        if (tierDef.unlock < nextThreshold) {
            nextThreshold = tierDef.unlock;
            tierUpgrade   = upgrade;
        }
    }
    if (!tierUpgrade) return 0;

    // Cost to get there: the missing units (geometric ×1.15 sum from the
    // current price) plus the tier upgrade itself.
    var missingUnits  = nextThreshold - owned;
    var buildingsCost = building.price * (Math.pow(1.15, missingUnits) - 1) / 0.15;
    var upgradeCost   = tierUpgrade.getPrice ? tierUpgrade.getPrice() : tierUpgrade.basePrice;
    var bundleCost    = buildingsCost + upgradeCost;
    if (!(bundleCost > 0)) return 0;

    // Gain: effective CPS grows proportionally to the count (owned →
    // threshold), then doubles when the ×2 tier upgrade is bought.
    var currentCps = building.storedTotalCps * Game.globalCpsMult;
    var gain       = currentCps * (2 * nextThreshold / owned - 1);

    // Same units as calculateRatio (effective CPS gain per cookie, ×100),
    // so the two scores are directly comparable.
    return Number((gain / bundleCost * 100).toPrecision(3));
}

// ── Ratio display update ──────────────────────────────────────────

// Multiplier that turns a per-unit ratio into the ratio for a whole bulk purchase,
// matching the store's 1 / 10 / 100 selector (Game.buyBulk). Buying N units costs a
// geometric sum (×1.15 per unit), so the bulk ratio is the single-unit ratio scaled
// by N·0.15 / (1.15^N − 1). Returns 1 for N = 1, so single-buy mode is unchanged.
export function bulkFactor() {
    var n = Game.buyBulk || 1;
    if (n <= 1) return 1;
    return (n * 0.15) / (Math.pow(1.15, n) - 1);
}

export function updateRatios(mod) {
    // Scale every displayed ratio to the current bulk selector. The factor is the
    // same for all buildings, so the colour ranking is unchanged; only the shown
    // values follow the 1 / 10 / 100 selector to match the prices the game displays.
    var factor = mod.bulkFactor();
    // First pass: compute every ratio and track the min/max for colour scaling.
    var min = Infinity, max = -Infinity;
    for (var i in Game.Objects) {
        var building = Game.Objects[i];
        var ratio    = mod.calculateRatio(building);
        // calculateRatio returns 0 for an unowned building (amount 0); fall back to a raw
        // cps/price estimate (same as buybuildings.js) so the store still shows a ratio
        // under buildings you have not bought yet.
        if (!ratio || isNaN(ratio)) ratio = (building.cps(building) * Game.globalCpsMult / building.price) * 100;
        if (ratio > 0 && factor !== 1) ratio = Number((ratio * factor).toPrecision(3));
        mod.values[building.id] = ratio > 0 ? ratio : 0;
        var el = l('ccc-ratio' + building.id);
        if (el && ratio > 0) {
            el.textContent = ratio;
            if (ratio < min) min = ratio;
            if (ratio > max) max = ratio;
        }
    }
    // Second pass: worst ratio = colors[0], best = colors[2], everything else colors[1].
    for (var i in Game.Objects) {
        var building = Game.Objects[i];
        var el = l('ccc-ratio' + building.id);
        if (!el) continue;
        var ratio = mod.values[building.id];
        el.style.color = ratio === min ? mod.colors[0] : ratio === max ? mod.colors[2] : mod.colors[1];
    }
}

export function createSpan(parent, id, color) {
    var span         = document.createElement('span');
    span.className   = 'ccc-store-ratio';
    span.style.color = color;
    span.id          = id;
    span.textContent = '0';
    l(parent).parentNode.appendChild(span);
}

export function createColor(parent, before, id, value) {
    var input       = document.createElement('input');
    input.type      = 'color';
    input.id        = id;
    input.value     = value;
    input.className = 'ccc-store-color';
    l(parent).insertBefore(input, l(before));
}
