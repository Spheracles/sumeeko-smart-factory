"""Runs only on freshly bundled Stage 2 React. Screenshots + scene/back behavior."""
import pathlib
import sys
from playwright.sync_api import sync_playwright
root=pathlib.Path(__file__).resolve().parents[2]
html=(root/'web/dist-app/index.html').read_text()
shim='''<script>window.__store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return window.__store[k]||null},setItem(k,v){window.__store[k]=String(v)},removeItem(k){delete window.__store[k]}}});</script>'''
html=html.replace('<script>',shim+'<script>',1)
html=html.replace('</head>','<style>*{animation:none!important}</style></head>',1)
out=root/'docs/stage2-screenshots';out.mkdir(exist_ok=True)
res=[]
with sync_playwright() as pw:
    kw={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage']}
    if pathlib.Path('/usr/bin/chromium').exists(): kw['executable_path']='/usr/bin/chromium'
    browser=pw.chromium.launch(**kw)
    for w,h in [(320,568),(390,844),(412,915),(915,412),(1024,768)]:
        ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=w<=412,has_touch=True)
        page=ctx.new_page(); page.set_content(html)
        page.get_by_text('略過',exact=True).wait_for(timeout=10000)
        page.get_by_text('略過',exact=True).click()
        page.locator('.sx-nav button').filter(has_text='工作場景').click()
        page.locator('.sx-scene-viewport').wait_for()
        page.wait_for_timeout(180)
        svg=page.locator('svg.sx-iso')
        flags={
          'nine-workstations':page.locator('.sx-cell').count()==9,
          'markers-short':all(len(x.strip())<=3 for x in page.locator('.sx-grid-marker text').all_inner_texts()),
          'responsive-viewbox':svg.get_attribute('preserveAspectRatio')=='xMidYMid meet',
          'no-global-horizontal-scroll':page.evaluate('document.documentElement.scrollWidth <= window.innerWidth + 2'),
          'index-toggle':page.locator('button').filter(has_text='九宮格索引').count()==1 or page.locator('button').filter(has_text='收起工作站').count()==1,
        }
        if not page.locator('.sx-scene-index').count():page.locator('button').filter(has_text='九宮格索引').click()
        flags['index-9-buttons']=page.locator('.sx-index-grid button').count()==9
        page.locator('.sx-index-grid button').first.click()
        flags['cell-sheet-opens']=page.locator('.sx-sheet').count()==1
        flags['back-closes-sheet']=page.evaluate('window.__handleBack()') is True
        page.wait_for_timeout(150)
        flags['sheet-gone']=page.locator('.sx-sheet').count()==0
        page.screenshot(path=str(out/f'scene_{w}x{h}.png'))
        for k,v in flags.items():
            print(('PASS' if v else 'FAIL'), f'{w}x{h}: {k}',flush=True)
            res.append(v)
        ctx.close()
    browser.close()
print(f'RESULT {sum(res)}/{len(res)}')
sys.exit(0 if all(res) else 1)
