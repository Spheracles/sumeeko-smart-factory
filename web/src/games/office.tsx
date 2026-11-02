import React, { useMemo, useState } from 'react';
import { Btn, Card, Hint, Steps, useG, Bars, Lines, Meter, Tag, SimTag, Legend } from '../ui/common';
import { mulberry32, clamp, fmt, Effect } from '../sim';
import type { GP } from './floor';

// ============ 第七章：生產排程拼圖 + MRP ============
interface Ord { id: string; prod: 'HB' | 'PTN' | 'CSS'; size: string; qty: number; due: number; urgent?: boolean; }
const ORDERS: Ord[] = [
  { id: 'O1', prod: 'HB', size: 'M8', qty: 12000, due: 3 }, { id: 'O2', prod: 'HB', size: 'M10', qty: 9000, due: 4 },
  { id: 'O3', prod: 'CSS', size: 'M6', qty: 8000, due: 5 }, { id: 'O4', prod: 'HB', size: 'M8', qty: 6000, due: 2 },
  { id: 'O5', prod: 'PTN', size: 'M10', qty: 10000, due: 4 }, { id: 'O6', prod: 'HB', size: 'M10', qty: 5000, due: 2, urgent: true },
  { id: 'O7', prod: 'PTN', size: 'M8', qty: 4000, due: 5 },
];
const MACH = [{ id: 'R1', n: '搓牙機 A', rate: 425, ok: ['HB', 'CSS'] }, { id: 'R2', n: '搓牙機 B', rate: 425, ok: ['HB', 'CSS'] }, { id: 'T1', n: '攻牙機 C', rate: 400, ok: ['PTN'] }];
const PN: Record<string, string> = { HB: '六角螺栓', PTN: '防鬆螺帽', CSS: '套管螺絲' };
const PC: Record<string, string> = { HB: '#39d5ff', PTN: '#ffd23f', CSS: '#b78cff' };
function schedule(lanes: Record<string, string[]>) {
  const res: Record<string, { id: string; start: number; setup: number; end: number; late: boolean }[]> = {};
  let setupTot = 0, onTimeQty = 0, totalQty = 0, flowSum = 0, n = 0;
  for (const m of MACH) {
    let t = 0, prevFam = '';
    res[m.id] = [];
    for (const oid of lanes[m.id] || []) {
      const o = ORDERS.find((x) => x.id === oid)!;
      const fam = o.prod + o.size;
      const setup = !prevFam ? 1 : prevFam === fam ? 0.3 : 1.5;
      const start = t; t += setup; const end = t + o.qty / m.rate; t = end; prevFam = fam;
      const late = end > o.due * 16 || end > 80;
      setupTot += setup; if (!late) onTimeQty += o.qty; flowSum += end; n++;
      res[m.id].push({ id: oid, start, setup, end, late });
    }
  }
  ORDERS.forEach((o) => (totalQty += o.qty));
  const placed = Object.values(lanes).flat().length;
  return { res, setupTot, otif: onTimeQty / totalQty, avgFlow: n ? flowSum / n : 0, placed };
}
export function ScheduleGame({ onDone }: GP) {
  const [lanes, setLanes] = useState<Record<string, string[]>>({ R1: [], R2: [], T1: [] });
  const [pick, setPick] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [step, setStep] = useState(0);
  const [qty, setQty] = useState(2000);
  const [mode, setMode] = useState<'normal' | 'exp' | ''>('');
  const sch = schedule(lanes);
  const unplaced = ORDERS.filter((o) => !Object.values(lanes).flat().includes(o.id));
  const place = (oid: string, mid: string) => {
    const o = ORDERS.find((x) => x.id === oid)!; const m = MACH.find((x) => x.id === mid)!;
    if (!m.ok.includes(o.prod)) { setErr(`${m.n} 無法加工${PN[o.prod]}（${o.prod === 'PTN' ? '內螺紋需攻牙' : '外螺紋需搓牙'}）`); return; }
    setErr('');
    const nl: Record<string, string[]> = {}; for (const k of Object.keys(lanes)) nl[k] = lanes[k].filter((x) => x !== oid);
    nl[mid] = [...nl[mid], oid]; setLanes(nl); setPick(null);
  };
  const move = (mid: string, i: number, d: number) => { const l = [...lanes[mid]]; const j = i + d; if (j < 0 || j >= l.length) return; [l[i], l[j]] = [l[j], l[i]]; setLanes({ ...lanes, [mid]: l }); };
  const remove = (mid: string, oid: string) => setLanes({ ...lanes, [mid]: lanes[mid].filter((x) => x !== oid) });
  const urgentOk = !sch.res.R1.concat(sch.res.R2).find((x) => x.id === 'O6')?.late && Object.values(lanes).flat().includes('O6');
  // MRP：套管淨需求
  const gross = 8000, onHand = 5000, ss = 1000, net = gross - onHand + ss;
  const W = 80;
  return (
    <div>
      <Steps steps={['有限產能排程', 'MRP 物料需求']} cur={step} />
      {step === 0 && (
        <Card title="把訂單拖曳（或點選）到機台排程表" right={<SimTag />}>
          <Hint>相同產品族群（同產品同尺寸）接著做，換線只要 0.3 h；不同族群 1.5 h。一天 16 小時（兩班），週一 0 h 開始。O6 是插單急單。</Hint>
          <div className="orders">{unplaced.map((o) => (
            <button key={o.id} draggable onDragStart={(e) => e.dataTransfer.setData('text', o.id)} className={`ord ${pick === o.id ? 'on' : ''}`} style={{ borderColor: PC[o.prod] }} onClick={() => setPick(pick === o.id ? null : o.id)}>
              <b>{o.id}</b> {o.urgent && <Tag color="var(--red)">急單</Tag>}<br />{PN[o.prod]} {o.size}<br /><small>{fmt.n(o.qty)} 顆・交期 D{o.due}</small>
            </button>
          ))}{!unplaced.length && <span className="muted">全部訂單已排入 ✔</span>}</div>
          {err && <div className="warnbox">{err}</div>}
          <div className="gantt">
            <div className="g-axis">{[0, 1, 2, 3, 4, 5].map((d) => <span key={d} style={{ left: `${(d * 16 / W) * 100}%` }}>D{d + 1 > 5 ? '' : d + 1}</span>)}</div>
            {MACH.map((m) => (
              <div key={m.id} className={`lane ${pick ? 'target' : ''}`} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); place(e.dataTransfer.getData('text'), m.id); }} onClick={() => pick && place(pick, m.id)}>
                <div className="lane-n">{m.n}<small>{m.rate} 顆/h</small></div>
                <div className="lane-t">
                  {[1, 2, 3, 4].map((d) => <i key={d} className="dayline" style={{ left: `${(d * 16 / W) * 100}%` }} />)}
                  {sch.res[m.id].map((b) => { const o = ORDERS.find((x) => x.id === b.id)!; return (
                    <React.Fragment key={b.id}>
                      <div className="blk setup" style={{ left: `${(b.start / W) * 100}%`, width: `${(b.setup / W) * 100}%` }} title="換線" />
                      <div className={`blk ${b.late ? 'late' : ''}`} style={{ left: `${((b.start + b.setup) / W) * 100}%`, width: `${Math.max(2, ((b.end - b.start - b.setup) / W) * 100)}%`, background: PC[o.prod] }} title={`${b.id} 完成 ${b.end.toFixed(1)}h`}>{b.id}</div>
                    </React.Fragment>); })}
                  {sch.res[m.id].length > 0 && sch.res[m.id][sch.res[m.id].length - 1].end > W && <div className="overflow">超出本週產能</div>}
                </div>
                <div className="lane-ops">{lanes[m.id].map((oid, i) => <span key={oid} className="mini">{oid}<a onClick={(e) => { e.stopPropagation(); move(m.id, i, -1); }}>◀</a><a onClick={(e) => { e.stopPropagation(); move(m.id, i, 1); }}>▶</a><a onClick={(e) => { e.stopPropagation(); remove(m.id, oid); }}>✕</a></span>)}</div>
              </div>
            ))}
          </div>
          <div className="grid4">
            <div className="kpi"><div className="kpi-l">OTIF（數量加權）</div><div className="kpi-v" style={{ color: sch.otif >= 0.95 ? 'var(--green)' : 'var(--orange)' }}>{fmt.pct(sch.otif)}</div></div>
            <div className="kpi"><div className="kpi-l">換線總時數</div><div className="kpi-v">{sch.setupTot.toFixed(1)} h</div></div>
            <div className="kpi"><div className="kpi-l">平均完工時間</div><div className="kpi-v">{sch.avgFlow.toFixed(1)} h</div></div>
            <div className="kpi"><div className="kpi-l">急單 O6</div><div className="kpi-v">{urgentOk ? '準時' : '未準時'}</div></div>
          </div>
          <div className="row end"><Btn kind="primary" disabled={unplaced.length > 0} onClick={() => setStep(1)}>下一步：MRP</Btn></div>
        </Card>
      )}
      {step === 1 && (
        <Card title="MRP：套管螺絲 O3 的套管需求" right={<SimTag />}>
          <div className="bom"><div className="bom-n">套管螺絲 ×1</div><div className="bom-c"><div>螺絲本體 ×1（自製）</div><div>套管 ×1（外購）</div></div></div>
          <div className="metric-list">
            <div><span>毛需求（O3 數量 × 1）</span><b>{fmt.n(gross)}</b></div><div><span>現有庫存</span><b>{fmt.n(onHand)}</b></div>
            <div><span>在途量</span><b>0</b></div><div><span>安全庫存</span><b>{fmt.n(ss)}</b></div>
          </div>
          <div className="slider"><label>採購數量<b>{fmt.n(qty)}</b></label><div className="row"><Btn small onClick={() => setQty(Math.max(0, qty - 500))}>−500</Btn><input type="range" min={0} max={10000} step={500} value={qty} onChange={(e) => setQty(+e.target.value)} aria-label="採購數量" /><Btn small onClick={() => setQty(Math.min(10000, qty + 500))}>＋500</Btn></div></div>
          <p>組裝需在 D4 前備料。</p>
          <div className="opts"><button className={`opt ${mode === 'normal' ? 'on' : ''}`} onClick={() => setMode('normal')}>一般採購：交期 5 天，NT$1.2/個</button><button className={`opt ${mode === 'exp' ? 'on' : ''}`} onClick={() => setMode('exp')}>急件採購：交期 2 天，NT$2.0/個</button></div>
          <Hint>淨需求 ＝ 毛需求 − 庫存 − 在途 ＋ 安全庫存。交期也要能趕上組裝時間。</Hint>
          <div className="row end"><Btn kind="primary" disabled={!mode} onClick={() => {
            const qOk = qty === net ? 15 : Math.abs(qty - net) <= 1000 ? 8 : 0;
            const mOk = mode === 'exp' ? 10 : 0;
            const setupScore = clamp((14 - sch.setupTot) / 7, 0, 1) * 20;
            const score = Math.round(sch.otif * 45 + setupScore + (urgentOk ? 10 : 0) + qOk + mOk);
            onDone({ score: clamp(score, 0, 100), summary: [`排程 OTIF ${fmt.pct(sch.otif)}、換線 ${sch.setupTot.toFixed(1)} h、急單${urgentOk ? '準時' : '延誤'}`, `MRP 淨需求 ${fmt.n(net)}，你採購 ${fmt.n(qty)}（${mode === 'exp' ? '急件，趕得上' : '一般，交期趕不上 D4'}）`],
              effect: { funds: -(qty * (mode === 'exp' ? 2 : 1.2)) * 0.2 | 0, st: { thread: { setupH: sch.setupTot < 9 ? -0.15 : 0 } }, f: { dataQuality: 0.02 } } });
          }}>提交排程與採購</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 第八章：SPC / Cpk / Pareto / 根因 / QC vs QA ============
function genSPC(seed: number) {
  const r = mulberry32(seed);
  const gauss = () => { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const groups = Array.from({ length: 30 }, (_, i) => Array.from({ length: 5 }, () => 10 + (i >= 18 ? 0.55 : 0) + gauss() * 0.3));
  const xbar = groups.map((g) => g.reduce((a, b) => a + b, 0) / 5);
  const R = groups.map((g) => Math.max(...g) - Math.min(...g));
  const base = xbar.slice(0, 15), Rb = R.slice(0, 15);
  const xbb = base.reduce((a, b) => a + b, 0) / 15, rbar = Rb.reduce((a, b) => a + b, 0) / 15;
  const ucl = xbb + 0.577 * rbar, lcl = xbb - 0.577 * rbar;
  const sig: number[] = [];
  xbar.forEach((v, i) => { if (v > ucl || v < lcl) sig.push(i); });
  let run = 0;
  xbar.forEach((v, i) => { run = v > xbb ? (run > 0 ? run + 1 : 1) : (run < 0 ? run - 1 : -1); if (Math.abs(run) >= 8 && !sig.includes(i)) sig.push(i); });
  const stat = (arr: number[][]) => { const all = arr.flat(); const m = all.reduce((a, b) => a + b, 0) / all.length; const sd = Math.sqrt(all.reduce((a, b) => a + (b - m) ** 2, 0) / (all.length - 1)); return { m, sd, cp: (11.2 - 8.8) / (6 * sd), cpk: Math.min(11.2 - m, m - 8.8) / (3 * sd) }; };
  return { xbar, ucl, lcl, xbb, sig: sig.sort((a, b) => a - b), before: stat(groups.slice(0, 18)), after: stat(groups.slice(18)) };
}
const QCQA = [
  { t: '首件檢驗與巡檢紀錄', a: 'QC' }, { t: '建立供應商稽核計畫', a: 'QA' }, { t: '判定一批扭力超規產品', a: 'QC' },
  { t: '修訂 FMEA 與管制計畫', a: 'QA' }, { t: '執行 SPC 量測與管制圖繪製', a: 'QC' }, { t: '主導內部品質系統稽核', a: 'QA' },
];
export function SPCGame({ onDone }: GP) {
  const { g } = useG();
  const d = useMemo(() => genSPC(g.seed + 8), []);
  const [step, setStep] = useState(0);
  const [marks, setMarks] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const [pareto, setPareto] = useState<number | null>(null);
  const [causes, setCauses] = useState<string[]>([]);
  const [plan, setPlan] = useState<number | null>(null);
  const [qa, setQa] = useState<Record<number, string>>({});
  const tp = marks.filter((m) => d.sig.includes(m)).length, fp = marks.length - tp;
  const spcScore = clamp(Math.round((tp / Math.max(1, d.sig.length)) * 30 - fp * 4), 0, 30);
  const PD = [{ l: '扭力偏高', v: 48 }, { l: '牙紋損傷', v: 12 }, { l: '外觀刮傷', v: 9 }, { l: '尺寸', v: 5 }, { l: '其他', v: 3 }];
  const FISH: Record<string, string[]> = { 人: ['夜班交接'], 機: ['沖壓機壓力漂移'], 料: ['新盤元批號 H-2307'], 法: ['沖壓條件未依硬度分級'], 環: ['廠內溫度'], 測: ['扭力計校正逾期'] };
  const PLANS = [
    { t: '數據顯示夜班時異常，直接判定為夜班人員疏失', ok: 0, why: '時間上的相關不等於因果，而且新批號也同時出現。' },
    { t: '在同一機台、同一班別，以 H-2307 與舊批號對照試產，並量測熱處理後硬度與扭力（控制其他變因）', ok: 20, why: '設計對照實驗驗證假說，正是「相關≠因果」的正確作法。' },
    { t: '立即更換盤元供應商', ok: 4, why: '尚未驗證就採取昂貴對策，可能找錯原因。' },
    { t: '先進行 MSA 確認扭力計可信，再進行對照試驗', ok: 18, why: '先確認量測系統是好習慣，但仍需接著做對照實驗。' },
  ];
  return (
    <div>
      <Steps steps={['管制圖判讀', 'Cp/Cpk 與柏拉圖', '魚骨圖與根因驗證', 'QC vs QA']} cur={step} />
      {step === 0 && (
        <Card title="X̄ 管制圖：預置扭力（虛構 N·m，n＝5）" right={<SimTag />}>
          <Hint>點擊你認為有異常訊號的點：超出管制界限，或連續 8 點落在中心線同側（第 8 點起）。管制界限以前 15 組計算。</Hint>
          <Lines labels={d.xbar.map((_, i) => `${i + 1}`)} series={[{ name: 'X̄', color: '#39d5ff', values: d.xbar }]} hlines={[{ v: d.ucl, label: `UCL ${d.ucl.toFixed(2)}`, color: '#ff5d73' }, { v: d.xbb, label: `CL ${d.xbb.toFixed(2)}`, color: '#7cf29c' }, { v: d.lcl, label: `LCL ${d.lcl.toFixed(2)}`, color: '#ff5d73' }]}
            onPoint={(i) => !checked && setMarks(marks.includes(i) ? marks.filter((x) => x !== i) : [...marks, i])} marks={checked ? d.sig : marks} markColor={checked ? '#ff5d73' : '#ffd23f'} h={240} />
          {checked && <p>真正的異常訊號：第 {d.sig.map((x) => x + 1).join('、')} 組。你標記正確 {tp} 點、誤判 {fp} 點。注意第 19 組起製程整體上移——同時是新盤元批號 H-2307 上線與夜班交接時段。</p>}
          <div className="row end">{!checked ? <Btn kind="primary" onClick={() => setChecked(true)}>確認判讀（已標 {marks.length} 點）</Btn> : <Btn kind="primary" onClick={() => setStep(1)}>下一步</Btn>}</div>
        </Card>
      )}
      {step === 1 && (
        <Card title="製程能力與柏拉圖" right={<SimTag />}>
          <div className="grid2">
            <div>
              <p className="muted">規格：LSL 8.8／USL 11.2（虛構）</p>
              <div className="metric-list">
                <div><span>異常前 Cp／Cpk</span><b className="green">{d.before.cp.toFixed(2)}／{d.before.cpk.toFixed(2)}</b></div>
                <div><span>異常後 Cp／Cpk</span><b className="red">{d.after.cp.toFixed(2)}／{d.after.cpk.toFixed(2)}</b></div>
                <div><span>平均值變化</span><b>{d.before.m.toFixed(2)} → {d.after.m.toFixed(2)}</b></div>
              </div>
              <Hint>比較 Cp 與 Cpk：Cp 只看變異寬度，Cpk 還考慮平均值偏離規格中心。本例 Cp {d.after.cp >= d.before.cp * 0.85 ? '沒有明顯變差' : '也下降'}、Cpk 大幅下降 → 主要問題是「平均值偏移」。</Hint>
            </div>
            <div>
              <p>客訴不良項目（點選應優先處理的項目）</p>
              <Bars data={PD.map((p, i) => ({ label: p.l, v: p.v, color: i === 0 ? '#ff5d73' : '#39d5ff' }))} onPick={(i) => setPareto(i)} picked={pareto ?? undefined} h={170} />
              <p className="small">累積：{PD.map((p, i) => fmt.pct(PD.slice(0, i + 1).reduce((a, b) => a + b.v, 0) / 77, 0)).join(' → ')}</p>
            </div>
          </div>
          <div className="row end"><Btn kind="primary" disabled={pareto === null} onClick={() => setStep(2)}>下一步</Btn></div>
        </Card>
      )}
      {step === 2 && (
        <Card title="魚骨圖：選出最多 2 個值得驗證的可能原因">
          <div className="fish">{Object.entries(FISH).map(([k, arr]) => (
            <div key={k} className="bone"><b>{k}</b>{arr.map((c) => <button key={c} className={`chip ${causes.includes(c) ? 'on' : ''}`} onClick={() => setCauses(causes.includes(c) ? causes.filter((x) => x !== c) : causes.length < 2 ? [...causes, c] : causes)}>{c}</button>)}</div>
          ))}<div className="fish-head">扭力偏高</div></div>
          <p className="small muted">證據：異常自第 19 組開始；H-2307 於同日上線；夜班交接亦同時段；沖壓條件目前未依硬度分級（呼應預置扭力需「熱處理後硬度」與「沖壓條件」配合）。</p>
          <h4>你的驗證計畫？</h4>
          <div className="opts col">{PLANS.map((p, i) => <button key={i} className={`opt ${plan === i ? 'on' : ''}`} onClick={() => setPlan(i)}>{p.t}</button>)}</div>
          {plan !== null && <div className={PLANS[plan].ok >= 18 ? 'goodbox' : 'warnbox'}>{PLANS[plan].why}</div>}
          <div className="row end"><Btn kind="primary" disabled={plan === null || !causes.length} onClick={() => setStep(3)}>下一步</Btn></div>
        </Card>
      )}
      {step === 3 && (
        <Card title="QC 還是 QA？">
          <Hint>QC 重在產品與製程檢驗、異常判定、品質數據；QA 重在品質系統、預防機制、稽核、程序管理。</Hint>
          {QCQA.map((q, i) => <div key={i} className="row between qrow"><span>{q.t}</span><span>{['QC', 'QA'].map((x) => <button key={x} className={`opt sm ${qa[i] === x ? 'on' : ''}`} onClick={() => setQa({ ...qa, [i]: x })}>{x}</button>)}</span></div>)}
          <div className="row end"><Btn kind="primary" disabled={Object.keys(qa).length < 6} onClick={() => {
            const qcqa = QCQA.filter((q, i) => qa[i] === q.a).length;
            const causeS = (causes.includes('新盤元批號 H-2307') ? 6 : 0) + (causes.includes('沖壓條件未依硬度分級') ? 4 : 0) + (causes.includes('扭力計校正逾期') ? 2 : 0);
            const score = spcScore + (pareto === 0 ? 10 : 0) + Math.min(10, causeS) + PLANS[plan!].ok + qcqa * 5;
            onDone({ score: clamp(Math.round(score), 0, 100), summary: [`管制圖判讀 ${spcScore}/30`, `柏拉圖優先項目：${PD[pareto!].l}`, `驗證計畫：${PLANS[plan!].ok >= 18 ? '可驗證的對照實驗 ✔' : '未能驗證因果 ✘'}`, `QC/QA 分辨 ${qcqa}/6`],
              effect: { f: { latent: plan === 1 || plan === 3 ? -0.0006 : 0 }, st: { secondary: { Q: plan === 1 || plan === 3 ? 0.004 : 0 } } }, extra: { spcPerfect: tp === d.sig.length && fp === 0 } });
          }}>完成分析</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 第九章：供應鏈 TCO ============
const SUP = [
  { id: 'A', n: '甲鋼廠（國內）', price: 31.5, lead: '2 週', otd: 0.96, ppm: 300, tr: 0.4, pl: 0.04, var: 1 },
  { id: 'B', n: '乙貿易（海外）', price: 27.8, lead: '海運 6 週／空運 2 週', otd: 0.82, ppm: 1200, tr: 1.2, pl: 0.18, var: 3 },
  { id: 'C', n: '丙鋼廠（國內）', price: 29.9, lead: '3 週', otd: 0.9, ppm: 600, tr: 0.5, pl: 0.1, var: 1.5 },
];
function tco(al: number[], air: boolean, ssw: number) {
  const tot = al.reduce((a, b) => a + b, 0) || 1; const T = 120;
  let price = 0, trans = 0, qual = 0, short = 0;
  SUP.forEach((s, i) => {
    const t = (al[i] / tot) * T;
    const isB = s.id === 'B';
    const tr = isB && air ? 5.5 : s.tr, pl = isB && air ? 0.1 : s.pl, vr = isB && air ? 1 : s.var;
    price += t * s.price * 1000; trans += t * tr * 1000; qual += t * (s.ppm / 1e6) * 100000 * 40;
    short += t * pl * (1 - clamp(ssw / vr, 0, 1)) * 60000;
  });
  const maxShare = Math.max(...al) / tot;
  const conc = maxShare > 0.7 ? (maxShare - 0.7) * 600000 : 0;
  const hold = ssw * 30 * 30000 * 0.015 * 4;
  return { price, trans, qual, short, conc, hold, total: price + trans + qual + short + conc + hold };
}
export function SupplyGame({ onDone }: GP) {
  const [al, setAl] = useState([0, 100, 0]);
  const [air, setAir] = useState(false);
  const [ssw, setSsw] = useState(0);
  const [step, setStep] = useState(0);
  const [disr, setDisr] = useState<number | null>(null);
  const t = tco(al, air, ssw);
  const best = useMemo(() => { let b = Infinity; for (let a = 0; a <= 100; a += 10) for (let c = 0; c <= 100 - a; c += 10) for (const ai of [false, true]) for (let s = 0; s <= 3; s++) b = Math.min(b, tco([a, 100 - a - c, c], ai, s).total); return b; }, []);
  const eff = best / t.total;
  const tot = al.reduce((a, b) => a + b, 0) || 1;
  const parts = [{ l: '採購價', v: t.price, c: '#39d5ff' }, { l: '運輸', v: t.trans, c: '#7cf29c' }, { l: '品質成本', v: t.qual, c: '#ff5d73' }, { l: '缺料風險', v: t.short, c: '#ffd23f' }, { l: '集中風險', v: t.conc, c: '#ff9a3c' }, { l: '庫存持有', v: t.hold, c: '#b78cff' }];
  const DIS = [
    { t: '轉國內供應商補量（單價略高）', s: 12 }, { t: '部分改空運（運費高）', s: 8 }, { t: '等船（承擔缺料風險）', s: 0 },
  ];
  return (
    <div>
      {step === 0 && (
        <Card title="120 噸盤元採購分配（4 週內交貨）" right={<SimTag />}>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>供應商</th><th>單價（千元/噸）</th><th>交期</th><th>準交率</th><th>品質 PPM</th><th>分配</th></tr></thead>
            <tbody>{SUP.map((s, i) => <tr key={s.id}><td>{s.n}</td><td>{s.price}</td><td>{s.lead}</td><td>{fmt.pct(s.otd, 0)}</td><td>{s.ppm}</td>
              <td><div className="row sm"><Btn small onClick={() => { const a = [...al]; a[i] = Math.max(0, a[i] - 10); setAl(a); }}>−</Btn><b>{fmt.pct(al[i] / tot, 0)}</b><Btn small onClick={() => { const a = [...al]; a[i] = Math.min(100, a[i] + 10); setAl(a); }}>＋</Btn></div></td></tr>)}</tbody></table></div>
          <div className="row wrap"><label className="check"><input type="checkbox" checked={air} onChange={(e) => setAir(e.target.checked)} /> 乙貿易改空運</label>
            <span>安全庫存：</span>{[0, 1, 2, 3].map((w) => <button key={w} className={`opt sm ${ssw === w ? 'on' : ''}`} onClick={() => setSsw(w)}>{w} 週</button>)}</div>
          <div className="grid2">
            <div><Bars data={parts.map((p) => ({ label: p.l, v: p.v / 1e4, color: p.c }))} fmtv={(v) => v.toFixed(0)} h={190} /><p className="small muted center">單位：萬元</p></div>
            <div>
              <div className="kpi"><div className="kpi-l">總持有成本 TCO</div><div className="kpi-v">{fmt.wan(t.total)}</div><div className="kpi-s">每噸 {fmt.nt(t.total / 120)}</div></div>
              <Meter label="與最佳方案的差距" right={fmt.pct(eff, 1)} v={eff} color="var(--green)" />
              <Hint>乙貿易單價最低，但品質、缺料與集中風險的隱藏成本要一起算。單一供應商超過 70% 會產生集中風險。</Hint>
            </div>
          </div>
          <div className="row end"><Btn kind="primary" onClick={() => setStep(1)}>送出採購決策</Btn></div>
        </Card>
      )}
      {step === 1 && (
        <Card title="突發：國際航線受阻，海運貨物預估晚到 3 週">
          <p>{al[1] > 0 && !air ? `你有 ${fmt.pct(al[1] / tot, 0)} 的盤元走海運，直接受到影響。` : '你的海運占比很低，影響有限——這就是分散風險的價值。'}</p>
          <div className="opts col">{DIS.map((d2, i) => <button key={i} className={`opt ${disr === i ? 'on' : ''}`} onClick={() => setDisr(i)}>{d2.t}</button>)}</div>
          <div className="row end"><Btn kind="primary" disabled={disr === null} onClick={() => {
            const exposure = al[1] > 0 && !air ? al[1] / tot : 0;
            const score = Math.round(clamp((eff - 0.85) / 0.15, 0, 1) * 70 + (Math.max(...al) / tot <= 0.7 ? 15 : 0) + (exposure > 0 ? DIS[disr!].s * 0.8 : 15));
            onDone({ score: clamp(score, 0, 100), summary: [`TCO ${fmt.wan(t.total)}（最佳方案 ${fmt.wan(best)}）`, `最大單一供應商占比 ${fmt.pct(Math.max(...al) / tot, 0)}`, `運輸受阻處置：${DIS[disr!].t}`],
              effect: { f: { supplierDelay: exposure * 0.08 - (Math.max(...al) / tot <= 0.7 ? 0.02 : 0), safetyStockDays: ssw, priceFactor: (t.price / 120 / 1000 - 31) / 100 } }, extra: { tco: eff > 0.97 } });
          }}>完成</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 第十章：資料清理 → 瓶頸 → 觀念 → 改善 ROI ============
const ROWS = [
  { id: 1, st: '冷鍛', ct: '3.9', down: '35', out: '6820', issue: 'ok' }, { id: 2, st: '搓牙', ct: '4.7', down: '62', out: '5410', issue: 'ok' },
  { id: 3, st: '搓牙', ct: '4.7', down: '62', out: '5410', issue: 'dup' }, { id: 4, st: '熱處理', ct: '', down: '20', out: '7900', issue: 'missing' },
  { id: 5, st: '搓呀', ct: '4.9', down: '55', out: '5320', issue: 'name' }, { id: 6, st: '表面處理', ct: '4.1', down: '28', out: '6400', issue: 'ok' },
  { id: 7, st: '光學檢驗', ct: '0.075', down: '15', out: '6010', issue: 'unit' }, { id: 8, st: '冷鍛', ct: '4.0', down: '40', out: '6700', issue: 'ok' },
  { id: 9, st: '表面處理', ct: '4.2', down: '30', out: '6380', issue: 'ok' }, { id: 10, st: '光學檢驗', ct: '4.4', down: '18', out: '6100', issue: 'ok' },
  { id: 11, st: '冷鍛', ct: '3.9', down: '35', out: '6820', issue: 'dup' }, { id: 12, st: '熱處理', ct: '3.2', down: '22', out: '7950', issue: 'ok' },
];
const ACT: Record<string, string> = { ok: '保留', dup: '刪除重複', missing: '標記缺失／補值', name: '修正站名', unit: '修正單位（分→秒）' };
const PLANS10 = [
  { id: 'opt', n: '光學檢驗再加購一台', cost: 1800000, eff: { optical: 0.5 }, e: { st: { optical: { machines: 1 } } } as Effect },
  { id: 'smed', n: '搓牙 SMED＋牙板預防更換', cost: 600000, eff: { thread: -0.7 }, e: { st: { thread: { setupH: -0.3, A: 0.025 } } } as Effect },
  { id: 'dbr', n: '搓牙前設置時間緩衝＋DBR 排程', cost: 200000, eff: { thread: -0.25 }, e: { st: { thread: { A: 0.015 } } } as Effect },
  { id: 'forge', n: '冷鍛提速 10%', cost: 300000, eff: { forge: -0.4 }, e: { st: { forge: { P: 0.03 } } } as Effect },
  { id: 'wip', n: '全廠加大在製品緩衝', cost: 100000, eff: {}, e: { f: { safetyStockDays: 1 } } as Effect },
];
const CT0: Record<string, number> = { forge: 4.4, thread: 5.7, heat: 3.4, surface: 4.3, optical: 4.6 };
const CTN: Record<string, string> = { forge: '冷鍛', thread: '搓牙', heat: '熱處理', surface: '表面處理', optical: '光學' };
export function DataGame({ onDone }: GP) {
  const [step, setStep] = useState(0);
  const [act, setAct] = useState<Record<number, string>>({});
  const [cleanChecked, setCleanChecked] = useState(false);
  const [bott, setBott] = useState<number | null>(null);
  const [cq, setCq] = useState<Record<string, string>>({});
  const [lit, setLit] = useState<number | null>(null);
  const [plans, setPlans] = useState<string[]>([]);
  const cleanOk = ROWS.filter((r) => act[r.id] === r.issue).length;
  const takt = (80 * 3600) / 55000;
  const keys = Object.keys(CT0);
  const ctAfter = (ps: string[]) => { const c = { ...CT0 }; ps.forEach((p) => { const pl = PLANS10.find((x) => x.id === p)!; for (const [k, v] of Object.entries(pl.eff)) c[k] = k === 'optical' && v === 0.5 ? c[k] * 0.5 : c[k] + (v as number); }); return c; };
  const c1 = ctAfter(plans);
  const maxCt0 = Math.max(...Object.values(CT0)), maxCt1 = Math.max(...Object.values(c1));
  const th0 = Math.min(55000, (80 * 3600) / maxCt0), th1 = Math.min(55000, (80 * 3600) / maxCt1);
  const cost = plans.reduce((a, p) => a + PLANS10.find((x) => x.id === p)!.cost, 0);
  const annual = (th1 - th0) * 6 * 50; // 每顆邊際貢獻 NT$6（模擬）
  const roi = cost ? (annual - cost) / cost : 0;
  const DEFS = [{ k: 'takt', t: '可用生產時間 ÷ 客戶需求量' }, { k: 'cycle', t: '某站實際完成一單位所需時間' }, { k: 'lead', t: '從投料到完成交付的總時間' }];
  const OPTS = [{ v: 'takt', n: '節拍時間 Takt Time' }, { v: 'cycle', n: '週期時間 Cycle Time' }, { v: 'lead', n: '前置時間 Lead Time' }];
  const LIT = ['4 小時', '40 小時', '400 小時', '14,400 小時'];
  return (
    <div>
      <Steps steps={['資料清理', '瓶頸辨識', '觀念檢核', '改善方案 ROI']} cur={step} />
      {step === 0 && (
        <Card title="生產紀錄資料清理（每列選擇處置）" right={<SimTag />}>
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>#</th><th>站別</th><th>週期時間</th><th>停機(分)</th><th>產出</th><th>處置</th></tr></thead>
            <tbody>{ROWS.map((r) => <tr key={r.id} className={cleanChecked ? (act[r.id] === r.issue ? 'ok' : 'ng') : ''}><td>{r.id}</td><td>{r.st}</td><td>{r.ct || <i className="muted">（空白）</i>}</td><td>{r.down}</td><td>{r.out}</td>
              <td><select value={act[r.id] || ''} disabled={cleanChecked} onChange={(e) => setAct({ ...act, [r.id]: e.target.value })}><option value="">—</option>{Object.entries(ACT).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>{cleanChecked && act[r.id] !== r.issue && <div className="small">應為：{ACT[r.issue]}</div>}</td></tr>)}</tbody></table></div>
          <Hint>注意：完全相同的列、空白值、錯字站名、明顯不合理的單位（0.075 秒？其實是分鐘）。</Hint>
          <div className="row end">{!cleanChecked ? <Btn kind="primary" disabled={Object.keys(act).length < 12} onClick={() => setCleanChecked(true)}>檢查</Btn> : <Btn kind="primary" onClick={() => setStep(1)}>下一步（正確 {cleanOk}/12）</Btn>}</div>
        </Card>
      )}
      {step === 1 && (
        <Card title="各站有效週期時間 vs 節拍時間（點選瓶頸站）" right={<SimTag />}>
          <p>節拍時間 ＝ 80 h × 3600 s ÷ 55,000 顆 ＝ <b>{takt.toFixed(2)} 秒/顆</b>。有效週期時間已含停機與換線損失（秒/顆）。</p>
          <Bars data={keys.map((k) => ({ label: CTN[k], v: CT0[k], color: CT0[k] > takt ? '#ff5d73' : '#39d5ff' }))} line={takt} lineLabel={`Takt ${takt.toFixed(2)}s`} onPick={(i) => setBott(i)} picked={bott ?? undefined} />
          {bott !== null && <div className={keys[bott] === 'thread' ? 'goodbox' : 'warnbox'}>{keys[bott] === 'thread' ? '正確！搓牙有效週期時間 5.7 秒 > 節拍 5.24 秒，是唯一跟不上客戶需求的站。' : `${CTN[keys[bott]]} 的週期時間低於節拍時間，不是瓶頸。`}</div>}
          <div className="row end"><Btn kind="primary" disabled={bott === null} onClick={() => setStep(2)}>下一步</Btn></div>
        </Card>
      )}
      {step === 2 && (
        <Card title="觀念檢核">
          {DEFS.map((d2) => <div key={d2.k} className="row between qrow"><span>{d2.t}</span><select value={cq[d2.k] || ''} onChange={(e) => setCq({ ...cq, [d2.k]: e.target.value })}><option value="">—</option>{OPTS.map((o) => <option key={o.v} value={o.v}>{o.n}</option>)}</select></div>)}
          <div className="quiz"><p>小法則：搓牙前後在製品（WIP）24,000 顆，產出率 600 顆/小時，流程時間是？</p><div className="opts">{LIT.map((l, i) => <button key={i} className={`opt ${lit === i ? (i === 1 ? 'right' : 'wrong') : ''}`} onClick={() => setLit(i)}>{l}</button>)}</div>{lit !== null && <p className="small">WIP ＝ 產出率 × 流程時間 → 24,000 ÷ 600 ＝ 40 小時（單位：顆 ÷ 顆/小時 ＝ 小時）。</p>}</div>
          <div className="row end"><Btn kind="primary" disabled={Object.keys(cq).length < 3 || lit === null} onClick={() => setStep(3)}>下一步</Btn></div>
        </Card>
      )}
      {step === 3 && (
        <Card title="選擇改善方案（預算 NT$100 萬）" right={<SimTag />}>
          {PLANS10.map((p) => <label key={p.id} className="check plan"><input type="checkbox" checked={plans.includes(p.id)} onChange={(e) => setPlans(e.target.checked ? [...plans, p.id] : plans.filter((x) => x !== p.id))} /><b>{p.n}</b><span>{fmt.wan(p.cost)}</span></label>)}
          <div className="grid4">
            <div className="kpi"><div className="kpi-l">投資</div><div className="kpi-v" style={{ color: cost > 1000000 ? 'var(--red)' : undefined }}>{fmt.wan(cost)}</div></div>
            <div className="kpi"><div className="kpi-l">新瓶頸週期時間</div><div className="kpi-v">{maxCt1.toFixed(2)}s</div><div className="kpi-s">{CTN[keys.find((k) => c1[k] === maxCt1)!]}</div></div>
            <div className="kpi"><div className="kpi-l">週產能</div><div className="kpi-v">{fmt.n(th1)}</div><div className="kpi-s">原 {fmt.n(th0)}</div></div>
            <div className="kpi"><div className="kpi-l">年化 ROI</div><div className="kpi-v">{cost ? fmt.pct(roi, 0) : '—'}</div></div>
          </div>
          <Bars data={keys.map((k) => ({ label: CTN[k], v: c1[k], color: c1[k] === maxCt1 ? '#ff5d73' : '#39d5ff' }))} line={takt} lineLabel="Takt" h={150} />
          <Hint>改善非瓶頸（光學、冷鍛）不會增加產出；加大 WIP 只會拉長前置時間。</Hint>
          <div className="row end"><Btn kind="primary" disabled={cost > 1000000 || !plans.length} onClick={() => {
            const concept = DEFS.filter((d2) => cq[d2.k] === d2.k).length;
            const planScore = clamp(roi / 2, 0, 1) * 22 + (plans.includes('opt') || plans.includes('wip') || plans.includes('forge') ? 0 : 8);
            const score = cleanOk / 12 * 25 + (keys[bott!] === 'thread' ? 20 : 0) + concept * 6 + (lit === 1 ? 7 : 0) + planScore;
            let e: Effect = { f: { dataQuality: 0.04 } };
            plans.forEach((p) => { const pl = PLANS10.find((x) => x.id === p)!; e = { ...e, st: { ...(e.st || {}), ...(pl.e.st || {}) }, f: { ...(e.f || {}), ...(pl.e.f || {}) } }; });
            e.funds = -Math.round(cost * 0.1);
            onDone({ score: clamp(Math.round(score), 0, 100), summary: [`資料清理 ${cleanOk}/12`, `瓶頸辨識：${keys[bott!] === 'thread' ? '搓牙 ✔' : '錯誤 ✘'}`, `Takt/Cycle/Lead 與小法則 ${concept + (lit === 1 ? 1 : 0)}/4`, `改善方案年化 ROI ${fmt.pct(roi, 0)}，週產能 ${fmt.n(th0)} → ${fmt.n(th1)}`], effect: e, extra: { bottleneck: keys[bott!] === 'thread' } });
          }}>提交改善提案</Btn></div>
        </Card>
      )}
    </div>
  );
}
