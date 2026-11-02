import React, { useMemo, useState } from 'react';
import { Btn, Card, Kpi, Meter, Modal, Bars, Lines, Legend, Tag, SimTag, NpcFace, PlayerFace, Face, LOOKS, useG, Bubble, Hint } from './ui/common';
import { simulateWeek, STATION_INFO, STATION_ORDER, PRODUCTS, ProductId, StationId, fmt, COST_LABELS, evaluatePhoenix, PHOENIX_OPTIONS, endingOf, baseFactory, applyEffect, phoenixFactory, PHOENIX_SEED, mulberry32 } from './sim';
import { CAREERS, BRANCHES, Branch, DEPTS, Dept, CHAPTERS, CODEX, PATENTS, ACHIEVEMENTS, ENDINGS, NPCS, EVENTS, FINAL_ID } from './data';
import { GameState, chapterUnlocked, currentChapter, promotionCheck, saveSlot, loadSlot, slotInfo, exportCode, importCode, applyEff, snapshot, checkAchievements, passLine, EDU, TALENT, ASPIRE } from './state';
import { AILab } from './games/ai';
import { PhoenixGame } from './games/cim';

// ================= 工廠地圖 =================
export const AREAS = [
  { id: 1, n: '原料及供應鏈區', d: '盤元進料、IQC、批號與材證管理。盤元由上游鋼廠供應。', st: [] as StationId[], gx: 0, gy: 0 },
  { id: 2, n: '球化／材料前處理區', d: '球化退火、酸洗皮膜等前處理（順序依鋼種與路徑而異）。', st: [], gx: 1, gy: 0 },
  { id: 3, n: '伸線區', d: '控制線徑與表面，供冷鍛使用。', st: ['draw'] as StationId[], gx: 2, gy: 0 },
  { id: 4, n: '冷鍛／打頭區', d: '多工位打頭機成形螺絲頭部與螺帽。', st: ['forge'] as StationId[], gx: 3, gy: 0 },
  { id: 5, n: '搓牙／攻牙區', d: '螺栓外螺紋搓牙、螺帽內螺紋攻牙。初始瓶頸所在。', st: ['thread'] as StationId[], gx: 3, gy: 1 },
  { id: 6, n: '熱處理區', d: '批次爐淬火回火，特殊製程。', st: ['heat'] as StationId[], gx: 2, gy: 1 },
  { id: 7, n: '表面處理區', d: '鍍層與塗層，影響防蝕與摩擦係數。', st: ['surface'] as StationId[], gx: 1, gy: 1 },
  { id: 8, n: '二次加工及組裝區', d: '軸向沖壓、塗膠、套管組裝等。', st: ['secondary', 'assembly'] as StationId[], gx: 0, gy: 1 },
  { id: 9, n: '光學檢驗及品保實驗室', d: '光學篩選、硬度、扭力與尺寸檢驗。', st: ['optical'] as StationId[], gx: 0, gy: 2 },
  { id: 10, n: '包裝倉儲及出貨區', d: '成品包裝、儲位、出貨。', st: [], gx: 1, gy: 2 },
  { id: 11, n: '生產管理及物料控制中心', d: '排程、MRP、產銷協調。', st: [], gx: 2, gy: 2 },
  { id: 12, n: 'AI 研發室及 CIM 智慧控制中心', d: 'AI 專案、系統整合、數位孿生。', st: [], gx: 3, gy: 2 },
];
const ROUTE_AREAS: Record<ProductId, number[]> = { HB: [1, 2, 3, 4, 5, 6, 7, 9, 10], PTN: [1, 2, 3, 4, 5, 6, 8, 7, 9, 10], CSS: [1, 3, 4, 5, 6, 7, 8, 9, 10] };
const iso = (gx: number, gy: number) => ({ x: 372 + (gx - gy) * 108, y: 78 + (gx + gy) * 60 });
function areaUnlocked(g: GameState, id: number) {
  if (g.mode === 'sandbox') return true;
  const firstCh = CHAPTERS.find((c) => c.area === id);
  if ([2, 3, 10].includes(id)) return !!g.done[0];
  if (!firstCh) return true;
  return chapterUnlocked(g, firstCh.id) || !!g.done[firstCh.id];
}
export function MapView() {
  const { g, go } = useG();
  const [sel, setSel] = useState<number | null>(null);
  const [route, setRoute] = useState<ProductId | null>(null);
  const sim = useMemo(() => simulateWeek(g.factory, g.seed + g.week), [g.factory, g.week]);
  const cur = currentChapter(g);
  const curArea = CHAPTERS[cur]?.area;
  const flow = route ? ROUTE_AREAS[route] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const pts = flow.map((id) => { const a = AREAS.find((x) => x.id === id)!; const p = iso(a.gx, a.gy); return `${p.x},${p.y}`; }).join(' ');
  const A = sel ? AREAS.find((a) => a.id === sel)! : null;
  return (
    <div className="map-wrap">
      <Card title="世德智慧工廠（虛構示意廠區）" right={<div className="row sm wrap"><span className="muted small">顯示途程：</span>{(Object.keys(PRODUCTS) as ProductId[]).map((p) => <button key={p} className={`opt sm ${route === p ? 'on' : ''}`} onClick={() => setRoute(route === p ? null : p)}>{PRODUCTS[p].name}</button>)}</div>}>
        <div className="map-scroll"><svg viewBox="0 0 800 420" className={`isomap ${g.settings.motion ? 'anim' : ''}`}>
          <defs>
            <linearGradient id="top" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#2b4778" /><stop offset="1" stopColor="#14264a" /></linearGradient>
            <linearGradient id="topOn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffb24d" /><stop offset="1" stopColor="#b55d00" /></linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <polygon points={`${iso(-0.6, -0.6).x},${iso(-0.6, -0.6).y} ${iso(3.6, -0.6).x},${iso(3.6, -0.6).y} ${iso(3.6, 2.6).x},${iso(3.6, 2.6).y} ${iso(-0.6, 2.6).x},${iso(-0.6, 2.6).y}`} fill="#0d1a33" stroke="#1f3a66" />
          {AREAS.map((a) => {
            const p = iso(a.gx, a.gy); const un = areaUnlocked(g, a.id);
            const st = sim.stations.filter((s) => a.st.includes(s.id));
            const load = st.length ? Math.max(...st.map((s) => s.load)) : 0;
            const isB = a.st.includes(sim.bottleneck);
            const inRoute = flow.includes(a.id);
            const w = 42, hgt = un ? 18 + (st.length ? Math.min(1.3, load) * 18 : 8) : 6;
            const top = `${p.x},${p.y - hgt - 26} ${p.x + w * 1.9},${p.y - hgt} ${p.x},${p.y - hgt + 26} ${p.x - w * 1.9},${p.y - hgt}`;
            return (
              <g key={a.id} className={`zone-g ${sel === a.id ? 'sel' : ''} ${route && !inRoute ? 'dim' : ''}`} onClick={() => setSel(a.id)} style={{ cursor: 'pointer' }}>
                <polygon points={`${p.x - w * 1.9},${p.y - hgt} ${p.x},${p.y - hgt + 26} ${p.x},${p.y + 26} ${p.x - w * 1.9},${p.y}`} fill={un ? '#1a2f55' : '#131c2e'} />
                <polygon points={`${p.x + w * 1.9},${p.y - hgt} ${p.x},${p.y - hgt + 26} ${p.x},${p.y + 26} ${p.x + w * 1.9},${p.y}`} fill={un ? '#10203f' : '#0e1524'} />
                <polygon points={top} fill={a.id === curArea ? 'url(#topOn)' : un ? 'url(#top)' : '#1a2130'} stroke={isB ? '#ff5d73' : sel === a.id ? '#39d5ff' : '#3c5c90'} strokeWidth={isB || sel === a.id ? 3 : 1} filter={isB ? 'url(#glow)' : undefined} />
                <text x={p.x} y={p.y - hgt + 4} textAnchor="middle" className="zl2">{a.id}. {a.n.length > 9 ? a.n.slice(0, 8) + '…' : a.n}</text>
                {!un && <text x={p.x} y={p.y - hgt + 22} textAnchor="middle" className="lock">🔒</text>}
                {un && st.length > 0 && <text x={p.x} y={p.y - hgt + 20} textAnchor="middle" className={`ld ${load > 1 ? 'hot' : ''}`}>負荷 {(load * 100).toFixed(0)}%</text>}
                {a.id === curArea && <text x={p.x} y={p.y - hgt - 30} textAnchor="middle" className="mission-pin">▼ 目前任務</text>}
              </g>
            );
          })}
          <polyline points={pts} className="flowline" />
        </svg></div>
        <div className="zone-list">{AREAS.map((a) => <button key={a.id} className={`opt sm ${sel === a.id ? 'on' : ''}`} onClick={() => setSel(a.id)}>{a.id === curArea ? '▼ ' : ''}{a.id}. {a.n}{areaUnlocked(g, a.id) ? '' : ' 🔒'}</button>)}</div>
        <Legend items={[{ name: '目前任務區', color: '#ff9a3c' }, { name: '瓶頸站（紅框）', color: '#ff5d73' }, { name: '物料／WIP 流向', color: '#39d5ff' }]} />
      </Card>
      {A && (
        <Card title={`${A.id}. ${A.n}`} right={<button className="x" aria-label="關閉" onClick={() => setSel(null)}>✕</button>} className="zone-panel">
          <p>{A.d}</p>
          {!areaUnlocked(g, A.id) && <div className="warnbox">隨職涯進度解鎖。</div>}
          {sim.stations.filter((s) => A.st.includes(s.id)).map((s) => (
            <div key={s.id} className="metric-list">
              <div><span>{STATION_INFO[s.id].name}（{STATION_INFO[s.id].en}）</span><b>{s.id === sim.bottleneck ? '🔴 瓶頸' : ''}</b></div>
              <div><span>負荷率</span><b className={s.load > 1 ? 'red' : ''}>{fmt.pct(s.load, 0)}</b></div>
              <div><span>OEE（A×P×Q）</span><b>{fmt.pct(s.avail, 0)} × {fmt.pct(s.perf, 0)} × {fmt.pct(s.qual, 1)} ＝ {fmt.pct(s.oee)}</b></div>
              <div><span>週期時間（每顆）</span><b>{s.ctSec.toFixed(2)} 秒</b></div>
              <div><span>機台數</span><b>{g.factory.stations[s.id].machines}</b></div>
            </div>
          ))}
          <p className="small muted">經過此區的產品：{(Object.keys(PRODUCTS) as ProductId[]).filter((p) => ROUTE_AREAS[p].includes(A.id)).map((p) => PRODUCTS[p].name).join('、') || '—（管理／支援單位）'}</p>
          <div className="row wrap">
            {CHAPTERS.filter((c) => c.area === A.id && c.id < FINAL_ID).map((c) => <Btn key={c.id} small kind={c.id === cur ? 'primary' : undefined} disabled={!chapterUnlocked(g, c.id) && !g.done[c.id]} onClick={() => go('mission', c.id)}>{c.code}｜{c.title}{g.done[c.id]?.tries ? ` ✔${g.done[c.id].best}` : ''}</Btn>)}
            {A.id === 12 && <><Btn small onClick={() => go('ai')}>AI 研發室</Btn><Btn small onClick={() => go('cim')}>CIM 控制中心</Btn></>}
            {A.id === 11 && <Btn small onClick={() => go('dash')}>工廠儀表板</Btn>}
          </div>
        </Card>
      )}
    </div>
  );
}

// ================= 儀表板 =================
export function Dashboard() {
  const { g } = useG();
  const r = useMemo(() => simulateWeek(g.factory, g.seed + g.week), [g.factory, g.week]);
  const h = g.history;
  const costData = Object.entries(r.costs).map(([k, v]) => ({ label: COST_LABELS[k].slice(0, 2), v: v / 1e4, color: '#39d5ff' }));
  return (
    <div>
      <div className="row between wrap"><h2>工廠數據儀表板・第 {g.week} 週</h2><SimTag /></div>
      <div className="kpi-grid">
        <Kpi label="產出量 Throughput" value={fmt.n(r.goodTotal)} sub={`需求 ${fmt.n(r.demandTotal)}`} />
        <Kpi label="良率 Yield" value={fmt.pct(r.yieldPct)} /><Kpi label="一次直通良率 RTY" value={fmt.pct(r.rty)} sub="各站 FPY 乘積" />
        <Kpi label="全線 OEE" value={fmt.pct(r.oee)} good={r.oee > 0.8 ? true : null} />
        <Kpi label="可用率（瓶頸站）" value={fmt.pct(r.stations.find((s) => s.id === r.bottleneck)!.avail)} />
        <Kpi label="利用率（瓶頸站）" value={fmt.pct(r.stations.find((s) => s.id === r.bottleneck)!.util)} />
        <Kpi label="在製品 WIP" value={fmt.n(r.wip)} sub="顆" /><Kpi label="瓶頸週期時間" value={`${r.stations.find((s) => s.id === r.bottleneck)!.ctSec.toFixed(2)} s`} />
        <Kpi label="製造前置時間" value={`${r.leadDays.toFixed(2)} 天`} sub={`Little：${fmt.n(r.wip)} ÷ ${fmt.n(r.throughputRate)}/h`} />
        <Kpi label="OTIF" value={fmt.pct(r.otif)} good={r.otif >= 0.95 ? true : r.otif < 0.85 ? false : null} />
        <Kpi label="客戶 PPM" value={r.ppm.toFixed(0)} good={r.ppm <= 150 ? true : r.ppm > 400 ? false : null} />
        <Kpi label="單位良品成本" value={`NT$${r.costPerGood.toFixed(2)}`} />
        <Kpi label="存貨持有成本" value={fmt.nt(r.costs.holding)} sub="每週" /><Kpi label="單位能耗" value={`${r.energyPerUnit.toFixed(3)} kWh`} />
        <Kpi label="停機時間" value={`${r.downtimeH.toFixed(0)} h`} sub="各站合計" />
        <Kpi label="安全指數／疲勞" value={`${r.safety.toFixed(0)}／${r.fatigue.toFixed(0)}`} good={r.safety >= 80 ? true : r.safety < 60 ? false : null} />
        <Kpi label="客戶滿意度" value={r.satisfaction.toFixed(0)} /><Kpi label="企業信任與聲譽" value={g.brand.toFixed(0)} />
      </div>
      <div className="grid2">
        <Card title="各站負荷與 OEE"><Bars data={r.stations.map((s) => ({ label: STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.id === r.bottleneck ? '#ff5d73' : '#39d5ff' }))} line={1} lineLabel="產能 100%" fmtv={(v) => `${(v * 100).toFixed(0)}%`} />
          <div className="tbl-wrap"><table className="tbl sm"><thead><tr><th>站別</th><th>A</th><th>P</th><th>Q</th><th>OEE</th><th>kWh</th></tr></thead><tbody>{r.stations.map((s) => <tr key={s.id} className={s.id === r.bottleneck ? 'ng' : ''}><td>{STATION_INFO[s.id].name}</td><td>{fmt.pct(s.avail, 0)}</td><td>{fmt.pct(s.perf, 0)}</td><td>{fmt.pct(s.qual, 1)}</td><td>{fmt.pct(s.oee)}</td><td>{fmt.n(s.kWh)}</td></tr>)}</tbody></table></div></Card>
        <Card title={`每週成本結構（合計 ${fmt.wan(r.totalCost)}）`}><Bars data={costData} fmtv={(v) => v.toFixed(0)} h={200} /><p className="small muted center">單位：萬元・{Object.entries(COST_LABELS).map(([k, v]) => v).join('／')}</p></Card>
      </div>
      {h.length > 1 && <Card title="KPI 趨勢（每次任務／事件後）">
        <Legend items={[{ name: 'OEE', color: '#39d5ff' }, { name: 'OTIF', color: '#7cf29c' }, { name: '良率', color: '#ffd23f' }]} />
        <Lines labels={h.map((x) => `W${x.week}`)} series={[{ name: 'OEE', color: '#39d5ff', values: h.map((x) => x.oee * 100) }, { name: 'OTIF', color: '#7cf29c', values: h.map((x) => x.otif * 100) }, { name: '良率', color: '#ffd23f', values: h.map((x) => x.yieldPct * 100) }]} fmtv={(v) => `${v.toFixed(0)}%`} />
        <Lines labels={h.map((x) => `W${x.week}`)} series={[{ name: '單位成本', color: '#ff9a3c', values: h.map((x) => x.cost) }]} fmtv={(v) => `$${v.toFixed(1)}`} h={150} />
      </Card>}
      <Card title="計算規則說明"><ul className="small">
        <li>OEE ＝ 可用率 × 效能 × 品質；全線 OEE 以各站運轉時數加權。</li><li>RTY ＝ 各站 FPY 的乘積；各站先依可用工時與產能計算處理量，再扣報廢、重工品回流，不重複套用品質係數。</li>
        <li>產出受瓶頸產能、上游供料、停機與製程順序限制；改善非瓶頸不會讓產出無條件增加。</li><li>WIP ＝ 產出率 × 流程時間（Little's Law）；CAPEX 以 260 週折舊，OPEX 每週計入。</li></ul></Card>
    </div>
  );
}

// ================= 職涯 =================
export function CareerView() {
  const { g, set, sfx, toast } = useG();
  const next = g.pos + 1;
  const pc = promotionCheck(g, next);
  const [msg, setMsg] = useState('');
  const promote = () => {
    if (!pc.ok) return;
    set((g0) => ({ ...g0, pos: next, posHistory: [...g0.posHistory, { pos: next, week: g0.week }], freePts: g0.freePts + 2, journal: [...g0.journal, { week: g0.week, title: `晉升：${CAREERS[next].title}`, text: '通過技能、認證與專案實績審查。' }] }));
    sfx('level'); toast(`🎉 晉升為 ${CAREERS[next].title}`);
  };
  const train = (b: Branch) => {
    set((g0) => ({ ...g0, skills: { ...g0.skills, [b]: Math.min(100, g0.skills[b] + (g0.mode === 'engineer' ? 4 : 5)) }, week: g0.week + 2, journal: [...g0.journal, { week: g0.week, title: `進修：${BRANCHES[b].name}`, text: '完成兩週在職訓練課程。' }] }));
    setMsg(`完成 ${BRANCHES[b].name} 進修（耗時 2 週）`);
  };
  return (
    <div>
      <div className="grid-career">
        <Card title="主角個人中心">
          <div className="row"><PlayerFace size={96} /><div><h2>{g.player.name}</h2><div className="pos">{CAREERS[g.pos].title}</div><small className="muted">{CAREERS[g.pos].en}</small>
            <div className="small">年資 {(g.week / 52).toFixed(1)} 年（第 {g.week} 週）・{EDU[g.player.edu].label}・專長 {TALENT[g.player.talent].label}・志向 {ASPIRE[g.player.aspiration].label}</div>
            <div className="small">專案經費 {fmt.nt(g.funds)}・聲譽 {g.brand}・平均任務分數 {Object.values(g.done).length ? ((Object.values(g.done) as any[]).reduce((a, b) => a + b.best, 0) / Object.values(g.done).length).toFixed(0) : '—'}</div></div></div>
        </Card>
        <Card title={`升遷條件：${CAREERS[next]?.title || '已達最高職位'}`}>
          {CAREERS[next] ? <>
            <ul className="req">{pc.items.map((i) => <li key={i.label} className={i.ok ? 'ok' : 'ng'}>{i.ok ? '✅' : '⬜'} {i.label}</li>)}</ul>
            <Btn kind="primary" disabled={!pc.ok} onClick={promote}>申請升遷審查</Btn>
            <p className="small muted">單純累積年資不會自動升職；需技能、認證、任務績效與同事信任。</p>
          </> : <p>你已成為系統級工程師。</p>}
        </Card>
      </div>
      <Card title="技能樹（0～100）" right={g.freePts > 0 ? <Tag color="var(--orange)">可分配技能點 {g.freePts}</Tag> : null}>
        <div className="skills">{(Object.keys(BRANCHES) as Branch[]).map((b) => (
          <div key={b} className="skill">
            <div className="row between"><b style={{ color: BRANCHES[b].color }}>{BRANCHES[b].name}</b><span>{g.skills[b]}</span></div>
            <Meter v={g.skills[b]} max={100} color={BRANCHES[b].color} />
            <small className="muted">{BRANCHES[b].items}</small>
            <div className="row sm">{g.freePts > 0 && <Btn small onClick={() => set((g0) => ({ ...g0, freePts: g0.freePts - 1, skills: { ...g0.skills, [b]: Math.min(100, g0.skills[b] + 3) } }))}>＋3（用技能點）</Btn>}
              {g.mode !== 'sandbox' && <Btn small onClick={() => train(b)}>進修 2 週</Btn>}</div>
          </div>
        ))}</div>
        {msg && <div className="goodbox">{msg}</div>}
      </Card>
      <div className="grid2">
        <Card title="跨部門信任">{(Object.keys(DEPTS) as Dept[]).map((d) => <div key={d} className="row trust-row"><div style={{ flex: 1 }}><Meter label={DEPTS[d]} right={`${g.trust[d]}`} v={Math.max(0, g.trust[d])} max={100} color={g.trust[d] < 0 ? 'var(--red)' : 'var(--purple)'} /></div>{g.mode !== 'sandbox' && <Btn small title="花 2 週協助該部門專案，信任 +4" onClick={() => { set((g0) => ({ ...g0, week: g0.week + 2, trust: { ...g0.trust, [d]: Math.min(100, g0.trust[d] + 4) }, journal: [...g0.journal, { week: g0.week, title: `跨部門支援：${DEPTS[d]}`, text: '協助對方完成改善專案兩週。' }] })); setMsg(`完成 ${DEPTS[d]} 跨部門支援（耗時 2 週，信任 +4）`); }}>支援 2 週</Btn>}</div>)}<p className="small muted">跨部門支援與進修都會花費時間（週數），但能補足升遷條件。</p></Card>
        <Card title="認證與成就">
          <div className="chips">{g.certs.map((c) => <Tag key={c} color="var(--green)">🎓 {c}</Tag>)}{!g.certs.length && <span className="muted">尚無認證</span>}</div>
          <h4>成就徽章</h4>
          <div className="badges">{Object.entries(ACHIEVEMENTS).map(([k, a]) => <div key={k} className={`badge ${g.achievements.includes(k) ? 'on' : ''}`} title={a.desc}><span>{g.achievements.includes(k) ? '🏅' : '🔒'}</span><b>{a.name}</b><small>{a.desc}</small></div>)}</div>
        </Card>
      </div>
      <Card title="職涯歷程與工作日誌">
        <div className="timeline">{g.posHistory.map((p, i) => <div key={i} className="tl"><b>W{p.week}</b> {CAREERS[p.pos].title}</div>)}</div>
        <div className="tbl-wrap"><table className="tbl sm"><thead><tr><th>章節</th><th>最佳分數</th><th>嘗試</th></tr></thead><tbody>{CHAPTERS.filter((c) => g.done[c.id]?.tries).map((c) => <tr key={c.id}><td>{c.code} {c.title}</td><td>{g.done[c.id].best}</td><td>{g.done[c.id].tries}</td></tr>)}</tbody></table></div>
        <ul className="journal">{[...g.journal].reverse().slice(0, 30).map((j, i) => <li key={i}><b>W{j.week}｜{j.title}</b><br /><small>{j.text}</small></li>)}</ul>
      </Card>
    </div>
  );
}

// ================= 百科 =================
export function CodexView() {
  const { g } = useG();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('全部');
  const [tab, setTab] = useState<'terms' | 'patents' | 'npc' | 'sources'>('terms');
  const cats = ['全部', ...Array.from(new Set(CODEX.map((c) => c.cat)))];
  const list = CODEX.filter((c) => (cat === '全部' || c.cat === cat) && (`${c.zh}${c.en}${c.abbr || ''}${c.def}`.toLowerCase().includes(q.toLowerCase())));
  return (
    <div>
      <div className="tabs">{[['terms', '工程術語'], ['patents', '專利知識卡'], ['npc', '人物誌'], ['sources', '資料來源聲明']].map(([k, n]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k as any)}>{n}</button>)}</div>
      {tab === 'terms' && <Card title={`工業工程百科（已解鎖 ${g.unlockedCodex.length}／${CODEX.length}）`}>
        <div className="row wrap"><input className="search" placeholder="搜尋：OEE、節拍、RAG…" value={q} onChange={(e) => setQ(e.target.value)} />{cats.map((c) => <button key={c} className={`opt sm ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
        <div className="codex">{list.map((c) => { const un = g.unlockedCodex.includes(c.id); return (
          <div key={c.id} className={`term ${un ? '' : 'locked'}`}><div className="row between"><b>{c.zh}</b><Tag>{c.cat}</Tag></div><small className="en">{c.en}{c.abbr ? `, ${c.abbr}` : ''}</small><p>{un ? c.def : '🔒 隨章節進度解鎖'}</p></div>); })}</div>
      </Card>}
      {tab === 'patents' && <div className="grid2">{PATENTS.map((p) => (
        <Card key={p.id} title={<>{p.no}｜{p.title}</>} right={<Tag>{p.kind}</Tag>}>
          <div className="pat-c"><h5>✅ 已確認的公開專利內容</h5><ul>{p.confirmed.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="pat-i"><h5>💭 為遊戲教學設計的工程應用推論</h5><ul>{p.inference.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="metric-list"><div><span>相關製程</span><b>{p.process}</b></div><div><span>工程問題</span><b>{p.problem}</b></div><div><span>可延伸 AI 題目</span><b>{p.ai}</b></div></div>
          <p className="small">公開來源：<a href={p.url} target="_blank" rel="noreferrer">{p.url}</a></p>
          <p className="small muted">專利保護特定結構、方法或裝置；不代表整道一般製程屬於該專利，亦不代表公司內部使用任何特定未公開參數。</p>
        </Card>))}</div>}
      {tab === 'npc' && <div className="grid3">{Object.values(NPCS).map((n) => <Card key={n.id}><div className="row"><NpcFace id={n.id} size={64} /><div><b>{n.name}</b><div className="small">{n.role}</div></div></div><p className="small">{n.stance}</p><small className="muted">虛構人物</small></Card>)}</div>}
      {tab === 'sources' && <Card title="資料來源與虛構聲明"><Sources /></Card>}
    </div>
  );
}
export function Sources() {
  return (
    <div className="small">
      <p><b>公開事實</b>：產業背景參考世德工業公開的企業資訊、製造能力、產品分類與公開專利（專利號與名稱）。世德工業為台灣扣件與精密金屬零件企業。</p>
      <ul>
        <li><a href="https://www.sumeeko.com/capability/" target="_blank" rel="noreferrer">世德工業官方製造能力</a>・<a href="https://www.sumeeko.com/production/" target="_blank" rel="noreferrer">產品分類</a>・<a href="https://www.sumeeko.com/history" target="_blank" rel="noreferrer">企業沿革</a></li>
        <li><a href="https://www.104.com.tw/company/acvsce8" target="_blank" rel="noreferrer">世德公開職缺資訊（104）</a></li>
        {PATENTS.map((p) => <li key={p.id}><a href={p.url} target="_blank" rel="noreferrer">{p.no} {p.title}</a></li>)}
      </ul>
      <p><b>虛構模擬</b>：主角、NPC、內部制度、薪資、產能、工廠數據、成本、事件、客戶（「A 車廠」「B 系統供應商」）、內部文件名稱與所有決策結果皆為教育用途之虛構設定，標示「遊戲模擬資料」者不代表世德實際工廠或財務數據。</p>
      <p><b>工程原理</b>：OEE、RTY、Little's Law、SPC、MRP、TCO 等為通用工程方法；遊戲參數經簡化，不可直接套用至實際設備。</p>
      <p><b>AI 功能</b>：所有 AI 均為規則式「教學模擬」，未執行真實模型訓練；遊戲不連接、不操作任何真實工廠或企業系統，不使用外部付費 API。</p>
      <p><b>素材</b>：所有人物、圖示與場景皆為原創 SVG，不使用企業品牌圖像或專有照片。</p>
    </div>
  );
}

// ================= AI 研發室／CIM 控制中心 =================
export function AIView() {
  return <div><h2>AI 研發室</h2><AILab onDone={() => {}} /></div>;
}
export function CIMView() {
  const { g, go } = useG();
  const [twin, setTwin] = useState(false);
  const unlocked = g.cimDone || g.mode === 'sandbox';
  const r = useMemo(() => simulateWeek(g.factory, g.seed + g.week), [g.factory, g.week]);
  const sys = [['設備與感測器', 'PLC／IoT／SCADA', 'MES', 'QMS', 'WMS', 'ERP', 'APS', 'AI 分析', '數位孿生']];
  return (
    <div>
      <h2>IE／CIM 智慧控制中心</h2>
      <Card title="整廠資訊拓樸">
        <div className="flowchips">{sys[0].map((s, i) => <React.Fragment key={s}><span className={`fc ${unlocked ? 'on' : ''}`}>{s}</span>{i < sys[0].length - 1 && <i>→</i>}</React.Fragment>)}</div>
        <p className="small">另含 CMMS（設備維護）、生產履歷與 OT／IT 資安分區。資料一致性：<b>{fmt.pct(g.factory.dataQuality, 0)}</b>・目前瓶頸：<b className="red">{STATION_INFO[r.bottleneck].name}</b>・本週單位成本 NT${r.costPerGood.toFixed(2)}</p>
        {!unlocked && <div className="warnbox">完成第十二章後完整解鎖。</div>}
      </Card>
      <div className="row wrap">
        <Btn kind="primary" disabled={!unlocked} onClick={() => setTwin(!twin)}>{twin ? '收起數位孿生沙盒' : '開啟數位孿生沙盒（自由模擬）'}</Btn>
        <Btn disabled={!(g.mode === 'sandbox' || chapterUnlocked(g, FINAL_ID))} onClick={() => go('mission', FINAL_ID)}>進入終局：鳳凰計畫</Btn>
        {g.final && <Btn onClick={() => go('report')}>查看改善成果報告</Btn>}
      </div>
      {twin && <PhoenixGame sandbox onDone={() => {}} />}
    </div>
  );
}

// ================= 設定 =================
export function runSelfTests() {
  const out: { name: string; ok: boolean; detail: string }[] = [];
  const b = simulateWeek(baseFactory(), 1);
  out.push({ name: '初始瓶頸為搓牙站', ok: b.bottleneck === 'thread', detail: STATION_INFO[b.bottleneck].name });
  const opt = simulateWeek(applyEffect(baseFactory(), { st: { optical: { machines: 1 } } }), 1);
  out.push({ name: '只改善光學（非瓶頸）產出幾乎不變', ok: Math.abs(opt.goodTotal - b.goodTotal) / b.goodTotal < 0.01, detail: `${fmt.n(b.goodTotal)} → ${fmt.n(opt.goodTotal)}` });
  const th = simulateWeek(applyEffect(baseFactory(), { st: { thread: { machines: 1 } } }), 1);
  out.push({ name: '擴充瓶頸可提升產出且瓶頸轉移', ok: th.goodTotal > b.goodTotal * 1.08 && th.bottleneck !== 'thread', detail: `${fmt.n(th.goodTotal)}，新瓶頸 ${STATION_INFO[th.bottleneck].name}` });
  out.push({ name: 'OEE 介於 0～1 且各站 OEE＝A×P×Q', ok: b.oee > 0 && b.oee < 1 && b.stations.every((s) => Math.abs(s.oee - s.avail * s.perf * s.qual) < 1e-9), detail: fmt.pct(b.oee) });
  const little = Math.abs(b.wip - b.throughputRate * b.flowH) < 1e-6;
  out.push({ name: "Little's Law：WIP ＝ 產出率 × 流程時間", ok: little, detail: `${fmt.n(b.wip)} ≈ ${fmt.n(b.throughputRate)} × ${b.flowH.toFixed(1)}h` });
  out.push({ name: '無負產出或負成本', ok: b.goodTotal >= 0 && Object.values(b.costs).every((v) => v >= 0), detail: '通過' });
  const rty = b.stations.filter((s) => s.id !== 'optical').reduce((a, s) => a * s.qual, 1);
  out.push({ name: 'RTY ＝ 各站 FPY 乘積', ok: Math.abs(rty - b.rty) < 1e-9, detail: fmt.pct(b.rty) });
  const feas = evaluatePhoenix(['smed', 'tpm', 'overtime', 'stock', 'source', 'heatBatch', 'data', 'safety']);
  out.push({ name: '鳳凰計畫存在可行解', ok: feas.passed === 7, detail: `${feas.passed}/7` });
  const s1 = simulateWeek(phoenixFactory(), PHOENIX_SEED), s2 = simulateWeek(phoenixFactory(), PHOENIX_SEED);
  out.push({ name: '相同種子結果可重現', ok: s1.goodTotal === s2.goodTotal, detail: fmt.n(s1.goodTotal) });
  const g0: any = { factory: baseFactory(), trust: {}, flags: [], funds: 1000, brand: 50, safetyViolations: 0, week: 1 };
  out.push({ name: '經費不會變成負數', ok: applyEff(g0, { funds: -999999 }).funds === 0, detail: '扣款下限為 0' });
  return out;
}
export function SettingsView({ onRestart }: { onRestart: () => void }) {
  const { g, set, toast } = useG();
  const [code, setCode] = useState('');
  const [imp, setImp] = useState('');
  const [tests, setTests] = useState<ReturnType<typeof runSelfTests> | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [, force] = useState(0);
  const S = g.settings;
  const upd = (k: keyof GameState['settings'], v: any) => set((g0) => ({ ...g0, settings: { ...g0.settings, [k]: v } }));
  return (
    <div className="grid2">
      <Card title="遊戲設定">
        <label className="check"><input type="checkbox" checked={S.sound} onChange={(e) => upd('sound', e.target.checked)} /> 音效</label>
        <label className="check"><input type="checkbox" checked={S.motion} onChange={(e) => upd('motion', e.target.checked)} /> 動態效果</label>
        <label className="check"><input type="checkbox" checked={S.hints} onChange={(e) => upd('hints', e.target.checked)} /> 教學提示</label>
        <div className="row">文字大小：{(['s', 'm', 'l'] as const).map((t) => <button key={t} className={`opt sm ${S.text === t ? 'on' : ''}`} onClick={() => upd('text', t)}>{{ s: '小', m: '中', l: '大' }[t]}</button>)}</div>
        <div className="row">難度：{g.mode === 'sandbox' ? <Tag>沙盒模式</Tag> : (['story', 'engineer'] as const).map((m) => <button key={m} className={`opt sm ${g.mode === m ? 'on' : ''}`} onClick={() => set((g0) => ({ ...g0, mode: m }))}>{m === 'story' ? '故事模式' : '工程師模式'}</button>)}</div>
        <p className="small muted">故事模式：及格 50 分、提示較多；工程師模式：及格 65 分、升遷門檻較嚴。</p>
      </Card>
      <Card title="存檔">
        {[1, 2, 3].map((s) => { const i = slotInfo(s); return (
          <div key={s} className="row between qrow"><span>欄位 {s}：{i ? `${i.name}・${CAREERS[i.pos].title}・W${i.week}・${new Date(i.t).toLocaleString('zh-TW')}` : '（空）'}</span>
            <span><Btn small onClick={() => { toast(saveSlot(s, g) ? `已存到欄位 ${s}` : '此瀏覽器無法存檔，請改用存檔代碼'); force((x) => x + 1); }}>存檔</Btn><Btn small disabled={!i} onClick={() => { const l = loadSlot(s); if (l) { set(() => l); toast('已載入'); } }}>載入</Btn></span></div>); })}
        <p className="small muted">遊戲會自動存檔。若瀏覽器不支援本機儲存，可使用存檔代碼備份。</p>
        <div className="row wrap"><Btn small onClick={() => setCode(exportCode(g))}>產生存檔代碼</Btn>{code && <Btn small onClick={() => { try { navigator.clipboard.writeText(code).then(() => toast('已複製'), () => toast('請手動選取複製')); } catch { toast('請手動選取複製'); } }}>複製代碼</Btn>}</div>
        {code && <textarea readOnly value={code} rows={3} onFocus={(e) => e.target.select()} />}
        <textarea placeholder="貼上存檔代碼以載入" value={imp} onChange={(e) => setImp(e.target.value)} rows={2} />
        <Btn small disabled={!imp} onClick={() => { const l = importCode(imp); if (l) { set(() => l); toast('已從代碼載入'); } else toast('代碼無效'); }}>從代碼載入</Btn>
        <hr />
        {!confirm ? <Btn kind="danger" onClick={() => setConfirm(true)}>重新開始</Btn> : <div className="warnbox">確定放棄目前進度？（存檔欄位不受影響）<div className="row"><Btn kind="danger" onClick={onRestart}>確定重新開始</Btn><Btn onClick={() => setConfirm(false)}>取消</Btn></div></div>}
      </Card>
      <Card title="模擬引擎自我測試（測試案例）">
        <Btn onClick={() => setTests(runSelfTests())}>執行測試</Btn>
        {tests && <ul className="list">{tests.map((t) => <li key={t.name} className={t.ok ? 'good' : 'bad'}>{t.ok ? '✅' : '❌'} {t.name}<br /><small>{t.detail}</small></li>)}</ul>}
      </Card>
      <Card title="資料來源聲明"><Sources /></Card>
    </div>
  );
}

// ================= 終局報告 =================
export function ReportView() {
  const { g, go, set } = useG();
  if (!g.final) return <Card title="尚未完成鳳凰計畫"><Btn onClick={() => go('cim')}>前往 CIM 控制中心</Btn></Card>;
  const ids = g.final.ids;
  const ev = evaluatePhoenix(ids);
  const ending = ENDINGS[g.final.ending];
  const marg = ids.map((id) => {
    const w = evaluatePhoenix(ids.filter((x) => x !== id));
    const o = PHOENIX_OPTIONS.find((x) => x.id === id)!;
    return { o, dGood: ev.after.goodTotal - w.after.goodTotal, dCost: w.after.costPerGood - ev.after.costPerGood, dOee: ev.after.oee - w.after.oee, dPpm: w.after.ppm - ev.after.ppm, dE: w.after.energyPerUnit - ev.after.energyPerUnit };
  });
  const rows: [string, string, string][] = [
    ['全線 OEE', fmt.pct(ev.before.oee), fmt.pct(ev.after.oee)], ['良品產出／週', fmt.n(ev.before.goodTotal), fmt.n(ev.after.goodTotal)],
    ['OTIF', fmt.pct(ev.before.otif), fmt.pct(ev.after.otif)], ['客戶 PPM', ev.before.ppm.toFixed(0), ev.after.ppm.toFixed(0)],
    ['單位良品成本', `NT$${ev.before.costPerGood.toFixed(2)}`, `NT$${ev.after.costPerGood.toFixed(2)}`], ['單位能耗', `${ev.before.energyPerUnit.toFixed(3)} kWh`, `${ev.after.energyPerUnit.toFixed(3)} kWh`],
    ['WIP', fmt.n(ev.before.wip), fmt.n(ev.after.wip)], ['製造前置時間', `${ev.before.leadDays.toFixed(2)} 天`, `${ev.after.leadDays.toFixed(2)} 天`],
    ['疲勞指數', ev.before.fatigue.toFixed(0), ev.after.fatigue.toFixed(0)], ['安全指數', ev.before.safety.toFixed(0), ev.after.safety.toFixed(0)],
    ['瓶頸站', STATION_INFO[ev.before.bottleneck].name, STATION_INFO[ev.after.bottleneck].name],
  ];
  return (
    <div className="report">
      <div className="ending" style={{ borderColor: ending.color }}><div className="end-k">結局</div><h2 style={{ color: ending.color }}>{ending.title}</h2><p>{ending.text}</p><div className="big">{g.final.score}<small> 分</small></div></div>
      <Card title="智慧工廠改善成果報告（Smart Factory Improvement Report）" right={<SimTag />}>
        <ul className="targets">{ev.targets.map((t) => <li key={t.id} className={t.ok ? 'ok' : 'ng'}>{t.ok ? '✅' : '❌'} {t.label}<b>{t.val}</b></li>)}</ul>
        <div className="grid2">
          <div className="tbl-wrap"><table className="tbl"><thead><tr><th>KPI</th><th>改善前</th><th>改善後</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td><b>{r[2]}</b></td></tr>)}</tbody></table></div>
          <div>
            <div className="grid2"><Kpi label="改善投資" value={fmt.wan(ev.cost.total)} sub={`CAPEX ${fmt.wan(ev.cost.capex)}／OPEX ${fmt.wan(ev.cost.opex)}/週`} /><Kpi label="估計年節省" value={fmt.wan(ev.annualSaving)} sub="以改善前單位成本生產同量比較" /></div>
            <div className="grid2"><Kpi label="估計 ROI（年化）" value={ev.cost.total ? (ev.roi > 5 ? '>500%' : fmt.pct(ev.roi, 0)) : '—'} /><Kpi label="客戶滿意度" value={`${ev.before.satisfaction.toFixed(0)} → ${ev.after.satisfaction.toFixed(0)}`} /></div>
            <p className="small">瓶頸轉移：{STATION_INFO[ev.before.bottleneck].name} → {STATION_INFO[ev.after.bottleneck].name}</p>
            <Bars data={ev.after.stations.map((s) => ({ label: STATION_INFO[s.id].name.slice(0, 2), v: s.load, color: s.id === ev.after.bottleneck ? '#ffd23f' : '#39d5ff' }))} line={1} lineLabel="100%" fmtv={(v) => `${(v * 100).toFixed(0)}%`} h={150} />
          </div>
        </div>
      </Card>
      <Card title="各項決策的因果說明（移除該項後的邊際差異）">
        <div className="tbl-wrap"><table className="tbl sm"><thead><tr><th>方案</th><th>產出</th><th>單位成本</th><th>OEE</th><th>PPM</th><th>能耗/顆</th></tr></thead><tbody>{marg.map((m) => <tr key={m.o.id}><td><b>{m.o.name}</b><br /><small className="muted">{m.o.desc}</small></td><td>{m.dGood >= 0 ? '+' : ''}{fmt.n(m.dGood)}</td><td>{m.dCost >= 0 ? '−' : '+'}NT${Math.abs(m.dCost).toFixed(2)}</td><td>{(m.dOee * 100).toFixed(1)}pt</td><td>{m.dPpm >= 0 ? '−' : '+'}{Math.abs(m.dPpm).toFixed(0)}</td><td>{m.dE >= 0 ? '−' : '+'}{Math.abs(m.dE).toFixed(3)}</td></tr>)}</tbody></table></div>
        <p className="small muted">若某方案的產出貢獻接近 0，代表它作用在非瓶頸環節——這正是限制理論（TOC）的核心。</p>
      </Card>
      <Card title="職涯回顧">
        <div className="career-path">{g.posHistory.map((p, i) => <div key={i} className="cp"><PlayerFace size={40} /><div><b>{CAREERS[p.pos].title}</b><small>第 {p.week} 週</small></div></div>)}</div>
        <p>從一顆螺絲的安全作業開始，你走過原料、冷鍛、螺紋、熱處理、組裝檢驗、帶班、生管、品質、採購、資料分析、AI 與 CIM，最終成為能整合人員、設備、物料、資訊、資金與能源的系統級工程師。</p>
        <div className="chips">{g.certs.map((c) => <Tag key={c} color="var(--green)">🎓 {c}</Tag>)}</div>
        <div className="badges">{g.achievements.map((k) => <div key={k} className="badge on"><span>🏅</span><b>{ACHIEVEMENTS[k].name}</b></div>)}</div>
        <div className="row wrap"><Btn kind="primary" onClick={() => go('mission', FINAL_ID)}>重新挑戰鳳凰計畫</Btn><Btn onClick={() => go('career')}>職涯紀錄</Btn></div>
      </Card>
    </div>
  );
}
