import time, json, pathlib
from playwright.sync_api import sync_playwright
errs=[]; R={}
def ok(k,v): R[k]=v; print(('PASS ' if v else 'FAIL ')+k)
with sync_playwright() as p:
    b=p.chromium.launch(args=['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist'])
    ctx=b.new_context(viewport={'width':412,'height':915}, device_scale_factor=2, is_mobile=True, has_touch=True)
    pg=ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type=='error' and errs.append(m.text))
    pg.goto((pathlib.Path(__file__).resolve().parent.parent/'dist-app'/'index.html').as_uri()); pg.evaluate('localStorage.clear()'); pg.reload()
    time.sleep(0.3); pg.screenshot(path='/tmp/a_splash.png')
    time.sleep(1.2); ok('onboarding shown', pg.locator('.sx-onb').count()==1); pg.screenshot(path='/tmp/a_onb.png')
    pg.click('text=略過'); time.sleep(0.3); ok('home shown', pg.locator('text=歡迎回到工廠').count()==1); pg.screenshot(path='/tmp/a_home.png', full_page=True)
    # scene
    pg.click('.sx-nav button:has-text("工作場景")'); time.sleep(0.4); pg.screenshot(path='/tmp/a_scene.png')
    pg.locator('.sx-mach:has-text("M02")').click(); time.sleep(0.3); ok('sheet opens on machine tap', pg.locator('.sx-sheet').count()==1); pg.screenshot(path='/tmp/a_sheet.png')
    ok('back closes sheet', pg.evaluate('window.__handleBack()') and pg.locator('.sx-sheet').count()==0)
    pg.locator('.sx-mach:has-text("M02")').click(); time.sleep(0.2); pg.click('text=進入機台模擬'); time.sleep(0.4)
    ok('machine page', pg.locator('.sx-sim').count()==1)
    pg.click('text=🔧 啟動前檢查'); 
    for c in pg.locator('.sx-box .sx-check input').all(): c.check()
    pg.click('text=▶ 啟動'); time.sleep(1.0)
    ok('running state + anim on', pg.locator('.sx-badge:has-text("運轉中")').count()==1 and pg.locator('.mach.on').count()==1)
    pg.screenshot(path='/tmp/a_machine_run.png', full_page=True)
    pg.click('text=⏸ 暫停'); time.sleep(0.3); prog1=pg.locator('.sx-prog span').inner_text(); time.sleep(0.8); prog2=pg.locator('.sx-prog span').inner_text()
    ok('pause freezes progress + anim off', prog1==prog2 and pg.locator('.mach.on').count()==0)
    pg.click('text=⏯ 恢復'); time.sleep(0.4); pg.click('text=⛔ 緊急停止'); time.sleep(0.3)
    ok('estop stops anim and disables start', pg.locator('.mach.on').count()==0 and pg.locator('.sx-badge:has-text("緊急停止")').count()==1 and pg.locator('button:has-text("▶ 啟動")').is_disabled())
    pg.screenshot(path='/tmp/a_estop.png')
    ok('reset blocked before confirm', pg.locator('button:has-text("急停復歸")').is_disabled())
    pg.locator('.sx-box.red input').check(); pg.click('text=⟲ 急停復歸'); time.sleep(0.2)
    ok('reset to idle', pg.locator('.sx-badge:has-text("待機")').count()==1)
    # full run to complete
    pg.click('text=🔧 啟動前檢查')
    for c in pg.locator('.sx-box .sx-check input').all(): c.check()
    pg.click('text=▶ 啟動'); time.sleep(10)
    ok('completes with result', pg.locator('.sx-badge:has-text("完成")').count()==1)
    # fault + LOTO
    pg.click('text=🔧 啟動前檢查')
    for c in pg.locator('.sx-box .sx-check input').all(): c.check()
    pg.click('text=▶ 啟動'); time.sleep(0.5); pg.click('text=模擬故障'); time.sleep(0.2); pg.click('text=進入保養模式（LOTO）')
    for i in range(3): pg.locator('.sx-box.purple input').nth(i).check()
    pg.click('text=✔ 排除完成'); ok('fault->maintenance->idle', pg.locator('.sx-badge:has-text("待機")').count()==1)
    # views
    pg.click('.sx-seg button:has-text("逐站動畫")'); ok('station view', pg.locator('.stations').count()==1)
    pg.evaluate('window.__handleBack()'); time.sleep(0.2)
    # codex -> part 3D
    pg.click('.sx-nav button:has-text("圖鑑")'); pg.click('.sx-seg button:has-text("工件")'); pg.locator('.sx-route button:has-text("螺紋加工件")').first.click(); time.sleep(1.2)
    pg.locator('.sx-canvas').screenshot(path='/tmp/a_canvas.png')
    from PIL import Image
    im=Image.open('/tmp/a_canvas.png').convert('L'); hist=im.getextrema(); px=(hist[1]-hist[0])/255
    print('3D coverage', px); ok('3D part rendered (non-empty pixels)', px>0.02)
    pg.screenshot(path='/tmp/a_part.png', full_page=True)
    pg.click('.sx-vbar button:has-text("剖面")'); time.sleep(0.4); pg.screenshot(path='/tmp/a_part_cut.png')
    for name in ['盤元','螺帽','套管']:
        pass
    # tools demo
    pg.evaluate('window.__handleBack()'); pg.click('.sx-seg button:has-text("工具")'); pg.locator('.sx-tile:has-text("螺紋環規")').click(); pg.click('text=外徑偏大'); pg.click('button:has-text("GO 通端")')
    ok('ring gauge demo result', 'GO 端無法旋入' in pg.locator('.sx-box').inner_text())
    pg.screenshot(path='/tmp/a_tool.png', full_page=True)
    # unit
    pg.click('.sx-nav button:has-text("任務")'); pg.locator('.sx-item:has-text("U01")').click(); time.sleep(0.8)
    for q in pg.locator('.sx-quiz').all(): q.locator('.sx-opt').nth(1).click()
    pg.click('button:has-text("完成單元")'); time.sleep(0.3)
    ok('unit saved', json.loads(pg.evaluate("localStorage.getItem('sumeeko-app-v1')"))['units'].get('U01',{}).get('done')==True)
    pg.screenshot(path='/tmp/a_unit.png', full_page=True)
    # task T1
    pg.evaluate('window.__handleBack()'); pg.locator('.sx-item:has-text("冷鍛成形首件")').click(); time.sleep(0.5)
    pg.locator('.sx-opt:has-text("下料胚料")').click(); pg.click('button:has-text("下一步")')
    for i in range(4):
        pg.locator('.sx-chk').nth(i).locator('button:has-text("點檢")').click()
    while pg.locator('.sx-chk button.pri').count(): pg.locator('.sx-chk button.pri').first.click()
    pg.click('button:has-text("下一步")'); time.sleep(0.2)
    pg.click('button:has-text("下一步")'); time.sleep(0.3)
    pg.click('text=🔧 啟動前檢查')
    for c in pg.locator('.sx-box .sx-check input').all(): c.check()
    pg.click('text=▶ 啟動'); time.sleep(11)
    pg.click('button:has-text("下一步：檢查成品")'); pg.screenshot(path='/tmp/a_task_inspect.png', full_page=True)
    pg.click('.sx-opt:has-text("✔ 合格")'); pg.click('button:has-text("完成紀錄")'); time.sleep(0.4)
    ok('task T1 success', pg.locator('text=任務成功').count()==1)
    pg.screenshot(path='/tmp/a_task_done.png', full_page=True)
    st=json.loads(pg.evaluate("localStorage.getItem('sumeeko-app-v1')")); ok('task record saved', st['tasks']['T1']['pass']==True)
    pg.click('button:has-text("下一個工序")'); ok('next process T2', pg.locator('text=T2｜搓牙與螺紋判定').count()==1)
    # career
    for _ in range(4): pg.evaluate('window.__handleBack()')
    if pg.locator('text=歡迎回到工廠').count()==0: pg.screenshot(path='/tmp/a_backfail.png'); print('DEBUG top:', pg.locator('.sx-top-t b').all_inner_texts(), pg.locator('h2').all_inner_texts())
    ok('back reaches home', pg.locator('text=歡迎回到工廠').count()==1)
    pg.click('.sx-q:has-text("職涯模式")'); time.sleep(0.4); ok('career title', pg.locator('text=從一顆螺絲').count()>0); pg.screenshot(path='/tmp/a_career.png')
    pg.click('text=開始新遊戲'); time.sleep(0.2); ok('back in career create->title', pg.evaluate('window.__handleBack()') and pg.locator('text=開始新遊戲').count()==1)
    pg.evaluate('window.__handleBack()'); time.sleep(0.2); ok('back exits career to app', pg.locator('.sx-nav').count()==1)
    ok('back on home returns false (exit)', pg.evaluate('window.__handleBack()')==False)
    # me + settings persist
    pg.click('.sx-nav button:has-text("我的")'); pg.locator('label:has-text("低畫質模式") input').check(); time.sleep(0.5); pg.reload(); time.sleep(1.5)
    ok('settings persisted', json.loads(pg.evaluate("localStorage.getItem('sumeeko-app-v1')"))['settings']['lowGfx']==True)
    pg.click('.sx-nav button:has-text("我的")'); pg.screenshot(path='/tmp/a_me.png', full_page=True)
    # landscape
    pg.set_viewport_size({'width':915,'height':412}); pg.click('.sx-nav button:has-text("工作場景")'); time.sleep(0.4); pg.screenshot(path='/tmp/a_land.png')
    b.close()
print('ERRORS', [e for e in errs][:10])
json.dump(R, open('/tmp/app_results.json','w'), ensure_ascii=False)
