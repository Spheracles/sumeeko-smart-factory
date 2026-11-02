import React, { useMemo, useState } from 'react';
import { Btn, Card, Hint, Steps, useG, Bars, Meter, Tag, SimTag, Kpi, Legend } from '../ui/common';
import { clamp, fmt, evaluatePhoenix, PHOENIX_OPTIONS, PHOENIX_BUDGET, phoenixCost, STATION_INFO, OPEX_WEEKS } from '../sim';
import type { GP } from './floor';

const NODES = [
  { id: 'sensor', n: '設備感測器', x: 80, y: 370, layer: 'OT' }, { id: 'plc', n: 'PLC／IoT／SCADA', x: 80, y: 240, layer: 'OT' },
  { id: 'mes', n: 'MES', x: 300, y: 240, layer: 'MOM' }, { id: 'qms', n: 'QMS', x: 300, y: 370, layer: 'MOM' }, { id: 'cmms', n: 'CMMS', x: 300, y: 110, layer: 'MOM' },
  { id: 'wms', n: 'WMS', x: 510, y: 370, layer: 'IT' }, { id: 'erp', n: 'ERP', x: 510, y: 240, layer: 'IT' }, { id: 'aps', n: 'APS', x: 510, y: 110, layer: 'IT' },
  { id: 'ai', n: 'AI 分析', x: 700, y: 170, layer: 'IT' }, { id: 'twin', n: '數位孿生', x: 700, y: 320, layer: 'IT' },
];
const REQ = ['sensor-plc', 'plc-mes', 'mes-qms', 'mes-wms', 'erp-wms', 'erp-mes', 'aps-erp', 'aps-mes', 'ai-mes', 'ai-twin', 'mes-twin', 'cmms-mes'];
const BAD: Record<string, string> = { 'erp-plc': 'ERP 直接連 PLC：跨越 OT／IT 分層，任何商業系統都不應直接寫入控制層。', 'ai-plc': 'AI 直接控制 PLC：AI 不可任意修改生產參數。', 'erp-sensor': '感測器原始資料直送 ERP：缺少 MES 的批號脈絡與資料治理。', 'aps-plc': 'APS 直接下指令到 PLC：排程應經 MES 派工。' };
const key = (a: string, b: string) => [a, b].sort().join('-');
const MAP = [{ m: 'lot_no', a: '批號（Lot）' }, { m: 'wo_id', a: '工單號' }, { m: 'qty_good', a: '完工入庫數量' }, { m: 'scrap_qty', a: '報廢數量' }];
const ERPF = ['批號（Lot）', '工單號', '完工入庫數量', '報廢數量', '採購單號', '客戶料號'];
export function CIMGame({ onDone }: GP) {
  const [step, setStep] = useState(0);
  const [edges, setEdges] = useState<string[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [mp, setMp] = useState<Record<string, string>>({});
  const [fix, setFix] = useState<number | null>(null);
  const [sec, setSec] = useState<number | null>(null);
  const tap = (id: string) => {
    if (checked) return;
    if (!sel) { setSel(id); return; }
    if (sel === id) { setSel(null); return; }
    const k = key(sel, id);
    setEdges(edges.includes(k) ? edges.filter((e) => e !== k) : [...edges, k]); setSel(null);
  };
  const ok = edges.filter((e) => REQ.includes(e)), bad = edges.filter((e) => BAD[e]), extra = edges.filter((e) => !REQ.includes(e) && !BAD[e]);
  const P = (id: string) => NODES.find((n) => n.id === id)!;
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
  return (
    <div>
      <Steps steps={['系統拓樸', '欄位映射', '修復資料不一致', 'OT／IT 資安']} cur={step} />
      {step === 0 && (
        <Card title="點選兩個節點建立（或移除）資料流" right={<span className="muted">已連 {edges.length} 條</span>}>
          <Hint>由下而上：設備 → 控制層 → 製造營運（MES/QMS/CMMS）→ 企業層（ERP/WMS/APS）→ 分析與數位孿生。需要 12 條正確連線，避免跨層直連。</Hint>
          <svg viewBox="0 0 800 420" className="scene cimg">
            <rect x="10" y="190" width="150" height="220" rx="12" className="zone ot" /><text x="20" y="208" className="zl">OT 控制層</text>
            <rect x="220" y="70" width="170" height="340" rx="12" className="zone mom" /><text x="230" y="88" className="zl">製造營運層</text>
            <rect x="430" y="70" width="360" height="340" rx="12" className="zone it" /><text x="440" y="88" className="zl">企業／分析層</text>
            {edges.map((e) => { const [a, b] = e.split('-'); const A = P(a), B = P(b); const cls = REQ.includes(e) ? (checked ? 'e ok' : 'e') : BAD[e] ? (checked ? 'e bad' : 'e') : checked ? 'e extra' : 'e'; return <line key={e} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={cls} />; })}
            {checked && REQ.filter((r) => !edges.includes(r)).map((e) => { const [a, b] = e.split('-'); const A = P(a), B = P(b); return <line key={e} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className="e miss" />; })}
            {NODES.map((n) => <g key={n.id} onClick={() => tap(n.id)} style={{ cursor: 'pointer' }}><rect x={n.x - 62} y={n.y - 22} width="124" height="44" rx="10" className={`node ${sel === n.id ? 'sel' : ''}`} /><text x={n.x} y={n.y + 5} textAnchor="middle" className="nl">{n.n}</text></g>)}
          </svg>
          {checked && <ul className="list">
            <li className="good">正確連線 {ok.length}/12{REQ.length - ok.length ? `（虛線為缺少的連線）` : ''}</li>
            {bad.map((b) => <li key={b} className="bad">{BAD[b]}</li>)}
            {extra.length > 0 && <li>其他連線 {extra.length} 條：不一定錯，但增加介面維護成本。</li>}
          </ul>}
          <div className="row end">{!checked ? <Btn kind="primary" disabled={edges.length < 6} onClick={() => setChecked(true)}>驗證拓樸</Btn> : <Btn kind="primary" onClick={() => setStep(1)}>下一步</Btn>}</div>
        </Card>
      )}
      {step === 1 && (
        <Card title="MES → ERP 欄位映射（報工拋轉）">
          {MAP.map((m) => <div key={m.m} className="row between qrow"><code>MES.{m.m}</code><span>→</span><select value={mp[m.m] || ''} onChange={(e) => setMp({ ...mp, [m.m]: e.target.value })}><option value="">—</option>{ERPF.map((f) => <option key={f}>{f}</option>)}</select></div>)}
          <Hint>報工拋轉要讓批號、工單、良品與報廢數量對得上，才能做生產履歷與成本計算。</Hint>
          <div className="row end"><Btn kind="primary" disabled={Object.keys(mp).length < 4} onClick={() => setStep(2)}>下一步</Btn></div>
        </Card>
      )}
      {step === 2 && (
        <Card title="ERP 套管庫存 12,000，現場實盤 9,800。怎麼修？">
          <div className="opts col">{FIX.map((f, i) => <button key={i} className={`opt ${fix === i ? 'on' : ''}`} onClick={() => setFix(i)}>{f.t}</button>)}</div>
          <div className="row end"><Btn kind="primary" disabled={fix === null} onClick={() => setStep(3)}>下一步</Btn></div>
        </Card>
      )}
      {step === 3 && (
        <Card title="OT／IT 資安與權限">
          <div className="opts col">{SEC.map((f, i) => <button key={i} className={`opt ${sec === i ? 'on' : ''}`} onClick={() => setSec(i)}>{f.t}</button>)}</div>
          <div className="row end"><Btn kind="primary" disabled={sec === null} onClick={() => {
            const mapOk = MAP.filter((m) => mp[m.m] === m.a).length;
            const score = ok.length / 12 * 40 - bad.length * 8 - Math.max(0, extra.length - 2) * 2 + mapOk * 5 + FIX[fix!].s + SEC[sec!].s;
            onDone({ score: clamp(Math.round(score), 0, 100), summary: [`系統拓樸正確 ${ok.length}/12、跨層違規 ${bad.length}`, `欄位映射 ${mapOk}/4`, `帳料不符：${FIX[fix!].s >= 15 ? '找出系統性原因 ✔' : '僅治標'}`, `資安：${SEC[sec!].s >= 15 ? 'DMZ 分層 ✔' : '設計不足'}`],
              effect: { f: { dataQuality: (ok.length / 12) * 0.12 + (fix === 0 ? 0.04 : 0) }, addRisk: sec === 1 ? 'OT 網路與辦公網路未分區' : undefined }, extra: { sync: mapOk === 4 } });
          }}>完成整合</Btn></div>
        </Card>
      )}
    </div>
  );
}

// ============ 終局：鳳凰計畫／數位孿生沙盒 ============
export function PhoenixGame({ onDone, sandbox }: GP & { sandbox?: boolean }) {
  const { g } = useG();
  const [ids, setIds] = useState<string[]>([]);
  const [runs, setRuns] = useState<{ ids: string[]; score: number; passed: number }[]>([]);
  const [shown, setShown] = useState<string[] | null>(null);
  const [hint, setHint] = useState(0);
  const cost = phoenixCost(ids);
  const ev = useMemo(() => (shown ? evaluatePhoenix(shown) : null), [shown]);
  const base = useMemo(() => evaluatePhoenix([]), []);
  const cats = Array.from(new Set(PHOENIX_OPTIONS.map((o) => o.cat)));
  const HINTS = ['先看初始瓶頸站是哪一站（下方負荷圖紅色）。改善非瓶頸站不會增加產出。', '重大工安風險必須先解除，這不是可選項目。', '能用「改善既有設備」解決的，未必要買新機台；但若產能缺口仍在，短期加班或提高可用率都是選項（注意疲勞）。', 'PPM 可以從源頭降低潛在缺陷，也可以提升檢出率——比較兩者的成本。'];
  const toggle = (id: string) => setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  return (
    <div>
      <div className="grid-phx">
        <Card title="改善方案組合" right={<SimTag />}>
          <Meter label="投資（CAPEX＋一季 OPEX）" right={`${fmt.wan(cost.total)}／${fmt.wan(PHOENIX_BUDGET)}`} v={cost.total} max={PHOENIX_BUDGET} danger={PHOENIX_BUDGET} color="var(--orange)" />
          {cats.map((c) => (
            <div key={c} className="optgrp"><h4>{c}</h4>
              {PHOENIX_OPTIONS.filter((o) => o.cat === c).map((o) => (
                <label key={o.id} className={`check plan ${ids.includes(o.id) ? 'on' : ''}`}>
                  <input type="checkbox" checked={ids.includes(o.id)} onChange={() => toggle(o.id)} />
                  <span><b>{o.name}</b><small>{o.desc}</small></span>
                  <span className="price">{o.capex ? `CAPEX ${fmt.wan(o.capex)}` : ''}{o.opex ? ` OPEX ${fmt.wan(o.opex)}/週` : ''}{!o.capex && !o.opex ? '營運調整' : ''}</span>
                </label>
              ))}
            </div>
          ))}
          <div className="row end sticky-b"><Btn kind="primary" onClick={() => { setShown([...ids]); const e = evaluatePhoenix(ids); setRuns([...runs, { ids: [...ids], score: e.score, passed: e.passed }]); }}>▶ 模擬一週（種子 固定）</Btn></div>
        </Card>
        <div>
          <Card title="初始狀態（改善前）" right={<SimTag />}>
            <div className="grid4">
              <Kpi label="全線 OEE" value={fmt.pct(base.before.oee)} /><Kpi label="OTIF" value={fmt.pct(base.before.otif)} />
              <Kpi label="單位良品成本" value={`NT$${base.before.costPerGood.toFixed(2)}`} /><Kpi label="PPM" value={base.before.ppm.toFixed(0)} />
            </div>
            <p className="small">需求 {fmt.n(base.before.demandTotal)} 顆／週・良品產出 {fmt.n(base.before.goodTotal)}・瓶頸 <b className="red">{STATION_INFO[base.before.bottleneck].name}</b>・未解決工安風險：冷鍛區安全光柵間歇失效</p>
            <Bars data={base.before.stations.map((s) => ({ label: STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.load > 1 ? '#ff5d73' : '#39d5ff' }))} line={1} lineLabel="產能 100%" fmtv={(v) => `${(v * 100).toFixed(0)}%`} h={150} />
            {g.settings.hints && <div className="row"><Btn small onClick={() => setHint(Math.min(HINTS.length, hint + 1))}>💡 提示（{hint}/{HINTS.length}）</Btn></div>}
            {HINTS.slice(0, hint).map((h) => <div key={h} className="hint">{h}</div>)}
          </Card>
          {ev && (
            <Card title={`模擬結果：達成 ${ev.passed}/7 項目標・綜合評分 ${ev.score}`}>
              <ul className="targets">{ev.targets.map((t) => <li key={t.id} className={t.ok ? 'ok' : 'ng'}>{t.ok ? '✅' : '❌'} {t.label}<b>{t.val}</b></li>)}</ul>
              <div className="grid4">
                <Kpi label="OEE" value={fmt.pct(ev.after.oee)} delta={`${((ev.after.oee - ev.before.oee) * 100).toFixed(1)}pt`} />
                <Kpi label="良品產出" value={fmt.n(ev.after.goodTotal)} delta={`${ev.after.goodTotal >= ev.before.goodTotal ? '+' : ''}${fmt.n(ev.after.goodTotal - ev.before.goodTotal)}`} />
                <Kpi label="單位成本" value={`NT$${ev.after.costPerGood.toFixed(2)}`} />
                <Kpi label="估計 ROI" value={ev.cost.total ? (ev.roi > 5 ? '>500%' : fmt.pct(ev.roi, 0)) : '—'} sub="年化，CAPEX 以 5 年計" />
              </div>
              <p className="small">瓶頸：{STATION_INFO[ev.before.bottleneck].name} → <b>{STATION_INFO[ev.after.bottleneck].name}</b>{ev.before.bottleneck !== ev.after.bottleneck ? '（瓶頸已轉移！）' : ''}・疲勞指數 {ev.after.fatigue.toFixed(0)}・單位能耗 {ev.after.energyPerUnit.toFixed(3)} kWh</p>
              <Bars data={ev.after.stations.map((s) => ({ label: STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.load > 1 ? '#ff5d73' : s.id === ev.after.bottleneck ? '#ffd23f' : '#39d5ff' }))} line={1} lineLabel="產能 100%" fmtv={(v) => `${(v * 100).toFixed(0)}%`} h={150} />
              {!sandbox && <div className="row end"><Btn kind="primary" onClick={() => onDone({ score: ev.score, summary: [`達成 ${ev.passed}/7 項目標`, `投資 ${fmt.wan(ev.cost.total)}、估計年節省 ${fmt.wan(ev.annualSaving)}`], extra: { ids: shown, runs: runs.length } })}>提交最終方案並產生報告</Btn></div>}
            </Card>
          )}
          {runs.length > 1 && <Card title="模擬紀錄（相同種子可比較）"><ol className="small">{runs.map((r, i) => <li key={i}>第 {i + 1} 次：{r.passed}/7 目標・{r.score} 分・{r.ids.length} 項方案</li>)}</ol></Card>}
        </div>
      </div>
    </div>
  );
}
