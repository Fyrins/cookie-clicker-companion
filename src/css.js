export const CSS = `
#ccc-panel{position:fixed;bottom:60px;left:10px;width:215px;z-index:9999;font-family:Merriweather,Georgia,serif;font-size:11px;color:#f0ddb8;user-select:none;animation:ccc-in .45s cubic-bezier(.22,1,.36,1) both}
@keyframes ccc-in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
#ccc-inner{background:linear-gradient(155deg,#1e0f05 0%,#130a03 100%);border:1px solid #6a4418;border-radius:8px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,.75),inset 0 1px 0 rgba(212,150,58,.12),inset 0 -1px 0 rgba(0,0,0,.4)}
#ccc-header{display:flex;align-items:center;justify-content:space-between;padding:9px 13px 8px;background:linear-gradient(180deg,#271005 0%,#1c0c03 100%);border-bottom:1px solid #3a1a06;cursor:grab}
#ccc-header:active{cursor:grabbing}
#ccc-title{font-size:12px;font-weight:700;color:#d4963a;letter-spacing:.6px;text-shadow:0 0 12px rgba(212,150,58,.5)}
#ccc-collapse{width:18px;height:18px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6a4010;font-size:9px;line-height:1;transition:color .2s,transform .3s;transform:rotate(0deg)}
#ccc-collapse:hover{color:#d4963a}
#ccc-collapse.open{transform:rotate(180deg)}
#ccc-body{overflow-y:auto;overflow-x:hidden;transition:max-height .3s ease,padding .3s ease;max-height:85vh;padding:7px 0}
#ccc-body::-webkit-scrollbar{width:7px}
#ccc-body::-webkit-scrollbar-thumb{background:#3a1a06;border-radius:4px}
#ccc-body::-webkit-scrollbar-thumb:hover{background:#6a4418}
#ccc-body.hidden{max-height:0;padding:0}
.ccc-sec-hdr{padding:3px 13px 2px;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:#5a3410;margin-bottom:3px}
.ccc-mode-row{display:flex;align-items:center;gap:7px;padding:5px 13px 8px;border-bottom:1px solid #220f04;margin-bottom:4px}
.ccc-mode-lbl{color:#8a6030;font-size:10.5px;flex-shrink:0}
#ccc-mode{flex:1;background:#1a0a03;color:#d4963a;border:1px solid #3a1a06;border-radius:5px;padding:3px 6px;font-family:Merriweather,Georgia,serif;font-size:10px;cursor:pointer;outline:none;transition:border-color .2s}
#ccc-mode:hover{border-color:#b07828}
.ccc-row{display:flex;align-items:center;padding:5px 13px;cursor:pointer;transition:background .15s;gap:7px}
.ccc-row:hover{background:rgba(212,150,58,.06)}
.ccc-row-lbl{color:#8a6030;font-size:10.5px;flex:1;transition:color .2s}
.ccc-row.on .ccc-row-lbl{color:#eeddb8}
.ccc-tog{width:30px;height:16px;background:#1a0a03;border:1px solid #3a1a06;border-radius:9px;position:relative;flex-shrink:0;transition:background .25s,border-color .25s,box-shadow .25s}
.ccc-tog::after{content:"";position:absolute;top:50%;left:2px;width:10px;height:10px;background:#4a2410;border-radius:50%;transform:translateY(-50%);transition:left .25s cubic-bezier(.22,1,.36,1),background .25s}
.ccc-row.on .ccc-tog{background:rgba(212,150,58,.18);border-color:#b07828;box-shadow:0 0 8px rgba(212,150,58,.3)}
.ccc-row.on .ccc-tog::after{left:16px;background:#d4963a}
.ccc-sep{height:1px;background:#220f04;margin:5px 0}
.ccc-actions{display:flex;gap:7px;padding:7px 13px 5px;border-top:1px solid #220f04;margin-top:2px}
.ccc-btn{flex:1;padding:5px 0;background:transparent;border:1px solid #3a1a06;border-radius:5px;color:#6a4010;font-family:Merriweather,Georgia,serif;font-size:9px;cursor:pointer;transition:border-color .2s,color .2s,background .2s;letter-spacing:.4px}
.ccc-btn:hover{border-color:#d4963a;color:#d4963a;background:rgba(212,150,58,.07)}
#ccc-tooltip{position:fixed;z-index:10000;background:#1a0a03;border:1px solid #6a4418;border-radius:5px;padding:7px 10px;font-family:Merriweather,Georgia,serif;font-size:9px;color:#c8a070;max-width:180px;line-height:1.5;white-space:pre-line;pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 4px 16px rgba(0,0,0,.65)}
.ccc-store-ratio{position:absolute;bottom:0;right:1px;font-family:Merriweather;font-size:7pt;font-weight:bold}
.ccc-store-color{position:absolute;top:-3px;right:0;width:17px;height:20px;background:rgba(0,0,0,0);border:none;outline:none;opacity:.7}
`;
