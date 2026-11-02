import React from 'react';
import type { Role } from './appdata';

// 第三階段：改良為較具角色識別度的 2.5D 角色立繪
// 仍維持全向量 SVG，方便在 PWA / Android WebView 中直接使用。
export type Angle = 'front' | 'tq' | 'side' | 'back';

export function Person({
  role,
  angle = 'front',
  size = 160,
  act = 'idle',
  skin = '#eac09a',
  hair = '#2a1d16',
}: {
  role: Role;
  angle?: Angle;
  size?: number;
  act?: 'idle' | 'point' | 'check' | 'done' | 'alert';
  skin?: string;
  hair?: string;
}) {
  const accent = role.color || '#36C5E8';
  const isBack = angle === 'back';
  const isSide = angle === 'side';
  const isTq = angle === 'tq';
  const bodyScaleX = isSide ? 0.78 : isTq ? 0.9 : 1;
  const headShift = isSide ? 3 : isTq ? 2 : 0;
  const helmetShift = isSide ? 2 : 0;
  const armR = act === 'point' ? -65 : act === 'done' ? -148 : act === 'alert' ? -105 : act === 'check' ? -34 : -6;
  const armL = act === 'done' ? 24 : act === 'alert' ? -12 : 8;
  const bodyLean = act === 'point' ? -1.5 : act === 'alert' ? -1 : 0;
  const prop = role.pose;
  const gid = role.id.replace(/[^a-z0-9_-]/gi, '');

  const handProp: Record<string, React.ReactNode> = {
    tablet: (
      <g className="person-prop">
        <rect x="-13" y="-10" width="26" height="20" rx="3" fill="#202831" stroke={accent} strokeWidth="1.5" />
        <rect x="-9" y="-6" width="18" height="12" rx="1.5" fill="#0b2235" />
        <circle cx="0" cy="7" r="1.4" fill="#8bdaf0" />
      </g>
    ),
    panel: (
      <g className="person-prop">
        <rect x="-8" y="-7" width="16" height="14" rx="2" fill="#f0f4f8" />
        <path d="M-4 -2 h8 M-4 1 h8 M-4 4 h6" stroke="#56606e" strokeWidth="1.4" />
        <path d="M4 -6 L8 -10" stroke="#202831" strokeWidth="2" />
      </g>
    ),
    die: (
      <g className="person-prop">
        <rect x="-11" y="-8" width="22" height="16" rx="2.5" fill="#56606e" stroke="#aeb8c4" />
        <circle cx="-4" cy="0" r="2.6" fill="#ced7e1" /><circle cx="4" cy="0" r="2.6" fill="#ced7e1" />
      </g>
    ),
    caliper: (
      <g className="person-prop">
        <rect x="-15" y="-2.2" width="30" height="4.4" rx="1" fill="#dfe7f0" />
        <path d="M-12 -2 v-8 h3 v8 M8 -2 v-6 h3 v6" fill="#dfe7f0" stroke="#748192" strokeWidth="0.6" />
      </g>
    ),
    meter: (
      <g className="person-prop">
        <rect x="-8" y="-10" width="16" height="20" rx="3" fill="#F59E38" stroke="#ffe0aa" />
        <rect x="-5.5" y="-7" width="11" height="7" rx="1" fill="#06131f" />
        <circle cx="0" cy="4" r="2.2" fill="#f0f4f8" />
      </g>
    ),
    scanner: (
      <g className="person-prop">
        <path d="M-9 -5 h12 l4 6 h-13z" fill="#F59E38" /><rect x="-4" y="1" width="6" height="11" rx="2" fill="#202831" />
        <path d="M6 -3 l7 -4" stroke="#E95858" strokeWidth="1.8" />
      </g>
    ),
  };

  return (
    <svg
      viewBox="-72 -14 144 246"
      width={size * 0.58}
      height={size}
      className={`person act-${act} angle-${angle}`}
      role="img"
      aria-label={`${role.n}（${angle}）`}
    >
      <defs>
        <linearGradient id={`jkt-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d679c" />
          <stop offset="0.38" stopColor="#23436d" />
          <stop offset="1" stopColor="#132541" />
        </linearGradient>
        <linearGradient id={`trim-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffcb85" />
          <stop offset="1" stopColor="#e98b22" />
        </linearGradient>
        <linearGradient id={`pants-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#29456d" />
          <stop offset="1" stopColor="#14253d" />
        </linearGradient>
        <linearGradient id={`helmet-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcfdff" />
          <stop offset="1" stopColor="#c8d3df" />
        </linearGradient>
        <radialGradient id={`visor-${gid}`} cx="50%" cy="45%" r="70%">
          <stop offset="0" stopColor="rgba(213,245,255,.65)" />
          <stop offset="1" stopColor="rgba(116,175,214,.12)" />
        </radialGradient>
        <linearGradient id={`glove-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8edf5" />
          <stop offset="1" stopColor="#bac7d5" />
        </linearGradient>
        <linearGradient id={`boot-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#353b46" />
          <stop offset="1" stopColor="#111317" />
        </linearGradient>
        <filter id={`shadow-${gid}`} x="-30%" y="-20%" width="160%" height="170%">
          <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity=".38" />
        </filter>
      </defs>

      <ellipse cx="0" cy="220" rx="37" ry="7" fill="#000" opacity=".35" />
      <g filter={`url(#shadow-${gid})`} transform={`translate(0 ${bodyLean}) scale(${bodyScaleX} 1)`}>
        <g className="breathe">
          <g className="legs">
            <path d="M-22 130 L-8 130 L-5 198 Q-11 201 -19 199 Z" fill={`url(#pants-${gid})`} />
            <path d="M8 130 L22 130 L19 199 Q11 201 5 198 Z" fill={`url(#pants-${gid})`} />
            <path d="M-21 166 h15" stroke={`url(#trim-${gid})`} strokeWidth="3.2" />
            <path d="M6 166 h15" stroke={`url(#trim-${gid})`} strokeWidth="3.2" />
            <path d="M-25 198 h21 v10 h-25 q-4 0 -4 -5 q0 -5 8 -5z" fill={`url(#boot-${gid})`} />
            <path d="M4 208 v-10 h21 q8 0 8 5 q0 5 -4 5z" fill={`url(#boot-${gid})`} />
          </g>

          <g className="torso">
            <path d="M-28 61 Q-27 55 -20 51 H20 Q27 55 28 61 L24 134 H-24 Z" fill={`url(#jkt-${gid})`} />
            <path d="M-16 56 Q0 51 16 56" stroke={accent} strokeWidth="3" fill="none" opacity=".95" />
            <path d="M-24 94 H24" stroke={`url(#trim-${gid})`} strokeWidth="4" />
            <path d="M0 56 V133" stroke="#102137" strokeWidth="1.6" strokeDasharray="2 2" />
            <path d="M-19 84 q9 8 18 0" stroke="#5d7fb1" strokeOpacity=".55" fill="none" />
            <path d="M1 84 q9 8 18 0" stroke="#5d7fb1" strokeOpacity=".55" fill="none" />
            <rect x="-16" y="85" width="13" height="15" rx="2.5" fill="#19304c" stroke="#5b7aa0" />
            <rect x="3" y="85" width="13" height="15" rx="2.5" fill="#19304c" stroke="#5b7aa0" />
            {!isBack && (
              <g>
                <rect x="7" y="67" width="13" height="18" rx="2.4" fill="#f0f4f8" />
                <rect x="9.5" y="70" width="8" height="6" rx="1.2" fill={accent} />
                <path d="M13.5 60 V67" stroke={`url(#trim-${gid})`} strokeWidth="2" />
              </g>
            )}
            {isBack && <text x="0" y="82" textAnchor="middle" fontSize="8" fontWeight="800" fill={accent}>SUMEEKO</text>}
            <path d="M-15 133 q15 8 30 0" stroke="#1c3048" strokeWidth="4" />
          </g>

          <g transform={`rotate(${armL} -25 62)`} className="arm-l">
            <path d="M-34 58 q6 -5 12 0 l3 52 q-7 7 -14 0z" fill={`url(#jkt-${gid})`} />
            <rect x="-35" y="108" width="15" height="7" rx="3.5" fill={`url(#trim-${gid})`} />
            <circle cx="-26.5" cy="119" r="6" fill={`url(#glove-${gid})`} />
          </g>
          <g transform={`rotate(${armR} 25 62)`} className="arm-r">
            <path d="M21 58 q6 -5 12 0 l-2 52 q-7 7 -14 0z" fill={`url(#jkt-${gid})`} />
            <rect x="20" y="108" width="15" height="7" rx="3.5" fill={`url(#trim-${gid})`} />
            <circle cx="27.5" cy="119" r="6" fill={`url(#glove-${gid})`} />
            {!isBack && <g transform="translate(27 122)">{handProp[prop]}</g>}
          </g>

          <g className="head" transform={`translate(${headShift} 0)`}>
            <rect x="-7" y="43" width="14" height="14" rx="4" fill={skin} />
            <ellipse cx="0" cy="31" rx={isSide ? 13 : 15.5} ry="17.5" fill={isBack ? hair : skin} />
            {!isBack && (
              <g>
                <path d={isSide ? 'M-10 31 Q-6 14 4 14 Q13 16 13 28 Q10 20 0 21 Q-9 20 -10 31Z' : 'M-15 28 Q-14 14 0 14 Q14 14 15 28 Q10 19 0 20 Q-10 19 -15 28Z'} fill={hair} />
                {!isSide && <><ellipse cx="-5.5" cy="33" rx="1.6" ry="2" fill="#1a1a1a" /><ellipse cx="5.5" cy="33" rx="1.6" ry="2" fill="#1a1a1a" /></>}
                {isSide && <ellipse cx="3.5" cy="33" rx="1.6" ry="2" fill="#1a1a1a" />}
                <path d={act === 'alert' ? 'M-4 42 Q0 40.5 4 42' : isSide ? 'M0 40.5 Q3 42 6 40.5' : 'M-4 40.5 Q0 43.5 4 40.5'} stroke="#7a3a2a" strokeWidth="1.4" fill="none" />
                <rect x="-12" y="28" width="24" height="8" rx="4" fill={`url(#visor-${gid})`} stroke="#d8eef7" strokeWidth="1" />
              </g>
            )}
            <path d={`M${-18 + helmetShift} 24 Q-16 7 0 7 Q16 7 18 24`} fill={`url(#helmet-${gid})`} />
            <rect x={-20 + helmetShift} y="22" width="40" height="4.5" rx="2.2" fill="#c3ceda" />
            <path d="M-7 10 Q0 7 7 10" stroke={accent} strokeWidth="3.2" />
            <rect x={-19 + helmetShift} y="28" width="6" height="12" rx="3" fill={`url(#trim-${gid})`} />
            <rect x={13 + helmetShift} y="28" width="6" height="12" rx="3" fill={`url(#trim-${gid})`} />
          </g>
        </g>
      </g>
      {act === 'done' && <path className="person-spark" d="M44 18 l4 8 l8 2 l-8 2 l-4 8 l-4 -8 l-8 -2 l8 -2z" fill="#ffe08d" opacity=".92" />}
    </svg>
  );
}
