export default function createElderpact(ctx) {
    // Pure opt-in gate (no interval): it only flips whether Elder Pact is eligible for the
    // upgrade auto-buy (see upgradeEligible in init.js). Buying Elder Pact takes the
    // Grandmapocalypse to stage 3 (maximum wrinkler spawns and wrath cookie odds, no
    // production downside). Kept separate from One Mind because Elder Pact is also the Portal
    // building synergy condition, so escalating to stage 3 stays a deliberate choice.
    return {
        configKey: 'autoElderPact',
        t: ctx.makeBoolToggle('elderPactOn', 'elderPactOff'),
    };
}
