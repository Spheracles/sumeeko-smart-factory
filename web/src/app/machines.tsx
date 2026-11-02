import React from 'react';
import type { Machine } from './appdata';

// 原創 2.5D SVG 機台插圖：動畫以 CSS 驅動，運轉狀態直接控制 animation-play-state，確保動畫與狀態同步
export const STAGES: Record<string, string[]> = {
  M01: ['送料', '切料', '鐓粗', '預成形', '成形頭部', '出料'], M02: ['送料', '推入', '滾壓成形', '出料'], M03: ['定位', '雙手啟動', '軸向沖壓', '行程量測'],
  M04: ['投料', '加熱', '淬火', '回火', '出爐'], M05: ['前處理', '鍍層／塗層', '水洗', '乾燥固化'], M06: ['送料排列', '多角度拍攝', '影像判定', 'OK／NG 分流'],
  M07: ['取件', '套管組裝', '裝箱計數', '貼追溯標籤', 'AMR 搬運'],
};
const Defs = () => (
  <defs>
    <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d7dee7" /><stop offset=".35" stopColor="#8f9cad" /><stop offset="1" stopColor="#445060" /></linearGradient>
    <linearGradient id="mgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5a6676" /><stop offset=".2" stopColor="#b7c3d2" /><stop offset=".5" stopColor="#eef4fa" /><stop offset=".8" stopColor="#9aa7b8" /><stop offset="1" stopColor="#4c5767" /></linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#36475f" /><stop offset=".55" stopColor="#223043" /><stop offset="1" stopColor="#141d29" /></linearGradient>
    <linearGradient id="side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#151e2a" /><stop offset="1" stopColor="#263446" /></linearGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0c2337" /><stop offset="1" stopColor="#06131f" /></linearGradient>
    <linearGradient id="hot" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#ff7a2e" /><stop offset="1" stopColor="#ffc95e" /></linearGradient>
    <linearGradient id="floorg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a2430" /><stop offset="1" stopColor="#0e151d" /></linearGradient>
    <pattern id="haz" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="12" fill="#F59E38" /><rect x="6" width="6" height="12" fill="#202831" /></pattern>
    <pattern id="grid" width="34" height="18" patternUnits="userSpaceOnUse"><path d="M0 18 H34 M0 0 V18" stroke="#1f2b39" strokeOpacity=".4" /></pattern>
    <radialGradient id="glow"><stop offset="0" stopColor="#36C5E8" stopOpacity=".55" /><stop offset="1" stopColor="#36C5E8" stopOpacity="0" /></radialGradient>
    <radialGradient id="warnGlow"><stop offset="0" stopColor="#f59e38" stopOpacity=".42" /><stop offset="1" stopColor="#f59e38" stopOpacity="0" /></radialGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity=".45" /></filter>
  </defs>
);
// 共用：地板、接觸陰影、控制面板
const Floor = () => <g>
  <path d="M0 246 H560 V290 H0Z" fill="url(#floorg)" />
  <rect x="0" y="246" width="560" height="44" fill="url(#grid)" opacity=".65" />
  <path d="M0 246 H560" stroke="#324358" strokeWidth="2" />
  <path d="M20 264 H540" stroke="url(#haz)" strokeWidth="6" opacity=".82" />
  <ellipse cx="280" cy="262" rx="210" ry="18" fill="#000" opacity=".13" />
</g>;
const Panel = ({ x, y, state }: { x: number; y: number; state: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width="56" height="78" rx="6" fill="#182232" stroke="#4d607a" />
    <rect x="6" y="6" width="44" height="26" rx="3" fill="url(#screen)" stroke="#36C5E8" strokeOpacity=".6" />
    <rect x="9" y="10" width="38" height="6" rx="2" fill="rgba(255,255,255,.08)" />
    <text x="28" y="23" textAnchor="middle" fontSize="8" fill={state === 'estop' || state === 'fault' ? '#E95858' : state === 'running' ? '#38B88A' : state === 'warning' ? '#F59E38' : '#36C5E8'}>{({ running: 'RUN', estop: 'E-STOP', fault: 'FAULT', warning: 'WARN', maintenance: 'LOTO', paused: 'PAUSE' } as any)[state] || 'READY'}</text>
    <circle cx="16" cy="48" r="5.2" fill="#38B88A" /><circle cx="30" cy="48" r="5.2" fill="#AEB8C4" /><circle cx="28" cy="66" r="8.4" fill="#E95858" stroke="#F59E38" strokeWidth="2.5" />
    {state === 'warning' && <circle cx="28" cy="18" r="12" fill="url(#warnGlow)" />}
  </g>
);
function M01({ inside, stage }: any) {
  return (
    <g>
      <g filter="url(#sh)">
        {/* 線材盤 */}
        <ellipse cx="45" cy="200" rx="34" ry="42" fill="none" stroke="#6b5a48" strokeWidth="9" /><ellipse cx="45" cy="200" rx="22" ry="28" fill="none" stroke="#7d6a55" strokeWidth="6" />
        <path d="M70 200 L130 196 L200 190" stroke="#9aa6b4" strokeWidth="4" fill="none" className="anim wire" />
        {/* 送料輪 */}
        <g className="anim spin" style={{ transformOrigin: '110px 198px' }}><circle cx="110" cy="198" r="13" fill="url(#mgs)" /><path d="M110 185 V211 M97 198 H123" stroke="#3a4656" strokeWidth="3" /></g>
        {/* 機體 */}
        <path d="M170 60 L470 60 L500 80 L500 250 L170 250 Z" fill="url(#body)" stroke="#3a4b62" />
        <path d="M470 60 L500 80 L500 250 L470 250Z" fill="url(#side)" />
        <rect x="185" y="72" width="270" height="22" rx="4" fill="url(#mg)" />
        {/* 主滑塊與沖頭 */}
        <g className="anim ram"><rect x="210" y="96" width="220" height="30" rx="3" fill="url(#mgs)" />{[0, 1, 2, 3].map((i) => <rect key={i} x={226 + i * 52} y="126" width="18" height="26" fill="#cfd8e2" stroke="#56606e" />)}</g>
        {/* 模具座 */}
        <rect x="205" y="178" width="230" height="40" rx="3" fill="#3a4656" stroke="#5d6c80" />
        {[0, 1, 2, 3].map((i) => <g key={i}><rect x={222 + i * 52} y="182" width="26" height="32" fill={stage === i + 2 ? '#F59E38' : '#202a37'} stroke="#7a8aa0" /><text x={235 + i * 52} y="232" fontSize="9" textAnchor="middle" fill="#AEB8C4">{i + 1}站</text></g>)}
        {/* 轉送夾爪 */}
        <g className="anim transfer"><rect x="214" y="160" width="40" height="7" rx="2" fill="#F59E38" /><rect x="214" y="160" width="6" height="16" fill="#F59E38" /><rect x="248" y="160" width="6" height="16" fill="#F59E38" /></g>
        {/* 護罩 */}
        <rect x="198" y="140" width="244" height="86" rx="4" fill={inside ? 'rgba(54,197,232,.06)' : 'rgba(150,180,210,.18)'} stroke="#36C5E8" strokeOpacity=".6" strokeDasharray={inside ? '5 4' : undefined} />
        {/* 出料 */}
        <path d="M440 214 L500 236 L520 236" stroke="#8a96a5" strokeWidth="8" fill="none" />
        <g className="anim drop">{[0, 1, 2].map((i) => <g key={i} transform={`translate(${470 + i * 14} 220)`}><rect x="-4" y="0" width="8" height="5" fill="#dfe6ee" /><rect x="-2" y="5" width="4" height="9" fill="#c9d2dc" /></g>)}</g>
        <rect x="490" y="236" width="56" height="18" rx="2" fill="#3b4c63" />
      </g>
      {inside && <g><path d="M300 30 Q330 18 360 30" stroke="#36C5E8" fill="none" /><circle cx="330" cy="40" r="18" fill="none" stroke="#36C5E8" strokeDasharray="4 4" className="anim spin" style={{ transformOrigin: '330px 40px' }} /><text x="330" y="16" textAnchor="middle" fontSize="10" fill="#36C5E8">曲軸驅動（示意）</text></g>}
    </g>
  );
}
function M02({ inside }: any) {
  return (
    <g filter="url(#sh)">
      <path d="M150 40 L460 40 L490 60 L490 250 L150 250Z" fill="url(#body)" stroke="#3a4b62" /><path d="M460 40 L490 60 L490 250 L460 250Z" fill="url(#side)" />
      {/* 送料軌道 */}
      <path d="M30 60 L230 150" stroke="#8a96a5" strokeWidth="10" /><g className="anim feed">{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${60 + i * 40} ${74 + i * 18}) rotate(24)`}><rect x="-6" y="-4" width="12" height="7" fill="#dfe6ee" /><rect x="-3" y="3" width="6" height="14" fill="#c9d2dc" /></g>)}</g>
      {/* 牙板 */}
      <rect x="230" y="96" width="170" height="32" fill="url(#mgs)" stroke="#4a5563" /><text x="315" y="91" fontSize="9" fill="#AEB8C4" textAnchor="middle">固定牙板</text>
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${238 + i * 10} 128 l5 6 l5 -6`} stroke="#3a4656" fill="none" />)}
      <g className="anim slide"><rect x="230" y="170" width="170" height="32" fill="url(#mgs)" stroke="#4a5563" />{Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${238 + i * 10} 170 l5 -6 l5 6`} stroke="#3a4656" fill="none" />)}</g>
      <text x="315" y="216" fontSize="9" fill="#AEB8C4" textAnchor="middle">往復牙板</text>
      {/* 滾動胚料 */}
      <g className="anim roll" style={{ transformOrigin: '300px 150px' }}><circle cx="300" cy="150" r="17" fill="#c9d2dc" stroke="#56606e" /><path d="M300 133 V167 M283 150 H317" stroke="#56606e" /></g>
      {inside && <g><rect x="225" y="88" width="180" height="122" fill="none" stroke="#36C5E8" strokeDasharray="5 4" /><text x="420" y="150" fontSize="10" fill="#36C5E8">塑性變形區</text></g>}
      <path d="M400 180 L470 230" stroke="#8a96a5" strokeWidth="8" /><rect x="450" y="228" width="70" height="24" rx="2" fill="#3b4c63" />
      <rect x="165" y="140" width="58" height="12" fill="#F59E38" className="anim push" />
    </g>
  );
}
function M03({ inside }: any) {
  return (
    <g filter="url(#sh)">
      <path d="M150 30 L260 30 L260 70 L200 70 L200 210 L380 210 L380 250 L150 250Z" fill="url(#body)" stroke="#3a4b62" />
      <rect x="150" y="30" width="230" height="40" rx="4" fill="url(#body)" stroke="#3a4b62" />
      <g className="anim press"><rect x="270" y="70" width="60" height="50" fill="url(#mgs)" stroke="#4a5563" /><rect x="285" y="120" width="30" height="20" fill="#cfd8e2" /></g>
      <rect x="255" y="185" width="90" height="25" fill="#3a4656" stroke="#5d6c80" />
      <polygon points="285,170 315,170 325,178 315,186 285,186 275,178" fill="#AEB8C4" stroke="#56606e" />
      <g><rect x="390" y="90" width="2" height="150" fill="#E95858" opacity=".7" className="anim blink" /><rect x="235" y="90" width="2" height="150" fill="#E95858" opacity=".7" className="anim blink" /><text x="395" y="86" fontSize="9" fill="#E95858">光柵</text></g>
      <rect x="420" y="80" width="90" height="56" rx="4" fill="#06131f" stroke="#36C5E8" /><polyline points="428,124 445,120 460,96 474,92 490,118 502,122" fill="none" stroke="#38B88A" strokeWidth="2" className="anim trace" />
      <text x="465" y="148" fontSize="9" fill="#AEB8C4" textAnchor="middle">行程／壓力曲線</text>
      {inside && <text x="300" y="163" fontSize="10" fill="#36C5E8" textAnchor="middle">受控局部變形 → 預置扭力</text>}
      <circle cx="210" cy="232" r="9" fill="#38B88A" /><circle cx="370" cy="232" r="9" fill="#38B88A" />
    </g>
  );
}
function M04({ inside }: any) {
  return (
    <g filter="url(#sh)">
      <path d="M20 170 L540 170" stroke="#5d6c80" strokeWidth="10" />
      <g className="anim belt">{Array.from({ length: 18 }, (_, i) => <rect key={i} x={20 + i * 30} y="160" width="10" height="8" rx="2" fill={i > 3 && i < 9 ? '#ff9a4a' : i >= 9 && i < 12 ? '#7b8796' : '#AEB8C4'} />)}</g>
      <path d="M90 60 L270 60 L290 75 L290 168 L90 168Z" fill="url(#body)" stroke="#3a4b62" /><rect x="100" y="100" width="180" height="56" fill={inside ? 'url(#hot)' : '#2a1a14'} opacity={inside ? 0.8 : 1} />
      <text x="190" y="90" textAnchor="middle" fontSize="11" fill="#ffb26b">加熱區</text>
      <rect x="296" y="180" width="80" height="62" rx="3" fill="#0f2033" stroke="#3a4b62" /><text x="336" y="250" fontSize="10" textAnchor="middle" fill="#36C5E8">淬火槽</text>
      <g className="anim bubble">{[0, 1, 2, 3].map((i) => <circle key={i} cx={312 + i * 16} cy={225} r="3" fill="#36C5E8" opacity=".6" />)}</g>
      <path d="M390 80 L520 80 L535 92 L535 168 L390 168Z" fill="url(#body)" stroke="#3a4b62" /><rect x="400" y="110" width="125" height="46" fill={inside ? '#7a4a2a' : '#22191a'} opacity=".8" />
      <text x="462" y="102" textAnchor="middle" fontSize="11" fill="#ffd2a0">回火區</text>
      {[130, 190, 250, 450].map((x, i) => <g key={i}><rect x={x - 18} y="30" width="36" height="18" rx="3" fill="#06131f" stroke="#36C5E8" /><text x={x} y="43" fontSize="9" fill="#36C5E8" textAnchor="middle" className="anim blink">{i < 3 ? 'T' + (i + 1) + ' ●' : 'T4 ●'}</text></g>)}
      <g className="anim steam" opacity=".35">{[0, 1, 2].map((i) => <circle key={i} cx={320 + i * 20} cy={170} r="8" fill="#AEB8C4" />)}</g>
    </g>
  );
}
function M05({ inside }: any) {
  const tanks = [{ x: 70, c: '#2a4a5a', n: '前處理' }, { x: 190, c: '#3a4e6a', n: '鍍層' }, { x: 310, c: '#284858', n: '水洗' }];
  return (
    <g filter="url(#sh)">
      <path d="M40 50 L540 50" stroke="url(#mg)" strokeWidth="10" />
      <g className="anim hoist"><rect x="70" y="56" width="10" height="70" fill="#8a96a5" /><rect x="45" y="126" width="60" height="40" rx="4" fill="none" stroke="#AEB8C4" strokeWidth="3" />{[0, 1, 2].map((i) => <rect key={i} x={52 + i * 18} y="134" width="8" height="24" fill="#dfe6ee" />)}</g>
      {tanks.map((t) => <g key={t.n}><rect x={t.x - 10} y="150" width="110" height="96" rx="4" fill="url(#body)" stroke="#3a4b62" /><rect x={t.x - 4} y="166" width="98" height="74" fill={t.c} opacity=".9" /><text x={t.x + 45} y="262" fontSize="10" fill="#AEB8C4" textAnchor="middle">{t.n}</text></g>)}
      <rect x="430" y="120" width="110" height="126" rx="4" fill="url(#body)" stroke="#3a4b62" /><text x="485" y="262" fontSize="10" fill="#AEB8C4" textAnchor="middle">乾燥固化</text>
      <rect x="440" y="140" width="90" height="50" fill={inside ? 'url(#hot)' : '#2a1f1a'} opacity=".6" />
      <g className="anim drip">{[0, 1, 2].map((i) => <circle key={i} cx={225 + i * 18} cy={150} r="2.5" fill="#36C5E8" />)}</g>
      {inside && <text x="250" y="120" fontSize="10" fill="#36C5E8" textAnchor="middle">原理示意：不提供藥液操作條件</text>}
    </g>
  );
}
function M06({ inside }: any) {
  return (
    <g filter="url(#sh)">
      <ellipse cx="80" cy="170" rx="55" ry="22" fill="#3a4656" stroke="#5d6c80" /><ellipse cx="80" cy="160" rx="50" ry="18" fill="#202a37" /><text x="80" y="210" fontSize="10" fill="#AEB8C4" textAnchor="middle">振動送料盤</text>
      <path d="M130 165 L220 172" stroke="#8a96a5" strokeWidth="6" />
      <ellipse cx="300" cy="178" rx="110" ry="34" fill="rgba(160,210,240,.18)" stroke="#9fd8ee" />
      <g className="anim disc" style={{ transformOrigin: '300px 178px' }}>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={300 + 92 * Math.cos(a)} cy={178 + 28 * Math.sin(a)} r="5" fill={i === 3 ? '#E95858' : '#dfe6ee'} />; })}</g>
      {[250, 330].map((x) => <g key={x}><rect x={x - 12} y="60" width="24" height="34" rx="3" fill="#202831" stroke="#5d6c80" /><circle cx={x} cy="100" r="9" fill="#0b1520" stroke="#36C5E8" /><ellipse cx={x} cy="120" rx="22" ry="6" fill="none" stroke="#36C5E8" strokeWidth="3" className="anim blink" /><path d={`M${x} 110 L${x} 168`} stroke="url(#glow)" strokeWidth="26" opacity=".5" /></g>)}
      <rect x="440" y="50" width="104" height="70" rx="5" fill="#06131f" stroke="#36C5E8" /><text x="452" y="70" fontSize="10" fill="#38B88A">OK  1,284</text><text x="452" y="88" fontSize="10" fill="#E95858">NG  3</text><rect x="452" y="96" width="80" height="14" fill="#122436" /><rect x="452" y="96" width="62" height="14" fill="#36C5E8" className="anim bar" />
      <path d="M410 190 L460 220" stroke="#8a96a5" strokeWidth="6" /><rect x="440" y="220" width="46" height="26" rx="2" fill="#2a5a44" /><text x="463" y="238" fontSize="9" textAnchor="middle" fill="#dfe">OK</text>
      <rect x="494" y="220" width="46" height="26" rx="2" fill="#5a2a2a" /><text x="517" y="238" fontSize="9" textAnchor="middle" fill="#fdd">NG</text>
      <g className="anim puff"><path d="M398 168 l26 -8" stroke="#AEB8C4" strokeWidth="2" strokeDasharray="3 3" /></g>
      {inside && <text x="300" y="232" fontSize="10" fill="#36C5E8" textAnchor="middle">背光穿透玻璃轉盤 → 輪廓尺寸量測</text>}
    </g>
  );
}
function M07({ inside }: any) {
  return (
    <g filter="url(#sh)">
      <rect x="40" y="70" width="230" height="180" rx="4" fill="none" stroke="#F59E38" strokeDasharray="8 5" /><text x="50" y="64" fontSize="10" fill="#F59E38">機械手臂作業區（圍籬＋門連鎖）</text>
      <rect x="120" y="215" width="60" height="35" rx="4" fill="url(#body)" stroke="#3a4b62" />
      <g className="anim arm" style={{ transformOrigin: '150px 215px' }}><rect x="142" y="140" width="16" height="78" rx="6" fill="url(#mgs)" /><g className="anim arm2" style={{ transformOrigin: '150px 145px' }}><rect x="150" y="138" width="80" height="14" rx="6" fill="url(#mgs)" /><path d="M228 140 l12 -6 M228 150 l12 6" stroke="#F59E38" strokeWidth="4" /></g></g>
      <path d="M200 232 L520 232" stroke="#5d6c80" strokeWidth="14" /><g className="anim belt">{Array.from({ length: 6 }, (_, i) => <rect key={i} x={210 + i * 52} y="214" width="34" height="18" rx="2" fill="#2f5d8a" stroke="#AEB8C4" />)}</g>
      <rect x="430" y="90" width="110" height="90" rx="4" fill="url(#body)" stroke="#3a4b62" /><text x="485" y="140" fontSize="11" fill="#AEB8C4" textAnchor="middle">自動包裝</text>
      <g className="anim amr"><rect x="300" y="252" width="70" height="18" rx="6" fill="#F59E38" /><circle cx="314" cy="272" r="4" fill="#222" /><circle cx="356" cy="272" r="4" fill="#222" /><rect x="312" y="238" width="46" height="14" fill="#2f5d8a" /></g>
      <g transform="translate(400 150)"><rect width="34" height="22" fill="#f0f4f8" />{[3, 6, 8, 12, 15, 18, 22, 25, 29].map((x) => <rect key={x} x={x} y="4" width={x % 2 ? 1 : 2} height="12" fill="#111" />)}</g>
      {inside && <text x="155" y="110" fontSize="10" fill="#36C5E8" textAnchor="middle">六軸手臂（簡化為兩軸示意）</text>}
    </g>
  );
}
const ART: Record<string, any> = { M01, M02, M03, M04, M05, M06, M07 };

export function MachineArt(p: { m: Machine; state: string; speed: number; view: 'full' | 'inside' | 'station'; stage: number; onPart?: (id: string) => void; sel?: string | null; lowFx?: boolean }) {
  const A = ART[p.m.id];
  const running = p.state === 'running' || p.state === 'warning';
  const st = STAGES[p.m.id];
  return (
    <div className={`mach ${running ? 'on' : ''} ${p.lowFx ? 'lowfx' : ''} state-${p.state} view-${p.view}`} style={{ ['--spd' as any]: Math.max(0.4, p.speed / 85) }}>
      <svg viewBox="0 0 560 290" className="mach-svg" role="img" aria-label={p.m.n}>
        <Defs />
        <rect width="560" height="290" fill="#0e1722" />
        <rect width="560" height="290" fill="url(#glow)" opacity=".14" />
        <path d="M0 0 H560 V40 H0Z" fill="#111c2a" />
        <rect x="0" y="38" width="560" height="4" fill="rgba(54,197,232,.18)" />
        {[80, 240, 400].map((x) => <g key={x}><rect x={x} y="0" width="80" height="6" fill="#2b3a4f" /><ellipse cx={x + 40} cy="10" rx="30" ry="5" fill="#f0f4f8" opacity=".25" /><path d={`M${x + 10} 12 L${x - 20} 250 L${x + 100} 250 L${x + 70} 12Z`} fill="#f0f4f8" opacity={p.lowFx ? 0 : 0.03} /></g>)}
        <Floor />
        {!p.lowFx && <ellipse cx="280" cy="115" rx="168" ry="64" fill="url(#glow)" opacity=".1" />}
        <A inside={p.view === 'inside'} stage={running ? p.stage : -1} />
        <Panel x={500} y={160} state={p.state} />
        <rect x="10" y="12" width="150" height="18" rx="9" fill="rgba(9,19,31,.78)" stroke="rgba(54,197,232,.25)" />
        <text x="85" y="25" textAnchor="middle" fontSize="10" fill="#cfe0f5">{p.m.id}｜{p.m.n}</text>
        {p.state === 'estop' && <g><rect width="560" height="290" fill="rgba(233,88,88,.12)" /><text x="280" y="30" textAnchor="middle" fontSize="16" fontWeight="800" fill="#E95858">⛔ 緊急停止：所有運動已停止</text></g>}
        {p.state === 'maintenance' && <g><rect width="560" height="290" fill="rgba(183,140,255,.08)" /><text x="280" y="30" textAnchor="middle" fontSize="14" fontWeight="800" fill="#B78CFF">🔒 保養中：已上鎖掛牌</text></g>}
        {p.state === 'fault' && <text x="280" y="30" textAnchor="middle" fontSize="14" fontWeight="800" fill="#E95858">✖ 故障停機：{p.m.fault.n}</text>}
        {p.state === 'warning' && <text x="280" y="30" textAnchor="middle" fontSize="14" fontWeight="800" fill="#F59E38">⚠ {p.m.warn.n}</text>}
        {p.view !== 'station' && p.m.parts.map((pt, i) => (
          <g key={pt.id} className={`hot ${p.sel === pt.id ? 'sel' : ''}`} onClick={() => p.onPart && p.onPart(pt.id)} role="button" aria-label={pt.n}>
            <circle cx={pt.x} cy={pt.y} r="11" /><text x={pt.x} y={pt.y + 4} textAnchor="middle">{i + 1}</text>
          </g>
        ))}
      </svg>
      {p.view === 'station' && <div className="stations">{st.map((s, i) => <div key={s} className={`stn-step ${running && p.stage === i ? 'on' : ''} ${p.stage > i ? 'done' : ''}`}><b>{i + 1}</b><span>{s}</span></div>)}</div>}
    </div>
  );
}
// 原創工具圖示（SVG）
export function ToolIcon({ id, size = 64 }: { id: string; size?: number }) {
  const g: Record<string, any> = {
    T01: <g><rect x="8" y="26" width="48" height="6" fill="url(#mgs)" /><path d="M14 26 V12 h5 v14 M46 26 V14 h5 v12" fill="#cfd8e2" stroke="#56606e" /><rect x="34" y="22" width="14" height="14" fill="#AEB8C4" /><path d="M10 32 h44" stroke="#333" strokeDasharray="1 2" /></g>,
    T02: <g><path d="M12 20 a18 18 0 0 0 0 26 h8 a10 10 0 0 1 0 -26z" fill="#F59E38" /><rect x="20" y="28" width="8" height="10" fill="#cfd8e2" /><rect x="34" y="28" width="22" height="10" fill="url(#mgs)" /><rect x="50" y="26" width="8" height="14" fill="#AEB8C4" /></g>,
    T03: <g><circle cx="32" cy="32" r="20" fill="url(#mgs)" /><circle cx="32" cy="32" r="9" fill="#0e1722" /><circle cx="32" cy="32" r="9" fill="none" stroke="#666" strokeDasharray="2 1" /><text x="32" y="58" fontSize="8" textAnchor="middle" fill="#38B88A">GO</text></g>,
    T04: <g><rect x="28" y="10" width="8" height="30" fill="#2f3a48" /><rect x="26" y="40" width="12" height="14" fill="url(#mgs)" /><path d="M26 44 h12 M26 48 h12 M26 52 h12" stroke="#555" /><rect x="27" y="4" width="10" height="8" fill="url(#mgs)" /></g>,
    T05: <g><rect x="8" y="29" width="40" height="7" rx="3" fill="url(#mgs)" transform="rotate(-20 28 32)" /><circle cx="50" cy="24" r="7" fill="#AEB8C4" stroke="#56606e" /><rect x="10" y="34" width="16" height="9" rx="3" fill="#E95858" transform="rotate(-20 18 38)" /></g>,
    T06: <g><circle cx="32" cy="28" r="17" fill="#f0f4f8" stroke="#AEB8C4" strokeWidth="3" /><path d="M32 28 L42 20" stroke="#E95858" strokeWidth="2" /><rect x="30" y="45" width="4" height="14" fill="url(#mgs)" /></g>,
    T07: <g><rect x="10" y="30" width="44" height="22" rx="3" fill="#3a4656" />{[0, 1, 2, 3].map((i) => <circle key={i} cx={17 + i * 10} cy="41" r="4" fill="#AEB8C4" />)}<rect x="14" y="14" width="8" height="16" fill="url(#mgs)" /><rect x="30" y="18" width="8" height="12" fill="url(#mgs)" /></g>,
    T08: <g><rect x="12" y="14" width="40" height="34" rx="3" fill="#E95858" /><path d="M14 26 h36 M14 37 h36" stroke="#7a2a2a" /><circle cx="18" cy="52" r="4" fill="#222" /><circle cx="46" cy="52" r="4" fill="#222" /></g>,
    T09: <g><rect x="10" y="12" width="44" height="34" rx="5" fill="#202831" stroke="#F59E38" strokeWidth="2" /><rect x="15" y="17" width="34" height="24" fill="#0b2235" /><path d="M18 36 l6 -8 l6 4 l8 -10" stroke="#36C5E8" fill="none" /></g>,
    T10: <g><rect x="16" y="8" width="32" height="46" rx="3" fill="#f0f4f8" />{[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M20 ${18 + i * 7} h24`} stroke="#AEB8C4" />)}<rect x="22" y="5" width="20" height="6" rx="2" fill="#56606e" /></g>,
    T11: <g><path d="M14 18 h30 l6 12 h-30z" fill="#F59E38" /><rect x="22" y="30" width="10" height="22" rx="3" fill="#202831" /><path d="M50 30 l8 8" stroke="#E95858" strokeWidth="2" /></g>,
  };
  return <svg viewBox="0 0 64 64" width={size} height={size} className="tool-ico"><Defs />{g[id]}</svg>;
}
