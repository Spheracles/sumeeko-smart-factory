from pathlib import Path
import struct
import json, re
site=Path(__file__).parent/'site'
manifest=json.loads((site/'manifest.webmanifest').read_text())
assert manifest['start_url']=='./app.html'
assert manifest['display']=='standalone'
required=['index.html','app.html','sw.js','manifest.webmanifest','sumeeko-app.js','sumeeko-style.css','landing.css','landing.js','brand-app.css','pwa-ui.css','pwa-ui.js','survival.html','assets/factory-cover.webp','assets/brand-guide.webp','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png']
for name in required:
    path=site/name
    assert path.exists() and path.stat().st_size>0, name
for name,size in [('icon-192.png',(192,192)),('icon-512.png',(512,512)),('maskable-512.png',(512,512))]:
    assert struct.unpack('>II',(site/'icons'/name).read_bytes()[16:24])==size
assert 'sumeeko-smart-factory-pwa-' in (site/'sw.js').read_text()
assert '__BUILD_VERSION__' not in (site/'sw.js').read_text()
assert 'sumeeko-app.js' in (site/'app.html').read_text()
assert 'app.html' in (site/'index.html').read_text()
print(f'Stage 4 PWA: {len(required)} required assets and 3 icon dimensions verified.')
