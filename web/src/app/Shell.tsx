import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, loadApp, saveApp, sound, useBack, handleBack, defaultState, Rec, isAndroid } from './core';
import { FACTORY_CAMERA, factoryViewBox, previousTaskStep } from './navigation';
import { MACHINES, MSTATE, MState, Machine, PARTS, ROUTES, MATERIALS, TOOLS, ROLES, UNITS, TASKS, CELLS, TaskDef, Part } from './appdata';
import { MachineArt, ToolIcon, STAGES } from './machines';
import { Person, Angle } from './people';
import { PartRenderer, FINISHES } from './gl';
import { CODEX, PATENTS, NPCS } from '../data';
import { slotInfo } from '../state';
import { CAREERS } from '../data';
import CareerApp from '../App';

type Tab = 'home' | 'scene' | 'codex' | 'tasks' | 'me';
type Route = { t: 'machine' | 'part' | 'tool' | 'unit' | 'task' | 'role' | 'career' | 'material' | 'about' | 'settings' | 'patent'; id?: string };
interface Ctx { s: AppState; set: (f: (s: AppState) => AppState) => void; push: (r: Route) => void; pop: () => void; tab: Tab; setTab: (t: Tab) => void; sfx: (t: Parameters<typeof sound.play>[0]) => void; toast: (m: string) => void; paused: boolean; }
const C = createContext<Ctx>(null as any);
const useA = () => useContext(C);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const M = (id: string) => MACHINES.find((m) => m.id === id)!;
const P = (id: string) => PARTS.find((p) => p.id === id)!;

// ---------------- 共用元件 ----------------
function Btn(p: { children?: any; onClick?: () => void; kind?: 'pri' | 'ghost' | 'danger' | 'ok'; disabled?: boolean; sm?: boolean; title?: string; className?: string }) {
  const { sfx } = useA();
  return <button className={`sx-btn ${p.kind || ''} ${p.sm ? 'sm' : ''} ${p.className || ''}`} disabled={p.disabled} title={p.title} onClick={() => { if (p.disabled) return; sfx('click'); p.onClick && p.onClick(); }}>{p.children}</button>;
}
function Sec(p: { title?: any; children?: any; right?: any; className?: string }) {
  return <section className={`sx-card ${p.className || ''}`}>{(p.title || p.right) && <header><h3>{p.title}</h3>{p.right}</header>}{p.children}</section>;
}
function Badge({ st }: { st: MState }) { const d = MSTATE[st]; return <span className="sx-badge" style={{ borderColor: d.color, color: d.color }}>{d.icon} {d.n}<small> {d.en}</small></span>; }
function Sheet(p: { onClose: () => void; children?: any; title?: any }) {
  useBack(() => { p.onClose(); return true; });
  return (
    <div className="sx-sheet-wrap" onClick={(e) => { if (e.target === e.currentTarget) p.onClose(); }}>
      <div className="sx-sheet" role="dialog"><button className="sx-handle" aria-label="關閉" onClick={p.onClose} /><header><h3>{p.title}</h3><button className="sx-x" onClick={p.onClose} aria-label="關閉">✕</button></header><div className="sx-sheet-b">{p.children}</div></div>
    </div>
  );
}
function TopBar(p: { title: string; sub?: string; right?: any }) {
  const { pop } = useA();
  return <div className="sx-top"><button className="sx-back" onClick={pop} aria-label="返回">‹</button><div className="sx-top-t"><b>{p.title}</b>{p.sub && <small>{p.sub}</small>}</div>{p.right}</div>;
}
function SafeSlider(p: { label: string; unit: string; v: number; min: number; max: number; step: number; safe: [number, number]; best?: [number, number]; tip?: string; onChange: (v: number) => void; disabled?: boolean; showBest?: boolean }) {
  const out = p.v < p.safe[0] || p.v > p.safe[1];
  const pct = (x: number) => ((x - p.min) / (p.max - p.min)) * 100;
  const dec = p.step < 0.1 ? 2 : p.step < 1 ? 1 : 0;
  return (
    <div className={`sx-slider ${p.disabled ? 'dis' : ''}`}>
      <label>{p.label}<b className={out ? 'red' : ''}>{p.v.toFixed(dec)}{p.unit}</b></label>
      <div className="sx-track"><div className="sx-safe" style={{ left: `${pct(p.safe[0])}%`, width: `${pct(p.safe[1]) - pct(p.safe[0])}%` }} />{p.showBest && p.best && <div className="sx-best" style={{ left: `${pct(p.best[0])}%`, width: `${pct(p.best[1]) - pct(p.best[0])}%` }} />}
        <input type="range" min={p.min} max={p.max} step={p.step} value={p.v} disabled={p.disabled} aria-label={p.label} onChange={(e) => p.onChange(+e.target.value)} /></div>
      <div className="sx-row sm"><Btn sm disabled={p.disabled} onClick={() => p.onChange(+clamp(p.v - p.step, p.min, p.max).toFixed(3))}>−</Btn>{p.tip && <small className="muted">{p.tip}</small>}<Btn sm disabled={p.disabled} onClick={() => p.onChange(+clamp(p.v + p.step, p.min, p.max).toFixed(3))}>＋</Btn></div>
      {out && <div className="sx-warn">⚠ 超出安全工作窗口（綠色 {p.safe[0]}～{p.safe[1]}{p.unit}）</div>}
    </div>
  );
}
function Tip({ children }: { children?: any }) { const { s } = useA(); return s.settings.hints ? <div className="sx-tip">💡 {children}</div> : null; }
function Fav({ id }: { id: string }) {
  const { s, set, toast } = useA(); const on = s.fav.includes(id);
  return <button className={`sx-fav ${on ? 'on' : ''}`} aria-label={on ? '取消收藏' : '收藏'} onClick={() => { set((x) => ({ ...x, fav: on ? x.fav.filter((f) => f !== id) : [...x.fav, id] })); toast(on ? '已取消收藏' : '已加入收藏'); }}>{on ? '★' : '☆'}</button>;
}
function touchRecent(set: Ctx['set'], id: string, r: string) { set((x) => ({ ...x, recent: [{ id, t: Date.now() }, ...x.recent.filter((y) => y.id !== id)].slice(0, 12), last: { r, id } })); }

// ---------------- 3D 工件檢視 ----------------
export function PartViewer({ part, finish: f0, compact }: { part: Part; finish?: Part['finish']; compact?: boolean }) {
  const { s, paused } = useA();
  const cv = useRef<HTMLCanvasElement>(null);
  const R = useRef<PartRenderer | null>(null);
  const view = useRef({ yaw: 0.6, pitch: 0.35, dist: 4.6, cut: false, alpha: 1, finish: f0 || part.finish });
  const [ui, setUi] = useState({ auto: true, cut: false, alpha: false, finish: f0 || part.finish });
  const [err, setErr] = useState('');
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef(0);
  const dirty = useRef(true);
  useEffect(() => {
    const c = cv.current!; try {
      const dpr = s.settings.lowGfx ? 1 : Math.min(2, window.devicePixelRatio || 1);
      const fit = () => { const r = c.getBoundingClientRect(); c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); dirty.current = true; };
      R.current = new PartRenderer(c, s.settings.lowGfx); fit(); R.current.setShape(part.shape, s.settings.lowGfx);
      const ro = new ResizeObserver(fit); ro.observe(c); return () => ro.disconnect();
    } catch (e: any) { setErr(String(e.message || e)); }
  }, [part.shape, s.settings.lowGfx]);
  useEffect(() => { view.current.cut = ui.cut; view.current.alpha = ui.alpha ? 0.42 : 1; view.current.finish = ui.finish; dirty.current = true; }, [ui]);
  useEffect(() => { setUi((u) => ({ ...u, finish: f0 || part.finish })); }, [part.id, f0]);
  useEffect(() => {
    let raf = 0, last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000); last = t;
      if (!paused && ui.auto && !s.settings.lowMotion && ptrs.current.size === 0) { view.current.yaw += dt * 0.6; dirty.current = true; }
      if (dirty.current && R.current) { R.current.draw(view.current); dirty.current = false; }
      raf = requestAnimationFrame(loop);
    };
    if (!paused) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [ui.auto, paused, s.settings.lowMotion]);
  const down = (e: React.PointerEvent) => { (e.target as Element).setPointerCapture(e.pointerId); ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.current.size === 2) { const [a, b] = [...ptrs.current.values()]; pinch.current = Math.hypot(a.x - b.x, a.y - b.y); } };
  const move = (e: React.PointerEvent) => {
    const p0 = ptrs.current.get(e.pointerId); if (!p0) return;
    if (ptrs.current.size === 1) { view.current.yaw += (e.clientX - p0.x) * 0.01; view.current.pitch = clamp(view.current.pitch + (e.clientY - p0.y) * 0.01, -1.4, 1.4); }
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.current.size === 2) { const [a, b] = [...ptrs.current.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pinch.current) view.current.dist = clamp(view.current.dist * (pinch.current / d), 1.6, 9); pinch.current = d; }
    dirty.current = true;
  };
  const up = (e: React.PointerEvent) => { ptrs.current.delete(e.pointerId); if (ptrs.current.size < 2) pinch.current = 0; };
  return (
    <div className={`sx-viewer ${compact ? 'compact' : ''}`}>
      {err ? <div className="sx-warn">此裝置無法啟用 3D（{err}）。請改用工序對照文字說明。</div> :
        <canvas ref={cv} className="sx-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={(e) => { view.current.dist = clamp(view.current.dist * (e.deltaY > 0 ? 1.1 : 0.9), 1.6, 9); dirty.current = true; }} aria-label={`${part.n} 3D 模型，可拖曳旋轉、雙指縮放`} />}
      <div className="sx-vbar">
        <button className={ui.auto ? 'on' : ''} onClick={() => setUi({ ...ui, auto: !ui.auto })}>⟳ 360°</button>
        <button className={ui.cut ? 'on' : ''} onClick={() => setUi({ ...ui, cut: !ui.cut })}>◧ 剖面</button>
        <button className={ui.alpha ? 'on' : ''} onClick={() => setUi({ ...ui, alpha: !ui.alpha })}>◌ 半透明</button>
        <button onClick={() => { view.current.dist = clamp(view.current.dist * 0.7, 1.6, 9); dirty.current = true; }}>＋ 放大</button>
        <button onClick={() => { Object.assign(view.current, { yaw: 0.6, pitch: 0.35, dist: 4.6 }); dirty.current = true; }}>↺ 重置</button>
        {!compact && <select value={ui.finish} onChange={(e) => setUi({ ...ui, finish: e.target.value as any })} aria-label="材質">{Object.entries(FINISHES).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}</select>}
      </div>
      <small className="sx-real">程序化即時 3D 幾何（真實螺旋螺紋），非圖片縮放。</small>
    </div>
  );
}

// ---------------- 機台模擬（狀態機） ----------------
interface SimResult { params: Record<string, number>; ok: boolean; q: number; scrap: boolean; notes: string[]; }
export function MachineSim({ m, params: p0, lockParams, onDone, taskMode }: { m: Machine; params?: Record<string, number>; lockParams?: boolean; onDone?: (r: SimResult) => void; taskMode?: boolean }) {
  const { sfx, s, paused, toast } = useA();
  const init: Record<string, number> = {}; m.params.forEach((x) => (init[x.id] = p0?.[x.id] ?? x.def));
  const [st, setSt] = useState<MState>('idle');
  const [params, setParams] = useState(init);
  const [prog, setProg] = useState(0);
  const [view, setView] = useState<'full' | 'inside' | 'station'>('full');
  const [sel, setSel] = useState<string | null>(null);
  const [checks, setChecks] = useState<string[]>([]);
  const [loto, setLoto] = useState<string[]>([]);
  const [clearOk, setClearOk] = useState(false);
  const [log, setLog] = useState<string[]>([`${m.n} 開機完成，待機中。`]);
  const [result, setResult] = useState<SimResult | null>(null);
  const [scrap, setScrap] = useState(false);
  const notes = useRef<string[]>([]);
  const L = (t: string) => setLog((l) => [`${new Date().toLocaleTimeString('zh-TW', { hour12: false })}　${t}`, ...l].slice(0, 30));
  const PREP = ['安全護罩關閉、連鎖正常', '潤滑／油位確認', '模具治具與壽命確認', '緊急停止鈕已復歸、周邊淨空'];
  const LOTO = ['停機並切斷主電源', '上鎖並掛上個人隔離標籤', '確認零能量（試啟動無動作、殘壓釋放）'];
  const speedP = m.params.find((x) => x.id === 'speed');
  const speed = speedP ? params.speed : 85;
  const running = st === 'running' || st === 'warning';
  const unsafe = m.params.filter((x) => params[x.id] < x.safe[0] || params[x.id] > x.safe[1]);
  const stageN = STAGES[m.id].length;
  const stage = Math.min(stageN - 1, Math.floor((prog / 100) * stageN));
  useEffect(() => { sound.ambient(running && !paused); return () => sound.ambient(false); }, [running, paused]);
  useEffect(() => {
    if (!running || paused) return;
    let raf = 0, last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000; last = t;
      setProg((pp) => { const np = pp + (dt * 100 / m.cycleSec) * (speed / 85) * (st === 'warning' ? 0.6 : 1); return Math.min(100, np); });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paused, speed, st]);
  // 隨機警告（任務模式中，運轉到 45% 時觸發一次）
  const warned = useRef(false);
  useEffect(() => { if (taskMode && st === 'running' && prog > 45 && !warned.current && speed > 88) { warned.current = true; setSt('warning'); sfx('warn'); L(`⚠ 警告：${m.warn.n}——${m.warn.d}`); } }, [prog, st]);
  useEffect(() => {
    if (prog >= 100 && running) {
      setSt('inspection'); L('加工完成，進入檢驗。'); sfx('contact');
      const t = setTimeout(() => {
        const q = m.params.reduce((a, x) => { const v = params[x.id]; const d = v < x.best[0] ? (x.best[0] - v) / (x.best[0] - x.min || 1) : v > x.best[1] ? (v - x.best[1]) / (x.max - x.best[1] || 1) : 0; return a * (1 - Math.min(0.9, d * 1.6)); }, 1);
        const ok = q > 0.72 && !scrap;
        const r = { params, ok, q, scrap, notes: [...notes.current] };
        setResult(r); setSt('complete'); sfx(ok ? 'success' : 'fail'); L(ok ? `✔ 品質判定：合格（品質指數 ${(q * 100).toFixed(0)}）` : `✖ 品質判定：不合格（品質指數 ${(q * 100).toFixed(0)}）${scrap ? '，急停中斷的工件已隔離報廢' : ''}`);
        onDone && onDone(r);
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [prog]);
  const act = (a: string) => {
    switch (a) {
      case 'prep': setSt('preparing'); setChecks([]); setResult(null); setProg(0); setScrap(false); notes.current = []; L('進入啟動前檢查。'); sfx('prompt'); break;
      case 'start': if (unsafe.length) { toast('參數超出安全窗口，無法啟動'); sfx('fail'); return; } setSt('running'); L(`啟動運轉（速度 ${speed}%）。`); break;
      case 'pause': setSt('paused'); L('暫停：動畫與進度同步停止。'); break;
      case 'resume': setSt('running'); L('恢復運轉。'); break;
      case 'estop': if (running || st === 'paused') { setScrap(true); notes.current.push('製程中按下緊急停止，在製工件隔離'); } setSt('estop'); setClearOk(false); sfx('warn'); L('⛔ 緊急停止！所有運動立即停止。'); break;
      case 'reset': if (st === 'estop' && !clearOk) return; setSt('idle'); setProg(0); L('急停已復歸，回到待機（需重新執行啟動前檢查）。'); break;
      case 'warn': setSt('warning'); sfx('warn'); L(`⚠ 模擬警告：${m.warn.n}——${m.warn.d}`); break;
      case 'slow': if (speedP) setParams((x) => ({ ...x, speed: Math.max(speedP.min, x.speed - 12) })); setSt('running'); notes.current.push('警告時降速運轉'); L('降速後繼續運轉並加強監控。'); break;
      case 'stopcheck': setSt('idle'); setProg(0); notes.current.push('警告時停機檢查'); L('停機檢查完成，回到待機。'); break;
      case 'fault': setSt('fault'); setScrap(true); sfx('fail'); L(`✖ 故障：${m.fault.n}——${m.fault.d}`); break;
      case 'maint': setSt('maintenance'); setLoto([]); L('進入保養模式：請依序完成上鎖掛牌（LOTO）。'); break;
      case 'fixed': setSt('idle'); setProg(0); L('排除完成、解除上鎖並確認人員撤離，回到待機。'); sfx('success'); break;
      case 'again': setSt('idle'); setProg(0); setResult(null); break;
    }
  };
  const pt = sel ? m.parts.find((x) => x.id === sel) : null;
  return (
    <div className="sx-sim">
      <div className="sx-row between wrap"><Badge st={st} /><div className="sx-seg">{([['full', '整機'], ['inside', '內部結構'], ['station', '逐站動畫']] as const).map(([k, n]) => <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{n}</button>)}</div></div>
      <MachineArt m={m} state={st} speed={speed} view={view} stage={stage} onPart={(id) => { setSel(id); sfx('click'); }} sel={sel} lowFx={s.settings.lowGfx} />
      {s.settings.pauseAnim && running && <small className="muted">（設定中已暫停動畫，進度仍依狀態計算）</small>}
      <div className="sx-prog"><div style={{ width: `${prog}%` }} /><span>{STAGES[m.id][stage]}・{prog.toFixed(0)}%</span></div>
      {pt && <div className="sx-partinfo"><b>{m.parts.indexOf(pt) + 1}. {pt.n}</b>：{pt.d}<button className="sx-x" onClick={() => setSel(null)}>✕</button></div>}
      {st === 'preparing' && <div className="sx-box"><b>啟動前檢查</b>{PREP.map((c) => <label key={c} className="sx-check"><input type="checkbox" checked={checks.includes(c)} onChange={(e) => setChecks(e.target.checked ? [...checks, c] : checks.filter((x) => x !== c))} />{c}</label>)}</div>}
      {st === 'estop' && <div className="sx-box red"><b>急停復歸前</b><label className="sx-check"><input type="checkbox" checked={clearOk} onChange={(e) => setClearOk(e.target.checked)} />已確認危險排除、人員離開危險區，並向領班通報</label></div>}
      {st === 'warning' && <div className="sx-box warn"><b>⚠ {m.warn.n}</b><p>{m.warn.d}</p><div className="sx-row wrap"><Btn sm onClick={() => act('slow')}>降速繼續並監控</Btn><Btn sm kind="danger" onClick={() => act('stopcheck')}>停機檢查</Btn></div></div>}
      {st === 'fault' && <div className="sx-box red"><b>✖ {m.fault.n}</b><p>{m.fault.d}</p><Btn sm kind="pri" onClick={() => act('maint')}>進入保養模式（LOTO）</Btn></div>}
      {st === 'maintenance' && <div className="sx-box purple"><b>上鎖掛牌程序</b>{LOTO.map((c, i) => <label key={c} className="sx-check"><input type="checkbox" disabled={i > loto.length} checked={loto.includes(c)} onChange={(e) => setLoto(e.target.checked ? [...loto, c] : loto.slice(0, i))} />{i + 1}. {c}</label>)}</div>}
      <div className="sx-ctrl">
        <Btn disabled={!['idle', 'complete'].includes(st)} onClick={() => act('prep')}>🔧 啟動前檢查</Btn>
        <Btn kind="ok" disabled={st !== 'preparing' || checks.length < PREP.length} onClick={() => act('start')}>▶ 啟動</Btn>
        {st === 'paused' ? <Btn onClick={() => act('resume')}>⏯ 恢復</Btn> : <Btn disabled={!running} onClick={() => act('pause')}>⏸ 暫停</Btn>}
        <Btn kind="danger" className="estop" disabled={['estop', 'maintenance'].includes(st)} onClick={() => act('estop')}>⛔ 緊急停止</Btn>
        <Btn disabled={st !== 'estop' || !clearOk} onClick={() => act('reset')}>⟲ 急停復歸</Btn>
        {!taskMode && <><Btn sm disabled={st !== 'running'} onClick={() => act('warn')}>模擬警告</Btn><Btn sm disabled={!running} onClick={() => act('fault')}>模擬故障</Btn></>}
        <Btn sm disabled={st !== 'maintenance' || loto.length < LOTO.length} onClick={() => act('fixed')}>✔ 排除完成</Btn>
      </div>
      <details className="sx-params" open={!lockParams}><summary>模擬參數（遊戲模擬資料，不可套用至實際設備）</summary>
        {m.params.map((x) => <SafeSlider key={x.id} label={x.n} unit={x.unit} v={params[x.id]} min={x.min} max={x.max} step={x.step} safe={x.safe} best={x.best} tip={x.tip} disabled={lockParams || !['idle', 'preparing', 'paused', 'complete'].includes(st)} onChange={(v) => setParams({ ...params, [x.id]: v })} />)}
        {running && <small className="muted">運轉中參數鎖定；請暫停後調整。</small>}
      </details>
      {result && !taskMode && <div className={result.ok ? 'sx-ok' : 'sx-warn'}>{result.ok ? '✔ 成品合格' : '✖ 成品不合格'}：品質指數 {(result.q * 100).toFixed(0)}。{result.ok ? '' : '試著把參數調到建議範圍內。'}</div>}
      <details className="sx-log"><summary>設備事件紀錄（{log.length}）</summary><ol>{log.map((l, i) => <li key={i}>{l}</li>)}</ol></details>
    </div>
  );
}

// ---------------- 工具操作示範 ----------------
function ToolDemo({ t }: { t: string }) {
  const { sfx } = useA();
  const [v, setV] = useState(40); const [sample, setSample] = useState(0); const [res, setRes] = useState('');
  const demos: Record<string, any> = {
    caliper: <div><p>拖曳游標尺讓量爪輕觸胚料（實際長度 45.00 mm，模擬）。</p><svg viewBox="0 0 320 90" className="sx-demo"><rect x="20" y="40" width="280" height="12" fill="#cfd8e2" />{Array.from({ length: 29 }, (_, i) => <path key={i} d={`M${20 + i * 10} 40 v${i % 5 ? 4 : 8}`} stroke="#333" />)}<rect x="22" y="20" width="6" height="40" fill="#AEB8C4" /><rect x={22 + v * 4.6} y="20" width="30" height="40" fill="#8a96a5" opacity=".9" /><rect x="30" y="58" width={v * 4.6 - 8} height="14" fill="#c9a26a" /></svg>
      <input type="range" min={30} max={60} step={0.02} value={v} onChange={(e) => setV(+e.target.value)} aria-label="游標位置" /><p>讀值：<b>{v.toFixed(2)} mm</b> {Math.abs(v - 45) <= 0.02 ? '✔ 量爪接觸良好' : v < 45 ? '（量爪壓入工件，讀值不可信）' : '（尚未接觸）'}</p></div>,
    micrometer: <div><p>以棘輪微調至接觸（實際外徑 9.88 mm，模擬）。每次 0.01 mm。</p><div className="sx-row"><Btn sm onClick={() => { setV(+(v - 0.01).toFixed(2)); sfx('contact'); }}>棘輪 −0.01</Btn><b className="sx-big">{(v / 4).toFixed(2)} mm</b><Btn sm onClick={() => { setV(+(v + 0.01).toFixed(2)); sfx('contact'); }}>棘輪 ＋0.01</Btn></div><input type="range" min={38} max={42} step={0.01} value={v} onChange={(e) => setV(+e.target.value)} aria-label="套筒" /><p>{Math.abs(v / 4 - 9.88) < 0.006 ? '✔ 棘輪滑轉，量測力一致：讀值有效' : '繼續調整'}</p></div>,
    ring: <div><p>選擇樣品並用螺紋環規測試（外螺紋）。</p><div className="sx-row wrap">{['合格品', '外徑偏大', '外徑偏小（牙型不足）'].map((n, i) => <button key={n} className={`sx-opt ${sample === i ? 'on' : ''}`} onClick={() => { setSample(i); setRes(''); }}>{n}</button>)}</div><div className="sx-row"><Btn onClick={() => { setRes(sample === 1 ? 'GO 端無法旋入 → 不合格' : 'GO 端順利旋入'); sfx('contact'); }}>GO 通端</Btn><Btn onClick={() => { setRes(sample === 2 ? 'NO-GO 端可旋入超過 2 圈 → 不合格' : 'NO-GO 端無法旋入（或不超過 2 圈）'); sfx('contact'); }}>NO-GO 止端</Btn></div>{res && <div className="sx-box">{res}</div>}</div>,
    plug: <div><p>螺紋塞規檢查螺帽內螺紋。</p><div className="sx-row wrap">{['合格品', '內徑偏小', '內徑偏大'].map((n, i) => <button key={n} className={`sx-opt ${sample === i ? 'on' : ''}`} onClick={() => { setSample(i); setRes(''); }}>{n}</button>)}</div><div className="sx-row"><Btn onClick={() => setRes(sample === 1 ? 'GO 無法旋入 → 不合格' : 'GO 順利旋入')}>GO</Btn><Btn onClick={() => setRes(sample === 2 ? 'NO-GO 可旋入 → 不合格' : 'NO-GO 不入')}>NO-GO</Btn></div>{res && <div className="sx-box">{res}</div>}</div>,
    torque: <div><p>設定扭力後鎖附，達設定值時扳手「喀」一聲。</p><input type="range" min={10} max={60} step={1} value={v} onChange={(e) => setV(+e.target.value)} aria-label="設定扭力" /><p>設定：<b>{v} N·m</b>（模擬）</p><Btn onClick={() => { setRes(`達 ${v} N·m，扳手觸發！`); sfx('contact'); }}>鎖附</Btn>{res && <div className="sx-box">{res}</div>}<small className="muted">扭力扳手須定期校正；預置扭力螺帽另以旋入扭力檢測。</small></div>,
    dial: <div><p>調整模具對位，觀察百分表指針。</p><input type="range" min={30} max={50} step={0.5} value={v} onChange={(e) => setV(+e.target.value)} aria-label="偏移" /><svg viewBox="0 0 120 120" className="sx-demo sm"><circle cx="60" cy="60" r="50" fill="#f0f4f8" stroke="#AEB8C4" strokeWidth="5" />{Array.from({ length: 20 }, (_, i) => <path key={i} d="M60 14 v6" stroke="#333" transform={`rotate(${i * 18} 60 60)`} />)}<path d="M60 60 L60 20" stroke="#E95858" strokeWidth="2.5" transform={`rotate(${(v - 40) * 18} 60 60)`} /></svg><p>偏擺：{((v - 40) / 100).toFixed(3)} mm {Math.abs(v - 40) <= 1 ? '✔ 對位良好' : ''}</p></div>,
    scan: <div><p>掃描料箱標籤。</p><Btn kind="pri" onClick={() => { setRes('工單 WO-2611-0283｜批號 HB-M10-26110301｜數量 2,000｜熱處理爐次 HT-07（模擬資料）'); sfx('prompt'); }}>📷 掃描</Btn>{res && <div className="sx-box mono">{res}</div>}</div>,
  };
  return demos[t] || null;
}

// ---------------- 首頁 ----------------
function Home() {
  const { s, setTab, push } = useA();
  const role = ROLES.find((r) => r.id === s.role) || ROLES[1];
  const unitsDone = UNITS.filter((u) => s.units[u.id]?.done).length;
  const tasksPass = TASKS.filter((t) => s.tasks[t.id]?.pass).length;
  const nextUnit = UNITS.find((u) => !s.units[u.id]?.done) || UNITS[0];
  const nextTask = TASKS.find((t) => !s.tasks[t.id]?.pass) || TASKS[0];
  const career = slotInfo(0);
  const recentM = s.recent.map((r) => MACHINES.find((m) => m.id === r.id)).filter(Boolean).slice(0, 4) as Machine[];
  const cont = () => { const l = s.last; if (!l) { setTab('scene'); return; } if (l.r === 'career') push({ t: 'career' }); else push({ t: l.r as any, id: l.id }); };
  return (
    <div className="sx-page">
      <div className="sx-hero">
        <div className="sx-hero-t"><small>SUMEEKO 智慧工廠</small><h1>歡迎回到工廠</h1><p>從一顆螺絲開始，走進冷鍛、搓牙、熱處理、光學檢驗與智慧物流的工作現場。</p>
          <div className="sx-row wrap"><Btn kind="pri" onClick={cont}>▶ 繼續探索</Btn><Btn onClick={() => setTab('scene')}>進入工作場景</Btn></div></div>
        <div className="sx-hero-art" onClick={() => push({ t: 'role', id: role.id })}><MiniScene /><div className="sx-hero-p"><Person role={role} size={150} act="point" /></div></div>
      </div>
      <div className="sx-grid4">
        <div className="sx-stat"><small>教學單元</small><b>{unitsDone}/{UNITS.length}</b><i style={{ width: `${(unitsDone / UNITS.length) * 100}%` }} /></div>
        <div className="sx-stat"><small>任務挑戰</small><b>{tasksPass}/{TASKS.length}</b><i style={{ width: `${(tasksPass / TASKS.length) * 100}%` }} /></div>
        <div className="sx-stat"><small>職涯模式</small><b>{career ? CAREERS[career.pos].title : '尚未開始'}</b><i style={{ width: `${career ? ((career.pos + 1) / CAREERS.length) * 100 : 0}%` }} /></div>
        <div className="sx-stat"><small>收藏</small><b>{s.fav.length}</b></div>
      </div>
      <Sec title="推薦課程" right={<Btn sm onClick={() => push({ t: 'unit', id: nextUnit.id })}>開始</Btn>}><div className="sx-rec" onClick={() => push({ t: 'unit', id: nextUnit.id })}><b>{nextUnit.n}</b><small>{nextUnit.goal}</small></div></Sec>
      <Sec title="下一個任務" right={<Btn sm kind="pri" onClick={() => push({ t: 'task', id: nextTask.id })}>挑戰</Btn>}><div className="sx-rec" onClick={() => push({ t: 'task', id: nextTask.id })}><b>{nextTask.id}｜{nextTask.n}</b><small>{nextTask.desc}</small></div></Sec>
      <Sec title="快速進入">
        <div className="sx-quick">
          {[['🏭', '工作場景', () => setTab('scene')], ['📘', '教學模式', () => push({ t: 'unit', id: nextUnit.id })], ['🎯', '任務挑戰', () => setTab('tasks')], ['🎓', '職涯模式（完整遊戲）', () => push({ t: 'career' })], ['🔩', '工件 3D', () => push({ t: 'part', id: 'P04' })], ['⚙', '設備圖鑑', () => setTab('codex')]].map(([i, n, f]: any) => <button key={n} className="sx-q" onClick={f}><span>{i}</span>{n}</button>)}
        </div>
      </Sec>
      {recentM.length > 0 && <Sec title="最近使用機台"><div className="sx-hlist">{recentM.map((m) => <button key={m.id} className="sx-mcard" onClick={() => push({ t: 'machine', id: m.id })}><b>{m.id}</b><span>{m.n}</span></button>)}</div></Sec>}
    </div>
  );
}
function MiniScene() {
  const cells = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]] as const;
  return (
    <svg viewBox="0 0 320 196" className="sx-mini">
      <defs>
        <linearGradient id="mini-floor" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#193056" /><stop offset="1" stopColor="#0d1830" /></linearGradient>
        <linearGradient id="mini-cell" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#32558a" /><stop offset="1" stopColor="#173258" /></linearGradient>
        <linearGradient id="mini-hot" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffcb85" /><stop offset="1" stopColor="#f59e38" /></linearGradient>
        <radialGradient id="mini-glow" cx="50%" cy="48%" r="60%"><stop offset="0" stopColor="rgba(54,197,232,.38)" /><stop offset="1" stopColor="rgba(54,197,232,0)" /></radialGradient>
      </defs>
      <rect width="320" height="196" rx="18" fill="#0d1727" />
      <polygon points="160,14 304,90 160,168 16,90" fill="url(#mini-floor)" stroke="#294971" strokeWidth="2" />
      <polygon points="160,33 270,90 160,146 50,90" fill="none" stroke="#36C5E8" strokeOpacity=".18" strokeWidth="34" />
      {cells.map(([x, y], i) => {
        const cx = 160 + (x - y) * 47;
        const cy = 42 + (x + y) * 26;
        const active = i === 4;
        return <g key={i}>
          <polygon points={`${cx},${cy - 16} ${cx + 33},${cy} ${cx},${cy + 16} ${cx - 33},${cy}`} fill={active ? 'url(#mini-hot)' : 'url(#mini-cell)'} opacity={active ? 0.95 : 1} stroke={active ? '#ffd4a2' : '#4c73ab'} />
          <polygon points={`${cx},${cy - 16} ${cx + 33},${cy} ${cx},${cy + 16} ${cx - 33},${cy}`} fill="url(#mini-glow)" opacity={active ? 1 : .55} />
          <text x={cx} y={cy + 4} fontSize="10" textAnchor="middle" fill="#e8eef8" fontWeight="700">{CELLS[i].id}</text>
          {active && <g><rect x={cx - 10} y={cy - 42} width="20" height="16" rx="3" fill="#f0f4f8" opacity=".92" /><rect x={cx - 16} y={cy - 26} width="32" height="4" rx="2" fill="#36C5E8" opacity=".9" /></g>}
        </g>;
      })}
      <g opacity=".86">
        <path d="M114 47 L160 73 L206 99 L160 125 L114 151" fill="none" stroke="#36C5E8" strokeWidth="2.6" strokeDasharray="7 6" className="sx-flow" />
        <circle cx="114" cy="47" r="3.5" fill="#36C5E8" /><circle cx="206" cy="99" r="3.5" fill="#36C5E8" />
      </g>
      <g transform="translate(227 56)">
        <rect x="-16" y="0" width="32" height="48" rx="5" fill="#1e2f47" stroke="#5d7cad" />
        <rect x="-12" y="5" width="24" height="10" rx="2" fill="#06131f" />
        <circle cx="0" cy="26" r="4" fill="#38B88A" /><circle cx="0" cy="38" r="6" fill="#E95858" />
      </g>
    </svg>
  );
}

// ---------------- 工作場景（九宮格 2.5D） ----------------
function Scene() {
  const { s, push, sfx } = useA();
  const [vb, setVb] = useState({ x: 0, y: 0, k: 1 });
  const [sel, setSel] = useState<{ kind: 'cell' | 'machine' | 'role'; id: string } | null>(null);
  const [labels, setLabels] = useState(true);
  const [showIndex, setShowIndex] = useState(() => window.matchMedia('(max-width: 640px) and (min-height: 740px) and (orientation: portrait)').matches);
  const [sceneSize, setSceneSize] = useState({ width: 800, height: 520 });
  const viewportRef = useRef<HTMLDivElement>(null);
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const pz = useRef(0); const moved = useRef(0);
  const nextTask = TASKS.find((t) => !s.tasks[t.id]?.pass);
  const iso = (gx: number, gy: number) => ({ x: 400 + (gx - gy) * 150, y: 120 + (gx + gy) * 82 });
  const W = FACTORY_CAMERA.worldWidth, H = FACTORY_CAMERA.worldHeight;
  // Camera covers structural columns and all nine workstations without cropping.
  // Using a measured viewport prevents tall phones from losing the outer cells.
  useEffect(() => {
    const el = viewportRef.current; if (!el) return;
    const update = () => { const r = el.getBoundingClientRect(); setSceneSize({ width: Math.max(1, r.width), height: Math.max(1, r.height) }); };
    update();
    if (typeof ResizeObserver !== 'undefined') { const ro = new ResizeObserver(update); ro.observe(el); return () => ro.disconnect(); }
    window.addEventListener('resize', update); return () => window.removeEventListener('resize', update);
  }, []);
  const rolesAt: Record<string, string> = { B1: 'R2', B2: 'R4', B3: 'R1', C1: 'R3', C3: 'R6', A3: 'R5' };
  const down = (e: React.PointerEvent) => { ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved.current = 0; if (ptrs.current.size === 2) { const [a, b] = [...ptrs.current.values()]; pz.current = Math.hypot(a.x - b.x, a.y - b.y); } };
  const move = (e: React.PointerEvent) => {
    const p0 = ptrs.current.get(e.pointerId); if (!p0) return;
    const el = e.currentTarget as SVGSVGElement; const sc = 1 / Math.max(0.00001, Math.abs(el.getScreenCTM()?.a || (sceneSize.width / (W / vb.k))));
    if (ptrs.current.size === 1) { const dx = e.clientX - p0.x, dy = e.clientY - p0.y; moved.current += Math.abs(dx) + Math.abs(dy); if (moved.current > 8) { try { el.setPointerCapture(e.pointerId); } catch { } } setVb((v) => ({ ...v, x: clamp(v.x - dx * sc, -300, 300), y: clamp(v.y - dy * sc, -200, 200) })); }
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.current.size === 2) { const [a, b] = [...ptrs.current.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); if (pz.current) setVb((v) => ({ ...v, k: clamp(v.k * (d / pz.current), 0.8, 3) })); pz.current = d; moved.current = 99; }
  };
  const up = (e: React.PointerEvent) => { ptrs.current.delete(e.pointerId); if (ptrs.current.size < 2) pz.current = 0; };
  const tap = (kind: 'cell' | 'machine' | 'role', id: string) => { if (moved.current > 8) return; setSel({ kind, id }); sfx('click'); };
  const zoomTo = (id: string) => { const c = CELLS.find((x) => x.id === id)!; const p = iso(c.x, c.y); setVb({ x: p.x - FACTORY_CAMERA.centerX, y: p.y - FACTORY_CAMERA.centerY, k: 2 }); };
  // Keep the real viewport aspect ratio: xMidYMid meet preserves every cell at overview.
  // At close zoom, expand the shorter world axis so drag distances remain correct.
  const view = factoryViewBox(sceneSize.width, sceneSize.height, vb.k, vb.x, vb.y);
  const vw = view.width, vh = view.height, vx = view.x, vy = view.y;
  useBack(() => { if (showIndex) { setShowIndex(false); return true; } return false; }, showIndex);
  const selCell = sel?.kind === 'cell' ? CELLS.find((c) => c.id === sel.id) : null;
  const selM = sel?.kind === 'machine' ? M(sel.id) : null;
  const selR = sel?.kind === 'role' ? ROLES.find((r) => r.id === sel.id) : null;
  return (
    <div className={`sx-scene ${showIndex ? 'with-index' : ''}`}>
      <div className="sx-scene-viewport" ref={viewportRef}>
      <div className="sx-top glass"><div className="sx-top-t"><b>工作場景・智慧工廠總覽</b><small>{nextTask ? `目前任務：${nextTask.id} ${nextTask.n}` : '所有任務已完成'}・{vb.k > 1.5 ? '工作站近景' : '總覽'}</small></div>{nextTask && <Btn sm kind="pri" onClick={() => push({ t: 'task', id: nextTask.id })}>任務</Btn>}</div>
      <svg viewBox={`${vx} ${vy} ${vw} ${vh}`} preserveAspectRatio="xMidYMid meet" aria-label="九宮格工廠互動場景" role="img" className={`sx-iso ${s.settings.lowGfx ? 'low' : ''}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={(e) => setVb((v) => ({ ...v, k: clamp(v.k * (e.deltaY > 0 ? 0.9 : 1.1), 0.8, 3) }))}>
        <defs>
          <linearGradient id="tp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#24406c" /><stop offset="1" stopColor="#152a4c" /></linearGradient>
          <linearGradient id="col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#3a4658" /><stop offset=".5" stopColor="#8a96a5" /><stop offset="1" stopColor="#2c3644" /></linearGradient>
          <radialGradient id="lamp"><stop offset="0" stopColor="#f0f4f8" stopOpacity=".35" /><stop offset="1" stopColor="#f0f4f8" stopOpacity="0" /></radialGradient>
        </defs>
        <rect x="-400" y="-300" width="1600" height="1200" fill="#0b1422" />
        {/* 地坪與安全通道 */}
        {(() => { const a = iso(-0.6, -0.6), b = iso(2.6, -0.6), c = iso(2.6, 2.6), d = iso(-0.6, 2.6); return <polygon points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y} ${d.x},${d.y}`} fill="#121e30" stroke="#2a4470" />; })()}
        {[0.5, 1.5].map((g) => { const a = iso(g, -0.6), b = iso(g, 2.6), c = iso(-0.6, g), d = iso(2.6, g); return <g key={g}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#F59E38" strokeWidth="3" strokeDasharray="14 10" opacity=".7" /><line x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke="#F59E38" strokeWidth="3" strokeDasharray="14 10" opacity=".7" /></g>; })}
        {/* 工作區塊 */}
        {CELLS.map((c) => {
          const p = iso(c.x, c.y); const on = sel?.kind === 'cell' && sel.id === c.id;
          return <g key={c.id} onClick={() => tap('cell', c.id)} className="sx-cell"><polygon points={`${p.x},${p.y - 58} ${p.x + 108},${p.y} ${p.x},${p.y + 58} ${p.x - 108},${p.y}`} fill="url(#tp)" stroke={on ? '#36C5E8' : '#35558a'} strokeWidth={on ? 3 : 1} opacity=".9" />
            {labels && <g className="sx-grid-marker"><rect x={p.x - 20} y={p.y + 35} width="40" height="23" rx="8" fill="#081b30" stroke="#5d7cad" /><text x={p.x} y={p.y + 51} textAnchor="middle" className="sx-cl">{c.id}</text></g>}</g>;
        })}
        {/* 環境物件：結構柱、照明、配電櫃、貨架、看板、圍籬 */}
        {[[-0.6, -0.6], [2.6, -0.6], [-0.6, 2.6], [1, -0.6], [-0.6, 1]].map(([x, y], i) => { const p = iso(x, y); return <g key={i}><rect x={p.x - 7} y={p.y - 150} width="14" height="150" fill="url(#col)" /><rect x={p.x - 11} y={p.y - 156} width="22" height="8" fill="#56606e" /></g>; })}
        {!s.settings.lowGfx && [[0, 0], [1, 1], [2, 2], [2, 0], [0, 2]].map(([x, y], i) => { const p = iso(x, y); return <ellipse key={i} cx={p.x} cy={p.y} rx="120" ry="60" fill="url(#lamp)" className="sx-flicker" style={{ animationDelay: `${i * 0.7}s` }} />; })}
        {(() => { const p = iso(1, 0); return <g><rect x={p.x - 70} y={p.y - 120} width="140" height="56" rx="5" fill="#06131f" stroke="#36C5E8" /><text x={p.x} y={p.y - 98} textAnchor="middle" fontSize="13" fill="#36C5E8">生產進度看板</text><rect x={p.x - 58} y={p.y - 88} width="116" height="10" fill="#122436" /><rect x={p.x - 58} y={p.y - 88} width="84" height="10" fill="#38B88A" /><text x={p.x} y={p.y - 70} textAnchor="middle" fontSize="10" fill="#AEB8C4">OEE 76%・OTIF 92%（模擬）</text></g>; })()}
        {(() => { const p = iso(0, 2); return <g>{[0, 1, 2].map((i) => <rect key={i} x={p.x - 60 + i * 42} y={p.y - 60} width="34" height="44" fill="#3a4656" stroke="#5d6c80" />)}<text x={p.x} y={p.y - 66} textAnchor="middle" fontSize="10" fill="#AEB8C4">模具貨架</text></g>; })()}
        {(() => { const p = iso(0, 0); return <g><ellipse cx={p.x - 20} cy={p.y - 18} rx="24" ry="14" fill="none" stroke="#7d6a55" strokeWidth="8" /><ellipse cx={p.x + 26} cy={p.y - 8} rx="24" ry="14" fill="none" stroke="#6b5a48" strokeWidth="8" /><text x={p.x} y={p.y + 22} textAnchor="middle" fontSize="10" fill="#c8b296">盤元</text></g>; })()}
        {(() => { const p = iso(2.6, 1); return <g><rect x={p.x - 16} y={p.y - 70} width="32" height="60" fill="#202831" stroke="#5d6c80" /><circle cx={p.x} cy={p.y - 54} r="4" fill="#38B88A" /><text x={p.x} y={p.y - 2} textAnchor="middle" fontSize="9" fill="#AEB8C4">配電櫃</text></g>; })()}
        {/* 機台 */}
        {CELLS.flatMap((c) => c.machines.map((mid, k) => {
          const p = iso(c.x, c.y); const ox = c.machines.length > 1 ? (k ? 40 : -40) : 0; const on = sel?.kind === 'machine' && sel.id === mid;
          return <g key={mid} className="sx-mach" onClick={(e) => { e.stopPropagation(); tap('machine', mid); }} transform={`translate(${p.x + ox} ${p.y - 6})`}>
            <polygon points="-34,-10 0,-28 34,-10 0,8" fill="#3a5a8a" stroke={on ? '#F59E38' : '#5d7cad'} strokeWidth={on ? 3 : 1} /><polygon points="-34,-10 0,8 0,-30 -34,-48" fill="#22344f" /><polygon points="34,-10 0,8 0,-30 34,-48" fill="#2c4466" /><polygon points="-34,-48 0,-66 34,-48 0,-30" fill="#4a6c9e" />
            <rect x="6" y="-44" width="14" height="10" fill="#06131f" stroke="#36C5E8" /><circle cx="-14" cy="-38" r="4" fill="#E95858" />
            {labels && <g className="sx-machine-marker"><rect x="-24" y="9" width="48" height="22" rx="7" fill="#182335" stroke="#ba8d54"/><text y="25" textAnchor="middle" className="sx-ml">{mid}</text></g>}
          </g>;
        }))}
        {/* 人物 */}
        {Object.entries(rolesAt).map(([cid, rid]) => {
          const c = CELLS.find((x) => x.id === cid)!; const p = iso(c.x, c.y); const r = ROLES.find((x) => x.id === rid)!;
          return <g key={rid} transform={`translate(${p.x + 60} ${p.y + 4})`} onClick={(e) => { e.stopPropagation(); tap('role', rid); }} className="sx-fig">
            <ellipse cx="0" cy="2" rx="10" ry="4" fill="#000" opacity=".4" /><rect x="-6" y="-26" width="12" height="26" rx="4" fill="#24477a" /><rect x="-6" y="-16" width="12" height="2.5" fill="#F59E38" /><circle cy="-32" r="7" fill="#eac09a" /><path d="M-8 -34 Q0 -46 8 -34Z" fill="#f0f4f8" />
            <circle cx="10" cy="-36" r="5" fill={r.color} className="sx-ping" />
          </g>;
        })}
        {/* 物料流 */}
        <polyline points={[[0, 0], [0, 1], [1, 1], [2, 1], [2, 0], [2, 2], [1, 2]].map(([x, y]) => { const p = iso(x, y); return `${p.x},${p.y}`; }).join(' ')} fill="none" stroke="#36C5E8" strokeWidth="3" strokeDasharray="10 12" className="sx-flow" opacity=".8" />
      </svg>
      </div>
      <div className="sx-scene-bar">
        <Btn sm onClick={() => setVb((v) => ({ ...v, k: clamp(v.k * 1.25, 0.8, 3) }))}>＋</Btn><Btn sm onClick={() => setVb((v) => ({ ...v, k: clamp(v.k / 1.25, 0.8, 3) }))}>－</Btn>
        <Btn sm onClick={() => setVb({ x: 0, y: 0, k: 1 })}>⌂ 總覽</Btn><Btn sm onClick={() => setShowIndex((v) => !v)}>{showIndex ? '收起工作站' : '九宮格索引'}</Btn><Btn sm onClick={() => setLabels(!labels)}>{labels ? '隱藏' : '顯示'}標籤</Btn>
        <span className="sx-hint">拖曳移動畫面・雙指縮放・點擊機台／人物；完整名稱請開啟索引</span>
      </div>
      {showIndex && <div className="sx-scene-index" aria-label="九宮格工作站索引"><div className="sx-index-head"><strong>選擇工作站</strong><button type="button" onClick={() => setShowIndex(false)} aria-label="關閉工作站索引">✕</button></div><div className="sx-index-grid">{CELLS.map((c) => <button key={c.id} type="button" onClick={() => { setShowIndex(false); setSel({ kind: 'cell', id: c.id }); }}><b>{c.id}</b><span>{c.n}</span></button>)}</div></div>}
      {sel && <Sheet onClose={() => setSel(null)} title={selM ? `${selM.id}｜${selM.n}` : selR ? selR.n : `${selCell!.id}｜${selCell!.n}`}>
        {selM && <div><p>{selM.desc}</p><div className="sx-row wrap"><Btn kind="pri" onClick={() => push({ t: 'machine', id: selM.id })}>進入機台模擬</Btn><Btn onClick={() => push({ t: 'unit', id: selM.unit })}>教學單元</Btn>{selM.task && <Btn onClick={() => push({ t: 'task', id: selM.task })}>任務 {selM.task}</Btn>}<Fav id={selM.id} /></div><small className="muted">輸入：{P(selM.input).n} → 輸出：{P(selM.output).n}</small></div>}
        {selR && <div className="sx-row"><Person role={selR} size={130} act="point" /><div><p>{selR.duty}</p><div className="sx-row wrap"><Btn kind="pri" onClick={() => push({ t: 'role', id: selR.id })}>人物資料</Btn>{selR.tasks.map((t) => <Btn key={t} onClick={() => push({ t: 'task', id: t })}>任務 {t}</Btn>)}</div></div></div>}
        {selCell && <div><p>{selCell.machines.length ? `設備：${selCell.machines.map((m) => M(m).n).join('、')}` : '支援區域'}</p><div className="sx-row wrap"><Btn onClick={() => { zoomTo(selCell.id); setSel(null); }}>🔍 工作站近景</Btn>{selCell.machines.map((m) => <Btn key={m} kind="pri" onClick={() => push({ t: 'machine', id: m })}>{m} 機台特寫</Btn>)}{selCell.items.filter((i) => i.startsWith('P')).map((i) => <Btn key={i} onClick={() => push({ t: 'part', id: i })}>工件檢視</Btn>)}{selCell.items.filter((i) => i.startsWith('T')).map((i) => <Btn key={i} onClick={() => push({ t: 'tool', id: i })}>{TOOLS.find((t) => t.id === i)!.n}</Btn>)}</div></div>}
      </Sheet>}
    </div>
  );
}

// ---------------- 圖鑑 ----------------
function Codex() {
  const { push } = useA();
  const [tab, setTab] = useState<'m' | 't' | 'mat' | 'p' | 'k' | 'r'>('m');
  const [q, setQ] = useState('');
  const terms = CODEX.filter((c) => `${c.zh}${c.en}${c.abbr || ''}${c.def}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="sx-page">
      <h2>圖鑑</h2>
      <div className="sx-seg wide">{([['m', '設備'], ['t', '工具'], ['mat', '材料'], ['p', '工件'], ['k', '知識'], ['r', '人物']] as const).map(([k, n]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{n}</button>)}</div>
      {tab === 'm' && <div className="sx-list">{MACHINES.map((m) => <button key={m.id} className="sx-item" onClick={() => push({ t: 'machine', id: m.id })}><span className="sx-ic">{m.id}</span><span><b>{m.n}</b><small>{m.en}・{m.process}</small></span><Fav id={m.id} /></button>)}</div>}
      {tab === 't' && <div className="sx-grid2">{TOOLS.map((t) => <button key={t.id} className="sx-tile" onClick={() => push({ t: 'tool', id: t.id })}><ToolIcon id={t.id} size={56} /><b>{t.n}</b><small>{t.en}</small></button>)}</div>}
      {tab === 'mat' && <div className="sx-list">{MATERIALS.map((m) => <button key={m.id} className="sx-item" onClick={() => push({ t: 'material', id: m.id })}><span className="sx-ic">MAT</span><span><b>{m.n}</b><small>{m.en}</small></span></button>)}</div>}
      {tab === 'p' && <div>{ROUTES.map((r) => <Sec key={r.id} title={`製程途程：${r.n}`}><div className="sx-route">{r.steps.map((id, i) => <React.Fragment key={id}><button onClick={() => push({ t: 'part', id })}>{P(id).n}</button>{i < r.steps.length - 1 && <i>→</i>}</React.Fragment>)}</div></Sec>)}<small className="muted">不同產品走不同途程；球化與伸線的順序依鋼種與路徑而異。</small></div>}
      {tab === 'k' && <div><input className="sx-search" placeholder="搜尋術語：OEE、搓牙、RAG…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Sec title="專利知識卡">{PATENTS.map((p) => <button key={p.id} className="sx-item" onClick={() => push({ t: 'patent', id: p.id })}><span className="sx-ic">專利</span><span><b>{p.no}</b><small>{p.title}</small></span></button>)}</Sec>
        <div className="sx-terms">{terms.map((t) => <details key={t.id} className="sx-term"><summary><b>{t.zh}</b><small>（{t.en}{t.abbr ? `, ${t.abbr}` : ''}）</small></summary><p>{t.def}</p></details>)}</div></div>}
      {tab === 'r' && <div className="sx-grid2">{ROLES.map((r) => <button key={r.id} className="sx-tile" onClick={() => push({ t: 'role', id: r.id })}><Person role={r} size={120} /><b>{r.n}</b><small>{r.en}</small></button>)}</div>}
    </div>
  );
}
function MachinePage({ id }: { id: string }) {
  const m = M(id); const { push, set } = useA();
  useEffect(() => touchRecent(set, id, 'machine'), [id]);
  return (
    <div className="sx-page">
      <TopBar title={`${m.id}｜${m.n}`} sub={`${m.en}・${m.type}`} right={<Fav id={m.id} />} />
      <MachineSim m={m} />
      <Sec title="設備資料"><p>{m.desc}</p>
        <div className="sx-kv"><div><span>所屬製程</span><b>{m.process}</b></div><div><span>場景位置</span><b>{m.cell}</b></div><div><span>輸入工件</span><b><a onClick={() => push({ t: 'part', id: m.input })}>{P(m.input).n}</a></b></div><div><span>輸出工件</span><b><a onClick={() => push({ t: 'part', id: m.output })}>{P(m.output).n}</a></b></div><div><span>品質結果</span><b>{m.quality.join('、')}</b></div></div>
        <h4>主要部件</h4><ol className="sx-ol">{m.parts.map((p) => <li key={p.id}><b>{p.n}</b>：{p.d}</li>)}</ol>
        <h4>安全注意事項</h4><ul className="sx-ul warn">{m.safety.map((x) => <li key={x}>{x}</li>)}</ul>
        <div className="sx-row wrap"><Btn onClick={() => push({ t: 'unit', id: m.unit })}>📘 教學單元</Btn>{m.task && <Btn kind="pri" onClick={() => push({ t: 'task', id: m.task })}>🎯 任務 {m.task}</Btn>}</div>
      </Sec>
    </div>
  );
}
function PartPage({ id }: { id: string }) {
  const p = P(id); const { push, set } = useA();
  useEffect(() => touchRecent(set, id, 'part'), [id]);
  const route = ROUTES.find((r) => r.steps.includes(id)) || ROUTES[0];
  const idx = route.steps.indexOf(id);
  return (
    <div className="sx-page">
      <TopBar title={p.n} sub={`${p.code}・${p.stage}`} right={<Fav id={p.id} />} />
      <PartViewer part={p} />
      <Sec title={`工序階段對照：${route.n}`}>
        <input type="range" min={0} max={route.steps.length - 1} value={idx} onChange={(e) => push({ t: 'part', id: route.steps[+e.target.value] })} aria-label="工序階段" className="sx-stage" />
        <div className="sx-route">{route.steps.map((s, i) => <React.Fragment key={s}><button className={s === id ? 'on' : ''} onClick={() => push({ t: 'part', id: s })}>{P(s).n}</button>{i < route.steps.length - 1 && <i>→</i>}</React.Fragment>)}</div>
      </Sec>
      <Sec title="工件資料"><div className="sx-kv">
        <div><span>原材料／狀態</span><b>{p.mat}</b></div><div><span>結構與尺寸示意</span><b>{p.dims}</b></div><div><span>加工階段</span><b>{p.stage}</b></div><div><span>適用設備</span><b>{p.machine}</b></div>
        <div><span>品質特性</span><b>{p.quality.join('、')}</b></div><div><span>常見缺陷</span><b>{p.defects.join('、')}</b></div><div><span>成品用途</span><b>{p.use}</b></div></div>
        <small className="muted">尺寸為教學示意，非實際產品規格。</small></Sec>
    </div>
  );
}
function ToolPage({ id }: { id: string }) {
  const t = TOOLS.find((x) => x.id === id)!;
  return (
    <div className="sx-page"><TopBar title={t.n} sub={t.en} right={<Fav id={t.id} />} />
      <Sec><div className="sx-row"><ToolIcon id={t.id} size={110} /><div className="sx-kv one"><div><span>材質</span><b>{t.mat}</b></div><div><span>對應職業</span><b>{t.role}</b></div><div><span>適用工件</span><b>{t.parts}</b></div></div></div><p>{t.use}</p></Sec>
      {t.demo && <Sec title="操作示範（模擬）"><ToolDemo t={t.demo} /></Sec>}
    </div>
  );
}
function MaterialPage({ id }: { id: string }) {
  const m = MATERIALS.find((x) => x.id === id)!;
  return <div className="sx-page"><TopBar title={m.n} sub={m.en} /><Sec><p>{m.d}</p><div className="sx-kv"><div><span>常見用途</span><b>{m.use}</b></div><div><span>備註</span><b>{m.note}</b></div></div><small className="muted">鋼種名稱為教學示例，非特定公司實際用料。</small></Sec></div>;
}
function PatentPage({ id }: { id: string }) {
  const p = PATENTS.find((x) => x.id === id)!;
  return <div className="sx-page"><TopBar title={p.no} sub={p.title} /><Sec title="✅ 已確認的公開專利內容"><ul className="sx-ul">{p.confirmed.map((x) => <li key={x}>{x}</li>)}</ul></Sec><Sec title="💭 遊戲教學用工程應用推論"><ul className="sx-ul">{p.inference.map((x) => <li key={x}>{x}</li>)}</ul></Sec><Sec><div className="sx-kv"><div><span>相關製程</span><b>{p.process}</b></div><div><span>工程問題</span><b>{p.problem}</b></div><div><span>可延伸 AI 題目</span><b>{p.ai}</b></div></div><p className="small">公開來源：<a href={p.url} target="_blank" rel="noreferrer">{p.url}</a>（需網路）</p></Sec></div>;
}
function RolePage({ id }: { id: string }) {
  const r = ROLES.find((x) => x.id === id)!; const { push, s, set, toast } = useA();
  const [ang, setAng] = useState<Angle>('front'); const [act, setAct] = useState<any>('idle');
  return (
    <div className="sx-page"><TopBar title={r.n} sub={r.en} />
      <Sec><div className="sx-role"><div className="sx-role-art"><Person role={r} angle={ang} act={act} size={240} /></div>
        <div><div className="sx-seg">{([['front', '正面'], ['tq', '3/4'], ['side', '側面'], ['back', '背面']] as const).map(([k, n]) => <button key={k} className={ang === k ? 'on' : ''} onClick={() => setAng(k)}>{n}</button>)}</div>
          <div className="sx-seg">{([['idle', '待機'], ['point', '指向設備'], ['check', '檢查工件'], ['done', '完成任務'], ['alert', '異常反應']] as const).map(([k, n]) => <button key={k} className={act === k ? 'on' : ''} onClick={() => setAct(k)}>{n}</button>)}</div>
          <p>{r.duty}</p><div className="sx-kv one"><div><span>個人防護具</span><b>{r.ppe}</b></div><div><span>代表性道具</span><b>{r.tools.map((t) => TOOLS.find((x) => x.id === t)!.n).join('、')}</b></div></div>
          <div className="sx-row wrap">{r.tasks.map((t) => <Btn key={t} kind="pri" onClick={() => push({ t: 'task', id: t })}>任務 {t}</Btn>)}{r.tools.map((t) => <Btn key={t} sm onClick={() => push({ t: 'tool', id: t })}>{TOOLS.find((x) => x.id === t)!.n}</Btn>)}<Btn sm disabled={s.role === r.id} onClick={() => { set((x) => ({ ...x, role: r.id })); toast(`代表人物已設為 ${r.n}`); }}>設為代表人物</Btn></div>
        </div></div>
        <small className="muted">角色為原創 SVG 佔位美術（2.5D），尚非最終擬真 ACG 立繪；見素材清單。</small></Sec>
    </div>
  );
}

// ---------------- 教學單元 ----------------
function UnitPage({ id }: { id: string }) {
  const u = UNITS.find((x) => x.id === id)!; const m = M(u.machine); const { s, set, push, sfx, toast } = useA();
  const [ans, setAns] = useState<number[]>([]);
  useEffect(() => touchRecent(set, id, 'unit'), [id]);
  const correct = ans.filter((a, i) => a === u.quiz[i].a).length;
  const done = s.units[id]?.done;
  const finish = () => { set((x) => ({ ...x, units: { ...x.units, [id]: { done: true, quiz: Math.max(x.units[id]?.quiz || 0, correct), at: Date.now() } } })); sfx('success'); toast('教學單元完成，學習成果已保存'); };
  return (
    <div className="sx-page"><TopBar title={u.n} sub={`教學模式・${m.id} ${m.n}`} right={done ? <span className="sx-badge ok">✔ 已完成</span> : null} />
      <Sec title="① 工作目標"><p>{u.goal}</p></Sec>
      <Sec title="② 事前準備"><ul className="sx-ul">{u.prep.map((x) => <li key={x}>{x}</li>)}</ul></Sec>
      <Sec title="③ 相關設備" right={<Btn sm kind="pri" onClick={() => push({ t: 'machine', id: m.id })}>開啟模擬</Btn>}><p><b>{m.n}</b>（{m.en}）— {m.process}</p></Sec>
      <Sec title="④ 操作流程"><ol className="sx-ol">{u.steps.map((x) => <li key={x}>{x}</li>)}</ol></Sec>
      <Sec title="⑤ 工件加工前後變化"><div className="sx-grid2"><div><small>加工前：{P(u.before).n}</small><PartViewer part={P(u.before)} compact /></div><div><small>加工後：{P(u.after).n}</small><PartViewer part={P(u.after)} compact /></div></div></Sec>
      <Sec title="⑥ 基本原理"><p>{u.principle}</p></Sec>
      <Sec title="⑦ 品質檢查"><ul className="sx-ul">{u.check.map((x) => <li key={x}>{x}</li>)}</ul><h4>常見錯誤</h4><ul className="sx-ul warn">{u.mistakes.map((x) => <li key={x}>{x}</li>)}</ul></Sec>
      <Sec title="⑧ 知識問答">{u.quiz.map((q, i) => <div key={i} className="sx-quiz"><p><b>Q{i + 1}.</b> {q.q}</p><div className="sx-opts">{q.o.map((o, j) => <button key={j} className={`sx-opt ${ans[i] === j ? (j === q.a ? 'right' : 'wrong') : ''}`} disabled={ans[i] !== undefined} onClick={() => { const a = [...ans]; a[i] = j; setAns(a); sfx(j === q.a ? 'prompt' : 'fail'); }}>{o}</button>)}</div>{ans[i] !== undefined && <small>{ans[i] === q.a ? '✔ ' : '✖ '}{q.why}</small>}</div>)}
        <div className="sx-row end"><Btn kind="pri" disabled={ans.filter((x) => x !== undefined).length < u.quiz.length} onClick={finish}>完成單元（答對 {correct}/{u.quiz.length}）</Btn></div></Sec>
    </div>
  );
}

// ---------------- 任務挑戰 ----------------
function TaskRun({ id }: { id: string }) {
  const T = TASKS.find((x) => x.id === id)!; const m = M(T.machine); const role = ROLES.find((r) => r.id === T.role)!;
  const { s, set, push, sfx, toast } = useA();
  const init: Record<string, number> = {}; m.params.forEach((x) => (init[x.id] = x.def));
  const [step, setStep] = useState(0);
  const [part, setPart] = useState<string | null>(null);
  const [inspected, setInspected] = useState<string[]>([]);
  const [fixed, setFixed] = useState<string[]>([]);
  const [params, setParams] = useState(init);
  const [sim, setSim] = useState<SimResult | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [saved, setSaved] = useState<Rec | null>(null);
  const [runKey, setRunKey] = useState(0);
  // Android gesture / Escape: walk backward through a task without losing its work.
  // Once the result is committed (step 5), system Back exits the task rather
  // than revisiting the verdict and accidentally saving it twice.
  useBack(() => {
    const prev = previousTaskStep(step);
    if (prev === null) return false;
    if (step === 4) { setSim(null); setRunKey((k) => k + 1); }
    if (step === 3) { setSim(null); setRunKey((k) => k + 1); }
    setStep(prev);
    return true;
  }, step >= 1 && step < 5);
  useEffect(() => touchRecent(set, id, 'task'), [id]);
  const steps = ['選擇工件', '檢查設備狀態', '設定模擬參數', '執行製程', '檢查成品', '完成紀錄'];
  const bad = T.checks.filter((c) => c.bad);
  const unsafe = m.params.filter((x) => params[x.id] < x.safe[0] || params[x.id] > x.safe[1]);
  const value = T.measure(params);
  const leak = T.id === 'T4' && (params.th > 0.55 || params.lux < 65);
  const inSpec = value >= T.spec.lo && value <= T.spec.hi && !leak && !(sim?.scrap);
  const finish = () => {
    const notes: string[] = [];
    const partOk = part === T.part.ok; if (!partOk) notes.push(`工件選錯：應為「${P(T.part.ok).n}」`);
    const missedBad = bad.filter((b) => !fixed.includes(b.id)); missedBad.forEach((b) => notes.push(`未處理設備異常：${b.bad}`));
    const verdictOk = verdict === (inSpec ? 'ok' : 'ng'); if (!verdictOk) notes.push(`品質判定錯誤：量測 ${value.toFixed(2)}${T.spec.unit}，規格 ${T.spec.lo}～${T.spec.hi}${leak ? '，且標準樣品有漏檢' : ''}`);
    if (!inSpec) notes.push('成品未達規格：回到參數步驟調整至建議範圍');
    const score = Math.round((partOk ? 15 : 0) + (missedBad.length ? 0 : 25) + (inSpec ? 35 : 5) + (verdictOk ? 20 : 0) + (sim?.notes.includes('警告時停機檢查') || sim?.notes.includes('警告時降速運轉') ? 5 : 5));
    const pass = partOk && !missedBad.length && inSpec && verdictOk;
    const rec: Rec = { at: Date.now(), part: part || '', params, value, verdict: verdict || '', score, pass, notes };
    set((x) => { const o = x.tasks[id] || { best: 0, tries: 0, pass: false, records: [] }; return { ...x, tasks: { ...x.tasks, [id]: { best: Math.max(o.best, score), tries: o.tries + 1, pass: o.pass || pass, records: [rec, ...o.records].slice(0, 10) } } }; });
    setSaved(rec); sfx(pass ? 'success' : 'fail');
  };
  const reset = () => { setStep(0); setPart(null); setInspected([]); setFixed([]); setParams(init); setSim(null); setVerdict(null); setSaved(null); setRunKey(runKey + 1); };
  return (
    <div className="sx-page"><TopBar title={`${T.id}｜${T.n}`} sub={`任務挑戰・${role.n}・${m.n}`} />
      <ol className="sx-steps">{steps.map((x, i) => <li key={x} className={i < step ? 'done' : i === step ? 'cur' : ''}>{x}</li>)}</ol>
      {step === 0 && <Sec title="① 選擇正確工件" right={<Person role={role} size={90} act="point" />}><p>{T.desc}</p>
        <div className="sx-opts col">{T.part.opts.map((o) => <button key={o} className={`sx-opt ${part === o ? 'on' : ''}`} onClick={() => setPart(o)}><b>{P(o).n}</b><small>　{P(o).stage}・{P(o).dims}</small></button>)}</div>
        {part && <PartViewer part={P(part)} compact />}
        <Tip>看清楚這台機台的「輸入工件」是什麼；選錯料是常見的量產事故。</Tip>
        <div className="sx-row end"><Btn kind="pri" disabled={!part} onClick={() => setStep(1)}>下一步</Btn></div></Sec>}
      {step === 1 && <Sec title="② 檢查設備狀態"><p>逐項點檢；發現異常必須處置後才能生產。</p>
        {T.checks.map((c) => { const done = inspected.includes(c.id); return (
          <div key={c.id} className="sx-chk"><div className="sx-row between"><b>{c.n}</b>{!done ? <Btn sm onClick={() => { setInspected([...inspected, c.id]); sfx(c.bad ? 'warn' : 'prompt'); }}>點檢</Btn> : c.bad ? (fixed.includes(c.id) ? <span className="sx-badge ok">✔ 已處置</span> : <span className="sx-badge bad">⚠ 異常</span>) : <span className="sx-badge ok">✔ 正常</span>}</div>
            {done && c.bad && <div className="sx-warn">{c.bad}{!fixed.includes(c.id) && <div className="sx-row"><Btn sm kind="pri" onClick={() => { setFixed([...fixed, c.id]); sfx('success'); }}>{c.fix}</Btn><Btn sm onClick={() => toast('不處置將被記錄為風險')}>先不處理</Btn></div>}</div>}
          </div>); })}
        <div className="sx-row end"><Btn onClick={() => setStep(0)}>上一步</Btn><Btn kind="pri" disabled={inspected.length < T.checks.length} onClick={() => setStep(2)}>下一步</Btn></div></Sec>}
      {step === 2 && <Sec title="③ 設定模擬參數">{m.params.map((x) => <SafeSlider key={x.id} label={x.n} unit={x.unit} v={params[x.id]} min={x.min} max={x.max} step={x.step} safe={x.safe} best={x.best} showBest={s.settings.hints} tip={x.tip} onChange={(v) => setParams({ ...params, [x.id]: v })} />)}
        <Tip>{s.settings.hints ? '淺藍色區段是建議範圍；綠色是安全工作窗口。' : '提示已關閉。'}</Tip>
        <div className="sx-row end"><Btn onClick={() => setStep(1)}>上一步</Btn><Btn kind="pri" disabled={unsafe.length > 0} onClick={() => setStep(3)}>{unsafe.length ? '參數超出安全窗口' : '下一步'}</Btn></div></Sec>}
      {step === 3 && <Sec title="④ 執行製程"><p>依序：啟動前檢查 → 啟動 → 等待加工完成。過程中可能出現警告，請正確應對。</p>
        <MachineSim key={runKey} m={m} params={params} lockParams taskMode onDone={(r) => setSim(r)} />
        <div className="sx-row end"><Btn onClick={() => { setStep(2); setSim(null); setRunKey(runKey + 1); }}>回到參數</Btn><Btn kind="pri" disabled={!sim} onClick={() => setStep(4)}>下一步：檢查成品</Btn></div></Sec>}
      {step === 4 && <Sec title="⑤ 檢查成品"><div className="sx-row"><ToolIcon id={T.tool} size={70} /><div><b>{TOOLS.find((t) => t.id === T.tool)!.n}</b><p>量測項目：{T.spec.n}，規格 {T.spec.lo}～{T.spec.hi}{T.spec.unit}</p></div></div>
        <div className="sx-meas"><small>量測值</small><b>{value.toFixed(2)}{T.spec.unit}</b>{T.id === 'T4' && <small>標準樣品漏檢：{leak ? '1 件' : '0 件'}</small>}{sim?.scrap && <small className="red">工件曾經急停／故障，已隔離</small>}</div>
        <p>你的判定：</p><div className="sx-opts"><button className={`sx-opt ${verdict === 'ok' ? 'on' : ''}`} onClick={() => setVerdict('ok')}>✔ 合格</button><button className={`sx-opt ${verdict === 'ng' ? 'on' : ''}`} onClick={() => setVerdict('ng')}>✖ 不合格</button></div>
        <div className="sx-row end"><Btn kind="pri" disabled={!verdict} onClick={() => { setStep(5); finish(); }}>完成紀錄</Btn></div></Sec>}
      {step === 5 && saved && <Sec title="⑥ 完成紀錄">
        <div className={`sx-result ${saved.pass ? 'ok' : 'ng'}`}><Person role={role} size={110} act={saved.pass ? 'done' : 'alert'} /><div><b className="sx-big">{saved.pass ? '任務成功' : '任務未通過'}</b><div>得分 {saved.score}</div></div></div>
        <div className="sx-card-rec"><div className="sx-kv"><div><span>工件</span><b>{P(saved.part)?.n || '—'}</b></div><div><span>{T.spec.n}</span><b>{saved.value.toFixed(2)}{T.spec.unit}</b></div><div><span>判定</span><b>{saved.verdict === 'ok' ? '合格' : '不合格'}</b></div><div><span>時間</span><b>{new Date(saved.at).toLocaleString('zh-TW')}</b></div></div></div>
        {saved.notes.length > 0 && <div><h4>提示</h4><ul className="sx-ul warn">{saved.notes.map((n) => <li key={n}>{n}</li>)}</ul></div>}
        <p className="small muted">學習成果已保存在本機。</p>
        <div className="sx-row wrap end"><Btn onClick={reset}>重新挑戰</Btn>{saved.pass && T.next && <Btn kind="pri" onClick={() => push({ t: 'task', id: T.next! })}>下一個工序：{T.next}</Btn>}<Btn onClick={() => push({ t: 'unit', id: m.unit })}>複習教學</Btn></div></Sec>}
    </div>
  );
}
function Tasks() {
  const { s, push } = useA(); const c = slotInfo(0);
  return (
    <div className="sx-page"><h2>任務</h2>
      <Sec title="🎓 職涯模式：從一顆螺絲到一座智慧工廠" right={<Btn kind="pri" onClick={() => push({ t: 'career' })}>{c ? '繼續' : '開始'}</Btn>}><p>原作完整遊戲：13 章職涯、12 種小遊戲、AI 工程師生存戰、CIM 與鳳凰計畫。{c ? `目前：${c.name}・${CAREERS[c.pos].title}・第 ${c.week} 週` : ''}</p></Sec>
      <Sec title="🎯 工站任務挑戰">{TASKS.map((t) => { const r = s.tasks[t.id]; return <button key={t.id} className="sx-item" onClick={() => push({ t: 'task', id: t.id })}><span className="sx-ic">{t.id}</span><span><b>{t.n}</b><small>{M(t.machine).n}・{ROLES.find((x) => x.id === t.role)!.n}</small></span>{r ? <span className={`sx-badge ${r.pass ? 'ok' : 'bad'}`}>{r.pass ? '✔' : '✖'} {r.best}</span> : <span className="sx-badge">未挑戰</span>}</button>; })}</Sec>
      <Sec title="📘 教學模式">{UNITS.map((u) => <button key={u.id} className="sx-item" onClick={() => push({ t: 'unit', id: u.id })}><span className="sx-ic">{u.id}</span><span><b>{u.n}</b><small>{M(u.machine).n}</small></span>{s.units[u.id]?.done ? <span className="sx-badge ok">✔</span> : null}</button>)}</Sec>
    </div>
  );
}

// ---------------- 我的 ----------------
function Me() {
  const { s, set, push, toast } = useA();
  const [confirm, setConfirm] = useState(false);
  const S = s.settings; const role = ROLES.find((r) => r.id === s.role) || ROLES[1];
  const up = (k: keyof AppState['settings'], v: any) => set((x) => ({ ...x, settings: { ...x.settings, [k]: v } }));
  const name = (id: string) => MACHINES.find((m) => m.id === id)?.n || PARTS.find((p) => p.id === id)?.n || TOOLS.find((t) => t.id === id)?.n || UNITS.find((u) => u.id === id)?.n || TASKS.find((t) => t.id === id)?.n || id;
  const go = (id: string) => push({ t: id[0] === 'M' ? 'machine' : id[0] === 'U' ? 'unit' : (id[0] === 'T' && id.length === 2) ? 'task' : id[0] === 'T' ? 'tool' : 'part', id });
  const recs = (Object.entries(s.tasks) as [string, any][]).flatMap(([k, v]) => v.records.map((r: Rec) => ({ k, ...r }))).sort((a, b) => b.at - a.at).slice(0, 8);
  return (
    <div className="sx-page"><h2>我的</h2>
      <Sec><div className="sx-row"><Person role={role} size={110} /><div><b>代表人物：{role.n}</b><p className="small">教學 {UNITS.filter((u) => s.units[u.id]?.done).length}/{UNITS.length}・任務 {TASKS.filter((t) => s.tasks[t.id]?.pass).length}/{TASKS.length}</p><Btn sm onClick={() => push({ t: 'role', id: role.id })}>更換</Btn></div></div></Sec>
      <Sec title="任務成果紀錄">{recs.length ? recs.map((r, i) => <div key={i} className="sx-rec-row"><b>{r.k}</b><span>{new Date(r.at).toLocaleString('zh-TW')}</span><span className={r.pass ? 'green' : 'red'}>{r.pass ? '成功' : '未通過'} {r.score}</span></div>) : <p className="muted">尚無紀錄</p>}</Sec>
      <Sec title="收藏">{s.fav.length ? s.fav.map((f) => <button key={f} className="sx-item" onClick={() => go(f)}><span className="sx-ic">{f}</span><span><b>{name(f)}</b></span></button>) : <p className="muted">在設備或工件頁點 ☆ 收藏</p>}</Sec>
      <Sec title="最近觀看">{s.recent.slice(0, 6).map((r) => <button key={r.id} className="sx-item" onClick={() => go(r.id)}><span className="sx-ic">{r.id}</span><span><b>{name(r.id)}</b><small>{new Date(r.t).toLocaleString('zh-TW')}</small></span></button>)}</Sec>
      <Sec title="設定">
        <label className="sx-check"><input type="checkbox" checked={S.mute} onChange={(e) => up('mute', e.target.checked)} /> 靜音</label>
        {([['master', '主音量'], ['sfx', '音效音量'], ['amb', '設備環境音量']] as const).map(([k, n]) => <div key={k} className="sx-slider"><label>{n}<b>{Math.round((S[k] as number) * 100)}%</b></label><input type="range" min={0} max={1} step={0.05} value={S[k] as number} onChange={(e) => up(k, +e.target.value)} aria-label={n} /></div>)}
        <label className="sx-check"><input type="checkbox" checked={S.lowMotion} onChange={(e) => up('lowMotion', e.target.checked)} /> 低動態效果模式</label>
        <label className="sx-check"><input type="checkbox" checked={S.pauseAnim} onChange={(e) => up('pauseAnim', e.target.checked)} /> 暫停所有設備動畫</label>
        <label className="sx-check"><input type="checkbox" checked={S.lowGfx} onChange={(e) => up('lowGfx', e.target.checked)} /> 低畫質模式（降低 3D 解析度與光效）</label>
        <label className="sx-check"><input type="checkbox" checked={S.hints} onChange={(e) => up('hints', e.target.checked)} /> 新手提示</label>
        <div className="sx-row">文字大小：{(['s', 'm', 'l'] as const).map((t) => <button key={t} className={`sx-opt sm ${S.text === t ? 'on' : ''}`} onClick={() => up('text', t)}>{{ s: '小', m: '中', l: '大' }[t]}</button>)}</div>
        <Btn sm onClick={() => { set((x) => ({ ...x, onboarded: false })); toast('下次啟動將顯示新手引導'); }}>重新顯示新手引導</Btn>
      </Sec>
      <Sec title="關於與授權" right={<Btn sm onClick={() => push({ t: 'about' })}>查看</Btn>}><p className="small">版本 1.0.0（Debug 建置規格）・資料只存在本機・不需帳號・無網路權限以外的權限。</p></Sec>
      <Sec title="資料">{!confirm ? <Btn kind="danger" onClick={() => setConfirm(true)}>清除 App 學習進度</Btn> : <div className="sx-warn">確定清除教學、任務、收藏與設定？（職涯模式存檔不受影響）<div className="sx-row"><Btn kind="danger" onClick={() => { set(() => ({ ...defaultState(), onboarded: true })); setConfirm(false); toast('已清除'); }}>確定</Btn><Btn onClick={() => setConfirm(false)}>取消</Btn></div></div>}</Sec>
    </div>
  );
}
function About() {
  return (
    <div className="sx-page"><TopBar title="關於與授權" />
      <Sec title="SUMEEKO 智慧工廠 1.0.0"><p>以世德工業公開的產業背景與公開專利（專利號與名稱）為教學題材的非官方、教育用途互動 App。人物、制度、數據、事件、客戶與所有模擬參數皆為虛構；所有設備操作僅為虛擬模擬，不連接或控制任何真實機械或企業系統。</p></Sec>
      <Sec title="隱私"><ul className="sx-ul"><li>不需建立帳號，不蒐集個人資料。</li><li>學習進度、設定與職涯存檔只保存在本機（WebView 本機儲存）。</li><li>App 不使用相機、麥克風、位置等權限。核心內容可離線使用；專利原文連結需網路並由外部瀏覽器開啟。</li></ul></Sec>
      <Sec title="素材與授權"><ul className="sx-ul"><li>所有人物、機台、工具、場景、圖示皆為本專案原創 SVG／程序化 WebGL 幾何。</li><li>音效以 WebAudio 即時合成，無外部音檔。</li><li>字型使用 Android 系統內建中文字型（Noto Sans CJK），不隨 App 散布。</li><li>React（MIT License, Meta Platforms, Inc.）、AndroidX WebKit（Apache License 2.0）。</li><li>未使用任何企業品牌圖像、專有照片或第三方遊戲素材。</li></ul></Sec>
    </div>
  );
}

// ---------------- 啟動畫面與新手引導 ----------------
function Splash({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => { let raf = 0; const t0 = performance.now(); const f = (t: number) => { const v = Math.min(1, (t - t0) / 900); setP(v); if (v < 1) raf = requestAnimationFrame(f); else setTimeout(onDone, 120); }; raf = requestAnimationFrame(f); return () => cancelAnimationFrame(raf); }, []);
  return (
    <div className="sx-splash"><svg viewBox="0 0 120 120" className="sx-logo"><polygon points="60,8 105,34 105,86 60,112 15,86 15,34" fill="none" stroke="#F59E38" strokeWidth="6" /><circle cx="60" cy="60" r="20" fill="none" stroke="#36C5E8" strokeWidth="5" strokeDasharray="6 4" className="sx-spin" /><circle cx="60" cy="60" r="7" fill="#F0F4F8" /></svg>
      <h1>SUMEEKO 智慧工廠</h1><small>從一顆螺絲到一座智慧工廠</small><div className="sx-load"><i style={{ width: `${p * 100}%` }} /></div><small className="muted">載入工廠場景… {Math.round(p * 100)}%</small></div>
  );
}
function Onboarding({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const pages = [
    { t: '歡迎進廠', d: '這是一座放在手機裡的數位工作環境：看機台、觀察製程、轉動工件、完成任務。', ic: '🏭' },
    { t: '操作方式', d: '單擊選取、拖曳移動或旋轉、雙指縮放；返回鍵回到上一層。機台與工件都可以互動。', ic: '👆' },
    { t: '安全與聲明', d: '所有操作皆為虛擬模擬，不連接真實設備。參數與數據為教學用虛構資料，不可套用到實際機台。', ic: '🦺' },
  ];
  return (
    <div className="sx-onb"><div className="sx-onb-c"><span className="sx-onb-ic">{pages[i].ic}</span><h2>{pages[i].t}</h2><p>{pages[i].d}</p><div className="sx-dots">{pages.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
      <div className="sx-row between"><button className="sx-btn ghost" onClick={onDone}>略過</button>{i < pages.length - 1 ? <button className="sx-btn pri" onClick={() => setI(i + 1)}>下一步</button> : <button className="sx-btn pri" onClick={onDone}>開始</button>}</div></div></div>
  );
}

// ---------------- 主殼層 ----------------
export default function Shell() {
  const [s, setS] = useState<AppState>(loadApp);
  const [boot, setBoot] = useState<'splash' | 'onb' | 'app'>('splash');
  const [tab, setTabRaw] = useState<Tab>('home');
  const [stack, setStack] = useState<Route[]>([]);
  const [toasts, setToasts] = useState<{ id: number; m: string }[]>([]);
  const [paused, setPaused] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => { const t = setTimeout(() => saveApp(s), 250); return () => clearTimeout(t); }, [s]);
  useEffect(() => { sound.set({ master: s.settings.master, sfx: s.settings.sfx, amb: s.settings.amb, mute: s.settings.mute }); }, [s.settings]);
  useEffect(() => {
    (window as any).__appPause = () => { setPaused(true); sound.suspend(); };
    (window as any).__appResume = () => { setPaused(false); sound.resume(); };
    const vis = () => (document.hidden ? (window as any).__appPause() : (window as any).__appResume());
    document.addEventListener('visibilitychange', vis); return () => document.removeEventListener('visibilitychange', vis);
  }, []);
  const toast = (m: string) => { const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, m }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600); };
  const scrollTop = () => { mainRef.current?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); };
  // 以 ref 同步保存導覽狀態，避免連續快速按返回鍵時讀到舊狀態
  const nav = useRef<{ stack: Route[]; tab: Tab }>({ stack: [], tab: 'home' });
  const setNav = (st: Route[], t: Tab) => { nav.current = { stack: st, tab: t }; setStack(st); setTabRaw(t); };
  const push = (r: Route) => { const st = nav.current.stack; const top = st[st.length - 1]; setNav(top && top.t === r.t && r.t === 'part' ? [...st.slice(0, -1), r] : [...st, r], nav.current.tab); scrollTop(); };
  const pop = () => { setNav(nav.current.stack.slice(0, -1), nav.current.tab); scrollTop(); };
  const setTab = (t: Tab) => { setNav([], t); scrollTop(); };
  // 返回：先關最上層頁面，再回首頁，最後交給系統（離開 App）
  useBack(() => { if (nav.current.stack.length) { pop(); return true; } if (nav.current.tab !== 'home') { setTab('home'); return true; } return false; }, boot === 'app');
  const ctx: Ctx = { s, set: setS, push, pop, tab, setTab, sfx: (t) => sound.play(t), toast, paused };
  const top = stack[stack.length - 1];
  if (boot === 'splash') return <Splash onDone={() => setBoot(s.onboarded ? 'app' : 'onb')} />;
  if (boot === 'onb') return <Onboarding onDone={() => { setS((x) => ({ ...x, onboarded: true })); setBoot('app'); }} />;
  if (top?.t === 'career') return <C.Provider value={ctx}><CareerHost onExit={pop} /></C.Provider>;
  const page = (() => {
    if (top) switch (top.t) {
      case 'machine': return <MachinePage key={top.id} id={top.id!} />; case 'part': return <PartPage key={top.id} id={top.id!} />; case 'tool': return <ToolPage id={top.id!} />;
      case 'unit': return <UnitPage key={top.id} id={top.id!} />; case 'task': return <TaskRun key={top.id} id={top.id!} />; case 'role': return <RolePage id={top.id!} />;
      case 'material': return <MaterialPage id={top.id!} />; case 'patent': return <PatentPage id={top.id!} />; case 'about': return <About />;
    }
    return tab === 'home' ? <Home /> : tab === 'scene' ? <Scene /> : tab === 'codex' ? <Codex /> : tab === 'tasks' ? <Tasks /> : <Me />;
  })();
  return (
    <C.Provider value={ctx}>
      <div className={`sx-app text-${s.settings.text} ${s.settings.lowMotion ? 'sx-lowmotion' : ''} ${s.settings.pauseAnim || paused ? 'sx-paused' : ''} ${tab === 'scene' && !top ? 'full' : ''}`}>
        <main className="sx-main" ref={mainRef}>{page}</main>
        <nav className="sx-nav">{([['home', '首頁', '⌂'], ['scene', '工作場景', '🏭'], ['codex', '圖鑑', '📚'], ['tasks', '任務', '🎯'], ['me', '我的', '👤']] as const).map(([k, n, i]) => <button key={k} className={tab === k && !top ? 'on' : tab === k ? 'half' : ''} onClick={() => { sound.play('click'); setTab(k); }}><span>{i}</span><small>{n}</small></button>)}</nav>
        <div className="sx-toasts">{toasts.map((t) => <div key={t.id} className="sx-toast">{t.m}</div>)}</div>
      </div>
    </C.Provider>
  );
}
function CareerHost({ onExit }: { onExit: () => void }) {
  const { set } = useA();
  useEffect(() => { set((x) => ({ ...x, last: { r: 'career' } })); }, []);
  useBack(() => { const f = (window as any).__careerBack; if (f && f()) return true; onExit(); return true; });
  return <div className="sx-career"><CareerApp onExit={onExit} /></div>;
}
