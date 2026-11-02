/** Stage 4 PWA builder. Bun runs this from web/; GitHub Pages serves pwa/site/. */
const output = '../pwa/site';
const result = await Bun.build({ entrypoints: ['./src/app/main_app.tsx'], target:'browser', minify:true, define:{'process.env.NODE_ENV':'"production"'} });
if (!result.success || !result.outputs.length) { console.error(result.logs); process.exit(1); }
const js = await result.outputs[0].text();
await Bun.write(`${output}/sumeeko-app.js`, js);
await Bun.write(`${output}/sumeeko-style.css`, (await Bun.file('./src/styles.css').text()) + '\n' + (await Bun.file('./src/app/app.css').text()));
const sv = (await Bun.file('../survival/survival.html').text()).replace(/<link rel="preconnect"[^>]*>/g,'').replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/g,'');
await Bun.write(`${output}/survival.html`, sv);
// Local offline bootstrap uses vendor-react.js. Production bundle includes React itself.
let app = await Bun.file(`${output}/app.html`).text();
app = app.replace(/\s*<script defer src="\.\/vendor-react\.js"><\/script>/g, '');
await Bun.write(`${output}/app.html`, app);
const sw = await Bun.file(`${output}/sw.js`).text();
const bytes = new TextEncoder().encode(js + (await Bun.file(`${output}/app.html`).text()) + sv + (await Bun.file(`${output}/landing.css`).text()));
const digest = await crypto.subtle.digest('SHA-256', bytes);
const version = Array.from(new Uint8Array(digest)).slice(0,8).map(n=>n.toString(16).padStart(2,'0')).join('');
await Bun.write(`${output}/sw.js`, sw.replace(/sumeeko-smart-factory-pwa-(?:__BUILD_VERSION__|[0-9a-f]{16})/g, `sumeeko-smart-factory-pwa-${version}`));
try { await Bun.$`rm -f ${output}/vendor-react.js`.quiet(); } catch{}
console.log(`Stage 4 PWA built: ${output}; JS ${(js.length/1024).toFixed(0)}KB; cache ${version}`);
