export default function createOnemind(ctx) {
    return {
        configKey: 'oneMind',
        t: ctx.makeToggle(function() {
            // One Mind stays the gate that lets the upgrade auto-buy trigger the
            // Grandmapocalypse (see buyupgrades.js). Its only behaviour is to BUNDLE the
            // downstream strategy: once the apocalypse is actually running (elderWrath > 0)
            // it turns the wrath auto-pop ON a single time — wrath cookies give far more
            // than they cost (positive effects dominate, +chains/storms), so popping them
            // is the right default. One-shot per apocalypse: re-arms when elderWrath drops
            // back to 0 (ascension / Elder Pledge), and never snaps back on if the user
            // disables wrath afterwards.
            if (Game.elderWrath <= 0) { ctx.MOD._wrathBundled = false; return; }
            if (ctx.MOD._wrathBundled) return;
            ctx.MOD._wrathBundled = true;
            var w = ctx.TOGGLES.wrath;
            if (w && !w.t.isActive()) { w.t.activate(); ctx.devLog('ONEMIND bundle -> wrath on'); }
        }, 2000, 'oneMindOn', 'oneMindOff'),
    };
}
