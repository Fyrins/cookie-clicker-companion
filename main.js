/**
 * Cookie Clicker Companion
 *
 * All-in-one automation mod: auto-click (golden / wrath / big cookie), profitability
 * aware auto-buy, wrinkler collection, spell casting, fortune collection and dragon
 * levelling. It automates only repetitive actions and never alters progression values,
 * so achievements stay legitimate.
 *
 * Map of this file:
 *   CSS / FEATURES   static config: the injected stylesheet and the feature catalogue
 *   loadStrings      loads the localized UI text from lang/<code>.json
 *   init             builds the panel, wires the toggles, hooks into the store
 *   calculateRatio   the CPS/price + synergy profitability score for one building
 *   tierBundleRatio  amortised score for reaching the next tier threshold (×2 unlock)
 *   updateRatios     paints the colour-coded ratios onto the store tiles
 *   save / load      persists the enabled toggles and the ratio colours
 *
 * Runtime globals come from the game: `l(id)` is Cookie Clicker's getElementById
 * helper and `Game.*` is its public API.
 */
Game.registerMod("cookie clicker companion", {

    values: new Array(20).fill(0),
    colors: ['#ff6666', '#ffff66', '#66ff66'],

    CSS: `
#ccc-panel{position:fixed;bottom:60px;left:10px;width:215px;z-index:9999;font-family:Merriweather,Georgia,serif;font-size:11px;color:#f0ddb8;user-select:none;animation:ccc-in .45s cubic-bezier(.22,1,.36,1) both}
@keyframes ccc-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
#ccc-inner{background:linear-gradient(155deg,#1e0f05 0%,#130a03 100%);border:1px solid #6a4418;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.75),inset 0 1px 0 rgba(212,150,58,.12),inset 0 -1px 0 rgba(0,0,0,.4)}
#ccc-header{display:flex;align-items:center;justify-content:space-between;padding:9px 13px 8px;background:linear-gradient(180deg,#271005 0%,#1c0c03 100%);border-bottom:1px solid #3a1a06;cursor:grab}
#ccc-header:active{cursor:grabbing}
#ccc-title{font-size:12px;font-weight:700;color:#d4963a;letter-spacing:.6px;text-shadow:0 0 12px rgba(212,150,58,.5)}
#ccc-collapse{width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6a4010;font-size:9px;line-height:1;transition:color .2s,transform .3s;transform:rotate(0deg)}
#ccc-collapse:hover{color:#d4963a}
#ccc-collapse.open{transform:rotate(180deg)}
#ccc-body{overflow:hidden;transition:max-height .3s ease,padding .3s ease;max-height:500px;padding:7px 0}
#ccc-body.hidden{max-height:0;padding:0}
.ccc-sec-hdr{padding:3px 13px 2px;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#5a3410;margin-bottom:3px}
.ccc-row{display:flex;align-items:center;padding:5px 13px;cursor:pointer;transition:background .15s;gap:7px}
.ccc-row:hover{background:rgba(212,150,58,.06)}
.ccc-row-lbl{color:#8a6030;font-size:10.5px;flex:1;transition:color .2s}
.ccc-row.on .ccc-row-lbl{color:#eeddb8}
.ccc-tog{width:30px;height:16px;background:#1a0a03;border:1px solid #3a1a06;border-radius:9px;position:relative;flex-shrink:0;transition:background .25s,border-color .25s,box-shadow .25s}
.ccc-tog::after{content:"";position:absolute;top:50%;left:2px;width:10px;height:10px;background:#4a2410;border-radius:50%;transform:translateY(-50%);transition:left .25s cubic-bezier(.22,1,.36,1),background .25s}
.ccc-row.on .ccc-tog{background:rgba(212,150,58,.18);border-color:#b07828;box-shadow:0 0 8px rgba(212,150,58,.3)}
.ccc-row.on .ccc-tog::after{left:16px;background:#d4963a}
.ccc-sep{height:1px;background:#220f04;margin:5px 0}
.ccc-actions{display:flex;gap:7px;padding:7px 13px 5px;border-top:1px solid #220f04;margin-top:2px}
.ccc-btn{flex:1;padding:5px 0;background:transparent;border:1px solid #3a1a06;border-radius:5px;color:#6a4010;font-family:Merriweather,Georgia,serif;font-size:9px;cursor:pointer;transition:border-color .2s,color .2s,background .2s;letter-spacing:.4px}
.ccc-btn:hover{border-color:#d4963a;color:#d4963a;background:rgba(212,150,58,.07)}
#ccc-tooltip{position:fixed;z-index:10000;background:#1a0a03;border:1px solid #6a4418;border-radius:5px;padding:7px 10px;font-family:Merriweather,Georgia,serif;font-size:9px;color:#c8a070;max-width:180px;line-height:1.5;white-space:pre-line;pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 4px 16px rgba(0,0,0,.65)}
.ccc-store-ratio{position:absolute;bottom:0;right:1px;font-family:Merriweather;font-size:7pt;font-weight:bold}
.ccc-store-color{position:absolute;top:-3px;right:0;width:17px;height:20px;background:rgba(0,0,0,0);border:none;outline:none;opacity:.7}
`,

    FEATURES: [
        { id: 'golden',       labelKey: 'golden',       section: 'clicks' },
        { id: 'wrath',        labelKey: 'wrath',        section: 'clicks', unlocked: function() { return Game.elderWrath > 0; } },
        { id: 'bigcookie',    labelKey: 'bigCookie',    section: 'clicks' },
        { id: 'buybuildings', labelKey: 'buyBuildings', section: 'auto'   },
        { id: 'buyupgrades',  labelKey: 'buyUpgrades',  section: 'auto'   },
        { id: 'wrinklers',    labelKey: 'wrinklers',    section: 'auto',   unlocked: function() { return Game.elderWrath > 0; } },
        { id: 'lumps',        labelKey: 'lumps',        section: 'auto',   unlocked: function() { return Game.canLumps(); } },
        { id: 'fortune',      labelKey: 'fortune',      section: 'auto',   unlocked: function() { return Game.Has('Fortune cookies'); } },
        { id: 'dragon',       labelKey: 'dragon',       section: 'auto',   unlocked: function() { return Game.Has('A crumbly egg'); } },
        { id: 'dragonsacrifice', labelKey: 'dragonSacrifice', section: 'auto', unlocked: function() { var r = l('ccc-row-dragon'); return Game.Has('A crumbly egg') && r && r.classList.contains('on'); } },
        { id: 'dragonaura',   labelKey: 'dragonAura',   section: 'auto',   unlocked: function() { return Game.Has('A crumbly egg') && Game.dragonLevel >= 19; } },
        { id: 'spell',        labelKey: 'spell',        section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Wizard tower']); } },
        { id: 'market',       labelKey: 'market',       section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Bank']); } },
        { id: 'office',       labelKey: 'office',       section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Bank']); } },
        { id: 'garden',       labelKey: 'garden',       section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Farm']); } },
        { id: 'pantheon',     labelKey: 'pantheon',     section: 'minigame', unlocked: function() { return Game.isMinigameReady(Game.Objects['Temple']); } },
        { id: 'onemind',      labelKey: 'oneMind',      section: 'other',  unlocked: function() { return !!(Game.Upgrades['One mind'] && Game.Upgrades['One mind'].unlocked); } },
        { id: 'luckyreserve', labelKey: 'luckyReserve', section: 'other'  },
        { id: 'devlog',       labelKey: 'devLog',       section: 'other'  }, // DEV ONLY — hidden unless DEV_MODE/devActive()
    ],

    loadStrings: function(langCode) {
        if (typeof XMLHttpRequest === 'undefined') return null;
        var rawDir = ((Game.mods['cookie clicker companion'] || {}).dir || 'mods/local/Cookie Clicker Companion').replace(/\/$/, '');
        var norm   = langCode.toLowerCase().replace(/_/g, '-');
        var codes  = norm.length > 2 ? [norm, norm.substring(0, 2)] : [norm];
        var prefix = (rawDir.charAt(0) === '/') ? 'file://' : '';
        for (var i = 0; i < codes.length; i++) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', prefix + encodeURI(rawDir + '/lang/' + codes[i] + '.json'), false);
            xhr.overrideMimeType('application/json; charset=utf-8');
            try {
                xhr.send();
                if (xhr.status === 200 || xhr.status === 0) return JSON.parse(xhr.responseText);
            } catch(e) {}
        }
        return null;
    },

    init: function() {
        var MOD = this;
        setTimeout(function() {

            var lang = (typeof locId !== 'undefined' ? locId : (Game.language || 'EN')).toUpperCase();
            // S = localized UI strings (labels, section titles, notifications). Tries the
            // game language, then English, then the hard-coded English default below.
            var S    = MOD.loadStrings(lang) || MOD.loadStrings('EN');
            S = S || {
                modEnabled: 'Cookie Clicker Companion loaded',
                enableAll: '+ Enable all', disableAll: '- Disable all',
                sections: { clicks: 'Clicks', auto: 'Automation', minigame: 'Minigames', other: 'Other' },
                labels: { golden:'Golden Cookie', wrath:'Wrath Cookie', bigCookie:'Big Cookie',
                    wrinklers:'Wrinklers', lumps:'Sugar Lumps', spell:'Force the Hand of Fate',
                    fortune:'Fortune', dragon:'Dragon', dragonSacrifice:'Dragon Sacrifice', dragonAura:'Dragon Aura',
                    market:'Stock Market', office:'Market Offices', garden:'Garden', pantheon:'Pantheon',
                    buyBuildings:'Auto Buy Buildings', buyUpgrades:'Auto Buy Upgrades',
                    oneMind:'One Mind', luckyReserve:'Lucky Reserve' },
                descriptions: {}, notify: {
                    goldenOn:'', goldenOff:'', wrathOn:'', wrathOff:'', bigOn:'', bigOff:'',
                    wrinklOn:'', wrinklOff:'', lumpsOn:'', lumpsOff:'', spellOn:'', spellOff:'',
                    fortuneOn:'', fortuneOff:'', dragonOn:'', dragonOff:'',
                    dragonSacrificeOn:'', dragonSacrificeOff:'', dragonAuraOn:'', dragonAuraOff:'',
                    marketOn:'', marketOff:'', officeOn:'', officeOff:'', gardenOn:'', gardenOff:'', pantheonOn:'', pantheonOff:'',
                    buyBuildingsOn:'', buyBuildingsOff:'', buyUpgradesOn:'', buyUpgradesOff:'',
                    oneMindOn:'', oneMindOff:'',
                    luckyReserveOn:'', luckyReserveOff:'',
                },
            };

            Game.Notify(S.modEnabled, '', [16, 5], 6);

            var clickEvent = new MouseEvent('click', { detail: 1 });

            // ── Toggle factories ──────────────────────────────────────────

            function makeToggle(intervalFn, delay, onKey, offKey) {
                var timer = null;
                return {
                    toggle: function() {
                        if (timer) {
                            clearInterval(timer); timer = null;
                            if (S.notify[offKey]) Game.Notify(S.notify[offKey], '', [16, 5], 3);
                        } else {
                            timer = setInterval(intervalFn, delay);
                            if (S.notify[onKey]) Game.Notify(S.notify[onKey], '', [16, 5], 3);
                        }
                        updateInfo();
                    },
                    activate: function() { if (!timer) this.toggle(); },
                    isActive: function() { return timer !== null; },
                };
            }

            function makeBoolToggle(onKey, offKey) {
                var active = false;
                return {
                    toggle: function() {
                        active = !active;
                        Game.Notify(active ? S.notify[onKey] : S.notify[offKey], '', [16, 5], 3);
                        updateInfo();
                    },
                    activate: function() { if (!active) this.toggle(); },
                    isActive: function() { return active; },
                };
            }

            var cookieEl = l('bigCookie');

            // ── Dev mode (tuning diagnostics) — OFF in the repo/release ───────────
            // Flip DEV_MODE to true to enable the tuning telemetry: the "🔧 Dev Log" panel
            // toggle, per-action logging, a periodic SNAPSHOT, and the copy-paste export. The
            // committed default is false, so all of this stays completely inert in the released
            // mod. The in-game toggle and localStorage 'cccDev' = '1' also enable it without
            // editing this file.
            var DEV_MODE = false;
            function devActive() {
                if (DEV_MODE) return true;
                var t = TOGGLES && TOGGLES.devlog && TOGGLES.devlog.t;
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
            MOD._mktStarvedTicks = 0;
            function devSnapshot() {
                var on = [];
                for (var id in TOGGLES) if (TOGGLES[id].t.isActive()) on.push(id);
                var bldgs = 0;
                for (var b in Game.Objects) bldgs += Game.Objects[b].amount;
                var bank = Game.Objects['Bank'], mkt = bank && bank.minigame;
                // Diagnostics: WHY each automation is (in)active.
                var spend = Game.cookies - (TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0);
                var bb = null, brat = 0;
                for (var i in Game.Objects) {
                    var ob = Game.Objects[i], r = MOD.calculateRatio(ob);
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
                    + ' brokers=' + brokerStr + ' mktStarved=' + MOD._mktStarvedTicks
                    + ' on=[' + on.join(',') + ']');
            }

            // An upgrade is eligible for auto-buy unless it is a game toggle, an
            // irreversible Elder/Grandmapocalypse upgrade, or "One mind" without its toggle.
            function upgradeEligible(upgrade) {
                if (upgrade.pool === 'toggle') return false;
                if (upgrade.name === 'Communal brainsweep' || upgrade.name === 'Elder Pact' ||
                    upgrade.name === 'Elder Pledge' || upgrade.name === 'Elder Covenant' ||
                    upgrade.name === 'Revoke Elder Covenant') return false;
                if (upgrade.name === 'One mind') return TOGGLES.onemind.t.isActive();
                return true;
            }
            // True when an eligible upgrade is BOTH in the store and affordable right
            // now. Building auto-buy uses this (not mere presence) so the strict upgrade
            // priority only defers buildings for upgrades we can actually buy this tick:
            // an out-of-reach upgrade no longer freezes building (and milestone) progress.
            function hasAffordableEligibleUpgrade(spendable) {
                return Game.UpgradesInStore.some(function(upgrade) {
                    if (!upgradeEligible(upgrade)) return false;
                    var price = upgrade.getPrice ? upgrade.getPrice() : upgrade.basePrice;
                    return price < spendable;
                });
            }
            // True when the building/upgrade auto-buy is about to spend cookies this tick: an
            // eligible upgrade is affordable, or the single best-ratio building (the one Auto Buy
            // Buildings actually targets) is affordable. The Stock Market uses this to stand down,
            // so CPS-growing purchases always win the shared cookie pool over stock trading.
            function autoBuyWillSpend(spendable) {
                if (TOGGLES.buyupgrades.t.isActive() && hasAffordableEligibleUpgrade(spendable)) return true;
                if (TOGGLES.buybuildings.t.isActive()) {
                    // Mirror the building auto-buy's actual decision so the market only stands down
                    // when a building purchase really happens this tick.
                    var best = null, bestRatio = 0, affExists = false;
                    for (var i in Game.Objects) {
                        var b = Game.Objects[i];
                        var r = MOD.calculateRatio(b);
                        if (!r || isNaN(r)) r = (b.cps(b) * Game.globalCpsMult / b.price) * 100;
                        if (r > bestRatio) { bestRatio = r; best = b; }
                        if (b.price < spendable) affExists = true;
                    }
                    if (best) {
                        if (best.price < spendable) return true;  // buys the global best
                        if (best.amount === 0) return false;      // SAVING for a new building unlock:
                                                                  // nothing is bought, so the market is
                                                                  // free to put the idle surplus to work
                        if (affExists) return true;               // buys the best affordable instead
                    }
                }
                return false;
            }

            // ── Toggle registry ───────────────────────────────────────────

            var TOGGLES = {
                golden: {
                    configKey: 'autoClickGoldenCookie',
                    t: makeToggle(function() {
                        Game.shimmers.forEach(function(s) {
                            if ((s.type === 'golden' && s.wrath === 0) || s.type === 'reindeer') s.pop();
                        });
                    }, 1000, 'goldenOn', 'goldenOff'),
                },
                wrath: {
                    configKey: 'autoClickWrathCookie',
                    t: makeToggle(function() {
                        Game.shimmers.forEach(function(s) {
                            if (s.type === 'golden' && s.wrath === 1) s.pop();
                        });
                    }, 1000, 'wrathOn', 'wrathOff'),
                },
                bigcookie: {
                    configKey: 'autoClickBigCookie',
                    t: makeToggle(function() {
                        cookieEl.dispatchEvent(clickEvent);
                        Game.autoclickerDetected = 0;
                    }, 100, 'bigOn', 'bigOff'),
                },
                wrinklers: {
                    configKey: 'autoCollectWrinklers',
                    t: makeToggle(function() {
                        for (var i = 0; i < Game.getWrinklersMax(); i++) {
                            if (Game.wrinklers[i].phase !== 2) return;
                        }
                        Game.CollectWrinklers();
                    }, 1000, 'wrinklOn', 'wrinklOff'),
                },
                lumps: {
                    configKey: 'autoLumps',
                    t: makeToggle(function() {
                        // Harvest a sugar lump only once it is ripe (age >= lumpRipeAge),
                        // when the gain is a guaranteed +1. clickLump() is a no-op before
                        // maturity; the ripe check also skips the random 20-23h window.
                        if (Game.canLumps() && (Date.now() - Game.lumpT) >= Game.lumpRipeAge) {
                            Game.clickLump();
                        }
                    }, 1000, 'lumpsOn', 'lumpsOff'),
                },
                spell: {
                    configKey: 'autoCastSpell',
                    t: makeToggle(function() {
                        // Safe-cast "Force the Hand of Fate". The spell's outcome is seeded by
                        // Game.seed + '/' + spellsCastTotal (see minigameGrimoire castSpell), so we
                        // can simulate the win/fail draw locally BEFORE committing: re-seed exactly
                        // as the game does, peek the first roll using the game's own getFailChance,
                        // then restore the RNG. No side effect on future draws (pure "scrying").
                        var grimoire = Game.ObjectsById[7].minigame;
                        if (!grimoire || grimoire.magic !== grimoire.magicM) return; // wait for full magic
                        var spell = grimoire.spellsById[1]; // Force the Hand of Fate
                        var failChance = grimoire.getFailChance(spell);
                        Math.seedrandom(Game.seed + '/' + grimoire.spellsCastTotal);
                        var willWin = Math.random() < (1 - failChance);
                        Math.seedrandom();
                        if (willWin) {
                            devLog('GOLDEN predicted -> cast FtHoF (failChance=' + failChance.toFixed(3) + ', N=' + grimoire.spellsCastTotal + ')');
                            grimoire.castSpell(spell); // predicted golden cookie: cast it
                        } else {
                            // Predicted backfire (wrath). The seed only changes when the spell-cast
                            // counter advances, so staying put would loop on the same losing draw
                            // forever. Burn one cheap Conjure Baked Goods to reshuffle fate (and bank
                            // some cookies) instead of casting the doomed FtHoF.
                            var skip = grimoire.spells['conjure baked goods'];
                            if (skip && grimoire.magic >= grimoire.getSpellCost(skip)) {
                                devLog('BACKFIRE predicted -> skip FtHoF, cast Conjure (failChance=' + failChance.toFixed(3) + ', N=' + grimoire.spellsCastTotal + ')');
                                grimoire.castSpell(skip);
                            } else {
                                devLog('BACKFIRE predicted -> skip, no mana for Conjure (failChance=' + failChance.toFixed(3) + ', N=' + grimoire.spellsCastTotal + ')');
                            }
                        }
                    }, 1000, 'spellOn', 'spellOff'),
                },
                market: {
                    configKey: 'autoMarket',
                    t: makeToggle(function() {
                        // Conservative trading on the Bank minigame: buy below the resting (mean)
                        // price during an uptrend, take profit on a downturn once the price beats
                        // our buy-in. Each good's `mode` is the game's trend signal (1 slow rise,
                        // 3 fast rise, 2 slow fall, 4 fast fall). Future prices are not predictable,
                        // so we lean on the trend + mean-reversion, never all-in.
                        var m = Game.Objects['Bank'].minigame;
                        if (!m || !Game.isMinigameReady(Game.Objects['Bank'])) return;
                        var reserve   = TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0;
                        var spendable = Game.cookies - reserve; // never touch the Lucky reserve
                        var overhead  = 1 + 0.01 * (20 * Math.pow(0.95, m.brokers));
                        // Buildings and upgrades come first: only invest cookies the auto-buy is not
                        // about to spend this tick. Selling is always allowed (it only adds cookies).
                        var canInvest = spendable > 0 && !autoBuyWillSpend(spendable);
                        if (!canInvest && devActive()) MOD._mktStarvedTicks++; // track buildings-first deferrals
                        // Hire a broker (one per tick) when affordable from the investable surplus:
                        // each broker shaves 5% off the buy overhead. Same priority as stocks, so it
                        // never outranks buildings/upgrades and never dips into the Lucky Reserve.
                        if (canInvest && m.brokers < m.getMaxBrokers()) {
                            var brokerPrice = m.getBrokerPrice();
                            if (brokerPrice <= spendable && Game.cookies >= brokerPrice) {
                                Game.Spend(brokerPrice);
                                m.brokers += 1;
                                devLog('MKT broker hired -> ' + m.brokers + ' (cost=' + Beautify(brokerPrice) + ')');
                            }
                        }
                        m.goodsById.forEach(function(good) {
                            if (!good.active) return;
                            var resting = m.getRestingVal(good.id);
                            // Sell the whole stock on a downturn once it is worth more than we paid.
                            // Selling is never gated by the Lucky Reserve or the auto-buy priority:
                            // it only adds cookies, so taking profit always runs.
                            if (good.stock > 0 && good.last === 0 && (good.mode === 2 || good.mode === 4) && good.val > good.prev) {
                                var soldQty = good.stock;
                                m.sellGood(good.id, 10000);
                                devLog('MKT sell ' + good.name + ' mode=' + good.mode + ' val=' + good.val.toFixed(2) + ' prev=' + good.prev.toFixed(2) + ' qty=' + soldQty + ' total=' + Beautify(m.profit));
                                return;
                            }
                            // Buy cheap during a rise, but only with the surplus the auto-buy will
                            // not use this tick (CPS-growing purchases keep priority).
                            if (good.last === 0 && (good.mode === 1 || good.mode === 3) && good.val < resting * 0.9 && canInvest) {
                                var costPerUnit = Game.cookiesPsRawHighest * good.val * overhead;
                                if (costPerUnit <= 0) return;
                                var n = Math.floor((spendable * 0.25) / costPerUnit);
                                if (n > 0 && m.buyGood(good.id, n)) {
                                    devLog('MKT buy ' + good.name + ' mode=' + good.mode + ' val=' + good.val.toFixed(2) + ' rest=' + resting + ' qty=' + n + ' cost=' + Beautify(costPerUnit * n));
                                }
                            }
                        });
                    }, 1000, 'marketOn', 'marketOff'),
                },
                office: {
                    configKey: 'autoOffice',
                    t: makeToggle(function() {
                        // Upgrade the Bank's offices for more stock storage. Each level sacrifices
                        // CURSORS (always the Cursor building) and requires the Cursor building to
                        // reach a sugar-lump level (cost = [cursorsToSacrifice, requiredCursorLevel]).
                        // The sugar-lump gate means this never fires until you have levelled Cursors,
                        // so it stays a deliberate, self-limiting upgrade.
                        var m = Game.Objects['Bank'].minigame;
                        if (!m || !Game.isMinigameReady(Game.Objects['Bank'])) return;
                        if (m.officeLevel >= m.offices.length - 1) return; // already fully upgraded
                        var office = m.offices[m.officeLevel], cursor = Game.Objects['Cursor'];
                        if (office.cost && cursor.amount >= office.cost[0] && cursor.level >= office.cost[1]) {
                            cursor.sacrifice(office.cost[0]);
                            m.officeLevel += 1;
                            devLog('OFFICE upgraded -> level ' + m.officeLevel + ' (sacrificed ' + office.cost[0] + ' cursors)');
                        }
                    }, 1000, 'officeOn', 'officeOff'),
                },
                garden: {
                    configKey: 'autoGarden',
                    t: makeToggle(function() {
                        // Harvest mature plants near the end of their life (age >= 90 of 100) so
                        // their value is banked, then replant the same species. The 10-point margin
                        // absorbs a big age tick (and the speed-up from an adjacent immortal
                        // Elderwort) so plants are not lost unharvested. Immortal plants never die,
                        // so they are left untouched. WARNING: this destroys whatever is growing —
                        // not for players running mutation gardens (mutations are pure RNG anyway).
                        var m = Game.Objects['Farm'].minigame;
                        if (!m || !Game.isMinigameReady(Game.Objects['Farm'])) return;
                        for (var y = 0; y < 6; y++) {
                            for (var x = 0; x < 6; x++) {
                                var tile = m.plot[y][x];
                                if (tile[0] < 1) continue; // empty plot
                                var plant = m.plantsById[tile[0] - 1];
                                if (!plant || plant.immortal) continue;
                                if (tile[1] < plant.mature || tile[1] < 90) continue; // mature & near death only
                                var seed = tile[0] - 1, age = tile[1], pname = plant.name;
                                if (m.harvest(x, y, 1)) {
                                    var replant = m.canPlant(m.plantsById[seed]);
                                    if (replant) m.useTool(seed, x, y);
                                    devLog('GARDEN harvest ' + pname + ' @' + x + ',' + y + ' age=' + age + (replant ? ' +replant' : ''));
                                }
                            }
                        }
                    }, 1000, 'gardenOn', 'gardenOff'),
                },
                pantheon: {
                    configKey: 'autoPantheon',
                    t: makeToggle(function() {
                        // Set-and-forget idle line-up: Mokalsium (mother) in diamond, Jeremy
                        // (industry) in ruby. The jade slot is left EMPTY on purpose: the only
                        // strong idle god for it, Holobore, un-slots itself (and drains every swap)
                        // the instant a golden cookie is clicked — which our auto-clicker does
                        // constantly — and every other candidate carries a net CpS malus. An empty
                        // slot is guaranteed never-negative. slotGod() alone does not spend a swap
                        // (that happens in the UI's dropGod), so we pay one real swap per assignment
                        // to stay legitimate, one god per tick. Once placed, the guards make this a
                        // no-op. Swaps recharge slowly (1h/4h/16h), so it takes a couple of ticks.
                        var m = Game.Objects['Temple'].minigame;
                        if (!m || !Game.isMinigameReady(Game.Objects['Temple'])) return;
                        if (m.swaps <= 0) return; // out of swaps: wait for the recharge
                        var plan = [['mother', 0], ['industry', 1]];
                        for (var i = 0; i < plan.length; i++) {
                            var god  = m.gods[plan[i][0]];
                            var slot = plan[i][1];
                            if (!god || m.slot[slot] === god.id) continue; // missing god or already placed
                            m.useSwap(1);          // pay the swap, mirroring dropGod
                            m.slotGod(god, slot);
                            devLog('PANTHEON ' + plan[i][0] + '@slot' + slot + ' swaps=' + m.swaps);
                            return;                // one swap per tick
                        }
                    }, 1000, 'pantheonOn', 'pantheonOff'),
                },
                fortune: {
                    configKey: 'autoFortuneNews',
                    t: makeToggle(function() {
                        if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') Game.tickerL.dispatchEvent(clickEvent);
                    }, 1000, 'fortuneOn', 'fortuneOff'),
                },
                dragon: {
                    configKey: 'autoDragon',
                    t: makeToggle(function() {
                        // Game.UpgradeDragon() levels Krumblor by paying the next level's
                        // cost. IMPORTANT: levels 5-26 pay by SACRIFICING 100 buildings
                        // each, and the routine does it silently with no confirmation.
                        // We auto-level only when the next level is paid in cookies, so the
                        // mod never sacrifices the player's buildings; sacrifice levels stay
                        // a deliberate manual choice.
                        var next = Game.dragonLevels[Game.dragonLevel];
                        if (!next || typeof next.buy !== 'function') return;
                        var isSacrifice = next.buy.toString().indexOf('sacrifice') !== -1;
                        if (!isSacrifice || TOGGLES.dragonsacrifice.t.isActive()) {
                            Game.UpgradeDragon();
                        }
                    }, 1000, 'dragonOn', 'dragonOff'),
                },
                dragonsacrifice: {
                    configKey: 'autoDragonSacrifice',
                    t: makeBoolToggle('dragonSacrificeOn', 'dragonSacrificeOff'),
                },
                dragonaura: {
                    configKey: 'autoDragonAura',
                    t: makeToggle(function() {
                        // Keep the primary aura on Radiant Appetite (id 15, ×2 total production),
                        // the consensus idle aura. It is selectable from dragon level 19 (id+4).
                        // Switching an aura legitimately SACRIFICES the highest-level building you
                        // own — the exact cost the in-game menu charges — so we pay it and do this
                        // only ONCE: the guard below makes it a no-op as soon as it is in place.
                        var target = 15; // Radiant Appetite
                        if (Game.dragonLevel < target + 4) return; // not selectable yet
                        if (Game.dragonAura === target) return;     // already set: nothing to do
                        var highest = 0;
                        for (var i in Game.Objects) { if (Game.Objects[i].amount > 0) highest = Game.Objects[i]; }
                        if (highest !== 0) highest.sacrifice(1); // pay the real switching cost
                        Game.dragonAura = target;
                        Game.recalculateGains = 1;
                        devLog('DRAGON aura set Radiant Appetite (sacrificed ' + (highest !== 0 ? highest.name : 'none') + ')');
                    }, 1000, 'dragonAuraOn', 'dragonAuraOff'),
                },
                buyupgrades: {
                    configKey: 'autoBuyUpgrades',
                    t: makeToggle(function() {
                        // Lucky Reserve keeps CPS*6000 banked; only the surplus is spendable.
                        var spendable = Game.cookies - (TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0);
                        Game.UpgradesInStore.forEach(function(upgrade) {
                            if (!upgradeEligible(upgrade)) return;
                            var price = upgrade.getPrice ? upgrade.getPrice() : upgrade.basePrice;
                            if (price >= spendable) return;
                            devLog('BUY upg ' + upgrade.name + ' price=' + Beautify(price));
                            upgrade.buy();
                            // "One mind" opens a confirmation prompt; auto-accept it.
                            if (upgrade.name === 'One mind') l('promptOption0').dispatchEvent(clickEvent);
                        });
                    }, 1000, 'buyUpgradesOn', 'buyUpgradesOff'),
                },
                buybuildings: {
                    configKey: 'autoBuyBuildings',
                    t: makeToggle(function() {
                        var spendable = Game.cookies - (TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0);
                        // Strict upgrade priority, but only for upgrades we can afford this
                        // tick: defer to the upgrade auto-buy when an eligible upgrade is
                        // actually purchasable now. An out-of-reach upgrade no longer freezes
                        // building purchases (which would also stall milestone progress).
                        if (TOGGLES.buyupgrades.t.isActive() && hasAffordableEligibleUpgrade(spendable)) return;
                        // Score the highest-ratio building overall AND the highest-ratio one we can
                        // afford right now. calculateRatio already factors milestone proximity (the
                        // amortised tier ×2 score). Decision:
                        //   - overall best affordable        -> buy it.
                        //   - overall best NOT affordable and it is a NEW building (amount 0)
                        //                                     -> save for it (the unlock of a new
                        //                                        building + its upgrade line is worth
                        //                                        waiting for — deliberate).
                        //   - overall best NOT affordable but already owned
                        //                                     -> don't stall; buy the best affordable
                        //                                        building so CPS keeps growing.
                        var best = null, bestRatio = 0, aff = null, affRatio = 0;
                        for (var i in Game.Objects) {
                            var building = Game.Objects[i];
                            var ratio = MOD.calculateRatio(building);
                            // calculateRatio returns 0 for unowned buildings; fall back to a
                            // raw CPS/price estimate so the very first unit can still be scored.
                            if (!ratio || isNaN(ratio)) ratio = (building.cps(building) * Game.globalCpsMult / building.price) * 100;
                            if (ratio > bestRatio) { best = building; bestRatio = ratio; }
                            if (building.price < spendable && ratio > affRatio) { aff = building; affRatio = ratio; }
                        }
                        if (!best) return;
                        if (best.price < spendable) {
                            devLog('BUY bldg ' + best.name + ' #' + (best.amount + 1) + ' price=' + Beautify(best.price) + ' ratio=' + Number(bestRatio).toPrecision(3) + ' (best)');
                            best.buy(1);
                        } else if (best.amount === 0) {
                            return; // new building unlock: deliberately save for it
                        } else if (aff) {
                            devLog('BUY bldg ' + aff.name + ' #' + (aff.amount + 1) + ' price=' + Beautify(aff.price) + ' ratio=' + Number(affRatio).toPrecision(3) + ' (affordable; ' + best.name + '@' + Beautify(best.price) + ' deferred — already owned)');
                            aff.buy(1);
                        }
                    }, 1000, 'buyBuildingsOn', 'buyBuildingsOff'),
                },
                onemind: {
                    configKey: 'oneMind',
                    t: makeBoolToggle('oneMindOn', 'oneMindOff'),
                },
                luckyreserve: {
                    configKey: 'luckyReserve',
                    t: makeBoolToggle('luckyReserveOn', 'luckyReserveOff'),
                },
                // DEV ONLY — toggles the tuning telemetry (ccc-devlog.txt). Inert unless DEV_MODE.
                devlog: {
                    configKey: 'devLog',
                    t: (function() {
                        var active = false;
                        return {
                            toggle: function() {
                                active = !active;
                                Game.Notify('🔧 Dev Log ' + (active ? 'ON' : 'OFF'), active ? 'Writing ccc-devlog.txt' : '', [16, 5], 3);
                                if (active) { devSelfTest(); window.cccDevLog = []; devLog('=== SESSION START ==='); devContext(); devSnapshot(); }
                                updateInfo();
                            },
                            activate: function() { if (!active) this.toggle(); },
                            isActive: function() { return active; },
                        };
                    })(),
                },
            };

            // ── State helpers (driven by TOGGLES) ────────────────────────

            MOD.activateFns = {};
            for (var id in TOGGLES) {
                (function(entry) {
                    MOD.activateFns[entry.configKey] = function() { entry.t.activate(); };
                })(TOGGLES[id]);
            }

            function getStates() {
                var states = {};
                for (var id in TOGGLES) states[id] = TOGGLES[id].t.isActive();
                return states;
            }

            function updateConfig() {
                var cfg = {};
                for (var id in TOGGLES) cfg[TOGGLES[id].configKey] = TOGGLES[id].t.isActive();
                MOD.config = cfg;
            }

            // ── Ratio display ─────────────────────────────────────────────

            for (var i = 0; i < 20; i++) {
                l('product' + i).addEventListener('click', function() { setTimeout(function() { MOD.updateRatios(MOD); }, 60); });
                l('product' + i).style.fontFamily = 'Merriweather';
                MOD.createSpan('productPrice' + i, 'ccc-ratio' + i, MOD.colors[1]);
            }
            for (var i = 0; i < 3; i++) {
                MOD.createColor('products', 'storeBulk', 'ccc-ratioColor' + i, MOD.colors[i]);
                let j = i;
                l('ccc-ratioColor' + j).addEventListener('change', function() { MOD.colors[j] = this.value; MOD.updateRatios(MOD); });
            }
            l('ccc-ratioColor0').style.right = '26px';
            l('ccc-ratioColor1').style.right = '13px';
            // The 'check' hook fires every logic frame (30 fps); recomputing all ratios
            // and synergies that often is wasteful, so throttle to ~4 times per second.
            // Game.T is the frame counter. Store refreshes still update instantly below.
            var tooltipRefresh = null;
            Game.registerHook('check', function() {
                if (Game.T % 8 === 0) MOD.updateRatios(MOD);
                if (Game.T % 30 === 0) updateVisibility();
                if (tooltipRefresh && Game.T % 8 === 0) tooltipRefresh();
                if (Game.T % (Game.fps * 60) === 0 && devActive()) devSnapshot(); // ~once a minute
            });

            var _origRefreshStore = Game.RefreshStore;
            Game.RefreshStore = function() { _origRefreshStore.apply(this, arguments); MOD.updateRatios(MOD); };

            // ── CSS injection ─────────────────────────────────────────────

            var style = document.createElement('style');
            style.textContent = MOD.CSS;
            document.head.appendChild(style);

            // ── Build panel DOM ───────────────────────────────────────────

            var panel = document.createElement('div');
            panel.id  = 'ccc-panel';

            var inner = document.createElement('div');
            inner.id  = 'ccc-inner';

            var header = document.createElement('div');
            header.id  = 'ccc-header';

            var titleEl = document.createElement('span');
            titleEl.id  = 'ccc-title';
            titleEl.textContent = '🍪 Companion';

            var colBtn = document.createElement('span');
            colBtn.id  = 'ccc-collapse';
            colBtn.textContent = '▲';
            colBtn.classList.add('open');

            header.appendChild(titleEl);
            header.appendChild(colBtn);

            var body = document.createElement('div');
            body.id  = 'ccc-body';

            var tooltip = document.createElement('div');
            tooltip.id  = 'ccc-tooltip';
            document.body.appendChild(tooltip);

            ['clicks', 'auto', 'minigame', 'other'].forEach(function(sect, si) {
                if (si > 0) {
                    var sep = document.createElement('div');
                    sep.className = 'ccc-sep';
                    sep.id        = 'ccc-sep-' + sect;
                    body.appendChild(sep);
                }
                var hdr = document.createElement('div');
                hdr.className   = 'ccc-sec-hdr';
                hdr.id          = 'ccc-sec-hdr-' + sect;
                hdr.textContent = S.sections[sect];
                body.appendChild(hdr);

                MOD.FEATURES.filter(function(f) { return f.section === sect; }).forEach(function(f) {
                    var row = document.createElement('div');
                    row.className = 'ccc-row';
                    row.id        = 'ccc-row-' + f.id;

                    var lblEl = document.createElement('span');
                    lblEl.className   = 'ccc-row-lbl';
                    lblEl.textContent = (f.id === 'devlog') ? '🔧 Dev Log' : S.labels[f.labelKey];

                    row.appendChild(lblEl);
                    row.appendChild(document.createElement('div')).className = 'ccc-tog';
                    body.appendChild(row);

                    row.addEventListener('click', function() {
                        if (TOGGLES[f.id]) TOGGLES[f.id].t.toggle();
                    });

                    var desc = S.descriptions[f.labelKey];
                    if (desc) {
                        // Lucky Reserve shows the live reserved amount (CPS*6000) under its
                        // description, refreshed while hovered so it tracks each purchase.
                        var tipText = (f.id === 'luckyreserve')
                            ? function() { return desc + '\n⮡ ' + Beautify(Math.round(Game.cookiesPs * 6000)); }
                            : function() { return desc; };
                        row.addEventListener('mouseenter', function() {
                            var rect = row.getBoundingClientRect();
                            tooltip.textContent   = tipText();
                            tooltip.style.left    = (rect.right + 10) + 'px';
                            tooltip.style.top     = rect.top + 'px';
                            tooltip.style.opacity = '1';
                            tooltipRefresh = (f.id === 'luckyreserve') ? function() { tooltip.textContent = tipText(); } : null;
                        });
                        row.addEventListener('mouseleave', function() {
                            tooltip.style.opacity = '0';
                            tooltipRefresh = null;
                        });
                    }
                });
            });

            // DEV ONLY — dev-log export button (copy-paste channel; fs is unavailable on Steam).
            // Hidden unless dev mode is on (toggled in updateInfo). Remove before release.
            var devActions = document.createElement('div');
            devActions.className = 'ccc-actions';
            devActions.id        = 'ccc-dev-actions';
            devActions.style.display = 'none';
            var exportBtn = document.createElement('button');
            exportBtn.className   = 'ccc-btn';
            exportBtn.id          = 'ccc-export-log';
            exportBtn.textContent = '🔧 Export Dev Log';
            devActions.appendChild(exportBtn);
            body.appendChild(devActions);
            exportBtn.addEventListener('click', function() {
                devSnapshot(); devLog('=== EXPORT ==='); // capture the end state right before exporting
                var log  = window.cccDevLog || [];
                var text = log.length ? log.join('\n') : '(dev log empty — enable the Dev Log toggle and play a bit)';
                Game.Prompt('<h3>Companion Dev Log</h3>'
                    + '<div class="block" style="font-size:11px;">' + log.length + ' lines. Select all (Cmd/Ctrl+A), copy, and paste it back.</div>'
                    + '<textarea id="ccc-log-area" style="width:96%;height:280px;font-size:10px;" readonly>'
                    + text.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</textarea>',
                    [['Close', 'Game.ClosePrompt();']]);
                var ta = l('ccc-log-area'); if (ta) { ta.focus(); ta.select(); }
            });

            inner.appendChild(header);
            inner.appendChild(body);
            panel.appendChild(inner);
            l('game').appendChild(panel);

            // Collapse / expand
            colBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                body.classList.toggle('hidden');
                colBtn.classList.toggle('open');
                tooltip.style.opacity = '0';
            });

            // Drag the panel by its header (clicks on the collapse button are ignored).
            var isDragging = false, dragStartX, dragStartY, panelStartLeft, panelStartTop;
            header.addEventListener('mousedown', function(e) {
                if (e.target === colBtn) return;
                isDragging = true;
                dragStartX = e.clientX; dragStartY = e.clientY;
                panelStartLeft = panel.offsetLeft; panelStartTop = panel.offsetTop;
                e.preventDefault();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                panel.style.left   = Math.max(0, panelStartLeft + e.clientX - dragStartX) + 'px';
                panel.style.top    = Math.max(0, panelStartTop + e.clientY - dragStartY) + 'px';
                panel.style.bottom = 'auto';
            });
            document.addEventListener('mouseup', function() { isDragging = false; });

            // ── updateInfo ────────────────────────────────────────────────

            function updateInfo() {
                updateConfig();
                var states = getStates();
                for (var id in states) {
                    var row = l('ccc-row-' + id);
                    if (row) row.classList.toggle('on', states[id]);
                }
                var da = l('ccc-dev-actions'); if (da) da.style.display = devActive() ? '' : 'none'; // DEV ONLY
                updateVisibility();
            }

            // Hide each toggle whose game system is not unlocked yet, and hide a section
            // header (and its separator) when all of its rows are hidden. Re-checked on
            // every toggle change and periodically, so options appear the moment the game
            // unlocks them (or when a dependent toggle is switched on).
            function updateVisibility() {
                var counts = { clicks: 0, auto: 0, minigame: 0, other: 0 };
                MOD.FEATURES.forEach(function(f) {
                    var row = l('ccc-row-' + f.id);
                    if (!row) return;
                    var shown = f.unlocked ? f.unlocked() : true;
                    if (f.id === 'devlog') shown = devActive(); // DEV ONLY — hidden unless dev mode is on
                    row.style.display = shown ? '' : 'none';
                    if (shown) counts[f.section]++;
                });
                ['clicks', 'auto', 'minigame', 'other'].forEach(function(sect) {
                    var hdr = l('ccc-sec-hdr-' + sect);
                    var sep = l('ccc-sep-' + sect);
                    var visible = counts[sect] > 0;
                    if (hdr) hdr.style.display = visible ? '' : 'none';
                    if (sep) sep.style.display = visible ? '' : 'none';
                });
            }

            updateInfo();

            if (MOD._pendingLoad) {
                var _pl = MOD._pendingLoad;
                MOD._pendingLoad = null;
                MOD.load(_pl);
            }
        }, 200);
    },

    // ── Ratio calculation (CPS/price + synergies) ──────────────────────

    // Profitability score for one building: (CPS per owned unit × global multiplier)
    // divided by the current price, ×100 and rounded to 3 significant figures, then
    // scaled up by the building's active synergies. Higher means a better buy.
    calculateRatio: function(building) {
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
    },

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
    tierBundleRatio: function(building) {
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
    },

    // ── Ratio display update ──────────────────────────────────────────

    // Multiplier that turns a per-unit ratio into the ratio for a whole bulk purchase,
    // matching the store's 1 / 10 / 100 selector (Game.buyBulk). Buying N units costs a
    // geometric sum (×1.15 per unit), so the bulk ratio is the single-unit ratio scaled
    // by N·0.15 / (1.15^N − 1). Returns 1 for N = 1, so single-buy mode is unchanged.
    bulkFactor: function() {
        var n = Game.buyBulk || 1;
        if (n <= 1) return 1;
        return (n * 0.15) / (Math.pow(1.15, n) - 1);
    },

    updateRatios: function(mod) {
        // Scale every displayed ratio to the current bulk selector. The factor is the
        // same for all buildings, so the colour ranking is unchanged; only the shown
        // values follow the 1 / 10 / 100 selector to match the prices the game displays.
        var factor = mod.bulkFactor();
        // First pass: compute every ratio and track the min/max for colour scaling.
        var min = Infinity, max = -Infinity;
        for (var i in Game.Objects) {
            var building = Game.Objects[i];
            var ratio    = mod.calculateRatio(building);
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
    },

    createSpan: function(parent, id, color) {
        var span         = document.createElement('span');
        span.className   = 'ccc-store-ratio';
        span.style.color = color;
        span.id          = id;
        span.textContent = '0';
        l(parent).parentNode.appendChild(span);
    },

    createColor: function(parent, before, id, value) {
        var input       = document.createElement('input');
        input.type      = 'color';
        input.id        = id;
        input.value     = value;
        input.className = 'ccc-store-color';
        l(parent).insertBefore(input, l(before));
    },

    save: function() {
        return JSON.stringify({ config: this.config, colors: this.colors });
    },

    load: function(str) {
        if (!this.activateFns) { this._pendingLoad = str; return; }
        var data   = JSON.parse(str);
        var config = data.config || data;

        if (data.colors) {
            this.colors = data.colors;
            for (var i = 0; i < 3; i++) {
                var el = l('ccc-ratioColor' + i);
                if (el) el.value = this.colors[i];
            }
        }

        for (var key in config) {
            if (config[key] === true && this.activateFns[key]) this.activateFns[key]();
        }

        if (this.updateRatios) this.updateRatios(this);
    },
});
