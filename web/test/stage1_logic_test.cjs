/** Stage 1 localStorage + Android __handleBack contract smoke test (Node, no browser needed).
 *  Requires TypeScript, from npm install or NODE_PATH=$(npm root -g).
 *  Does NOT verify Android hardware or Android WebView runtime.
 */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const core = fs.readFileSync(path.join(__dirname, '../src/app/core.ts'), 'utf8');
const transpiled = ts.transpileModule(core, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;
let tests = 0;
function assert(what, condition) {
  if (!condition) throw new Error('FAIL ' + what);
  tests++;
  process.stdout.write('PASS ' + what + '\n');
}
const saved = new Map();
const localStorage = {
  getItem: (key) => saved.has(key) ? saved.get(key) : null,
  setItem: (key, value) => { saved.set(key, String(value)); },
  removeItem: (key) => saved.delete(key),
};
const handlers = [];
const react = {
  useRef: (fn) => ({ current: fn }),
  useEffect: (fn) => { handlers.push(fn()); },
};
function loadModule() {
  const window = { addEventListener: () => {} };
  const exports = {};
  const mod = { exports };
  new Function('require', 'module', 'exports', 'window', 'localStorage', transpiled)(
    (n) => n === 'react' ? react : (() => { throw Error('Unexpected import ' + n); })(),
    mod, exports, window, localStorage,
  );
  return { api: mod.exports, window };
}
let { api, window } = loadModule();
const initial = api.loadApp();
assert('Fresh install uses default data', initial.v === 1 && initial.onboarded === false);
assert('Home system back requests Activity finish', window.__handleBack() === false);
initial.onboarded = true;
initial.settings.lowGfx = true;
initial.units.U01 = { done: true, quiz: 3, at: 123456 };
initial.tasks.T1 = { best: 100, tries: 1, pass: true, records: [] };
assert('App data saved', api.saveApp(initial) === true);
({ api, window } = loadModule());
const loaded = api.loadApp();
assert('Settings persist after app module restart', loaded.settings.lowGfx === true);
assert('Tutorial progress persists after app module restart', loaded.units.U01.done === true);
assert('Task completion persists after app module restart', loaded.tasks.T1.pass === true);
api.useBack(() => true, true);
assert('System back returns true when inner route handles it', window.__handleBack() === true);
handlers.pop()?.();
assert('System back returns false once inner route unmounts', window.__handleBack() === false);
saved.set('sumeeko-app-v1', '{BROKEN JSON');
assert('Corrupted storage gracefully falls back to defaults', api.loadApp().onboarded === false);
saved.delete('sumeeko-app-v1');
assert('Save does not require network', api.saveApp(api.defaultState()) === true);
process.stdout.write(`${tests}/${tests} tests passed\n`);
