import React, { useMemo, useState } from 'react';
import { Btn, Card, Hint, Steps, useG, Bars, Lines, Meter, Tag, SimTag, NpcFace } from '../ui/common';
import { clamp, fmt, Effect, mulberry32 } from '../sim';
import { FastenerSVG, makeItems } from './floor';
import type { GP, GameResult } from './floor';
import { applyEff, gainSkills } from '../state';

const AITag = () => <span className="simtag ai">教學模擬：未執行真實模型訓練</span>;
// 常態分布 CDF
function Phi(x: number) { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; }
function confusion(dp: number, th: number, n = 1000, prev = 0.1) {
  const pos = n * prev, neg = n - pos;
  const TP = pos * (1 - Phi(th - dp)), FN = pos - TP, FP = neg * (1 - Phi(th)), TN = neg - FP;
  const precision = TP / Math.max(1e-6, TP + FP), recall = TP / pos;
  return { TP, FN, FP, TN, precision, recall };
}
function Choice(p: { opts: { id: string; t: string; d?: string }[]; v: any; set: (v: any) => void; col?: boolean }) {
  return <div className={`opts ${p.col ? 'col' : ''}`}>{p.opts.map((o) => <button key={o.id} className={`opt ${p.v === o.id ? 'on' : ''}`} onClick={() => p.set(o.id)}><b>{o.t}</b>{o.d && <small><br />{o.d}</small>}</button>)}</div>;
}
function Confusion({ c }: { c: ReturnType<typeof confusion> }) {
  return (
    <div className="cm">
      <div /><div className="cm-h">預測：不良</div><div className="cm-h">預測：良品</div>
      <div className="cm-h">實際：不良</div><div className="cm-c tp">TP {c.TP.toFixed(0)}</div><div className="cm-c fn">FN（漏檢）{c.FN.toFixed(0)}</div>
      <div className="cm-h">實際：良品</div><div className="cm-c fp">FP（誤判）{c.FP.toFixed(0)}</div><div className="cm-c tn">TN {c.TN.toFixed(0)}</div>
    </div>
  );
}

// ---------- 專案 A：FastenerVision AI ----------
function ProjectA({ onDone }: { onDone: (r: GameResult) => void }) {
  const { g } = useG();
  const [s, setS] = useState(0);
  const [data, setData] = useState<'line' | 'web' | 'mix' | null>(null);
  const [policy, setPolicy] = useState<'dual' | 'single' | 'out' | null>(null);
  const items = useMemo(() => makeItems('label', g.seed + 77), []);
  const [lab, setLab] = useState<string[]>([]);
  const [split, setSplit] = useState<'lot' | 'rand' | 'leak' | null>(null);
  const [model, setModel] = useState<'rule' | 'cnn' | 'cloud' | null>(null);
  const [th, setTh] = useState(1.5);
  const [dep, setDep] = useState<'shadow' | 'human' | 'replace' | null>(null);
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
    const e: Effect = { f: { detect: clamp(gain, -0.05, 0.05), falseReject: dep === 'replace' ? 0 : -0.004, opexExtra: 8000 } };
    onDone({ score: clamp(Math.round(score), 0, 100), summary: [`產線實際：精確率 ${fmt.pct(prodC.precision)}、召回率 ${fmt.pct(prodC.recall)}`, `測試集顯示：精確率 ${fmt.pct(testC.precision)}、召回率 ${fmt.pct(testC.recall)}${split === 'leak' ? '（資料洩漏造成虛高！）' : ''}`, `部署方式：${{ shadow: '影子模式並行', human: 'AI＋人工複判', replace: '直接取代人工' }[dep!]}`], effect: e });
  };
  return (
    <div>
      <Steps steps={steps} cur={s} />
      {s === 0 && <Card title="選擇資料來源" right={<AITag />}><Choice col v={data} set={setData} opts={[{ id: 'line', t: '產線實拍 1,200 張（含先前收集的誤判影像）', d: '與實際光源、角度一致' }, { id: 'web', t: '網路公開螺絲圖片 8,000 張', d: '數量多，但光源、產品與瑕疵型態不同' }, { id: 'mix', t: '產線實拍 3,000 張＋少量合成瑕疵影像', d: '需多投入 2 週收集' }]} />
        <div className="row end"><Btn kind="primary" disabled={!data} onClick={() => setS(1)}>下一步</Btn></div></Card>}
      {s === 1 && <Card title="資料標註：先親自標 8 張，再決定標註政策" right={<AITag />}>
        <div className="thumbs">{items.map((it, i) => <div key={i} className={`thumb ${lab[i] ? 'done' : ''}`}><FastenerSVG kind={it.kind} defect={it.defect} seed={it.seed} /><div className="row sm">{['ok', 'ng'].map((x) => <button key={x} className={`opt sm ${lab[i] === x ? 'on' : ''}`} onClick={() => { const l = [...lab]; l[i] = x; setLab(l); }}>{x === 'ok' ? '良品' : '不良'}</button>)}</div></div>)}</div>
        <p className="small">標註一致性決定模型上限。</p>
        <Choice v={policy} set={setPolicy} opts={[{ id: 'dual', t: '雙人標註＋分歧仲裁', d: '較慢，品質高' }, { id: 'single', t: '單人快速標註' }, { id: 'out', t: '外包，無標註規範' }]} />
        <div className="row end"><Btn kind="primary" disabled={lab.filter(Boolean).length < 8 || !policy} onClick={() => setS(2)}>下一步（你的標註正確率 {fmt.pct(labAcc, 0)}）</Btn></div></Card>}
      {s === 2 && <Card title="訓練／驗證資料分割" right={<AITag />}><Choice col v={split} set={setSplit} opts={[{ id: 'lot', t: '依生產批號分割（同一批只會出現在一邊）' }, { id: 'rand', t: '逐張隨機分割' }, { id: 'leak', t: '先用全部資料訓練，再抽一部分當測試' }]} />
        <Hint>同一批產品影像極為相似；若同批同時出現在訓練與測試，分數會虛高——這就是資料洩漏（Data Leakage）。</Hint>
        <div className="row end"><Btn kind="primary" disabled={!split} onClick={() => setS(3)}>下一步</Btn></div></Card>}
      {s === 3 && <Card title="模型比較" right={<AITag />}><Choice col v={model} set={setModel} opts={[{ id: 'rule', t: '規則式影像處理（邊緣＋面積門檻）', d: '可解釋、速度快，對複雜瑕疵較弱' }, { id: 'cnn', t: '輕量卷積神經網路（地端部署，模擬）', d: '單張約 25 ms，可在產線邊緣電腦運行' }, { id: 'cloud', t: '雲端大型視覺模型 API', d: '準確度略高，但影像需上傳外部、依賴網路與付費 API' }]} />
        {model === 'cloud' && <div className="warnbox">產線影像屬於製程資料，上傳外部服務有資料治理與斷網停線風險；本專案要求地端運作。</div>}
        <div className="row end"><Btn kind="primary" disabled={!model} onClick={() => setS(4)}>下一步</Btn></div></Card>}
      {s === 4 && <Card title="信心門檻與混淆矩陣（測試集 1,000 張，不良率 10%）" right={<AITag />}>
        <div className="slider"><label>判為不良的分數門檻<b>{th.toFixed(2)}</b></label><input type="range" min={0} max={3} step={0.05} value={th} onChange={(e) => setTh(+e.target.value)} aria-label="門檻" /></div>
        <div className="grid2"><div><Confusion c={testC} /></div><div className="metric-list">
          <div><span>精確率 Precision</span><b>{fmt.pct(testC.precision)}</b></div><div><span>召回率 Recall</span><b>{fmt.pct(testC.recall)}</b></div>
          <div><span>漏檢（FN）</span><b className="red">{testC.FN.toFixed(0)}</b></div><div><span>誤判（FP）</span><b>{testC.FP.toFixed(0)}</b></div></div></div>
        <Hint>門檻降低 → 召回率上升（漏檢少），但誤判增加。車用扣件通常更怕漏檢。</Hint>
        <div className="row end"><Btn kind="primary" onClick={() => setS(5)}>下一步</Btn></div></Card>}
      {s === 5 && <Card title="產線部署方式" right={<AITag />}><Choice col v={dep} set={setDep} opts={[{ id: 'shadow', t: '影子模式：AI 與現行光學並行 1 個月，比對後再切換' }, { id: 'human', t: 'AI 判定＋人工複判高風險與低信心品' }, { id: 'replace', t: '立即取代現行光學與人工複判' }]} />
        {dep && <div className="metric-list"><div><span>產線模擬：精確率</span><b>{fmt.pct(prodC.precision)}</b></div><div><span>產線模擬：召回率</span><b>{fmt.pct(prodC.recall)}</b></div><div><span>測試集 vs 產線落差</span><b className={testC.recall - prodC.recall > 0.05 ? 'red' : 'green'}>{fmt.pct(testC.recall - prodC.recall)}</b></div></div>}
        <div className="row end"><Btn kind="primary" disabled={!dep} onClick={finish}>完成專案</Btn></div></Card>}
    </div>
  );
}

// ---------- 專案 B：TorqueMind AI ----------
const FEATS = [{ id: 'hard', n: '熱處理後硬度', ok: 1 }, { id: 'depth', n: '軸向沖壓深度', ok: 1 }, { id: 'force', n: '沖壓壓力', ok: 1 }, { id: 'lot', n: '盤元批號', ok: 0.5 }, { id: 'after', n: '出貨前實測扭力值', ok: -2 }, { id: 'op', n: '作業員姓名', ok: -1 }];
function ProjectB({ onDone }: { onDone: (r: GameResult) => void }) {
  const [s, setS] = useState(0);
  const [feat, setFeat] = useState<string[]>([]);
  const [h, setH] = useState(30);
  const [d, setD] = useState(0.6);
  const [dep, setDep] = useState<string | null>(null);
  const fq = feat.reduce((a, f) => a + Math.max(0, FEATS.find((x) => x.id === f)!.ok), 0);
  const leak = feat.includes('after'), priv = feat.includes('op');
  const mean = 6 + 0.12 * h + 4.2 * d - 0.03 * Math.max(0, h - 34) * 10 * d;
  const extrap = Math.max(0, Math.abs(h - 30) - 5) * 0.12 + Math.max(0, Math.abs(d - 0.6) - 0.2) * 3;
  const half = (0.35 + (3.5 - Math.min(3.5, fq)) * 0.35 + extrap);
  const lo = mean - half, hi = mean + half;
  const inSpec = lo >= 8.8 && hi <= 11.2;
  const xs = Array.from({ length: 11 }, (_, i) => 0.2 + i * 0.08);
  return (
    <div>
      <Steps steps={['特徵選擇', '參數模擬與不確定性', '上線決策']} cur={s} />
      {s === 0 && <Card title="選擇模型輸入特徵" right={<AITag />}>
        <div className="chips">{FEATS.map((f) => <button key={f.id} className={`chip ${feat.includes(f.id) ? 'on' : ''}`} onClick={() => setFeat(feat.includes(f.id) ? feat.filter((x) => x !== f.id) : [...feat, f.id])}>{feat.includes(f.id) ? '✔ ' : ''}{f.n}</button>)}</div>
        {leak && <div className="warnbox">「出貨前實測扭力」是預測目標本身（或事後才知道的資訊）——用它當輸入就是資料洩漏。</div>}
        {priv && <div className="warnbox">作業員姓名與物理機制無關，且有個資與公平性疑慮；應以製程條件為特徵。</div>}
        <Hint>對照公開專利 TWI753649B 的重點：熱處理後硬度與軸向沖壓條件的配合。</Hint>
        <div className="row end"><Btn kind="primary" disabled={!feat.length} onClick={() => setS(1)}>下一步</Btn></div></Card>}
      {s === 1 && <Card title="What-if：預測扭力區間（虛構指數與單位）" right={<AITag />}>
        <div className="grid2"><div>
          <div className="slider"><label>熱處理後硬度（虛構指數）<b>{h}</b></label><input type="range" min={20} max={42} step={1} value={h} onChange={(e) => setH(+e.target.value)} aria-label="硬度" /></div>
          <div className="slider"><label>沖壓深度（虛構指數）<b>{d.toFixed(2)}</b></label><input type="range" min={0.2} max={1} step={0.02} value={d} onChange={(e) => setD(+e.target.value)} aria-label="沖壓深度" /></div>
          <div className="metric-list"><div><span>預測中心值</span><b>{mean.toFixed(2)}</b></div><div><span>90% 預測區間</span><b className={inSpec ? 'green' : 'red'}>{lo.toFixed(2)} ～ {hi.toFixed(2)}</b></div><div><span>外插程度</span><b className={extrap > 0.3 ? 'red' : ''}>{extrap > 0.3 ? '超出訓練資料範圍' : '在資料範圍內'}</b></div></div>
        </div><div>
          <Lines labels={xs.map((x) => x.toFixed(2))} series={[{ name: '中心', color: '#39d5ff', values: xs.map((x) => 6 + 0.12 * h + 4.2 * x - 0.03 * Math.max(0, h - 34) * 10 * x) }]} bands={[{ from: 8.8, to: 11.2, color: 'rgba(124,242,156,.12)' }]} hlines={[{ v: 8.8, label: 'LSL', color: '#ff5d73' }, { v: 11.2, label: 'USL', color: '#ff5d73' }]} min={6} max={14} h={200} />
          <p className="small muted center">X 軸：沖壓深度；綠帶：規格範圍</p>
        </div></div>
        <Hint>預測區間要整個落在規格內才算低風險。訓練資料以外的組合，不確定性會擴大。</Hint>
        <div className="row end"><Btn kind="primary" onClick={() => setS(2)}>下一步</Btn></div></Card>}
      {s === 2 && <Card title="模型建議如何上線？" right={<AITag />}>
        <Choice col v={dep as any} set={setDep as any} opts={[{ id: 'write', t: '直接把模型建議寫入沖壓機參數' }, { id: 'doe', t: '作為工程師參考：小批 DOE 試產驗證、工程變更核准後才調整' }, { id: 'none', t: '不使用模型，維持現狀' }]} />
        {dep === 'write' && <div className="warnbox">遊戲模型不得直接當成安全的實際機台設定；任何參數變更都需驗證與核准。</div>}
        <div className="row end"><Btn kind="primary" disabled={!dep} onClick={() => {
          const score = Math.min(3.5, fq) / 3.5 * 35 + (leak ? 0 : 15) + (priv ? 0 : 5) + (inSpec ? 20 : 5) + (extrap <= 0.3 ? 5 : 0) + (dep === 'doe' ? 20 : dep === 'none' ? 5 : 0);
          onDone({ score: clamp(Math.round(score), 0, 100), summary: [`特徵品質 ${Math.min(3.5, fq).toFixed(1)}/3.5${leak ? '（含洩漏特徵）' : ''}`, `模擬設定預測區間 ${lo.toFixed(2)}～${hi.toFixed(2)}：${inSpec ? '落在規格內' : '超出規格'}`, `上線方式：${{ write: '直接寫入（不安全）', doe: 'DOE 驗證後核准', none: '不使用' }[dep!]}`],
            effect: { st: { secondary: { Q: dep === 'doe' && inSpec ? 0.005 : 0 } }, f: { latent: dep === 'doe' ? -0.0004 : dep === 'write' ? 0.0008 : 0 } } });
        }}>完成專案</Btn></div></Card>}
    </div>
  );
}

// ---------- 專案 C：預測性維護 ----------
function ProjectC({ onDone }: { onDone: (r: GameResult) => void }) {
  const [gap, setGap] = useState<string | null>(null);
  const [w, setW] = useState(7);
  const vib = [2.1, 2.2, 2.1, 2.3, 2.4, 2.4, 2.6, 2.8, 3.0, 3.3, 3.5, 3.9];
  const temp = [41, 41, 42, 42, 43, 43, 45, 46, 48, 49, 52, 54];
  const pf = (x: number) => 1 - Math.exp(-Math.pow(x / 5.5, 3));
  const cost = (x: number) => 80000 + 4 * 20000 + pf(x) * 600000 + (8 - x) * 6000;
  const best = [1, 2, 3, 4, 5, 6, 7, 8].reduce((b, x) => (cost(x) < cost(b) ? x : b), 1);
  return (
    <Card title="冷鍛機主軸：預測性維護（Predictive Maintenance AI）" right={<AITag />}>
      <div className="grid2"><div><p>過去 12 週震動 RMS（mm/s，模擬）</p><Lines labels={vib.map((_, i) => `W${i + 1}`)} series={[{ name: '震動', color: '#ff9a3c', values: vib }]} hlines={[{ v: 4.5, label: '警戒', color: '#ff5d73' }]} h={160} /></div>
        <div><p>軸承溫度（°C，模擬）</p><Lines labels={temp.map((_, i) => `W${i + 1}`)} series={[{ name: '溫度', color: '#39d5ff', values: temp }]} h={160} /></div></div>
      <h4>1. 感測器有 3 天資料中斷，怎麼處理？</h4>
      <Choice v={gap as any} set={setGap as any} opts={[{ id: 'flag', t: '標記缺漏、短缺口插補並建立斷線告警' }, { id: 'zero', t: '缺漏補 0' }, { id: 'drop', t: '整段刪除不管' }]} />
      <h4>2. 安排幾週後停機保養？</h4>
      <div className="slider"><label>保養時點<b>第 {w} 週後</b></label><input type="range" min={1} max={8} step={1} value={w} onChange={(e) => setW(+e.target.value)} aria-label="保養週" /></div>
      <Bars data={[1, 2, 3, 4, 5, 6, 7, 8].map((x) => ({ label: `${x}週`, v: cost(x) / 1e4, color: x === w ? '#ffd23f' : '#39d5ff' }))} fmtv={(v) => v.toFixed(0)} h={160} />
      <div className="metric-list"><div><span>保養前故障機率</span><b className={pf(w) > 0.4 ? 'red' : ''}>{fmt.pct(pf(w))}</b></div><div><span>期望總成本（保養＋停機＋故障風險）</span><b>{fmt.nt(cost(w))}</b></div></div>
      <Hint>太早保養浪費零件壽命與產能；太晚則故障風險（含模具損壞、交期延誤）急遽上升。單位：萬元。</Hint>
      <div className="row end"><Btn kind="primary" disabled={!gap} onClick={() => {
        const score = clamp(100 - Math.abs(w - best) * 18, 0, 70) + (gap === 'flag' ? 30 : gap === 'drop' ? 8 : 0);
        onDone({ score: clamp(Math.round(score), 0, 100), summary: [`保養時點第 ${w} 週（最佳約第 ${best} 週）`, `期望成本 ${fmt.nt(cost(w))}`, `資料缺漏處理：${{ flag: '標記＋插補＋告警 ✔', zero: '補 0（會誤導模型）', drop: '刪除（遺失資訊）' }[gap!]}`],
          effect: { st: { forge: { A: Math.abs(w - best) <= 1 ? 0.02 : 0.005 }, thread: { A: 0.005 } }, f: { opexExtra: 5000 } } });
      }}>完成專案</Btn></div>
    </Card>
  );
}

// ---------- 專案 D：Fastener Engineering Copilot ----------
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
function ProjectD({ onDone }: { onDone: (r: GameResult) => void }) {
  const [s, setS] = useState(0);
  const [st, setSt] = useState<string[]>([]);
  const [ocr, setOcr] = useState({ human: false, schema: false, conf: 0.5 });
  const [rag, setRag] = useState({ cite: false, chunk: false, version: false });
  const [perm, setPerm] = useState<string | null>(null);
  const [tests, setTests] = useState<number[]>([]);
  const [chat, setChat] = useState<number[]>([]);
  const [deploy, setDeploy] = useState<string | null>(null);
  const steps = ['需求', '文件抽取（OCR/VLM）與 ETL', 'RAG 檢索', '權限設計', '功能測試', '試用與部署'];
  return (
    <div>
      <Steps steps={steps} cur={s} />
      {s === 0 && <Card title="選擇第一版要做的 3 個需求" right={<AITag />}>
        <div className="chips">{STORIES.map((x) => <button key={x.id} className={`chip ${st.includes(x.id) ? 'on' : ''}`} onClick={() => setSt(st.includes(x.id) ? st.filter((y) => y !== x.id) : st.length < 3 ? [...st, x.id] : st)}>{st.includes(x.id) ? '✔ ' : ''}{x.t}</button>)}</div>
        <Hint>AI 不可任意修改生產參數、品質放行結果或採購紀錄。</Hint>
        <div className="row end"><Btn kind="primary" disabled={st.length < 3} onClick={() => setS(1)}>下一步</Btn></div></Card>}
      {s === 1 && <Card title="工程圖面辨識與資料抽取" right={<AITag />}>
        <label className="check"><input type="checkbox" checked={ocr.human} onChange={(e) => setOcr({ ...ocr, human: e.target.checked })} /> 低信心欄位強制人工確認</label>
        <label className="check"><input type="checkbox" checked={ocr.schema} onChange={(e) => setOcr({ ...ocr, schema: e.target.checked })} /> ETL 載入 SQL 前做欄位型別與範圍驗證</label>
        <div className="slider"><label>自動採用的信心度下限<b>{ocr.conf.toFixed(2)}</b></label><input type="range" min={0.3} max={0.99} step={0.01} value={ocr.conf} onChange={(e) => setOcr({ ...ocr, conf: +e.target.value })} aria-label="信心度" /></div>
        <div className="row end"><Btn kind="primary" onClick={() => setS(2)}>下一步</Btn></div></Card>}
      {s === 2 && <Card title="RAG：專利與 SOP 檢索" right={<AITag />}>
        <label className="check"><input type="checkbox" checked={rag.cite} onChange={(e) => setRag({ ...rag, cite: e.target.checked })} /> 每個回答必須附來源（文件、版本、章節）</label>
        <label className="check"><input type="checkbox" checked={rag.chunk} onChange={(e) => setRag({ ...rag, chunk: e.target.checked })} /> 依章節切分文件（保留標題脈絡）</label>
        <label className="check"><input type="checkbox" checked={rag.version} onChange={(e) => setRag({ ...rag, version: e.target.checked })} /> 只檢索「現行有效版」SOP</label>
        <div className="row end"><Btn kind="primary" onClick={() => setS(3)}>下一步</Btn></div></Card>}
      {s === 3 && <Card title="權限設計" right={<AITag />}><Choice col v={perm as any} set={setPerm as any} opts={[{ id: 'ro', t: '唯讀查詢＋產生草稿；任何寫入需人工核准並留存稽核紀錄' }, { id: 'rw', t: '允許 Copilot 直接寫入 ERP／MES 以提升效率' }, { id: 'admin', t: '使用管理員帳號連線，方便開發' }]} />
        <div className="row end"><Btn kind="primary" disabled={!perm} onClick={() => setS(4)}>下一步</Btn></div></Card>}
      {s === 4 && <Card title="選擇要納入的測試案例" right={<AITag />}>{TESTS.map((t, i) => <label key={i} className="check"><input type="checkbox" checked={tests.includes(i)} onChange={(e) => setTests(e.target.checked ? [...tests, i] : tests.filter((x) => x !== i))} /> {t}</label>)}
        <div className="row end"><Btn kind="primary" onClick={() => setS(5)}>下一步</Btn></div></Card>}
      {s === 5 && <Card title="試用 Copilot（預錄示範，非即時 AI）" right={<AITag />}>
        <div className="chips">{CHAT.map((c, i) => <button key={i} className="chip" onClick={() => !chat.includes(i) && setChat([...chat, i])}>{c.q}</button>)}</div>
        <div className="chat">{chat.map((i) => <div key={i}><div className="msg me">{CHAT[i].q}</div><div className="msg bot">{CHAT[i].a}{rag.cite && <div className="src">來源：{CHAT[i].src.join('；')}</div>}{!rag.cite && <div className="src red">（未設定來源追溯，使用者無法查證）</div>}</div></div>)}</div>
        <h4>部署方式</h4>
        <Choice v={deploy as any} set={setDeploy as any} opts={[{ id: 'local', t: '地端部署本地模型，資料不出廠' }, { id: 'cloud', t: '串接外部付費雲端 API' }]} />
        <div className="row end"><Btn kind="primary" disabled={!deploy || chat.length < 2} onClick={() => {
          const sOk = st.filter((x) => STORIES.find((y) => y.id === x)!.ok).length;
          const score = sOk * 7 + (ocr.human ? 8 : 0) + (ocr.schema ? 6 : 0) + (ocr.conf >= 0.8 ? 5 : 0) + (rag.cite ? 10 : 0) + (rag.chunk ? 4 : 0) + (rag.version ? 5 : 0) + (perm === 'ro' ? 15 : 0) + Math.min(4, tests.length) * 3 + (tests.includes(0) ? 2 : 0) + (deploy === 'local' ? 8 : 0);
          onDone({ score: clamp(Math.round(score), 0, 100), summary: [`需求選擇 ${sOk}/3 合宜`, `人工確認 ${ocr.human ? '✔' : '✘'}、來源追溯 ${rag.cite ? '✔' : '✘'}、版本控管 ${rag.version ? '✔' : '✘'}`, `權限：${{ ro: '唯讀＋人工核准 ✔', rw: '直接寫入（風險）', admin: '管理員帳號（風險）' }[perm!]}`, `測試案例 ${tests.length} 項、部署：${deploy === 'local' ? '地端' : '外部 API'}`],
            effect: { f: { dataQuality: perm === 'ro' ? 0.05 : 0.01, opexExtra: 6000 }, addRisk: perm === 'ro' ? undefined : 'Copilot 具過度寫入權限' } });
        }}>完成專案</Btn></div></Card>}
    </div>
  );
}

const PROJ = [
  { id: 'A', n: 'FastenerVision AI', d: '扣件視覺瑕疵檢測：標註→分割→模型→門檻→混淆矩陣→部署', C: ProjectA, cost: 60000 },
  { id: 'B', n: 'TorqueMind AI', d: '預置扭力製程預測：特徵、預測區間與不確定性', C: ProjectB, cost: 40000 },
  { id: 'C', n: 'Predictive Maintenance AI', d: '設備與模具預測性維護：何時停機保養最划算', C: ProjectC, cost: 40000 },
  { id: 'D', n: 'Fastener Engineering Copilot', d: 'VLM／OCR、RAG、BOM、SQL／ETL、API 與權限', C: ProjectD, cost: 50000 },
];
export function AILab({ onDone, embedded }: GP & { embedded?: boolean }) {
  const { g, set, sfx, toast } = useG();
  const [open, setOpen] = useState<string | null>(null);
  const done = (Object.values(g.ai) as any[]).filter((x) => x.done).length;
  const unlocked = g.mode === 'sandbox' || g.pos >= 6;
  if (open) {
    const P = PROJ.find((p) => p.id === open)!;
    return (
      <div>
        <div className="row between"><h3>{P.n}</h3><Btn small onClick={() => setOpen(null)}>← 返回專案清單</Btn></div>
        <P.C onDone={(r) => {
          set((g0) => {
            let n = applyEff(g0, r.effect || {});
            n = { ...n, ai: { ...n.ai, [P.id]: { done: true, score: Math.max(r.score, n.ai[P.id].score), deployed: true } }, skills: gainSkills(n, { it: 4, sys: 1 }, r.score / 100) };
            n.journal = [...n.journal, { week: n.week, title: `AI 專案完成：${P.n}`, text: r.summary.join('；') }];
            return n;
          });
          sfx(r.score >= 60 ? 'good' : 'bad'); toast(`${P.n} 完成：${r.score} 分`); setOpen(null);
        }} />
      </div>
    );
  }
  return (
    <div>
      <div className="row between wrap"><p>AI 研發室・已完成 <b>{done}</b>／4 個專案 <AITag /></p>{embedded && <Btn kind="primary" disabled={done < 3} onClick={() => {
        const sc = (Object.values(g.ai) as any[]).filter((x) => x.done).map((x) => x.score);
        onDone({ score: Math.round(sc.reduce((a, b) => a + b, 0) / sc.length), summary: [`完成 ${done} 個 AI 專案`, ...PROJ.filter((p) => g.ai[p.id].done).map((p) => `${p.n}：${g.ai[p.id].score} 分`)] });
      }}>{done < 3 ? `至少完成 3 個專案（${done}/3）` : '提交專案成果'}</Btn>}</div>
      {!unlocked && <div className="warnbox">轉職為人工智慧工程師後解鎖。</div>}
      <div className="grid2">{PROJ.map((p) => (
        <Card key={p.id} title={<>{p.n} {g.ai[p.id].done && <Tag color="var(--green)">完成 {g.ai[p.id].score} 分</Tag>}</>}>
          <p className="small">{p.d}</p>
          <div className="row between"><small className="muted">專案經費 {fmt.nt(p.cost)}</small>
            <Btn kind="primary" disabled={!unlocked} onClick={() => {
              if (!g.ai[p.id].done && g.funds < p.cost) {
                set((g0) => ({ ...g0, funds: g0.funds + p.cost, trust: { ...g0.trust, mgmt: g0.trust.mgmt - 3 }, grants: g0.grants + 1 }));
                toast('經費不足：周副總核准專案預算追加（經營管理信任 −3）');
              }
              if (!g.ai[p.id].done) set((g0) => ({ ...g0, funds: Math.max(0, g0.funds - p.cost) }));
              setOpen(p.id);
            }}>{g.ai[p.id].done ? '重新挑戰' : '開始專案'}</Btn></div>
        </Card>
      ))}</div>
    </div>
  );
}
export function AILabGame(p: GP) { return <AILab {...p} embedded />; }
