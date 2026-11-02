"""Stage 2 task-run smoke tests (real Chromium JS UI, not Android WebView).
Run against web/dist-app/index.html after `bun build_app.ts ./dist-app`.
For sandbox only, --bundled reads the pre-existing packaged HTML; this is not a
verification of the modified Scene until a fresh Bun build is run.
"""
import argparse
import json
import pathlib
import sys
import time
from playwright.sync_api import sync_playwright

parser = argparse.ArgumentParser()
parser.add_argument('--bundled', action='store_true')
parser.add_argument('--shots', default='')
parser.add_argument('--task', default='', choices=['', 'T1', 'T2', 'T3', 'T4', 'T5'])
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parents[2]
html_path = root / ('android/app/src/main/assets/www/index.html' if args.bundled else 'web/dist-app/index.html')
html = html_path.read_text()
# Chromium enterprise policy blocks file:// and http:// navigation in some runtimes.
# Inject an ephemeral Storage shim for about:blank to test actual React interactions.
shim = '''<script>window.__store = {};
Object.defineProperty(window,'localStorage',{configurable:true,value:{
 getItem(k){return Object.prototype.hasOwnProperty.call(window.__store,k)?window.__store[k]:null;},
 setItem(k,v){window.__store[k]=String(v)},removeItem(k){delete window.__store[k]},
 clear(){window.__store={}},key(n){return Object.keys(window.__store)[n]||null},get length(){return Object.keys(window.__store).length}
}});</script>'''
html = html.replace('<script>', shim + '<script>', 1)
html = html.replace('</head>', '<style>*{animation:none!important;transition:none!important}</style></head>', 1)
errors=[]; results={}

def assert_ok(n, cond):
    results[n] = bool(cond)
    print(('PASS ' if cond else 'FAIL ') + n, flush=True)
    if not cond: raise AssertionError(n)

with sync_playwright() as pw:
    launch_args = dict(headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader'])
    if pathlib.Path('/usr/bin/chromium').exists(): launch_args['executable_path']='/usr/bin/chromium'
    browser = pw.chromium.launch(**launch_args)
    context = browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
    page = context.new_page()
    page.set_default_timeout(6000)
    page.on('pageerror', lambda err: errors.append(str(err)))
    page.set_content(html, timeout=20000)
    page.get_by_text('略過', exact=True).wait_for(timeout=10000)
    page.get_by_text('略過', exact=True).click()
    page.locator('.sx-nav button').filter(has_text='任務').click()
    assert_ok('T1-T5 all present in task list', len(page.locator('.sx-ic').filter(has_text='T').all()) >= 5)
    for tid in ([args.task] if args.task else ['T1','T2','T3','T4','T5']):
        page.locator('.sx-item').filter(has=page.locator('.sx-ic',has_text=tid)).first.click()
        assert_ok(tid+' six-step task header', page.locator('.sx-steps li').count()==6)
        page.locator('.sx-opts.col .sx-opt').first.click()  # first item is the correct part
        page.locator('button').filter(has_text='下一步').last.click()
        # Always inspect every check and resolve abnormal items.
        for chk in page.locator('.sx-chk').all():
            chk.locator('button').filter(has_text='點檢').click()
            fix = chk.locator('button.pri')
            if fix.count(): fix.first.click()
        page.locator('button').filter(has_text='下一步').last.click()
        assert_ok(tid+' safe default sliders', page.locator('.sx-warn:has-text("超出安全")').count()==0)
        page.locator('button').filter(has_text='下一步').last.click()
        page.locator('button').filter(has_text='啟動前檢查').first.click()
        for cb in page.locator('.sx-box .sx-check input').all(): cb.check()
        page.locator('button').filter(has_text='▶ 啟動').first.click()
        print(tid, 'started machine, waiting for completion', flush=True)
        page.locator('button').filter(has_text='下一步：檢查成品').wait_for(state='visible',timeout=22000)
        page.wait_for_function("!Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.includes('下一步：檢查成品'))[0]?.disabled",timeout=20000)
        page.locator('button').filter(has_text='下一步：檢查成品').first.click()
        # UI itself gives measured value, but task verdict is determined by spec.
        mtext=page.locator('.sx-meas b').inner_text().strip()
        measure=float(''.join(c for c in mtext if c.isdigit() or c in '.-'))
        spec=page.locator('.sx-meas').locator('xpath=..').inner_text()
        # At default params all five expected to pass.
        page.locator('.sx-opt').filter(has_text='✔ 合格').first.click()
        page.locator('button').filter(has_text='完成紀錄').first.click()
        page.get_by_text('任務成功').wait_for(timeout=5000)
        assert_ok(tid+' result PASS and score recorded',page.get_by_text('任務成功').count()>0)
        page.wait_for_timeout(500)  # state write is debounced by 250 ms
        records=page.evaluate("JSON.parse(localStorage.getItem('sumeeko-app-v1'))?.tasks || {}")
        assert_ok(tid+' persisted record',bool(records.get(tid,{}).get('pass')))
        if args.shots:
            pathlib.Path(args.shots).mkdir(parents=True,exist_ok=True)
            page.screenshot(path=str(pathlib.Path(args.shots)/(tid.lower()+'_complete.png')),full_page=True)
        assert_ok(tid+' native bridge back handler',page.evaluate('window.__handleBack()') is True)
        page.locator('.sx-nav button').filter(has_text='任務').click()
    assert_ok('no JavaScript pageerror',len(errors)==0)
    browser.close()
print(json.dumps({'results': results,'errors':errors,'html':str(html_path),'fresh_build':not args.bundled},ensure_ascii=False,indent=2))
if not all(results.values()): sys.exit(1)
