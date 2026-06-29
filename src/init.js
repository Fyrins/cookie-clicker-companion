import { FALLBACK_STRINGS } from './strings.js';
import { CLUSTER, PRESETS, makeMarketParams } from './strategy.js';
import { createDevTools } from './dev.js';
import createGolden from './toggles/golden.js';
import createWrath from './toggles/wrath.js';
import createBigcookie from './toggles/bigcookie.js';
import createWrinklers from './toggles/wrinklers.js';
import createLumps from './toggles/lumps.js';
import createSpell from './toggles/spell.js';
import createMarket from './toggles/market.js';
import createOffice from './toggles/office.js';
import createGarden from './toggles/garden.js';
import createClovergarden from './toggles/clovergarden.js';
import createBreeder from './toggles/breeder.js';
import createPantheon from './toggles/pantheon.js';
import createFortune from './toggles/fortune.js';
import createDragon from './toggles/dragon.js';
import createDragonsacrifice from './toggles/dragonsacrifice.js';
import createDragonaura from './toggles/dragonaura.js';
import createBuyupgrades from './toggles/buyupgrades.js';
import createBuybuildings from './toggles/buybuildings.js';
import createOnemind from './toggles/onemind.js';
import createLuckyreserve from './toggles/luckyreserve.js';
import createDevlog from './toggles/devlog.js';

export function init() {
    var MOD = this;
    setTimeout(function() {

        var lang = (typeof locId !== 'undefined' ? locId : (Game.language || 'EN')).toUpperCase();
        // S = localized UI strings (labels, section titles, notifications). Tries the
        // game language, then English, then the hard-coded English default below.
        var S    = MOD.loadStrings(lang) || MOD.loadStrings('EN');
        S = S || FALLBACK_STRINGS;

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

        // ── Build ctx (shared context for toggle factories and dev tools) ──
        // TOGGLES is created empty first; factories populate it below. ctx holds
        // the same reference, so all factories read the final populated object at
        // runtime (toggle bodies run after init completes).
        var TOGGLES = {};

        var ctx = {
            S: S,
            MOD: MOD,
            TOGGLES: TOGGLES,
            makeToggle: makeToggle,
            makeBoolToggle: makeBoolToggle,
            cookieEl: cookieEl,
            clickEvent: clickEvent,
        };

        // Expose updateInfo on ctx early (function declaration is hoisted).
        ctx.updateInfo = updateInfo; // DEV ONLY: devlog toggle calls ctx.updateInfo()

        // ── Dev mode (tuning diagnostics) — OFF in the repo/release ───────────
        var devTools = createDevTools(ctx);
        var devActive  = devTools.devActive;
        var devLog     = devTools.devLog;
        var devSnapshot = devTools.devSnapshot;
        var devSelfTest = devTools.devSelfTest;
        var devContext  = devTools.devContext;
        ctx.devActive   = devActive;
        ctx.devLog      = devLog;
        ctx.devSnapshot = devSnapshot;
        ctx.devSelfTest = devSelfTest;
        ctx.devContext  = devContext;

        MOD._mktStarvedTicks = 0;

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
        // Patience floor for the building auto-buy: don't fritter cookies on a mediocre
        // affordable building when the best buy is far better — saving even a tick or two to
        // afford a high-ratio building beats locking cookies into a near-worthless unit. We
        // only buy the best affordable when it scores at least this fraction of the global
        // best ratio; otherwise we hold and let the bank build. Shared with buybuildings.js
        // via ctx so the two stay in lockstep.
        // Tuning (late-game ascension regrind, real logs): at 0.05 the floor was far too low.
        // calculateRatio returns max(perUnit, tierBundle); between tier thresholds the best
        // building's score collapses to its myopic per-unit value, which drops the floor and
        // let the bank fritter into ratio-0.001 buildings (20x worse than saving for the next
        // tier spike). 0.25 means "only buy an affordable building within 4x of the best,
        // otherwise save toward it". Value to revisit on further logs.
        var BUY_FLOOR = 0.25;
        ctx.BUY_FLOOR = BUY_FLOOR;

        // True when the building/upgrade auto-buy is about to spend cookies this tick: an
        // eligible upgrade is affordable, or the building auto-buy will buy a building (the
        // global best if affordable, else a best-affordable that clears the patience floor).
        // The Stock Market uses this to stand down, so CPS-growing purchases always win the
        // shared cookie pool over stock trading. MUST mirror buybuildings.js exactly.
        function autoBuyWillSpend(spendable) {
            if (TOGGLES.buyupgrades.t.isActive() && hasAffordableEligibleUpgrade(spendable)) return true;
            if (TOGGLES.buybuildings.t.isActive()) {
                // Unlock-first will spend this tick (mirror buybuildings.js): any affordable,
                // unlocked, unowned building type is bought before the ratio logic runs.
                for (var k in Game.Objects) {
                    var nb = Game.Objects[k];
                    if (nb.amount === 0 && !nb.locked && nb.price < spendable) return true;
                }
                var best = null, bestRatio = 0, aff = null, affRatio = 0;
                for (var i in Game.Objects) {
                    var b = Game.Objects[i];
                    var r = MOD.calculateRatio(b);
                    if (!r || isNaN(r)) r = (b.cps(b) * Game.globalCpsMult / b.price) * 100;
                    if (r > bestRatio) { bestRatio = r; best = b; }
                    if (b.price < spendable && r > affRatio) { aff = b; affRatio = r; }
                }
                if (best) {
                    if (best.price < spendable) return true;             // buys the global best
                    if (best.amount === 0) return false;                 // saving for a new building unlock
                    if (aff && affRatio >= bestRatio * BUY_FLOOR) return true; // buys the best affordable
                    return false;                                        // patience floor: saving instead
                }
            }
            return false;
        }
        ctx.upgradeEligible = upgradeEligible;
        ctx.hasAffordableEligibleUpgrade = hasAffordableEligibleUpgrade;
        ctx.autoBuyWillSpend = autoBuyWillSpend;

        var marketParams = makeMarketParams(MOD);
        ctx.marketParams = marketParams;

        // ── Toggle registry ───────────────────────────────────────────

        TOGGLES.golden         = createGolden(ctx);
        TOGGLES.wrath          = createWrath(ctx);
        TOGGLES.bigcookie      = createBigcookie(ctx);
        TOGGLES.wrinklers      = createWrinklers(ctx);
        TOGGLES.lumps          = createLumps(ctx);
        TOGGLES.spell          = createSpell(ctx);
        TOGGLES.market         = createMarket(ctx);
        TOGGLES.office         = createOffice(ctx);
        TOGGLES.garden         = createGarden(ctx);
        TOGGLES.clovergarden   = createClovergarden(ctx);
        TOGGLES.breeder        = createBreeder(ctx);
        TOGGLES.pantheon       = createPantheon(ctx);
        TOGGLES.fortune        = createFortune(ctx);
        TOGGLES.dragon         = createDragon(ctx);
        TOGGLES.dragonsacrifice = createDragonsacrifice(ctx);
        TOGGLES.dragonaura     = createDragonaura(ctx);
        TOGGLES.buyupgrades    = createBuyupgrades(ctx);
        TOGGLES.buybuildings   = createBuybuildings(ctx);
        TOGGLES.onemind        = createOnemind(ctx);
        TOGGLES.luckyreserve   = createLuckyreserve(ctx);
        // DEV ONLY — toggles the tuning telemetry (ccc-devlog.txt). Inert unless DEV_MODE.
        TOGGLES.devlog         = createDevlog(ctx);

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

        // ── Strategy preset helpers ───────────────────────────────────

        // Force a toggle to a target state, reusing its toggle() so the notification and
        // updateInfo() refresh fire exactly as on a manual click.
        function setToggle(id, want) {
            var t = TOGGLES[id] && TOGGLES[id].t;
            if (t && want !== t.isActive()) t.toggle();
        }

        // Reflect the active mode in the dropdown (no-op if it is not built yet).
        function syncSelector() {
            var s = l('ccc-mode');
            if (s) s.value = MOD.activeMode;
        }

        // Apply a preset: 'manual' leaves every toggle untouched; the others drive the
        // cluster to the table above. Preset writes go through setToggle (not the row
        // click listener), so they never trip the divergence-back-to-Manual logic.
        function applyPreset(mode) {
            MOD.activeMode = mode;
            if (mode !== 'manual' && PRESETS[mode]) {
                var p = PRESETS[mode];
                for (var id in p) setToggle(id, p[id]);
            }
            syncSelector();
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

        // Strategy preset selector — sits above the sections. The mode names are coined
        // strategy nouns and stay hard-coded (no i18n churn); only the caption and the
        // tooltip are localized. Changing it applies the preset; picking a toggle by hand
        // afterwards drops the selector back to Manual (handled in the row click below).
        var modeRow = document.createElement('div');
        modeRow.className = 'ccc-mode-row';
        modeRow.id        = 'ccc-mode-row';

        var modeLbl = document.createElement('span');
        modeLbl.className   = 'ccc-mode-lbl';
        modeLbl.textContent = (S.sections && S.sections.strategy) || 'Strategy';

        var modeSel = document.createElement('select');
        modeSel.id = 'ccc-mode';
        [['manual', 'Manual'], ['grind', 'Grind'], ['investor', 'Investor']].forEach(function(o) {
            var opt = document.createElement('option');
            opt.value = o[0]; opt.textContent = o[1];
            modeSel.appendChild(opt);
        });
        modeSel.value = MOD.activeMode;

        modeRow.appendChild(modeLbl);
        modeRow.appendChild(modeSel);
        body.appendChild(modeRow);

        modeSel.addEventListener('change', function() { applyPreset(this.value); });

        var modeDesc = S.descriptions && S.descriptions.strategy;
        if (modeDesc) {
            modeRow.addEventListener('mouseenter', function() {
                var rect = modeRow.getBoundingClientRect();
                tooltip.textContent   = modeDesc;
                tooltip.style.left    = (rect.right + 10) + 'px';
                tooltip.style.top     = rect.top + 'px';
                tooltip.style.opacity = '1';
                tooltipRefresh = null;
            });
            modeRow.addEventListener('mouseleave', function() { tooltip.style.opacity = '0'; });
        }

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
                    if (!TOGGLES[f.id]) return;
                    TOGGLES[f.id].t.toggle();
                    // A hand edit of a cluster toggle means the active preset no longer
                    // holds — drop the selector to Manual so the label stays honest.
                    if (CLUSTER.indexOf(f.id) !== -1 && MOD.activeMode !== 'manual') {
                        MOD.activeMode = 'manual';
                        syncSelector();
                    }
                });

                var desc = S.descriptions[f.labelKey];
                if (desc) {
                    // Lucky Reserve shows the live reserved amount (rawCpS*6000) under its
                    // description, refreshed while hovered so it tracks each purchase.
                    var tipText = (f.id === 'luckyreserve')
                        ? function() { return desc + '\n⮡ ' + Beautify(Math.round(Game.cookiesPsRawHighest * 6000)); }
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
}
