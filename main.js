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
        { id: 'golden',    labelKey: 'golden',    section: 'clicks' },
        { id: 'wrath',     labelKey: 'wrath',     section: 'clicks' },
        { id: 'bigcookie', labelKey: 'bigCookie', section: 'clicks' },
        { id: 'buy',       labelKey: 'buy',       section: 'auto'   },
        { id: 'wrinklers', labelKey: 'wrinklers', section: 'auto'   },
        { id: 'spell',     labelKey: 'spell',     section: 'auto'   },
        { id: 'fortune',   labelKey: 'fortune',   section: 'auto'   },
        { id: 'dragon',    labelKey: 'dragon',    section: 'auto'   },
        { id: 'onemind',   labelKey: 'oneMind',   section: 'other'  },
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
            var S    = MOD.loadStrings(lang) || MOD.loadStrings('EN');
            S = S || {
                modEnabled: 'Cookie Clicker Companion loaded',
                enableAll: '+ Enable all', disableAll: '- Disable all',
                sections: { clicks: 'Clicks', auto: 'Automation', other: 'Other' },
                labels: { golden:'Golden Cookie', wrath:'Wrath Cookie', bigCookie:'Big Cookie',
                    wrinklers:'Wrinklers', spell:'Spell',
                    fortune:'Fortune', dragon:'Dragon', buy:'Auto Buy', oneMind:'One Mind' },
                descriptions: {}, notify: {
                    goldenOn:'', goldenOff:'', wrathOn:'', wrathOff:'', bigOn:'', bigOff:'',
                    wrinklOn:'', wrinklOff:'', spellOn:'', spellOff:'',
                    fortuneOn:'', fortuneOff:'', dragonOn:'', dragonOff:'', buyOn:'', buyOff:'',
                    oneMindOn:'', oneMindOff:'',
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
                spell: {
                    configKey: 'autoCastSpell',
                    t: makeToggle(function() {
                        var mg = Game.ObjectsById[7].minigame;
                        if (mg && mg.magic === mg.magicM) mg.castSpell(mg.spellsById[1]);
                    }, 500, 'spellOn', 'spellOff'),
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
                        var toBuy = null, maxRatio = 0;
                        for (var i in Game.Objects) {
                            var obj   = Game.Objects[i];
                            var ratio = MOD.calculateRatio(obj);
                            if (!ratio || isNaN(ratio)) ratio = (obj.cps(obj) * Game.globalCpsMult / obj.price) * 100;
                            if (ratio > maxRatio) { toBuy = obj; maxRatio = ratio; }
                        }
                        for (var i in Game.UpgradesInStore) {
                            var upg      = Game.UpgradesInStore[i];
                            var upgPrice = upg.getPrice ? upg.getPrice() : upg.basePrice;
                            if (upg.pool === 'toggle' || upgPrice >= Game.cookies) continue;
                            if (upg.name === 'Communal brainsweep' || upg.name === 'Elder Pact' ||
                                upg.name === 'Elder Pledge'        || upg.name === 'Elder Covenant' ||
                                upg.name === 'Revoke Elder Covenant') continue;
                            if (upg.name === 'One mind' && TOGGLES.onemind.t.isActive()) {
                                upg.buy(); l('promptOption0').dispatchEvent(clickEvent);
                            } else {
                                upg.buy();
                            }
                        }
                        if (toBuy && toBuy.price < Game.cookies) toBuy.buy(1);
                    }, 500, 'buyOn', 'buyOff'),
                },
                onemind: {
                    configKey: 'oneMind',
                    t: makeBoolToggle('oneMindOn', 'oneMindOff'),
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
            Game.registerHook('check', function() { MOD.updateRatios(MOD); });

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

            // Drag
            var isDragging = false, dragSX, dragSY, pSL, pST;
            header.addEventListener('mousedown', function(e) {
                if (e.target === colBtn) return;
                isDragging = true;
                dragSX = e.clientX; dragSY = e.clientY;
                pSL = panel.offsetLeft; pST = panel.offsetTop;
                e.preventDefault();
            });
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                panel.style.left   = Math.max(0, pSL + e.clientX - dragSX) + 'px';
                panel.style.top    = Math.max(0, pST + e.clientY - dragSY) + 'px';
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

    calculateRatio: function(me) {
        if (!me.amount) return 0;
        var ratio        = Number((((me.storedTotalCps / me.amount) * Game.globalCpsMult) / me.price * 100).toPrecision(3));
        var synergiesWith = {};
        var synergyBoost  = 0;

        if (me.name === 'Grandma') {
            for (var i in Game.GrandmaSynergies) {
                if (Game.Has(Game.GrandmaSynergies[i])) {
                    var other = Game.Upgrades[Game.GrandmaSynergies[i]].buildingTie;
                    var mult  = me.amount * 0.01 * (1 / (other.id - 1));
                    var boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + mult);
                    synergyBoost += boost;
                    if (!synergiesWith[other.plural]) synergiesWith[other.plural] = 0;
                    synergiesWith[other.plural] += mult;
                }
            }
        } else if (me.name === 'Portal' && Game.Has('Elder Pact')) {
            var other = Game.Objects['Grandma'];
            var boost = (me.amount * 0.05 * other.amount) * Game.globalCpsMult;
            synergyBoost += boost;
            if (!synergiesWith[other.plural]) synergiesWith[other.plural] = 0;
            synergiesWith[other.plural] += boost / (other.storedTotalCps * Game.globalCpsMult);
        }

        for (var i in me.synergies) {
            var it = me.synergies[i];
            if (Game.Has(it.name)) {
                var weight = 0.05;
                var other  = it.buildingTie1;
                if (me === it.buildingTie1) { weight = 0.001; other = it.buildingTie2; }
                var boost = (other.storedTotalCps * Game.globalCpsMult) - (other.storedTotalCps * Game.globalCpsMult) / (1 + me.amount * weight);
                synergyBoost += boost;
                if (!synergiesWith[other.plural]) synergiesWith[other.plural] = 0;
                synergiesWith[other.plural] += me.amount * weight;
            }
        }

        if (synergyBoost > 0) ratio = Number((ratio + (ratio * (synergyBoost / Game.cookiesPs))).toPrecision(3));
        return ratio;
    },

    // ── Ratio display update ──────────────────────────────────────────

    updateRatios: function(M) {
        var min = Infinity, max = -Infinity;
        for (var j in Game.Objects) {
            var me    = Game.Objects[j];
            var ratio = M.calculateRatio(me);
            M.values[me.id] = ratio > 0 ? ratio : 0;
            var el = l('ccc-ratio' + me.id);
            if (el && ratio > 0) {
                el.textContent = ratio;
                if (ratio < min) min = ratio;
                if (ratio > max) max = ratio;
            }
        }
        for (var j in Game.Objects) {
            var me = Game.Objects[j];
            var el = l('ccc-ratio' + me.id);
            if (!el) continue;
            var v = M.values[me.id];
            el.style.color = v === min ? M.colors[0] : v === max ? M.colors[2] : M.colors[1];
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
