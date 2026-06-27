export function save() {
    return JSON.stringify({ config: this.config, colors: this.colors, mode: this.activeMode });
}

export function load(str) {
    if (!this.activateFns) { this._pendingLoad = str; return; }
    var data   = JSON.parse(str);
    var config = data.config || data;

    if (data.colors) {
        this.colors = data.colors;
        for (var i = 0; i < 3; i++) {
            var el = l('ccc-ratioColor' + i);
            if (el) el.value = this.colors[i];
        }
    }

    for (var key in config) {
        if (config[key] === true && this.activateFns[key]) this.activateFns[key]();
    }

    // The toggles above are already persisted in their real state, so we only restore
    // the mode as a label (no preset re-application). Sync the dropdown if it is built.
    this.activeMode = (data.mode === 'grind' || data.mode === 'investor') ? data.mode : 'manual';
    var modeSel = l('ccc-mode');
    if (modeSel) modeSel.value = this.activeMode;

    if (this.updateRatios) this.updateRatios(this);
}
