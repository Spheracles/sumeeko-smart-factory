import React, { useEffect, useRef, useState } from 'react';
import { Btn, Card, Hint, Kpi, Tag, useG } from '../ui/common';
import { clamp, fmt, Effect } from '../sim';
import type { GP } from './floor';
import type { SurvivalRun } from '../state';

// 《SUMEEKO：AI 工程師生存戰》以獨立頁面（survival.html）嵌入，透過 postMessage 回傳結局
export const SURVIVAL_PASS = ['A', 'B', 'D'];
const END_N: Record<string, string> = { A: '智慧製造領航者', B: '技術成功，商業失衡', C: '快速交付，品質危機', D: '危機處理專家', E: '專案失敗與重新整頓' };
const DIFF_N: Record<string, string> = { easy: '實習', std: '標準', hard: '危機' };
const BUDGET = 5000000, DEADLINE = 120;

export function survivalScore(r: SurvivalRun) {
  const base: Record<string, number> = { A: 90, D: 80, B: 72, C: 42, E: 28 };
  const m = r.m;
  let s = (base[r.ending] ?? 30) + (m.quality - 75) / 6 + (m.cust - 75) / 10 + (m.sec - 70) / 10 + (r.diff === 'hard' ? 5 : r.diff === 'easy' ? -4 : 0) - (r.mentor ? 3 : 0);
  s = SURVIVAL_PASS.includes(r.ending) ? clamp(s, 66, 100) : clamp(s, 10, 48);
  return Math.round(s);
}
export function survivalEffect(r: SurvivalRun): Effect {
  const m = r.m;
  return {
    f: { dataQuality: clamp((m.quality - 70) / 400, -0.05, 0.05) },
    trust: { it: Math.round((m.sec - 60) / 5), quality: Math.round((m.quality - 70) / 6), mgmt: Math.round((m.brand - 70) / 5) + (m.spent <= BUDGET ? 2 : -3) },
    brand: Math.round((m.cust - 75) / 10),
    addRisk: m.sec < 45 ? 'AI 系統資安成熟度不足' : undefined,
  };
}

function RunCard({ r }: { r: SurvivalRun }) {
  const pass = SURVIVAL_PASS.includes(r.ending);
  const sev2 = r.inc.filter((i) => i.sev === 2).length, sev1 = r.inc.filter((i) => i.sev === 1).length;
  return (
    <div className={pass ? 'goodbox' : 'warnbox'}>
      <div className="row between wrap"><b>結局 {r.ending}｜{END_N[r.ending]}</b><span>{pass ? '✅ 通過考核' : '❌ 未通過'}・難度 {DIFF_N[r.diff] || r.diff}{r.mentor ? '・教學模式' : ''}・預估得分 {survivalScore(r)}</span></div>
      <div className="grid4" style={{ marginTop: 8 }}>
        <Kpi label="總支出" value={fmt.wan(r.m.spent)} sub={`核定 ${fmt.wan(BUDGET)}`} good={r.m.spent <= BUDGET} />
        <Kpi label="工期" value={`${Math.round(r.m.days)} 日`} sub={`期限 ${DEADLINE} 日`} good={r.m.days <= DEADLINE} />
        <Kpi label="品質／資安" value={`${r.m.quality}／${r.m.sec}`} />
        <Kpi label="品牌／客戶" value={`${r.m.brand}／${r.m.cust}`} />
      </div>
      <p className="small">事故：重大 {sev2}、中度 {sev1}、合計 {r.inc.length} 起。{r.reasons.slice(0, 3).join('；')}</p>
    </div>
  );
}

export function SurvivalGame({ onDone }: GP) {
  const { g, set, toast, sfx } = useG();
  const [open, setOpen] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const runs = g.survival?.runs || [];
  const last = runs[runs.length - 1];
  const best = runs.reduce((b: SurvivalRun | null, r) => (!b || survivalScore(r) > survivalScore(b) ? r : b), null);
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!frame.current || e.source !== frame.current.contentWindow) return;
      const d: any = e.data; if (!d || typeof d.type !== 'string') return;
      if (d.type === 'smk-survival-ready') frame.current.contentWindow!.postMessage({ type: 'smk-init', name: g.player.name, diff: g.mode === 'engineer' ? 'std' : 'easy' }, '*');
      if (d.type === 'smk-survival-close') setOpen(false);
      if (d.type === 'smk-survival-end') {
        const run: SurvivalRun = { ending: d.ending, m: d.m, cost: d.cost, inc: d.inc || [], diff: d.diff, mentor: !!d.mentor, runId: d.runId, reasons: d.reasons || [], at: Date.now(), week: g.week, sk: d.sk };
        set((g0) => {
          const rs = (g0.survival?.runs || []).filter((x) => x.runId !== run.runId);
          return { ...g0, survival: { runs: [...rs, run].slice(-12) } };
        });
        const pass = SURVIVAL_PASS.includes(run.ending);
        sfx(pass ? 'good' : 'bad');
        toast(pass ? `生存戰結局 ${run.ending}：通過！返回主線即可提交考核。` : `生存戰結局 ${run.ending}：未通過，可再挑戰。`);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [g.player.name, g.week]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const submit = (r: SurvivalRun) => onDone({
    score: survivalScore(r),
    summary: [`《AI 工程師生存戰》結局 ${r.ending}｜${END_N[r.ending]}（難度 ${DIFF_N[r.diff] || r.diff}${r.mentor ? '、教學模式' : ''}）`, `總支出 ${fmt.nt(r.m.spent)}／工期 ${Math.round(r.m.days)} 日／事故 ${r.inc.length} 起`, `品質 ${r.m.quality}、資安 ${r.m.sec}、品牌 ${r.m.brand}、客戶 ${r.m.cust}、風險 ${r.m.risk}`, SURVIVAL_PASS.includes(r.ending) ? '通過 AI 工程師階段考核' : '未通過：結局 C、E 需重新挑戰'],
    effect: survivalEffect(r), extra: { survivalEnding: r.ending },
  });
  return (
    <div>
      <Card title="階段考核：《SUMEEKO：AI 工程師生存戰》" right={<span className="simtag ai">教學模擬・虛構數據</span>}>
        <p>你將以 AI 工程師身分主導一個橫跨報價、圖面解析、ERP 整合、知識問答、AI Agent、GPU 部署到正式上線的數位轉型專案。九個關卡彼此連動：每個決策都會影響預算、工期、品質、資安與客戶信任，並可能在後面引爆事故。</p>
        <div className="grid4">
          <Kpi label="核定預算" value="NT$500 萬" sub="含預備金 100 萬" /><Kpi label="工期" value="120 日" />
          <Kpi label="通過條件" value="結局 A／B／D" sub="以職涯模式完成" /><Kpi label="未通過" value="結局 C／E" sub="可無限次重新挑戰" />
        </div>
        <Hint>生存戰會在全螢幕視窗開啟，進度自動保存，可隨時「返回主線」再回來繼續。自由挑戰、事故演練只供練習，不列入考核。</Hint>
        <div className="row end wrap"><Btn kind="primary" onClick={() => setOpen(true)}>{runs.length ? '▶ 開啟生存戰（繼續／再挑戰）' : '▶ 開始生存戰'}</Btn></div>
      </Card>
      {last && <Card title="最近一次結果"><RunCard r={last} />
        <div className="row end wrap">
          {best && best !== last && <Btn onClick={() => submit(best)}>提交最佳紀錄（結局 {best.ending}）</Btn>}
          <Btn kind="primary" onClick={() => submit(last)}>提交考核結果</Btn>
        </div></Card>}
      {runs.length > 1 && <Card title="歷次挑戰紀錄"><div className="tbl-wrap"><table className="tbl sm"><thead><tr><th>#</th><th>結局</th><th>難度</th><th>支出</th><th>工期</th><th>事故</th><th>得分</th></tr></thead>
        <tbody>{runs.map((r, i) => <tr key={r.runId} className={SURVIVAL_PASS.includes(r.ending) ? 'ok' : 'ng'}><td>{i + 1}</td><td>{r.ending} {END_N[r.ending]}</td><td>{DIFF_N[r.diff] || r.diff}</td><td>{fmt.wan(r.m.spent)}</td><td>{Math.round(r.m.days)} 日</td><td>{r.inc.length}</td><td>{survivalScore(r)}</td></tr>)}</tbody></table></div></Card>}
      {open && (
        <div className="sv-overlay" role="dialog" aria-label="AI 工程師生存戰">
          <div className="sv-bar"><b>第十二章・AI 工程師生存戰</b>{last && <Tag color={SURVIVAL_PASS.includes(last.ending) ? 'var(--green)' : 'var(--orange)'}>最近結局 {last.ending}</Tag>}<Btn small kind="primary" onClick={() => setOpen(false)}>← 返回主線</Btn></div>
          <iframe ref={frame} src="survival.html" title="SUMEEKO：AI 工程師生存戰" />
        </div>
      )}
    </div>
  );
}
