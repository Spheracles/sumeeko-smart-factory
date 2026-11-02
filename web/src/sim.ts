// ============================================================
// 工廠模擬引擎（遊戲模擬資料，非世德實際工廠數據）
// 與 UI 狀態分離：所有函式皆為純函式
// ============================================================

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const r2 = (v: number) => Math.round(v * 100) / 100;

export type StationId = 'draw' | 'forge' | 'thread' | 'heat' | 'secondary' | 'surface' | 'assembly' | 'optical';
export type ProductId = 'HB' | 'PTN' | 'CSS';

export const STATION_ORDER: StationId[] = ['draw', 'forge', 'thread', 'heat', 'secondary', 'surface', 'assembly', 'optical'];

export const STATION_INFO: Record<StationId, { name: string; en: string; area: number; batch?: boolean }> = {
  draw: { name: '伸線', en: 'Wire Drawing', area: 3 },
  forge: { name: '冷鍛／打頭', en: 'Cold Forging', area: 4 },
  thread: { name: '搓牙／攻牙', en: 'Thread Rolling / Tapping', area: 5 },
  heat: { name: '熱處理', en: 'Heat Treatment', area: 6, batch: true },
  secondary: { name: '二次加工／軸向沖壓', en: 'Secondary Ops / Axial Stamping', area: 8 },
  surface: { name: '表面處理', en: 'Surface Treatment', area: 7 },
  assembly: { name: '套管組裝', en: 'Sleeve Assembly', area: 8 },
  optical: { name: '光學篩選', en: 'Optical Inspection', area: 9 },
};

export interface StationState { rate: number; machines: number; A: number; P: number; Q: number; setupH: number; kW: number; }

export interface Product { id: ProductId; name: string; en: string; mat: string; matCost: number; route: Partial<Record<StationId, number>>; note: string; }

// 途程（Routing）：數值為相對該站標準加工時間的倍率（遊戲簡化）
export const PRODUCTS: Record<ProductId, Product> = {
  HB: {
    id: 'HB', name: '車用六角螺栓', en: 'Hex Bolt', mat: '中碳合金鋼盤元（模擬）', matCost: 3.5,
    route: { draw: 1, forge: 1, thread: 1, heat: 1, surface: 1, optical: 1 },
    note: '外螺紋以搓牙（Thread Rolling）成形。',
  },
  PTN: {
    id: 'PTN', name: '預置扭力防鬆螺帽', en: 'Prevailing Torque Nut', mat: '中碳鋼盤元（模擬）', matCost: 4.2,
    route: { draw: 1, forge: 1.05, thread: 1.15, heat: 1, secondary: 1, surface: 1, optical: 1.05 },
    note: '內螺紋以攻牙（Tapping）加工；熱處理後再進行軸向沖壓（教學簡化途程）。',
  },
  CSS: {
    id: 'CSS', name: '組合式套管螺絲', en: 'Captive Sleeve Screw', mat: '低碳硼鋼盤元＋外購套管（模擬）', matCost: 9.0,
    route: { draw: 1, forge: 1.1, thread: 1, heat: 1, surface: 1, assembly: 1, optical: 1.2 },
    note: '螺絲本體搓牙後與套管組裝，光學檢查含套管限位與脫落。',
  },
};

export interface FactoryState {
  stations: Record<StationId, StationState>;
  detect: number;        // 光學檢出率
  falseReject: number;   // 誤判（良品被剔除）率
  latent: number;        // 潛在缺陷率（進入光學檢查前）
  overtimeH: number;     // 每週加開時數
  operators: number;
  training: number;      // 0-100
  dataQuality: number;   // 0-1 ERP/MES 一致性
  supplierDelay: number; // 0-1 盤元延遲比例
  safetyStockDays: number;
  energyPrice: number;   // NT$/kWh 平均
  offPeakHeat: boolean;
  energyFactor: number;  // 能耗係數
  priceFactor: number;   // 原料價格係數
  safetyRisks: string[];
  capexWeekly: number;   // 折舊（CAPEX/260 週）
  opexExtra: number;     // 每週額外營運支出（AI 維運等）
  demand: Record<ProductId, number>;
  wage: number;
}

export function baseFactory(): FactoryState {
  return {
    stations: {
      draw: { rate: 1500, machines: 1, A: 0.92, P: 0.93, Q: 0.995, setupH: 0.5, kW: 55 },
      forge: { rate: 1000, machines: 1, A: 0.9, P: 0.92, Q: 0.985, setupH: 1.1, kW: 90 },
      thread: { rate: 850, machines: 1, A: 0.86, P: 0.9, Q: 0.97, setupH: 1.0, kW: 45 },
      heat: { rate: 1200, machines: 1, A: 0.92, P: 0.86, Q: 0.99, setupH: 0.5, kW: 210 },
      secondary: { rate: 1100, machines: 1, A: 0.9, P: 0.92, Q: 0.99, setupH: 0.8, kW: 40 },
      surface: { rate: 950, machines: 1, A: 0.9, P: 0.92, Q: 0.982, setupH: 0.6, kW: 80 },
      assembly: { rate: 900, machines: 1, A: 0.88, P: 0.9, Q: 0.98, setupH: 0.6, kW: 25 },
      optical: { rate: 880, machines: 1, A: 0.93, P: 0.95, Q: 1, setupH: 0.3, kW: 15 },
    },
    detect: 0.92, falseReject: 0.02, latent: 0.006,
    overtimeH: 0, operators: 46, training: 30, dataQuality: 0.7,
    supplierDelay: 0, safetyStockDays: 2, energyPrice: 3.6, offPeakHeat: false, energyFactor: 1, priceFactor: 1,
    safetyRisks: [], capexWeekly: 0, opexExtra: 0,
    demand: { HB: 30000, PTN: 14000, CSS: 11000 },
    wage: 290,
  };
}

export interface StationResult {
  id: StationId; avail: number; perf: number; qual: number; oee: number;
  load: number; util: number; runH: number; availH: number; processed: number; scrap: number; rework: number; kWh: number; ctSec: number;
}
export interface SimResult {
  plannedH: number; good: Record<ProductId, number>; goodTotal: number; demandTotal: number;
  otif: number; rty: number; fpyLine: number; yieldPct: number; oee: number; ppm: number; escaped: number;
  wip: number; flowH: number; leadDays: number; throughputRate: number;
  stations: StationResult[]; bottleneck: StationId; kWh: number; energyPerUnit: number;
  costs: Record<string, number>; totalCost: number; costPerGood: number;
  fatigue: number; safety: number; satisfaction: number; downtimeH: number; materialAvail: number; inventoryValue: number;
}

export const COST_LABELS: Record<string, string> = {
  material: '原料', labor: '人力', energy: '能源', depreciation: '設備折舊', tooling: '模具與耗材',
  maintenance: '維修保養', scrap: '報廢與重工', inspection: '品質檢測', holding: '存貨持有',
  logistics: '運輸與急件', ai: 'AI 建置維運', penalty: '停機與交期違約',
};

export function simulateWeek(f: FactoryState, seed = 1): SimResult {
  const rnd = mulberry32(seed);
  const planned = 80 + f.overtimeH;
  const planLoss = (1 - f.dataQuality) * 12; // 資料不一致造成的等待/找料/重排時數
  const need = 46;
  const fatigue = clamp(22 + f.overtimeH * 1.6 - f.training * 0.12 + Math.max(0, need - f.operators) * 4, 0, 100);
  const fatigueQ = fatigue > 55 ? (fatigue - 55) * 0.0006 : 0;
  const materialAvail = clamp(1 - f.supplierDelay * (1 - clamp(f.safetyStockDays / 5, 0, 1)), 0, 1);

  const inp: Record<ProductId, number> = { HB: 0, PTN: 0, CSS: 0 };
  const latentCnt: Record<ProductId, number> = { HB: 0, PTN: 0, CSS: 0 };
  let released = 0, matCost = 0;
  (Object.keys(PRODUCTS) as ProductId[]).forEach((p) => {
    inp[p] = f.demand[p] * 1.03 * materialAvail; // 投料含 3% 損耗放寬
    released += inp[p];
    matCost += inp[p] * PRODUCTS[p].matCost * f.priceFactor;
  });

  const stations: StationResult[] = [];
  let kWh = 0, scrapTot = 0, reworkTot = 0, blockedWip = 0, downtime = 0, rty = 1, forgeThreadProcessed = 0;
  let escaped = 0, caught = 0, falseRej = 0;

  for (const sid of STATION_ORDER) {
    const s = f.stations[sid];
    const routed = (Object.keys(PRODUCTS) as ProductId[]).filter((p) => PRODUCTS[p].route[sid] && inp[p] > 0);
    if (!routed.length) continue;
    const noise = (rnd() - 0.5) * 0.02;
    const Aeff = clamp(s.A + noise, 0.4, 0.995);
    const changeovers = routed.length * 2;
    const setupLoss = changeovers * s.setupH;
    const grossH = s.machines * planned;
    const availH = Math.max(0, grossH * Aeff - setupLoss - planLoss);
    const capEq = availH * s.rate * s.P;
    const reqEq = routed.reduce((a, p) => a + inp[p] * (PRODUCTS[p].route[sid] || 0), 0);
    const ratio = reqEq > 0 ? Math.min(1, capEq / reqEq) : 1;
    const Qs = sid === 'optical' ? 1 : clamp(s.Q - fatigueQ, 0.8, 0.9995);
    let processed = 0, scrap = 0, rework = 0, runEq = 0;
    for (const p of routed) {
      const proc = inp[p] * ratio;
      blockedWip += inp[p] - proc;
      latentCnt[p] *= ratio;
      processed += proc;
      runEq += proc * (PRODUCTS[p].route[sid] || 0);
      if (sid === 'forge') latentCnt[p] += proc * f.latent;
      if (sid === 'optical') {
        const lat = latentCnt[p];
        const c = lat * f.detect;
        caught += c; escaped += lat - c;
        falseRej += (proc - lat) * f.falseReject; // 誤判品經人工複判回收（成本）
        inp[p] = proc - c;
      } else {
        const defect = proc * (1 - Qs);
        scrap += defect * 0.6; rework += defect * 0.4;
        inp[p] = proc - defect * 0.6;
      }
    }
    if (sid !== 'optical') rty *= Qs;
    scrapTot += scrap; reworkTot += rework;
    const runH = runEq / (s.rate * s.P);
    const idleH = Math.max(0, availH - runH);
    const standby = sid === 'heat' ? (f.offPeakHeat ? 0.35 : 0.5) : 0.2;
    const e = (runH * s.kW + idleH * s.kW * standby) * f.energyFactor;
    kWh += e;
    downtime += grossH * (1 - Aeff);
    const avail = availH / grossH;
    const qual = sid === 'optical' ? 1 - f.falseReject : Qs;
    stations.push({
      id: sid, avail, perf: s.P, qual, oee: avail * s.P * qual,
      load: capEq > 0 ? reqEq / capEq : 9, util: runH / grossH, runH, availH, processed, scrap, rework, kWh: e,
      ctSec: 3600 / (s.rate * s.P * s.machines),
    });
    if (sid === 'forge' || sid === 'thread') forgeThreadProcessed += processed;
  }

  const good = { ...inp };
  const goodTotal = good.HB + good.PTN + good.CSS;
  const demandTotal = f.demand.HB + f.demand.PTN + f.demand.CSS;
  const onTime = (Object.keys(good) as ProductId[]).reduce((a, p) => a + Math.min(good[p], f.demand[p]), 0);
  const otif = onTime / demandTotal;
  const shortfall = demandTotal - onTime;
  const ppm = goodTotal > 0 ? (escaped / goodTotal) * 1e6 : 0;

  // 加權 OEE（依實際運轉時數加權，不含無訂單閒置）
  const wSum = stations.reduce((a, s) => a + s.runH, 0);
  const oee = stations.reduce((a, s) => a + s.oee * s.runH, 0) / (wSum || 1);
  const bott = stations.reduce((m, s) => (s.load > m.load ? s : m), stations[0]);

  const baseBuffer = 7000;
  const heatBatchWip = 1200 / f.stations.heat.P;
  const wip = baseBuffer + heatBatchWip + blockedWip * 0.5;
  const thRate = goodTotal / planned; // 顆/小時
  const flowH = wip / Math.max(thRate, 1); // Little's Law：Flow Time = WIP / Throughput
  const leadDays = flowH / 16;

  const heatE = stations.find((s) => s.id === 'heat')?.kWh || 0;
  const energyCost = (kWh - heatE) * f.energyPrice + heatE * f.energyPrice * (f.offPeakHeat ? 0.72 : 1);
  const avgMat = matCost / Math.max(released, 1);
  const invValue = wip * avgMat * 1.6 + f.safetyStockDays * (matCost / 5);
  const costs: Record<string, number> = {
    material: matCost,
    labor: f.operators * 40 * f.wage + f.operators * (f.overtimeH / 2) * f.wage * 1.34,
    energy: energyCost,
    depreciation: 150000 + f.capexWeekly,
    tooling: forgeThreadProcessed * 0.16,
    maintenance: 55000 + downtime * 300,
    scrap: scrapTot * 1.2 + reworkTot * 1.5,
    inspection: 18000 + falseRej * 0.6,
    holding: invValue * 0.004,
    logistics: 30000 + shortfall * 1.5,
    ai: f.opexExtra,
    penalty: shortfall * 8 + escaped * 60,
  };
  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const safety = clamp(100 - Math.max(0, fatigue - 50) * 1.2 - f.safetyRisks.length * 18, 0, 100);
  const satisfaction = clamp(100 - (1 - otif) * 200 - ppm / 20, 0, 100);
  return {
    plannedH: planned, good, goodTotal, demandTotal, otif, rty, fpyLine: rty,
    yieldPct: goodTotal / Math.max(goodTotal + scrapTot + caught, 1), oee, ppm, escaped, wip, flowH, leadDays, throughputRate: thRate,
    stations, bottleneck: bott.id, kWh, energyPerUnit: kWh / Math.max(goodTotal, 1), costs, totalCost,
    costPerGood: totalCost / Math.max(goodTotal, 1), fatigue, safety, satisfaction, downtimeH: downtime,
    materialAvail, inventoryValue: invValue,
  };
}

// ---------------- 效果套用（事件、任務、投資） ----------------
export type StMod = Partial<Record<keyof StationState, number>>;
export interface Effect {
  funds?: number;
  st?: Partial<Record<StationId, StMod>>;
  f?: Partial<Record<'detect' | 'falseReject' | 'latent' | 'overtimeH' | 'operators' | 'training' | 'dataQuality' | 'supplierDelay' | 'safetyStockDays' | 'energyPrice' | 'energyFactor' | 'priceFactor' | 'capexWeekly' | 'opexExtra', number>>;
  set?: Partial<{ offPeakHeat: boolean }>;
  addRisk?: string; resolveRisk?: string; // 'all' 清除全部
  trust?: Partial<Record<string, number>>;
  brand?: number; flag?: string; unflag?: string; weeks?: number;
}

const LIM: Record<string, [number, number]> = {
  detect: [0.5, 0.995], falseReject: [0.002, 0.2], latent: [0.0005, 0.05], overtimeH: [0, 32], operators: [20, 70],
  training: [0, 100], dataQuality: [0.2, 1], supplierDelay: [0, 0.8], safetyStockDays: [0, 15], energyPrice: [1, 10],
  energyFactor: [0.6, 1.5], priceFactor: [0.7, 1.6], capexWeekly: [0, 1e9], opexExtra: [0, 1e9],
};
const SLIM: Record<string, [number, number]> = { A: [0.5, 0.99], P: [0.5, 0.99], Q: [0.85, 0.9995], setupH: [0.1, 4], kW: [5, 400], machines: [1, 4], rate: [100, 5000] };

export function applyEffect(f0: FactoryState, e: Effect): FactoryState {
  const f: FactoryState = JSON.parse(JSON.stringify(f0));
  if (e.st) for (const k of Object.keys(e.st) as StationId[]) {
    const m = e.st[k]!;
    for (const p of Object.keys(m) as (keyof StationState)[]) {
      const lim = SLIM[p];
      f.stations[k][p] = clamp(f.stations[k][p] + (m[p] || 0), lim[0], lim[1]);
    }
  }
  if (e.f) for (const k of Object.keys(e.f) as (keyof typeof LIM)[]) {
    const lim = LIM[k as string];
    (f as any)[k] = clamp((f as any)[k] + (e.f as any)[k], lim[0], lim[1]);
  }
  if (e.set) Object.assign(f, e.set);
  if (e.addRisk && !f.safetyRisks.includes(e.addRisk)) f.safetyRisks.push(e.addRisk);
  if (e.resolveRisk) f.safetyRisks = e.resolveRisk === 'all' ? [] : f.safetyRisks.filter((r) => r !== e.resolveRisk);
  return f;
}

// ---------------- 終局：鳳凰計畫 ----------------
export function phoenixFactory(): FactoryState {
  const f = baseFactory();
  f.demand = { HB: 31000, PTN: 15000, CSS: 12000 };
  f.energyPrice = 4.2;
  f.supplierDelay = 0.12;
  f.dataQuality = 0.6;
  f.stations.forge.A = 0.87;
  f.safetyRisks = ['冷鍛區安全光柵間歇失效'];
  return f;
}

export interface Option { id: string; name: string; cat: string; capex: number; opex: number; desc: string; tag: string[]; effect: Effect; }
export const PHOENIX_OPTIONS: Option[] = [
  { id: 'newRoller', name: '添購第二台搓牙機', cat: '設備', capex: 4800000, opex: 0, tag: ['capacity'], desc: '搓牙機台數 +1，能耗增加。直接擴充瓶頸產能，但投資最高。', effect: { st: { thread: { machines: 1, kW: 45 } } } },
  { id: 'smed', name: '搓牙快速換模（SMED）＋牙板預防更換', cat: '設備', capex: 1200000, opex: 0, tag: ['ie'], desc: '換線時間 −70%、可用率 +4%、搓牙良率 +1%。改善既有設備。', effect: { st: { thread: { setupH: -0.7, A: 0.04, Q: 0.01 } } } },
  { id: 'tpm', name: 'TPM＋預測性維護（PdM）', cat: '設備', capex: 1500000, opex: 25000, tag: ['ai'], desc: '冷鍛、搓牙、熱處理可用率 +5%。含感測器與 AI 維運費。', effect: { st: { forge: { A: 0.05 }, thread: { A: 0.05 }, heat: { A: 0.04 } }, f: { opexExtra: 25000 } } },
  { id: 'overtime', name: '週六加班 16 小時', cat: '人員', capex: 0, opex: 0, tag: ['ot'], desc: '可用工時增加，但人力成本 ×1.34、疲勞上升、能耗增加。', effect: { f: { overtimeH: 16 } } },
  { id: 'balance', name: '產線平衡與人員再配置', cat: '人員', capex: 300000, opex: 0, tag: ['ie'], desc: '搓牙與光學站效率 +3%、作業負荷更平均。', effect: { st: { thread: { P: 0.03 }, optical: { P: 0.03 } }, f: { training: 5 } } },
  { id: 'stock', name: '提高原料安全庫存（+5 天）', cat: '物料', capex: 0, opex: 0, tag: [], desc: '緩衝供應商延遲，但存貨持有成本上升。', effect: { f: { safetyStockDays: 5 } } },
  { id: 'supplier', name: '開發第二供應商＋供應商交期改善', cat: '物料', capex: 600000, opex: 0, tag: [], desc: '盤元延遲風險 −90%，原料單價 +2%。', effect: { f: { supplierDelay: -0.11, priceFactor: 0.02 } } },
  { id: 'vision', name: '導入 AI 視覺瑕疵檢測', cat: '資訊', capex: 2200000, opex: 25000, tag: ['ai'], desc: '光學檢出率提升至約 98.5%、誤判降低、光學站效率 +3%。不處理源頭缺陷。', effect: { f: { detect: 0.065, falseReject: -0.012, opexExtra: 25000 }, st: { optical: { P: 0.03 } } } },
  { id: 'source', name: '源頭製程改善（模具＋搓牙參數 DOE）', cat: '品質', capex: 900000, opex: 0, tag: ['ie'], desc: '潛在缺陷 −60%、冷鍛與搓牙良率提升。從源頭減少不良。', effect: { f: { latent: -0.0043 }, st: { forge: { Q: 0.006 }, thread: { Q: 0.008 } } } },
  { id: 'autoAsm', name: '套管組裝自動化升級', cat: '設備', capex: 3000000, opex: 0, tag: ['auto'], desc: '組裝站效率 +5%、可減少 3 名作業員。組裝並非瓶頸。', effect: { st: { assembly: { P: 0.05 } }, f: { operators: -3 } } },
  { id: 'training', name: '多能工訓練與標準作業再教育', cat: '人員', capex: 500000, opex: 0, tag: [], desc: '訓練度 +25、各站良率 +0.4%、疲勞下降。', effect: { f: { training: 25 }, st: { forge: { Q: 0.004 }, thread: { Q: 0.004 }, surface: { Q: 0.004 }, assembly: { Q: 0.004 } } } },
  { id: 'heatBatch', name: '熱處理批次最佳化＋離峰排程', cat: '能源', capex: 400000, opex: 0, tag: ['energy'], desc: '熱處理裝載效率提升、移至離峰時段用電。', effect: { st: { heat: { P: 0.07 } }, set: { offPeakHeat: true } } },
  { id: 'data', name: 'ERP／MES 資料一致性整合', cat: '資訊', capex: 1000000, opex: 8000, tag: ['cim'], desc: '資料一致性提升至 95%，減少找料、等待、重排的計畫損失。', effect: { f: { dataQuality: 0.35, opexExtra: 8000 } } },
  { id: 'energy', name: '能源管理（空壓洩漏、變頻、待機管理）', cat: '能源', capex: 800000, opex: 0, tag: ['energy'], desc: '全廠能耗係數 −10%。', effect: { f: { energyFactor: -0.1 } } },
  { id: 'safety', name: '冷鍛區安全光柵更換與連鎖驗證', cat: '安全', capex: 350000, opex: 0, tag: ['safety'], desc: '解除重大工安風險。安全不是可選的捷徑。', effect: { resolveRisk: '冷鍛區安全光柵間歇失效' } },
];
export const PHOENIX_BUDGET = 7500000;
export const OPEX_WEEKS = 13; // 預算含一季營運支出

export function phoenixCost(ids: string[]) {
  let capex = 0, opex = 0;
  for (const id of ids) { const o = PHOENIX_OPTIONS.find((x) => x.id === id)!; capex += o.capex; opex += o.opex; }
  return { capex, opex, total: capex + opex * OPEX_WEEKS };
}

export function phoenixApply(ids: string[], base = phoenixFactory()) {
  let f = base;
  for (const id of ids) {
    const o = PHOENIX_OPTIONS.find((x) => x.id === id);
    if (!o) continue;
    f = applyEffect(f, o.effect);
    f.capexWeekly += o.capex / 260;
  }
  return f;
}

export const PHOENIX_SEED = 20261102;
export function evaluatePhoenix(ids: string[]) {
  const before = simulateWeek(phoenixFactory(), PHOENIX_SEED);
  const fac = phoenixApply(ids);
  const after = simulateWeek(fac, PHOENIX_SEED);
  const cost = phoenixCost(ids);
  const targets = [
    { id: 'oee', label: '全線 OEE 提升 ≥ 10 個百分點', ok: after.oee - before.oee >= 0.10, val: `${((after.oee - before.oee) * 100).toFixed(1)} pts` },
    { id: 'cost', label: '單位良品成本降低 ≥ 8%', ok: after.costPerGood <= before.costPerGood * 0.92, val: `${(((before.costPerGood - after.costPerGood) / before.costPerGood) * 100).toFixed(1)}%` },
    { id: 'energy', label: '單位能耗降低 ≥ 8%', ok: after.energyPerUnit <= before.energyPerUnit * 0.92, val: `${(((before.energyPerUnit - after.energyPerUnit) / before.energyPerUnit) * 100).toFixed(1)}%` },
    { id: 'otif', label: 'OTIF ≥ 95%', ok: after.otif >= 0.95, val: `${(after.otif * 100).toFixed(1)}%` },
    { id: 'ppm', label: '客戶 PPM ≤ 150', ok: after.ppm <= 150, val: `${after.ppm.toFixed(0)} PPM` },
    { id: 'safety', label: '無未解決重大工安風險、疲勞 ≤ 60', ok: fac.safetyRisks.length === 0 && after.fatigue <= 60, val: `風險 ${fac.safetyRisks.length}／疲勞 ${after.fatigue.toFixed(0)}` },
    { id: 'budget', label: `投資不超過預算 NT$${(PHOENIX_BUDGET / 1e4).toFixed(0)} 萬`, ok: cost.total <= PHOENIX_BUDGET, val: `NT$${(cost.total / 1e4).toFixed(0)} 萬` },
  ];
  const weeklySaving = before.costPerGood * after.goodTotal - after.totalCost; // 以改善前單位成本生產同量的節省
  const annualSaving = weeklySaving * 50;
  const roi = cost.total > 0 ? (annualSaving - cost.capex / 5) / cost.total : 0;
  const passed = targets.filter((t) => t.ok).length;
  const score = Math.round(
    passed / targets.length * 70 +
    clamp((after.oee - before.oee) / 0.15, 0, 1) * 8 +
    clamp((before.costPerGood - after.costPerGood) / before.costPerGood / 0.12, 0, 1) * 8 +
    clamp(after.safety / 100, 0, 1) * 7 + clamp(after.satisfaction / 100, 0, 1) * 7);
  return { before, after, fac, cost, targets, passed, weeklySaving, annualSaving, roi, score };
}

export function endingOf(ev: ReturnType<typeof evaluatePhoenix>, ids: string[]) {
  const t = Object.fromEntries(ev.targets.map((x) => [x.id, x.ok]));
  const aiCount = ids.filter((i) => PHOENIX_OPTIONS.find((o) => o.id === i)?.tag.includes('ai')).length;
  if (ev.passed === ev.targets.length) return 'balance';
  if (aiCount >= 2 && !t.otif) return 'aiNoBottleneck';
  if (t.otif && !t.cost) return 'highCapacity';
  if (t.cost && (!t.safety || !t.ppm)) return 'costImbalance';
  if (t.otif && t.ppm && !t.energy) return 'energyGap';
  if (!t.otif) return aiCount >= 1 ? 'aiNoBottleneck' : 'highCapacity';
  return 'energyGap';
}

export const fmt = {
  pct: (v: number, d = 1) => `${(v * 100).toFixed(d)}%`,
  n: (v: number) => Math.round(v).toLocaleString('zh-TW'),
  nt: (v: number) => `NT$${Math.round(v).toLocaleString('zh-TW')}`,
  wan: (v: number) => `${(v / 10000).toFixed(1)} 萬`,
};
