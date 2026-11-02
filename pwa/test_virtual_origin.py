from pathlib import Path
from playwright.sync_api import sync_playwright
p=Path(__file__).parent/'site'
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 ctx=b.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='allow')
 def serve(route):
  path=route.request.url.split('?',1)[0].split('sumeeko.test',1)[-1].strip('/')
  file=p/path
  if not file.is_file():file=p/'index.html'
  typ='text/javascript' if file.suffix=='.js' else 'text/html' if file.suffix in ['.html',''] else 'text/css' if file.suffix=='.css' else 'application/manifest+json' if file.suffix=='.webmanifest' else 'image/png'
  route.fulfill(status=200,body=file.read_bytes(),content_type=typ)
 ctx.route('https://sumeeko.test/**',serve)
 page=ctx.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
 try:
  page.goto('https://sumeeko.test/',wait_until='domcontentloaded',timeout=15000)
  page.wait_for_timeout(3000)
  print('body',page.locator('body').inner_text()[:100])
  print('sw',page.evaluate("navigator.serviceWorker?.controller?.scriptURL || ''"))
  print('errors',errs)
 except Exception as e:print('failed',str(e)[:1500])
 finally:b.close()
