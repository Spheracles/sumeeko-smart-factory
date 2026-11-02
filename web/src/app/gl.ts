// ============================================================
// 輕量 WebGL 工件渲染器：程序化產生真實 3D 幾何（螺旋螺紋、六角頭、螺帽、套管、盤元）
// 不依賴外部函式庫，可離線執行；支援旋轉、縮放、剖面、半透明、材質切換
// ============================================================
import type { Shape, Finish } from './appdata';

type V3 = [number, number, number];
interface Mesh { pos: number[]; nor: number[]; }
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// 參數曲面 → 三角形（法向量以有限差分計算）
function surface(m: Mesh, f: (u: number, v: number) => V3, nu: number, nv: number, flip = false) {
  flip = !flip; // 預設讓 (u 繞軸, v 沿軸向上) 的曲面外側為正面
  const P: V3[][] = [];
  for (let i = 0; i <= nu; i++) { P[i] = []; for (let j = 0; j <= nv; j++) P[i][j] = f(i / nu, j / nv); }
  const N = (i: number, j: number): V3 => {
    const i0 = Math.max(0, i - 1), i1 = Math.min(nu, i + 1), j0 = Math.max(0, j - 1), j1 = Math.min(nv, j + 1);
    const n = norm(cross(sub(P[i1][j], P[i0][j]), sub(P[i][j1], P[i][j0])));
    return flip ? [-n[0], -n[1], -n[2]] : n;
  };
  for (let i = 0; i < nu; i++) for (let j = 0; j < nv; j++) {
    const q: [number, number][] = flip ? [[i, j], [i, j + 1], [i + 1, j + 1], [i, j], [i + 1, j + 1], [i + 1, j]] : [[i, j], [i + 1, j], [i + 1, j + 1], [i, j], [i + 1, j + 1], [i, j + 1]];
    for (const [a, b] of q) { m.pos.push(...P[a][b]); m.nor.push(...N(a, b)); }
  }
}
// 旋轉體（輪廓 r(y)）
function lathe(m: Mesh, prof: [number, number][], seg: number, flip = false) {
  const total = prof.length - 1;
  surface(m, (u, v) => { const k = Math.min(total - 1, Math.floor(v * total)), t = v * total - k; const r = prof[k][0] + (prof[k + 1][0] - prof[k][0]) * t, y = prof[k][1] + (prof[k + 1][1] - prof[k][1]) * t; const a = u * Math.PI * 2; return [r * Math.cos(a), y, r * Math.sin(a)]; }, seg, total * 2, flip);
}
function disk(m: Mesh, y: number, r0: number, r1: number, seg: number, up: boolean) {
  surface(m, (u, v) => { const a = u * Math.PI * 2, r = r0 + (r1 - r0) * v; return [r * Math.cos(a), y, r * Math.sin(a)]; }, seg, 1, up);
}
// 六角柱（含倒角近似）
function hexPrism(m: Mesh, R: number, y0: number, y1: number, chamfer = 0.08) {
  const corner = (k: number): [number, number] => { const a = (Math.PI / 3) * k + Math.PI / 6; return [R * Math.cos(a), R * Math.sin(a)]; };
  for (let k = 0; k < 6; k++) {
    const [x0, z0] = corner(k), [x1, z1] = corner(k + 1);
    const n = norm([(x0 + x1) / 2, 0, (z0 + z1) / 2]);
    const quad = [[x0, y0, z0], [x1, y1, z1], [x1, y0, z1], [x0, y0, z0], [x0, y1, z0], [x1, y1, z1]];
    for (const p of quad) { m.pos.push(...p); m.nor.push(...n); }
  }
  // 上下面（以倒角縮小的圓形近似頂面）
  for (const [y, up] of [[y1, true], [y0, false]] as [number, boolean][]) {
    for (let k = 0; k < 6; k++) {
      const [x0, z0] = corner(k), [x1, z1] = corner(k + 1);
      const tri = up ? [[0, y, 0], [x1, y, z1], [x0, y, z0]] : [[0, y, 0], [x0, y, z0], [x1, y, z1]];
      for (const p of tri) { m.pos.push(...p); m.nor.push(0, up ? 1 : -1, 0); }
    }
  }
  if (chamfer > 0) lathe(m, [[R * 0.99, y1 - 0.001], [R * 0.86, y1 + chamfer * 0.3]], 48);
}
// 外螺紋（真實螺旋）
function threadOuter(m: Mesh, rMaj: number, depth: number, pitch: number, y0: number, y1: number, seg: number) {
  const turns = (y1 - y0) / pitch, nv = Math.ceil(turns * 18);
  surface(m, (u, v) => {
    const a = u * Math.PI * 2, y = y0 + (y1 - y0) * v;
    const ph = ((y - y0) / pitch - u) % 1, t = ph < 0 ? ph + 1 : ph;
    const tri = 1 - Math.abs(t * 2 - 1); // 三角牙型
    const run = Math.min(1, (y1 - y) / (pitch * 1.2)); // 末端倒角
    const r = rMaj - depth + depth * tri * Math.max(0.15, run);
    return [r * Math.cos(a), y, r * Math.sin(a)];
  }, seg, nv);
}
function threadInner(m: Mesh, rMin: number, depth: number, pitch: number, y0: number, y1: number, seg: number) {
  const turns = (y1 - y0) / pitch, nv = Math.ceil(turns * 18);
  surface(m, (u, v) => {
    const a = u * Math.PI * 2, y = y0 + (y1 - y0) * v;
    const ph = ((y - y0) / pitch - u) % 1, t = ph < 0 ? ph + 1 : ph;
    const r = rMin + depth * (1 - Math.abs(t * 2 - 1));
    return [r * Math.cos(a), y, r * Math.sin(a)];
  }, seg, nv, true);
}

export function buildShape(shape: Shape, lo = false): Float32Array[] {
  const m: Mesh = { pos: [], nor: [] }; const S = lo ? 32 : 72;
  if (shape === 'coil') {
    const turns = 5, R = 1.1, r = 0.11, h = 1.4;
    surface(m, (u, v) => { const t = u * turns * Math.PI * 2, c = [R * Math.cos(t), -h / 2 + h * u, R * Math.sin(t)] as V3; const tang = norm([-R * Math.sin(t), h / (turns * Math.PI * 2), R * Math.cos(t)]); const nrm = norm([Math.cos(t), 0, Math.sin(t)]); const bi = cross(tang, nrm); const a = v * Math.PI * 2; return [c[0] + r * (nrm[0] * Math.cos(a) + bi[0] * Math.sin(a)), c[1] + r * (nrm[1] * Math.cos(a) + bi[1] * Math.sin(a)), c[2] + r * (nrm[2] * Math.cos(a) + bi[2] * Math.sin(a))]; }, lo ? 200 : 420, lo ? 8 : 14);
  } else if (shape === 'slug') {
    lathe(m, [[0.0, -0.8], [0.4, -0.8], [0.42, -0.78], [0.42, 0.78], [0.4, 0.8], [0, 0.8]], S);
  } else if (shape === 'blank' || shape === 'bolt' || shape === 'css') {
    const small = shape === 'css';
    const R = small ? 0.5 : 0.62, rS = small ? 0.27 : 0.36, top = 1.05, hh = small ? 0.36 : 0.42;
    hexPrism(m, R, top - hh, top);
    disk(m, top - hh, 0, R * 0.9, S, false);
    // 墊圈面
    lathe(m, [[R * 0.88, top - hh], [R * 0.9, top - hh - 0.05], [rS, top - hh - 0.05]], S, true);
    const yT = -1.25, ySh = shape === 'blank' ? yT : -0.2;
    if (shape === 'blank') lathe(m, [[rS, top - hh - 0.05], [rS, yT + 0.05], [rS * 0.9, yT], [0, yT]], S, true);
    else {
      lathe(m, [[rS, top - hh - 0.05], [rS, ySh]], S, true);
      threadOuter(m, rS, small ? 0.045 : 0.06, small ? 0.1 : 0.15, yT + 0.04, ySh, S);
      lathe(m, [[rS - 0.06, yT + 0.04], [rS * 0.7, yT], [0, yT]], S, true);
    }
    if (small) { // 套管
      lathe(m, [[0.42, 0.62], [0.42, -0.05], [0.4, -0.08], [0.33, -0.08], [0.33, 0.62], [0.42, 0.62]], S, true);
    }
  } else if (shape === 'nut' || shape === 'nutblank') {
    const R = 0.75, h = 0.42, rh = 0.36;
    // 外六角（四周）
    const corner = (k: number): [number, number] => { const a = (Math.PI / 3) * k + Math.PI / 6; return [R * Math.cos(a), R * Math.sin(a)]; };
    for (let k = 0; k < 6; k++) { const [x0, z0] = corner(k), [x1, z1] = corner(k + 1); const n = norm([(x0 + x1) / 2, 0, (z0 + z1) / 2]); for (const p of [[x0, -h, z0], [x1, h, z1], [x1, -h, z1], [x0, -h, z0], [x0, h, z0], [x1, h, z1]]) { m.pos.push(...p); m.nor.push(...n); } }
    // 上下環面（六角到圓孔，以 72 段近似）
    for (const [y, up] of [[h, true], [-h, false]] as [number, boolean][]) {
      surface(m, (u, v) => { const a = u * Math.PI * 2; const k = Math.round(a / (Math.PI / 3)); const ro = (R * Math.cos(Math.PI / 6)) / Math.cos(a - k * Math.PI / 3); const r = rh + (ro - rh) * v; return [r * Math.cos(a), y, r * Math.sin(a)]; }, 72, 1, up);
    }
    if (shape === 'nut') { threadInner(m, rh - 0.06, 0.06, 0.15, -h, h, S); lathe(m, [[rh, h], [rh + 0.05, h + 0.001]], S, true); }
    else lathe(m, [[rh, -h], [rh, h]], S, true);
  }
  return [new Float32Array(m.pos), new Float32Array(m.nor)];
}

export const FINISHES: Record<Finish, { n: string; c: [number, number, number]; spec: number; rough: number }> = {
  raw: { n: '熱軋原料（黑皮）', c: [0.31, 0.29, 0.28], spec: 0.22, rough: 16 },
  drawn: { n: '伸線／冷鍛後（皮膜）', c: [0.68, 0.7, 0.73], spec: 0.72, rough: 44 },
  heat: { n: '熱處理後（回火色）', c: [0.24, 0.25, 0.31], spec: 0.52, rough: 28 },
  zinc: { n: '鍍鋅（銀白）', c: [0.82, 0.86, 0.92], spec: 1.05, rough: 88 },
  black: { n: '黑色皮膜', c: [0.08, 0.085, 0.095], spec: 0.62, rough: 52 },
};

const VS = `attribute vec3 p;attribute vec3 n;uniform mat4 mvp;uniform mat4 mw;varying vec3 vn;varying vec3 vp;varying vec3 mp;
void main(){vn=(mw*vec4(n,0.)).xyz;vp=(mw*vec4(p,1.)).xyz;mp=p;gl_Position=mvp*vec4(p,1.);}`;
const FS = `precision mediump float;varying vec3 vn;varying vec3 vp;varying vec3 mp;uniform vec3 col;uniform float spec;uniform float rough;uniform float alpha;uniform float cut;uniform vec3 eye;
void main(){if(cut>0.5&&mp.z>0.0)discard;vec3 N=normalize(vn);if(!gl_FrontFacing)N=-N;vec3 V=normalize(eye-vp);
if(cut>0.5&&!gl_FrontFacing){gl_FragColor=vec4(vec3(0.85,0.45,0.18)*(0.55+0.45*abs(N.y)),1.);return;}
vec3 L1=normalize(vec3(0.45,1.0,0.65)),L2=normalize(vec3(-0.88,0.26,-0.34)),L3=normalize(vec3(0.0,-0.2,1.0));
float d=max(dot(N,L1),0.)*0.95+max(dot(N,L2),0.)*0.28+max(dot(N,L3),0.)*0.12;
vec3 H=normalize(L1+V);float s=pow(max(dot(N,H),0.),rough)*spec;vec3 H2=normalize(L2+V);s+=pow(max(dot(N,H2),0.),rough)*spec*0.42;
float hemi=0.5+0.5*N.y;vec3 env=mix(vec3(0.08,0.12,0.17),vec3(0.56,0.66,0.8),hemi);float fr=pow(1.-max(dot(N,V),0.),2.6);
float brushed=0.92+0.08*sin((mp.y+mp.x*0.35)*36.0);
vec3 c=col*(0.17+d)*brushed+env*col*0.38+vec3(s)+env*fr*spec*0.72;
c+=vec3(0.015,0.02,0.025)*pow(max(dot(reflect(-V,N),L1),0.),10.0);
gl_FragColor=vec4(pow(c,vec3(0.92)),alpha);}`;

function persp(f: number, a: number, n: number, fa: number) { const t = 1 / Math.tan(f / 2); return [t / a, 0, 0, 0, 0, t, 0, 0, 0, 0, (fa + n) / (n - fa), -1, 0, 0, (2 * fa * n) / (n - fa), 0]; }
function mul(a: number[], b: number[]) { const o = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[j * 4 + i] += a[k * 4 + i] * b[j * 4 + k]; return o; }
function rotY(t: number) { const c = Math.cos(t), s = Math.sin(t); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; }
function rotX(t: number) { const c = Math.cos(t), s = Math.sin(t); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; }
function trans(x: number, y: number, z: number) { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]; }

export interface View { yaw: number; pitch: number; dist: number; cut: boolean; alpha: number; finish: Finish; }
export class PartRenderer {
  gl: WebGLRenderingContext; prog: WebGLProgram; buf: WebGLBuffer[] = []; count = 0; loc: Record<string, any> = {};
  constructor(public canvas: HTMLCanvasElement, lo: boolean) {
    const gl = canvas.getContext('webgl', { antialias: !lo, alpha: true, premultipliedAlpha: false }) as WebGLRenderingContext;
    if (!gl) throw new Error('此裝置不支援 WebGL');
    this.gl = gl;
    const sh = (t: number, s: string) => { const o = gl.createShader(t)!; gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o) || 'shader'); return o; };
    const p = gl.createProgram()!; gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p);
    this.prog = p; gl.useProgram(p);
    for (const k of ['mvp', 'mw', 'col', 'spec', 'rough', 'alpha', 'cut', 'eye']) this.loc[k] = gl.getUniformLocation(p, k);
    this.loc.p = gl.getAttribLocation(p, 'p'); this.loc.n = gl.getAttribLocation(p, 'n');
    this.buf = [gl.createBuffer()!, gl.createBuffer()!];
  }
  setShape(shape: Shape, lo: boolean) {
    const [pos, nor] = buildShape(shape, lo); const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[0]); gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[1]); gl.bufferData(gl.ARRAY_BUFFER, nor, gl.STATIC_DRAW);
    this.count = pos.length / 3;
  }
  draw(v: View) {
    const gl = this.gl, c = this.canvas;
    gl.viewport(0, 0, c.width, c.height); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    if (v.alpha < 1) { gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); } else { gl.disable(gl.BLEND); gl.depthMask(true); }
    const model = mul(rotX(v.pitch), rotY(v.yaw));
    const view = trans(0, 0, -v.dist);
    const mvp = mul(persp(0.8, c.width / c.height, 0.1, 50), mul(view, model));
    gl.uniformMatrix4fv(this.loc.mvp, false, new Float32Array(mvp)); gl.uniformMatrix4fv(this.loc.mw, false, new Float32Array(model));
    const F = FINISHES[v.finish];
    gl.uniform3fv(this.loc.col, F.c); gl.uniform1f(this.loc.spec, F.spec); gl.uniform1f(this.loc.rough, F.rough); gl.uniform1f(this.loc.alpha, v.alpha); gl.uniform1f(this.loc.cut, v.cut ? 1 : 0);
    gl.uniform3fv(this.loc.eye, [0, 0, v.dist]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[0]); gl.enableVertexAttribArray(this.loc.p); gl.vertexAttribPointer(this.loc.p, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buf[1]); gl.enableVertexAttribArray(this.loc.n); gl.vertexAttribPointer(this.loc.n, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, this.count);
  }
}
