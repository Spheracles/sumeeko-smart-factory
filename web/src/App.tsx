import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GameCtx, Btn, Card, Modal, Bubble, NpcFace, PlayerFace, Face, LOOKS, beep, Steps, Tag, Kpi, Hint, SimTag } from './ui/common';
import { GameState, newGame, loadSlot, saveSlot, slotInfo, chapterUnlocked, currentChapter, passLine, applyEff, gainSkills, promotionCheck, snapshot, pickEvent, checkAchievements, EDU, TALENT, ASPIRE, Mode } from './state';
import { CHAPTERS, CAREERS, NPCS, EVENTS, BRANCHES, Branch, DEPTS, Dept, ACHIEVEMENTS, FINAL_ID } from './data';
import { simulateWeek, fmt, endingOf, evaluatePhoenix } from './sim';
import { MapView, Dashboard, CareerView, CodexView, AIView, CIMView, SettingsView, ReportView, Sources } from './views';
import { HazardGame, TraceGame, ParamGame, InspectGame, CrewGame, GameResult } from './games/floor';
import { ScheduleGame, SPCGame, SupplyGame, DataGame } from './games/office';
import { AILabGame } from './games/ai';
import { CIMGame, PhoenixGame } from './games/cim';
import { SurvivalGame, SURVIVAL_PASS } from './games/survival';

const GAMES: Record<string, React.FC<any>> = { hazard: HazardGame, trace: TraceGame, param: ParamGame, inspect: InspectGame, crew: CrewGame, schedule: ScheduleGame, spc: SPCGame, supply: SupplyGame, data: DataGame, ailab: AILabGame, cim: CIMGame, phoenix: PhoenixGame, survival: SurvivalGame };
const GAME_NAME: Record<string, string> = { hazard: '危險辨識訓練', trace: '批號追溯', param: '製程參數與品質控制', inspect: '品質檢測挑戰', crew: '班別人力配置', schedule: '生產排程拼圖＋MRP', spc: 'SPC 品質分析', supply: '供應鏈資源調度', data: '資料分析與精實改善', ailab: 'AI 專案建置', cim: 'CIM 系統整合', phoenix: '全廠數位孿生最佳化', survival: 'AI 工程師生存戰（九關專案）' };

// ================= 首頁 =================
function HeroArt() {
  return (
    <svg viewBox="0 0 600 320" className="hero">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1a3a" /><stop offset="1" stopColor="#13284f" /></linearGradient>
        <linearGradient id="steel" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#4c5a70" /><stop offset=".45" stopColor="#f2f6fb" /><stop offset=".6" stopColor="#aab7c9" /><stop offset="1" stopColor="#3a4658" /></linearGradient>
        <radialGradient id="sun" cx=".75" cy=".3" r=".5"><stop offset="0" stopColor="#ff9a3c" stopOpacity=".55" /><stop offset="1" stopColor="#ff9a3c" stopOpacity="0" /></radialGradient>
        <filter id="gl"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <rect width="600" height="320" fill="url(#sky)" /><rect width="600" height="320" fill="url(#sun)" />
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={i * 46} y1="320" x2={300} y2="190" stroke="#1f3f73" strokeWidth="1" />)}
      <path d="M0 230 L60 230 L60 170 L110 200 L110 170 L160 200 L160 150 L200 150 L200 230 L260 230 L260 190 L330 190 L330 230 L600 230 L600 320 L0 320Z" fill="#0e1f3f" stroke="#2b5aa0" />
      <rect x="170" y="90" width="14" height="60" fill="#22406f" /><path d="M177 90 q10 -20 0 -40 q-10 -20 6 -36" stroke="#5e7ba8" strokeOpacity=".4" fill="none" strokeWidth="6" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={20 + i * 30} y="245" width="18" height="6" fill="#39d5ff" opacity={0.3 + (i % 3) * 0.2} />)}
      <g transform="translate(400 70) rotate(18)" filter="url(#gl)">
        <polygon points="-46,-18 46,-18 56,0 46,18 -46,18 -56,0" fill="url(#steel)" stroke="#2c3a50" strokeWidth="2" />
        <rect x="-18" y="18" width="36" height="170" fill="url(#steel)" stroke="#2c3a50" strokeWidth="2" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M-20 ${40 + i * 7} L20 ${45 + i * 7}`} stroke="#334055" strokeWidth="2" />)}
      </g>
      <g stroke="#39d5ff" strokeWidth="1.5" fill="none" opacity=".8"><circle cx="400" cy="160" r="110" strokeDasharray="4 8" className="spin-slow" /><circle cx="400" cy="160" r="135" strokeDasharray="30 12 4 12" opacity=".5" /></g>
      <g className="dataflow">{[0, 1, 2].map((i) => <path key={i} d={`M0 ${270 + i * 12} C 200 ${260 + i * 10}, 300 ${280 - i * 6}, 600 ${262 + i * 14}`} stroke={i === 1 ? '#ff9a3c' : '#39d5ff'} strokeWidth="2" fill="none" strokeDasharray="6 10" />)}</g>
    </svg>
  );
}
function Title({ onNew, onContinue, onLoad, hasSave, onExit }: { onNew: () => void; onContinue: () => void; onLoad: (s: number) => void; hasSave: boolean; onExit?: () => void }) {
  const [help, setHelp] = useState(false);
  const [src, setSrc] = useState(false);
  const [load, setLoad] = useState(false);
  return (
    <div className="title">
      <HeroArt />
      <div className="title-c">
        <div className="kicker">SUMEEKO: Rise of the Smart Factory</div>
        <h1>從一顆螺絲<br />到一座智慧工廠</h1>
        <p className="tag-l">職涯養成 × 工廠經營 × 工業工程 × 智慧製造</p>
        <div className="title-b">
          <button className="btn primary big" onClick={onNew}>開始新遊戲</button>
          <button className="btn big" disabled={!hasSave} onClick={onContinue}>繼續遊戲</button>
          <button className="btn" onClick={() => setLoad(true)}>載入存檔</button>
          <button className="btn" onClick={() => setHelp(true)}>操作說明</button>
          <button className="btn" onClick={() => setSrc(true)}>資料來源聲明</button>
          {onExit && <button className="btn" onClick={onExit}>← 返回 App 首頁</button>}
        </div>
        <p className="disc">以世德工業公開的產業背景與專利為教學題材；人物、數據、事件皆為教育用途之虛構模擬。</p>
      </div>
      {help && <Modal title="操作說明" onClose={() => setHelp(false)}><Help /></Modal>}
      {src && <Modal title="資料來源聲明" onClose={() => setSrc(false)} wide><Sources /></Modal>}
      {load && <Modal title="載入存檔" onClose={() => setLoad(false)}>{[0, 1, 2, 3].map((s) => { const i = slotInfo(s); return <div key={s} className="row between qrow"><span>{s === 0 ? '自動存檔' : `欄位 ${s}`}：{i ? `${i.name}・${CAREERS[i.pos].title}・W${i.week}` : '（空）'}</span><Btn small disabled={!i} onClick={() => onLoad(s)}>載入</Btn></div>; })}</Modal>}
    </div>
  );
}
function Help() {
  return (
    <ul className="small">
      <li><b>目標</b>：從產線新人一路成長為資深製程規劃暨 CIM 整合工程師，完成終局「鳳凰計畫」。</li>
      <li><b>任務流程</b>：開場漫畫 → 任務簡報 → 操作教學 → 小遊戲 → 兩難決策 → 數據結果 → NPC 反應 → 工作日誌 → 技能成長。</li>
      <li><b>升遷</b>：需同時滿足技能、認證（任務及格取得）、任務績效與跨部門信任。可在「職涯」頁進修或跨部門支援補足。</li>
      <li><b>第十二章</b>：轉職 AI 工程師後，需通過《AI 工程師生存戰》九關專案（結局 A／B／D）才能晉升下一階段。</li>
      <li><b>事件</b>：每完成一章會遇到工廠事件，你的選擇會實際改變工廠參數，並影響後續事件。</li>
      <li><b>操作</b>：滑鼠與觸控皆可。拖曳的地方都可改用「點選 → 點目標」或按鈕操作。</li>
      <li><b>存檔</b>：自動存檔；設定頁可手動存到 3 個欄位或匯出存檔代碼。</li>
      <li><b>模式</b>：故事模式容錯較高；工程師模式門檻較嚴；沙盒模式全解鎖、可自由模擬。</li>
    </ul>
  );
}
const COATS = ['#3a7bd5', '#e07a1f', '#2f8f6f', '#7a3b69'];
function Create({ onStart, onBack }: { onStart: (p: GameState['player'], m: Mode) => void; onBack: () => void }) {
  const [name, setName] = useState('林以安');
  const [look, setLook] = useState(0);
  const [coat, setCoat] = useState(COATS[0]);
  const [edu, setEdu] = useState('fresh');
  const [talent, setTalent] = useState('hands');
  const [asp, setAsp] = useState('ai');
  const [mode, setMode] = useState<Mode>('story');
  return (
    <div className="create">
      <Card title="建立角色">
        <div className="grid-create">
          <div className="avatar-pick">
            <Face {...LOOKS[look]} coat={coat} size={150} helmet />
            <div className="row sm">{LOOKS.map((l, i) => <button key={i} className={`av ${look === i ? 'on' : ''}`} onClick={() => setLook(i)} aria-label={`外觀 ${i + 1}`}><Face {...l} coat={coat} size={44} /></button>)}</div>
            <div className="row sm">{COATS.map((c) => <button key={c} className={`sw ${coat === c ? 'on' : ''}`} style={{ background: c }} onClick={() => setCoat(c)} aria-label="服裝顏色" />)}</div>
          </div>
          <div>
            <label className="fld">姓名<input value={name} maxLength={12} onChange={(e) => setName(e.target.value)} /></label>
            <div className="fld">教育背景<div className="opts">{Object.entries(EDU).map(([k, v]) => <button key={k} className={`opt ${edu === k ? 'on' : ''}`} onClick={() => setEdu(k)}><b>{v.label}</b><small><br />{v.hint}</small></button>)}</div></div>
            <div className="fld">初始專長<div className="opts">{Object.entries(TALENT).map(([k, v]) => <button key={k} className={`opt ${talent === k ? 'on' : ''}`} onClick={() => setTalent(k)}>{v.label}</button>)}</div></div>
            <div className="fld">職涯志向<div className="opts">{Object.entries(ASPIRE).map(([k, v]) => <button key={k} className={`opt ${asp === k ? 'on' : ''}`} onClick={() => setAsp(k)}>{v.label}</button>)}</div><small className="muted">志向分支經驗 +15%；背景不會封鎖任何職涯。</small></div>
            <div className="fld">遊戲模式<div className="opts">
              <button className={`opt ${mode === 'story' ? 'on' : ''}`} onClick={() => setMode('story')}><b>故事模式</b><small><br />教學多、容錯高</small></button>
              <button className={`opt ${mode === 'engineer' ? 'on' : ''}`} onClick={() => setMode('engineer')}><b>工程師模式</b><small><br />需實際分析 KPI</small></button>
              <button className={`opt ${mode === 'sandbox' ? 'on' : ''}`} onClick={() => setMode('sandbox')}><b>沙盒模式</b><small><br />全解鎖自由模擬</small></button>
            </div></div>
          </div>
        </div>
        <div className="row between"><Btn onClick={onBack}>← 返回</Btn><Btn kind="primary" disabled={!name.trim()} onClick={() => onStart({ name: name.trim(), look, coat, edu, talent, aspiration: asp }, mode)}>進廠報到 →</Btn></div>
      </Card>
    </div>
  );
}

// ================= 任務中心 =================
function MissionList({ go }: { go: (v: string, a?: any) => void }) {
  const { g } = (React.useContext(GameCtx));
  return (
    <div>
      <h2>任務中心</h2>
      <div className="chlist">{CHAPTERS.map((c) => {
        const un = chapterUnlocked(g, c.id) || !!g.done[c.id];
        const d = g.done[c.id];
        return (
          <button key={c.id} className={`chcard ${un ? '' : 'locked'} ${currentChapter(g) === c.id ? 'cur' : ''}`} disabled={!un} onClick={() => go('mission', c.id)}>
            <div className="ch-code">{c.code}</div><b>{c.title}</b><small>{c.role}</small>
            <div className="ch-f"><span>{GAME_NAME[c.game]}</span>{d?.tries ? <Tag color={d.best >= passLine(g) ? 'var(--green)' : 'var(--orange)'}>最佳 {d.best}</Tag> : un ? <Tag color="var(--cyan)">可進行</Tag> : <Tag>🔒 需 {CAREERS[c.requiredPos].title}</Tag>}</div>
          </button>
        );
      })}</div>
    </div>
  );
}

function MissionView({ id }: { id: number }) {
  const ctx = React.useContext(GameCtx);
  const { g, set, go, sfx } = ctx;
  const ch = CHAPTERS[id];
  const [stage, setStage] = useState<'intro' | 'brief' | 'play' | 'decide' | 'result'>('intro');
  const [panel, setPanel] = useState(0);
  const [res, setRes] = useState<GameResult | null>(null);
  const [opt, setOpt] = useState<number | null>(null);
  const [out, setOut] = useState<any>(null);
  const [key, setKey] = useState(0);
  const unlocked = chapterUnlocked(g, id) || !!g.done[id];
  useEffect(() => { set((g0) => ({ ...g0, unlockedCodex: Array.from(new Set([...g0.unlockedCodex, ...ch.codex])) })); }, [id]);
  if (!unlocked) return <Card title="尚未解鎖"><p>需要職位：{CAREERS[ch.requiredPos].title}，並完成前一章。</p><Btn onClick={() => go('career')}>查看升遷條件</Btn></Card>;
  const G = GAMES[ch.game];
  const commit = (r: GameResult, o: number | null) => {
    let before = simulateWeek(g.factory, g.seed + g.week);
    let phx: any = null;
    const pass = r.score >= passLine(g);
    const first = !g.done[id]?.tries;
    let n = applyEff(g, r.effect || {});
    if (o !== null) n = applyEff(n, ch.dilemma.options[o].effect);
    if (first) {
      n.funds += ch.reward.funds;
      n.freePts += 1;
      const tr = { ...n.trust };
      for (const [k, v] of Object.entries(ch.reward.trust)) tr[k as Dept] += Math.round((v || 0) * (pass ? 1 : 0.5));
      n.trust = tr;
    }
    n.skills = gainSkills(n, ch.reward.xp, (0.5 + r.score / 200) * (first ? 1 : 0.35));
    if (pass && ch.reward.cert && !n.certs.includes(ch.reward.cert)) n.certs = [...n.certs, ch.reward.cert];
    const prev = n.done[id];
    n.done = { ...n.done, [id]: { score: r.score, best: Math.max(prev?.best || 0, r.score), tries: (prev?.tries || 0) + 1 } };
    n.journal = [...n.journal, { week: n.week, title: `${ch.code}｜${ch.title}（${r.score} 分）`, text: `${ch.journal} ${o !== null ? `決策：${ch.dilemma.options[o].label}。` : ''}` }];
    if (o !== null) n.decisions = [...n.decisions, { week: n.week, title: ch.title, choice: ch.dilemma.options[o].label }];
    n.week += 1;
    const promoted: number[] = [];
    if (ch.reward.promoteTo !== undefined) {
      while (n.pos < ch.reward.promoteTo && promotionCheck(n, n.pos + 1).ok) { n.pos += 1; promoted.push(n.pos); n.posHistory = [...n.posHistory, { pos: n.pos, week: n.week }]; n.freePts += 2; }
    }
    const ach = [...n.achievements];
    const ex = r.extra || {};
    if (ex.bottleneck && !ach.includes('bottleneck')) ach.push('bottleneck');
    if (ex.spcPerfect && !ach.includes('spc')) ach.push('spc');
    if (ex.tco && !ach.includes('tco')) ach.push('tco');
    if (ex.leader && !ach.includes('leader')) ach.push('leader');
    if (ex.sync && !ach.includes('sync')) ach.push('sync');
    if (ex.survivalEnding && SURVIVAL_PASS.includes(ex.survivalEnding) && !ach.includes('survivor')) ach.push('survivor');
    if (ex.survivalEnding === 'A' && !ach.includes('navigator')) ach.push('navigator');
    n.achievements = ach;
    if (ch.game === 'cim' && pass) n.cimDone = true;
    if (ch.game === 'phoenix' && ex.ids) {
      const ev = evaluatePhoenix(ex.ids); phx = ev;
      n.final = { ids: ex.ids, score: r.score, ending: endingOf(ev, ex.ids) };
    }
    const newAch = checkAchievements(n); n.achievements = [...n.achievements, ...newAch];
    n.history = [...n.history, snapshot(n.factory, n.week, ch.code, n.seed)];
    if (first && ch.game !== 'phoenix') { const e = pickEvent(n); n.pendingEvent = e ? e.id : null; }
    let after = simulateWeek(n.factory, n.seed + n.week - 1);
    if (phx) { before = phx.before; after = phx.after; }
    const nextCh = CHAPTERS[id + 1];
    const need = nextCh && nextCh.requiredPos > n.pos ? promotionCheck(n, n.pos + 1) : null;
    setOut({ before, after, pass, first, promoted, need, newAch: ach.filter((a) => !g.achievements.includes(a)).concat(newAch.filter((a) => !ach.includes(a))) });
    set(() => n);
    sfx(promoted.length ? 'level' : pass ? 'good' : 'bad');
    setStage('result');
  };
  const onGame = (r: GameResult) => {
    setRes(r);
    if (ch.dilemma.options.length) setStage('decide'); else commit(r, null);
  };
  const p = ch.panels[panel];
  return (
    <div className="mission">
      <div className="mission-h"><div><span className="ch-code">{ch.code}</span><h2>{ch.title}</h2><small>{ch.role}</small></div><Steps steps={['開場', '簡報', '任務', '決策', '結果']} cur={['intro', 'brief', 'play', 'decide', 'result'].indexOf(stage)} /></div>
      {stage === 'intro' && (
        <div className="comic">
          {ch.panels.map((pp, i) => (
            <div key={i} className={`panel ${i <= panel ? 'show' : ''}`} onClick={() => setPanel(Math.min(ch.panels.length - 1, panel + 1))}>
              <div className="panel-art"><NpcFace id={pp.npc} size={92} mood={i === 2 ? 'happy' : undefined} /><div className="speed" /></div>
              <div className="speech"><b>{NPCS[pp.npc].name}</b>{pp.text}</div>
            </div>
          ))}
          <div className="row end"><Btn onClick={() => setStage('brief')}>略過</Btn>{panel < ch.panels.length - 1 ? <Btn kind="primary" onClick={() => setPanel(panel + 1)}>下一格 ▶</Btn> : <Btn kind="primary" onClick={() => setStage('brief')}>任務簡報 ▶</Btn>}</div>
        </div>
      )}
      {stage === 'brief' && (
        <div className="grid2">
          <Card title="任務目標"><ul className="obj">{ch.objectives.map((o) => <li key={o}>{o}</li>)}</ul><p className="small muted">及格分數：{passLine(g)}（及格可取得認證{ch.reward.cert ? `「${ch.reward.cert}」` : ''}）</p></Card>
          <Card title="操作教學・術語"><ul className="small tut">{ch.tutorial.map((t) => <li key={t}>{t}</li>)}</ul></Card>
          <div className="row end full"><Btn kind="primary" onClick={() => setStage('play')}>開始：{GAME_NAME[ch.game]} ▶</Btn></div>
        </div>
      )}
      {stage === 'play' && <G key={key} cfg={ch.cfg} onDone={onGame} />}
      {stage === 'decide' && res && (
        <Card title="兩難決策">
          <p className="dilemma">{ch.dilemma.prompt}</p>
          <div className="views">{ch.dilemma.views.map((v, i) => <Bubble key={i} npc={v.npc} text={v.text} mood={i === 0 ? 'worried' : undefined} />)}</div>
          <div className="opts col">{ch.dilemma.options.map((o, i) => <button key={i} className={`opt ${opt === i ? 'on' : ''}`} onClick={() => setOpt(i)}><b>{o.label}</b><small><br />{o.desc}</small></button>)}</div>
          <Hint>沒有永遠唯一的正解；但違反安全規範永遠不是捷徑。</Hint>
          <div className="row end"><Btn kind="primary" disabled={opt === null} onClick={() => commit(res, opt)}>確定決策</Btn></div>
        </Card>
      )}
      {stage === 'result' && out && res && (
        <div>
          <div className={`result-h ${out.pass ? 'pass' : 'fail'}`}><div className="big">{res.score}<small>分</small></div><div><b>{out.pass ? '任務完成！' : `未達及格（${passLine(g)} 分）`}</b><br /><small>{out.pass ? (ch.reward.cert ? `取得認證：${ch.reward.cert}` : '') : '可重新挑戰以取得認證；進度與決策結果已保留。'}</small></div></div>
          <div className="grid2">
            <Card title="任務評量"><ul className="list">{res.summary.map((s) => <li key={s}>{s}</li>)}</ul>
              {opt !== null && <Bubble npc={ch.dilemma.options[opt].react.split('：')[0].includes('Anna') ? 'keller' : (Object.values(NPCS).find((n) => ch.dilemma.options[opt!].react.startsWith(n.name.split('（')[0]))?.id || ch.panels[0].npc)} text={ch.dilemma.options[opt].react.split('：').slice(1).join('：') || ch.dilemma.options[opt].react} mood={ch.dilemma.options[opt].effect.flag ? 'angry' : 'happy'} />}
            </Card>
            <Card title="數據結果（工廠模擬週）" right={<SimTag />}>
              <div className="grid2">
                <Kpi label="全線 OEE" value={fmt.pct(out.after.oee)} delta={`${((out.after.oee - out.before.oee) * 100).toFixed(1)}pt`} />
                <Kpi label="良品產出" value={fmt.n(out.after.goodTotal)} delta={`${out.after.goodTotal >= out.before.goodTotal ? '+' : ''}${fmt.n(out.after.goodTotal - out.before.goodTotal)}`} />
                <Kpi label="單位成本" value={`NT$${out.after.costPerGood.toFixed(2)}`} delta={`${(out.after.costPerGood - out.before.costPerGood) >= 0 ? '+' : ''}${(out.after.costPerGood - out.before.costPerGood).toFixed(2)}`} />
                <Kpi label="客戶 PPM" value={out.after.ppm.toFixed(0)} delta={`${(out.after.ppm - out.before.ppm) >= 0 ? '+' : ''}${(out.after.ppm - out.before.ppm).toFixed(0)}`} />
              </div>
            </Card>
          </div>
          <Card title="工作日誌與成長">
            <p>📓 {ch.journal}</p>
            <div className="chips">{Object.entries(ch.reward.xp).map(([b, v]) => <Tag key={b} color={BRANCHES[b as Branch].color}>{BRANCHES[b as Branch].name} ↑</Tag>)}{out.first && ch.reward.funds > 0 && <Tag color="var(--orange)">專案經費 +{fmt.nt(ch.reward.funds)}</Tag>}{out.first && <Tag color="var(--orange)">技能點 +1</Tag>}</div>
            {out.promoted.map((p: number) => <div key={p} className="promo">🎉 晉升為 <b>{CAREERS[p].title}</b>（{CAREERS[p].en}）</div>)}
            {out.newAch.map((a: string) => ACHIEVEMENTS[a] && <div key={a} className="goodbox">🏅 解鎖成就：{ACHIEVEMENTS[a].name}</div>)}
            {out.need && !out.need.ok && <div className="warnbox">下一章需要晉升為「{CAREERS[g.pos + 1]?.title}」。尚缺：{out.need.items.filter((i: any) => !i.ok).map((i: any) => i.label).join('；')}。可到「職涯」頁分配技能點、進修或跨部門支援，或重新挑戰任務取得認證。</div>}
            <div className="row end">
              <Btn onClick={() => { setStage('intro'); setPanel(0); setRes(null); setOpt(null); setOut(null); setKey(key + 1); }}>重新挑戰</Btn>
              {ch.game === 'phoenix' ? <Btn kind="primary" onClick={() => go('report')}>查看改善成果報告 ▶</Btn> : <Btn kind="primary" onClick={() => go('map')}>回到工廠地圖 ▶</Btn>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ================= 事件 =================
function EventModal() {
  const { g, set, sfx } = React.useContext(GameCtx);
  const ev = EVENTS.find((e) => e.id === g.pendingEvent);
  const [res, setRes] = useState<any>(null);
  if (!ev) return null;
  const choose = (i: number) => {
    const o = ev.options[i];
    const before = simulateWeek(g.factory, g.seed + g.week);
    const short = (o.effect.funds || 0) < 0 && g.funds < -(o.effect.funds || 0);
    let n = applyEff(g, o.effect);
    if (short) n.trust = { ...n.trust, mgmt: n.trust.mgmt - 2 };
    const after = simulateWeek(n.factory, g.seed + g.week);
    n.eventsSeen = [...n.eventsSeen, ev.id];
    n.decisions = [...n.decisions, { week: n.week, title: ev.title, choice: o.label }];
    n.journal = [...n.journal, { week: n.week, title: `事件：${ev.title}`, text: `處置：${o.label}` }];
    n.history = [...n.history, snapshot(n.factory, n.week, ev.title, n.seed)];
    setRes({ o, before, after, short, trust: o.effect.trust, brand: o.effect.brand });
    set(() => n); sfx('click');
  };
  return (
    <Modal title={<>⚡ 工廠事件：{ev.title}</>} wide>
      {!res ? <>
        <Bubble npc={ev.npc} text={ev.desc} mood="worried" />
        <div className="opts col">{ev.options.map((o, i) => <button key={i} className="opt" onClick={() => choose(i)}><b>{o.label}</b><small><br />{o.desc}{o.effect.funds ? `・即時成本 ${fmt.nt(-o.effect.funds)}` : ''}{(o.effect.funds || 0) < 0 && g.funds < -(o.effect.funds || 0) ? '（經費不足，將申請追加預算：經營管理信任 −2）' : ''}</small></button>)}</div>
        <p className="small muted">每個選擇都會改變工廠參數，並可能影響之後出現的事件。</p>
      </> : <>
        <p>你選擇：<b>{res.o.label}</b></p>
        <div className="grid4">
          <Kpi label="即時成本" value={res.o.effect.funds ? fmt.nt(-res.o.effect.funds) : 'NT$0'} />
          <Kpi label="預期產量" value={fmt.n(res.after.goodTotal)} delta={`${res.after.goodTotal - res.before.goodTotal >= 0 ? '+' : ''}${fmt.n(res.after.goodTotal - res.before.goodTotal)}`} />
          <Kpi label="品質風險 PPM" value={res.after.ppm.toFixed(0)} delta={`${res.after.ppm - res.before.ppm >= 0 ? '+' : ''}${(res.after.ppm - res.before.ppm).toFixed(0)}`} />
          <Kpi label="設備 OEE" value={fmt.pct(res.after.oee)} delta={`${((res.after.oee - res.before.oee) * 100).toFixed(1)}pt`} />
          <Kpi label="員工疲勞" value={res.after.fatigue.toFixed(0)} delta={`${res.after.fatigue - res.before.fatigue >= 0 ? '+' : ''}${(res.after.fatigue - res.before.fatigue).toFixed(0)}`} />
          <Kpi label="交期 OTIF" value={fmt.pct(res.after.otif)} delta={`${((res.after.otif - res.before.otif) * 100).toFixed(1)}pt`} />
          <Kpi label="安全指數" value={res.after.safety.toFixed(0)} />
          <Kpi label="客戶信任" value={res.brand ? `${res.brand > 0 ? '+' : ''}${res.brand}` : '±0'} sub={res.trust ? Object.entries(res.trust).map(([k, v]: any) => `${DEPTS[k as Dept]}${v > 0 ? '+' : ''}${v}`).join('、') : ''} />
        </div>
        <div className="row end"><Btn kind="primary" onClick={() => { setRes(null); set((g0) => ({ ...g0, pendingEvent: null })); }}>繼續</Btn></div>
      </>}
    </Modal>
  );
}

// ================= 主程式 =================
const NAV = [
  { id: 'map', n: '工廠地圖', i: '🏭' }, { id: 'mission', n: '任務中心', i: '📋' }, { id: 'dash', n: '數據儀表板', i: '📊' }, { id: 'ai', n: 'AI 研發室', i: '🤖' },
  { id: 'cim', n: 'IE／CIM 中心', i: '🛰' }, { id: 'codex', n: '工程百科', i: '📚' }, { id: 'career', n: '職涯', i: '🎓' }, { id: 'settings', n: '設定', i: '⚙' },
];
export default function App({ onExit }: { onExit?: () => void } = {}) {
  const [g, setG] = useState<GameState | null>(null);
  const [screen, setScreen] = useState<'title' | 'create' | 'game'>('title');
  const [view, setView] = useState<{ v: string; a?: any }>({ v: 'map' });
  const [toasts, setToasts] = useState<{ id: number; s: string }[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);
  const hasSave = useMemo(() => !!slotInfo(0), [screen]);
  useEffect(() => { if (g && screen === 'game') { const t = setTimeout(() => saveSlot(0, g), 400); return () => clearTimeout(t); } }, [g, screen]);
  const toast = (s: string) => { const id = Date.now() + Math.random(); setToasts((t) => [...t, { id, s }]); setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200); };
  const go = (v: string, a?: any) => { setView({ v, a }); mainRef.current?.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); };
  // 供 Android 返回鍵使用：先回地圖／上一畫面
  (window as any).__careerBack = () => { if (screen === 'create') { setScreen('title'); return true; } if (screen === 'game' && view.v !== 'map') { setView({ v: 'map' }); return true; } return false; };
  if (screen === 'title') return <Title onExit={onExit} hasSave={hasSave} onNew={() => setScreen('create')} onContinue={() => { const l = loadSlot(0); if (l) { setG(l); setScreen('game'); setView({ v: 'map' }); } }} onLoad={(s) => { const l = loadSlot(s); if (l) { setG(l); setScreen('game'); setView({ v: 'map' }); } }} />;
  if (screen === 'create' || !g) return <Create onBack={() => setScreen('title')} onStart={(p, m) => { const n = newGame(p, m); setG(n); setScreen('game'); setView(m === 'sandbox' ? { v: 'cim' } : { v: 'mission', a: 0 }); }} />;
  const ctx = { g, set: (fn: (g: GameState) => GameState) => setG((x) => (x ? fn(x) : x)), go, sfx: (t?: any) => g.settings.sound && beep(t), toast };
  const cur = currentChapter(g);
  return (
    <GameCtx.Provider value={ctx}>
      <div className={`app text-${g.settings.text} ${g.settings.motion ? '' : 'nomotion'}`}>
        <header className="top">
          <button className="brand" onClick={() => go('map')}><span className="logo">⬢</span><span><b>從一顆螺絲到一座智慧工廠</b><small>SUMEEKO: Rise of the Smart Factory</small></span></button>
          <div className="top-stats">
            <span className="who" onClick={() => go('career')}><PlayerFace size={34} /><span><b>{g.player.name}</b><small>{CAREERS[g.pos].title}</small></span></span>
            <span className="st"><small>週</small><b>W{g.week}</b></span>
            <span className="st"><small>專案經費</small><b>{fmt.wan(g.funds)}</b></span>
            <span className="st hide-s"><small>聲譽</small><b>{g.brand}</b></span>
            {onExit && <button className="btn sm" onClick={onExit} title="返回 App">⌂ App</button>}
            {g.mode !== 'sandbox' && cur <= FINAL_ID && <button className="btn primary sm" onClick={() => go('mission', cur)}>▶ {CHAPTERS[cur].code}</button>}
          </div>
        </header>
        <nav className="nav">{NAV.map((n) => <button key={n.id} className={view.v === n.id || (n.id === 'cim' && view.v === 'report') ? 'on' : ''} onClick={() => go(n.id)}><span>{n.i}</span><small>{n.n}</small></button>)}</nav>
        <main className="main" ref={mainRef}>
          {view.v === 'map' && <MapView />}
          {view.v === 'mission' && (view.a === undefined ? <MissionList go={go} /> : <MissionView key={view.a} id={view.a} />)}
          {view.v === 'dash' && <Dashboard />}
          {view.v === 'ai' && <AIView />}
          {view.v === 'cim' && <CIMView />}
          {view.v === 'codex' && <CodexView />}
          {view.v === 'career' && <CareerView />}
          {view.v === 'settings' && <SettingsView onRestart={() => { setG(null); setScreen('title'); }} />}
          {view.v === 'report' && <ReportView />}
        </main>
        {g.pendingEvent && view.v !== 'mission' && <EventModal />}
        <div className="toasts">{toasts.map((t) => <div key={t.id} className="toast">{t.s}</div>)}</div>
      </div>
    </GameCtx.Provider>
  );
}
