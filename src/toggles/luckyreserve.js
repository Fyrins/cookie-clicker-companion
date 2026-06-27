export default function createLuckyreserve(ctx) {
    return {
        configKey: 'luckyReserve',
        t: ctx.makeBoolToggle('luckyReserveOn', 'luckyReserveOff'),
    };
}
