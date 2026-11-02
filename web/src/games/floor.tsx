import React, { useMemo, useState } from 'react';
import { Btn, Card, Hint, Steps, useG, Bars, Meter, Tag, SimTag } from '../ui/common';
import { mulberry32, clamp, fmt, Effect } from '../sim';

export interface GameResult { score: number; summary: string[]; effect?: Effect; extra?: Record<string, any>; }
export interface GP { cfg?: any; onDone: (r: GameResult) => void; }

// ============ 序章：危險辨識 + PPE + 停機判斷 ============
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
export function HazardGame({ onDone }: GP) {
  const [step, setStep] = useState(0);
  const [flag, setFlag] = useState<string[]>([]);
  const [shown, setShown] = useState(false);
  const [ppe, setPpe] = useState<string[]>([]);
  const [ans, setAns] = useState<number[]>([]);
  const tp = flag.filter((f) => SPOTS.find((s) => s.id === f)?.hazard).length;
  const fp = flag.length - tp;
  const hazScore = clamp(tp * 10 - fp * 5, 0, 40);
  const ppeScore = clamp(PPE.reduce((a, p) => a + ((ppe.includes(p.id) === p.ok) ? 1 : 0), 0) / PPE.length * 30, 0, 30);
  const qScore = ans.reduce((a, v, i) => a + (v === STOPQ[i].a ? 10 : 0), 0);
  return (
    <div>
      <Steps steps={['找出危險點', '選擇 PPE', '停機通報判斷']} cur={step} />
      {step === 0 && (
        <Card title="點擊你認為有危險的位置（可再點一次取消）" right={<span className="muted">已標記 {flag.length}</span>}>
          <Hint>共有 4 個危險點，也有 3 個是正確的安全設施——別誤判。</Hint>
          <svg viewBox="0 0 800 440" className="scene">
            <defs><linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b2a48" /><stop offset="1" stopColor="#0d1830" /></linearGradient>
              <linearGradient id="mt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9fb1c9" /><stop offset=".5" stopColor="#5d6f8a" /><stop offset="1" stopColor="#2c3a52" /></linearGradient></defs>
            <rect width="800" height="440" fill="url(#fl)" />
            <path d="M0 260 L800 260" stroke="#2e4470" />
            <path d="M560 260 L800 260 L800 440 L520 440Z" fill="#26324a" /><path d="M560 300 L800 300 M545 360 L800 360" stroke="#ffd23f" strokeDasharray="20 12" strokeWidth="4" />
            <text x="690" y="425" fill="#ffd23f" fontSize="14">堆高機通道</text>
            {/* 打頭機 */}
            <rect x="70" y="110" width="170" height="140" rx="10" fill="url(#mt)" /><rect x="90" y="130" width="70" height="80" fill="#0b1426" /><circle cx="125" cy="170" r="24" fill="none" stroke="#ff9a3c" strokeWidth="4" className="spin" />
            <rect x="160" y="128" width="40" height="70" fill="#7f90a8" transform="rotate(-35 160 128)" opacity=".9" /><text x="78" y="270" fill="#c8d2e0" fontSize="13">多工位打頭機</text>
            <circle cx="260" cy="120" r="14" fill="#e33" stroke="#ffd23f" strokeWidth="4" />
            {/* 搓牙機 + 人 */}
            <rect x="400" y="140" width="130" height="110" rx="8" fill="url(#mt)" /><circle cx="440" cy="190" r="16" fill="#0b1426" stroke="#39d5ff" strokeWidth="3" className="spin" /><text x="410" y="270" fill="#c8d2e0" fontSize="13">搓牙機</text>
            <circle cx="500" cy="150" r="14" fill="#eac09a" /><rect x="486" y="164" width="28" height="50" rx="8" fill="#3a7bd5" /><path d="M486 180 L455 196" stroke="#3a7bd5" strokeWidth="12" strokeLinecap="round" /><circle cx="452" cy="197" r="7" fill="#f4f0e0" />
            {/* 油漬 */}
            <ellipse cx="360" cy="360" rx="48" ry="16" fill="#0a0a0a" opacity=".75" /><ellipse cx="350" cy="356" rx="16" ry="5" fill="#6a5acd" opacity=".35" />
            {/* 料箱 */}
            {[0, 1, 2].map((i) => <rect key={i} x={610 + (i % 2) * 34} y={300 - Math.floor(i / 2) * 30} width="40" height="30" fill="#8a5a2b" stroke="#c88a4b" />)}
            {/* 形跡板 */}
            <rect x="690" y="100" width="70" height="80" fill="#1e2f4f" stroke="#7cf29c" /><path d="M705 115 v40 M725 115 l10 40 M745 115 v30" stroke="#c8d2e0" strokeWidth="4" />
            {/* 滅火器 */}
            <rect x="40" y="300" width="20" height="46" rx="6" fill="#e33" /><text x="22" y="365" fill="#ff5d73" fontSize="11">滅火器</text>
            {SPOTS.map((s) => {
              const on = flag.includes(s.id);
              return (
                <g key={s.id} onClick={() => setFlag(on ? flag.filter((x) => x !== s.id) : [...flag, s.id])} style={{ cursor: 'pointer' }}>
                  <circle cx={s.x} cy={s.y} r={s.r} fill={on ? 'rgba(255,93,115,.25)' : 'rgba(255,255,255,0.001)'} stroke={on ? '#ff5d73' : shown ? (s.hazard ? '#ff5d73' : '#7cf29c') : 'transparent'} strokeWidth="3" strokeDasharray={on ? '0' : '6 4'} />
                  {on && <text x={s.x} y={s.y - s.r - 6} textAnchor="middle" fill="#ff5d73" fontSize="22">⚠</text>}
                </g>
              );
            })}
          </svg>
          {shown && <ul className="list">{SPOTS.map((s) => <li key={s.id} className={s.hazard ? 'bad' : 'good'}><b>{s.hazard ? '危險' : '安全設施'}｜{s.label}</b>：{s.why} {flag.includes(s.id) ? (s.hazard ? '✅ 你找到了' : '❌ 誤判') : s.hazard ? '❌ 漏掉了' : ''}</li>)}</ul>}
          <div className="row end">{!shown ? <Btn kind="primary" onClick={() => setShown(true)}>確認標記</Btn> : <Btn kind="primary" onClick={() => setStep(1)}>下一步：PPE（得分 {hazScore}/40）</Btn>}</div>
        </Card>
      )}
      {step === 1 && (
        <Card title="今天要到冷鍛與搓牙區作業，選擇應配戴／應避免的項目">
          <div className="chips">{PPE.map((p) => <button key={p.id} className={`chip ${ppe.includes(p.id) ? 'on' : ''}`} onClick={() => setPpe(ppe.includes(p.id) ? ppe.filter((x) => x !== p.id) : [...ppe, p.id])}>{ppe.includes(p.id) ? '✔ ' : ''}{p.n}</button>)}</div>
          <Hint>選取＝我會配戴。旋轉機台附近要避免可能被捲入的物品。</Hint>
          <div className="row end"><Btn kind="primary" onClick={() => setStep(2)}>下一步</Btn></div>
        </Card>
      )}
      {step === 2 && (
        <Card title="何時需要停機通報？">
          {STOPQ.map((q, i) => (
            <div key={i} className="quiz">
              <p><b>情境 {i + 1}</b>：{q.q}</p>
              <div className="opts">{q.opts.map((o, j) => <button key={j} className={`opt ${ans[i] === j ? (j === q.a ? 'right' : 'wrong') : ''}`} disabled={ans[i] !== undefined} onClick={() => { const a = [...ans]; a[i] = j; setAns(a); }}>{o}</button>)}</div>
            </div>
          ))}
          <div className="row end"><Btn kind="primary" disabled={ans.filter((x) => x !== undefined).length < 3} onClick={() => onDone({
            score: Math.round(hazScore + ppeScore + qScore),
            summary: [`危險辨識 ${hazScore}/40（找到 ${tp}/4、誤判 ${fp}）`, `PPE 判斷 ${ppeScore.toFixed(0)}/30`, `停機通報 ${qScore}/30`],
            effect: { f: { training: Math.round(qScore / 10) } },
          })}>完成訓練</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 第一章：材質證明與批號追溯 ============
const LOTS = [
  { id: 'L-2311-01', heat: 'H38812', cert: 'SCM435', tag: 'SCM435', dia: '9.20', look: '正常', supplier: '甲鋼廠', ok: 'accept', why: '材證、標籤、線徑一致，外觀正常。' },
  { id: 'L-2311-02', heat: 'H38815', cert: 'SCM435', tag: 'S45C', dia: '9.20', look: '正常', supplier: '丙鋼廠', ok: 'hold', why: '標籤鋼種與材證不符：可能混料，必須隔離並請供應商確認。' },
  { id: 'L-2311-03', heat: 'H38812', cert: 'SCM435', tag: 'SCM435', dia: '9.20', look: '表面鏽斑與刮痕', supplier: '甲鋼廠', ok: 'hold', why: '外觀異常可能影響冷鍛與表面品質，隔離待判（MRB）。' },
  { id: 'L-2311-04', heat: 'B20977', cert: '10B21', tag: '10B21', dia: '6.80', look: '正常', supplier: '甲鋼廠', ok: 'other', why: '這是套管螺絲訂單用的硼鋼，資料一致——允收並分配到正確訂單。' },
];
const LOT_OPTS = [{ id: 'accept', n: '允收：本訂單' }, { id: 'other', n: '允收：分配其他訂單' }, { id: 'hold', n: '隔離待判（MRB）' }, { id: 'reject', n: '直接退貨' }];
export function TraceGame({ onDone }: GP) {
  const [sel, setSel] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [fill, setFill] = useState<string | null>(null);
  const correct = LOTS.filter((l) => sel[l.id] === l.ok || (l.ok === 'hold' && sel[l.id] === 'reject' && l.id === 'L-2311-02')).length;
  const fillOpts = [
    { id: 'expedite', n: '請甲鋼廠加急補料（運費 NT$30,000，延遲 1 天）', s: 25, e: { funds: -30000 } as Effect },
    { id: 'wait', n: '等下週正常到貨（訂單延遲 5 天）', s: 10, e: { brand: -2 } as Effect },
    { id: 'use03', n: '直接使用 L-2311-03 鏽斑料', s: 0, e: { f: { latent: 0.0015 } } as Effect },
  ];
  return (
    <div>
      <Card title="訂單需求：虛構 A 車廠 M10 六角螺栓" right={<SimTag />}>
        <p className="muted">需求鋼種 SCM435（教學設定）・線徑 Ø9.20 mm・需 2 捲。另有一張套管螺絲訂單需 10B21 Ø6.80。</p>
        <div className="tbl-wrap"><table className="tbl">
          <thead><tr><th>批號</th><th>爐號</th><th>材證鋼種</th><th>標籤鋼種</th><th>線徑</th><th>外觀</th><th>處置</th></tr></thead>
          <tbody>{LOTS.map((l) => (
            <tr key={l.id} className={checked ? (sel[l.id] === l.ok ? 'ok' : 'ng') : ''}>
              <td>{l.id}<br /><small>{l.supplier}</small></td><td>{l.heat}</td><td>{l.cert}</td><td className={l.tag !== l.cert ? 'warn' : ''}>{l.tag}</td><td>{l.dia}</td><td className={l.look !== '正常' ? 'warn' : ''}>{l.look}</td>
              <td><select value={sel[l.id] || ''} disabled={checked} onChange={(e) => setSel({ ...sel, [l.id]: e.target.value })}><option value="">— 選擇 —</option>{LOT_OPTS.map((o) => <option key={o.id} value={o.id}>{o.n}</option>)}</select>{checked && <div className="small">{l.why}</div>}</td>
            </tr>
          ))}</tbody>
        </table></div>
        <Hint>「三方一致」：材質證明（Mill Certificate）、實物標籤、訂單需求都要對得上；外觀異常要隔離判定。</Hint>
        {!checked && <div className="row end"><Btn kind="primary" disabled={Object.keys(sel).length < 4} onClick={() => setChecked(true)}>提交處置</Btn></div>}
      </Card>
      {checked && (
        <Card title={`缺料處理：符合本訂單的只有 ${LOTS.filter((l) => sel[l.id] === 'accept' && l.ok === 'accept').length} 捲，還差 1 捲`}>
          <div className="opts">{fillOpts.map((o) => <button key={o.id} className={`opt ${fill === o.id ? 'on' : ''}`} onClick={() => setFill(o.id)}>{o.n}</button>)}</div>
          <div className="row end"><Btn kind="primary" disabled={!fill} onClick={() => {
            const f = fillOpts.find((x) => x.id === fill)!;
            onDone({ score: Math.round(correct * 18.75 + f.s), summary: [`批號處置正確 ${correct}/4`, `缺料處置：${f.n}`, '可追溯性鏈：成品批號 → 熱處理爐次 → 冷鍛工單 → 盤元批號 → 爐號'], effect: f.e });
          }}>完成</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 製程參數與安全窗口（冷鍛／熱處理） ============
interface Slider { id: string; label: string; min: number; max: number; step: number; def: number; safe: [number, number]; unit: string; tip: string; }
const PARAM_MODELS: Record<string, { title: string; sliders: Slider[]; choice?: { id: string; label: string; opts: string[] }; model: (v: Record<string, number>) => { cost: number; metrics: { l: string; v: string; good?: boolean }[]; out: number; yieldP: number }; effect: (v: Record<string, number>) => Effect; }> = {
  forge: {
    title: '冷鍛參數設定（教學簡化模型，非實際機台參數）',
    sliders: [
      { id: 'speed', label: '生產速度（額定 %）', min: 70, max: 100, step: 1, def: 96, safe: [70, 92], unit: '%', tip: '速度越快產量越高，但模具磨耗與裂紋上升；超過 92% 屬於超出安全工作窗口。' },
      { id: 'maint', label: '模具保養週期（萬顆）', min: 2, max: 20, step: 1, def: 16, safe: [2, 20], unit: '萬顆', tip: '保養太勤增加停機；太久則磨耗導致頭部裂紋。' },
    ],
    choice: { id: 'seq', label: '換模排序', opts: ['依交期順序（換模 9 次／週）', '依產品族群分組（換模 5 次／週）'] },
    model: (v) => {
      const sp = v.speed / 100;
      const life = 13 - (sp - 0.8) * 25; // 萬顆
      const wear = Math.max(0, v.maint / life - 0.75);
      const yieldP = clamp(0.992 - wear * 0.05 - Math.max(0, sp - 0.92) * 0.15, 0.8, 0.995);
      const setups = v.seq === 1 ? 5 : 9;
      const maintStops = 60 / v.maint; // 每週約 60 萬顆
      const downH = setups * 1.1 + maintStops * 0.6 + (wear > 0.2 ? 3 : 0);
      const runH = 80 - downH;
      const out = runH * 1000 * sp * yieldP;
      const cost = (80 * 3200 + maintStops * 9000 + out * 0.16 + (1 - yieldP) * out * 4) / Math.max(out, 1);
      return { cost, out, yieldP, metrics: [
        { l: '模具預估壽命', v: `${life.toFixed(1)} 萬顆` }, { l: '每週停機（換模＋保養）', v: `${downH.toFixed(1)} h`, good: downH < 12 },
        { l: '冷鍛良率', v: fmt.pct(yieldP), good: yieldP > 0.985 }, { l: '週產出（良品）', v: fmt.n(out) }, { l: '單位良品成本', v: `NT$${cost.toFixed(3)}` },
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
      const hardOK = clamp(Math.exp(-Math.pow(v.temp / 5, 2)) * unif, 0, 1);
      const coatOK = clamp(1 - Math.pow(Math.max(0, Math.abs(v.coat - 10) - 1.5) / 5, 2), 0, 1);
      const yieldP = clamp(0.995 * (0.9 + 0.1 * hardOK) * (0.94 + 0.06 * coatOK), 0.8, 0.995);
      const eff = (v.load / 100) * (1 - Math.max(0, 4 - v.wait) * 0.04);
      const wipH = v.wait * 0.8;
      const kwhPer = 0.32 / Math.max(0.5, v.load / 100);
      const out = 80 * 1200 * eff * yieldP;
      const cost = (out * kwhPer * 3.6 + 80 * 2600 + (1 - yieldP) * out * 6 + wipH * 2500) / Math.max(out, 1);
      return { cost, out, yieldP, metrics: [
        { l: '硬度落在規格內機率', v: fmt.pct(hardOK), good: hardOK > 0.9 }, { l: '膜厚／摩擦係數穩定度', v: fmt.pct(coatOK), good: coatOK > 0.9 },
        { l: '批次效率', v: fmt.pct(eff) }, { l: '單位能耗', v: `${kwhPer.toFixed(3)} kWh` }, { l: '等待造成 WIP 時數', v: `${wipH.toFixed(1)} h`, good: wipH < 6 }, { l: '單位良品成本', v: `NT$${cost.toFixed(3)}` },
      ] };
    },
    effect: (v) => ({ st: { heat: { P: v.load >= 80 && v.load <= 92 ? 0.03 : 0, Q: Math.abs(v.temp) <= 3 ? 0.003 : -0.004 }, surface: { Q: v.coat >= 8 && v.coat <= 12 ? 0.003 : -0.003 } } }),
  },
};
export function ParamGame({ cfg, onDone }: GP) {
  const M = PARAM_MODELS[cfg];
  const init: Record<string, number> = {}; M.sliders.forEach((s) => (init[s.id] = s.def)); if (M.choice) init[M.choice.id] = 0;
  const [v, setV] = useState(init);
  const [tries, setTries] = useState(0);
  const r = M.model(v);
  const unsafe = M.sliders.filter((s) => v[s.id] < s.safe[0] || v[s.id] > s.safe[1]);
  const best = useMemo(() => {
    let b = Infinity;
    const grid = (i: number, cur: Record<string, number>) => {
      if (i === M.sliders.length) {
        const chs = M.choice ? [0, 1] : [0];
        for (const c of chs) { const vv = { ...cur }; if (M.choice) vv[M.choice.id] = c; b = Math.min(b, M.model(vv).cost); }
        return;
      }
      const s = M.sliders[i];
      for (let x = s.safe[0]; x <= s.safe[1]; x += s.step) grid(i + 1, { ...cur, [s.id]: x });
    };
    grid(0, {});
    return b;
  }, [cfg]);
  const eff = clamp(best / r.cost, 0, 1);
  const score = Math.round(clamp((eff - 0.7) / 0.3, 0, 1) * 85 + (unsafe.length ? 0 : 15) - unsafe.length * 15);
  return (
    <Card title={M.title} right={<SimTag />}>
      <div className="grid2">
        <div>
          {M.sliders.map((s) => {
            const out = v[s.id] < s.safe[0] || v[s.id] > s.safe[1];
            return (
              <div key={s.id} className="slider">
                <label>{s.label}<b className={out ? 'red' : ''}>{v[s.id]}{s.unit}</b></label>
                <div className="safe-track"><div className="safe-zone" style={{ left: `${((s.safe[0] - s.min) / (s.max - s.min)) * 100}%`, width: `${((s.safe[1] - s.safe[0]) / (s.max - s.min)) * 100}%` }} />
                  <input type="range" min={s.min} max={s.max} step={s.step} value={v[s.id]} onChange={(e) => setV({ ...v, [s.id]: +e.target.value })} aria-label={s.label} /></div>
                <div className="row sm"><Btn small onClick={() => setV({ ...v, [s.id]: Math.max(s.min, v[s.id] - s.step) })}>−</Btn><small className="muted">{s.tip}</small><Btn small onClick={() => setV({ ...v, [s.id]: Math.min(s.max, v[s.id] + s.step) })}>＋</Btn></div>
                {out && <div className="warnbox">⚠ 超出安全工作窗口（綠色區域 {s.safe[0]}～{s.safe[1]}{s.unit}）</div>}
              </div>
            );
          })}
          {M.choice && <div className="slider"><label>{M.choice.label}</label><div className="opts">{M.choice.opts.map((o, i) => <button key={i} className={`opt ${v[M.choice!.id] === i ? 'on' : ''}`} onClick={() => setV({ ...v, [M.choice!.id]: i })}>{o}</button>)}</div></div>}
        </div>
        <div>
          <div className="metric-list">{r.metrics.map((m) => <div key={m.l}><span>{m.l}</span><b className={m.good === true ? 'green' : m.good === false ? 'red' : ''}>{m.v}</b></div>)}</div>
          <Meter label="與最佳解的成本效率" right={fmt.pct(eff, 0)} v={eff} color="var(--green)" />
          <Hint>目標：在綠色安全窗口內，讓「單位良品成本」最低。產量最高不一定最好。</Hint>
          {tries > 0 && <p className="small muted">已試算 {tries} 次</p>}
          <div className="row end"><Btn onClick={() => setTries(tries + 1)}>試算一次</Btn><Btn kind="primary" onClick={() => onDone({
            score: clamp(score, 0, 100), summary: [`成本效率 ${fmt.pct(eff, 0)}（相對安全窗口內最佳解）`, unsafe.length ? `⚠ ${unsafe.length} 項參數超出安全窗口，已扣分` : '所有參數皆在安全窗口內', `良率 ${fmt.pct(r.yieldP)}`],
            effect: M.effect(v), extra: { unsafe: unsafe.length },
          })}>確認設定</Btn></div>
        </div>
      </div>
    </Card>
  );
}

// ============ 品質檢測挑戰（SVG 扣件） ============
type Defect = 'ok' | 'crack' | 'burr' | 'missing' | 'deform' | 'sleeve';
const DEF_N: Record<Defect, string> = { ok: '良品', crack: '頭部裂紋', burr: '毛邊', missing: '缺牙', deform: '牙型變形', sleeve: '套管脫落' };
export function FastenerSVG({ kind, defect, zoom, seed }: { kind: 'bolt' | 'nut' | 'css'; defect: Defect; zoom?: boolean; seed: number }) {
  const r = mulberry32(seed);
  const jitter = () => (r() - 0.5) * 2;
  if (kind === 'nut') {
    const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i + Math.PI / 6; return `${60 + 46 * Math.cos(a)},${60 + 46 * Math.sin(a)}`; }).join(' ');
    return (
      <svg viewBox="0 0 120 120" className={`fast ${zoom ? 'zoom' : ''}`}>
        <defs><radialGradient id={`ng${seed}`}><stop offset="0" stopColor="#d6dde8" /><stop offset="1" stopColor="#6c7a90" /></radialGradient></defs>
        <polygon points={pts} fill={`url(#ng${seed})`} stroke="#3b475c" strokeWidth="2" />
        <circle cx="60" cy="60" r="20" fill="#0b1426" />
        {Array.from({ length: 5 }, (_, i) => <circle key={i} cx="60" cy="60" r={14 + i * 1.4} fill="none" stroke="#7d8aa0" strokeWidth=".8" strokeDasharray={defect === 'missing' && i > 1 ? '20 12' : defect === 'deform' ? `${6 + i} 3` : undefined} />)}
        {defect === 'crack' && <path d={`M${60 + 22} 52 l8 ${4 + jitter()} l6 -3 l8 6`} stroke="#111" strokeWidth="2" fill="none" />}
        {defect === 'burr' && [0, 1, 2].map((i) => <path key={i} d={`M${18 + i * 4} ${48 + i * 9} l-7 ${2 + jitter()}`} stroke="#e8edf5" strokeWidth="2" />)}
      </svg>
    );
  }
  const threads = Array.from({ length: 13 }, (_, i) => i);
  return (
    <svg viewBox="0 0 120 120" className={`fast ${zoom ? 'zoom' : ''}`}>
      <defs><linearGradient id={`bg${seed}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5d6b80" /><stop offset=".45" stopColor="#e3e9f2" /><stop offset="1" stopColor="#4d5a6e" /></linearGradient></defs>
      <rect x="36" y="8" width="48" height="20" rx="3" fill={`url(#bg${seed})`} stroke="#3b475c" />
      <rect x="48" y="28" width="24" height="84" fill={`url(#bg${seed})`} stroke="#3b475c" />
      {threads.map((i) => {
        const y = 48 + i * 5;
        if (defect === 'missing' && i >= 5 && i <= 7) return null;
        const d = defect === 'deform' && i >= 4 && i <= 8 ? jitter() * 3 : 0;
        return <path key={i} d={`M46 ${y} L74 ${y + 3 + d}`} stroke="#3b475c" strokeWidth="1.6" />;
      })}
      {kind === 'css' && defect !== 'sleeve' && <rect x="44" y="30" width="32" height="14" rx="2" fill="#b98a3a" stroke="#6b4e1a" opacity=".92" />}
      {kind === 'css' && defect === 'sleeve' && <rect x="88" y="90" width="22" height="12" rx="2" fill="#b98a3a" stroke="#6b4e1a" transform="rotate(25 99 96)" />}
      {defect === 'crack' && <path d={`M${50 + jitter() * 4} 9 l4 7 l-3 4 l5 7`} stroke="#0b0b0b" strokeWidth="2" fill="none" />}
      {defect === 'burr' && [0, 1, 2].map((i) => <path key={i} d={`M84 ${11 + i * 5} l7 ${1 + jitter()}`} stroke="#eef3fa" strokeWidth="2.2" />)}
    </svg>
  );
}
const INSPECT_CFG: Record<string, { kinds: ('bolt' | 'nut' | 'css')[]; defects: Defect[]; n: number; title: string }> = {
  thread: { kinds: ['bolt', 'nut'], defects: ['ok', 'ok', 'ok', 'missing', 'deform', 'crack', 'burr'], n: 12, title: '放大檢驗台：螺栓與螺帽' },
  optical: { kinds: ['css', 'bolt'], defects: ['ok', 'ok', 'ok', 'sleeve', 'crack', 'burr', 'missing'], n: 12, title: '光學檢驗：套管螺絲與螺栓' },
  label: { kinds: ['bolt', 'css'], defects: ['ok', 'ok', 'crack', 'burr', 'missing', 'sleeve'], n: 8, title: 'AI 資料標註' },
};
export function makeItems(cfg: string, seed: number) {
  const c = INSPECT_CFG[cfg]; const r = mulberry32(seed);
  return Array.from({ length: c.n }, (_, i) => {
    const kind = c.kinds[Math.floor(r() * c.kinds.length)];
    let defect = c.defects[Math.floor(r() * c.defects.length)];
    if (defect === 'sleeve' && kind !== 'css') defect = 'missing';
    if (kind === 'nut' && defect === 'deform') defect = 'missing';
    return { i, kind, defect, seed: seed * 31 + i };
  });
}
export function InspectGame({ cfg, onDone }: GP) {
  const { g } = useG();
  const C = INSPECT_CFG[cfg];
  const items = useMemo(() => makeItems(cfg, g.seed + (cfg === 'thread' ? 3 : 5)), [cfg]);
  const [phase, setPhase] = useState(cfg === 'thread' ? 0 : 1);
  const [quiz, setQuiz] = useState<number[]>([]);
  const [idx, setIdx] = useState(0);
  const [labels, setLabels] = useState<Defect[]>([]);
  const [zoom, setZoom] = useState(false);
  const [th, setTh] = useState(0.5);
  const cats: Defect[] = Array.from(new Set(['ok', ...C.defects])) as Defect[];
  const rA = mulberry32(g.seed + 99);
  const ai = useMemo(() => items.map((it) => (rA() < (it.defect === 'ok' ? 0.94 : 0.86) ? it.defect : it.defect === 'ok' ? 'burr' : 'ok')), [items]);
  const human = labels.filter((l, i) => l === items[i].defect).length;
  const aiCorrect = ai.filter((l, i) => l === items[i].defect).length;
  const missH = labels.filter((l, i) => l === 'ok' && items[i].defect !== 'ok').length;
  // 光學門檻模型：門檻 t 越低越嚴格
  const det = clamp(0.995 - Math.pow(th, 2.2) * 0.25, 0.5, 0.995);
  const fr = clamp(0.06 * Math.exp(-th * 4.2) + 0.002, 0.002, 0.2);
  const weekCost = (1 - det) * 300 * 600 + fr * 55000 * 0.6 + 5000; // 漏檢客訴成本＋誤判複判
  const bestCost = useMemo(() => { let b = Infinity; for (let t = 0.1; t <= 0.9; t += 0.01) { const d = clamp(0.995 - Math.pow(t, 2.2) * 0.25, 0.5, 0.995), f = clamp(0.06 * Math.exp(-t * 4.2) + 0.002, 0.002, 0.2); b = Math.min(b, (1 - d) * 300 * 600 + f * 55000 * 0.6 + 5000); } return b; }, []);
  const Q3 = [{ q: '螺栓的外螺紋通常以哪種方式成形？', o: ['攻牙（Tapping）', '搓牙（Thread Rolling）', '銑削'], a: 1 }, { q: '螺帽的內螺紋通常以哪種方式加工？', o: ['攻牙（Tapping）', '搓牙（Thread Rolling）', '熱鍛'], a: 0 }];
  const finish = () => {
    const acc = human / items.length;
    let score = Math.round(acc * 70 + (missH === 0 ? 10 : 0));
    const summary = [`人工判定正確 ${human}/${items.length}（漏檢 ${missH}）`, `AI 模擬判定正確 ${aiCorrect}/${items.length}（教學模擬，非真實模型）`];
    let effect: Effect = {};
    if (cfg === 'thread') { const q = quiz.filter((v, i) => v === Q3[i].a).length; score += q * 10; summary.unshift(`搓牙／攻牙辨識 ${q}/2`); effect = { st: { thread: { Q: acc > 0.8 ? 0.003 : 0 } } }; }
    else { const eff = bestCost / weekCost; score = Math.round(acc * 55 + clamp((eff - 0.6) / 0.4, 0, 1) * 35 + (missH === 0 ? 10 : 0)); summary.push(`光學門檻 ${th.toFixed(2)}：檢出率 ${fmt.pct(det)}、誤判率 ${fmt.pct(fr)}、週檢驗相關成本 ${fmt.nt(weekCost)}`); effect = { f: { detect: det - 0.92, falseReject: fr - 0.02 } }; }
    onDone({ score: clamp(score, 0, 100), summary, effect });
  };
  return (
    <div>
      {phase === 0 && (
        <Card title="先確認觀念：外螺紋 vs 內螺紋">
          {Q3.map((q, i) => <div key={i} className="quiz"><p>{q.q}</p><div className="opts">{q.o.map((o, j) => <button key={j} className={`opt ${quiz[i] === j ? (j === q.a ? 'right' : 'wrong') : ''}`} disabled={quiz[i] !== undefined} onClick={() => { const a = [...quiz]; a[i] = j; setQuiz(a); }}>{o}</button>)}</div></div>)}
          <div className="row end"><Btn kind="primary" disabled={quiz.length < 2 || quiz.includes(undefined as any)} onClick={() => setPhase(1)}>開始檢驗</Btn></div>
        </Card>
      )}
      {phase === 1 && (
        <Card title={`${C.title}（${Math.min(idx + 1, items.length)}/${items.length}）`} right={<Btn small onClick={() => setZoom(!zoom)}>{zoom ? '🔍 縮小' : '🔍 放大'}</Btn>}>
          <div className="inspect">
            <div className="lens" onClick={() => setZoom(!zoom)}><FastenerSVG kind={items[idx].kind} defect={items[idx].defect} zoom={zoom} seed={items[idx].seed} /><span className="lens-tag">{items[idx].kind === 'nut' ? '螺帽（俯視）' : items[idx].kind === 'css' ? '套管螺絲' : '六角螺栓'}</span></div>
            <div className="opts col">{cats.map((c) => <button key={c} className="opt" onClick={() => { const l = [...labels]; l[idx] = c; setLabels(l); setZoom(false); if (idx < items.length - 1) setIdx(idx + 1); else setPhase(2); }}>{DEF_N[c]}</button>)}</div>
          </div>
          <Hint>點擊影像可放大。注意頭部邊緣、螺紋連續性{cfg === 'optical' ? '、套管是否在位' : ''}。</Hint>
          {idx > 0 && <Btn small onClick={() => setIdx(idx - 1)}>← 上一顆</Btn>}
        </Card>
      )}
      {phase === 2 && (
        <Card title="判定結果：你 vs AI 模擬（教學模擬）">
          <div className="thumbs">{items.map((it, i) => (
            <div key={i} className={`thumb ${labels[i] === it.defect ? 'ok' : 'ng'}`}>
              <FastenerSVG kind={it.kind} defect={it.defect} seed={it.seed} />
              <small>答案：{DEF_N[it.defect]}<br />你：{DEF_N[labels[i]]}<br />AI：{DEF_N[ai[i] as Defect]}</small>
            </div>
          ))}</div>
          <p>你正確 <b>{human}</b>／AI 模擬正確 <b>{aiCorrect}</b>。{missH > 0 ? `你有 ${missH} 顆漏檢（把不良判為良品）——漏檢會直接流到客戶。` : '沒有漏檢，很好！'}</p>
          <div className="row end">{cfg === 'optical' ? <Btn kind="primary" onClick={() => setPhase(3)}>下一步：設定光學門檻</Btn> : <Btn kind="primary" onClick={finish}>完成</Btn>}</div>
        </Card>
      )}
      {phase === 3 && (
        <Card title="光學篩選門檻：檢出率 vs 誤判率" right={<SimTag />}>
          <div className="slider"><label>判定門檻（越低越嚴格）<b>{th.toFixed(2)}</b></label><input type="range" min={0.1} max={0.9} step={0.01} value={th} onChange={(e) => setTh(+e.target.value)} aria-label="門檻" />
            <div className="row sm"><Btn small onClick={() => setTh(Math.max(0.1, +(th - 0.02).toFixed(2)))}>−</Btn><Btn small onClick={() => setTh(Math.min(0.9, +(th + 0.02).toFixed(2)))}>＋</Btn></div></div>
          <div className="grid3">
            <div className="kpi"><div className="kpi-l">檢出率</div><div className="kpi-v">{fmt.pct(det)}</div></div>
            <div className="kpi"><div className="kpi-l">誤判率</div><div className="kpi-v">{fmt.pct(fr)}</div></div>
            <div className="kpi"><div className="kpi-l">週檢驗相關成本</div><div className="kpi-v">{fmt.nt(weekCost)}</div><div className="kpi-s">漏檢客訴＋人工複判</div></div>
          </div>
          <Hint>每漏一顆不良到客戶端，模擬成本遠高於人工複判一顆誤判品。找出總成本最低的門檻。</Hint>
          <div className="row end"><Btn kind="primary" onClick={finish}>套用門檻</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 第六章：班別人力配置 ============
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
export function CrewGame({ onDone }: GP) {
  const [asg, setAsg] = useState<Record<string, string>>({});
  const [pick, setPick] = useState<string | null>(null);
  const [lead, setLead] = useState(false);
  const staffed = (sid: string) => Object.values(asg).filter((s) => s === sid).length + (lead && sid === 'thread' ? 1 : 0);
  const issues: string[] = [];
  const cap = STN.map((s) => {
    const n = staffed(s.id);
    let fac = n >= s.need ? 1 : n >= s.min ? (s.partial ?? (n / s.need)) : 0;
    const ops = OPS.filter((o) => asg[o.id] === s.id);
    const unc = ops.filter((o) => !o.c.includes(s.id));
    const tired = ops.filter((o) => o.f > 70);
    if (unc.length) { fac *= 0.8; issues.push(`${s.n}：${unc.map((o) => o.n).join('、')} 未取得該站認證${s.risk ? '（高風險設備，違反規定）' : ''}`); }
    if (tired.length && s.risk) issues.push(`${s.n}：${tired.map((o) => o.n).join('、')} 疲勞度過高，不應排在高風險站`);
    return { ...s, cnt: n, fac, eff: s.rate * fac * (s.id === 'assembly' ? 5 : 1) };
  });
  const line = Math.min(...cap.map((c) => c.eff));
  const maxLine = 850;
  const bott = cap.reduce((m, c) => (c.eff < m.eff ? c : m), cap[0]);
  const hazardViol = issues.filter((x) => x.includes('違反') || x.includes('高風險站')).length;
  const tap = (opId: string) => { setPick(pick === opId ? null : opId); };
  const tapStation = (sid: string) => { if (!pick) return; setAsg({ ...asg, [pick]: sid }); setPick(null); };
  const score = Math.round(clamp(line / maxLine, 0, 1) * 70 + (hazardViol ? 0 : 20) + (lead ? 5 : 10) - hazardViol * 10);
  return (
    <Card title="夜班人力配置（12 人到班，需求 14 人）" right={<SimTag />}>
      <Hint>先點作業員，再點工作站指派。可用 ↩ 取消。瓶頸站（搓牙）要優先補足；疲勞者不排高風險站。</Hint>
      <div className="crew">
        <div className="ops">{OPS.map((o) => (
          <button key={o.id} className={`op ${pick === o.id ? 'on' : ''} ${asg[o.id] ? 'used' : ''}`} onClick={() => tap(o.id)}>
            <b>{o.n}</b><small>認證：{o.c.map((c) => STN.find((s) => s.id === c)!.n).join('、')}</small>
            <Meter v={o.f} max={100} color={o.f > 70 ? 'var(--red)' : 'var(--green)'} right={`疲勞 ${o.f}`} />
            {asg[o.id] && <span className="op-at">→ {STN.find((s) => s.id === asg[o.id])!.n} <a onClick={(e) => { e.stopPropagation(); const a = { ...asg }; delete a[o.id]; setAsg(a); }}>↩</a></span>}
          </button>
        ))}</div>
        <div className="stns">{cap.map((s) => (
          <div key={s.id} className={`stn ${pick ? 'target' : ''} ${s.id === bott.id ? 'bott' : ''}`} onClick={() => tapStation(s.id)} role="button">
            <b>{s.n}</b>{s.risk && <Tag color="var(--orange)">高風險</Tag>}
            <div>{s.cnt}／{s.need} 人 <small>(最少 {s.min})</small></div>
            <Meter v={s.eff} max={1200} right={`${fmt.n(s.eff)} 顆/h`} color={s.id === bott.id ? 'var(--red)' : 'var(--cyan)'} />
          </div>
        ))}</div>
      </div>
      <label className="check"><input type="checkbox" checked={lead} onChange={(e) => setLead(e.target.checked)} /> 領班（你）親自支援搓牙站 1 人（但今晚無法進行改善與巡檢）</label>
      {issues.length > 0 && <ul className="list">{issues.map((i) => <li key={i} className="bad">{i}</li>)}</ul>}
      <div className="row between"><div>產線產出（瓶頸決定）：<b>{fmt.n(line)} 顆/h</b>／瓶頸：<b className="red">{bott.n}</b></div>
        <Btn kind="primary" disabled={Object.keys(asg).length < 8} onClick={() => onDone({ score: clamp(score, 0, 100), summary: [`產線產出 ${fmt.n(line)} 顆/h（理想 ${maxLine}）`, `瓶頸站：${bott.n}`, hazardViol ? `⚠ 安全／人因違規 ${hazardViol} 項` : '無安全與人因違規'], effect: { st: { thread: { A: line >= 800 ? 0.01 : 0 } }, f: { training: 3 } }, extra: { leader: hazardViol === 0 } })}>確認排班</Btn></div>
    </Card>
  );
}
