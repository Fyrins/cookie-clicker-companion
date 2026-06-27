export default function createBigcookie(ctx) {
    return {
        configKey: 'autoClickBigCookie',
        t: ctx.makeToggle(function() {
            ctx.cookieEl.dispatchEvent(ctx.clickEvent);
            Game.autoclickerDetected = 0;
        }, 100, 'bigOn', 'bigOff'),
    };
}
