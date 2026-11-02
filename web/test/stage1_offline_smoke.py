"""Stage 1 optional browser test: localhost bundled assets; offline after startup.

This web-layer test DOES NOT verify Android WebView, true offline cold start,
or native OnBackInvokedDispatcher. Browser may be blocked by container policy.
Run: python3 web/test/stage1_offline_smoke.py
Requires: pip install playwright; playwright install chromium (or /usr/bin/chromium).
"""
from __future__ import annotations

import json
import tempfile
from pathlib import Path
from urllib.parse import urlsplit
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread

from playwright.sync_api import sync_playwright

PROJECT = Path(__file__).resolve().parents[2]
ASSETS = PROJECT / "android" / "app" / "src" / "main" / "assets" / "www"
ORIGIN = ""
BASE = ""


def main() -> None:
    assert (ASSETS / "index.html").is_file(), "Missing bundled index.html"
    assert (ASSETS / "survival.html").is_file(), "Missing bundled survival.html"
    manifest = (PROJECT / "android" / "app" / "src" / "main" / "AndroidManifest.xml").read_text()
    assert "android.permission.INTERNET" not in manifest, "Unexpected INTERNET permission"
    assert "setDomStorageEnabled(true)" in (PROJECT / "android" / "app" / "src" / "main" / "java" / "tw" / "sumeeko" / "learning" / "factory" / "MainActivity.java").read_text()
    failures = []
    unexpected_requests = []
    results = []

    def check(desc, condition):
        results.append((desc, bool(condition)))
        print(f"{'PASS' if condition else 'FAIL'} {desc}")
        if not condition:
            failures.append(desc)

    handler = partial(SimpleHTTPRequestHandler, directory=str(ASSETS))
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    host = f"http://127.0.0.1:{server.server_port}"
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    with tempfile.TemporaryDirectory(prefix="sumeeko-offline-") as user_dir, sync_playwright() as p:
        def make_context():
            browser = p.chromium.launch_persistent_context(
                user_data_dir=user_dir,
                headless=True,
                executable_path="/usr/bin/chromium",
                viewport={"width": 412, "height": 915},
                device_scale_factor=2,
                is_mobile=True,
                has_touch=True,
                args=["--no-sandbox", "--use-gl=swiftshader", "--enable-webgl", "--ignore-gpu-blocklist"],
            )

            def block_external(route):
                url = route.request.url
                if urlsplit(url).hostname == "127.0.0.1":
                    route.continue_()
                else:
                    unexpected_requests.append(url)
                    route.abort()
            browser.route("**/*", block_external)
            browser.add_init_script("window.AndroidApp={version:()=> '1.0.0-debug',exitApp:()=>{}};")
            return browser

        ctx = make_context()
        pg = ctx.pages[0] if ctx.pages else ctx.new_page()
        pg.on("pageerror", lambda e: failures.append(f"JavaScript runtime: {e}"))
        pg.goto(host + "/index.html", wait_until="domcontentloaded")
        pg.locator(".sx-onb").wait_for(timeout=10000)
        ctx.set_offline(True)
        check("Bundled App starts with all requests served locally", pg.locator(".sx-onb").count() == 1)
        pg.get_by_text("略過", exact=True).click()
        pg.get_by_text("歡迎回到工廠").wait_for(timeout=10000)
        check("Home loads offline via simulated AssetLoader URL path", pg.locator(".sx-nav").count() == 1)

        pg.locator('.sx-nav button:has-text("工作場景")').click()
        pg.locator('.sx-mach:has-text("M02")').click()
        check("Machine detail opens offline", pg.locator(".sx-sheet").count() == 1)
        check("Android JS back contract closes detail", pg.evaluate("window.__handleBack()") is True)
        check("Detail hidden after back", pg.locator(".sx-sheet").count() == 0)
        check("Back returns to home", pg.evaluate("window.__handleBack()") is True)
        check("Home Android JS back returns false to exit native Activity", pg.evaluate("window.__handleBack()") is False)
        pg.locator('.sx-nav button:has-text("我的")').click()
        pg.locator('label:has-text("低畫質模式") input').check()
        saved = json.loads(pg.evaluate("localStorage.getItem('sumeeko-app-v1')"))
        check("App preference written to localStorage", saved["settings"]["lowGfx"] is True)
        pg.close()
        ctx.close()

        # Restart the browser process with the SAME persistent profile to simulate app relaunch.
        ctx2 = make_context()
        pg2 = ctx2.pages[0] if ctx2.pages else ctx2.new_page()
        pg2.goto(host + "/index.html", wait_until="domcontentloaded")
        pg2.get_by_text("歡迎回到工廠").wait_for(timeout=10000)
        ctx2.set_offline(True)
        restored = json.loads(pg2.evaluate("localStorage.getItem('sumeeko-app-v1')"))
        check("Saved data survives browser process restart", restored["settings"]["lowGfx"] is True and restored["onboarded"] is True)
        check("No network requests needed", len(unexpected_requests) == 0)
        ctx2.close()

    server.shutdown()
    report = {"scope": "Chromium localhost bundled assets + offline-after-load interaction (NOT Android APK or true offline cold start)",
              "passed": sum(v for _, v in results), "total": len(results),
              "results": [{"test": k, "pass": v} for k, v in results],
              "unexpected_requests": unexpected_requests, "failures": failures}
    out = PROJECT / "docs" / "STAGE1-OFFLINE-RESULT.json"
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")
    print(f"RESULT: {report['passed']}/{report['total']} passed; saved to {out}")
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
