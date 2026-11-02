(function(){"use strict";
const React=window.__SUMEEKO_REACT__; if(!React) throw Error("Missing bundled React runtime");
const extReact=Object.assign({default:React.React,__esModule:true},React.React);
const extClient={createRoot:React.createRoot};
const factories=Object.create(null);
factories["./app/main_app.tsx"]=function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = require("react-dom/client");
const Shell_1 = __importDefault(require("./Shell"));
class Boundary extends react_1.default.Component {
    constructor(p) { super(p); this.state = { err: null }; }
    static getDerivedStateFromError(err) { return { err }; }
    render() {
        if (this.state.err)
            return react_1.default.createElement("div", { style: { padding: 24, color: '#fff', fontFamily: 'sans-serif' } },
                react_1.default.createElement("h2", null, "App \u767C\u751F\u932F\u8AA4"),
                react_1.default.createElement("pre", { style: { whiteSpace: 'pre-wrap', fontSize: 12 } }, String(this.state.err?.stack || this.state.err)),
                react_1.default.createElement("button", { onClick: () => location.reload() }, "\u91CD\u65B0\u8F09\u5165"));
        return this.props.children;
    }
}
(0, client_1.createRoot)(document.getElementById('root')).render(react_1.default.createElement(Boundary, null,
    react_1.default.createElement(Shell_1.default, null)));

};
factories["./app/Shell.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartViewer = PartViewer;
exports.MachineSim = MachineSim;
exports.default = Shell;
const react_1 = __importStar(require("react"));
const core_1 = require("./core");
const navigation_1 = require("./navigation");
const appdata_1 = require("./appdata");
const machines_1 = require("./machines");
const people_1 = require("./people");
const gl_1 = require("./gl");
const data_1 = require("../data");
const state_1 = require("../state");
const data_2 = require("../data");
const App_1 = __importDefault(require("../App"));
const C = (0, react_1.createContext)(null);
const useA = () => (0, react_1.useContext)(C);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const M = (id) => appdata_1.MACHINES.find((m) => m.id === id);
const P = (id) => appdata_1.PARTS.find((p) => p.id === id);
function Btn(p) {
    const { sfx } = useA();
    return react_1.default.createElement("button", { className: `sx-btn ${p.kind || ''} ${p.sm ? 'sm' : ''} ${p.className || ''}`, disabled: p.disabled, title: p.title, onClick: () => { if (p.disabled)
            return; sfx('click'); p.onClick && p.onClick(); } }, p.children);
}
function Sec(p) {
    return react_1.default.createElement("section", { className: `sx-card ${p.className || ''}` },
        (p.title || p.right) && react_1.default.createElement("header", null,
            react_1.default.createElement("h3", null, p.title),
            p.right),
        p.children);
}
function Badge({ st }) { const d = appdata_1.MSTATE[st]; return react_1.default.createElement("span", { className: "sx-badge", style: { borderColor: d.color, color: d.color } },
    d.icon,
    " ",
    d.n,
    react_1.default.createElement("small", null,
        " ",
        d.en)); }
function Sheet(p) {
    (0, core_1.useBack)(() => { p.onClose(); return true; });
    return (react_1.default.createElement("div", { className: "sx-sheet-wrap", onClick: (e) => { if (e.target === e.currentTarget)
            p.onClose(); } },
        react_1.default.createElement("div", { className: "sx-sheet", role: "dialog" },
            react_1.default.createElement("button", { className: "sx-handle", "aria-label": "\u95DC\u9589", onClick: p.onClose }),
            react_1.default.createElement("header", null,
                react_1.default.createElement("h3", null, p.title),
                react_1.default.createElement("button", { className: "sx-x", onClick: p.onClose, "aria-label": "\u95DC\u9589" }, "\u2715")),
            react_1.default.createElement("div", { className: "sx-sheet-b" }, p.children))));
}
function TopBar(p) {
    const { pop } = useA();
    return react_1.default.createElement("div", { className: "sx-top" },
        react_1.default.createElement("button", { className: "sx-back", onClick: pop, "aria-label": "\u8FD4\u56DE" }, "\u2039"),
        react_1.default.createElement("div", { className: "sx-top-t" },
            react_1.default.createElement("b", null, p.title),
            p.sub && react_1.default.createElement("small", null, p.sub)),
        p.right);
}
function SafeSlider(p) {
    const out = p.v < p.safe[0] || p.v > p.safe[1];
    const pct = (x) => ((x - p.min) / (p.max - p.min)) * 100;
    const dec = p.step < 0.1 ? 2 : p.step < 1 ? 1 : 0;
    return (react_1.default.createElement("div", { className: `sx-slider ${p.disabled ? 'dis' : ''}` },
        react_1.default.createElement("label", null,
            p.label,
            react_1.default.createElement("b", { className: out ? 'red' : '' },
                p.v.toFixed(dec),
                p.unit)),
        react_1.default.createElement("div", { className: "sx-track" },
            react_1.default.createElement("div", { className: "sx-safe", style: { left: `${pct(p.safe[0])}%`, width: `${pct(p.safe[1]) - pct(p.safe[0])}%` } }),
            p.showBest && p.best && react_1.default.createElement("div", { className: "sx-best", style: { left: `${pct(p.best[0])}%`, width: `${pct(p.best[1]) - pct(p.best[0])}%` } }),
            react_1.default.createElement("input", { type: "range", min: p.min, max: p.max, step: p.step, value: p.v, disabled: p.disabled, "aria-label": p.label, onChange: (e) => p.onChange(+e.target.value) })),
        react_1.default.createElement("div", { className: "sx-row sm" },
            react_1.default.createElement(Btn, { sm: true, disabled: p.disabled, onClick: () => p.onChange(+clamp(p.v - p.step, p.min, p.max).toFixed(3)) }, "\u2212"),
            p.tip && react_1.default.createElement("small", { className: "muted" }, p.tip),
            react_1.default.createElement(Btn, { sm: true, disabled: p.disabled, onClick: () => p.onChange(+clamp(p.v + p.step, p.min, p.max).toFixed(3)) }, "\uFF0B")),
        out && react_1.default.createElement("div", { className: "sx-warn" },
            "\u26A0 \u8D85\u51FA\u5B89\u5168\u5DE5\u4F5C\u7A97\u53E3\uFF08\u7DA0\u8272 ",
            p.safe[0],
            "\uFF5E",
            p.safe[1],
            p.unit,
            "\uFF09")));
}
function Tip({ children }) { const { s } = useA(); return s.settings.hints ? react_1.default.createElement("div", { className: "sx-tip" },
    "\uD83D\uDCA1 ",
    children) : null; }
function Fav({ id }) {
    const { s, set, toast } = useA();
    const on = s.fav.includes(id);
    return react_1.default.createElement("button", { className: `sx-fav ${on ? 'on' : ''}`, "aria-label": on ? '取消收藏' : '收藏', onClick: () => { set((x) => ({ ...x, fav: on ? x.fav.filter((f) => f !== id) : [...x.fav, id] })); toast(on ? '已取消收藏' : '已加入收藏'); } }, on ? '★' : '☆');
}
function touchRecent(set, id, r) { set((x) => ({ ...x, recent: [{ id, t: Date.now() }, ...x.recent.filter((y) => y.id !== id)].slice(0, 12), last: { r, id } })); }
function PartViewer({ part, finish: f0, compact }) {
    const { s, paused } = useA();
    const cv = (0, react_1.useRef)(null);
    const R = (0, react_1.useRef)(null);
    const view = (0, react_1.useRef)({ yaw: 0.6, pitch: 0.35, dist: 4.6, cut: false, alpha: 1, finish: f0 || part.finish });
    const [ui, setUi] = (0, react_1.useState)({ auto: true, cut: false, alpha: false, finish: f0 || part.finish });
    const [err, setErr] = (0, react_1.useState)('');
    const ptrs = (0, react_1.useRef)(new Map());
    const pinch = (0, react_1.useRef)(0);
    const dirty = (0, react_1.useRef)(true);
    (0, react_1.useEffect)(() => {
        const c = cv.current;
        try {
            const dpr = s.settings.lowGfx ? 1 : Math.min(2, window.devicePixelRatio || 1);
            const fit = () => { const r = c.getBoundingClientRect(); c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); dirty.current = true; };
            R.current = new gl_1.PartRenderer(c, s.settings.lowGfx);
            fit();
            R.current.setShape(part.shape, s.settings.lowGfx);
            const ro = new ResizeObserver(fit);
            ro.observe(c);
            return () => ro.disconnect();
        }
        catch (e) {
            setErr(String(e.message || e));
        }
    }, [part.shape, s.settings.lowGfx]);
    (0, react_1.useEffect)(() => { view.current.cut = ui.cut; view.current.alpha = ui.alpha ? 0.42 : 1; view.current.finish = ui.finish; dirty.current = true; }, [ui]);
    (0, react_1.useEffect)(() => { setUi((u) => ({ ...u, finish: f0 || part.finish })); }, [part.id, f0]);
    (0, react_1.useEffect)(() => {
        let raf = 0, last = performance.now();
        const loop = (t) => {
            const dt = Math.min(0.05, (t - last) / 1000);
            last = t;
            if (!paused && ui.auto && !s.settings.lowMotion && ptrs.current.size === 0) {
                view.current.yaw += dt * 0.6;
                dirty.current = true;
            }
            if (dirty.current && R.current) {
                R.current.draw(view.current);
                dirty.current = false;
            }
            raf = requestAnimationFrame(loop);
        };
        if (!paused)
            raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [ui.auto, paused, s.settings.lowMotion]);
    const down = (e) => { e.target.setPointerCapture(e.pointerId); ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.current.size === 2) {
        const [a, b] = [...ptrs.current.values()];
        pinch.current = Math.hypot(a.x - b.x, a.y - b.y);
    } };
    const move = (e) => {
        const p0 = ptrs.current.get(e.pointerId);
        if (!p0)
            return;
        if (ptrs.current.size === 1) {
            view.current.yaw += (e.clientX - p0.x) * 0.01;
            view.current.pitch = clamp(view.current.pitch + (e.clientY - p0.y) * 0.01, -1.4, 1.4);
        }
        ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (ptrs.current.size === 2) {
            const [a, b] = [...ptrs.current.values()];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (pinch.current)
                view.current.dist = clamp(view.current.dist * (pinch.current / d), 1.6, 9);
            pinch.current = d;
        }
        dirty.current = true;
    };
    const up = (e) => { ptrs.current.delete(e.pointerId); if (ptrs.current.size < 2)
        pinch.current = 0; };
    return (react_1.default.createElement("div", { className: `sx-viewer ${compact ? 'compact' : ''}` },
        err ? react_1.default.createElement("div", { className: "sx-warn" },
            "\u6B64\u88DD\u7F6E\u7121\u6CD5\u555F\u7528 3D\uFF08",
            err,
            "\uFF09\u3002\u8ACB\u6539\u7528\u5DE5\u5E8F\u5C0D\u7167\u6587\u5B57\u8AAA\u660E\u3002") :
            react_1.default.createElement("canvas", { ref: cv, className: "sx-canvas", onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, onWheel: (e) => { view.current.dist = clamp(view.current.dist * (e.deltaY > 0 ? 1.1 : 0.9), 1.6, 9); dirty.current = true; }, "aria-label": `${part.n} 3D 模型，可拖曳旋轉、雙指縮放` }),
        react_1.default.createElement("div", { className: "sx-vbar" },
            react_1.default.createElement("button", { className: ui.auto ? 'on' : '', onClick: () => setUi({ ...ui, auto: !ui.auto }) }, "\u27F3 360\u00B0"),
            react_1.default.createElement("button", { className: ui.cut ? 'on' : '', onClick: () => setUi({ ...ui, cut: !ui.cut }) }, "\u25E7 \u5256\u9762"),
            react_1.default.createElement("button", { className: ui.alpha ? 'on' : '', onClick: () => setUi({ ...ui, alpha: !ui.alpha }) }, "\u25CC \u534A\u900F\u660E"),
            react_1.default.createElement("button", { onClick: () => { view.current.dist = clamp(view.current.dist * 0.7, 1.6, 9); dirty.current = true; } }, "\uFF0B \u653E\u5927"),
            react_1.default.createElement("button", { onClick: () => { Object.assign(view.current, { yaw: 0.6, pitch: 0.35, dist: 4.6 }); dirty.current = true; } }, "\u21BA \u91CD\u7F6E"),
            !compact && react_1.default.createElement("select", { value: ui.finish, onChange: (e) => setUi({ ...ui, finish: e.target.value }), "aria-label": "\u6750\u8CEA" }, Object.entries(gl_1.FINISHES).map(([k, v]) => react_1.default.createElement("option", { key: k, value: k }, v.n)))),
        react_1.default.createElement("small", { className: "sx-real" }, "\u7A0B\u5E8F\u5316\u5373\u6642 3D \u5E7E\u4F55\uFF08\u771F\u5BE6\u87BA\u65CB\u87BA\u7D0B\uFF09\uFF0C\u975E\u5716\u7247\u7E2E\u653E\u3002")));
}
function MachineSim({ m, params: p0, lockParams, onDone, taskMode }) {
    const { sfx, s, paused, toast } = useA();
    const init = {};
    m.params.forEach((x) => (init[x.id] = p0?.[x.id] ?? x.def));
    const [st, setSt] = (0, react_1.useState)('idle');
    const [params, setParams] = (0, react_1.useState)(init);
    const [prog, setProg] = (0, react_1.useState)(0);
    const [view, setView] = (0, react_1.useState)('full');
    const [sel, setSel] = (0, react_1.useState)(null);
    const [checks, setChecks] = (0, react_1.useState)([]);
    const [loto, setLoto] = (0, react_1.useState)([]);
    const [clearOk, setClearOk] = (0, react_1.useState)(false);
    const [log, setLog] = (0, react_1.useState)([`${m.n} 開機完成，待機中。`]);
    const [result, setResult] = (0, react_1.useState)(null);
    const [scrap, setScrap] = (0, react_1.useState)(false);
    const notes = (0, react_1.useRef)([]);
    const L = (t) => setLog((l) => [`${new Date().toLocaleTimeString('zh-TW', { hour12: false })}　${t}`, ...l].slice(0, 30));
    const PREP = ['安全護罩關閉、連鎖正常', '潤滑／油位確認', '模具治具與壽命確認', '緊急停止鈕已復歸、周邊淨空'];
    const LOTO = ['停機並切斷主電源', '上鎖並掛上個人隔離標籤', '確認零能量（試啟動無動作、殘壓釋放）'];
    const speedP = m.params.find((x) => x.id === 'speed');
    const speed = speedP ? params.speed : 85;
    const running = st === 'running' || st === 'warning';
    const unsafe = m.params.filter((x) => params[x.id] < x.safe[0] || params[x.id] > x.safe[1]);
    const stageN = machines_1.STAGES[m.id].length;
    const stage = Math.min(stageN - 1, Math.floor((prog / 100) * stageN));
    (0, react_1.useEffect)(() => { core_1.sound.ambient(running && !paused); return () => core_1.sound.ambient(false); }, [running, paused]);
    (0, react_1.useEffect)(() => {
        if (!running || paused)
            return;
        let raf = 0, last = performance.now();
        const tick = (t) => {
            const dt = (t - last) / 1000;
            last = t;
            setProg((pp) => { const np = pp + (dt * 100 / m.cycleSec) * (speed / 85) * (st === 'warning' ? 0.6 : 1); return Math.min(100, np); });
            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [running, paused, speed, st]);
    const warned = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => { if (taskMode && st === 'running' && prog > 45 && !warned.current && speed > 88) {
        warned.current = true;
        setSt('warning');
        sfx('warn');
        L(`⚠ 警告：${m.warn.n}——${m.warn.d}`);
    } }, [prog, st]);
    (0, react_1.useEffect)(() => {
        if (prog >= 100 && running) {
            setSt('inspection');
            L('加工完成，進入檢驗。');
            sfx('contact');
            const t = setTimeout(() => {
                const q = m.params.reduce((a, x) => { const v = params[x.id]; const d = v < x.best[0] ? (x.best[0] - v) / (x.best[0] - x.min || 1) : v > x.best[1] ? (v - x.best[1]) / (x.max - x.best[1] || 1) : 0; return a * (1 - Math.min(0.9, d * 1.6)); }, 1);
                const ok = q > 0.72 && !scrap;
                const r = { params, ok, q, scrap, notes: [...notes.current] };
                setResult(r);
                setSt('complete');
                sfx(ok ? 'success' : 'fail');
                L(ok ? `✔ 品質判定：合格（品質指數 ${(q * 100).toFixed(0)}）` : `✖ 品質判定：不合格（品質指數 ${(q * 100).toFixed(0)}）${scrap ? '，急停中斷的工件已隔離報廢' : ''}`);
                onDone && onDone(r);
            }, 1200);
            return () => clearTimeout(t);
        }
    }, [prog]);
    const act = (a) => {
        switch (a) {
            case 'prep':
                setSt('preparing');
                setChecks([]);
                setResult(null);
                setProg(0);
                setScrap(false);
                notes.current = [];
                L('進入啟動前檢查。');
                sfx('prompt');
                break;
            case 'start':
                if (unsafe.length) {
                    toast('參數超出安全窗口，無法啟動');
                    sfx('fail');
                    return;
                }
                setSt('running');
                L(`啟動運轉（速度 ${speed}%）。`);
                break;
            case 'pause':
                setSt('paused');
                L('暫停：動畫與進度同步停止。');
                break;
            case 'resume':
                setSt('running');
                L('恢復運轉。');
                break;
            case 'estop':
                if (running || st === 'paused') {
                    setScrap(true);
                    notes.current.push('製程中按下緊急停止，在製工件隔離');
                }
                setSt('estop');
                setClearOk(false);
                sfx('warn');
                L('⛔ 緊急停止！所有運動立即停止。');
                break;
            case 'reset':
                if (st === 'estop' && !clearOk)
                    return;
                setSt('idle');
                setProg(0);
                L('急停已復歸，回到待機（需重新執行啟動前檢查）。');
                break;
            case 'warn':
                setSt('warning');
                sfx('warn');
                L(`⚠ 模擬警告：${m.warn.n}——${m.warn.d}`);
                break;
            case 'slow':
                if (speedP)
                    setParams((x) => ({ ...x, speed: Math.max(speedP.min, x.speed - 12) }));
                setSt('running');
                notes.current.push('警告時降速運轉');
                L('降速後繼續運轉並加強監控。');
                break;
            case 'stopcheck':
                setSt('idle');
                setProg(0);
                notes.current.push('警告時停機檢查');
                L('停機檢查完成，回到待機。');
                break;
            case 'fault':
                setSt('fault');
                setScrap(true);
                sfx('fail');
                L(`✖ 故障：${m.fault.n}——${m.fault.d}`);
                break;
            case 'maint':
                setSt('maintenance');
                setLoto([]);
                L('進入保養模式：請依序完成上鎖掛牌（LOTO）。');
                break;
            case 'fixed':
                setSt('idle');
                setProg(0);
                L('排除完成、解除上鎖並確認人員撤離，回到待機。');
                sfx('success');
                break;
            case 'again':
                setSt('idle');
                setProg(0);
                setResult(null);
                break;
        }
    };
    const pt = sel ? m.parts.find((x) => x.id === sel) : null;
    return (react_1.default.createElement("div", { className: "sx-sim" },
        react_1.default.createElement("div", { className: "sx-row between wrap" },
            react_1.default.createElement(Badge, { st: st }),
            react_1.default.createElement("div", { className: "sx-seg" }, [['full', '整機'], ['inside', '內部結構'], ['station', '逐站動畫']].map(([k, n]) => react_1.default.createElement("button", { key: k, className: view === k ? 'on' : '', onClick: () => setView(k) }, n)))),
        react_1.default.createElement(machines_1.MachineArt, { m: m, state: st, speed: speed, view: view, stage: stage, onPart: (id) => { setSel(id); sfx('click'); }, sel: sel, lowFx: s.settings.lowGfx }),
        s.settings.pauseAnim && running && react_1.default.createElement("small", { className: "muted" }, "\uFF08\u8A2D\u5B9A\u4E2D\u5DF2\u66AB\u505C\u52D5\u756B\uFF0C\u9032\u5EA6\u4ECD\u4F9D\u72C0\u614B\u8A08\u7B97\uFF09"),
        react_1.default.createElement("div", { className: "sx-prog" },
            react_1.default.createElement("div", { style: { width: `${prog}%` } }),
            react_1.default.createElement("span", null,
                machines_1.STAGES[m.id][stage],
                "\u30FB",
                prog.toFixed(0),
                "%")),
        pt && react_1.default.createElement("div", { className: "sx-partinfo" },
            react_1.default.createElement("b", null,
                m.parts.indexOf(pt) + 1,
                ". ",
                pt.n),
            "\uFF1A",
            pt.d,
            react_1.default.createElement("button", { className: "sx-x", onClick: () => setSel(null) }, "\u2715")),
        st === 'preparing' && react_1.default.createElement("div", { className: "sx-box" },
            react_1.default.createElement("b", null, "\u555F\u52D5\u524D\u6AA2\u67E5"),
            PREP.map((c) => react_1.default.createElement("label", { key: c, className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: checks.includes(c), onChange: (e) => setChecks(e.target.checked ? [...checks, c] : checks.filter((x) => x !== c)) }),
                c))),
        st === 'estop' && react_1.default.createElement("div", { className: "sx-box red" },
            react_1.default.createElement("b", null, "\u6025\u505C\u5FA9\u6B78\u524D"),
            react_1.default.createElement("label", { className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: clearOk, onChange: (e) => setClearOk(e.target.checked) }),
                "\u5DF2\u78BA\u8A8D\u5371\u96AA\u6392\u9664\u3001\u4EBA\u54E1\u96E2\u958B\u5371\u96AA\u5340\uFF0C\u4E26\u5411\u9818\u73ED\u901A\u5831")),
        st === 'warning' && react_1.default.createElement("div", { className: "sx-box warn" },
            react_1.default.createElement("b", null,
                "\u26A0 ",
                m.warn.n),
            react_1.default.createElement("p", null, m.warn.d),
            react_1.default.createElement("div", { className: "sx-row wrap" },
                react_1.default.createElement(Btn, { sm: true, onClick: () => act('slow') }, "\u964D\u901F\u7E7C\u7E8C\u4E26\u76E3\u63A7"),
                react_1.default.createElement(Btn, { sm: true, kind: "danger", onClick: () => act('stopcheck') }, "\u505C\u6A5F\u6AA2\u67E5"))),
        st === 'fault' && react_1.default.createElement("div", { className: "sx-box red" },
            react_1.default.createElement("b", null,
                "\u2716 ",
                m.fault.n),
            react_1.default.createElement("p", null, m.fault.d),
            react_1.default.createElement(Btn, { sm: true, kind: "pri", onClick: () => act('maint') }, "\u9032\u5165\u4FDD\u990A\u6A21\u5F0F\uFF08LOTO\uFF09")),
        st === 'maintenance' && react_1.default.createElement("div", { className: "sx-box purple" },
            react_1.default.createElement("b", null, "\u4E0A\u9396\u639B\u724C\u7A0B\u5E8F"),
            LOTO.map((c, i) => react_1.default.createElement("label", { key: c, className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", disabled: i > loto.length, checked: loto.includes(c), onChange: (e) => setLoto(e.target.checked ? [...loto, c] : loto.slice(0, i)) }),
                i + 1,
                ". ",
                c))),
        react_1.default.createElement("div", { className: "sx-ctrl" },
            react_1.default.createElement(Btn, { disabled: !['idle', 'complete'].includes(st), onClick: () => act('prep') }, "\uD83D\uDD27 \u555F\u52D5\u524D\u6AA2\u67E5"),
            react_1.default.createElement(Btn, { kind: "ok", disabled: st !== 'preparing' || checks.length < PREP.length, onClick: () => act('start') }, "\u25B6 \u555F\u52D5"),
            st === 'paused' ? react_1.default.createElement(Btn, { onClick: () => act('resume') }, "\u23EF \u6062\u5FA9") : react_1.default.createElement(Btn, { disabled: !running, onClick: () => act('pause') }, "\u23F8 \u66AB\u505C"),
            react_1.default.createElement(Btn, { kind: "danger", className: "estop", disabled: ['estop', 'maintenance'].includes(st), onClick: () => act('estop') }, "\u26D4 \u7DCA\u6025\u505C\u6B62"),
            react_1.default.createElement(Btn, { disabled: st !== 'estop' || !clearOk, onClick: () => act('reset') }, "\u27F2 \u6025\u505C\u5FA9\u6B78"),
            !taskMode && react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(Btn, { sm: true, disabled: st !== 'running', onClick: () => act('warn') }, "\u6A21\u64EC\u8B66\u544A"),
                react_1.default.createElement(Btn, { sm: true, disabled: !running, onClick: () => act('fault') }, "\u6A21\u64EC\u6545\u969C")),
            react_1.default.createElement(Btn, { sm: true, disabled: st !== 'maintenance' || loto.length < LOTO.length, onClick: () => act('fixed') }, "\u2714 \u6392\u9664\u5B8C\u6210")),
        react_1.default.createElement("details", { className: "sx-params", open: !lockParams },
            react_1.default.createElement("summary", null, "\u6A21\u64EC\u53C3\u6578\uFF08\u904A\u6232\u6A21\u64EC\u8CC7\u6599\uFF0C\u4E0D\u53EF\u5957\u7528\u81F3\u5BE6\u969B\u8A2D\u5099\uFF09"),
            m.params.map((x) => react_1.default.createElement(SafeSlider, { key: x.id, label: x.n, unit: x.unit, v: params[x.id], min: x.min, max: x.max, step: x.step, safe: x.safe, best: x.best, tip: x.tip, disabled: lockParams || !['idle', 'preparing', 'paused', 'complete'].includes(st), onChange: (v) => setParams({ ...params, [x.id]: v }) })),
            running && react_1.default.createElement("small", { className: "muted" }, "\u904B\u8F49\u4E2D\u53C3\u6578\u9396\u5B9A\uFF1B\u8ACB\u66AB\u505C\u5F8C\u8ABF\u6574\u3002")),
        result && !taskMode && react_1.default.createElement("div", { className: result.ok ? 'sx-ok' : 'sx-warn' },
            result.ok ? '✔ 成品合格' : '✖ 成品不合格',
            "\uFF1A\u54C1\u8CEA\u6307\u6578 ",
            (result.q * 100).toFixed(0),
            "\u3002",
            result.ok ? '' : '試著把參數調到建議範圍內。'),
        react_1.default.createElement("details", { className: "sx-log" },
            react_1.default.createElement("summary", null,
                "\u8A2D\u5099\u4E8B\u4EF6\u7D00\u9304\uFF08",
                log.length,
                "\uFF09"),
            react_1.default.createElement("ol", null, log.map((l, i) => react_1.default.createElement("li", { key: i }, l))))));
}
function ToolDemo({ t }) {
    const { sfx } = useA();
    const [v, setV] = (0, react_1.useState)(40);
    const [sample, setSample] = (0, react_1.useState)(0);
    const [res, setRes] = (0, react_1.useState)('');
    const demos = {
        caliper: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u62D6\u66F3\u6E38\u6A19\u5C3A\u8B93\u91CF\u722A\u8F15\u89F8\u80DA\u6599\uFF08\u5BE6\u969B\u9577\u5EA6 45.00 mm\uFF0C\u6A21\u64EC\uFF09\u3002"),
            react_1.default.createElement("svg", { viewBox: "0 0 320 90", className: "sx-demo" },
                react_1.default.createElement("rect", { x: "20", y: "40", width: "280", height: "12", fill: "#cfd8e2" }),
                Array.from({ length: 29 }, (_, i) => react_1.default.createElement("path", { key: i, d: `M${20 + i * 10} 40 v${i % 5 ? 4 : 8}`, stroke: "#333" })),
                react_1.default.createElement("rect", { x: "22", y: "20", width: "6", height: "40", fill: "#AEB8C4" }),
                react_1.default.createElement("rect", { x: 22 + v * 4.6, y: "20", width: "30", height: "40", fill: "#8a96a5", opacity: ".9" }),
                react_1.default.createElement("rect", { x: "30", y: "58", width: v * 4.6 - 8, height: "14", fill: "#c9a26a" })),
            react_1.default.createElement("input", { type: "range", min: 30, max: 60, step: 0.02, value: v, onChange: (e) => setV(+e.target.value), "aria-label": "\u6E38\u6A19\u4F4D\u7F6E" }),
            react_1.default.createElement("p", null,
                "\u8B80\u503C\uFF1A",
                react_1.default.createElement("b", null,
                    v.toFixed(2),
                    " mm"),
                " ",
                Math.abs(v - 45) <= 0.02 ? '✔ 量爪接觸良好' : v < 45 ? '（量爪壓入工件，讀值不可信）' : '（尚未接觸）')),
        micrometer: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u4EE5\u68D8\u8F2A\u5FAE\u8ABF\u81F3\u63A5\u89F8\uFF08\u5BE6\u969B\u5916\u5F91 9.88 mm\uFF0C\u6A21\u64EC\uFF09\u3002\u6BCF\u6B21 0.01 mm\u3002"),
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(Btn, { sm: true, onClick: () => { setV(+(v - 0.01).toFixed(2)); sfx('contact'); } }, "\u68D8\u8F2A \u22120.01"),
                react_1.default.createElement("b", { className: "sx-big" },
                    (v / 4).toFixed(2),
                    " mm"),
                react_1.default.createElement(Btn, { sm: true, onClick: () => { setV(+(v + 0.01).toFixed(2)); sfx('contact'); } }, "\u68D8\u8F2A \uFF0B0.01")),
            react_1.default.createElement("input", { type: "range", min: 38, max: 42, step: 0.01, value: v, onChange: (e) => setV(+e.target.value), "aria-label": "\u5957\u7B52" }),
            react_1.default.createElement("p", null, Math.abs(v / 4 - 9.88) < 0.006 ? '✔ 棘輪滑轉，量測力一致：讀值有效' : '繼續調整')),
        ring: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u9078\u64C7\u6A23\u54C1\u4E26\u7528\u87BA\u7D0B\u74B0\u898F\u6E2C\u8A66\uFF08\u5916\u87BA\u7D0B\uFF09\u3002"),
            react_1.default.createElement("div", { className: "sx-row wrap" }, ['合格品', '外徑偏大', '外徑偏小（牙型不足）'].map((n, i) => react_1.default.createElement("button", { key: n, className: `sx-opt ${sample === i ? 'on' : ''}`, onClick: () => { setSample(i); setRes(''); } }, n))),
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(Btn, { onClick: () => { setRes(sample === 1 ? 'GO 端無法旋入 → 不合格' : 'GO 端順利旋入'); sfx('contact'); } }, "GO \u901A\u7AEF"),
                react_1.default.createElement(Btn, { onClick: () => { setRes(sample === 2 ? 'NO-GO 端可旋入超過 2 圈 → 不合格' : 'NO-GO 端無法旋入（或不超過 2 圈）'); sfx('contact'); } }, "NO-GO \u6B62\u7AEF")),
            res && react_1.default.createElement("div", { className: "sx-box" }, res)),
        plug: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u87BA\u7D0B\u585E\u898F\u6AA2\u67E5\u87BA\u5E3D\u5167\u87BA\u7D0B\u3002"),
            react_1.default.createElement("div", { className: "sx-row wrap" }, ['合格品', '內徑偏小', '內徑偏大'].map((n, i) => react_1.default.createElement("button", { key: n, className: `sx-opt ${sample === i ? 'on' : ''}`, onClick: () => { setSample(i); setRes(''); } }, n))),
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(Btn, { onClick: () => setRes(sample === 1 ? 'GO 無法旋入 → 不合格' : 'GO 順利旋入') }, "GO"),
                react_1.default.createElement(Btn, { onClick: () => setRes(sample === 2 ? 'NO-GO 可旋入 → 不合格' : 'NO-GO 不入') }, "NO-GO")),
            res && react_1.default.createElement("div", { className: "sx-box" }, res)),
        torque: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u8A2D\u5B9A\u626D\u529B\u5F8C\u9396\u9644\uFF0C\u9054\u8A2D\u5B9A\u503C\u6642\u6273\u624B\u300C\u5580\u300D\u4E00\u8072\u3002"),
            react_1.default.createElement("input", { type: "range", min: 10, max: 60, step: 1, value: v, onChange: (e) => setV(+e.target.value), "aria-label": "\u8A2D\u5B9A\u626D\u529B" }),
            react_1.default.createElement("p", null,
                "\u8A2D\u5B9A\uFF1A",
                react_1.default.createElement("b", null,
                    v,
                    " N\u00B7m"),
                "\uFF08\u6A21\u64EC\uFF09"),
            react_1.default.createElement(Btn, { onClick: () => { setRes(`達 ${v} N·m，扳手觸發！`); sfx('contact'); } }, "\u9396\u9644"),
            res && react_1.default.createElement("div", { className: "sx-box" }, res),
            react_1.default.createElement("small", { className: "muted" }, "\u626D\u529B\u6273\u624B\u9808\u5B9A\u671F\u6821\u6B63\uFF1B\u9810\u7F6E\u626D\u529B\u87BA\u5E3D\u53E6\u4EE5\u65CB\u5165\u626D\u529B\u6AA2\u6E2C\u3002")),
        dial: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u8ABF\u6574\u6A21\u5177\u5C0D\u4F4D\uFF0C\u89C0\u5BDF\u767E\u5206\u8868\u6307\u91DD\u3002"),
            react_1.default.createElement("input", { type: "range", min: 30, max: 50, step: 0.5, value: v, onChange: (e) => setV(+e.target.value), "aria-label": "\u504F\u79FB" }),
            react_1.default.createElement("svg", { viewBox: "0 0 120 120", className: "sx-demo sm" },
                react_1.default.createElement("circle", { cx: "60", cy: "60", r: "50", fill: "#f0f4f8", stroke: "#AEB8C4", strokeWidth: "5" }),
                Array.from({ length: 20 }, (_, i) => react_1.default.createElement("path", { key: i, d: "M60 14 v6", stroke: "#333", transform: `rotate(${i * 18} 60 60)` })),
                react_1.default.createElement("path", { d: "M60 60 L60 20", stroke: "#E95858", strokeWidth: "2.5", transform: `rotate(${(v - 40) * 18} 60 60)` })),
            react_1.default.createElement("p", null,
                "\u504F\u64FA\uFF1A",
                ((v - 40) / 100).toFixed(3),
                " mm ",
                Math.abs(v - 40) <= 1 ? '✔ 對位良好' : '')),
        scan: react_1.default.createElement("div", null,
            react_1.default.createElement("p", null, "\u6383\u63CF\u6599\u7BB1\u6A19\u7C64\u3002"),
            react_1.default.createElement(Btn, { kind: "pri", onClick: () => { setRes('工單 WO-2611-0283｜批號 HB-M10-26110301｜數量 2,000｜熱處理爐次 HT-07（模擬資料）'); sfx('prompt'); } }, "\uD83D\uDCF7 \u6383\u63CF"),
            res && react_1.default.createElement("div", { className: "sx-box mono" }, res)),
    };
    return demos[t] || null;
}
function Home() {
    const { s, setTab, push } = useA();
    const role = appdata_1.ROLES.find((r) => r.id === s.role) || appdata_1.ROLES[1];
    const unitsDone = appdata_1.UNITS.filter((u) => s.units[u.id]?.done).length;
    const tasksPass = appdata_1.TASKS.filter((t) => s.tasks[t.id]?.pass).length;
    const nextUnit = appdata_1.UNITS.find((u) => !s.units[u.id]?.done) || appdata_1.UNITS[0];
    const nextTask = appdata_1.TASKS.find((t) => !s.tasks[t.id]?.pass) || appdata_1.TASKS[0];
    const career = (0, state_1.slotInfo)(0);
    const recentM = s.recent.map((r) => appdata_1.MACHINES.find((m) => m.id === r.id)).filter(Boolean).slice(0, 4);
    const cont = () => { const l = s.last; if (!l) {
        setTab('scene');
        return;
    } if (l.r === 'career')
        push({ t: 'career' });
    else
        push({ t: l.r, id: l.id }); };
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement("div", { className: "sx-hero" },
            react_1.default.createElement("div", { className: "sx-hero-t" },
                react_1.default.createElement("small", null, "SUMEEKO \u667A\u6167\u5DE5\u5EE0"),
                react_1.default.createElement("h1", null, "\u6B61\u8FCE\u56DE\u5230\u5DE5\u5EE0"),
                react_1.default.createElement("p", null, "\u5F9E\u4E00\u9846\u87BA\u7D72\u958B\u59CB\uFF0C\u8D70\u9032\u51B7\u935B\u3001\u6413\u7259\u3001\u71B1\u8655\u7406\u3001\u5149\u5B78\u6AA2\u9A57\u8207\u667A\u6167\u7269\u6D41\u7684\u5DE5\u4F5C\u73FE\u5834\u3002"),
                react_1.default.createElement("div", { className: "sx-row wrap" },
                    react_1.default.createElement(Btn, { kind: "pri", onClick: cont }, "\u25B6 \u7E7C\u7E8C\u63A2\u7D22"),
                    react_1.default.createElement(Btn, { onClick: () => setTab('scene') }, "\u9032\u5165\u5DE5\u4F5C\u5834\u666F"))),
            react_1.default.createElement("div", { className: "sx-hero-art", onClick: () => push({ t: 'role', id: role.id }) },
                react_1.default.createElement(MiniScene, null),
                react_1.default.createElement("div", { className: "sx-hero-p" },
                    react_1.default.createElement(people_1.Person, { role: role, size: 150, act: "point" })))),
        react_1.default.createElement("div", { className: "sx-grid4" },
            react_1.default.createElement("div", { className: "sx-stat" },
                react_1.default.createElement("small", null, "\u6559\u5B78\u55AE\u5143"),
                react_1.default.createElement("b", null,
                    unitsDone,
                    "/",
                    appdata_1.UNITS.length),
                react_1.default.createElement("i", { style: { width: `${(unitsDone / appdata_1.UNITS.length) * 100}%` } })),
            react_1.default.createElement("div", { className: "sx-stat" },
                react_1.default.createElement("small", null, "\u4EFB\u52D9\u6311\u6230"),
                react_1.default.createElement("b", null,
                    tasksPass,
                    "/",
                    appdata_1.TASKS.length),
                react_1.default.createElement("i", { style: { width: `${(tasksPass / appdata_1.TASKS.length) * 100}%` } })),
            react_1.default.createElement("div", { className: "sx-stat" },
                react_1.default.createElement("small", null, "\u8077\u6DAF\u6A21\u5F0F"),
                react_1.default.createElement("b", null, career ? data_2.CAREERS[career.pos].title : '尚未開始'),
                react_1.default.createElement("i", { style: { width: `${career ? ((career.pos + 1) / data_2.CAREERS.length) * 100 : 0}%` } })),
            react_1.default.createElement("div", { className: "sx-stat" },
                react_1.default.createElement("small", null, "\u6536\u85CF"),
                react_1.default.createElement("b", null, s.fav.length))),
        react_1.default.createElement(Sec, { title: "\u63A8\u85A6\u8AB2\u7A0B", right: react_1.default.createElement(Btn, { sm: true, onClick: () => push({ t: 'unit', id: nextUnit.id }) }, "\u958B\u59CB") },
            react_1.default.createElement("div", { className: "sx-rec", onClick: () => push({ t: 'unit', id: nextUnit.id }) },
                react_1.default.createElement("b", null, nextUnit.n),
                react_1.default.createElement("small", null, nextUnit.goal))),
        react_1.default.createElement(Sec, { title: "\u4E0B\u4E00\u500B\u4EFB\u52D9", right: react_1.default.createElement(Btn, { sm: true, kind: "pri", onClick: () => push({ t: 'task', id: nextTask.id }) }, "\u6311\u6230") },
            react_1.default.createElement("div", { className: "sx-rec", onClick: () => push({ t: 'task', id: nextTask.id }) },
                react_1.default.createElement("b", null,
                    nextTask.id,
                    "\uFF5C",
                    nextTask.n),
                react_1.default.createElement("small", null, nextTask.desc))),
        react_1.default.createElement(Sec, { title: "\u5FEB\u901F\u9032\u5165" },
            react_1.default.createElement("div", { className: "sx-quick" }, [['🏭', '工作場景', () => setTab('scene')], ['📘', '教學模式', () => push({ t: 'unit', id: nextUnit.id })], ['🎯', '任務挑戰', () => setTab('tasks')], ['🎓', '職涯模式（完整遊戲）', () => push({ t: 'career' })], ['🔩', '工件 3D', () => push({ t: 'part', id: 'P04' })], ['⚙', '設備圖鑑', () => setTab('codex')]].map(([i, n, f]) => react_1.default.createElement("button", { key: n, className: "sx-q", onClick: f },
                react_1.default.createElement("span", null, i),
                n)))),
        recentM.length > 0 && react_1.default.createElement(Sec, { title: "\u6700\u8FD1\u4F7F\u7528\u6A5F\u53F0" },
            react_1.default.createElement("div", { className: "sx-hlist" }, recentM.map((m) => react_1.default.createElement("button", { key: m.id, className: "sx-mcard", onClick: () => push({ t: 'machine', id: m.id }) },
                react_1.default.createElement("b", null, m.id),
                react_1.default.createElement("span", null, m.n)))))));
}
function MiniScene() {
    const cells = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    return (react_1.default.createElement("svg", { viewBox: "0 0 320 196", className: "sx-mini" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("linearGradient", { id: "mini-floor", x1: "0", y1: "0", x2: "1", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#193056" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#0d1830" })),
            react_1.default.createElement("linearGradient", { id: "mini-cell", x1: "0", y1: "0", x2: "1", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#32558a" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#173258" })),
            react_1.default.createElement("linearGradient", { id: "mini-hot", x1: "0", y1: "0", x2: "1", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#ffcb85" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#f59e38" })),
            react_1.default.createElement("radialGradient", { id: "mini-glow", cx: "50%", cy: "48%", r: "60%" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "rgba(54,197,232,.38)" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "rgba(54,197,232,0)" }))),
        react_1.default.createElement("rect", { width: "320", height: "196", rx: "18", fill: "#0d1727" }),
        react_1.default.createElement("polygon", { points: "160,14 304,90 160,168 16,90", fill: "url(#mini-floor)", stroke: "#294971", strokeWidth: "2" }),
        react_1.default.createElement("polygon", { points: "160,33 270,90 160,146 50,90", fill: "none", stroke: "#36C5E8", strokeOpacity: ".18", strokeWidth: "34" }),
        cells.map(([x, y], i) => {
            const cx = 160 + (x - y) * 47;
            const cy = 42 + (x + y) * 26;
            const active = i === 4;
            return react_1.default.createElement("g", { key: i },
                react_1.default.createElement("polygon", { points: `${cx},${cy - 16} ${cx + 33},${cy} ${cx},${cy + 16} ${cx - 33},${cy}`, fill: active ? 'url(#mini-hot)' : 'url(#mini-cell)', opacity: active ? 0.95 : 1, stroke: active ? '#ffd4a2' : '#4c73ab' }),
                react_1.default.createElement("polygon", { points: `${cx},${cy - 16} ${cx + 33},${cy} ${cx},${cy + 16} ${cx - 33},${cy}`, fill: "url(#mini-glow)", opacity: active ? 1 : .55 }),
                react_1.default.createElement("text", { x: cx, y: cy + 4, fontSize: "10", textAnchor: "middle", fill: "#e8eef8", fontWeight: "700" }, appdata_1.CELLS[i].id),
                active && react_1.default.createElement("g", null,
                    react_1.default.createElement("rect", { x: cx - 10, y: cy - 42, width: "20", height: "16", rx: "3", fill: "#f0f4f8", opacity: ".92" }),
                    react_1.default.createElement("rect", { x: cx - 16, y: cy - 26, width: "32", height: "4", rx: "2", fill: "#36C5E8", opacity: ".9" })));
        }),
        react_1.default.createElement("g", { opacity: ".86" },
            react_1.default.createElement("path", { d: "M114 47 L160 73 L206 99 L160 125 L114 151", fill: "none", stroke: "#36C5E8", strokeWidth: "2.6", strokeDasharray: "7 6", className: "sx-flow" }),
            react_1.default.createElement("circle", { cx: "114", cy: "47", r: "3.5", fill: "#36C5E8" }),
            react_1.default.createElement("circle", { cx: "206", cy: "99", r: "3.5", fill: "#36C5E8" })),
        react_1.default.createElement("g", { transform: "translate(227 56)" },
            react_1.default.createElement("rect", { x: "-16", y: "0", width: "32", height: "48", rx: "5", fill: "#1e2f47", stroke: "#5d7cad" }),
            react_1.default.createElement("rect", { x: "-12", y: "5", width: "24", height: "10", rx: "2", fill: "#06131f" }),
            react_1.default.createElement("circle", { cx: "0", cy: "26", r: "4", fill: "#38B88A" }),
            react_1.default.createElement("circle", { cx: "0", cy: "38", r: "6", fill: "#E95858" }))));
}
function Scene() {
    const { s, push, sfx } = useA();
    const [vb, setVb] = (0, react_1.useState)({ x: 0, y: 0, k: 1 });
    const [sel, setSel] = (0, react_1.useState)(null);
    const [labels, setLabels] = (0, react_1.useState)(true);
    const [showIndex, setShowIndex] = (0, react_1.useState)(() => window.matchMedia('(max-width: 640px) and (min-height: 740px) and (orientation: portrait)').matches);
    const [sceneSize, setSceneSize] = (0, react_1.useState)({ width: 800, height: 520 });
    const viewportRef = (0, react_1.useRef)(null);
    const ptrs = (0, react_1.useRef)(new Map());
    const pz = (0, react_1.useRef)(0);
    const moved = (0, react_1.useRef)(0);
    const nextTask = appdata_1.TASKS.find((t) => !s.tasks[t.id]?.pass);
    const iso = (gx, gy) => ({ x: 400 + (gx - gy) * 150, y: 120 + (gx + gy) * 82 });
    const W = navigation_1.FACTORY_CAMERA.worldWidth, H = navigation_1.FACTORY_CAMERA.worldHeight;
    (0, react_1.useEffect)(() => {
        const el = viewportRef.current;
        if (!el)
            return;
        const update = () => { const r = el.getBoundingClientRect(); setSceneSize({ width: Math.max(1, r.width), height: Math.max(1, r.height) }); };
        update();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(update);
            ro.observe(el);
            return () => ro.disconnect();
        }
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);
    const rolesAt = { B1: 'R2', B2: 'R4', B3: 'R1', C1: 'R3', C3: 'R6', A3: 'R5' };
    const down = (e) => { ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved.current = 0; if (ptrs.current.size === 2) {
        const [a, b] = [...ptrs.current.values()];
        pz.current = Math.hypot(a.x - b.x, a.y - b.y);
    } };
    const move = (e) => {
        const p0 = ptrs.current.get(e.pointerId);
        if (!p0)
            return;
        const el = e.currentTarget;
        const sc = 1 / Math.max(0.00001, Math.abs(el.getScreenCTM()?.a || (sceneSize.width / (W / vb.k))));
        if (ptrs.current.size === 1) {
            const dx = e.clientX - p0.x, dy = e.clientY - p0.y;
            moved.current += Math.abs(dx) + Math.abs(dy);
            if (moved.current > 8) {
                try {
                    el.setPointerCapture(e.pointerId);
                }
                catch { }
            }
            setVb((v) => ({ ...v, x: clamp(v.x - dx * sc, -300, 300), y: clamp(v.y - dy * sc, -200, 200) }));
        }
        ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (ptrs.current.size === 2) {
            const [a, b] = [...ptrs.current.values()];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (pz.current)
                setVb((v) => ({ ...v, k: clamp(v.k * (d / pz.current), 0.8, 3) }));
            pz.current = d;
            moved.current = 99;
        }
    };
    const up = (e) => { ptrs.current.delete(e.pointerId); if (ptrs.current.size < 2)
        pz.current = 0; };
    const tap = (kind, id) => { if (moved.current > 8)
        return; setSel({ kind, id }); sfx('click'); };
    const zoomTo = (id) => { const c = appdata_1.CELLS.find((x) => x.id === id); const p = iso(c.x, c.y); setVb({ x: p.x - navigation_1.FACTORY_CAMERA.centerX, y: p.y - navigation_1.FACTORY_CAMERA.centerY, k: 2 }); };
    const view = (0, navigation_1.factoryViewBox)(sceneSize.width, sceneSize.height, vb.k, vb.x, vb.y);
    const vw = view.width, vh = view.height, vx = view.x, vy = view.y;
    (0, core_1.useBack)(() => { if (showIndex) {
        setShowIndex(false);
        return true;
    } return false; }, showIndex);
    const selCell = sel?.kind === 'cell' ? appdata_1.CELLS.find((c) => c.id === sel.id) : null;
    const selM = sel?.kind === 'machine' ? M(sel.id) : null;
    const selR = sel?.kind === 'role' ? appdata_1.ROLES.find((r) => r.id === sel.id) : null;
    return (react_1.default.createElement("div", { className: `sx-scene ${showIndex ? 'with-index' : ''}` },
        react_1.default.createElement("div", { className: "sx-scene-viewport", ref: viewportRef },
            react_1.default.createElement("div", { className: "sx-top glass" },
                react_1.default.createElement("div", { className: "sx-top-t" },
                    react_1.default.createElement("b", null, "\u5DE5\u4F5C\u5834\u666F\u30FB\u667A\u6167\u5DE5\u5EE0\u7E3D\u89BD"),
                    react_1.default.createElement("small", null,
                        nextTask ? `目前任務：${nextTask.id} ${nextTask.n}` : '所有任務已完成',
                        "\u30FB",
                        vb.k > 1.5 ? '工作站近景' : '總覽')),
                nextTask && react_1.default.createElement(Btn, { sm: true, kind: "pri", onClick: () => push({ t: 'task', id: nextTask.id }) }, "\u4EFB\u52D9")),
            react_1.default.createElement("svg", { viewBox: `${vx} ${vy} ${vw} ${vh}`, preserveAspectRatio: "xMidYMid meet", "aria-label": "\u4E5D\u5BAE\u683C\u5DE5\u5EE0\u4E92\u52D5\u5834\u666F", role: "img", className: `sx-iso ${s.settings.lowGfx ? 'low' : ''}`, onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up, onWheel: (e) => setVb((v) => ({ ...v, k: clamp(v.k * (e.deltaY > 0 ? 0.9 : 1.1), 0.8, 3) })) },
                react_1.default.createElement("defs", null,
                    react_1.default.createElement("linearGradient", { id: "tp", x1: "0", y1: "0", x2: "1", y2: "1" },
                        react_1.default.createElement("stop", { offset: "0", stopColor: "#24406c" }),
                        react_1.default.createElement("stop", { offset: "1", stopColor: "#152a4c" })),
                    react_1.default.createElement("linearGradient", { id: "col", x1: "0", y1: "0", x2: "1", y2: "0" },
                        react_1.default.createElement("stop", { offset: "0", stopColor: "#3a4658" }),
                        react_1.default.createElement("stop", { offset: ".5", stopColor: "#8a96a5" }),
                        react_1.default.createElement("stop", { offset: "1", stopColor: "#2c3644" })),
                    react_1.default.createElement("radialGradient", { id: "lamp" },
                        react_1.default.createElement("stop", { offset: "0", stopColor: "#f0f4f8", stopOpacity: ".35" }),
                        react_1.default.createElement("stop", { offset: "1", stopColor: "#f0f4f8", stopOpacity: "0" }))),
                react_1.default.createElement("rect", { x: "-400", y: "-300", width: "1600", height: "1200", fill: "#0b1422" }),
                (() => { const a = iso(-0.6, -0.6), b = iso(2.6, -0.6), c = iso(2.6, 2.6), d = iso(-0.6, 2.6); return react_1.default.createElement("polygon", { points: `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`, fill: "#121e30", stroke: "#2a4470" }); })(),
                [0.5, 1.5].map((g) => { const a = iso(g, -0.6), b = iso(g, 2.6), c = iso(-0.6, g), d = iso(2.6, g); return react_1.default.createElement("g", { key: g },
                    react_1.default.createElement("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#F59E38", strokeWidth: "3", strokeDasharray: "14 10", opacity: ".7" }),
                    react_1.default.createElement("line", { x1: c.x, y1: c.y, x2: d.x, y2: d.y, stroke: "#F59E38", strokeWidth: "3", strokeDasharray: "14 10", opacity: ".7" })); }),
                appdata_1.CELLS.map((c) => {
                    const p = iso(c.x, c.y);
                    const on = sel?.kind === 'cell' && sel.id === c.id;
                    return react_1.default.createElement("g", { key: c.id, onClick: () => tap('cell', c.id), className: "sx-cell" },
                        react_1.default.createElement("polygon", { points: `${p.x},${p.y - 58} ${p.x + 108},${p.y} ${p.x},${p.y + 58} ${p.x - 108},${p.y}`, fill: "url(#tp)", stroke: on ? '#36C5E8' : '#35558a', strokeWidth: on ? 3 : 1, opacity: ".9" }),
                        labels && react_1.default.createElement("g", { className: "sx-grid-marker" },
                            react_1.default.createElement("rect", { x: p.x - 20, y: p.y + 35, width: "40", height: "23", rx: "8", fill: "#081b30", stroke: "#5d7cad" }),
                            react_1.default.createElement("text", { x: p.x, y: p.y + 51, textAnchor: "middle", className: "sx-cl" }, c.id)));
                }),
                [[-0.6, -0.6], [2.6, -0.6], [-0.6, 2.6], [1, -0.6], [-0.6, 1]].map(([x, y], i) => { const p = iso(x, y); return react_1.default.createElement("g", { key: i },
                    react_1.default.createElement("rect", { x: p.x - 7, y: p.y - 150, width: "14", height: "150", fill: "url(#col)" }),
                    react_1.default.createElement("rect", { x: p.x - 11, y: p.y - 156, width: "22", height: "8", fill: "#56606e" })); }),
                !s.settings.lowGfx && [[0, 0], [1, 1], [2, 2], [2, 0], [0, 2]].map(([x, y], i) => { const p = iso(x, y); return react_1.default.createElement("ellipse", { key: i, cx: p.x, cy: p.y, rx: "120", ry: "60", fill: "url(#lamp)", className: "sx-flicker", style: { animationDelay: `${i * 0.7}s` } }); }),
                (() => { const p = iso(1, 0); return react_1.default.createElement("g", null,
                    react_1.default.createElement("rect", { x: p.x - 70, y: p.y - 120, width: "140", height: "56", rx: "5", fill: "#06131f", stroke: "#36C5E8" }),
                    react_1.default.createElement("text", { x: p.x, y: p.y - 98, textAnchor: "middle", fontSize: "13", fill: "#36C5E8" }, "\u751F\u7522\u9032\u5EA6\u770B\u677F"),
                    react_1.default.createElement("rect", { x: p.x - 58, y: p.y - 88, width: "116", height: "10", fill: "#122436" }),
                    react_1.default.createElement("rect", { x: p.x - 58, y: p.y - 88, width: "84", height: "10", fill: "#38B88A" }),
                    react_1.default.createElement("text", { x: p.x, y: p.y - 70, textAnchor: "middle", fontSize: "10", fill: "#AEB8C4" }, "OEE 76%\u30FBOTIF 92%\uFF08\u6A21\u64EC\uFF09")); })(),
                (() => { const p = iso(0, 2); return react_1.default.createElement("g", null,
                    [0, 1, 2].map((i) => react_1.default.createElement("rect", { key: i, x: p.x - 60 + i * 42, y: p.y - 60, width: "34", height: "44", fill: "#3a4656", stroke: "#5d6c80" })),
                    react_1.default.createElement("text", { x: p.x, y: p.y - 66, textAnchor: "middle", fontSize: "10", fill: "#AEB8C4" }, "\u6A21\u5177\u8CA8\u67B6")); })(),
                (() => { const p = iso(0, 0); return react_1.default.createElement("g", null,
                    react_1.default.createElement("ellipse", { cx: p.x - 20, cy: p.y - 18, rx: "24", ry: "14", fill: "none", stroke: "#7d6a55", strokeWidth: "8" }),
                    react_1.default.createElement("ellipse", { cx: p.x + 26, cy: p.y - 8, rx: "24", ry: "14", fill: "none", stroke: "#6b5a48", strokeWidth: "8" }),
                    react_1.default.createElement("text", { x: p.x, y: p.y + 22, textAnchor: "middle", fontSize: "10", fill: "#c8b296" }, "\u76E4\u5143")); })(),
                (() => { const p = iso(2.6, 1); return react_1.default.createElement("g", null,
                    react_1.default.createElement("rect", { x: p.x - 16, y: p.y - 70, width: "32", height: "60", fill: "#202831", stroke: "#5d6c80" }),
                    react_1.default.createElement("circle", { cx: p.x, cy: p.y - 54, r: "4", fill: "#38B88A" }),
                    react_1.default.createElement("text", { x: p.x, y: p.y - 2, textAnchor: "middle", fontSize: "9", fill: "#AEB8C4" }, "\u914D\u96FB\u6AC3")); })(),
                appdata_1.CELLS.flatMap((c) => c.machines.map((mid, k) => {
                    const p = iso(c.x, c.y);
                    const ox = c.machines.length > 1 ? (k ? 40 : -40) : 0;
                    const on = sel?.kind === 'machine' && sel.id === mid;
                    return react_1.default.createElement("g", { key: mid, className: "sx-mach", onClick: (e) => { e.stopPropagation(); tap('machine', mid); }, transform: `translate(${p.x + ox} ${p.y - 6})` },
                        react_1.default.createElement("polygon", { points: "-34,-10 0,-28 34,-10 0,8", fill: "#3a5a8a", stroke: on ? '#F59E38' : '#5d7cad', strokeWidth: on ? 3 : 1 }),
                        react_1.default.createElement("polygon", { points: "-34,-10 0,8 0,-30 -34,-48", fill: "#22344f" }),
                        react_1.default.createElement("polygon", { points: "34,-10 0,8 0,-30 34,-48", fill: "#2c4466" }),
                        react_1.default.createElement("polygon", { points: "-34,-48 0,-66 34,-48 0,-30", fill: "#4a6c9e" }),
                        react_1.default.createElement("rect", { x: "6", y: "-44", width: "14", height: "10", fill: "#06131f", stroke: "#36C5E8" }),
                        react_1.default.createElement("circle", { cx: "-14", cy: "-38", r: "4", fill: "#E95858" }),
                        labels && react_1.default.createElement("g", { className: "sx-machine-marker" },
                            react_1.default.createElement("rect", { x: "-24", y: "9", width: "48", height: "22", rx: "7", fill: "#182335", stroke: "#ba8d54" }),
                            react_1.default.createElement("text", { y: "25", textAnchor: "middle", className: "sx-ml" }, mid)));
                })),
                Object.entries(rolesAt).map(([cid, rid]) => {
                    const c = appdata_1.CELLS.find((x) => x.id === cid);
                    const p = iso(c.x, c.y);
                    const r = appdata_1.ROLES.find((x) => x.id === rid);
                    return react_1.default.createElement("g", { key: rid, transform: `translate(${p.x + 60} ${p.y + 4})`, onClick: (e) => { e.stopPropagation(); tap('role', rid); }, className: "sx-fig" },
                        react_1.default.createElement("ellipse", { cx: "0", cy: "2", rx: "10", ry: "4", fill: "#000", opacity: ".4" }),
                        react_1.default.createElement("rect", { x: "-6", y: "-26", width: "12", height: "26", rx: "4", fill: "#24477a" }),
                        react_1.default.createElement("rect", { x: "-6", y: "-16", width: "12", height: "2.5", fill: "#F59E38" }),
                        react_1.default.createElement("circle", { cy: "-32", r: "7", fill: "#eac09a" }),
                        react_1.default.createElement("path", { d: "M-8 -34 Q0 -46 8 -34Z", fill: "#f0f4f8" }),
                        react_1.default.createElement("circle", { cx: "10", cy: "-36", r: "5", fill: r.color, className: "sx-ping" }));
                }),
                react_1.default.createElement("polyline", { points: [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0], [2, 2], [1, 2]].map(([x, y]) => { const p = iso(x, y); return `${p.x},${p.y}`; }).join(' '), fill: "none", stroke: "#36C5E8", strokeWidth: "3", strokeDasharray: "10 12", className: "sx-flow", opacity: ".8" }))),
        react_1.default.createElement("div", { className: "sx-scene-bar" },
            react_1.default.createElement(Btn, { sm: true, onClick: () => setVb((v) => ({ ...v, k: clamp(v.k * 1.25, 0.8, 3) })) }, "\uFF0B"),
            react_1.default.createElement(Btn, { sm: true, onClick: () => setVb((v) => ({ ...v, k: clamp(v.k / 1.25, 0.8, 3) })) }, "\uFF0D"),
            react_1.default.createElement(Btn, { sm: true, onClick: () => setVb({ x: 0, y: 0, k: 1 }) }, "\u2302 \u7E3D\u89BD"),
            react_1.default.createElement(Btn, { sm: true, onClick: () => setShowIndex((v) => !v) }, showIndex ? '收起工作站' : '九宮格索引'),
            react_1.default.createElement(Btn, { sm: true, onClick: () => setLabels(!labels) },
                labels ? '隱藏' : '顯示',
                "\u6A19\u7C64"),
            react_1.default.createElement("span", { className: "sx-hint" }, "\u62D6\u66F3\u79FB\u52D5\u756B\u9762\u30FB\u96D9\u6307\u7E2E\u653E\u30FB\u9EDE\u64CA\u6A5F\u53F0\uFF0F\u4EBA\u7269\uFF1B\u5B8C\u6574\u540D\u7A31\u8ACB\u958B\u555F\u7D22\u5F15")),
        showIndex && react_1.default.createElement("div", { className: "sx-scene-index", "aria-label": "\u4E5D\u5BAE\u683C\u5DE5\u4F5C\u7AD9\u7D22\u5F15" },
            react_1.default.createElement("div", { className: "sx-index-head" },
                react_1.default.createElement("strong", null, "\u9078\u64C7\u5DE5\u4F5C\u7AD9"),
                react_1.default.createElement("button", { type: "button", onClick: () => setShowIndex(false), "aria-label": "\u95DC\u9589\u5DE5\u4F5C\u7AD9\u7D22\u5F15" }, "\u2715")),
            react_1.default.createElement("div", { className: "sx-index-grid" }, appdata_1.CELLS.map((c) => react_1.default.createElement("button", { key: c.id, type: "button", onClick: () => { setShowIndex(false); setSel({ kind: 'cell', id: c.id }); } },
                react_1.default.createElement("b", null, c.id),
                react_1.default.createElement("span", null, c.n))))),
        sel && react_1.default.createElement(Sheet, { onClose: () => setSel(null), title: selM ? `${selM.id}｜${selM.n}` : selR ? selR.n : `${selCell.id}｜${selCell.n}` },
            selM && react_1.default.createElement("div", null,
                react_1.default.createElement("p", null, selM.desc),
                react_1.default.createElement("div", { className: "sx-row wrap" },
                    react_1.default.createElement(Btn, { kind: "pri", onClick: () => push({ t: 'machine', id: selM.id }) }, "\u9032\u5165\u6A5F\u53F0\u6A21\u64EC"),
                    react_1.default.createElement(Btn, { onClick: () => push({ t: 'unit', id: selM.unit }) }, "\u6559\u5B78\u55AE\u5143"),
                    selM.task && react_1.default.createElement(Btn, { onClick: () => push({ t: 'task', id: selM.task }) },
                        "\u4EFB\u52D9 ",
                        selM.task),
                    react_1.default.createElement(Fav, { id: selM.id })),
                react_1.default.createElement("small", { className: "muted" },
                    "\u8F38\u5165\uFF1A",
                    P(selM.input).n,
                    " \u2192 \u8F38\u51FA\uFF1A",
                    P(selM.output).n)),
            selR && react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(people_1.Person, { role: selR, size: 130, act: "point" }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("p", null, selR.duty),
                    react_1.default.createElement("div", { className: "sx-row wrap" },
                        react_1.default.createElement(Btn, { kind: "pri", onClick: () => push({ t: 'role', id: selR.id }) }, "\u4EBA\u7269\u8CC7\u6599"),
                        selR.tasks.map((t) => react_1.default.createElement(Btn, { key: t, onClick: () => push({ t: 'task', id: t }) },
                            "\u4EFB\u52D9 ",
                            t))))),
            selCell && react_1.default.createElement("div", null,
                react_1.default.createElement("p", null, selCell.machines.length ? `設備：${selCell.machines.map((m) => M(m).n).join('、')}` : '支援區域'),
                react_1.default.createElement("div", { className: "sx-row wrap" },
                    react_1.default.createElement(Btn, { onClick: () => { zoomTo(selCell.id); setSel(null); } }, "\uD83D\uDD0D \u5DE5\u4F5C\u7AD9\u8FD1\u666F"),
                    selCell.machines.map((m) => react_1.default.createElement(Btn, { key: m, kind: "pri", onClick: () => push({ t: 'machine', id: m }) },
                        m,
                        " \u6A5F\u53F0\u7279\u5BEB")),
                    selCell.items.filter((i) => i.startsWith('P')).map((i) => react_1.default.createElement(Btn, { key: i, onClick: () => push({ t: 'part', id: i }) }, "\u5DE5\u4EF6\u6AA2\u8996")),
                    selCell.items.filter((i) => i.startsWith('T')).map((i) => react_1.default.createElement(Btn, { key: i, onClick: () => push({ t: 'tool', id: i }) }, appdata_1.TOOLS.find((t) => t.id === i).n)))))));
}
function Codex() {
    const { push } = useA();
    const [tab, setTab] = (0, react_1.useState)('m');
    const [q, setQ] = (0, react_1.useState)('');
    const terms = data_1.CODEX.filter((c) => `${c.zh}${c.en}${c.abbr || ''}${c.def}`.toLowerCase().includes(q.toLowerCase()));
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement("h2", null, "\u5716\u9451"),
        react_1.default.createElement("div", { className: "sx-seg wide" }, [['m', '設備'], ['t', '工具'], ['mat', '材料'], ['p', '工件'], ['k', '知識'], ['r', '人物']].map(([k, n]) => react_1.default.createElement("button", { key: k, className: tab === k ? 'on' : '', onClick: () => setTab(k) }, n))),
        tab === 'm' && react_1.default.createElement("div", { className: "sx-list" }, appdata_1.MACHINES.map((m) => react_1.default.createElement("button", { key: m.id, className: "sx-item", onClick: () => push({ t: 'machine', id: m.id }) },
            react_1.default.createElement("span", { className: "sx-ic" }, m.id),
            react_1.default.createElement("span", null,
                react_1.default.createElement("b", null, m.n),
                react_1.default.createElement("small", null,
                    m.en,
                    "\u30FB",
                    m.process)),
            react_1.default.createElement(Fav, { id: m.id })))),
        tab === 't' && react_1.default.createElement("div", { className: "sx-grid2" }, appdata_1.TOOLS.map((t) => react_1.default.createElement("button", { key: t.id, className: "sx-tile", onClick: () => push({ t: 'tool', id: t.id }) },
            react_1.default.createElement(machines_1.ToolIcon, { id: t.id, size: 56 }),
            react_1.default.createElement("b", null, t.n),
            react_1.default.createElement("small", null, t.en)))),
        tab === 'mat' && react_1.default.createElement("div", { className: "sx-list" }, appdata_1.MATERIALS.map((m) => react_1.default.createElement("button", { key: m.id, className: "sx-item", onClick: () => push({ t: 'material', id: m.id }) },
            react_1.default.createElement("span", { className: "sx-ic" }, "MAT"),
            react_1.default.createElement("span", null,
                react_1.default.createElement("b", null, m.n),
                react_1.default.createElement("small", null, m.en))))),
        tab === 'p' && react_1.default.createElement("div", null,
            appdata_1.ROUTES.map((r) => react_1.default.createElement(Sec, { key: r.id, title: `製程途程：${r.n}` },
                react_1.default.createElement("div", { className: "sx-route" }, r.steps.map((id, i) => react_1.default.createElement(react_1.default.Fragment, { key: id },
                    react_1.default.createElement("button", { onClick: () => push({ t: 'part', id }) }, P(id).n),
                    i < r.steps.length - 1 && react_1.default.createElement("i", null, "\u2192")))))),
            react_1.default.createElement("small", { className: "muted" }, "\u4E0D\u540C\u7522\u54C1\u8D70\u4E0D\u540C\u9014\u7A0B\uFF1B\u7403\u5316\u8207\u4F38\u7DDA\u7684\u9806\u5E8F\u4F9D\u92FC\u7A2E\u8207\u8DEF\u5F91\u800C\u7570\u3002")),
        tab === 'k' && react_1.default.createElement("div", null,
            react_1.default.createElement("input", { className: "sx-search", placeholder: "\u641C\u5C0B\u8853\u8A9E\uFF1AOEE\u3001\u6413\u7259\u3001RAG\u2026", value: q, onChange: (e) => setQ(e.target.value) }),
            react_1.default.createElement(Sec, { title: "\u5C08\u5229\u77E5\u8B58\u5361" }, data_1.PATENTS.map((p) => react_1.default.createElement("button", { key: p.id, className: "sx-item", onClick: () => push({ t: 'patent', id: p.id }) },
                react_1.default.createElement("span", { className: "sx-ic" }, "\u5C08\u5229"),
                react_1.default.createElement("span", null,
                    react_1.default.createElement("b", null, p.no),
                    react_1.default.createElement("small", null, p.title))))),
            react_1.default.createElement("div", { className: "sx-terms" }, terms.map((t) => react_1.default.createElement("details", { key: t.id, className: "sx-term" },
                react_1.default.createElement("summary", null,
                    react_1.default.createElement("b", null, t.zh),
                    react_1.default.createElement("small", null,
                        "\uFF08",
                        t.en,
                        t.abbr ? `, ${t.abbr}` : '',
                        "\uFF09")),
                react_1.default.createElement("p", null, t.def))))),
        tab === 'r' && react_1.default.createElement("div", { className: "sx-grid2" }, appdata_1.ROLES.map((r) => react_1.default.createElement("button", { key: r.id, className: "sx-tile", onClick: () => push({ t: 'role', id: r.id }) },
            react_1.default.createElement(people_1.Person, { role: r, size: 120 }),
            react_1.default.createElement("b", null, r.n),
            react_1.default.createElement("small", null, r.en))))));
}
function MachinePage({ id }) {
    const m = M(id);
    const { push, set } = useA();
    (0, react_1.useEffect)(() => touchRecent(set, id, 'machine'), [id]);
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: `${m.id}｜${m.n}`, sub: `${m.en}・${m.type}`, right: react_1.default.createElement(Fav, { id: m.id }) }),
        react_1.default.createElement(MachineSim, { m: m }),
        react_1.default.createElement(Sec, { title: "\u8A2D\u5099\u8CC7\u6599" },
            react_1.default.createElement("p", null, m.desc),
            react_1.default.createElement("div", { className: "sx-kv" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u6240\u5C6C\u88FD\u7A0B"),
                    react_1.default.createElement("b", null, m.process)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5834\u666F\u4F4D\u7F6E"),
                    react_1.default.createElement("b", null, m.cell)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u8F38\u5165\u5DE5\u4EF6"),
                    react_1.default.createElement("b", null,
                        react_1.default.createElement("a", { onClick: () => push({ t: 'part', id: m.input }) }, P(m.input).n))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u8F38\u51FA\u5DE5\u4EF6"),
                    react_1.default.createElement("b", null,
                        react_1.default.createElement("a", { onClick: () => push({ t: 'part', id: m.output }) }, P(m.output).n))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u54C1\u8CEA\u7D50\u679C"),
                    react_1.default.createElement("b", null, m.quality.join('、')))),
            react_1.default.createElement("h4", null, "\u4E3B\u8981\u90E8\u4EF6"),
            react_1.default.createElement("ol", { className: "sx-ol" }, m.parts.map((p) => react_1.default.createElement("li", { key: p.id },
                react_1.default.createElement("b", null, p.n),
                "\uFF1A",
                p.d))),
            react_1.default.createElement("h4", null, "\u5B89\u5168\u6CE8\u610F\u4E8B\u9805"),
            react_1.default.createElement("ul", { className: "sx-ul warn" }, m.safety.map((x) => react_1.default.createElement("li", { key: x }, x))),
            react_1.default.createElement("div", { className: "sx-row wrap" },
                react_1.default.createElement(Btn, { onClick: () => push({ t: 'unit', id: m.unit }) }, "\uD83D\uDCD8 \u6559\u5B78\u55AE\u5143"),
                m.task && react_1.default.createElement(Btn, { kind: "pri", onClick: () => push({ t: 'task', id: m.task }) },
                    "\uD83C\uDFAF \u4EFB\u52D9 ",
                    m.task)))));
}
function PartPage({ id }) {
    const p = P(id);
    const { push, set } = useA();
    (0, react_1.useEffect)(() => touchRecent(set, id, 'part'), [id]);
    const route = appdata_1.ROUTES.find((r) => r.steps.includes(id)) || appdata_1.ROUTES[0];
    const idx = route.steps.indexOf(id);
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: p.n, sub: `${p.code}・${p.stage}`, right: react_1.default.createElement(Fav, { id: p.id }) }),
        react_1.default.createElement(PartViewer, { part: p }),
        react_1.default.createElement(Sec, { title: `工序階段對照：${route.n}` },
            react_1.default.createElement("input", { type: "range", min: 0, max: route.steps.length - 1, value: idx, onChange: (e) => push({ t: 'part', id: route.steps[+e.target.value] }), "aria-label": "\u5DE5\u5E8F\u968E\u6BB5", className: "sx-stage" }),
            react_1.default.createElement("div", { className: "sx-route" }, route.steps.map((s, i) => react_1.default.createElement(react_1.default.Fragment, { key: s },
                react_1.default.createElement("button", { className: s === id ? 'on' : '', onClick: () => push({ t: 'part', id: s }) }, P(s).n),
                i < route.steps.length - 1 && react_1.default.createElement("i", null, "\u2192"))))),
        react_1.default.createElement(Sec, { title: "\u5DE5\u4EF6\u8CC7\u6599" },
            react_1.default.createElement("div", { className: "sx-kv" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u539F\u6750\u6599\uFF0F\u72C0\u614B"),
                    react_1.default.createElement("b", null, p.mat)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u7D50\u69CB\u8207\u5C3A\u5BF8\u793A\u610F"),
                    react_1.default.createElement("b", null, p.dims)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u52A0\u5DE5\u968E\u6BB5"),
                    react_1.default.createElement("b", null, p.stage)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u9069\u7528\u8A2D\u5099"),
                    react_1.default.createElement("b", null, p.machine)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u54C1\u8CEA\u7279\u6027"),
                    react_1.default.createElement("b", null, p.quality.join('、'))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5E38\u898B\u7F3A\u9677"),
                    react_1.default.createElement("b", null, p.defects.join('、'))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u6210\u54C1\u7528\u9014"),
                    react_1.default.createElement("b", null, p.use))),
            react_1.default.createElement("small", { className: "muted" }, "\u5C3A\u5BF8\u70BA\u6559\u5B78\u793A\u610F\uFF0C\u975E\u5BE6\u969B\u7522\u54C1\u898F\u683C\u3002"))));
}
function ToolPage({ id }) {
    const t = appdata_1.TOOLS.find((x) => x.id === id);
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: t.n, sub: t.en, right: react_1.default.createElement(Fav, { id: t.id }) }),
        react_1.default.createElement(Sec, null,
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(machines_1.ToolIcon, { id: t.id, size: 110 }),
                react_1.default.createElement("div", { className: "sx-kv one" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u6750\u8CEA"),
                        react_1.default.createElement("b", null, t.mat)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u5C0D\u61C9\u8077\u696D"),
                        react_1.default.createElement("b", null, t.role)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u9069\u7528\u5DE5\u4EF6"),
                        react_1.default.createElement("b", null, t.parts)))),
            react_1.default.createElement("p", null, t.use)),
        t.demo && react_1.default.createElement(Sec, { title: "\u64CD\u4F5C\u793A\u7BC4\uFF08\u6A21\u64EC\uFF09" },
            react_1.default.createElement(ToolDemo, { t: t.demo }))));
}
function MaterialPage({ id }) {
    const m = appdata_1.MATERIALS.find((x) => x.id === id);
    return react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: m.n, sub: m.en }),
        react_1.default.createElement(Sec, null,
            react_1.default.createElement("p", null, m.d),
            react_1.default.createElement("div", { className: "sx-kv" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5E38\u898B\u7528\u9014"),
                    react_1.default.createElement("b", null, m.use)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5099\u8A3B"),
                    react_1.default.createElement("b", null, m.note))),
            react_1.default.createElement("small", { className: "muted" }, "\u92FC\u7A2E\u540D\u7A31\u70BA\u6559\u5B78\u793A\u4F8B\uFF0C\u975E\u7279\u5B9A\u516C\u53F8\u5BE6\u969B\u7528\u6599\u3002")));
}
function PatentPage({ id }) {
    const p = data_1.PATENTS.find((x) => x.id === id);
    return react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: p.no, sub: p.title }),
        react_1.default.createElement(Sec, { title: "\u2705 \u5DF2\u78BA\u8A8D\u7684\u516C\u958B\u5C08\u5229\u5167\u5BB9" },
            react_1.default.createElement("ul", { className: "sx-ul" }, p.confirmed.map((x) => react_1.default.createElement("li", { key: x }, x)))),
        react_1.default.createElement(Sec, { title: "\uD83D\uDCAD \u904A\u6232\u6559\u5B78\u7528\u5DE5\u7A0B\u61C9\u7528\u63A8\u8AD6" },
            react_1.default.createElement("ul", { className: "sx-ul" }, p.inference.map((x) => react_1.default.createElement("li", { key: x }, x)))),
        react_1.default.createElement(Sec, null,
            react_1.default.createElement("div", { className: "sx-kv" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u76F8\u95DC\u88FD\u7A0B"),
                    react_1.default.createElement("b", null, p.process)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5DE5\u7A0B\u554F\u984C"),
                    react_1.default.createElement("b", null, p.problem)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u53EF\u5EF6\u4F38 AI \u984C\u76EE"),
                    react_1.default.createElement("b", null, p.ai))),
            react_1.default.createElement("p", { className: "small" },
                "\u516C\u958B\u4F86\u6E90\uFF1A",
                react_1.default.createElement("a", { href: p.url, target: "_blank", rel: "noreferrer" }, p.url),
                "\uFF08\u9700\u7DB2\u8DEF\uFF09")));
}
function RolePage({ id }) {
    const r = appdata_1.ROLES.find((x) => x.id === id);
    const { push, s, set, toast } = useA();
    const [ang, setAng] = (0, react_1.useState)('front');
    const [act, setAct] = (0, react_1.useState)('idle');
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: r.n, sub: r.en }),
        react_1.default.createElement(Sec, null,
            react_1.default.createElement("div", { className: "sx-role" },
                react_1.default.createElement("div", { className: "sx-role-art" },
                    react_1.default.createElement(people_1.Person, { role: r, angle: ang, act: act, size: 240 })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "sx-seg" }, [['front', '正面'], ['tq', '3/4'], ['side', '側面'], ['back', '背面']].map(([k, n]) => react_1.default.createElement("button", { key: k, className: ang === k ? 'on' : '', onClick: () => setAng(k) }, n))),
                    react_1.default.createElement("div", { className: "sx-seg" }, [['idle', '待機'], ['point', '指向設備'], ['check', '檢查工件'], ['done', '完成任務'], ['alert', '異常反應']].map(([k, n]) => react_1.default.createElement("button", { key: k, className: act === k ? 'on' : '', onClick: () => setAct(k) }, n))),
                    react_1.default.createElement("p", null, r.duty),
                    react_1.default.createElement("div", { className: "sx-kv one" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u500B\u4EBA\u9632\u8B77\u5177"),
                            react_1.default.createElement("b", null, r.ppe)),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u4EE3\u8868\u6027\u9053\u5177"),
                            react_1.default.createElement("b", null, r.tools.map((t) => appdata_1.TOOLS.find((x) => x.id === t).n).join('、')))),
                    react_1.default.createElement("div", { className: "sx-row wrap" },
                        r.tasks.map((t) => react_1.default.createElement(Btn, { key: t, kind: "pri", onClick: () => push({ t: 'task', id: t }) },
                            "\u4EFB\u52D9 ",
                            t)),
                        r.tools.map((t) => react_1.default.createElement(Btn, { key: t, sm: true, onClick: () => push({ t: 'tool', id: t }) }, appdata_1.TOOLS.find((x) => x.id === t).n)),
                        react_1.default.createElement(Btn, { sm: true, disabled: s.role === r.id, onClick: () => { set((x) => ({ ...x, role: r.id })); toast(`代表人物已設為 ${r.n}`); } }, "\u8A2D\u70BA\u4EE3\u8868\u4EBA\u7269")))),
            react_1.default.createElement("small", { className: "muted" }, "\u89D2\u8272\u70BA\u539F\u5275 SVG \u4F54\u4F4D\u7F8E\u8853\uFF082.5D\uFF09\uFF0C\u5C1A\u975E\u6700\u7D42\u64EC\u771F ACG \u7ACB\u7E6A\uFF1B\u898B\u7D20\u6750\u6E05\u55AE\u3002"))));
}
function UnitPage({ id }) {
    const u = appdata_1.UNITS.find((x) => x.id === id);
    const m = M(u.machine);
    const { s, set, push, sfx, toast } = useA();
    const [ans, setAns] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => touchRecent(set, id, 'unit'), [id]);
    const correct = ans.filter((a, i) => a === u.quiz[i].a).length;
    const done = s.units[id]?.done;
    const finish = () => { set((x) => ({ ...x, units: { ...x.units, [id]: { done: true, quiz: Math.max(x.units[id]?.quiz || 0, correct), at: Date.now() } } })); sfx('success'); toast('教學單元完成，學習成果已保存'); };
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: u.n, sub: `教學模式・${m.id} ${m.n}`, right: done ? react_1.default.createElement("span", { className: "sx-badge ok" }, "\u2714 \u5DF2\u5B8C\u6210") : null }),
        react_1.default.createElement(Sec, { title: "\u2460 \u5DE5\u4F5C\u76EE\u6A19" },
            react_1.default.createElement("p", null, u.goal)),
        react_1.default.createElement(Sec, { title: "\u2461 \u4E8B\u524D\u6E96\u5099" },
            react_1.default.createElement("ul", { className: "sx-ul" }, u.prep.map((x) => react_1.default.createElement("li", { key: x }, x)))),
        react_1.default.createElement(Sec, { title: "\u2462 \u76F8\u95DC\u8A2D\u5099", right: react_1.default.createElement(Btn, { sm: true, kind: "pri", onClick: () => push({ t: 'machine', id: m.id }) }, "\u958B\u555F\u6A21\u64EC") },
            react_1.default.createElement("p", null,
                react_1.default.createElement("b", null, m.n),
                "\uFF08",
                m.en,
                "\uFF09\u2014 ",
                m.process)),
        react_1.default.createElement(Sec, { title: "\u2463 \u64CD\u4F5C\u6D41\u7A0B" },
            react_1.default.createElement("ol", { className: "sx-ol" }, u.steps.map((x) => react_1.default.createElement("li", { key: x }, x)))),
        react_1.default.createElement(Sec, { title: "\u2464 \u5DE5\u4EF6\u52A0\u5DE5\u524D\u5F8C\u8B8A\u5316" },
            react_1.default.createElement("div", { className: "sx-grid2" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("small", null,
                        "\u52A0\u5DE5\u524D\uFF1A",
                        P(u.before).n),
                    react_1.default.createElement(PartViewer, { part: P(u.before), compact: true })),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("small", null,
                        "\u52A0\u5DE5\u5F8C\uFF1A",
                        P(u.after).n),
                    react_1.default.createElement(PartViewer, { part: P(u.after), compact: true })))),
        react_1.default.createElement(Sec, { title: "\u2465 \u57FA\u672C\u539F\u7406" },
            react_1.default.createElement("p", null, u.principle)),
        react_1.default.createElement(Sec, { title: "\u2466 \u54C1\u8CEA\u6AA2\u67E5" },
            react_1.default.createElement("ul", { className: "sx-ul" }, u.check.map((x) => react_1.default.createElement("li", { key: x }, x))),
            react_1.default.createElement("h4", null, "\u5E38\u898B\u932F\u8AA4"),
            react_1.default.createElement("ul", { className: "sx-ul warn" }, u.mistakes.map((x) => react_1.default.createElement("li", { key: x }, x)))),
        react_1.default.createElement(Sec, { title: "\u2467 \u77E5\u8B58\u554F\u7B54" },
            u.quiz.map((q, i) => react_1.default.createElement("div", { key: i, className: "sx-quiz" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement("b", null,
                        "Q",
                        i + 1,
                        "."),
                    " ",
                    q.q),
                react_1.default.createElement("div", { className: "sx-opts" }, q.o.map((o, j) => react_1.default.createElement("button", { key: j, className: `sx-opt ${ans[i] === j ? (j === q.a ? 'right' : 'wrong') : ''}`, disabled: ans[i] !== undefined, onClick: () => { const a = [...ans]; a[i] = j; setAns(a); sfx(j === q.a ? 'prompt' : 'fail'); } }, o))),
                ans[i] !== undefined && react_1.default.createElement("small", null,
                    ans[i] === q.a ? '✔ ' : '✖ ',
                    q.why))),
            react_1.default.createElement("div", { className: "sx-row end" },
                react_1.default.createElement(Btn, { kind: "pri", disabled: ans.filter((x) => x !== undefined).length < u.quiz.length, onClick: finish },
                    "\u5B8C\u6210\u55AE\u5143\uFF08\u7B54\u5C0D ",
                    correct,
                    "/",
                    u.quiz.length,
                    "\uFF09")))));
}
function TaskRun({ id }) {
    const T = appdata_1.TASKS.find((x) => x.id === id);
    const m = M(T.machine);
    const role = appdata_1.ROLES.find((r) => r.id === T.role);
    const { s, set, push, sfx, toast } = useA();
    const init = {};
    m.params.forEach((x) => (init[x.id] = x.def));
    const [step, setStep] = (0, react_1.useState)(0);
    const [part, setPart] = (0, react_1.useState)(null);
    const [inspected, setInspected] = (0, react_1.useState)([]);
    const [fixed, setFixed] = (0, react_1.useState)([]);
    const [params, setParams] = (0, react_1.useState)(init);
    const [sim, setSim] = (0, react_1.useState)(null);
    const [verdict, setVerdict] = (0, react_1.useState)(null);
    const [saved, setSaved] = (0, react_1.useState)(null);
    const [runKey, setRunKey] = (0, react_1.useState)(0);
    (0, core_1.useBack)(() => {
        const prev = (0, navigation_1.previousTaskStep)(step);
        if (prev === null)
            return false;
        if (step === 4) {
            setSim(null);
            setRunKey((k) => k + 1);
        }
        if (step === 3) {
            setSim(null);
            setRunKey((k) => k + 1);
        }
        setStep(prev);
        return true;
    }, step >= 1 && step < 5);
    (0, react_1.useEffect)(() => touchRecent(set, id, 'task'), [id]);
    const steps = ['選擇工件', '檢查設備狀態', '設定模擬參數', '執行製程', '檢查成品', '完成紀錄'];
    const bad = T.checks.filter((c) => c.bad);
    const unsafe = m.params.filter((x) => params[x.id] < x.safe[0] || params[x.id] > x.safe[1]);
    const value = T.measure(params);
    const leak = T.id === 'T4' && (params.th > 0.55 || params.lux < 65);
    const inSpec = value >= T.spec.lo && value <= T.spec.hi && !leak && !(sim?.scrap);
    const finish = () => {
        const notes = [];
        const partOk = part === T.part.ok;
        if (!partOk)
            notes.push(`工件選錯：應為「${P(T.part.ok).n}」`);
        const missedBad = bad.filter((b) => !fixed.includes(b.id));
        missedBad.forEach((b) => notes.push(`未處理設備異常：${b.bad}`));
        const verdictOk = verdict === (inSpec ? 'ok' : 'ng');
        if (!verdictOk)
            notes.push(`品質判定錯誤：量測 ${value.toFixed(2)}${T.spec.unit}，規格 ${T.spec.lo}～${T.spec.hi}${leak ? '，且標準樣品有漏檢' : ''}`);
        if (!inSpec)
            notes.push('成品未達規格：回到參數步驟調整至建議範圍');
        const score = Math.round((partOk ? 15 : 0) + (missedBad.length ? 0 : 25) + (inSpec ? 35 : 5) + (verdictOk ? 20 : 0) + (sim?.notes.includes('警告時停機檢查') || sim?.notes.includes('警告時降速運轉') ? 5 : 5));
        const pass = partOk && !missedBad.length && inSpec && verdictOk;
        const rec = { at: Date.now(), part: part || '', params, value, verdict: verdict || '', score, pass, notes };
        set((x) => { const o = x.tasks[id] || { best: 0, tries: 0, pass: false, records: [] }; return { ...x, tasks: { ...x.tasks, [id]: { best: Math.max(o.best, score), tries: o.tries + 1, pass: o.pass || pass, records: [rec, ...o.records].slice(0, 10) } } }; });
        setSaved(rec);
        sfx(pass ? 'success' : 'fail');
    };
    const reset = () => { setStep(0); setPart(null); setInspected([]); setFixed([]); setParams(init); setSim(null); setVerdict(null); setSaved(null); setRunKey(runKey + 1); };
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: `${T.id}｜${T.n}`, sub: `任務挑戰・${role.n}・${m.n}` }),
        react_1.default.createElement("ol", { className: "sx-steps" }, steps.map((x, i) => react_1.default.createElement("li", { key: x, className: i < step ? 'done' : i === step ? 'cur' : '' }, x))),
        step === 0 && react_1.default.createElement(Sec, { title: "\u2460 \u9078\u64C7\u6B63\u78BA\u5DE5\u4EF6", right: react_1.default.createElement(people_1.Person, { role: role, size: 90, act: "point" }) },
            react_1.default.createElement("p", null, T.desc),
            react_1.default.createElement("div", { className: "sx-opts col" }, T.part.opts.map((o) => react_1.default.createElement("button", { key: o, className: `sx-opt ${part === o ? 'on' : ''}`, onClick: () => setPart(o) },
                react_1.default.createElement("b", null, P(o).n),
                react_1.default.createElement("small", null,
                    "\u3000",
                    P(o).stage,
                    "\u30FB",
                    P(o).dims)))),
            part && react_1.default.createElement(PartViewer, { part: P(part), compact: true }),
            react_1.default.createElement(Tip, null, "\u770B\u6E05\u695A\u9019\u53F0\u6A5F\u53F0\u7684\u300C\u8F38\u5165\u5DE5\u4EF6\u300D\u662F\u4EC0\u9EBC\uFF1B\u9078\u932F\u6599\u662F\u5E38\u898B\u7684\u91CF\u7522\u4E8B\u6545\u3002"),
            react_1.default.createElement("div", { className: "sx-row end" },
                react_1.default.createElement(Btn, { kind: "pri", disabled: !part, onClick: () => setStep(1) }, "\u4E0B\u4E00\u6B65"))),
        step === 1 && react_1.default.createElement(Sec, { title: "\u2461 \u6AA2\u67E5\u8A2D\u5099\u72C0\u614B" },
            react_1.default.createElement("p", null, "\u9010\u9805\u9EDE\u6AA2\uFF1B\u767C\u73FE\u7570\u5E38\u5FC5\u9808\u8655\u7F6E\u5F8C\u624D\u80FD\u751F\u7522\u3002"),
            T.checks.map((c) => {
                const done = inspected.includes(c.id);
                return (react_1.default.createElement("div", { key: c.id, className: "sx-chk" },
                    react_1.default.createElement("div", { className: "sx-row between" },
                        react_1.default.createElement("b", null, c.n),
                        !done ? react_1.default.createElement(Btn, { sm: true, onClick: () => { setInspected([...inspected, c.id]); sfx(c.bad ? 'warn' : 'prompt'); } }, "\u9EDE\u6AA2") : c.bad ? (fixed.includes(c.id) ? react_1.default.createElement("span", { className: "sx-badge ok" }, "\u2714 \u5DF2\u8655\u7F6E") : react_1.default.createElement("span", { className: "sx-badge bad" }, "\u26A0 \u7570\u5E38")) : react_1.default.createElement("span", { className: "sx-badge ok" }, "\u2714 \u6B63\u5E38")),
                    done && c.bad && react_1.default.createElement("div", { className: "sx-warn" },
                        c.bad,
                        !fixed.includes(c.id) && react_1.default.createElement("div", { className: "sx-row" },
                            react_1.default.createElement(Btn, { sm: true, kind: "pri", onClick: () => { setFixed([...fixed, c.id]); sfx('success'); } }, c.fix),
                            react_1.default.createElement(Btn, { sm: true, onClick: () => toast('不處置將被記錄為風險') }, "\u5148\u4E0D\u8655\u7406")))));
            }),
            react_1.default.createElement("div", { className: "sx-row end" },
                react_1.default.createElement(Btn, { onClick: () => setStep(0) }, "\u4E0A\u4E00\u6B65"),
                react_1.default.createElement(Btn, { kind: "pri", disabled: inspected.length < T.checks.length, onClick: () => setStep(2) }, "\u4E0B\u4E00\u6B65"))),
        step === 2 && react_1.default.createElement(Sec, { title: "\u2462 \u8A2D\u5B9A\u6A21\u64EC\u53C3\u6578" },
            m.params.map((x) => react_1.default.createElement(SafeSlider, { key: x.id, label: x.n, unit: x.unit, v: params[x.id], min: x.min, max: x.max, step: x.step, safe: x.safe, best: x.best, showBest: s.settings.hints, tip: x.tip, onChange: (v) => setParams({ ...params, [x.id]: v }) })),
            react_1.default.createElement(Tip, null, s.settings.hints ? '淺藍色區段是建議範圍；綠色是安全工作窗口。' : '提示已關閉。'),
            react_1.default.createElement("div", { className: "sx-row end" },
                react_1.default.createElement(Btn, { onClick: () => setStep(1) }, "\u4E0A\u4E00\u6B65"),
                react_1.default.createElement(Btn, { kind: "pri", disabled: unsafe.length > 0, onClick: () => setStep(3) }, unsafe.length ? '參數超出安全窗口' : '下一步'))),
        step === 3 && react_1.default.createElement(Sec, { title: "\u2463 \u57F7\u884C\u88FD\u7A0B" },
            react_1.default.createElement("p", null, "\u4F9D\u5E8F\uFF1A\u555F\u52D5\u524D\u6AA2\u67E5 \u2192 \u555F\u52D5 \u2192 \u7B49\u5F85\u52A0\u5DE5\u5B8C\u6210\u3002\u904E\u7A0B\u4E2D\u53EF\u80FD\u51FA\u73FE\u8B66\u544A\uFF0C\u8ACB\u6B63\u78BA\u61C9\u5C0D\u3002"),
            react_1.default.createElement(MachineSim, { key: runKey, m: m, params: params, lockParams: true, taskMode: true, onDone: (r) => setSim(r) }),
            react_1.default.createElement("div", { className: "sx-row end" },
                react_1.default.createElement(Btn, { onClick: () => { setStep(2); setSim(null); setRunKey(runKey + 1); } }, "\u56DE\u5230\u53C3\u6578"),
                react_1.default.createElement(Btn, { kind: "pri", disabled: !sim, onClick: () => setStep(4) }, "\u4E0B\u4E00\u6B65\uFF1A\u6AA2\u67E5\u6210\u54C1"))),
        step === 4 && react_1.default.createElement(Sec, { title: "\u2464 \u6AA2\u67E5\u6210\u54C1" },
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(machines_1.ToolIcon, { id: T.tool, size: 70 }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("b", null, appdata_1.TOOLS.find((t) => t.id === T.tool).n),
                    react_1.default.createElement("p", null,
                        "\u91CF\u6E2C\u9805\u76EE\uFF1A",
                        T.spec.n,
                        "\uFF0C\u898F\u683C ",
                        T.spec.lo,
                        "\uFF5E",
                        T.spec.hi,
                        T.spec.unit))),
            react_1.default.createElement("div", { className: "sx-meas" },
                react_1.default.createElement("small", null, "\u91CF\u6E2C\u503C"),
                react_1.default.createElement("b", null,
                    value.toFixed(2),
                    T.spec.unit),
                T.id === 'T4' && react_1.default.createElement("small", null,
                    "\u6A19\u6E96\u6A23\u54C1\u6F0F\u6AA2\uFF1A",
                    leak ? '1 件' : '0 件'),
                sim?.scrap && react_1.default.createElement("small", { className: "red" }, "\u5DE5\u4EF6\u66FE\u7D93\u6025\u505C\uFF0F\u6545\u969C\uFF0C\u5DF2\u9694\u96E2")),
            react_1.default.createElement("p", null, "\u4F60\u7684\u5224\u5B9A\uFF1A"),
            react_1.default.createElement("div", { className: "sx-opts" },
                react_1.default.createElement("button", { className: `sx-opt ${verdict === 'ok' ? 'on' : ''}`, onClick: () => setVerdict('ok') }, "\u2714 \u5408\u683C"),
                react_1.default.createElement("button", { className: `sx-opt ${verdict === 'ng' ? 'on' : ''}`, onClick: () => setVerdict('ng') }, "\u2716 \u4E0D\u5408\u683C")),
            react_1.default.createElement("div", { className: "sx-row end" },
                react_1.default.createElement(Btn, { kind: "pri", disabled: !verdict, onClick: () => { setStep(5); finish(); } }, "\u5B8C\u6210\u7D00\u9304"))),
        step === 5 && saved && react_1.default.createElement(Sec, { title: "\u2465 \u5B8C\u6210\u7D00\u9304" },
            react_1.default.createElement("div", { className: `sx-result ${saved.pass ? 'ok' : 'ng'}` },
                react_1.default.createElement(people_1.Person, { role: role, size: 110, act: saved.pass ? 'done' : 'alert' }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("b", { className: "sx-big" }, saved.pass ? '任務成功' : '任務未通過'),
                    react_1.default.createElement("div", null,
                        "\u5F97\u5206 ",
                        saved.score))),
            react_1.default.createElement("div", { className: "sx-card-rec" },
                react_1.default.createElement("div", { className: "sx-kv" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u5DE5\u4EF6"),
                        react_1.default.createElement("b", null, P(saved.part)?.n || '—')),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, T.spec.n),
                        react_1.default.createElement("b", null,
                            saved.value.toFixed(2),
                            T.spec.unit)),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u5224\u5B9A"),
                        react_1.default.createElement("b", null, saved.verdict === 'ok' ? '合格' : '不合格')),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u6642\u9593"),
                        react_1.default.createElement("b", null, new Date(saved.at).toLocaleString('zh-TW'))))),
            saved.notes.length > 0 && react_1.default.createElement("div", null,
                react_1.default.createElement("h4", null, "\u63D0\u793A"),
                react_1.default.createElement("ul", { className: "sx-ul warn" }, saved.notes.map((n) => react_1.default.createElement("li", { key: n }, n)))),
            react_1.default.createElement("p", { className: "small muted" }, "\u5B78\u7FD2\u6210\u679C\u5DF2\u4FDD\u5B58\u5728\u672C\u6A5F\u3002"),
            react_1.default.createElement("div", { className: "sx-row wrap end" },
                react_1.default.createElement(Btn, { onClick: reset }, "\u91CD\u65B0\u6311\u6230"),
                saved.pass && T.next && react_1.default.createElement(Btn, { kind: "pri", onClick: () => push({ t: 'task', id: T.next }) },
                    "\u4E0B\u4E00\u500B\u5DE5\u5E8F\uFF1A",
                    T.next),
                react_1.default.createElement(Btn, { onClick: () => push({ t: 'unit', id: m.unit }) }, "\u8907\u7FD2\u6559\u5B78")))));
}
function Tasks() {
    const { s, push } = useA();
    const c = (0, state_1.slotInfo)(0);
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement("h2", null, "\u4EFB\u52D9"),
        react_1.default.createElement(Sec, { title: "\uD83C\uDF93 \u8077\u6DAF\u6A21\u5F0F\uFF1A\u5F9E\u4E00\u9846\u87BA\u7D72\u5230\u4E00\u5EA7\u667A\u6167\u5DE5\u5EE0", right: react_1.default.createElement(Btn, { kind: "pri", onClick: () => push({ t: 'career' }) }, c ? '繼續' : '開始') },
            react_1.default.createElement("p", null,
                "\u539F\u4F5C\u5B8C\u6574\u904A\u6232\uFF1A13 \u7AE0\u8077\u6DAF\u300112 \u7A2E\u5C0F\u904A\u6232\u3001AI \u5DE5\u7A0B\u5E2B\u751F\u5B58\u6230\u3001CIM \u8207\u9CF3\u51F0\u8A08\u756B\u3002",
                c ? `目前：${c.name}・${data_2.CAREERS[c.pos].title}・第 ${c.week} 週` : '')),
        react_1.default.createElement(Sec, { title: "\uD83C\uDFAF \u5DE5\u7AD9\u4EFB\u52D9\u6311\u6230" }, appdata_1.TASKS.map((t) => { const r = s.tasks[t.id]; return react_1.default.createElement("button", { key: t.id, className: "sx-item", onClick: () => push({ t: 'task', id: t.id }) },
            react_1.default.createElement("span", { className: "sx-ic" }, t.id),
            react_1.default.createElement("span", null,
                react_1.default.createElement("b", null, t.n),
                react_1.default.createElement("small", null,
                    M(t.machine).n,
                    "\u30FB",
                    appdata_1.ROLES.find((x) => x.id === t.role).n)),
            r ? react_1.default.createElement("span", { className: `sx-badge ${r.pass ? 'ok' : 'bad'}` },
                r.pass ? '✔' : '✖',
                " ",
                r.best) : react_1.default.createElement("span", { className: "sx-badge" }, "\u672A\u6311\u6230")); })),
        react_1.default.createElement(Sec, { title: "\uD83D\uDCD8 \u6559\u5B78\u6A21\u5F0F" }, appdata_1.UNITS.map((u) => react_1.default.createElement("button", { key: u.id, className: "sx-item", onClick: () => push({ t: 'unit', id: u.id }) },
            react_1.default.createElement("span", { className: "sx-ic" }, u.id),
            react_1.default.createElement("span", null,
                react_1.default.createElement("b", null, u.n),
                react_1.default.createElement("small", null, M(u.machine).n)),
            s.units[u.id]?.done ? react_1.default.createElement("span", { className: "sx-badge ok" }, "\u2714") : null)))));
}
function Me() {
    const { s, set, push, toast } = useA();
    const [confirm, setConfirm] = (0, react_1.useState)(false);
    const S = s.settings;
    const role = appdata_1.ROLES.find((r) => r.id === s.role) || appdata_1.ROLES[1];
    const up = (k, v) => set((x) => ({ ...x, settings: { ...x.settings, [k]: v } }));
    const name = (id) => appdata_1.MACHINES.find((m) => m.id === id)?.n || appdata_1.PARTS.find((p) => p.id === id)?.n || appdata_1.TOOLS.find((t) => t.id === id)?.n || appdata_1.UNITS.find((u) => u.id === id)?.n || appdata_1.TASKS.find((t) => t.id === id)?.n || id;
    const go = (id) => push({ t: id[0] === 'M' ? 'machine' : id[0] === 'U' ? 'unit' : (id[0] === 'T' && id.length === 2) ? 'task' : id[0] === 'T' ? 'tool' : 'part', id });
    const recs = Object.entries(s.tasks).flatMap(([k, v]) => v.records.map((r) => ({ k, ...r }))).sort((a, b) => b.at - a.at).slice(0, 8);
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement("h2", null, "\u6211\u7684"),
        react_1.default.createElement(Sec, null,
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(people_1.Person, { role: role, size: 110 }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("b", null,
                        "\u4EE3\u8868\u4EBA\u7269\uFF1A",
                        role.n),
                    react_1.default.createElement("p", { className: "small" },
                        "\u6559\u5B78 ",
                        appdata_1.UNITS.filter((u) => s.units[u.id]?.done).length,
                        "/",
                        appdata_1.UNITS.length,
                        "\u30FB\u4EFB\u52D9 ",
                        appdata_1.TASKS.filter((t) => s.tasks[t.id]?.pass).length,
                        "/",
                        appdata_1.TASKS.length),
                    react_1.default.createElement(Btn, { sm: true, onClick: () => push({ t: 'role', id: role.id }) }, "\u66F4\u63DB")))),
        react_1.default.createElement(Sec, { title: "\u4EFB\u52D9\u6210\u679C\u7D00\u9304" }, recs.length ? recs.map((r, i) => react_1.default.createElement("div", { key: i, className: "sx-rec-row" },
            react_1.default.createElement("b", null, r.k),
            react_1.default.createElement("span", null, new Date(r.at).toLocaleString('zh-TW')),
            react_1.default.createElement("span", { className: r.pass ? 'green' : 'red' },
                r.pass ? '成功' : '未通過',
                " ",
                r.score))) : react_1.default.createElement("p", { className: "muted" }, "\u5C1A\u7121\u7D00\u9304")),
        react_1.default.createElement(Sec, { title: "\u6536\u85CF" }, s.fav.length ? s.fav.map((f) => react_1.default.createElement("button", { key: f, className: "sx-item", onClick: () => go(f) },
            react_1.default.createElement("span", { className: "sx-ic" }, f),
            react_1.default.createElement("span", null,
                react_1.default.createElement("b", null, name(f))))) : react_1.default.createElement("p", { className: "muted" }, "\u5728\u8A2D\u5099\u6216\u5DE5\u4EF6\u9801\u9EDE \u2606 \u6536\u85CF")),
        react_1.default.createElement(Sec, { title: "\u6700\u8FD1\u89C0\u770B" }, s.recent.slice(0, 6).map((r) => react_1.default.createElement("button", { key: r.id, className: "sx-item", onClick: () => go(r.id) },
            react_1.default.createElement("span", { className: "sx-ic" }, r.id),
            react_1.default.createElement("span", null,
                react_1.default.createElement("b", null, name(r.id)),
                react_1.default.createElement("small", null, new Date(r.t).toLocaleString('zh-TW')))))),
        react_1.default.createElement(Sec, { title: "\u8A2D\u5B9A" },
            react_1.default.createElement("label", { className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.mute, onChange: (e) => up('mute', e.target.checked) }),
                " \u975C\u97F3"),
            [['master', '主音量'], ['sfx', '音效音量'], ['amb', '設備環境音量']].map(([k, n]) => react_1.default.createElement("div", { key: k, className: "sx-slider" },
                react_1.default.createElement("label", null,
                    n,
                    react_1.default.createElement("b", null,
                        Math.round(S[k] * 100),
                        "%")),
                react_1.default.createElement("input", { type: "range", min: 0, max: 1, step: 0.05, value: S[k], onChange: (e) => up(k, +e.target.value), "aria-label": n }))),
            react_1.default.createElement("label", { className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.lowMotion, onChange: (e) => up('lowMotion', e.target.checked) }),
                " \u4F4E\u52D5\u614B\u6548\u679C\u6A21\u5F0F"),
            react_1.default.createElement("label", { className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.pauseAnim, onChange: (e) => up('pauseAnim', e.target.checked) }),
                " \u66AB\u505C\u6240\u6709\u8A2D\u5099\u52D5\u756B"),
            react_1.default.createElement("label", { className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.lowGfx, onChange: (e) => up('lowGfx', e.target.checked) }),
                " \u4F4E\u756B\u8CEA\u6A21\u5F0F\uFF08\u964D\u4F4E 3D \u89E3\u6790\u5EA6\u8207\u5149\u6548\uFF09"),
            react_1.default.createElement("label", { className: "sx-check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.hints, onChange: (e) => up('hints', e.target.checked) }),
                " \u65B0\u624B\u63D0\u793A"),
            react_1.default.createElement("div", { className: "sx-row" },
                "\u6587\u5B57\u5927\u5C0F\uFF1A",
                ['s', 'm', 'l'].map((t) => react_1.default.createElement("button", { key: t, className: `sx-opt sm ${S.text === t ? 'on' : ''}`, onClick: () => up('text', t) }, { s: '小', m: '中', l: '大' }[t]))),
            react_1.default.createElement(Btn, { sm: true, onClick: () => { set((x) => ({ ...x, onboarded: false })); toast('下次啟動將顯示新手引導'); } }, "\u91CD\u65B0\u986F\u793A\u65B0\u624B\u5F15\u5C0E")),
        react_1.default.createElement(Sec, { title: "\u95DC\u65BC\u8207\u6388\u6B0A", right: react_1.default.createElement(Btn, { sm: true, onClick: () => push({ t: 'about' }) }, "\u67E5\u770B") },
            react_1.default.createElement("p", { className: "small" }, "\u7248\u672C 1.0.0\uFF08Debug \u5EFA\u7F6E\u898F\u683C\uFF09\u30FB\u8CC7\u6599\u53EA\u5B58\u5728\u672C\u6A5F\u30FB\u4E0D\u9700\u5E33\u865F\u30FB\u7121\u7DB2\u8DEF\u6B0A\u9650\u4EE5\u5916\u7684\u6B0A\u9650\u3002")),
        react_1.default.createElement(Sec, { title: "\u8CC7\u6599" }, !confirm ? react_1.default.createElement(Btn, { kind: "danger", onClick: () => setConfirm(true) }, "\u6E05\u9664 App \u5B78\u7FD2\u9032\u5EA6") : react_1.default.createElement("div", { className: "sx-warn" },
            "\u78BA\u5B9A\u6E05\u9664\u6559\u5B78\u3001\u4EFB\u52D9\u3001\u6536\u85CF\u8207\u8A2D\u5B9A\uFF1F\uFF08\u8077\u6DAF\u6A21\u5F0F\u5B58\u6A94\u4E0D\u53D7\u5F71\u97FF\uFF09",
            react_1.default.createElement("div", { className: "sx-row" },
                react_1.default.createElement(Btn, { kind: "danger", onClick: () => { set(() => ({ ...(0, core_1.defaultState)(), onboarded: true })); setConfirm(false); toast('已清除'); } }, "\u78BA\u5B9A"),
                react_1.default.createElement(Btn, { onClick: () => setConfirm(false) }, "\u53D6\u6D88"))))));
}
function About() {
    return (react_1.default.createElement("div", { className: "sx-page" },
        react_1.default.createElement(TopBar, { title: "\u95DC\u65BC\u8207\u6388\u6B0A" }),
        react_1.default.createElement(Sec, { title: "SUMEEKO \u667A\u6167\u5DE5\u5EE0 1.0.0" },
            react_1.default.createElement("p", null, "\u4EE5\u4E16\u5FB7\u5DE5\u696D\u516C\u958B\u7684\u7522\u696D\u80CC\u666F\u8207\u516C\u958B\u5C08\u5229\uFF08\u5C08\u5229\u865F\u8207\u540D\u7A31\uFF09\u70BA\u6559\u5B78\u984C\u6750\u7684\u975E\u5B98\u65B9\u3001\u6559\u80B2\u7528\u9014\u4E92\u52D5 App\u3002\u4EBA\u7269\u3001\u5236\u5EA6\u3001\u6578\u64DA\u3001\u4E8B\u4EF6\u3001\u5BA2\u6236\u8207\u6240\u6709\u6A21\u64EC\u53C3\u6578\u7686\u70BA\u865B\u69CB\uFF1B\u6240\u6709\u8A2D\u5099\u64CD\u4F5C\u50C5\u70BA\u865B\u64EC\u6A21\u64EC\uFF0C\u4E0D\u9023\u63A5\u6216\u63A7\u5236\u4EFB\u4F55\u771F\u5BE6\u6A5F\u68B0\u6216\u4F01\u696D\u7CFB\u7D71\u3002")),
        react_1.default.createElement(Sec, { title: "\u96B1\u79C1" },
            react_1.default.createElement("ul", { className: "sx-ul" },
                react_1.default.createElement("li", null, "\u4E0D\u9700\u5EFA\u7ACB\u5E33\u865F\uFF0C\u4E0D\u8490\u96C6\u500B\u4EBA\u8CC7\u6599\u3002"),
                react_1.default.createElement("li", null, "\u5B78\u7FD2\u9032\u5EA6\u3001\u8A2D\u5B9A\u8207\u8077\u6DAF\u5B58\u6A94\u53EA\u4FDD\u5B58\u5728\u672C\u6A5F\uFF08WebView \u672C\u6A5F\u5132\u5B58\uFF09\u3002"),
                react_1.default.createElement("li", null, "App \u4E0D\u4F7F\u7528\u76F8\u6A5F\u3001\u9EA5\u514B\u98A8\u3001\u4F4D\u7F6E\u7B49\u6B0A\u9650\u3002\u6838\u5FC3\u5167\u5BB9\u53EF\u96E2\u7DDA\u4F7F\u7528\uFF1B\u5C08\u5229\u539F\u6587\u9023\u7D50\u9700\u7DB2\u8DEF\u4E26\u7531\u5916\u90E8\u700F\u89BD\u5668\u958B\u555F\u3002"))),
        react_1.default.createElement(Sec, { title: "\u7D20\u6750\u8207\u6388\u6B0A" },
            react_1.default.createElement("ul", { className: "sx-ul" },
                react_1.default.createElement("li", null, "\u6240\u6709\u4EBA\u7269\u3001\u6A5F\u53F0\u3001\u5DE5\u5177\u3001\u5834\u666F\u3001\u5716\u793A\u7686\u70BA\u672C\u5C08\u6848\u539F\u5275 SVG\uFF0F\u7A0B\u5E8F\u5316 WebGL \u5E7E\u4F55\u3002"),
                react_1.default.createElement("li", null, "\u97F3\u6548\u4EE5 WebAudio \u5373\u6642\u5408\u6210\uFF0C\u7121\u5916\u90E8\u97F3\u6A94\u3002"),
                react_1.default.createElement("li", null, "\u5B57\u578B\u4F7F\u7528 Android \u7CFB\u7D71\u5167\u5EFA\u4E2D\u6587\u5B57\u578B\uFF08Noto Sans CJK\uFF09\uFF0C\u4E0D\u96A8 App \u6563\u5E03\u3002"),
                react_1.default.createElement("li", null, "React\uFF08MIT License, Meta Platforms, Inc.\uFF09\u3001AndroidX WebKit\uFF08Apache License 2.0\uFF09\u3002"),
                react_1.default.createElement("li", null, "\u672A\u4F7F\u7528\u4EFB\u4F55\u4F01\u696D\u54C1\u724C\u5716\u50CF\u3001\u5C08\u6709\u7167\u7247\u6216\u7B2C\u4E09\u65B9\u904A\u6232\u7D20\u6750\u3002")))));
}
function Splash({ onDone }) {
    const [p, setP] = (0, react_1.useState)(0);
    (0, react_1.useEffect)(() => { let raf = 0; const t0 = performance.now(); const f = (t) => { const v = Math.min(1, (t - t0) / 900); setP(v); if (v < 1)
        raf = requestAnimationFrame(f);
    else
        setTimeout(onDone, 120); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, []);
    return (react_1.default.createElement("div", { className: "sx-splash" },
        react_1.default.createElement("svg", { viewBox: "0 0 120 120", className: "sx-logo" },
            react_1.default.createElement("polygon", { points: "60,8 105,34 105,86 60,112 15,86 15,34", fill: "none", stroke: "#F59E38", strokeWidth: "6" }),
            react_1.default.createElement("circle", { cx: "60", cy: "60", r: "20", fill: "none", stroke: "#36C5E8", strokeWidth: "5", strokeDasharray: "6 4", className: "sx-spin" }),
            react_1.default.createElement("circle", { cx: "60", cy: "60", r: "7", fill: "#F0F4F8" })),
        react_1.default.createElement("h1", null, "SUMEEKO \u667A\u6167\u5DE5\u5EE0"),
        react_1.default.createElement("small", null, "\u5F9E\u4E00\u9846\u87BA\u7D72\u5230\u4E00\u5EA7\u667A\u6167\u5DE5\u5EE0"),
        react_1.default.createElement("div", { className: "sx-load" },
            react_1.default.createElement("i", { style: { width: `${p * 100}%` } })),
        react_1.default.createElement("small", { className: "muted" },
            "\u8F09\u5165\u5DE5\u5EE0\u5834\u666F\u2026 ",
            Math.round(p * 100),
            "%")));
}
function Onboarding({ onDone }) {
    const [i, setI] = (0, react_1.useState)(0);
    const pages = [
        { t: '歡迎進廠', d: '這是一座放在手機裡的數位工作環境：看機台、觀察製程、轉動工件、完成任務。', ic: '🏭' },
        { t: '操作方式', d: '單擊選取、拖曳移動或旋轉、雙指縮放；返回鍵回到上一層。機台與工件都可以互動。', ic: '👆' },
        { t: '安全與聲明', d: '所有操作皆為虛擬模擬，不連接真實設備。參數與數據為教學用虛構資料，不可套用到實際機台。', ic: '🦺' },
    ];
    return (react_1.default.createElement("div", { className: "sx-onb" },
        react_1.default.createElement("div", { className: "sx-onb-c" },
            react_1.default.createElement("span", { className: "sx-onb-ic" }, pages[i].ic),
            react_1.default.createElement("h2", null, pages[i].t),
            react_1.default.createElement("p", null, pages[i].d),
            react_1.default.createElement("div", { className: "sx-dots" }, pages.map((_, k) => react_1.default.createElement("i", { key: k, className: k === i ? 'on' : '' }))),
            react_1.default.createElement("div", { className: "sx-row between" },
                react_1.default.createElement("button", { className: "sx-btn ghost", onClick: onDone }, "\u7565\u904E"),
                i < pages.length - 1 ? react_1.default.createElement("button", { className: "sx-btn pri", onClick: () => setI(i + 1) }, "\u4E0B\u4E00\u6B65") : react_1.default.createElement("button", { className: "sx-btn pri", onClick: onDone }, "\u958B\u59CB")))));
}
function Shell() {
    const [s, setS] = (0, react_1.useState)(core_1.loadApp);
    const [boot, setBoot] = (0, react_1.useState)('splash');
    const [tab, setTabRaw] = (0, react_1.useState)('home');
    const [stack, setStack] = (0, react_1.useState)([]);
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const [paused, setPaused] = (0, react_1.useState)(false);
    const mainRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => { const t = setTimeout(() => (0, core_1.saveApp)(s), 250); return () => clearTimeout(t); }, [s]);
    (0, react_1.useEffect)(() => { core_1.sound.set({ master: s.settings.master, sfx: s.settings.sfx, amb: s.settings.amb, mute: s.settings.mute }); }, [s.settings]);
    (0, react_1.useEffect)(() => {
        window.__appPause = () => { setPaused(true); core_1.sound.suspend(); };
        window.__appResume = () => { setPaused(false); core_1.sound.resume(); };
        const vis = () => (document.hidden ? window.__appPause() : window.__appResume());
        document.addEventListener('visibilitychange', vis);
        return () => document.removeEventListener('visibilitychange', vis);
    }, []);
    const toast = (m) => { const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, m }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600); };
    const scrollTop = () => { mainRef.current?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); };
    const nav = (0, react_1.useRef)({ stack: [], tab: 'home' });
    const setNav = (st, t) => { nav.current = { stack: st, tab: t }; setStack(st); setTabRaw(t); };
    const push = (r) => { const st = nav.current.stack; const top = st[st.length - 1]; setNav(top && top.t === r.t && r.t === 'part' ? [...st.slice(0, -1), r] : [...st, r], nav.current.tab); scrollTop(); };
    const pop = () => { setNav(nav.current.stack.slice(0, -1), nav.current.tab); scrollTop(); };
    const setTab = (t) => { setNav([], t); scrollTop(); };
    (0, core_1.useBack)(() => { if (nav.current.stack.length) {
        pop();
        return true;
    } if (nav.current.tab !== 'home') {
        setTab('home');
        return true;
    } return false; }, boot === 'app');
    const ctx = { s, set: setS, push, pop, tab, setTab, sfx: (t) => core_1.sound.play(t), toast, paused };
    const top = stack[stack.length - 1];
    if (boot === 'splash')
        return react_1.default.createElement(Splash, { onDone: () => setBoot(s.onboarded ? 'app' : 'onb') });
    if (boot === 'onb')
        return react_1.default.createElement(Onboarding, { onDone: () => { setS((x) => ({ ...x, onboarded: true })); setBoot('app'); } });
    if (top?.t === 'career')
        return react_1.default.createElement(C.Provider, { value: ctx },
            react_1.default.createElement(CareerHost, { onExit: pop }));
    const page = (() => {
        if (top)
            switch (top.t) {
                case 'machine': return react_1.default.createElement(MachinePage, { key: top.id, id: top.id });
                case 'part': return react_1.default.createElement(PartPage, { key: top.id, id: top.id });
                case 'tool': return react_1.default.createElement(ToolPage, { id: top.id });
                case 'unit': return react_1.default.createElement(UnitPage, { key: top.id, id: top.id });
                case 'task': return react_1.default.createElement(TaskRun, { key: top.id, id: top.id });
                case 'role': return react_1.default.createElement(RolePage, { id: top.id });
                case 'material': return react_1.default.createElement(MaterialPage, { id: top.id });
                case 'patent': return react_1.default.createElement(PatentPage, { id: top.id });
                case 'about': return react_1.default.createElement(About, null);
            }
        return tab === 'home' ? react_1.default.createElement(Home, null) : tab === 'scene' ? react_1.default.createElement(Scene, null) : tab === 'codex' ? react_1.default.createElement(Codex, null) : tab === 'tasks' ? react_1.default.createElement(Tasks, null) : react_1.default.createElement(Me, null);
    })();
    return (react_1.default.createElement(C.Provider, { value: ctx },
        react_1.default.createElement("div", { className: `sx-app text-${s.settings.text} ${s.settings.lowMotion ? 'sx-lowmotion' : ''} ${s.settings.pauseAnim || paused ? 'sx-paused' : ''} ${tab === 'scene' && !top ? 'full' : ''}` },
            react_1.default.createElement("main", { className: "sx-main", ref: mainRef }, page),
            react_1.default.createElement("nav", { className: "sx-nav" }, [['home', '首頁', '⌂'], ['scene', '工作場景', '🏭'], ['codex', '圖鑑', '📚'], ['tasks', '任務', '🎯'], ['me', '我的', '👤']].map(([k, n, i]) => react_1.default.createElement("button", { key: k, className: tab === k && !top ? 'on' : tab === k ? 'half' : '', onClick: () => { core_1.sound.play('click'); setTab(k); } },
                react_1.default.createElement("span", null, i),
                react_1.default.createElement("small", null, n)))),
            react_1.default.createElement("div", { className: "sx-toasts" }, toasts.map((t) => react_1.default.createElement("div", { key: t.id, className: "sx-toast" }, t.m))))));
}
function CareerHost({ onExit }) {
    const { set } = useA();
    (0, react_1.useEffect)(() => { set((x) => ({ ...x, last: { r: 'career' } })); }, []);
    (0, core_1.useBack)(() => { const f = window.__careerBack; if (f && f())
        return true; onExit(); return true; });
    return react_1.default.createElement("div", { className: "sx-career" },
        react_1.default.createElement(App_1.default, { onExit: onExit }));
}

};
factories["./app/core.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAndroid = exports.sound = void 0;
exports.defaultState = defaultState;
exports.loadApp = loadApp;
exports.saveApp = saveApp;
exports.useBack = useBack;
exports.handleBack = handleBack;
const react_1 = require("react");
const KEY = 'sumeeko-app-v1';
function defaultState() {
    return { v: 1, onboarded: false, role: 'R2', settings: { master: 0.7, sfx: 0.8, amb: 0.35, mute: false, lowMotion: false, lowGfx: false, hints: true, text: 'm', pauseAnim: false }, units: {}, tasks: {}, fav: [], recent: [], last: null };
}
function loadApp() {
    try {
        const s = localStorage.getItem(KEY);
        if (s) {
            const o = JSON.parse(s);
            if (o.v === 1)
                return { ...defaultState(), ...o, settings: { ...defaultState().settings, ...o.settings } };
        }
    }
    catch { }
    return defaultState();
}
function saveApp(s) { try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
}
catch {
    return false;
} }
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.master = null;
        this.ambNode = null;
        this.vol = { master: 0.7, sfx: 0.8, amb: 0.35, mute: false };
    }
    ensure() {
        if (this.ctx)
            return this.ctx;
        try {
            const C = window.AudioContext || window.webkitAudioContext;
            this.ctx = new C();
            this.master = this.ctx.createGain();
            this.master.connect(this.ctx.destination);
            this.apply();
        }
        catch {
            this.ctx = null;
        }
        return this.ctx;
    }
    apply() { if (this.master)
        this.master.gain.value = this.vol.mute ? 0 : this.vol.master; if (this.ambNode)
        this.ambNode.g.gain.value = this.vol.amb * 0.25; }
    set(v) { Object.assign(this.vol, v); this.apply(); }
    play(t) {
        if (this.vol.mute || this.vol.sfx <= 0)
            return;
        const c = this.ensure();
        if (!c || !this.master)
            return;
        const seq = {
            click: [[880, 0.03, 'triangle']], contact: [[220, 0.05, 'square'], [1400, 0.04, 'triangle']], prompt: [[660, 0.08, 'sine'], [880, 0.1, 'sine']],
            success: [[523, 0.09, 'triangle'], [659, 0.09, 'triangle'], [784, 0.09, 'triangle'], [1046, 0.22, 'triangle']], warn: [[740, 0.12, 'square'], [520, 0.12, 'square'], [740, 0.12, 'square']], fail: [[300, 0.15, 'sawtooth'], [200, 0.25, 'sawtooth']],
        };
        let tt = c.currentTime;
        for (const [f, d, type] of seq[t]) {
            const o = c.createOscillator(), g = c.createGain();
            o.type = type;
            o.frequency.value = f;
            g.gain.setValueAtTime(0.12 * this.vol.sfx, tt);
            g.gain.exponentialRampToValueAtTime(0.0001, tt + d);
            o.connect(g);
            g.connect(this.master);
            o.start(tt);
            o.stop(tt + d + 0.02);
            tt += d * 0.95;
        }
    }
    ambient(on) {
        if (!on) {
            if (this.ambNode) {
                try {
                    this.ambNode.src.stop();
                    this.ambNode.osc.stop();
                }
                catch { }
                this.ambNode = null;
            }
            return;
        }
        if (this.ambNode || this.vol.mute || this.vol.amb <= 0)
            return;
        const c = this.ensure();
        if (!c || !this.master)
            return;
        const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
        for (let i = 0; i < len; i++)
            d[i] = (Math.random() * 2 - 1) * 0.5;
        const src = c.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 420;
        const osc = c.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = 55;
        const og = c.createGain();
        og.gain.value = 0.08;
        const g = c.createGain();
        g.gain.value = this.vol.amb * 0.25;
        src.connect(lp);
        lp.connect(g);
        osc.connect(og);
        og.connect(g);
        g.connect(this.master);
        src.start();
        osc.start();
        this.ambNode = { src, osc, g };
    }
    suspend() { try {
        this.ctx?.suspend();
    }
    catch { } }
    resume() { try {
        this.ctx?.resume();
    }
    catch { } }
}
exports.sound = new SoundEngine();
const backStack = [];
let bid = 0;
function useBack(fn, active = true) {
    const ref = (0, react_1.useRef)(fn);
    ref.current = fn;
    (0, react_1.useEffect)(() => {
        if (!active)
            return;
        const id = ++bid;
        backStack.push({ id, fn: () => ref.current() });
        return () => { const i = backStack.findIndex((x) => x.id === id); if (i >= 0)
            backStack.splice(i, 1); };
    }, [active]);
}
function handleBack() {
    for (let i = backStack.length - 1; i >= 0; i--) {
        if (backStack[i].fn())
            return true;
    }
    return false;
}
window.__handleBack = () => { try {
    return handleBack();
}
catch {
    return false;
} };
window.addEventListener('keydown', (e) => {
    const target = e.target;
    const editing = !!target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
    if (e.key === 'Escape' || e.key === 'BrowserBack' || (e.key === 'Backspace' && !editing)) {
        if (handleBack())
            e.preventDefault();
    }
});
const isAndroid = () => !!window.AndroidApp;
exports.isAndroid = isAndroid;

};
factories["./app/navigation.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACTORY_CAMERA = void 0;
exports.previousTaskStep = previousTaskStep;
exports.factoryViewBox = factoryViewBox;
function previousTaskStep(step) {
    return Number.isInteger(step) && step >= 1 && step <= 4 ? step - 1 : null;
}
exports.FACTORY_CAMERA = { worldWidth: 900, worldHeight: 720, centerX: 400, centerY: 210 };
function factoryViewBox(viewWidth, viewHeight, zoom, panX = 0, panY = 0) {
    const { worldWidth, worldHeight, centerX, centerY } = exports.FACTORY_CAMERA;
    const aspect = Math.max(1, viewWidth) / Math.max(1, viewHeight);
    const k = Math.min(3, Math.max(0.8, zoom));
    const width = (aspect >= worldWidth / worldHeight ? worldHeight * aspect : worldWidth) / k;
    const height = width / aspect;
    return { x: centerX - width / 2 + panX, y: centerY - height / 2 + panY, width, height };
}

};
factories["./app/appdata.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CELLS = exports.TASKS = exports.UNITS = exports.ROLES = exports.TOOLS = exports.MATERIALS = exports.ROUTES = exports.PARTS = exports.MACHINES = exports.MSTATE = void 0;
exports.MSTATE = {
    idle: { n: '待機', en: 'Idle', icon: '⏸', color: '#AEB8C4' },
    preparing: { n: '準備中', en: 'Preparing', icon: '🔧', color: '#36C5E8' },
    running: { n: '運轉中', en: 'Running', icon: '▶', color: '#38B88A' },
    paused: { n: '暫停', en: 'Paused', icon: '⏯', color: '#F59E38' },
    inspection: { n: '檢驗中', en: 'Inspection', icon: '🔍', color: '#36C5E8' },
    complete: { n: '完成', en: 'Complete', icon: '✔', color: '#38B88A' },
    warning: { n: '警告', en: 'Warning', icon: '⚠', color: '#F59E38' },
    fault: { n: '故障', en: 'Fault', icon: '✖', color: '#E95858' },
    maintenance: { n: '保養中', en: 'Maintenance', icon: '🔒', color: '#B78CFF' },
    estop: { n: '緊急停止', en: 'Emergency Stop', icon: '⛔', color: '#E95858' },
};
exports.MACHINES = [
    {
        id: 'M01', n: '多工位冷鍛成形機', en: 'Multi-Station Cold Former', type: '成形設備', process: '冷鍛／打頭', cell: 'B1', unit: 'U01', task: 'T1', cycleSec: 8,
        desc: '線材經導引送入、切斷成胚料後，由多個工位的沖頭與模具依序鐓粗、預成形、成形頭部，再由轉送夾爪移到下一站，最後出料。常溫成形，材料利用率高。',
        parts: [
            { id: 'feed', n: '送料裝置', d: '送料輪夾持線材，依設定長度定量送入。', x: 70, y: 210 }, { id: 'guide', n: '線材導引機構', d: '矯直並導正線材，避免偏心導致成形不良。', x: 130, y: 200 },
            { id: 'cut', n: '切料機構', d: '切刀將線材切成固定長度胚料，切口品質影響後續成形。', x: 190, y: 170 }, { id: 'ram', n: '主滑塊', d: '由曲軸驅動往復運動，帶動各站沖頭同步加壓。', x: 300, y: 70 },
            { id: 'punch', n: '沖頭', d: '各工位的上模，與模具配合將胚料逐步成形。', x: 300, y: 125 }, { id: 'die', n: '模具座', d: '固定各站下模（模仁），承受成形力；磨耗是主要保養項目。', x: 300, y: 205 },
            { id: 'transfer', n: '多站轉送機構', d: '夾爪將工件從一站轉送到下一站，時序須與滑塊同步。', x: 380, y: 160 }, { id: 'out', n: '出料裝置', d: '成形品經滑槽排出至料箱。', x: 470, y: 230 },
            { id: 'guard', n: '安全護罩與控制面板', d: '護罩含連鎖開關，開啟即停機；面板有緊急停止鈕。', x: 520, y: 110 },
        ],
        input: 'P02', output: 'P03',
        params: [
            { id: 'speed', n: '生產速度', unit: '%', min: 60, max: 100, step: 1, def: 85, safe: [60, 92], best: [80, 90], tip: '速度越快產量越高，但模具磨耗與頭部裂紋風險上升。' },
            { id: 'feedLen', n: '送料長度', unit: 'mm', min: 40, max: 50, step: 0.1, def: 45, safe: [40, 50], best: [44.6, 45.4], tip: '決定胚料體積；太短頭部不飽滿，太長產生毛邊。' },
            { id: 'lube', n: '潤滑供給', unit: '%', min: 0, max: 100, step: 5, def: 70, safe: [40, 100], best: [60, 90], tip: '潤滑不足會刮傷模具與工件表面。' },
        ],
        safety: ['運轉中禁止開啟護罩或伸手進入模具區。', '換模、清料必須停機並上鎖掛牌（LOTO），確認零能量。', '不可佩戴棉紗手套靠近運轉中的送料輪等旋轉部件。', '異常撞擊聲、頭部裂紋立即停機通報。'],
        warn: { n: '模具溫度偏高', d: '連續高速生產，模具溫度上升，裂紋風險增加。' }, fault: { n: '送料卡料', d: '線材在導引機構卡住，機台已自動停止。需停機上鎖後排除。' },
        quality: ['頭部高度', '頭部外徑', '有無裂紋與摺疊', '毛邊'],
    },
    {
        id: 'M02', n: '平板式搓牙機', en: 'Flat-Die Thread Rolling Machine', type: '成形設備', process: '搓牙（外螺紋）', cell: 'B2', unit: 'U02', task: 'T2', cycleSec: 6,
        desc: '胚料沿送料軌道進入兩片牙板之間，固定牙板與往復牙板相對運動，使胚料滾動並以塑性變形壓出外螺紋。不產生切屑，金屬纖維連續。螺帽內螺紋則以攻牙加工，兩者不同。',
        parts: [
            { id: 'rail', n: '送料軌道', d: '胚料依序排列滑入，方向須一致。', x: 110, y: 120 }, { id: 'fixed', n: '固定牙板', d: '刻有螺紋牙型的模具，固定不動。', x: 300, y: 115 },
            { id: 'moving', n: '往復牙板', d: '由曲柄驅動往復運動，帶動胚料滾動成形。', x: 300, y: 185 }, { id: 'pusher', n: '推料器', d: '在正確時機將胚料推入牙板之間。', x: 210, y: 150 },
            { id: 'bin', n: '出料與收集', d: '成形後落入收集料箱，定時抽檢。', x: 470, y: 235 },
        ],
        input: 'P03', output: 'P04',
        params: [
            { id: 'speed', n: '搓牙速度', unit: '%', min: 60, max: 100, step: 1, def: 85, safe: [60, 95], best: [78, 90], tip: '速度過快易產生亂牙；過慢產能不足。' },
            { id: 'gap', n: '牙板間隙', unit: 'mm', min: 6.2, max: 7.2, step: 0.02, def: 6.7, safe: [6.2, 7.2], best: [6.62, 6.78], tip: '決定螺紋外徑；太小過度擠壓，太大牙型不完整。' },
            { id: 'align', n: '牙板對位', unit: '刻度', min: -5, max: 5, step: 1, def: 0, safe: [-5, 5], best: [-1, 1], tip: '對位偏差會造成錯牙（雙牙）。' },
        ],
        safety: ['牙板間為夾捲危險點，運轉中不可伸手。', '更換牙板須停機上鎖，並使用專用工具。', '搓牙油霧區配戴護目鏡。'],
        warn: { n: '牙板磨耗接近壽命', d: '缺牙比例開始上升。' }, fault: { n: '胚料方向錯誤卡死', d: '送料軌道有胚料倒置，牙板停止。' },
        quality: ['螺紋通止規', '外徑', '牙型完整性', '錯牙'],
    },
    {
        id: 'M03', n: '軸向沖壓與二次加工機', en: 'Axial Stamping & Secondary Press', type: '二次加工', process: '二次加工（預置扭力螺帽沖壓）', cell: 'B3', unit: 'U03', task: 'T5', cycleSec: 5,
        desc: '對熱處理後的螺帽進行軸向沖壓，使局部產生受控變形而形成預置扭力（防鬆）特性。公開專利 TWI753649B 的重點在熱處理後硬度與特定軸向沖壓條件的配合；本機參數皆為虛構示意。',
        parts: [
            { id: 'frame', n: 'C 型機架', d: '承受沖壓反力。', x: 170, y: 120 }, { id: 'ram', n: '沖壓滑塊', d: '帶動上模下壓，行程可調。', x: 300, y: 80 },
            { id: 'tool', n: '沖壓模具', d: '決定變形位置與形狀。', x: 300, y: 150 }, { id: 'nest', n: '定位治具', d: '確保螺帽方向與位置正確（防錯）。', x: 300, y: 210 },
            { id: 'sensor', n: '行程／壓力感測', d: '記錄每次沖壓的深度與壓力，作為追溯資料。', x: 450, y: 110 },
        ],
        input: 'N05', output: 'N06',
        params: [
            { id: 'depth', n: '沖壓深度（虛構指數）', unit: '', min: 0.2, max: 1.0, step: 0.02, def: 0.6, safe: [0.3, 0.9], best: [0.52, 0.68], tip: '深度影響預置扭力大小，需與硬度配合。' },
            { id: 'hard', n: '來料硬度分級（虛構指數）', unit: '', min: 20, max: 42, step: 1, def: 30, safe: [24, 38], best: [28, 33], tip: '硬度太高易裂、太低扭力不穩。' },
        ],
        safety: ['雙手啟動按鈕，避免單手操作。', '光柵或連鎖失效時禁止生產。'],
        warn: { n: '壓力曲線漂移', d: '連續 10 次壓力峰值偏高。' }, fault: { n: '光柵觸發', d: '偵測到手部進入危險區，已停止。' },
        quality: ['預置扭力', '外觀裂紋', '牙型變形'],
    },
    {
        id: 'M04', n: '網帶式連續熱處理爐', en: 'Mesh-Belt Heat Treatment Furnace', type: '特殊製程', process: '淬火／回火', cell: 'A3', unit: 'U04', task: 'T3', cycleSec: 10,
        desc: '工件由網帶連續輸送，依序經過加熱區、淬火槽、回火區。加熱使組織轉變，急冷提高硬度，回火調整韌性與硬度平衡。屬特殊製程，需以溫度、時間與爐內氣氛監控確保品質。',
        parts: [
            { id: 'load', n: '投料區', d: '定量投料，避免堆疊影響受熱均勻。', x: 60, y: 170 }, { id: 'heat', n: '加熱區', d: '多段溫控，熱電偶監測。', x: 190, y: 120 },
            { id: 'quench', n: '淬火槽', d: '急冷使硬度上升；冷卻速度影響變形與硬度。', x: 320, y: 200 }, { id: 'temper', n: '回火區', d: '降低脆性、調整至規格硬度。', x: 440, y: 120 },
            { id: 'monitor', n: '溫度監測', d: '記錄每一爐區溫度曲線，作為追溯資料。', x: 300, y: 50 },
        ],
        input: 'P04', output: 'P05',
        params: [
            { id: 'tq', n: '加熱區溫度偏移（虛構指數）', unit: '', min: -10, max: 10, step: 1, def: 0, safe: [-4, 4], best: [-1, 1], tip: '偏離基準會使硬度不足或過硬。' },
            { id: 'tt', n: '回火條件偏移（虛構指數）', unit: '', min: -10, max: 10, step: 1, def: 0, safe: [-4, 4], best: [-1, 2], tip: '回火影響最終硬度與韌性。' },
            { id: 'load', n: '網帶裝載率', unit: '%', min: 50, max: 100, step: 2, def: 80, safe: [50, 92], best: [70, 88], tip: '過度堆疊導致受熱不均。' },
        ],
        safety: ['高溫區域禁止觸碰，維修須降溫並上鎖。', '淬火油區注意火災風險與通風。', '本 App 僅作原理展示，不提供實際操作條件。'],
        warn: { n: '熱電偶讀值跳動', d: '第二加熱區溫度量測不穩定。' }, fault: { n: '網帶停轉', d: '驅動馬達過載跳脫。' },
        quality: ['表面硬度', '心部硬度', '脫碳', '變形量'],
    },
    {
        id: 'M05', n: '表面處理線', en: 'Surface Finishing Line', type: '特殊製程', process: '表面處理（原理展示）', cell: 'A3', unit: 'U05', cycleSec: 9,
        desc: '工件經前處理、鍍層或塗層、水洗與乾燥固化，以提升防蝕性並控制摩擦係數。本 App 只展示原理與品質重點，不提供任何化學藥液的現場操作指引。',
        parts: [
            { id: 'pre', n: '前處理槽', d: '去除油污與氧化物，影響附著力（示意）。', x: 110, y: 170 }, { id: 'coat', n: '鍍層／塗層槽', d: '形成保護層；膜厚需控制在規格內。', x: 230, y: 170 },
            { id: 'rinse', n: '水洗槽', d: '移除殘留（示意）。', x: 350, y: 170 }, { id: 'dry', n: '乾燥固化', d: '完成塗層固化。', x: 470, y: 150 },
            { id: 'hoist', n: '吊掛輸送', d: '掛架或滾筒將工件依序移動。', x: 290, y: 60 },
        ],
        input: 'P05', output: 'P06',
        params: [
            { id: 'thick', n: '膜厚目標（虛構指數）', unit: '', min: 4, max: 16, step: 1, def: 10, safe: [6, 14], best: [9, 11], tip: '太薄防蝕不足，太厚影響螺紋配合與摩擦係數。' },
        ],
        safety: ['化學品區域僅由受訓人員作業；本 App 不提供操作條件。', '需配戴對應防護具並確保通風。'],
        warn: { n: '膜厚分布不均', d: '滾筒轉速異常。' }, fault: { n: '吊車定位失敗', d: '掛架未到位，輸送停止。' },
        quality: ['膜厚', '附著性', '外觀', '摩擦係數'],
    },
    {
        id: 'M06', n: '自動光學檢測設備', en: 'Automated Optical Inspection, AOI', type: '檢測設備', process: '光學篩選', cell: 'C3', unit: 'U06', task: 'T4', cycleSec: 7,
        desc: '工件由送料盤排列後經過玻璃轉盤，多組工業相機與環形光源拍攝外觀與尺寸，影像演算法判定良品／不良品，再以氣嘴把不良品吹入 NG 區。檢出率與誤判率需以成本取捨。',
        parts: [
            { id: 'bowl', n: '工件送料機構', d: '振動盤排列方向後送入。', x: 80, y: 170 }, { id: 'cam', n: '工業相機', d: '多角度拍攝頭部、螺紋與側面。', x: 260, y: 60 },
            { id: 'light', n: '照明組件', d: '環形光與背光，凸顯缺陷輪廓。', x: 330, y: 95 }, { id: 'disc', n: '影像檢測區（玻璃轉盤）', d: '透明轉盤使背光可穿透。', x: 300, y: 175 },
            { id: 'ui', n: '判定介面', d: '顯示 OK／NG 統計與缺陷影像。', x: 500, y: 80 }, { id: 'eject', n: '良品與不良品分流', d: '氣嘴吹出 NG 品。', x: 440, y: 220 },
        ],
        input: 'P06', output: 'P07',
        params: [
            { id: 'th', n: '判定門檻（越低越嚴格）', unit: '', min: 0.1, max: 0.9, step: 0.01, def: 0.5, safe: [0.1, 0.9], best: [0.36, 0.52], tip: '嚴格可降低漏檢，但誤判上升。' },
            { id: 'lux', n: '光源亮度', unit: '%', min: 40, max: 100, step: 5, def: 75, safe: [50, 100], best: [70, 90], tip: '亮度不足會漏判；過亮反光誤判。' },
        ],
        safety: ['轉盤與氣嘴區運轉中勿伸手。', '清潔鏡頭須停機。'],
        warn: { n: '鏡頭髒污', d: '影像對比下降，漏檢風險上升。' }, fault: { n: '轉盤卡件', d: '工件卡在轉盤邊緣，已停止。' },
        quality: ['外觀缺陷（裂紋、毛邊、缺牙）', '頭部尺寸', '套管到位'],
    },
    {
        id: 'M07', n: '自動化組裝與物流系統', en: 'Automation & Intralogistics', type: '自動化物流', process: '組裝／包裝／搬運', cell: 'C3', unit: 'U07', cycleSec: 8,
        desc: '機械手臂以夾爪取放工件並組裝套管、放入料箱；輸送帶與自主移動機器人（AMR）把料箱送往包裝；條碼標籤串起批號追溯。',
        parts: [
            { id: 'arm', n: '機械手臂', d: '六軸手臂執行取放，區域以圍籬隔離。', x: 160, y: 100 }, { id: 'grip', n: '夾爪', d: '依工件形狀設計，需力量與位置感測。', x: 230, y: 150 },
            { id: 'conv', n: '輸送帶', d: '把料箱送往下一站。', x: 330, y: 200 }, { id: 'amr', n: 'AGV／AMR', d: '自主導航搬運料箱至倉儲。', x: 470, y: 230 },
            { id: 'pack', n: '自動包裝設備', d: '計數、封箱、秤重檢查。', x: 470, y: 120 }, { id: 'label', n: '條碼與追溯標籤', d: '記錄批號、數量與工單。', x: 400, y: 160 },
        ],
        input: 'P07', output: 'P07',
        params: [{ id: 'speed', n: '手臂速度', unit: '%', min: 30, max: 100, step: 5, def: 70, safe: [30, 85], best: [55, 80], tip: '協作區速度須受限。' }],
        safety: ['機械手臂作業區以圍籬與門連鎖隔離。', 'AMR 行經路線保持淨空並有警示。'],
        warn: { n: '條碼讀取失敗率上升', d: '標籤印字模糊。' }, fault: { n: '夾爪真空不足', d: '取件失敗，手臂停止。' },
        quality: ['組裝到位', '數量', '標籤正確'],
    },
];
exports.PARTS = [
    { id: 'P01', n: '金屬盤元', code: 'MAT-WR', mat: '中碳合金鋼（教學示例）', shape: 'coil', finish: 'raw', stage: '原料', machine: '—（上游鋼廠供應）', quality: ['材質證明', '線徑', '表面'], defects: ['鏽蝕', '刮痕', '混料'], use: '冷鍛原料', dims: '線徑 Ø9.2 mm（示意）' },
    { id: 'P02', n: '下料胚料', code: 'BLK-01', mat: '球化、伸線後線材', shape: 'slug', finish: 'drawn', stage: '下料', machine: 'M01 切料機構', quality: ['長度', '切口平整'], defects: ['切口斜', '長度不足'], use: '冷鍛胚料', dims: '長約 45 mm（示意）' },
    { id: 'P03', n: '成形螺栓胚體', code: 'BLK-02', mat: '冷鍛成形', shape: 'blank', finish: 'drawn', stage: '冷鍛', machine: 'M01', quality: ['頭部高度', '頭部對邊'], defects: ['頭部裂紋', '摺疊', '毛邊'], use: '待搓牙', dims: '頭高 6.4 mm、對邊 13 mm（示意）' },
    { id: 'P04', n: '螺紋加工件', code: 'THD-01', mat: '搓牙成形', shape: 'bolt', finish: 'drawn', stage: '搓牙', machine: 'M02', quality: ['通止規', '外徑'], defects: ['缺牙', '錯牙', '牙型變形'], use: '待熱處理', dims: 'M10×1.5（示意）' },
    { id: 'P05', n: '熱處理件', code: 'HT-01', mat: '淬火回火', shape: 'bolt', finish: 'heat', stage: '熱處理', machine: 'M04', quality: ['硬度'], defects: ['硬度不足', '脫碳', '變形'], use: '待表面處理', dims: '—' },
    { id: 'P06', n: '表面處理件', code: 'SF-01', mat: '鍍層（示意）', shape: 'bolt', finish: 'zinc', stage: '表面處理', machine: 'M05', quality: ['膜厚', '外觀'], defects: ['膜厚不均', '附著不良'], use: '待檢驗', dims: '—' },
    { id: 'P07', n: '合格成品：車用六角螺栓', code: 'HB-M10', mat: '成品', shape: 'bolt', finish: 'zinc', stage: '光學篩選與包裝', machine: 'M06／M07', quality: ['外觀', '尺寸', '追溯標籤'], defects: ['—'], use: '汽車零組件鎖固', dims: 'M10×1.5×40（示意）' },
    { id: 'N03', n: '冷鍛螺帽胚', code: 'NUT-01', mat: '冷鍛成形', shape: 'nutblank', finish: 'drawn', stage: '冷鍛', machine: 'M01', quality: ['對邊', '高度', '沖孔'], defects: ['偏心', '裂紋'], use: '待攻牙', dims: '對邊 15 mm（示意）' },
    { id: 'N05', n: '攻牙後熱處理螺帽', code: 'NUT-05', mat: '攻牙、淬火回火', shape: 'nut', finish: 'heat', stage: '攻牙＋熱處理', machine: '攻牙機／M04', quality: ['內螺紋塞規', '硬度'], defects: ['亂牙', '硬度偏差'], use: '待軸向沖壓', dims: 'M10（示意）' },
    { id: 'N06', n: '預置扭力防鬆螺帽', code: 'PTN-M10', mat: '軸向沖壓', shape: 'nut', finish: 'zinc', stage: '二次加工', machine: 'M03', quality: ['預置扭力', '外觀'], defects: ['扭力偏高／偏低', '裂紋'], use: '防鬆鎖固', dims: 'M10（示意）' },
    { id: 'C07', n: '組合式套管螺絲', code: 'CSS-M6', mat: '螺絲本體＋套管', shape: 'css', finish: 'zinc', stage: '組裝', machine: 'M07', quality: ['套管到位', '不脫落'], defects: ['套管脫落', '限位不足'], use: '預組裝模組鎖固', dims: 'M6（示意）' },
];
exports.ROUTES = [
    { id: 'HB', n: '車用六角螺栓', steps: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07'] },
    { id: 'PTN', n: '預置扭力防鬆螺帽', steps: ['P01', 'P02', 'N03', 'N05', 'N06'] },
    { id: 'CSS', n: '組合式套管螺絲', steps: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'C07'] },
];
exports.MATERIALS = [
    { id: 'MA1', n: '中碳合金鋼盤元', en: 'Medium-Carbon Alloy Steel Wire Rod', d: '常見於高強度螺栓（例如 SCM435 等鋼種，教學示例）。經熱處理可達較高強度。', use: '六角螺栓、高強度扣件', note: '由上游鋼廠以小鋼胚熱軋成盤元供應。' },
    { id: 'MA2', n: '低碳硼鋼盤元', en: 'Low-Carbon Boron Steel Wire Rod', d: '添加微量硼提高淬透性，冷鍛性佳（例如 10B21，教學示例）。', use: '螺絲、套管螺絲本體', note: '常用於冷鍛性要求較高的產品。' },
    { id: 'MA3', n: '中碳鋼盤元', en: 'Medium-Carbon Steel Wire Rod', d: '價格較低、用途廣（例如 S45C，教學示例）。', use: '螺帽、一般扣件', note: '鋼種須與材質證明、標籤一致，避免混料。' },
    { id: 'MA4', n: '沃斯田鐵系不鏽鋼線材', en: 'Austenitic Stainless Steel Wire', d: '耐蝕性佳但易加工硬化，鎖附時注意咬死（galling）。', use: '耐蝕扣件', note: '不需淬火，強度主要來自冷加工。' },
    { id: 'MA5', n: '鍍層與塗層材料', en: 'Coatings', d: '鋅系鍍層、鋅鎳、片狀鋅塗層等用於防蝕與摩擦係數控制（原理說明）。', use: '表面處理', note: '本 App 不提供化學處理操作條件。' },
];
exports.TOOLS = [
    { id: 'T01', n: '游標卡尺', en: 'Vernier Caliper', mat: '不鏽鋼', role: '品質工程師、機台操作員', use: '量測外徑、內徑、深度與長度，解析度常見 0.02 mm。', parts: '胚料長度、頭部高度', demo: 'caliper' },
    { id: 'T02', n: '外徑千分尺', en: 'Outside Micrometer', mat: '鋼製、碳化物測砧', role: '品質工程師', use: '精密量測外徑，解析度 0.01 mm（數位型可達 0.001）。使用棘輪確保量測力一致。', parts: '螺紋外徑、線徑', demo: 'micrometer' },
    { id: 'T03', n: '螺紋環規', en: 'Thread Ring Gauge', mat: '工具鋼', role: '品質工程師、機台操作員', use: '檢查外螺紋：通端（GO）須能旋入，止端（NO-GO）不可旋入超過規定圈數。', parts: '螺栓外螺紋', demo: 'ring' },
    { id: 'T04', n: '螺紋塞規', en: 'Thread Plug Gauge', mat: '工具鋼', role: '品質工程師', use: '檢查內螺紋（螺帽），通端旋入、止端不入。', parts: '螺帽內螺紋', demo: 'plug' },
    { id: 'T05', n: '扭力扳手', en: 'Torque Wrench', mat: '合金鋼', role: '品質工程師、製程工程師', use: '以設定扭力鎖附或檢測預置扭力。需定期校正。', parts: '預置扭力螺帽', demo: 'torque' },
    { id: 'T06', n: '百分表', en: 'Dial Indicator', mat: '鋼製、玻璃錶面', role: '設備維護工程師、模具技師', use: '量測偏擺、真直度與模具對位，常搭配磁性表座。', parts: '模具對位、主軸偏擺', demo: 'dial' },
    { id: 'T07', n: '模具組', en: 'Die Set', mat: '碳化鎢模仁、工具鋼', role: '模具技師', use: '冷鍛各工位的沖頭與模仁，依產品成套管理與保養。', parts: '冷鍛成形' },
    { id: 'T08', n: '工具車', en: 'Tool Cart', mat: '鋼板烤漆', role: '模具技師、設備維護工程師', use: '依 5S 形跡定位收納換模與保養工具。', parts: '—' },
    { id: 'T09', n: '工業平板', en: 'Rugged Tablet', mat: '強化外殼', role: '製程工程師、機台操作員', use: '查看 SOP、圖面、MES 工單與報工（本 App 中為模擬）。', parts: '—' },
    { id: 'T10', n: '量測記錄卡', en: 'Measurement Record Card', mat: '紙本／電子表單', role: '品質工程師', use: '記錄首件、巡檢數值與判定，作為追溯依據。', parts: '各工序' },
    { id: 'T11', n: '條碼掃描器', en: 'Barcode Scanner', mat: '工業塑膠', role: '物流技術員', use: '掃描料箱與批號標籤，連結工單與庫存。', parts: '料箱、成品', demo: 'scan' },
];
exports.ROLES = [
    { id: 'R1', n: '製程工程師', en: 'Process Engineer', duty: '分析工序與參數、制定作業標準、處理製程異常。', tools: ['T09', 'T05'], tasks: ['T5', 'T3'], ppe: '安全鞋、護目鏡；進入成形區配戴聽力防護。', color: '#36C5E8', pose: 'tablet', npc: 'hsu' },
    { id: 'R2', n: '機台操作員', en: 'Machine Operator', duty: '依 SOP 啟停設備、點檢、首件確認與報工。', tools: ['T09', 'T01'], tasks: ['T1', 'T2'], ppe: '安全帽（吊掛區）、護目鏡、耳罩、安全鞋；旋轉部件旁不戴棉紗手套。', color: '#F59E38', pose: 'panel', npc: 'lin' },
    { id: 'R3', n: '模具技師', en: 'Die Technician', duty: '模具檢查、研磨、換模與壽命管理。', tools: ['T07', 'T06', 'T08'], tasks: ['T1'], ppe: '換模時上鎖掛牌；搬運模具著安全鞋並使用吊具。', color: '#AEB8C4', pose: 'die', npc: 'chen' },
    { id: 'R4', n: '品質工程師', en: 'Quality Engineer', duty: '尺寸量測、SPC、判定與矯正預防。', tools: ['T01', 'T02', 'T03', 'T04', 'T10'], tasks: ['T2', 'T4'], ppe: '護目鏡；量測室依規定。', color: '#38B88A', pose: 'caliper', npc: 'huang' },
    { id: 'R5', n: '設備維護工程師', en: 'Maintenance Engineer', duty: '預防保養、故障排除、預測性維護資料判讀。', tools: ['T06', 'T08'], tasks: ['T3'], ppe: '維修前 LOTO、隔離標籤；絕緣手套依電氣作業風險使用。', color: '#B78CFF', pose: 'meter', npc: 'ho' },
    { id: 'R6', n: '物流技術員', en: 'Logistics Technician', duty: '物料與成品流轉、條碼追溯、AMR 調度。', tools: ['T11'], tasks: ['T4'], ppe: '反光背心、安全鞋；注意 AMR 與堆高機動線。', color: '#E95858', pose: 'scanner', npc: 'wu' },
];
exports.UNITS = [
    { id: 'U01', machine: 'M01', n: '冷鍛成形：從胚料到螺栓頭', goal: '理解多工位冷鍛的進料、切料、逐站成形與出料，能完成首件確認。', prep: ['確認工單、產品圖面與模具組編號', '穿戴 PPE：護目鏡、耳罩、安全鞋', '點檢潤滑、護罩連鎖、緊急停止鈕'], steps: ['線材經矯直導引送入，送料長度依設定', '切料機構切成胚料', '轉送夾爪移至第 1 站鐓粗', '第 2～3 站預成形與成形頭部', '最後一站整形／沖孔，出料', '首件量測頭部高度與外觀，合格後量產'], before: 'P02', after: 'P03', principle: '金屬在常溫下受壓產生塑性變形，體積不變而形狀改變；多站分段成形可降低單站變形量，減少裂紋。', check: ['頭部高度（游標卡尺）', '頭部有無裂紋、摺疊', '毛邊'], mistakes: ['送料長度錯誤造成頭部不飽滿或毛邊', '潤滑不足刮傷模具', '運轉中開護罩'], quiz: [
            { q: '多工位冷鍛分站成形的主要目的？', o: ['讓機台看起來更複雜', '分散每站變形量，降低裂紋與模具負荷', '減少用電'], a: 1, why: '分段成形讓每站變形量較小。' },
            { q: '需要伸手清除模具區卡料時應？', o: ['機台慢速運轉即可', '停機、上鎖掛牌、確認零能量後處理', '請同事看著緊急停止鈕'], a: 1, why: 'LOTO 是基本安全程序。' },
            { q: '送料長度太短最可能造成？', o: ['頭部不飽滿', '螺紋變長', '硬度上升'], a: 0, why: '胚料體積不足。' }
        ] },
    { id: 'U02', machine: 'M02', n: '搓牙：外螺紋的塑性成形', goal: '能說明搓牙與攻牙的差異，設定牙板間隙並以通止規判定。', prep: ['確認牙板規格與壽命計數', '準備螺紋環規（通／止）', '護目鏡'], steps: ['胚料排列進入送料軌道', '推料器把胚料推入牙板間', '往復牙板帶動胚料滾動壓出螺紋', '出料收集', '環規通端旋入、止端不入即合格'], before: 'P03', after: 'P04', principle: '牙板齒形擠壓材料流動形成牙峰牙谷，不切斷金屬纖維，強度與表面品質佳。', check: ['通止規', '外徑（千分尺）', '錯牙、缺牙'], mistakes: ['把攻牙與搓牙混為一談', '間隙過小造成過度擠壓', '對位偏差產生錯牙'], quiz: [
            { q: '螺帽內螺紋通常以哪種方式加工？', o: ['搓牙', '攻牙', '冷鍛'], a: 1, why: '內螺紋用絲攻攻牙。' },
            { q: '螺紋環規「止端」可以完全旋入代表？', o: ['合格', '節徑可能偏小，不合格', '牙板很新'], a: 1, why: '止端不應旋入超過規定。' },
            { q: '搓牙相較切削螺紋的特點？', o: ['產生大量切屑', '金屬纖維連續、不產生切屑', '只能做內螺紋'], a: 1, why: '屬塑性成形。' }
        ] },
    { id: 'U03', machine: 'M03', n: '預置扭力螺帽：硬度與沖壓的配合', goal: '理解預置扭力的形成與「硬度 × 沖壓條件」的交互作用。', prep: ['確認來料熱處理硬度分級', '扭力扳手校正有效', '雙手按鈕與光柵功能測試'], steps: ['螺帽放入定位治具（防錯方向）', '雙手啟動沖壓', '感測器記錄深度與壓力', '抽樣以扭力工具檢測預置扭力'], before: 'N05', after: 'N06', principle: '局部受控變形使螺紋產生干涉，旋入時需克服額外扭力而達到防鬆。硬度與變形量需配合。', check: ['預置扭力在規格內', '無裂紋'], mistakes: ['不分硬度一律同條件沖壓', '直接把模型建議寫入機台'], quiz: [
            { q: 'TWI753649B 公開專利的重點描述為？', o: ['一般熱處理方法', '熱處理後硬度與特定軸向沖壓條件的配合', '螺栓搓牙方法'], a: 1, why: '不可簡化為一般熱處理專利。' },
            { q: '光柵失效時可以生產嗎？', o: ['可以，小心一點', '不可以，須修復並驗證', '只在夜班可以'], a: 1, why: '安全裝置失效禁止生產。' }
        ] },
    { id: 'U04', machine: 'M04', n: '熱處理：看不見的品質', goal: '認識淬火、回火與特殊製程控制。', prep: ['確認爐溫曲線與熱電偶校正', '依產品設定網帶速度與裝載量'], steps: ['均勻投料', '加熱區升溫保持', '淬火急冷', '回火調整硬度', '抽樣硬度檢驗並記錄爐次'], before: 'P04', after: 'P05', principle: '加熱使組織轉變，急冷得到高硬度組織，回火降低脆性。結果無法只靠外觀判斷，需製程監控。', check: ['硬度', '脫碳', '變形'], mistakes: ['溫度異常仍出貨', '過度堆疊受熱不均'], quiz: [
            { q: '為什麼熱處理被稱為特殊製程？', o: ['因為很貴', '結果無法只靠最終檢驗完全確認，需過程控制', '因為只有夜班做'], a: 1, why: '需以參數監控與確效。' },
            { q: '回火的主要目的？', o: ['提高脆性', '降低脆性並調整硬度', '增加鍍層厚度'], a: 1, why: '回火平衡硬度與韌性。' }
        ] },
    { id: 'U05', machine: 'M05', n: '表面處理：防蝕與摩擦係數', goal: '了解表面處理的目的與品質重點（原理）。', prep: ['確認產品規格的鍍層種類與膜厚'], steps: ['前處理', '鍍層／塗層', '水洗', '乾燥固化', '膜厚與外觀檢驗'], before: 'P05', after: 'P06', principle: '保護層阻隔腐蝕環境；膜厚與表面狀態會改變摩擦係數，影響鎖附扭力與夾緊力關係。', check: ['膜厚', '附著性', '外觀'], mistakes: ['膜厚過厚影響螺紋配合'], quiz: [
            { q: '膜厚過厚可能造成？', o: ['螺紋配合變緊、摩擦係數改變', '硬度上升', '材料變成不鏽鋼'], a: 0, why: '膜厚影響配合與摩擦。' }
        ] },
    { id: 'U06', machine: 'M06', n: 'AOI 光學篩選：檢出率 vs 誤判率', goal: '能調整門檻並理解漏檢與誤判的成本。', prep: ['清潔鏡頭與轉盤', '以標準樣品（良品／不良品）驗證'], steps: ['振動盤送料', '轉盤經過相機與光源', '影像判定', '氣嘴分流 NG', '定時以標準樣品驗證'], before: 'P06', after: 'P07', principle: '以光學影像擷取外觀特徵，與門檻比較判定。門檻越嚴格，漏檢少但誤判多。', check: ['標準樣品驗證', '漏檢率', '誤判率'], mistakes: ['為了降低誤判把門檻整體調鬆', '鏡頭髒污未點檢'], quiz: [
            { q: '門檻調嚴格（降低）會？', o: ['漏檢增加', '誤判增加、漏檢減少', '兩者都減少'], a: 1, why: '檢出率與誤判率是取捨。' },
            { q: 'AOI 每班開線前應？', o: ['直接生產', '以標準樣品驗證判定正確', '把門檻調到最鬆'], a: 1, why: '確認檢測系統有效。' }
        ] },
    { id: 'U07', machine: 'M07', n: '自動化與物流：從工站到倉儲', goal: '了解機械手臂、AMR 與條碼追溯如何串起物流。', prep: ['確認圍籬門連鎖', 'AMR 路線淨空'], steps: ['手臂取件組裝套管', '放入料箱並計數', '輸送帶送往包裝', '貼追溯標籤', 'AMR 搬運入庫'], before: 'P07', after: 'P07', principle: '以標準容器與條碼串連實物流與資訊流，讓每箱成品都能追溯工單與批號。', check: ['數量', '標籤', '組裝到位'], mistakes: ['手動繞過圍籬連鎖', '標籤與實物不符'], quiz: [
            { q: '條碼標籤最主要的價值？', o: ['美觀', '連結實物與工單、批號，達成追溯', '增加重量'], a: 1, why: '追溯是品質與物流的基礎。' }
        ] },
];
const near = (v, lo, hi) => (v < lo ? lo - v : v > hi ? v - hi : 0);
exports.TASKS = [
    { id: 'T1', n: '冷鍛成形首件', machine: 'M01', role: 'R2', next: 'T2', desc: '完成 M10 六角螺栓胚體的冷鍛首件，頭部高度須在規格內。', part: { ok: 'P02', opts: ['P02', 'P01', 'N03'] },
        checks: [{ id: 'guard', n: '護罩連鎖測試', bad: '護罩連鎖開關鬆脫', fix: '通報保養修復並驗證' }, { id: 'lube', n: '潤滑油位' }, { id: 'die', n: '模具壽命計數', bad: '第 3 站模具超過壽命 8%', fix: '更換模具並重設計數' }, { id: 'estop', n: '緊急停止鈕復歸' }],
        tool: 'T01', spec: { n: '頭部高度', lo: 6.2, hi: 6.6, unit: 'mm' }, measure: (p) => 6.4 + (p.feedLen - 45) * 0.45 + near(p.speed, 80, 90) * 0.01 },
    { id: 'T2', n: '搓牙與螺紋判定', machine: 'M02', role: 'R4', next: 'T3', desc: '設定牙板間隙完成搓牙，以螺紋環規判定合格。', part: { ok: 'P03', opts: ['P03', 'P02', 'N05'] },
        checks: [{ id: 'die', n: '牙板壽命', bad: '牙板已達壽命 95%', fix: '更換牙板' }, { id: 'rail', n: '送料軌道方向' }, { id: 'gauge', n: '環規校正有效期', bad: '止端環規校正逾期', fix: '換用有效期內環規' }],
        tool: 'T03', spec: { n: '螺紋外徑', lo: 9.79, hi: 9.97, unit: 'mm' }, measure: (p) => 9.88 + (p.gap - 6.7) * 0.9 + Math.abs(p.align) * 0.02 },
    { id: 'T3', n: '熱處理批次硬度', machine: 'M04', role: 'R5', next: 'T4', desc: '設定爐溫與回火條件，使硬度落在規格（虛構指數）內。', part: { ok: 'P04', opts: ['P04', 'P06', 'P03'] },
        checks: [{ id: 'tc', n: '熱電偶校正', bad: '第二區熱電偶讀值跳動', fix: '更換熱電偶並校正' }, { id: 'belt', n: '網帶張力' }, { id: 'vent', n: '排氣與消防設備' }],
        tool: 'T10', spec: { n: '硬度（虛構指數）', lo: 32, hi: 39, unit: '' }, measure: (p) => 35.5 + p.tq * 0.6 - p.tt * 0.7 - near(p.load, 70, 88) * 0.15 },
    { id: 'T4', n: 'AOI 篩選驗證', machine: 'M06', role: 'R4', desc: '調整門檻與光源，讓標準樣品驗證的漏檢數為 0、誤判率低於 3%。', part: { ok: 'P06', opts: ['P06', 'P05', 'P04'] },
        checks: [{ id: 'lens', n: '鏡頭清潔', bad: '鏡頭有油霧', fix: '停機清潔鏡頭' }, { id: 'std', n: '標準樣品組' }, { id: 'air', n: '吹氣嘴氣壓' }],
        tool: 'T10', spec: { n: '誤判率', lo: 0, hi: 3, unit: '%' }, measure: (p) => 0.4 + 9 * Math.exp(-p.th * 5) + near(p.lux, 70, 90) * 0.08 },
    { id: 'T5', n: '預置扭力螺帽沖壓', machine: 'M03', role: 'R1', desc: '依來料硬度設定沖壓深度，使預置扭力（虛構單位）在規格內。', part: { ok: 'N05', opts: ['N05', 'N03', 'P04'] },
        checks: [{ id: 'curtain', n: '光柵功能測試', bad: '光柵間歇失效', fix: '更換光柵並驗證連鎖' }, { id: 'twohand', n: '雙手按鈕' }, { id: 'torque', n: '扭力扳手校正' }],
        tool: 'T05', spec: { n: '預置扭力', lo: 8.8, hi: 11.2, unit: '' }, measure: (p) => 4 + 0.12 * p.hard + 4.2 * p.depth - 0.03 * Math.max(0, p.hard - 34) * 10 * p.depth },
];
exports.CELLS = [
    { id: 'A1', n: '原材料、送料與進料檢驗', x: 0, y: 0, items: ['P01'], machines: [] },
    { id: 'A2', n: '高架資訊螢幕與中央指示系統', x: 1, y: 0, items: [], machines: [] },
    { id: 'A3', n: '熱處理與表面處理', x: 2, y: 0, items: [], machines: ['M04', 'M05'] },
    { id: 'B1', n: '主要成形設備', x: 0, y: 1, items: [], machines: ['M01'] },
    { id: 'B2', n: '核心互動工作站', x: 1, y: 1, items: [], machines: ['M02'] },
    { id: 'B3', n: '二次加工與精密設備', x: 2, y: 1, items: [], machines: ['M03'] },
    { id: 'C1', n: '模具與工具管理', x: 0, y: 2, items: ['T07', 'T08'], machines: [] },
    { id: 'C2', n: '工件檢視與操作介面', x: 1, y: 2, items: ['P04'], machines: [] },
    { id: 'C3', n: '品質檢查、包裝與物流', x: 2, y: 2, items: [], machines: ['M06', 'M07'] },
];

};
factories["./app/machines.tsx"]=function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAGES = void 0;
exports.MachineArt = MachineArt;
exports.ToolIcon = ToolIcon;
const react_1 = __importDefault(require("react"));
exports.STAGES = {
    M01: ['送料', '切料', '鐓粗', '預成形', '成形頭部', '出料'], M02: ['送料', '推入', '滾壓成形', '出料'], M03: ['定位', '雙手啟動', '軸向沖壓', '行程量測'],
    M04: ['投料', '加熱', '淬火', '回火', '出爐'], M05: ['前處理', '鍍層／塗層', '水洗', '乾燥固化'], M06: ['送料排列', '多角度拍攝', '影像判定', 'OK／NG 分流'],
    M07: ['取件', '套管組裝', '裝箱計數', '貼追溯標籤', 'AMR 搬運'],
};
const Defs = () => (react_1.default.createElement("defs", null,
    react_1.default.createElement("linearGradient", { id: "mg", x1: "0", y1: "0", x2: "0", y2: "1" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#d7dee7" }),
        react_1.default.createElement("stop", { offset: ".35", stopColor: "#8f9cad" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#445060" })),
    react_1.default.createElement("linearGradient", { id: "mgs", x1: "0", y1: "0", x2: "1", y2: "0" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#5a6676" }),
        react_1.default.createElement("stop", { offset: ".2", stopColor: "#b7c3d2" }),
        react_1.default.createElement("stop", { offset: ".5", stopColor: "#eef4fa" }),
        react_1.default.createElement("stop", { offset: ".8", stopColor: "#9aa7b8" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#4c5767" })),
    react_1.default.createElement("linearGradient", { id: "body", x1: "0", y1: "0", x2: "0", y2: "1" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#36475f" }),
        react_1.default.createElement("stop", { offset: ".55", stopColor: "#223043" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#141d29" })),
    react_1.default.createElement("linearGradient", { id: "side", x1: "0", y1: "0", x2: "1", y2: "0" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#151e2a" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#263446" })),
    react_1.default.createElement("linearGradient", { id: "screen", x1: "0", y1: "0", x2: "1", y2: "1" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#0c2337" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#06131f" })),
    react_1.default.createElement("linearGradient", { id: "hot", x1: "0", y1: "0", x2: "1", y2: "0" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#ff7a2e" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#ffc95e" })),
    react_1.default.createElement("linearGradient", { id: "floorg", x1: "0", y1: "0", x2: "0", y2: "1" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#1a2430" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#0e151d" })),
    react_1.default.createElement("pattern", { id: "haz", width: "12", height: "12", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" },
        react_1.default.createElement("rect", { width: "6", height: "12", fill: "#F59E38" }),
        react_1.default.createElement("rect", { x: "6", width: "6", height: "12", fill: "#202831" })),
    react_1.default.createElement("pattern", { id: "grid", width: "34", height: "18", patternUnits: "userSpaceOnUse" },
        react_1.default.createElement("path", { d: "M0 18 H34 M0 0 V18", stroke: "#1f2b39", strokeOpacity: ".4" })),
    react_1.default.createElement("radialGradient", { id: "glow" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#36C5E8", stopOpacity: ".55" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#36C5E8", stopOpacity: "0" })),
    react_1.default.createElement("radialGradient", { id: "warnGlow" },
        react_1.default.createElement("stop", { offset: "0", stopColor: "#f59e38", stopOpacity: ".42" }),
        react_1.default.createElement("stop", { offset: "1", stopColor: "#f59e38", stopOpacity: "0" })),
    react_1.default.createElement("filter", { id: "sh", x: "-20%", y: "-20%", width: "140%", height: "160%" },
        react_1.default.createElement("feDropShadow", { dx: "0", dy: "6", stdDeviation: "5", floodColor: "#000", floodOpacity: ".45" }))));
const Floor = () => react_1.default.createElement("g", null,
    react_1.default.createElement("path", { d: "M0 246 H560 V290 H0Z", fill: "url(#floorg)" }),
    react_1.default.createElement("rect", { x: "0", y: "246", width: "560", height: "44", fill: "url(#grid)", opacity: ".65" }),
    react_1.default.createElement("path", { d: "M0 246 H560", stroke: "#324358", strokeWidth: "2" }),
    react_1.default.createElement("path", { d: "M20 264 H540", stroke: "url(#haz)", strokeWidth: "6", opacity: ".82" }),
    react_1.default.createElement("ellipse", { cx: "280", cy: "262", rx: "210", ry: "18", fill: "#000", opacity: ".13" }));
const Panel = ({ x, y, state }) => (react_1.default.createElement("g", { transform: `translate(${x} ${y})` },
    react_1.default.createElement("rect", { width: "56", height: "78", rx: "6", fill: "#182232", stroke: "#4d607a" }),
    react_1.default.createElement("rect", { x: "6", y: "6", width: "44", height: "26", rx: "3", fill: "url(#screen)", stroke: "#36C5E8", strokeOpacity: ".6" }),
    react_1.default.createElement("rect", { x: "9", y: "10", width: "38", height: "6", rx: "2", fill: "rgba(255,255,255,.08)" }),
    react_1.default.createElement("text", { x: "28", y: "23", textAnchor: "middle", fontSize: "8", fill: state === 'estop' || state === 'fault' ? '#E95858' : state === 'running' ? '#38B88A' : state === 'warning' ? '#F59E38' : '#36C5E8' }, { running: 'RUN', estop: 'E-STOP', fault: 'FAULT', warning: 'WARN', maintenance: 'LOTO', paused: 'PAUSE' }[state] || 'READY'),
    react_1.default.createElement("circle", { cx: "16", cy: "48", r: "5.2", fill: "#38B88A" }),
    react_1.default.createElement("circle", { cx: "30", cy: "48", r: "5.2", fill: "#AEB8C4" }),
    react_1.default.createElement("circle", { cx: "28", cy: "66", r: "8.4", fill: "#E95858", stroke: "#F59E38", strokeWidth: "2.5" }),
    state === 'warning' && react_1.default.createElement("circle", { cx: "28", cy: "18", r: "12", fill: "url(#warnGlow)" })));
function M01({ inside, stage }) {
    return (react_1.default.createElement("g", null,
        react_1.default.createElement("g", { filter: "url(#sh)" },
            react_1.default.createElement("ellipse", { cx: "45", cy: "200", rx: "34", ry: "42", fill: "none", stroke: "#6b5a48", strokeWidth: "9" }),
            react_1.default.createElement("ellipse", { cx: "45", cy: "200", rx: "22", ry: "28", fill: "none", stroke: "#7d6a55", strokeWidth: "6" }),
            react_1.default.createElement("path", { d: "M70 200 L130 196 L200 190", stroke: "#9aa6b4", strokeWidth: "4", fill: "none", className: "anim wire" }),
            react_1.default.createElement("g", { className: "anim spin", style: { transformOrigin: '110px 198px' } },
                react_1.default.createElement("circle", { cx: "110", cy: "198", r: "13", fill: "url(#mgs)" }),
                react_1.default.createElement("path", { d: "M110 185 V211 M97 198 H123", stroke: "#3a4656", strokeWidth: "3" })),
            react_1.default.createElement("path", { d: "M170 60 L470 60 L500 80 L500 250 L170 250 Z", fill: "url(#body)", stroke: "#3a4b62" }),
            react_1.default.createElement("path", { d: "M470 60 L500 80 L500 250 L470 250Z", fill: "url(#side)" }),
            react_1.default.createElement("rect", { x: "185", y: "72", width: "270", height: "22", rx: "4", fill: "url(#mg)" }),
            react_1.default.createElement("g", { className: "anim ram" },
                react_1.default.createElement("rect", { x: "210", y: "96", width: "220", height: "30", rx: "3", fill: "url(#mgs)" }),
                [0, 1, 2, 3].map((i) => react_1.default.createElement("rect", { key: i, x: 226 + i * 52, y: "126", width: "18", height: "26", fill: "#cfd8e2", stroke: "#56606e" }))),
            react_1.default.createElement("rect", { x: "205", y: "178", width: "230", height: "40", rx: "3", fill: "#3a4656", stroke: "#5d6c80" }),
            [0, 1, 2, 3].map((i) => react_1.default.createElement("g", { key: i },
                react_1.default.createElement("rect", { x: 222 + i * 52, y: "182", width: "26", height: "32", fill: stage === i + 2 ? '#F59E38' : '#202a37', stroke: "#7a8aa0" }),
                react_1.default.createElement("text", { x: 235 + i * 52, y: "232", fontSize: "9", textAnchor: "middle", fill: "#AEB8C4" },
                    i + 1,
                    "\u7AD9"))),
            react_1.default.createElement("g", { className: "anim transfer" },
                react_1.default.createElement("rect", { x: "214", y: "160", width: "40", height: "7", rx: "2", fill: "#F59E38" }),
                react_1.default.createElement("rect", { x: "214", y: "160", width: "6", height: "16", fill: "#F59E38" }),
                react_1.default.createElement("rect", { x: "248", y: "160", width: "6", height: "16", fill: "#F59E38" })),
            react_1.default.createElement("rect", { x: "198", y: "140", width: "244", height: "86", rx: "4", fill: inside ? 'rgba(54,197,232,.06)' : 'rgba(150,180,210,.18)', stroke: "#36C5E8", strokeOpacity: ".6", strokeDasharray: inside ? '5 4' : undefined }),
            react_1.default.createElement("path", { d: "M440 214 L500 236 L520 236", stroke: "#8a96a5", strokeWidth: "8", fill: "none" }),
            react_1.default.createElement("g", { className: "anim drop" }, [0, 1, 2].map((i) => react_1.default.createElement("g", { key: i, transform: `translate(${470 + i * 14} 220)` },
                react_1.default.createElement("rect", { x: "-4", y: "0", width: "8", height: "5", fill: "#dfe6ee" }),
                react_1.default.createElement("rect", { x: "-2", y: "5", width: "4", height: "9", fill: "#c9d2dc" })))),
            react_1.default.createElement("rect", { x: "490", y: "236", width: "56", height: "18", rx: "2", fill: "#3b4c63" })),
        inside && react_1.default.createElement("g", null,
            react_1.default.createElement("path", { d: "M300 30 Q330 18 360 30", stroke: "#36C5E8", fill: "none" }),
            react_1.default.createElement("circle", { cx: "330", cy: "40", r: "18", fill: "none", stroke: "#36C5E8", strokeDasharray: "4 4", className: "anim spin", style: { transformOrigin: '330px 40px' } }),
            react_1.default.createElement("text", { x: "330", y: "16", textAnchor: "middle", fontSize: "10", fill: "#36C5E8" }, "\u66F2\u8EF8\u9A45\u52D5\uFF08\u793A\u610F\uFF09"))));
}
function M02({ inside }) {
    return (react_1.default.createElement("g", { filter: "url(#sh)" },
        react_1.default.createElement("path", { d: "M150 40 L460 40 L490 60 L490 250 L150 250Z", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("path", { d: "M460 40 L490 60 L490 250 L460 250Z", fill: "url(#side)" }),
        react_1.default.createElement("path", { d: "M30 60 L230 150", stroke: "#8a96a5", strokeWidth: "10" }),
        react_1.default.createElement("g", { className: "anim feed" }, [0, 1, 2, 3].map((i) => react_1.default.createElement("g", { key: i, transform: `translate(${60 + i * 40} ${74 + i * 18}) rotate(24)` },
            react_1.default.createElement("rect", { x: "-6", y: "-4", width: "12", height: "7", fill: "#dfe6ee" }),
            react_1.default.createElement("rect", { x: "-3", y: "3", width: "6", height: "14", fill: "#c9d2dc" })))),
        react_1.default.createElement("rect", { x: "230", y: "96", width: "170", height: "32", fill: "url(#mgs)", stroke: "#4a5563" }),
        react_1.default.createElement("text", { x: "315", y: "91", fontSize: "9", fill: "#AEB8C4", textAnchor: "middle" }, "\u56FA\u5B9A\u7259\u677F"),
        Array.from({ length: 16 }, (_, i) => react_1.default.createElement("path", { key: i, d: `M${238 + i * 10} 128 l5 6 l5 -6`, stroke: "#3a4656", fill: "none" })),
        react_1.default.createElement("g", { className: "anim slide" },
            react_1.default.createElement("rect", { x: "230", y: "170", width: "170", height: "32", fill: "url(#mgs)", stroke: "#4a5563" }),
            Array.from({ length: 16 }, (_, i) => react_1.default.createElement("path", { key: i, d: `M${238 + i * 10} 170 l5 -6 l5 6`, stroke: "#3a4656", fill: "none" }))),
        react_1.default.createElement("text", { x: "315", y: "216", fontSize: "9", fill: "#AEB8C4", textAnchor: "middle" }, "\u5F80\u5FA9\u7259\u677F"),
        react_1.default.createElement("g", { className: "anim roll", style: { transformOrigin: '300px 150px' } },
            react_1.default.createElement("circle", { cx: "300", cy: "150", r: "17", fill: "#c9d2dc", stroke: "#56606e" }),
            react_1.default.createElement("path", { d: "M300 133 V167 M283 150 H317", stroke: "#56606e" })),
        inside && react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "225", y: "88", width: "180", height: "122", fill: "none", stroke: "#36C5E8", strokeDasharray: "5 4" }),
            react_1.default.createElement("text", { x: "420", y: "150", fontSize: "10", fill: "#36C5E8" }, "\u5851\u6027\u8B8A\u5F62\u5340")),
        react_1.default.createElement("path", { d: "M400 180 L470 230", stroke: "#8a96a5", strokeWidth: "8" }),
        react_1.default.createElement("rect", { x: "450", y: "228", width: "70", height: "24", rx: "2", fill: "#3b4c63" }),
        react_1.default.createElement("rect", { x: "165", y: "140", width: "58", height: "12", fill: "#F59E38", className: "anim push" })));
}
function M03({ inside }) {
    return (react_1.default.createElement("g", { filter: "url(#sh)" },
        react_1.default.createElement("path", { d: "M150 30 L260 30 L260 70 L200 70 L200 210 L380 210 L380 250 L150 250Z", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("rect", { x: "150", y: "30", width: "230", height: "40", rx: "4", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("g", { className: "anim press" },
            react_1.default.createElement("rect", { x: "270", y: "70", width: "60", height: "50", fill: "url(#mgs)", stroke: "#4a5563" }),
            react_1.default.createElement("rect", { x: "285", y: "120", width: "30", height: "20", fill: "#cfd8e2" })),
        react_1.default.createElement("rect", { x: "255", y: "185", width: "90", height: "25", fill: "#3a4656", stroke: "#5d6c80" }),
        react_1.default.createElement("polygon", { points: "285,170 315,170 325,178 315,186 285,186 275,178", fill: "#AEB8C4", stroke: "#56606e" }),
        react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "390", y: "90", width: "2", height: "150", fill: "#E95858", opacity: ".7", className: "anim blink" }),
            react_1.default.createElement("rect", { x: "235", y: "90", width: "2", height: "150", fill: "#E95858", opacity: ".7", className: "anim blink" }),
            react_1.default.createElement("text", { x: "395", y: "86", fontSize: "9", fill: "#E95858" }, "\u5149\u67F5")),
        react_1.default.createElement("rect", { x: "420", y: "80", width: "90", height: "56", rx: "4", fill: "#06131f", stroke: "#36C5E8" }),
        react_1.default.createElement("polyline", { points: "428,124 445,120 460,96 474,92 490,118 502,122", fill: "none", stroke: "#38B88A", strokeWidth: "2", className: "anim trace" }),
        react_1.default.createElement("text", { x: "465", y: "148", fontSize: "9", fill: "#AEB8C4", textAnchor: "middle" }, "\u884C\u7A0B\uFF0F\u58D3\u529B\u66F2\u7DDA"),
        inside && react_1.default.createElement("text", { x: "300", y: "163", fontSize: "10", fill: "#36C5E8", textAnchor: "middle" }, "\u53D7\u63A7\u5C40\u90E8\u8B8A\u5F62 \u2192 \u9810\u7F6E\u626D\u529B"),
        react_1.default.createElement("circle", { cx: "210", cy: "232", r: "9", fill: "#38B88A" }),
        react_1.default.createElement("circle", { cx: "370", cy: "232", r: "9", fill: "#38B88A" })));
}
function M04({ inside }) {
    return (react_1.default.createElement("g", { filter: "url(#sh)" },
        react_1.default.createElement("path", { d: "M20 170 L540 170", stroke: "#5d6c80", strokeWidth: "10" }),
        react_1.default.createElement("g", { className: "anim belt" }, Array.from({ length: 18 }, (_, i) => react_1.default.createElement("rect", { key: i, x: 20 + i * 30, y: "160", width: "10", height: "8", rx: "2", fill: i > 3 && i < 9 ? '#ff9a4a' : i >= 9 && i < 12 ? '#7b8796' : '#AEB8C4' }))),
        react_1.default.createElement("path", { d: "M90 60 L270 60 L290 75 L290 168 L90 168Z", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("rect", { x: "100", y: "100", width: "180", height: "56", fill: inside ? 'url(#hot)' : '#2a1a14', opacity: inside ? 0.8 : 1 }),
        react_1.default.createElement("text", { x: "190", y: "90", textAnchor: "middle", fontSize: "11", fill: "#ffb26b" }, "\u52A0\u71B1\u5340"),
        react_1.default.createElement("rect", { x: "296", y: "180", width: "80", height: "62", rx: "3", fill: "#0f2033", stroke: "#3a4b62" }),
        react_1.default.createElement("text", { x: "336", y: "250", fontSize: "10", textAnchor: "middle", fill: "#36C5E8" }, "\u6DEC\u706B\u69FD"),
        react_1.default.createElement("g", { className: "anim bubble" }, [0, 1, 2, 3].map((i) => react_1.default.createElement("circle", { key: i, cx: 312 + i * 16, cy: 225, r: "3", fill: "#36C5E8", opacity: ".6" }))),
        react_1.default.createElement("path", { d: "M390 80 L520 80 L535 92 L535 168 L390 168Z", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("rect", { x: "400", y: "110", width: "125", height: "46", fill: inside ? '#7a4a2a' : '#22191a', opacity: ".8" }),
        react_1.default.createElement("text", { x: "462", y: "102", textAnchor: "middle", fontSize: "11", fill: "#ffd2a0" }, "\u56DE\u706B\u5340"),
        [130, 190, 250, 450].map((x, i) => react_1.default.createElement("g", { key: i },
            react_1.default.createElement("rect", { x: x - 18, y: "30", width: "36", height: "18", rx: "3", fill: "#06131f", stroke: "#36C5E8" }),
            react_1.default.createElement("text", { x: x, y: "43", fontSize: "9", fill: "#36C5E8", textAnchor: "middle", className: "anim blink" }, i < 3 ? 'T' + (i + 1) + ' ●' : 'T4 ●'))),
        react_1.default.createElement("g", { className: "anim steam", opacity: ".35" }, [0, 1, 2].map((i) => react_1.default.createElement("circle", { key: i, cx: 320 + i * 20, cy: 170, r: "8", fill: "#AEB8C4" })))));
}
function M05({ inside }) {
    const tanks = [{ x: 70, c: '#2a4a5a', n: '前處理' }, { x: 190, c: '#3a4e6a', n: '鍍層' }, { x: 310, c: '#284858', n: '水洗' }];
    return (react_1.default.createElement("g", { filter: "url(#sh)" },
        react_1.default.createElement("path", { d: "M40 50 L540 50", stroke: "url(#mg)", strokeWidth: "10" }),
        react_1.default.createElement("g", { className: "anim hoist" },
            react_1.default.createElement("rect", { x: "70", y: "56", width: "10", height: "70", fill: "#8a96a5" }),
            react_1.default.createElement("rect", { x: "45", y: "126", width: "60", height: "40", rx: "4", fill: "none", stroke: "#AEB8C4", strokeWidth: "3" }),
            [0, 1, 2].map((i) => react_1.default.createElement("rect", { key: i, x: 52 + i * 18, y: "134", width: "8", height: "24", fill: "#dfe6ee" }))),
        tanks.map((t) => react_1.default.createElement("g", { key: t.n },
            react_1.default.createElement("rect", { x: t.x - 10, y: "150", width: "110", height: "96", rx: "4", fill: "url(#body)", stroke: "#3a4b62" }),
            react_1.default.createElement("rect", { x: t.x - 4, y: "166", width: "98", height: "74", fill: t.c, opacity: ".9" }),
            react_1.default.createElement("text", { x: t.x + 45, y: "262", fontSize: "10", fill: "#AEB8C4", textAnchor: "middle" }, t.n))),
        react_1.default.createElement("rect", { x: "430", y: "120", width: "110", height: "126", rx: "4", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("text", { x: "485", y: "262", fontSize: "10", fill: "#AEB8C4", textAnchor: "middle" }, "\u4E7E\u71E5\u56FA\u5316"),
        react_1.default.createElement("rect", { x: "440", y: "140", width: "90", height: "50", fill: inside ? 'url(#hot)' : '#2a1f1a', opacity: ".6" }),
        react_1.default.createElement("g", { className: "anim drip" }, [0, 1, 2].map((i) => react_1.default.createElement("circle", { key: i, cx: 225 + i * 18, cy: 150, r: "2.5", fill: "#36C5E8" }))),
        inside && react_1.default.createElement("text", { x: "250", y: "120", fontSize: "10", fill: "#36C5E8", textAnchor: "middle" }, "\u539F\u7406\u793A\u610F\uFF1A\u4E0D\u63D0\u4F9B\u85E5\u6DB2\u64CD\u4F5C\u689D\u4EF6")));
}
function M06({ inside }) {
    return (react_1.default.createElement("g", { filter: "url(#sh)" },
        react_1.default.createElement("ellipse", { cx: "80", cy: "170", rx: "55", ry: "22", fill: "#3a4656", stroke: "#5d6c80" }),
        react_1.default.createElement("ellipse", { cx: "80", cy: "160", rx: "50", ry: "18", fill: "#202a37" }),
        react_1.default.createElement("text", { x: "80", y: "210", fontSize: "10", fill: "#AEB8C4", textAnchor: "middle" }, "\u632F\u52D5\u9001\u6599\u76E4"),
        react_1.default.createElement("path", { d: "M130 165 L220 172", stroke: "#8a96a5", strokeWidth: "6" }),
        react_1.default.createElement("ellipse", { cx: "300", cy: "178", rx: "110", ry: "34", fill: "rgba(160,210,240,.18)", stroke: "#9fd8ee" }),
        react_1.default.createElement("g", { className: "anim disc", style: { transformOrigin: '300px 178px' } }, Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return react_1.default.createElement("circle", { key: i, cx: 300 + 92 * Math.cos(a), cy: 178 + 28 * Math.sin(a), r: "5", fill: i === 3 ? '#E95858' : '#dfe6ee' }); })),
        [250, 330].map((x) => react_1.default.createElement("g", { key: x },
            react_1.default.createElement("rect", { x: x - 12, y: "60", width: "24", height: "34", rx: "3", fill: "#202831", stroke: "#5d6c80" }),
            react_1.default.createElement("circle", { cx: x, cy: "100", r: "9", fill: "#0b1520", stroke: "#36C5E8" }),
            react_1.default.createElement("ellipse", { cx: x, cy: "120", rx: "22", ry: "6", fill: "none", stroke: "#36C5E8", strokeWidth: "3", className: "anim blink" }),
            react_1.default.createElement("path", { d: `M${x} 110 L${x} 168`, stroke: "url(#glow)", strokeWidth: "26", opacity: ".5" }))),
        react_1.default.createElement("rect", { x: "440", y: "50", width: "104", height: "70", rx: "5", fill: "#06131f", stroke: "#36C5E8" }),
        react_1.default.createElement("text", { x: "452", y: "70", fontSize: "10", fill: "#38B88A" }, "OK  1,284"),
        react_1.default.createElement("text", { x: "452", y: "88", fontSize: "10", fill: "#E95858" }, "NG  3"),
        react_1.default.createElement("rect", { x: "452", y: "96", width: "80", height: "14", fill: "#122436" }),
        react_1.default.createElement("rect", { x: "452", y: "96", width: "62", height: "14", fill: "#36C5E8", className: "anim bar" }),
        react_1.default.createElement("path", { d: "M410 190 L460 220", stroke: "#8a96a5", strokeWidth: "6" }),
        react_1.default.createElement("rect", { x: "440", y: "220", width: "46", height: "26", rx: "2", fill: "#2a5a44" }),
        react_1.default.createElement("text", { x: "463", y: "238", fontSize: "9", textAnchor: "middle", fill: "#dfe" }, "OK"),
        react_1.default.createElement("rect", { x: "494", y: "220", width: "46", height: "26", rx: "2", fill: "#5a2a2a" }),
        react_1.default.createElement("text", { x: "517", y: "238", fontSize: "9", textAnchor: "middle", fill: "#fdd" }, "NG"),
        react_1.default.createElement("g", { className: "anim puff" },
            react_1.default.createElement("path", { d: "M398 168 l26 -8", stroke: "#AEB8C4", strokeWidth: "2", strokeDasharray: "3 3" })),
        inside && react_1.default.createElement("text", { x: "300", y: "232", fontSize: "10", fill: "#36C5E8", textAnchor: "middle" }, "\u80CC\u5149\u7A7F\u900F\u73BB\u7483\u8F49\u76E4 \u2192 \u8F2A\u5ED3\u5C3A\u5BF8\u91CF\u6E2C")));
}
function M07({ inside }) {
    return (react_1.default.createElement("g", { filter: "url(#sh)" },
        react_1.default.createElement("rect", { x: "40", y: "70", width: "230", height: "180", rx: "4", fill: "none", stroke: "#F59E38", strokeDasharray: "8 5" }),
        react_1.default.createElement("text", { x: "50", y: "64", fontSize: "10", fill: "#F59E38" }, "\u6A5F\u68B0\u624B\u81C2\u4F5C\u696D\u5340\uFF08\u570D\u7C6C\uFF0B\u9580\u9023\u9396\uFF09"),
        react_1.default.createElement("rect", { x: "120", y: "215", width: "60", height: "35", rx: "4", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("g", { className: "anim arm", style: { transformOrigin: '150px 215px' } },
            react_1.default.createElement("rect", { x: "142", y: "140", width: "16", height: "78", rx: "6", fill: "url(#mgs)" }),
            react_1.default.createElement("g", { className: "anim arm2", style: { transformOrigin: '150px 145px' } },
                react_1.default.createElement("rect", { x: "150", y: "138", width: "80", height: "14", rx: "6", fill: "url(#mgs)" }),
                react_1.default.createElement("path", { d: "M228 140 l12 -6 M228 150 l12 6", stroke: "#F59E38", strokeWidth: "4" }))),
        react_1.default.createElement("path", { d: "M200 232 L520 232", stroke: "#5d6c80", strokeWidth: "14" }),
        react_1.default.createElement("g", { className: "anim belt" }, Array.from({ length: 6 }, (_, i) => react_1.default.createElement("rect", { key: i, x: 210 + i * 52, y: "214", width: "34", height: "18", rx: "2", fill: "#2f5d8a", stroke: "#AEB8C4" }))),
        react_1.default.createElement("rect", { x: "430", y: "90", width: "110", height: "90", rx: "4", fill: "url(#body)", stroke: "#3a4b62" }),
        react_1.default.createElement("text", { x: "485", y: "140", fontSize: "11", fill: "#AEB8C4", textAnchor: "middle" }, "\u81EA\u52D5\u5305\u88DD"),
        react_1.default.createElement("g", { className: "anim amr" },
            react_1.default.createElement("rect", { x: "300", y: "252", width: "70", height: "18", rx: "6", fill: "#F59E38" }),
            react_1.default.createElement("circle", { cx: "314", cy: "272", r: "4", fill: "#222" }),
            react_1.default.createElement("circle", { cx: "356", cy: "272", r: "4", fill: "#222" }),
            react_1.default.createElement("rect", { x: "312", y: "238", width: "46", height: "14", fill: "#2f5d8a" })),
        react_1.default.createElement("g", { transform: "translate(400 150)" },
            react_1.default.createElement("rect", { width: "34", height: "22", fill: "#f0f4f8" }),
            [3, 6, 8, 12, 15, 18, 22, 25, 29].map((x) => react_1.default.createElement("rect", { key: x, x: x, y: "4", width: x % 2 ? 1 : 2, height: "12", fill: "#111" }))),
        inside && react_1.default.createElement("text", { x: "155", y: "110", fontSize: "10", fill: "#36C5E8", textAnchor: "middle" }, "\u516D\u8EF8\u624B\u81C2\uFF08\u7C21\u5316\u70BA\u5169\u8EF8\u793A\u610F\uFF09")));
}
const ART = { M01, M02, M03, M04, M05, M06, M07 };
function MachineArt(p) {
    const A = ART[p.m.id];
    const running = p.state === 'running' || p.state === 'warning';
    const st = exports.STAGES[p.m.id];
    return (react_1.default.createElement("div", { className: `mach ${running ? 'on' : ''} ${p.lowFx ? 'lowfx' : ''} state-${p.state} view-${p.view}`, style: { ['--spd']: Math.max(0.4, p.speed / 85) } },
        react_1.default.createElement("svg", { viewBox: "0 0 560 290", className: "mach-svg", role: "img", "aria-label": p.m.n },
            react_1.default.createElement(Defs, null),
            react_1.default.createElement("rect", { width: "560", height: "290", fill: "#0e1722" }),
            react_1.default.createElement("rect", { width: "560", height: "290", fill: "url(#glow)", opacity: ".14" }),
            react_1.default.createElement("path", { d: "M0 0 H560 V40 H0Z", fill: "#111c2a" }),
            react_1.default.createElement("rect", { x: "0", y: "38", width: "560", height: "4", fill: "rgba(54,197,232,.18)" }),
            [80, 240, 400].map((x) => react_1.default.createElement("g", { key: x },
                react_1.default.createElement("rect", { x: x, y: "0", width: "80", height: "6", fill: "#2b3a4f" }),
                react_1.default.createElement("ellipse", { cx: x + 40, cy: "10", rx: "30", ry: "5", fill: "#f0f4f8", opacity: ".25" }),
                react_1.default.createElement("path", { d: `M${x + 10} 12 L${x - 20} 250 L${x + 100} 250 L${x + 70} 12Z`, fill: "#f0f4f8", opacity: p.lowFx ? 0 : 0.03 }))),
            react_1.default.createElement(Floor, null),
            !p.lowFx && react_1.default.createElement("ellipse", { cx: "280", cy: "115", rx: "168", ry: "64", fill: "url(#glow)", opacity: ".1" }),
            react_1.default.createElement(A, { inside: p.view === 'inside', stage: running ? p.stage : -1 }),
            react_1.default.createElement(Panel, { x: 500, y: 160, state: p.state }),
            react_1.default.createElement("rect", { x: "10", y: "12", width: "150", height: "18", rx: "9", fill: "rgba(9,19,31,.78)", stroke: "rgba(54,197,232,.25)" }),
            react_1.default.createElement("text", { x: "85", y: "25", textAnchor: "middle", fontSize: "10", fill: "#cfe0f5" },
                p.m.id,
                "\uFF5C",
                p.m.n),
            p.state === 'estop' && react_1.default.createElement("g", null,
                react_1.default.createElement("rect", { width: "560", height: "290", fill: "rgba(233,88,88,.12)" }),
                react_1.default.createElement("text", { x: "280", y: "30", textAnchor: "middle", fontSize: "16", fontWeight: "800", fill: "#E95858" }, "\u26D4 \u7DCA\u6025\u505C\u6B62\uFF1A\u6240\u6709\u904B\u52D5\u5DF2\u505C\u6B62")),
            p.state === 'maintenance' && react_1.default.createElement("g", null,
                react_1.default.createElement("rect", { width: "560", height: "290", fill: "rgba(183,140,255,.08)" }),
                react_1.default.createElement("text", { x: "280", y: "30", textAnchor: "middle", fontSize: "14", fontWeight: "800", fill: "#B78CFF" }, "\uD83D\uDD12 \u4FDD\u990A\u4E2D\uFF1A\u5DF2\u4E0A\u9396\u639B\u724C")),
            p.state === 'fault' && react_1.default.createElement("text", { x: "280", y: "30", textAnchor: "middle", fontSize: "14", fontWeight: "800", fill: "#E95858" },
                "\u2716 \u6545\u969C\u505C\u6A5F\uFF1A",
                p.m.fault.n),
            p.state === 'warning' && react_1.default.createElement("text", { x: "280", y: "30", textAnchor: "middle", fontSize: "14", fontWeight: "800", fill: "#F59E38" },
                "\u26A0 ",
                p.m.warn.n),
            p.view !== 'station' && p.m.parts.map((pt, i) => (react_1.default.createElement("g", { key: pt.id, className: `hot ${p.sel === pt.id ? 'sel' : ''}`, onClick: () => p.onPart && p.onPart(pt.id), role: "button", "aria-label": pt.n },
                react_1.default.createElement("circle", { cx: pt.x, cy: pt.y, r: "11" }),
                react_1.default.createElement("text", { x: pt.x, y: pt.y + 4, textAnchor: "middle" }, i + 1))))),
        p.view === 'station' && react_1.default.createElement("div", { className: "stations" }, st.map((s, i) => react_1.default.createElement("div", { key: s, className: `stn-step ${running && p.stage === i ? 'on' : ''} ${p.stage > i ? 'done' : ''}` },
            react_1.default.createElement("b", null, i + 1),
            react_1.default.createElement("span", null, s))))));
}
function ToolIcon({ id, size = 64 }) {
    const g = {
        T01: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "8", y: "26", width: "48", height: "6", fill: "url(#mgs)" }),
            react_1.default.createElement("path", { d: "M14 26 V12 h5 v14 M46 26 V14 h5 v12", fill: "#cfd8e2", stroke: "#56606e" }),
            react_1.default.createElement("rect", { x: "34", y: "22", width: "14", height: "14", fill: "#AEB8C4" }),
            react_1.default.createElement("path", { d: "M10 32 h44", stroke: "#333", strokeDasharray: "1 2" })),
        T02: react_1.default.createElement("g", null,
            react_1.default.createElement("path", { d: "M12 20 a18 18 0 0 0 0 26 h8 a10 10 0 0 1 0 -26z", fill: "#F59E38" }),
            react_1.default.createElement("rect", { x: "20", y: "28", width: "8", height: "10", fill: "#cfd8e2" }),
            react_1.default.createElement("rect", { x: "34", y: "28", width: "22", height: "10", fill: "url(#mgs)" }),
            react_1.default.createElement("rect", { x: "50", y: "26", width: "8", height: "14", fill: "#AEB8C4" })),
        T03: react_1.default.createElement("g", null,
            react_1.default.createElement("circle", { cx: "32", cy: "32", r: "20", fill: "url(#mgs)" }),
            react_1.default.createElement("circle", { cx: "32", cy: "32", r: "9", fill: "#0e1722" }),
            react_1.default.createElement("circle", { cx: "32", cy: "32", r: "9", fill: "none", stroke: "#666", strokeDasharray: "2 1" }),
            react_1.default.createElement("text", { x: "32", y: "58", fontSize: "8", textAnchor: "middle", fill: "#38B88A" }, "GO")),
        T04: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "28", y: "10", width: "8", height: "30", fill: "#2f3a48" }),
            react_1.default.createElement("rect", { x: "26", y: "40", width: "12", height: "14", fill: "url(#mgs)" }),
            react_1.default.createElement("path", { d: "M26 44 h12 M26 48 h12 M26 52 h12", stroke: "#555" }),
            react_1.default.createElement("rect", { x: "27", y: "4", width: "10", height: "8", fill: "url(#mgs)" })),
        T05: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "8", y: "29", width: "40", height: "7", rx: "3", fill: "url(#mgs)", transform: "rotate(-20 28 32)" }),
            react_1.default.createElement("circle", { cx: "50", cy: "24", r: "7", fill: "#AEB8C4", stroke: "#56606e" }),
            react_1.default.createElement("rect", { x: "10", y: "34", width: "16", height: "9", rx: "3", fill: "#E95858", transform: "rotate(-20 18 38)" })),
        T06: react_1.default.createElement("g", null,
            react_1.default.createElement("circle", { cx: "32", cy: "28", r: "17", fill: "#f0f4f8", stroke: "#AEB8C4", strokeWidth: "3" }),
            react_1.default.createElement("path", { d: "M32 28 L42 20", stroke: "#E95858", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "30", y: "45", width: "4", height: "14", fill: "url(#mgs)" })),
        T07: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "10", y: "30", width: "44", height: "22", rx: "3", fill: "#3a4656" }),
            [0, 1, 2, 3].map((i) => react_1.default.createElement("circle", { key: i, cx: 17 + i * 10, cy: "41", r: "4", fill: "#AEB8C4" })),
            react_1.default.createElement("rect", { x: "14", y: "14", width: "8", height: "16", fill: "url(#mgs)" }),
            react_1.default.createElement("rect", { x: "30", y: "18", width: "8", height: "12", fill: "url(#mgs)" })),
        T08: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "12", y: "14", width: "40", height: "34", rx: "3", fill: "#E95858" }),
            react_1.default.createElement("path", { d: "M14 26 h36 M14 37 h36", stroke: "#7a2a2a" }),
            react_1.default.createElement("circle", { cx: "18", cy: "52", r: "4", fill: "#222" }),
            react_1.default.createElement("circle", { cx: "46", cy: "52", r: "4", fill: "#222" })),
        T09: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "10", y: "12", width: "44", height: "34", rx: "5", fill: "#202831", stroke: "#F59E38", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "15", y: "17", width: "34", height: "24", fill: "#0b2235" }),
            react_1.default.createElement("path", { d: "M18 36 l6 -8 l6 4 l8 -10", stroke: "#36C5E8", fill: "none" })),
        T10: react_1.default.createElement("g", null,
            react_1.default.createElement("rect", { x: "16", y: "8", width: "32", height: "46", rx: "3", fill: "#f0f4f8" }),
            [0, 1, 2, 3, 4].map((i) => react_1.default.createElement("path", { key: i, d: `M20 ${18 + i * 7} h24`, stroke: "#AEB8C4" })),
            react_1.default.createElement("rect", { x: "22", y: "5", width: "20", height: "6", rx: "2", fill: "#56606e" })),
        T11: react_1.default.createElement("g", null,
            react_1.default.createElement("path", { d: "M14 18 h30 l6 12 h-30z", fill: "#F59E38" }),
            react_1.default.createElement("rect", { x: "22", y: "30", width: "10", height: "22", rx: "3", fill: "#202831" }),
            react_1.default.createElement("path", { d: "M50 30 l8 8", stroke: "#E95858", strokeWidth: "2" })),
    };
    return react_1.default.createElement("svg", { viewBox: "0 0 64 64", width: size, height: size, className: "tool-ico" },
        react_1.default.createElement(Defs, null),
        g[id]);
}

};
factories["./app/people.tsx"]=function(module,exports,require){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Person = Person;
const react_1 = __importDefault(require("react"));
function Person({ role, angle = 'front', size = 160, act = 'idle', skin = '#eac09a', hair = '#2a1d16', }) {
    const accent = role.color || '#36C5E8';
    const isBack = angle === 'back';
    const isSide = angle === 'side';
    const isTq = angle === 'tq';
    const bodyScaleX = isSide ? 0.78 : isTq ? 0.9 : 1;
    const headShift = isSide ? 3 : isTq ? 2 : 0;
    const helmetShift = isSide ? 2 : 0;
    const armR = act === 'point' ? -65 : act === 'done' ? -148 : act === 'alert' ? -105 : act === 'check' ? -34 : -6;
    const armL = act === 'done' ? 24 : act === 'alert' ? -12 : 8;
    const bodyLean = act === 'point' ? -1.5 : act === 'alert' ? -1 : 0;
    const prop = role.pose;
    const gid = role.id.replace(/[^a-z0-9_-]/gi, '');
    const handProp = {
        tablet: (react_1.default.createElement("g", { className: "person-prop" },
            react_1.default.createElement("rect", { x: "-13", y: "-10", width: "26", height: "20", rx: "3", fill: "#202831", stroke: accent, strokeWidth: "1.5" }),
            react_1.default.createElement("rect", { x: "-9", y: "-6", width: "18", height: "12", rx: "1.5", fill: "#0b2235" }),
            react_1.default.createElement("circle", { cx: "0", cy: "7", r: "1.4", fill: "#8bdaf0" }))),
        panel: (react_1.default.createElement("g", { className: "person-prop" },
            react_1.default.createElement("rect", { x: "-8", y: "-7", width: "16", height: "14", rx: "2", fill: "#f0f4f8" }),
            react_1.default.createElement("path", { d: "M-4 -2 h8 M-4 1 h8 M-4 4 h6", stroke: "#56606e", strokeWidth: "1.4" }),
            react_1.default.createElement("path", { d: "M4 -6 L8 -10", stroke: "#202831", strokeWidth: "2" }))),
        die: (react_1.default.createElement("g", { className: "person-prop" },
            react_1.default.createElement("rect", { x: "-11", y: "-8", width: "22", height: "16", rx: "2.5", fill: "#56606e", stroke: "#aeb8c4" }),
            react_1.default.createElement("circle", { cx: "-4", cy: "0", r: "2.6", fill: "#ced7e1" }),
            react_1.default.createElement("circle", { cx: "4", cy: "0", r: "2.6", fill: "#ced7e1" }))),
        caliper: (react_1.default.createElement("g", { className: "person-prop" },
            react_1.default.createElement("rect", { x: "-15", y: "-2.2", width: "30", height: "4.4", rx: "1", fill: "#dfe7f0" }),
            react_1.default.createElement("path", { d: "M-12 -2 v-8 h3 v8 M8 -2 v-6 h3 v6", fill: "#dfe7f0", stroke: "#748192", strokeWidth: "0.6" }))),
        meter: (react_1.default.createElement("g", { className: "person-prop" },
            react_1.default.createElement("rect", { x: "-8", y: "-10", width: "16", height: "20", rx: "3", fill: "#F59E38", stroke: "#ffe0aa" }),
            react_1.default.createElement("rect", { x: "-5.5", y: "-7", width: "11", height: "7", rx: "1", fill: "#06131f" }),
            react_1.default.createElement("circle", { cx: "0", cy: "4", r: "2.2", fill: "#f0f4f8" }))),
        scanner: (react_1.default.createElement("g", { className: "person-prop" },
            react_1.default.createElement("path", { d: "M-9 -5 h12 l4 6 h-13z", fill: "#F59E38" }),
            react_1.default.createElement("rect", { x: "-4", y: "1", width: "6", height: "11", rx: "2", fill: "#202831" }),
            react_1.default.createElement("path", { d: "M6 -3 l7 -4", stroke: "#E95858", strokeWidth: "1.8" }))),
    };
    return (react_1.default.createElement("svg", { viewBox: "-72 -14 144 246", width: size * 0.58, height: size, className: `person act-${act} angle-${angle}`, role: "img", "aria-label": `${role.n}（${angle}）` },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("linearGradient", { id: `jkt-${gid}`, x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#3d679c" }),
                react_1.default.createElement("stop", { offset: "0.38", stopColor: "#23436d" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#132541" })),
            react_1.default.createElement("linearGradient", { id: `trim-${gid}`, x1: "0", y1: "0", x2: "1", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#ffcb85" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#e98b22" })),
            react_1.default.createElement("linearGradient", { id: `pants-${gid}`, x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#29456d" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#14253d" })),
            react_1.default.createElement("linearGradient", { id: `helmet-${gid}`, x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#fcfdff" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#c8d3df" })),
            react_1.default.createElement("radialGradient", { id: `visor-${gid}`, cx: "50%", cy: "45%", r: "70%" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "rgba(213,245,255,.65)" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "rgba(116,175,214,.12)" })),
            react_1.default.createElement("linearGradient", { id: `glove-${gid}`, x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#e8edf5" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#bac7d5" })),
            react_1.default.createElement("linearGradient", { id: `boot-${gid}`, x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#353b46" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#111317" })),
            react_1.default.createElement("filter", { id: `shadow-${gid}`, x: "-30%", y: "-20%", width: "160%", height: "170%" },
                react_1.default.createElement("feDropShadow", { dx: "0", dy: "6", stdDeviation: "5", floodColor: "#000", floodOpacity: ".38" }))),
        react_1.default.createElement("ellipse", { cx: "0", cy: "220", rx: "37", ry: "7", fill: "#000", opacity: ".35" }),
        react_1.default.createElement("g", { filter: `url(#shadow-${gid})`, transform: `translate(0 ${bodyLean}) scale(${bodyScaleX} 1)` },
            react_1.default.createElement("g", { className: "breathe" },
                react_1.default.createElement("g", { className: "legs" },
                    react_1.default.createElement("path", { d: "M-22 130 L-8 130 L-5 198 Q-11 201 -19 199 Z", fill: `url(#pants-${gid})` }),
                    react_1.default.createElement("path", { d: "M8 130 L22 130 L19 199 Q11 201 5 198 Z", fill: `url(#pants-${gid})` }),
                    react_1.default.createElement("path", { d: "M-21 166 h15", stroke: `url(#trim-${gid})`, strokeWidth: "3.2" }),
                    react_1.default.createElement("path", { d: "M6 166 h15", stroke: `url(#trim-${gid})`, strokeWidth: "3.2" }),
                    react_1.default.createElement("path", { d: "M-25 198 h21 v10 h-25 q-4 0 -4 -5 q0 -5 8 -5z", fill: `url(#boot-${gid})` }),
                    react_1.default.createElement("path", { d: "M4 208 v-10 h21 q8 0 8 5 q0 5 -4 5z", fill: `url(#boot-${gid})` })),
                react_1.default.createElement("g", { className: "torso" },
                    react_1.default.createElement("path", { d: "M-28 61 Q-27 55 -20 51 H20 Q27 55 28 61 L24 134 H-24 Z", fill: `url(#jkt-${gid})` }),
                    react_1.default.createElement("path", { d: "M-16 56 Q0 51 16 56", stroke: accent, strokeWidth: "3", fill: "none", opacity: ".95" }),
                    react_1.default.createElement("path", { d: "M-24 94 H24", stroke: `url(#trim-${gid})`, strokeWidth: "4" }),
                    react_1.default.createElement("path", { d: "M0 56 V133", stroke: "#102137", strokeWidth: "1.6", strokeDasharray: "2 2" }),
                    react_1.default.createElement("path", { d: "M-19 84 q9 8 18 0", stroke: "#5d7fb1", strokeOpacity: ".55", fill: "none" }),
                    react_1.default.createElement("path", { d: "M1 84 q9 8 18 0", stroke: "#5d7fb1", strokeOpacity: ".55", fill: "none" }),
                    react_1.default.createElement("rect", { x: "-16", y: "85", width: "13", height: "15", rx: "2.5", fill: "#19304c", stroke: "#5b7aa0" }),
                    react_1.default.createElement("rect", { x: "3", y: "85", width: "13", height: "15", rx: "2.5", fill: "#19304c", stroke: "#5b7aa0" }),
                    !isBack && (react_1.default.createElement("g", null,
                        react_1.default.createElement("rect", { x: "7", y: "67", width: "13", height: "18", rx: "2.4", fill: "#f0f4f8" }),
                        react_1.default.createElement("rect", { x: "9.5", y: "70", width: "8", height: "6", rx: "1.2", fill: accent }),
                        react_1.default.createElement("path", { d: "M13.5 60 V67", stroke: `url(#trim-${gid})`, strokeWidth: "2" }))),
                    isBack && react_1.default.createElement("text", { x: "0", y: "82", textAnchor: "middle", fontSize: "8", fontWeight: "800", fill: accent }, "SUMEEKO"),
                    react_1.default.createElement("path", { d: "M-15 133 q15 8 30 0", stroke: "#1c3048", strokeWidth: "4" })),
                react_1.default.createElement("g", { transform: `rotate(${armL} -25 62)`, className: "arm-l" },
                    react_1.default.createElement("path", { d: "M-34 58 q6 -5 12 0 l3 52 q-7 7 -14 0z", fill: `url(#jkt-${gid})` }),
                    react_1.default.createElement("rect", { x: "-35", y: "108", width: "15", height: "7", rx: "3.5", fill: `url(#trim-${gid})` }),
                    react_1.default.createElement("circle", { cx: "-26.5", cy: "119", r: "6", fill: `url(#glove-${gid})` })),
                react_1.default.createElement("g", { transform: `rotate(${armR} 25 62)`, className: "arm-r" },
                    react_1.default.createElement("path", { d: "M21 58 q6 -5 12 0 l-2 52 q-7 7 -14 0z", fill: `url(#jkt-${gid})` }),
                    react_1.default.createElement("rect", { x: "20", y: "108", width: "15", height: "7", rx: "3.5", fill: `url(#trim-${gid})` }),
                    react_1.default.createElement("circle", { cx: "27.5", cy: "119", r: "6", fill: `url(#glove-${gid})` }),
                    !isBack && react_1.default.createElement("g", { transform: "translate(27 122)" }, handProp[prop])),
                react_1.default.createElement("g", { className: "head", transform: `translate(${headShift} 0)` },
                    react_1.default.createElement("rect", { x: "-7", y: "43", width: "14", height: "14", rx: "4", fill: skin }),
                    react_1.default.createElement("ellipse", { cx: "0", cy: "31", rx: isSide ? 13 : 15.5, ry: "17.5", fill: isBack ? hair : skin }),
                    !isBack && (react_1.default.createElement("g", null,
                        react_1.default.createElement("path", { d: isSide ? 'M-10 31 Q-6 14 4 14 Q13 16 13 28 Q10 20 0 21 Q-9 20 -10 31Z' : 'M-15 28 Q-14 14 0 14 Q14 14 15 28 Q10 19 0 20 Q-10 19 -15 28Z', fill: hair }),
                        !isSide && react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement("ellipse", { cx: "-5.5", cy: "33", rx: "1.6", ry: "2", fill: "#1a1a1a" }),
                            react_1.default.createElement("ellipse", { cx: "5.5", cy: "33", rx: "1.6", ry: "2", fill: "#1a1a1a" })),
                        isSide && react_1.default.createElement("ellipse", { cx: "3.5", cy: "33", rx: "1.6", ry: "2", fill: "#1a1a1a" }),
                        react_1.default.createElement("path", { d: act === 'alert' ? 'M-4 42 Q0 40.5 4 42' : isSide ? 'M0 40.5 Q3 42 6 40.5' : 'M-4 40.5 Q0 43.5 4 40.5', stroke: "#7a3a2a", strokeWidth: "1.4", fill: "none" }),
                        react_1.default.createElement("rect", { x: "-12", y: "28", width: "24", height: "8", rx: "4", fill: `url(#visor-${gid})`, stroke: "#d8eef7", strokeWidth: "1" }))),
                    react_1.default.createElement("path", { d: `M${-18 + helmetShift} 24 Q-16 7 0 7 Q16 7 18 24`, fill: `url(#helmet-${gid})` }),
                    react_1.default.createElement("rect", { x: -20 + helmetShift, y: "22", width: "40", height: "4.5", rx: "2.2", fill: "#c3ceda" }),
                    react_1.default.createElement("path", { d: "M-7 10 Q0 7 7 10", stroke: accent, strokeWidth: "3.2" }),
                    react_1.default.createElement("rect", { x: -19 + helmetShift, y: "28", width: "6", height: "12", rx: "3", fill: `url(#trim-${gid})` }),
                    react_1.default.createElement("rect", { x: 13 + helmetShift, y: "28", width: "6", height: "12", rx: "3", fill: `url(#trim-${gid})` })))),
        act === 'done' && react_1.default.createElement("path", { className: "person-spark", d: "M44 18 l4 8 l8 2 l-8 2 l-4 8 l-4 -8 l-8 -2 l8 -2z", fill: "#ffe08d", opacity: ".92" })));
}

};
factories["./app/gl.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartRenderer = exports.FINISHES = void 0;
exports.buildShape = buildShape;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
function surface(m, f, nu, nv, flip = false) {
    flip = !flip;
    const P = [];
    for (let i = 0; i <= nu; i++) {
        P[i] = [];
        for (let j = 0; j <= nv; j++)
            P[i][j] = f(i / nu, j / nv);
    }
    const N = (i, j) => {
        const i0 = Math.max(0, i - 1), i1 = Math.min(nu, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(nv, j + 1);
        const n = norm(cross(sub(P[i1][j], P[i0][j]), sub(P[i][j1], P[i][j0])));
        return flip ? [-n[0], -n[1], -n[2]] : n;
    };
    for (let i = 0; i < nu; i++)
        for (let j = 0; j < nv; j++) {
            const q = flip ? [[i, j], [i, j + 1], [i + 1, j + 1], [i, j], [i + 1, j + 1], [i + 1, j]] : [[i, j], [i + 1, j], [i + 1, j + 1], [i, j], [i + 1, j + 1], [i, j + 1]];
            for (const [a, b] of q) {
                m.pos.push(...P[a][b]);
                m.nor.push(...N(a, b));
            }
        }
}
function lathe(m, prof, seg, flip = false) {
    const total = prof.length - 1;
    surface(m, (u, v) => { const k = Math.min(total - 1, Math.floor(v * total)), t = v * total - k; const r = prof[k][0] + (prof[k + 1][0] - prof[k][0]) * t, y = prof[k][1] + (prof[k + 1][1] - prof[k][1]) * t; const a = u * Math.PI * 2; return [r * Math.cos(a), y, r * Math.sin(a)]; }, seg, total * 2, flip);
}
function disk(m, y, r0, r1, seg, up) {
    surface(m, (u, v) => { const a = u * Math.PI * 2, r = r0 + (r1 - r0) * v; return [r * Math.cos(a), y, r * Math.sin(a)]; }, seg, 1, up);
}
function hexPrism(m, R, y0, y1, chamfer = 0.08) {
    const corner = (k) => { const a = (Math.PI / 3) * k + Math.PI / 6; return [R * Math.cos(a), R * Math.sin(a)]; };
    for (let k = 0; k < 6; k++) {
        const [x0, z0] = corner(k), [x1, z1] = corner(k + 1);
        const n = norm([(x0 + x1) / 2, 0, (z0 + z1) / 2]);
        const quad = [[x0, y0, z0], [x1, y1, z1], [x1, y0, z1], [x0, y0, z0], [x0, y1, z0], [x1, y1, z1]];
        for (const p of quad) {
            m.pos.push(...p);
            m.nor.push(...n);
        }
    }
    for (const [y, up] of [[y1, true], [y0, false]]) {
        for (let k = 0; k < 6; k++) {
            const [x0, z0] = corner(k), [x1, z1] = corner(k + 1);
            const tri = up ? [[0, y, 0], [x1, y, z1], [x0, y, z0]] : [[0, y, 0], [x0, y, z0], [x1, y, z1]];
            for (const p of tri) {
                m.pos.push(...p);
                m.nor.push(0, up ? 1 : -1, 0);
            }
        }
    }
    if (chamfer > 0)
        lathe(m, [[R * 0.99, y1 - 0.001], [R * 0.86, y1 + chamfer * 0.3]], 48);
}
function threadOuter(m, rMaj, depth, pitch, y0, y1, seg) {
    const turns = (y1 - y0) / pitch, nv = Math.ceil(turns * 18);
    surface(m, (u, v) => {
        const a = u * Math.PI * 2, y = y0 + (y1 - y0) * v;
        const ph = ((y - y0) / pitch - u) % 1, t = ph < 0 ? ph + 1 : ph;
        const tri = 1 - Math.abs(t * 2 - 1);
        const run = Math.min(1, (y1 - y) / (pitch * 1.2));
        const r = rMaj - depth + depth * tri * Math.max(0.15, run);
        return [r * Math.cos(a), y, r * Math.sin(a)];
    }, seg, nv);
}
function threadInner(m, rMin, depth, pitch, y0, y1, seg) {
    const turns = (y1 - y0) / pitch, nv = Math.ceil(turns * 18);
    surface(m, (u, v) => {
        const a = u * Math.PI * 2, y = y0 + (y1 - y0) * v;
        const ph = ((y - y0) / pitch - u) % 1, t = ph < 0 ? ph + 1 : ph;
        const r = rMin + depth * (1 - Math.abs(t * 2 - 1));
        return [r * Math.cos(a), y, r * Math.sin(a)];
    }, seg, nv, true);
}
function buildShape(shape, lo = false) {
    const m = { pos: [], nor: [] };
    const S = lo ? 32 : 72;
    if (shape === 'coil') {
        const turns = 5, R = 1.1, r = 0.11, h = 1.4;
        surface(m, (u, v) => { const t = u * turns * Math.PI * 2, c = [R * Math.cos(t), -h / 2 + h * u, R * Math.sin(t)]; const tang = norm([-R * Math.sin(t), h / (turns * Math.PI * 2), R * Math.cos(t)]); const nrm = norm([Math.cos(t), 0, Math.sin(t)]); const bi = cross(tang, nrm); const a = v * Math.PI * 2; return [c[0] + r * (nrm[0] * Math.cos(a) + bi[0] * Math.sin(a)), c[1] + r * (nrm[1] * Math.cos(a) + bi[1] * Math.sin(a)), c[2] + r * (nrm[2] * Math.cos(a) + bi[2] * Math.sin(a))]; }, lo ? 200 : 420, lo ? 8 : 14);
    }
    else if (shape === 'slug') {
        lathe(m, [[0.0, -0.8], [0.4, -0.8], [0.42, -0.78], [0.42, 0.78], [0.4, 0.8], [0, 0.8]], S);
    }
    else if (shape === 'blank' || shape === 'bolt' || shape === 'css') {
        const small = shape === 'css';
        const R = small ? 0.5 : 0.62, rS = small ? 0.27 : 0.36, top = 1.05, hh = small ? 0.36 : 0.42;
        hexPrism(m, R, top - hh, top);
        disk(m, top - hh, 0, R * 0.9, S, false);
        lathe(m, [[R * 0.88, top - hh], [R * 0.9, top - hh - 0.05], [rS, top - hh - 0.05]], S, true);
        const yT = -1.25, ySh = shape === 'blank' ? yT : -0.2;
        if (shape === 'blank')
            lathe(m, [[rS, top - hh - 0.05], [rS, yT + 0.05], [rS * 0.9, yT], [0, yT]], S, true);
        else {
            lathe(m, [[rS, top - hh - 0.05], [rS, ySh]], S, true);
            threadOuter(m, rS, small ? 0.045 : 0.06, small ? 0.1 : 0.15, yT + 0.04, ySh, S);
            lathe(m, [[rS - 0.06, yT + 0.04], [rS * 0.7, yT], [0, yT]], S, true);
        }
        if (small) {
            lathe(m, [[0.42, 0.62], [0.42, -0.05], [0.4, -0.08], [0.33, -0.08], [0.33, 0.62], [0.42, 0.62]], S, true);
        }
    }
    else if (shape === 'nut' || shape === 'nutblank') {
        const R = 0.75, h = 0.42, rh = 0.36;
        const corner = (k) => { const a = (Math.PI / 3) * k + Math.PI / 6; return [R * Math.cos(a), R * Math.sin(a)]; };
        for (let k = 0; k < 6; k++) {
            const [x0, z0] = corner(k), [x1, z1] = corner(k + 1);
            const n = norm([(x0 + x1) / 2, 0, (z0 + z1) / 2]);
            for (const p of [[x0, -h, z0], [x1, h, z1], [x1, -h, z1], [x0, -h, z0], [x0, h, z0], [x1, h, z1]]) {
                m.pos.push(...p);
                m.nor.push(...n);
            }
        }
        for (const [y, up] of [[h, true], [-h, false]]) {
            surface(m, (u, v) => { const a = u * Math.PI * 2; const k = Math.round(a / (Math.PI / 3)); const ro = (R * Math.cos(Math.PI / 6)) / Math.cos(a - k * Math.PI / 3); const r = rh + (ro - rh) * v; return [r * Math.cos(a), y, r * Math.sin(a)]; }, 72, 1, up);
        }
        if (shape === 'nut') {
            threadInner(m, rh - 0.06, 0.06, 0.15, -h, h, S);
            lathe(m, [[rh, h], [rh + 0.05, h + 0.001]], S, true);
        }
        else
            lathe(m, [[rh, -h], [rh, h]], S, true);
    }
    return [new Float32Array(m.pos), new Float32Array(m.nor)];
}
exports.FINISHES = {
    raw: { n: '熱軋原料（黑皮）', c: [0.31, 0.29, 0.28], spec: 0.22, rough: 16 },
    drawn: { n: '伸線／冷鍛後（皮膜）', c: [0.68, 0.7, 0.73], spec: 0.72, rough: 44 },
    heat: { n: '熱處理後（回火色）', c: [0.24, 0.25, 0.31], spec: 0.52, rough: 28 },
    zinc: { n: '鍍鋅（銀白）', c: [0.82, 0.86, 0.92], spec: 1.05, rough: 88 },
    black: { n: '黑色皮膜', c: [0.08, 0.085, 0.095], spec: 0.62, rough: 52 },
};
const VS = `attribute vec3 p;attribute vec3 n;uniform mat4 mvp;uniform mat4 mw;varying vec3 vn;varying vec3 vp;varying vec3 mp;
void main(){vn=(mw*vec4(n,0.)).xyz;vp=(mw*vec4(p,1.)).xyz;mp=p;gl_Position=mvp*vec4(p,1.);}`;
const FS = `precision mediump float;varying vec3 vn;varying vec3 vp;varying vec3 mp;uniform vec3 col;uniform float spec;uniform float rough;uniform float alpha;uniform float cut;uniform vec3 eye;
void main(){if(cut>0.5&&mp.z>0.0)discard;vec3 N=normalize(vn);if(!gl_FrontFacing)N=-N;vec3 V=normalize(eye-vp);
if(cut>0.5&&!gl_FrontFacing){gl_FragColor=vec4(vec3(0.85,0.45,0.18)*(0.55+0.45*abs(N.y)),1.);return;}
vec3 L1=normalize(vec3(0.45,1.0,0.65)),L2=normalize(vec3(-0.88,0.26,-0.34)),L3=normalize(vec3(0.0,-0.2,1.0));
float d=max(dot(N,L1),0.)*0.95+max(dot(N,L2),0.)*0.28+max(dot(N,L3),0.)*0.12;
vec3 H=normalize(L1+V);float s=pow(max(dot(N,H),0.),rough)*spec;vec3 H2=normalize(L2+V);s+=pow(max(dot(N,H2),0.),rough)*spec*0.42;
float hemi=0.5+0.5*N.y;vec3 env=mix(vec3(0.08,0.12,0.17),vec3(0.56,0.66,0.8),hemi);float fr=pow(1.-max(dot(N,V),0.),2.6);
float brushed=0.92+0.08*sin((mp.y+mp.x*0.35)*36.0);
vec3 c=col*(0.17+d)*brushed+env*col*0.38+vec3(s)+env*fr*spec*0.72;
c+=vec3(0.015,0.02,0.025)*pow(max(dot(reflect(-V,N),L1),0.),10.0);
gl_FragColor=vec4(pow(c,vec3(0.92)),alpha);}`;
function persp(f, a, n, fa) { const t = 1 / Math.tan(f / 2); return [t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0]; }
function mul(a, b) { const o = new Array(16).fill(0); for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
        for (let k = 0; k < 4; k++)
            o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; return o; }
function rotY(t) { const c = Math.cos(t), s = Math.sin(t); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; }
function rotX(t) { const c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; }
function trans(x, y, z) { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]; }
class PartRenderer {
    constructor(canvas, lo) {
        this.canvas = canvas;
        this.buf = [];
        this.count = 0;
        this.loc = {};
        const gl = canvas.getContext('webgl', { antialias: !lo, alpha: true, premultipliedAlpha: false });
        if (!gl)
            throw new Error('此裝置不支援 WebGL');
        this.gl = gl;
        const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS))
            throw new Error(gl.getShaderInfoLog(o) || 'shader'); return o; };
        const p = gl.createProgram();
        gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
        gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(p);
        this.prog = p;
        gl.useProgram(p);
        for (const k of ['mvp', 'mw', 'col', 'spec', 'rough', 'alpha', 'cut', 'eye'])
            this.loc[k] = gl.getUniformLocation(p, k);
        this.loc.p = gl.getAttribLocation(p, 'p');
        this.loc.n = gl.getAttribLocation(p, 'n');
        this.buf = [gl.createBuffer(), gl.createBuffer()];
    }
    setShape(shape, lo) {
        const [pos, nor] = buildShape(shape, lo);
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[0]);
        gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[1]);
        gl.bufferData(gl.ARRAY_BUFFER, nor, gl.STATIC_DRAW);
        this.count = pos.length / 3;
    }
    draw(v) {
        const gl = this.gl, c = this.canvas;
        gl.viewport(0, 0, c.width, c.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);
        if (v.alpha < 1) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.depthMask(false);
        }
        else {
            gl.disable(gl.BLEND);
            gl.depthMask(true);
        }
        const model = mul(rotX(v.pitch), rotY(v.yaw));
        const view = trans(0, 0, -v.dist);
        const mvp = mul(persp(0.8, c.width / c.height, 0.1, 50), mul(view, model));
        gl.uniformMatrix4fv(this.loc.mvp, false, new Float32Array(mvp));
        gl.uniformMatrix4fv(this.loc.mw, false, new Float32Array(model));
        const F = exports.FINISHES[v.finish];
        gl.uniform3fv(this.loc.col, F.c);
        gl.uniform1f(this.loc.spec, F.spec);
        gl.uniform1f(this.loc.rough, F.rough);
        gl.uniform1f(this.loc.alpha, v.alpha);
        gl.uniform1f(this.loc.cut, v.cut ? 1 : 0);
        gl.uniform3fv(this.loc.eye, [0, 0, v.dist]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[0]);
        gl.enableVertexAttribArray(this.loc.p);
        gl.vertexAttribPointer(this.loc.p, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[1]);
        gl.enableVertexAttribArray(this.loc.n);
        gl.vertexAttribPointer(this.loc.n, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.count);
    }
}
exports.PartRenderer = PartRenderer;

};
factories["./data.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FINAL_ID = exports.ENDINGS = exports.ACHIEVEMENTS = exports.EVENTS = exports.PATENTS = exports.CODEX = exports.CHAPTERS = exports.NPCS = exports.CAREERS = exports.DEPTS = exports.BRANCHES = void 0;
exports.BRANCHES = {
    mfg: { name: '製造技術', en: 'Manufacturing Technology', color: '#ff9a3c', items: '材料、設備、冷鍛、搓牙、熱處理、表面處理、模具、維護' },
    qual: { name: '品質工程', en: 'Quality Engineering', color: '#ff5d73', items: 'QC、QA、SPC、MSA、FMEA、8D、六標準差' },
    prod: { name: '生產與物流管理', en: 'Production & Logistics', color: '#ffd23f', items: '排程、產能、MRP、庫存、倉儲、供應鏈、採購' },
    ie: { name: '工業工程', en: 'Industrial Engineering', color: '#7cf29c', items: '工作研究、時間研究、線平衡、精實、TOC、OR、人因工程' },
    it: { name: '資訊與人工智慧', en: 'IT & AI', color: '#39d5ff', items: 'Python、SQL、資料清理、機器學習、電腦視覺、RAG、API、部署' },
    sys: { name: '系統整合與領導', en: 'Systems Integration & Leadership', color: '#b78cff', items: 'ERP、MES、WMS、QMS、APS、IoT、CIM、專案管理、跨部門協調' },
};
exports.DEPTS = { floor: '現場製造', quality: '品質', plan: '生管物管', purchase: '採購供應鏈', it: 'IT／OT', mgmt: '經營管理' };
exports.CAREERS = [
    { title: '產線作業員', en: 'Production Operator', req: {} },
    { title: '製程技術員', en: 'Process Technician', req: { skills: { mfg: 12 }, certs: ['安全教育合格', 'IQC 進料檢驗'], trust: { floor: 8 } } },
    { title: '資深技術員／現場領班', en: 'Senior Technician / Line Leader', req: { skills: { mfg: 35, qual: 18 }, certs: ['冷鍛技術', '螺紋檢驗', '特殊製程', '組裝檢驗'], avg: 55 } },
    { title: '生產與品質工程培訓人員', en: 'Production & Quality Engineering Trainee', req: { skills: { ie: 12 }, certs: ['現場領班實務'], trust: { floor: 25 } } },
    { title: '初階製程改善工程師', en: 'Junior Process Improvement Engineer', req: { skills: { prod: 22, qual: 30, ie: 20 }, certs: ['生管物管輪調', 'QC／QA 輪調', '採購供應鏈輪調'] } },
    { title: '製造資料分析師', en: 'Manufacturing Data Analyst', req: { skills: { it: 18, ie: 35 }, certs: ['IE 精實改善'] } },
    { title: '人工智慧工程師', en: 'AI Engineer', req: { skills: { it: 32 }, certs: ['IE 精實改善'], avg: 55 } },
    { title: '智慧製造系統工程師', en: 'Smart Manufacturing Systems Engineer', req: { skills: { it: 50, sys: 22 }, certs: ['AI 專案實績', 'AI 工程師生存戰通關'] } },
    { title: '電腦整合製造工程師', en: 'CIM Engineer', req: { skills: { sys: 38 }, certs: ['CIM 系統整合'] } },
    { title: '資深製程規劃暨 CIM 整合工程師', en: 'Senior Process Planning & CIM Integration Engineer', req: { skills: { sys: 50, ie: 50 }, trustAvg: 35 } },
];
exports.NPCS = {
    chen: { id: 'chen', name: '陳金水（老陳）', role: '資深冷鍛師傅', dept: 'floor', stance: '重視經驗與設備手感，對「電腦說的」半信半疑。', hair: '#d9d9d9', skin: '#e0b48f', coat: '#2f5d8a', helmet: true, style: 2 },
    lin: { id: 'lin', name: '林美玲', role: '現場領班', dept: 'floor', stance: '產量要顧，人更要顧；最怕員工過勞出事。', hair: '#2b1d16', skin: '#f1c9a5', coat: '#e07a1f', helmet: true, style: 1 },
    huang: { id: 'huang', name: '黃志遠', role: '品質主管', dept: 'quality', stance: '規格就是規格，客戶信任一旦失去很難挽回。', hair: '#1c1c1c', skin: '#e8bf98', coat: '#f5f5f5', glasses: true, style: 0 },
    tsai: { id: 'tsai', name: '蔡佳蓉', role: '生管工程師', dept: 'plan', stance: '交期、產能、插單——她的白板永遠寫滿。', hair: '#4a2a1a', skin: '#f3cfb0', coat: '#3a7bd5', style: 3 },
    wu: { id: 'wu', name: '吳家豪', role: '物管人員', dept: 'plan', stance: '缺料比什麼都可怕，帳料不符他會睡不著。', hair: '#111', skin: '#d9a77f', coat: '#4a6b3a', style: 0 },
    chang: { id: 'chang', name: '張文琪', role: '採購主管', dept: 'purchase', stance: '價格、品質、供應風險三者都要談。', hair: '#3b2414', skin: '#f0c8a8', coat: '#7a3b69', glasses: true, style: 1 },
    hsu: { id: 'hsu', name: '許博鈞', role: 'IE 導師', dept: 'mgmt', stance: '先找瓶頸，再談投資；局部最佳不等於整體最佳。', hair: '#2a2a2a', skin: '#e6b991', coat: '#1f6f6f', glasses: true, style: 2 },
    cheng: { id: 'cheng', name: '鄭宇辰', role: 'AI 技術導師', dept: 'it', stance: '資料品質決定模型上限；模型要能被驗證與追溯。', hair: '#15151f', skin: '#f2cda9', coat: '#20304f', style: 3 },
    ho: { id: 'ho', name: '何俊宏', role: 'IT／OT 工程師', dept: 'it', stance: '系統穩定與資安第一，任何寫入都要有權限與紀錄。', hair: '#222', skin: '#dcae86', coat: '#3c3c46', glasses: true, style: 0 },
    keller: { id: 'keller', name: 'Anna Keller', role: '海外客戶代表（虛構 A 車廠）', dept: 'mgmt', stance: '品質、交期與透明溝通是合作的前提。', hair: '#d8b25a', skin: '#f6d6c0', coat: '#5a5f73', style: 1 },
    chou: { id: 'chou', name: '周振邦', role: '營運副總', dept: 'mgmt', stance: '看長期投資效益與整體策略，不喜歡沒有數據的提案。', hair: '#8a8a8a', skin: '#e2b590', coat: '#1d2a44', style: 2 },
    li: { id: 'li', name: '李淑芬', role: '財務主管', dept: 'mgmt', stance: '每一筆追加預算都要說清楚 ROI 與現金流。', hair: '#3a2010', skin: '#f2caa6', coat: '#6b5b3a', glasses: true, style: 1 },
};
exports.CHAPTERS = [
    {
        id: 0, code: '序章', title: '第一天上班', role: '產線新人（Production Trainee）', area: 4, requiredPos: 0,
        panels: [
            { npc: 'lin', text: '歡迎來到冷鍛廠房！先別急著碰機器——在這裡，第一件事永遠是安全。' },
            { npc: 'chen', text: '這台多工位打頭機一分鐘打上百顆，手伸錯地方，後悔來不及。' },
            { npc: 'lin', text: '今天把個人防護具（PPE）、5S 跟標準作業程序（SOP）弄清楚。找得出危險，才有資格操作。' },
        ],
        objectives: ['在模擬產線找出所有危險點', '選擇正確的個人防護具（PPE）', '判斷何時必須停機通報'],
        tutorial: ['個人防護具（Personal Protective Equipment, PPE）：安全鞋、護目鏡、耳罩等，依作業風險配戴。', '5S：整理、整頓、清掃、清潔、素養，讓異常「一眼看得出來」。', '標準作業程序（Standard Operating Procedure, SOP）：讓每個人用同樣安全、正確的方法完成作業。', '旋轉機台附近不可配戴棉紗手套、飾品，長髮需束起，避免捲入。'],
        game: 'hazard',
        dilemma: {
            prompt: '下班前 30 分鐘，你發現打頭機護蓋連鎖開關鬆脫，但機台還能運轉。訂單很趕，你會？',
            views: [{ npc: 'tsai', text: '今天這批是 A 車廠的，晚交會被罰……' }, { npc: 'lin', text: '連鎖失效就是重大風險，沒有商量餘地。' }],
            options: [
                { label: '立即停機、掛牌上鎖（LOTO）並通報領班', desc: '安全優先，請保養課修復後再復機。', effect: { trust: { floor: 6, quality: 2 }, brand: 1 }, react: '林美玲：做得好。產量可以補，手指補不回來。' },
                { label: '先通報，請領班決定，自己繼續作業', desc: '有通報，但仍在風險下作業。', effect: { trust: { floor: 1 } }, react: '林美玲：通報是對的，但「風險下繼續作業」不是選項。下次直接停機。' },
                { label: '用膠帶固定開關，下班再說', desc: '暫時維持產出。', effect: { trust: { floor: -8, quality: -4 }, addRisk: '冷鍛機護蓋連鎖失效', flag: 'unsafe' }, react: '林美玲（臉色鐵青）：這是違反安全規範！馬上停機。這件事會記錄下來。' },
            ],
        },
        reward: { xp: { mfg: 8, qual: 2 }, funds: 50000, cert: '安全教育合格', trust: { floor: 5 } },
        journal: '第一天，我學到：安全、紀律、品質與標準化，是製造業的地基。',
        codex: ['ppe', '5s', 'sop', 'loto'],
    },
    {
        id: 1, code: '第一章', title: '從鋼材認識扣件', role: '原料檢驗及備料作業員（Material Handling Operator）', area: 1, requiredPos: 0,
        panels: [
            { npc: 'wu', text: '這些盤元是上游鋼廠軋好的線材，我們不煉鋼，但我們要對每一捲負責。' },
            { npc: 'huang', text: '材質證明（Mill Certificate）、爐號、標籤要三方一致。對不上，就不能上線。' },
            { npc: 'wu', text: '今天有一批交貨延遲，還有一捲外觀怪怪的。你來判斷怎麼處置。' },
        ],
        objectives: ['比對材質證明、標籤與訂單需求', '對每批原料做出正確處置', '處理供應商延遲造成的缺料'],
        tutorial: ['小鋼胚與盤元屬於上游鋼鐵供應鏈；扣件廠多半向鋼廠或線材廠採購。', '球化退火（Spheroidizing Annealing）與伸線（Wire Drawing）的先後順序依鋼種、產品與製造路徑而不同。', '進料檢驗（Incoming Quality Control, IQC）：在原料進廠時把關。', '可追溯性（Traceability）：成品批號能一路追回原料爐號。'],
        game: 'trace',
        dilemma: {
            prompt: '標籤不符的那捲盤元，生管希望「先用掉，反正看起來一樣」。你怎麼回應？',
            views: [{ npc: 'tsai', text: '產線等料等到要停了！' }, { npc: 'huang', text: '材質不明的料，做出來就是不明的產品。' }],
            options: [
                { label: '維持隔離，請供應商補正文件並加急補料', desc: '支付加急運費 NT$30,000。', effect: { funds: -30000, trust: { quality: 6, plan: -2 } }, react: '黃志遠：很好。可追溯性不是文書作業，是客戶安全。' },
                { label: '隔離並送材質分析（光譜檢驗）確認', desc: '花費 NT$8,000，延遲半天。', effect: { funds: -8000, trust: { quality: 5, plan: 1 } }, react: '黃志遠：用數據說話。確認前誰都不准動。' },
                { label: '先投產，事後補文件', desc: '暫時解決缺料。', effect: { trust: { quality: -10 }, f: { latent: 0.002 }, flag: 'badMaterial', brand: -2 }, react: '黃志遠：這批產品我會全數追蹤。你不知道你冒了多大的風險。' },
            ],
        },
        reward: { xp: { mfg: 6, qual: 5, prod: 3 }, funds: 60000, cert: 'IQC 進料檢驗', trust: { quality: 4, plan: 3 }, promoteTo: 1 },
        journal: '一捲盤元背後，有爐號、材證、批號與一整條供應鏈。品質從進料就開始了。',
        codex: ['wirerod', 'spheroidize', 'drawing', 'iqc', 'trace'],
    },
    {
        id: 2, code: '第二章', title: '冷鍛與模具', role: '冷鍛製程技術員（Cold Forging Technician）', area: 4, requiredPos: 1,
        panels: [
            { npc: 'chen', text: '多工位打頭機一站一站把線材「擠」成螺絲頭。模具就是它的牙齒。' },
            { npc: 'chen', text: '轉速開太快，模具磨得快，頭部就裂；保養太勤，又一直停機。' },
            { npc: 'hsu', text: '你的任務是在安全工作窗口內，找出單位良品成本最低的組合。' },
        ],
        objectives: ['設定生產速度（不得超出安全窗口）', '設定模具保養週期', '選擇換模排序策略'],
        tutorial: ['冷鍛（Cold Forging）：在常溫下以多工位模具成形，材料利用率高。', '模具壽命（Die Life）受速度、材料硬度、潤滑影響。', '標準工時（Standard Time）＝正常時間 ×（1＋寬放率）。', '遊戲參數為教學簡化，不可直接套用至實際設備。'],
        game: 'param', cfg: 'forge',
        dilemma: {
            prompt: '老陳說：「憑我的經驗，再撐兩萬顆再換模沒問題。」IE 導師說要照數據設定。你怎麼做？',
            views: [{ npc: 'chen', text: '三十年了，聽聲音我就知道模具還行。' }, { npc: 'hsu', text: '經驗很寶貴，但要變成可驗證的標準。' }],
            options: [
                { label: '把老陳的經驗變成點檢標準：聲音＋頭部外觀＋計數三重判斷', desc: '經驗標準化。', effect: { trust: { floor: 6, mgmt: 2 }, st: { forge: { Q: 0.002 } } }, react: '老陳（笑）：年輕人有想法。我教你怎麼聽。' },
                { label: '直接依數據設定，不考慮師傅意見', desc: '效率高但傷感情。', effect: { trust: { floor: -4, mgmt: 2 } }, react: '老陳：哼，好吧。機器壞了別來找我。' },
                { label: '照老陳的建議延長換模', desc: '暫時減少停機。', effect: { trust: { floor: 3 }, st: { forge: { Q: -0.004 } }, flag: 'skipMaint' }, react: '許博鈞：短期停機少了，但模具磨耗會反映在不良率。我們觀察看看。' },
            ],
        },
        reward: { xp: { mfg: 10, ie: 3 }, funds: 60000, cert: '冷鍛技術', trust: { floor: 5 } },
        journal: '模具壽命、產量與良率是一組取捨；經驗要變成標準，才能傳承。',
        codex: ['coldforge', 'dielife', 'stdtime', 'smed'],
    },
    {
        id: 3, code: '第三章', title: '螺紋的秘密', role: '搓牙／攻牙技術員（Threading Technician）', area: 5, requiredPos: 1,
        panels: [
            { npc: 'lin', text: '螺栓的外螺紋用牙板「搓」出來；螺帽的內螺紋用絲攻「攻」出來。別搞混了。' },
            { npc: 'huang', text: '缺牙、錯牙、牙型變形，裝到車上就是鎖不緊。' },
            { npc: 'huang', text: '用放大檢驗台，一顆一顆判。判錯成本很高——漏檢更高。' },
        ],
        objectives: ['區分搓牙與攻牙', '以放大介面判定良品與不良品', '比較人工判定與 AI 模擬結果'],
        tutorial: ['搓牙（Thread Rolling）：以兩片牙板滾壓出外螺紋，屬塑性成形，不產生切屑。', '攻牙（Tapping）：以絲攻加工螺帽內螺紋。', '品質成本（Cost of Quality）：預防成本＋鑑定成本＋內部失敗＋外部失敗。', '自鎖與防鬆結構是以特定牙型或局部變形產生預置扭力（Prevailing Torque）。'],
        game: 'inspect', cfg: 'thread',
        dilemma: {
            prompt: '牙板快到壽命，生管要你撐到週末再換。你觀察到缺牙比例開始上升。',
            views: [{ npc: 'tsai', text: '週末換線比較不影響出貨。' }, { npc: 'huang', text: '缺牙是漸進的，等你看到就已經做出一堆了。' }],
            options: [
                { label: '今天換牙板，並把牙板壽命納入預防保養', desc: '停機 1 小時，費用 NT$12,000。', effect: { funds: -12000, st: { thread: { Q: 0.004 } }, trust: { quality: 5, plan: -1 } }, react: '黃志遠：預防永遠比檢驗便宜。' },
                { label: '撐到週末，但加嚴抽檢頻率', desc: '鑑定成本上升。', effect: { funds: -5000, trust: { quality: 1, plan: 3 } }, react: '蔡佳蓉：謝啦！不過抽檢多了，品保那邊也要人力。' },
                { label: '照常生產', desc: '不增加成本。', effect: { st: { thread: { Q: -0.006 } }, flag: 'threadWear', trust: { quality: -4 } }, react: '黃志遠：等著看不良率曲線吧。' },
            ],
        },
        reward: { xp: { mfg: 8, qual: 7 }, funds: 60000, cert: '螺紋檢驗', trust: { quality: 5 } },
        journal: '外螺紋搓牙、內螺紋攻牙。檢驗能抓出不良，但預防才能減少不良。',
        codex: ['rolling', 'tapping', 'coq', 'prevailing', 'gauge'],
    },
    {
        id: 4, code: '第四章', title: '熱處理與表面處理', role: '特殊製程技術員（Special Process Technician）', area: 6, requiredPos: 1,
        panels: [
            { npc: 'huang', text: '熱處理和表面處理是「特殊製程」——結果無法只靠最終檢驗完全確認，必須控制過程。' },
            { npc: 'lin', text: '爐子是批次運作，湊滿一爐才省能源，但等太久，後段就斷料。' },
            { npc: 'huang', text: '預置扭力螺帽更講究：熱處理後的硬度，要跟後續軸向沖壓條件配合。' },
        ],
        objectives: ['設定熱處理裝載率與湊批等待上限', '把回火條件維持在安全窗口', '設定鍍層膜厚目標，兼顧摩擦係數'],
        tutorial: ['特殊製程（Special Process）：需以參數監控與驗證確保品質的製程。', '批次製程（Batch Process）：一次處理一爐，裝載率影響能耗與均勻性。', '摩擦係數（Coefficient of Friction）影響鎖附扭力與夾緊力的關係。', '公開專利 TWI753649B（預置扭力螺帽製成方法）的重點在熱處理後硬度與特定軸向沖壓條件的配合，而非一般熱處理。'],
        game: 'param', cfg: 'heat',
        dilemma: {
            prompt: '爐溫記錄器顯示某批次有 20 分鐘溫度偏移。產品外觀正常，客戶明天要貨。',
            views: [{ npc: 'tsai', text: '外觀都好好的，可以出吧？' }, { npc: 'huang', text: '硬度看不出來，要驗。' }],
            options: [
                { label: '隔離該批，加做硬度抽驗與金相確認', desc: '檢驗費 NT$15,000，延遲一天。', effect: { funds: -15000, trust: { quality: 7, plan: -2 }, brand: 1 }, react: '黃志遠：這就是特殊製程控制。數據清楚了才放行。' },
                { label: '全數重新熱處理', desc: '保守但耗能耗時。', effect: { funds: -30000, f: { energyFactor: 0.01 }, trust: { quality: 3, plan: -4 } }, react: '林美玲：保險是保險，不過爐子又要排一輪了。' },
                { label: '直接出貨，備註給客戶', desc: '準時交貨。', effect: { f: { latent: 0.002 }, brand: -4, trust: { quality: -8 }, flag: 'heatEscape' }, react: 'Anna Keller（電話）：我們收到備註……你們確定這批是合格的嗎？' },
            ],
        },
        reward: { xp: { mfg: 9, qual: 6 }, funds: 70000, cert: '特殊製程', trust: { quality: 5 } },
        journal: '看不見的品質要靠製程控制來保證。批次、能源與交期也是同一題。',
        codex: ['heat', 'special', 'batch', 'cof', 'tw753649'],
    },
    {
        id: 5, code: '第五章', title: '組裝與光學檢驗', role: '組裝與檢驗技術員（Assembly and Inspection Technician）', area: 9, requiredPos: 1,
        panels: [
            { npc: 'lin', text: '組合式套管螺絲：套管要套上、要限位、不能掉。一顆脫落，客戶產線就停。' },
            { npc: 'huang', text: '光學篩選機很快，但門檻設太嚴，好品被剔除；設太鬆，漏檢流到客戶。' },
            { npc: 'hsu', text: '檢出率與誤判率之間要用成本來取捨。' },
        ],
        objectives: ['判定套管螺絲與螺栓瑕疵', '設定光學檢驗門檻', '計算檢驗成本與漏檢風險'],
        tutorial: ['光學檢驗（Optical Inspection）：以相機與影像處理自動篩選。', '檢出率（Detection Rate）：不良品被抓出的比例。', '誤判率（False Reject Rate）：良品被誤判為不良的比例。', '相關專利：TWI683065B、TWI710715B、TWI761005B、TWM608701U（見百科專利卡）。'],
        game: 'inspect', cfg: 'optical',
        dilemma: {
            prompt: '光學機誤判太多，現場希望調鬆門檻；品保要求維持。你負責提出方案。',
            views: [{ npc: 'lin', text: '人工複判的人快忙不過來了！' }, { npc: 'huang', text: '鬆一點，就有東西流出去。' }],
            options: [
                { label: '維持門檻，增加複判站並收集誤判影像改善演算法', desc: '每週 NT$6,000 人力。', effect: { funds: -20000, f: { falseReject: -0.004 }, trust: { quality: 4, floor: 3 } }, react: '黃志遠：誤判影像是寶貴的資料，以後做 AI 用得到。' },
                { label: '依產品分別設定門檻（套管品較嚴）', desc: '需要建立產品參數表。', effect: { f: { falseReject: -0.003, detect: 0.003 }, trust: { quality: 3, floor: 2 } }, react: '許博鈞：分眾設定，很好的系統思維。' },
                { label: '整體調鬆門檻', desc: '誤判立刻下降。', effect: { f: { falseReject: -0.008, detect: -0.03 }, trust: { quality: -6, floor: 4 }, flag: 'looseOptical' }, react: '黃志遠：下個月的 PPM 你自己跟客戶解釋。' },
            ],
        },
        reward: { xp: { mfg: 6, qual: 9 }, funds: 70000, cert: '組裝檢驗', trust: { quality: 5, floor: 3 }, promoteTo: 2 },
        journal: '產品結構決定檢驗重點；檢出率與誤判率是一組要用成本衡量的取捨。',
        codex: ['optical', 'detect', 'falsereject', 'tw683065', 'tw710715', 'tw761005', 'twm608701'],
    },
    {
        id: 6, code: '第六章', title: '第一次帶領團隊', role: '資深技術員／現場領班（Senior Technician / Line Leader）', area: 5, requiredPos: 2,
        panels: [
            { npc: 'lin', text: '從今天起你帶夜班。你不再只顧一台機器，而是一整個班。' },
            { npc: 'lin', text: '今晚有兩位請假，國華已經連續加班一週。' },
            { npc: 'hsu', text: '人力有限時，先保護瓶頸站，再看人因與安全。' },
        ],
        objectives: ['在缺工下分派作業員', '不讓未認證人員操作高風險設備', '避免高疲勞者排在高風險站'],
        tutorial: ['設備綜合效率（Overall Equipment Effectiveness, OEE）＝可用率 × 效能 × 品質。', '全員生產保全（Total Productive Maintenance, TPM）：讓操作員參與日常保養。', '人因工程（Ergonomics）：讓工作適合人，降低疲勞與錯誤。', '瓶頸站損失一小時，就是整條線損失一小時。'],
        game: 'crew',
        dilemma: {
            prompt: '產量差一點達標。生管建議要國華再加班 4 小時。',
            views: [{ npc: 'tsai', text: '差這一點就達標了！' }, { npc: 'lin', text: '他已經連七天了。' }],
            options: [
                { label: '不加班，向生管說明並調整明日排程', desc: '保護員工，交期壓力轉移。', effect: { trust: { floor: 7, plan: -3 }, f: { training: 2 } }, react: '林美玲：謝謝你。這才是領班該做的。' },
                { label: '找自願且未疲勞的同仁加班 2 小時', desc: '人力成本增加。', effect: { funds: -6000, trust: { floor: 3, plan: 3 } }, react: '蔡佳蓉：兩邊都顧到了，不錯。' },
                { label: '要求國華加班', desc: '達標。', effect: { trust: { floor: -6, plan: 4 }, f: { overtimeH: 2 }, flag: 'fatigue' }, react: '林美玲：……我會盯著他。出事的話誰負責？' },
            ],
        },
        reward: { xp: { ie: 10, sys: 6, mfg: 3 }, funds: 80000, cert: '現場領班實務', trust: { floor: 8 }, promoteTo: 3 },
        journal: '帶人比帶機器難。產量、安全、負荷與品質要一起平衡。',
        codex: ['oee', 'tpm', 'ergonomics', 'bottleneck'],
    },
    {
        id: 7, code: '第七章', title: '生產管理與物料控制', role: '輪調：生產管理工程師／物料規劃工程師', area: 11, requiredPos: 3,
        panels: [
            { npc: 'tsai', text: '歡迎來到生管！這裡看的不是一台機器，是全部訂單跟全部產能。' },
            { npc: 'wu', text: '套管庫存不夠，急單又插進來了。物料清單（BOM）你先看一下。' },
            { npc: 'tsai', text: '把訂單排到機台上，盡量準時足量交貨，換線越少越好。' },
        ],
        objectives: ['把 7 張訂單排入 3 台機台', '降低換線損失並滿足交期', '依 MRP 計算套管淨需求並下採購'],
        tutorial: ['物料需求規劃（Material Requirements Planning, MRP）：毛需求 − 庫存 − 在途 ＋ 安全庫存 ＝ 淨需求。', '物料清單（Bill of Materials, BOM）：一顆套管螺絲＝1 支螺絲本體＋1 個套管。', '有限產能排程（Finite Capacity Scheduling）：排程不可超過機台可用時數。', '準時足量交貨率（On Time In Full, OTIF）。'],
        game: 'schedule',
        dilemma: {
            prompt: '業務又接到一張急單，要求插在最前面；品保同時要求把一批可疑品先重工。',
            views: [{ npc: 'tsai', text: '急單客戶是新的系統供應商（虛構 B 公司），很重要。' }, { npc: 'huang', text: '可疑品不先處理，庫存帳也會亂。' }],
            options: [
                { label: '召開產銷會議，以產能負荷數據協調交期', desc: '急單分批交，可疑品先隔離。', effect: { trust: { plan: 5, quality: 3, mgmt: 3 } }, react: '周振邦：用數據協調，這是我想看到的。' },
                { label: '急單優先，可疑品延後處理', desc: '客戶滿意，品保不滿。', effect: { trust: { plan: 4, quality: -4 }, brand: 1 }, react: '黃志遠：庫存裡放著可疑品，遲早出事。' },
                { label: '拒絕急單', desc: '維持原排程。', effect: { trust: { plan: -3, mgmt: -3 }, brand: -2 }, react: '周振邦：拒絕之前，至少要給客戶一個可行方案。' },
            ],
        },
        reward: { xp: { prod: 14, ie: 4 }, funds: 90000, cert: '生管物管輪調', trust: { plan: 8 } },
        journal: '排程是產能、物料與交期的拼圖；插單的代價常常藏在換線與 WIP 裡。',
        codex: ['mrp', 'bom', 'crp', 'finite', 'safetystock', 'setup', 'otif', 'aps'],
    },
    {
        id: 8, code: '第八章', title: '品質工程與六標準差', role: '輪調：品管工程師（QCE）／品保工程師（QAE）', area: 9, requiredPos: 3,
        panels: [
            { npc: 'huang', text: 'A 車廠反映預置扭力螺帽的扭力偏高。我們要找出原因，不是找人背鍋。' },
            { npc: 'huang', text: 'QC 看產品與製程數據；QA 看系統、預防與稽核。兩邊都要懂。' },
            { npc: 'hsu', text: '記住：相關不等於因果。要設計能驗證假說的實驗。' },
        ],
        objectives: ['在管制圖上找出異常點', '解讀 Cp／Cpk 與柏拉圖', '提出可驗證的根因假說', '區分 QC 與 QA 職責'],
        tutorial: ['統計製程管制（Statistical Process Control, SPC）：以管制圖監控製程變異。', '製程能力指標（Cp / Cpk）：Cpk 同時考慮變異與偏移。', '柏拉圖（Pareto Chart）：先處理影響最大的少數問題。', '六標準差（Six Sigma）DMAIC：定義、量測、分析、改善、管制。'],
        game: 'spc',
        dilemma: {
            prompt: '數據顯示異常與新批號盤元同時出現，也與夜班交接同時出現。業務希望馬上給客戶結論。',
            views: [{ npc: 'keller', text: 'We need your root cause within 48 hours.' }, { npc: 'huang', text: '給錯結論，比晚一天給結論更糟。' }],
            options: [
                { label: '先提交 8D 的 D3 圍堵與 D4 驗證計畫，48 小時內回報實驗結果', desc: '透明溝通。', effect: { trust: { quality: 7, mgmt: 3 }, brand: 3, f: { latent: -0.0005 } }, react: 'Anna Keller：Clear plan, clear timeline. Thank you.' },
                { label: '直接回覆「供應商材料問題」', desc: '快速結案。', effect: { trust: { quality: -5, purchase: -5 }, brand: -2 }, react: '張文琪：供應商要我們拿出證據，我們拿不出來。' },
                { label: '回覆「夜班人員操作疏失」並懲處', desc: '快速結案。', effect: { trust: { floor: -10, quality: -3 }, brand: -1 }, react: '林美玲：你連實驗都沒做就認定是人的問題？' },
            ],
        },
        reward: { xp: { qual: 14, it: 3 }, funds: 90000, cert: 'QC／QA 輪調', trust: { quality: 8 } },
        journal: '異常訊號要用統計看，根因要用實驗證；8D 與 DMAIC 是說服客戶的語言。',
        codex: ['spc', 'controlchart', 'cpk', 'pareto', 'fishbone', '5why', 'fmea', '8d', 'dmaic', 'msa', 'qcqa'],
    },
    {
        id: 9, code: '第九章', title: '採購與供應鏈危機', role: '輪調：採購工程師／供應鏈分析師', area: 1, requiredPos: 3,
        panels: [
            { npc: 'chang', text: '下個月需要 120 噸盤元。乙貿易報價最低，你覺得要全下給他嗎？' },
            { npc: 'li', text: '我只看總成本。單價低不代表總成本低。' },
            { npc: 'chang', text: '把價格、交期、品質、運輸、庫存與風險一起算。' },
        ],
        objectives: ['分配三家供應商的採購比例', '選擇運輸方式與安全庫存', '比較總持有成本（TCO）並處理運輸受阻'],
        tutorial: ['總持有成本（Total Cost of Ownership, TCO）：單價＋運輸＋品質成本＋缺料風險＋庫存持有。', '供應商績效（Supplier Performance）：準交率、品質 PPM、回應速度。', '交期（Lead Time）：從下單到收料的時間。', '存貨周轉（Inventory Turnover）：銷貨成本／平均存貨。'],
        game: 'supply',
        dilemma: {
            prompt: '最便宜的乙貿易提出：若一次簽一年長約，再降 5%。',
            views: [{ npc: 'li', text: '一年省下的錢很可觀。' }, { npc: 'chang', text: '他的準交率只有 82%。' }],
            options: [
                { label: '簽小量試行約，附準交率與品質改善條款', desc: '分散風險，逐步評估。', effect: { trust: { purchase: 7, mgmt: 3 }, f: { priceFactor: -0.01 } }, react: '張文琪：有條件的合作，讓供應商有誘因改善。' },
                { label: '維持多源採購，不簽長約', desc: '風險最低。', effect: { trust: { purchase: 4, mgmt: -1 } }, react: '李淑芬：穩健，但我希望看到降本計畫。' },
                { label: '簽一年長約，全部轉單', desc: '單價最低。', effect: { f: { priceFactor: -0.04, supplierDelay: 0.12 }, trust: { purchase: -4, mgmt: 3 }, flag: 'singleSource' }, react: '張文琪：……希望海運別出事。' },
            ],
        },
        reward: { xp: { prod: 10, sys: 4 }, funds: 90000, cert: '採購供應鏈輪調', trust: { purchase: 8 }, promoteTo: 4 },
        journal: '最低單價不等於最低總成本；供應鏈的韌性要事先設計。',
        codex: ['tco', 'supplierperf', 'leadtime', 'supplyrisk', 'turnover'],
    },
    {
        id: 10, code: '第十章', title: '從現場改善走向資料科學', role: '製程改善工程師／製造資料分析師', area: 11, requiredPos: 4,
        panels: [
            { npc: 'hsu', text: '你開始進修 Python、統計與 SQL 了吧？現場資料很髒，先學會清理。' },
            { npc: 'hsu', text: '然後用節拍時間（Takt Time）對照各站週期時間，找出真正的瓶頸。' },
            { npc: 'li', text: '改善方案請附上投入與效益，我要看 ROI。' },
        ],
        objectives: ['清理缺失、重複與格式錯誤的資料', '比較各站週期時間與節拍時間，找出瓶頸', '正確區分 Takt／Cycle／Lead Time，套用小法則', '在預算內選擇改善方案'],
        tutorial: ['節拍時間（Takt Time）＝可用生產時間 ÷ 客戶需求量。', '週期時間（Cycle Time）：某站完成一單位所需的實際時間。', '前置時間（Lead Time）：從投料（或接單）到完成交付的總時間。', '小法則（Little\'s Law）：WIP ＝ 產出率 × 流程時間（單位須一致）。', '限制理論（Theory of Constraints, TOC）：改善非瓶頸，不一定改善整條產線。'],
        game: 'data',
        dilemma: {
            prompt: '主管問你：既然有資料了，要不要每站都裝感測器、做一個大儀表板？',
            views: [{ npc: 'chou', text: '數位化，大家都在做。' }, { npc: 'hsu', text: '先回答「要解決什麼問題」。' }],
            options: [
                { label: '先在瓶頸站做資料收集與改善，驗證後再擴大', desc: '聚焦、可驗證。', effect: { trust: { mgmt: 5, floor: 2 }, f: { dataQuality: 0.03 } }, react: '周振邦：小步快跑、看得到成效。我支持。' },
                { label: '全廠一次導入', desc: '投資大、風險高。', effect: { funds: -80000, f: { dataQuality: 0.04, opexExtra: 5000 }, trust: { mgmt: 1, it: -2 } }, react: '何俊宏：一次接這麼多設備，網路與資安我需要時間。' },
                { label: '先不做，維持紙本', desc: '零投資。', effect: { trust: { mgmt: -4 } }, react: '許博鈞：沒有資料，改善就只能靠感覺。' },
            ],
        },
        reward: { xp: { ie: 14, it: 10 }, funds: 300000, cert: 'IE 精實改善', trust: { mgmt: 6, floor: 3 }, promoteTo: 6 },
        journal: '資料要先乾淨，分析才可信。找到真正的瓶頸，改善才有槓桿。',
        codex: ['takt', 'cycletime', 'lean', 'waste', 'toc', 'littles', 'vsm', 'linebal', 'or', 'des', 'datacleaning'],
    },
    {
        id: 11, code: '第十一章', title: '轉職 AI 工程師', role: '人工智慧工程師（AI Engineer）', area: 12, requiredPos: 6,
        panels: [
            { npc: 'cheng', text: '恭喜通過實務考核！歡迎來到 AI 研發室。這裡有四個專案等你。' },
            { npc: 'ho', text: '提醒你：AI 不可以直接改生產參數、品質放行或採購紀錄。所有寫入都要有權限與人工確認。' },
            { npc: 'cheng', text: '我們的模擬器是「教學模擬」，不是真的深度學習訓練。但決策邏輯是一樣的。' },
        ],
        objectives: ['完成至少 3 個 AI 專案（共 4 個）', '每個專案都要通過資料、模型、評估與部署關卡', '確保來源追溯、人工確認與安全限制'],
        tutorial: ['精確率（Precision）：判為不良者中，真正不良的比例。', '召回率（Recall）：所有不良品中，被抓出的比例。', '資料洩漏（Data Leakage）：測試資料混入訓練，讓模型看起來很準。', '檢索增強生成（Retrieval-Augmented Generation, RAG）：先檢索文件，再生成有來源的回答。'],
        game: 'ailab',
        dilemma: {
            prompt: '高層看到 FastenerVision AI 的展示，希望下週直接取代所有人工複判。',
            views: [{ npc: 'chou', text: '人力成本可以省下來。' }, { npc: 'cheng', text: '模型還沒經過產線資料漂移的考驗。' }],
            options: [
                { label: '先以影子模式並行一個月，再分階段取代', desc: '風險可控。', effect: { trust: { it: 6, quality: 4, mgmt: 2 } }, react: '鄭宇辰：這才是負責任的部署。' },
                { label: 'AI 判定＋人工抽查高風險品', desc: '折衷。', effect: { trust: { it: 3, quality: 3, mgmt: 3 } }, react: '黃志遠：可以接受，但要定期比對漏檢率。' },
                { label: '下週全面取代', desc: '省人力。', effect: { trust: { it: -4, quality: -6, mgmt: 4 }, f: { detect: -0.02 }, flag: 'aiRush' }, react: '鄭宇辰：如果資料漂移，我們會在客戶那裡才發現。' },
            ],
        },
        reward: { xp: { it: 18, sys: 6 }, funds: 150000, cert: 'AI 專案實績', trust: { it: 8 } },
        journal: 'AI 的價值在於可驗證、可追溯、可維運；人工確認不是負擔，是保險。',
        codex: ['precision', 'recall', 'confusion', 'leakage', 'drift', 'rag', 'vlm', 'ocr', 'etl', 'sql', 'pdm', 'cv'],
    },
    {
        id: 12, code: '第十二章', title: 'AI 工程師生存戰', role: '人工智慧工程師（AI Engineer）・階段考核', area: 12, requiredPos: 6,
        panels: [
            { npc: 'chou', text: '四個 AI 專案做得不錯。但真正的考驗是：把 AI 變成全公司每天在用、出事也撐得住的正式系統。' },
            { npc: 'cheng', text: '接下來你要主導數位轉型專案：報價、圖面解析、ERP 整合、知識問答、Agent、GPU 部署到上線，一共九關。' },
            { npc: 'li', text: '預算 500 萬、工期 120 天。超支、延誤或出重大事故，我都會記在帳上。' },
            { npc: 'ho', text: '這關過了，你才算真的能扛起「智慧製造系統工程師」。記住：權限、追溯、回滾，一個都不能少。' },
        ],
        objectives: ['以「職涯模式」完成《SUMEEKO：AI 工程師生存戰》九大關卡', '在預算、工期、品質、資安與客戶信任之間做 AI 工程決策', '處理事故並完成應變檢討', '達成結局 A、B 或 D 才算通過考核'],
        tutorial: ['最小可行產品（Minimum Viable Product, MVP）：先交付能驗證核心價值的最小範圍。', '角色型存取控制（Role-Based Access Control, RBAC）：依角色授權，例如業務看不到成本明細。', '冪等性（Idempotency）：同一筆請求重送多次，結果只發生一次，ERP 整合必備。', '人工介入（Human-in-the-Loop, HITL）：AI Agent 的關鍵動作保留人工核准。', '模型量化（Quantization）：以 INT8／INT4 降低 GPU 記憶體需求，但可能犧牲品質。', '生存戰在全螢幕視窗中進行，進度會自動保存；完成後結果會自動回傳主線。'],
        game: 'survival',
        dilemma: {
            prompt: '專案結束後，周副總問你：下一階段要先擴充更多 AI 功能，還是先把系統整合與維運體制補齊？',
            views: [{ npc: 'chou', text: '其他部門都在排隊要 AI 功能。' }, { npc: 'ho', text: '沒有監控、權限稽核和回滾機制，功能越多越危險。' }],
            options: [
                { label: '先建立 MLOps／系統維運與跨系統整合，再分批擴充功能', desc: '為 CIM 整合打地基。', effect: { trust: { it: 6, mgmt: 3 }, f: { dataQuality: 0.03 } }, react: '何俊宏：有你這句話，CIM 整合就有機會做對。' },
                { label: '維運與新功能各投入一半人力', desc: '兩邊都顧，但都比較慢。', effect: { trust: { it: 3, mgmt: 4 } }, react: '周振邦：可以，季底我要看到兩邊的進度。' },
                { label: '全力擴充新 AI 功能', desc: '短期亮點最多。', effect: { trust: { it: -5, mgmt: 5 }, f: { opexExtra: 8000 }, flag: 'aiRush' }, react: '鄭宇辰：功能上得快，但資料漂移和權限問題會一起長大。' },
            ],
        },
        reward: { xp: { it: 12, sys: 10, qual: 3 }, funds: 150000, cert: 'AI 工程師生存戰通關', trust: { it: 6, mgmt: 4 }, promoteTo: 7 },
        journal: '把 AI 從展示變成正式系統：需求、程式品質、整合、資安、事故應變與上線決策，一關都不能偷懶。',
        codex: ['mvp', 'rbac', 'idem', 'hitl', 'quant', 'incident'],
    },
    {
        id: 13, code: '第十三章', title: 'CIM 與智慧工廠總體整合', role: '智慧製造系統工程師 → 電腦整合製造工程師', area: 12, requiredPos: 7,
        panels: [
            { npc: 'ho', text: '單點 AI 做得再好，ERP 跟現場對不上，排程一樣亂。' },
            { npc: 'cheng', text: '現在要把設備、資料、製程、物料、人力與財務串起來。' },
            { npc: 'ho', text: '先把系統拓樸接對。記住 OT 跟 IT 要分層，任何人都不能從 ERP 直接寫 PLC。' },
        ],
        objectives: ['以節點圖建立正確的跨系統資料流', '完成 MES ↔ ERP 欄位映射', '修復庫存帳料不符', '設計 OT／IT 資安分區'],
        tutorial: ['電腦整合製造（Computer Integrated Manufacturing, CIM）：整合製造與管理資訊體系。', '製造執行系統（Manufacturing Execution System, MES）：工單、報工、批號履歷。', '企業資源規劃（Enterprise Resource Planning, ERP）：訂單、採購、庫存、財務。', '數位孿生（Digital Twin）：以資料驅動的虛擬工廠模型，用於模擬與最佳化。'],
        game: 'cim',
        dilemma: {
            prompt: '系統整合後，財務希望 ERP 可以直接下指令改機台參數「提高效率」。',
            views: [{ npc: 'li', text: '少一個環節，少一份人力。' }, { npc: 'ho', text: '這是資安與安全的紅線。' }],
            options: [
                { label: '拒絕直接寫入；參數變更走 MES 工程變更流程與雙人核准', desc: '維持分層與追溯。', effect: { trust: { it: 7, quality: 4, mgmt: 2 }, f: { dataQuality: 0.02 } }, react: '何俊宏：謝謝你守住紅線。' },
                { label: '僅允許 ERP 讀取設備狀態', desc: '單向資料流。', effect: { trust: { it: 5, mgmt: 2 } }, react: '李淑芬：好，至少我看得到產能利用率。' },
                { label: '開放 ERP 寫入 PLC', desc: '流程最短。', effect: { trust: { it: -10, quality: -4 }, addRisk: 'OT 網路遭跨層寫入風險', flag: 'otRisk' }, react: '何俊宏：我必須正式提出資安風險報告。' },
            ],
        },
        reward: { xp: { sys: 20, it: 6, ie: 6 }, funds: 150000, cert: 'CIM 系統整合', trust: { it: 8, mgmt: 5 }, promoteTo: 9 },
        journal: 'CIM 不是一個 AI 模型，而是整個製造與管理體系的整合。',
        codex: ['cim', 'mes', 'erp', 'wms', 'qms', 'scada', 'plc', 'iot', 'cmms', 'twin', 'otit'],
    },
    {
        id: 14, code: '終局', title: '智慧工廠總體最佳化：鳳凰計畫', role: '資深製程規劃暨 CIM 整合工程師', area: 12, requiredPos: 9,
        panels: [
            { npc: 'chou', text: '虛構 A 車廠下了一筆大型特殊扣件訂單。產能不足、能源漲價、原料延遲，全部同時發生。' },
            { npc: 'li', text: '改善預算上限 750 萬（含一季營運支出）。每一塊錢都要說得出效益。' },
            { npc: 'hsu', text: '人員、物料、資訊、設備、資金、能源——這次你要讓它們成為一個系統。' },
        ],
        objectives: ['OEE 提升 ≥ 10 個百分點', '單位良品成本 −8%、單位能耗 −8%', 'OTIF ≥ 95%、PPM ≤ 150', '無重大工安風險、不超出預算'],
        tutorial: ['多目標最佳化（Multi-Objective Optimization）：同時考量多個彼此衝突的目標。', '資本支出（CAPEX）以 5 年（260 週）折舊進入週成本；營運支出（OPEX）每週發生。', '同一隨機種子下的模擬可互相比較。'],
        game: 'phoenix',
        dilemma: { prompt: '', views: [], options: [] },
        reward: { xp: { sys: 10, ie: 10 }, funds: 0, trust: { mgmt: 10 } },
        journal: '系統最佳化不是買最多機器或導入最多 AI，而是在安全、品質、成本、交期、人與永續之間找到平衡。',
        codex: ['moo', 'capex'],
    },
];
exports.CODEX = [
    { id: 'ppe', zh: '個人防護具', en: 'Personal Protective Equipment', abbr: 'PPE', cat: '安全', def: '依作業風險配戴的安全鞋、護目鏡、耳罩、防切手套等。旋轉機台旁避免棉紗手套與飾品。' },
    { id: '5s', zh: '5S 現場管理', en: '5S', cat: '安全', def: '整理（Seiri）、整頓（Seiton）、清掃（Seiso）、清潔（Seiketsu）、素養（Shitsuke）。讓異常一眼可見。' },
    { id: 'sop', zh: '標準作業程序', en: 'Standard Operating Procedure', abbr: 'SOP', cat: '安全', def: '把安全、正確、有效率的作業方法文件化，讓不同人做出相同品質。' },
    { id: 'loto', zh: '上鎖掛牌', en: 'Lockout / Tagout', abbr: 'LOTO', cat: '安全', def: '維修或異常時切斷能源並上鎖、掛牌，避免他人誤啟動。' },
    { id: 'wirerod', zh: '盤元', en: 'Wire Rod', cat: '製程', def: '上游鋼廠以小鋼胚熱軋成的線材，捲成盤狀供扣件廠使用。扣件廠通常不自行煉鋼或軋鋼。' },
    { id: 'spheroidize', zh: '球化退火', en: 'Spheroidizing Annealing', cat: '製程', def: '使鋼中碳化物球狀化以提升冷鍛成形性。與伸線的先後順序依鋼種、產品與製造路徑而不同。' },
    { id: 'drawing', zh: '伸線', en: 'Wire Drawing', cat: '製程', def: '將線材拉過模具以控制線徑與表面，供冷鍛使用。' },
    { id: 'iqc', zh: '進料檢驗', en: 'Incoming Quality Control', abbr: 'IQC', cat: '品質', def: '原料或外購件進廠時的檢驗與文件核對（材證、批號、外觀、尺寸）。' },
    { id: 'trace', zh: '可追溯性', en: 'Traceability', cat: '品質', def: '成品批號可向上追溯原料爐號、製程條件與檢驗紀錄，向下追蹤出貨對象。' },
    { id: 'coldforge', zh: '冷鍛', en: 'Cold Forging', cat: '製程', def: '在常溫下以多工位模具將線材成形為螺絲頭部或螺帽，材料利用率高、強度佳。' },
    { id: 'dielife', zh: '模具壽命', en: 'Die Life', cat: '製程', def: '模具可穩定生產的數量，受速度、材料、潤滑與保養影響。磨耗會使裂紋與尺寸不良增加。' },
    { id: 'stdtime', zh: '標準工時', en: 'Standard Time', cat: 'IE', def: '正常時間 ×（1＋寬放率）。用於產能規劃與績效評估。' },
    { id: 'smed', zh: '快速換模', en: 'Single-Minute Exchange of Die', abbr: 'SMED', cat: 'IE', def: '把換模作業區分為內部與外部作業，將內部轉外部並簡化，以縮短換線時間。' },
    { id: 'rolling', zh: '搓牙', en: 'Thread Rolling', cat: '製程', def: '以兩片牙板滾壓成形螺栓外螺紋，屬塑性加工，不產生切屑，纖維連續、強度佳。' },
    { id: 'tapping', zh: '攻牙', en: 'Tapping', cat: '製程', def: '以絲攻加工螺帽內螺紋。與外螺紋搓牙必須區分。' },
    { id: 'coq', zh: '品質成本', en: 'Cost of Quality', abbr: 'COQ', cat: '品質', def: '預防成本、鑑定成本、內部失敗成本、外部失敗成本。越早預防，總成本越低。' },
    { id: 'prevailing', zh: '預置扭力', en: 'Prevailing Torque', cat: '製程', def: '防鬆螺帽在未產生夾緊力前即需克服的旋轉扭力，由特定結構或局部變形產生。' },
    { id: 'gauge', zh: '通止規', en: 'Go / No-Go Gauge', cat: '品質', def: '以「通端可通過、止端不可通過」快速判定螺紋是否合格。' },
    { id: 'heat', zh: '熱處理', en: 'Heat Treatment', cat: '製程', def: '淬火、回火等製程，以調整硬度與機械性質。採批次或連續爐運作。' },
    { id: 'special', zh: '特殊製程', en: 'Special Process', cat: '品質', def: '結果無法僅靠最終檢驗完全確認的製程（如熱處理、表面處理），須以參數監控與確效控制。' },
    { id: 'batch', zh: '批次製程', en: 'Batch Process', cat: 'IE', def: '一次處理一批產品。湊批節省能源，但等待會增加在製品與前置時間。' },
    { id: 'cof', zh: '摩擦係數', en: 'Coefficient of Friction', cat: '品質', def: '影響鎖附扭力與夾緊力的換算。表面處理與潤滑會改變摩擦係數。' },
    { id: 'optical', zh: '光學檢驗', en: 'Optical Inspection', cat: '品質', def: '以相機與影像處理自動檢測外觀、尺寸與組裝狀態，高速篩選。' },
    { id: 'detect', zh: '檢出率', en: 'Detection Rate', cat: '品質', def: '所有不良品中被成功抓出的比例。與 AI 的召回率概念相同。' },
    { id: 'falsereject', zh: '誤判率', en: 'False Reject Rate', cat: '品質', def: '良品被誤判為不良的比例。誤判太高會增加複判人力與報廢。' },
    { id: 'oee', zh: '設備綜合效率', en: 'Overall Equipment Effectiveness', abbr: 'OEE', cat: 'IE', def: 'OEE ＝ 可用率（Availability）× 效能（Performance）× 品質（Quality）。本遊戲的全線 OEE 以各站運轉時數加權，不含無訂單閒置。' },
    { id: 'tpm', zh: '全員生產保全', en: 'Total Productive Maintenance', abbr: 'TPM', cat: 'IE', def: '讓操作員參與自主保養、計畫保養與改善，提升設備可用率。' },
    { id: 'ergonomics', zh: '人因工程', en: 'Ergonomics', cat: 'IE', def: '設計適合人的工作與環境，降低疲勞、傷害與錯誤。' },
    { id: 'bottleneck', zh: '瓶頸', en: 'Bottleneck', cat: 'IE', def: '產能最受限制的工作站，決定整條產線產出。瓶頸可能因改善而移動。' },
    { id: 'mrp', zh: '物料需求規劃', en: 'Material Requirements Planning', abbr: 'MRP', cat: '生管', def: '依主生產排程與 BOM 展開需求：淨需求 ＝ 毛需求 − 庫存 − 在途 ＋ 安全庫存。' },
    { id: 'bom', zh: '物料清單', en: 'Bill of Materials', abbr: 'BOM', cat: '生管', def: '產品由哪些零件、多少數量組成的結構表。' },
    { id: 'crp', zh: '產能需求規劃', en: 'Capacity Requirements Planning', abbr: 'CRP', cat: '生管', def: '比較各工作中心負荷與可用產能，找出超載時段。' },
    { id: 'finite', zh: '有限產能排程', en: 'Finite Capacity Scheduling', cat: '生管', def: '排程時考慮機台實際可用時數與換線，排出可執行的計畫。' },
    { id: 'safetystock', zh: '安全庫存', en: 'Safety Stock', cat: '生管', def: '為吸收需求與供應變異而保留的緩衝庫存。' },
    { id: 'setup', zh: '換線時間', en: 'Setup Time', cat: '生管', def: '從上一批最後一顆良品到下一批第一顆良品的時間。' },
    { id: 'otif', zh: '準時足量交貨率', en: 'On Time In Full', abbr: 'OTIF', cat: '生管', def: '準時且數量足額交貨的比例。本遊戲以各產品準時交付數量 ÷ 需求計算。' },
    { id: 'aps', zh: '進階規劃排程系統', en: 'Advanced Planning and Scheduling', abbr: 'APS', cat: '系統', def: '考慮產能、物料、換線等限制的排程最佳化系統。' },
    { id: 'spc', zh: '統計製程管制', en: 'Statistical Process Control', abbr: 'SPC', cat: '品質', def: '以統計方法（管制圖等）監控製程，區分共同原因與特殊原因變異。' },
    { id: 'controlchart', zh: '管制圖', en: 'Control Chart', cat: '品質', def: 'X̄-R 圖：UCL/LCL ＝ X̿ ± A₂R̄（n＝5 時 A₂＝0.577）。超出界限或連續 8 點同側為異常訊號。' },
    { id: 'cpk', zh: '製程能力指標', en: 'Process Capability Index', abbr: 'Cp / Cpk', cat: '品質', def: 'Cp ＝ (USL−LSL)/6σ；Cpk ＝ min(USL−μ, μ−LSL)/3σ。車用常要求 Cpk ≥ 1.33。' },
    { id: 'pareto', zh: '柏拉圖', en: 'Pareto Chart', cat: '品質', def: '依頻率排序的長條圖加累積線，找出影響最大的少數問題（80/20）。' },
    { id: 'fishbone', zh: '魚骨圖', en: 'Ishikawa Diagram', cat: '品質', def: '從人、機、料、法、環、測等面向列出可能原因。' },
    { id: '5why', zh: '5 Why 根因分析', en: '5 Whys', cat: '品質', def: '連續追問「為什麼」以追到可控制的根本原因。' },
    { id: 'fmea', zh: '失效模式與效應分析', en: 'Failure Mode and Effects Analysis', abbr: 'FMEA', cat: '品質', def: '事先評估潛在失效的嚴重度、發生度、偵測度，排定預防措施。' },
    { id: '8d', zh: '8D 問題解決', en: '8 Disciplines', abbr: '8D', cat: '品質', def: 'D1 組隊、D2 問題描述、D3 圍堵、D4 根因、D5 對策、D6 執行驗證、D7 預防再發、D8 結案。' },
    { id: 'dmaic', zh: '六標準差 DMAIC', en: 'Define-Measure-Analyze-Improve-Control', abbr: 'DMAIC', cat: '品質', def: '定義、量測、分析、改善、管制的改善流程。' },
    { id: 'msa', zh: '量測系統分析', en: 'Measurement System Analysis', abbr: 'MSA', cat: '品質', def: '評估量測系統的重複性與再現性（GR&R），確認數據可信。' },
    { id: 'qcqa', zh: 'QC 與 QA', en: 'Quality Control vs Quality Assurance', cat: '品質', def: 'QC 重檢驗、異常判定與品質數據；QA 重品質系統、預防機制、稽核與程序管理。' },
    { id: 'tco', zh: '總持有成本', en: 'Total Cost of Ownership', abbr: 'TCO', cat: '生管', def: '採購單價以外，再加上運輸、品質、缺料風險、庫存持有等全部成本。' },
    { id: 'supplierperf', zh: '供應商績效', en: 'Supplier Performance', cat: '生管', def: '以準交率、品質 PPM、價格、回應速度等指標評核供應商。' },
    { id: 'leadtime', zh: '交期／前置時間', en: 'Lead Time', cat: '生管', def: '從下單（或投料）到收料（或交付）的總時間。' },
    { id: 'supplyrisk', zh: '供應風險', en: 'Supply Risk', cat: '生管', def: '單一來源、地緣、運輸、品質等造成斷料的可能性與衝擊。' },
    { id: 'turnover', zh: '存貨周轉率', en: 'Inventory Turnover', cat: '生管', def: '銷貨成本 ÷ 平均存貨。周轉越快，資金積壓越少。' },
    { id: 'takt', zh: '節拍時間', en: 'Takt Time', cat: 'IE', def: '可用生產時間 ÷ 客戶需求量。代表「客戶需要的生產節奏」。' },
    { id: 'cycletime', zh: '週期時間', en: 'Cycle Time', cat: 'IE', def: '某工作站實際完成一單位所需時間。若大於節拍時間即無法滿足需求。' },
    { id: 'lean', zh: '精實生產', en: 'Lean Manufacturing', cat: 'IE', def: '以顧客價值為中心，持續消除浪費。' },
    { id: 'waste', zh: '七大浪費', en: 'Seven Wastes', cat: 'IE', def: '過量生產、等待、搬運、過度加工、庫存、多餘動作、不良重工。' },
    { id: 'toc', zh: '限制理論', en: 'Theory of Constraints', abbr: 'TOC', cat: 'IE', def: '找出限制→充分利用→其他配合→提升限制→重新找限制。' },
    { id: 'littles', zh: '小法則', en: "Little's Law", cat: 'IE', def: 'WIP ＝ 產出率 × 流程時間。例：產出 600 顆/時、WIP 24,000 顆 → 流程時間 40 小時。' },
    { id: 'vsm', zh: '價值流程圖', en: 'Value Stream Map', abbr: 'VSM', cat: 'IE', def: '描繪物流與資訊流，區分加值與非加值時間。' },
    { id: 'linebal', zh: '產線平衡', en: 'Line Balancing', cat: 'IE', def: '把作業分配到各站，使週期時間接近、減少等待。' },
    { id: 'or', zh: '作業研究', en: 'Operations Research', abbr: 'OR', cat: 'IE', def: '以數學模型（線性規劃、排程、排隊）求最佳決策。' },
    { id: 'des', zh: '離散事件模擬', en: 'Discrete Event Simulation', abbr: 'DES', cat: 'IE', def: '以事件驅動模擬系統運作，評估方案而不必實際試錯。' },
    { id: 'datacleaning', zh: '資料清理', en: 'Data Cleaning', cat: 'AI', def: '處理缺失、重複、單位錯誤、命名不一致等問題，確保分析可信。' },
    { id: 'precision', zh: '精確率', en: 'Precision', cat: 'AI', def: 'TP ÷ (TP＋FP)：判為不良的產品中，真正不良的比例。' },
    { id: 'recall', zh: '召回率', en: 'Recall', cat: 'AI', def: 'TP ÷ (TP＋FN)：所有不良品中被抓出的比例。漏檢（FN）越少越高。' },
    { id: 'confusion', zh: '混淆矩陣', en: 'Confusion Matrix', cat: 'AI', def: 'TP、FP、FN、TN 四格表，呈現模型的正確與錯誤類型。' },
    { id: 'leakage', zh: '資料洩漏', en: 'Data Leakage', cat: 'AI', def: '訓練時用到測試或未來才知道的資訊，導致評估過度樂觀。' },
    { id: 'drift', zh: '資料漂移', en: 'Data Drift', cat: 'AI', def: '上線後輸入資料分布改變（新材料、新光源），模型表現下降。' },
    { id: 'rag', zh: '檢索增強生成', en: 'Retrieval-Augmented Generation', abbr: 'RAG', cat: 'AI', def: '先檢索相關文件，再由語言模型產生附來源的回答，降低幻覺。' },
    { id: 'vlm', zh: '視覺語言模型', en: 'Vision-Language Model', abbr: 'VLM', cat: 'AI', def: '可同時理解影像與文字的模型，可用於圖面辨識。' },
    { id: 'ocr', zh: '光學字元辨識', en: 'Optical Character Recognition', abbr: 'OCR', cat: 'AI', def: '把影像中的文字轉成可編輯文字。' },
    { id: 'etl', zh: '資料擷取轉換載入', en: 'Extract, Transform, Load', abbr: 'ETL', cat: 'AI', def: '從來源系統擷取、轉換格式並載入目標資料庫。' },
    { id: 'sql', zh: '結構化查詢語言', en: 'Structured Query Language', abbr: 'SQL', cat: 'AI', def: '查詢與管理關聯式資料庫的語言。' },
    { id: 'pdm', zh: '預測性維護', en: 'Predictive Maintenance', abbr: 'PdM', cat: 'AI', def: '以震動、溫度、電流等資料估計故障風險，在故障前安排保養。' },
    { id: 'cv', zh: '電腦視覺', en: 'Computer Vision', cat: 'AI', def: '讓電腦從影像中辨識物件與瑕疵。' },
    { id: 'mvp', zh: '最小可行產品', en: 'Minimum Viable Product', abbr: 'MVP', cat: 'AI', def: '能驗證核心價值的最小可交付範圍；先上線、再依回饋擴充。' },
    { id: 'rbac', zh: '角色型存取控制', en: 'Role-Based Access Control', abbr: 'RBAC', cat: '系統', def: '依角色授予權限，例如業務看不到成本明細、AI 只能唯讀。' },
    { id: 'idem', zh: '冪等性', en: 'Idempotency', cat: '系統', def: '同一請求重送多次，結果只發生一次。整合 ERP 時可避免重複下單或重複扣帳。' },
    { id: 'hitl', zh: '人工介入', en: 'Human-in-the-Loop', abbr: 'HITL', cat: 'AI', def: 'AI 或 Agent 的關鍵決策保留人工確認，並留下稽核紀錄。' },
    { id: 'quant', zh: '模型量化', en: 'Quantization', cat: 'AI', def: '以 INT8、INT4 等較低精度儲存模型權重，降低 GPU 記憶體與延遲，可能犧牲部分品質。' },
    { id: 'incident', zh: '事故應變', en: 'Incident Response', cat: '系統', def: '圍堵 → 通報 → 界定範圍 → 修復 → 預防再發 → 監控；不隱匿、不刪除證據。' },
    { id: 'cim', zh: '電腦整合製造', en: 'Computer Integrated Manufacturing', abbr: 'CIM', cat: '系統', def: '以資訊系統整合設計、製造、管理與決策的製造體系。' },
    { id: 'mes', zh: '製造執行系統', en: 'Manufacturing Execution System', abbr: 'MES', cat: '系統', def: '管理工單、派工、報工、批號履歷與現場資料。' },
    { id: 'erp', zh: '企業資源規劃', en: 'Enterprise Resource Planning', abbr: 'ERP', cat: '系統', def: '整合訂單、採購、庫存、生產、財務的企業系統。' },
    { id: 'wms', zh: '倉儲管理系統', en: 'Warehouse Management System', abbr: 'WMS', cat: '系統', def: '管理儲位、收發料與庫存數量。' },
    { id: 'qms', zh: '品質管理系統', en: 'Quality Management System', abbr: 'QMS', cat: '系統', def: '管理檢驗、異常、矯正預防與稽核紀錄。' },
    { id: 'scada', zh: '監控與資料擷取系統', en: 'Supervisory Control and Data Acquisition', abbr: 'SCADA', cat: '系統', def: '監控設備狀態與擷取製程數據。' },
    { id: 'plc', zh: '可程式邏輯控制器', en: 'Programmable Logic Controller', abbr: 'PLC', cat: '系統', def: '直接控制機台動作的工業控制器，屬 OT 層。' },
    { id: 'iot', zh: '物聯網', en: 'Internet of Things', abbr: 'IoT', cat: '系統', def: '以感測器與網路連接設備，蒐集即時資料。' },
    { id: 'cmms', zh: '設備維護管理系統', en: 'Computerized Maintenance Management System', abbr: 'CMMS', cat: '系統', def: '管理保養計畫、工單、備品與故障紀錄。' },
    { id: 'twin', zh: '數位孿生', en: 'Digital Twin', cat: '系統', def: '以即時資料驅動的虛擬工廠模型，用於模擬、預測與最佳化。' },
    { id: 'otit', zh: 'OT／IT 資安分區', en: 'OT / IT Segmentation', cat: '系統', def: '營運技術（OT）與資訊技術（IT）網路分層，經 DMZ 交換資料，避免跨層直接寫入。' },
    { id: 'moo', zh: '多目標最佳化', en: 'Multi-Objective Optimization', cat: 'IE', def: '同時考量成本、品質、交期、安全、能源等衝突目標，尋找平衡解。' },
    { id: 'capex', zh: '資本支出與營運支出', en: 'CAPEX / OPEX', cat: 'IE', def: 'CAPEX 為設備等長期投資，以折舊分攤；OPEX 為每期發生的營運費用。' },
];
exports.PATENTS = [
    {
        id: 'tw683065', no: 'TWI683065B', title: '組合式套管螺絲', kind: '發明專利', url: 'https://patents.google.com/patent/TWI683065B/zh',
        confirmed: ['專利號與名稱：TWI683065B「組合式套管螺絲」（公開專利資料庫）。', '屬於產品結構類專利，保護特定的套管與螺絲組合結構。'],
        inference: ['教學推論：套管螺絲常用於需「預先組裝、不易脫落」的場合，例如模組件的預組。', '教學推論：結構設計關注套管限位、組裝後不脫落與鎖附時的同軸性。'],
        process: '冷鍛 → 搓牙 → 熱處理／表面處理 → 套管組裝 → 光學檢查（教學簡化）', problem: '套管脫落、限位不足、組裝效率', ai: '以影像辨識檢查套管是否到位、是否脫落。',
    },
    {
        id: 'tw710715', no: 'TWI710715B', title: '組合式套管螺絲製造方法', kind: '發明專利', url: 'https://patents.google.com/patent/TWI710715B/zh',
        confirmed: ['專利號與名稱：TWI710715B「組合式套管螺絲製造方法」（公開專利資料庫）。', '屬於製造方法類專利，與 TWI683065B 的產品主題相關。'],
        inference: ['教學推論：方法專利保護的是特定步驟組合，不代表整道一般扣件製程都屬於專利範圍。', '教學推論：組裝順序與成形步驟的安排會影響良率與節拍。'],
        process: '螺絲本體成形與套管組裝順序（教學簡化）', problem: '組裝步驟順序、成形後尺寸穩定性', ai: '以製程數據預測組裝不良的風險。',
    },
    {
        id: 'tw753649', no: 'TWI753649B', title: '預置扭力螺帽製成方法', kind: '發明專利', url: 'https://patents.google.com/patent/TWI753649B/zh',
        confirmed: ['專利號與名稱：TWI753649B「預置扭力螺帽製成方法」（公開專利資料庫）。', '本作依專題簡報所述，其重點在「熱處理後的硬度」與「特定軸向沖壓條件」的配合；詳細請求項請以專利原文為準。'],
        inference: ['教學推論：硬度太高，沖壓變形不足或易裂；硬度太低，預置扭力可能不穩定。', '教學推論：此專利不應被簡化為「一般熱處理專利」。遊戲中的硬度、沖壓參數皆為虛構示意。'],
        process: '冷鍛 → 攻牙 → 熱處理 → 軸向沖壓 → 表面處理 → 檢驗（教學簡化）', problem: '預置扭力的穩定性與重複性', ai: 'TorqueMind AI：以硬度、沖壓深度、壓力預測扭力區間（教學模擬）。',
    },
    {
        id: 'tw761005', no: 'TWI761005B', title: '快速定位扣件', kind: '發明專利', url: 'https://patents.google.com/patent/TWI761005B/zh',
        confirmed: ['專利號與名稱：TWI761005B「快速定位扣件」（公開專利資料庫）。'],
        inference: ['教學推論：快速定位與公差補償類扣件的目的，是在組裝時吸收零件間的公差、縮短對位時間。', '教學推論：此類產品的檢驗重點常在定位尺寸與組裝功能。'],
        process: '成形 → 二次加工 → 組裝 → 功能檢查（教學簡化）', problem: '組裝公差累積、對位效率', ai: '以尺寸量測資料做公差堆疊分析。',
    },
    {
        id: 'twm608701', no: 'TWM608701U', title: '密合鎖固螺帽自動化裝置', kind: '新型專利', url: 'https://patents.google.com/patent/TWM608701U/zh',
        confirmed: ['專利號與名稱：TWM608701U「密合鎖固螺帽自動化裝置」（公開專利資料庫）。', '屬於新型專利，保護裝置的形狀或構造。'],
        inference: ['教學推論：自動化鎖付／組裝設備可降低人工作業變異並提升節拍。', '教學推論：自動化裝置仍需搭配防錯（Poka-Yoke）與在線檢測。'],
        process: '自動組裝／鎖付（教學簡化）', problem: '人工組裝變異、節拍與一致性', ai: '以設備感測資料監控鎖付異常。',
    },
];
exports.EVENTS = [
    { id: 'dieBreak', title: '冷鍛模具突然損壞', npc: 'chen', minCh: 2, weightFlag: 'skipMaint', desc: '第三工位模具崩角，頭部出現裂紋。產線已自動停機。',
        options: [
            { label: '換上備用模具並全檢當班產品', desc: '停機 2 小時、全檢人力', effect: { funds: -25000, st: { forge: { Q: 0.003 } }, trust: { quality: 4 }, unflag: 'skipMaint' } },
            { label: '緊急修模後復機，抽檢 5 箱', desc: '較快，但有殘留風險', effect: { funds: -10000, f: { latent: 0.0008 }, trust: { plan: 2 } } },
            { label: '建立模具壽命計數與預防更換制度', desc: '短期花費高，長期穩定', effect: { funds: -40000, st: { forge: { A: 0.02, Q: 0.003 } }, trust: { floor: 4, mgmt: 2 }, unflag: 'skipMaint' } },
        ] },
    { id: 'threadNG', title: '搓牙不良率持續增加', npc: 'huang', minCh: 3, weightFlag: 'threadWear', desc: '連續三天搓牙缺牙比例上升，SPC 出現連續 8 點上升趨勢。',
        options: [
            { label: '停線檢查牙板與送料，建立牙板壽命管理', desc: '停機半班', effect: { funds: -20000, st: { thread: { Q: 0.006, A: -0.005 } }, trust: { quality: 4 }, unflag: 'threadWear' } },
            { label: '加嚴抽檢、繼續生產', desc: '鑑定成本上升', effect: { funds: -8000, trust: { plan: 2 } } },
            { label: '調降搓牙速度 10%', desc: '品質回穩、產能下降', effect: { st: { thread: { P: -0.03, Q: 0.004 } }, trust: { quality: 2, plan: -2 } } },
        ] },
    { id: 'furnace', title: '熱處理爐溫度異常', npc: 'huang', minCh: 4, desc: '第二爐區熱電偶讀值跳動，懷疑感測器老化。',
        options: [
            { label: '停爐校正並隔離受影響批次', desc: '安全且可追溯', effect: { funds: -30000, trust: { quality: 5 }, st: { heat: { A: -0.01 } } } },
            { label: '加裝備援熱電偶，持續監控', desc: '中等成本', effect: { funds: -18000, st: { heat: { Q: 0.002 } }, trust: { quality: 3, it: 2 } } },
            { label: '繼續生產，等定期保養再處理', desc: '暫時無成本', effect: { f: { latent: 0.0012 }, trust: { quality: -5 }, brand: -1 } },
        ] },
    { id: 'friction', title: '表面處理摩擦係數偏離規格', npc: 'keller', minCh: 4, desc: '客戶抽測發現某批次摩擦係數偏高，鎖附扭力與夾緊力關係不穩。',
        options: [
            { label: '追溯藥液濃度紀錄，調整並重新驗證', desc: '找出製程原因', effect: { funds: -20000, st: { surface: { Q: 0.004 } }, trust: { quality: 4 }, brand: 1 } },
            { label: '該批全數重新處理', desc: '保守', effect: { funds: -35000, trust: { quality: 2 }, brand: 1 } },
            { label: '請客戶調整鎖附參數', desc: '把問題推給客戶', effect: { brand: -5, trust: { quality: -4, mgmt: -2 } } },
        ] },
    { id: 'sleeveOff', title: '組裝站發現套管螺絲脫落', npc: 'lin', minCh: 5, desc: '包裝前抽查發現少量套管脫落，疑似壓入深度不足。',
        options: [
            { label: '加裝壓入行程感測與防錯（Poka-Yoke）', desc: '從源頭防止', effect: { funds: -30000, st: { assembly: { Q: 0.006 } }, trust: { quality: 4, floor: 2 } } },
            { label: '光學檢查加入套管限位判定', desc: '靠檢驗攔截', effect: { funds: -15000, f: { detect: 0.005 }, trust: { quality: 2 } } },
            { label: '要求作業員更小心', desc: '零成本', effect: { trust: { floor: -3 } } },
        ] },
    { id: 'opticalMiss', title: '光學檢驗設備漏判瑕疵', npc: 'huang', minCh: 5, weightFlag: 'looseOptical', desc: '客戶端發現 3 顆毛邊品，追查為光學機鏡頭髒污加上門檻偏鬆。',
        options: [
            { label: '回收可疑批次、清潔與校正、重新驗證門檻', desc: '對客戶負責', effect: { funds: -40000, f: { detect: 0.02 }, trust: { quality: 5 }, brand: 1, unflag: 'looseOptical' } },
            { label: '鏡頭清潔納入每班點檢', desc: '預防再發', effect: { funds: -5000, f: { detect: 0.01 }, trust: { quality: 3 } } },
            { label: '寄送替換品了事', desc: '最便宜', effect: { funds: -8000, brand: -3, trust: { quality: -3 } } },
        ] },
    { id: 'rushOrder', title: '客戶臨時增加訂單', npc: 'tsai', minCh: 2, desc: '虛構 A 車廠要求本週追加 3,000 顆六角螺栓。',
        options: [
            { label: '週六加班 8 小時', desc: '人力成本上升、疲勞增加', effect: { f: { overtimeH: 4 }, funds: -15000, trust: { plan: 3 }, brand: 2, flag: 'fatigue' } },
            { label: '協商分兩週交貨', desc: '以產能數據溝通', effect: { trust: { plan: 2, mgmt: 1 } } },
            { label: '婉拒追加', desc: '維持原計畫', effect: { brand: -2, trust: { mgmt: -2 } } },
        ] },
    { id: 'wireDelay', title: '供應商盤元延遲到貨', npc: 'wu', minCh: 1, weightFlag: 'singleSource', desc: '主要供應商通知盤元延遲 5 天到貨。',
        options: [
            { label: '動用安全庫存並向第二供應商調貨', desc: '加價 3%', effect: { funds: -20000, trust: { plan: 3, purchase: 2 } } },
            { label: '空運部分急料', desc: '運費高', effect: { funds: -45000, trust: { plan: 4 } } },
            { label: '調整排程先做有料的產品', desc: '部分訂單延後', effect: { f: { supplierDelay: 0.03 }, trust: { plan: 1 }, brand: -1 } },
        ] },
    { id: 'erpMismatch', title: 'ERP 庫存與現場實際數量不符', npc: 'wu', minCh: 7, desc: 'ERP 顯示套管庫存 12,000 個，現場盤點只有 9,800 個。',
        options: [
            { label: '循環盤點＋追查異動紀錄，修正報工流程', desc: '找出系統性原因', effect: { funds: -10000, f: { dataQuality: 0.04 }, trust: { plan: 4, it: 2 } } },
            { label: '直接調整 ERP 數字', desc: '快速但原因不明', effect: { trust: { plan: 1 } } },
            { label: '多備 30% 安全庫存', desc: '用庫存掩蓋問題', effect: { f: { safetyStockDays: 2 }, funds: -15000 } },
        ] },
    { id: 'sensorLost', title: '設備感測器失去連線', npc: 'ho', minCh: 10, desc: '冷鍛機震動感測器資料中斷 6 小時，PdM 模型無輸入。',
        options: [
            { label: '啟用斷線告警與緩存補傳機制', desc: '提升韌性', effect: { funds: -15000, f: { dataQuality: 0.02 }, trust: { it: 4 } } },
            { label: '派人手動巡檢紀錄', desc: '臨時替代', effect: { funds: -5000, trust: { floor: 1 } } },
            { label: '先不管', desc: '模型以舊資料運作', effect: { st: { forge: { A: -0.01 } }, trust: { it: -2 } } },
        ] },
    { id: 'drift', title: 'AI 預測結果發生資料漂移', npc: 'cheng', minCh: 11, weightFlag: 'aiRush', desc: '更換光源後，視覺模型誤判率上升 3 倍。',
        options: [
            { label: '收集新光源影像、重新標註與驗證後再上線', desc: 'MLOps 正規流程', effect: { funds: -30000, f: { falseReject: -0.004, detect: 0.01 }, trust: { it: 5, quality: 3 }, unflag: 'aiRush' } },
            { label: '暫時切回人工＋規則式判定', desc: '降級運作', effect: { funds: -10000, trust: { quality: 3 } } },
            { label: '調高門檻壓低誤判', desc: '漏檢上升', effect: { f: { detect: -0.03, falseReject: -0.005 }, trust: { quality: -5 } } },
        ] },
    { id: 'fatigueEv', title: '員工因過度加班而疲勞', npc: 'lin', minCh: 6, weightFlag: 'fatigue', desc: '夜班兩位同仁反映頭暈，差點把手伸進送料區。',
        options: [
            { label: '取消本週加班、安排輪休與人因評估', desc: '員工優先', effect: { f: { overtimeH: -6, training: 2 }, trust: { floor: 6 }, unflag: 'fatigue' } },
            { label: '輪調至低風險站並縮短工時', desc: '折衷', effect: { f: { overtimeH: -3 }, trust: { floor: 3 } } },
            { label: '維持加班、發放加班津貼', desc: '產量優先', effect: { funds: -10000, trust: { floor: -6 }, addRisk: '疲勞作業造成捲入風險' } },
        ] },
    { id: 'traceBreak', title: '系統整合造成批號追溯資料中斷', npc: 'ho', minCh: 12, desc: 'MES 升級後，3 天的熱處理批號沒有寫入生產履歷。',
        options: [
            { label: '以紙本爐卡補登並建立整合測試案例', desc: '修復＋預防', effect: { funds: -20000, f: { dataQuality: 0.03 }, trust: { quality: 4, it: 3 } } },
            { label: '回滾到舊版 MES', desc: '保守', effect: { funds: -10000, trust: { it: 1 } } },
            { label: '這 3 天標記為「資料缺漏」繼續出貨', desc: '追溯斷鏈', effect: { brand: -4, trust: { quality: -6 } } },
        ] },
    { id: 'shipping', title: '海外供應鏈運輸受阻', npc: 'chang', minCh: 9, weightFlag: 'singleSource', desc: '國際航線延誤，海外盤元預估晚到 3 週。',
        options: [
            { label: '轉國內供應商補量，接受較高單價', desc: '韌性優先', effect: { funds: -30000, f: { priceFactor: 0.01 }, trust: { purchase: 4 } } },
            { label: '部分改空運', desc: '高運費', effect: { funds: -60000, trust: { plan: 3 } } },
            { label: '等船', desc: '缺料風險', effect: { f: { supplierDelay: 0.08 }, brand: -2 } },
        ] },
];
exports.ACHIEVEMENTS = {
    safety: { name: '零重大工安違規', desc: '完成序章且從未選擇違反安全規範的選項。' },
    firstDie: { name: '第一次成功換模', desc: '冷鍛章節得分 ≥ 70。' },
    bottleneck: { name: '找出真正瓶頸', desc: '在資料分析中正確辨識瓶頸站。' },
    yield: { name: '改善良率', desc: '工廠全線良率較初始提升。' },
    firstAI: { name: '完成第一個 AI 專案', desc: '完成任一 AI 專案。' },
    allAI: { name: 'AI 全專案', desc: '完成全部 4 個 AI 專案。' },
    sync: { name: '讓 MES 與 ERP 正確同步', desc: 'CIM 章節完成欄位映射。' },
    optimize: { name: '完成全廠最佳化', desc: '鳳凰計畫達成全部目標。' },
    survivor: { name: 'AI 工程師生存者', desc: '通過《AI 工程師生存戰》階段考核。' },
    navigator: { name: '智慧製造領航者', desc: '在生存戰中達成結局 A。' },
    scholar: { name: '百科學者', desc: '解鎖 60 個以上百科條目。' },
    spc: { name: '異常獵人', desc: 'SPC 章節正確找出所有異常點。' },
    tco: { name: '總成本思維', desc: '供應鏈章節 TCO 接近最佳。' },
    leader: { name: '以人為本', desc: '帶班時沒有讓高疲勞者上高風險站。' },
};
exports.ENDINGS = {
    balance: { title: '智慧製造平衡結局', color: '#7cf29c', text: '安全、品質、交期、成本與永續達成較佳平衡。你讓人員、物料、資訊、設備、資金與能源成為一個可靠的系統。' },
    highCapacity: { title: '高產能但成本控制不佳', color: '#ffd23f', text: '訂單準時交付了，但成本結構失衡。下一次，試著把錢花在瓶頸與源頭，而非全面擴充。' },
    costImbalance: { title: '成本降低但人員與品質失衡', color: '#ff9a3c', text: '帳面成本漂亮，但員工安全或客戶品質付出了代價。系統最佳化不能犧牲人與信任。' },
    aiNoBottleneck: { title: 'AI 專案多卻沒有真正改善瓶頸', color: '#ff5d73', text: 'AI 很亮眼，但瓶頸仍卡在原地。改善非瓶頸，不會改善整條產線。' },
    energyGap: { title: '客戶滿意，但能源效率仍需改善', color: '#39d5ff', text: '客戶滿意度很高，但能耗與排放還有空間。永續也是競爭力。' },
};
exports.FINAL_ID = exports.CHAPTERS.length - 1;

};
factories["./sim.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fmt = exports.PHOENIX_SEED = exports.OPEX_WEEKS = exports.PHOENIX_BUDGET = exports.PHOENIX_OPTIONS = exports.COST_LABELS = exports.PRODUCTS = exports.STATION_INFO = exports.STATION_ORDER = exports.r2 = exports.clamp = void 0;
exports.mulberry32 = mulberry32;
exports.baseFactory = baseFactory;
exports.simulateWeek = simulateWeek;
exports.applyEffect = applyEffect;
exports.phoenixFactory = phoenixFactory;
exports.phoenixCost = phoenixCost;
exports.phoenixApply = phoenixApply;
exports.evaluatePhoenix = evaluatePhoenix;
exports.endingOf = endingOf;
function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
exports.clamp = clamp;
const r2 = (v) => Math.round(v * 100) / 100;
exports.r2 = r2;
exports.STATION_ORDER = ['draw', 'forge', 'thread', 'heat', 'secondary', 'surface', 'assembly', 'optical'];
exports.STATION_INFO = {
    draw: { name: '伸線', en: 'Wire Drawing', area: 3 },
    forge: { name: '冷鍛／打頭', en: 'Cold Forging', area: 4 },
    thread: { name: '搓牙／攻牙', en: 'Thread Rolling / Tapping', area: 5 },
    heat: { name: '熱處理', en: 'Heat Treatment', area: 6, batch: true },
    secondary: { name: '二次加工／軸向沖壓', en: 'Secondary Ops / Axial Stamping', area: 8 },
    surface: { name: '表面處理', en: 'Surface Treatment', area: 7 },
    assembly: { name: '套管組裝', en: 'Sleeve Assembly', area: 8 },
    optical: { name: '光學篩選', en: 'Optical Inspection', area: 9 },
};
exports.PRODUCTS = {
    HB: {
        id: 'HB', name: '車用六角螺栓', en: 'Hex Bolt', mat: '中碳合金鋼盤元（模擬）', matCost: 3.5,
        route: { draw: 1, forge: 1, thread: 1, heat: 1, surface: 1, optical: 1 },
        note: '外螺紋以搓牙（Thread Rolling）成形。',
    },
    PTN: {
        id: 'PTN', name: '預置扭力防鬆螺帽', en: 'Prevailing Torque Nut', mat: '中碳鋼盤元（模擬）', matCost: 4.2,
        route: { draw: 1, forge: 1.05, thread: 1.15, heat: 1, secondary: 1, surface: 1, optical: 1.05 },
        note: '內螺紋以攻牙（Tapping）加工；熱處理後再進行軸向沖壓（教學簡化途程）。',
    },
    CSS: {
        id: 'CSS', name: '組合式套管螺絲', en: 'Captive Sleeve Screw', mat: '低碳硼鋼盤元＋外購套管（模擬）', matCost: 9.0,
        route: { draw: 1, forge: 1.1, thread: 1, heat: 1, surface: 1, assembly: 1, optical: 1.2 },
        note: '螺絲本體搓牙後與套管組裝，光學檢查含套管限位與脫落。',
    },
};
function baseFactory() {
    return {
        stations: {
            draw: { rate: 1500, machines: 1, A: 0.92, P: 0.93, Q: 0.995, setupH: 0.5, kW: 55 },
            forge: { rate: 1000, machines: 1, A: 0.9, P: 0.92, Q: 0.985, setupH: 1.1, kW: 90 },
            thread: { rate: 850, machines: 1, A: 0.86, P: 0.9, Q: 0.97, setupH: 1.0, kW: 45 },
            heat: { rate: 1200, machines: 1, A: 0.92, P: 0.86, Q: 0.99, setupH: 0.5, kW: 210 },
            secondary: { rate: 1100, machines: 1, A: 0.9, P: 0.92, Q: 0.99, setupH: 0.8, kW: 40 },
            surface: { rate: 950, machines: 1, A: 0.9, P: 0.92, Q: 0.982, setupH: 0.6, kW: 80 },
            assembly: { rate: 900, machines: 1, A: 0.88, P: 0.9, Q: 0.98, setupH: 0.6, kW: 25 },
            optical: { rate: 880, machines: 1, A: 0.93, P: 0.95, Q: 1, setupH: 0.3, kW: 15 },
        },
        detect: 0.92, falseReject: 0.02, latent: 0.006,
        overtimeH: 0, operators: 46, training: 30, dataQuality: 0.7,
        supplierDelay: 0, safetyStockDays: 2, energyPrice: 3.6, offPeakHeat: false, energyFactor: 1, priceFactor: 1,
        safetyRisks: [], capexWeekly: 0, opexExtra: 0,
        demand: { HB: 30000, PTN: 14000, CSS: 11000 },
        wage: 290,
    };
}
exports.COST_LABELS = {
    material: '原料', labor: '人力', energy: '能源', depreciation: '設備折舊', tooling: '模具與耗材',
    maintenance: '維修保養', scrap: '報廢與重工', inspection: '品質檢測', holding: '存貨持有',
    logistics: '運輸與急件', ai: 'AI 建置維運', penalty: '停機與交期違約',
};
function simulateWeek(f, seed = 1) {
    const rnd = mulberry32(seed);
    const planned = 80 + f.overtimeH;
    const planLoss = (1 - f.dataQuality) * 12;
    const need = 46;
    const fatigue = (0, exports.clamp)(22 + f.overtimeH * 1.6 - f.training * 0.12 + Math.max(0, need - f.operators) * 4, 0, 100);
    const fatigueQ = fatigue > 55 ? (fatigue - 55) * 0.0006 : 0;
    const materialAvail = (0, exports.clamp)(1 - f.supplierDelay * (1 - (0, exports.clamp)(f.safetyStockDays / 5, 0, 1)), 0, 1);
    const inp = { HB: 0, PTN: 0, CSS: 0 };
    const latentCnt = { HB: 0, PTN: 0, CSS: 0 };
    let released = 0, matCost = 0;
    Object.keys(exports.PRODUCTS).forEach((p) => {
        inp[p] = f.demand[p] * 1.03 * materialAvail;
        released += inp[p];
        matCost += inp[p] * exports.PRODUCTS[p].matCost * f.priceFactor;
    });
    const stations = [];
    let kWh = 0, scrapTot = 0, reworkTot = 0, blockedWip = 0, downtime = 0, rty = 1, forgeThreadProcessed = 0;
    let escaped = 0, caught = 0, falseRej = 0;
    for (const sid of exports.STATION_ORDER) {
        const s = f.stations[sid];
        const routed = Object.keys(exports.PRODUCTS).filter((p) => exports.PRODUCTS[p].route[sid] && inp[p] > 0);
        if (!routed.length)
            continue;
        const noise = (rnd() - 0.5) * 0.02;
        const Aeff = (0, exports.clamp)(s.A + noise, 0.4, 0.995);
        const changeovers = routed.length * 2;
        const setupLoss = changeovers * s.setupH;
        const grossH = s.machines * planned;
        const availH = Math.max(0, grossH * Aeff - setupLoss - planLoss);
        const capEq = availH * s.rate * s.P;
        const reqEq = routed.reduce((a, p) => a + inp[p] * (exports.PRODUCTS[p].route[sid] || 0), 0);
        const ratio = reqEq > 0 ? Math.min(1, capEq / reqEq) : 1;
        const Qs = sid === 'optical' ? 1 : (0, exports.clamp)(s.Q - fatigueQ, 0.8, 0.9995);
        let processed = 0, scrap = 0, rework = 0, runEq = 0;
        for (const p of routed) {
            const proc = inp[p] * ratio;
            blockedWip += inp[p] - proc;
            latentCnt[p] *= ratio;
            processed += proc;
            runEq += proc * (exports.PRODUCTS[p].route[sid] || 0);
            if (sid === 'forge')
                latentCnt[p] += proc * f.latent;
            if (sid === 'optical') {
                const lat = latentCnt[p];
                const c = lat * f.detect;
                caught += c;
                escaped += lat - c;
                falseRej += (proc - lat) * f.falseReject;
                inp[p] = proc - c;
            }
            else {
                const defect = proc * (1 - Qs);
                scrap += defect * 0.6;
                rework += defect * 0.4;
                inp[p] = proc - defect * 0.6;
            }
        }
        if (sid !== 'optical')
            rty *= Qs;
        scrapTot += scrap;
        reworkTot += rework;
        const runH = runEq / (s.rate * s.P);
        const idleH = Math.max(0, availH - runH);
        const standby = sid === 'heat' ? (f.offPeakHeat ? 0.35 : 0.5) : 0.2;
        const e = (runH * s.kW + idleH * s.kW * standby) * f.energyFactor;
        kWh += e;
        downtime += grossH * (1 - Aeff);
        const avail = availH / grossH;
        const qual = sid === 'optical' ? 1 - f.falseReject : Qs;
        stations.push({
            id: sid, avail, perf: s.P, qual, oee: avail * s.P * qual,
            load: capEq > 0 ? reqEq / capEq : 9, util: runH / grossH, runH, availH, processed, scrap, rework, kWh: e,
            ctSec: 3600 / (s.rate * s.P * s.machines),
        });
        if (sid === 'forge' || sid === 'thread')
            forgeThreadProcessed += processed;
    }
    const good = { ...inp };
    const goodTotal = good.HB + good.PTN + good.CSS;
    const demandTotal = f.demand.HB + f.demand.PTN + f.demand.CSS;
    const onTime = Object.keys(good).reduce((a, p) => a + Math.min(good[p], f.demand[p]), 0);
    const otif = onTime / demandTotal;
    const shortfall = demandTotal - onTime;
    const ppm = goodTotal > 0 ? (escaped / goodTotal) * 1e6 : 0;
    const wSum = stations.reduce((a, s) => a + s.runH, 0);
    const oee = stations.reduce((a, s) => a + s.oee * s.runH, 0) / (wSum || 1);
    const bott = stations.reduce((m, s) => (s.load > m.load ? s : m), stations[0]);
    const baseBuffer = 7000;
    const heatBatchWip = 1200 / f.stations.heat.P;
    const wip = baseBuffer + heatBatchWip + blockedWip * 0.5;
    const thRate = goodTotal / planned;
    const flowH = wip / Math.max(thRate, 1);
    const leadDays = flowH / 16;
    const heatE = stations.find((s) => s.id === 'heat')?.kWh || 0;
    const energyCost = (kWh - heatE) * f.energyPrice + heatE * f.energyPrice * (f.offPeakHeat ? 0.72 : 1);
    const avgMat = matCost / Math.max(released, 1);
    const invValue = wip * avgMat * 1.6 + f.safetyStockDays * (matCost / 5);
    const costs = {
        material: matCost,
        labor: f.operators * 40 * f.wage + f.operators * (f.overtimeH / 2) * f.wage * 1.34,
        energy: energyCost,
        depreciation: 150000 + f.capexWeekly,
        tooling: forgeThreadProcessed * 0.16,
        maintenance: 55000 + downtime * 300,
        scrap: scrapTot * 1.2 + reworkTot * 1.5,
        inspection: 18000 + falseRej * 0.6,
        holding: invValue * 0.004,
        logistics: 30000 + shortfall * 1.5,
        ai: f.opexExtra,
        penalty: shortfall * 8 + escaped * 60,
    };
    const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
    const safety = (0, exports.clamp)(100 - Math.max(0, fatigue - 50) * 1.2 - f.safetyRisks.length * 18, 0, 100);
    const satisfaction = (0, exports.clamp)(100 - (1 - otif) * 200 - ppm / 20, 0, 100);
    return {
        plannedH: planned, good, goodTotal, demandTotal, otif, rty, fpyLine: rty,
        yieldPct: goodTotal / Math.max(goodTotal + scrapTot + caught, 1), oee, ppm, escaped, wip, flowH, leadDays, throughputRate: thRate,
        stations, bottleneck: bott.id, kWh, energyPerUnit: kWh / Math.max(goodTotal, 1), costs, totalCost,
        costPerGood: totalCost / Math.max(goodTotal, 1), fatigue, safety, satisfaction, downtimeH: downtime,
        materialAvail, inventoryValue: invValue,
    };
}
const LIM = {
    detect: [0.5, 0.995], falseReject: [0.002, 0.2], latent: [0.0005, 0.05], overtimeH: [0, 32], operators: [20, 70],
    training: [0, 100], dataQuality: [0.2, 1], supplierDelay: [0, 0.8], safetyStockDays: [0, 15], energyPrice: [1, 10],
    energyFactor: [0.6, 1.5], priceFactor: [0.7, 1.6], capexWeekly: [0, 1e9], opexExtra: [0, 1e9],
};
const SLIM = { A: [0.5, 0.99], P: [0.5, 0.99], Q: [0.85, 0.9995], setupH: [0.1, 4], kW: [5, 400], machines: [1, 4], rate: [100, 5000] };
function applyEffect(f0, e) {
    const f = JSON.parse(JSON.stringify(f0));
    if (e.st)
        for (const k of Object.keys(e.st)) {
            const m = e.st[k];
            for (const p of Object.keys(m)) {
                const lim = SLIM[p];
                f.stations[k][p] = (0, exports.clamp)(f.stations[k][p] + (m[p] || 0), lim[0], lim[1]);
            }
        }
    if (e.f)
        for (const k of Object.keys(e.f)) {
            const lim = LIM[k];
            f[k] = (0, exports.clamp)(f[k] + e.f[k], lim[0], lim[1]);
        }
    if (e.set)
        Object.assign(f, e.set);
    if (e.addRisk && !f.safetyRisks.includes(e.addRisk))
        f.safetyRisks.push(e.addRisk);
    if (e.resolveRisk)
        f.safetyRisks = e.resolveRisk === 'all' ? [] : f.safetyRisks.filter((r) => r !== e.resolveRisk);
    return f;
}
function phoenixFactory() {
    const f = baseFactory();
    f.demand = { HB: 31000, PTN: 15000, CSS: 12000 };
    f.energyPrice = 4.2;
    f.supplierDelay = 0.12;
    f.dataQuality = 0.6;
    f.stations.forge.A = 0.87;
    f.safetyRisks = ['冷鍛區安全光柵間歇失效'];
    return f;
}
exports.PHOENIX_OPTIONS = [
    { id: 'newRoller', name: '添購第二台搓牙機', cat: '設備', capex: 4800000, opex: 0, tag: ['capacity'], desc: '搓牙機台數 +1，能耗增加。直接擴充瓶頸產能，但投資最高。', effect: { st: { thread: { machines: 1, kW: 45 } } } },
    { id: 'smed', name: '搓牙快速換模（SMED）＋牙板預防更換', cat: '設備', capex: 1200000, opex: 0, tag: ['ie'], desc: '換線時間 −70%、可用率 +4%、搓牙良率 +1%。改善既有設備。', effect: { st: { thread: { setupH: -0.7, A: 0.04, Q: 0.01 } } } },
    { id: 'tpm', name: 'TPM＋預測性維護（PdM）', cat: '設備', capex: 1500000, opex: 25000, tag: ['ai'], desc: '冷鍛、搓牙、熱處理可用率 +5%。含感測器與 AI 維運費。', effect: { st: { forge: { A: 0.05 }, thread: { A: 0.05 }, heat: { A: 0.04 } }, f: { opexExtra: 25000 } } },
    { id: 'overtime', name: '週六加班 16 小時', cat: '人員', capex: 0, opex: 0, tag: ['ot'], desc: '可用工時增加，但人力成本 ×1.34、疲勞上升、能耗增加。', effect: { f: { overtimeH: 16 } } },
    { id: 'balance', name: '產線平衡與人員再配置', cat: '人員', capex: 300000, opex: 0, tag: ['ie'], desc: '搓牙與光學站效率 +3%、作業負荷更平均。', effect: { st: { thread: { P: 0.03 }, optical: { P: 0.03 } }, f: { training: 5 } } },
    { id: 'stock', name: '提高原料安全庫存（+5 天）', cat: '物料', capex: 0, opex: 0, tag: [], desc: '緩衝供應商延遲，但存貨持有成本上升。', effect: { f: { safetyStockDays: 5 } } },
    { id: 'supplier', name: '開發第二供應商＋供應商交期改善', cat: '物料', capex: 600000, opex: 0, tag: [], desc: '盤元延遲風險 −90%，原料單價 +2%。', effect: { f: { supplierDelay: -0.11, priceFactor: 0.02 } } },
    { id: 'vision', name: '導入 AI 視覺瑕疵檢測', cat: '資訊', capex: 2200000, opex: 25000, tag: ['ai'], desc: '光學檢出率提升至約 98.5%、誤判降低、光學站效率 +3%。不處理源頭缺陷。', effect: { f: { detect: 0.065, falseReject: -0.012, opexExtra: 25000 }, st: { optical: { P: 0.03 } } } },
    { id: 'source', name: '源頭製程改善（模具＋搓牙參數 DOE）', cat: '品質', capex: 900000, opex: 0, tag: ['ie'], desc: '潛在缺陷 −60%、冷鍛與搓牙良率提升。從源頭減少不良。', effect: { f: { latent: -0.0043 }, st: { forge: { Q: 0.006 }, thread: { Q: 0.008 } } } },
    { id: 'autoAsm', name: '套管組裝自動化升級', cat: '設備', capex: 3000000, opex: 0, tag: ['auto'], desc: '組裝站效率 +5%、可減少 3 名作業員。組裝並非瓶頸。', effect: { st: { assembly: { P: 0.05 } }, f: { operators: -3 } } },
    { id: 'training', name: '多能工訓練與標準作業再教育', cat: '人員', capex: 500000, opex: 0, tag: [], desc: '訓練度 +25、各站良率 +0.4%、疲勞下降。', effect: { f: { training: 25 }, st: { forge: { Q: 0.004 }, thread: { Q: 0.004 }, surface: { Q: 0.004 }, assembly: { Q: 0.004 } } } },
    { id: 'heatBatch', name: '熱處理批次最佳化＋離峰排程', cat: '能源', capex: 400000, opex: 0, tag: ['energy'], desc: '熱處理裝載效率提升、移至離峰時段用電。', effect: { st: { heat: { P: 0.07 } }, set: { offPeakHeat: true } } },
    { id: 'data', name: 'ERP／MES 資料一致性整合', cat: '資訊', capex: 1000000, opex: 8000, tag: ['cim'], desc: '資料一致性提升至 95%，減少找料、等待、重排的計畫損失。', effect: { f: { dataQuality: 0.35, opexExtra: 8000 } } },
    { id: 'energy', name: '能源管理（空壓洩漏、變頻、待機管理）', cat: '能源', capex: 800000, opex: 0, tag: ['energy'], desc: '全廠能耗係數 −10%。', effect: { f: { energyFactor: -0.1 } } },
    { id: 'safety', name: '冷鍛區安全光柵更換與連鎖驗證', cat: '安全', capex: 350000, opex: 0, tag: ['safety'], desc: '解除重大工安風險。安全不是可選的捷徑。', effect: { resolveRisk: '冷鍛區安全光柵間歇失效' } },
];
exports.PHOENIX_BUDGET = 7500000;
exports.OPEX_WEEKS = 13;
function phoenixCost(ids) {
    let capex = 0, opex = 0;
    for (const id of ids) {
        const o = exports.PHOENIX_OPTIONS.find((x) => x.id === id);
        capex += o.capex;
        opex += o.opex;
    }
    return { capex, opex, total: capex + opex * exports.OPEX_WEEKS };
}
function phoenixApply(ids, base = phoenixFactory()) {
    let f = base;
    for (const id of ids) {
        const o = exports.PHOENIX_OPTIONS.find((x) => x.id === id);
        if (!o)
            continue;
        f = applyEffect(f, o.effect);
        f.capexWeekly += o.capex / 260;
    }
    return f;
}
exports.PHOENIX_SEED = 20261102;
function evaluatePhoenix(ids) {
    const before = simulateWeek(phoenixFactory(), exports.PHOENIX_SEED);
    const fac = phoenixApply(ids);
    const after = simulateWeek(fac, exports.PHOENIX_SEED);
    const cost = phoenixCost(ids);
    const targets = [
        { id: 'oee', label: '全線 OEE 提升 ≥ 10 個百分點', ok: after.oee - before.oee >= 0.10, val: `${((after.oee - before.oee) * 100).toFixed(1)} pts` },
        { id: 'cost', label: '單位良品成本降低 ≥ 8%', ok: after.costPerGood <= before.costPerGood * 0.92, val: `${(((before.costPerGood - after.costPerGood) / before.costPerGood) * 100).toFixed(1)}%` },
        { id: 'energy', label: '單位能耗降低 ≥ 8%', ok: after.energyPerUnit <= before.energyPerUnit * 0.92, val: `${(((before.energyPerUnit - after.energyPerUnit) / before.energyPerUnit) * 100).toFixed(1)}%` },
        { id: 'otif', label: 'OTIF ≥ 95%', ok: after.otif >= 0.95, val: `${(after.otif * 100).toFixed(1)}%` },
        { id: 'ppm', label: '客戶 PPM ≤ 150', ok: after.ppm <= 150, val: `${after.ppm.toFixed(0)} PPM` },
        { id: 'safety', label: '無未解決重大工安風險、疲勞 ≤ 60', ok: fac.safetyRisks.length === 0 && after.fatigue <= 60, val: `風險 ${fac.safetyRisks.length}／疲勞 ${after.fatigue.toFixed(0)}` },
        { id: 'budget', label: `投資不超過預算 NT$${(exports.PHOENIX_BUDGET / 1e4).toFixed(0)} 萬`, ok: cost.total <= exports.PHOENIX_BUDGET, val: `NT$${(cost.total / 1e4).toFixed(0)} 萬` },
    ];
    const weeklySaving = before.costPerGood * after.goodTotal - after.totalCost;
    const annualSaving = weeklySaving * 50;
    const roi = cost.total > 0 ? (annualSaving - cost.capex / 5) / cost.total : 0;
    const passed = targets.filter((t) => t.ok).length;
    const score = Math.round(passed / targets.length * 70 +
        (0, exports.clamp)((after.oee - before.oee) / 0.15, 0, 1) * 8 +
        (0, exports.clamp)((before.costPerGood - after.costPerGood) / before.costPerGood / 0.12, 0, 1) * 8 +
        (0, exports.clamp)(after.safety / 100, 0, 1) * 7 + (0, exports.clamp)(after.satisfaction / 100, 0, 1) * 7);
    return { before, after, fac, cost, targets, passed, weeklySaving, annualSaving, roi, score };
}
function endingOf(ev, ids) {
    const t = Object.fromEntries(ev.targets.map((x) => [x.id, x.ok]));
    const aiCount = ids.filter((i) => exports.PHOENIX_OPTIONS.find((o) => o.id === i)?.tag.includes('ai')).length;
    if (ev.passed === ev.targets.length)
        return 'balance';
    if (aiCount >= 2 && !t.otif)
        return 'aiNoBottleneck';
    if (t.otif && !t.cost)
        return 'highCapacity';
    if (t.cost && (!t.safety || !t.ppm))
        return 'costImbalance';
    if (t.otif && t.ppm && !t.energy)
        return 'energyGap';
    if (!t.otif)
        return aiCount >= 1 ? 'aiNoBottleneck' : 'highCapacity';
    return 'energyGap';
}
exports.fmt = {
    pct: (v, d = 1) => `${(v * 100).toFixed(d)}%`,
    n: (v) => Math.round(v).toLocaleString('zh-TW'),
    nt: (v) => `NT$${Math.round(v).toLocaleString('zh-TW')}`,
    wan: (v) => `${(v / 10000).toFixed(1)} 萬`,
};

};
factories["./state.ts"]=function(module,exports,require){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passLine = exports.ASPIRE = exports.TALENT = exports.EDU = void 0;
exports.snapshot = snapshot;
exports.newGame = newGame;
exports.chapterUnlocked = chapterUnlocked;
exports.currentChapter = currentChapter;
exports.applyEff = applyEff;
exports.gainSkills = gainSkills;
exports.promotionCheck = promotionCheck;
exports.avgScore = avgScore;
exports.pickEvent = pickEvent;
exports.checkAchievements = checkAchievements;
exports.saveSlot = saveSlot;
exports.migrate = migrate;
exports.loadSlot = loadSlot;
exports.slotInfo = slotInfo;
exports.exportCode = exportCode;
exports.importCode = importCode;
const sim_1 = require("./sim");
const data_1 = require("./data");
exports.EDU = {
    fresh: { label: '一般新鮮人', skills: { mfg: 3, qual: 3, prod: 3, ie: 3, it: 3, sys: 3 }, hint: '各方面均衡起步。' },
    switcher: { label: '非理工轉職者', skills: { sys: 8, prod: 4, qual: 2 }, hint: '溝通與管理有底子，教學提示較多。' },
    mech: { label: '機械相關背景', skills: { mfg: 10, ie: 5, qual: 2 }, hint: '設備與製程上手快。' },
    info: { label: '資訊相關背景', skills: { it: 12, ie: 3, sys: 2 }, hint: '資料與程式能力較強。' },
};
exports.TALENT = {
    hands: { label: '動手操作', skills: { mfg: 5 } },
    data: { label: '資料分析', skills: { it: 3, qual: 3 } },
    comm: { label: '溝通協調', skills: { sys: 4 }, trust: { floor: 3, plan: 3 } },
    logic: { label: '邏輯推理', skills: { ie: 5 } },
};
exports.ASPIRE = {
    floor: { label: '現場製造', branch: 'mfg' }, quality: { label: '品質工程', branch: 'qual' },
    mgmt: { label: '管理規劃', branch: 'prod' }, ai: { label: 'AI 工程', branch: 'it' },
};
function snapshot(f, week, label, seed) {
    const r = (0, sim_1.simulateWeek)(f, seed + week);
    return { week, label, oee: r.oee, otif: r.otif, cost: r.costPerGood, ppm: r.ppm, energy: r.energyPerUnit, good: r.goodTotal, yieldPct: r.yieldPct, bott: r.bottleneck };
}
function newGame(p, mode) {
    const seed = (Date.now() % 1e6) | 0;
    const skills = { mfg: 0, qual: 0, prod: 0, ie: 0, it: 0, sys: 0 };
    const trust = { floor: 0, quality: 0, plan: 0, purchase: 0, it: 0, mgmt: 0 };
    const e = exports.EDU[p.edu], t = exports.TALENT[p.talent];
    for (const [k, v] of Object.entries(e.skills))
        skills[k] += v;
    for (const [k, v] of Object.entries(t.skills))
        skills[k] += v;
    if (t.trust)
        for (const [k, v] of Object.entries(t.trust))
            trust[k] += v;
    const factory = (0, sim_1.baseFactory)();
    const g = {
        v: 3, seed, mode, player: p, week: 1, pos: 0, posHistory: [{ pos: 0, week: 1 }], skills, freePts: 0, trust, brand: 60, funds: 100000,
        certs: [], done: {}, factory, history: [], flags: [], achievements: [], journal: [], pendingEvent: null, eventsSeen: [], decisions: [],
        ai: { A: { done: false, score: 0, deployed: false }, B: { done: false, score: 0, deployed: false }, C: { done: false, score: 0, deployed: false }, D: { done: false, score: 0, deployed: false } },
        cimDone: false, final: null, settings: { sound: true, motion: true, text: 'm', hints: mode !== 'engineer' }, safetyViolations: 0,
        unlockedCodex: [], grants: 0, survival: { runs: [] },
    };
    g.history.push(snapshot(factory, 1, '入職', seed));
    if (mode === 'sandbox') {
        g.pos = 9;
        g.unlockedCodex = data_1.CODEX.map((c) => c.id);
        g.funds = 2000000;
        for (const k of Object.keys(skills))
            skills[k] = 60;
        data_1.CHAPTERS.forEach((c) => { if (c.id < data_1.FINAL_ID)
            g.done[c.id] = { score: 0, best: 0, tries: 0 }; });
        g.cimDone = true;
    }
    else
        g.unlockedCodex = [...data_1.CHAPTERS[0].codex];
    return g;
}
const passLine = (g) => (g.mode === 'engineer' ? 65 : 50);
exports.passLine = passLine;
function chapterUnlocked(g, id) {
    if (g.mode === 'sandbox')
        return true;
    if (id === 0)
        return true;
    const prevDone = !!g.done[id - 1];
    return prevDone && g.pos >= data_1.CHAPTERS[id].requiredPos;
}
function currentChapter(g) {
    for (const c of data_1.CHAPTERS)
        if (!g.done[c.id])
            return c.id;
    return data_1.FINAL_ID;
}
function applyEff(g, e, label) {
    const n = { ...g, factory: (0, sim_1.applyEffect)(g.factory, e), trust: { ...g.trust }, flags: [...g.flags] };
    if (e.funds)
        n.funds = Math.max(0, n.funds + e.funds);
    if (e.trust)
        for (const [k, v] of Object.entries(e.trust))
            n.trust[k] = (0, sim_1.clamp)((n.trust[k] || 0) + (v || 0), -50, 100);
    if (e.brand)
        n.brand = (0, sim_1.clamp)(n.brand + e.brand, 0, 100);
    if (e.flag && !n.flags.includes(e.flag))
        n.flags.push(e.flag);
    if (e.unflag)
        n.flags = n.flags.filter((x) => x !== e.unflag);
    if (e.flag === 'unsafe')
        n.safetyViolations++;
    if (e.weeks)
        n.week += e.weeks;
    return n;
}
function gainSkills(g, xp, mult) {
    const s = { ...g.skills };
    const asp = exports.ASPIRE[g.player.aspiration]?.branch;
    for (const [k, v] of Object.entries(xp)) {
        const b = k;
        s[b] = (0, sim_1.clamp)(s[b] + Math.round((v || 0) * mult * (b === asp ? 1.15 : 1)), 0, 100);
    }
    return s;
}
function promotionCheck(g, target) {
    const c = data_1.CAREERS[target];
    if (!c)
        return { ok: false, items: [] };
    const items = [];
    const r = c.req;
    if (r.skills)
        for (const [k, v] of Object.entries(r.skills))
            items.push({ label: `${{ mfg: '製造技術', qual: '品質工程', prod: '生產與物流', ie: '工業工程', it: '資訊與 AI', sys: '系統整合與領導' }[k]} ≥ ${v}（目前 ${g.skills[k]}）`, ok: g.skills[k] >= v });
    if (r.certs)
        for (const ce of r.certs)
            items.push({ label: `認證：${ce}`, ok: g.certs.includes(ce) });
    if (r.trust)
        for (const [k, v] of Object.entries(r.trust))
            items.push({ label: `${{ floor: '現場製造', quality: '品質', plan: '生管物管', purchase: '採購', it: 'IT/OT', mgmt: '經營管理' }[k]}信任 ≥ ${v}（目前 ${g.trust[k]}）`, ok: g.trust[k] >= v });
    if (r.avg) {
        const a = avgScore(g);
        items.push({ label: `任務平均分數 ≥ ${g.mode === 'story' ? r.avg - 5 : r.avg}（目前 ${a.toFixed(0)}）`, ok: a >= (g.mode === 'story' ? r.avg - 5 : r.avg) });
    }
    if (r.trustAvg) {
        const t = Object.values(g.trust).reduce((a, b) => a + b, 0) / 6;
        items.push({ label: `跨部門平均信任 ≥ ${r.trustAvg}（目前 ${t.toFixed(0)}）`, ok: t >= r.trustAvg });
    }
    return { ok: items.every((i) => i.ok), items };
}
function avgScore(g) {
    const v = Object.values(g.done).filter((d) => d.tries > 0).map((d) => d.best);
    return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}
function pickEvent(g) {
    const ch = currentChapter(g);
    const pool = data_1.EVENTS.filter((e) => e.minCh <= ch);
    if (!pool.length)
        return null;
    const rnd = (0, sim_1.mulberry32)(g.seed + g.week * 7919);
    const weights = pool.map((e) => (e.weightFlag && g.flags.includes(e.weightFlag) ? 6 : 1) * (g.eventsSeen.includes(e.id) ? 0.35 : 1));
    const sum = weights.reduce((a, b) => a + b, 0);
    let r = rnd() * sum;
    for (let i = 0; i < pool.length; i++) {
        r -= weights[i];
        if (r <= 0)
            return pool[i];
    }
    return pool[pool.length - 1];
}
function checkAchievements(g) {
    const a = new Set(g.achievements);
    const add = [];
    const t = (id, cond) => { if (cond && !a.has(id)) {
        a.add(id);
        add.push(id);
    } };
    t('safety', !!g.done[0] && g.safetyViolations === 0);
    t('firstDie', (g.done[2]?.best || 0) >= 70);
    t('firstAI', Object.values(g.ai).some((x) => x.done));
    t('allAI', Object.values(g.ai).every((x) => x.done));
    t('scholar', g.unlockedCodex.length >= 60);
    if (g.history.length > 1)
        t('yield', g.history[g.history.length - 1].yieldPct > g.history[0].yieldPct + 0.003);
    t('optimize', !!g.final && g.final.ending === 'balance');
    return add;
}
const KEY = 'sumeeko-smart-factory-v2';
function saveSlot(slot, g) {
    try {
        localStorage.setItem(`${KEY}-${slot}`, JSON.stringify({ t: Date.now(), g }));
        return true;
    }
    catch {
        return false;
    }
}
function migrate(g) {
    if (!g || !g.factory)
        return null;
    if (g.v === 2) {
        const d = {};
        for (const [k, v] of Object.entries(g.done || {})) {
            const n = +k;
            d[n >= 12 ? n + 1 : n] = v;
        }
        g.done = d;
        g.v = 3;
        g.survival = { runs: [] };
        if (g.done[13] && !g.certs.includes('AI 工程師生存戰通關'))
            g.journal = [...(g.journal || []), { week: g.week, title: '版本更新', text: '新增第十二章「AI 工程師生存戰」，可於任務中心補玩。' }];
    }
    if (!g.survival)
        g.survival = { runs: [] };
    return g.v === 3 ? g : null;
}
function loadSlot(slot) {
    try {
        const s = localStorage.getItem(`${KEY}-${slot}`);
        if (!s)
            return null;
        const o = JSON.parse(s);
        return migrate(o.g);
    }
    catch {
        return null;
    }
}
function slotInfo(slot) {
    try {
        const s = localStorage.getItem(`${KEY}-${slot}`);
        if (!s)
            return null;
        const o = JSON.parse(s);
        return { t: o.t, name: o.g.player.name, pos: o.g.pos, week: o.g.week };
    }
    catch {
        return null;
    }
}
function exportCode(g) { return btoa(unescape(encodeURIComponent(JSON.stringify(g)))); }
function importCode(s) {
    try {
        return migrate(JSON.parse(decodeURIComponent(escape(atob(s.trim())))));
    }
    catch {
        return null;
    }
}

};
factories["./App.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = __importStar(require("react"));
const common_1 = require("./ui/common");
const state_1 = require("./state");
const data_1 = require("./data");
const sim_1 = require("./sim");
const views_1 = require("./views");
const floor_1 = require("./games/floor");
const office_1 = require("./games/office");
const ai_1 = require("./games/ai");
const cim_1 = require("./games/cim");
const survival_1 = require("./games/survival");
const GAMES = { hazard: floor_1.HazardGame, trace: floor_1.TraceGame, param: floor_1.ParamGame, inspect: floor_1.InspectGame, crew: floor_1.CrewGame, schedule: office_1.ScheduleGame, spc: office_1.SPCGame, supply: office_1.SupplyGame, data: office_1.DataGame, ailab: ai_1.AILabGame, cim: cim_1.CIMGame, phoenix: cim_1.PhoenixGame, survival: survival_1.SurvivalGame };
const GAME_NAME = { hazard: '危險辨識訓練', trace: '批號追溯', param: '製程參數與品質控制', inspect: '品質檢測挑戰', crew: '班別人力配置', schedule: '生產排程拼圖＋MRP', spc: 'SPC 品質分析', supply: '供應鏈資源調度', data: '資料分析與精實改善', ailab: 'AI 專案建置', cim: 'CIM 系統整合', phoenix: '全廠數位孿生最佳化', survival: 'AI 工程師生存戰（九關專案）' };
function HeroArt() {
    return (react_1.default.createElement("svg", { viewBox: "0 0 600 320", className: "hero" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("linearGradient", { id: "sky", x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#0b1a3a" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#13284f" })),
            react_1.default.createElement("linearGradient", { id: "steel", x1: "0", y1: "0", x2: "1", y2: "0" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#4c5a70" }),
                react_1.default.createElement("stop", { offset: ".45", stopColor: "#f2f6fb" }),
                react_1.default.createElement("stop", { offset: ".6", stopColor: "#aab7c9" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#3a4658" })),
            react_1.default.createElement("radialGradient", { id: "sun", cx: ".75", cy: ".3", r: ".5" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#ff9a3c", stopOpacity: ".55" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#ff9a3c", stopOpacity: "0" })),
            react_1.default.createElement("filter", { id: "gl" },
                react_1.default.createElement("feGaussianBlur", { stdDeviation: "2.5", result: "b" }),
                react_1.default.createElement("feMerge", null,
                    react_1.default.createElement("feMergeNode", { in: "b" }),
                    react_1.default.createElement("feMergeNode", { in: "SourceGraphic" })))),
        react_1.default.createElement("rect", { width: "600", height: "320", fill: "url(#sky)" }),
        react_1.default.createElement("rect", { width: "600", height: "320", fill: "url(#sun)" }),
        Array.from({ length: 14 }, (_, i) => react_1.default.createElement("line", { key: i, x1: i * 46, y1: "320", x2: 300, y2: "190", stroke: "#1f3f73", strokeWidth: "1" })),
        react_1.default.createElement("path", { d: "M0 230 L60 230 L60 170 L110 200 L110 170 L160 200 L160 150 L200 150 L200 230 L260 230 L260 190 L330 190 L330 230 L600 230 L600 320 L0 320Z", fill: "#0e1f3f", stroke: "#2b5aa0" }),
        react_1.default.createElement("rect", { x: "170", y: "90", width: "14", height: "60", fill: "#22406f" }),
        react_1.default.createElement("path", { d: "M177 90 q10 -20 0 -40 q-10 -20 6 -36", stroke: "#5e7ba8", strokeOpacity: ".4", fill: "none", strokeWidth: "6" }),
        [0, 1, 2, 3, 4, 5].map((i) => react_1.default.createElement("rect", { key: i, x: 20 + i * 30, y: "245", width: "18", height: "6", fill: "#39d5ff", opacity: 0.3 + (i % 3) * 0.2 })),
        react_1.default.createElement("g", { transform: "translate(400 70) rotate(18)", filter: "url(#gl)" },
            react_1.default.createElement("polygon", { points: "-46,-18 46,-18 56,0 46,18 -46,18 -56,0", fill: "url(#steel)", stroke: "#2c3a50", strokeWidth: "2" }),
            react_1.default.createElement("rect", { x: "-18", y: "18", width: "36", height: "170", fill: "url(#steel)", stroke: "#2c3a50", strokeWidth: "2" }),
            Array.from({ length: 22 }, (_, i) => react_1.default.createElement("path", { key: i, d: `M-20 ${40 + i * 7} L20 ${45 + i * 7}`, stroke: "#334055", strokeWidth: "2" }))),
        react_1.default.createElement("g", { stroke: "#39d5ff", strokeWidth: "1.5", fill: "none", opacity: ".8" },
            react_1.default.createElement("circle", { cx: "400", cy: "160", r: "110", strokeDasharray: "4 8", className: "spin-slow" }),
            react_1.default.createElement("circle", { cx: "400", cy: "160", r: "135", strokeDasharray: "30 12 4 12", opacity: ".5" })),
        react_1.default.createElement("g", { className: "dataflow" }, [0, 1, 2].map((i) => react_1.default.createElement("path", { key: i, d: `M0 ${270 + i * 12} C 200 ${260 + i * 10}, 300 ${280 - i * 6}, 600 ${262 + i * 14}`, stroke: i === 1 ? '#ff9a3c' : '#39d5ff', strokeWidth: "2", fill: "none", strokeDasharray: "6 10" })))));
}
function Title({ onNew, onContinue, onLoad, hasSave, onExit }) {
    const [help, setHelp] = (0, react_1.useState)(false);
    const [src, setSrc] = (0, react_1.useState)(false);
    const [load, setLoad] = (0, react_1.useState)(false);
    return (react_1.default.createElement("div", { className: "title" },
        react_1.default.createElement(HeroArt, null),
        react_1.default.createElement("div", { className: "title-c" },
            react_1.default.createElement("div", { className: "kicker" }, "SUMEEKO: Rise of the Smart Factory"),
            react_1.default.createElement("h1", null,
                "\u5F9E\u4E00\u9846\u87BA\u7D72",
                react_1.default.createElement("br", null),
                "\u5230\u4E00\u5EA7\u667A\u6167\u5DE5\u5EE0"),
            react_1.default.createElement("p", { className: "tag-l" }, "\u8077\u6DAF\u990A\u6210 \u00D7 \u5DE5\u5EE0\u7D93\u71DF \u00D7 \u5DE5\u696D\u5DE5\u7A0B \u00D7 \u667A\u6167\u88FD\u9020"),
            react_1.default.createElement("div", { className: "title-b" },
                react_1.default.createElement("button", { className: "btn primary big", onClick: onNew }, "\u958B\u59CB\u65B0\u904A\u6232"),
                react_1.default.createElement("button", { className: "btn big", disabled: !hasSave, onClick: onContinue }, "\u7E7C\u7E8C\u904A\u6232"),
                react_1.default.createElement("button", { className: "btn", onClick: () => setLoad(true) }, "\u8F09\u5165\u5B58\u6A94"),
                react_1.default.createElement("button", { className: "btn", onClick: () => setHelp(true) }, "\u64CD\u4F5C\u8AAA\u660E"),
                react_1.default.createElement("button", { className: "btn", onClick: () => setSrc(true) }, "\u8CC7\u6599\u4F86\u6E90\u8072\u660E"),
                onExit && react_1.default.createElement("button", { className: "btn", onClick: onExit }, "\u2190 \u8FD4\u56DE App \u9996\u9801")),
            react_1.default.createElement("p", { className: "disc" }, "\u4EE5\u4E16\u5FB7\u5DE5\u696D\u516C\u958B\u7684\u7522\u696D\u80CC\u666F\u8207\u5C08\u5229\u70BA\u6559\u5B78\u984C\u6750\uFF1B\u4EBA\u7269\u3001\u6578\u64DA\u3001\u4E8B\u4EF6\u7686\u70BA\u6559\u80B2\u7528\u9014\u4E4B\u865B\u69CB\u6A21\u64EC\u3002")),
        help && react_1.default.createElement(common_1.Modal, { title: "\u64CD\u4F5C\u8AAA\u660E", onClose: () => setHelp(false) },
            react_1.default.createElement(Help, null)),
        src && react_1.default.createElement(common_1.Modal, { title: "\u8CC7\u6599\u4F86\u6E90\u8072\u660E", onClose: () => setSrc(false), wide: true },
            react_1.default.createElement(views_1.Sources, null)),
        load && react_1.default.createElement(common_1.Modal, { title: "\u8F09\u5165\u5B58\u6A94", onClose: () => setLoad(false) }, [0, 1, 2, 3].map((s) => { const i = (0, state_1.slotInfo)(s); return react_1.default.createElement("div", { key: s, className: "row between qrow" },
            react_1.default.createElement("span", null,
                s === 0 ? '自動存檔' : `欄位 ${s}`,
                "\uFF1A",
                i ? `${i.name}・${data_1.CAREERS[i.pos].title}・W${i.week}` : '（空）'),
            react_1.default.createElement(common_1.Btn, { small: true, disabled: !i, onClick: () => onLoad(s) }, "\u8F09\u5165")); }))));
}
function Help() {
    return (react_1.default.createElement("ul", { className: "small" },
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u76EE\u6A19"),
            "\uFF1A\u5F9E\u7522\u7DDA\u65B0\u4EBA\u4E00\u8DEF\u6210\u9577\u70BA\u8CC7\u6DF1\u88FD\u7A0B\u898F\u5283\u66A8 CIM \u6574\u5408\u5DE5\u7A0B\u5E2B\uFF0C\u5B8C\u6210\u7D42\u5C40\u300C\u9CF3\u51F0\u8A08\u756B\u300D\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u4EFB\u52D9\u6D41\u7A0B"),
            "\uFF1A\u958B\u5834\u6F2B\u756B \u2192 \u4EFB\u52D9\u7C21\u5831 \u2192 \u64CD\u4F5C\u6559\u5B78 \u2192 \u5C0F\u904A\u6232 \u2192 \u5169\u96E3\u6C7A\u7B56 \u2192 \u6578\u64DA\u7D50\u679C \u2192 NPC \u53CD\u61C9 \u2192 \u5DE5\u4F5C\u65E5\u8A8C \u2192 \u6280\u80FD\u6210\u9577\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u5347\u9077"),
            "\uFF1A\u9700\u540C\u6642\u6EFF\u8DB3\u6280\u80FD\u3001\u8A8D\u8B49\uFF08\u4EFB\u52D9\u53CA\u683C\u53D6\u5F97\uFF09\u3001\u4EFB\u52D9\u7E3E\u6548\u8207\u8DE8\u90E8\u9580\u4FE1\u4EFB\u3002\u53EF\u5728\u300C\u8077\u6DAF\u300D\u9801\u9032\u4FEE\u6216\u8DE8\u90E8\u9580\u652F\u63F4\u88DC\u8DB3\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u7B2C\u5341\u4E8C\u7AE0"),
            "\uFF1A\u8F49\u8077 AI \u5DE5\u7A0B\u5E2B\u5F8C\uFF0C\u9700\u901A\u904E\u300AAI \u5DE5\u7A0B\u5E2B\u751F\u5B58\u6230\u300B\u4E5D\u95DC\u5C08\u6848\uFF08\u7D50\u5C40 A\uFF0FB\uFF0FD\uFF09\u624D\u80FD\u6649\u5347\u4E0B\u4E00\u968E\u6BB5\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u4E8B\u4EF6"),
            "\uFF1A\u6BCF\u5B8C\u6210\u4E00\u7AE0\u6703\u9047\u5230\u5DE5\u5EE0\u4E8B\u4EF6\uFF0C\u4F60\u7684\u9078\u64C7\u6703\u5BE6\u969B\u6539\u8B8A\u5DE5\u5EE0\u53C3\u6578\uFF0C\u4E26\u5F71\u97FF\u5F8C\u7E8C\u4E8B\u4EF6\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u64CD\u4F5C"),
            "\uFF1A\u6ED1\u9F20\u8207\u89F8\u63A7\u7686\u53EF\u3002\u62D6\u66F3\u7684\u5730\u65B9\u90FD\u53EF\u6539\u7528\u300C\u9EDE\u9078 \u2192 \u9EDE\u76EE\u6A19\u300D\u6216\u6309\u9215\u64CD\u4F5C\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u5B58\u6A94"),
            "\uFF1A\u81EA\u52D5\u5B58\u6A94\uFF1B\u8A2D\u5B9A\u9801\u53EF\u624B\u52D5\u5B58\u5230 3 \u500B\u6B04\u4F4D\u6216\u532F\u51FA\u5B58\u6A94\u4EE3\u78BC\u3002"),
        react_1.default.createElement("li", null,
            react_1.default.createElement("b", null, "\u6A21\u5F0F"),
            "\uFF1A\u6545\u4E8B\u6A21\u5F0F\u5BB9\u932F\u8F03\u9AD8\uFF1B\u5DE5\u7A0B\u5E2B\u6A21\u5F0F\u9580\u6ABB\u8F03\u56B4\uFF1B\u6C99\u76D2\u6A21\u5F0F\u5168\u89E3\u9396\u3001\u53EF\u81EA\u7531\u6A21\u64EC\u3002")));
}
const COATS = ['#3a7bd5', '#e07a1f', '#2f8f6f', '#7a3b69'];
function Create({ onStart, onBack }) {
    const [name, setName] = (0, react_1.useState)('林以安');
    const [look, setLook] = (0, react_1.useState)(0);
    const [coat, setCoat] = (0, react_1.useState)(COATS[0]);
    const [edu, setEdu] = (0, react_1.useState)('fresh');
    const [talent, setTalent] = (0, react_1.useState)('hands');
    const [asp, setAsp] = (0, react_1.useState)('ai');
    const [mode, setMode] = (0, react_1.useState)('story');
    return (react_1.default.createElement("div", { className: "create" },
        react_1.default.createElement(common_1.Card, { title: "\u5EFA\u7ACB\u89D2\u8272" },
            react_1.default.createElement("div", { className: "grid-create" },
                react_1.default.createElement("div", { className: "avatar-pick" },
                    react_1.default.createElement(common_1.Face, { ...common_1.LOOKS[look], coat: coat, size: 150, helmet: true }),
                    react_1.default.createElement("div", { className: "row sm" }, common_1.LOOKS.map((l, i) => react_1.default.createElement("button", { key: i, className: `av ${look === i ? 'on' : ''}`, onClick: () => setLook(i), "aria-label": `外觀 ${i + 1}` },
                        react_1.default.createElement(common_1.Face, { ...l, coat: coat, size: 44 })))),
                    react_1.default.createElement("div", { className: "row sm" }, COATS.map((c) => react_1.default.createElement("button", { key: c, className: `sw ${coat === c ? 'on' : ''}`, style: { background: c }, onClick: () => setCoat(c), "aria-label": "\u670D\u88DD\u984F\u8272" })))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", { className: "fld" },
                        "\u59D3\u540D",
                        react_1.default.createElement("input", { value: name, maxLength: 12, onChange: (e) => setName(e.target.value) })),
                    react_1.default.createElement("div", { className: "fld" },
                        "\u6559\u80B2\u80CC\u666F",
                        react_1.default.createElement("div", { className: "opts" }, Object.entries(state_1.EDU).map(([k, v]) => react_1.default.createElement("button", { key: k, className: `opt ${edu === k ? 'on' : ''}`, onClick: () => setEdu(k) },
                            react_1.default.createElement("b", null, v.label),
                            react_1.default.createElement("small", null,
                                react_1.default.createElement("br", null),
                                v.hint))))),
                    react_1.default.createElement("div", { className: "fld" },
                        "\u521D\u59CB\u5C08\u9577",
                        react_1.default.createElement("div", { className: "opts" }, Object.entries(state_1.TALENT).map(([k, v]) => react_1.default.createElement("button", { key: k, className: `opt ${talent === k ? 'on' : ''}`, onClick: () => setTalent(k) }, v.label)))),
                    react_1.default.createElement("div", { className: "fld" },
                        "\u8077\u6DAF\u5FD7\u5411",
                        react_1.default.createElement("div", { className: "opts" }, Object.entries(state_1.ASPIRE).map(([k, v]) => react_1.default.createElement("button", { key: k, className: `opt ${asp === k ? 'on' : ''}`, onClick: () => setAsp(k) }, v.label))),
                        react_1.default.createElement("small", { className: "muted" }, "\u5FD7\u5411\u5206\u652F\u7D93\u9A57 +15%\uFF1B\u80CC\u666F\u4E0D\u6703\u5C01\u9396\u4EFB\u4F55\u8077\u6DAF\u3002")),
                    react_1.default.createElement("div", { className: "fld" },
                        "\u904A\u6232\u6A21\u5F0F",
                        react_1.default.createElement("div", { className: "opts" },
                            react_1.default.createElement("button", { className: `opt ${mode === 'story' ? 'on' : ''}`, onClick: () => setMode('story') },
                                react_1.default.createElement("b", null, "\u6545\u4E8B\u6A21\u5F0F"),
                                react_1.default.createElement("small", null,
                                    react_1.default.createElement("br", null),
                                    "\u6559\u5B78\u591A\u3001\u5BB9\u932F\u9AD8")),
                            react_1.default.createElement("button", { className: `opt ${mode === 'engineer' ? 'on' : ''}`, onClick: () => setMode('engineer') },
                                react_1.default.createElement("b", null, "\u5DE5\u7A0B\u5E2B\u6A21\u5F0F"),
                                react_1.default.createElement("small", null,
                                    react_1.default.createElement("br", null),
                                    "\u9700\u5BE6\u969B\u5206\u6790 KPI")),
                            react_1.default.createElement("button", { className: `opt ${mode === 'sandbox' ? 'on' : ''}`, onClick: () => setMode('sandbox') },
                                react_1.default.createElement("b", null, "\u6C99\u76D2\u6A21\u5F0F"),
                                react_1.default.createElement("small", null,
                                    react_1.default.createElement("br", null),
                                    "\u5168\u89E3\u9396\u81EA\u7531\u6A21\u64EC")))))),
            react_1.default.createElement("div", { className: "row between" },
                react_1.default.createElement(common_1.Btn, { onClick: onBack }, "\u2190 \u8FD4\u56DE"),
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !name.trim(), onClick: () => onStart({ name: name.trim(), look, coat, edu, talent, aspiration: asp }, mode) }, "\u9032\u5EE0\u5831\u5230 \u2192")))));
}
function MissionList({ go }) {
    const { g } = (react_1.default.useContext(common_1.GameCtx));
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "\u4EFB\u52D9\u4E2D\u5FC3"),
        react_1.default.createElement("div", { className: "chlist" }, data_1.CHAPTERS.map((c) => {
            const un = (0, state_1.chapterUnlocked)(g, c.id) || !!g.done[c.id];
            const d = g.done[c.id];
            return (react_1.default.createElement("button", { key: c.id, className: `chcard ${un ? '' : 'locked'} ${(0, state_1.currentChapter)(g) === c.id ? 'cur' : ''}`, disabled: !un, onClick: () => go('mission', c.id) },
                react_1.default.createElement("div", { className: "ch-code" }, c.code),
                react_1.default.createElement("b", null, c.title),
                react_1.default.createElement("small", null, c.role),
                react_1.default.createElement("div", { className: "ch-f" },
                    react_1.default.createElement("span", null, GAME_NAME[c.game]),
                    d?.tries ? react_1.default.createElement(common_1.Tag, { color: d.best >= (0, state_1.passLine)(g) ? 'var(--green)' : 'var(--orange)' },
                        "\u6700\u4F73 ",
                        d.best) : un ? react_1.default.createElement(common_1.Tag, { color: "var(--cyan)" }, "\u53EF\u9032\u884C") : react_1.default.createElement(common_1.Tag, null,
                        "\uD83D\uDD12 \u9700 ",
                        data_1.CAREERS[c.requiredPos].title))));
        }))));
}
function MissionView({ id }) {
    const ctx = react_1.default.useContext(common_1.GameCtx);
    const { g, set, go, sfx } = ctx;
    const ch = data_1.CHAPTERS[id];
    const [stage, setStage] = (0, react_1.useState)('intro');
    const [panel, setPanel] = (0, react_1.useState)(0);
    const [res, setRes] = (0, react_1.useState)(null);
    const [opt, setOpt] = (0, react_1.useState)(null);
    const [out, setOut] = (0, react_1.useState)(null);
    const [key, setKey] = (0, react_1.useState)(0);
    const unlocked = (0, state_1.chapterUnlocked)(g, id) || !!g.done[id];
    (0, react_1.useEffect)(() => { set((g0) => ({ ...g0, unlockedCodex: Array.from(new Set([...g0.unlockedCodex, ...ch.codex])) })); }, [id]);
    if (!unlocked)
        return react_1.default.createElement(common_1.Card, { title: "\u5C1A\u672A\u89E3\u9396" },
            react_1.default.createElement("p", null,
                "\u9700\u8981\u8077\u4F4D\uFF1A",
                data_1.CAREERS[ch.requiredPos].title,
                "\uFF0C\u4E26\u5B8C\u6210\u524D\u4E00\u7AE0\u3002"),
            react_1.default.createElement(common_1.Btn, { onClick: () => go('career') }, "\u67E5\u770B\u5347\u9077\u689D\u4EF6"));
    const G = GAMES[ch.game];
    const commit = (r, o) => {
        let before = (0, sim_1.simulateWeek)(g.factory, g.seed + g.week);
        let phx = null;
        const pass = r.score >= (0, state_1.passLine)(g);
        const first = !g.done[id]?.tries;
        let n = (0, state_1.applyEff)(g, r.effect || {});
        if (o !== null)
            n = (0, state_1.applyEff)(n, ch.dilemma.options[o].effect);
        if (first) {
            n.funds += ch.reward.funds;
            n.freePts += 1;
            const tr = { ...n.trust };
            for (const [k, v] of Object.entries(ch.reward.trust))
                tr[k] += Math.round((v || 0) * (pass ? 1 : 0.5));
            n.trust = tr;
        }
        n.skills = (0, state_1.gainSkills)(n, ch.reward.xp, (0.5 + r.score / 200) * (first ? 1 : 0.35));
        if (pass && ch.reward.cert && !n.certs.includes(ch.reward.cert))
            n.certs = [...n.certs, ch.reward.cert];
        const prev = n.done[id];
        n.done = { ...n.done, [id]: { score: r.score, best: Math.max(prev?.best || 0, r.score), tries: (prev?.tries || 0) + 1 } };
        n.journal = [...n.journal, { week: n.week, title: `${ch.code}｜${ch.title}（${r.score} 分）`, text: `${ch.journal} ${o !== null ? `決策：${ch.dilemma.options[o].label}。` : ''}` }];
        if (o !== null)
            n.decisions = [...n.decisions, { week: n.week, title: ch.title, choice: ch.dilemma.options[o].label }];
        n.week += 1;
        const promoted = [];
        if (ch.reward.promoteTo !== undefined) {
            while (n.pos < ch.reward.promoteTo && (0, state_1.promotionCheck)(n, n.pos + 1).ok) {
                n.pos += 1;
                promoted.push(n.pos);
                n.posHistory = [...n.posHistory, { pos: n.pos, week: n.week }];
                n.freePts += 2;
            }
        }
        const ach = [...n.achievements];
        const ex = r.extra || {};
        if (ex.bottleneck && !ach.includes('bottleneck'))
            ach.push('bottleneck');
        if (ex.spcPerfect && !ach.includes('spc'))
            ach.push('spc');
        if (ex.tco && !ach.includes('tco'))
            ach.push('tco');
        if (ex.leader && !ach.includes('leader'))
            ach.push('leader');
        if (ex.sync && !ach.includes('sync'))
            ach.push('sync');
        if (ex.survivalEnding && survival_1.SURVIVAL_PASS.includes(ex.survivalEnding) && !ach.includes('survivor'))
            ach.push('survivor');
        if (ex.survivalEnding === 'A' && !ach.includes('navigator'))
            ach.push('navigator');
        n.achievements = ach;
        if (ch.game === 'cim' && pass)
            n.cimDone = true;
        if (ch.game === 'phoenix' && ex.ids) {
            const ev = (0, sim_1.evaluatePhoenix)(ex.ids);
            phx = ev;
            n.final = { ids: ex.ids, score: r.score, ending: (0, sim_1.endingOf)(ev, ex.ids) };
        }
        const newAch = (0, state_1.checkAchievements)(n);
        n.achievements = [...n.achievements, ...newAch];
        n.history = [...n.history, (0, state_1.snapshot)(n.factory, n.week, ch.code, n.seed)];
        if (first && ch.game !== 'phoenix') {
            const e = (0, state_1.pickEvent)(n);
            n.pendingEvent = e ? e.id : null;
        }
        let after = (0, sim_1.simulateWeek)(n.factory, n.seed + n.week - 1);
        if (phx) {
            before = phx.before;
            after = phx.after;
        }
        const nextCh = data_1.CHAPTERS[id + 1];
        const need = nextCh && nextCh.requiredPos > n.pos ? (0, state_1.promotionCheck)(n, n.pos + 1) : null;
        setOut({ before, after, pass, first, promoted, need, newAch: ach.filter((a) => !g.achievements.includes(a)).concat(newAch.filter((a) => !ach.includes(a))) });
        set(() => n);
        sfx(promoted.length ? 'level' : pass ? 'good' : 'bad');
        setStage('result');
    };
    const onGame = (r) => {
        setRes(r);
        if (ch.dilemma.options.length)
            setStage('decide');
        else
            commit(r, null);
    };
    const p = ch.panels[panel];
    return (react_1.default.createElement("div", { className: "mission" },
        react_1.default.createElement("div", { className: "mission-h" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "ch-code" }, ch.code),
                react_1.default.createElement("h2", null, ch.title),
                react_1.default.createElement("small", null, ch.role)),
            react_1.default.createElement(common_1.Steps, { steps: ['開場', '簡報', '任務', '決策', '結果'], cur: ['intro', 'brief', 'play', 'decide', 'result'].indexOf(stage) })),
        stage === 'intro' && (react_1.default.createElement("div", { className: "comic" },
            ch.panels.map((pp, i) => (react_1.default.createElement("div", { key: i, className: `panel ${i <= panel ? 'show' : ''}`, onClick: () => setPanel(Math.min(ch.panels.length - 1, panel + 1)) },
                react_1.default.createElement("div", { className: "panel-art" },
                    react_1.default.createElement(common_1.NpcFace, { id: pp.npc, size: 92, mood: i === 2 ? 'happy' : undefined }),
                    react_1.default.createElement("div", { className: "speed" })),
                react_1.default.createElement("div", { className: "speech" },
                    react_1.default.createElement("b", null, data_1.NPCS[pp.npc].name),
                    pp.text)))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { onClick: () => setStage('brief') }, "\u7565\u904E"),
                panel < ch.panels.length - 1 ? react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setPanel(panel + 1) }, "\u4E0B\u4E00\u683C \u25B6") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStage('brief') }, "\u4EFB\u52D9\u7C21\u5831 \u25B6")))),
        stage === 'brief' && (react_1.default.createElement("div", { className: "grid2" },
            react_1.default.createElement(common_1.Card, { title: "\u4EFB\u52D9\u76EE\u6A19" },
                react_1.default.createElement("ul", { className: "obj" }, ch.objectives.map((o) => react_1.default.createElement("li", { key: o }, o))),
                react_1.default.createElement("p", { className: "small muted" },
                    "\u53CA\u683C\u5206\u6578\uFF1A",
                    (0, state_1.passLine)(g),
                    "\uFF08\u53CA\u683C\u53EF\u53D6\u5F97\u8A8D\u8B49",
                    ch.reward.cert ? `「${ch.reward.cert}」` : '',
                    "\uFF09")),
            react_1.default.createElement(common_1.Card, { title: "\u64CD\u4F5C\u6559\u5B78\u30FB\u8853\u8A9E" },
                react_1.default.createElement("ul", { className: "small tut" }, ch.tutorial.map((t) => react_1.default.createElement("li", { key: t }, t)))),
            react_1.default.createElement("div", { className: "row end full" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStage('play') },
                    "\u958B\u59CB\uFF1A",
                    GAME_NAME[ch.game],
                    " \u25B6")))),
        stage === 'play' && react_1.default.createElement(G, { key: key, cfg: ch.cfg, onDone: onGame }),
        stage === 'decide' && res && (react_1.default.createElement(common_1.Card, { title: "\u5169\u96E3\u6C7A\u7B56" },
            react_1.default.createElement("p", { className: "dilemma" }, ch.dilemma.prompt),
            react_1.default.createElement("div", { className: "views" }, ch.dilemma.views.map((v, i) => react_1.default.createElement(common_1.Bubble, { key: i, npc: v.npc, text: v.text, mood: i === 0 ? 'worried' : undefined }))),
            react_1.default.createElement("div", { className: "opts col" }, ch.dilemma.options.map((o, i) => react_1.default.createElement("button", { key: i, className: `opt ${opt === i ? 'on' : ''}`, onClick: () => setOpt(i) },
                react_1.default.createElement("b", null, o.label),
                react_1.default.createElement("small", null,
                    react_1.default.createElement("br", null),
                    o.desc)))),
            react_1.default.createElement(common_1.Hint, null, "\u6C92\u6709\u6C38\u9060\u552F\u4E00\u7684\u6B63\u89E3\uFF1B\u4F46\u9055\u53CD\u5B89\u5168\u898F\u7BC4\u6C38\u9060\u4E0D\u662F\u6377\u5F91\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: opt === null, onClick: () => commit(res, opt) }, "\u78BA\u5B9A\u6C7A\u7B56")))),
        stage === 'result' && out && res && (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: `result-h ${out.pass ? 'pass' : 'fail'}` },
                react_1.default.createElement("div", { className: "big" },
                    res.score,
                    react_1.default.createElement("small", null, "\u5206")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("b", null, out.pass ? '任務完成！' : `未達及格（${(0, state_1.passLine)(g)} 分）`),
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("small", null, out.pass ? (ch.reward.cert ? `取得認證：${ch.reward.cert}` : '') : '可重新挑戰以取得認證；進度與決策結果已保留。'))),
            react_1.default.createElement("div", { className: "grid2" },
                react_1.default.createElement(common_1.Card, { title: "\u4EFB\u52D9\u8A55\u91CF" },
                    react_1.default.createElement("ul", { className: "list" }, res.summary.map((s) => react_1.default.createElement("li", { key: s }, s))),
                    opt !== null && react_1.default.createElement(common_1.Bubble, { npc: ch.dilemma.options[opt].react.split('：')[0].includes('Anna') ? 'keller' : (Object.values(data_1.NPCS).find((n) => ch.dilemma.options[opt].react.startsWith(n.name.split('（')[0]))?.id || ch.panels[0].npc), text: ch.dilemma.options[opt].react.split('：').slice(1).join('：') || ch.dilemma.options[opt].react, mood: ch.dilemma.options[opt].effect.flag ? 'angry' : 'happy' })),
                react_1.default.createElement(common_1.Card, { title: "\u6578\u64DA\u7D50\u679C\uFF08\u5DE5\u5EE0\u6A21\u64EC\u9031\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
                    react_1.default.createElement("div", { className: "grid2" },
                        react_1.default.createElement(common_1.Kpi, { label: "\u5168\u7DDA OEE", value: sim_1.fmt.pct(out.after.oee), delta: `${((out.after.oee - out.before.oee) * 100).toFixed(1)}pt` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u826F\u54C1\u7522\u51FA", value: sim_1.fmt.n(out.after.goodTotal), delta: `${out.after.goodTotal >= out.before.goodTotal ? '+' : ''}${sim_1.fmt.n(out.after.goodTotal - out.before.goodTotal)}` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u55AE\u4F4D\u6210\u672C", value: `NT$${out.after.costPerGood.toFixed(2)}`, delta: `${(out.after.costPerGood - out.before.costPerGood) >= 0 ? '+' : ''}${(out.after.costPerGood - out.before.costPerGood).toFixed(2)}` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u5BA2\u6236 PPM", value: out.after.ppm.toFixed(0), delta: `${(out.after.ppm - out.before.ppm) >= 0 ? '+' : ''}${(out.after.ppm - out.before.ppm).toFixed(0)}` })))),
            react_1.default.createElement(common_1.Card, { title: "\u5DE5\u4F5C\u65E5\u8A8C\u8207\u6210\u9577" },
                react_1.default.createElement("p", null,
                    "\uD83D\uDCD3 ",
                    ch.journal),
                react_1.default.createElement("div", { className: "chips" },
                    Object.entries(ch.reward.xp).map(([b, v]) => react_1.default.createElement(common_1.Tag, { key: b, color: data_1.BRANCHES[b].color },
                        data_1.BRANCHES[b].name,
                        " \u2191")),
                    out.first && ch.reward.funds > 0 && react_1.default.createElement(common_1.Tag, { color: "var(--orange)" },
                        "\u5C08\u6848\u7D93\u8CBB +",
                        sim_1.fmt.nt(ch.reward.funds)),
                    out.first && react_1.default.createElement(common_1.Tag, { color: "var(--orange)" }, "\u6280\u80FD\u9EDE +1")),
                out.promoted.map((p) => react_1.default.createElement("div", { key: p, className: "promo" },
                    "\uD83C\uDF89 \u6649\u5347\u70BA ",
                    react_1.default.createElement("b", null, data_1.CAREERS[p].title),
                    "\uFF08",
                    data_1.CAREERS[p].en,
                    "\uFF09")),
                out.newAch.map((a) => data_1.ACHIEVEMENTS[a] && react_1.default.createElement("div", { key: a, className: "goodbox" },
                    "\uD83C\uDFC5 \u89E3\u9396\u6210\u5C31\uFF1A",
                    data_1.ACHIEVEMENTS[a].name)),
                out.need && !out.need.ok && react_1.default.createElement("div", { className: "warnbox" },
                    "\u4E0B\u4E00\u7AE0\u9700\u8981\u6649\u5347\u70BA\u300C",
                    data_1.CAREERS[g.pos + 1]?.title,
                    "\u300D\u3002\u5C1A\u7F3A\uFF1A",
                    out.need.items.filter((i) => !i.ok).map((i) => i.label).join('；'),
                    "\u3002\u53EF\u5230\u300C\u8077\u6DAF\u300D\u9801\u5206\u914D\u6280\u80FD\u9EDE\u3001\u9032\u4FEE\u6216\u8DE8\u90E8\u9580\u652F\u63F4\uFF0C\u6216\u91CD\u65B0\u6311\u6230\u4EFB\u52D9\u53D6\u5F97\u8A8D\u8B49\u3002"),
                react_1.default.createElement("div", { className: "row end" },
                    react_1.default.createElement(common_1.Btn, { onClick: () => { setStage('intro'); setPanel(0); setRes(null); setOpt(null); setOut(null); setKey(key + 1); } }, "\u91CD\u65B0\u6311\u6230"),
                    ch.game === 'phoenix' ? react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => go('report') }, "\u67E5\u770B\u6539\u5584\u6210\u679C\u5831\u544A \u25B6") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => go('map') }, "\u56DE\u5230\u5DE5\u5EE0\u5730\u5716 \u25B6")))))));
}
function EventModal() {
    const { g, set, sfx } = react_1.default.useContext(common_1.GameCtx);
    const ev = data_1.EVENTS.find((e) => e.id === g.pendingEvent);
    const [res, setRes] = (0, react_1.useState)(null);
    if (!ev)
        return null;
    const choose = (i) => {
        const o = ev.options[i];
        const before = (0, sim_1.simulateWeek)(g.factory, g.seed + g.week);
        const short = (o.effect.funds || 0) < 0 && g.funds < -(o.effect.funds || 0);
        let n = (0, state_1.applyEff)(g, o.effect);
        if (short)
            n.trust = { ...n.trust, mgmt: n.trust.mgmt - 2 };
        const after = (0, sim_1.simulateWeek)(n.factory, g.seed + g.week);
        n.eventsSeen = [...n.eventsSeen, ev.id];
        n.decisions = [...n.decisions, { week: n.week, title: ev.title, choice: o.label }];
        n.journal = [...n.journal, { week: n.week, title: `事件：${ev.title}`, text: `處置：${o.label}` }];
        n.history = [...n.history, (0, state_1.snapshot)(n.factory, n.week, ev.title, n.seed)];
        setRes({ o, before, after, short, trust: o.effect.trust, brand: o.effect.brand });
        set(() => n);
        sfx('click');
    };
    return (react_1.default.createElement(common_1.Modal, { title: react_1.default.createElement(react_1.default.Fragment, null,
            "\u26A1 \u5DE5\u5EE0\u4E8B\u4EF6\uFF1A",
            ev.title), wide: true }, !res ? react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(common_1.Bubble, { npc: ev.npc, text: ev.desc, mood: "worried" }),
        react_1.default.createElement("div", { className: "opts col" }, ev.options.map((o, i) => react_1.default.createElement("button", { key: i, className: "opt", onClick: () => choose(i) },
            react_1.default.createElement("b", null, o.label),
            react_1.default.createElement("small", null,
                react_1.default.createElement("br", null),
                o.desc,
                o.effect.funds ? `・即時成本 ${sim_1.fmt.nt(-o.effect.funds)}` : '',
                (o.effect.funds || 0) < 0 && g.funds < -(o.effect.funds || 0) ? '（經費不足，將申請追加預算：經營管理信任 −2）' : '')))),
        react_1.default.createElement("p", { className: "small muted" }, "\u6BCF\u500B\u9078\u64C7\u90FD\u6703\u6539\u8B8A\u5DE5\u5EE0\u53C3\u6578\uFF0C\u4E26\u53EF\u80FD\u5F71\u97FF\u4E4B\u5F8C\u51FA\u73FE\u7684\u4E8B\u4EF6\u3002")) : react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("p", null,
            "\u4F60\u9078\u64C7\uFF1A",
            react_1.default.createElement("b", null, res.o.label)),
        react_1.default.createElement("div", { className: "grid4" },
            react_1.default.createElement(common_1.Kpi, { label: "\u5373\u6642\u6210\u672C", value: res.o.effect.funds ? sim_1.fmt.nt(-res.o.effect.funds) : 'NT$0' }),
            react_1.default.createElement(common_1.Kpi, { label: "\u9810\u671F\u7522\u91CF", value: sim_1.fmt.n(res.after.goodTotal), delta: `${res.after.goodTotal - res.before.goodTotal >= 0 ? '+' : ''}${sim_1.fmt.n(res.after.goodTotal - res.before.goodTotal)}` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u54C1\u8CEA\u98A8\u96AA PPM", value: res.after.ppm.toFixed(0), delta: `${res.after.ppm - res.before.ppm >= 0 ? '+' : ''}${(res.after.ppm - res.before.ppm).toFixed(0)}` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u8A2D\u5099 OEE", value: sim_1.fmt.pct(res.after.oee), delta: `${((res.after.oee - res.before.oee) * 100).toFixed(1)}pt` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u54E1\u5DE5\u75B2\u52DE", value: res.after.fatigue.toFixed(0), delta: `${res.after.fatigue - res.before.fatigue >= 0 ? '+' : ''}${(res.after.fatigue - res.before.fatigue).toFixed(0)}` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u4EA4\u671F OTIF", value: sim_1.fmt.pct(res.after.otif), delta: `${((res.after.otif - res.before.otif) * 100).toFixed(1)}pt` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5B89\u5168\u6307\u6578", value: res.after.safety.toFixed(0) }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5BA2\u6236\u4FE1\u4EFB", value: res.brand ? `${res.brand > 0 ? '+' : ''}${res.brand}` : '±0', sub: res.trust ? Object.entries(res.trust).map(([k, v]) => `${data_1.DEPTS[k]}${v > 0 ? '+' : ''}${v}`).join('、') : '' })),
        react_1.default.createElement("div", { className: "row end" },
            react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => { setRes(null); set((g0) => ({ ...g0, pendingEvent: null })); } }, "\u7E7C\u7E8C")))));
}
const NAV = [
    { id: 'map', n: '工廠地圖', i: '🏭' }, { id: 'mission', n: '任務中心', i: '📋' }, { id: 'dash', n: '數據儀表板', i: '📊' }, { id: 'ai', n: 'AI 研發室', i: '🤖' },
    { id: 'cim', n: 'IE／CIM 中心', i: '🛰' }, { id: 'codex', n: '工程百科', i: '📚' }, { id: 'career', n: '職涯', i: '🎓' }, { id: 'settings', n: '設定', i: '⚙' },
];
function App({ onExit } = {}) {
    const [g, setG] = (0, react_1.useState)(null);
    const [screen, setScreen] = (0, react_1.useState)('title');
    const [view, setView] = (0, react_1.useState)({ v: 'map' });
    const [toasts, setToasts] = (0, react_1.useState)([]);
    const mainRef = (0, react_1.useRef)(null);
    const hasSave = (0, react_1.useMemo)(() => !!(0, state_1.slotInfo)(0), [screen]);
    (0, react_1.useEffect)(() => { if (g && screen === 'game') {
        const t = setTimeout(() => (0, state_1.saveSlot)(0, g), 400);
        return () => clearTimeout(t);
    } }, [g, screen]);
    const toast = (s) => { const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, s }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200); };
    const go = (v, a) => { setView({ v, a }); mainRef.current?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); };
    window.__careerBack = () => { if (screen === 'create') {
        setScreen('title');
        return true;
    } if (screen === 'game' && view.v !== 'map') {
        setView({ v: 'map' });
        return true;
    } return false; };
    if (screen === 'title')
        return react_1.default.createElement(Title, { onExit: onExit, hasSave: hasSave, onNew: () => setScreen('create'), onContinue: () => { const l = (0, state_1.loadSlot)(0); if (l) {
                setG(l);
                setScreen('game');
                setView({ v: 'map' });
            } }, onLoad: (s) => { const l = (0, state_1.loadSlot)(s); if (l) {
                setG(l);
                setScreen('game');
                setView({ v: 'map' });
            } } });
    if (screen === 'create' || !g)
        return react_1.default.createElement(Create, { onBack: () => setScreen('title'), onStart: (p, m) => { const n = (0, state_1.newGame)(p, m); setG(n); setScreen('game'); setView(m === 'sandbox' ? { v: 'cim' } : { v: 'mission', a: 0 }); } });
    const ctx = { g, set: (fn) => setG((x) => (x ? fn(x) : x)), go, sfx: (t) => g.settings.sound && (0, common_1.beep)(t), toast };
    const cur = (0, state_1.currentChapter)(g);
    return (react_1.default.createElement(common_1.GameCtx.Provider, { value: ctx },
        react_1.default.createElement("div", { className: `app text-${g.settings.text} ${g.settings.motion ? '' : 'nomotion'}` },
            react_1.default.createElement("header", { className: "top" },
                react_1.default.createElement("button", { className: "brand", onClick: () => go('map') },
                    react_1.default.createElement("span", { className: "logo" }, "\u2B22"),
                    react_1.default.createElement("span", null,
                        react_1.default.createElement("b", null, "\u5F9E\u4E00\u9846\u87BA\u7D72\u5230\u4E00\u5EA7\u667A\u6167\u5DE5\u5EE0"),
                        react_1.default.createElement("small", null, "SUMEEKO: Rise of the Smart Factory"))),
                react_1.default.createElement("div", { className: "top-stats" },
                    react_1.default.createElement("span", { className: "who", onClick: () => go('career') },
                        react_1.default.createElement(common_1.PlayerFace, { size: 34 }),
                        react_1.default.createElement("span", null,
                            react_1.default.createElement("b", null, g.player.name),
                            react_1.default.createElement("small", null, data_1.CAREERS[g.pos].title))),
                    react_1.default.createElement("span", { className: "st" },
                        react_1.default.createElement("small", null, "\u9031"),
                        react_1.default.createElement("b", null,
                            "W",
                            g.week)),
                    react_1.default.createElement("span", { className: "st" },
                        react_1.default.createElement("small", null, "\u5C08\u6848\u7D93\u8CBB"),
                        react_1.default.createElement("b", null, sim_1.fmt.wan(g.funds))),
                    react_1.default.createElement("span", { className: "st hide-s" },
                        react_1.default.createElement("small", null, "\u8072\u8B7D"),
                        react_1.default.createElement("b", null, g.brand)),
                    onExit && react_1.default.createElement("button", { className: "btn sm", onClick: onExit, title: "\u8FD4\u56DE App" }, "\u2302 App"),
                    g.mode !== 'sandbox' && cur <= data_1.FINAL_ID && react_1.default.createElement("button", { className: "btn primary sm", onClick: () => go('mission', cur) },
                        "\u25B6 ",
                        data_1.CHAPTERS[cur].code))),
            react_1.default.createElement("nav", { className: "nav" }, NAV.map((n) => react_1.default.createElement("button", { key: n.id, className: view.v === n.id || (n.id === 'cim' && view.v === 'report') ? 'on' : '', onClick: () => go(n.id) },
                react_1.default.createElement("span", null, n.i),
                react_1.default.createElement("small", null, n.n)))),
            react_1.default.createElement("main", { className: "main", ref: mainRef },
                view.v === 'map' && react_1.default.createElement(views_1.MapView, null),
                view.v === 'mission' && (view.a === undefined ? react_1.default.createElement(MissionList, { go: go }) : react_1.default.createElement(MissionView, { key: view.a, id: view.a })),
                view.v === 'dash' && react_1.default.createElement(views_1.Dashboard, null),
                view.v === 'ai' && react_1.default.createElement(views_1.AIView, null),
                view.v === 'cim' && react_1.default.createElement(views_1.CIMView, null),
                view.v === 'codex' && react_1.default.createElement(views_1.CodexView, null),
                view.v === 'career' && react_1.default.createElement(views_1.CareerView, null),
                view.v === 'settings' && react_1.default.createElement(views_1.SettingsView, { onRestart: () => { setG(null); setScreen('title'); } }),
                view.v === 'report' && react_1.default.createElement(views_1.ReportView, null)),
            g.pendingEvent && view.v !== 'mission' && react_1.default.createElement(EventModal, null),
            react_1.default.createElement("div", { className: "toasts" }, toasts.map((t) => react_1.default.createElement("div", { key: t.id, className: "toast" }, t.s))))));
}

};
factories["./ui/common.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOOKS = exports.useG = exports.GameCtx = void 0;
exports.beep = beep;
exports.Btn = Btn;
exports.Card = Card;
exports.Tag = Tag;
exports.SimTag = SimTag;
exports.Meter = Meter;
exports.Kpi = Kpi;
exports.Modal = Modal;
exports.Face = Face;
exports.NpcFace = NpcFace;
exports.PlayerFace = PlayerFace;
exports.Bubble = Bubble;
exports.Bars = Bars;
exports.Lines = Lines;
exports.Legend = Legend;
exports.Steps = Steps;
exports.Hint = Hint;
const react_1 = __importStar(require("react"));
const data_1 = require("../data");
exports.GameCtx = (0, react_1.createContext)(null);
const useG = () => (0, react_1.useContext)(exports.GameCtx);
exports.useG = useG;
let ac = null;
function beep(type = 'click') {
    try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        const seq = { click: [[660, 0.04]], good: [[660, 0.08], [990, 0.12]], bad: [[220, 0.15], [180, 0.15]], level: [[523, 0.1], [659, 0.1], [784, 0.1], [1046, 0.2]] };
        let t = ac.currentTime;
        for (const [f, d] of seq[type]) {
            const o = ac.createOscillator(), gn = ac.createGain();
            o.type = type === 'bad' ? 'sawtooth' : 'triangle';
            o.frequency.value = f;
            gn.gain.setValueAtTime(0.06, t);
            gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
            o.connect(gn);
            gn.connect(ac.destination);
            o.start(t);
            o.stop(t + d);
            t += d * 0.9;
        }
    }
    catch { }
}
function Btn(p) {
    const { sfx } = (0, exports.useG)() || { sfx: () => { } };
    return (react_1.default.createElement("button", { title: p.title, style: p.style, className: `btn ${p.kind || ''} ${p.small ? 'sm' : ''} ${p.className || ''}`, disabled: p.disabled, onClick: () => { if (p.disabled)
            return; sfx && sfx('click'); p.onClick && p.onClick(); } }, p.children));
}
function Card(p) {
    return (react_1.default.createElement("section", { className: `card ${p.className || ''}`, style: p.style },
        (p.title || p.right) && react_1.default.createElement("header", { className: "card-h" },
            react_1.default.createElement("h3", null, p.title),
            p.right),
        p.children));
}
function Tag(p) { return react_1.default.createElement("span", { className: "tag", style: { borderColor: p.color, color: p.color } }, p.children); }
function SimTag() { return react_1.default.createElement("span", { className: "simtag" }, "\u904A\u6232\u6A21\u64EC\u8CC7\u6599"); }
function Meter(p) {
    const pct = Math.max(0, Math.min(1, p.v / (p.max || 1)));
    const over = p.danger !== undefined && p.v > p.danger;
    return (react_1.default.createElement("div", { className: "meter" },
        (p.label || p.right) && react_1.default.createElement("div", { className: "meter-l" },
            react_1.default.createElement("span", null, p.label),
            react_1.default.createElement("b", null, p.right)),
        react_1.default.createElement("div", { className: "meter-t" },
            react_1.default.createElement("div", { className: "meter-f", style: { width: `${pct * 100}%`, background: over ? 'var(--red)' : p.color || 'var(--cyan)' } }))));
}
function Kpi(p) {
    return (react_1.default.createElement("div", { className: "kpi" },
        react_1.default.createElement("div", { className: "kpi-l" }, p.label),
        react_1.default.createElement("div", { className: "kpi-v", style: { color: p.good === true ? 'var(--green)' : p.good === false ? 'var(--red)' : undefined } }, p.value),
        (p.sub || p.delta) && react_1.default.createElement("div", { className: "kpi-s" },
            p.delta && react_1.default.createElement("b", null,
                p.delta,
                " "),
            p.sub)));
}
function Modal(p) {
    return (react_1.default.createElement("div", { className: "modal-bg", onClick: (e) => { if (e.target === e.currentTarget && p.onClose)
            p.onClose(); } },
        react_1.default.createElement("div", { className: `modal ${p.wide ? 'wide' : ''}`, role: "dialog" },
            p.title && react_1.default.createElement("header", { className: "card-h" },
                react_1.default.createElement("h3", null, p.title),
                p.onClose && react_1.default.createElement("button", { className: "x", "aria-label": "\u95DC\u9589", onClick: p.onClose }, "\u2715")),
            p.children)));
}
function Face(p) {
    const s = p.size || 64;
    const st = p.style || 0;
    return (react_1.default.createElement("svg", { width: s, height: s, viewBox: "0 0 64 64", className: "face" },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("linearGradient", { id: `c${p.coat.slice(1)}`, x1: "0", y1: "0", x2: "0", y2: "1" },
                react_1.default.createElement("stop", { offset: "0", stopColor: p.coat }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#0a1324" })),
            react_1.default.createElement("radialGradient", { id: `s${p.skin.slice(1)}`, cx: "0.4", cy: "0.35", r: "0.7" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#fff", stopOpacity: ".35" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: p.skin, stopOpacity: "0" }))),
        react_1.default.createElement("rect", { width: "64", height: "64", rx: "12", fill: "#13213d" }),
        react_1.default.createElement("path", { d: "M8 64 Q10 46 32 44 Q54 46 56 64Z", fill: `url(#c${p.coat.slice(1)})` }),
        react_1.default.createElement("path", { d: "M27 44 L32 52 L37 44", fill: "#e8edf5", opacity: ".8" }),
        react_1.default.createElement("rect", { x: "27", y: "36", width: "10", height: "9", rx: "3", fill: p.skin }),
        react_1.default.createElement("ellipse", { cx: "32", cy: "28", rx: "12", ry: "14", fill: p.skin }),
        react_1.default.createElement("ellipse", { cx: "32", cy: "28", rx: "12", ry: "14", fill: `url(#s${p.skin.slice(1)})` }),
        st === 0 && react_1.default.createElement("path", { d: "M20 26 Q20 12 32 12 Q45 12 44 26 Q42 18 32 18 Q24 18 20 26Z", fill: p.hair }),
        st === 1 && react_1.default.createElement("path", { d: "M19 30 Q17 11 32 11 Q47 11 45 30 L45 40 Q43 26 40 20 Q32 22 24 20 Q21 26 21 40Z", fill: p.hair }),
        st === 2 && react_1.default.createElement("path", { d: "M20 24 Q22 14 32 14 Q42 14 44 24 Q40 19 32 20 Q24 19 20 24Z", fill: p.hair }),
        st === 3 && react_1.default.createElement("path", { d: "M19 27 Q18 10 33 11 Q47 12 45 27 Q44 20 37 17 Q34 22 26 21 Q21 22 19 27Z", fill: p.hair }),
        react_1.default.createElement("ellipse", { cx: "27", cy: "29", rx: "1.6", ry: p.mood === 'happy' ? 1 : 2, fill: "#1a1a1a" }),
        react_1.default.createElement("ellipse", { cx: "37", cy: "29", rx: "1.6", ry: p.mood === 'happy' ? 1 : 2, fill: "#1a1a1a" }),
        react_1.default.createElement("path", { d: p.mood === 'angry' ? 'M24 24 L30 26 M40 24 L34 26' : 'M24 25 Q27 23.5 30 25 M34 25 Q37 23.5 40 25', stroke: p.hair, strokeWidth: "1.4", fill: "none" }),
        react_1.default.createElement("path", { d: p.mood === 'angry' ? 'M28 37 Q32 35 36 37' : p.mood === 'worried' ? 'M28 37 Q32 36 36 37' : 'M28 36 Q32 39 36 36', stroke: "#7a3a2a", strokeWidth: "1.5", fill: "none", strokeLinecap: "round" }),
        p.glasses && react_1.default.createElement("g", { stroke: "#cfd8e6", strokeWidth: "1.2", fill: "rgba(120,200,255,.12)" },
            react_1.default.createElement("rect", { x: "22.5", y: "26", width: "9", height: "6", rx: "2" }),
            react_1.default.createElement("rect", { x: "32.5", y: "26", width: "9", height: "6", rx: "2" }),
            react_1.default.createElement("path", { d: "M31.5 28.5 h1" })),
        p.helmet && react_1.default.createElement("g", null,
            react_1.default.createElement("path", { d: "M17 23 Q18 8 32 8 Q46 8 47 23 Z", fill: "#ffb02e" }),
            react_1.default.createElement("rect", { x: "15", y: "21.5", width: "34", height: "3", rx: "1.5", fill: "#e08a10" }),
            react_1.default.createElement("path", { d: "M24 12 Q32 9 40 12", stroke: "#fff", strokeOpacity: ".5", strokeWidth: "1.5", fill: "none" }))));
}
exports.LOOKS = [
    { hair: '#1d1a2b', skin: '#f2cda9', style: 3 }, { hair: '#3a2213', skin: '#eac09a', style: 1 },
    { hair: '#141414', skin: '#d9a77f', style: 0 }, { hair: '#5a3a26', skin: '#f6d6c0', style: 2 },
];
function NpcFace(p) {
    const n = data_1.NPCS[p.id];
    if (!n)
        return null;
    return react_1.default.createElement(Face, { ...n, size: p.size, mood: p.mood });
}
function PlayerFace(p) {
    const { g } = (0, exports.useG)();
    const l = exports.LOOKS[g.player.look] || exports.LOOKS[0];
    return react_1.default.createElement(Face, { hair: l.hair, skin: l.skin, style: l.style, coat: g.player.coat, helmet: g.pos < 3, glasses: g.pos >= 6, size: p.size, mood: p.mood });
}
function Bubble(p) {
    const n = data_1.NPCS[p.npc];
    return (react_1.default.createElement("div", { className: `bubble-row ${p.right ? 'r' : ''}` },
        react_1.default.createElement(NpcFace, { id: p.npc, size: 52, mood: p.mood }),
        react_1.default.createElement("div", { className: "bubble" },
            react_1.default.createElement("div", { className: "bubble-n" },
                n?.name,
                react_1.default.createElement("small", null, n?.role)),
            p.text)));
}
function Bars(p) {
    const h = p.h || 180, w = 520, pad = 34, bw = (w - pad - 8) / p.data.length;
    const max = p.max || Math.max(...p.data.map((d) => d.v), p.line || 0) * 1.15 || 1;
    const y = (v) => h - 26 - (v / max) * (h - 44);
    return (react_1.default.createElement("svg", { viewBox: `0 0 ${w} ${h}`, className: "chart", role: "img" },
        [0, 0.5, 1].map((t) => react_1.default.createElement("g", { key: t },
            react_1.default.createElement("line", { x1: pad, x2: w, y1: y(max * t), y2: y(max * t), className: "grid" }),
            react_1.default.createElement("text", { x: pad - 4, y: y(max * t) + 4, className: "ax", textAnchor: "end" }, p.fmtv ? p.fmtv(max * t) : (max * t).toFixed(max * t < 10 ? 1 : 0)))),
        p.data.map((d, i) => (react_1.default.createElement("g", { key: i, onClick: () => p.onPick && p.onPick(i), style: { cursor: p.onPick ? 'pointer' : undefined } },
            react_1.default.createElement("rect", { x: pad + i * bw + bw * 0.18, y: y(d.v), width: bw * 0.64, height: Math.max(1, h - 26 - y(d.v)), rx: "3", fill: d.color || 'var(--cyan)', opacity: p.picked !== undefined && p.picked !== i ? 0.45 : 1, stroke: p.picked === i ? '#fff' : 'none', strokeWidth: "2" }),
            react_1.default.createElement("text", { x: pad + i * bw + bw / 2, y: h - 10, className: "ax", textAnchor: "middle" }, d.label),
            react_1.default.createElement("text", { x: pad + i * bw + bw / 2, y: y(d.v) - 4, className: "val", textAnchor: "middle" }, p.fmtv ? p.fmtv(d.v) : Number.isInteger(d.v) ? d.v : d.v.toFixed(d.v < 10 ? 2 : 0))))),
        p.line !== undefined && react_1.default.createElement("g", null,
            react_1.default.createElement("line", { x1: pad, x2: w, y1: y(p.line), y2: y(p.line), stroke: "var(--orange)", strokeDasharray: "6 4", strokeWidth: "2" }),
            react_1.default.createElement("text", { x: w - 4, y: y(p.line) - 5, className: "val", textAnchor: "end", fill: "var(--orange)" }, p.lineLabel))));
}
function Lines(p) {
    const h = p.h || 200, w = 560, pad = 40;
    const all = p.series.flatMap((s) => s.values).concat((p.hlines || []).map((x) => x.v));
    const mn = p.min ?? Math.min(...all) * 0.95, mx = p.max ?? Math.max(...all) * 1.05;
    const n = Math.max(2, p.labels.length);
    const x = (i) => pad + (i / (n - 1)) * (w - pad - 12);
    const y = (v) => h - 24 - ((v - mn) / (mx - mn || 1)) * (h - 40);
    return (react_1.default.createElement("svg", { viewBox: `0 0 ${w} ${h}`, className: "chart", role: "img" },
        (p.bands || []).map((b, i) => react_1.default.createElement("rect", { key: i, x: pad, width: w - pad - 12, y: y(b.to), height: Math.max(0, y(b.from) - y(b.to)), fill: b.color })),
        [0, 0.5, 1].map((t) => { const v = mn + (mx - mn) * t; return react_1.default.createElement("g", { key: t },
            react_1.default.createElement("line", { x1: pad, x2: w - 12, y1: y(v), y2: y(v), className: "grid" }),
            react_1.default.createElement("text", { x: pad - 4, y: y(v) + 4, className: "ax", textAnchor: "end" }, p.fmtv ? p.fmtv(v) : v.toFixed(1))); }),
        (p.hlines || []).map((l, i) => react_1.default.createElement("g", { key: i },
            react_1.default.createElement("line", { x1: pad, x2: w - 12, y1: y(l.v), y2: y(l.v), stroke: l.color, strokeDasharray: "5 4" }),
            react_1.default.createElement("text", { x: w - 14, y: y(l.v) - 4, textAnchor: "end", className: "val", fill: l.color }, l.label))),
        p.labels.map((l, i) => (n <= 14 || i % Math.ceil(n / 12) === 0) && react_1.default.createElement("text", { key: i, x: x(i), y: h - 6, className: "ax", textAnchor: "middle" }, l)),
        p.series.map((s) => (react_1.default.createElement("g", { key: s.name },
            react_1.default.createElement("polyline", { fill: "none", stroke: s.color, strokeWidth: "2.2", points: s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ') }),
            s.values.map((v, i) => {
                const m = p.marks?.includes(i);
                return react_1.default.createElement("circle", { key: i, cx: x(i), cy: y(v), r: p.onPoint ? 7 : 3, fill: m ? p.markColor || 'var(--red)' : s.color, stroke: m ? '#fff' : 'none', strokeWidth: "2", style: { cursor: p.onPoint ? 'pointer' : undefined }, onClick: () => p.onPoint && p.onPoint(i) });
            }))))));
}
function Legend(p) {
    return react_1.default.createElement("div", { className: "legend" }, p.items.map((i) => react_1.default.createElement("span", { key: i.name },
        react_1.default.createElement("i", { style: { background: i.color } }),
        i.name)));
}
function Steps(p) {
    return react_1.default.createElement("ol", { className: "steps" }, p.steps.map((s, i) => react_1.default.createElement("li", { key: s, className: i < p.cur ? 'done' : i === p.cur ? 'cur' : '' }, s)));
}
function Hint(p) {
    const { g } = (0, exports.useG)();
    if (!g.settings.hints)
        return null;
    return react_1.default.createElement("div", { className: "hint" },
        "\uD83D\uDCA1 ",
        p.children);
}

};
factories["./views.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AREAS = void 0;
exports.MapView = MapView;
exports.Dashboard = Dashboard;
exports.CareerView = CareerView;
exports.CodexView = CodexView;
exports.Sources = Sources;
exports.AIView = AIView;
exports.CIMView = CIMView;
exports.runSelfTests = runSelfTests;
exports.SettingsView = SettingsView;
exports.ReportView = ReportView;
const react_1 = __importStar(require("react"));
const common_1 = require("./ui/common");
const sim_1 = require("./sim");
const data_1 = require("./data");
const state_1 = require("./state");
const ai_1 = require("./games/ai");
const cim_1 = require("./games/cim");
exports.AREAS = [
    { id: 1, n: '原料及供應鏈區', d: '盤元進料、IQC、批號與材證管理。盤元由上游鋼廠供應。', st: [], gx: 0, gy: 0 },
    { id: 2, n: '球化／材料前處理區', d: '球化退火、酸洗皮膜等前處理（順序依鋼種與路徑而異）。', st: [], gx: 1, gy: 0 },
    { id: 3, n: '伸線區', d: '控制線徑與表面，供冷鍛使用。', st: ['draw'], gx: 2, gy: 0 },
    { id: 4, n: '冷鍛／打頭區', d: '多工位打頭機成形螺絲頭部與螺帽。', st: ['forge'], gx: 3, gy: 0 },
    { id: 5, n: '搓牙／攻牙區', d: '螺栓外螺紋搓牙、螺帽內螺紋攻牙。初始瓶頸所在。', st: ['thread'], gx: 3, gy: 1 },
    { id: 6, n: '熱處理區', d: '批次爐淬火回火，特殊製程。', st: ['heat'], gx: 2, gy: 1 },
    { id: 7, n: '表面處理區', d: '鍍層與塗層，影響防蝕與摩擦係數。', st: ['surface'], gx: 1, gy: 1 },
    { id: 8, n: '二次加工及組裝區', d: '軸向沖壓、塗膠、套管組裝等。', st: ['secondary', 'assembly'], gx: 0, gy: 1 },
    { id: 9, n: '光學檢驗及品保實驗室', d: '光學篩選、硬度、扭力與尺寸檢驗。', st: ['optical'], gx: 0, gy: 2 },
    { id: 10, n: '包裝倉儲及出貨區', d: '成品包裝、儲位、出貨。', st: [], gx: 1, gy: 2 },
    { id: 11, n: '生產管理及物料控制中心', d: '排程、MRP、產銷協調。', st: [], gx: 2, gy: 2 },
    { id: 12, n: 'AI 研發室及 CIM 智慧控制中心', d: 'AI 專案、系統整合、數位孿生。', st: [], gx: 3, gy: 2 },
];
const ROUTE_AREAS = { HB: [1, 2, 3, 4, 5, 6, 7, 9, 10], PTN: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10], CSS: [1, 3, 4, 5, 6, 7, 8, 9, 10] };
const iso = (gx, gy) => ({ x: 372 + (gx - gy) * 108, y: 78 + (gx + gy) * 60 });
function areaUnlocked(g, id) {
    if (g.mode === 'sandbox')
        return true;
    const firstCh = data_1.CHAPTERS.find((c) => c.area === id);
    if ([2, 3, 10].includes(id))
        return !!g.done[0];
    if (!firstCh)
        return true;
    return (0, state_1.chapterUnlocked)(g, firstCh.id) || !!g.done[firstCh.id];
}
function MapView() {
    const { g, go } = (0, common_1.useG)();
    const [sel, setSel] = (0, react_1.useState)(null);
    const [route, setRoute] = (0, react_1.useState)(null);
    const sim = (0, react_1.useMemo)(() => (0, sim_1.simulateWeek)(g.factory, g.seed + g.week), [g.factory, g.week]);
    const cur = (0, state_1.currentChapter)(g);
    const curArea = data_1.CHAPTERS[cur]?.area;
    const flow = route ? ROUTE_AREAS[route] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pts = flow.map((id) => { const a = exports.AREAS.find((x) => x.id === id); const p = iso(a.gx, a.gy); return `${p.x},${p.y}`; }).join(' ');
    const A = sel ? exports.AREAS.find((a) => a.id === sel) : null;
    return (react_1.default.createElement("div", { className: "map-wrap" },
        react_1.default.createElement(common_1.Card, { title: "\u4E16\u5FB7\u667A\u6167\u5DE5\u5EE0\uFF08\u865B\u69CB\u793A\u610F\u5EE0\u5340\uFF09", right: react_1.default.createElement("div", { className: "row sm wrap" },
                react_1.default.createElement("span", { className: "muted small" }, "\u986F\u793A\u9014\u7A0B\uFF1A"),
                Object.keys(sim_1.PRODUCTS).map((p) => react_1.default.createElement("button", { key: p, className: `opt sm ${route === p ? 'on' : ''}`, onClick: () => setRoute(route === p ? null : p) }, sim_1.PRODUCTS[p].name))) },
            react_1.default.createElement("div", { className: "map-scroll" },
                react_1.default.createElement("svg", { viewBox: "0 0 800 420", className: `isomap ${g.settings.motion ? 'anim' : ''}` },
                    react_1.default.createElement("defs", null,
                        react_1.default.createElement("linearGradient", { id: "top", x1: "0", y1: "0", x2: "1", y2: "1" },
                            react_1.default.createElement("stop", { offset: "0", stopColor: "#2b4778" }),
                            react_1.default.createElement("stop", { offset: "1", stopColor: "#14264a" })),
                        react_1.default.createElement("linearGradient", { id: "topOn", x1: "0", y1: "0", x2: "1", y2: "1" },
                            react_1.default.createElement("stop", { offset: "0", stopColor: "#ffb24d" }),
                            react_1.default.createElement("stop", { offset: "1", stopColor: "#b55d00" })),
                        react_1.default.createElement("filter", { id: "glow" },
                            react_1.default.createElement("feGaussianBlur", { stdDeviation: "3", result: "b" }),
                            react_1.default.createElement("feMerge", null,
                                react_1.default.createElement("feMergeNode", { in: "b" }),
                                react_1.default.createElement("feMergeNode", { in: "SourceGraphic" })))),
                    react_1.default.createElement("polygon", { points: `${iso(-0.6, -0.6).x},${iso(-0.6, -0.6).y} ${iso(3.6, -0.6).x},${iso(3.6, -0.6).y} ${iso(3.6, 2.6).x},${iso(3.6, 2.6).y} ${iso(-0.6, 2.6).x},${iso(-0.6, 2.6).y}`, fill: "#0d1a33", stroke: "#1f3a66" }),
                    exports.AREAS.map((a) => {
                        const p = iso(a.gx, a.gy);
                        const un = areaUnlocked(g, a.id);
                        const st = sim.stations.filter((s) => a.st.includes(s.id));
                        const load = st.length ? Math.max(...st.map((s) => s.load)) : 0;
                        const isB = a.st.includes(sim.bottleneck);
                        const inRoute = flow.includes(a.id);
                        const w = 42, hgt = un ? 18 + (st.length ? Math.min(1.3, load) * 18 : 8) : 6;
                        const top = `${p.x},${p.y - hgt - 26} ${p.x + w * 1.9},${p.y - hgt} ${p.x},${p.y - hgt + 26} ${p.x - w * 1.9},${p.y - hgt}`;
                        return (react_1.default.createElement("g", { key: a.id, className: `zone-g ${sel === a.id ? 'sel' : ''} ${route && !inRoute ? 'dim' : ''}`, onClick: () => setSel(a.id), style: { cursor: 'pointer' } },
                            react_1.default.createElement("polygon", { points: `${p.x - w * 1.9},${p.y - hgt} ${p.x},${p.y - hgt + 26} ${p.x},${p.y + 26} ${p.x - w * 1.9},${p.y}`, fill: un ? '#1a2f55' : '#131c2e' }),
                            react_1.default.createElement("polygon", { points: `${p.x + w * 1.9},${p.y - hgt} ${p.x},${p.y - hgt + 26} ${p.x},${p.y + 26} ${p.x + w * 1.9},${p.y}`, fill: un ? '#10203f' : '#0e1524' }),
                            react_1.default.createElement("polygon", { points: top, fill: a.id === curArea ? 'url(#topOn)' : un ? 'url(#top)' : '#1a2130', stroke: isB ? '#ff5d73' : sel === a.id ? '#39d5ff' : '#3c5c90', strokeWidth: isB || sel === a.id ? 3 : 1, filter: isB ? 'url(#glow)' : undefined }),
                            react_1.default.createElement("text", { x: p.x, y: p.y - hgt + 4, textAnchor: "middle", className: "zl2" },
                                a.id,
                                ". ",
                                a.n.length > 9 ? a.n.slice(0, 8) + '…' : a.n),
                            !un && react_1.default.createElement("text", { x: p.x, y: p.y - hgt + 22, textAnchor: "middle", className: "lock" }, "\uD83D\uDD12"),
                            un && st.length > 0 && react_1.default.createElement("text", { x: p.x, y: p.y - hgt + 20, textAnchor: "middle", className: `ld ${load > 1 ? 'hot' : ''}` },
                                "\u8CA0\u8377 ",
                                (load * 100).toFixed(0),
                                "%"),
                            a.id === curArea && react_1.default.createElement("text", { x: p.x, y: p.y - hgt - 30, textAnchor: "middle", className: "mission-pin" }, "\u25BC \u76EE\u524D\u4EFB\u52D9")));
                    }),
                    react_1.default.createElement("polyline", { points: pts, className: "flowline" }))),
            react_1.default.createElement("div", { className: "zone-list" }, exports.AREAS.map((a) => react_1.default.createElement("button", { key: a.id, className: `opt sm ${sel === a.id ? 'on' : ''}`, onClick: () => setSel(a.id) },
                a.id === curArea ? '▼ ' : '',
                a.id,
                ". ",
                a.n,
                areaUnlocked(g, a.id) ? '' : ' 🔒'))),
            react_1.default.createElement(common_1.Legend, { items: [{ name: '目前任務區', color: '#ff9a3c' }, { name: '瓶頸站（紅框）', color: '#ff5d73' }, { name: '物料／WIP 流向', color: '#39d5ff' }] })),
        A && (react_1.default.createElement(common_1.Card, { title: `${A.id}. ${A.n}`, right: react_1.default.createElement("button", { className: "x", "aria-label": "\u95DC\u9589", onClick: () => setSel(null) }, "\u2715"), className: "zone-panel" },
            react_1.default.createElement("p", null, A.d),
            !areaUnlocked(g, A.id) && react_1.default.createElement("div", { className: "warnbox" }, "\u96A8\u8077\u6DAF\u9032\u5EA6\u89E3\u9396\u3002"),
            sim.stations.filter((s) => A.st.includes(s.id)).map((s) => (react_1.default.createElement("div", { key: s.id, className: "metric-list" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null,
                        sim_1.STATION_INFO[s.id].name,
                        "\uFF08",
                        sim_1.STATION_INFO[s.id].en,
                        "\uFF09"),
                    react_1.default.createElement("b", null, s.id === sim.bottleneck ? '🔴 瓶頸' : '')),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u8CA0\u8377\u7387"),
                    react_1.default.createElement("b", { className: s.load > 1 ? 'red' : '' }, sim_1.fmt.pct(s.load, 0))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "OEE\uFF08A\u00D7P\u00D7Q\uFF09"),
                    react_1.default.createElement("b", null,
                        sim_1.fmt.pct(s.avail, 0),
                        " \u00D7 ",
                        sim_1.fmt.pct(s.perf, 0),
                        " \u00D7 ",
                        sim_1.fmt.pct(s.qual, 1),
                        " \uFF1D ",
                        sim_1.fmt.pct(s.oee))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u9031\u671F\u6642\u9593\uFF08\u6BCF\u9846\uFF09"),
                    react_1.default.createElement("b", null,
                        s.ctSec.toFixed(2),
                        " \u79D2")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u6A5F\u53F0\u6578"),
                    react_1.default.createElement("b", null, g.factory.stations[s.id].machines))))),
            react_1.default.createElement("p", { className: "small muted" },
                "\u7D93\u904E\u6B64\u5340\u7684\u7522\u54C1\uFF1A",
                Object.keys(sim_1.PRODUCTS).filter((p) => ROUTE_AREAS[p].includes(A.id)).map((p) => sim_1.PRODUCTS[p].name).join('、') || '—（管理／支援單位）'),
            react_1.default.createElement("div", { className: "row wrap" },
                data_1.CHAPTERS.filter((c) => c.area === A.id && c.id < data_1.FINAL_ID).map((c) => react_1.default.createElement(common_1.Btn, { key: c.id, small: true, kind: c.id === cur ? 'primary' : undefined, disabled: !(0, state_1.chapterUnlocked)(g, c.id) && !g.done[c.id], onClick: () => go('mission', c.id) },
                    c.code,
                    "\uFF5C",
                    c.title,
                    g.done[c.id]?.tries ? ` ✔${g.done[c.id].best}` : '')),
                A.id === 12 && react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(common_1.Btn, { small: true, onClick: () => go('ai') }, "AI \u7814\u767C\u5BA4"),
                    react_1.default.createElement(common_1.Btn, { small: true, onClick: () => go('cim') }, "CIM \u63A7\u5236\u4E2D\u5FC3")),
                A.id === 11 && react_1.default.createElement(common_1.Btn, { small: true, onClick: () => go('dash') }, "\u5DE5\u5EE0\u5100\u8868\u677F"))))));
}
function Dashboard() {
    const { g } = (0, common_1.useG)();
    const r = (0, react_1.useMemo)(() => (0, sim_1.simulateWeek)(g.factory, g.seed + g.week), [g.factory, g.week]);
    const h = g.history;
    const costData = Object.entries(r.costs).map(([k, v]) => ({ label: sim_1.COST_LABELS[k].slice(0, 2), v: v / 1e4, color: '#39d5ff' }));
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "row between wrap" },
            react_1.default.createElement("h2", null,
                "\u5DE5\u5EE0\u6578\u64DA\u5100\u8868\u677F\u30FB\u7B2C ",
                g.week,
                " \u9031"),
            react_1.default.createElement(common_1.SimTag, null)),
        react_1.default.createElement("div", { className: "kpi-grid" },
            react_1.default.createElement(common_1.Kpi, { label: "\u7522\u51FA\u91CF Throughput", value: sim_1.fmt.n(r.goodTotal), sub: `需求 ${sim_1.fmt.n(r.demandTotal)}` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u826F\u7387 Yield", value: sim_1.fmt.pct(r.yieldPct) }),
            react_1.default.createElement(common_1.Kpi, { label: "\u4E00\u6B21\u76F4\u901A\u826F\u7387 RTY", value: sim_1.fmt.pct(r.rty), sub: "\u5404\u7AD9 FPY \u4E58\u7A4D" }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5168\u7DDA OEE", value: sim_1.fmt.pct(r.oee), good: r.oee > 0.8 ? true : null }),
            react_1.default.createElement(common_1.Kpi, { label: "\u53EF\u7528\u7387\uFF08\u74F6\u9838\u7AD9\uFF09", value: sim_1.fmt.pct(r.stations.find((s) => s.id === r.bottleneck).avail) }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5229\u7528\u7387\uFF08\u74F6\u9838\u7AD9\uFF09", value: sim_1.fmt.pct(r.stations.find((s) => s.id === r.bottleneck).util) }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5728\u88FD\u54C1 WIP", value: sim_1.fmt.n(r.wip), sub: "\u9846" }),
            react_1.default.createElement(common_1.Kpi, { label: "\u74F6\u9838\u9031\u671F\u6642\u9593", value: `${r.stations.find((s) => s.id === r.bottleneck).ctSec.toFixed(2)} s` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u88FD\u9020\u524D\u7F6E\u6642\u9593", value: `${r.leadDays.toFixed(2)} 天`, sub: `Little：${sim_1.fmt.n(r.wip)} ÷ ${sim_1.fmt.n(r.throughputRate)}/h` }),
            react_1.default.createElement(common_1.Kpi, { label: "OTIF", value: sim_1.fmt.pct(r.otif), good: r.otif >= 0.95 ? true : r.otif < 0.85 ? false : null }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5BA2\u6236 PPM", value: r.ppm.toFixed(0), good: r.ppm <= 150 ? true : r.ppm > 400 ? false : null }),
            react_1.default.createElement(common_1.Kpi, { label: "\u55AE\u4F4D\u826F\u54C1\u6210\u672C", value: `NT$${r.costPerGood.toFixed(2)}` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5B58\u8CA8\u6301\u6709\u6210\u672C", value: sim_1.fmt.nt(r.costs.holding), sub: "\u6BCF\u9031" }),
            react_1.default.createElement(common_1.Kpi, { label: "\u55AE\u4F4D\u80FD\u8017", value: `${r.energyPerUnit.toFixed(3)} kWh` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u505C\u6A5F\u6642\u9593", value: `${r.downtimeH.toFixed(0)} h`, sub: "\u5404\u7AD9\u5408\u8A08" }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5B89\u5168\u6307\u6578\uFF0F\u75B2\u52DE", value: `${r.safety.toFixed(0)}／${r.fatigue.toFixed(0)}`, good: r.safety >= 80 ? true : r.safety < 60 ? false : null }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5BA2\u6236\u6EFF\u610F\u5EA6", value: r.satisfaction.toFixed(0) }),
            react_1.default.createElement(common_1.Kpi, { label: "\u4F01\u696D\u4FE1\u4EFB\u8207\u8072\u8B7D", value: g.brand.toFixed(0) })),
        react_1.default.createElement("div", { className: "grid2" },
            react_1.default.createElement(common_1.Card, { title: "\u5404\u7AD9\u8CA0\u8377\u8207 OEE" },
                react_1.default.createElement(common_1.Bars, { data: r.stations.map((s) => ({ label: sim_1.STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.id === r.bottleneck ? '#ff5d73' : '#39d5ff' })), line: 1, lineLabel: "\u7522\u80FD 100%", fmtv: (v) => `${(v * 100).toFixed(0)}%` }),
                react_1.default.createElement("div", { className: "tbl-wrap" },
                    react_1.default.createElement("table", { className: "tbl sm" },
                        react_1.default.createElement("thead", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("th", null, "\u7AD9\u5225"),
                                react_1.default.createElement("th", null, "A"),
                                react_1.default.createElement("th", null, "P"),
                                react_1.default.createElement("th", null, "Q"),
                                react_1.default.createElement("th", null, "OEE"),
                                react_1.default.createElement("th", null, "kWh"))),
                        react_1.default.createElement("tbody", null, r.stations.map((s) => react_1.default.createElement("tr", { key: s.id, className: s.id === r.bottleneck ? 'ng' : '' },
                            react_1.default.createElement("td", null, sim_1.STATION_INFO[s.id].name),
                            react_1.default.createElement("td", null, sim_1.fmt.pct(s.avail, 0)),
                            react_1.default.createElement("td", null, sim_1.fmt.pct(s.perf, 0)),
                            react_1.default.createElement("td", null, sim_1.fmt.pct(s.qual, 1)),
                            react_1.default.createElement("td", null, sim_1.fmt.pct(s.oee)),
                            react_1.default.createElement("td", null, sim_1.fmt.n(s.kWh)))))))),
            react_1.default.createElement(common_1.Card, { title: `每週成本結構（合計 ${sim_1.fmt.wan(r.totalCost)}）` },
                react_1.default.createElement(common_1.Bars, { data: costData, fmtv: (v) => v.toFixed(0), h: 200 }),
                react_1.default.createElement("p", { className: "small muted center" },
                    "\u55AE\u4F4D\uFF1A\u842C\u5143\u30FB",
                    Object.entries(sim_1.COST_LABELS).map(([k, v]) => v).join('／')))),
        h.length > 1 && react_1.default.createElement(common_1.Card, { title: "KPI \u8DA8\u52E2\uFF08\u6BCF\u6B21\u4EFB\u52D9\uFF0F\u4E8B\u4EF6\u5F8C\uFF09" },
            react_1.default.createElement(common_1.Legend, { items: [{ name: 'OEE', color: '#39d5ff' }, { name: 'OTIF', color: '#7cf29c' }, { name: '良率', color: '#ffd23f' }] }),
            react_1.default.createElement(common_1.Lines, { labels: h.map((x) => `W${x.week}`), series: [{ name: 'OEE', color: '#39d5ff', values: h.map((x) => x.oee * 100) }, { name: 'OTIF', color: '#7cf29c', values: h.map((x) => x.otif * 100) }, { name: '良率', color: '#ffd23f', values: h.map((x) => x.yieldPct * 100) }], fmtv: (v) => `${v.toFixed(0)}%` }),
            react_1.default.createElement(common_1.Lines, { labels: h.map((x) => `W${x.week}`), series: [{ name: '單位成本', color: '#ff9a3c', values: h.map((x) => x.cost) }], fmtv: (v) => `$${v.toFixed(1)}`, h: 150 })),
        react_1.default.createElement(common_1.Card, { title: "\u8A08\u7B97\u898F\u5247\u8AAA\u660E" },
            react_1.default.createElement("ul", { className: "small" },
                react_1.default.createElement("li", null, "OEE \uFF1D \u53EF\u7528\u7387 \u00D7 \u6548\u80FD \u00D7 \u54C1\u8CEA\uFF1B\u5168\u7DDA OEE \u4EE5\u5404\u7AD9\u904B\u8F49\u6642\u6578\u52A0\u6B0A\u3002"),
                react_1.default.createElement("li", null, "RTY \uFF1D \u5404\u7AD9 FPY \u7684\u4E58\u7A4D\uFF1B\u5404\u7AD9\u5148\u4F9D\u53EF\u7528\u5DE5\u6642\u8207\u7522\u80FD\u8A08\u7B97\u8655\u7406\u91CF\uFF0C\u518D\u6263\u5831\u5EE2\u3001\u91CD\u5DE5\u54C1\u56DE\u6D41\uFF0C\u4E0D\u91CD\u8907\u5957\u7528\u54C1\u8CEA\u4FC2\u6578\u3002"),
                react_1.default.createElement("li", null, "\u7522\u51FA\u53D7\u74F6\u9838\u7522\u80FD\u3001\u4E0A\u6E38\u4F9B\u6599\u3001\u505C\u6A5F\u8207\u88FD\u7A0B\u9806\u5E8F\u9650\u5236\uFF1B\u6539\u5584\u975E\u74F6\u9838\u4E0D\u6703\u8B93\u7522\u51FA\u7121\u689D\u4EF6\u589E\u52A0\u3002"),
                react_1.default.createElement("li", null, "WIP \uFF1D \u7522\u51FA\u7387 \u00D7 \u6D41\u7A0B\u6642\u9593\uFF08Little's Law\uFF09\uFF1BCAPEX \u4EE5 260 \u9031\u6298\u820A\uFF0COPEX \u6BCF\u9031\u8A08\u5165\u3002")))));
}
function CareerView() {
    const { g, set, sfx, toast } = (0, common_1.useG)();
    const next = g.pos + 1;
    const pc = (0, state_1.promotionCheck)(g, next);
    const [msg, setMsg] = (0, react_1.useState)('');
    const promote = () => {
        if (!pc.ok)
            return;
        set((g0) => ({ ...g0, pos: next, posHistory: [...g0.posHistory, { pos: next, week: g0.week }], freePts: g0.freePts + 2, journal: [...g0.journal, { week: g0.week, title: `晉升：${data_1.CAREERS[next].title}`, text: '通過技能、認證與專案實績審查。' }] }));
        sfx('level');
        toast(`🎉 晉升為 ${data_1.CAREERS[next].title}`);
    };
    const train = (b) => {
        set((g0) => ({ ...g0, skills: { ...g0.skills, [b]: Math.min(100, g0.skills[b] + (g0.mode === 'engineer' ? 4 : 5)) }, week: g0.week + 2, journal: [...g0.journal, { week: g0.week, title: `進修：${data_1.BRANCHES[b].name}`, text: '完成兩週在職訓練課程。' }] }));
        setMsg(`完成 ${data_1.BRANCHES[b].name} 進修（耗時 2 週）`);
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "grid-career" },
            react_1.default.createElement(common_1.Card, { title: "\u4E3B\u89D2\u500B\u4EBA\u4E2D\u5FC3" },
                react_1.default.createElement("div", { className: "row" },
                    react_1.default.createElement(common_1.PlayerFace, { size: 96 }),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("h2", null, g.player.name),
                        react_1.default.createElement("div", { className: "pos" }, data_1.CAREERS[g.pos].title),
                        react_1.default.createElement("small", { className: "muted" }, data_1.CAREERS[g.pos].en),
                        react_1.default.createElement("div", { className: "small" },
                            "\u5E74\u8CC7 ",
                            (g.week / 52).toFixed(1),
                            " \u5E74\uFF08\u7B2C ",
                            g.week,
                            " \u9031\uFF09\u30FB",
                            state_1.EDU[g.player.edu].label,
                            "\u30FB\u5C08\u9577 ",
                            state_1.TALENT[g.player.talent].label,
                            "\u30FB\u5FD7\u5411 ",
                            state_1.ASPIRE[g.player.aspiration].label),
                        react_1.default.createElement("div", { className: "small" },
                            "\u5C08\u6848\u7D93\u8CBB ",
                            sim_1.fmt.nt(g.funds),
                            "\u30FB\u8072\u8B7D ",
                            g.brand,
                            "\u30FB\u5E73\u5747\u4EFB\u52D9\u5206\u6578 ",
                            Object.values(g.done).length ? (Object.values(g.done).reduce((a, b) => a + b.best, 0) / Object.values(g.done).length).toFixed(0) : '—')))),
            react_1.default.createElement(common_1.Card, { title: `升遷條件：${data_1.CAREERS[next]?.title || '已達最高職位'}` }, data_1.CAREERS[next] ? react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("ul", { className: "req" }, pc.items.map((i) => react_1.default.createElement("li", { key: i.label, className: i.ok ? 'ok' : 'ng' },
                    i.ok ? '✅' : '⬜',
                    " ",
                    i.label))),
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !pc.ok, onClick: promote }, "\u7533\u8ACB\u5347\u9077\u5BE9\u67E5"),
                react_1.default.createElement("p", { className: "small muted" }, "\u55AE\u7D14\u7D2F\u7A4D\u5E74\u8CC7\u4E0D\u6703\u81EA\u52D5\u5347\u8077\uFF1B\u9700\u6280\u80FD\u3001\u8A8D\u8B49\u3001\u4EFB\u52D9\u7E3E\u6548\u8207\u540C\u4E8B\u4FE1\u4EFB\u3002")) : react_1.default.createElement("p", null, "\u4F60\u5DF2\u6210\u70BA\u7CFB\u7D71\u7D1A\u5DE5\u7A0B\u5E2B\u3002"))),
        react_1.default.createElement(common_1.Card, { title: "\u6280\u80FD\u6A39\uFF080\uFF5E100\uFF09", right: g.freePts > 0 ? react_1.default.createElement(common_1.Tag, { color: "var(--orange)" },
                "\u53EF\u5206\u914D\u6280\u80FD\u9EDE ",
                g.freePts) : null },
            react_1.default.createElement("div", { className: "skills" }, Object.keys(data_1.BRANCHES).map((b) => (react_1.default.createElement("div", { key: b, className: "skill" },
                react_1.default.createElement("div", { className: "row between" },
                    react_1.default.createElement("b", { style: { color: data_1.BRANCHES[b].color } }, data_1.BRANCHES[b].name),
                    react_1.default.createElement("span", null, g.skills[b])),
                react_1.default.createElement(common_1.Meter, { v: g.skills[b], max: 100, color: data_1.BRANCHES[b].color }),
                react_1.default.createElement("small", { className: "muted" }, data_1.BRANCHES[b].items),
                react_1.default.createElement("div", { className: "row sm" },
                    g.freePts > 0 && react_1.default.createElement(common_1.Btn, { small: true, onClick: () => set((g0) => ({ ...g0, freePts: g0.freePts - 1, skills: { ...g0.skills, [b]: Math.min(100, g0.skills[b] + 3) } })) }, "\uFF0B3\uFF08\u7528\u6280\u80FD\u9EDE\uFF09"),
                    g.mode !== 'sandbox' && react_1.default.createElement(common_1.Btn, { small: true, onClick: () => train(b) }, "\u9032\u4FEE 2 \u9031")))))),
            msg && react_1.default.createElement("div", { className: "goodbox" }, msg)),
        react_1.default.createElement("div", { className: "grid2" },
            react_1.default.createElement(common_1.Card, { title: "\u8DE8\u90E8\u9580\u4FE1\u4EFB" },
                Object.keys(data_1.DEPTS).map((d) => react_1.default.createElement("div", { key: d, className: "row trust-row" },
                    react_1.default.createElement("div", { style: { flex: 1 } },
                        react_1.default.createElement(common_1.Meter, { label: data_1.DEPTS[d], right: `${g.trust[d]}`, v: Math.max(0, g.trust[d]), max: 100, color: g.trust[d] < 0 ? 'var(--red)' : 'var(--purple)' })),
                    g.mode !== 'sandbox' && react_1.default.createElement(common_1.Btn, { small: true, title: "\u82B1 2 \u9031\u5354\u52A9\u8A72\u90E8\u9580\u5C08\u6848\uFF0C\u4FE1\u4EFB +4", onClick: () => { set((g0) => ({ ...g0, week: g0.week + 2, trust: { ...g0.trust, [d]: Math.min(100, g0.trust[d] + 4) }, journal: [...g0.journal, { week: g0.week, title: `跨部門支援：${data_1.DEPTS[d]}`, text: '協助對方完成改善專案兩週。' }] })); setMsg(`完成 ${data_1.DEPTS[d]} 跨部門支援（耗時 2 週，信任 +4）`); } }, "\u652F\u63F4 2 \u9031"))),
                react_1.default.createElement("p", { className: "small muted" }, "\u8DE8\u90E8\u9580\u652F\u63F4\u8207\u9032\u4FEE\u90FD\u6703\u82B1\u8CBB\u6642\u9593\uFF08\u9031\u6578\uFF09\uFF0C\u4F46\u80FD\u88DC\u8DB3\u5347\u9077\u689D\u4EF6\u3002")),
            react_1.default.createElement(common_1.Card, { title: "\u8A8D\u8B49\u8207\u6210\u5C31" },
                react_1.default.createElement("div", { className: "chips" },
                    g.certs.map((c) => react_1.default.createElement(common_1.Tag, { key: c, color: "var(--green)" },
                        "\uD83C\uDF93 ",
                        c)),
                    !g.certs.length && react_1.default.createElement("span", { className: "muted" }, "\u5C1A\u7121\u8A8D\u8B49")),
                react_1.default.createElement("h4", null, "\u6210\u5C31\u5FBD\u7AE0"),
                react_1.default.createElement("div", { className: "badges" }, Object.entries(data_1.ACHIEVEMENTS).map(([k, a]) => react_1.default.createElement("div", { key: k, className: `badge ${g.achievements.includes(k) ? 'on' : ''}`, title: a.desc },
                    react_1.default.createElement("span", null, g.achievements.includes(k) ? '🏅' : '🔒'),
                    react_1.default.createElement("b", null, a.name),
                    react_1.default.createElement("small", null, a.desc)))))),
        react_1.default.createElement(common_1.Card, { title: "\u8077\u6DAF\u6B77\u7A0B\u8207\u5DE5\u4F5C\u65E5\u8A8C" },
            react_1.default.createElement("div", { className: "timeline" }, g.posHistory.map((p, i) => react_1.default.createElement("div", { key: i, className: "tl" },
                react_1.default.createElement("b", null,
                    "W",
                    p.week),
                " ",
                data_1.CAREERS[p.pos].title))),
            react_1.default.createElement("div", { className: "tbl-wrap" },
                react_1.default.createElement("table", { className: "tbl sm" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "\u7AE0\u7BC0"),
                            react_1.default.createElement("th", null, "\u6700\u4F73\u5206\u6578"),
                            react_1.default.createElement("th", null, "\u5617\u8A66"))),
                    react_1.default.createElement("tbody", null, data_1.CHAPTERS.filter((c) => g.done[c.id]?.tries).map((c) => react_1.default.createElement("tr", { key: c.id },
                        react_1.default.createElement("td", null,
                            c.code,
                            " ",
                            c.title),
                        react_1.default.createElement("td", null, g.done[c.id].best),
                        react_1.default.createElement("td", null, g.done[c.id].tries)))))),
            react_1.default.createElement("ul", { className: "journal" }, [...g.journal].reverse().slice(0, 30).map((j, i) => react_1.default.createElement("li", { key: i },
                react_1.default.createElement("b", null,
                    "W",
                    j.week,
                    "\uFF5C",
                    j.title),
                react_1.default.createElement("br", null),
                react_1.default.createElement("small", null, j.text)))))));
}
function CodexView() {
    const { g } = (0, common_1.useG)();
    const [q, setQ] = (0, react_1.useState)('');
    const [cat, setCat] = (0, react_1.useState)('全部');
    const [tab, setTab] = (0, react_1.useState)('terms');
    const cats = ['全部', ...Array.from(new Set(data_1.CODEX.map((c) => c.cat)))];
    const list = data_1.CODEX.filter((c) => (cat === '全部' || c.cat === cat) && (`${c.zh}${c.en}${c.abbr || ''}${c.def}`.toLowerCase().includes(q.toLowerCase())));
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "tabs" }, [['terms', '工程術語'], ['patents', '專利知識卡'], ['npc', '人物誌'], ['sources', '資料來源聲明']].map(([k, n]) => react_1.default.createElement("button", { key: k, className: tab === k ? 'on' : '', onClick: () => setTab(k) }, n))),
        tab === 'terms' && react_1.default.createElement(common_1.Card, { title: `工業工程百科（已解鎖 ${g.unlockedCodex.length}／${data_1.CODEX.length}）` },
            react_1.default.createElement("div", { className: "row wrap" },
                react_1.default.createElement("input", { className: "search", placeholder: "\u641C\u5C0B\uFF1AOEE\u3001\u7BC0\u62CD\u3001RAG\u2026", value: q, onChange: (e) => setQ(e.target.value) }),
                cats.map((c) => react_1.default.createElement("button", { key: c, className: `opt sm ${cat === c ? 'on' : ''}`, onClick: () => setCat(c) }, c))),
            react_1.default.createElement("div", { className: "codex" }, list.map((c) => {
                const un = g.unlockedCodex.includes(c.id);
                return (react_1.default.createElement("div", { key: c.id, className: `term ${un ? '' : 'locked'}` },
                    react_1.default.createElement("div", { className: "row between" },
                        react_1.default.createElement("b", null, c.zh),
                        react_1.default.createElement(common_1.Tag, null, c.cat)),
                    react_1.default.createElement("small", { className: "en" },
                        c.en,
                        c.abbr ? `, ${c.abbr}` : ''),
                    react_1.default.createElement("p", null, un ? c.def : '🔒 隨章節進度解鎖')));
            }))),
        tab === 'patents' && react_1.default.createElement("div", { className: "grid2" }, data_1.PATENTS.map((p) => (react_1.default.createElement(common_1.Card, { key: p.id, title: react_1.default.createElement(react_1.default.Fragment, null,
                p.no,
                "\uFF5C",
                p.title), right: react_1.default.createElement(common_1.Tag, null, p.kind) },
            react_1.default.createElement("div", { className: "pat-c" },
                react_1.default.createElement("h5", null, "\u2705 \u5DF2\u78BA\u8A8D\u7684\u516C\u958B\u5C08\u5229\u5167\u5BB9"),
                react_1.default.createElement("ul", null, p.confirmed.map((x) => react_1.default.createElement("li", { key: x }, x)))),
            react_1.default.createElement("div", { className: "pat-i" },
                react_1.default.createElement("h5", null, "\uD83D\uDCAD \u70BA\u904A\u6232\u6559\u5B78\u8A2D\u8A08\u7684\u5DE5\u7A0B\u61C9\u7528\u63A8\u8AD6"),
                react_1.default.createElement("ul", null, p.inference.map((x) => react_1.default.createElement("li", { key: x }, x)))),
            react_1.default.createElement("div", { className: "metric-list" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u76F8\u95DC\u88FD\u7A0B"),
                    react_1.default.createElement("b", null, p.process)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5DE5\u7A0B\u554F\u984C"),
                    react_1.default.createElement("b", null, p.problem)),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u53EF\u5EF6\u4F38 AI \u984C\u76EE"),
                    react_1.default.createElement("b", null, p.ai))),
            react_1.default.createElement("p", { className: "small" },
                "\u516C\u958B\u4F86\u6E90\uFF1A",
                react_1.default.createElement("a", { href: p.url, target: "_blank", rel: "noreferrer" }, p.url)),
            react_1.default.createElement("p", { className: "small muted" }, "\u5C08\u5229\u4FDD\u8B77\u7279\u5B9A\u7D50\u69CB\u3001\u65B9\u6CD5\u6216\u88DD\u7F6E\uFF1B\u4E0D\u4EE3\u8868\u6574\u9053\u4E00\u822C\u88FD\u7A0B\u5C6C\u65BC\u8A72\u5C08\u5229\uFF0C\u4EA6\u4E0D\u4EE3\u8868\u516C\u53F8\u5167\u90E8\u4F7F\u7528\u4EFB\u4F55\u7279\u5B9A\u672A\u516C\u958B\u53C3\u6578\u3002"))))),
        tab === 'npc' && react_1.default.createElement("div", { className: "grid3" }, Object.values(data_1.NPCS).map((n) => react_1.default.createElement(common_1.Card, { key: n.id },
            react_1.default.createElement("div", { className: "row" },
                react_1.default.createElement(common_1.NpcFace, { id: n.id, size: 64 }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("b", null, n.name),
                    react_1.default.createElement("div", { className: "small" }, n.role))),
            react_1.default.createElement("p", { className: "small" }, n.stance),
            react_1.default.createElement("small", { className: "muted" }, "\u865B\u69CB\u4EBA\u7269")))),
        tab === 'sources' && react_1.default.createElement(common_1.Card, { title: "\u8CC7\u6599\u4F86\u6E90\u8207\u865B\u69CB\u8072\u660E" },
            react_1.default.createElement(Sources, null))));
}
function Sources() {
    return (react_1.default.createElement("div", { className: "small" },
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "\u516C\u958B\u4E8B\u5BE6"),
            "\uFF1A\u7522\u696D\u80CC\u666F\u53C3\u8003\u4E16\u5FB7\u5DE5\u696D\u516C\u958B\u7684\u4F01\u696D\u8CC7\u8A0A\u3001\u88FD\u9020\u80FD\u529B\u3001\u7522\u54C1\u5206\u985E\u8207\u516C\u958B\u5C08\u5229\uFF08\u5C08\u5229\u865F\u8207\u540D\u7A31\uFF09\u3002\u4E16\u5FB7\u5DE5\u696D\u70BA\u53F0\u7063\u6263\u4EF6\u8207\u7CBE\u5BC6\u91D1\u5C6C\u96F6\u4EF6\u4F01\u696D\u3002"),
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: "https://www.sumeeko.com/capability/", target: "_blank", rel: "noreferrer" }, "\u4E16\u5FB7\u5DE5\u696D\u5B98\u65B9\u88FD\u9020\u80FD\u529B"),
                "\u30FB",
                react_1.default.createElement("a", { href: "https://www.sumeeko.com/production/", target: "_blank", rel: "noreferrer" }, "\u7522\u54C1\u5206\u985E"),
                "\u30FB",
                react_1.default.createElement("a", { href: "https://www.sumeeko.com/history", target: "_blank", rel: "noreferrer" }, "\u4F01\u696D\u6CBF\u9769")),
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: "https://www.104.com.tw/company/acvsce8", target: "_blank", rel: "noreferrer" }, "\u4E16\u5FB7\u516C\u958B\u8077\u7F3A\u8CC7\u8A0A\uFF08104\uFF09")),
            data_1.PATENTS.map((p) => react_1.default.createElement("li", { key: p.id },
                react_1.default.createElement("a", { href: p.url, target: "_blank", rel: "noreferrer" },
                    p.no,
                    " ",
                    p.title)))),
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "\u865B\u69CB\u6A21\u64EC"),
            "\uFF1A\u4E3B\u89D2\u3001NPC\u3001\u5167\u90E8\u5236\u5EA6\u3001\u85AA\u8CC7\u3001\u7522\u80FD\u3001\u5DE5\u5EE0\u6578\u64DA\u3001\u6210\u672C\u3001\u4E8B\u4EF6\u3001\u5BA2\u6236\uFF08\u300CA \u8ECA\u5EE0\u300D\u300CB \u7CFB\u7D71\u4F9B\u61C9\u5546\u300D\uFF09\u3001\u5167\u90E8\u6587\u4EF6\u540D\u7A31\u8207\u6240\u6709\u6C7A\u7B56\u7D50\u679C\u7686\u70BA\u6559\u80B2\u7528\u9014\u4E4B\u865B\u69CB\u8A2D\u5B9A\uFF0C\u6A19\u793A\u300C\u904A\u6232\u6A21\u64EC\u8CC7\u6599\u300D\u8005\u4E0D\u4EE3\u8868\u4E16\u5FB7\u5BE6\u969B\u5DE5\u5EE0\u6216\u8CA1\u52D9\u6578\u64DA\u3002"),
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "\u5DE5\u7A0B\u539F\u7406"),
            "\uFF1AOEE\u3001RTY\u3001Little's Law\u3001SPC\u3001MRP\u3001TCO \u7B49\u70BA\u901A\u7528\u5DE5\u7A0B\u65B9\u6CD5\uFF1B\u904A\u6232\u53C3\u6578\u7D93\u7C21\u5316\uFF0C\u4E0D\u53EF\u76F4\u63A5\u5957\u7528\u81F3\u5BE6\u969B\u8A2D\u5099\u3002"),
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "AI \u529F\u80FD"),
            "\uFF1A\u6240\u6709 AI \u5747\u70BA\u898F\u5247\u5F0F\u300C\u6559\u5B78\u6A21\u64EC\u300D\uFF0C\u672A\u57F7\u884C\u771F\u5BE6\u6A21\u578B\u8A13\u7DF4\uFF1B\u904A\u6232\u4E0D\u9023\u63A5\u3001\u4E0D\u64CD\u4F5C\u4EFB\u4F55\u771F\u5BE6\u5DE5\u5EE0\u6216\u4F01\u696D\u7CFB\u7D71\uFF0C\u4E0D\u4F7F\u7528\u5916\u90E8\u4ED8\u8CBB API\u3002"),
        react_1.default.createElement("p", null,
            react_1.default.createElement("b", null, "\u7D20\u6750"),
            "\uFF1A\u6240\u6709\u4EBA\u7269\u3001\u5716\u793A\u8207\u5834\u666F\u7686\u70BA\u539F\u5275 SVG\uFF0C\u4E0D\u4F7F\u7528\u4F01\u696D\u54C1\u724C\u5716\u50CF\u6216\u5C08\u6709\u7167\u7247\u3002")));
}
function AIView() {
    return react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "AI \u7814\u767C\u5BA4"),
        react_1.default.createElement(ai_1.AILab, { onDone: () => { } }));
}
function CIMView() {
    const { g, go } = (0, common_1.useG)();
    const [twin, setTwin] = (0, react_1.useState)(false);
    const unlocked = g.cimDone || g.mode === 'sandbox';
    const r = (0, react_1.useMemo)(() => (0, sim_1.simulateWeek)(g.factory, g.seed + g.week), [g.factory, g.week]);
    const sys = [['設備與感測器', 'PLC／IoT／SCADA', 'MES', 'QMS', 'WMS', 'ERP', 'APS', 'AI 分析', '數位孿生']];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("h2", null, "IE\uFF0FCIM \u667A\u6167\u63A7\u5236\u4E2D\u5FC3"),
        react_1.default.createElement(common_1.Card, { title: "\u6574\u5EE0\u8CC7\u8A0A\u62D3\u6A38" },
            react_1.default.createElement("div", { className: "flowchips" }, sys[0].map((s, i) => react_1.default.createElement(react_1.default.Fragment, { key: s },
                react_1.default.createElement("span", { className: `fc ${unlocked ? 'on' : ''}` }, s),
                i < sys[0].length - 1 && react_1.default.createElement("i", null, "\u2192")))),
            react_1.default.createElement("p", { className: "small" },
                "\u53E6\u542B CMMS\uFF08\u8A2D\u5099\u7DAD\u8B77\uFF09\u3001\u751F\u7522\u5C65\u6B77\u8207 OT\uFF0FIT \u8CC7\u5B89\u5206\u5340\u3002\u8CC7\u6599\u4E00\u81F4\u6027\uFF1A",
                react_1.default.createElement("b", null, sim_1.fmt.pct(g.factory.dataQuality, 0)),
                "\u30FB\u76EE\u524D\u74F6\u9838\uFF1A",
                react_1.default.createElement("b", { className: "red" }, sim_1.STATION_INFO[r.bottleneck].name),
                "\u30FB\u672C\u9031\u55AE\u4F4D\u6210\u672C NT$",
                r.costPerGood.toFixed(2)),
            !unlocked && react_1.default.createElement("div", { className: "warnbox" }, "\u5B8C\u6210\u7B2C\u5341\u4E8C\u7AE0\u5F8C\u5B8C\u6574\u89E3\u9396\u3002")),
        react_1.default.createElement("div", { className: "row wrap" },
            react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !unlocked, onClick: () => setTwin(!twin) }, twin ? '收起數位孿生沙盒' : '開啟數位孿生沙盒（自由模擬）'),
            react_1.default.createElement(common_1.Btn, { disabled: !(g.mode === 'sandbox' || (0, state_1.chapterUnlocked)(g, data_1.FINAL_ID)), onClick: () => go('mission', data_1.FINAL_ID) }, "\u9032\u5165\u7D42\u5C40\uFF1A\u9CF3\u51F0\u8A08\u756B"),
            g.final && react_1.default.createElement(common_1.Btn, { onClick: () => go('report') }, "\u67E5\u770B\u6539\u5584\u6210\u679C\u5831\u544A")),
        twin && react_1.default.createElement(cim_1.PhoenixGame, { sandbox: true, onDone: () => { } })));
}
function runSelfTests() {
    const out = [];
    const b = (0, sim_1.simulateWeek)((0, sim_1.baseFactory)(), 1);
    out.push({ name: '初始瓶頸為搓牙站', ok: b.bottleneck === 'thread', detail: sim_1.STATION_INFO[b.bottleneck].name });
    const opt = (0, sim_1.simulateWeek)((0, sim_1.applyEffect)((0, sim_1.baseFactory)(), { st: { optical: { machines: 1 } } }), 1);
    out.push({ name: '只改善光學（非瓶頸）產出幾乎不變', ok: Math.abs(opt.goodTotal - b.goodTotal) / b.goodTotal < 0.01, detail: `${sim_1.fmt.n(b.goodTotal)} → ${sim_1.fmt.n(opt.goodTotal)}` });
    const th = (0, sim_1.simulateWeek)((0, sim_1.applyEffect)((0, sim_1.baseFactory)(), { st: { thread: { machines: 1 } } }), 1);
    out.push({ name: '擴充瓶頸可提升產出且瓶頸轉移', ok: th.goodTotal > b.goodTotal * 1.08 && th.bottleneck !== 'thread', detail: `${sim_1.fmt.n(th.goodTotal)}，新瓶頸 ${sim_1.STATION_INFO[th.bottleneck].name}` });
    out.push({ name: 'OEE 介於 0～1 且各站 OEE＝A×P×Q', ok: b.oee > 0 && b.oee < 1 && b.stations.every((s) => Math.abs(s.oee - s.avail * s.perf * s.qual) < 1e-9), detail: sim_1.fmt.pct(b.oee) });
    const little = Math.abs(b.wip - b.throughputRate * b.flowH) < 1e-6;
    out.push({ name: "Little's Law：WIP ＝ 產出率 × 流程時間", ok: little, detail: `${sim_1.fmt.n(b.wip)} ≈ ${sim_1.fmt.n(b.throughputRate)} × ${b.flowH.toFixed(1)}h` });
    out.push({ name: '無負產出或負成本', ok: b.goodTotal >= 0 && Object.values(b.costs).every((v) => v >= 0), detail: '通過' });
    const rty = b.stations.filter((s) => s.id !== 'optical').reduce((a, s) => a * s.qual, 1);
    out.push({ name: 'RTY ＝ 各站 FPY 乘積', ok: Math.abs(rty - b.rty) < 1e-9, detail: sim_1.fmt.pct(b.rty) });
    const feas = (0, sim_1.evaluatePhoenix)(['smed', 'tpm', 'overtime', 'stock', 'source', 'heatBatch', 'data', 'safety']);
    out.push({ name: '鳳凰計畫存在可行解', ok: feas.passed === 7, detail: `${feas.passed}/7` });
    const s1 = (0, sim_1.simulateWeek)((0, sim_1.phoenixFactory)(), sim_1.PHOENIX_SEED), s2 = (0, sim_1.simulateWeek)((0, sim_1.phoenixFactory)(), sim_1.PHOENIX_SEED);
    out.push({ name: '相同種子結果可重現', ok: s1.goodTotal === s2.goodTotal, detail: sim_1.fmt.n(s1.goodTotal) });
    const g0 = { factory: (0, sim_1.baseFactory)(), trust: {}, flags: [], funds: 1000, brand: 50, safetyViolations: 0, week: 1 };
    out.push({ name: '經費不會變成負數', ok: (0, state_1.applyEff)(g0, { funds: -999999 }).funds === 0, detail: '扣款下限為 0' });
    return out;
}
function SettingsView({ onRestart }) {
    const { g, set, toast } = (0, common_1.useG)();
    const [code, setCode] = (0, react_1.useState)('');
    const [imp, setImp] = (0, react_1.useState)('');
    const [tests, setTests] = (0, react_1.useState)(null);
    const [confirm, setConfirm] = (0, react_1.useState)(false);
    const [, force] = (0, react_1.useState)(0);
    const S = g.settings;
    const upd = (k, v) => set((g0) => ({ ...g0, settings: { ...g0.settings, [k]: v } }));
    return (react_1.default.createElement("div", { className: "grid2" },
        react_1.default.createElement(common_1.Card, { title: "\u904A\u6232\u8A2D\u5B9A" },
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.sound, onChange: (e) => upd('sound', e.target.checked) }),
                " \u97F3\u6548"),
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.motion, onChange: (e) => upd('motion', e.target.checked) }),
                " \u52D5\u614B\u6548\u679C"),
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: S.hints, onChange: (e) => upd('hints', e.target.checked) }),
                " \u6559\u5B78\u63D0\u793A"),
            react_1.default.createElement("div", { className: "row" },
                "\u6587\u5B57\u5927\u5C0F\uFF1A",
                ['s', 'm', 'l'].map((t) => react_1.default.createElement("button", { key: t, className: `opt sm ${S.text === t ? 'on' : ''}`, onClick: () => upd('text', t) }, { s: '小', m: '中', l: '大' }[t]))),
            react_1.default.createElement("div", { className: "row" },
                "\u96E3\u5EA6\uFF1A",
                g.mode === 'sandbox' ? react_1.default.createElement(common_1.Tag, null, "\u6C99\u76D2\u6A21\u5F0F") : ['story', 'engineer'].map((m) => react_1.default.createElement("button", { key: m, className: `opt sm ${g.mode === m ? 'on' : ''}`, onClick: () => set((g0) => ({ ...g0, mode: m })) }, m === 'story' ? '故事模式' : '工程師模式'))),
            react_1.default.createElement("p", { className: "small muted" }, "\u6545\u4E8B\u6A21\u5F0F\uFF1A\u53CA\u683C 50 \u5206\u3001\u63D0\u793A\u8F03\u591A\uFF1B\u5DE5\u7A0B\u5E2B\u6A21\u5F0F\uFF1A\u53CA\u683C 65 \u5206\u3001\u5347\u9077\u9580\u6ABB\u8F03\u56B4\u3002")),
        react_1.default.createElement(common_1.Card, { title: "\u5B58\u6A94" },
            [1, 2, 3].map((s) => {
                const i = (0, state_1.slotInfo)(s);
                return (react_1.default.createElement("div", { key: s, className: "row between qrow" },
                    react_1.default.createElement("span", null,
                        "\u6B04\u4F4D ",
                        s,
                        "\uFF1A",
                        i ? `${i.name}・${data_1.CAREERS[i.pos].title}・W${i.week}・${new Date(i.t).toLocaleString('zh-TW')}` : '（空）'),
                    react_1.default.createElement("span", null,
                        react_1.default.createElement(common_1.Btn, { small: true, onClick: () => { toast((0, state_1.saveSlot)(s, g) ? `已存到欄位 ${s}` : '此瀏覽器無法存檔，請改用存檔代碼'); force((x) => x + 1); } }, "\u5B58\u6A94"),
                        react_1.default.createElement(common_1.Btn, { small: true, disabled: !i, onClick: () => { const l = (0, state_1.loadSlot)(s); if (l) {
                                set(() => l);
                                toast('已載入');
                            } } }, "\u8F09\u5165"))));
            }),
            react_1.default.createElement("p", { className: "small muted" }, "\u904A\u6232\u6703\u81EA\u52D5\u5B58\u6A94\u3002\u82E5\u700F\u89BD\u5668\u4E0D\u652F\u63F4\u672C\u6A5F\u5132\u5B58\uFF0C\u53EF\u4F7F\u7528\u5B58\u6A94\u4EE3\u78BC\u5099\u4EFD\u3002"),
            react_1.default.createElement("div", { className: "row wrap" },
                react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setCode((0, state_1.exportCode)(g)) }, "\u7522\u751F\u5B58\u6A94\u4EE3\u78BC"),
                code && react_1.default.createElement(common_1.Btn, { small: true, onClick: () => { try {
                        navigator.clipboard.writeText(code).then(() => toast('已複製'), () => toast('請手動選取複製'));
                    }
                    catch {
                        toast('請手動選取複製');
                    } } }, "\u8907\u88FD\u4EE3\u78BC")),
            code && react_1.default.createElement("textarea", { readOnly: true, value: code, rows: 3, onFocus: (e) => e.target.select() }),
            react_1.default.createElement("textarea", { placeholder: "\u8CBC\u4E0A\u5B58\u6A94\u4EE3\u78BC\u4EE5\u8F09\u5165", value: imp, onChange: (e) => setImp(e.target.value), rows: 2 }),
            react_1.default.createElement(common_1.Btn, { small: true, disabled: !imp, onClick: () => { const l = (0, state_1.importCode)(imp); if (l) {
                    set(() => l);
                    toast('已從代碼載入');
                }
                else
                    toast('代碼無效'); } }, "\u5F9E\u4EE3\u78BC\u8F09\u5165"),
            react_1.default.createElement("hr", null),
            !confirm ? react_1.default.createElement(common_1.Btn, { kind: "danger", onClick: () => setConfirm(true) }, "\u91CD\u65B0\u958B\u59CB") : react_1.default.createElement("div", { className: "warnbox" },
                "\u78BA\u5B9A\u653E\u68C4\u76EE\u524D\u9032\u5EA6\uFF1F\uFF08\u5B58\u6A94\u6B04\u4F4D\u4E0D\u53D7\u5F71\u97FF\uFF09",
                react_1.default.createElement("div", { className: "row" },
                    react_1.default.createElement(common_1.Btn, { kind: "danger", onClick: onRestart }, "\u78BA\u5B9A\u91CD\u65B0\u958B\u59CB"),
                    react_1.default.createElement(common_1.Btn, { onClick: () => setConfirm(false) }, "\u53D6\u6D88")))),
        react_1.default.createElement(common_1.Card, { title: "\u6A21\u64EC\u5F15\u64CE\u81EA\u6211\u6E2C\u8A66\uFF08\u6E2C\u8A66\u6848\u4F8B\uFF09" },
            react_1.default.createElement(common_1.Btn, { onClick: () => setTests(runSelfTests()) }, "\u57F7\u884C\u6E2C\u8A66"),
            tests && react_1.default.createElement("ul", { className: "list" }, tests.map((t) => react_1.default.createElement("li", { key: t.name, className: t.ok ? 'good' : 'bad' },
                t.ok ? '✅' : '❌',
                " ",
                t.name,
                react_1.default.createElement("br", null),
                react_1.default.createElement("small", null, t.detail))))),
        react_1.default.createElement(common_1.Card, { title: "\u8CC7\u6599\u4F86\u6E90\u8072\u660E" },
            react_1.default.createElement(Sources, null))));
}
function ReportView() {
    const { g, go, set } = (0, common_1.useG)();
    if (!g.final)
        return react_1.default.createElement(common_1.Card, { title: "\u5C1A\u672A\u5B8C\u6210\u9CF3\u51F0\u8A08\u756B" },
            react_1.default.createElement(common_1.Btn, { onClick: () => go('cim') }, "\u524D\u5F80 CIM \u63A7\u5236\u4E2D\u5FC3"));
    const ids = g.final.ids;
    const ev = (0, sim_1.evaluatePhoenix)(ids);
    const ending = data_1.ENDINGS[g.final.ending];
    const marg = ids.map((id) => {
        const w = (0, sim_1.evaluatePhoenix)(ids.filter((x) => x !== id));
        const o = sim_1.PHOENIX_OPTIONS.find((x) => x.id === id);
        return { o, dGood: ev.after.goodTotal - w.after.goodTotal, dCost: w.after.costPerGood - ev.after.costPerGood, dOee: ev.after.oee - w.after.oee, dPpm: w.after.ppm - ev.after.ppm, dE: w.after.energyPerUnit - ev.after.energyPerUnit };
    });
    const rows = [
        ['全線 OEE', sim_1.fmt.pct(ev.before.oee), sim_1.fmt.pct(ev.after.oee)], ['良品產出／週', sim_1.fmt.n(ev.before.goodTotal), sim_1.fmt.n(ev.after.goodTotal)],
        ['OTIF', sim_1.fmt.pct(ev.before.otif), sim_1.fmt.pct(ev.after.otif)], ['客戶 PPM', ev.before.ppm.toFixed(0), ev.after.ppm.toFixed(0)],
        ['單位良品成本', `NT$${ev.before.costPerGood.toFixed(2)}`, `NT$${ev.after.costPerGood.toFixed(2)}`], ['單位能耗', `${ev.before.energyPerUnit.toFixed(3)} kWh`, `${ev.after.energyPerUnit.toFixed(3)} kWh`],
        ['WIP', sim_1.fmt.n(ev.before.wip), sim_1.fmt.n(ev.after.wip)], ['製造前置時間', `${ev.before.leadDays.toFixed(2)} 天`, `${ev.after.leadDays.toFixed(2)} 天`],
        ['疲勞指數', ev.before.fatigue.toFixed(0), ev.after.fatigue.toFixed(0)], ['安全指數', ev.before.safety.toFixed(0), ev.after.safety.toFixed(0)],
        ['瓶頸站', sim_1.STATION_INFO[ev.before.bottleneck].name, sim_1.STATION_INFO[ev.after.bottleneck].name],
    ];
    return (react_1.default.createElement("div", { className: "report" },
        react_1.default.createElement("div", { className: "ending", style: { borderColor: ending.color } },
            react_1.default.createElement("div", { className: "end-k" }, "\u7D50\u5C40"),
            react_1.default.createElement("h2", { style: { color: ending.color } }, ending.title),
            react_1.default.createElement("p", null, ending.text),
            react_1.default.createElement("div", { className: "big" },
                g.final.score,
                react_1.default.createElement("small", null, " \u5206"))),
        react_1.default.createElement(common_1.Card, { title: "\u667A\u6167\u5DE5\u5EE0\u6539\u5584\u6210\u679C\u5831\u544A\uFF08Smart Factory Improvement Report\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("ul", { className: "targets" }, ev.targets.map((t) => react_1.default.createElement("li", { key: t.id, className: t.ok ? 'ok' : 'ng' },
                t.ok ? '✅' : '❌',
                " ",
                t.label,
                react_1.default.createElement("b", null, t.val)))),
            react_1.default.createElement("div", { className: "grid2" },
                react_1.default.createElement("div", { className: "tbl-wrap" },
                    react_1.default.createElement("table", { className: "tbl" },
                        react_1.default.createElement("thead", null,
                            react_1.default.createElement("tr", null,
                                react_1.default.createElement("th", null, "KPI"),
                                react_1.default.createElement("th", null, "\u6539\u5584\u524D"),
                                react_1.default.createElement("th", null, "\u6539\u5584\u5F8C"))),
                        react_1.default.createElement("tbody", null, rows.map((r) => react_1.default.createElement("tr", { key: r[0] },
                            react_1.default.createElement("td", null, r[0]),
                            react_1.default.createElement("td", null, r[1]),
                            react_1.default.createElement("td", null,
                                react_1.default.createElement("b", null, r[2]))))))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "grid2" },
                        react_1.default.createElement(common_1.Kpi, { label: "\u6539\u5584\u6295\u8CC7", value: sim_1.fmt.wan(ev.cost.total), sub: `CAPEX ${sim_1.fmt.wan(ev.cost.capex)}／OPEX ${sim_1.fmt.wan(ev.cost.opex)}/週` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u4F30\u8A08\u5E74\u7BC0\u7701", value: sim_1.fmt.wan(ev.annualSaving), sub: "\u4EE5\u6539\u5584\u524D\u55AE\u4F4D\u6210\u672C\u751F\u7522\u540C\u91CF\u6BD4\u8F03" })),
                    react_1.default.createElement("div", { className: "grid2" },
                        react_1.default.createElement(common_1.Kpi, { label: "\u4F30\u8A08 ROI\uFF08\u5E74\u5316\uFF09", value: ev.cost.total ? (ev.roi > 5 ? '>500%' : sim_1.fmt.pct(ev.roi, 0)) : '—' }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u5BA2\u6236\u6EFF\u610F\u5EA6", value: `${ev.before.satisfaction.toFixed(0)} → ${ev.after.satisfaction.toFixed(0)}` })),
                    react_1.default.createElement("p", { className: "small" },
                        "\u74F6\u9838\u8F49\u79FB\uFF1A",
                        sim_1.STATION_INFO[ev.before.bottleneck].name,
                        " \u2192 ",
                        sim_1.STATION_INFO[ev.after.bottleneck].name),
                    react_1.default.createElement(common_1.Bars, { data: ev.after.stations.map((s) => ({ label: sim_1.STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.id === ev.after.bottleneck ? '#ffd23f' : '#39d5ff' })), line: 1, lineLabel: "100%", fmtv: (v) => `${(v * 100).toFixed(0)}%`, h: 150 })))),
        react_1.default.createElement(common_1.Card, { title: "\u5404\u9805\u6C7A\u7B56\u7684\u56E0\u679C\u8AAA\u660E\uFF08\u79FB\u9664\u8A72\u9805\u5F8C\u7684\u908A\u969B\u5DEE\u7570\uFF09" },
            react_1.default.createElement("div", { className: "tbl-wrap" },
                react_1.default.createElement("table", { className: "tbl sm" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "\u65B9\u6848"),
                            react_1.default.createElement("th", null, "\u7522\u51FA"),
                            react_1.default.createElement("th", null, "\u55AE\u4F4D\u6210\u672C"),
                            react_1.default.createElement("th", null, "OEE"),
                            react_1.default.createElement("th", null, "PPM"),
                            react_1.default.createElement("th", null, "\u80FD\u8017/\u9846"))),
                    react_1.default.createElement("tbody", null, marg.map((m) => react_1.default.createElement("tr", { key: m.o.id },
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("b", null, m.o.name),
                            react_1.default.createElement("br", null),
                            react_1.default.createElement("small", { className: "muted" }, m.o.desc)),
                        react_1.default.createElement("td", null,
                            m.dGood >= 0 ? '+' : '',
                            sim_1.fmt.n(m.dGood)),
                        react_1.default.createElement("td", null,
                            m.dCost >= 0 ? '−' : '+',
                            "NT$",
                            Math.abs(m.dCost).toFixed(2)),
                        react_1.default.createElement("td", null,
                            (m.dOee * 100).toFixed(1),
                            "pt"),
                        react_1.default.createElement("td", null,
                            m.dPpm >= 0 ? '−' : '+',
                            Math.abs(m.dPpm).toFixed(0)),
                        react_1.default.createElement("td", null,
                            m.dE >= 0 ? '−' : '+',
                            Math.abs(m.dE).toFixed(3))))))),
            react_1.default.createElement("p", { className: "small muted" }, "\u82E5\u67D0\u65B9\u6848\u7684\u7522\u51FA\u8CA2\u737B\u63A5\u8FD1 0\uFF0C\u4EE3\u8868\u5B83\u4F5C\u7528\u5728\u975E\u74F6\u9838\u74B0\u7BC0\u2014\u2014\u9019\u6B63\u662F\u9650\u5236\u7406\u8AD6\uFF08TOC\uFF09\u7684\u6838\u5FC3\u3002")),
        react_1.default.createElement(common_1.Card, { title: "\u8077\u6DAF\u56DE\u9867" },
            react_1.default.createElement("div", { className: "career-path" }, g.posHistory.map((p, i) => react_1.default.createElement("div", { key: i, className: "cp" },
                react_1.default.createElement(common_1.PlayerFace, { size: 40 }),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("b", null, data_1.CAREERS[p.pos].title),
                    react_1.default.createElement("small", null,
                        "\u7B2C ",
                        p.week,
                        " \u9031"))))),
            react_1.default.createElement("p", null, "\u5F9E\u4E00\u9846\u87BA\u7D72\u7684\u5B89\u5168\u4F5C\u696D\u958B\u59CB\uFF0C\u4F60\u8D70\u904E\u539F\u6599\u3001\u51B7\u935B\u3001\u87BA\u7D0B\u3001\u71B1\u8655\u7406\u3001\u7D44\u88DD\u6AA2\u9A57\u3001\u5E36\u73ED\u3001\u751F\u7BA1\u3001\u54C1\u8CEA\u3001\u63A1\u8CFC\u3001\u8CC7\u6599\u5206\u6790\u3001AI \u8207 CIM\uFF0C\u6700\u7D42\u6210\u70BA\u80FD\u6574\u5408\u4EBA\u54E1\u3001\u8A2D\u5099\u3001\u7269\u6599\u3001\u8CC7\u8A0A\u3001\u8CC7\u91D1\u8207\u80FD\u6E90\u7684\u7CFB\u7D71\u7D1A\u5DE5\u7A0B\u5E2B\u3002"),
            react_1.default.createElement("div", { className: "chips" }, g.certs.map((c) => react_1.default.createElement(common_1.Tag, { key: c, color: "var(--green)" },
                "\uD83C\uDF93 ",
                c))),
            react_1.default.createElement("div", { className: "badges" }, g.achievements.map((k) => react_1.default.createElement("div", { key: k, className: "badge on" },
                react_1.default.createElement("span", null, "\uD83C\uDFC5"),
                react_1.default.createElement("b", null, data_1.ACHIEVEMENTS[k].name)))),
            react_1.default.createElement("div", { className: "row wrap" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => go('mission', data_1.FINAL_ID) }, "\u91CD\u65B0\u6311\u6230\u9CF3\u51F0\u8A08\u756B"),
                react_1.default.createElement(common_1.Btn, { onClick: () => go('career') }, "\u8077\u6DAF\u7D00\u9304")))));
}

};
factories["./games/ai.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AILab = AILab;
exports.AILabGame = AILabGame;
const react_1 = __importStar(require("react"));
const common_1 = require("../ui/common");
const sim_1 = require("../sim");
const floor_1 = require("./floor");
const state_1 = require("../state");
const AITag = () => react_1.default.createElement("span", { className: "simtag ai" }, "\u6559\u5B78\u6A21\u64EC\uFF1A\u672A\u57F7\u884C\u771F\u5BE6\u6A21\u578B\u8A13\u7DF4");
function Phi(x) { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; }
function confusion(dp, th, n = 1000, prev = 0.1) {
    const pos = n * prev, neg = n - pos;
    const TP = pos * (1 - Phi(th - dp)), FN = pos - TP, FP = neg * (1 - Phi(th)), TN = neg - FP;
    const precision = TP / Math.max(1e-6, TP + FP), recall = TP / pos;
    return { TP, FN, FP, TN, precision, recall };
}
function Choice(p) {
    return react_1.default.createElement("div", { className: `opts ${p.col ? 'col' : ''}` }, p.opts.map((o) => react_1.default.createElement("button", { key: o.id, className: `opt ${p.v === o.id ? 'on' : ''}`, onClick: () => p.set(o.id) },
        react_1.default.createElement("b", null, o.t),
        o.d && react_1.default.createElement("small", null,
            react_1.default.createElement("br", null),
            o.d))));
}
function Confusion({ c }) {
    return (react_1.default.createElement("div", { className: "cm" },
        react_1.default.createElement("div", null),
        react_1.default.createElement("div", { className: "cm-h" }, "\u9810\u6E2C\uFF1A\u4E0D\u826F"),
        react_1.default.createElement("div", { className: "cm-h" }, "\u9810\u6E2C\uFF1A\u826F\u54C1"),
        react_1.default.createElement("div", { className: "cm-h" }, "\u5BE6\u969B\uFF1A\u4E0D\u826F"),
        react_1.default.createElement("div", { className: "cm-c tp" },
            "TP ",
            c.TP.toFixed(0)),
        react_1.default.createElement("div", { className: "cm-c fn" },
            "FN\uFF08\u6F0F\u6AA2\uFF09",
            c.FN.toFixed(0)),
        react_1.default.createElement("div", { className: "cm-h" }, "\u5BE6\u969B\uFF1A\u826F\u54C1"),
        react_1.default.createElement("div", { className: "cm-c fp" },
            "FP\uFF08\u8AA4\u5224\uFF09",
            c.FP.toFixed(0)),
        react_1.default.createElement("div", { className: "cm-c tn" },
            "TN ",
            c.TN.toFixed(0))));
}
function ProjectA({ onDone }) {
    const { g } = (0, common_1.useG)();
    const [s, setS] = (0, react_1.useState)(0);
    const [data, setData] = (0, react_1.useState)(null);
    const [policy, setPolicy] = (0, react_1.useState)(null);
    const items = (0, react_1.useMemo)(() => (0, floor_1.makeItems)('label', g.seed + 77), []);
    const [lab, setLab] = (0, react_1.useState)([]);
    const [split, setSplit] = (0, react_1.useState)(null);
    const [model, setModel] = (0, react_1.useState)(null);
    const [th, setTh] = (0, react_1.useState)(1.5);
    const [dep, setDep] = (0, react_1.useState)(null);
    const labAcc = lab.filter((l, i) => (l === 'ok') === (items[i].defect === 'ok')).length / items.length;
    const base = { rule: 1.2, cnn: 2.2, cloud: 2.5 }[model || 'rule'];
    const dD = { line: 0.4, web: -0.5, mix: 0.7 }[data || 'line'];
    const dL = { dual: 0.4, single: 0.1, out: -0.3 }[policy || 'single'] + (labAcc - 0.75) * 0.8;
    const dpTrue = Math.max(0.3, base + dD + dL);
    const inflate = { lot: 0, rand: 0.25, leak: 1.4 }[split || 'lot'];
    const testC = confusion(dpTrue + inflate, th), prodC = confusion(dpTrue - (data === 'web' ? 0.4 : 0), th);
    const steps = ['資料來源', '資料標註', '訓練／驗證分割', '模型比較', '信心門檻與混淆矩陣', '產線部署'];
    const finish = () => {
        const f1 = (2 * prodC.precision * prodC.recall) / (prodC.precision + prodC.recall);
        let score = f1 * 55 + (split === 'lot' ? 10 : split === 'rand' ? 5 : 0) + (dep === 'shadow' ? 15 : dep === 'human' ? 13 : 0) + (model === 'cloud' ? 0 : 10) + (data === 'web' ? 0 : 10);
        const gain = dep === 'replace' ? (prodC.recall - 0.95) * 0.5 : Math.max(0, prodC.recall - 0.9) * 0.6;
        const e = { f: { detect: (0, sim_1.clamp)(gain, -0.05, 0.05), falseReject: dep === 'replace' ? 0 : -0.004, opexExtra: 8000 } };
        onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`產線實際：精確率 ${sim_1.fmt.pct(prodC.precision)}、召回率 ${sim_1.fmt.pct(prodC.recall)}`, `測試集顯示：精確率 ${sim_1.fmt.pct(testC.precision)}、召回率 ${sim_1.fmt.pct(testC.recall)}${split === 'leak' ? '（資料洩漏造成虛高！）' : ''}`, `部署方式：${{ shadow: '影子模式並行', human: 'AI＋人工複判', replace: '直接取代人工' }[dep]}`], effect: e });
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: steps, cur: s }),
        s === 0 && react_1.default.createElement(common_1.Card, { title: "\u9078\u64C7\u8CC7\u6599\u4F86\u6E90", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement(Choice, { col: true, v: data, set: setData, opts: [{ id: 'line', t: '產線實拍 1,200 張（含先前收集的誤判影像）', d: '與實際光源、角度一致' }, { id: 'web', t: '網路公開螺絲圖片 8,000 張', d: '數量多，但光源、產品與瑕疵型態不同' }, { id: 'mix', t: '產線實拍 3,000 張＋少量合成瑕疵影像', d: '需多投入 2 週收集' }] }),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !data, onClick: () => setS(1) }, "\u4E0B\u4E00\u6B65"))),
        s === 1 && react_1.default.createElement(common_1.Card, { title: "\u8CC7\u6599\u6A19\u8A3B\uFF1A\u5148\u89AA\u81EA\u6A19 8 \u5F35\uFF0C\u518D\u6C7A\u5B9A\u6A19\u8A3B\u653F\u7B56", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("div", { className: "thumbs" }, items.map((it, i) => react_1.default.createElement("div", { key: i, className: `thumb ${lab[i] ? 'done' : ''}` },
                react_1.default.createElement(floor_1.FastenerSVG, { kind: it.kind, defect: it.defect, seed: it.seed }),
                react_1.default.createElement("div", { className: "row sm" }, ['ok', 'ng'].map((x) => react_1.default.createElement("button", { key: x, className: `opt sm ${lab[i] === x ? 'on' : ''}`, onClick: () => { const l = [...lab]; l[i] = x; setLab(l); } }, x === 'ok' ? '良品' : '不良')))))),
            react_1.default.createElement("p", { className: "small" }, "\u6A19\u8A3B\u4E00\u81F4\u6027\u6C7A\u5B9A\u6A21\u578B\u4E0A\u9650\u3002"),
            react_1.default.createElement(Choice, { v: policy, set: setPolicy, opts: [{ id: 'dual', t: '雙人標註＋分歧仲裁', d: '較慢，品質高' }, { id: 'single', t: '單人快速標註' }, { id: 'out', t: '外包，無標註規範' }] }),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: lab.filter(Boolean).length < 8 || !policy, onClick: () => setS(2) },
                    "\u4E0B\u4E00\u6B65\uFF08\u4F60\u7684\u6A19\u8A3B\u6B63\u78BA\u7387 ",
                    sim_1.fmt.pct(labAcc, 0),
                    "\uFF09"))),
        s === 2 && react_1.default.createElement(common_1.Card, { title: "\u8A13\u7DF4\uFF0F\u9A57\u8B49\u8CC7\u6599\u5206\u5272", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement(Choice, { col: true, v: split, set: setSplit, opts: [{ id: 'lot', t: '依生產批號分割（同一批只會出現在一邊）' }, { id: 'rand', t: '逐張隨機分割' }, { id: 'leak', t: '先用全部資料訓練，再抽一部分當測試' }] }),
            react_1.default.createElement(common_1.Hint, null, "\u540C\u4E00\u6279\u7522\u54C1\u5F71\u50CF\u6975\u70BA\u76F8\u4F3C\uFF1B\u82E5\u540C\u6279\u540C\u6642\u51FA\u73FE\u5728\u8A13\u7DF4\u8207\u6E2C\u8A66\uFF0C\u5206\u6578\u6703\u865B\u9AD8\u2014\u2014\u9019\u5C31\u662F\u8CC7\u6599\u6D29\u6F0F\uFF08Data Leakage\uFF09\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !split, onClick: () => setS(3) }, "\u4E0B\u4E00\u6B65"))),
        s === 3 && react_1.default.createElement(common_1.Card, { title: "\u6A21\u578B\u6BD4\u8F03", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement(Choice, { col: true, v: model, set: setModel, opts: [{ id: 'rule', t: '規則式影像處理（邊緣＋面積門檻）', d: '可解釋、速度快，對複雜瑕疵較弱' }, { id: 'cnn', t: '輕量卷積神經網路（地端部署，模擬）', d: '單張約 25 ms，可在產線邊緣電腦運行' }, { id: 'cloud', t: '雲端大型視覺模型 API', d: '準確度略高，但影像需上傳外部、依賴網路與付費 API' }] }),
            model === 'cloud' && react_1.default.createElement("div", { className: "warnbox" }, "\u7522\u7DDA\u5F71\u50CF\u5C6C\u65BC\u88FD\u7A0B\u8CC7\u6599\uFF0C\u4E0A\u50B3\u5916\u90E8\u670D\u52D9\u6709\u8CC7\u6599\u6CBB\u7406\u8207\u65B7\u7DB2\u505C\u7DDA\u98A8\u96AA\uFF1B\u672C\u5C08\u6848\u8981\u6C42\u5730\u7AEF\u904B\u4F5C\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !model, onClick: () => setS(4) }, "\u4E0B\u4E00\u6B65"))),
        s === 4 && react_1.default.createElement(common_1.Card, { title: "\u4FE1\u5FC3\u9580\u6ABB\u8207\u6DF7\u6DC6\u77E9\u9663\uFF08\u6E2C\u8A66\u96C6 1,000 \u5F35\uFF0C\u4E0D\u826F\u7387 10%\uFF09", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("div", { className: "slider" },
                react_1.default.createElement("label", null,
                    "\u5224\u70BA\u4E0D\u826F\u7684\u5206\u6578\u9580\u6ABB",
                    react_1.default.createElement("b", null, th.toFixed(2))),
                react_1.default.createElement("input", { type: "range", min: 0, max: 3, step: 0.05, value: th, onChange: (e) => setTh(+e.target.value), "aria-label": "\u9580\u6ABB" })),
            react_1.default.createElement("div", { className: "grid2" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(Confusion, { c: testC })),
                react_1.default.createElement("div", { className: "metric-list" },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u7CBE\u78BA\u7387 Precision"),
                        react_1.default.createElement("b", null, sim_1.fmt.pct(testC.precision))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u53EC\u56DE\u7387 Recall"),
                        react_1.default.createElement("b", null, sim_1.fmt.pct(testC.recall))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u6F0F\u6AA2\uFF08FN\uFF09"),
                        react_1.default.createElement("b", { className: "red" }, testC.FN.toFixed(0))),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement("span", null, "\u8AA4\u5224\uFF08FP\uFF09"),
                        react_1.default.createElement("b", null, testC.FP.toFixed(0))))),
            react_1.default.createElement(common_1.Hint, null, "\u9580\u6ABB\u964D\u4F4E \u2192 \u53EC\u56DE\u7387\u4E0A\u5347\uFF08\u6F0F\u6AA2\u5C11\uFF09\uFF0C\u4F46\u8AA4\u5224\u589E\u52A0\u3002\u8ECA\u7528\u6263\u4EF6\u901A\u5E38\u66F4\u6015\u6F0F\u6AA2\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setS(5) }, "\u4E0B\u4E00\u6B65"))),
        s === 5 && react_1.default.createElement(common_1.Card, { title: "\u7522\u7DDA\u90E8\u7F72\u65B9\u5F0F", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement(Choice, { col: true, v: dep, set: setDep, opts: [{ id: 'shadow', t: '影子模式：AI 與現行光學並行 1 個月，比對後再切換' }, { id: 'human', t: 'AI 判定＋人工複判高風險與低信心品' }, { id: 'replace', t: '立即取代現行光學與人工複判' }] }),
            dep && react_1.default.createElement("div", { className: "metric-list" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u7522\u7DDA\u6A21\u64EC\uFF1A\u7CBE\u78BA\u7387"),
                    react_1.default.createElement("b", null, sim_1.fmt.pct(prodC.precision))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u7522\u7DDA\u6A21\u64EC\uFF1A\u53EC\u56DE\u7387"),
                    react_1.default.createElement("b", null, sim_1.fmt.pct(prodC.recall))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u6E2C\u8A66\u96C6 vs \u7522\u7DDA\u843D\u5DEE"),
                    react_1.default.createElement("b", { className: testC.recall - prodC.recall > 0.05 ? 'red' : 'green' }, sim_1.fmt.pct(testC.recall - prodC.recall)))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !dep, onClick: finish }, "\u5B8C\u6210\u5C08\u6848")))));
}
const FEATS = [{ id: 'hard', n: '熱處理後硬度', ok: 1 }, { id: 'depth', n: '軸向沖壓深度', ok: 1 }, { id: 'force', n: '沖壓壓力', ok: 1 }, { id: 'lot', n: '盤元批號', ok: 0.5 }, { id: 'after', n: '出貨前實測扭力值', ok: -2 }, { id: 'op', n: '作業員姓名', ok: -1 }];
function ProjectB({ onDone }) {
    const [s, setS] = (0, react_1.useState)(0);
    const [feat, setFeat] = (0, react_1.useState)([]);
    const [h, setH] = (0, react_1.useState)(30);
    const [d, setD] = (0, react_1.useState)(0.6);
    const [dep, setDep] = (0, react_1.useState)(null);
    const fq = feat.reduce((a, f) => a + Math.max(0, FEATS.find((x) => x.id === f).ok), 0);
    const leak = feat.includes('after'), priv = feat.includes('op');
    const mean = 6 + 0.12 * h + 4.2 * d - 0.03 * Math.max(0, h - 34) * 10 * d;
    const extrap = Math.max(0, Math.abs(h - 30) - 5) * 0.12 + Math.max(0, Math.abs(d - 0.6) - 0.2) * 3;
    const half = (0.35 + (3.5 - Math.min(3.5, fq)) * 0.35 + extrap);
    const lo = mean - half, hi = mean + half;
    const inSpec = lo >= 8.8 && hi <= 11.2;
    const xs = Array.from({ length: 11 }, (_, i) => 0.2 + i * 0.08);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: ['特徵選擇', '參數模擬與不確定性', '上線決策'], cur: s }),
        s === 0 && react_1.default.createElement(common_1.Card, { title: "\u9078\u64C7\u6A21\u578B\u8F38\u5165\u7279\u5FB5", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("div", { className: "chips" }, FEATS.map((f) => react_1.default.createElement("button", { key: f.id, className: `chip ${feat.includes(f.id) ? 'on' : ''}`, onClick: () => setFeat(feat.includes(f.id) ? feat.filter((x) => x !== f.id) : [...feat, f.id]) },
                feat.includes(f.id) ? '✔ ' : '',
                f.n))),
            leak && react_1.default.createElement("div", { className: "warnbox" }, "\u300C\u51FA\u8CA8\u524D\u5BE6\u6E2C\u626D\u529B\u300D\u662F\u9810\u6E2C\u76EE\u6A19\u672C\u8EAB\uFF08\u6216\u4E8B\u5F8C\u624D\u77E5\u9053\u7684\u8CC7\u8A0A\uFF09\u2014\u2014\u7528\u5B83\u7576\u8F38\u5165\u5C31\u662F\u8CC7\u6599\u6D29\u6F0F\u3002"),
            priv && react_1.default.createElement("div", { className: "warnbox" }, "\u4F5C\u696D\u54E1\u59D3\u540D\u8207\u7269\u7406\u6A5F\u5236\u7121\u95DC\uFF0C\u4E14\u6709\u500B\u8CC7\u8207\u516C\u5E73\u6027\u7591\u616E\uFF1B\u61C9\u4EE5\u88FD\u7A0B\u689D\u4EF6\u70BA\u7279\u5FB5\u3002"),
            react_1.default.createElement(common_1.Hint, null, "\u5C0D\u7167\u516C\u958B\u5C08\u5229 TWI753649B \u7684\u91CD\u9EDE\uFF1A\u71B1\u8655\u7406\u5F8C\u786C\u5EA6\u8207\u8EF8\u5411\u6C96\u58D3\u689D\u4EF6\u7684\u914D\u5408\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !feat.length, onClick: () => setS(1) }, "\u4E0B\u4E00\u6B65"))),
        s === 1 && react_1.default.createElement(common_1.Card, { title: "What-if\uFF1A\u9810\u6E2C\u626D\u529B\u5340\u9593\uFF08\u865B\u69CB\u6307\u6578\u8207\u55AE\u4F4D\uFF09", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("div", { className: "grid2" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "slider" },
                        react_1.default.createElement("label", null,
                            "\u71B1\u8655\u7406\u5F8C\u786C\u5EA6\uFF08\u865B\u69CB\u6307\u6578\uFF09",
                            react_1.default.createElement("b", null, h)),
                        react_1.default.createElement("input", { type: "range", min: 20, max: 42, step: 1, value: h, onChange: (e) => setH(+e.target.value), "aria-label": "\u786C\u5EA6" })),
                    react_1.default.createElement("div", { className: "slider" },
                        react_1.default.createElement("label", null,
                            "\u6C96\u58D3\u6DF1\u5EA6\uFF08\u865B\u69CB\u6307\u6578\uFF09",
                            react_1.default.createElement("b", null, d.toFixed(2))),
                        react_1.default.createElement("input", { type: "range", min: 0.2, max: 1, step: 0.02, value: d, onChange: (e) => setD(+e.target.value), "aria-label": "\u6C96\u58D3\u6DF1\u5EA6" })),
                    react_1.default.createElement("div", { className: "metric-list" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u9810\u6E2C\u4E2D\u5FC3\u503C"),
                            react_1.default.createElement("b", null, mean.toFixed(2))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "90% \u9810\u6E2C\u5340\u9593"),
                            react_1.default.createElement("b", { className: inSpec ? 'green' : 'red' },
                                lo.toFixed(2),
                                " \uFF5E ",
                                hi.toFixed(2))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u5916\u63D2\u7A0B\u5EA6"),
                            react_1.default.createElement("b", { className: extrap > 0.3 ? 'red' : '' }, extrap > 0.3 ? '超出訓練資料範圍' : '在資料範圍內')))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement(common_1.Lines, { labels: xs.map((x) => x.toFixed(2)), series: [{ name: '中心', color: '#39d5ff', values: xs.map((x) => 6 + 0.12 * h + 4.2 * x - 0.03 * Math.max(0, h - 34) * 10 * x) }], bands: [{ from: 8.8, to: 11.2, color: 'rgba(124,242,156,.12)' }], hlines: [{ v: 8.8, label: 'LSL', color: '#ff5d73' }, { v: 11.2, label: 'USL', color: '#ff5d73' }], min: 6, max: 14, h: 200 }),
                    react_1.default.createElement("p", { className: "small muted center" }, "X \u8EF8\uFF1A\u6C96\u58D3\u6DF1\u5EA6\uFF1B\u7DA0\u5E36\uFF1A\u898F\u683C\u7BC4\u570D"))),
            react_1.default.createElement(common_1.Hint, null, "\u9810\u6E2C\u5340\u9593\u8981\u6574\u500B\u843D\u5728\u898F\u683C\u5167\u624D\u7B97\u4F4E\u98A8\u96AA\u3002\u8A13\u7DF4\u8CC7\u6599\u4EE5\u5916\u7684\u7D44\u5408\uFF0C\u4E0D\u78BA\u5B9A\u6027\u6703\u64F4\u5927\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setS(2) }, "\u4E0B\u4E00\u6B65"))),
        s === 2 && react_1.default.createElement(common_1.Card, { title: "\u6A21\u578B\u5EFA\u8B70\u5982\u4F55\u4E0A\u7DDA\uFF1F", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement(Choice, { col: true, v: dep, set: setDep, opts: [{ id: 'write', t: '直接把模型建議寫入沖壓機參數' }, { id: 'doe', t: '作為工程師參考：小批 DOE 試產驗證、工程變更核准後才調整' }, { id: 'none', t: '不使用模型，維持現狀' }] }),
            dep === 'write' && react_1.default.createElement("div", { className: "warnbox" }, "\u904A\u6232\u6A21\u578B\u4E0D\u5F97\u76F4\u63A5\u7576\u6210\u5B89\u5168\u7684\u5BE6\u969B\u6A5F\u53F0\u8A2D\u5B9A\uFF1B\u4EFB\u4F55\u53C3\u6578\u8B8A\u66F4\u90FD\u9700\u9A57\u8B49\u8207\u6838\u51C6\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !dep, onClick: () => {
                        const score = Math.min(3.5, fq) / 3.5 * 35 + (leak ? 0 : 15) + (priv ? 0 : 5) + (inSpec ? 20 : 5) + (extrap <= 0.3 ? 5 : 0) + (dep === 'doe' ? 20 : dep === 'none' ? 5 : 0);
                        onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`特徵品質 ${Math.min(3.5, fq).toFixed(1)}/3.5${leak ? '（含洩漏特徵）' : ''}`, `模擬設定預測區間 ${lo.toFixed(2)}～${hi.toFixed(2)}：${inSpec ? '落在規格內' : '超出規格'}`, `上線方式：${{ write: '直接寫入（不安全）', doe: 'DOE 驗證後核准', none: '不使用' }[dep]}`],
                            effect: { st: { secondary: { Q: dep === 'doe' && inSpec ? 0.005 : 0 } }, f: { latent: dep === 'doe' ? -0.0004 : dep === 'write' ? 0.0008 : 0 } } });
                    } }, "\u5B8C\u6210\u5C08\u6848")))));
}
function ProjectC({ onDone }) {
    const [gap, setGap] = (0, react_1.useState)(null);
    const [w, setW] = (0, react_1.useState)(7);
    const vib = [2.1, 2.2, 2.1, 2.3, 2.4, 2.4, 2.6, 2.8, 3.0, 3.3, 3.5, 3.9];
    const temp = [41, 41, 42, 42, 43, 43, 45, 46, 48, 49, 52, 54];
    const pf = (x) => 1 - Math.exp(-Math.pow(x / 5.5, 3));
    const cost = (x) => 80000 + 4 * 20000 + pf(x) * 600000 + (8 - x) * 6000;
    const best = [1, 2, 3, 4, 5, 6, 7, 8].reduce((b, x) => (cost(x) < cost(b) ? x : b), 1);
    return (react_1.default.createElement(common_1.Card, { title: "\u51B7\u935B\u6A5F\u4E3B\u8EF8\uFF1A\u9810\u6E2C\u6027\u7DAD\u8B77\uFF08Predictive Maintenance AI\uFF09", right: react_1.default.createElement(AITag, null) },
        react_1.default.createElement("div", { className: "grid2" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("p", null, "\u904E\u53BB 12 \u9031\u9707\u52D5 RMS\uFF08mm/s\uFF0C\u6A21\u64EC\uFF09"),
                react_1.default.createElement(common_1.Lines, { labels: vib.map((_, i) => `W${i + 1}`), series: [{ name: '震動', color: '#ff9a3c', values: vib }], hlines: [{ v: 4.5, label: '警戒', color: '#ff5d73' }], h: 160 })),
            react_1.default.createElement("div", null,
                react_1.default.createElement("p", null, "\u8EF8\u627F\u6EAB\u5EA6\uFF08\u00B0C\uFF0C\u6A21\u64EC\uFF09"),
                react_1.default.createElement(common_1.Lines, { labels: temp.map((_, i) => `W${i + 1}`), series: [{ name: '溫度', color: '#39d5ff', values: temp }], h: 160 }))),
        react_1.default.createElement("h4", null, "1. \u611F\u6E2C\u5668\u6709 3 \u5929\u8CC7\u6599\u4E2D\u65B7\uFF0C\u600E\u9EBC\u8655\u7406\uFF1F"),
        react_1.default.createElement(Choice, { v: gap, set: setGap, opts: [{ id: 'flag', t: '標記缺漏、短缺口插補並建立斷線告警' }, { id: 'zero', t: '缺漏補 0' }, { id: 'drop', t: '整段刪除不管' }] }),
        react_1.default.createElement("h4", null, "2. \u5B89\u6392\u5E7E\u9031\u5F8C\u505C\u6A5F\u4FDD\u990A\uFF1F"),
        react_1.default.createElement("div", { className: "slider" },
            react_1.default.createElement("label", null,
                "\u4FDD\u990A\u6642\u9EDE",
                react_1.default.createElement("b", null,
                    "\u7B2C ",
                    w,
                    " \u9031\u5F8C")),
            react_1.default.createElement("input", { type: "range", min: 1, max: 8, step: 1, value: w, onChange: (e) => setW(+e.target.value), "aria-label": "\u4FDD\u990A\u9031" })),
        react_1.default.createElement(common_1.Bars, { data: [1, 2, 3, 4, 5, 6, 7, 8].map((x) => ({ label: `${x}週`, v: cost(x) / 1e4, color: x === w ? '#ffd23f' : '#39d5ff' })), fmtv: (v) => v.toFixed(0), h: 160 }),
        react_1.default.createElement("div", { className: "metric-list" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", null, "\u4FDD\u990A\u524D\u6545\u969C\u6A5F\u7387"),
                react_1.default.createElement("b", { className: pf(w) > 0.4 ? 'red' : '' }, sim_1.fmt.pct(pf(w)))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", null, "\u671F\u671B\u7E3D\u6210\u672C\uFF08\u4FDD\u990A\uFF0B\u505C\u6A5F\uFF0B\u6545\u969C\u98A8\u96AA\uFF09"),
                react_1.default.createElement("b", null, sim_1.fmt.nt(cost(w))))),
        react_1.default.createElement(common_1.Hint, null, "\u592A\u65E9\u4FDD\u990A\u6D6A\u8CBB\u96F6\u4EF6\u58FD\u547D\u8207\u7522\u80FD\uFF1B\u592A\u665A\u5247\u6545\u969C\u98A8\u96AA\uFF08\u542B\u6A21\u5177\u640D\u58DE\u3001\u4EA4\u671F\u5EF6\u8AA4\uFF09\u6025\u907D\u4E0A\u5347\u3002\u55AE\u4F4D\uFF1A\u842C\u5143\u3002"),
        react_1.default.createElement("div", { className: "row end" },
            react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !gap, onClick: () => {
                    const score = (0, sim_1.clamp)(100 - Math.abs(w - best) * 18, 0, 70) + (gap === 'flag' ? 30 : gap === 'drop' ? 8 : 0);
                    onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`保養時點第 ${w} 週（最佳約第 ${best} 週）`, `期望成本 ${sim_1.fmt.nt(cost(w))}`, `資料缺漏處理：${{ flag: '標記＋插補＋告警 ✔', zero: '補 0（會誤導模型）', drop: '刪除（遺失資訊）' }[gap]}`],
                        effect: { st: { forge: { A: Math.abs(w - best) <= 1 ? 0.02 : 0.005 }, thread: { A: 0.005 } }, f: { opexExtra: 5000 } } });
                } }, "\u5B8C\u6210\u5C08\u6848"))));
}
const STORIES = [
    { id: 's1', t: '從客戶工程圖面 OCR 抽取尺寸與材質，產生報價單草稿', ok: true }, { id: 's2', t: '檢索 SOP 與公開專利並附來源回答工程問題', ok: true },
    { id: 's3', t: '比對 BOM 與 ERP 料號，提醒異常', ok: true }, { id: 's4', t: 'AI 自動放行品質判定', ok: false },
    { id: 's5', t: 'AI 依產量自動調整機台參數', ok: false }, { id: 's6', t: 'AI 自動下採購單', ok: false },
];
const TESTS = ['提示注入（Prompt Injection）攻擊測試', '幻覺檢查：無來源時必須回答「查無資料」', '權限測試：無寫入權限帳號不得修改資料', 'OCR 數字誤讀（如 0/8、1/7）測試', 'SOP 舊版本誤用測試', '同時 50 人查詢的負載測試'];
const CHAT = [
    { q: 'M10 預置扭力螺帽的熱處理後檢驗項目是什麼？', a: '依「熱處理檢驗作業標準」第 4.2 節，熱處理後需進行硬度抽驗並記錄爐次批號；預置扭力產品另需確認後續沖壓前的硬度分級。', src: ['〔虛構〕SOP-HT-012 v3 §4.2', '公開專利 TWI753649B（專利名稱與摘要）'] },
    { q: '這張圖面的螺紋規格是？（附件：客戶圖面.pdf）', a: 'OCR 辨識結果：M8×1.25-6g，長度 35 mm，材質欄位辨識信心度 0.62（低）→ 已標記為「需人工確認」，未寫入報價單。', src: ['客戶圖面 p.1 標題欄（OCR 信心度標示）'] },
    { q: '套管螺絲的料號 CSS-M6-020 在 BOM 裡用了哪些子件？', a: 'BOM 查詢（唯讀）：螺絲本體 SC-M6-020 ×1、套管 SL-06-11 ×1。ERP 現有套管庫存與 MES 報工差異 2,200 個，建議循環盤點。', src: ['ERP BOM 表（唯讀查詢）', 'MES 報工紀錄'] },
    { q: '幫我把 3 號搓牙機速度調高 10%。', a: '我無法執行這個操作。Copilot 僅有唯讀與草稿權限，不能修改生產參數、品質放行或採購紀錄。參數變更請依工程變更流程，由製程工程師提出並經核准。', src: ['〔虛構〕資訊安全與權限政策 §2'] },
];
function ProjectD({ onDone }) {
    const [s, setS] = (0, react_1.useState)(0);
    const [st, setSt] = (0, react_1.useState)([]);
    const [ocr, setOcr] = (0, react_1.useState)({ human: false, schema: false, conf: 0.5 });
    const [rag, setRag] = (0, react_1.useState)({ cite: false, chunk: false, version: false });
    const [perm, setPerm] = (0, react_1.useState)(null);
    const [tests, setTests] = (0, react_1.useState)([]);
    const [chat, setChat] = (0, react_1.useState)([]);
    const [deploy, setDeploy] = (0, react_1.useState)(null);
    const steps = ['需求', '文件抽取（OCR/VLM）與 ETL', 'RAG 檢索', '權限設計', '功能測試', '試用與部署'];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: steps, cur: s }),
        s === 0 && react_1.default.createElement(common_1.Card, { title: "\u9078\u64C7\u7B2C\u4E00\u7248\u8981\u505A\u7684 3 \u500B\u9700\u6C42", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("div", { className: "chips" }, STORIES.map((x) => react_1.default.createElement("button", { key: x.id, className: `chip ${st.includes(x.id) ? 'on' : ''}`, onClick: () => setSt(st.includes(x.id) ? st.filter((y) => y !== x.id) : st.length < 3 ? [...st, x.id] : st) },
                st.includes(x.id) ? '✔ ' : '',
                x.t))),
            react_1.default.createElement(common_1.Hint, null, "AI \u4E0D\u53EF\u4EFB\u610F\u4FEE\u6539\u751F\u7522\u53C3\u6578\u3001\u54C1\u8CEA\u653E\u884C\u7D50\u679C\u6216\u63A1\u8CFC\u7D00\u9304\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: st.length < 3, onClick: () => setS(1) }, "\u4E0B\u4E00\u6B65"))),
        s === 1 && react_1.default.createElement(common_1.Card, { title: "\u5DE5\u7A0B\u5716\u9762\u8FA8\u8B58\u8207\u8CC7\u6599\u62BD\u53D6", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: ocr.human, onChange: (e) => setOcr({ ...ocr, human: e.target.checked }) }),
                " \u4F4E\u4FE1\u5FC3\u6B04\u4F4D\u5F37\u5236\u4EBA\u5DE5\u78BA\u8A8D"),
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: ocr.schema, onChange: (e) => setOcr({ ...ocr, schema: e.target.checked }) }),
                " ETL \u8F09\u5165 SQL \u524D\u505A\u6B04\u4F4D\u578B\u5225\u8207\u7BC4\u570D\u9A57\u8B49"),
            react_1.default.createElement("div", { className: "slider" },
                react_1.default.createElement("label", null,
                    "\u81EA\u52D5\u63A1\u7528\u7684\u4FE1\u5FC3\u5EA6\u4E0B\u9650",
                    react_1.default.createElement("b", null, ocr.conf.toFixed(2))),
                react_1.default.createElement("input", { type: "range", min: 0.3, max: 0.99, step: 0.01, value: ocr.conf, onChange: (e) => setOcr({ ...ocr, conf: +e.target.value }), "aria-label": "\u4FE1\u5FC3\u5EA6" })),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setS(2) }, "\u4E0B\u4E00\u6B65"))),
        s === 2 && react_1.default.createElement(common_1.Card, { title: "RAG\uFF1A\u5C08\u5229\u8207 SOP \u6AA2\u7D22", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: rag.cite, onChange: (e) => setRag({ ...rag, cite: e.target.checked }) }),
                " \u6BCF\u500B\u56DE\u7B54\u5FC5\u9808\u9644\u4F86\u6E90\uFF08\u6587\u4EF6\u3001\u7248\u672C\u3001\u7AE0\u7BC0\uFF09"),
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: rag.chunk, onChange: (e) => setRag({ ...rag, chunk: e.target.checked }) }),
                " \u4F9D\u7AE0\u7BC0\u5207\u5206\u6587\u4EF6\uFF08\u4FDD\u7559\u6A19\u984C\u8108\u7D61\uFF09"),
            react_1.default.createElement("label", { className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: rag.version, onChange: (e) => setRag({ ...rag, version: e.target.checked }) }),
                " \u53EA\u6AA2\u7D22\u300C\u73FE\u884C\u6709\u6548\u7248\u300DSOP"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setS(3) }, "\u4E0B\u4E00\u6B65"))),
        s === 3 && react_1.default.createElement(common_1.Card, { title: "\u6B0A\u9650\u8A2D\u8A08", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement(Choice, { col: true, v: perm, set: setPerm, opts: [{ id: 'ro', t: '唯讀查詢＋產生草稿；任何寫入需人工核准並留存稽核紀錄' }, { id: 'rw', t: '允許 Copilot 直接寫入 ERP／MES 以提升效率' }, { id: 'admin', t: '使用管理員帳號連線，方便開發' }] }),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !perm, onClick: () => setS(4) }, "\u4E0B\u4E00\u6B65"))),
        s === 4 && react_1.default.createElement(common_1.Card, { title: "\u9078\u64C7\u8981\u7D0D\u5165\u7684\u6E2C\u8A66\u6848\u4F8B", right: react_1.default.createElement(AITag, null) },
            TESTS.map((t, i) => react_1.default.createElement("label", { key: i, className: "check" },
                react_1.default.createElement("input", { type: "checkbox", checked: tests.includes(i), onChange: (e) => setTests(e.target.checked ? [...tests, i] : tests.filter((x) => x !== i)) }),
                " ",
                t)),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setS(5) }, "\u4E0B\u4E00\u6B65"))),
        s === 5 && react_1.default.createElement(common_1.Card, { title: "\u8A66\u7528 Copilot\uFF08\u9810\u9304\u793A\u7BC4\uFF0C\u975E\u5373\u6642 AI\uFF09", right: react_1.default.createElement(AITag, null) },
            react_1.default.createElement("div", { className: "chips" }, CHAT.map((c, i) => react_1.default.createElement("button", { key: i, className: "chip", onClick: () => !chat.includes(i) && setChat([...chat, i]) }, c.q))),
            react_1.default.createElement("div", { className: "chat" }, chat.map((i) => react_1.default.createElement("div", { key: i },
                react_1.default.createElement("div", { className: "msg me" }, CHAT[i].q),
                react_1.default.createElement("div", { className: "msg bot" },
                    CHAT[i].a,
                    rag.cite && react_1.default.createElement("div", { className: "src" },
                        "\u4F86\u6E90\uFF1A",
                        CHAT[i].src.join('；')),
                    !rag.cite && react_1.default.createElement("div", { className: "src red" }, "\uFF08\u672A\u8A2D\u5B9A\u4F86\u6E90\u8FFD\u6EAF\uFF0C\u4F7F\u7528\u8005\u7121\u6CD5\u67E5\u8B49\uFF09"))))),
            react_1.default.createElement("h4", null, "\u90E8\u7F72\u65B9\u5F0F"),
            react_1.default.createElement(Choice, { v: deploy, set: setDeploy, opts: [{ id: 'local', t: '地端部署本地模型，資料不出廠' }, { id: 'cloud', t: '串接外部付費雲端 API' }] }),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !deploy || chat.length < 2, onClick: () => {
                        const sOk = st.filter((x) => STORIES.find((y) => y.id === x).ok).length;
                        const score = sOk * 7 + (ocr.human ? 8 : 0) + (ocr.schema ? 6 : 0) + (ocr.conf >= 0.8 ? 5 : 0) + (rag.cite ? 10 : 0) + (rag.chunk ? 4 : 0) + (rag.version ? 5 : 0) + (perm === 'ro' ? 15 : 0) + Math.min(4, tests.length) * 3 + (tests.includes(0) ? 2 : 0) + (deploy === 'local' ? 8 : 0);
                        onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`需求選擇 ${sOk}/3 合宜`, `人工確認 ${ocr.human ? '✔' : '✘'}、來源追溯 ${rag.cite ? '✔' : '✘'}、版本控管 ${rag.version ? '✔' : '✘'}`, `權限：${{ ro: '唯讀＋人工核准 ✔', rw: '直接寫入（風險）', admin: '管理員帳號（風險）' }[perm]}`, `測試案例 ${tests.length} 項、部署：${deploy === 'local' ? '地端' : '外部 API'}`],
                            effect: { f: { dataQuality: perm === 'ro' ? 0.05 : 0.01, opexExtra: 6000 }, addRisk: perm === 'ro' ? undefined : 'Copilot 具過度寫入權限' } });
                    } }, "\u5B8C\u6210\u5C08\u6848")))));
}
const PROJ = [
    { id: 'A', n: 'FastenerVision AI', d: '扣件視覺瑕疵檢測：標註→分割→模型→門檻→混淆矩陣→部署', C: ProjectA, cost: 60000 },
    { id: 'B', n: 'TorqueMind AI', d: '預置扭力製程預測：特徵、預測區間與不確定性', C: ProjectB, cost: 40000 },
    { id: 'C', n: 'Predictive Maintenance AI', d: '設備與模具預測性維護：何時停機保養最划算', C: ProjectC, cost: 40000 },
    { id: 'D', n: 'Fastener Engineering Copilot', d: 'VLM／OCR、RAG、BOM、SQL／ETL、API 與權限', C: ProjectD, cost: 50000 },
];
function AILab({ onDone, embedded }) {
    const { g, set, sfx, toast } = (0, common_1.useG)();
    const [open, setOpen] = (0, react_1.useState)(null);
    const done = Object.values(g.ai).filter((x) => x.done).length;
    const unlocked = g.mode === 'sandbox' || g.pos >= 6;
    if (open) {
        const P = PROJ.find((p) => p.id === open);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "row between" },
                react_1.default.createElement("h3", null, P.n),
                react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setOpen(null) }, "\u2190 \u8FD4\u56DE\u5C08\u6848\u6E05\u55AE")),
            react_1.default.createElement(P.C, { onDone: (r) => {
                    set((g0) => {
                        let n = (0, state_1.applyEff)(g0, r.effect || {});
                        n = { ...n, ai: { ...n.ai, [P.id]: { done: true, score: Math.max(r.score, n.ai[P.id].score), deployed: true } }, skills: (0, state_1.gainSkills)(n, { it: 4, sys: 1 }, r.score / 100) };
                        n.journal = [...n.journal, { week: n.week, title: `AI 專案完成：${P.n}`, text: r.summary.join('；') }];
                        return n;
                    });
                    sfx(r.score >= 60 ? 'good' : 'bad');
                    toast(`${P.n} 完成：${r.score} 分`);
                    setOpen(null);
                } })));
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "row between wrap" },
            react_1.default.createElement("p", null,
                "AI \u7814\u767C\u5BA4\u30FB\u5DF2\u5B8C\u6210 ",
                react_1.default.createElement("b", null, done),
                "\uFF0F4 \u500B\u5C08\u6848 ",
                react_1.default.createElement(AITag, null)),
            embedded && react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: done < 3, onClick: () => {
                    const sc = Object.values(g.ai).filter((x) => x.done).map((x) => x.score);
                    onDone({ score: Math.round(sc.reduce((a, b) => a + b, 0) / sc.length), summary: [`完成 ${done} 個 AI 專案`, ...PROJ.filter((p) => g.ai[p.id].done).map((p) => `${p.n}：${g.ai[p.id].score} 分`)] });
                } }, done < 3 ? `至少完成 3 個專案（${done}/3）` : '提交專案成果')),
        !unlocked && react_1.default.createElement("div", { className: "warnbox" }, "\u8F49\u8077\u70BA\u4EBA\u5DE5\u667A\u6167\u5DE5\u7A0B\u5E2B\u5F8C\u89E3\u9396\u3002"),
        react_1.default.createElement("div", { className: "grid2" }, PROJ.map((p) => (react_1.default.createElement(common_1.Card, { key: p.id, title: react_1.default.createElement(react_1.default.Fragment, null,
                p.n,
                " ",
                g.ai[p.id].done && react_1.default.createElement(common_1.Tag, { color: "var(--green)" },
                    "\u5B8C\u6210 ",
                    g.ai[p.id].score,
                    " \u5206")) },
            react_1.default.createElement("p", { className: "small" }, p.d),
            react_1.default.createElement("div", { className: "row between" },
                react_1.default.createElement("small", { className: "muted" },
                    "\u5C08\u6848\u7D93\u8CBB ",
                    sim_1.fmt.nt(p.cost)),
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !unlocked, onClick: () => {
                        if (!g.ai[p.id].done && g.funds < p.cost) {
                            set((g0) => ({ ...g0, funds: g0.funds + p.cost, trust: { ...g0.trust, mgmt: g0.trust.mgmt - 3 }, grants: g0.grants + 1 }));
                            toast('經費不足：周副總核准專案預算追加（經營管理信任 −3）');
                        }
                        if (!g.ai[p.id].done)
                            set((g0) => ({ ...g0, funds: Math.max(0, g0.funds - p.cost) }));
                        setOpen(p.id);
                    } }, g.ai[p.id].done ? '重新挑戰' : '開始專案'))))))));
}
function AILabGame(p) { return react_1.default.createElement(AILab, { ...p, embedded: true }); }

};
factories["./games/floor.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HazardGame = HazardGame;
exports.TraceGame = TraceGame;
exports.ParamGame = ParamGame;
exports.FastenerSVG = FastenerSVG;
exports.makeItems = makeItems;
exports.InspectGame = InspectGame;
exports.CrewGame = CrewGame;
const react_1 = __importStar(require("react"));
const common_1 = require("../ui/common");
const sim_1 = require("../sim");
const SPOTS = [
    { id: 'guard', x: 150, y: 170, r: 46, hazard: true, label: '打頭機護蓋開啟、連鎖失效', why: '旋轉與衝壓部位外露，可能夾傷、捲入。' },
    { id: 'oil', x: 360, y: 360, r: 40, hazard: true, label: '地面油漬', why: '滑倒風險；應立即清理並標示。' },
    { id: 'aisle', x: 640, y: 330, r: 48, hazard: true, label: '料箱堆在堆高機通道', why: '阻礙通行與緊急疏散，易碰撞。' },
    { id: 'sleeve', x: 470, y: 190, r: 40, hazard: true, label: '作業員長袖未束、戴棉紗手套靠近搓牙機', why: '旋轉件捲入風險。' },
    { id: 'estop', x: 260, y: 120, r: 26, hazard: false, label: '緊急停止按鈕', why: '這是安全裝置，位置正確。' },
    { id: 'board', x: 720, y: 140, r: 36, hazard: false, label: '5S 工具形跡板', why: '工具定位清楚，是良好示範。' },
    { id: 'ext', x: 50, y: 330, r: 28, hazard: false, label: '滅火器（標示清楚）', why: '位置與標示正確。' },
];
const PPE = [
    { id: 'shoe', n: '安全鞋', ok: true }, { id: 'goggle', n: '護目鏡', ok: true }, { id: 'ear', n: '耳罩／耳塞', ok: true },
    { id: 'cap', n: '束髮／工作帽', ok: true }, { id: 'cotton', n: '棉紗手套（操作旋轉機台時）', ok: false },
    { id: 'ring', n: '戒指與手錶', ok: false }, { id: 'vest', n: '反光背心（堆高機作業區）', ok: true }, { id: 'slipper', n: '包頭拖鞋', ok: false },
];
const STOPQ = [
    { q: '打頭機發出異常撞擊聲，產品頭部出現裂紋。', opts: ['繼續生產，下班再報', '按緊急停止或正常停機，通報領班並隔離產品', '自己打開護蓋檢查'], a: 1 },
    { q: '同事的袖子被搓牙機送料輪勾住。', opts: ['立即按下緊急停止按鈕並呼救', '用手把袖子拉出來', '先跑去找領班'], a: 0 },
    { q: '換模時，需要伸手進入模具區。', opts: ['機台停在待機即可', '切斷能源、上鎖掛牌（LOTO）並確認零能量', '請同事幫忙按住開關'], a: 1 },
];
function HazardGame({ onDone }) {
    const [step, setStep] = (0, react_1.useState)(0);
    const [flag, setFlag] = (0, react_1.useState)([]);
    const [shown, setShown] = (0, react_1.useState)(false);
    const [ppe, setPpe] = (0, react_1.useState)([]);
    const [ans, setAns] = (0, react_1.useState)([]);
    const tp = flag.filter((f) => SPOTS.find((s) => s.id === f)?.hazard).length;
    const fp = flag.length - tp;
    const hazScore = (0, sim_1.clamp)(tp * 10 - fp * 5, 0, 40);
    const ppeScore = (0, sim_1.clamp)(PPE.reduce((a, p) => a + ((ppe.includes(p.id) === p.ok) ? 1 : 0), 0) / PPE.length * 30, 0, 30);
    const qScore = ans.reduce((a, v, i) => a + (v === STOPQ[i].a ? 10 : 0), 0);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: ['找出危險點', '選擇 PPE', '停機通報判斷'], cur: step }),
        step === 0 && (react_1.default.createElement(common_1.Card, { title: "\u9EDE\u64CA\u4F60\u8A8D\u70BA\u6709\u5371\u96AA\u7684\u4F4D\u7F6E\uFF08\u53EF\u518D\u9EDE\u4E00\u6B21\u53D6\u6D88\uFF09", right: react_1.default.createElement("span", { className: "muted" },
                "\u5DF2\u6A19\u8A18 ",
                flag.length) },
            react_1.default.createElement(common_1.Hint, null, "\u5171\u6709 4 \u500B\u5371\u96AA\u9EDE\uFF0C\u4E5F\u6709 3 \u500B\u662F\u6B63\u78BA\u7684\u5B89\u5168\u8A2D\u65BD\u2014\u2014\u5225\u8AA4\u5224\u3002"),
            react_1.default.createElement("svg", { viewBox: "0 0 800 440", className: "scene" },
                react_1.default.createElement("defs", null,
                    react_1.default.createElement("linearGradient", { id: "fl", x1: "0", y1: "0", x2: "0", y2: "1" },
                        react_1.default.createElement("stop", { offset: "0", stopColor: "#1b2a48" }),
                        react_1.default.createElement("stop", { offset: "1", stopColor: "#0d1830" })),
                    react_1.default.createElement("linearGradient", { id: "mt", x1: "0", y1: "0", x2: "1", y2: "1" },
                        react_1.default.createElement("stop", { offset: "0", stopColor: "#9fb1c9" }),
                        react_1.default.createElement("stop", { offset: ".5", stopColor: "#5d6f8a" }),
                        react_1.default.createElement("stop", { offset: "1", stopColor: "#2c3a52" }))),
                react_1.default.createElement("rect", { width: "800", height: "440", fill: "url(#fl)" }),
                react_1.default.createElement("path", { d: "M0 260 L800 260", stroke: "#2e4470" }),
                react_1.default.createElement("path", { d: "M560 260 L800 260 L800 440 L520 440Z", fill: "#26324a" }),
                react_1.default.createElement("path", { d: "M560 300 L800 300 M545 360 L800 360", stroke: "#ffd23f", strokeDasharray: "20 12", strokeWidth: "4" }),
                react_1.default.createElement("text", { x: "690", y: "425", fill: "#ffd23f", fontSize: "14" }, "\u5806\u9AD8\u6A5F\u901A\u9053"),
                react_1.default.createElement("rect", { x: "70", y: "110", width: "170", height: "140", rx: "10", fill: "url(#mt)" }),
                react_1.default.createElement("rect", { x: "90", y: "130", width: "70", height: "80", fill: "#0b1426" }),
                react_1.default.createElement("circle", { cx: "125", cy: "170", r: "24", fill: "none", stroke: "#ff9a3c", strokeWidth: "4", className: "spin" }),
                react_1.default.createElement("rect", { x: "160", y: "128", width: "40", height: "70", fill: "#7f90a8", transform: "rotate(-35 160 128)", opacity: ".9" }),
                react_1.default.createElement("text", { x: "78", y: "270", fill: "#c8d2e0", fontSize: "13" }, "\u591A\u5DE5\u4F4D\u6253\u982D\u6A5F"),
                react_1.default.createElement("circle", { cx: "260", cy: "120", r: "14", fill: "#e33", stroke: "#ffd23f", strokeWidth: "4" }),
                react_1.default.createElement("rect", { x: "400", y: "140", width: "130", height: "110", rx: "8", fill: "url(#mt)" }),
                react_1.default.createElement("circle", { cx: "440", cy: "190", r: "16", fill: "#0b1426", stroke: "#39d5ff", strokeWidth: "3", className: "spin" }),
                react_1.default.createElement("text", { x: "410", y: "270", fill: "#c8d2e0", fontSize: "13" }, "\u6413\u7259\u6A5F"),
                react_1.default.createElement("circle", { cx: "500", cy: "150", r: "14", fill: "#eac09a" }),
                react_1.default.createElement("rect", { x: "486", y: "164", width: "28", height: "50", rx: "8", fill: "#3a7bd5" }),
                react_1.default.createElement("path", { d: "M486 180 L455 196", stroke: "#3a7bd5", strokeWidth: "12", strokeLinecap: "round" }),
                react_1.default.createElement("circle", { cx: "452", cy: "197", r: "7", fill: "#f4f0e0" }),
                react_1.default.createElement("ellipse", { cx: "360", cy: "360", rx: "48", ry: "16", fill: "#0a0a0a", opacity: ".75" }),
                react_1.default.createElement("ellipse", { cx: "350", cy: "356", rx: "16", ry: "5", fill: "#6a5acd", opacity: ".35" }),
                [0, 1, 2].map((i) => react_1.default.createElement("rect", { key: i, x: 610 + (i % 2) * 34, y: 300 - Math.floor(i / 2) * 30, width: "40", height: "30", fill: "#8a5a2b", stroke: "#c88a4b" })),
                react_1.default.createElement("rect", { x: "690", y: "100", width: "70", height: "80", fill: "#1e2f4f", stroke: "#7cf29c" }),
                react_1.default.createElement("path", { d: "M705 115 v40 M725 115 l10 40 M745 115 v30", stroke: "#c8d2e0", strokeWidth: "4" }),
                react_1.default.createElement("rect", { x: "40", y: "300", width: "20", height: "46", rx: "6", fill: "#e33" }),
                react_1.default.createElement("text", { x: "22", y: "365", fill: "#ff5d73", fontSize: "11" }, "\u6EC5\u706B\u5668"),
                SPOTS.map((s) => {
                    const on = flag.includes(s.id);
                    return (react_1.default.createElement("g", { key: s.id, onClick: () => setFlag(on ? flag.filter((x) => x !== s.id) : [...flag, s.id]), style: { cursor: 'pointer' } },
                        react_1.default.createElement("circle", { cx: s.x, cy: s.y, r: s.r, fill: on ? 'rgba(255,93,115,.25)' : 'rgba(255,255,255,0.001)', stroke: on ? '#ff5d73' : shown ? (s.hazard ? '#ff5d73' : '#7cf29c') : 'transparent', strokeWidth: "3", strokeDasharray: on ? '0' : '6 4' }),
                        on && react_1.default.createElement("text", { x: s.x, y: s.y - s.r - 6, textAnchor: "middle", fill: "#ff5d73", fontSize: "22" }, "\u26A0")));
                })),
            shown && react_1.default.createElement("ul", { className: "list" }, SPOTS.map((s) => react_1.default.createElement("li", { key: s.id, className: s.hazard ? 'bad' : 'good' },
                react_1.default.createElement("b", null,
                    s.hazard ? '危險' : '安全設施',
                    "\uFF5C",
                    s.label),
                "\uFF1A",
                s.why,
                " ",
                flag.includes(s.id) ? (s.hazard ? '✅ 你找到了' : '❌ 誤判') : s.hazard ? '❌ 漏掉了' : ''))),
            react_1.default.createElement("div", { className: "row end" }, !shown ? react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setShown(true) }, "\u78BA\u8A8D\u6A19\u8A18") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStep(1) },
                "\u4E0B\u4E00\u6B65\uFF1APPE\uFF08\u5F97\u5206 ",
                hazScore,
                "/40\uFF09")))),
        step === 1 && (react_1.default.createElement(common_1.Card, { title: "\u4ECA\u5929\u8981\u5230\u51B7\u935B\u8207\u6413\u7259\u5340\u4F5C\u696D\uFF0C\u9078\u64C7\u61C9\u914D\u6234\uFF0F\u61C9\u907F\u514D\u7684\u9805\u76EE" },
            react_1.default.createElement("div", { className: "chips" }, PPE.map((p) => react_1.default.createElement("button", { key: p.id, className: `chip ${ppe.includes(p.id) ? 'on' : ''}`, onClick: () => setPpe(ppe.includes(p.id) ? ppe.filter((x) => x !== p.id) : [...ppe, p.id]) },
                ppe.includes(p.id) ? '✔ ' : '',
                p.n))),
            react_1.default.createElement(common_1.Hint, null, "\u9078\u53D6\uFF1D\u6211\u6703\u914D\u6234\u3002\u65CB\u8F49\u6A5F\u53F0\u9644\u8FD1\u8981\u907F\u514D\u53EF\u80FD\u88AB\u6372\u5165\u7684\u7269\u54C1\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStep(2) }, "\u4E0B\u4E00\u6B65")))),
        step === 2 && (react_1.default.createElement(common_1.Card, { title: "\u4F55\u6642\u9700\u8981\u505C\u6A5F\u901A\u5831\uFF1F" },
            STOPQ.map((q, i) => (react_1.default.createElement("div", { key: i, className: "quiz" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement("b", null,
                        "\u60C5\u5883 ",
                        i + 1),
                    "\uFF1A",
                    q.q),
                react_1.default.createElement("div", { className: "opts" }, q.opts.map((o, j) => react_1.default.createElement("button", { key: j, className: `opt ${ans[i] === j ? (j === q.a ? 'right' : 'wrong') : ''}`, disabled: ans[i] !== undefined, onClick: () => { const a = [...ans]; a[i] = j; setAns(a); } }, o)))))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: ans.filter((x) => x !== undefined).length < 3, onClick: () => onDone({
                        score: Math.round(hazScore + ppeScore + qScore),
                        summary: [`危險辨識 ${hazScore}/40（找到 ${tp}/4、誤判 ${fp}）`, `PPE 判斷 ${ppeScore.toFixed(0)}/30`, `停機通報 ${qScore}/30`],
                        effect: { f: { training: Math.round(qScore / 10) } },
                    }) }, "\u5B8C\u6210\u8A13\u7DF4"))))));
}
const LOTS = [
    { id: 'L-2311-01', heat: 'H38812', cert: 'SCM435', tag: 'SCM435', dia: '9.20', look: '正常', supplier: '甲鋼廠', ok: 'accept', why: '材證、標籤、線徑一致，外觀正常。' },
    { id: 'L-2311-02', heat: 'H38815', cert: 'SCM435', tag: 'S45C', dia: '9.20', look: '正常', supplier: '丙鋼廠', ok: 'hold', why: '標籤鋼種與材證不符：可能混料，必須隔離並請供應商確認。' },
    { id: 'L-2311-03', heat: 'H38812', cert: 'SCM435', tag: 'SCM435', dia: '9.20', look: '表面鏽斑與刮痕', supplier: '甲鋼廠', ok: 'hold', why: '外觀異常可能影響冷鍛與表面品質，隔離待判（MRB）。' },
    { id: 'L-2311-04', heat: 'B20977', cert: '10B21', tag: '10B21', dia: '6.80', look: '正常', supplier: '甲鋼廠', ok: 'other', why: '這是套管螺絲訂單用的硼鋼，資料一致——允收並分配到正確訂單。' },
];
const LOT_OPTS = [{ id: 'accept', n: '允收：本訂單' }, { id: 'other', n: '允收：分配其他訂單' }, { id: 'hold', n: '隔離待判（MRB）' }, { id: 'reject', n: '直接退貨' }];
function TraceGame({ onDone }) {
    const [sel, setSel] = (0, react_1.useState)({});
    const [checked, setChecked] = (0, react_1.useState)(false);
    const [fill, setFill] = (0, react_1.useState)(null);
    const correct = LOTS.filter((l) => sel[l.id] === l.ok || (l.ok === 'hold' && sel[l.id] === 'reject' && l.id === 'L-2311-02')).length;
    const fillOpts = [
        { id: 'expedite', n: '請甲鋼廠加急補料（運費 NT$30,000，延遲 1 天）', s: 25, e: { funds: -30000 } },
        { id: 'wait', n: '等下週正常到貨（訂單延遲 5 天）', s: 10, e: { brand: -2 } },
        { id: 'use03', n: '直接使用 L-2311-03 鏽斑料', s: 0, e: { f: { latent: 0.0015 } } },
    ];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Card, { title: "\u8A02\u55AE\u9700\u6C42\uFF1A\u865B\u69CB A \u8ECA\u5EE0 M10 \u516D\u89D2\u87BA\u6813", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("p", { className: "muted" }, "\u9700\u6C42\u92FC\u7A2E SCM435\uFF08\u6559\u5B78\u8A2D\u5B9A\uFF09\u30FB\u7DDA\u5F91 \u00D89.20 mm\u30FB\u9700 2 \u6372\u3002\u53E6\u6709\u4E00\u5F35\u5957\u7BA1\u87BA\u7D72\u8A02\u55AE\u9700 10B21 \u00D86.80\u3002"),
            react_1.default.createElement("div", { className: "tbl-wrap" },
                react_1.default.createElement("table", { className: "tbl" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "\u6279\u865F"),
                            react_1.default.createElement("th", null, "\u7210\u865F"),
                            react_1.default.createElement("th", null, "\u6750\u8B49\u92FC\u7A2E"),
                            react_1.default.createElement("th", null, "\u6A19\u7C64\u92FC\u7A2E"),
                            react_1.default.createElement("th", null, "\u7DDA\u5F91"),
                            react_1.default.createElement("th", null, "\u5916\u89C0"),
                            react_1.default.createElement("th", null, "\u8655\u7F6E"))),
                    react_1.default.createElement("tbody", null, LOTS.map((l) => (react_1.default.createElement("tr", { key: l.id, className: checked ? (sel[l.id] === l.ok ? 'ok' : 'ng') : '' },
                        react_1.default.createElement("td", null,
                            l.id,
                            react_1.default.createElement("br", null),
                            react_1.default.createElement("small", null, l.supplier)),
                        react_1.default.createElement("td", null, l.heat),
                        react_1.default.createElement("td", null, l.cert),
                        react_1.default.createElement("td", { className: l.tag !== l.cert ? 'warn' : '' }, l.tag),
                        react_1.default.createElement("td", null, l.dia),
                        react_1.default.createElement("td", { className: l.look !== '正常' ? 'warn' : '' }, l.look),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("select", { value: sel[l.id] || '', disabled: checked, onChange: (e) => setSel({ ...sel, [l.id]: e.target.value }) },
                                react_1.default.createElement("option", { value: "" }, "\u2014 \u9078\u64C7 \u2014"),
                                LOT_OPTS.map((o) => react_1.default.createElement("option", { key: o.id, value: o.id }, o.n))),
                            checked && react_1.default.createElement("div", { className: "small" }, l.why)))))))),
            react_1.default.createElement(common_1.Hint, null, "\u300C\u4E09\u65B9\u4E00\u81F4\u300D\uFF1A\u6750\u8CEA\u8B49\u660E\uFF08Mill Certificate\uFF09\u3001\u5BE6\u7269\u6A19\u7C64\u3001\u8A02\u55AE\u9700\u6C42\u90FD\u8981\u5C0D\u5F97\u4E0A\uFF1B\u5916\u89C0\u7570\u5E38\u8981\u9694\u96E2\u5224\u5B9A\u3002"),
            !checked && react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: Object.keys(sel).length < 4, onClick: () => setChecked(true) }, "\u63D0\u4EA4\u8655\u7F6E"))),
        checked && (react_1.default.createElement(common_1.Card, { title: `缺料處理：符合本訂單的只有 ${LOTS.filter((l) => sel[l.id] === 'accept' && l.ok === 'accept').length} 捲，還差 1 捲` },
            react_1.default.createElement("div", { className: "opts" }, fillOpts.map((o) => react_1.default.createElement("button", { key: o.id, className: `opt ${fill === o.id ? 'on' : ''}`, onClick: () => setFill(o.id) }, o.n))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !fill, onClick: () => {
                        const f = fillOpts.find((x) => x.id === fill);
                        onDone({ score: Math.round(correct * 18.75 + f.s), summary: [`批號處置正確 ${correct}/4`, `缺料處置：${f.n}`, '可追溯性鏈：成品批號 → 熱處理爐次 → 冷鍛工單 → 盤元批號 → 爐號'], effect: f.e });
                    } }, "\u5B8C\u6210"))))));
}
const PARAM_MODELS = {
    forge: {
        title: '冷鍛參數設定（教學簡化模型，非實際機台參數）',
        sliders: [
            { id: 'speed', label: '生產速度（額定 %）', min: 70, max: 100, step: 1, def: 96, safe: [70, 92], unit: '%', tip: '速度越快產量越高，但模具磨耗與裂紋上升；超過 92% 屬於超出安全工作窗口。' },
            { id: 'maint', label: '模具保養週期（萬顆）', min: 2, max: 20, step: 1, def: 16, safe: [2, 20], unit: '萬顆', tip: '保養太勤增加停機；太久則磨耗導致頭部裂紋。' },
        ],
        choice: { id: 'seq', label: '換模排序', opts: ['依交期順序（換模 9 次／週）', '依產品族群分組（換模 5 次／週）'] },
        model: (v) => {
            const sp = v.speed / 100;
            const life = 13 - (sp - 0.8) * 25;
            const wear = Math.max(0, v.maint / life - 0.75);
            const yieldP = (0, sim_1.clamp)(0.992 - wear * 0.05 - Math.max(0, sp - 0.92) * 0.15, 0.8, 0.995);
            const setups = v.seq === 1 ? 5 : 9;
            const maintStops = 60 / v.maint;
            const downH = setups * 1.1 + maintStops * 0.6 + (wear > 0.2 ? 3 : 0);
            const runH = 80 - downH;
            const out = runH * 1000 * sp * yieldP;
            const cost = (80 * 3200 + maintStops * 9000 + out * 0.16 + (1 - yieldP) * out * 4) / Math.max(out, 1);
            return { cost, out, yieldP, metrics: [
                    { l: '模具預估壽命', v: `${life.toFixed(1)} 萬顆` }, { l: '每週停機（換模＋保養）', v: `${downH.toFixed(1)} h`, good: downH < 12 },
                    { l: '冷鍛良率', v: sim_1.fmt.pct(yieldP), good: yieldP > 0.985 }, { l: '週產出（良品）', v: sim_1.fmt.n(out) }, { l: '單位良品成本', v: `NT$${cost.toFixed(3)}` },
                ] };
        },
        effect: (v) => ({ st: { forge: { setupH: v.seq === 1 ? -0.25 : 0, Q: v.maint <= 10 ? 0.003 : -0.002, A: v.speed <= 92 ? 0.01 : -0.01 } } }),
    },
    heat: {
        title: '熱處理與表面處理設定（教學簡化模型，數值為虛構指數）',
        sliders: [
            { id: 'load', label: '爐內裝載率', min: 60, max: 100, step: 2, def: 98, safe: [60, 92], unit: '%', tip: '裝載率高省能源，但超過 92% 時爐內溫度均勻性變差。' },
            { id: 'wait', label: '湊批等待上限', min: 0, max: 12, step: 1, def: 10, safe: [0, 12], unit: 'h', tip: '等越久越容易湊滿一爐，但後段斷料、WIP 上升。' },
            { id: 'temp', label: '回火條件偏移（虛構指數）', min: -10, max: 10, step: 1, def: 5, safe: [-3, 3], unit: '', tip: '偏離基準會使硬度落在規格外；預置扭力螺帽尤其敏感（需與後續軸向沖壓配合）。' },
            { id: 'coat', label: '鍍層膜厚目標（虛構指數）', min: 4, max: 16, step: 1, def: 6, safe: [8, 12], unit: '', tip: '太薄防蝕不足、太厚摩擦係數不穩並影響螺紋配合。' },
        ],
        model: (v) => {
            const unif = v.load > 92 ? 1 - (v.load - 92) * 0.02 : 1;
            const hardOK = (0, sim_1.clamp)(Math.exp(-Math.pow(v.temp / 5, 2)) * unif, 0, 1);
            const coatOK = (0, sim_1.clamp)(1 - Math.pow(Math.max(0, Math.abs(v.coat - 10) - 1.5) / 5, 2), 0, 1);
            const yieldP = (0, sim_1.clamp)(0.995 * (0.9 + 0.1 * hardOK) * (0.94 + 0.06 * coatOK), 0.8, 0.995);
            const eff = (v.load / 100) * (1 - Math.max(0, 4 - v.wait) * 0.04);
            const wipH = v.wait * 0.8;
            const kwhPer = 0.32 / Math.max(0.5, v.load / 100);
            const out = 80 * 1200 * eff * yieldP;
            const cost = (out * kwhPer * 3.6 + 80 * 2600 + (1 - yieldP) * out * 6 + wipH * 2500) / Math.max(out, 1);
            return { cost, out, yieldP, metrics: [
                    { l: '硬度落在規格內機率', v: sim_1.fmt.pct(hardOK), good: hardOK > 0.9 }, { l: '膜厚／摩擦係數穩定度', v: sim_1.fmt.pct(coatOK), good: coatOK > 0.9 },
                    { l: '批次效率', v: sim_1.fmt.pct(eff) }, { l: '單位能耗', v: `${kwhPer.toFixed(3)} kWh` }, { l: '等待造成 WIP 時數', v: `${wipH.toFixed(1)} h`, good: wipH < 6 }, { l: '單位良品成本', v: `NT$${cost.toFixed(3)}` },
                ] };
        },
        effect: (v) => ({ st: { heat: { P: v.load >= 80 && v.load <= 92 ? 0.03 : 0, Q: Math.abs(v.temp) <= 3 ? 0.003 : -0.004 }, surface: { Q: v.coat >= 8 && v.coat <= 12 ? 0.003 : -0.003 } } }),
    },
};
function ParamGame({ cfg, onDone }) {
    const M = PARAM_MODELS[cfg];
    const init = {};
    M.sliders.forEach((s) => (init[s.id] = s.def));
    if (M.choice)
        init[M.choice.id] = 0;
    const [v, setV] = (0, react_1.useState)(init);
    const [tries, setTries] = (0, react_1.useState)(0);
    const r = M.model(v);
    const unsafe = M.sliders.filter((s) => v[s.id] < s.safe[0] || v[s.id] > s.safe[1]);
    const best = (0, react_1.useMemo)(() => {
        let b = Infinity;
        const grid = (i, cur) => {
            if (i === M.sliders.length) {
                const chs = M.choice ? [0, 1] : [0];
                for (const c of chs) {
                    const vv = { ...cur };
                    if (M.choice)
                        vv[M.choice.id] = c;
                    b = Math.min(b, M.model(vv).cost);
                }
                return;
            }
            const s = M.sliders[i];
            for (let x = s.safe[0]; x <= s.safe[1]; x += s.step)
                grid(i + 1, { ...cur, [s.id]: x });
        };
        grid(0, {});
        return b;
    }, [cfg]);
    const eff = (0, sim_1.clamp)(best / r.cost, 0, 1);
    const score = Math.round((0, sim_1.clamp)((eff - 0.7) / 0.3, 0, 1) * 85 + (unsafe.length ? 0 : 15) - unsafe.length * 15);
    return (react_1.default.createElement(common_1.Card, { title: M.title, right: react_1.default.createElement(common_1.SimTag, null) },
        react_1.default.createElement("div", { className: "grid2" },
            react_1.default.createElement("div", null,
                M.sliders.map((s) => {
                    const out = v[s.id] < s.safe[0] || v[s.id] > s.safe[1];
                    return (react_1.default.createElement("div", { key: s.id, className: "slider" },
                        react_1.default.createElement("label", null,
                            s.label,
                            react_1.default.createElement("b", { className: out ? 'red' : '' },
                                v[s.id],
                                s.unit)),
                        react_1.default.createElement("div", { className: "safe-track" },
                            react_1.default.createElement("div", { className: "safe-zone", style: { left: `${((s.safe[0] - s.min) / (s.max - s.min)) * 100}%`, width: `${((s.safe[1] - s.safe[0]) / (s.max - s.min)) * 100}%` } }),
                            react_1.default.createElement("input", { type: "range", min: s.min, max: s.max, step: s.step, value: v[s.id], onChange: (e) => setV({ ...v, [s.id]: +e.target.value }), "aria-label": s.label })),
                        react_1.default.createElement("div", { className: "row sm" },
                            react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setV({ ...v, [s.id]: Math.max(s.min, v[s.id] - s.step) }) }, "\u2212"),
                            react_1.default.createElement("small", { className: "muted" }, s.tip),
                            react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setV({ ...v, [s.id]: Math.min(s.max, v[s.id] + s.step) }) }, "\uFF0B")),
                        out && react_1.default.createElement("div", { className: "warnbox" },
                            "\u26A0 \u8D85\u51FA\u5B89\u5168\u5DE5\u4F5C\u7A97\u53E3\uFF08\u7DA0\u8272\u5340\u57DF ",
                            s.safe[0],
                            "\uFF5E",
                            s.safe[1],
                            s.unit,
                            "\uFF09")));
                }),
                M.choice && react_1.default.createElement("div", { className: "slider" },
                    react_1.default.createElement("label", null, M.choice.label),
                    react_1.default.createElement("div", { className: "opts" }, M.choice.opts.map((o, i) => react_1.default.createElement("button", { key: i, className: `opt ${v[M.choice.id] === i ? 'on' : ''}`, onClick: () => setV({ ...v, [M.choice.id]: i }) }, o))))),
            react_1.default.createElement("div", null,
                react_1.default.createElement("div", { className: "metric-list" }, r.metrics.map((m) => react_1.default.createElement("div", { key: m.l },
                    react_1.default.createElement("span", null, m.l),
                    react_1.default.createElement("b", { className: m.good === true ? 'green' : m.good === false ? 'red' : '' }, m.v)))),
                react_1.default.createElement(common_1.Meter, { label: "\u8207\u6700\u4F73\u89E3\u7684\u6210\u672C\u6548\u7387", right: sim_1.fmt.pct(eff, 0), v: eff, color: "var(--green)" }),
                react_1.default.createElement(common_1.Hint, null, "\u76EE\u6A19\uFF1A\u5728\u7DA0\u8272\u5B89\u5168\u7A97\u53E3\u5167\uFF0C\u8B93\u300C\u55AE\u4F4D\u826F\u54C1\u6210\u672C\u300D\u6700\u4F4E\u3002\u7522\u91CF\u6700\u9AD8\u4E0D\u4E00\u5B9A\u6700\u597D\u3002"),
                tries > 0 && react_1.default.createElement("p", { className: "small muted" },
                    "\u5DF2\u8A66\u7B97 ",
                    tries,
                    " \u6B21"),
                react_1.default.createElement("div", { className: "row end" },
                    react_1.default.createElement(common_1.Btn, { onClick: () => setTries(tries + 1) }, "\u8A66\u7B97\u4E00\u6B21"),
                    react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => onDone({
                            score: (0, sim_1.clamp)(score, 0, 100), summary: [`成本效率 ${sim_1.fmt.pct(eff, 0)}（相對安全窗口內最佳解）`, unsafe.length ? `⚠ ${unsafe.length} 項參數超出安全窗口，已扣分` : '所有參數皆在安全窗口內', `良率 ${sim_1.fmt.pct(r.yieldP)}`],
                            effect: M.effect(v), extra: { unsafe: unsafe.length },
                        }) }, "\u78BA\u8A8D\u8A2D\u5B9A"))))));
}
const DEF_N = { ok: '良品', crack: '頭部裂紋', burr: '毛邊', missing: '缺牙', deform: '牙型變形', sleeve: '套管脫落' };
function FastenerSVG({ kind, defect, zoom, seed }) {
    const r = (0, sim_1.mulberry32)(seed);
    const jitter = () => (r() - 0.5) * 2;
    if (kind === 'nut') {
        const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${60 + 46 * Math.cos(a)},${60 + 46 * Math.sin(a)}`; }).join(' ');
        return (react_1.default.createElement("svg", { viewBox: "0 0 120 120", className: `fast ${zoom ? 'zoom' : ''}` },
            react_1.default.createElement("defs", null,
                react_1.default.createElement("radialGradient", { id: `ng${seed}` },
                    react_1.default.createElement("stop", { offset: "0", stopColor: "#d6dde8" }),
                    react_1.default.createElement("stop", { offset: "1", stopColor: "#6c7a90" }))),
            react_1.default.createElement("polygon", { points: pts, fill: `url(#ng${seed})`, stroke: "#3b475c", strokeWidth: "2" }),
            react_1.default.createElement("circle", { cx: "60", cy: "60", r: "20", fill: "#0b1426" }),
            Array.from({ length: 5 }, (_, i) => react_1.default.createElement("circle", { key: i, cx: "60", cy: "60", r: 14 + i * 1.4, fill: "none", stroke: "#7d8aa0", strokeWidth: ".8", strokeDasharray: defect === 'missing' && i > 1 ? '20 12' : defect === 'deform' ? `${6 + i} 3` : undefined })),
            defect === 'crack' && react_1.default.createElement("path", { d: `M${60 + 22} 52 l8 ${4 + jitter()} l6 -3 l8 6`, stroke: "#111", strokeWidth: "2", fill: "none" }),
            defect === 'burr' && [0, 1, 2].map((i) => react_1.default.createElement("path", { key: i, d: `M${18 + i * 4} ${48 + i * 9} l-7 ${2 + jitter()}`, stroke: "#e8edf5", strokeWidth: "2" }))));
    }
    const threads = Array.from({ length: 13 }, (_, i) => i);
    return (react_1.default.createElement("svg", { viewBox: "0 0 120 120", className: `fast ${zoom ? 'zoom' : ''}` },
        react_1.default.createElement("defs", null,
            react_1.default.createElement("linearGradient", { id: `bg${seed}`, x1: "0", y1: "0", x2: "1", y2: "0" },
                react_1.default.createElement("stop", { offset: "0", stopColor: "#5d6b80" }),
                react_1.default.createElement("stop", { offset: ".45", stopColor: "#e3e9f2" }),
                react_1.default.createElement("stop", { offset: "1", stopColor: "#4d5a6e" }))),
        react_1.default.createElement("rect", { x: "36", y: "8", width: "48", height: "20", rx: "3", fill: `url(#bg${seed})`, stroke: "#3b475c" }),
        react_1.default.createElement("rect", { x: "48", y: "28", width: "24", height: "84", fill: `url(#bg${seed})`, stroke: "#3b475c" }),
        threads.map((i) => {
            const y = 48 + i * 5;
            if (defect === 'missing' && i >= 5 && i <= 7)
                return null;
            const d = defect === 'deform' && i >= 4 && i <= 8 ? jitter() * 3 : 0;
            return react_1.default.createElement("path", { key: i, d: `M46 ${y} L74 ${y + 3 + d}`, stroke: "#3b475c", strokeWidth: "1.6" });
        }),
        kind === 'css' && defect !== 'sleeve' && react_1.default.createElement("rect", { x: "44", y: "30", width: "32", height: "14", rx: "2", fill: "#b98a3a", stroke: "#6b4e1a", opacity: ".92" }),
        kind === 'css' && defect === 'sleeve' && react_1.default.createElement("rect", { x: "88", y: "90", width: "22", height: "12", rx: "2", fill: "#b98a3a", stroke: "#6b4e1a", transform: "rotate(25 99 96)" }),
        defect === 'crack' && react_1.default.createElement("path", { d: `M${50 + jitter() * 4} 9 l4 7 l-3 4 l5 7`, stroke: "#0b0b0b", strokeWidth: "2", fill: "none" }),
        defect === 'burr' && [0, 1, 2].map((i) => react_1.default.createElement("path", { key: i, d: `M84 ${11 + i * 5} l7 ${1 + jitter()}`, stroke: "#eef3fa", strokeWidth: "2.2" }))));
}
const INSPECT_CFG = {
    thread: { kinds: ['bolt', 'nut'], defects: ['ok', 'ok', 'ok', 'missing', 'deform', 'crack', 'burr'], n: 12, title: '放大檢驗台：螺栓與螺帽' },
    optical: { kinds: ['css', 'bolt'], defects: ['ok', 'ok', 'ok', 'sleeve', 'crack', 'burr', 'missing'], n: 12, title: '光學檢驗：套管螺絲與螺栓' },
    label: { kinds: ['bolt', 'css'], defects: ['ok', 'ok', 'crack', 'burr', 'missing', 'sleeve'], n: 8, title: 'AI 資料標註' },
};
function makeItems(cfg, seed) {
    const c = INSPECT_CFG[cfg];
    const r = (0, sim_1.mulberry32)(seed);
    return Array.from({ length: c.n }, (_, i) => {
        const kind = c.kinds[Math.floor(r() * c.kinds.length)];
        let defect = c.defects[Math.floor(r() * c.defects.length)];
        if (defect === 'sleeve' && kind !== 'css')
            defect = 'missing';
        if (kind === 'nut' && defect === 'deform')
            defect = 'missing';
        return { i, kind, defect, seed: seed * 31 + i };
    });
}
function InspectGame({ cfg, onDone }) {
    const { g } = (0, common_1.useG)();
    const C = INSPECT_CFG[cfg];
    const items = (0, react_1.useMemo)(() => makeItems(cfg, g.seed + (cfg === 'thread' ? 3 : 5)), [cfg]);
    const [phase, setPhase] = (0, react_1.useState)(cfg === 'thread' ? 0 : 1);
    const [quiz, setQuiz] = (0, react_1.useState)([]);
    const [idx, setIdx] = (0, react_1.useState)(0);
    const [labels, setLabels] = (0, react_1.useState)([]);
    const [zoom, setZoom] = (0, react_1.useState)(false);
    const [th, setTh] = (0, react_1.useState)(0.5);
    const cats = Array.from(new Set(['ok', ...C.defects]));
    const rA = (0, sim_1.mulberry32)(g.seed + 99);
    const ai = (0, react_1.useMemo)(() => items.map((it) => (rA() < (it.defect === 'ok' ? 0.94 : 0.86) ? it.defect : it.defect === 'ok' ? 'burr' : 'ok')), [items]);
    const human = labels.filter((l, i) => l === items[i].defect).length;
    const aiCorrect = ai.filter((l, i) => l === items[i].defect).length;
    const missH = labels.filter((l, i) => l === 'ok' && items[i].defect !== 'ok').length;
    const det = (0, sim_1.clamp)(0.995 - Math.pow(th, 2.2) * 0.25, 0.5, 0.995);
    const fr = (0, sim_1.clamp)(0.06 * Math.exp(-th * 4.2) + 0.002, 0.002, 0.2);
    const weekCost = (1 - det) * 300 * 600 + fr * 55000 * 0.6 + 5000;
    const bestCost = (0, react_1.useMemo)(() => { let b = Infinity; for (let t = 0.1; t <= 0.9; t += 0.01) {
        const d = (0, sim_1.clamp)(0.995 - Math.pow(t, 2.2) * 0.25, 0.5, 0.995), f = (0, sim_1.clamp)(0.06 * Math.exp(-t * 4.2) + 0.002, 0.002, 0.2);
        b = Math.min(b, (1 - d) * 300 * 600 + f * 55000 * 0.6 + 5000);
    } return b; }, []);
    const Q3 = [{ q: '螺栓的外螺紋通常以哪種方式成形？', o: ['攻牙（Tapping）', '搓牙（Thread Rolling）', '銑削'], a: 1 }, { q: '螺帽的內螺紋通常以哪種方式加工？', o: ['攻牙（Tapping）', '搓牙（Thread Rolling）', '熱鍛'], a: 0 }];
    const finish = () => {
        const acc = human / items.length;
        let score = Math.round(acc * 70 + (missH === 0 ? 10 : 0));
        const summary = [`人工判定正確 ${human}/${items.length}（漏檢 ${missH}）`, `AI 模擬判定正確 ${aiCorrect}/${items.length}（教學模擬，非真實模型）`];
        let effect = {};
        if (cfg === 'thread') {
            const q = quiz.filter((v, i) => v === Q3[i].a).length;
            score += q * 10;
            summary.unshift(`搓牙／攻牙辨識 ${q}/2`);
            effect = { st: { thread: { Q: acc > 0.8 ? 0.003 : 0 } } };
        }
        else {
            const eff = bestCost / weekCost;
            score = Math.round(acc * 55 + (0, sim_1.clamp)((eff - 0.6) / 0.4, 0, 1) * 35 + (missH === 0 ? 10 : 0));
            summary.push(`光學門檻 ${th.toFixed(2)}：檢出率 ${sim_1.fmt.pct(det)}、誤判率 ${sim_1.fmt.pct(fr)}、週檢驗相關成本 ${sim_1.fmt.nt(weekCost)}`);
            effect = { f: { detect: det - 0.92, falseReject: fr - 0.02 } };
        }
        onDone({ score: (0, sim_1.clamp)(score, 0, 100), summary, effect });
    };
    return (react_1.default.createElement("div", null,
        phase === 0 && (react_1.default.createElement(common_1.Card, { title: "\u5148\u78BA\u8A8D\u89C0\u5FF5\uFF1A\u5916\u87BA\u7D0B vs \u5167\u87BA\u7D0B" },
            Q3.map((q, i) => react_1.default.createElement("div", { key: i, className: "quiz" },
                react_1.default.createElement("p", null, q.q),
                react_1.default.createElement("div", { className: "opts" }, q.o.map((o, j) => react_1.default.createElement("button", { key: j, className: `opt ${quiz[i] === j ? (j === q.a ? 'right' : 'wrong') : ''}`, disabled: quiz[i] !== undefined, onClick: () => { const a = [...quiz]; a[i] = j; setQuiz(a); } }, o))))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: quiz.length < 2 || quiz.includes(undefined), onClick: () => setPhase(1) }, "\u958B\u59CB\u6AA2\u9A57")))),
        phase === 1 && (react_1.default.createElement(common_1.Card, { title: `${C.title}（${Math.min(idx + 1, items.length)}/${items.length}）`, right: react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setZoom(!zoom) }, zoom ? '🔍 縮小' : '🔍 放大') },
            react_1.default.createElement("div", { className: "inspect" },
                react_1.default.createElement("div", { className: "lens", onClick: () => setZoom(!zoom) },
                    react_1.default.createElement(FastenerSVG, { kind: items[idx].kind, defect: items[idx].defect, zoom: zoom, seed: items[idx].seed }),
                    react_1.default.createElement("span", { className: "lens-tag" }, items[idx].kind === 'nut' ? '螺帽（俯視）' : items[idx].kind === 'css' ? '套管螺絲' : '六角螺栓')),
                react_1.default.createElement("div", { className: "opts col" }, cats.map((c) => react_1.default.createElement("button", { key: c, className: "opt", onClick: () => { const l = [...labels]; l[idx] = c; setLabels(l); setZoom(false); if (idx < items.length - 1)
                        setIdx(idx + 1);
                    else
                        setPhase(2); } }, DEF_N[c])))),
            react_1.default.createElement(common_1.Hint, null,
                "\u9EDE\u64CA\u5F71\u50CF\u53EF\u653E\u5927\u3002\u6CE8\u610F\u982D\u90E8\u908A\u7DE3\u3001\u87BA\u7D0B\u9023\u7E8C\u6027",
                cfg === 'optical' ? '、套管是否在位' : '',
                "\u3002"),
            idx > 0 && react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setIdx(idx - 1) }, "\u2190 \u4E0A\u4E00\u9846"))),
        phase === 2 && (react_1.default.createElement(common_1.Card, { title: "\u5224\u5B9A\u7D50\u679C\uFF1A\u4F60 vs AI \u6A21\u64EC\uFF08\u6559\u5B78\u6A21\u64EC\uFF09" },
            react_1.default.createElement("div", { className: "thumbs" }, items.map((it, i) => (react_1.default.createElement("div", { key: i, className: `thumb ${labels[i] === it.defect ? 'ok' : 'ng'}` },
                react_1.default.createElement(FastenerSVG, { kind: it.kind, defect: it.defect, seed: it.seed }),
                react_1.default.createElement("small", null,
                    "\u7B54\u6848\uFF1A",
                    DEF_N[it.defect],
                    react_1.default.createElement("br", null),
                    "\u4F60\uFF1A",
                    DEF_N[labels[i]],
                    react_1.default.createElement("br", null),
                    "AI\uFF1A",
                    DEF_N[ai[i]]))))),
            react_1.default.createElement("p", null,
                "\u4F60\u6B63\u78BA ",
                react_1.default.createElement("b", null, human),
                "\uFF0FAI \u6A21\u64EC\u6B63\u78BA ",
                react_1.default.createElement("b", null, aiCorrect),
                "\u3002",
                missH > 0 ? `你有 ${missH} 顆漏檢（把不良判為良品）——漏檢會直接流到客戶。` : '沒有漏檢，很好！'),
            react_1.default.createElement("div", { className: "row end" }, cfg === 'optical' ? react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setPhase(3) }, "\u4E0B\u4E00\u6B65\uFF1A\u8A2D\u5B9A\u5149\u5B78\u9580\u6ABB") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: finish }, "\u5B8C\u6210")))),
        phase === 3 && (react_1.default.createElement(common_1.Card, { title: "\u5149\u5B78\u7BE9\u9078\u9580\u6ABB\uFF1A\u6AA2\u51FA\u7387 vs \u8AA4\u5224\u7387", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("div", { className: "slider" },
                react_1.default.createElement("label", null,
                    "\u5224\u5B9A\u9580\u6ABB\uFF08\u8D8A\u4F4E\u8D8A\u56B4\u683C\uFF09",
                    react_1.default.createElement("b", null, th.toFixed(2))),
                react_1.default.createElement("input", { type: "range", min: 0.1, max: 0.9, step: 0.01, value: th, onChange: (e) => setTh(+e.target.value), "aria-label": "\u9580\u6ABB" }),
                react_1.default.createElement("div", { className: "row sm" },
                    react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setTh(Math.max(0.1, +(th - 0.02).toFixed(2))) }, "\u2212"),
                    react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setTh(Math.min(0.9, +(th + 0.02).toFixed(2))) }, "\uFF0B"))),
            react_1.default.createElement("div", { className: "grid3" },
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u6AA2\u51FA\u7387"),
                    react_1.default.createElement("div", { className: "kpi-v" }, sim_1.fmt.pct(det))),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u8AA4\u5224\u7387"),
                    react_1.default.createElement("div", { className: "kpi-v" }, sim_1.fmt.pct(fr))),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u9031\u6AA2\u9A57\u76F8\u95DC\u6210\u672C"),
                    react_1.default.createElement("div", { className: "kpi-v" }, sim_1.fmt.nt(weekCost)),
                    react_1.default.createElement("div", { className: "kpi-s" }, "\u6F0F\u6AA2\u5BA2\u8A34\uFF0B\u4EBA\u5DE5\u8907\u5224"))),
            react_1.default.createElement(common_1.Hint, null, "\u6BCF\u6F0F\u4E00\u9846\u4E0D\u826F\u5230\u5BA2\u6236\u7AEF\uFF0C\u6A21\u64EC\u6210\u672C\u9060\u9AD8\u65BC\u4EBA\u5DE5\u8907\u5224\u4E00\u9846\u8AA4\u5224\u54C1\u3002\u627E\u51FA\u7E3D\u6210\u672C\u6700\u4F4E\u7684\u9580\u6ABB\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: finish }, "\u5957\u7528\u9580\u6ABB"))))));
}
const STN = [
    { id: 'forge', n: '冷鍛', need: 3, min: 2, rate: 1000, risk: true }, { id: 'thread', n: '搓牙／攻牙', need: 3, min: 2, rate: 850, risk: true },
    { id: 'heat', n: '熱處理', need: 2, min: 1, rate: 1200, risk: false, partial: 0.85 }, { id: 'surface', n: '表面處理', need: 2, min: 1, rate: 950, risk: false, partial: 0.7 },
    { id: 'assembly', n: '套管組裝', need: 2, min: 1, rate: 900, risk: false, partial: 0.6 }, { id: 'optical', n: '光學檢驗', need: 2, min: 1, rate: 880, risk: false, partial: 0.75 },
];
const OPS = [
    { id: 'a', n: '阿明', c: ['forge', 'thread'], f: 30 }, { id: 'b', n: '小芳', c: ['optical', 'assembly'], f: 20 }, { id: 'c', n: '志明', c: ['forge'], f: 35 },
    { id: 'd', n: '雅婷', c: ['surface', 'heat'], f: 25 }, { id: 'e', n: '建國', c: ['forge', 'thread', 'heat'], f: 40 }, { id: 'f', n: '淑惠', c: ['assembly', 'optical'], f: 35 },
    { id: 'g', n: '俊傑（新人）', c: ['assembly'], f: 15 }, { id: 'h', n: '怡君', c: ['thread', 'optical'], f: 30 }, { id: 'i', n: '家銘', c: ['heat', 'surface'], f: 50 },
    { id: 'j', n: '宗翰', c: ['thread'], f: 45 }, { id: 'k', n: '佩珊', c: ['surface', 'optical'], f: 20 }, { id: 'l', n: '國華', c: ['forge', 'heat'], f: 82 },
];
function CrewGame({ onDone }) {
    const [asg, setAsg] = (0, react_1.useState)({});
    const [pick, setPick] = (0, react_1.useState)(null);
    const [lead, setLead] = (0, react_1.useState)(false);
    const staffed = (sid) => Object.values(asg).filter((s) => s === sid).length + (lead && sid === 'thread' ? 1 : 0);
    const issues = [];
    const cap = STN.map((s) => {
        const n = staffed(s.id);
        let fac = n >= s.need ? 1 : n >= s.min ? (s.partial ?? (n / s.need)) : 0;
        const ops = OPS.filter((o) => asg[o.id] === s.id);
        const unc = ops.filter((o) => !o.c.includes(s.id));
        const tired = ops.filter((o) => o.f > 70);
        if (unc.length) {
            fac *= 0.8;
            issues.push(`${s.n}：${unc.map((o) => o.n).join('、')} 未取得該站認證${s.risk ? '（高風險設備，違反規定）' : ''}`);
        }
        if (tired.length && s.risk)
            issues.push(`${s.n}：${tired.map((o) => o.n).join('、')} 疲勞度過高，不應排在高風險站`);
        return { ...s, cnt: n, fac, eff: s.rate * fac * (s.id === 'assembly' ? 5 : 1) };
    });
    const line = Math.min(...cap.map((c) => c.eff));
    const maxLine = 850;
    const bott = cap.reduce((m, c) => (c.eff < m.eff ? c : m), cap[0]);
    const hazardViol = issues.filter((x) => x.includes('違反') || x.includes('高風險站')).length;
    const tap = (opId) => { setPick(pick === opId ? null : opId); };
    const tapStation = (sid) => { if (!pick)
        return; setAsg({ ...asg, [pick]: sid }); setPick(null); };
    const score = Math.round((0, sim_1.clamp)(line / maxLine, 0, 1) * 70 + (hazardViol ? 0 : 20) + (lead ? 5 : 10) - hazardViol * 10);
    return (react_1.default.createElement(common_1.Card, { title: "\u591C\u73ED\u4EBA\u529B\u914D\u7F6E\uFF0812 \u4EBA\u5230\u73ED\uFF0C\u9700\u6C42 14 \u4EBA\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
        react_1.default.createElement(common_1.Hint, null, "\u5148\u9EDE\u4F5C\u696D\u54E1\uFF0C\u518D\u9EDE\u5DE5\u4F5C\u7AD9\u6307\u6D3E\u3002\u53EF\u7528 \u21A9 \u53D6\u6D88\u3002\u74F6\u9838\u7AD9\uFF08\u6413\u7259\uFF09\u8981\u512A\u5148\u88DC\u8DB3\uFF1B\u75B2\u52DE\u8005\u4E0D\u6392\u9AD8\u98A8\u96AA\u7AD9\u3002"),
        react_1.default.createElement("div", { className: "crew" },
            react_1.default.createElement("div", { className: "ops" }, OPS.map((o) => (react_1.default.createElement("button", { key: o.id, className: `op ${pick === o.id ? 'on' : ''} ${asg[o.id] ? 'used' : ''}`, onClick: () => tap(o.id) },
                react_1.default.createElement("b", null, o.n),
                react_1.default.createElement("small", null,
                    "\u8A8D\u8B49\uFF1A",
                    o.c.map((c) => STN.find((s) => s.id === c).n).join('、')),
                react_1.default.createElement(common_1.Meter, { v: o.f, max: 100, color: o.f > 70 ? 'var(--red)' : 'var(--green)', right: `疲勞 ${o.f}` }),
                asg[o.id] && react_1.default.createElement("span", { className: "op-at" },
                    "\u2192 ",
                    STN.find((s) => s.id === asg[o.id]).n,
                    " ",
                    react_1.default.createElement("a", { onClick: (e) => { e.stopPropagation(); const a = { ...asg }; delete a[o.id]; setAsg(a); } }, "\u21A9")))))),
            react_1.default.createElement("div", { className: "stns" }, cap.map((s) => (react_1.default.createElement("div", { key: s.id, className: `stn ${pick ? 'target' : ''} ${s.id === bott.id ? 'bott' : ''}`, onClick: () => tapStation(s.id), role: "button" },
                react_1.default.createElement("b", null, s.n),
                s.risk && react_1.default.createElement(common_1.Tag, { color: "var(--orange)" }, "\u9AD8\u98A8\u96AA"),
                react_1.default.createElement("div", null,
                    s.cnt,
                    "\uFF0F",
                    s.need,
                    " \u4EBA ",
                    react_1.default.createElement("small", null,
                        "(\u6700\u5C11 ",
                        s.min,
                        ")")),
                react_1.default.createElement(common_1.Meter, { v: s.eff, max: 1200, right: `${sim_1.fmt.n(s.eff)} 顆/h`, color: s.id === bott.id ? 'var(--red)' : 'var(--cyan)' })))))),
        react_1.default.createElement("label", { className: "check" },
            react_1.default.createElement("input", { type: "checkbox", checked: lead, onChange: (e) => setLead(e.target.checked) }),
            " \u9818\u73ED\uFF08\u4F60\uFF09\u89AA\u81EA\u652F\u63F4\u6413\u7259\u7AD9 1 \u4EBA\uFF08\u4F46\u4ECA\u665A\u7121\u6CD5\u9032\u884C\u6539\u5584\u8207\u5DE1\u6AA2\uFF09"),
        issues.length > 0 && react_1.default.createElement("ul", { className: "list" }, issues.map((i) => react_1.default.createElement("li", { key: i, className: "bad" }, i))),
        react_1.default.createElement("div", { className: "row between" },
            react_1.default.createElement("div", null,
                "\u7522\u7DDA\u7522\u51FA\uFF08\u74F6\u9838\u6C7A\u5B9A\uFF09\uFF1A",
                react_1.default.createElement("b", null,
                    sim_1.fmt.n(line),
                    " \u9846/h"),
                "\uFF0F\u74F6\u9838\uFF1A",
                react_1.default.createElement("b", { className: "red" }, bott.n)),
            react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: Object.keys(asg).length < 8, onClick: () => onDone({ score: (0, sim_1.clamp)(score, 0, 100), summary: [`產線產出 ${sim_1.fmt.n(line)} 顆/h（理想 ${maxLine}）`, `瓶頸站：${bott.n}`, hazardViol ? `⚠ 安全／人因違規 ${hazardViol} 項` : '無安全與人因違規'], effect: { st: { thread: { A: line >= 800 ? 0.01 : 0 } }, f: { training: 3 } }, extra: { leader: hazardViol === 0 } }) }, "\u78BA\u8A8D\u6392\u73ED"))));
}

};
factories["./games/cim.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIMGame = CIMGame;
exports.PhoenixGame = PhoenixGame;
const react_1 = __importStar(require("react"));
const common_1 = require("../ui/common");
const sim_1 = require("../sim");
const NODES = [
    { id: 'sensor', n: '設備感測器', x: 80, y: 370, layer: 'OT' }, { id: 'plc', n: 'PLC／IoT／SCADA', x: 80, y: 240, layer: 'OT' },
    { id: 'mes', n: 'MES', x: 300, y: 240, layer: 'MOM' }, { id: 'qms', n: 'QMS', x: 300, y: 370, layer: 'MOM' }, { id: 'cmms', n: 'CMMS', x: 300, y: 110, layer: 'MOM' },
    { id: 'wms', n: 'WMS', x: 510, y: 370, layer: 'IT' }, { id: 'erp', n: 'ERP', x: 510, y: 240, layer: 'IT' }, { id: 'aps', n: 'APS', x: 510, y: 110, layer: 'IT' },
    { id: 'ai', n: 'AI 分析', x: 700, y: 170, layer: 'IT' }, { id: 'twin', n: '數位孿生', x: 700, y: 320, layer: 'IT' },
];
const REQ = ['sensor-plc', 'plc-mes', 'mes-qms', 'mes-wms', 'erp-wms', 'erp-mes', 'aps-erp', 'aps-mes', 'ai-mes', 'ai-twin', 'mes-twin', 'cmms-mes'];
const BAD = { 'erp-plc': 'ERP 直接連 PLC：跨越 OT／IT 分層，任何商業系統都不應直接寫入控制層。', 'ai-plc': 'AI 直接控制 PLC：AI 不可任意修改生產參數。', 'erp-sensor': '感測器原始資料直送 ERP：缺少 MES 的批號脈絡與資料治理。', 'aps-plc': 'APS 直接下指令到 PLC：排程應經 MES 派工。' };
const key = (a, b) => [a, b].sort().join('-');
const MAP = [{ m: 'lot_no', a: '批號（Lot）' }, { m: 'wo_id', a: '工單號' }, { m: 'qty_good', a: '完工入庫數量' }, { m: 'scrap_qty', a: '報廢數量' }];
const ERPF = ['批號（Lot）', '工單號', '完工入庫數量', '報廢數量', '採購單號', '客戶料號'];
function CIMGame({ onDone }) {
    const [step, setStep] = (0, react_1.useState)(0);
    const [edges, setEdges] = (0, react_1.useState)([]);
    const [sel, setSel] = (0, react_1.useState)(null);
    const [checked, setChecked] = (0, react_1.useState)(false);
    const [mp, setMp] = (0, react_1.useState)({});
    const [fix, setFix] = (0, react_1.useState)(null);
    const [sec, setSec] = (0, react_1.useState)(null);
    const tap = (id) => {
        if (checked)
            return;
        if (!sel) {
            setSel(id);
            return;
        }
        if (sel === id) {
            setSel(null);
            return;
        }
        const k = key(sel, id);
        setEdges(edges.includes(k) ? edges.filter((e) => e !== k) : [...edges, k]);
        setSel(null);
    };
    const ok = edges.filter((e) => REQ.includes(e)), bad = edges.filter((e) => BAD[e]), extra = edges.filter((e) => !REQ.includes(e) && !BAD[e]);
    const P = (id) => NODES.find((n) => n.id === id);
    const FIX = [
        { t: '循環盤點＋比對 MES 報工與 WMS 異動，修正「組裝完工未扣套管」的報工規則', s: 15 },
        { t: '直接把 ERP 數字改成盤點數', s: 5 },
        { t: '叫物管每天手動對帳', s: 3 },
    ];
    const SEC = [
        { t: 'OT 與 IT 間設置 DMZ，MES 經閘道單向收集設備資料；寫入走核准流程', s: 15 },
        { t: '全部系統放在同一網段，比較好連', s: 0 },
        { t: 'OT 網路完全隔離，不收集任何資料', s: 4 },
    ];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: ['系統拓樸', '欄位映射', '修復資料不一致', 'OT／IT 資安'], cur: step }),
        step === 0 && (react_1.default.createElement(common_1.Card, { title: "\u9EDE\u9078\u5169\u500B\u7BC0\u9EDE\u5EFA\u7ACB\uFF08\u6216\u79FB\u9664\uFF09\u8CC7\u6599\u6D41", right: react_1.default.createElement("span", { className: "muted" },
                "\u5DF2\u9023 ",
                edges.length,
                " \u689D") },
            react_1.default.createElement(common_1.Hint, null, "\u7531\u4E0B\u800C\u4E0A\uFF1A\u8A2D\u5099 \u2192 \u63A7\u5236\u5C64 \u2192 \u88FD\u9020\u71DF\u904B\uFF08MES/QMS/CMMS\uFF09\u2192 \u4F01\u696D\u5C64\uFF08ERP/WMS/APS\uFF09\u2192 \u5206\u6790\u8207\u6578\u4F4D\u5B7F\u751F\u3002\u9700\u8981 12 \u689D\u6B63\u78BA\u9023\u7DDA\uFF0C\u907F\u514D\u8DE8\u5C64\u76F4\u9023\u3002"),
            react_1.default.createElement("svg", { viewBox: "0 0 800 420", className: "scene cimg" },
                react_1.default.createElement("rect", { x: "10", y: "190", width: "150", height: "220", rx: "12", className: "zone ot" }),
                react_1.default.createElement("text", { x: "20", y: "208", className: "zl" }, "OT \u63A7\u5236\u5C64"),
                react_1.default.createElement("rect", { x: "220", y: "70", width: "170", height: "340", rx: "12", className: "zone mom" }),
                react_1.default.createElement("text", { x: "230", y: "88", className: "zl" }, "\u88FD\u9020\u71DF\u904B\u5C64"),
                react_1.default.createElement("rect", { x: "430", y: "70", width: "360", height: "340", rx: "12", className: "zone it" }),
                react_1.default.createElement("text", { x: "440", y: "88", className: "zl" }, "\u4F01\u696D\uFF0F\u5206\u6790\u5C64"),
                edges.map((e) => { const [a, b] = e.split('-'); const A = P(a), B = P(b); const cls = REQ.includes(e) ? (checked ? 'e ok' : 'e') : BAD[e] ? (checked ? 'e bad' : 'e') : checked ? 'e extra' : 'e'; return react_1.default.createElement("line", { key: e, x1: A.x, y1: A.y, x2: B.x, y2: B.y, className: cls }); }),
                checked && REQ.filter((r) => !edges.includes(r)).map((e) => { const [a, b] = e.split('-'); const A = P(a), B = P(b); return react_1.default.createElement("line", { key: e, x1: A.x, y1: A.y, x2: B.x, y2: B.y, className: "e miss" }); }),
                NODES.map((n) => react_1.default.createElement("g", { key: n.id, onClick: () => tap(n.id), style: { cursor: 'pointer' } },
                    react_1.default.createElement("rect", { x: n.x - 62, y: n.y - 22, width: "124", height: "44", rx: "10", className: `node ${sel === n.id ? 'sel' : ''}` }),
                    react_1.default.createElement("text", { x: n.x, y: n.y + 5, textAnchor: "middle", className: "nl" }, n.n)))),
            checked && react_1.default.createElement("ul", { className: "list" },
                react_1.default.createElement("li", { className: "good" },
                    "\u6B63\u78BA\u9023\u7DDA ",
                    ok.length,
                    "/12",
                    REQ.length - ok.length ? `（虛線為缺少的連線）` : ''),
                bad.map((b) => react_1.default.createElement("li", { key: b, className: "bad" }, BAD[b])),
                extra.length > 0 && react_1.default.createElement("li", null,
                    "\u5176\u4ED6\u9023\u7DDA ",
                    extra.length,
                    " \u689D\uFF1A\u4E0D\u4E00\u5B9A\u932F\uFF0C\u4F46\u589E\u52A0\u4ECB\u9762\u7DAD\u8B77\u6210\u672C\u3002")),
            react_1.default.createElement("div", { className: "row end" }, !checked ? react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: edges.length < 6, onClick: () => setChecked(true) }, "\u9A57\u8B49\u62D3\u6A38") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStep(1) }, "\u4E0B\u4E00\u6B65")))),
        step === 1 && (react_1.default.createElement(common_1.Card, { title: "MES \u2192 ERP \u6B04\u4F4D\u6620\u5C04\uFF08\u5831\u5DE5\u62CB\u8F49\uFF09" },
            MAP.map((m) => react_1.default.createElement("div", { key: m.m, className: "row between qrow" },
                react_1.default.createElement("code", null,
                    "MES.",
                    m.m),
                react_1.default.createElement("span", null, "\u2192"),
                react_1.default.createElement("select", { value: mp[m.m] || '', onChange: (e) => setMp({ ...mp, [m.m]: e.target.value }) },
                    react_1.default.createElement("option", { value: "" }, "\u2014"),
                    ERPF.map((f) => react_1.default.createElement("option", { key: f }, f))))),
            react_1.default.createElement(common_1.Hint, null, "\u5831\u5DE5\u62CB\u8F49\u8981\u8B93\u6279\u865F\u3001\u5DE5\u55AE\u3001\u826F\u54C1\u8207\u5831\u5EE2\u6578\u91CF\u5C0D\u5F97\u4E0A\uFF0C\u624D\u80FD\u505A\u751F\u7522\u5C65\u6B77\u8207\u6210\u672C\u8A08\u7B97\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: Object.keys(mp).length < 4, onClick: () => setStep(2) }, "\u4E0B\u4E00\u6B65")))),
        step === 2 && (react_1.default.createElement(common_1.Card, { title: "ERP \u5957\u7BA1\u5EAB\u5B58 12,000\uFF0C\u73FE\u5834\u5BE6\u76E4 9,800\u3002\u600E\u9EBC\u4FEE\uFF1F" },
            react_1.default.createElement("div", { className: "opts col" }, FIX.map((f, i) => react_1.default.createElement("button", { key: i, className: `opt ${fix === i ? 'on' : ''}`, onClick: () => setFix(i) }, f.t))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: fix === null, onClick: () => setStep(3) }, "\u4E0B\u4E00\u6B65")))),
        step === 3 && (react_1.default.createElement(common_1.Card, { title: "OT\uFF0FIT \u8CC7\u5B89\u8207\u6B0A\u9650" },
            react_1.default.createElement("div", { className: "opts col" }, SEC.map((f, i) => react_1.default.createElement("button", { key: i, className: `opt ${sec === i ? 'on' : ''}`, onClick: () => setSec(i) }, f.t))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: sec === null, onClick: () => {
                        const mapOk = MAP.filter((m) => mp[m.m] === m.a).length;
                        const score = ok.length / 12 * 40 - bad.length * 8 - Math.max(0, extra.length - 2) * 2 + mapOk * 5 + FIX[fix].s + SEC[sec].s;
                        onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`系統拓樸正確 ${ok.length}/12、跨層違規 ${bad.length}`, `欄位映射 ${mapOk}/4`, `帳料不符：${FIX[fix].s >= 15 ? '找出系統性原因 ✔' : '僅治標'}`, `資安：${SEC[sec].s >= 15 ? 'DMZ 分層 ✔' : '設計不足'}`],
                            effect: { f: { dataQuality: (ok.length / 12) * 0.12 + (fix === 0 ? 0.04 : 0) }, addRisk: sec === 1 ? 'OT 網路與辦公網路未分區' : undefined }, extra: { sync: mapOk === 4 } });
                    } }, "\u5B8C\u6210\u6574\u5408"))))));
}
function PhoenixGame({ onDone, sandbox }) {
    const { g } = (0, common_1.useG)();
    const [ids, setIds] = (0, react_1.useState)([]);
    const [runs, setRuns] = (0, react_1.useState)([]);
    const [shown, setShown] = (0, react_1.useState)(null);
    const [hint, setHint] = (0, react_1.useState)(0);
    const cost = (0, sim_1.phoenixCost)(ids);
    const ev = (0, react_1.useMemo)(() => (shown ? (0, sim_1.evaluatePhoenix)(shown) : null), [shown]);
    const base = (0, react_1.useMemo)(() => (0, sim_1.evaluatePhoenix)([]), []);
    const cats = Array.from(new Set(sim_1.PHOENIX_OPTIONS.map((o) => o.cat)));
    const HINTS = ['先看初始瓶頸站是哪一站（下方負荷圖紅色）。改善非瓶頸站不會增加產出。', '重大工安風險必須先解除，這不是可選項目。', '能用「改善既有設備」解決的，未必要買新機台；但若產能缺口仍在，短期加班或提高可用率都是選項（注意疲勞）。', 'PPM 可以從源頭降低潛在缺陷，也可以提升檢出率——比較兩者的成本。'];
    const toggle = (id) => setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("div", { className: "grid-phx" },
            react_1.default.createElement(common_1.Card, { title: "\u6539\u5584\u65B9\u6848\u7D44\u5408", right: react_1.default.createElement(common_1.SimTag, null) },
                react_1.default.createElement(common_1.Meter, { label: "\u6295\u8CC7\uFF08CAPEX\uFF0B\u4E00\u5B63 OPEX\uFF09", right: `${sim_1.fmt.wan(cost.total)}／${sim_1.fmt.wan(sim_1.PHOENIX_BUDGET)}`, v: cost.total, max: sim_1.PHOENIX_BUDGET, danger: sim_1.PHOENIX_BUDGET, color: "var(--orange)" }),
                cats.map((c) => (react_1.default.createElement("div", { key: c, className: "optgrp" },
                    react_1.default.createElement("h4", null, c),
                    sim_1.PHOENIX_OPTIONS.filter((o) => o.cat === c).map((o) => (react_1.default.createElement("label", { key: o.id, className: `check plan ${ids.includes(o.id) ? 'on' : ''}` },
                        react_1.default.createElement("input", { type: "checkbox", checked: ids.includes(o.id), onChange: () => toggle(o.id) }),
                        react_1.default.createElement("span", null,
                            react_1.default.createElement("b", null, o.name),
                            react_1.default.createElement("small", null, o.desc)),
                        react_1.default.createElement("span", { className: "price" },
                            o.capex ? `CAPEX ${sim_1.fmt.wan(o.capex)}` : '',
                            o.opex ? ` OPEX ${sim_1.fmt.wan(o.opex)}/週` : '',
                            !o.capex && !o.opex ? '營運調整' : ''))))))),
                react_1.default.createElement("div", { className: "row end sticky-b" },
                    react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => { setShown([...ids]); const e = (0, sim_1.evaluatePhoenix)(ids); setRuns([...runs, { ids: [...ids], score: e.score, passed: e.passed }]); } }, "\u25B6 \u6A21\u64EC\u4E00\u9031\uFF08\u7A2E\u5B50 \u56FA\u5B9A\uFF09"))),
            react_1.default.createElement("div", null,
                react_1.default.createElement(common_1.Card, { title: "\u521D\u59CB\u72C0\u614B\uFF08\u6539\u5584\u524D\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
                    react_1.default.createElement("div", { className: "grid4" },
                        react_1.default.createElement(common_1.Kpi, { label: "\u5168\u7DDA OEE", value: sim_1.fmt.pct(base.before.oee) }),
                        react_1.default.createElement(common_1.Kpi, { label: "OTIF", value: sim_1.fmt.pct(base.before.otif) }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u55AE\u4F4D\u826F\u54C1\u6210\u672C", value: `NT$${base.before.costPerGood.toFixed(2)}` }),
                        react_1.default.createElement(common_1.Kpi, { label: "PPM", value: base.before.ppm.toFixed(0) })),
                    react_1.default.createElement("p", { className: "small" },
                        "\u9700\u6C42 ",
                        sim_1.fmt.n(base.before.demandTotal),
                        " \u9846\uFF0F\u9031\u30FB\u826F\u54C1\u7522\u51FA ",
                        sim_1.fmt.n(base.before.goodTotal),
                        "\u30FB\u74F6\u9838 ",
                        react_1.default.createElement("b", { className: "red" }, sim_1.STATION_INFO[base.before.bottleneck].name),
                        "\u30FB\u672A\u89E3\u6C7A\u5DE5\u5B89\u98A8\u96AA\uFF1A\u51B7\u935B\u5340\u5B89\u5168\u5149\u67F5\u9593\u6B47\u5931\u6548"),
                    react_1.default.createElement(common_1.Bars, { data: base.before.stations.map((s) => ({ label: sim_1.STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.load > 1 ? '#ff5d73' : '#39d5ff' })), line: 1, lineLabel: "\u7522\u80FD 100%", fmtv: (v) => `${(v * 100).toFixed(0)}%`, h: 150 }),
                    g.settings.hints && react_1.default.createElement("div", { className: "row" },
                        react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setHint(Math.min(HINTS.length, hint + 1)) },
                            "\uD83D\uDCA1 \u63D0\u793A\uFF08",
                            hint,
                            "/",
                            HINTS.length,
                            "\uFF09")),
                    HINTS.slice(0, hint).map((h) => react_1.default.createElement("div", { key: h, className: "hint" }, h))),
                ev && (react_1.default.createElement(common_1.Card, { title: `模擬結果：達成 ${ev.passed}/7 項目標・綜合評分 ${ev.score}` },
                    react_1.default.createElement("ul", { className: "targets" }, ev.targets.map((t) => react_1.default.createElement("li", { key: t.id, className: t.ok ? 'ok' : 'ng' },
                        t.ok ? '✅' : '❌',
                        " ",
                        t.label,
                        react_1.default.createElement("b", null, t.val)))),
                    react_1.default.createElement("div", { className: "grid4" },
                        react_1.default.createElement(common_1.Kpi, { label: "OEE", value: sim_1.fmt.pct(ev.after.oee), delta: `${((ev.after.oee - ev.before.oee) * 100).toFixed(1)}pt` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u826F\u54C1\u7522\u51FA", value: sim_1.fmt.n(ev.after.goodTotal), delta: `${ev.after.goodTotal >= ev.before.goodTotal ? '+' : ''}${sim_1.fmt.n(ev.after.goodTotal - ev.before.goodTotal)}` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u55AE\u4F4D\u6210\u672C", value: `NT$${ev.after.costPerGood.toFixed(2)}` }),
                        react_1.default.createElement(common_1.Kpi, { label: "\u4F30\u8A08 ROI", value: ev.cost.total ? (ev.roi > 5 ? '>500%' : sim_1.fmt.pct(ev.roi, 0)) : '—', sub: "\u5E74\u5316\uFF0CCAPEX \u4EE5 5 \u5E74\u8A08" })),
                    react_1.default.createElement("p", { className: "small" },
                        "\u74F6\u9838\uFF1A",
                        sim_1.STATION_INFO[ev.before.bottleneck].name,
                        " \u2192 ",
                        react_1.default.createElement("b", null, sim_1.STATION_INFO[ev.after.bottleneck].name),
                        ev.before.bottleneck !== ev.after.bottleneck ? '（瓶頸已轉移！）' : '',
                        "\u30FB\u75B2\u52DE\u6307\u6578 ",
                        ev.after.fatigue.toFixed(0),
                        "\u30FB\u55AE\u4F4D\u80FD\u8017 ",
                        ev.after.energyPerUnit.toFixed(3),
                        " kWh"),
                    react_1.default.createElement(common_1.Bars, { data: ev.after.stations.map((s) => ({ label: sim_1.STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.load > 1 ? '#ff5d73' : s.id === ev.after.bottleneck ? '#ffd23f' : '#39d5ff' })), line: 1, lineLabel: "\u7522\u80FD 100%", fmtv: (v) => `${(v * 100).toFixed(0)}%`, h: 150 }),
                    !sandbox && react_1.default.createElement("div", { className: "row end" },
                        react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => onDone({ score: ev.score, summary: [`達成 ${ev.passed}/7 項目標`, `投資 ${sim_1.fmt.wan(ev.cost.total)}、估計年節省 ${sim_1.fmt.wan(ev.annualSaving)}`], extra: { ids: shown, runs: runs.length } }) }, "\u63D0\u4EA4\u6700\u7D42\u65B9\u6848\u4E26\u7522\u751F\u5831\u544A")))),
                runs.length > 1 && react_1.default.createElement(common_1.Card, { title: "\u6A21\u64EC\u7D00\u9304\uFF08\u76F8\u540C\u7A2E\u5B50\u53EF\u6BD4\u8F03\uFF09" },
                    react_1.default.createElement("ol", { className: "small" }, runs.map((r, i) => react_1.default.createElement("li", { key: i },
                        "\u7B2C ",
                        i + 1,
                        " \u6B21\uFF1A",
                        r.passed,
                        "/7 \u76EE\u6A19\u30FB",
                        r.score,
                        " \u5206\u30FB",
                        r.ids.length,
                        " \u9805\u65B9\u6848"))))))));
}

};
factories["./games/office.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleGame = ScheduleGame;
exports.SPCGame = SPCGame;
exports.SupplyGame = SupplyGame;
exports.DataGame = DataGame;
const react_1 = __importStar(require("react"));
const common_1 = require("../ui/common");
const sim_1 = require("../sim");
const ORDERS = [
    { id: 'O1', prod: 'HB', size: 'M8', qty: 12000, due: 3 }, { id: 'O2', prod: 'HB', size: 'M10', qty: 9000, due: 4 },
    { id: 'O3', prod: 'CSS', size: 'M6', qty: 8000, due: 5 }, { id: 'O4', prod: 'HB', size: 'M8', qty: 6000, due: 2 },
    { id: 'O5', prod: 'PTN', size: 'M10', qty: 10000, due: 4 }, { id: 'O6', prod: 'HB', size: 'M10', qty: 5000, due: 2, urgent: true },
    { id: 'O7', prod: 'PTN', size: 'M8', qty: 4000, due: 5 },
];
const MACH = [{ id: 'R1', n: '搓牙機 A', rate: 425, ok: ['HB', 'CSS'] }, { id: 'R2', n: '搓牙機 B', rate: 425, ok: ['HB', 'CSS'] }, { id: 'T1', n: '攻牙機 C', rate: 400, ok: ['PTN'] }];
const PN = { HB: '六角螺栓', PTN: '防鬆螺帽', CSS: '套管螺絲' };
const PC = { HB: '#39d5ff', PTN: '#ffd23f', CSS: '#b78cff' };
function schedule(lanes) {
    const res = {};
    let setupTot = 0, onTimeQty = 0, totalQty = 0, flowSum = 0, n = 0;
    for (const m of MACH) {
        let t = 0, prevFam = '';
        res[m.id] = [];
        for (const oid of lanes[m.id] || []) {
            const o = ORDERS.find((x) => x.id === oid);
            const fam = o.prod + o.size;
            const setup = !prevFam ? 1 : prevFam === fam ? 0.3 : 1.5;
            const start = t;
            t += setup;
            const end = t + o.qty / m.rate;
            t = end;
            prevFam = fam;
            const late = end > o.due * 16 || end > 80;
            setupTot += setup;
            if (!late)
                onTimeQty += o.qty;
            flowSum += end;
            n++;
            res[m.id].push({ id: oid, start, setup, end, late });
        }
    }
    ORDERS.forEach((o) => (totalQty += o.qty));
    const placed = Object.values(lanes).flat().length;
    return { res, setupTot, otif: onTimeQty / totalQty, avgFlow: n ? flowSum / n : 0, placed };
}
function ScheduleGame({ onDone }) {
    const [lanes, setLanes] = (0, react_1.useState)({ R1: [], R2: [], T1: [] });
    const [pick, setPick] = (0, react_1.useState)(null);
    const [err, setErr] = (0, react_1.useState)('');
    const [step, setStep] = (0, react_1.useState)(0);
    const [qty, setQty] = (0, react_1.useState)(2000);
    const [mode, setMode] = (0, react_1.useState)('');
    const sch = schedule(lanes);
    const unplaced = ORDERS.filter((o) => !Object.values(lanes).flat().includes(o.id));
    const place = (oid, mid) => {
        const o = ORDERS.find((x) => x.id === oid);
        const m = MACH.find((x) => x.id === mid);
        if (!m.ok.includes(o.prod)) {
            setErr(`${m.n} 無法加工${PN[o.prod]}（${o.prod === 'PTN' ? '內螺紋需攻牙' : '外螺紋需搓牙'}）`);
            return;
        }
        setErr('');
        const nl = {};
        for (const k of Object.keys(lanes))
            nl[k] = lanes[k].filter((x) => x !== oid);
        nl[mid] = [...nl[mid], oid];
        setLanes(nl);
        setPick(null);
    };
    const move = (mid, i, d) => { const l = [...lanes[mid]]; const j = i + d; if (j < 0 || j >= l.length)
        return; [l[i], l[j]] = [l[j], l[i]]; setLanes({ ...lanes, [mid]: l }); };
    const remove = (mid, oid) => setLanes({ ...lanes, [mid]: lanes[mid].filter((x) => x !== oid) });
    const urgentOk = !sch.res.R1.concat(sch.res.R2).find((x) => x.id === 'O6')?.late && Object.values(lanes).flat().includes('O6');
    const gross = 8000, onHand = 5000, ss = 1000, net = gross - onHand + ss;
    const W = 80;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: ['有限產能排程', 'MRP 物料需求'], cur: step }),
        step === 0 && (react_1.default.createElement(common_1.Card, { title: "\u628A\u8A02\u55AE\u62D6\u66F3\uFF08\u6216\u9EDE\u9078\uFF09\u5230\u6A5F\u53F0\u6392\u7A0B\u8868", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement(common_1.Hint, null, "\u76F8\u540C\u7522\u54C1\u65CF\u7FA4\uFF08\u540C\u7522\u54C1\u540C\u5C3A\u5BF8\uFF09\u63A5\u8457\u505A\uFF0C\u63DB\u7DDA\u53EA\u8981 0.3 h\uFF1B\u4E0D\u540C\u65CF\u7FA4 1.5 h\u3002\u4E00\u5929 16 \u5C0F\u6642\uFF08\u5169\u73ED\uFF09\uFF0C\u9031\u4E00 0 h \u958B\u59CB\u3002O6 \u662F\u63D2\u55AE\u6025\u55AE\u3002"),
            react_1.default.createElement("div", { className: "orders" },
                unplaced.map((o) => (react_1.default.createElement("button", { key: o.id, draggable: true, onDragStart: (e) => e.dataTransfer.setData('text', o.id), className: `ord ${pick === o.id ? 'on' : ''}`, style: { borderColor: PC[o.prod] }, onClick: () => setPick(pick === o.id ? null : o.id) },
                    react_1.default.createElement("b", null, o.id),
                    " ",
                    o.urgent && react_1.default.createElement(common_1.Tag, { color: "var(--red)" }, "\u6025\u55AE"),
                    react_1.default.createElement("br", null),
                    PN[o.prod],
                    " ",
                    o.size,
                    react_1.default.createElement("br", null),
                    react_1.default.createElement("small", null,
                        sim_1.fmt.n(o.qty),
                        " \u9846\u30FB\u4EA4\u671F D",
                        o.due)))),
                !unplaced.length && react_1.default.createElement("span", { className: "muted" }, "\u5168\u90E8\u8A02\u55AE\u5DF2\u6392\u5165 \u2714")),
            err && react_1.default.createElement("div", { className: "warnbox" }, err),
            react_1.default.createElement("div", { className: "gantt" },
                react_1.default.createElement("div", { className: "g-axis" }, [0, 1, 2, 3, 4, 5].map((d) => react_1.default.createElement("span", { key: d, style: { left: `${(d * 16 / W) * 100}%` } },
                    "D",
                    d + 1 > 5 ? '' : d + 1))),
                MACH.map((m) => (react_1.default.createElement("div", { key: m.id, className: `lane ${pick ? 'target' : ''}`, onDragOver: (e) => e.preventDefault(), onDrop: (e) => { e.preventDefault(); place(e.dataTransfer.getData('text'), m.id); }, onClick: () => pick && place(pick, m.id) },
                    react_1.default.createElement("div", { className: "lane-n" },
                        m.n,
                        react_1.default.createElement("small", null,
                            m.rate,
                            " \u9846/h")),
                    react_1.default.createElement("div", { className: "lane-t" },
                        [1, 2, 3, 4].map((d) => react_1.default.createElement("i", { key: d, className: "dayline", style: { left: `${(d * 16 / W) * 100}%` } })),
                        sch.res[m.id].map((b) => {
                            const o = ORDERS.find((x) => x.id === b.id);
                            return (react_1.default.createElement(react_1.default.Fragment, { key: b.id },
                                react_1.default.createElement("div", { className: "blk setup", style: { left: `${(b.start / W) * 100}%`, width: `${(b.setup / W) * 100}%` }, title: "\u63DB\u7DDA" }),
                                react_1.default.createElement("div", { className: `blk ${b.late ? 'late' : ''}`, style: { left: `${((b.start + b.setup) / W) * 100}%`, width: `${Math.max(2, ((b.end - b.start - b.setup) / W) * 100)}%`, background: PC[o.prod] }, title: `${b.id} 完成 ${b.end.toFixed(1)}h` }, b.id)));
                        }),
                        sch.res[m.id].length > 0 && sch.res[m.id][sch.res[m.id].length - 1].end > W && react_1.default.createElement("div", { className: "overflow" }, "\u8D85\u51FA\u672C\u9031\u7522\u80FD")),
                    react_1.default.createElement("div", { className: "lane-ops" }, lanes[m.id].map((oid, i) => react_1.default.createElement("span", { key: oid, className: "mini" },
                        oid,
                        react_1.default.createElement("a", { onClick: (e) => { e.stopPropagation(); move(m.id, i, -1); } }, "\u25C0"),
                        react_1.default.createElement("a", { onClick: (e) => { e.stopPropagation(); move(m.id, i, 1); } }, "\u25B6"),
                        react_1.default.createElement("a", { onClick: (e) => { e.stopPropagation(); remove(m.id, oid); } }, "\u2715")))))))),
            react_1.default.createElement("div", { className: "grid4" },
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "OTIF\uFF08\u6578\u91CF\u52A0\u6B0A\uFF09"),
                    react_1.default.createElement("div", { className: "kpi-v", style: { color: sch.otif >= 0.95 ? 'var(--green)' : 'var(--orange)' } }, sim_1.fmt.pct(sch.otif))),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u63DB\u7DDA\u7E3D\u6642\u6578"),
                    react_1.default.createElement("div", { className: "kpi-v" },
                        sch.setupTot.toFixed(1),
                        " h")),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u5E73\u5747\u5B8C\u5DE5\u6642\u9593"),
                    react_1.default.createElement("div", { className: "kpi-v" },
                        sch.avgFlow.toFixed(1),
                        " h")),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u6025\u55AE O6"),
                    react_1.default.createElement("div", { className: "kpi-v" }, urgentOk ? '準時' : '未準時'))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: unplaced.length > 0, onClick: () => setStep(1) }, "\u4E0B\u4E00\u6B65\uFF1AMRP")))),
        step === 1 && (react_1.default.createElement(common_1.Card, { title: "MRP\uFF1A\u5957\u7BA1\u87BA\u7D72 O3 \u7684\u5957\u7BA1\u9700\u6C42", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("div", { className: "bom" },
                react_1.default.createElement("div", { className: "bom-n" }, "\u5957\u7BA1\u87BA\u7D72 \u00D71"),
                react_1.default.createElement("div", { className: "bom-c" },
                    react_1.default.createElement("div", null, "\u87BA\u7D72\u672C\u9AD4 \u00D71\uFF08\u81EA\u88FD\uFF09"),
                    react_1.default.createElement("div", null, "\u5957\u7BA1 \u00D71\uFF08\u5916\u8CFC\uFF09"))),
            react_1.default.createElement("div", { className: "metric-list" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u6BDB\u9700\u6C42\uFF08O3 \u6578\u91CF \u00D7 1\uFF09"),
                    react_1.default.createElement("b", null, sim_1.fmt.n(gross))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u73FE\u6709\u5EAB\u5B58"),
                    react_1.default.createElement("b", null, sim_1.fmt.n(onHand))),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5728\u9014\u91CF"),
                    react_1.default.createElement("b", null, "0")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("span", null, "\u5B89\u5168\u5EAB\u5B58"),
                    react_1.default.createElement("b", null, sim_1.fmt.n(ss)))),
            react_1.default.createElement("div", { className: "slider" },
                react_1.default.createElement("label", null,
                    "\u63A1\u8CFC\u6578\u91CF",
                    react_1.default.createElement("b", null, sim_1.fmt.n(qty))),
                react_1.default.createElement("div", { className: "row" },
                    react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setQty(Math.max(0, qty - 500)) }, "\u2212500"),
                    react_1.default.createElement("input", { type: "range", min: 0, max: 10000, step: 500, value: qty, onChange: (e) => setQty(+e.target.value), "aria-label": "\u63A1\u8CFC\u6578\u91CF" }),
                    react_1.default.createElement(common_1.Btn, { small: true, onClick: () => setQty(Math.min(10000, qty + 500)) }, "\uFF0B500"))),
            react_1.default.createElement("p", null, "\u7D44\u88DD\u9700\u5728 D4 \u524D\u5099\u6599\u3002"),
            react_1.default.createElement("div", { className: "opts" },
                react_1.default.createElement("button", { className: `opt ${mode === 'normal' ? 'on' : ''}`, onClick: () => setMode('normal') }, "\u4E00\u822C\u63A1\u8CFC\uFF1A\u4EA4\u671F 5 \u5929\uFF0CNT$1.2/\u500B"),
                react_1.default.createElement("button", { className: `opt ${mode === 'exp' ? 'on' : ''}`, onClick: () => setMode('exp') }, "\u6025\u4EF6\u63A1\u8CFC\uFF1A\u4EA4\u671F 2 \u5929\uFF0CNT$2.0/\u500B")),
            react_1.default.createElement(common_1.Hint, null, "\u6DE8\u9700\u6C42 \uFF1D \u6BDB\u9700\u6C42 \u2212 \u5EAB\u5B58 \u2212 \u5728\u9014 \uFF0B \u5B89\u5168\u5EAB\u5B58\u3002\u4EA4\u671F\u4E5F\u8981\u80FD\u8D95\u4E0A\u7D44\u88DD\u6642\u9593\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: !mode, onClick: () => {
                        const qOk = qty === net ? 15 : Math.abs(qty - net) <= 1000 ? 8 : 0;
                        const mOk = mode === 'exp' ? 10 : 0;
                        const setupScore = (0, sim_1.clamp)((14 - sch.setupTot) / 7, 0, 1) * 20;
                        const score = Math.round(sch.otif * 45 + setupScore + (urgentOk ? 10 : 0) + qOk + mOk);
                        onDone({ score: (0, sim_1.clamp)(score, 0, 100), summary: [`排程 OTIF ${sim_1.fmt.pct(sch.otif)}、換線 ${sch.setupTot.toFixed(1)} h、急單${urgentOk ? '準時' : '延誤'}`, `MRP 淨需求 ${sim_1.fmt.n(net)}，你採購 ${sim_1.fmt.n(qty)}（${mode === 'exp' ? '急件，趕得上' : '一般，交期趕不上 D4'}）`],
                            effect: { funds: -(qty * (mode === 'exp' ? 2 : 1.2)) * 0.2 | 0, st: { thread: { setupH: sch.setupTot < 9 ? -0.15 : 0 } }, f: { dataQuality: 0.02 } } });
                    } }, "\u63D0\u4EA4\u6392\u7A0B\u8207\u63A1\u8CFC"))))));
}
function genSPC(seed) {
    const r = (0, sim_1.mulberry32)(seed);
    const gauss = () => { let u = 0, v = 0; while (!u)
        u = r(); while (!v)
        v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const groups = Array.from({ length: 30 }, (_, i) => Array.from({ length: 5 }, () => 10 + (i >= 18 ? 0.55 : 0) + gauss() * 0.3));
    const xbar = groups.map((g) => g.reduce((a, b) => a + b, 0) / 5);
    const R = groups.map((g) => Math.max(...g) - Math.min(...g));
    const base = xbar.slice(0, 15), Rb = R.slice(0, 15);
    const xbb = base.reduce((a, b) => a + b, 0) / 15, rbar = Rb.reduce((a, b) => a + b, 0) / 15;
    const ucl = xbb + 0.577 * rbar, lcl = xbb - 0.577 * rbar;
    const sig = [];
    xbar.forEach((v, i) => { if (v > ucl || v < lcl)
        sig.push(i); });
    let run = 0;
    xbar.forEach((v, i) => { run = v > xbb ? (run > 0 ? run + 1 : 1) : (run < 0 ? run - 1 : -1); if (Math.abs(run) >= 8 && !sig.includes(i))
        sig.push(i); });
    const stat = (arr) => { const all = arr.flat(); const m = all.reduce((a, b) => a + b, 0) / all.length; const sd = Math.sqrt(all.reduce((a, b) => a + (b - m) ** 2, 0) / (all.length - 1)); return { m, sd, cp: (11.2 - 8.8) / (6 * sd), cpk: Math.min(11.2 - m, m - 8.8) / (3 * sd) }; };
    return { xbar, ucl, lcl, xbb, sig: sig.sort((a, b) => a - b), before: stat(groups.slice(0, 18)), after: stat(groups.slice(18)) };
}
const QCQA = [
    { t: '首件檢驗與巡檢紀錄', a: 'QC' }, { t: '建立供應商稽核計畫', a: 'QA' }, { t: '判定一批扭力超規產品', a: 'QC' },
    { t: '修訂 FMEA 與管制計畫', a: 'QA' }, { t: '執行 SPC 量測與管制圖繪製', a: 'QC' }, { t: '主導內部品質系統稽核', a: 'QA' },
];
function SPCGame({ onDone }) {
    const { g } = (0, common_1.useG)();
    const d = (0, react_1.useMemo)(() => genSPC(g.seed + 8), []);
    const [step, setStep] = (0, react_1.useState)(0);
    const [marks, setMarks] = (0, react_1.useState)([]);
    const [checked, setChecked] = (0, react_1.useState)(false);
    const [pareto, setPareto] = (0, react_1.useState)(null);
    const [causes, setCauses] = (0, react_1.useState)([]);
    const [plan, setPlan] = (0, react_1.useState)(null);
    const [qa, setQa] = (0, react_1.useState)({});
    const tp = marks.filter((m) => d.sig.includes(m)).length, fp = marks.length - tp;
    const spcScore = (0, sim_1.clamp)(Math.round((tp / Math.max(1, d.sig.length)) * 30 - fp * 4), 0, 30);
    const PD = [{ l: '扭力偏高', v: 48 }, { l: '牙紋損傷', v: 12 }, { l: '外觀刮傷', v: 9 }, { l: '尺寸', v: 5 }, { l: '其他', v: 3 }];
    const FISH = { 人: ['夜班交接'], 機: ['沖壓機壓力漂移'], 料: ['新盤元批號 H-2307'], 法: ['沖壓條件未依硬度分級'], 環: ['廠內溫度'], 測: ['扭力計校正逾期'] };
    const PLANS = [
        { t: '數據顯示夜班時異常，直接判定為夜班人員疏失', ok: 0, why: '時間上的相關不等於因果，而且新批號也同時出現。' },
        { t: '在同一機台、同一班別，以 H-2307 與舊批號對照試產，並量測熱處理後硬度與扭力（控制其他變因）', ok: 20, why: '設計對照實驗驗證假說，正是「相關≠因果」的正確作法。' },
        { t: '立即更換盤元供應商', ok: 4, why: '尚未驗證就採取昂貴對策，可能找錯原因。' },
        { t: '先進行 MSA 確認扭力計可信，再進行對照試驗', ok: 18, why: '先確認量測系統是好習慣，但仍需接著做對照實驗。' },
    ];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: ['管制圖判讀', 'Cp/Cpk 與柏拉圖', '魚骨圖與根因驗證', 'QC vs QA'], cur: step }),
        step === 0 && (react_1.default.createElement(common_1.Card, { title: "X\u0304 \u7BA1\u5236\u5716\uFF1A\u9810\u7F6E\u626D\u529B\uFF08\u865B\u69CB N\u00B7m\uFF0Cn\uFF1D5\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement(common_1.Hint, null, "\u9EDE\u64CA\u4F60\u8A8D\u70BA\u6709\u7570\u5E38\u8A0A\u865F\u7684\u9EDE\uFF1A\u8D85\u51FA\u7BA1\u5236\u754C\u9650\uFF0C\u6216\u9023\u7E8C 8 \u9EDE\u843D\u5728\u4E2D\u5FC3\u7DDA\u540C\u5074\uFF08\u7B2C 8 \u9EDE\u8D77\uFF09\u3002\u7BA1\u5236\u754C\u9650\u4EE5\u524D 15 \u7D44\u8A08\u7B97\u3002"),
            react_1.default.createElement(common_1.Lines, { labels: d.xbar.map((_, i) => `${i + 1}`), series: [{ name: 'X̄', color: '#39d5ff', values: d.xbar }], hlines: [{ v: d.ucl, label: `UCL ${d.ucl.toFixed(2)}`, color: '#ff5d73' }, { v: d.xbb, label: `CL ${d.xbb.toFixed(2)}`, color: '#7cf29c' }, { v: d.lcl, label: `LCL ${d.lcl.toFixed(2)}`, color: '#ff5d73' }], onPoint: (i) => !checked && setMarks(marks.includes(i) ? marks.filter((x) => x !== i) : [...marks, i]), marks: checked ? d.sig : marks, markColor: checked ? '#ff5d73' : '#ffd23f', h: 240 }),
            checked && react_1.default.createElement("p", null,
                "\u771F\u6B63\u7684\u7570\u5E38\u8A0A\u865F\uFF1A\u7B2C ",
                d.sig.map((x) => x + 1).join('、'),
                " \u7D44\u3002\u4F60\u6A19\u8A18\u6B63\u78BA ",
                tp,
                " \u9EDE\u3001\u8AA4\u5224 ",
                fp,
                " \u9EDE\u3002\u6CE8\u610F\u7B2C 19 \u7D44\u8D77\u88FD\u7A0B\u6574\u9AD4\u4E0A\u79FB\u2014\u2014\u540C\u6642\u662F\u65B0\u76E4\u5143\u6279\u865F H-2307 \u4E0A\u7DDA\u8207\u591C\u73ED\u4EA4\u63A5\u6642\u6BB5\u3002"),
            react_1.default.createElement("div", { className: "row end" }, !checked ? react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setChecked(true) },
                "\u78BA\u8A8D\u5224\u8B80\uFF08\u5DF2\u6A19 ",
                marks.length,
                " \u9EDE\uFF09") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStep(1) }, "\u4E0B\u4E00\u6B65")))),
        step === 1 && (react_1.default.createElement(common_1.Card, { title: "\u88FD\u7A0B\u80FD\u529B\u8207\u67CF\u62C9\u5716", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("div", { className: "grid2" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement("p", { className: "muted" }, "\u898F\u683C\uFF1ALSL 8.8\uFF0FUSL 11.2\uFF08\u865B\u69CB\uFF09"),
                    react_1.default.createElement("div", { className: "metric-list" },
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u7570\u5E38\u524D Cp\uFF0FCpk"),
                            react_1.default.createElement("b", { className: "green" },
                                d.before.cp.toFixed(2),
                                "\uFF0F",
                                d.before.cpk.toFixed(2))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u7570\u5E38\u5F8C Cp\uFF0FCpk"),
                            react_1.default.createElement("b", { className: "red" },
                                d.after.cp.toFixed(2),
                                "\uFF0F",
                                d.after.cpk.toFixed(2))),
                        react_1.default.createElement("div", null,
                            react_1.default.createElement("span", null, "\u5E73\u5747\u503C\u8B8A\u5316"),
                            react_1.default.createElement("b", null,
                                d.before.m.toFixed(2),
                                " \u2192 ",
                                d.after.m.toFixed(2)))),
                    react_1.default.createElement(common_1.Hint, null,
                        "\u6BD4\u8F03 Cp \u8207 Cpk\uFF1ACp \u53EA\u770B\u8B8A\u7570\u5BEC\u5EA6\uFF0CCpk \u9084\u8003\u616E\u5E73\u5747\u503C\u504F\u96E2\u898F\u683C\u4E2D\u5FC3\u3002\u672C\u4F8B Cp ",
                        d.after.cp >= d.before.cp * 0.85 ? '沒有明顯變差' : '也下降',
                        "\u3001Cpk \u5927\u5E45\u4E0B\u964D \u2192 \u4E3B\u8981\u554F\u984C\u662F\u300C\u5E73\u5747\u503C\u504F\u79FB\u300D\u3002")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("p", null, "\u5BA2\u8A34\u4E0D\u826F\u9805\u76EE\uFF08\u9EDE\u9078\u61C9\u512A\u5148\u8655\u7406\u7684\u9805\u76EE\uFF09"),
                    react_1.default.createElement(common_1.Bars, { data: PD.map((p, i) => ({ label: p.l, v: p.v, color: i === 0 ? '#ff5d73' : '#39d5ff' })), onPick: (i) => setPareto(i), picked: pareto ?? undefined, h: 170 }),
                    react_1.default.createElement("p", { className: "small" },
                        "\u7D2F\u7A4D\uFF1A",
                        PD.map((p, i) => sim_1.fmt.pct(PD.slice(0, i + 1).reduce((a, b) => a + b.v, 0) / 77, 0)).join(' → ')))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: pareto === null, onClick: () => setStep(2) }, "\u4E0B\u4E00\u6B65")))),
        step === 2 && (react_1.default.createElement(common_1.Card, { title: "\u9B5A\u9AA8\u5716\uFF1A\u9078\u51FA\u6700\u591A 2 \u500B\u503C\u5F97\u9A57\u8B49\u7684\u53EF\u80FD\u539F\u56E0" },
            react_1.default.createElement("div", { className: "fish" },
                Object.entries(FISH).map(([k, arr]) => (react_1.default.createElement("div", { key: k, className: "bone" },
                    react_1.default.createElement("b", null, k),
                    arr.map((c) => react_1.default.createElement("button", { key: c, className: `chip ${causes.includes(c) ? 'on' : ''}`, onClick: () => setCauses(causes.includes(c) ? causes.filter((x) => x !== c) : causes.length < 2 ? [...causes, c] : causes) }, c))))),
                react_1.default.createElement("div", { className: "fish-head" }, "\u626D\u529B\u504F\u9AD8")),
            react_1.default.createElement("p", { className: "small muted" }, "\u8B49\u64DA\uFF1A\u7570\u5E38\u81EA\u7B2C 19 \u7D44\u958B\u59CB\uFF1BH-2307 \u65BC\u540C\u65E5\u4E0A\u7DDA\uFF1B\u591C\u73ED\u4EA4\u63A5\u4EA6\u540C\u6642\u6BB5\uFF1B\u6C96\u58D3\u689D\u4EF6\u76EE\u524D\u672A\u4F9D\u786C\u5EA6\u5206\u7D1A\uFF08\u547C\u61C9\u9810\u7F6E\u626D\u529B\u9700\u300C\u71B1\u8655\u7406\u5F8C\u786C\u5EA6\u300D\u8207\u300C\u6C96\u58D3\u689D\u4EF6\u300D\u914D\u5408\uFF09\u3002"),
            react_1.default.createElement("h4", null, "\u4F60\u7684\u9A57\u8B49\u8A08\u756B\uFF1F"),
            react_1.default.createElement("div", { className: "opts col" }, PLANS.map((p, i) => react_1.default.createElement("button", { key: i, className: `opt ${plan === i ? 'on' : ''}`, onClick: () => setPlan(i) }, p.t))),
            plan !== null && react_1.default.createElement("div", { className: PLANS[plan].ok >= 18 ? 'goodbox' : 'warnbox' }, PLANS[plan].why),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: plan === null || !causes.length, onClick: () => setStep(3) }, "\u4E0B\u4E00\u6B65")))),
        step === 3 && (react_1.default.createElement(common_1.Card, { title: "QC \u9084\u662F QA\uFF1F" },
            react_1.default.createElement(common_1.Hint, null, "QC \u91CD\u5728\u7522\u54C1\u8207\u88FD\u7A0B\u6AA2\u9A57\u3001\u7570\u5E38\u5224\u5B9A\u3001\u54C1\u8CEA\u6578\u64DA\uFF1BQA \u91CD\u5728\u54C1\u8CEA\u7CFB\u7D71\u3001\u9810\u9632\u6A5F\u5236\u3001\u7A3D\u6838\u3001\u7A0B\u5E8F\u7BA1\u7406\u3002"),
            QCQA.map((q, i) => react_1.default.createElement("div", { key: i, className: "row between qrow" },
                react_1.default.createElement("span", null, q.t),
                react_1.default.createElement("span", null, ['QC', 'QA'].map((x) => react_1.default.createElement("button", { key: x, className: `opt sm ${qa[i] === x ? 'on' : ''}`, onClick: () => setQa({ ...qa, [i]: x }) }, x))))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: Object.keys(qa).length < 6, onClick: () => {
                        const qcqa = QCQA.filter((q, i) => qa[i] === q.a).length;
                        const causeS = (causes.includes('新盤元批號 H-2307') ? 6 : 0) + (causes.includes('沖壓條件未依硬度分級') ? 4 : 0) + (causes.includes('扭力計校正逾期') ? 2 : 0);
                        const score = spcScore + (pareto === 0 ? 10 : 0) + Math.min(10, causeS) + PLANS[plan].ok + qcqa * 5;
                        onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`管制圖判讀 ${spcScore}/30`, `柏拉圖優先項目：${PD[pareto].l}`, `驗證計畫：${PLANS[plan].ok >= 18 ? '可驗證的對照實驗 ✔' : '未能驗證因果 ✘'}`, `QC/QA 分辨 ${qcqa}/6`],
                            effect: { f: { latent: plan === 1 || plan === 3 ? -0.0006 : 0 }, st: { secondary: { Q: plan === 1 || plan === 3 ? 0.004 : 0 } } }, extra: { spcPerfect: tp === d.sig.length && fp === 0 } });
                    } }, "\u5B8C\u6210\u5206\u6790"))))));
}
const SUP = [
    { id: 'A', n: '甲鋼廠（國內）', price: 31.5, lead: '2 週', otd: 0.96, ppm: 300, tr: 0.4, pl: 0.04, var: 1 },
    { id: 'B', n: '乙貿易（海外）', price: 27.8, lead: '海運 6 週／空運 2 週', otd: 0.82, ppm: 1200, tr: 1.2, pl: 0.18, var: 3 },
    { id: 'C', n: '丙鋼廠（國內）', price: 29.9, lead: '3 週', otd: 0.9, ppm: 600, tr: 0.5, pl: 0.1, var: 1.5 },
];
function tco(al, air, ssw) {
    const tot = al.reduce((a, b) => a + b, 0) || 1;
    const T = 120;
    let price = 0, trans = 0, qual = 0, short = 0;
    SUP.forEach((s, i) => {
        const t = (al[i] / tot) * T;
        const isB = s.id === 'B';
        const tr = isB && air ? 5.5 : s.tr, pl = isB && air ? 0.1 : s.pl, vr = isB && air ? 1 : s.var;
        price += t * s.price * 1000;
        trans += t * tr * 1000;
        qual += t * (s.ppm / 1e6) * 100000 * 40;
        short += t * pl * (1 - (0, sim_1.clamp)(ssw / vr, 0, 1)) * 60000;
    });
    const maxShare = Math.max(...al) / tot;
    const conc = maxShare > 0.7 ? (maxShare - 0.7) * 600000 : 0;
    const hold = ssw * 30 * 30000 * 0.015 * 4;
    return { price, trans, qual, short, conc, hold, total: price + trans + qual + short + conc + hold };
}
function SupplyGame({ onDone }) {
    const [al, setAl] = (0, react_1.useState)([0, 100, 0]);
    const [air, setAir] = (0, react_1.useState)(false);
    const [ssw, setSsw] = (0, react_1.useState)(0);
    const [step, setStep] = (0, react_1.useState)(0);
    const [disr, setDisr] = (0, react_1.useState)(null);
    const t = tco(al, air, ssw);
    const best = (0, react_1.useMemo)(() => { let b = Infinity; for (let a = 0; a <= 100; a += 10)
        for (let c = 0; c <= 100 - a; c += 10)
            for (const ai of [false, true])
                for (let s = 0; s <= 3; s++)
                    b = Math.min(b, tco([a, 100 - a - c, c], ai, s).total); return b; }, []);
    const eff = best / t.total;
    const tot = al.reduce((a, b) => a + b, 0) || 1;
    const parts = [{ l: '採購價', v: t.price, c: '#39d5ff' }, { l: '運輸', v: t.trans, c: '#7cf29c' }, { l: '品質成本', v: t.qual, c: '#ff5d73' }, { l: '缺料風險', v: t.short, c: '#ffd23f' }, { l: '集中風險', v: t.conc, c: '#ff9a3c' }, { l: '庫存持有', v: t.hold, c: '#b78cff' }];
    const DIS = [
        { t: '轉國內供應商補量（單價略高）', s: 12 }, { t: '部分改空運（運費高）', s: 8 }, { t: '等船（承擔缺料風險）', s: 0 },
    ];
    return (react_1.default.createElement("div", null,
        step === 0 && (react_1.default.createElement(common_1.Card, { title: "120 \u5678\u76E4\u5143\u63A1\u8CFC\u5206\u914D\uFF084 \u9031\u5167\u4EA4\u8CA8\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("div", { className: "tbl-wrap" },
                react_1.default.createElement("table", { className: "tbl" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "\u4F9B\u61C9\u5546"),
                            react_1.default.createElement("th", null, "\u55AE\u50F9\uFF08\u5343\u5143/\u5678\uFF09"),
                            react_1.default.createElement("th", null, "\u4EA4\u671F"),
                            react_1.default.createElement("th", null, "\u6E96\u4EA4\u7387"),
                            react_1.default.createElement("th", null, "\u54C1\u8CEA PPM"),
                            react_1.default.createElement("th", null, "\u5206\u914D"))),
                    react_1.default.createElement("tbody", null, SUP.map((s, i) => react_1.default.createElement("tr", { key: s.id },
                        react_1.default.createElement("td", null, s.n),
                        react_1.default.createElement("td", null, s.price),
                        react_1.default.createElement("td", null, s.lead),
                        react_1.default.createElement("td", null, sim_1.fmt.pct(s.otd, 0)),
                        react_1.default.createElement("td", null, s.ppm),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("div", { className: "row sm" },
                                react_1.default.createElement(common_1.Btn, { small: true, onClick: () => { const a = [...al]; a[i] = Math.max(0, a[i] - 10); setAl(a); } }, "\u2212"),
                                react_1.default.createElement("b", null, sim_1.fmt.pct(al[i] / tot, 0)),
                                react_1.default.createElement(common_1.Btn, { small: true, onClick: () => { const a = [...al]; a[i] = Math.min(100, a[i] + 10); setAl(a); } }, "\uFF0B")))))))),
            react_1.default.createElement("div", { className: "row wrap" },
                react_1.default.createElement("label", { className: "check" },
                    react_1.default.createElement("input", { type: "checkbox", checked: air, onChange: (e) => setAir(e.target.checked) }),
                    " \u4E59\u8CBF\u6613\u6539\u7A7A\u904B"),
                react_1.default.createElement("span", null, "\u5B89\u5168\u5EAB\u5B58\uFF1A"),
                [0, 1, 2, 3].map((w) => react_1.default.createElement("button", { key: w, className: `opt sm ${ssw === w ? 'on' : ''}`, onClick: () => setSsw(w) },
                    w,
                    " \u9031"))),
            react_1.default.createElement("div", { className: "grid2" },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(common_1.Bars, { data: parts.map((p) => ({ label: p.l, v: p.v / 1e4, color: p.c })), fmtv: (v) => v.toFixed(0), h: 190 }),
                    react_1.default.createElement("p", { className: "small muted center" }, "\u55AE\u4F4D\uFF1A\u842C\u5143")),
                react_1.default.createElement("div", null,
                    react_1.default.createElement("div", { className: "kpi" },
                        react_1.default.createElement("div", { className: "kpi-l" }, "\u7E3D\u6301\u6709\u6210\u672C TCO"),
                        react_1.default.createElement("div", { className: "kpi-v" }, sim_1.fmt.wan(t.total)),
                        react_1.default.createElement("div", { className: "kpi-s" },
                            "\u6BCF\u5678 ",
                            sim_1.fmt.nt(t.total / 120))),
                    react_1.default.createElement(common_1.Meter, { label: "\u8207\u6700\u4F73\u65B9\u6848\u7684\u5DEE\u8DDD", right: sim_1.fmt.pct(eff, 1), v: eff, color: "var(--green)" }),
                    react_1.default.createElement(common_1.Hint, null, "\u4E59\u8CBF\u6613\u55AE\u50F9\u6700\u4F4E\uFF0C\u4F46\u54C1\u8CEA\u3001\u7F3A\u6599\u8207\u96C6\u4E2D\u98A8\u96AA\u7684\u96B1\u85CF\u6210\u672C\u8981\u4E00\u8D77\u7B97\u3002\u55AE\u4E00\u4F9B\u61C9\u5546\u8D85\u904E 70% \u6703\u7522\u751F\u96C6\u4E2D\u98A8\u96AA\u3002"))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStep(1) }, "\u9001\u51FA\u63A1\u8CFC\u6C7A\u7B56")))),
        step === 1 && (react_1.default.createElement(common_1.Card, { title: "\u7A81\u767C\uFF1A\u570B\u969B\u822A\u7DDA\u53D7\u963B\uFF0C\u6D77\u904B\u8CA8\u7269\u9810\u4F30\u665A\u5230 3 \u9031" },
            react_1.default.createElement("p", null, al[1] > 0 && !air ? `你有 ${sim_1.fmt.pct(al[1] / tot, 0)} 的盤元走海運，直接受到影響。` : '你的海運占比很低，影響有限——這就是分散風險的價值。'),
            react_1.default.createElement("div", { className: "opts col" }, DIS.map((d2, i) => react_1.default.createElement("button", { key: i, className: `opt ${disr === i ? 'on' : ''}`, onClick: () => setDisr(i) }, d2.t))),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: disr === null, onClick: () => {
                        const exposure = al[1] > 0 && !air ? al[1] / tot : 0;
                        const score = Math.round((0, sim_1.clamp)((eff - 0.85) / 0.15, 0, 1) * 70 + (Math.max(...al) / tot <= 0.7 ? 15 : 0) + (exposure > 0 ? DIS[disr].s * 0.8 : 15));
                        onDone({ score: (0, sim_1.clamp)(score, 0, 100), summary: [`TCO ${sim_1.fmt.wan(t.total)}（最佳方案 ${sim_1.fmt.wan(best)}）`, `最大單一供應商占比 ${sim_1.fmt.pct(Math.max(...al) / tot, 0)}`, `運輸受阻處置：${DIS[disr].t}`],
                            effect: { f: { supplierDelay: exposure * 0.08 - (Math.max(...al) / tot <= 0.7 ? 0.02 : 0), safetyStockDays: ssw, priceFactor: (t.price / 120 / 1000 - 31) / 100 } }, extra: { tco: eff > 0.97 } });
                    } }, "\u5B8C\u6210"))))));
}
const ROWS = [
    { id: 1, st: '冷鍛', ct: '3.9', down: '35', out: '6820', issue: 'ok' }, { id: 2, st: '搓牙', ct: '4.7', down: '62', out: '5410', issue: 'ok' },
    { id: 3, st: '搓牙', ct: '4.7', down: '62', out: '5410', issue: 'dup' }, { id: 4, st: '熱處理', ct: '', down: '20', out: '7900', issue: 'missing' },
    { id: 5, st: '搓呀', ct: '4.9', down: '55', out: '5320', issue: 'name' }, { id: 6, st: '表面處理', ct: '4.1', down: '28', out: '6400', issue: 'ok' },
    { id: 7, st: '光學檢驗', ct: '0.075', down: '15', out: '6010', issue: 'unit' }, { id: 8, st: '冷鍛', ct: '4.0', down: '40', out: '6700', issue: 'ok' },
    { id: 9, st: '表面處理', ct: '4.2', down: '30', out: '6380', issue: 'ok' }, { id: 10, st: '光學檢驗', ct: '4.4', down: '18', out: '6100', issue: 'ok' },
    { id: 11, st: '冷鍛', ct: '3.9', down: '35', out: '6820', issue: 'dup' }, { id: 12, st: '熱處理', ct: '3.2', down: '22', out: '7950', issue: 'ok' },
];
const ACT = { ok: '保留', dup: '刪除重複', missing: '標記缺失／補值', name: '修正站名', unit: '修正單位（分→秒）' };
const PLANS10 = [
    { id: 'opt', n: '光學檢驗再加購一台', cost: 1800000, eff: { optical: 0.5 }, e: { st: { optical: { machines: 1 } } } },
    { id: 'smed', n: '搓牙 SMED＋牙板預防更換', cost: 600000, eff: { thread: -0.7 }, e: { st: { thread: { setupH: -0.3, A: 0.025 } } } },
    { id: 'dbr', n: '搓牙前設置時間緩衝＋DBR 排程', cost: 200000, eff: { thread: -0.25 }, e: { st: { thread: { A: 0.015 } } } },
    { id: 'forge', n: '冷鍛提速 10%', cost: 300000, eff: { forge: -0.4 }, e: { st: { forge: { P: 0.03 } } } },
    { id: 'wip', n: '全廠加大在製品緩衝', cost: 100000, eff: {}, e: { f: { safetyStockDays: 1 } } },
];
const CT0 = { forge: 4.4, thread: 5.7, heat: 3.4, surface: 4.3, optical: 4.6 };
const CTN = { forge: '冷鍛', thread: '搓牙', heat: '熱處理', surface: '表面處理', optical: '光學' };
function DataGame({ onDone }) {
    const [step, setStep] = (0, react_1.useState)(0);
    const [act, setAct] = (0, react_1.useState)({});
    const [cleanChecked, setCleanChecked] = (0, react_1.useState)(false);
    const [bott, setBott] = (0, react_1.useState)(null);
    const [cq, setCq] = (0, react_1.useState)({});
    const [lit, setLit] = (0, react_1.useState)(null);
    const [plans, setPlans] = (0, react_1.useState)([]);
    const cleanOk = ROWS.filter((r) => act[r.id] === r.issue).length;
    const takt = (80 * 3600) / 55000;
    const keys = Object.keys(CT0);
    const ctAfter = (ps) => { const c = { ...CT0 }; ps.forEach((p) => { const pl = PLANS10.find((x) => x.id === p); for (const [k, v] of Object.entries(pl.eff))
        c[k] = k === 'optical' && v === 0.5 ? c[k] * 0.5 : c[k] + v; }); return c; };
    const c1 = ctAfter(plans);
    const maxCt0 = Math.max(...Object.values(CT0)), maxCt1 = Math.max(...Object.values(c1));
    const th0 = Math.min(55000, (80 * 3600) / maxCt0), th1 = Math.min(55000, (80 * 3600) / maxCt1);
    const cost = plans.reduce((a, p) => a + PLANS10.find((x) => x.id === p).cost, 0);
    const annual = (th1 - th0) * 6 * 50;
    const roi = cost ? (annual - cost) / cost : 0;
    const DEFS = [{ k: 'takt', t: '可用生產時間 ÷ 客戶需求量' }, { k: 'cycle', t: '某站實際完成一單位所需時間' }, { k: 'lead', t: '從投料到完成交付的總時間' }];
    const OPTS = [{ v: 'takt', n: '節拍時間 Takt Time' }, { v: 'cycle', n: '週期時間 Cycle Time' }, { v: 'lead', n: '前置時間 Lead Time' }];
    const LIT = ['4 小時', '40 小時', '400 小時', '14,400 小時'];
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Steps, { steps: ['資料清理', '瓶頸辨識', '觀念檢核', '改善方案 ROI'], cur: step }),
        step === 0 && (react_1.default.createElement(common_1.Card, { title: "\u751F\u7522\u7D00\u9304\u8CC7\u6599\u6E05\u7406\uFF08\u6BCF\u5217\u9078\u64C7\u8655\u7F6E\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("div", { className: "tbl-wrap" },
                react_1.default.createElement("table", { className: "tbl" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "#"),
                            react_1.default.createElement("th", null, "\u7AD9\u5225"),
                            react_1.default.createElement("th", null, "\u9031\u671F\u6642\u9593"),
                            react_1.default.createElement("th", null, "\u505C\u6A5F(\u5206)"),
                            react_1.default.createElement("th", null, "\u7522\u51FA"),
                            react_1.default.createElement("th", null, "\u8655\u7F6E"))),
                    react_1.default.createElement("tbody", null, ROWS.map((r) => react_1.default.createElement("tr", { key: r.id, className: cleanChecked ? (act[r.id] === r.issue ? 'ok' : 'ng') : '' },
                        react_1.default.createElement("td", null, r.id),
                        react_1.default.createElement("td", null, r.st),
                        react_1.default.createElement("td", null, r.ct || react_1.default.createElement("i", { className: "muted" }, "\uFF08\u7A7A\u767D\uFF09")),
                        react_1.default.createElement("td", null, r.down),
                        react_1.default.createElement("td", null, r.out),
                        react_1.default.createElement("td", null,
                            react_1.default.createElement("select", { value: act[r.id] || '', disabled: cleanChecked, onChange: (e) => setAct({ ...act, [r.id]: e.target.value }) },
                                react_1.default.createElement("option", { value: "" }, "\u2014"),
                                Object.entries(ACT).map(([k, v]) => react_1.default.createElement("option", { key: k, value: k }, v))),
                            cleanChecked && act[r.id] !== r.issue && react_1.default.createElement("div", { className: "small" },
                                "\u61C9\u70BA\uFF1A",
                                ACT[r.issue]))))))),
            react_1.default.createElement(common_1.Hint, null, "\u6CE8\u610F\uFF1A\u5B8C\u5168\u76F8\u540C\u7684\u5217\u3001\u7A7A\u767D\u503C\u3001\u932F\u5B57\u7AD9\u540D\u3001\u660E\u986F\u4E0D\u5408\u7406\u7684\u55AE\u4F4D\uFF080.075 \u79D2\uFF1F\u5176\u5BE6\u662F\u5206\u9418\uFF09\u3002"),
            react_1.default.createElement("div", { className: "row end" }, !cleanChecked ? react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: Object.keys(act).length < 12, onClick: () => setCleanChecked(true) }, "\u6AA2\u67E5") : react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setStep(1) },
                "\u4E0B\u4E00\u6B65\uFF08\u6B63\u78BA ",
                cleanOk,
                "/12\uFF09")))),
        step === 1 && (react_1.default.createElement(common_1.Card, { title: "\u5404\u7AD9\u6709\u6548\u9031\u671F\u6642\u9593 vs \u7BC0\u62CD\u6642\u9593\uFF08\u9EDE\u9078\u74F6\u9838\u7AD9\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
            react_1.default.createElement("p", null,
                "\u7BC0\u62CD\u6642\u9593 \uFF1D 80 h \u00D7 3600 s \u00F7 55,000 \u9846 \uFF1D ",
                react_1.default.createElement("b", null,
                    takt.toFixed(2),
                    " \u79D2/\u9846"),
                "\u3002\u6709\u6548\u9031\u671F\u6642\u9593\u5DF2\u542B\u505C\u6A5F\u8207\u63DB\u7DDA\u640D\u5931\uFF08\u79D2/\u9846\uFF09\u3002"),
            react_1.default.createElement(common_1.Bars, { data: keys.map((k) => ({ label: CTN[k], v: CT0[k], color: CT0[k] > takt ? '#ff5d73' : '#39d5ff' })), line: takt, lineLabel: `Takt ${takt.toFixed(2)}s`, onPick: (i) => setBott(i), picked: bott ?? undefined }),
            bott !== null && react_1.default.createElement("div", { className: keys[bott] === 'thread' ? 'goodbox' : 'warnbox' }, keys[bott] === 'thread' ? '正確！搓牙有效週期時間 5.7 秒 > 節拍 5.24 秒，是唯一跟不上客戶需求的站。' : `${CTN[keys[bott]]} 的週期時間低於節拍時間，不是瓶頸。`),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: bott === null, onClick: () => setStep(2) }, "\u4E0B\u4E00\u6B65")))),
        step === 2 && (react_1.default.createElement(common_1.Card, { title: "\u89C0\u5FF5\u6AA2\u6838" },
            DEFS.map((d2) => react_1.default.createElement("div", { key: d2.k, className: "row between qrow" },
                react_1.default.createElement("span", null, d2.t),
                react_1.default.createElement("select", { value: cq[d2.k] || '', onChange: (e) => setCq({ ...cq, [d2.k]: e.target.value }) },
                    react_1.default.createElement("option", { value: "" }, "\u2014"),
                    OPTS.map((o) => react_1.default.createElement("option", { key: o.v, value: o.v }, o.n))))),
            react_1.default.createElement("div", { className: "quiz" },
                react_1.default.createElement("p", null, "\u5C0F\u6CD5\u5247\uFF1A\u6413\u7259\u524D\u5F8C\u5728\u88FD\u54C1\uFF08WIP\uFF0924,000 \u9846\uFF0C\u7522\u51FA\u7387 600 \u9846/\u5C0F\u6642\uFF0C\u6D41\u7A0B\u6642\u9593\u662F\uFF1F"),
                react_1.default.createElement("div", { className: "opts" }, LIT.map((l, i) => react_1.default.createElement("button", { key: i, className: `opt ${lit === i ? (i === 1 ? 'right' : 'wrong') : ''}`, onClick: () => setLit(i) }, l))),
                lit !== null && react_1.default.createElement("p", { className: "small" }, "WIP \uFF1D \u7522\u51FA\u7387 \u00D7 \u6D41\u7A0B\u6642\u9593 \u2192 24,000 \u00F7 600 \uFF1D 40 \u5C0F\u6642\uFF08\u55AE\u4F4D\uFF1A\u9846 \u00F7 \u9846/\u5C0F\u6642 \uFF1D \u5C0F\u6642\uFF09\u3002")),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: Object.keys(cq).length < 3 || lit === null, onClick: () => setStep(3) }, "\u4E0B\u4E00\u6B65")))),
        step === 3 && (react_1.default.createElement(common_1.Card, { title: "\u9078\u64C7\u6539\u5584\u65B9\u6848\uFF08\u9810\u7B97 NT$100 \u842C\uFF09", right: react_1.default.createElement(common_1.SimTag, null) },
            PLANS10.map((p) => react_1.default.createElement("label", { key: p.id, className: "check plan" },
                react_1.default.createElement("input", { type: "checkbox", checked: plans.includes(p.id), onChange: (e) => setPlans(e.target.checked ? [...plans, p.id] : plans.filter((x) => x !== p.id)) }),
                react_1.default.createElement("b", null, p.n),
                react_1.default.createElement("span", null, sim_1.fmt.wan(p.cost)))),
            react_1.default.createElement("div", { className: "grid4" },
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u6295\u8CC7"),
                    react_1.default.createElement("div", { className: "kpi-v", style: { color: cost > 1000000 ? 'var(--red)' : undefined } }, sim_1.fmt.wan(cost))),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u65B0\u74F6\u9838\u9031\u671F\u6642\u9593"),
                    react_1.default.createElement("div", { className: "kpi-v" },
                        maxCt1.toFixed(2),
                        "s"),
                    react_1.default.createElement("div", { className: "kpi-s" }, CTN[keys.find((k) => c1[k] === maxCt1)])),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u9031\u7522\u80FD"),
                    react_1.default.createElement("div", { className: "kpi-v" }, sim_1.fmt.n(th1)),
                    react_1.default.createElement("div", { className: "kpi-s" },
                        "\u539F ",
                        sim_1.fmt.n(th0))),
                react_1.default.createElement("div", { className: "kpi" },
                    react_1.default.createElement("div", { className: "kpi-l" }, "\u5E74\u5316 ROI"),
                    react_1.default.createElement("div", { className: "kpi-v" }, cost ? sim_1.fmt.pct(roi, 0) : '—'))),
            react_1.default.createElement(common_1.Bars, { data: keys.map((k) => ({ label: CTN[k], v: c1[k], color: c1[k] === maxCt1 ? '#ff5d73' : '#39d5ff' })), line: takt, lineLabel: "Takt", h: 150 }),
            react_1.default.createElement(common_1.Hint, null, "\u6539\u5584\u975E\u74F6\u9838\uFF08\u5149\u5B78\u3001\u51B7\u935B\uFF09\u4E0D\u6703\u589E\u52A0\u7522\u51FA\uFF1B\u52A0\u5927 WIP \u53EA\u6703\u62C9\u9577\u524D\u7F6E\u6642\u9593\u3002"),
            react_1.default.createElement("div", { className: "row end" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", disabled: cost > 1000000 || !plans.length, onClick: () => {
                        const concept = DEFS.filter((d2) => cq[d2.k] === d2.k).length;
                        const planScore = (0, sim_1.clamp)(roi / 2, 0, 1) * 22 + (plans.includes('opt') || plans.includes('wip') || plans.includes('forge') ? 0 : 8);
                        const score = cleanOk / 12 * 25 + (keys[bott] === 'thread' ? 20 : 0) + concept * 6 + (lit === 1 ? 7 : 0) + planScore;
                        let e = { f: { dataQuality: 0.04 } };
                        plans.forEach((p) => { const pl = PLANS10.find((x) => x.id === p); e = { ...e, st: { ...(e.st || {}), ...(pl.e.st || {}) }, f: { ...(e.f || {}), ...(pl.e.f || {}) } }; });
                        e.funds = -Math.round(cost * 0.1);
                        onDone({ score: (0, sim_1.clamp)(Math.round(score), 0, 100), summary: [`資料清理 ${cleanOk}/12`, `瓶頸辨識：${keys[bott] === 'thread' ? '搓牙 ✔' : '錯誤 ✘'}`, `Takt/Cycle/Lead 與小法則 ${concept + (lit === 1 ? 1 : 0)}/4`, `改善方案年化 ROI ${sim_1.fmt.pct(roi, 0)}，週產能 ${sim_1.fmt.n(th0)} → ${sim_1.fmt.n(th1)}`], effect: e, extra: { bottleneck: keys[bott] === 'thread' } });
                    } }, "\u63D0\u4EA4\u6539\u5584\u63D0\u6848"))))));
}

};
factories["./games/survival.tsx"]=function(module,exports,require){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SURVIVAL_PASS = void 0;
exports.survivalScore = survivalScore;
exports.survivalEffect = survivalEffect;
exports.SurvivalGame = SurvivalGame;
const react_1 = __importStar(require("react"));
const common_1 = require("../ui/common");
const sim_1 = require("../sim");
exports.SURVIVAL_PASS = ['A', 'B', 'D'];
const END_N = { A: '智慧製造領航者', B: '技術成功，商業失衡', C: '快速交付，品質危機', D: '危機處理專家', E: '專案失敗與重新整頓' };
const DIFF_N = { easy: '實習', std: '標準', hard: '危機' };
const BUDGET = 5000000, DEADLINE = 120;
function survivalScore(r) {
    const base = { A: 90, D: 80, B: 72, C: 42, E: 28 };
    const m = r.m;
    let s = (base[r.ending] ?? 30) + (m.quality - 75) / 6 + (m.cust - 75) / 10 + (m.sec - 70) / 10 + (r.diff === 'hard' ? 5 : r.diff === 'easy' ? -4 : 0) - (r.mentor ? 3 : 0);
    s = exports.SURVIVAL_PASS.includes(r.ending) ? (0, sim_1.clamp)(s, 66, 100) : (0, sim_1.clamp)(s, 10, 48);
    return Math.round(s);
}
function survivalEffect(r) {
    const m = r.m;
    return {
        f: { dataQuality: (0, sim_1.clamp)((m.quality - 70) / 400, -0.05, 0.05) },
        trust: { it: Math.round((m.sec - 60) / 5), quality: Math.round((m.quality - 70) / 6), mgmt: Math.round((m.brand - 70) / 5) + (m.spent <= BUDGET ? 2 : -3) },
        brand: Math.round((m.cust - 75) / 10),
        addRisk: m.sec < 45 ? 'AI 系統資安成熟度不足' : undefined,
    };
}
function RunCard({ r }) {
    const pass = exports.SURVIVAL_PASS.includes(r.ending);
    const sev2 = r.inc.filter((i) => i.sev === 2).length, sev1 = r.inc.filter((i) => i.sev === 1).length;
    return (react_1.default.createElement("div", { className: pass ? 'goodbox' : 'warnbox' },
        react_1.default.createElement("div", { className: "row between wrap" },
            react_1.default.createElement("b", null,
                "\u7D50\u5C40 ",
                r.ending,
                "\uFF5C",
                END_N[r.ending]),
            react_1.default.createElement("span", null,
                pass ? '✅ 通過考核' : '❌ 未通過',
                "\u30FB\u96E3\u5EA6 ",
                DIFF_N[r.diff] || r.diff,
                r.mentor ? '・教學模式' : '',
                "\u30FB\u9810\u4F30\u5F97\u5206 ",
                survivalScore(r))),
        react_1.default.createElement("div", { className: "grid4", style: { marginTop: 8 } },
            react_1.default.createElement(common_1.Kpi, { label: "\u7E3D\u652F\u51FA", value: sim_1.fmt.wan(r.m.spent), sub: `核定 ${sim_1.fmt.wan(BUDGET)}`, good: r.m.spent <= BUDGET }),
            react_1.default.createElement(common_1.Kpi, { label: "\u5DE5\u671F", value: `${Math.round(r.m.days)} 日`, sub: `期限 ${DEADLINE} 日`, good: r.m.days <= DEADLINE }),
            react_1.default.createElement(common_1.Kpi, { label: "\u54C1\u8CEA\uFF0F\u8CC7\u5B89", value: `${r.m.quality}／${r.m.sec}` }),
            react_1.default.createElement(common_1.Kpi, { label: "\u54C1\u724C\uFF0F\u5BA2\u6236", value: `${r.m.brand}／${r.m.cust}` })),
        react_1.default.createElement("p", { className: "small" },
            "\u4E8B\u6545\uFF1A\u91CD\u5927 ",
            sev2,
            "\u3001\u4E2D\u5EA6 ",
            sev1,
            "\u3001\u5408\u8A08 ",
            r.inc.length,
            " \u8D77\u3002",
            r.reasons.slice(0, 3).join('；'))));
}
function SurvivalGame({ onDone }) {
    const { g, set, toast, sfx } = (0, common_1.useG)();
    const [open, setOpen] = (0, react_1.useState)(false);
    const frame = (0, react_1.useRef)(null);
    const runs = g.survival?.runs || [];
    const last = runs[runs.length - 1];
    const best = runs.reduce((b, r) => (!b || survivalScore(r) > survivalScore(b) ? r : b), null);
    (0, react_1.useEffect)(() => {
        const onMsg = (e) => {
            if (!frame.current || e.source !== frame.current.contentWindow)
                return;
            const d = e.data;
            if (!d || typeof d.type !== 'string')
                return;
            if (d.type === 'smk-survival-ready')
                frame.current.contentWindow.postMessage({ type: 'smk-init', name: g.player.name, diff: g.mode === 'engineer' ? 'std' : 'easy' }, '*');
            if (d.type === 'smk-survival-close')
                setOpen(false);
            if (d.type === 'smk-survival-end') {
                const run = { ending: d.ending, m: d.m, cost: d.cost, inc: d.inc || [], diff: d.diff, mentor: !!d.mentor, runId: d.runId, reasons: d.reasons || [], at: Date.now(), week: g.week, sk: d.sk };
                set((g0) => {
                    const rs = (g0.survival?.runs || []).filter((x) => x.runId !== run.runId);
                    return { ...g0, survival: { runs: [...rs, run].slice(-12) } };
                });
                const pass = exports.SURVIVAL_PASS.includes(run.ending);
                sfx(pass ? 'good' : 'bad');
                toast(pass ? `生存戰結局 ${run.ending}：通過！返回主線即可提交考核。` : `生存戰結局 ${run.ending}：未通過，可再挑戰。`);
            }
        };
        window.addEventListener('message', onMsg);
        return () => window.removeEventListener('message', onMsg);
    }, [g.player.name, g.week]);
    (0, react_1.useEffect)(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
    const submit = (r) => onDone({
        score: survivalScore(r),
        summary: [`《AI 工程師生存戰》結局 ${r.ending}｜${END_N[r.ending]}（難度 ${DIFF_N[r.diff] || r.diff}${r.mentor ? '、教學模式' : ''}）`, `總支出 ${sim_1.fmt.nt(r.m.spent)}／工期 ${Math.round(r.m.days)} 日／事故 ${r.inc.length} 起`, `品質 ${r.m.quality}、資安 ${r.m.sec}、品牌 ${r.m.brand}、客戶 ${r.m.cust}、風險 ${r.m.risk}`, exports.SURVIVAL_PASS.includes(r.ending) ? '通過 AI 工程師階段考核' : '未通過：結局 C、E 需重新挑戰'],
        effect: survivalEffect(r), extra: { survivalEnding: r.ending },
    });
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(common_1.Card, { title: "\u968E\u6BB5\u8003\u6838\uFF1A\u300ASUMEEKO\uFF1AAI \u5DE5\u7A0B\u5E2B\u751F\u5B58\u6230\u300B", right: react_1.default.createElement("span", { className: "simtag ai" }, "\u6559\u5B78\u6A21\u64EC\u30FB\u865B\u69CB\u6578\u64DA") },
            react_1.default.createElement("p", null, "\u4F60\u5C07\u4EE5 AI \u5DE5\u7A0B\u5E2B\u8EAB\u5206\u4E3B\u5C0E\u4E00\u500B\u6A6B\u8DE8\u5831\u50F9\u3001\u5716\u9762\u89E3\u6790\u3001ERP \u6574\u5408\u3001\u77E5\u8B58\u554F\u7B54\u3001AI Agent\u3001GPU \u90E8\u7F72\u5230\u6B63\u5F0F\u4E0A\u7DDA\u7684\u6578\u4F4D\u8F49\u578B\u5C08\u6848\u3002\u4E5D\u500B\u95DC\u5361\u5F7C\u6B64\u9023\u52D5\uFF1A\u6BCF\u500B\u6C7A\u7B56\u90FD\u6703\u5F71\u97FF\u9810\u7B97\u3001\u5DE5\u671F\u3001\u54C1\u8CEA\u3001\u8CC7\u5B89\u8207\u5BA2\u6236\u4FE1\u4EFB\uFF0C\u4E26\u53EF\u80FD\u5728\u5F8C\u9762\u5F15\u7206\u4E8B\u6545\u3002"),
            react_1.default.createElement("div", { className: "grid4" },
                react_1.default.createElement(common_1.Kpi, { label: "\u6838\u5B9A\u9810\u7B97", value: "NT$500 \u842C", sub: "\u542B\u9810\u5099\u91D1 100 \u842C" }),
                react_1.default.createElement(common_1.Kpi, { label: "\u5DE5\u671F", value: "120 \u65E5" }),
                react_1.default.createElement(common_1.Kpi, { label: "\u901A\u904E\u689D\u4EF6", value: "\u7D50\u5C40 A\uFF0FB\uFF0FD", sub: "\u4EE5\u8077\u6DAF\u6A21\u5F0F\u5B8C\u6210" }),
                react_1.default.createElement(common_1.Kpi, { label: "\u672A\u901A\u904E", value: "\u7D50\u5C40 C\uFF0FE", sub: "\u53EF\u7121\u9650\u6B21\u91CD\u65B0\u6311\u6230" })),
            react_1.default.createElement(common_1.Hint, null, "\u751F\u5B58\u6230\u6703\u5728\u5168\u87A2\u5E55\u8996\u7A97\u958B\u555F\uFF0C\u9032\u5EA6\u81EA\u52D5\u4FDD\u5B58\uFF0C\u53EF\u96A8\u6642\u300C\u8FD4\u56DE\u4E3B\u7DDA\u300D\u518D\u56DE\u4F86\u7E7C\u7E8C\u3002\u81EA\u7531\u6311\u6230\u3001\u4E8B\u6545\u6F14\u7DF4\u53EA\u4F9B\u7DF4\u7FD2\uFF0C\u4E0D\u5217\u5165\u8003\u6838\u3002"),
            react_1.default.createElement("div", { className: "row end wrap" },
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => setOpen(true) }, runs.length ? '▶ 開啟生存戰（繼續／再挑戰）' : '▶ 開始生存戰'))),
        last && react_1.default.createElement(common_1.Card, { title: "\u6700\u8FD1\u4E00\u6B21\u7D50\u679C" },
            react_1.default.createElement(RunCard, { r: last }),
            react_1.default.createElement("div", { className: "row end wrap" },
                best && best !== last && react_1.default.createElement(common_1.Btn, { onClick: () => submit(best) },
                    "\u63D0\u4EA4\u6700\u4F73\u7D00\u9304\uFF08\u7D50\u5C40 ",
                    best.ending,
                    "\uFF09"),
                react_1.default.createElement(common_1.Btn, { kind: "primary", onClick: () => submit(last) }, "\u63D0\u4EA4\u8003\u6838\u7D50\u679C"))),
        runs.length > 1 && react_1.default.createElement(common_1.Card, { title: "\u6B77\u6B21\u6311\u6230\u7D00\u9304" },
            react_1.default.createElement("div", { className: "tbl-wrap" },
                react_1.default.createElement("table", { className: "tbl sm" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", null, "#"),
                            react_1.default.createElement("th", null, "\u7D50\u5C40"),
                            react_1.default.createElement("th", null, "\u96E3\u5EA6"),
                            react_1.default.createElement("th", null, "\u652F\u51FA"),
                            react_1.default.createElement("th", null, "\u5DE5\u671F"),
                            react_1.default.createElement("th", null, "\u4E8B\u6545"),
                            react_1.default.createElement("th", null, "\u5F97\u5206"))),
                    react_1.default.createElement("tbody", null, runs.map((r, i) => react_1.default.createElement("tr", { key: r.runId, className: exports.SURVIVAL_PASS.includes(r.ending) ? 'ok' : 'ng' },
                        react_1.default.createElement("td", null, i + 1),
                        react_1.default.createElement("td", null,
                            r.ending,
                            " ",
                            END_N[r.ending]),
                        react_1.default.createElement("td", null, DIFF_N[r.diff] || r.diff),
                        react_1.default.createElement("td", null, sim_1.fmt.wan(r.m.spent)),
                        react_1.default.createElement("td", null,
                            Math.round(r.m.days),
                            " \u65E5"),
                        react_1.default.createElement("td", null, r.inc.length),
                        react_1.default.createElement("td", null, survivalScore(r)))))))),
        open && (react_1.default.createElement("div", { className: "sv-overlay", role: "dialog", "aria-label": "AI \u5DE5\u7A0B\u5E2B\u751F\u5B58\u6230" },
            react_1.default.createElement("div", { className: "sv-bar" },
                react_1.default.createElement("b", null, "\u7B2C\u5341\u4E8C\u7AE0\u30FBAI \u5DE5\u7A0B\u5E2B\u751F\u5B58\u6230"),
                last && react_1.default.createElement(common_1.Tag, { color: exports.SURVIVAL_PASS.includes(last.ending) ? 'var(--green)' : 'var(--orange)' },
                    "\u6700\u8FD1\u7D50\u5C40 ",
                    last.ending),
                react_1.default.createElement(common_1.Btn, { small: true, kind: "primary", onClick: () => setOpen(false) }, "\u2190 \u8FD4\u56DE\u4E3B\u7DDA")),
            react_1.default.createElement("iframe", { ref: frame, src: "survival.html", title: "SUMEEKO\uFF1AAI \u5DE5\u7A0B\u5E2B\u751F\u5B58\u6230" })))));
}

};
const cache=Object.create(null);
function req(n,base){if(n==='react')return extReact;if(n==='react-dom/client')return extClient;
if(n.startsWith('.')){const parts=(base||'.').split('/').slice(0,-1).concat(n.split('/'));const norm=[];for(const x of parts){if(x==='..')norm.pop();else if(x && x!=='.')norm.push(x)}n='./'+norm.join('/');if(!factories[n])for(const ext of ['.tsx','.ts','.js'])if(factories[n+ext]){n+=ext;break;}}
if(!factories[n])throw Error('Module not found: '+n+' from '+base);
if(cache[n])return cache[n].exports;const module={exports:{}};cache[n]=module;factories[n](module,module.exports,(id)=>req(id,n));return module.exports;}
req('./app/main_app.tsx');
})();