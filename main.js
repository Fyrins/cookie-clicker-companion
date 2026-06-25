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
#ccc-tooltip{position:fixed;z-index:10000;background:#1a0a03;border:1px solid #6a4418;border-radius:5px;padding:7px 10px;font-family:Merriweather,Georgia,serif;font-size:9px;color:#c8a070;max-width:180px;line-height:1.5;pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 4px 16px rgba(0,0,0,.65)}
.ccc-store-ratio{position:absolute;bottom:0;right:1px;font-family:Merriweather;font-size:7pt;font-weight:bold}
.ccc-store-color{position:absolute;top:-3px;right:0;width:17px;height:20px;background:rgba(0,0,0,0);border:none;outline:none;opacity:.7}
`,

    FEATURES: [
        { id: 'golden',       labelKey: 'golden',       section: 'clicks' },
        { id: 'wrath',        labelKey: 'wrath',        section: 'clicks' },
        { id: 'bigcookie',    labelKey: 'bigCookie',    section: 'clicks' },
        { id: 'buy',          labelKey: 'buy',          section: 'auto'   },
        { id: 'wrinklers',    labelKey: 'wrinklers',    section: 'auto'   },
        { id: 'lumps',        labelKey: 'lumps',        section: 'auto'   },
        { id: 'spell',        labelKey: 'spell',        section: 'auto'   },
        { id: 'conjure',      labelKey: 'conjure',      section: 'auto'   },
        { id: 'fortune',      labelKey: 'fortune',      section: 'auto'   },
        { id: 'dragon',       labelKey: 'dragon',       section: 'auto'   },
        { id: 'onemind',      labelKey: 'oneMind',      section: 'other'  },
        { id: 'luckyreserve', labelKey: 'luckyReserve', section: 'other'  },
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
                sections: { clicks: 'Clicks', auto: 'Automation', other: 'Other' },
                labels: { golden:'Golden Cookie', wrath:'Wrath Cookie', bigCookie:'Big Cookie',
                    wrinklers:'Wrinklers', lumps:'Sugar Lumps', spell:'Spell', conjure:'Conjure Baked Goods',
                    fortune:'Fortune', dragon:'Dragon', buy:'Auto Buy', oneMind:'One Mind',
                    luckyReserve:'Lucky Reserve' },
                descriptions: {}, notify: {
                    goldenOn:'', goldenOff:'', wrathOn:'', wrathOff:'', bigOn:'', bigOff:'',
                    wrinklOn:'', wrinklOff:'', lumpsOn:'', lumpsOff:'', spellOn:'', spellOff:'',
                    conjureOn:'', conjureOff:'', fortuneOn:'', fortuneOff:'', dragonOn:'', dragonOff:'',
                    buyOn:'', buyOff:'', oneMindOn:'', oneMindOff:'',
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

            // ── Toggle registry ───────────────────────────────────────────

            var TOGGLES = {
                golden: {
                    configKey: 'autoClickGoldenCookie',
                    t: makeToggle(function() {
                        Game.shimmers.forEach(function(s) {
                            if ((s.type === 'golden' && s.wrath === 0) || s.type === 'reindeer') s.pop();
                        });
                    }, 500, 'goldenOn', 'goldenOff'),
                },
                wrath: {
                    configKey: 'autoClickWrathCookie',
                    t: makeToggle(function() {
                        Game.shimmers.forEach(function(s) {
                            if (s.type === 'golden' && s.wrath === 1) s.pop();
                        });
                    }, 500, 'wrathOn', 'wrathOff'),
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
                    }, 500, 'wrinklOn', 'wrinklOff'),
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
                    }, 500, 'lumpsOn', 'lumpsOff'),
                },
                spell: {
                    configKey: 'autoCastSpell',
                    t: makeToggle(function() {
                        // Cast "Force the Hand of Fate" once the Grimoire's magic is full.
                        var grimoire = Game.ObjectsById[7].minigame;
                        if (grimoire && grimoire.magic === grimoire.magicM) grimoire.castSpell(grimoire.spellsById[1]);
                    }, 500, 'spellOn', 'spellOff'),
                },
                conjure: {
                    configKey: 'autoConjure',
                    t: makeToggle(function() {
                        // Cast "Conjure Baked Goods" whenever enough magic is available.
                        var grimoire = Game.ObjectsById[7].minigame;
                        if (grimoire) {
                            var spell = grimoire.spells['conjure baked goods'];
                            if (grimoire.magic >= grimoire.getSpellCost(spell)) grimoire.castSpell(spell);
                        }
                    }, 500, 'conjureOn', 'conjureOff'),
                },
                fortune: {
                    configKey: 'autoFortuneNews',
                    t: makeToggle(function() {
                        if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') Game.tickerL.dispatchEvent(clickEvent);
                    }, 500, 'fortuneOn', 'fortuneOff'),
                },
                dragon: {
                    configKey: 'autoDragon',
                    t: makeToggle(function() {
                        // Game.UpgradeDragon() is the game's own single-level-up routine:
                        // it checks the next level's cost, pays it, plays the sound,
                        // advances Game.dragonLevel and fires the "Here be dragon" win at
                        // the final level (27). It is a no-op when the dragon is maxed out
                        // or the next level is unaffordable, and it never touches auras.
                        Game.UpgradeDragon();
                    }, 500, 'dragonOn', 'dragonOff'),
                },
                buy: {
                    configKey: 'autoBuy',
                    t: makeToggle(function() {
                        // When the Lucky Reserve toggle is on, keep CPS*6000 in the bank so a
                        // Golden "Lucky!" pays its full capped amount; spend only the surplus.
                        var spendable = Game.cookies - (TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0);
                        // Phase 1 — find the building with the best profitability ratio.
                        var bestBuilding = null, bestRatio = 0;
                        for (var i in Game.Objects) {
                            var building = Game.Objects[i];
                            var ratio    = MOD.calculateRatio(building);
                            // calculateRatio returns 0 for unowned buildings; fall back to a
                            // raw CPS/price estimate so the very first unit can still be bought.
                            if (!ratio || isNaN(ratio)) ratio = (building.cps(building) * Game.globalCpsMult / building.price) * 100;
                            if (ratio > bestRatio) { bestBuilding = building; bestRatio = ratio; }
                        }
                        // Phase 2 — buy every affordable upgrade, skipping the irreversible
                        // Elder / Grandmapocalypse ones. "One mind" is bought only when its
                        // own toggle is active, and its confirmation prompt is auto-accepted.
                        for (var i in Game.UpgradesInStore) {
                            var upgrade      = Game.UpgradesInStore[i];
                            var upgradePrice = upgrade.getPrice ? upgrade.getPrice() : upgrade.basePrice;
                            if (upgrade.pool === 'toggle' || upgradePrice >= spendable) continue;
                            if (upgrade.name === 'Communal brainsweep' || upgrade.name === 'Elder Pact' ||
                                upgrade.name === 'Elder Pledge'        || upgrade.name === 'Elder Covenant' ||
                                upgrade.name === 'Revoke Elder Covenant') continue;
                            if (upgrade.name === 'One mind' && TOGGLES.onemind.t.isActive()) {
                                upgrade.buy(); l('promptOption0').dispatchEvent(clickEvent);
                            } else {
                                upgrade.buy();
                            }
                        }
                        // Phase 3 — buy one unit of the best building if it is affordable.
                        if (bestBuilding && bestBuilding.price < spendable) bestBuilding.buy(1);
                    }, 500, 'buyOn', 'buyOff'),
                },
                onemind: {
                    configKey: 'oneMind',
                    t: makeBoolToggle('oneMindOn', 'oneMindOff'),
                },
                luckyreserve: {
                    configKey: 'luckyReserve',
                    t: makeBoolToggle('luckyReserveOn', 'luckyReserveOff'),
                },
            };

            // ── State helpers (driven by TOGGLES) ────────────────────────

            MOD.activateFns = {};
            for (var id in TOGGLES) {
                (function(entry) {
                    MOD.activateFns[entry.configKey] = function() { entry.t.activate(); };
                })(TOGGLES[id]);
            }

            function switchAll(val) {
                for (var id in TOGGLES) {
                    if (TOGGLES[id].t.isActive() !== val) TOGGLES[id].t.toggle();
                }
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
            Game.registerHook('check', function() { if (Game.T % 8 === 0) MOD.updateRatios(MOD); });

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

            ['clicks', 'auto', 'other'].forEach(function(sect, si) {
                if (si > 0) {
                    var sep = document.createElement('div');
                    sep.className = 'ccc-sep';
                    body.appendChild(sep);
                }
                var hdr = document.createElement('div');
                hdr.className   = 'ccc-sec-hdr';
                hdr.textContent = S.sections[sect];
                body.appendChild(hdr);

                MOD.FEATURES.filter(function(f) { return f.section === sect; }).forEach(function(f) {
                    var row = document.createElement('div');
                    row.className = 'ccc-row';
                    row.id        = 'ccc-row-' + f.id;

                    var lblEl = document.createElement('span');
                    lblEl.className   = 'ccc-row-lbl';
                    lblEl.textContent = S.labels[f.labelKey];

                    row.appendChild(lblEl);
                    row.appendChild(document.createElement('div')).className = 'ccc-tog';
                    body.appendChild(row);

                    row.addEventListener('click', function() {
                        if (TOGGLES[f.id]) TOGGLES[f.id].t.toggle();
                    });

                    var desc = S.descriptions[f.labelKey];
                    if (desc) {
                        row.addEventListener('mouseenter', function() {
                            var rect = row.getBoundingClientRect();
                            tooltip.textContent   = desc;
                            tooltip.style.left    = (rect.right + 10) + 'px';
                            tooltip.style.top     = rect.top + 'px';
                            tooltip.style.opacity = '1';
                        });
                        row.addEventListener('mouseleave', function() { tooltip.style.opacity = '0'; });
                    }
                });
            });

            var actions = document.createElement('div');
            actions.className = 'ccc-actions';

            var btnOn = document.createElement('button');
            btnOn.className   = 'ccc-btn';
            btnOn.textContent = S.enableAll;
            btnOn.addEventListener('click', function() { switchAll(true); });

            var btnOff = document.createElement('button');
            btnOff.className   = 'ccc-btn';
            btnOff.textContent = S.disableAll;
            btnOff.addEventListener('click', function() { switchAll(false); });

            actions.appendChild(btnOn);
            actions.appendChild(btnOff);
            body.appendChild(actions);

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

        // Extra raw CPS a synergy `partner` gains when a synergy `factor` is applied.
        function partnerBoost(partner, factor) {
            var partnerCps = partner.storedTotalCps * Game.globalCpsMult;
            return partnerCps - partnerCps / (1 + factor);
        }

        var ratio        = Number((((building.storedTotalCps / building.amount) * Game.globalCpsMult) / building.price * 100).toPrecision(3));
        var synergyBoost = 0;

        if (building.name === 'Grandma') {
            // Each owned grandma-synergy upgrade boosts its tied building.
            for (var i in Game.GrandmaSynergies) {
                if (Game.Has(Game.GrandmaSynergies[i])) {
                    var partner = Game.Upgrades[Game.GrandmaSynergies[i]].buildingTie;
                    synergyBoost += partnerBoost(partner, building.amount * 0.01 * (1 / (partner.id - 1)));
                }
            }
        } else if (building.name === 'Portal' && Game.Has('Elder Pact')) {
            // Elder Pact ties portals to the number of grandmas owned.
            var grandmas = Game.Objects['Grandma'];
            synergyBoost += (building.amount * 0.05 * grandmas.amount) * Game.globalCpsMult;
        }

        // Generic building-to-building synergies (e.g. Bank/Temple pairs).
        for (var i in building.synergies) {
            var synergy = building.synergies[i];
            if (Game.Has(synergy.name)) {
                var isPrimary = (building === synergy.buildingTie1);
                var partner   = isPrimary ? synergy.buildingTie2 : synergy.buildingTie1;
                var weight    = isPrimary ? 0.001 : 0.05;
                synergyBoost += partnerBoost(partner, building.amount * weight);
            }
        }

        // Scale the base ratio by the synergies' share of total CPS.
        if (synergyBoost > 0) ratio = Number((ratio + (ratio * (synergyBoost / Game.cookiesPs))).toPrecision(3));
        return ratio;
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
