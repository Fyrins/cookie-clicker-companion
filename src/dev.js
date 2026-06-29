// ── Dev mode (tuning diagnostics) — OFF in the repo/release ───────────
// Flip DEV_MODE to true to enable the tuning telemetry: the "🔧 Dev Log" panel
// toggle, per-action logging, a periodic SNAPSHOT, and the copy-paste export. The
// committed default is false, so all of this stays completely inert in the released
// mod. The in-game toggle and localStorage 'cccDev' = '1' also enable it without
// editing this file.
export var DEV_MODE = false; // release default — flip to true to enable tuning telemetry

// Factory that creates the dev-tool functions bound to a shared ctx.
// ctx must expose: ctx.TOGGLES, ctx.MOD
export function createDevTools(ctx) {
    function devActive() {
        if (DEV_MODE) return true;
        var t = ctx.TOGGLES && ctx.TOGGLES.devlog && ctx.TOGGLES.devlog.t;
        if (t && t.isActive()) return true;
        try { return typeof localStorage !== 'undefined' && localStorage.getItem('cccDev') === '1'; } catch (e) { return false; }
    }
    // Robust Node fs accessor (NW.js / Electron expose it differently, or not at all).
    function getFs() {
        try { if (typeof require === 'function') return require('fs'); } catch (e) {}
        try { if (typeof window !== 'undefined' && window.require) return window.require('fs'); } catch (e) {}
        try { if (typeof nw !== 'undefined' && nw.require) return nw.require('fs'); } catch (e) {}
        return null;
    }
    function devLogPath() {
        var dir = ((Game.mods['cookie clicker companion'] || {}).dir || '').replace(/\/$/, '');
        return (dir ? dir : '.') + '/ccc-devlog.txt';
    }
    // Dev diagnostic logger — inert unless dev mode is on. Appends to ccc-devlog.txt in
    // the mod folder (when Node's fs is available), with window.cccDevLog and the devtools
    // console as fallbacks.
    function devLog(msg) {
        if (!devActive()) return;
        var line = '[' + new Date().toISOString() + '] ' + msg;
        window.cccDevLog = window.cccDevLog || [];
        window.cccDevLog.push(line);
        try { console.log('[CCC] ' + msg); } catch (e) {}
        try { var fs = getFs(); if (fs) fs.appendFileSync(devLogPath(), line + '\n'); } catch (e) {}
    }
    // One-shot diagnostic shown via an in-game notification (no console needed): reports
    // whether Node fs is reachable, the resolved mod dir, and the result of a test write.
    function devSelfTest() {
        var fs  = getFs();
        var dir = (Game.mods['cookie clicker companion'] || {}).dir || '(none)';
        var msg = 'fs=' + (fs ? 'OK' : 'MISSING') + '<br>dir=' + dir;
        if (fs) {
            try { fs.appendFileSync(devLogPath(), '[selftest ' + new Date().toISOString() + '] dir=' + dir + '\n'); msg += '<br>WROTE ' + devLogPath(); }
            catch (e) { msg += '<br>WRITE ERR: ' + (e && e.message ? e.message : e); }
        }
        Game.Notify('Dev Log self-test', msg, [16, 5]);
        try { console.log('[CCC selftest] ' + msg); } catch (e) {}
    }
    // One-time rich context of the current run — logged once at session start so a log
    // can be read standalone (which ascension/season/minigames/dragon state it came from).
    function devContext() {
        var mg = [];
        ['Bank', 'Temple', 'Wizard tower', 'Farm'].forEach(function(n) {
            if (Game.Objects[n] && Game.isMinigameReady(Game.Objects[n])) mg.push(n);
        });
        var upg = 0; for (var u in Game.Upgrades) if (Game.Upgrades[u].bought) upg++;
        devLog('CONTEXT ccVersion=' + Game.version + ' season=' + (Game.season || 'none')
            + ' ascensions=' + Game.resets + ' prestige=' + Math.floor(Game.prestige)
            + ' heavenlyChips=' + Math.floor(Game.heavenlyChips) + ' dragonLevel=' + Game.dragonLevel
            + ' dragonAura=' + Game.dragonAura + '/' + Game.dragonAura2
            + ' wrinklersMax=' + Game.getWrinklersMax() + ' upgradesBought=' + upg
            + ' minigames=[' + mg.join(',') + ']');
    }
    // Periodic state snapshot for tuning — called about once a minute from the check hook.
    function devSnapshot() {
        var on = [];
        for (var id in ctx.TOGGLES) if (ctx.TOGGLES[id].t.isActive()) on.push(id);
        var bldgs = 0;
        for (var b in Game.Objects) bldgs += Game.Objects[b].amount;
        var bank = Game.Objects['Bank'], mkt = bank && bank.minigame;
        // Diagnostics: WHY each automation is (in)active.
        var spend = Game.cookies - (ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6000 : 0);
        var bb = null, brat = 0;
        for (var i in Game.Objects) {
            var ob = Game.Objects[i], r = ctx.MOD.calculateRatio(ob);
            if (!r || isNaN(r)) r = (ob.cps(ob) * Game.globalCpsMult / ob.price) * 100;
            if (r > brat) { brat = r; bb = ob; }
        }
        var bbStr = bb ? (bb.name + '@' + Beautify(bb.price) + (bb.price < spend ? '(aff)' : '(wait)')) : '-';
        var wt = Game.Objects['Wizard tower'], gr = wt && wt.minigame;
        var magicStr = gr ? (Math.floor(gr.magic) + '/' + Math.floor(gr.magicM)) : 'n/a';
        var stock = 0; if (mkt) for (var s = 0; s < mkt.goodsById.length; s++) stock += mkt.goodsById[s].stock;
        var brokerStr = mkt ? (mkt.brokers + '/' + mkt.getMaxBrokers()) : 'n/a';
        devLog('SNAP t=' + Math.round(Game.T / Game.fps / 60) + 'm'
            + ' bank=' + Beautify(Game.cookies) + ' cps=' + Beautify(Game.cookiesPs)
            + ' rawcps=' + Beautify(Game.cookiesPsRawHighest) + ' earned=' + Beautify(Game.cookiesEarned)
            + ' presti=' + Math.floor(Game.prestige) + ' resets=' + Game.resets
            + ' bldgs=' + bldgs + ' lumps=' + Game.lumps + ' wrath=' + Game.elderWrath
            + ' buffs=' + Object.keys(Game.buffs).length
            + ' spend=' + Beautify(spend) + ' bestBldg=' + bbStr
            + ' magic=' + magicStr
            + ' mktProfit=' + (mkt ? Beautify(mkt.profit) : 'n/a') + ' mktStock=' + stock
            + ' brokers=' + brokerStr + ' mktStarved=' + ctx.MOD._mktStarvedTicks
            + ' on=[' + on.join(',') + ']');
    }

    return { devActive: devActive, devLog: devLog, devSnapshot: devSnapshot, devSelfTest: devSelfTest, devContext: devContext, getFs: getFs, devLogPath: devLogPath };
}
