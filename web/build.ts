// 打包成單一自包含 HTML
const r = await Bun.build({
  entrypoints: ['./src/main.tsx'],
  minify: true,
  target: 'browser',
  define: { 'process.env.NODE_ENV': '"production"' },
});
if (!r.success) { console.error(r.logs); process.exit(1); }
const js = await r.outputs[0].text();
const css = await Bun.file('./src/styles.css').text();
const html = `<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>從一顆螺絲到一座智慧工廠｜SUMEEKO: Rise of the Smart Factory</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;800&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet" />
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script/gi, '<\\/script')}</script>
</body>
</html>`;
await Bun.write('./dist/index.html', html);
await Bun.write('./dist/survival.html', await Bun.file('../survival/survival.html').text());
console.log('built', (html.length / 1024).toFixed(0), 'KB');
