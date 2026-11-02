import React, { createContext, useContext } from 'react';
import type { GameState } from '../state';
import { NPCS } from '../data';

export interface Ctx {
  g: GameState; set: (fn: (g: GameState) => GameState) => void; go: (v: string, arg?: any) => void; sfx: (t?: 'click' | 'good' | 'bad' | 'level') => void; toast: (s: string) => void;
}
export const GameCtx = createContext<Ctx>(null as any);
export const useG = () => useContext(GameCtx);

let ac: AudioContext | null = null;
export function beep(type: 'click' | 'good' | 'bad' | 'level' = 'click') {
  try {
    ac = ac || new (window.AudioContext || (window as any).webkitAudioContext)();
    const seq: Record<string, [number, number][]> = { click: [[660, 0.04]], good: [[660, 0.08], [990, 0.12]], bad: [[220, 0.15], [180, 0.15]], level: [[523, 0.1], [659, 0.1], [784, 0.1], [1046, 0.2]] };
    let t = ac.currentTime;
    for (const [f, d] of seq[type]) {
      const o = ac.createOscillator(), gn = ac.createGain();
      o.type = type === 'bad' ? 'sawtooth' : 'triangle'; o.frequency.value = f;
      gn.gain.setValueAtTime(0.06, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gn); gn.connect(ac.destination); o.start(t); o.stop(t + d); t += d * 0.9;
    }
  } catch { /* 音效不可用時忽略 */ }
}

export function Btn(p: { children?: any; onClick?: () => void; kind?: 'primary' | 'ghost' | 'danger' | 'ok'; disabled?: boolean; small?: boolean; title?: string; style?: any; className?: string }) {
  const { sfx } = useG() || ({ sfx: () => {} } as any);
  return (
    <button title={p.title} style={p.style} className={`btn ${p.kind || ''} ${p.small ? 'sm' : ''} ${p.className || ''}`} disabled={p.disabled}
      onClick={() => { if (p.disabled) return; sfx && sfx('click'); p.onClick && p.onClick(); }}>{p.children}</button>
  );
}
export function Card(p: { title?: any; children?: any; right?: any; className?: string; style?: any }) {
  return (
    <section className={`card ${p.className || ''}`} style={p.style}>
      {(p.title || p.right) && <header className="card-h"><h3>{p.title}</h3>{p.right}</header>}
      {p.children}
    </section>
  );
}
export function Tag(p: { children?: any; color?: string }) { return <span className="tag" style={{ borderColor: p.color, color: p.color }}>{p.children}</span>; }
export function SimTag() { return <span className="simtag">遊戲模擬資料</span>; }

export function Meter(p: { v: number; max?: number; color?: string; label?: string; right?: string; danger?: number }) {
  const pct = Math.max(0, Math.min(1, p.v / (p.max || 1)));
  const over = p.danger !== undefined && p.v > p.danger;
  return (
    <div className="meter">
      {(p.label || p.right) && <div className="meter-l"><span>{p.label}</span><b>{p.right}</b></div>}
      <div className="meter-t"><div className="meter-f" style={{ width: `${pct * 100}%`, background: over ? 'var(--red)' : p.color || 'var(--cyan)' }} /></div>
    </div>
  );
}
export function Kpi(p: { label: string; value: string; sub?: string; good?: boolean | null; delta?: string }) {
  return (
    <div className="kpi">
      <div className="kpi-l">{p.label}</div>
      <div className="kpi-v" style={{ color: p.good === true ? 'var(--green)' : p.good === false ? 'var(--red)' : undefined }}>{p.value}</div>
      {(p.sub || p.delta) && <div className="kpi-s">{p.delta && <b>{p.delta} </b>}{p.sub}</div>}
    </div>
  );
}
export function Modal(p: { children?: any; onClose?: () => void; wide?: boolean; title?: any }) {
  return (
    <div className="modal-bg" onClick={(e) => { if (e.target === e.currentTarget && p.onClose) p.onClose(); }}>
      <div className={`modal ${p.wide ? 'wide' : ''}`} role="dialog">
        {p.title && <header className="card-h"><h3>{p.title}</h3>{p.onClose && <button className="x" aria-label="關閉" onClick={p.onClose}>✕</button>}</header>}
        {p.children}
      </div>
    </div>
  );
}

// ---------- 原創 SVG 角色頭像 ----------
export function Face(p: { hair: string; skin: string; coat: string; glasses?: boolean; helmet?: boolean; style?: number; size?: number; mood?: string }) {
  const s = p.size || 64;
  const st = p.style || 0;
  return (
    <svg width={s} height={s} viewBox="0 0 64 64" className="face">
      <defs>
        <linearGradient id={`c${p.coat.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={p.coat} /><stop offset="1" stopColor="#0a1324" /></linearGradient>
        <radialGradient id={`s${p.skin.slice(1)}`} cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor={p.skin} stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="64" height="64" rx="12" fill="#13213d" />
      <path d="M8 64 Q10 46 32 44 Q54 46 56 64Z" fill={`url(#c${p.coat.slice(1)})`} />
      <path d="M27 44 L32 52 L37 44" fill="#e8edf5" opacity=".8" />
      <rect x="27" y="36" width="10" height="9" rx="3" fill={p.skin} />
      <ellipse cx="32" cy="28" rx="12" ry="14" fill={p.skin} />
      <ellipse cx="32" cy="28" rx="12" ry="14" fill={`url(#s${p.skin.slice(1)})`} />
      {st === 0 && <path d="M20 26 Q20 12 32 12 Q45 12 44 26 Q42 18 32 18 Q24 18 20 26Z" fill={p.hair} />}
      {st === 1 && <path d="M19 30 Q17 11 32 11 Q47 11 45 30 L45 40 Q43 26 40 20 Q32 22 24 20 Q21 26 21 40Z" fill={p.hair} />}
      {st === 2 && <path d="M20 24 Q22 14 32 14 Q42 14 44 24 Q40 19 32 20 Q24 19 20 24Z" fill={p.hair} />}
      {st === 3 && <path d="M19 27 Q18 10 33 11 Q47 12 45 27 Q44 20 37 17 Q34 22 26 21 Q21 22 19 27Z" fill={p.hair} />}
      <ellipse cx="27" cy="29" rx="1.6" ry={p.mood === 'happy' ? 1 : 2} fill="#1a1a1a" />
      <ellipse cx="37" cy="29" rx="1.6" ry={p.mood === 'happy' ? 1 : 2} fill="#1a1a1a" />
      <path d={p.mood === 'angry' ? 'M24 24 L30 26 M40 24 L34 26' : 'M24 25 Q27 23.5 30 25 M34 25 Q37 23.5 40 25'} stroke={p.hair} strokeWidth="1.4" fill="none" />
      <path d={p.mood === 'angry' ? 'M28 37 Q32 35 36 37' : p.mood === 'worried' ? 'M28 37 Q32 36 36 37' : 'M28 36 Q32 39 36 36'} stroke="#7a3a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {p.glasses && <g stroke="#cfd8e6" strokeWidth="1.2" fill="rgba(120,200,255,.12)"><rect x="22.5" y="26" width="9" height="6" rx="2" /><rect x="32.5" y="26" width="9" height="6" rx="2" /><path d="M31.5 28.5 h1" /></g>}
      {p.helmet && <g><path d="M17 23 Q18 8 32 8 Q46 8 47 23 Z" fill="#ffb02e" /><rect x="15" y="21.5" width="34" height="3" rx="1.5" fill="#e08a10" /><path d="M24 12 Q32 9 40 12" stroke="#fff" strokeOpacity=".5" strokeWidth="1.5" fill="none" /></g>}
    </svg>
  );
}
export const LOOKS = [
  { hair: '#1d1a2b', skin: '#f2cda9', style: 3 }, { hair: '#3a2213', skin: '#eac09a', style: 1 },
  { hair: '#141414', skin: '#d9a77f', style: 0 }, { hair: '#5a3a26', skin: '#f6d6c0', style: 2 },
];
export function NpcFace(p: { id: string; size?: number; mood?: string }) {
  const n = NPCS[p.id];
  if (!n) return null;
  return <Face {...n} size={p.size} mood={p.mood} />;
}
export function PlayerFace(p: { size?: number; mood?: string }) {
  const { g } = useG();
  const l = LOOKS[g.player.look] || LOOKS[0];
  return <Face hair={l.hair} skin={l.skin} style={l.style} coat={g.player.coat} helmet={g.pos < 3} glasses={g.pos >= 6} size={p.size} mood={p.mood} />;
}
export function Bubble(p: { npc: string; text: string; mood?: string; right?: boolean }) {
  const n = NPCS[p.npc];
  return (
    <div className={`bubble-row ${p.right ? 'r' : ''}`}>
      <NpcFace id={p.npc} size={52} mood={p.mood} />
      <div className="bubble"><div className="bubble-n">{n?.name}<small>{n?.role}</small></div>{p.text}</div>
    </div>
  );
}

// ---------- 輕量 SVG 圖表 ----------
export function Bars(p: { data: { label: string; v: number; color?: string; mark?: boolean }[]; max?: number; line?: number; lineLabel?: string; unit?: string; h?: number; fmtv?: (v: number) => string; onPick?: (i: number) => void; picked?: number }) {
  const h = p.h || 180, w = 520, pad = 34, bw = (w - pad - 8) / p.data.length;
  const max = p.max || Math.max(...p.data.map((d) => d.v), p.line || 0) * 1.15 || 1;
  const y = (v: number) => h - 26 - (v / max) * (h - 44);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img">
      {[0, 0.5, 1].map((t) => <g key={t}><line x1={pad} x2={w} y1={y(max * t)} y2={y(max * t)} className="grid" /><text x={pad - 4} y={y(max * t) + 4} className="ax" textAnchor="end">{p.fmtv ? p.fmtv(max * t) : (max * t).toFixed(max * t < 10 ? 1 : 0)}</text></g>)}
      {p.data.map((d, i) => (
        <g key={i} onClick={() => p.onPick && p.onPick(i)} style={{ cursor: p.onPick ? 'pointer' : undefined }}>
          <rect x={pad + i * bw + bw * 0.18} y={y(d.v)} width={bw * 0.64} height={Math.max(1, h - 26 - y(d.v))} rx="3" fill={d.color || 'var(--cyan)'} opacity={p.picked !== undefined && p.picked !== i ? 0.45 : 1} stroke={p.picked === i ? '#fff' : 'none'} strokeWidth="2" />
          <text x={pad + i * bw + bw / 2} y={h - 10} className="ax" textAnchor="middle">{d.label}</text>
          <text x={pad + i * bw + bw / 2} y={y(d.v) - 4} className="val" textAnchor="middle">{p.fmtv ? p.fmtv(d.v) : Number.isInteger(d.v) ? d.v : d.v.toFixed(d.v < 10 ? 2 : 0)}</text>
        </g>
      ))}
      {p.line !== undefined && <g><line x1={pad} x2={w} y1={y(p.line)} y2={y(p.line)} stroke="var(--orange)" strokeDasharray="6 4" strokeWidth="2" /><text x={w - 4} y={y(p.line) - 5} className="val" textAnchor="end" fill="var(--orange)">{p.lineLabel}</text></g>}
    </svg>
  );
}
export function Lines(p: { series: { name: string; color: string; values: number[] }[]; labels: string[]; h?: number; fmtv?: (v: number) => string; min?: number; max?: number; bands?: { from: number; to: number; color: string }[]; hlines?: { v: number; label: string; color: string }[]; onPoint?: (i: number) => void; marks?: number[]; markColor?: string }) {
  const h = p.h || 200, w = 560, pad = 40;
  const all = p.series.flatMap((s) => s.values).concat((p.hlines || []).map((x) => x.v));
  const mn = p.min ?? Math.min(...all) * 0.95, mx = p.max ?? Math.max(...all) * 1.05;
  const n = Math.max(2, p.labels.length);
  const x = (i: number) => pad + (i / (n - 1)) * (w - pad - 12);
  const y = (v: number) => h - 24 - ((v - mn) / (mx - mn || 1)) * (h - 40);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="chart" role="img">
      {(p.bands || []).map((b, i) => <rect key={i} x={pad} width={w - pad - 12} y={y(b.to)} height={Math.max(0, y(b.from) - y(b.to))} fill={b.color} />)}
      {[0, 0.5, 1].map((t) => { const v = mn + (mx - mn) * t; return <g key={t}><line x1={pad} x2={w - 12} y1={y(v)} y2={y(v)} className="grid" /><text x={pad - 4} y={y(v) + 4} className="ax" textAnchor="end">{p.fmtv ? p.fmtv(v) : v.toFixed(1)}</text></g>; })}
      {(p.hlines || []).map((l, i) => <g key={i}><line x1={pad} x2={w - 12} y1={y(l.v)} y2={y(l.v)} stroke={l.color} strokeDasharray="5 4" /><text x={w - 14} y={y(l.v) - 4} textAnchor="end" className="val" fill={l.color}>{l.label}</text></g>)}
      {p.labels.map((l, i) => (n <= 14 || i % Math.ceil(n / 12) === 0) && <text key={i} x={x(i)} y={h - 6} className="ax" textAnchor="middle">{l}</text>)}
      {p.series.map((s) => (
        <g key={s.name}>
          <polyline fill="none" stroke={s.color} strokeWidth="2.2" points={s.values.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
          {s.values.map((v, i) => {
            const m = p.marks?.includes(i);
            return <circle key={i} cx={x(i)} cy={y(v)} r={p.onPoint ? 7 : 3} fill={m ? p.markColor || 'var(--red)' : s.color} stroke={m ? '#fff' : 'none'} strokeWidth="2" style={{ cursor: p.onPoint ? 'pointer' : undefined }} onClick={() => p.onPoint && p.onPoint(i)} />;
          })}
        </g>
      ))}
    </svg>
  );
}
export function Legend(p: { items: { name: string; color: string }[] }) {
  return <div className="legend">{p.items.map((i) => <span key={i.name}><i style={{ background: i.color }} />{i.name}</span>)}</div>;
}
export function Steps(p: { steps: string[]; cur: number }) {
  return <ol className="steps">{p.steps.map((s, i) => <li key={s} className={i < p.cur ? 'done' : i === p.cur ? 'cur' : ''}>{s}</li>)}</ol>;
}
export function Hint(p: { children: any }) {
  const { g } = useG();
  if (!g.settings.hints) return null;
  return <div className="hint">💡 {p.children}</div>;
}
