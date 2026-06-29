export const FALLBACK_STRINGS = {
    modEnabled: 'Cookie Clicker Companion loaded',
    enableAll: '+ Enable all', disableAll: '- Disable all',
    sections: { clicks: 'Clicks', auto: 'Automation', minigame: 'Minigames', other: 'Other' },
    labels: { golden:'Golden Cookie', wrath:'Wrath Cookie', bigCookie:'Big Cookie',
        wrinklers:'Wrinklers', lumps:'Sugar Lumps', spell:'Force the Hand of Fate',
        fortune:'Fortune', dragon:'Dragon', dragonSacrifice:'Dragon Sacrifice', dragonAura:'Dragon Aura',
        market:'Stock Market', office:'Market Offices', garden:'Garden',
        cloverGarden:'Golden Clover Garden', breeder:'Garden Breeder', pantheon:'Pantheon',
        buyBuildings:'Auto Buy Buildings', buyUpgrades:'Auto Buy Upgrades',
        oneMind:'One Mind', luckyReserve:'Lucky Reserve' },
    descriptions: {}, notify: {
        goldenOn:'', goldenOff:'', wrathOn:'', wrathOff:'', bigOn:'', bigOff:'',
        wrinklOn:'', wrinklOff:'', lumpsOn:'', lumpsOff:'', spellOn:'', spellOff:'',
        fortuneOn:'', fortuneOff:'', dragonOn:'', dragonOff:'',
        dragonSacrificeOn:'', dragonSacrificeOff:'', dragonAuraOn:'', dragonAuraOff:'',
        marketOn:'', marketOff:'', officeOn:'', officeOff:'', gardenOn:'', gardenOff:'', pantheonOn:'', pantheonOff:'',
        breederOn:'', breederOff:'',
        buyBuildingsOn:'', buyBuildingsOff:'', buyUpgradesOn:'', buyUpgradesOff:'',
        oneMindOn:'', oneMindOff:'',
        luckyReserveOn:'', luckyReserveOff:'',
    },
};

export function loadStrings(langCode) {
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
}
