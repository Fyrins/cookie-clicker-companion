export function save() {
    return JSON.stringify({ config: this.config, colors: this.colors, mode: this.activeMode, marketBasis: this.marketBasis });
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

    // Restore the Stock Market cost basis (per-good average buy price) so a reload does
    // not lose it and re-adopt the current price. Goods we no longer hold get reconciled
    // away on the next market tick.
    this.marketBasis = (data.marketBasis && typeof data.marketBasis === 'object') ? data.marketBasis : {};

    // The toggles above are already persisted in their real state, so we only restore
    // the mode as a label (no preset re-application). Sync the dropdown if it is built.
    this.activeMode = (data.mode === 'grind' || data.mode === 'investor') ? data.mode : 'manual';
    var modeSel = l('ccc-mode');
    if (modeSel) modeSel.value = this.activeMode;

    if (this.updateRatios) this.updateRatios(this);
}
