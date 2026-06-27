export default function createBuyupgrades(ctx) {
    return {
        configKey: 'autoBuyUpgrades',
        t: ctx.makeToggle(function() {
            // Lucky Reserve keeps CPS*6000 banked; only the surplus is spendable.
            var spendable = Game.cookies - (ctx.TOGGLES.luckyreserve.t.isActive() ? Game.cookiesPs * 6000 : 0);
            Game.UpgradesInStore.forEach(function(upgrade) {
                if (!ctx.upgradeEligible(upgrade)) return;
                var price = upgrade.getPrice ? upgrade.getPrice() : upgrade.basePrice;
                if (price >= spendable) return;
                ctx.devLog('BUY upg ' + upgrade.name + ' price=' + Beautify(price));
                upgrade.buy();
                // "One mind" opens a confirmation prompt; auto-accept it.
                if (upgrade.name === 'One mind') l('promptOption0').dispatchEvent(ctx.clickEvent);
            });
        }, 1000, 'buyUpgradesOn', 'buyUpgradesOff'),
    };
}
