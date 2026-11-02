import time, pathlib
from playwright.sync_api import sync_playwright
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    for vp in [(1440,900),(390,844)]:
        pg=b.new_page(viewport={'width':vp[0],'height':vp[1]})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: m.type=='error' and 'TUNNEL' not in m.text and errs.append(m.text))
        pg.goto((pathlib.Path(__file__).resolve().parent.parent/'dist'/'index.html').as_uri())
        pg.evaluate("localStorage.clear()")
        pg.reload()
        pg.click('text=開始新遊戲'); pg.click('text=進廠報到'); time.sleep(0.4)
        pg.evaluate("""()=>{const k='sumeeko-smart-factory-v2-0';const o=JSON.parse(localStorage.getItem(k));const g=o.g;
          for(let i=0;i<12;i++) g.done[i]={score:70,best:70,tries:1}; g.pos=6; g.certs=['AI 專案實績'];
          g.skills={mfg:50,qual:45,prod:30,ie:50,it:60,sys:30}; g.pendingEvent=null; localStorage.setItem(k,JSON.stringify({t:Date.now(),g}));}""")
        pg.reload(); pg.click('text=繼續遊戲'); time.sleep(0.3)
        print('top btn:', pg.locator('.top .btn.primary').inner_text())
        pg.locator('.top .btn.primary').click(); time.sleep(0.3)
        pg.screenshot(path=f'/tmp/sv_intro_{vp[0]}.png')
        pg.click('text=任務簡報 ▶') if pg.locator('text=任務簡報 ▶').count() else None
        for _ in range(4):
            if pg.locator('text=下一格 ▶').count(): pg.click('text=下一格 ▶')
        if pg.locator('text=任務簡報 ▶').count(): pg.click('text=任務簡報 ▶')
        pg.screenshot(path=f'/tmp/sv_brief_{vp[0]}.png', full_page=True)
        pg.locator('main .btn.primary').last.click(); time.sleep(0.3)
        pg.click('text=開始生存戰'); time.sleep(1.5)
        fr=pg.frame_locator('.sv-overlay iframe')
        pg.screenshot(path=f'/tmp/sv_start_{vp[0]}.png')
        print('banner:', fr.locator('.smk-bridge').first.inner_text()[:80])
        frame=[f for f in pg.frames if f.url.endswith('survival.html')][0]
        # 用舊遊戲的自動遊玩跑完職涯模式
        frame.evaluate("()=>{ S=newState({mode:'career',diff:'std'}); autoPlay(S,'best'); UI.screen='game'; render(); }")
        time.sleep(0.6)
        pg.screenshot(path=f'/tmp/sv_end_{vp[0]}.png')
        print('ending banner:', fr.locator('.smk-bridge').first.inner_text()[:90])
        fr.locator('[data-act=smkBack]').first.click(); time.sleep(0.4)
        print('overlay open after back:', pg.locator('.sv-overlay').count())
        pg.screenshot(path=f'/tmp/sv_result_{vp[0]}.png', full_page=True)
        pg.click('text=提交考核結果'); time.sleep(0.3)
        pg.locator('main .opts.col .opt').first.click(); pg.click('text=確定決策'); time.sleep(0.4)
        pg.screenshot(path=f'/tmp/sv_done_{vp[0]}.png', full_page=True)
        print('result:', pg.locator('.result-h').inner_text().replace('\n',' '), '| promo:', pg.locator('.promo').all_inner_texts())
        print('next chapter btn:', pg.locator('.top .btn.primary').inner_text())
        if vp[0]==390:
            pg.evaluate("""()=>{const k='sumeeko-smart-factory-v2-0';const o=JSON.parse(localStorage.getItem(k));const g=o.g; g.v=2; delete g.survival; g.pendingEvent=null; g.done={}; for(let i=0;i<13;i++) g.done[i]={score:60,best:60,tries:1}; localStorage.setItem(k,JSON.stringify({t:1,g}));}""")
            pg.reload(); pg.click('text=繼續遊戲'); time.sleep(0.3)
            pg.click('.nav button:has-text("任務中心")'); time.sleep(0.2)
            print('migrated:', [x.replace(chr(10),' ')[:28] for x in pg.locator('.chcard').all_inner_texts()][11:15])
        pg.close()
    b.close()
print('ERRS', errs[:10])
