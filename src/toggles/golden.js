export default function createGolden(ctx) {
    return {
        configKey: 'autoClickGoldenCookie',
        t: ctx.makeToggle(function() {
            Game.shimmers.forEach(function(s) {
                if ((s.type === 'golden' && s.wrath === 0) || s.type === 'reindeer') s.pop();
            });
        }, 1000, 'goldenOn', 'goldenOff'),
    };
}
