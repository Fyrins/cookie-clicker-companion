export default function createFortune(ctx) {
    return {
        configKey: 'autoFortuneNews',
        t: ctx.makeToggle(function() {
            if (Game.TickerEffect && Game.TickerEffect.type === 'fortune') Game.tickerL.dispatchEvent(ctx.clickEvent);
        }, 1000, 'fortuneOn', 'fortuneOff'),
    };
}
