// ============================================================
// 遊戲內容資料：職涯、NPC、章節、百科、專利、事件、成就
// 人物、制度、數據、事件皆為教育用途之虛構模擬
// ============================================================
import type { Effect } from './sim';

export type Branch = 'mfg' | 'qual' | 'prod' | 'ie' | 'it' | 'sys';
export type Dept = 'floor' | 'quality' | 'plan' | 'purchase' | 'it' | 'mgmt';

export const BRANCHES: Record<Branch, { name: string; en: string; color: string; items: string }> = {
  mfg: { name: '製造技術', en: 'Manufacturing Technology', color: '#ff9a3c', items: '材料、設備、冷鍛、搓牙、熱處理、表面處理、模具、維護' },
  qual: { name: '品質工程', en: 'Quality Engineering', color: '#ff5d73', items: 'QC、QA、SPC、MSA、FMEA、8D、六標準差' },
  prod: { name: '生產與物流管理', en: 'Production & Logistics', color: '#ffd23f', items: '排程、產能、MRP、庫存、倉儲、供應鏈、採購' },
  ie: { name: '工業工程', en: 'Industrial Engineering', color: '#7cf29c', items: '工作研究、時間研究、線平衡、精實、TOC、OR、人因工程' },
  it: { name: '資訊與人工智慧', en: 'IT & AI', color: '#39d5ff', items: 'Python、SQL、資料清理、機器學習、電腦視覺、RAG、API、部署' },
  sys: { name: '系統整合與領導', en: 'Systems Integration & Leadership', color: '#b78cff', items: 'ERP、MES、WMS、QMS、APS、IoT、CIM、專案管理、跨部門協調' },
};

export const DEPTS: Record<Dept, string> = { floor: '現場製造', quality: '品質', plan: '生管物管', purchase: '採購供應鏈', it: 'IT／OT', mgmt: '經營管理' };

export interface Career { title: string; en: string; req: { skills?: Partial<Record<Branch, number>>; certs?: string[]; trust?: Partial<Record<Dept, number>>; avg?: number; trustAvg?: number; }; }
export const CAREERS: Career[] = [
  { title: '產線作業員', en: 'Production Operator', req: {} },
  { title: '製程技術員', en: 'Process Technician', req: { skills: { mfg: 12 }, certs: ['安全教育合格', 'IQC 進料檢驗'], trust: { floor: 8 } } },
  { title: '資深技術員／現場領班', en: 'Senior Technician / Line Leader', req: { skills: { mfg: 35, qual: 18 }, certs: ['冷鍛技術', '螺紋檢驗', '特殊製程', '組裝檢驗'], avg: 55 } },
  { title: '生產與品質工程培訓人員', en: 'Production & Quality Engineering Trainee', req: { skills: { ie: 12 }, certs: ['現場領班實務'], trust: { floor: 25 } } },
  { title: '初階製程改善工程師', en: 'Junior Process Improvement Engineer', req: { skills: { prod: 22, qual: 30, ie: 20 }, certs: ['生管物管輪調', 'QC／QA 輪調', '採購供應鏈輪調'] } },
  { title: '製造資料分析師', en: 'Manufacturing Data Analyst', req: { skills: { it: 18, ie: 35 }, certs: ['IE 精實改善'] } },
  { title: '人工智慧工程師', en: 'AI Engineer', req: { skills: { it: 32 }, certs: ['IE 精實改善'], avg: 55 } },
  { title: '智慧製造系統工程師', en: 'Smart Manufacturing Systems Engineer', req: { skills: { it: 50, sys: 22 }, certs: ['AI 專案實績', 'AI 工程師生存戰通關'] } },
  { title: '電腦整合製造工程師', en: 'CIM Engineer', req: { skills: { sys: 38 }, certs: ['CIM 系統整合'] } },
  { title: '資深製程規劃暨 CIM 整合工程師', en: 'Senior Process Planning & CIM Integration Engineer', req: { skills: { sys: 50, ie: 50 }, trustAvg: 35 } },
];

export interface NPC { id: string; name: string; role: string; dept: Dept; stance: string; hair: string; skin: string; coat: string; glasses?: boolean; helmet?: boolean; style: number; }
export const NPCS: Record<string, NPC> = {
  chen: { id: 'chen', name: '陳金水（老陳）', role: '資深冷鍛師傅', dept: 'floor', stance: '重視經驗與設備手感，對「電腦說的」半信半疑。', hair: '#d9d9d9', skin: '#e0b48f', coat: '#2f5d8a', helmet: true, style: 2 },
  lin: { id: 'lin', name: '林美玲', role: '現場領班', dept: 'floor', stance: '產量要顧，人更要顧；最怕員工過勞出事。', hair: '#2b1d16', skin: '#f1c9a5', coat: '#e07a1f', helmet: true, style: 1 },
  huang: { id: 'huang', name: '黃志遠', role: '品質主管', dept: 'quality', stance: '規格就是規格，客戶信任一旦失去很難挽回。', hair: '#1c1c1c', skin: '#e8bf98', coat: '#f5f5f5', glasses: true, style: 0 },
  tsai: { id: 'tsai', name: '蔡佳蓉', role: '生管工程師', dept: 'plan', stance: '交期、產能、插單——她的白板永遠寫滿。', hair: '#4a2a1a', skin: '#f3cfb0', coat: '#3a7bd5', style: 3 },
  wu: { id: 'wu', name: '吳家豪', role: '物管人員', dept: 'plan', stance: '缺料比什麼都可怕，帳料不符他會睡不著。', hair: '#111', skin: '#d9a77f', coat: '#4a6b3a', style: 0 },
  chang: { id: 'chang', name: '張文琪', role: '採購主管', dept: 'purchase', stance: '價格、品質、供應風險三者都要談。', hair: '#3b2414', skin: '#f0c8a8', coat: '#7a3b69', glasses: true, style: 1 },
  hsu: { id: 'hsu', name: '許博鈞', role: 'IE 導師', dept: 'mgmt', stance: '先找瓶頸，再談投資；局部最佳不等於整體最佳。', hair: '#2a2a2a', skin: '#e6b991', coat: '#1f6f6f', glasses: true, style: 2 },
  cheng: { id: 'cheng', name: '鄭宇辰', role: 'AI 技術導師', dept: 'it', stance: '資料品質決定模型上限；模型要能被驗證與追溯。', hair: '#15151f', skin: '#f2cda9', coat: '#20304f', style: 3 },
  ho: { id: 'ho', name: '何俊宏', role: 'IT／OT 工程師', dept: 'it', stance: '系統穩定與資安第一，任何寫入都要有權限與紀錄。', hair: '#222', skin: '#dcae86', coat: '#3c3c46', glasses: true, style: 0 },
  keller: { id: 'keller', name: 'Anna Keller', role: '海外客戶代表（虛構 A 車廠）', dept: 'mgmt', stance: '品質、交期與透明溝通是合作的前提。', hair: '#d8b25a', skin: '#f6d6c0', coat: '#5a5f73', style: 1 },
  chou: { id: 'chou', name: '周振邦', role: '營運副總', dept: 'mgmt', stance: '看長期投資效益與整體策略，不喜歡沒有數據的提案。', hair: '#8a8a8a', skin: '#e2b590', coat: '#1d2a44', style: 2 },
  li: { id: 'li', name: '李淑芬', role: '財務主管', dept: 'mgmt', stance: '每一筆追加預算都要說清楚 ROI 與現金流。', hair: '#3a2010', skin: '#f2caa6', coat: '#6b5b3a', glasses: true, style: 1 },
};

export interface Panel { npc: string; text: string; }
export interface DilemmaOpt { label: string; desc: string; effect: Effect; react: string; }
export interface Chapter {
  id: number; code: string; title: string; role: string; area: number; requiredPos: number;
  panels: Panel[]; objectives: string[]; tutorial: string[]; game: string; cfg?: any;
  dilemma: { prompt: string; views: Panel[]; options: DilemmaOpt[] };
  reward: { xp: Partial<Record<Branch, number>>; funds: number; cert?: string; trust: Partial<Record<Dept, number>>; promoteTo?: number };
  journal: string; codex: string[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 0, code: '序章', title: '第一天上班', role: '產線新人（Production Trainee）', area: 4, requiredPos: 0,
    panels: [
      { npc: 'lin', text: '歡迎來到冷鍛廠房！先別急著碰機器——在這裡，第一件事永遠是安全。' },
      { npc: 'chen', text: '這台多工位打頭機一分鐘打上百顆，手伸錯地方，後悔來不及。' },
      { npc: 'lin', text: '今天把個人防護具（PPE）、5S 跟標準作業程序（SOP）弄清楚。找得出危險，才有資格操作。' },
    ],
    objectives: ['在模擬產線找出所有危險點', '選擇正確的個人防護具（PPE）', '判斷何時必須停機通報'],
    tutorial: ['個人防護具（Personal Protective Equipment, PPE）：安全鞋、護目鏡、耳罩等，依作業風險配戴。', '5S：整理、整頓、清掃、清潔、素養，讓異常「一眼看得出來」。', '標準作業程序（Standard Operating Procedure, SOP）：讓每個人用同樣安全、正確的方法完成作業。', '旋轉機台附近不可配戴棉紗手套、飾品，長髮需束起，避免捲入。'],
    game: 'hazard',
    dilemma: {
      prompt: '下班前 30 分鐘，你發現打頭機護蓋連鎖開關鬆脫，但機台還能運轉。訂單很趕，你會？',
      views: [{ npc: 'tsai', text: '今天這批是 A 車廠的，晚交會被罰……' }, { npc: 'lin', text: '連鎖失效就是重大風險，沒有商量餘地。' }],
      options: [
        { label: '立即停機、掛牌上鎖（LOTO）並通報領班', desc: '安全優先，請保養課修復後再復機。', effect: { trust: { floor: 6, quality: 2 }, brand: 1 }, react: '林美玲：做得好。產量可以補，手指補不回來。' },
        { label: '先通報，請領班決定，自己繼續作業', desc: '有通報，但仍在風險下作業。', effect: { trust: { floor: 1 } }, react: '林美玲：通報是對的，但「風險下繼續作業」不是選項。下次直接停機。' },
        { label: '用膠帶固定開關，下班再說', desc: '暫時維持產出。', effect: { trust: { floor: -8, quality: -4 }, addRisk: '冷鍛機護蓋連鎖失效', flag: 'unsafe' }, react: '林美玲（臉色鐵青）：這是違反安全規範！馬上停機。這件事會記錄下來。' },
      ],
    },
    reward: { xp: { mfg: 8, qual: 2 }, funds: 50000, cert: '安全教育合格', trust: { floor: 5 } },
    journal: '第一天，我學到：安全、紀律、品質與標準化，是製造業的地基。',
    codex: ['ppe', '5s', 'sop', 'loto'],
  },
  {
    id: 1, code: '第一章', title: '從鋼材認識扣件', role: '原料檢驗及備料作業員（Material Handling Operator）', area: 1, requiredPos: 0,
    panels: [
      { npc: 'wu', text: '這些盤元是上游鋼廠軋好的線材，我們不煉鋼，但我們要對每一捲負責。' },
      { npc: 'huang', text: '材質證明（Mill Certificate）、爐號、標籤要三方一致。對不上，就不能上線。' },
      { npc: 'wu', text: '今天有一批交貨延遲，還有一捲外觀怪怪的。你來判斷怎麼處置。' },
    ],
    objectives: ['比對材質證明、標籤與訂單需求', '對每批原料做出正確處置', '處理供應商延遲造成的缺料'],
    tutorial: ['小鋼胚與盤元屬於上游鋼鐵供應鏈；扣件廠多半向鋼廠或線材廠採購。', '球化退火（Spheroidizing Annealing）與伸線（Wire Drawing）的先後順序依鋼種、產品與製造路徑而不同。', '進料檢驗（Incoming Quality Control, IQC）：在原料進廠時把關。', '可追溯性（Traceability）：成品批號能一路追回原料爐號。'],
    game: 'trace',
    dilemma: {
      prompt: '標籤不符的那捲盤元，生管希望「先用掉，反正看起來一樣」。你怎麼回應？',
      views: [{ npc: 'tsai', text: '產線等料等到要停了！' }, { npc: 'huang', text: '材質不明的料，做出來就是不明的產品。' }],
      options: [
        { label: '維持隔離，請供應商補正文件並加急補料', desc: '支付加急運費 NT$30,000。', effect: { funds: -30000, trust: { quality: 6, plan: -2 } }, react: '黃志遠：很好。可追溯性不是文書作業，是客戶安全。' },
        { label: '隔離並送材質分析（光譜檢驗）確認', desc: '花費 NT$8,000，延遲半天。', effect: { funds: -8000, trust: { quality: 5, plan: 1 } }, react: '黃志遠：用數據說話。確認前誰都不准動。' },
        { label: '先投產，事後補文件', desc: '暫時解決缺料。', effect: { trust: { quality: -10 }, f: { latent: 0.002 }, flag: 'badMaterial', brand: -2 }, react: '黃志遠：這批產品我會全數追蹤。你不知道你冒了多大的風險。' },
      ],
    },
    reward: { xp: { mfg: 6, qual: 5, prod: 3 }, funds: 60000, cert: 'IQC 進料檢驗', trust: { quality: 4, plan: 3 }, promoteTo: 1 },
    journal: '一捲盤元背後，有爐號、材證、批號與一整條供應鏈。品質從進料就開始了。',
    codex: ['wirerod', 'spheroidize', 'drawing', 'iqc', 'trace'],
  },
  {
    id: 2, code: '第二章', title: '冷鍛與模具', role: '冷鍛製程技術員（Cold Forging Technician）', area: 4, requiredPos: 1,
    panels: [
      { npc: 'chen', text: '多工位打頭機一站一站把線材「擠」成螺絲頭。模具就是它的牙齒。' },
      { npc: 'chen', text: '轉速開太快，模具磨得快，頭部就裂；保養太勤，又一直停機。' },
      { npc: 'hsu', text: '你的任務是在安全工作窗口內，找出單位良品成本最低的組合。' },
    ],
    objectives: ['設定生產速度（不得超出安全窗口）', '設定模具保養週期', '選擇換模排序策略'],
    tutorial: ['冷鍛（Cold Forging）：在常溫下以多工位模具成形，材料利用率高。', '模具壽命（Die Life）受速度、材料硬度、潤滑影響。', '標準工時（Standard Time）＝正常時間 ×（1＋寬放率）。', '遊戲參數為教學簡化，不可直接套用至實際設備。'],
    game: 'param', cfg: 'forge',
    dilemma: {
      prompt: '老陳說：「憑我的經驗，再撐兩萬顆再換模沒問題。」IE 導師說要照數據設定。你怎麼做？',
      views: [{ npc: 'chen', text: '三十年了，聽聲音我就知道模具還行。' }, { npc: 'hsu', text: '經驗很寶貴，但要變成可驗證的標準。' }],
      options: [
        { label: '把老陳的經驗變成點檢標準：聲音＋頭部外觀＋計數三重判斷', desc: '經驗標準化。', effect: { trust: { floor: 6, mgmt: 2 }, st: { forge: { Q: 0.002 } } }, react: '老陳（笑）：年輕人有想法。我教你怎麼聽。' },
        { label: '直接依數據設定，不考慮師傅意見', desc: '效率高但傷感情。', effect: { trust: { floor: -4, mgmt: 2 } }, react: '老陳：哼，好吧。機器壞了別來找我。' },
        { label: '照老陳的建議延長換模', desc: '暫時減少停機。', effect: { trust: { floor: 3 }, st: { forge: { Q: -0.004 } }, flag: 'skipMaint' }, react: '許博鈞：短期停機少了，但模具磨耗會反映在不良率。我們觀察看看。' },
      ],
    },
    reward: { xp: { mfg: 10, ie: 3 }, funds: 60000, cert: '冷鍛技術', trust: { floor: 5 } },
    journal: '模具壽命、產量與良率是一組取捨；經驗要變成標準，才能傳承。',
    codex: ['coldforge', 'dielife', 'stdtime', 'smed'],
  },
  {
    id: 3, code: '第三章', title: '螺紋的秘密', role: '搓牙／攻牙技術員（Threading Technician）', area: 5, requiredPos: 1,
    panels: [
      { npc: 'lin', text: '螺栓的外螺紋用牙板「搓」出來；螺帽的內螺紋用絲攻「攻」出來。別搞混了。' },
      { npc: 'huang', text: '缺牙、錯牙、牙型變形，裝到車上就是鎖不緊。' },
      { npc: 'huang', text: '用放大檢驗台，一顆一顆判。判錯成本很高——漏檢更高。' },
    ],
    objectives: ['區分搓牙與攻牙', '以放大介面判定良品與不良品', '比較人工判定與 AI 模擬結果'],
    tutorial: ['搓牙（Thread Rolling）：以兩片牙板滾壓出外螺紋，屬塑性成形，不產生切屑。', '攻牙（Tapping）：以絲攻加工螺帽內螺紋。', '品質成本（Cost of Quality）：預防成本＋鑑定成本＋內部失敗＋外部失敗。', '自鎖與防鬆結構是以特定牙型或局部變形產生預置扭力（Prevailing Torque）。'],
    game: 'inspect', cfg: 'thread',
    dilemma: {
      prompt: '牙板快到壽命，生管要你撐到週末再換。你觀察到缺牙比例開始上升。',
      views: [{ npc: 'tsai', text: '週末換線比較不影響出貨。' }, { npc: 'huang', text: '缺牙是漸進的，等你看到就已經做出一堆了。' }],
      options: [
        { label: '今天換牙板，並把牙板壽命納入預防保養', desc: '停機 1 小時，費用 NT$12,000。', effect: { funds: -12000, st: { thread: { Q: 0.004 } }, trust: { quality: 5, plan: -1 } }, react: '黃志遠：預防永遠比檢驗便宜。' },
        { label: '撐到週末，但加嚴抽檢頻率', desc: '鑑定成本上升。', effect: { funds: -5000, trust: { quality: 1, plan: 3 } }, react: '蔡佳蓉：謝啦！不過抽檢多了，品保那邊也要人力。' },
        { label: '照常生產', desc: '不增加成本。', effect: { st: { thread: { Q: -0.006 } }, flag: 'threadWear', trust: { quality: -4 } }, react: '黃志遠：等著看不良率曲線吧。' },
      ],
    },
    reward: { xp: { mfg: 8, qual: 7 }, funds: 60000, cert: '螺紋檢驗', trust: { quality: 5 } },
    journal: '外螺紋搓牙、內螺紋攻牙。檢驗能抓出不良，但預防才能減少不良。',
    codex: ['rolling', 'tapping', 'coq', 'prevailing', 'gauge'],
  },
  {
    id: 4, code: '第四章', title: '熱處理與表面處理', role: '特殊製程技術員（Special Process Technician）', area: 6, requiredPos: 1,
    panels: [
      { npc: 'huang', text: '熱處理和表面處理是「特殊製程」——結果無法只靠最終檢驗完全確認，必須控制過程。' },
      { npc: 'lin', text: '爐子是批次運作，湊滿一爐才省能源，但等太久，後段就斷料。' },
      { npc: 'huang', text: '預置扭力螺帽更講究：熱處理後的硬度，要跟後續軸向沖壓條件配合。' },
    ],
    objectives: ['設定熱處理裝載率與湊批等待上限', '把回火條件維持在安全窗口', '設定鍍層膜厚目標，兼顧摩擦係數'],
    tutorial: ['特殊製程（Special Process）：需以參數監控與驗證確保品質的製程。', '批次製程（Batch Process）：一次處理一爐，裝載率影響能耗與均勻性。', '摩擦係數（Coefficient of Friction）影響鎖附扭力與夾緊力的關係。', '公開專利 TWI753649B（預置扭力螺帽製成方法）的重點在熱處理後硬度與特定軸向沖壓條件的配合，而非一般熱處理。'],
    game: 'param', cfg: 'heat',
    dilemma: {
      prompt: '爐溫記錄器顯示某批次有 20 分鐘溫度偏移。產品外觀正常，客戶明天要貨。',
      views: [{ npc: 'tsai', text: '外觀都好好的，可以出吧？' }, { npc: 'huang', text: '硬度看不出來，要驗。' }],
      options: [
        { label: '隔離該批，加做硬度抽驗與金相確認', desc: '檢驗費 NT$15,000，延遲一天。', effect: { funds: -15000, trust: { quality: 7, plan: -2 }, brand: 1 }, react: '黃志遠：這就是特殊製程控制。數據清楚了才放行。' },
        { label: '全數重新熱處理', desc: '保守但耗能耗時。', effect: { funds: -30000, f: { energyFactor: 0.01 }, trust: { quality: 3, plan: -4 } }, react: '林美玲：保險是保險，不過爐子又要排一輪了。' },
        { label: '直接出貨，備註給客戶', desc: '準時交貨。', effect: { f: { latent: 0.002 }, brand: -4, trust: { quality: -8 }, flag: 'heatEscape' }, react: 'Anna Keller（電話）：我們收到備註……你們確定這批是合格的嗎？' },
      ],
    },
    reward: { xp: { mfg: 9, qual: 6 }, funds: 70000, cert: '特殊製程', trust: { quality: 5 } },
    journal: '看不見的品質要靠製程控制來保證。批次、能源與交期也是同一題。',
    codex: ['heat', 'special', 'batch', 'cof', 'tw753649'],
  },
  {
    id: 5, code: '第五章', title: '組裝與光學檢驗', role: '組裝與檢驗技術員（Assembly and Inspection Technician）', area: 9, requiredPos: 1,
    panels: [
      { npc: 'lin', text: '組合式套管螺絲：套管要套上、要限位、不能掉。一顆脫落，客戶產線就停。' },
      { npc: 'huang', text: '光學篩選機很快，但門檻設太嚴，好品被剔除；設太鬆，漏檢流到客戶。' },
      { npc: 'hsu', text: '檢出率與誤判率之間要用成本來取捨。' },
    ],
    objectives: ['判定套管螺絲與螺栓瑕疵', '設定光學檢驗門檻', '計算檢驗成本與漏檢風險'],
    tutorial: ['光學檢驗（Optical Inspection）：以相機與影像處理自動篩選。', '檢出率（Detection Rate）：不良品被抓出的比例。', '誤判率（False Reject Rate）：良品被誤判為不良的比例。', '相關專利：TWI683065B、TWI710715B、TWI761005B、TWM608701U（見百科專利卡）。'],
    game: 'inspect', cfg: 'optical',
    dilemma: {
      prompt: '光學機誤判太多，現場希望調鬆門檻；品保要求維持。你負責提出方案。',
      views: [{ npc: 'lin', text: '人工複判的人快忙不過來了！' }, { npc: 'huang', text: '鬆一點，就有東西流出去。' }],
      options: [
        { label: '維持門檻，增加複判站並收集誤判影像改善演算法', desc: '每週 NT$6,000 人力。', effect: { funds: -20000, f: { falseReject: -0.004 }, trust: { quality: 4, floor: 3 } }, react: '黃志遠：誤判影像是寶貴的資料，以後做 AI 用得到。' },
        { label: '依產品分別設定門檻（套管品較嚴）', desc: '需要建立產品參數表。', effect: { f: { falseReject: -0.003, detect: 0.003 }, trust: { quality: 3, floor: 2 } }, react: '許博鈞：分眾設定，很好的系統思維。' },
        { label: '整體調鬆門檻', desc: '誤判立刻下降。', effect: { f: { falseReject: -0.008, detect: -0.03 }, trust: { quality: -6, floor: 4 }, flag: 'looseOptical' }, react: '黃志遠：下個月的 PPM 你自己跟客戶解釋。' },
      ],
    },
    reward: { xp: { mfg: 6, qual: 9 }, funds: 70000, cert: '組裝檢驗', trust: { quality: 5, floor: 3 }, promoteTo: 2 },
    journal: '產品結構決定檢驗重點；檢出率與誤判率是一組要用成本衡量的取捨。',
    codex: ['optical', 'detect', 'falsereject', 'tw683065', 'tw710715', 'tw761005', 'twm608701'],
  },
  {
    id: 6, code: '第六章', title: '第一次帶領團隊', role: '資深技術員／現場領班（Senior Technician / Line Leader）', area: 5, requiredPos: 2,
    panels: [
      { npc: 'lin', text: '從今天起你帶夜班。你不再只顧一台機器，而是一整個班。' },
      { npc: 'lin', text: '今晚有兩位請假，國華已經連續加班一週。' },
      { npc: 'hsu', text: '人力有限時，先保護瓶頸站，再看人因與安全。' },
    ],
    objectives: ['在缺工下分派作業員', '不讓未認證人員操作高風險設備', '避免高疲勞者排在高風險站'],
    tutorial: ['設備綜合效率（Overall Equipment Effectiveness, OEE）＝可用率 × 效能 × 品質。', '全員生產保全（Total Productive Maintenance, TPM）：讓操作員參與日常保養。', '人因工程（Ergonomics）：讓工作適合人，降低疲勞與錯誤。', '瓶頸站損失一小時，就是整條線損失一小時。'],
    game: 'crew',
    dilemma: {
      prompt: '產量差一點達標。生管建議要國華再加班 4 小時。',
      views: [{ npc: 'tsai', text: '差這一點就達標了！' }, { npc: 'lin', text: '他已經連七天了。' }],
      options: [
        { label: '不加班，向生管說明並調整明日排程', desc: '保護員工，交期壓力轉移。', effect: { trust: { floor: 7, plan: -3 }, f: { training: 2 } }, react: '林美玲：謝謝你。這才是領班該做的。' },
        { label: '找自願且未疲勞的同仁加班 2 小時', desc: '人力成本增加。', effect: { funds: -6000, trust: { floor: 3, plan: 3 } }, react: '蔡佳蓉：兩邊都顧到了，不錯。' },
        { label: '要求國華加班', desc: '達標。', effect: { trust: { floor: -6, plan: 4 }, f: { overtimeH: 2 }, flag: 'fatigue' }, react: '林美玲：……我會盯著他。出事的話誰負責？' },
      ],
    },
    reward: { xp: { ie: 10, sys: 6, mfg: 3 }, funds: 80000, cert: '現場領班實務', trust: { floor: 8 }, promoteTo: 3 },
    journal: '帶人比帶機器難。產量、安全、負荷與品質要一起平衡。',
    codex: ['oee', 'tpm', 'ergonomics', 'bottleneck'],
  },
  {
    id: 7, code: '第七章', title: '生產管理與物料控制', role: '輪調：生產管理工程師／物料規劃工程師', area: 11, requiredPos: 3,
    panels: [
      { npc: 'tsai', text: '歡迎來到生管！這裡看的不是一台機器，是全部訂單跟全部產能。' },
      { npc: 'wu', text: '套管庫存不夠，急單又插進來了。物料清單（BOM）你先看一下。' },
      { npc: 'tsai', text: '把訂單排到機台上，盡量準時足量交貨，換線越少越好。' },
    ],
    objectives: ['把 7 張訂單排入 3 台機台', '降低換線損失並滿足交期', '依 MRP 計算套管淨需求並下採購'],
    tutorial: ['物料需求規劃（Material Requirements Planning, MRP）：毛需求 − 庫存 − 在途 ＋ 安全庫存 ＝ 淨需求。', '物料清單（Bill of Materials, BOM）：一顆套管螺絲＝1 支螺絲本體＋1 個套管。', '有限產能排程（Finite Capacity Scheduling）：排程不可超過機台可用時數。', '準時足量交貨率（On Time In Full, OTIF）。'],
    game: 'schedule',
    dilemma: {
      prompt: '業務又接到一張急單，要求插在最前面；品保同時要求把一批可疑品先重工。',
      views: [{ npc: 'tsai', text: '急單客戶是新的系統供應商（虛構 B 公司），很重要。' }, { npc: 'huang', text: '可疑品不先處理，庫存帳也會亂。' }],
      options: [
        { label: '召開產銷會議，以產能負荷數據協調交期', desc: '急單分批交，可疑品先隔離。', effect: { trust: { plan: 5, quality: 3, mgmt: 3 } }, react: '周振邦：用數據協調，這是我想看到的。' },
        { label: '急單優先，可疑品延後處理', desc: '客戶滿意，品保不滿。', effect: { trust: { plan: 4, quality: -4 }, brand: 1 }, react: '黃志遠：庫存裡放著可疑品，遲早出事。' },
        { label: '拒絕急單', desc: '維持原排程。', effect: { trust: { plan: -3, mgmt: -3 }, brand: -2 }, react: '周振邦：拒絕之前，至少要給客戶一個可行方案。' },
      ],
    },
    reward: { xp: { prod: 14, ie: 4 }, funds: 90000, cert: '生管物管輪調', trust: { plan: 8 } },
    journal: '排程是產能、物料與交期的拼圖；插單的代價常常藏在換線與 WIP 裡。',
    codex: ['mrp', 'bom', 'crp', 'finite', 'safetystock', 'setup', 'otif', 'aps'],
  },
  {
    id: 8, code: '第八章', title: '品質工程與六標準差', role: '輪調：品管工程師（QCE）／品保工程師（QAE）', area: 9, requiredPos: 3,
    panels: [
      { npc: 'huang', text: 'A 車廠反映預置扭力螺帽的扭力偏高。我們要找出原因，不是找人背鍋。' },
      { npc: 'huang', text: 'QC 看產品與製程數據；QA 看系統、預防與稽核。兩邊都要懂。' },
      { npc: 'hsu', text: '記住：相關不等於因果。要設計能驗證假說的實驗。' },
    ],
    objectives: ['在管制圖上找出異常點', '解讀 Cp／Cpk 與柏拉圖', '提出可驗證的根因假說', '區分 QC 與 QA 職責'],
    tutorial: ['統計製程管制（Statistical Process Control, SPC）：以管制圖監控製程變異。', '製程能力指標（Cp / Cpk）：Cpk 同時考慮變異與偏移。', '柏拉圖（Pareto Chart）：先處理影響最大的少數問題。', '六標準差（Six Sigma）DMAIC：定義、量測、分析、改善、管制。'],
    game: 'spc',
    dilemma: {
      prompt: '數據顯示異常與新批號盤元同時出現，也與夜班交接同時出現。業務希望馬上給客戶結論。',
      views: [{ npc: 'keller', text: 'We need your root cause within 48 hours.' }, { npc: 'huang', text: '給錯結論，比晚一天給結論更糟。' }],
      options: [
        { label: '先提交 8D 的 D3 圍堵與 D4 驗證計畫，48 小時內回報實驗結果', desc: '透明溝通。', effect: { trust: { quality: 7, mgmt: 3 }, brand: 3, f: { latent: -0.0005 } }, react: 'Anna Keller：Clear plan, clear timeline. Thank you.' },
        { label: '直接回覆「供應商材料問題」', desc: '快速結案。', effect: { trust: { quality: -5, purchase: -5 }, brand: -2 }, react: '張文琪：供應商要我們拿出證據，我們拿不出來。' },
        { label: '回覆「夜班人員操作疏失」並懲處', desc: '快速結案。', effect: { trust: { floor: -10, quality: -3 }, brand: -1 }, react: '林美玲：你連實驗都沒做就認定是人的問題？' },
      ],
    },
    reward: { xp: { qual: 14, it: 3 }, funds: 90000, cert: 'QC／QA 輪調', trust: { quality: 8 } },
    journal: '異常訊號要用統計看，根因要用實驗證；8D 與 DMAIC 是說服客戶的語言。',
    codex: ['spc', 'controlchart', 'cpk', 'pareto', 'fishbone', '5why', 'fmea', '8d', 'dmaic', 'msa', 'qcqa'],
  },
  {
    id: 9, code: '第九章', title: '採購與供應鏈危機', role: '輪調：採購工程師／供應鏈分析師', area: 1, requiredPos: 3,
    panels: [
      { npc: 'chang', text: '下個月需要 120 噸盤元。乙貿易報價最低，你覺得要全下給他嗎？' },
      { npc: 'li', text: '我只看總成本。單價低不代表總成本低。' },
      { npc: 'chang', text: '把價格、交期、品質、運輸、庫存與風險一起算。' },
    ],
    objectives: ['分配三家供應商的採購比例', '選擇運輸方式與安全庫存', '比較總持有成本（TCO）並處理運輸受阻'],
    tutorial: ['總持有成本（Total Cost of Ownership, TCO）：單價＋運輸＋品質成本＋缺料風險＋庫存持有。', '供應商績效（Supplier Performance）：準交率、品質 PPM、回應速度。', '交期（Lead Time）：從下單到收料的時間。', '存貨周轉（Inventory Turnover）：銷貨成本／平均存貨。'],
    game: 'supply',
    dilemma: {
      prompt: '最便宜的乙貿易提出：若一次簽一年長約，再降 5%。',
      views: [{ npc: 'li', text: '一年省下的錢很可觀。' }, { npc: 'chang', text: '他的準交率只有 82%。' }],
      options: [
        { label: '簽小量試行約，附準交率與品質改善條款', desc: '分散風險，逐步評估。', effect: { trust: { purchase: 7, mgmt: 3 }, f: { priceFactor: -0.01 } }, react: '張文琪：有條件的合作，讓供應商有誘因改善。' },
        { label: '維持多源採購，不簽長約', desc: '風險最低。', effect: { trust: { purchase: 4, mgmt: -1 } }, react: '李淑芬：穩健，但我希望看到降本計畫。' },
        { label: '簽一年長約，全部轉單', desc: '單價最低。', effect: { f: { priceFactor: -0.04, supplierDelay: 0.12 }, trust: { purchase: -4, mgmt: 3 }, flag: 'singleSource' }, react: '張文琪：……希望海運別出事。' },
      ],
    },
    reward: { xp: { prod: 10, sys: 4 }, funds: 90000, cert: '採購供應鏈輪調', trust: { purchase: 8 }, promoteTo: 4 },
    journal: '最低單價不等於最低總成本；供應鏈的韌性要事先設計。',
    codex: ['tco', 'supplierperf', 'leadtime', 'supplyrisk', 'turnover'],
  },
  {
    id: 10, code: '第十章', title: '從現場改善走向資料科學', role: '製程改善工程師／製造資料分析師', area: 11, requiredPos: 4,
    panels: [
      { npc: 'hsu', text: '你開始進修 Python、統計與 SQL 了吧？現場資料很髒，先學會清理。' },
      { npc: 'hsu', text: '然後用節拍時間（Takt Time）對照各站週期時間，找出真正的瓶頸。' },
      { npc: 'li', text: '改善方案請附上投入與效益，我要看 ROI。' },
    ],
    objectives: ['清理缺失、重複與格式錯誤的資料', '比較各站週期時間與節拍時間，找出瓶頸', '正確區分 Takt／Cycle／Lead Time，套用小法則', '在預算內選擇改善方案'],
    tutorial: ['節拍時間（Takt Time）＝可用生產時間 ÷ 客戶需求量。', '週期時間（Cycle Time）：某站完成一單位所需的實際時間。', '前置時間（Lead Time）：從投料（或接單）到完成交付的總時間。', '小法則（Little\'s Law）：WIP ＝ 產出率 × 流程時間（單位須一致）。', '限制理論（Theory of Constraints, TOC）：改善非瓶頸，不一定改善整條產線。'],
    game: 'data',
    dilemma: {
      prompt: '主管問你：既然有資料了，要不要每站都裝感測器、做一個大儀表板？',
      views: [{ npc: 'chou', text: '數位化，大家都在做。' }, { npc: 'hsu', text: '先回答「要解決什麼問題」。' }],
      options: [
        { label: '先在瓶頸站做資料收集與改善，驗證後再擴大', desc: '聚焦、可驗證。', effect: { trust: { mgmt: 5, floor: 2 }, f: { dataQuality: 0.03 } }, react: '周振邦：小步快跑、看得到成效。我支持。' },
        { label: '全廠一次導入', desc: '投資大、風險高。', effect: { funds: -80000, f: { dataQuality: 0.04, opexExtra: 5000 }, trust: { mgmt: 1, it: -2 } }, react: '何俊宏：一次接這麼多設備，網路與資安我需要時間。' },
        { label: '先不做，維持紙本', desc: '零投資。', effect: { trust: { mgmt: -4 } }, react: '許博鈞：沒有資料，改善就只能靠感覺。' },
      ],
    },
    reward: { xp: { ie: 14, it: 10 }, funds: 300000, cert: 'IE 精實改善', trust: { mgmt: 6, floor: 3 }, promoteTo: 6 },
    journal: '資料要先乾淨，分析才可信。找到真正的瓶頸，改善才有槓桿。',
    codex: ['takt', 'cycletime', 'lean', 'waste', 'toc', 'littles', 'vsm', 'linebal', 'or', 'des', 'datacleaning'],
  },
  {
    id: 11, code: '第十一章', title: '轉職 AI 工程師', role: '人工智慧工程師（AI Engineer）', area: 12, requiredPos: 6,
    panels: [
      { npc: 'cheng', text: '恭喜通過實務考核！歡迎來到 AI 研發室。這裡有四個專案等你。' },
      { npc: 'ho', text: '提醒你：AI 不可以直接改生產參數、品質放行或採購紀錄。所有寫入都要有權限與人工確認。' },
      { npc: 'cheng', text: '我們的模擬器是「教學模擬」，不是真的深度學習訓練。但決策邏輯是一樣的。' },
    ],
    objectives: ['完成至少 3 個 AI 專案（共 4 個）', '每個專案都要通過資料、模型、評估與部署關卡', '確保來源追溯、人工確認與安全限制'],
    tutorial: ['精確率（Precision）：判為不良者中，真正不良的比例。', '召回率（Recall）：所有不良品中，被抓出的比例。', '資料洩漏（Data Leakage）：測試資料混入訓練，讓模型看起來很準。', '檢索增強生成（Retrieval-Augmented Generation, RAG）：先檢索文件，再生成有來源的回答。'],
    game: 'ailab',
    dilemma: {
      prompt: '高層看到 FastenerVision AI 的展示，希望下週直接取代所有人工複判。',
      views: [{ npc: 'chou', text: '人力成本可以省下來。' }, { npc: 'cheng', text: '模型還沒經過產線資料漂移的考驗。' }],
      options: [
        { label: '先以影子模式並行一個月，再分階段取代', desc: '風險可控。', effect: { trust: { it: 6, quality: 4, mgmt: 2 } }, react: '鄭宇辰：這才是負責任的部署。' },
        { label: 'AI 判定＋人工抽查高風險品', desc: '折衷。', effect: { trust: { it: 3, quality: 3, mgmt: 3 } }, react: '黃志遠：可以接受，但要定期比對漏檢率。' },
        { label: '下週全面取代', desc: '省人力。', effect: { trust: { it: -4, quality: -6, mgmt: 4 }, f: { detect: -0.02 }, flag: 'aiRush' }, react: '鄭宇辰：如果資料漂移，我們會在客戶那裡才發現。' },
      ],
    },
    reward: { xp: { it: 18, sys: 6 }, funds: 150000, cert: 'AI 專案實績', trust: { it: 8 } },
    journal: 'AI 的價值在於可驗證、可追溯、可維運；人工確認不是負擔，是保險。',
    codex: ['precision', 'recall', 'confusion', 'leakage', 'drift', 'rag', 'vlm', 'ocr', 'etl', 'sql', 'pdm', 'cv'],
  },
  {
    id: 12, code: '第十二章', title: 'AI 工程師生存戰', role: '人工智慧工程師（AI Engineer）・階段考核', area: 12, requiredPos: 6,
    panels: [
      { npc: 'chou', text: '四個 AI 專案做得不錯。但真正的考驗是：把 AI 變成全公司每天在用、出事也撐得住的正式系統。' },
      { npc: 'cheng', text: '接下來你要主導數位轉型專案：報價、圖面解析、ERP 整合、知識問答、Agent、GPU 部署到上線，一共九關。' },
      { npc: 'li', text: '預算 500 萬、工期 120 天。超支、延誤或出重大事故，我都會記在帳上。' },
      { npc: 'ho', text: '這關過了，你才算真的能扛起「智慧製造系統工程師」。記住：權限、追溯、回滾，一個都不能少。' },
    ],
    objectives: ['以「職涯模式」完成《SUMEEKO：AI 工程師生存戰》九大關卡', '在預算、工期、品質、資安與客戶信任之間做 AI 工程決策', '處理事故並完成應變檢討', '達成結局 A、B 或 D 才算通過考核'],
    tutorial: ['最小可行產品（Minimum Viable Product, MVP）：先交付能驗證核心價值的最小範圍。', '角色型存取控制（Role-Based Access Control, RBAC）：依角色授權，例如業務看不到成本明細。', '冪等性（Idempotency）：同一筆請求重送多次，結果只發生一次，ERP 整合必備。', '人工介入（Human-in-the-Loop, HITL）：AI Agent 的關鍵動作保留人工核准。', '模型量化（Quantization）：以 INT8／INT4 降低 GPU 記憶體需求，但可能犧牲品質。', '生存戰在全螢幕視窗中進行，進度會自動保存；完成後結果會自動回傳主線。'],
    game: 'survival',
    dilemma: {
      prompt: '專案結束後，周副總問你：下一階段要先擴充更多 AI 功能，還是先把系統整合與維運體制補齊？',
      views: [{ npc: 'chou', text: '其他部門都在排隊要 AI 功能。' }, { npc: 'ho', text: '沒有監控、權限稽核和回滾機制，功能越多越危險。' }],
      options: [
        { label: '先建立 MLOps／系統維運與跨系統整合，再分批擴充功能', desc: '為 CIM 整合打地基。', effect: { trust: { it: 6, mgmt: 3 }, f: { dataQuality: 0.03 } }, react: '何俊宏：有你這句話，CIM 整合就有機會做對。' },
        { label: '維運與新功能各投入一半人力', desc: '兩邊都顧，但都比較慢。', effect: { trust: { it: 3, mgmt: 4 } }, react: '周振邦：可以，季底我要看到兩邊的進度。' },
        { label: '全力擴充新 AI 功能', desc: '短期亮點最多。', effect: { trust: { it: -5, mgmt: 5 }, f: { opexExtra: 8000 }, flag: 'aiRush' }, react: '鄭宇辰：功能上得快，但資料漂移和權限問題會一起長大。' },
      ],
    },
    reward: { xp: { it: 12, sys: 10, qual: 3 }, funds: 150000, cert: 'AI 工程師生存戰通關', trust: { it: 6, mgmt: 4 }, promoteTo: 7 },
    journal: '把 AI 從展示變成正式系統：需求、程式品質、整合、資安、事故應變與上線決策，一關都不能偷懶。',
    codex: ['mvp', 'rbac', 'idem', 'hitl', 'quant', 'incident'],
  },
  {
    id: 13, code: '第十三章', title: 'CIM 與智慧工廠總體整合', role: '智慧製造系統工程師 → 電腦整合製造工程師', area: 12, requiredPos: 7,
    panels: [
      { npc: 'ho', text: '單點 AI 做得再好，ERP 跟現場對不上，排程一樣亂。' },
      { npc: 'cheng', text: '現在要把設備、資料、製程、物料、人力與財務串起來。' },
      { npc: 'ho', text: '先把系統拓樸接對。記住 OT 跟 IT 要分層，任何人都不能從 ERP 直接寫 PLC。' },
    ],
    objectives: ['以節點圖建立正確的跨系統資料流', '完成 MES ↔ ERP 欄位映射', '修復庫存帳料不符', '設計 OT／IT 資安分區'],
    tutorial: ['電腦整合製造（Computer Integrated Manufacturing, CIM）：整合製造與管理資訊體系。', '製造執行系統（Manufacturing Execution System, MES）：工單、報工、批號履歷。', '企業資源規劃（Enterprise Resource Planning, ERP）：訂單、採購、庫存、財務。', '數位孿生（Digital Twin）：以資料驅動的虛擬工廠模型，用於模擬與最佳化。'],
    game: 'cim',
    dilemma: {
      prompt: '系統整合後，財務希望 ERP 可以直接下指令改機台參數「提高效率」。',
      views: [{ npc: 'li', text: '少一個環節，少一份人力。' }, { npc: 'ho', text: '這是資安與安全的紅線。' }],
      options: [
        { label: '拒絕直接寫入；參數變更走 MES 工程變更流程與雙人核准', desc: '維持分層與追溯。', effect: { trust: { it: 7, quality: 4, mgmt: 2 }, f: { dataQuality: 0.02 } }, react: '何俊宏：謝謝你守住紅線。' },
        { label: '僅允許 ERP 讀取設備狀態', desc: '單向資料流。', effect: { trust: { it: 5, mgmt: 2 } }, react: '李淑芬：好，至少我看得到產能利用率。' },
        { label: '開放 ERP 寫入 PLC', desc: '流程最短。', effect: { trust: { it: -10, quality: -4 }, addRisk: 'OT 網路遭跨層寫入風險', flag: 'otRisk' }, react: '何俊宏：我必須正式提出資安風險報告。' },
      ],
    },
    reward: { xp: { sys: 20, it: 6, ie: 6 }, funds: 150000, cert: 'CIM 系統整合', trust: { it: 8, mgmt: 5 }, promoteTo: 9 },
    journal: 'CIM 不是一個 AI 模型，而是整個製造與管理體系的整合。',
    codex: ['cim', 'mes', 'erp', 'wms', 'qms', 'scada', 'plc', 'iot', 'cmms', 'twin', 'otit'],
  },
  {
    id: 14, code: '終局', title: '智慧工廠總體最佳化：鳳凰計畫', role: '資深製程規劃暨 CIM 整合工程師', area: 12, requiredPos: 9,
    panels: [
      { npc: 'chou', text: '虛構 A 車廠下了一筆大型特殊扣件訂單。產能不足、能源漲價、原料延遲，全部同時發生。' },
      { npc: 'li', text: '改善預算上限 750 萬（含一季營運支出）。每一塊錢都要說得出效益。' },
      { npc: 'hsu', text: '人員、物料、資訊、設備、資金、能源——這次你要讓它們成為一個系統。' },
    ],
    objectives: ['OEE 提升 ≥ 10 個百分點', '單位良品成本 −8%、單位能耗 −8%', 'OTIF ≥ 95%、PPM ≤ 150', '無重大工安風險、不超出預算'],
    tutorial: ['多目標最佳化（Multi-Objective Optimization）：同時考量多個彼此衝突的目標。', '資本支出（CAPEX）以 5 年（260 週）折舊進入週成本；營運支出（OPEX）每週發生。', '同一隨機種子下的模擬可互相比較。'],
    game: 'phoenix',
    dilemma: { prompt: '', views: [], options: [] },
    reward: { xp: { sys: 10, ie: 10 }, funds: 0, trust: { mgmt: 10 } },
    journal: '系統最佳化不是買最多機器或導入最多 AI，而是在安全、品質、成本、交期、人與永續之間找到平衡。',
    codex: ['moo', 'capex'],
  },
];

// ---------------- 工業工程百科 ----------------
export interface Term { id: string; zh: string; en: string; abbr?: string; cat: string; def: string; }
export const CODEX: Term[] = [
  { id: 'ppe', zh: '個人防護具', en: 'Personal Protective Equipment', abbr: 'PPE', cat: '安全', def: '依作業風險配戴的安全鞋、護目鏡、耳罩、防切手套等。旋轉機台旁避免棉紗手套與飾品。' },
  { id: '5s', zh: '5S 現場管理', en: '5S', cat: '安全', def: '整理（Seiri）、整頓（Seiton）、清掃（Seiso）、清潔（Seiketsu）、素養（Shitsuke）。讓異常一眼可見。' },
  { id: 'sop', zh: '標準作業程序', en: 'Standard Operating Procedure', abbr: 'SOP', cat: '安全', def: '把安全、正確、有效率的作業方法文件化，讓不同人做出相同品質。' },
  { id: 'loto', zh: '上鎖掛牌', en: 'Lockout / Tagout', abbr: 'LOTO', cat: '安全', def: '維修或異常時切斷能源並上鎖、掛牌，避免他人誤啟動。' },
  { id: 'wirerod', zh: '盤元', en: 'Wire Rod', cat: '製程', def: '上游鋼廠以小鋼胚熱軋成的線材，捲成盤狀供扣件廠使用。扣件廠通常不自行煉鋼或軋鋼。' },
  { id: 'spheroidize', zh: '球化退火', en: 'Spheroidizing Annealing', cat: '製程', def: '使鋼中碳化物球狀化以提升冷鍛成形性。與伸線的先後順序依鋼種、產品與製造路徑而不同。' },
  { id: 'drawing', zh: '伸線', en: 'Wire Drawing', cat: '製程', def: '將線材拉過模具以控制線徑與表面，供冷鍛使用。' },
  { id: 'iqc', zh: '進料檢驗', en: 'Incoming Quality Control', abbr: 'IQC', cat: '品質', def: '原料或外購件進廠時的檢驗與文件核對（材證、批號、外觀、尺寸）。' },
  { id: 'trace', zh: '可追溯性', en: 'Traceability', cat: '品質', def: '成品批號可向上追溯原料爐號、製程條件與檢驗紀錄，向下追蹤出貨對象。' },
  { id: 'coldforge', zh: '冷鍛', en: 'Cold Forging', cat: '製程', def: '在常溫下以多工位模具將線材成形為螺絲頭部或螺帽，材料利用率高、強度佳。' },
  { id: 'dielife', zh: '模具壽命', en: 'Die Life', cat: '製程', def: '模具可穩定生產的數量，受速度、材料、潤滑與保養影響。磨耗會使裂紋與尺寸不良增加。' },
  { id: 'stdtime', zh: '標準工時', en: 'Standard Time', cat: 'IE', def: '正常時間 ×（1＋寬放率）。用於產能規劃與績效評估。' },
  { id: 'smed', zh: '快速換模', en: 'Single-Minute Exchange of Die', abbr: 'SMED', cat: 'IE', def: '把換模作業區分為內部與外部作業，將內部轉外部並簡化，以縮短換線時間。' },
  { id: 'rolling', zh: '搓牙', en: 'Thread Rolling', cat: '製程', def: '以兩片牙板滾壓成形螺栓外螺紋，屬塑性加工，不產生切屑，纖維連續、強度佳。' },
  { id: 'tapping', zh: '攻牙', en: 'Tapping', cat: '製程', def: '以絲攻加工螺帽內螺紋。與外螺紋搓牙必須區分。' },
  { id: 'coq', zh: '品質成本', en: 'Cost of Quality', abbr: 'COQ', cat: '品質', def: '預防成本、鑑定成本、內部失敗成本、外部失敗成本。越早預防，總成本越低。' },
  { id: 'prevailing', zh: '預置扭力', en: 'Prevailing Torque', cat: '製程', def: '防鬆螺帽在未產生夾緊力前即需克服的旋轉扭力，由特定結構或局部變形產生。' },
  { id: 'gauge', zh: '通止規', en: 'Go / No-Go Gauge', cat: '品質', def: '以「通端可通過、止端不可通過」快速判定螺紋是否合格。' },
  { id: 'heat', zh: '熱處理', en: 'Heat Treatment', cat: '製程', def: '淬火、回火等製程，以調整硬度與機械性質。採批次或連續爐運作。' },
  { id: 'special', zh: '特殊製程', en: 'Special Process', cat: '品質', def: '結果無法僅靠最終檢驗完全確認的製程（如熱處理、表面處理），須以參數監控與確效控制。' },
  { id: 'batch', zh: '批次製程', en: 'Batch Process', cat: 'IE', def: '一次處理一批產品。湊批節省能源，但等待會增加在製品與前置時間。' },
  { id: 'cof', zh: '摩擦係數', en: 'Coefficient of Friction', cat: '品質', def: '影響鎖附扭力與夾緊力的換算。表面處理與潤滑會改變摩擦係數。' },
  { id: 'optical', zh: '光學檢驗', en: 'Optical Inspection', cat: '品質', def: '以相機與影像處理自動檢測外觀、尺寸與組裝狀態，高速篩選。' },
  { id: 'detect', zh: '檢出率', en: 'Detection Rate', cat: '品質', def: '所有不良品中被成功抓出的比例。與 AI 的召回率概念相同。' },
  { id: 'falsereject', zh: '誤判率', en: 'False Reject Rate', cat: '品質', def: '良品被誤判為不良的比例。誤判太高會增加複判人力與報廢。' },
  { id: 'oee', zh: '設備綜合效率', en: 'Overall Equipment Effectiveness', abbr: 'OEE', cat: 'IE', def: 'OEE ＝ 可用率（Availability）× 效能（Performance）× 品質（Quality）。本遊戲的全線 OEE 以各站運轉時數加權，不含無訂單閒置。' },
  { id: 'tpm', zh: '全員生產保全', en: 'Total Productive Maintenance', abbr: 'TPM', cat: 'IE', def: '讓操作員參與自主保養、計畫保養與改善，提升設備可用率。' },
  { id: 'ergonomics', zh: '人因工程', en: 'Ergonomics', cat: 'IE', def: '設計適合人的工作與環境，降低疲勞、傷害與錯誤。' },
  { id: 'bottleneck', zh: '瓶頸', en: 'Bottleneck', cat: 'IE', def: '產能最受限制的工作站，決定整條產線產出。瓶頸可能因改善而移動。' },
  { id: 'mrp', zh: '物料需求規劃', en: 'Material Requirements Planning', abbr: 'MRP', cat: '生管', def: '依主生產排程與 BOM 展開需求：淨需求 ＝ 毛需求 − 庫存 − 在途 ＋ 安全庫存。' },
  { id: 'bom', zh: '物料清單', en: 'Bill of Materials', abbr: 'BOM', cat: '生管', def: '產品由哪些零件、多少數量組成的結構表。' },
  { id: 'crp', zh: '產能需求規劃', en: 'Capacity Requirements Planning', abbr: 'CRP', cat: '生管', def: '比較各工作中心負荷與可用產能，找出超載時段。' },
  { id: 'finite', zh: '有限產能排程', en: 'Finite Capacity Scheduling', cat: '生管', def: '排程時考慮機台實際可用時數與換線，排出可執行的計畫。' },
  { id: 'safetystock', zh: '安全庫存', en: 'Safety Stock', cat: '生管', def: '為吸收需求與供應變異而保留的緩衝庫存。' },
  { id: 'setup', zh: '換線時間', en: 'Setup Time', cat: '生管', def: '從上一批最後一顆良品到下一批第一顆良品的時間。' },
  { id: 'otif', zh: '準時足量交貨率', en: 'On Time In Full', abbr: 'OTIF', cat: '生管', def: '準時且數量足額交貨的比例。本遊戲以各產品準時交付數量 ÷ 需求計算。' },
  { id: 'aps', zh: '進階規劃排程系統', en: 'Advanced Planning and Scheduling', abbr: 'APS', cat: '系統', def: '考慮產能、物料、換線等限制的排程最佳化系統。' },
  { id: 'spc', zh: '統計製程管制', en: 'Statistical Process Control', abbr: 'SPC', cat: '品質', def: '以統計方法（管制圖等）監控製程，區分共同原因與特殊原因變異。' },
  { id: 'controlchart', zh: '管制圖', en: 'Control Chart', cat: '品質', def: 'X̄-R 圖：UCL/LCL ＝ X̿ ± A₂R̄（n＝5 時 A₂＝0.577）。超出界限或連續 8 點同側為異常訊號。' },
  { id: 'cpk', zh: '製程能力指標', en: 'Process Capability Index', abbr: 'Cp / Cpk', cat: '品質', def: 'Cp ＝ (USL−LSL)/6σ；Cpk ＝ min(USL−μ, μ−LSL)/3σ。車用常要求 Cpk ≥ 1.33。' },
  { id: 'pareto', zh: '柏拉圖', en: 'Pareto Chart', cat: '品質', def: '依頻率排序的長條圖加累積線，找出影響最大的少數問題（80/20）。' },
  { id: 'fishbone', zh: '魚骨圖', en: 'Ishikawa Diagram', cat: '品質', def: '從人、機、料、法、環、測等面向列出可能原因。' },
  { id: '5why', zh: '5 Why 根因分析', en: '5 Whys', cat: '品質', def: '連續追問「為什麼」以追到可控制的根本原因。' },
  { id: 'fmea', zh: '失效模式與效應分析', en: 'Failure Mode and Effects Analysis', abbr: 'FMEA', cat: '品質', def: '事先評估潛在失效的嚴重度、發生度、偵測度，排定預防措施。' },
  { id: '8d', zh: '8D 問題解決', en: '8 Disciplines', abbr: '8D', cat: '品質', def: 'D1 組隊、D2 問題描述、D3 圍堵、D4 根因、D5 對策、D6 執行驗證、D7 預防再發、D8 結案。' },
  { id: 'dmaic', zh: '六標準差 DMAIC', en: 'Define-Measure-Analyze-Improve-Control', abbr: 'DMAIC', cat: '品質', def: '定義、量測、分析、改善、管制的改善流程。' },
  { id: 'msa', zh: '量測系統分析', en: 'Measurement System Analysis', abbr: 'MSA', cat: '品質', def: '評估量測系統的重複性與再現性（GR&R），確認數據可信。' },
  { id: 'qcqa', zh: 'QC 與 QA', en: 'Quality Control vs Quality Assurance', cat: '品質', def: 'QC 重檢驗、異常判定與品質數據；QA 重品質系統、預防機制、稽核與程序管理。' },
  { id: 'tco', zh: '總持有成本', en: 'Total Cost of Ownership', abbr: 'TCO', cat: '生管', def: '採購單價以外，再加上運輸、品質、缺料風險、庫存持有等全部成本。' },
  { id: 'supplierperf', zh: '供應商績效', en: 'Supplier Performance', cat: '生管', def: '以準交率、品質 PPM、價格、回應速度等指標評核供應商。' },
  { id: 'leadtime', zh: '交期／前置時間', en: 'Lead Time', cat: '生管', def: '從下單（或投料）到收料（或交付）的總時間。' },
  { id: 'supplyrisk', zh: '供應風險', en: 'Supply Risk', cat: '生管', def: '單一來源、地緣、運輸、品質等造成斷料的可能性與衝擊。' },
  { id: 'turnover', zh: '存貨周轉率', en: 'Inventory Turnover', cat: '生管', def: '銷貨成本 ÷ 平均存貨。周轉越快，資金積壓越少。' },
  { id: 'takt', zh: '節拍時間', en: 'Takt Time', cat: 'IE', def: '可用生產時間 ÷ 客戶需求量。代表「客戶需要的生產節奏」。' },
  { id: 'cycletime', zh: '週期時間', en: 'Cycle Time', cat: 'IE', def: '某工作站實際完成一單位所需時間。若大於節拍時間即無法滿足需求。' },
  { id: 'lean', zh: '精實生產', en: 'Lean Manufacturing', cat: 'IE', def: '以顧客價值為中心，持續消除浪費。' },
  { id: 'waste', zh: '七大浪費', en: 'Seven Wastes', cat: 'IE', def: '過量生產、等待、搬運、過度加工、庫存、多餘動作、不良重工。' },
  { id: 'toc', zh: '限制理論', en: 'Theory of Constraints', abbr: 'TOC', cat: 'IE', def: '找出限制→充分利用→其他配合→提升限制→重新找限制。' },
  { id: 'littles', zh: '小法則', en: "Little's Law", cat: 'IE', def: 'WIP ＝ 產出率 × 流程時間。例：產出 600 顆/時、WIP 24,000 顆 → 流程時間 40 小時。' },
  { id: 'vsm', zh: '價值流程圖', en: 'Value Stream Map', abbr: 'VSM', cat: 'IE', def: '描繪物流與資訊流，區分加值與非加值時間。' },
  { id: 'linebal', zh: '產線平衡', en: 'Line Balancing', cat: 'IE', def: '把作業分配到各站，使週期時間接近、減少等待。' },
  { id: 'or', zh: '作業研究', en: 'Operations Research', abbr: 'OR', cat: 'IE', def: '以數學模型（線性規劃、排程、排隊）求最佳決策。' },
  { id: 'des', zh: '離散事件模擬', en: 'Discrete Event Simulation', abbr: 'DES', cat: 'IE', def: '以事件驅動模擬系統運作，評估方案而不必實際試錯。' },
  { id: 'datacleaning', zh: '資料清理', en: 'Data Cleaning', cat: 'AI', def: '處理缺失、重複、單位錯誤、命名不一致等問題，確保分析可信。' },
  { id: 'precision', zh: '精確率', en: 'Precision', cat: 'AI', def: 'TP ÷ (TP＋FP)：判為不良的產品中，真正不良的比例。' },
  { id: 'recall', zh: '召回率', en: 'Recall', cat: 'AI', def: 'TP ÷ (TP＋FN)：所有不良品中被抓出的比例。漏檢（FN）越少越高。' },
  { id: 'confusion', zh: '混淆矩陣', en: 'Confusion Matrix', cat: 'AI', def: 'TP、FP、FN、TN 四格表，呈現模型的正確與錯誤類型。' },
  { id: 'leakage', zh: '資料洩漏', en: 'Data Leakage', cat: 'AI', def: '訓練時用到測試或未來才知道的資訊，導致評估過度樂觀。' },
  { id: 'drift', zh: '資料漂移', en: 'Data Drift', cat: 'AI', def: '上線後輸入資料分布改變（新材料、新光源），模型表現下降。' },
  { id: 'rag', zh: '檢索增強生成', en: 'Retrieval-Augmented Generation', abbr: 'RAG', cat: 'AI', def: '先檢索相關文件，再由語言模型產生附來源的回答，降低幻覺。' },
  { id: 'vlm', zh: '視覺語言模型', en: 'Vision-Language Model', abbr: 'VLM', cat: 'AI', def: '可同時理解影像與文字的模型，可用於圖面辨識。' },
  { id: 'ocr', zh: '光學字元辨識', en: 'Optical Character Recognition', abbr: 'OCR', cat: 'AI', def: '把影像中的文字轉成可編輯文字。' },
  { id: 'etl', zh: '資料擷取轉換載入', en: 'Extract, Transform, Load', abbr: 'ETL', cat: 'AI', def: '從來源系統擷取、轉換格式並載入目標資料庫。' },
  { id: 'sql', zh: '結構化查詢語言', en: 'Structured Query Language', abbr: 'SQL', cat: 'AI', def: '查詢與管理關聯式資料庫的語言。' },
  { id: 'pdm', zh: '預測性維護', en: 'Predictive Maintenance', abbr: 'PdM', cat: 'AI', def: '以震動、溫度、電流等資料估計故障風險，在故障前安排保養。' },
  { id: 'cv', zh: '電腦視覺', en: 'Computer Vision', cat: 'AI', def: '讓電腦從影像中辨識物件與瑕疵。' },
  { id: 'mvp', zh: '最小可行產品', en: 'Minimum Viable Product', abbr: 'MVP', cat: 'AI', def: '能驗證核心價值的最小可交付範圍；先上線、再依回饋擴充。' },
  { id: 'rbac', zh: '角色型存取控制', en: 'Role-Based Access Control', abbr: 'RBAC', cat: '系統', def: '依角色授予權限，例如業務看不到成本明細、AI 只能唯讀。' },
  { id: 'idem', zh: '冪等性', en: 'Idempotency', cat: '系統', def: '同一請求重送多次，結果只發生一次。整合 ERP 時可避免重複下單或重複扣帳。' },
  { id: 'hitl', zh: '人工介入', en: 'Human-in-the-Loop', abbr: 'HITL', cat: 'AI', def: 'AI 或 Agent 的關鍵決策保留人工確認，並留下稽核紀錄。' },
  { id: 'quant', zh: '模型量化', en: 'Quantization', cat: 'AI', def: '以 INT8、INT4 等較低精度儲存模型權重，降低 GPU 記憶體與延遲，可能犧牲部分品質。' },
  { id: 'incident', zh: '事故應變', en: 'Incident Response', cat: '系統', def: '圍堵 → 通報 → 界定範圍 → 修復 → 預防再發 → 監控；不隱匿、不刪除證據。' },
  { id: 'cim', zh: '電腦整合製造', en: 'Computer Integrated Manufacturing', abbr: 'CIM', cat: '系統', def: '以資訊系統整合設計、製造、管理與決策的製造體系。' },
  { id: 'mes', zh: '製造執行系統', en: 'Manufacturing Execution System', abbr: 'MES', cat: '系統', def: '管理工單、派工、報工、批號履歷與現場資料。' },
  { id: 'erp', zh: '企業資源規劃', en: 'Enterprise Resource Planning', abbr: 'ERP', cat: '系統', def: '整合訂單、採購、庫存、生產、財務的企業系統。' },
  { id: 'wms', zh: '倉儲管理系統', en: 'Warehouse Management System', abbr: 'WMS', cat: '系統', def: '管理儲位、收發料與庫存數量。' },
  { id: 'qms', zh: '品質管理系統', en: 'Quality Management System', abbr: 'QMS', cat: '系統', def: '管理檢驗、異常、矯正預防與稽核紀錄。' },
  { id: 'scada', zh: '監控與資料擷取系統', en: 'Supervisory Control and Data Acquisition', abbr: 'SCADA', cat: '系統', def: '監控設備狀態與擷取製程數據。' },
  { id: 'plc', zh: '可程式邏輯控制器', en: 'Programmable Logic Controller', abbr: 'PLC', cat: '系統', def: '直接控制機台動作的工業控制器，屬 OT 層。' },
  { id: 'iot', zh: '物聯網', en: 'Internet of Things', abbr: 'IoT', cat: '系統', def: '以感測器與網路連接設備，蒐集即時資料。' },
  { id: 'cmms', zh: '設備維護管理系統', en: 'Computerized Maintenance Management System', abbr: 'CMMS', cat: '系統', def: '管理保養計畫、工單、備品與故障紀錄。' },
  { id: 'twin', zh: '數位孿生', en: 'Digital Twin', cat: '系統', def: '以即時資料驅動的虛擬工廠模型，用於模擬、預測與最佳化。' },
  { id: 'otit', zh: 'OT／IT 資安分區', en: 'OT / IT Segmentation', cat: '系統', def: '營運技術（OT）與資訊技術（IT）網路分層，經 DMZ 交換資料，避免跨層直接寫入。' },
  { id: 'moo', zh: '多目標最佳化', en: 'Multi-Objective Optimization', cat: 'IE', def: '同時考量成本、品質、交期、安全、能源等衝突目標，尋找平衡解。' },
  { id: 'capex', zh: '資本支出與營運支出', en: 'CAPEX / OPEX', cat: 'IE', def: 'CAPEX 為設備等長期投資，以折舊分攤；OPEX 為每期發生的營運費用。' },
];

// ---------------- 專利知識卡 ----------------
export interface Patent { id: string; no: string; title: string; kind: string; confirmed: string[]; inference: string[]; process: string; problem: string; ai: string; url: string; }
export const PATENTS: Patent[] = [
  {
    id: 'tw683065', no: 'TWI683065B', title: '組合式套管螺絲', kind: '發明專利', url: 'https://patents.google.com/patent/TWI683065B/zh',
    confirmed: ['專利號與名稱：TWI683065B「組合式套管螺絲」（公開專利資料庫）。', '屬於產品結構類專利，保護特定的套管與螺絲組合結構。'],
    inference: ['教學推論：套管螺絲常用於需「預先組裝、不易脫落」的場合，例如模組件的預組。', '教學推論：結構設計關注套管限位、組裝後不脫落與鎖附時的同軸性。'],
    process: '冷鍛 → 搓牙 → 熱處理／表面處理 → 套管組裝 → 光學檢查（教學簡化）', problem: '套管脫落、限位不足、組裝效率', ai: '以影像辨識檢查套管是否到位、是否脫落。',
  },
  {
    id: 'tw710715', no: 'TWI710715B', title: '組合式套管螺絲製造方法', kind: '發明專利', url: 'https://patents.google.com/patent/TWI710715B/zh',
    confirmed: ['專利號與名稱：TWI710715B「組合式套管螺絲製造方法」（公開專利資料庫）。', '屬於製造方法類專利，與 TWI683065B 的產品主題相關。'],
    inference: ['教學推論：方法專利保護的是特定步驟組合，不代表整道一般扣件製程都屬於專利範圍。', '教學推論：組裝順序與成形步驟的安排會影響良率與節拍。'],
    process: '螺絲本體成形與套管組裝順序（教學簡化）', problem: '組裝步驟順序、成形後尺寸穩定性', ai: '以製程數據預測組裝不良的風險。',
  },
  {
    id: 'tw753649', no: 'TWI753649B', title: '預置扭力螺帽製成方法', kind: '發明專利', url: 'https://patents.google.com/patent/TWI753649B/zh',
    confirmed: ['專利號與名稱：TWI753649B「預置扭力螺帽製成方法」（公開專利資料庫）。', '本作依專題簡報所述，其重點在「熱處理後的硬度」與「特定軸向沖壓條件」的配合；詳細請求項請以專利原文為準。'],
    inference: ['教學推論：硬度太高，沖壓變形不足或易裂；硬度太低，預置扭力可能不穩定。', '教學推論：此專利不應被簡化為「一般熱處理專利」。遊戲中的硬度、沖壓參數皆為虛構示意。'],
    process: '冷鍛 → 攻牙 → 熱處理 → 軸向沖壓 → 表面處理 → 檢驗（教學簡化）', problem: '預置扭力的穩定性與重複性', ai: 'TorqueMind AI：以硬度、沖壓深度、壓力預測扭力區間（教學模擬）。',
  },
  {
    id: 'tw761005', no: 'TWI761005B', title: '快速定位扣件', kind: '發明專利', url: 'https://patents.google.com/patent/TWI761005B/zh',
    confirmed: ['專利號與名稱：TWI761005B「快速定位扣件」（公開專利資料庫）。'],
    inference: ['教學推論：快速定位與公差補償類扣件的目的，是在組裝時吸收零件間的公差、縮短對位時間。', '教學推論：此類產品的檢驗重點常在定位尺寸與組裝功能。'],
    process: '成形 → 二次加工 → 組裝 → 功能檢查（教學簡化）', problem: '組裝公差累積、對位效率', ai: '以尺寸量測資料做公差堆疊分析。',
  },
  {
    id: 'twm608701', no: 'TWM608701U', title: '密合鎖固螺帽自動化裝置', kind: '新型專利', url: 'https://patents.google.com/patent/TWM608701U/zh',
    confirmed: ['專利號與名稱：TWM608701U「密合鎖固螺帽自動化裝置」（公開專利資料庫）。', '屬於新型專利，保護裝置的形狀或構造。'],
    inference: ['教學推論：自動化鎖付／組裝設備可降低人工作業變異並提升節拍。', '教學推論：自動化裝置仍需搭配防錯（Poka-Yoke）與在線檢測。'],
    process: '自動組裝／鎖付（教學簡化）', problem: '人工組裝變異、節拍與一致性', ai: '以設備感測資料監控鎖付異常。',
  },
];

// ---------------- 事件系統 ----------------
export interface EventOpt { label: string; desc: string; effect: Effect; }
export interface GameEvent { id: string; title: string; npc: string; desc: string; minCh: number; weightFlag?: string; options: EventOpt[]; }
export const EVENTS: GameEvent[] = [
  { id: 'dieBreak', title: '冷鍛模具突然損壞', npc: 'chen', minCh: 2, weightFlag: 'skipMaint', desc: '第三工位模具崩角，頭部出現裂紋。產線已自動停機。',
    options: [
      { label: '換上備用模具並全檢當班產品', desc: '停機 2 小時、全檢人力', effect: { funds: -25000, st: { forge: { Q: 0.003 } }, trust: { quality: 4 }, unflag: 'skipMaint' } },
      { label: '緊急修模後復機，抽檢 5 箱', desc: '較快，但有殘留風險', effect: { funds: -10000, f: { latent: 0.0008 }, trust: { plan: 2 } } },
      { label: '建立模具壽命計數與預防更換制度', desc: '短期花費高，長期穩定', effect: { funds: -40000, st: { forge: { A: 0.02, Q: 0.003 } }, trust: { floor: 4, mgmt: 2 }, unflag: 'skipMaint' } },
    ] },
  { id: 'threadNG', title: '搓牙不良率持續增加', npc: 'huang', minCh: 3, weightFlag: 'threadWear', desc: '連續三天搓牙缺牙比例上升，SPC 出現連續 8 點上升趨勢。',
    options: [
      { label: '停線檢查牙板與送料，建立牙板壽命管理', desc: '停機半班', effect: { funds: -20000, st: { thread: { Q: 0.006, A: -0.005 } }, trust: { quality: 4 }, unflag: 'threadWear' } },
      { label: '加嚴抽檢、繼續生產', desc: '鑑定成本上升', effect: { funds: -8000, trust: { plan: 2 } } },
      { label: '調降搓牙速度 10%', desc: '品質回穩、產能下降', effect: { st: { thread: { P: -0.03, Q: 0.004 } }, trust: { quality: 2, plan: -2 } } },
    ] },
  { id: 'furnace', title: '熱處理爐溫度異常', npc: 'huang', minCh: 4, desc: '第二爐區熱電偶讀值跳動，懷疑感測器老化。',
    options: [
      { label: '停爐校正並隔離受影響批次', desc: '安全且可追溯', effect: { funds: -30000, trust: { quality: 5 }, st: { heat: { A: -0.01 } } } },
      { label: '加裝備援熱電偶，持續監控', desc: '中等成本', effect: { funds: -18000, st: { heat: { Q: 0.002 } }, trust: { quality: 3, it: 2 } } },
      { label: '繼續生產，等定期保養再處理', desc: '暫時無成本', effect: { f: { latent: 0.0012 }, trust: { quality: -5 }, brand: -1 } },
    ] },
  { id: 'friction', title: '表面處理摩擦係數偏離規格', npc: 'keller', minCh: 4, desc: '客戶抽測發現某批次摩擦係數偏高，鎖附扭力與夾緊力關係不穩。',
    options: [
      { label: '追溯藥液濃度紀錄，調整並重新驗證', desc: '找出製程原因', effect: { funds: -20000, st: { surface: { Q: 0.004 } }, trust: { quality: 4 }, brand: 1 } },
      { label: '該批全數重新處理', desc: '保守', effect: { funds: -35000, trust: { quality: 2 }, brand: 1 } },
      { label: '請客戶調整鎖附參數', desc: '把問題推給客戶', effect: { brand: -5, trust: { quality: -4, mgmt: -2 } } },
    ] },
  { id: 'sleeveOff', title: '組裝站發現套管螺絲脫落', npc: 'lin', minCh: 5, desc: '包裝前抽查發現少量套管脫落，疑似壓入深度不足。',
    options: [
      { label: '加裝壓入行程感測與防錯（Poka-Yoke）', desc: '從源頭防止', effect: { funds: -30000, st: { assembly: { Q: 0.006 } }, trust: { quality: 4, floor: 2 } } },
      { label: '光學檢查加入套管限位判定', desc: '靠檢驗攔截', effect: { funds: -15000, f: { detect: 0.005 }, trust: { quality: 2 } } },
      { label: '要求作業員更小心', desc: '零成本', effect: { trust: { floor: -3 } } },
    ] },
  { id: 'opticalMiss', title: '光學檢驗設備漏判瑕疵', npc: 'huang', minCh: 5, weightFlag: 'looseOptical', desc: '客戶端發現 3 顆毛邊品，追查為光學機鏡頭髒污加上門檻偏鬆。',
    options: [
      { label: '回收可疑批次、清潔與校正、重新驗證門檻', desc: '對客戶負責', effect: { funds: -40000, f: { detect: 0.02 }, trust: { quality: 5 }, brand: 1, unflag: 'looseOptical' } },
      { label: '鏡頭清潔納入每班點檢', desc: '預防再發', effect: { funds: -5000, f: { detect: 0.01 }, trust: { quality: 3 } } },
      { label: '寄送替換品了事', desc: '最便宜', effect: { funds: -8000, brand: -3, trust: { quality: -3 } } },
    ] },
  { id: 'rushOrder', title: '客戶臨時增加訂單', npc: 'tsai', minCh: 2, desc: '虛構 A 車廠要求本週追加 3,000 顆六角螺栓。',
    options: [
      { label: '週六加班 8 小時', desc: '人力成本上升、疲勞增加', effect: { f: { overtimeH: 4 }, funds: -15000, trust: { plan: 3 }, brand: 2, flag: 'fatigue' } },
      { label: '協商分兩週交貨', desc: '以產能數據溝通', effect: { trust: { plan: 2, mgmt: 1 } } },
      { label: '婉拒追加', desc: '維持原計畫', effect: { brand: -2, trust: { mgmt: -2 } } },
    ] },
  { id: 'wireDelay', title: '供應商盤元延遲到貨', npc: 'wu', minCh: 1, weightFlag: 'singleSource', desc: '主要供應商通知盤元延遲 5 天到貨。',
    options: [
      { label: '動用安全庫存並向第二供應商調貨', desc: '加價 3%', effect: { funds: -20000, trust: { plan: 3, purchase: 2 } } },
      { label: '空運部分急料', desc: '運費高', effect: { funds: -45000, trust: { plan: 4 } } },
      { label: '調整排程先做有料的產品', desc: '部分訂單延後', effect: { f: { supplierDelay: 0.03 }, trust: { plan: 1 }, brand: -1 } },
    ] },
  { id: 'erpMismatch', title: 'ERP 庫存與現場實際數量不符', npc: 'wu', minCh: 7, desc: 'ERP 顯示套管庫存 12,000 個，現場盤點只有 9,800 個。',
    options: [
      { label: '循環盤點＋追查異動紀錄，修正報工流程', desc: '找出系統性原因', effect: { funds: -10000, f: { dataQuality: 0.04 }, trust: { plan: 4, it: 2 } } },
      { label: '直接調整 ERP 數字', desc: '快速但原因不明', effect: { trust: { plan: 1 } } },
      { label: '多備 30% 安全庫存', desc: '用庫存掩蓋問題', effect: { f: { safetyStockDays: 2 }, funds: -15000 } },
    ] },
  { id: 'sensorLost', title: '設備感測器失去連線', npc: 'ho', minCh: 10, desc: '冷鍛機震動感測器資料中斷 6 小時，PdM 模型無輸入。',
    options: [
      { label: '啟用斷線告警與緩存補傳機制', desc: '提升韌性', effect: { funds: -15000, f: { dataQuality: 0.02 }, trust: { it: 4 } } },
      { label: '派人手動巡檢紀錄', desc: '臨時替代', effect: { funds: -5000, trust: { floor: 1 } } },
      { label: '先不管', desc: '模型以舊資料運作', effect: { st: { forge: { A: -0.01 } }, trust: { it: -2 } } },
    ] },
  { id: 'drift', title: 'AI 預測結果發生資料漂移', npc: 'cheng', minCh: 11, weightFlag: 'aiRush', desc: '更換光源後，視覺模型誤判率上升 3 倍。',
    options: [
      { label: '收集新光源影像、重新標註與驗證後再上線', desc: 'MLOps 正規流程', effect: { funds: -30000, f: { falseReject: -0.004, detect: 0.01 }, trust: { it: 5, quality: 3 }, unflag: 'aiRush' } },
      { label: '暫時切回人工＋規則式判定', desc: '降級運作', effect: { funds: -10000, trust: { quality: 3 } } },
      { label: '調高門檻壓低誤判', desc: '漏檢上升', effect: { f: { detect: -0.03, falseReject: -0.005 }, trust: { quality: -5 } } },
    ] },
  { id: 'fatigueEv', title: '員工因過度加班而疲勞', npc: 'lin', minCh: 6, weightFlag: 'fatigue', desc: '夜班兩位同仁反映頭暈，差點把手伸進送料區。',
    options: [
      { label: '取消本週加班、安排輪休與人因評估', desc: '員工優先', effect: { f: { overtimeH: -6, training: 2 }, trust: { floor: 6 }, unflag: 'fatigue' } },
      { label: '輪調至低風險站並縮短工時', desc: '折衷', effect: { f: { overtimeH: -3 }, trust: { floor: 3 } } },
      { label: '維持加班、發放加班津貼', desc: '產量優先', effect: { funds: -10000, trust: { floor: -6 }, addRisk: '疲勞作業造成捲入風險' } },
    ] },
  { id: 'traceBreak', title: '系統整合造成批號追溯資料中斷', npc: 'ho', minCh: 12, desc: 'MES 升級後，3 天的熱處理批號沒有寫入生產履歷。',
    options: [
      { label: '以紙本爐卡補登並建立整合測試案例', desc: '修復＋預防', effect: { funds: -20000, f: { dataQuality: 0.03 }, trust: { quality: 4, it: 3 } } },
      { label: '回滾到舊版 MES', desc: '保守', effect: { funds: -10000, trust: { it: 1 } } },
      { label: '這 3 天標記為「資料缺漏」繼續出貨', desc: '追溯斷鏈', effect: { brand: -4, trust: { quality: -6 } } },
    ] },
  { id: 'shipping', title: '海外供應鏈運輸受阻', npc: 'chang', minCh: 9, weightFlag: 'singleSource', desc: '國際航線延誤，海外盤元預估晚到 3 週。',
    options: [
      { label: '轉國內供應商補量，接受較高單價', desc: '韌性優先', effect: { funds: -30000, f: { priceFactor: 0.01 }, trust: { purchase: 4 } } },
      { label: '部分改空運', desc: '高運費', effect: { funds: -60000, trust: { plan: 3 } } },
      { label: '等船', desc: '缺料風險', effect: { f: { supplierDelay: 0.08 }, brand: -2 } },
    ] },
];

export const ACHIEVEMENTS: Record<string, { name: string; desc: string }> = {
  safety: { name: '零重大工安違規', desc: '完成序章且從未選擇違反安全規範的選項。' },
  firstDie: { name: '第一次成功換模', desc: '冷鍛章節得分 ≥ 70。' },
  bottleneck: { name: '找出真正瓶頸', desc: '在資料分析中正確辨識瓶頸站。' },
  yield: { name: '改善良率', desc: '工廠全線良率較初始提升。' },
  firstAI: { name: '完成第一個 AI 專案', desc: '完成任一 AI 專案。' },
  allAI: { name: 'AI 全專案', desc: '完成全部 4 個 AI 專案。' },
  sync: { name: '讓 MES 與 ERP 正確同步', desc: 'CIM 章節完成欄位映射。' },
  optimize: { name: '完成全廠最佳化', desc: '鳳凰計畫達成全部目標。' },
  survivor: { name: 'AI 工程師生存者', desc: '通過《AI 工程師生存戰》階段考核。' },
  navigator: { name: '智慧製造領航者', desc: '在生存戰中達成結局 A。' },
  scholar: { name: '百科學者', desc: '解鎖 60 個以上百科條目。' },
  spc: { name: '異常獵人', desc: 'SPC 章節正確找出所有異常點。' },
  tco: { name: '總成本思維', desc: '供應鏈章節 TCO 接近最佳。' },
  leader: { name: '以人為本', desc: '帶班時沒有讓高疲勞者上高風險站。' },
};

export const ENDINGS: Record<string, { title: string; text: string; color: string }> = {
  balance: { title: '智慧製造平衡結局', color: '#7cf29c', text: '安全、品質、交期、成本與永續達成較佳平衡。你讓人員、物料、資訊、設備、資金與能源成為一個可靠的系統。' },
  highCapacity: { title: '高產能但成本控制不佳', color: '#ffd23f', text: '訂單準時交付了，但成本結構失衡。下一次，試著把錢花在瓶頸與源頭，而非全面擴充。' },
  costImbalance: { title: '成本降低但人員與品質失衡', color: '#ff9a3c', text: '帳面成本漂亮，但員工安全或客戶品質付出了代價。系統最佳化不能犧牲人與信任。' },
  aiNoBottleneck: { title: 'AI 專案多卻沒有真正改善瓶頸', color: '#ff5d73', text: 'AI 很亮眼，但瓶頸仍卡在原地。改善非瓶頸，不會改善整條產線。' },
  energyGap: { title: '客戶滿意，但能源效率仍需改善', color: '#39d5ff', text: '客戶滿意度很高，但能耗與排放還有空間。永續也是競爭力。' },
};

export const FINAL_ID = CHAPTERS.length - 1;
