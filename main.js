// GENERATED from src/ by esbuild — DO NOT edit main.js directly.
// Edit the files under src/ and run `npm run build` (or `npm run watch`).
(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res, err) => function __init() {
    if (err) throw err[0];
    try {
      return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
    } catch (e) {
      throw err = [e], e;
    }
  };
  var __commonJS = (cb, mod) => function __require2() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/css.js
  var CSS;
  var init_css = __esm({
    "src/css.js"() {
      CSS = `
#ccc-panel{position:fixed;bottom:60px;left:10px;width:215px;z-index:9999;font-family:Merriweather,Georgia,serif;font-size:11px;color:#f0ddb8;user-select:none;animation:ccc-in .45s cubic-bezier(.22,1,.36,1) both}
@keyframes ccc-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
#ccc-inner{background:linear-gradient(155deg,#1e0f05 0%,#130a03 100%);border:1px solid #6a4418;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.75),inset 0 1px 0 rgba(212,150,58,.12),inset 0 -1px 0 rgba(0,0,0,.4)}
#ccc-header{display:flex;align-items:center;justify-content:space-between;padding:9px 13px 8px;background:linear-gradient(180deg,#271005 0%,#1c0c03 100%);border-bottom:1px solid #3a1a06;cursor:grab}
#ccc-header:active{cursor:grabbing}
#ccc-title{font-size:12px;font-weight:700;color:#d4963a;letter-spacing:.6px;text-shadow:0 0 12px rgba(212,150,58,.5)}
#ccc-collapse{width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6a4010;font-size:9px;line-height:1;transition:color .2s,transform .3s;transform:rotate(0deg)}
#ccc-collapse:hover{color:#d4963a}
#ccc-collapse.open{transform:rotate(180deg)}
#ccc-body{overflow-y:auto;overflow-x:hidden;transition:max-height .3s ease,padding .3s ease;max-height:85vh;padding:7px 0}
#ccc-body::-webkit-scrollbar{width:7px}
#ccc-body::-webkit-scrollbar-thumb{background:#3a1a06;border-radius:4px}
#ccc-body::-webkit-scrollbar-thumb:hover{background:#6a4418}
#ccc-body.hidden{max-height:0;padding:0}
.ccc-sec-hdr{padding:3px 13px 2px;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#5a3410;margin-bottom:3px}
.ccc-mode-row{display:flex;align-items:center;gap:7px;padding:5px 13px 8px;border-bottom:1px solid #220f04;margin-bottom:4px}
.ccc-mode-lbl{color:#8a6030;font-size:10.5px;flex-shrink:0}
#ccc-mode{flex:1;background:#1a0a03;color:#d4963a;border:1px solid #3a1a06;border-radius:5px;padding:3px 6px;font-family:Merriweather,Georgia,serif;font-size:10px;cursor:pointer;outline:none;transition:border-color .2s}
#ccc-mode:hover{border-color:#b07828}
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
`;
    }
  });

  // src/breeder-recipes.js
  var THUMB, CRONE, GILD, CLOV, SHIM, CHAINS, TARGET_PRIORITY;
  var init_breeder_recipes = __esm({
    "src/breeder-recipes.js"() {
      THUMB = { target: "thumbcorn", parents: { bakerWheat: 2 } };
      CRONE = { target: "cronerice", parents: { bakerWheat: 1, thumbcorn: 1 } };
      GILD = { target: "gildmillet", parents: { cronerice: 1, thumbcorn: 1 } };
      CLOV = { target: "clover", parents: { bakerWheat: 1, gildmillet: 1 } };
      SHIM = { target: "shimmerlily", parents: { clover: 1, gildmillet: 1 } };
      CHAINS = {
        goldenClover: [THUMB, CRONE, GILD, { target: "goldenClover", parents: { bakerWheat: 1, gildmillet: 1 } }],
        shimmerlily: [THUMB, CRONE, GILD, CLOV, SHIM],
        elderwort: [THUMB, CRONE, GILD, CLOV, SHIM, { target: "elderwort", parents: { shimmerlily: 1, cronerice: 1 } }]
      };
      TARGET_PRIORITY = ["goldenClover", "shimmerlily", "elderwort"];
    }
  });

  // src/features.js
  var FEATURES;
  var init_features = __esm({
    "src/features.js"() {
      init_breeder_recipes();
      FEATURES = [
        { id: "golden", labelKey: "golden", section: "clicks" },
        { id: "wrath", labelKey: "wrath", section: "clicks", unlocked: function() {
          return Game.elderWrath > 0;
        } },
        { id: "bigcookie", labelKey: "bigCookie", section: "clicks" },
        { id: "buybuildings", labelKey: "buyBuildings", section: "auto" },
        { id: "buyupgrades", labelKey: "buyUpgrades", section: "auto" },
        { id: "wrinklers", labelKey: "wrinklers", section: "auto", unlocked: function() {
          return Game.elderWrath > 0;
        } },
        { id: "lumps", labelKey: "lumps", section: "auto", unlocked: function() {
          return Game.canLumps();
        } },
        { id: "fortune", labelKey: "fortune", section: "auto", unlocked: function() {
          return Game.Has("Fortune cookies");
        } },
        { id: "dragon", labelKey: "dragon", section: "auto", unlocked: function() {
          return Game.Has("A crumbly egg");
        } },
        { id: "dragonsacrifice", labelKey: "dragonSacrifice", section: "auto", unlocked: function() {
          var r = l("ccc-row-dragon");
          return Game.Has("A crumbly egg") && r && r.classList.contains("on");
        } },
        { id: "dragonaura", labelKey: "dragonAura", section: "auto", unlocked: function() {
          return Game.Has("A crumbly egg") && Game.dragonLevel >= 19;
        } },
        { id: "spell", labelKey: "spell", section: "minigame", unlocked: function() {
          return Game.isMinigameReady(Game.Objects["Wizard tower"]);
        } },
        { id: "market", labelKey: "market", section: "minigame", unlocked: function() {
          return Game.isMinigameReady(Game.Objects["Bank"]);
        } },
        { id: "office", labelKey: "office", section: "minigame", unlocked: function() {
          return Game.isMinigameReady(Game.Objects["Bank"]);
        } },
        { id: "garden", labelKey: "garden", section: "minigame", unlocked: function() {
          return Game.isMinigameReady(Game.Objects["Farm"]);
        } },
        { id: "breeder", labelKey: "breeder", section: "minigame", unlocked: function() {
          if (!Game.isMinigameReady(Game.Objects["Farm"]) || !Game.Has("Turbo-charged soil")) return false;
          var m = Game.Objects["Farm"].minigame;
          if (!m) return false;
          for (var i = 0; i < TARGET_PRIORITY.length; i++) {
            var p = m.plants[TARGET_PRIORITY[i]];
            if (p && !p.unlocked) return true;
          }
          return false;
        } },
        { id: "clovergarden", labelKey: "cloverGarden", section: "minigame", unlocked: function() {
          if (!Game.isMinigameReady(Game.Objects["Farm"]) || !Game.Has("Turbo-charged soil")) return false;
          var m = Game.Objects["Farm"].minigame;
          return !!(m && m.plants["goldenClover"] && m.plants["goldenClover"].unlocked);
        } },
        { id: "pantheon", labelKey: "pantheon", section: "minigame", unlocked: function() {
          return Game.isMinigameReady(Game.Objects["Temple"]);
        } },
        { id: "onemind", labelKey: "oneMind", section: "other", unlocked: function() {
          return !!(Game.Upgrades["One mind"] && Game.Upgrades["One mind"].unlocked);
        } },
        { id: "luckyreserve", labelKey: "luckyReserve", section: "other" },
        { id: "devlog", labelKey: "devLog", section: "other" }
        // DEV ONLY — hidden unless DEV_MODE/devActive()
      ];
    }
  });

  // src/strings.js
  function loadStrings(langCode) {
    if (typeof XMLHttpRequest === "undefined") return null;
    var rawDir = ((Game.mods["cookie clicker companion"] || {}).dir || "mods/local/Cookie Clicker Companion").replace(/\/$/, "");
    var norm = langCode.toLowerCase().replace(/_/g, "-");
    var codes = norm.length > 2 ? [norm, norm.substring(0, 2)] : [norm];
    var prefix = rawDir.charAt(0) === "/" ? "file://" : "";
    for (var i = 0; i < codes.length; i++) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", prefix + encodeURI(rawDir + "/lang/" + codes[i] + ".json"), false);
      xhr.overrideMimeType("application/json; charset=utf-8");
      try {
        xhr.send();
        if (xhr.status === 200 || xhr.status === 0) return JSON.parse(xhr.responseText);
      } catch (e) {
      }
    }
    return null;
  }
  var FALLBACK_STRINGS;
  var init_strings = __esm({
    "src/strings.js"() {
      FALLBACK_STRINGS = {
        modEnabled: "Cookie Clicker Companion loaded",
        enableAll: "+ Enable all",
        disableAll: "- Disable all",
        sections: { clicks: "Clicks", auto: "Automation", minigame: "Minigames", other: "Other" },
        labels: {
          golden: "Golden Cookie",
          wrath: "Wrath Cookie",
          bigCookie: "Big Cookie",
          wrinklers: "Wrinklers",
          lumps: "Sugar Lumps",
          spell: "Force the Hand of Fate",
          fortune: "Fortune",
          dragon: "Dragon",
          dragonSacrifice: "Dragon Sacrifice",
          dragonAura: "Dragon Aura",
          market: "Stock Market",
          office: "Market Offices",
          garden: "Garden",
          cloverGarden: "Golden Clover Garden",
          breeder: "Garden Breeder",
          pantheon: "Pantheon",
          buyBuildings: "Auto Buy Buildings",
          buyUpgrades: "Auto Buy Upgrades",
          oneMind: "One Mind",
          luckyReserve: "Lucky Reserve"
        },
        descriptions: {},
        notify: {
          goldenOn: "",
          goldenOff: "",
          wrathOn: "",
          wrathOff: "",
          bigOn: "",
          bigOff: "",
          wrinklOn: "",
          wrinklOff: "",
          lumpsOn: "",
          lumpsOff: "",
          spellOn: "",
          spellOff: "",
          fortuneOn: "",
          fortuneOff: "",
          dragonOn: "",
          dragonOff: "",
          dragonSacrificeOn: "",
          dragonSacrificeOff: "",
          dragonAuraOn: "",
          dragonAuraOff: "",
          marketOn: "",
          marketOff: "",
          officeOn: "",
          officeOff: "",
          gardenOn: "",
          gardenOff: "",
          pantheonOn: "",
          pantheonOff: "",
          breederOn: "",
          breederOff: "",
          buyBuildingsOn: "",
          buyBuildingsOff: "",
          buyUpgradesOn: "",
          buyUpgradesOff: "",
          oneMindOn: "",
          oneMindOff: "",
          luckyReserveOn: "",
          luckyReserveOff: ""
        }
      };
    }
  });

  // src/ratios.js
  function calculateRatio(building) {
    if (!building.amount) return 0;
    function partnerMarginalCps(partner2, perUnitWeight) {
      return partner2.storedTotalCps * Game.globalCpsMult * perUnitWeight;
    }
    var ratio = Number((building.storedTotalCps / building.amount * Game.globalCpsMult / building.price * 100).toPrecision(3));
    var synergyBoost = 0;
    if (building.name === "Grandma") {
      for (var i in Game.GrandmaSynergies) {
        if (Game.Has(Game.GrandmaSynergies[i])) {
          var partner = Game.Upgrades[Game.GrandmaSynergies[i]].buildingTie;
          synergyBoost += partnerMarginalCps(partner, 0.01 * (1 / (partner.id - 1)));
        }
      }
    } else if (building.name === "Portal" && Game.Has("Elder Pact")) {
      var grandmas = Game.Objects["Grandma"];
      synergyBoost += 0.05 * grandmas.amount * Game.globalCpsMult;
    }
    for (var i in building.synergies) {
      var synergy = building.synergies[i];
      if (Game.Has(synergy.name)) {
        var isPrimary = building === synergy.buildingTie1;
        var partner = isPrimary ? synergy.buildingTie2 : synergy.buildingTie1;
        var weight = isPrimary ? 1e-3 : 0.05;
        synergyBoost += partnerMarginalCps(partner, weight);
      }
    }
    if (synergyBoost > 0 && Game.cookiesPs > 0) ratio = Number((ratio + ratio * (synergyBoost / Game.cookiesPs)).toPrecision(3));
    return Math.max(ratio, this.tierBundleRatio(building));
  }
  function tierBundleRatio(building) {
    var owned = building.amount;
    if (!owned) return 0;
    var nextThreshold = Infinity, tierUpgrade = null;
    for (var key in building.tieredUpgrades) {
      var upgrade = building.tieredUpgrades[key];
      var tierDef = Game.Tiers[upgrade.tier];
      if (!tierDef || isNaN(Number(upgrade.tier))) continue;
      if (upgrade.unlocked) continue;
      if (tierDef.unlock <= owned) continue;
      if (tierDef.unlock < nextThreshold) {
        nextThreshold = tierDef.unlock;
        tierUpgrade = upgrade;
      }
    }
    if (!tierUpgrade) return 0;
    var missingUnits = nextThreshold - owned;
    var buildingsCost = building.price * (Math.pow(1.15, missingUnits) - 1) / 0.15;
    var upgradeCost = tierUpgrade.getPrice ? tierUpgrade.getPrice() : tierUpgrade.basePrice;
    var bundleCost = buildingsCost + upgradeCost;
    if (!(bundleCost > 0)) return 0;
    var currentCps = building.storedTotalCps * Game.globalCpsMult;
    var gain = currentCps * (2 * nextThreshold / owned - 1);
    return Number((gain / bundleCost * 100).toPrecision(3));
  }
  function bulkFactor() {
    var n = Game.buyBulk || 1;
    if (n <= 1) return 1;
    return n * 0.15 / (Math.pow(1.15, n) - 1);
  }
  function updateRatios(mod) {
    var factor = mod.bulkFactor();
    var min = Infinity, max = -Infinity;
    for (var i in Game.Objects) {
      var building = Game.Objects[i];
      var ratio = mod.calculateRatio(building);
      if (ratio > 0 && factor !== 1) ratio = Number((ratio * factor).toPrecision(3));
      mod.values[building.id] = ratio > 0 ? ratio : 0;
      var el = l("ccc-ratio" + building.id);
      if (el && ratio > 0) {
        el.textContent = ratio;
        if (ratio < min) min = ratio;
        if (ratio > max) max = ratio;
      }
    }
    for (var i in Game.Objects) {
      var building = Game.Objects[i];
      var el = l("ccc-ratio" + building.id);
      if (!el) continue;
      var ratio = mod.values[building.id];
      el.style.color = ratio === min ? mod.colors[0] : ratio === max ? mod.colors[2] : mod.colors[1];
    }
  }
  function createSpan(parent, id, color) {
    var span = document.createElement("span");
    span.className = "ccc-store-ratio";
    span.style.color = color;
    span.id = id;
    span.textContent = "0";
    l(parent).parentNode.appendChild(span);
  }
  function createColor(parent, before, id, value) {
    var input = document.createElement("input");
    input.type = "color";
    input.id = id;
    input.value = value;
    input.className = "ccc-store-color";
    l(parent).insertBefore(input, l(before));
  }
  var init_ratios = __esm({
    "src/ratios.js"() {
    }
  });

  // src/persistence.js
  function save() {
    return JSON.stringify({ config: this.config, colors: this.colors, mode: this.activeMode, marketBasis: this.marketBasis });
  }
  function load(str) {
    if (!this.activateFns) {
      this._pendingLoad = str;
      return;
    }
    var data = JSON.parse(str);
    var config = data.config || data;
    if (data.colors) {
      this.colors = data.colors;
      for (var i = 0; i < 3; i++) {
        var el = l("ccc-ratioColor" + i);
        if (el) el.value = this.colors[i];
      }
    }
    for (var key in config) {
      if (config[key] === true && this.activateFns[key]) this.activateFns[key]();
    }
    this.marketBasis = data.marketBasis && typeof data.marketBasis === "object" ? data.marketBasis : {};
    this.activeMode = data.mode === "grind" || data.mode === "investor" ? data.mode : "manual";
    var modeSel = l("ccc-mode");
    if (modeSel) modeSel.value = this.activeMode;
    if (this.updateRatios) this.updateRatios(this);
  }
  var init_persistence = __esm({
    "src/persistence.js"() {
    }
  });

  // src/strategy.js
  function makeMarketParams(MOD) {
    return function marketParams() {
      return MOD.activeMode === "investor" ? MARKET.aggressive : MARKET.conservative;
    };
  }
  var CLUSTER, PRESETS, MARKET;
  var init_strategy = __esm({
    "src/strategy.js"() {
      CLUSTER = ["buybuildings", "buyupgrades", "luckyreserve", "market", "office", "dragonaura", "pantheon"];
      PRESETS = {
        // Grind = pure CPS growth: buy everything, divert nothing to investment. Pantheon ON
        // for its free CpS line-up (Mokalsium + Jeremy); it spends worship swaps, not cookies.
        grind: { buybuildings: true, buyupgrades: true, luckyreserve: false, market: false, office: false, dragonaura: true, pantheon: true },
        // Investor = max income: reserve + aggressive market + offices + brokers + the golden
        // pantheon line-up (Selebrak + Vomitrax: more frequent, longer golden cookies).
        investor: { buybuildings: true, buyupgrades: true, luckyreserve: true, market: true, office: true, dragonaura: true, pantheon: true }
      };
      MARKET = {
        conservative: { buyBelow: 0.92, cap: 0.08 },
        aggressive: { buyBelow: 0.95, cap: 0.12 }
      };
    }
  });

  // src/dev.js
  function createDevTools(ctx) {
    function devActive() {
      if (DEV_MODE) return true;
      var t = ctx.TOGGLES && ctx.TOGGLES.devlog && ctx.TOGGLES.devlog.t;
      if (t && t.isActive()) return true;
      try {
        return typeof localStorage !== "undefined" && localStorage.getItem("cccDev") === "1";
      } catch (e) {
        return false;
      }
    }
    function getFs() {
      try {
        if (typeof __require === "function") return __require("fs");
      } catch (e) {
      }
      try {
        if (typeof window !== "undefined" && window.require) return window.require("fs");
      } catch (e) {
      }
      try {
        if (typeof nw !== "undefined" && nw.require) return nw.require("fs");
      } catch (e) {
      }
      return null;
    }
    function devLogPath() {
      var dir = ((Game.mods["cookie clicker companion"] || {}).dir || "").replace(/\/$/, "");
      return (dir ? dir : ".") + "/ccc-devlog.txt";
    }
    function devLog(msg) {
      if (!devActive()) return;
      var line = "[" + (/* @__PURE__ */ new Date()).toISOString() + "] " + msg;
      window.cccDevLog = window.cccDevLog || [];
      window.cccDevLog.push(line);
      try {
        console.log("[CCC] " + msg);
      } catch (e) {
      }
      try {
        var fs = getFs();
        if (fs) fs.appendFileSync(devLogPath(), line + "\n");
      } catch (e) {
      }
    }
    function devSelfTest() {
      var fs = getFs();
      var dir = (Game.mods["cookie clicker companion"] || {}).dir || "(none)";
      var msg = "fs=" + (fs ? "OK" : "MISSING") + "<br>dir=" + dir;
      if (fs) {
        try {
          fs.appendFileSync(devLogPath(), "[selftest " + (/* @__PURE__ */ new Date()).toISOString() + "] dir=" + dir + "\n");
          msg += "<br>WROTE " + devLogPath();
        } catch (e) {
          msg += "<br>WRITE ERR: " + (e && e.message ? e.message : e);
        }
      }
      Game.Notify("Dev Log self-test", msg, [16, 5]);
      try {
        console.log("[CCC selftest] " + msg);
      } catch (e) {
      }
    }
    function devContext() {
      var mg = [];
      ["Bank", "Temple", "Wizard tower", "Farm"].forEach(function(n) {
        if (Game.Objects[n] && Game.isMinigameReady(Game.Objects[n])) mg.push(n);
      });
      var upg = 0;
      for (var u in Game.Upgrades) if (Game.Upgrades[u].bought) upg++;
      devLog("CONTEXT ccVersion=" + Game.version + " season=" + (Game.season || "none") + " ascensions=" + Game.resets + " prestige=" + Math.floor(Game.prestige) + " heavenlyChips=" + Math.floor(Game.heavenlyChips) + " dragonLevel=" + Game.dragonLevel + " dragonAura=" + Game.dragonAura + "/" + Game.dragonAura2 + " wrinklersMax=" + Game.getWrinklersMax() + " upgradesBought=" + upg + " minigames=[" + mg.join(",") + "]");
    }
    function devSnapshot() {
      var on = [];
      for (var id in ctx.TOGGLES) if (ctx.TOGGLES[id].t.isActive()) on.push(id);
      var bldgs = 0;
      for (var b in Game.Objects) bldgs += Game.Objects[b].amount;
      var bank = Game.Objects["Bank"], mkt = bank && bank.minigame;
      var spend = Game.cookies - (ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6e3 : 0);
      var bb = null, brat = 0;
      for (var i in Game.Objects) {
        var ob = Game.Objects[i], r = ctx.MOD.calculateRatio(ob);
        if (!r || isNaN(r)) r = ob.cps(ob) * Game.globalCpsMult / ob.price * 100;
        if (r > brat) {
          brat = r;
          bb = ob;
        }
      }
      var bbStr = bb ? bb.name + "@" + Beautify(bb.price) + (bb.price < spend ? "(aff)" : "(wait)") : "-";
      var wt = Game.Objects["Wizard tower"], gr = wt && wt.minigame;
      var magicStr = gr ? Math.floor(gr.magic) + "/" + Math.floor(gr.magicM) : "n/a";
      var stock = 0;
      if (mkt) for (var s = 0; s < mkt.goodsById.length; s++) stock += mkt.goodsById[s].stock;
      var brokerStr = mkt ? mkt.brokers + "/" + mkt.getMaxBrokers() : "n/a";
      devLog("SNAP t=" + Math.round(Game.T / Game.fps / 60) + "m bank=" + Beautify(Game.cookies) + " cps=" + Beautify(Game.cookiesPs) + " rawcps=" + Beautify(Game.cookiesPsRawHighest) + " earned=" + Beautify(Game.cookiesEarned) + " presti=" + Math.floor(Game.prestige) + " resets=" + Game.resets + " bldgs=" + bldgs + " lumps=" + Game.lumps + " wrath=" + Game.elderWrath + " buffs=" + Object.keys(Game.buffs).length + " spend=" + Beautify(spend) + " bestBldg=" + bbStr + " magic=" + magicStr + " mktProfit=" + (mkt ? Beautify(mkt.profit) : "n/a") + " mktStock=" + stock + " brokers=" + brokerStr + " mktStarved=" + ctx.MOD._mktStarvedTicks + " on=[" + on.join(",") + "]");
    }
    return { devActive, devLog, devSnapshot, devSelfTest, devContext, getFs, devLogPath };
  }
  var DEV_MODE;
  var init_dev = __esm({
    "src/dev.js"() {
      DEV_MODE = false;
    }
  });

  // src/toggles/golden.js
  function createGolden(ctx) {
    return {
      configKey: "autoClickGoldenCookie",
      t: ctx.makeToggle(function() {
        Game.shimmers.forEach(function(s) {
          if (s.type === "golden" && s.wrath === 0 || s.type === "reindeer") s.pop();
        });
      }, 1e3, "goldenOn", "goldenOff")
    };
  }
  var init_golden = __esm({
    "src/toggles/golden.js"() {
    }
  });

  // src/toggles/wrath.js
  function createWrath(ctx) {
    return {
      configKey: "autoClickWrathCookie",
      t: ctx.makeToggle(function() {
        Game.shimmers.forEach(function(s) {
          if (s.type === "golden" && s.wrath === 1) s.pop();
        });
      }, 1e3, "wrathOn", "wrathOff")
    };
  }
  var init_wrath = __esm({
    "src/toggles/wrath.js"() {
    }
  });

  // src/toggles/bigcookie.js
  function createBigcookie(ctx) {
    return {
      configKey: "autoClickBigCookie",
      t: ctx.makeToggle(function() {
        ctx.cookieEl.dispatchEvent(ctx.clickEvent);
        Game.autoclickerDetected = 0;
      }, 100, "bigOn", "bigOff")
    };
  }
  var init_bigcookie = __esm({
    "src/toggles/bigcookie.js"() {
    }
  });

  // src/toggles/wrinklers.js
  function createWrinklers(ctx) {
    return {
      configKey: "autoCollectWrinklers",
      t: ctx.makeToggle(function() {
        for (var i = 0; i < Game.getWrinklersMax(); i++) {
          if (Game.wrinklers[i].phase !== 2) return;
        }
        Game.CollectWrinklers();
      }, 1e3, "wrinklOn", "wrinklOff")
    };
  }
  var init_wrinklers = __esm({
    "src/toggles/wrinklers.js"() {
    }
  });

  // src/toggles/lumps.js
  function createLumps(ctx) {
    return {
      configKey: "autoLumps",
      t: ctx.makeToggle(function() {
        if (Game.canLumps() && Date.now() - Game.lumpT >= Game.lumpRipeAge) {
          Game.clickLump();
        }
      }, 1e3, "lumpsOn", "lumpsOff")
    };
  }
  var init_lumps = __esm({
    "src/toggles/lumps.js"() {
    }
  });

  // src/toggles/spell.js
  function createSpell(ctx) {
    return {
      configKey: "autoCastSpell",
      t: ctx.makeToggle(function() {
        var grimoire = Game.ObjectsById[7].minigame;
        if (!grimoire || grimoire.magic !== grimoire.magicM) return;
        var spell = grimoire.spellsById[1];
        if (grimoire.magic < grimoire.getSpellCost(spell)) return;
        var failChance = grimoire.getFailChance(spell);
        Math.seedrandom(Game.seed + "/" + grimoire.spellsCastTotal);
        var willWin = Math.random() < 1 - failChance;
        Math.seedrandom();
        if (willWin) {
          ctx.devLog("GOLDEN predicted -> cast FtHoF (failChance=" + failChance.toFixed(3) + ", N=" + grimoire.spellsCastTotal + ")");
          grimoire.castSpell(spell);
        } else {
          var skip = grimoire.spells["conjure baked goods"];
          if (skip && grimoire.magic >= grimoire.getSpellCost(skip)) {
            ctx.devLog("BACKFIRE predicted -> skip FtHoF, cast Conjure (failChance=" + failChance.toFixed(3) + ", N=" + grimoire.spellsCastTotal + ")");
            grimoire.castSpell(skip);
          } else {
            ctx.devLog("BACKFIRE predicted -> skip, no mana for Conjure (failChance=" + failChance.toFixed(3) + ", N=" + grimoire.spellsCastTotal + ")");
          }
        }
      }, 1e3, "spellOn", "spellOff")
    };
  }
  var init_spell = __esm({
    "src/toggles/spell.js"() {
    }
  });

  // src/toggles/market.js
  function createMarket(ctx) {
    var lastBuy = {};
    return {
      configKey: "autoMarket",
      t: ctx.makeToggle(function() {
        var m = Game.Objects["Bank"].minigame;
        if (!m || !Game.isMinigameReady(Game.Objects["Bank"])) return;
        var basis = ctx.MOD.marketBasis || (ctx.MOD.marketBasis = {});
        var reserve = ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6e3 : 0;
        var spendable = Game.cookies - reserve;
        var overhead = 1 + 0.01 * (20 * Math.pow(0.95, m.brokers));
        var canInvest = spendable > 0 && !ctx.autoBuyWillSpend(spendable);
        if (!canInvest && ctx.devActive()) ctx.MOD._mktStarvedTicks++;
        if (m.brokers < m.getMaxBrokers()) {
          var brokerPrice = m.getBrokerPrice();
          if (brokerPrice <= spendable && Game.cookies >= brokerPrice) {
            Game.Spend(brokerPrice);
            m.brokers += 1;
            ctx.devLog("MKT broker hired -> " + m.brokers + " (cost=" + Beautify(brokerPrice) + ")");
          }
        }
        m.goodsById.forEach(function(good) {
          if (!good.active) return;
          var resting = m.getRestingVal(good.id);
          var mp = ctx.marketParams();
          if (good.stock <= 0) {
            if (basis[good.id]) delete basis[good.id];
            delete lastBuy[good.id];
          } else if (!basis[good.id]) {
            basis[good.id] = { avgVal: good.val, units: good.stock };
          }
          var b = basis[good.id];
          if (b && good.stock > 0) {
            var hitTarget = good.val >= b.avgVal * overhead * 1.02;
            var reversal = (good.mode === 2 || good.mode === 4) && good.val >= b.avgVal * overhead;
            if (hitTarget || reversal) {
              var soldQty = good.stock;
              m.sellGood(good.id, 1e4);
              delete basis[good.id];
              delete lastBuy[good.id];
              ctx.devLog("MKT sell " + good.name + " val=" + good.val.toFixed(2) + " avg=" + b.avgVal.toFixed(2) + " qty=" + soldQty + " total=" + Beautify(m.profit));
              return;
            }
          }
          var maxStock = typeof m.getGoodMaxStock === "function" ? m.getGoodMaxStock(good) : 1e9;
          if (canInvest && good.val < resting * mp.buyBelow && good.val !== lastBuy[good.id] && (!b || good.val < b.avgVal) && good.stock < maxStock) {
            var costPerUnit = Game.cookiesPsRawHighest * good.val * overhead;
            if (costPerUnit <= 0) return;
            var n = Math.floor(spendable * mp.cap / costPerUnit);
            var room = maxStock - good.stock;
            if (n > room) n = room;
            if (n > 0) {
              var before = good.stock;
              var prevAvg = b ? b.avgVal : good.val;
              lastBuy[good.id] = good.val;
              if (m.buyGood(good.id, n)) {
                var added = good.stock - before;
                if (added > 0) {
                  basis[good.id] = { avgVal: (prevAvg * before + good.val * added) / (before + added), units: good.stock };
                  ctx.devLog("MKT buy " + good.name + " val=" + good.val.toFixed(2) + " rest=" + resting + " qty=" + added + " avg=" + basis[good.id].avgVal.toFixed(2));
                }
              }
            }
          }
        });
      }, 1e3, "marketOn", "marketOff")
    };
  }
  var init_market = __esm({
    "src/toggles/market.js"() {
    }
  });

  // src/toggles/office.js
  function createOffice(ctx) {
    return {
      configKey: "autoOffice",
      t: ctx.makeToggle(function() {
        var m = Game.Objects["Bank"].minigame;
        if (!m || !Game.isMinigameReady(Game.Objects["Bank"])) return;
        if (m.officeLevel >= m.offices.length - 1) return;
        var office = m.offices[m.officeLevel], cursor = Game.Objects["Cursor"];
        if (office.cost && cursor.amount >= office.cost[0] && cursor.level >= office.cost[1]) {
          cursor.sacrifice(office.cost[0]);
          m.officeLevel += 1;
          ctx.devLog("OFFICE upgraded -> level " + m.officeLevel + " (sacrificed " + office.cost[0] + " cursors)");
        }
      }, 1e3, "officeOn", "officeOff")
    };
  }
  var init_office = __esm({
    "src/toggles/office.js"() {
    }
  });

  // src/toggles/garden.js
  function createGarden(ctx) {
    return {
      configKey: "autoGarden",
      t: ctx.makeToggle(function() {
        if (ctx.TOGGLES.breeder && ctx.TOGGLES.breeder.t.isActive()) return;
        if (ctx.TOGGLES.clovergarden && ctx.TOGGLES.clovergarden.t.isActive()) return;
        var m = Game.Objects["Farm"].minigame;
        if (!m || !Game.isMinigameReady(Game.Objects["Farm"])) return;
        for (var y = 0; y < 6; y++) {
          for (var x = 0; x < 6; x++) {
            var tile = m.plot[y][x];
            if (tile[0] < 1) continue;
            var plant = m.plantsById[tile[0] - 1];
            if (!plant || plant.immortal) continue;
            if (tile[1] < plant.mature || tile[1] < 90) continue;
            var seed = tile[0] - 1, age = tile[1], pname = plant.name;
            if (m.harvest(x, y, 1)) {
              var replant = m.canPlant(m.plantsById[seed]);
              if (replant) m.useTool(seed, x, y);
              ctx.devLog("GARDEN harvest " + pname + " @" + x + "," + y + " age=" + age + (replant ? " +replant" : ""));
            }
          }
        }
      }, 1e3, "gardenOn", "gardenOff")
    };
  }
  var init_garden = __esm({
    "src/toggles/garden.js"() {
    }
  });

  // src/toggles/clovergarden.js
  function createClovergarden(ctx) {
    return {
      configKey: "autoCloverGarden",
      t: ctx.makeToggle(function() {
        if (ctx.TOGGLES.breeder && ctx.TOGGLES.breeder.t.isActive()) return;
        var m = Game.Objects["Farm"].minigame;
        if (!m || !Game.isMinigameReady(Game.Objects["Farm"])) return;
        var clover = m.plants["goldenClover"];
        if (!clover || !clover.unlocked) return;
        if (m.getCost(clover) > 0) return;
        var cloverTile = clover.id + 1;
        for (var y = 0; y < 6; y++) {
          for (var x = 0; x < 6; x++) {
            if (!m.isTileUnlocked(x, y)) continue;
            var tile = m.plot[y][x];
            if (tile[0] === cloverTile) continue;
            if (tile[0] > 0) {
              var occ = m.plantsById[tile[0] - 1];
              if (occ && occ.immortal) continue;
              m.harvest(x, y, 1);
              ctx.devLog("CLOVER clear " + (occ ? occ.key : "?") + " @" + x + "," + y);
              continue;
            }
            if (m.useTool(clover.id, x, y)) ctx.devLog("CLOVER plant @" + x + "," + y);
          }
        }
      }, 1e3, "cloverGardenOn", "cloverGardenOff")
    };
  }
  var init_clovergarden = __esm({
    "src/toggles/clovergarden.js"() {
    }
  });

  // src/toggles/breeder.js
  function createBreeder(ctx) {
    function isSlot(x, y) {
      return x % 2 === 1 && y % 2 === 1;
    }
    function parentForTile(x, y, pkeys) {
      return pkeys.length === 1 ? pkeys[0] : pkeys[(x + y) % 2];
    }
    return {
      configKey: "autoBreeder",
      t: ctx.makeToggle(function() {
        var m = Game.Objects["Farm"].minigame;
        if (!m || !Game.isMinigameReady(Game.Objects["Farm"])) return;
        var wheat = m.plants["bakerWheat"];
        if (!wheat || m.getCost(wheat) > 0) return;
        var chain = null;
        for (var ti = 0; ti < TARGET_PRIORITY.length; ti++) {
          var tplant = m.plants[TARGET_PRIORITY[ti]];
          if (tplant && !tplant.unlocked) {
            chain = CHAINS[TARGET_PRIORITY[ti]];
            break;
          }
        }
        if (!chain) return;
        var step = null;
        for (var i = 0; i < chain.length; i++) {
          var tp = m.plants[chain[i].target];
          if (tp && !tp.unlocked) {
            step = chain[i];
            break;
          }
        }
        if (!step) return;
        var pkeys = [];
        for (var key in step.parents) {
          var p = m.plants[key];
          if (!p || !p.unlocked) return;
          pkeys.push(key);
        }
        var targetKey = step.target;
        for (var y = 0; y < 6; y++) {
          for (var x = 0; x < 6; x++) {
            if (!m.isTileUnlocked(x, y)) continue;
            var tile = m.plot[y][x];
            if (isSlot(x, y)) {
              if (tile[0] === 0) continue;
              var occ = m.plantsById[tile[0] - 1];
              if (occ && occ.key === targetKey) {
                if (tile[1] >= occ.mature && m.harvest(x, y, 1)) {
                  ctx.devLog("BREED unlocked " + targetKey + " @" + x + "," + y);
                }
              } else if (occ && !occ.immortal) {
                m.harvest(x, y, 1);
              }
            } else {
              var pkey = parentForTile(x, y, pkeys);
              if (tile[0] === 0) {
                m.useTool(m.plants[pkey].id, x, y);
              } else {
                var occ2 = m.plantsById[tile[0] - 1];
                if (occ2 && occ2.key !== pkey && !occ2.immortal) {
                  m.harvest(x, y, 1);
                }
              }
            }
          }
        }
      }, 1e3, "breederOn", "breederOff")
    };
  }
  var init_breeder = __esm({
    "src/toggles/breeder.js"() {
      init_breeder_recipes();
    }
  });

  // src/toggles/pantheon.js
  function createPantheon(ctx) {
    return {
      configKey: "autoPantheon",
      t: ctx.makeToggle(function() {
        var m = Game.Objects["Temple"].minigame;
        if (!m || !Game.isMinigameReady(Game.Objects["Temple"])) return;
        if (m.swaps <= 0) return;
        var T = ctx.TOGGLES;
        var clicking = !!(T.bigcookie && T.bigcookie.t.isActive());
        var farmingGolden = !!(T.golden && T.golden.t.isActive());
        var plan;
        if (farmingGolden) {
          plan = clicking ? [["seasons", 0], ["decadence", 1], ["labor", 2]] : [["seasons", 0], ["decadence", 1]];
        } else {
          plan = clicking ? [["mother", 0], ["asceticism", 1], ["labor", 2]] : [["mother", 0], ["asceticism", 1], ["industry", 2]];
        }
        for (var i = 0; i < plan.length; i++) {
          var god = m.gods[plan[i][0]];
          var slot = plan[i][1];
          if (!god || m.slot[slot] === god.id) continue;
          m.useSwap(1);
          m.slotGod(god, slot);
          ctx.devLog("PANTHEON " + plan[i][0] + "@slot" + slot + " swaps=" + m.swaps);
          return;
        }
      }, 1e3, "pantheonOn", "pantheonOff")
    };
  }
  var init_pantheon = __esm({
    "src/toggles/pantheon.js"() {
    }
  });

  // src/toggles/fortune.js
  function createFortune(ctx) {
    return {
      configKey: "autoFortuneNews",
      t: ctx.makeToggle(function() {
        if (Game.TickerEffect && Game.TickerEffect.type === "fortune") Game.tickerL.dispatchEvent(ctx.clickEvent);
      }, 1e3, "fortuneOn", "fortuneOff")
    };
  }
  var init_fortune = __esm({
    "src/toggles/fortune.js"() {
    }
  });

  // src/toggles/dragon.js
  function createDragon(ctx) {
    return {
      configKey: "autoDragon",
      t: ctx.makeToggle(function() {
        var next = Game.dragonLevels[Game.dragonLevel];
        if (!next || typeof next.buy !== "function") return;
        var isSacrifice = next.buy.toString().indexOf("sacrifice") !== -1;
        if (!isSacrifice || ctx.TOGGLES.dragonsacrifice.t.isActive()) {
          Game.UpgradeDragon();
        }
      }, 1e3, "dragonOn", "dragonOff")
    };
  }
  var init_dragon = __esm({
    "src/toggles/dragon.js"() {
    }
  });

  // src/toggles/dragonsacrifice.js
  function createDragonsacrifice(ctx) {
    return {
      configKey: "autoDragonSacrifice",
      t: ctx.makeBoolToggle("dragonSacrificeOn", "dragonSacrificeOff")
    };
  }
  var init_dragonsacrifice = __esm({
    "src/toggles/dragonsacrifice.js"() {
    }
  });

  // src/toggles/dragonaura.js
  function createDragonaura(ctx) {
    return {
      configKey: "autoDragonAura",
      t: ctx.makeToggle(function() {
        var target = 15;
        if (Game.dragonLevel < target + 4) return;
        if (Game.dragonAura === target) return;
        var highest = 0;
        for (var i in Game.Objects) {
          if (Game.Objects[i].amount > 0) highest = Game.Objects[i];
        }
        if (highest !== 0) highest.sacrifice(1);
        Game.dragonAura = target;
        Game.recalculateGains = 1;
        ctx.devLog("DRAGON aura set Radiant Appetite (sacrificed " + (highest !== 0 ? highest.name : "none") + ")");
      }, 1e3, "dragonAuraOn", "dragonAuraOff")
    };
  }
  var init_dragonaura = __esm({
    "src/toggles/dragonaura.js"() {
    }
  });

  // src/toggles/buyupgrades.js
  function createBuyupgrades(ctx) {
    return {
      configKey: "autoBuyUpgrades",
      t: ctx.makeToggle(function() {
        var spendable = Game.cookies - (ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6e3 : 0);
        Game.UpgradesInStore.forEach(function(upgrade) {
          if (!ctx.upgradeEligible(upgrade)) return;
          var price = upgrade.getPrice ? upgrade.getPrice() : upgrade.basePrice;
          if (price >= spendable) return;
          ctx.devLog("BUY upg " + upgrade.name + " price=" + Beautify(price));
          upgrade.buy();
          if (upgrade.name === "One mind") l("promptOption0").dispatchEvent(ctx.clickEvent);
        });
      }, 1e3, "buyUpgradesOn", "buyUpgradesOff")
    };
  }
  var init_buyupgrades = __esm({
    "src/toggles/buyupgrades.js"() {
    }
  });

  // src/toggles/buybuildings.js
  function createBuybuildings(ctx) {
    return {
      configKey: "autoBuyBuildings",
      t: ctx.makeToggle(function() {
        var spendable = Game.cookies - (ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPsRawHighest * 6e3 : 0);
        if (ctx.TOGGLES.buyupgrades.t.isActive() && ctx.hasAffordableEligibleUpgrade(spendable)) return;
        var best = null, bestRatio = 0, aff = null, affRatio = 0;
        for (var i in Game.Objects) {
          var building = Game.Objects[i];
          var ratio = ctx.MOD.calculateRatio(building);
          if (!ratio || isNaN(ratio)) ratio = building.cps(building) * Game.globalCpsMult / building.price * 100;
          if (ratio > bestRatio) {
            best = building;
            bestRatio = ratio;
          }
          if (building.price < spendable && ratio > affRatio) {
            aff = building;
            affRatio = ratio;
          }
        }
        if (!best) return;
        if (best.price < spendable) {
          ctx.devLog("BUY bldg " + best.name + " #" + (best.amount + 1) + " price=" + Beautify(best.price) + " ratio=" + Number(bestRatio).toPrecision(3) + " (best)");
          best.buy(1);
        } else if (best.amount === 0) {
          return;
        } else if (aff && affRatio >= bestRatio * ctx.BUY_FLOOR) {
          ctx.devLog("BUY bldg " + aff.name + " #" + (aff.amount + 1) + " price=" + Beautify(aff.price) + " ratio=" + Number(affRatio).toPrecision(3) + " (affordable; " + best.name + "@" + Beautify(best.price) + " deferred \u2014 already owned)");
          aff.buy(1);
        }
      }, 1e3, "buyBuildingsOn", "buyBuildingsOff")
    };
  }
  var init_buybuildings = __esm({
    "src/toggles/buybuildings.js"() {
    }
  });

  // src/toggles/onemind.js
  function createOnemind(ctx) {
    return {
      configKey: "oneMind",
      t: ctx.makeToggle(function() {
        if (Game.elderWrath <= 0) {
          ctx.MOD._wrathBundled = false;
          return;
        }
        if (ctx.MOD._wrathBundled) return;
        ctx.MOD._wrathBundled = true;
        var w = ctx.TOGGLES.wrath;
        if (w && !w.t.isActive()) {
          w.t.activate();
          ctx.devLog("ONEMIND bundle -> wrath on");
        }
      }, 2e3, "oneMindOn", "oneMindOff")
    };
  }
  var init_onemind = __esm({
    "src/toggles/onemind.js"() {
    }
  });

  // src/toggles/luckyreserve.js
  function createLuckyreserve(ctx) {
    return {
      configKey: "luckyReserve",
      t: ctx.makeBoolToggle("luckyReserveOn", "luckyReserveOff")
    };
  }
  var init_luckyreserve = __esm({
    "src/toggles/luckyreserve.js"() {
    }
  });

  // src/toggles/devlog.js
  function createDevlog(ctx) {
    return {
      configKey: "devLog",
      t: /* @__PURE__ */ (function() {
        var active = false;
        return {
          toggle: function() {
            active = !active;
            Game.Notify("\u{1F527} Dev Log " + (active ? "ON" : "OFF"), active ? "Writing ccc-devlog.txt" : "", [16, 5], 3);
            if (active) {
              ctx.devSelfTest();
              window.cccDevLog = [];
              ctx.devLog("=== SESSION START ===");
              ctx.devContext();
              ctx.devSnapshot();
            }
            ctx.updateInfo();
          },
          activate: function() {
            if (!active) this.toggle();
          },
          isActive: function() {
            return active;
          }
        };
      })()
    };
  }
  var init_devlog = __esm({
    "src/toggles/devlog.js"() {
    }
  });

  // src/init.js
  function init() {
    var MOD = this;
    setTimeout(function() {
      var lang = (typeof locId !== "undefined" ? locId : Game.language || "EN").toUpperCase();
      var S = MOD.loadStrings(lang) || MOD.loadStrings("EN");
      S = S || FALLBACK_STRINGS;
      Game.Notify(S.modEnabled, "", [16, 5], 6);
      var clickEvent = new MouseEvent("click", { detail: 1 });
      function makeToggle(intervalFn, delay, onKey, offKey) {
        var timer = null;
        return {
          toggle: function() {
            if (timer) {
              clearInterval(timer);
              timer = null;
              if (S.notify[offKey]) Game.Notify(S.notify[offKey], "", [16, 5], 3);
            } else {
              timer = setInterval(intervalFn, delay);
              if (S.notify[onKey]) Game.Notify(S.notify[onKey], "", [16, 5], 3);
            }
            updateInfo();
          },
          activate: function() {
            if (!timer) this.toggle();
          },
          isActive: function() {
            return timer !== null;
          }
        };
      }
      function makeBoolToggle(onKey, offKey) {
        var active = false;
        return {
          toggle: function() {
            active = !active;
            Game.Notify(active ? S.notify[onKey] : S.notify[offKey], "", [16, 5], 3);
            updateInfo();
          },
          activate: function() {
            if (!active) this.toggle();
          },
          isActive: function() {
            return active;
          }
        };
      }
      var cookieEl = l("bigCookie");
      var TOGGLES = {};
      var ctx = {
        S,
        MOD,
        TOGGLES,
        makeToggle,
        makeBoolToggle,
        cookieEl,
        clickEvent
      };
      ctx.updateInfo = updateInfo;
      var devTools = createDevTools(ctx);
      var devActive = devTools.devActive;
      var devLog = devTools.devLog;
      var devSnapshot = devTools.devSnapshot;
      var devSelfTest = devTools.devSelfTest;
      var devContext = devTools.devContext;
      ctx.devActive = devActive;
      ctx.devLog = devLog;
      ctx.devSnapshot = devSnapshot;
      ctx.devSelfTest = devSelfTest;
      ctx.devContext = devContext;
      MOD._mktStarvedTicks = 0;
      function upgradeEligible(upgrade) {
        if (upgrade.pool === "toggle") return false;
        if (upgrade.name === "Communal brainsweep" || upgrade.name === "Elder Pact" || upgrade.name === "Elder Pledge" || upgrade.name === "Elder Covenant" || upgrade.name === "Revoke Elder Covenant") return false;
        if (upgrade.name === "One mind") return TOGGLES.onemind.t.isActive();
        return true;
      }
      function hasAffordableEligibleUpgrade(spendable) {
        return Game.UpgradesInStore.some(function(upgrade) {
          if (!upgradeEligible(upgrade)) return false;
          var price = upgrade.getPrice ? upgrade.getPrice() : upgrade.basePrice;
          return price < spendable;
        });
      }
      var BUY_FLOOR = 0.05;
      ctx.BUY_FLOOR = BUY_FLOOR;
      function autoBuyWillSpend(spendable) {
        if (TOGGLES.buyupgrades.t.isActive() && hasAffordableEligibleUpgrade(spendable)) return true;
        if (TOGGLES.buybuildings.t.isActive()) {
          var best = null, bestRatio = 0, aff = null, affRatio = 0;
          for (var i2 in Game.Objects) {
            var b = Game.Objects[i2];
            var r = MOD.calculateRatio(b);
            if (!r || isNaN(r)) r = b.cps(b) * Game.globalCpsMult / b.price * 100;
            if (r > bestRatio) {
              bestRatio = r;
              best = b;
            }
            if (b.price < spendable && r > affRatio) {
              aff = b;
              affRatio = r;
            }
          }
          if (best) {
            if (best.price < spendable) return true;
            if (best.amount === 0) return false;
            if (aff && affRatio >= bestRatio * BUY_FLOOR) return true;
            return false;
          }
        }
        return false;
      }
      ctx.upgradeEligible = upgradeEligible;
      ctx.hasAffordableEligibleUpgrade = hasAffordableEligibleUpgrade;
      ctx.autoBuyWillSpend = autoBuyWillSpend;
      var marketParams = makeMarketParams(MOD);
      ctx.marketParams = marketParams;
      TOGGLES.golden = createGolden(ctx);
      TOGGLES.wrath = createWrath(ctx);
      TOGGLES.bigcookie = createBigcookie(ctx);
      TOGGLES.wrinklers = createWrinklers(ctx);
      TOGGLES.lumps = createLumps(ctx);
      TOGGLES.spell = createSpell(ctx);
      TOGGLES.market = createMarket(ctx);
      TOGGLES.office = createOffice(ctx);
      TOGGLES.garden = createGarden(ctx);
      TOGGLES.clovergarden = createClovergarden(ctx);
      TOGGLES.breeder = createBreeder(ctx);
      TOGGLES.pantheon = createPantheon(ctx);
      TOGGLES.fortune = createFortune(ctx);
      TOGGLES.dragon = createDragon(ctx);
      TOGGLES.dragonsacrifice = createDragonsacrifice(ctx);
      TOGGLES.dragonaura = createDragonaura(ctx);
      TOGGLES.buyupgrades = createBuyupgrades(ctx);
      TOGGLES.buybuildings = createBuybuildings(ctx);
      TOGGLES.onemind = createOnemind(ctx);
      TOGGLES.luckyreserve = createLuckyreserve(ctx);
      TOGGLES.devlog = createDevlog(ctx);
      MOD.activateFns = {};
      for (var id in TOGGLES) {
        (function(entry) {
          MOD.activateFns[entry.configKey] = function() {
            entry.t.activate();
          };
        })(TOGGLES[id]);
      }
      function getStates() {
        var states = {};
        for (var id2 in TOGGLES) states[id2] = TOGGLES[id2].t.isActive();
        return states;
      }
      function updateConfig() {
        var cfg = {};
        for (var id2 in TOGGLES) cfg[TOGGLES[id2].configKey] = TOGGLES[id2].t.isActive();
        MOD.config = cfg;
      }
      function setToggle(id2, want) {
        var t = TOGGLES[id2] && TOGGLES[id2].t;
        if (t && want !== t.isActive()) t.toggle();
      }
      function syncSelector() {
        var s = l("ccc-mode");
        if (s) s.value = MOD.activeMode;
      }
      function applyPreset(mode) {
        MOD.activeMode = mode;
        if (mode !== "manual" && PRESETS[mode]) {
          var p = PRESETS[mode];
          for (var id2 in p) setToggle(id2, p[id2]);
        }
        syncSelector();
      }
      for (var i = 0; i < 20; i++) {
        l("product" + i).addEventListener("click", function() {
          setTimeout(function() {
            MOD.updateRatios(MOD);
          }, 60);
        });
        l("product" + i).style.fontFamily = "Merriweather";
        MOD.createSpan("productPrice" + i, "ccc-ratio" + i, MOD.colors[1]);
      }
      for (var i = 0; i < 3; i++) {
        MOD.createColor("products", "storeBulk", "ccc-ratioColor" + i, MOD.colors[i]);
        let j = i;
        l("ccc-ratioColor" + j).addEventListener("change", function() {
          MOD.colors[j] = this.value;
          MOD.updateRatios(MOD);
        });
      }
      l("ccc-ratioColor0").style.right = "26px";
      l("ccc-ratioColor1").style.right = "13px";
      var tooltipRefresh = null;
      Game.registerHook("check", function() {
        if (Game.T % 8 === 0) MOD.updateRatios(MOD);
        if (Game.T % 30 === 0) updateVisibility();
        if (tooltipRefresh && Game.T % 8 === 0) tooltipRefresh();
        if (Game.T % (Game.fps * 60) === 0 && devActive()) devSnapshot();
      });
      var _origRefreshStore = Game.RefreshStore;
      Game.RefreshStore = function() {
        _origRefreshStore.apply(this, arguments);
        MOD.updateRatios(MOD);
      };
      var style = document.createElement("style");
      style.textContent = MOD.CSS;
      document.head.appendChild(style);
      var panel = document.createElement("div");
      panel.id = "ccc-panel";
      var inner = document.createElement("div");
      inner.id = "ccc-inner";
      var header = document.createElement("div");
      header.id = "ccc-header";
      var titleEl = document.createElement("span");
      titleEl.id = "ccc-title";
      titleEl.textContent = "\u{1F36A} Companion";
      var colBtn = document.createElement("span");
      colBtn.id = "ccc-collapse";
      colBtn.textContent = "\u25B2";
      colBtn.classList.add("open");
      header.appendChild(titleEl);
      header.appendChild(colBtn);
      var body = document.createElement("div");
      body.id = "ccc-body";
      var tooltip = document.createElement("div");
      tooltip.id = "ccc-tooltip";
      document.body.appendChild(tooltip);
      var modeRow = document.createElement("div");
      modeRow.className = "ccc-mode-row";
      modeRow.id = "ccc-mode-row";
      var modeLbl = document.createElement("span");
      modeLbl.className = "ccc-mode-lbl";
      modeLbl.textContent = S.sections && S.sections.strategy || "Strategy";
      var modeSel = document.createElement("select");
      modeSel.id = "ccc-mode";
      [["manual", "Manual"], ["grind", "Grind"], ["investor", "Investor"]].forEach(function(o) {
        var opt = document.createElement("option");
        opt.value = o[0];
        opt.textContent = o[1];
        modeSel.appendChild(opt);
      });
      modeSel.value = MOD.activeMode;
      modeRow.appendChild(modeLbl);
      modeRow.appendChild(modeSel);
      body.appendChild(modeRow);
      modeSel.addEventListener("change", function() {
        applyPreset(this.value);
      });
      var modeDesc = S.descriptions && S.descriptions.strategy;
      if (modeDesc) {
        modeRow.addEventListener("mouseenter", function() {
          var rect = modeRow.getBoundingClientRect();
          tooltip.textContent = modeDesc;
          tooltip.style.left = rect.right + 10 + "px";
          tooltip.style.top = rect.top + "px";
          tooltip.style.opacity = "1";
          tooltipRefresh = null;
        });
        modeRow.addEventListener("mouseleave", function() {
          tooltip.style.opacity = "0";
        });
      }
      ["clicks", "auto", "minigame", "other"].forEach(function(sect, si) {
        if (si > 0) {
          var sep = document.createElement("div");
          sep.className = "ccc-sep";
          sep.id = "ccc-sep-" + sect;
          body.appendChild(sep);
        }
        var hdr = document.createElement("div");
        hdr.className = "ccc-sec-hdr";
        hdr.id = "ccc-sec-hdr-" + sect;
        hdr.textContent = S.sections[sect];
        body.appendChild(hdr);
        MOD.FEATURES.filter(function(f) {
          return f.section === sect;
        }).forEach(function(f) {
          var row = document.createElement("div");
          row.className = "ccc-row";
          row.id = "ccc-row-" + f.id;
          var lblEl = document.createElement("span");
          lblEl.className = "ccc-row-lbl";
          lblEl.textContent = f.id === "devlog" ? "\u{1F527} Dev Log" : S.labels[f.labelKey];
          row.appendChild(lblEl);
          row.appendChild(document.createElement("div")).className = "ccc-tog";
          body.appendChild(row);
          row.addEventListener("click", function() {
            if (!TOGGLES[f.id]) return;
            TOGGLES[f.id].t.toggle();
            if (CLUSTER.indexOf(f.id) !== -1 && MOD.activeMode !== "manual") {
              MOD.activeMode = "manual";
              syncSelector();
            }
          });
          var desc = S.descriptions[f.labelKey];
          if (desc) {
            var tipText = f.id === "luckyreserve" ? function() {
              return desc + "\n\u2BA1 " + Beautify(Math.round(Game.cookiesPsRawHighest * 6e3));
            } : function() {
              return desc;
            };
            row.addEventListener("mouseenter", function() {
              var rect = row.getBoundingClientRect();
              tooltip.textContent = tipText();
              tooltip.style.left = rect.right + 10 + "px";
              tooltip.style.top = rect.top + "px";
              tooltip.style.opacity = "1";
              tooltipRefresh = f.id === "luckyreserve" ? function() {
                tooltip.textContent = tipText();
              } : null;
            });
            row.addEventListener("mouseleave", function() {
              tooltip.style.opacity = "0";
              tooltipRefresh = null;
            });
          }
        });
      });
      var devActions = document.createElement("div");
      devActions.className = "ccc-actions";
      devActions.id = "ccc-dev-actions";
      devActions.style.display = "none";
      var exportBtn = document.createElement("button");
      exportBtn.className = "ccc-btn";
      exportBtn.id = "ccc-export-log";
      exportBtn.textContent = "\u{1F527} Export Dev Log";
      devActions.appendChild(exportBtn);
      body.appendChild(devActions);
      exportBtn.addEventListener("click", function() {
        devSnapshot();
        devLog("=== EXPORT ===");
        var log = window.cccDevLog || [];
        var text = log.length ? log.join("\n") : "(dev log empty \u2014 enable the Dev Log toggle and play a bit)";
        Game.Prompt(
          '<h3>Companion Dev Log</h3><div class="block" style="font-size:11px;">' + log.length + ' lines. Select all (Cmd/Ctrl+A), copy, and paste it back.</div><textarea id="ccc-log-area" style="width:96%;height:280px;font-size:10px;" readonly>' + text.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</textarea>",
          [["Close", "Game.ClosePrompt();"]]
        );
        var ta = l("ccc-log-area");
        if (ta) {
          ta.focus();
          ta.select();
        }
      });
      inner.appendChild(header);
      inner.appendChild(body);
      panel.appendChild(inner);
      l("game").appendChild(panel);
      colBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        body.classList.toggle("hidden");
        colBtn.classList.toggle("open");
        tooltip.style.opacity = "0";
      });
      var isDragging = false, dragStartX, dragStartY, panelStartLeft, panelStartTop;
      header.addEventListener("mousedown", function(e) {
        if (e.target === colBtn) return;
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        panelStartLeft = panel.offsetLeft;
        panelStartTop = panel.offsetTop;
        e.preventDefault();
      });
      document.addEventListener("mousemove", function(e) {
        if (!isDragging) return;
        panel.style.left = Math.max(0, panelStartLeft + e.clientX - dragStartX) + "px";
        panel.style.top = Math.max(0, panelStartTop + e.clientY - dragStartY) + "px";
        panel.style.bottom = "auto";
      });
      document.addEventListener("mouseup", function() {
        isDragging = false;
      });
      function updateInfo() {
        updateConfig();
        var states = getStates();
        for (var id2 in states) {
          var row = l("ccc-row-" + id2);
          if (row) row.classList.toggle("on", states[id2]);
        }
        var da = l("ccc-dev-actions");
        if (da) da.style.display = devActive() ? "" : "none";
        updateVisibility();
      }
      function updateVisibility() {
        var counts = { clicks: 0, auto: 0, minigame: 0, other: 0 };
        MOD.FEATURES.forEach(function(f) {
          var row = l("ccc-row-" + f.id);
          if (!row) return;
          var shown = f.unlocked ? f.unlocked() : true;
          if (f.id === "devlog") shown = devActive();
          row.style.display = shown ? "" : "none";
          if (shown) counts[f.section]++;
        });
        ["clicks", "auto", "minigame", "other"].forEach(function(sect) {
          var hdr = l("ccc-sec-hdr-" + sect);
          var sep = l("ccc-sep-" + sect);
          var visible = counts[sect] > 0;
          if (hdr) hdr.style.display = visible ? "" : "none";
          if (sep) sep.style.display = visible ? "" : "none";
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
  var init_init = __esm({
    "src/init.js"() {
      init_strings();
      init_strategy();
      init_dev();
      init_golden();
      init_wrath();
      init_bigcookie();
      init_wrinklers();
      init_lumps();
      init_spell();
      init_market();
      init_office();
      init_garden();
      init_clovergarden();
      init_breeder();
      init_pantheon();
      init_fortune();
      init_dragon();
      init_dragonsacrifice();
      init_dragonaura();
      init_buyupgrades();
      init_buybuildings();
      init_onemind();
      init_luckyreserve();
      init_devlog();
    }
  });

  // src/index.js
  var require_index = __commonJS({
    "src/index.js"() {
      init_css();
      init_features();
      init_strings();
      init_ratios();
      init_persistence();
      init_init();
      Game.registerMod("cookie clicker companion", {
        values: new Array(20).fill(0),
        colors: ["#ff6666", "#ffff66", "#66ff66"],
        activeMode: "manual",
        // strategy preset: 'manual' | 'grind' | 'investor' (persisted)
        CSS,
        FEATURES,
        loadStrings,
        calculateRatio,
        tierBundleRatio,
        bulkFactor,
        updateRatios,
        createSpan,
        createColor,
        save,
        load,
        init
      });
    }
  });
  require_index();
})();
