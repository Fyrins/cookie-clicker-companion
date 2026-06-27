export default function createWrath(ctx) {
    return {
        configKey: 'autoClickWrathCookie',
        t: ctx.makeToggle(function() {
            Game.shimmers.forEach(function(s) {
                if (s.type === 'golden' && s.wrath === 1) s.pop();
            });
        }, 1000, 'wrathOn', 'wrathOff'),
    };
}
