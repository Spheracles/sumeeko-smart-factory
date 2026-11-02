/** Offline bootstrap builder: transpile Stage 2 source with TypeScript and reuse React 19 runtime already embedded in the supplied, MIT-licensed prebuilt HTML. For production rebuild, use web/build_pwa.ts with Bun. */
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=__dirname;
let ts; try{ts=require('typescript')}catch(e){try{ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript')}catch(e){throw Error('TypeScript missing: run npm install in web/') }}
const out=path.join(root,'pwa','site');fs.mkdirSync(out,{recursive:true});
let source=fs.readFileSync(path.join(root,'android/app/src/main/assets/www/index.html'),'utf8');
const start=source.indexOf('<script>')+8,end=source.lastIndexOf('</script>');
let vendor=source.slice(start,end);
const autoMount='mc(document.getElementById("root")).render(l(x1,null,l(Lc,null)));';
if(!vendor.includes(autoMount))throw Error('React vendor auto-mount signature changed');
vendor=vendor.replace(autoMount, `window.__SUMEEKO_REACT__=(()=>{const r={createElement:l,createContext:Pi,Component:Fc,Fragment:ce,useContext:zl,useEffect:ut,useMemo:Ot,useRef:Tt,useState:T};return {React:r,createRoot:mc,version:Br};})();`);
fs.writeFileSync(path.join(out,'vendor-react.js'),vendor);
let appPage=fs.readFileSync(path.join(out,'app.html'),'utf8');
appPage=appPage.replace('<script defer src="./sumeeko-app.js"></script>', '<script defer src="./vendor-react.js"></script>\n<script defer src="./sumeeko-app.js"></script>');
fs.writeFileSync(path.join(out,'app.html'),appPage);
const src=path.join(root,'web/src');
const mods={};
function collect(p){const abs=path.join(src,p);if(!fs.existsSync(abs))throw Error('Missing module '+p);
 const id='./'+p.replaceAll('\\','/');if(mods[id])return;
 const text=fs.readFileSync(abs,'utf8');
 const js=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.React,esModuleInterop:true,removeComments:true},fileName:abs}).outputText;
 mods[id]=js;
 const matches=[...text.matchAll(/\b(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)];
 for(const m of matches){const target=path.posix.normalize(path.posix.join(path.posix.dirname(p.replaceAll('\\','/')),m[1]));const match=['.tsx','.ts','.js'].map(ext=>target+ext).find(rel=>fs.existsSync(path.join(src,rel)));if(!match)throw Error('Cannot resolve '+m[1]+' from '+p); collect(match)}
}
collect('app/main_app.tsx');
const fmt=(s)=>JSON.stringify(s).replaceAll('</script','<\\/script');
const lines=['(function(){"use strict";',
 'const React=window.__SUMEEKO_REACT__; if(!React) throw Error("Missing bundled React runtime");',
 'const extReact=Object.assign({default:React.React,__esModule:true},React.React);',
 'const extClient={createRoot:React.createRoot};',
 'const factories=Object.create(null);'];
for(const [id,js] of Object.entries(mods)){lines.push('factories['+fmt(id)+']=function(module,exports,require){\n'+js+'\n};');}
lines.push(`const cache=Object.create(null);
function req(n,base){if(n==='react')return extReact;if(n==='react-dom/client')return extClient;
if(n.startsWith('.')){const parts=(base||'.').split('/').slice(0,-1).concat(n.split('/'));const norm=[];for(const x of parts){if(x==='..')norm.pop();else if(x && x!=='.')norm.push(x)}n='./'+norm.join('/');if(!factories[n])for(const ext of ['.tsx','.ts','.js'])if(factories[n+ext]){n+=ext;break;}}
if(!factories[n])throw Error('Module not found: '+n+' from '+base);
if(cache[n])return cache[n].exports;const module={exports:{}};cache[n]=module;factories[n](module,module.exports,(id)=>req(id,n));return module.exports;}
req('./app/main_app.tsx');
})();`);
fs.writeFileSync(path.join(out,'sumeeko-app.js'),lines.join('\n'));
fs.writeFileSync(path.join(out,'sumeeko-style.css'),fs.readFileSync(path.join(src,'styles.css'),'utf8')+'\n'+fs.readFileSync(path.join(src,'app/app.css'),'utf8'));
console.log('Built stage 3+4 modules',Object.keys(mods).length,'out',out);
