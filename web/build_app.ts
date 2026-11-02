// 打包 Android App 用的離線網頁資源（單一 index.html ＋ survival.html），不載入任何外部字型或 CDN
const r = await Bun.build({ entrypoints: ['./src/app/main_app.tsx'], minify: true, target: 'browser', define: { 'process.env.NODE_ENV': '"production"' } });
if (!r.success) { console.error(r.logs); process.exit(1); }
const js = await r.outputs[0].text();
const css = (await Bun.file('./src/styles.css').text()) + '\n' + (await Bun.file('./src/app/app.css').text());
const out = process.argv[2] || './dist-app';
const html = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#101D2B" />
<title>SUMEEKO 智慧工廠</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>`;
await Bun.write(`${out}/index.html`, html);
// 生存戰頁面：移除外部字型連結以利離線
let sv = await Bun.file('../survival/survival.html').text();
sv = sv.replace(/<link rel="preconnect"[^>]*>/g, '').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '');
await Bun.write(`${out}/survival.html`, sv);
console.log('app built', (html.length / 1024).toFixed(0), 'KB ->', out);
