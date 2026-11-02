"""Browser smoke test for actual freshly compiled Stage 2 PWA JS; opaque about:blank origin uses ephemeral storage shim."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys,os
ROOT=Path(__file__).parent/'site'
html=(ROOT/'index.html').read_text()
for file in ['sumeeko-style.css','pwa-ui.css']:
 html=html.replace('<link rel="stylesheet" href="./'+file+'">','<style>'+ (ROOT/file).read_text() + '</style>')
for file in ['vendor-react.js','sumeeko-app.js','pwa-ui.js']:
 html=html.replace('<script defer src="./'+file+'"></script>','')
html=html.replace('</head>','''<style>*{animation:none!important;transition:none!important}</style>
<script>window.__store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__store[k]??null},setItem(k,v){window.__store[k]=String(v)},removeItem(k){delete window.__store[k]},clear(){window.__store={}}}});</script>
</head>''')
html=html.replace('</body>', ''.join('<script>'+ (ROOT/file).read_text().replace('</script','<\\/script') + '</script>' for file in ['vendor-react.js','sumeeko-app.js','pwa-ui.js'])+'</body>')
results=[]
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader'])
 ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
 page=ctx.new_page();page.set_default_timeout(7000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html,timeout=30000)
 page.get_by_text('略過', exact=True).wait_for(timeout=12000);page.get_by_text('略過',exact=True).click()
 page.locator('.sx-nav button').filter(has_text='工作場景').click()
 page.locator('.sx-scene-viewport').wait_for(timeout=10000)
 def check(name,value):
  results.append((name,bool(value)));print('PASS' if value else 'FAIL',name,flush=True)
  if not value:raise AssertionError(name)
 check('stage2 camera preserve aspect',page.locator('svg.sx-iso').get_attribute('preserveAspectRatio')=='xMidYMid meet')
 check('nine workstations',page.locator('.sx-cell').count()==9)
 if not page.locator('.sx-scene-index').count(): page.get_by_role('button',name='九宮格索引').click()
 check('nine-index-buttons',page.locator('.sx-index-grid button').count()==9)
 page.locator('.sx-index-grid button').first.click()
 check('open station bottom sheet',page.locator('.sx-sheet').count()==1)
 check('return closes sheet',page.evaluate('window.__handleBack()') is True)
 page.wait_for_timeout(150)
 check('sheet closed',page.locator('.sx-sheet').count()==0)
 page.locator('.sx-nav button').filter(has_text='任務').click()
 for tid in (os.environ['PWA_TASK'].split(',') if os.getenv('PWA_TASK') else ['T1','T2','T3','T4','T5']):
  page.locator('.sx-item').filter(has=page.locator('.sx-ic',has_text=tid)).first.click()
  check(tid+' six steps',page.locator('.sx-steps li').count()==6)
  page.locator('.sx-opts.col .sx-opt').first.click()
  page.locator('button').filter(has_text='下一步').last.click()
  for chk in page.locator('.sx-chk').all():
   chk.locator('button').filter(has_text='點檢').click()
   fix=chk.locator('button.pri')
   if fix.count():fix.first.click()
  page.locator('button').filter(has_text='下一步').last.click()
  check(tid+' safe default parameters',page.locator('.sx-warn:has-text("超出安全")').count()==0)
  page.locator('button').filter(has_text='下一步').last.click()
  page.locator('button').filter(has_text='啟動前檢查').first.click()
  for cb in page.locator('.sx-box .sx-check input').all():cb.check()
  page.locator('button').filter(has_text='▶ 啟動').first.click()
  page.locator('button').filter(has_text='下一步：檢查成品').wait_for(state='visible',timeout=20000)
  page.wait_for_function("!Array.from(document.querySelectorAll('button')).filter(x=>x.textContent.includes('下一步：檢查成品'))[0]?.disabled",timeout=25000)
  page.locator('button').filter(has_text='下一步：檢查成品').first.click()
  page.locator('.sx-opt').filter(has_text='✔ 合格').first.click()
  page.locator('button').filter(has_text='完成紀錄').first.click()
  page.get_by_text('任務成功').wait_for(timeout=4000)
  page.wait_for_timeout(380)
  check(tid+' persisted success',page.evaluate(f"JSON.parse(localStorage.getItem('sumeeko-app-v1'))?.tasks?.{tid}?.pass===true"))
  check(tid+' back navigation',page.evaluate('window.__handleBack()') is True)
  page.locator('.sx-nav button').filter(has_text='任務').click()
 check('no JS errors',len(errors)==0)
 print(json.dumps({'checks':len(results),'passed':sum(v for _,v in results),'errors':errors},ensure_ascii=False),flush=True)
 b.close()
