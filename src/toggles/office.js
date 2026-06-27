export default function createOffice(ctx) {
    return {
        configKey: 'autoOffice',
        t: ctx.makeToggle(function() {
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
                ctx.devLog('OFFICE upgraded -> level ' + m.officeLevel + ' (sacrificed ' + office.cost[0] + ' cursors)');
            }
        }, 1000, 'officeOn', 'officeOff'),
    };
}
