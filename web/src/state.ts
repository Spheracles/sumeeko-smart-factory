import { baseFactory, FactoryState, simulateWeek, applyEffect, Effect, mulberry32, clamp } from './sim';
import { Branch, Dept, CAREERS, CHAPTERS, EVENTS, GameEvent, CODEX, FINAL_ID } from './data';

export type Mode = 'story' | 'engineer' | 'sandbox';
export interface Snapshot { week: number; label: string; oee: number; otif: number; cost: number; ppm: number; energy: number; good: number; yieldPct: number; bott: string; }
export interface GameState {
  v: number; seed: number; mode: Mode;
  player: { name: string; look: number; coat: string; edu: string; talent: string; aspiration: string };
  week: number; pos: number; posHistory: { pos: number; week: number }[];
  skills: Record<Branch, number>; freePts: number;
  trust: Record<Dept, number>; brand: number; funds: number;
  certs: string[]; done: Record<number, { score: number; best: number; tries: number }>;
  factory: FactoryState; history: Snapshot[];
  flags: string[]; achievements: string[]; journal: { week: number; title: string; text: string }[];
  pendingEvent: string | null; eventsSeen: string[]; decisions: { week: number; title: string; choice: string }[];
  ai: Record<string, { done: boolean; score: number; deployed: boolean }>;
  cimDone: boolean; final: { ids: string[]; score: number; ending: string } | null;
  settings: { sound: boolean; motion: boolean; text: 's' | 'm' | 'l'; hints: boolean };
  safetyViolations: number; unlockedCodex: string[]; grants: number;
  survival: { runs: SurvivalRun[] };
}
export interface SurvivalRun { ending: string; m: Record<string, number>; cost: Record<string, number>; inc: { name: string; sev: number }[]; diff: string; mentor: boolean; runId: string; reasons: string[]; at: number; week: number; sk?: Record<string, number>; }

export const EDU: Record<string, { label: string; skills: Partial<Record<Branch, number>>; hint: string }> = {
  fresh: { label: '一般新鮮人', skills: { mfg: 3, qual: 3, prod: 3, ie: 3, it: 3, sys: 3 }, hint: '各方面均衡起步。' },
  switcher: { label: '非理工轉職者', skills: { sys: 8, prod: 4, qual: 2 }, hint: '溝通與管理有底子，教學提示較多。' },
  mech: { label: '機械相關背景', skills: { mfg: 10, ie: 5, qual: 2 }, hint: '設備與製程上手快。' },
  info: { label: '資訊相關背景', skills: { it: 12, ie: 3, sys: 2 }, hint: '資料與程式能力較強。' },
};
export const TALENT: Record<string, { label: string; skills: Partial<Record<Branch, number>>; trust?: Partial<Record<Dept, number>> }> = {
  hands: { label: '動手操作', skills: { mfg: 5 } },
  data: { label: '資料分析', skills: { it: 3, qual: 3 } },
  comm: { label: '溝通協調', skills: { sys: 4 }, trust: { floor: 3, plan: 3 } },
  logic: { label: '邏輯推理', skills: { ie: 5 } },
};
export const ASPIRE: Record<string, { label: string; branch: Branch }> = {
  floor: { label: '現場製造', branch: 'mfg' }, quality: { label: '品質工程', branch: 'qual' },
  mgmt: { label: '管理規劃', branch: 'prod' }, ai: { label: 'AI 工程', branch: 'it' },
};

export function snapshot(f: FactoryState, week: number, label: string, seed: number): Snapshot {
  const r = simulateWeek(f, seed + week);
  return { week, label, oee: r.oee, otif: r.otif, cost: r.costPerGood, ppm: r.ppm, energy: r.energyPerUnit, good: r.goodTotal, yieldPct: r.yieldPct, bott: r.bottleneck };
}

export function newGame(p: GameState['player'], mode: Mode): GameState {
  const seed = (Date.now() % 1e6) | 0;
  const skills: Record<Branch, number> = { mfg: 0, qual: 0, prod: 0, ie: 0, it: 0, sys: 0 };
  const trust: Record<Dept, number> = { floor: 0, quality: 0, plan: 0, purchase: 0, it: 0, mgmt: 0 };
  const e = EDU[p.edu], t = TALENT[p.talent];
  for (const [k, v] of Object.entries(e.skills)) skills[k as Branch] += v!;
  for (const [k, v] of Object.entries(t.skills)) skills[k as Branch] += v!;
  if (t.trust) for (const [k, v] of Object.entries(t.trust)) trust[k as Dept] += v!;
  const factory = baseFactory();
  const g: GameState = {
    v: 3, seed, mode, player: p, week: 1, pos: 0, posHistory: [{ pos: 0, week: 1 }], skills, freePts: 0, trust, brand: 60, funds: 100000,
    certs: [], done: {}, factory, history: [], flags: [], achievements: [], journal: [], pendingEvent: null, eventsSeen: [], decisions: [],
    ai: { A: { done: false, score: 0, deployed: false }, B: { done: false, score: 0, deployed: false }, C: { done: false, score: 0, deployed: false }, D: { done: false, score: 0, deployed: false } },
    cimDone: false, final: null, settings: { sound: true, motion: true, text: 'm', hints: mode !== 'engineer' }, safetyViolations: 0,
    unlockedCodex: [], grants: 0, survival: { runs: [] },
  };
  g.history.push(snapshot(factory, 1, '入職', seed));
  if (mode === 'sandbox') {
    g.pos = 9; g.unlockedCodex = CODEX.map((c) => c.id); g.funds = 2000000;
    for (const k of Object.keys(skills)) skills[k as Branch] = 60;
    CHAPTERS.forEach((c) => { if (c.id < FINAL_ID) g.done[c.id] = { score: 0, best: 0, tries: 0 }; });
    g.cimDone = true;
  } else g.unlockedCodex = [...CHAPTERS[0].codex];
  return g;
}

export const passLine = (g: GameState) => (g.mode === 'engineer' ? 65 : 50);

export function chapterUnlocked(g: GameState, id: number) {
  if (g.mode === 'sandbox') return true;
  if (id === 0) return true;
  const prevDone = !!g.done[id - 1];
  return prevDone && g.pos >= CHAPTERS[id].requiredPos;
}
export function currentChapter(g: GameState) {
  for (const c of CHAPTERS) if (!g.done[c.id]) return c.id;
  return FINAL_ID;
}

export function applyEff(g: GameState, e: Effect, label?: string): GameState {
  const n: GameState = { ...g, factory: applyEffect(g.factory, e), trust: { ...g.trust }, flags: [...g.flags] };
  if (e.funds) n.funds = Math.max(0, n.funds + e.funds);
  if (e.trust) for (const [k, v] of Object.entries(e.trust)) n.trust[k as Dept] = clamp((n.trust[k as Dept] || 0) + (v || 0), -50, 100);
  if (e.brand) n.brand = clamp(n.brand + e.brand, 0, 100);
  if (e.flag && !n.flags.includes(e.flag)) n.flags.push(e.flag);
  if (e.unflag) n.flags = n.flags.filter((x) => x !== e.unflag);
  if (e.flag === 'unsafe') n.safetyViolations++;
  if (e.weeks) n.week += e.weeks;
  return n;
}

export function gainSkills(g: GameState, xp: Partial<Record<Branch, number>>, mult: number) {
  const s = { ...g.skills };
  const asp = ASPIRE[g.player.aspiration]?.branch;
  for (const [k, v] of Object.entries(xp)) {
    const b = k as Branch;
    s[b] = clamp(s[b] + Math.round((v || 0) * mult * (b === asp ? 1.15 : 1)), 0, 100);
  }
  return s;
}

export function promotionCheck(g: GameState, target: number) {
  const c = CAREERS[target];
  if (!c) return { ok: false, items: [] as { label: string; ok: boolean }[] };
  const items: { label: string; ok: boolean }[] = [];
  const r = c.req;
  if (r.skills) for (const [k, v] of Object.entries(r.skills)) items.push({ label: `${({ mfg: '製造技術', qual: '品質工程', prod: '生產與物流', ie: '工業工程', it: '資訊與 AI', sys: '系統整合與領導' } as any)[k]} ≥ ${v}（目前 ${g.skills[k as Branch]}）`, ok: g.skills[k as Branch] >= v! });
  if (r.certs) for (const ce of r.certs) items.push({ label: `認證：${ce}`, ok: g.certs.includes(ce) });
  if (r.trust) for (const [k, v] of Object.entries(r.trust)) items.push({ label: `${({ floor: '現場製造', quality: '品質', plan: '生管物管', purchase: '採購', it: 'IT/OT', mgmt: '經營管理' } as any)[k]}信任 ≥ ${v}（目前 ${g.trust[k as Dept]}）`, ok: g.trust[k as Dept] >= v! });
  if (r.avg) { const a = avgScore(g); items.push({ label: `任務平均分數 ≥ ${g.mode === 'story' ? r.avg - 5 : r.avg}（目前 ${a.toFixed(0)}）`, ok: a >= (g.mode === 'story' ? r.avg - 5 : r.avg) }); }
  if (r.trustAvg) { const t = Object.values(g.trust).reduce((a, b) => a + b, 0) / 6; items.push({ label: `跨部門平均信任 ≥ ${r.trustAvg}（目前 ${t.toFixed(0)}）`, ok: t >= r.trustAvg }); }
  return { ok: items.every((i) => i.ok), items };
}
export function avgScore(g: GameState) {
  const v = Object.values(g.done).filter((d) => d.tries > 0).map((d) => d.best);
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0;
}

export function pickEvent(g: GameState): GameEvent | null {
  const ch = currentChapter(g);
  const pool = EVENTS.filter((e) => e.minCh <= ch);
  if (!pool.length) return null;
  const rnd = mulberry32(g.seed + g.week * 7919);
  const weights = pool.map((e) => (e.weightFlag && g.flags.includes(e.weightFlag) ? 6 : 1) * (g.eventsSeen.includes(e.id) ? 0.35 : 1));
  const sum = weights.reduce((a, b) => a + b, 0);
  let r = rnd() * sum;
  for (let i = 0; i < pool.length; i++) { r -= weights[i]; if (r <= 0) return pool[i]; }
  return pool[pool.length - 1];
}

export function checkAchievements(g: GameState): string[] {
  const a = new Set(g.achievements);
  const add: string[] = [];
  const t = (id: string, cond: boolean) => { if (cond && !a.has(id)) { a.add(id); add.push(id); } };
  t('safety', !!g.done[0] && g.safetyViolations === 0);
  t('firstDie', (g.done[2]?.best || 0) >= 70);
  t('firstAI', Object.values(g.ai).some((x) => x.done));
  t('allAI', Object.values(g.ai).every((x) => x.done));
  t('scholar', g.unlockedCodex.length >= 60);
  if (g.history.length > 1) t('yield', g.history[g.history.length - 1].yieldPct > g.history[0].yieldPct + 0.003);
  t('optimize', !!g.final && g.final.ending === 'balance');
  return add;
}

const KEY = 'sumeeko-smart-factory-v2';
export function saveSlot(slot: number, g: GameState) {
  try { localStorage.setItem(`${KEY}-${slot}`, JSON.stringify({ t: Date.now(), g })); return true; } catch { return false; }
}
export function migrate(g: any): GameState | null {
  if (!g || !g.factory) return null;
  if (g.v === 2) {
    // 舊版：12＝CIM、13＝終局；新版插入第十二章「AI 工程師生存戰」
    const d: any = {};
    for (const [k, v] of Object.entries(g.done || {})) { const n = +k; d[n >= 12 ? n + 1 : n] = v; }
    g.done = d; g.v = 3; g.survival = { runs: [] };
    if (g.done[13] && !g.certs.includes('AI 工程師生存戰通關')) g.journal = [...(g.journal || []), { week: g.week, title: '版本更新', text: '新增第十二章「AI 工程師生存戰」，可於任務中心補玩。' }];
  }
  if (!g.survival) g.survival = { runs: [] };
  return g.v === 3 ? g : null;
}
export function loadSlot(slot: number): GameState | null {
  try { const s = localStorage.getItem(`${KEY}-${slot}`); if (!s) return null; const o = JSON.parse(s); return migrate(o.g); } catch { return null; }
}
export function slotInfo(slot: number): { t: number; name: string; pos: number; week: number } | null {
  try { const s = localStorage.getItem(`${KEY}-${slot}`); if (!s) return null; const o = JSON.parse(s); return { t: o.t, name: o.g.player.name, pos: o.g.pos, week: o.g.week }; } catch { return null; }
}
export function exportCode(g: GameState) { return btoa(unescape(encodeURIComponent(JSON.stringify(g)))); }
export function importCode(s: string): GameState | null {
  try { return migrate(JSON.parse(decodeURIComponent(escape(atob(s.trim()))))); } catch { return null; }
}
