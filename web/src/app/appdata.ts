// ============================================================
// Android App 版內容資料：設備、工具、材料、工件、職業、教學單元、任務
// 製程與設備為通用工程知識之教學示意；所有參數、數值皆為遊戲模擬資料
// ============================================================

export type MState = 'idle' | 'preparing' | 'running' | 'paused' | 'inspection' | 'complete' | 'warning' | 'fault' | 'maintenance' | 'estop';
export const MSTATE: Record<MState, { n: string; en: string; icon: string; color: string }> = {
  idle: { n: '待機', en: 'Idle', icon: '⏸', color: '#AEB8C4' },
  preparing: { n: '準備中', en: 'Preparing', icon: '🔧', color: '#36C5E8' },
  running: { n: '運轉中', en: 'Running', icon: '▶', color: '#38B88A' },
  paused: { n: '暫停', en: 'Paused', icon: '⏯', color: '#F59E38' },
  inspection: { n: '檢驗中', en: 'Inspection', icon: '🔍', color: '#36C5E8' },
  complete: { n: '完成', en: 'Complete', icon: '✔', color: '#38B88A' },
  warning: { n: '警告', en: 'Warning', icon: '⚠', color: '#F59E38' },
  fault: { n: '故障', en: 'Fault', icon: '✖', color: '#E95858' },
  maintenance: { n: '保養中', en: 'Maintenance', icon: '🔒', color: '#B78CFF' },
  estop: { n: '緊急停止', en: 'Emergency Stop', icon: '⛔', color: '#E95858' },
};

export interface MPart { id: string; n: string; d: string; x: number; y: number; }
export interface MParam { id: string; n: string; unit: string; min: number; max: number; step: number; def: number; safe: [number, number]; best: [number, number]; tip: string; }
export interface Machine {
  id: string; n: string; en: string; type: string; process: string; cell: string; desc: string; parts: MPart[];
  input: string; output: string; params: MParam[]; safety: string[]; unit: string; task?: string;
  warn: { n: string; d: string }; fault: { n: string; d: string }; cycleSec: number; quality: string[];
}

export const MACHINES: Machine[] = [
  {
    id: 'M01', n: '多工位冷鍛成形機', en: 'Multi-Station Cold Former', type: '成形設備', process: '冷鍛／打頭', cell: 'B1', unit: 'U01', task: 'T1', cycleSec: 8,
    desc: '線材經導引送入、切斷成胚料後，由多個工位的沖頭與模具依序鐓粗、預成形、成形頭部，再由轉送夾爪移到下一站，最後出料。常溫成形，材料利用率高。',
    parts: [
      { id: 'feed', n: '送料裝置', d: '送料輪夾持線材，依設定長度定量送入。', x: 70, y: 210 }, { id: 'guide', n: '線材導引機構', d: '矯直並導正線材，避免偏心導致成形不良。', x: 130, y: 200 },
      { id: 'cut', n: '切料機構', d: '切刀將線材切成固定長度胚料，切口品質影響後續成形。', x: 190, y: 170 }, { id: 'ram', n: '主滑塊', d: '由曲軸驅動往復運動，帶動各站沖頭同步加壓。', x: 300, y: 70 },
      { id: 'punch', n: '沖頭', d: '各工位的上模，與模具配合將胚料逐步成形。', x: 300, y: 125 }, { id: 'die', n: '模具座', d: '固定各站下模（模仁），承受成形力；磨耗是主要保養項目。', x: 300, y: 205 },
      { id: 'transfer', n: '多站轉送機構', d: '夾爪將工件從一站轉送到下一站，時序須與滑塊同步。', x: 380, y: 160 }, { id: 'out', n: '出料裝置', d: '成形品經滑槽排出至料箱。', x: 470, y: 230 },
      { id: 'guard', n: '安全護罩與控制面板', d: '護罩含連鎖開關，開啟即停機；面板有緊急停止鈕。', x: 520, y: 110 },
    ],
    input: 'P02', output: 'P03',
    params: [
      { id: 'speed', n: '生產速度', unit: '%', min: 60, max: 100, step: 1, def: 85, safe: [60, 92], best: [80, 90], tip: '速度越快產量越高，但模具磨耗與頭部裂紋風險上升。' },
      { id: 'feedLen', n: '送料長度', unit: 'mm', min: 40, max: 50, step: 0.1, def: 45, safe: [40, 50], best: [44.6, 45.4], tip: '決定胚料體積；太短頭部不飽滿，太長產生毛邊。' },
      { id: 'lube', n: '潤滑供給', unit: '%', min: 0, max: 100, step: 5, def: 70, safe: [40, 100], best: [60, 90], tip: '潤滑不足會刮傷模具與工件表面。' },
    ],
    safety: ['運轉中禁止開啟護罩或伸手進入模具區。', '換模、清料必須停機並上鎖掛牌（LOTO），確認零能量。', '不可佩戴棉紗手套靠近運轉中的送料輪等旋轉部件。', '異常撞擊聲、頭部裂紋立即停機通報。'],
    warn: { n: '模具溫度偏高', d: '連續高速生產，模具溫度上升，裂紋風險增加。' }, fault: { n: '送料卡料', d: '線材在導引機構卡住，機台已自動停止。需停機上鎖後排除。' },
    quality: ['頭部高度', '頭部外徑', '有無裂紋與摺疊', '毛邊'],
  },
  {
    id: 'M02', n: '平板式搓牙機', en: 'Flat-Die Thread Rolling Machine', type: '成形設備', process: '搓牙（外螺紋）', cell: 'B2', unit: 'U02', task: 'T2', cycleSec: 6,
    desc: '胚料沿送料軌道進入兩片牙板之間，固定牙板與往復牙板相對運動，使胚料滾動並以塑性變形壓出外螺紋。不產生切屑，金屬纖維連續。螺帽內螺紋則以攻牙加工，兩者不同。',
    parts: [
      { id: 'rail', n: '送料軌道', d: '胚料依序排列滑入，方向須一致。', x: 110, y: 120 }, { id: 'fixed', n: '固定牙板', d: '刻有螺紋牙型的模具，固定不動。', x: 300, y: 115 },
      { id: 'moving', n: '往復牙板', d: '由曲柄驅動往復運動，帶動胚料滾動成形。', x: 300, y: 185 }, { id: 'pusher', n: '推料器', d: '在正確時機將胚料推入牙板之間。', x: 210, y: 150 },
      { id: 'bin', n: '出料與收集', d: '成形後落入收集料箱，定時抽檢。', x: 470, y: 235 },
    ],
    input: 'P03', output: 'P04',
    params: [
      { id: 'speed', n: '搓牙速度', unit: '%', min: 60, max: 100, step: 1, def: 85, safe: [60, 95], best: [78, 90], tip: '速度過快易產生亂牙；過慢產能不足。' },
      { id: 'gap', n: '牙板間隙', unit: 'mm', min: 6.2, max: 7.2, step: 0.02, def: 6.7, safe: [6.2, 7.2], best: [6.62, 6.78], tip: '決定螺紋外徑；太小過度擠壓，太大牙型不完整。' },
      { id: 'align', n: '牙板對位', unit: '刻度', min: -5, max: 5, step: 1, def: 0, safe: [-5, 5], best: [-1, 1], tip: '對位偏差會造成錯牙（雙牙）。' },
    ],
    safety: ['牙板間為夾捲危險點，運轉中不可伸手。', '更換牙板須停機上鎖，並使用專用工具。', '搓牙油霧區配戴護目鏡。'],
    warn: { n: '牙板磨耗接近壽命', d: '缺牙比例開始上升。' }, fault: { n: '胚料方向錯誤卡死', d: '送料軌道有胚料倒置，牙板停止。' },
    quality: ['螺紋通止規', '外徑', '牙型完整性', '錯牙'],
  },
  {
    id: 'M03', n: '軸向沖壓與二次加工機', en: 'Axial Stamping & Secondary Press', type: '二次加工', process: '二次加工（預置扭力螺帽沖壓）', cell: 'B3', unit: 'U03', task: 'T5', cycleSec: 5,
    desc: '對熱處理後的螺帽進行軸向沖壓，使局部產生受控變形而形成預置扭力（防鬆）特性。公開專利 TWI753649B 的重點在熱處理後硬度與特定軸向沖壓條件的配合；本機參數皆為虛構示意。',
    parts: [
      { id: 'frame', n: 'C 型機架', d: '承受沖壓反力。', x: 170, y: 120 }, { id: 'ram', n: '沖壓滑塊', d: '帶動上模下壓，行程可調。', x: 300, y: 80 },
      { id: 'tool', n: '沖壓模具', d: '決定變形位置與形狀。', x: 300, y: 150 }, { id: 'nest', n: '定位治具', d: '確保螺帽方向與位置正確（防錯）。', x: 300, y: 210 },
      { id: 'sensor', n: '行程／壓力感測', d: '記錄每次沖壓的深度與壓力，作為追溯資料。', x: 450, y: 110 },
    ],
    input: 'N05', output: 'N06',
    params: [
      { id: 'depth', n: '沖壓深度（虛構指數）', unit: '', min: 0.2, max: 1.0, step: 0.02, def: 0.6, safe: [0.3, 0.9], best: [0.52, 0.68], tip: '深度影響預置扭力大小，需與硬度配合。' },
      { id: 'hard', n: '來料硬度分級（虛構指數）', unit: '', min: 20, max: 42, step: 1, def: 30, safe: [24, 38], best: [28, 33], tip: '硬度太高易裂、太低扭力不穩。' },
    ],
    safety: ['雙手啟動按鈕，避免單手操作。', '光柵或連鎖失效時禁止生產。'],
    warn: { n: '壓力曲線漂移', d: '連續 10 次壓力峰值偏高。' }, fault: { n: '光柵觸發', d: '偵測到手部進入危險區，已停止。' },
    quality: ['預置扭力', '外觀裂紋', '牙型變形'],
  },
  {
    id: 'M04', n: '網帶式連續熱處理爐', en: 'Mesh-Belt Heat Treatment Furnace', type: '特殊製程', process: '淬火／回火', cell: 'A3', unit: 'U04', task: 'T3', cycleSec: 10,
    desc: '工件由網帶連續輸送，依序經過加熱區、淬火槽、回火區。加熱使組織轉變，急冷提高硬度，回火調整韌性與硬度平衡。屬特殊製程，需以溫度、時間與爐內氣氛監控確保品質。',
    parts: [
      { id: 'load', n: '投料區', d: '定量投料，避免堆疊影響受熱均勻。', x: 60, y: 170 }, { id: 'heat', n: '加熱區', d: '多段溫控，熱電偶監測。', x: 190, y: 120 },
      { id: 'quench', n: '淬火槽', d: '急冷使硬度上升；冷卻速度影響變形與硬度。', x: 320, y: 200 }, { id: 'temper', n: '回火區', d: '降低脆性、調整至規格硬度。', x: 440, y: 120 },
      { id: 'monitor', n: '溫度監測', d: '記錄每一爐區溫度曲線，作為追溯資料。', x: 300, y: 50 },
    ],
    input: 'P04', output: 'P05',
    params: [
      { id: 'tq', n: '加熱區溫度偏移（虛構指數）', unit: '', min: -10, max: 10, step: 1, def: 0, safe: [-4, 4], best: [-1, 1], tip: '偏離基準會使硬度不足或過硬。' },
      { id: 'tt', n: '回火條件偏移（虛構指數）', unit: '', min: -10, max: 10, step: 1, def: 0, safe: [-4, 4], best: [-1, 2], tip: '回火影響最終硬度與韌性。' },
      { id: 'load', n: '網帶裝載率', unit: '%', min: 50, max: 100, step: 2, def: 80, safe: [50, 92], best: [70, 88], tip: '過度堆疊導致受熱不均。' },
    ],
    safety: ['高溫區域禁止觸碰，維修須降溫並上鎖。', '淬火油區注意火災風險與通風。', '本 App 僅作原理展示，不提供實際操作條件。'],
    warn: { n: '熱電偶讀值跳動', d: '第二加熱區溫度量測不穩定。' }, fault: { n: '網帶停轉', d: '驅動馬達過載跳脫。' },
    quality: ['表面硬度', '心部硬度', '脫碳', '變形量'],
  },
  {
    id: 'M05', n: '表面處理線', en: 'Surface Finishing Line', type: '特殊製程', process: '表面處理（原理展示）', cell: 'A3', unit: 'U05', cycleSec: 9,
    desc: '工件經前處理、鍍層或塗層、水洗與乾燥固化，以提升防蝕性並控制摩擦係數。本 App 只展示原理與品質重點，不提供任何化學藥液的現場操作指引。',
    parts: [
      { id: 'pre', n: '前處理槽', d: '去除油污與氧化物，影響附著力（示意）。', x: 110, y: 170 }, { id: 'coat', n: '鍍層／塗層槽', d: '形成保護層；膜厚需控制在規格內。', x: 230, y: 170 },
      { id: 'rinse', n: '水洗槽', d: '移除殘留（示意）。', x: 350, y: 170 }, { id: 'dry', n: '乾燥固化', d: '完成塗層固化。', x: 470, y: 150 },
      { id: 'hoist', n: '吊掛輸送', d: '掛架或滾筒將工件依序移動。', x: 290, y: 60 },
    ],
    input: 'P05', output: 'P06',
    params: [
      { id: 'thick', n: '膜厚目標（虛構指數）', unit: '', min: 4, max: 16, step: 1, def: 10, safe: [6, 14], best: [9, 11], tip: '太薄防蝕不足，太厚影響螺紋配合與摩擦係數。' },
    ],
    safety: ['化學品區域僅由受訓人員作業；本 App 不提供操作條件。', '需配戴對應防護具並確保通風。'],
    warn: { n: '膜厚分布不均', d: '滾筒轉速異常。' }, fault: { n: '吊車定位失敗', d: '掛架未到位，輸送停止。' },
    quality: ['膜厚', '附著性', '外觀', '摩擦係數'],
  },
  {
    id: 'M06', n: '自動光學檢測設備', en: 'Automated Optical Inspection, AOI', type: '檢測設備', process: '光學篩選', cell: 'C3', unit: 'U06', task: 'T4', cycleSec: 7,
    desc: '工件由送料盤排列後經過玻璃轉盤，多組工業相機與環形光源拍攝外觀與尺寸，影像演算法判定良品／不良品，再以氣嘴把不良品吹入 NG 區。檢出率與誤判率需以成本取捨。',
    parts: [
      { id: 'bowl', n: '工件送料機構', d: '振動盤排列方向後送入。', x: 80, y: 170 }, { id: 'cam', n: '工業相機', d: '多角度拍攝頭部、螺紋與側面。', x: 260, y: 60 },
      { id: 'light', n: '照明組件', d: '環形光與背光，凸顯缺陷輪廓。', x: 330, y: 95 }, { id: 'disc', n: '影像檢測區（玻璃轉盤）', d: '透明轉盤使背光可穿透。', x: 300, y: 175 },
      { id: 'ui', n: '判定介面', d: '顯示 OK／NG 統計與缺陷影像。', x: 500, y: 80 }, { id: 'eject', n: '良品與不良品分流', d: '氣嘴吹出 NG 品。', x: 440, y: 220 },
    ],
    input: 'P06', output: 'P07',
    params: [
      { id: 'th', n: '判定門檻（越低越嚴格）', unit: '', min: 0.1, max: 0.9, step: 0.01, def: 0.5, safe: [0.1, 0.9], best: [0.36, 0.52], tip: '嚴格可降低漏檢，但誤判上升。' },
      { id: 'lux', n: '光源亮度', unit: '%', min: 40, max: 100, step: 5, def: 75, safe: [50, 100], best: [70, 90], tip: '亮度不足會漏判；過亮反光誤判。' },
    ],
    safety: ['轉盤與氣嘴區運轉中勿伸手。', '清潔鏡頭須停機。'],
    warn: { n: '鏡頭髒污', d: '影像對比下降，漏檢風險上升。' }, fault: { n: '轉盤卡件', d: '工件卡在轉盤邊緣，已停止。' },
    quality: ['外觀缺陷（裂紋、毛邊、缺牙）', '頭部尺寸', '套管到位'],
  },
  {
    id: 'M07', n: '自動化組裝與物流系統', en: 'Automation & Intralogistics', type: '自動化物流', process: '組裝／包裝／搬運', cell: 'C3', unit: 'U07', cycleSec: 8,
    desc: '機械手臂以夾爪取放工件並組裝套管、放入料箱；輸送帶與自主移動機器人（AMR）把料箱送往包裝；條碼標籤串起批號追溯。',
    parts: [
      { id: 'arm', n: '機械手臂', d: '六軸手臂執行取放，區域以圍籬隔離。', x: 160, y: 100 }, { id: 'grip', n: '夾爪', d: '依工件形狀設計，需力量與位置感測。', x: 230, y: 150 },
      { id: 'conv', n: '輸送帶', d: '把料箱送往下一站。', x: 330, y: 200 }, { id: 'amr', n: 'AGV／AMR', d: '自主導航搬運料箱至倉儲。', x: 470, y: 230 },
      { id: 'pack', n: '自動包裝設備', d: '計數、封箱、秤重檢查。', x: 470, y: 120 }, { id: 'label', n: '條碼與追溯標籤', d: '記錄批號、數量與工單。', x: 400, y: 160 },
    ],
    input: 'P07', output: 'P07',
    params: [{ id: 'speed', n: '手臂速度', unit: '%', min: 30, max: 100, step: 5, def: 70, safe: [30, 85], best: [55, 80], tip: '協作區速度須受限。' }],
    safety: ['機械手臂作業區以圍籬與門連鎖隔離。', 'AMR 行經路線保持淨空並有警示。'],
    warn: { n: '條碼讀取失敗率上升', d: '標籤印字模糊。' }, fault: { n: '夾爪真空不足', d: '取件失敗，手臂停止。' },
    quality: ['組裝到位', '數量', '標籤正確'],
  },
];

// ---------------- 工件 ----------------
export type Shape = 'coil' | 'slug' | 'blank' | 'bolt' | 'nutblank' | 'nut' | 'css';
export type Finish = 'raw' | 'drawn' | 'heat' | 'zinc' | 'black';
export interface Part { id: string; n: string; code: string; mat: string; shape: Shape; finish: Finish; stage: string; machine: string; quality: string[]; defects: string[]; use: string; dims: string; }
export const PARTS: Part[] = [
  { id: 'P01', n: '金屬盤元', code: 'MAT-WR', mat: '中碳合金鋼（教學示例）', shape: 'coil', finish: 'raw', stage: '原料', machine: '—（上游鋼廠供應）', quality: ['材質證明', '線徑', '表面'], defects: ['鏽蝕', '刮痕', '混料'], use: '冷鍛原料', dims: '線徑 Ø9.2 mm（示意）' },
  { id: 'P02', n: '下料胚料', code: 'BLK-01', mat: '球化、伸線後線材', shape: 'slug', finish: 'drawn', stage: '下料', machine: 'M01 切料機構', quality: ['長度', '切口平整'], defects: ['切口斜', '長度不足'], use: '冷鍛胚料', dims: '長約 45 mm（示意）' },
  { id: 'P03', n: '成形螺栓胚體', code: 'BLK-02', mat: '冷鍛成形', shape: 'blank', finish: 'drawn', stage: '冷鍛', machine: 'M01', quality: ['頭部高度', '頭部對邊'], defects: ['頭部裂紋', '摺疊', '毛邊'], use: '待搓牙', dims: '頭高 6.4 mm、對邊 13 mm（示意）' },
  { id: 'P04', n: '螺紋加工件', code: 'THD-01', mat: '搓牙成形', shape: 'bolt', finish: 'drawn', stage: '搓牙', machine: 'M02', quality: ['通止規', '外徑'], defects: ['缺牙', '錯牙', '牙型變形'], use: '待熱處理', dims: 'M10×1.5（示意）' },
  { id: 'P05', n: '熱處理件', code: 'HT-01', mat: '淬火回火', shape: 'bolt', finish: 'heat', stage: '熱處理', machine: 'M04', quality: ['硬度'], defects: ['硬度不足', '脫碳', '變形'], use: '待表面處理', dims: '—' },
  { id: 'P06', n: '表面處理件', code: 'SF-01', mat: '鍍層（示意）', shape: 'bolt', finish: 'zinc', stage: '表面處理', machine: 'M05', quality: ['膜厚', '外觀'], defects: ['膜厚不均', '附著不良'], use: '待檢驗', dims: '—' },
  { id: 'P07', n: '合格成品：車用六角螺栓', code: 'HB-M10', mat: '成品', shape: 'bolt', finish: 'zinc', stage: '光學篩選與包裝', machine: 'M06／M07', quality: ['外觀', '尺寸', '追溯標籤'], defects: ['—'], use: '汽車零組件鎖固', dims: 'M10×1.5×40（示意）' },
  { id: 'N03', n: '冷鍛螺帽胚', code: 'NUT-01', mat: '冷鍛成形', shape: 'nutblank', finish: 'drawn', stage: '冷鍛', machine: 'M01', quality: ['對邊', '高度', '沖孔'], defects: ['偏心', '裂紋'], use: '待攻牙', dims: '對邊 15 mm（示意）' },
  { id: 'N05', n: '攻牙後熱處理螺帽', code: 'NUT-05', mat: '攻牙、淬火回火', shape: 'nut', finish: 'heat', stage: '攻牙＋熱處理', machine: '攻牙機／M04', quality: ['內螺紋塞規', '硬度'], defects: ['亂牙', '硬度偏差'], use: '待軸向沖壓', dims: 'M10（示意）' },
  { id: 'N06', n: '預置扭力防鬆螺帽', code: 'PTN-M10', mat: '軸向沖壓', shape: 'nut', finish: 'zinc', stage: '二次加工', machine: 'M03', quality: ['預置扭力', '外觀'], defects: ['扭力偏高／偏低', '裂紋'], use: '防鬆鎖固', dims: 'M10（示意）' },
  { id: 'C07', n: '組合式套管螺絲', code: 'CSS-M6', mat: '螺絲本體＋套管', shape: 'css', finish: 'zinc', stage: '組裝', machine: 'M07', quality: ['套管到位', '不脫落'], defects: ['套管脫落', '限位不足'], use: '預組裝模組鎖固', dims: 'M6（示意）' },
];
export const ROUTES = [
  { id: 'HB', n: '車用六角螺栓', steps: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07'] },
  { id: 'PTN', n: '預置扭力防鬆螺帽', steps: ['P01', 'P02', 'N03', 'N05', 'N06'] },
  { id: 'CSS', n: '組合式套管螺絲', steps: ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'C07'] },
];

// ---------------- 材料 ----------------
export const MATERIALS = [
  { id: 'MA1', n: '中碳合金鋼盤元', en: 'Medium-Carbon Alloy Steel Wire Rod', d: '常見於高強度螺栓（例如 SCM435 等鋼種，教學示例）。經熱處理可達較高強度。', use: '六角螺栓、高強度扣件', note: '由上游鋼廠以小鋼胚熱軋成盤元供應。' },
  { id: 'MA2', n: '低碳硼鋼盤元', en: 'Low-Carbon Boron Steel Wire Rod', d: '添加微量硼提高淬透性，冷鍛性佳（例如 10B21，教學示例）。', use: '螺絲、套管螺絲本體', note: '常用於冷鍛性要求較高的產品。' },
  { id: 'MA3', n: '中碳鋼盤元', en: 'Medium-Carbon Steel Wire Rod', d: '價格較低、用途廣（例如 S45C，教學示例）。', use: '螺帽、一般扣件', note: '鋼種須與材質證明、標籤一致，避免混料。' },
  { id: 'MA4', n: '沃斯田鐵系不鏽鋼線材', en: 'Austenitic Stainless Steel Wire', d: '耐蝕性佳但易加工硬化，鎖附時注意咬死（galling）。', use: '耐蝕扣件', note: '不需淬火，強度主要來自冷加工。' },
  { id: 'MA5', n: '鍍層與塗層材料', en: 'Coatings', d: '鋅系鍍層、鋅鎳、片狀鋅塗層等用於防蝕與摩擦係數控制（原理說明）。', use: '表面處理', note: '本 App 不提供化學處理操作條件。' },
];

// ---------------- 工具 ----------------
export interface Tool { id: string; n: string; en: string; mat: string; role: string; use: string; parts: string; demo?: 'caliper' | 'micrometer' | 'ring' | 'plug' | 'torque' | 'dial' | 'scan'; }
export const TOOLS: Tool[] = [
  { id: 'T01', n: '游標卡尺', en: 'Vernier Caliper', mat: '不鏽鋼', role: '品質工程師、機台操作員', use: '量測外徑、內徑、深度與長度，解析度常見 0.02 mm。', parts: '胚料長度、頭部高度', demo: 'caliper' },
  { id: 'T02', n: '外徑千分尺', en: 'Outside Micrometer', mat: '鋼製、碳化物測砧', role: '品質工程師', use: '精密量測外徑，解析度 0.01 mm（數位型可達 0.001）。使用棘輪確保量測力一致。', parts: '螺紋外徑、線徑', demo: 'micrometer' },
  { id: 'T03', n: '螺紋環規', en: 'Thread Ring Gauge', mat: '工具鋼', role: '品質工程師、機台操作員', use: '檢查外螺紋：通端（GO）須能旋入，止端（NO-GO）不可旋入超過規定圈數。', parts: '螺栓外螺紋', demo: 'ring' },
  { id: 'T04', n: '螺紋塞規', en: 'Thread Plug Gauge', mat: '工具鋼', role: '品質工程師', use: '檢查內螺紋（螺帽），通端旋入、止端不入。', parts: '螺帽內螺紋', demo: 'plug' },
  { id: 'T05', n: '扭力扳手', en: 'Torque Wrench', mat: '合金鋼', role: '品質工程師、製程工程師', use: '以設定扭力鎖附或檢測預置扭力。需定期校正。', parts: '預置扭力螺帽', demo: 'torque' },
  { id: 'T06', n: '百分表', en: 'Dial Indicator', mat: '鋼製、玻璃錶面', role: '設備維護工程師、模具技師', use: '量測偏擺、真直度與模具對位，常搭配磁性表座。', parts: '模具對位、主軸偏擺', demo: 'dial' },
  { id: 'T07', n: '模具組', en: 'Die Set', mat: '碳化鎢模仁、工具鋼', role: '模具技師', use: '冷鍛各工位的沖頭與模仁，依產品成套管理與保養。', parts: '冷鍛成形' },
  { id: 'T08', n: '工具車', en: 'Tool Cart', mat: '鋼板烤漆', role: '模具技師、設備維護工程師', use: '依 5S 形跡定位收納換模與保養工具。', parts: '—' },
  { id: 'T09', n: '工業平板', en: 'Rugged Tablet', mat: '強化外殼', role: '製程工程師、機台操作員', use: '查看 SOP、圖面、MES 工單與報工（本 App 中為模擬）。', parts: '—' },
  { id: 'T10', n: '量測記錄卡', en: 'Measurement Record Card', mat: '紙本／電子表單', role: '品質工程師', use: '記錄首件、巡檢數值與判定，作為追溯依據。', parts: '各工序' },
  { id: 'T11', n: '條碼掃描器', en: 'Barcode Scanner', mat: '工業塑膠', role: '物流技術員', use: '掃描料箱與批號標籤，連結工單與庫存。', parts: '料箱、成品', demo: 'scan' },
];

// ---------------- 職業 ----------------
export interface Role { id: string; n: string; en: string; duty: string; tools: string[]; tasks: string[]; ppe: string; color: string; pose: 'tablet' | 'panel' | 'die' | 'caliper' | 'meter' | 'scanner'; npc: string; }
export const ROLES: Role[] = [
  { id: 'R1', n: '製程工程師', en: 'Process Engineer', duty: '分析工序與參數、制定作業標準、處理製程異常。', tools: ['T09', 'T05'], tasks: ['T5', 'T3'], ppe: '安全鞋、護目鏡；進入成形區配戴聽力防護。', color: '#36C5E8', pose: 'tablet', npc: 'hsu' },
  { id: 'R2', n: '機台操作員', en: 'Machine Operator', duty: '依 SOP 啟停設備、點檢、首件確認與報工。', tools: ['T09', 'T01'], tasks: ['T1', 'T2'], ppe: '安全帽（吊掛區）、護目鏡、耳罩、安全鞋；旋轉部件旁不戴棉紗手套。', color: '#F59E38', pose: 'panel', npc: 'lin' },
  { id: 'R3', n: '模具技師', en: 'Die Technician', duty: '模具檢查、研磨、換模與壽命管理。', tools: ['T07', 'T06', 'T08'], tasks: ['T1'], ppe: '換模時上鎖掛牌；搬運模具著安全鞋並使用吊具。', color: '#AEB8C4', pose: 'die', npc: 'chen' },
  { id: 'R4', n: '品質工程師', en: 'Quality Engineer', duty: '尺寸量測、SPC、判定與矯正預防。', tools: ['T01', 'T02', 'T03', 'T04', 'T10'], tasks: ['T2', 'T4'], ppe: '護目鏡；量測室依規定。', color: '#38B88A', pose: 'caliper', npc: 'huang' },
  { id: 'R5', n: '設備維護工程師', en: 'Maintenance Engineer', duty: '預防保養、故障排除、預測性維護資料判讀。', tools: ['T06', 'T08'], tasks: ['T3'], ppe: '維修前 LOTO、隔離標籤；絕緣手套依電氣作業風險使用。', color: '#B78CFF', pose: 'meter', npc: 'ho' },
  { id: 'R6', n: '物流技術員', en: 'Logistics Technician', duty: '物料與成品流轉、條碼追溯、AMR 調度。', tools: ['T11'], tasks: ['T4'], ppe: '反光背心、安全鞋；注意 AMR 與堆高機動線。', color: '#E95858', pose: 'scanner', npc: 'wu' },
];

// ---------------- 教學單元 ----------------
export interface Unit { id: string; machine: string; n: string; goal: string; prep: string[]; steps: string[]; before: string; after: string; principle: string; check: string[]; mistakes: string[]; quiz: { q: string; o: string[]; a: number; why: string }[]; }
export const UNITS: Unit[] = [
  { id: 'U01', machine: 'M01', n: '冷鍛成形：從胚料到螺栓頭', goal: '理解多工位冷鍛的進料、切料、逐站成形與出料，能完成首件確認。', prep: ['確認工單、產品圖面與模具組編號', '穿戴 PPE：護目鏡、耳罩、安全鞋', '點檢潤滑、護罩連鎖、緊急停止鈕'], steps: ['線材經矯直導引送入，送料長度依設定', '切料機構切成胚料', '轉送夾爪移至第 1 站鐓粗', '第 2～3 站預成形與成形頭部', '最後一站整形／沖孔，出料', '首件量測頭部高度與外觀，合格後量產'], before: 'P02', after: 'P03', principle: '金屬在常溫下受壓產生塑性變形，體積不變而形狀改變；多站分段成形可降低單站變形量，減少裂紋。', check: ['頭部高度（游標卡尺）', '頭部有無裂紋、摺疊', '毛邊'], mistakes: ['送料長度錯誤造成頭部不飽滿或毛邊', '潤滑不足刮傷模具', '運轉中開護罩'], quiz: [
    { q: '多工位冷鍛分站成形的主要目的？', o: ['讓機台看起來更複雜', '分散每站變形量，降低裂紋與模具負荷', '減少用電'], a: 1, why: '分段成形讓每站變形量較小。' },
    { q: '需要伸手清除模具區卡料時應？', o: ['機台慢速運轉即可', '停機、上鎖掛牌、確認零能量後處理', '請同事看著緊急停止鈕'], a: 1, why: 'LOTO 是基本安全程序。' },
    { q: '送料長度太短最可能造成？', o: ['頭部不飽滿', '螺紋變長', '硬度上升'], a: 0, why: '胚料體積不足。' }] },
  { id: 'U02', machine: 'M02', n: '搓牙：外螺紋的塑性成形', goal: '能說明搓牙與攻牙的差異，設定牙板間隙並以通止規判定。', prep: ['確認牙板規格與壽命計數', '準備螺紋環規（通／止）', '護目鏡'], steps: ['胚料排列進入送料軌道', '推料器把胚料推入牙板間', '往復牙板帶動胚料滾動壓出螺紋', '出料收集', '環規通端旋入、止端不入即合格'], before: 'P03', after: 'P04', principle: '牙板齒形擠壓材料流動形成牙峰牙谷，不切斷金屬纖維，強度與表面品質佳。', check: ['通止規', '外徑（千分尺）', '錯牙、缺牙'], mistakes: ['把攻牙與搓牙混為一談', '間隙過小造成過度擠壓', '對位偏差產生錯牙'], quiz: [
    { q: '螺帽內螺紋通常以哪種方式加工？', o: ['搓牙', '攻牙', '冷鍛'], a: 1, why: '內螺紋用絲攻攻牙。' },
    { q: '螺紋環規「止端」可以完全旋入代表？', o: ['合格', '節徑可能偏小，不合格', '牙板很新'], a: 1, why: '止端不應旋入超過規定。' },
    { q: '搓牙相較切削螺紋的特點？', o: ['產生大量切屑', '金屬纖維連續、不產生切屑', '只能做內螺紋'], a: 1, why: '屬塑性成形。' }] },
  { id: 'U03', machine: 'M03', n: '預置扭力螺帽：硬度與沖壓的配合', goal: '理解預置扭力的形成與「硬度 × 沖壓條件」的交互作用。', prep: ['確認來料熱處理硬度分級', '扭力扳手校正有效', '雙手按鈕與光柵功能測試'], steps: ['螺帽放入定位治具（防錯方向）', '雙手啟動沖壓', '感測器記錄深度與壓力', '抽樣以扭力工具檢測預置扭力'], before: 'N05', after: 'N06', principle: '局部受控變形使螺紋產生干涉，旋入時需克服額外扭力而達到防鬆。硬度與變形量需配合。', check: ['預置扭力在規格內', '無裂紋'], mistakes: ['不分硬度一律同條件沖壓', '直接把模型建議寫入機台'], quiz: [
    { q: 'TWI753649B 公開專利的重點描述為？', o: ['一般熱處理方法', '熱處理後硬度與特定軸向沖壓條件的配合', '螺栓搓牙方法'], a: 1, why: '不可簡化為一般熱處理專利。' },
    { q: '光柵失效時可以生產嗎？', o: ['可以，小心一點', '不可以，須修復並驗證', '只在夜班可以'], a: 1, why: '安全裝置失效禁止生產。' }] },
  { id: 'U04', machine: 'M04', n: '熱處理：看不見的品質', goal: '認識淬火、回火與特殊製程控制。', prep: ['確認爐溫曲線與熱電偶校正', '依產品設定網帶速度與裝載量'], steps: ['均勻投料', '加熱區升溫保持', '淬火急冷', '回火調整硬度', '抽樣硬度檢驗並記錄爐次'], before: 'P04', after: 'P05', principle: '加熱使組織轉變，急冷得到高硬度組織，回火降低脆性。結果無法只靠外觀判斷，需製程監控。', check: ['硬度', '脫碳', '變形'], mistakes: ['溫度異常仍出貨', '過度堆疊受熱不均'], quiz: [
    { q: '為什麼熱處理被稱為特殊製程？', o: ['因為很貴', '結果無法只靠最終檢驗完全確認，需過程控制', '因為只有夜班做'], a: 1, why: '需以參數監控與確效。' },
    { q: '回火的主要目的？', o: ['提高脆性', '降低脆性並調整硬度', '增加鍍層厚度'], a: 1, why: '回火平衡硬度與韌性。' }] },
  { id: 'U05', machine: 'M05', n: '表面處理：防蝕與摩擦係數', goal: '了解表面處理的目的與品質重點（原理）。', prep: ['確認產品規格的鍍層種類與膜厚'], steps: ['前處理', '鍍層／塗層', '水洗', '乾燥固化', '膜厚與外觀檢驗'], before: 'P05', after: 'P06', principle: '保護層阻隔腐蝕環境；膜厚與表面狀態會改變摩擦係數，影響鎖附扭力與夾緊力關係。', check: ['膜厚', '附著性', '外觀'], mistakes: ['膜厚過厚影響螺紋配合'], quiz: [
    { q: '膜厚過厚可能造成？', o: ['螺紋配合變緊、摩擦係數改變', '硬度上升', '材料變成不鏽鋼'], a: 0, why: '膜厚影響配合與摩擦。' }] },
  { id: 'U06', machine: 'M06', n: 'AOI 光學篩選：檢出率 vs 誤判率', goal: '能調整門檻並理解漏檢與誤判的成本。', prep: ['清潔鏡頭與轉盤', '以標準樣品（良品／不良品）驗證'], steps: ['振動盤送料', '轉盤經過相機與光源', '影像判定', '氣嘴分流 NG', '定時以標準樣品驗證'], before: 'P06', after: 'P07', principle: '以光學影像擷取外觀特徵，與門檻比較判定。門檻越嚴格，漏檢少但誤判多。', check: ['標準樣品驗證', '漏檢率', '誤判率'], mistakes: ['為了降低誤判把門檻整體調鬆', '鏡頭髒污未點檢'], quiz: [
    { q: '門檻調嚴格（降低）會？', o: ['漏檢增加', '誤判增加、漏檢減少', '兩者都減少'], a: 1, why: '檢出率與誤判率是取捨。' },
    { q: 'AOI 每班開線前應？', o: ['直接生產', '以標準樣品驗證判定正確', '把門檻調到最鬆'], a: 1, why: '確認檢測系統有效。' }] },
  { id: 'U07', machine: 'M07', n: '自動化與物流：從工站到倉儲', goal: '了解機械手臂、AMR 與條碼追溯如何串起物流。', prep: ['確認圍籬門連鎖', 'AMR 路線淨空'], steps: ['手臂取件組裝套管', '放入料箱並計數', '輸送帶送往包裝', '貼追溯標籤', 'AMR 搬運入庫'], before: 'P07', after: 'P07', principle: '以標準容器與條碼串連實物流與資訊流，讓每箱成品都能追溯工單與批號。', check: ['數量', '標籤', '組裝到位'], mistakes: ['手動繞過圍籬連鎖', '標籤與實物不符'], quiz: [
    { q: '條碼標籤最主要的價值？', o: ['美觀', '連結實物與工單、批號，達成追溯', '增加重量'], a: 1, why: '追溯是品質與物流的基礎。' }] },
];

// ---------------- 任務挑戰 ----------------
export interface TaskDef {
  id: string; n: string; machine: string; role: string; next?: string; part: { ok: string; opts: string[] };
  checks: { id: string; n: string; bad?: string; fix?: string }[]; tool: string; spec: { n: string; lo: number; hi: number; unit: string };
  measure: (p: Record<string, number>) => number; desc: string;
}
const near = (v: number, lo: number, hi: number) => (v < lo ? lo - v : v > hi ? v - hi : 0);
export const TASKS: TaskDef[] = [
  { id: 'T1', n: '冷鍛成形首件', machine: 'M01', role: 'R2', next: 'T2', desc: '完成 M10 六角螺栓胚體的冷鍛首件，頭部高度須在規格內。', part: { ok: 'P02', opts: ['P02', 'P01', 'N03'] },
    checks: [{ id: 'guard', n: '護罩連鎖測試', bad: '護罩連鎖開關鬆脫', fix: '通報保養修復並驗證' }, { id: 'lube', n: '潤滑油位' }, { id: 'die', n: '模具壽命計數', bad: '第 3 站模具超過壽命 8%', fix: '更換模具並重設計數' }, { id: 'estop', n: '緊急停止鈕復歸' }],
    tool: 'T01', spec: { n: '頭部高度', lo: 6.2, hi: 6.6, unit: 'mm' }, measure: (p) => 6.4 + (p.feedLen - 45) * 0.45 + near(p.speed, 80, 90) * 0.01 },
  { id: 'T2', n: '搓牙與螺紋判定', machine: 'M02', role: 'R4', next: 'T3', desc: '設定牙板間隙完成搓牙，以螺紋環規判定合格。', part: { ok: 'P03', opts: ['P03', 'P02', 'N05'] },
    checks: [{ id: 'die', n: '牙板壽命', bad: '牙板已達壽命 95%', fix: '更換牙板' }, { id: 'rail', n: '送料軌道方向' }, { id: 'gauge', n: '環規校正有效期', bad: '止端環規校正逾期', fix: '換用有效期內環規' }],
    tool: 'T03', spec: { n: '螺紋外徑', lo: 9.79, hi: 9.97, unit: 'mm' }, measure: (p) => 9.88 + (p.gap - 6.7) * 0.9 + Math.abs(p.align) * 0.02 },
  { id: 'T3', n: '熱處理批次硬度', machine: 'M04', role: 'R5', next: 'T4', desc: '設定爐溫與回火條件，使硬度落在規格（虛構指數）內。', part: { ok: 'P04', opts: ['P04', 'P06', 'P03'] },
    checks: [{ id: 'tc', n: '熱電偶校正', bad: '第二區熱電偶讀值跳動', fix: '更換熱電偶並校正' }, { id: 'belt', n: '網帶張力' }, { id: 'vent', n: '排氣與消防設備' }],
    tool: 'T10', spec: { n: '硬度（虛構指數）', lo: 32, hi: 39, unit: '' }, measure: (p) => 35.5 + p.tq * 0.6 - p.tt * 0.7 - near(p.load, 70, 88) * 0.15 },
  { id: 'T4', n: 'AOI 篩選驗證', machine: 'M06', role: 'R4', desc: '調整門檻與光源，讓標準樣品驗證的漏檢數為 0、誤判率低於 3%。', part: { ok: 'P06', opts: ['P06', 'P05', 'P04'] },
    checks: [{ id: 'lens', n: '鏡頭清潔', bad: '鏡頭有油霧', fix: '停機清潔鏡頭' }, { id: 'std', n: '標準樣品組' }, { id: 'air', n: '吹氣嘴氣壓' }],
    tool: 'T10', spec: { n: '誤判率', lo: 0, hi: 3, unit: '%' }, measure: (p) => 0.4 + 9 * Math.exp(-p.th * 5) + near(p.lux, 70, 90) * 0.08 },
  { id: 'T5', n: '預置扭力螺帽沖壓', machine: 'M03', role: 'R1', desc: '依來料硬度設定沖壓深度，使預置扭力（虛構單位）在規格內。', part: { ok: 'N05', opts: ['N05', 'N03', 'P04'] },
    checks: [{ id: 'curtain', n: '光柵功能測試', bad: '光柵間歇失效', fix: '更換光柵並驗證連鎖' }, { id: 'twohand', n: '雙手按鈕' }, { id: 'torque', n: '扭力扳手校正' }],
    tool: 'T05', spec: { n: '預置扭力', lo: 8.8, hi: 11.2, unit: '' }, measure: (p) => 4 + 0.12 * p.hard + 4.2 * p.depth - 0.03 * Math.max(0, p.hard - 34) * 10 * p.depth },
];

// 九宮格場景
export const CELLS = [
  { id: 'A1', n: '原材料、送料與進料檢驗', x: 0, y: 0, items: ['P01'], machines: [] as string[] },
  { id: 'A2', n: '高架資訊螢幕與中央指示系統', x: 1, y: 0, items: [], machines: [] },
  { id: 'A3', n: '熱處理與表面處理', x: 2, y: 0, items: [], machines: ['M04', 'M05'] },
  { id: 'B1', n: '主要成形設備', x: 0, y: 1, items: [], machines: ['M01'] },
  { id: 'B2', n: '核心互動工作站', x: 1, y: 1, items: [], machines: ['M02'] },
  { id: 'B3', n: '二次加工與精密設備', x: 2, y: 1, items: [], machines: ['M03'] },
  { id: 'C1', n: '模具與工具管理', x: 0, y: 2, items: ['T07', 'T08'], machines: [] },
  { id: 'C2', n: '工件檢視與操作介面', x: 1, y: 2, items: ['P04'], machines: [] },
  { id: 'C3', n: '品質檢查、包裝與物流', x: 2, y: 2, items: [], machines: ['M06', 'M07'] },
];
