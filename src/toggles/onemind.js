export default function createOnemind(ctx) {
    return {
        configKey: 'oneMind',
        t: ctx.makeBoolToggle('oneMindOn', 'oneMindOff'),
    };
}
