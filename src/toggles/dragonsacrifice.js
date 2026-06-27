export default function createDragonsacrifice(ctx) {
    return {
        configKey: 'autoDragonSacrifice',
        t: ctx.makeBoolToggle('dragonSacrificeOn', 'dragonSacrificeOff'),
    };
}
