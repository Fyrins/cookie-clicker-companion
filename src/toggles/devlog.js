// DEV ONLY — toggles the tuning telemetry (ccc-devlog.txt). Inert unless DEV_MODE.
export default function createDevlog(ctx) {
    return {
        configKey: 'devLog',
        t: (function() {
            var active = false;
            return {
                toggle: function() {
                    active = !active;
                    Game.Notify('🔧 Dev Log ' + (active ? 'ON' : 'OFF'), active ? 'Writing ccc-devlog.txt' : '', [16, 5], 3);
                    if (active) { ctx.devSelfTest(); window.cccDevLog = []; ctx.devLog('=== SESSION START ==='); ctx.devContext(); ctx.devSnapshot(); }
                    ctx.updateInfo();
                },
                activate: function() { if (!active) this.toggle(); },
                isActive: function() { return active; },
            };
        })(),
    };
}
