"""Verify bundled HTML has no external runtime asset dependencies; no SDK required.

Offline runtime / cold start in Android WebView still requires an Android device test.
"""
from html.parser import HTMLParser
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'android/app/src/main/assets/www'
MANIFEST = ROOT / 'android/app/src/main/AndroidManifest.xml'
ACTIVITY = ROOT / 'android/app/src/main/java/tw/sumeeko/learning/factory/MainActivity.java'

class RuntimeRefs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.items = []
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag in {'script', 'img', 'iframe', 'source', 'audio', 'video', 'track'}:
            v = d.get('src')
            if v: self.items.append((tag, v))
        if tag == 'link' and 'stylesheet' in d.get('rel', ''):
            v = d.get('href')
            if v: self.items.append((tag, v))

n = 0
def check(label, ok):
    global n
    assert ok, 'FAIL ' + label
    n += 1
    print('PASS ' + label)

for name in ('index.html', 'survival.html'):
    p = ASSETS / name
    check(name + ' included in APK assets directory', p.is_file() and p.stat().st_size > 3000)
    txt = p.read_text(encoding='utf-8')
    parsed = RuntimeRefs()
    parsed.feed(txt)
    invalid = [(tag, url) for tag, url in parsed.items if url.lower().startswith(('https://', 'http://', '//'))]
    check(name + ' does not reference external runtime scripts/images/styles', not invalid)
    check(name + ' does not import remote CSS', not re.search(r'@import\s+(?:url\()?\s*[\'\"]?(?:https?:)?//', txt, re.I))
    check(name + ' does not dynamically fetch remote resources', not re.search(r'''\b(?:fetch|importScripts)\s*\(\s*['"]https?://''', txt, re.I))
check('Android Manifest has no Internet permission', 'android.permission.INTERNET' not in MANIFEST.read_text())
a = ACTIVITY.read_text()
check('WebView DOM Storage enabled', 'setDomStorageEnabled(true)' in a)
check('AssetLoader maps /assets/ to bundled assets', '.addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))' in a)
check('App launch URL points to bundled index.html', '"/assets/www/index.html"' in a)
check('Android 13+ back callback registered', 'registerOnBackInvokedCallback(' in a)
check('Android 13+ back callback unregistered on destroy', 'unregisterOnBackInvokedCallback(' in a)
check('Android 8–12 back fallback implemented', 'public void onBackPressed()' in a)
print(f'{n}/{n} static bundle checks passed')
