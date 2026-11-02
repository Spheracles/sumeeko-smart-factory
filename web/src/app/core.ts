// App 狀態、儲存、音效、返回鍵堆疊
import { useEffect, useRef } from 'react';

export interface Rec { at: number; part: string; params: Record<string, number>; value: number; verdict: string; score: number; pass: boolean; notes: string[]; }
export interface AppState {
  v: 1; onboarded: boolean; role: string;
  settings: { master: number; sfx: number; amb: number; mute: boolean; lowMotion: boolean; lowGfx: boolean; hints: boolean; text: 's' | 'm' | 'l'; pauseAnim: boolean };
  units: Record<string, { done: boolean; quiz: number; at: number }>;
  tasks: Record<string, { best: number; tries: number; pass: boolean; records: Rec[] }>;
  fav: string[]; recent: { id: string; t: number }[]; last: { r: string; id?: string } | null;
}
const KEY = 'sumeeko-app-v1';
export function defaultState(): AppState {
  return { v: 1, onboarded: false, role: 'R2', settings: { master: 0.7, sfx: 0.8, amb: 0.35, mute: false, lowMotion: false, lowGfx: false, hints: true, text: 'm', pauseAnim: false }, units: {}, tasks: {}, fav: [], recent: [], last: null };
}
export function loadApp(): AppState {
  try { const s = localStorage.getItem(KEY); if (s) { const o = JSON.parse(s); if (o.v === 1) return { ...defaultState(), ...o, settings: { ...defaultState().settings, ...o.settings } }; } } catch { /* 無法存取本機儲存 */ }
  return defaultState();
}
export function saveApp(s: AppState) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch { return false; } }

// ---------------- 音效（WebAudio 即時合成，無外部音檔） ----------------
class SoundEngine {
  ctx: AudioContext | null = null; master: GainNode | null = null; ambNode: { src: AudioBufferSourceNode; osc: OscillatorNode; g: GainNode } | null = null;
  vol = { master: 0.7, sfx: 0.8, amb: 0.35, mute: false };
  ensure() {
    if (this.ctx) return this.ctx;
    try { const C = window.AudioContext || (window as any).webkitAudioContext; this.ctx = new C(); this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination); this.apply(); } catch { this.ctx = null; }
    return this.ctx;
  }
  apply() { if (this.master) this.master.gain.value = this.vol.mute ? 0 : this.vol.master; if (this.ambNode) this.ambNode.g.gain.value = this.vol.amb * 0.25; }
  set(v: Partial<SoundEngine['vol']>) { Object.assign(this.vol, v); this.apply(); }
  play(t: 'click' | 'contact' | 'prompt' | 'success' | 'warn' | 'fail') {
    if (this.vol.mute || this.vol.sfx <= 0) return;
    const c = this.ensure(); if (!c || !this.master) return;
    const seq: Record<string, [number, number, OscillatorType][]> = {
      click: [[880, 0.03, 'triangle']], contact: [[220, 0.05, 'square'], [1400, 0.04, 'triangle']], prompt: [[660, 0.08, 'sine'], [880, 0.1, 'sine']],
      success: [[523, 0.09, 'triangle'], [659, 0.09, 'triangle'], [784, 0.09, 'triangle'], [1046, 0.22, 'triangle']], warn: [[740, 0.12, 'square'], [520, 0.12, 'square'], [740, 0.12, 'square']], fail: [[300, 0.15, 'sawtooth'], [200, 0.25, 'sawtooth']],
    };
    let tt = c.currentTime;
    for (const [f, d, type] of seq[t]) {
      const o = c.createOscillator(), g = c.createGain(); o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.12 * this.vol.sfx, tt); g.gain.exponentialRampToValueAtTime(0.0001, tt + d);
      o.connect(g); g.connect(this.master); o.start(tt); o.stop(tt + d + 0.02); tt += d * 0.95;
    }
  }
  ambient(on: boolean) {
    if (!on) { if (this.ambNode) { try { this.ambNode.src.stop(); this.ambNode.osc.stop(); } catch { } this.ambNode = null; } return; }
    if (this.ambNode || this.vol.mute || this.vol.amb <= 0) return;
    const c = this.ensure(); if (!c || !this.master) return;
    const len = c.sampleRate * 2, buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
    const src = c.createBufferSource(); src.buffer = buf; src.loop = true;
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420;
    const osc = c.createOscillator(); osc.type = 'sawtooth'; osc.frequency.value = 55;
    const og = c.createGain(); og.gain.value = 0.08;
    const g = c.createGain(); g.gain.value = this.vol.amb * 0.25;
    src.connect(lp); lp.connect(g); osc.connect(og); og.connect(g); g.connect(this.master);
    src.start(); osc.start(); this.ambNode = { src, osc, g };
  }
  suspend() { try { this.ctx?.suspend(); } catch { } }
  resume() { try { this.ctx?.resume(); } catch { } }
}
export const sound = new SoundEngine();

// ---------------- 返回鍵堆疊（Android 系統返回／手勢、Esc） ----------------
const backStack: { id: number; fn: () => boolean }[] = [];
let bid = 0;
export function useBack(fn: () => boolean, active = true) {
  const ref = useRef(fn); ref.current = fn;
  useEffect(() => {
    if (!active) return;
    const id = ++bid; backStack.push({ id, fn: () => ref.current() });
    return () => { const i = backStack.findIndex((x) => x.id === id); if (i >= 0) backStack.splice(i, 1); };
  }, [active]);
}
export function handleBack(): boolean {
  for (let i = backStack.length - 1; i >= 0; i--) { if (backStack[i].fn()) return true; }
  return false;
}
// Android 原生殼呼叫：回傳 true 表示已處理，false 則由原生端結束 App
(window as any).__handleBack = () => { try { return handleBack(); } catch { return false; } };
window.addEventListener('keydown', (e) => {
  const target = e.target as HTMLElement | null;
  const editing = !!target && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
  if (e.key === 'Escape' || e.key === 'BrowserBack' || (e.key === 'Backspace' && !editing)) {
    if (handleBack()) e.preventDefault();
  }
});
export const isAndroid = () => !!(window as any).AndroidApp;
