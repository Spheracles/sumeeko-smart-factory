/* Tests cache preloading, offline navigation, offline assets, and update messaging in Node's JS VM */
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const script=fs.readFileSync(__dirname+'/site/sw.js','utf8');
const listeners={}; const store=new Map();const origin='https://example.test/factory/';let offline=false;
const local=new Map();
const resolve=u=>new URL(u,origin).href;
class TestCache{
 async addAll(items){for(const u of items){const res=await mockedFetch(new Request(resolve(u))); if(!res.ok) throw Error('precache failed '+u);local.set(resolve(u),res)}}
 async match(req){return local.get(resolve(typeof req==='string'?req:req.url))?.clone()}
 async put(req,res){local.set(resolve(typeof req==='string'?req:req.url),res.clone())}
}
async function mockedFetch(req){if(offline)throw Error('offline'); return new Response('OK '+req.url,{status:200});}
const cacheObj={open:async k=>new TestCache(),match:async(req)=>local.get(resolve(typeof req==='string'?req:req.url))?.clone(),keys:async()=>['sumeeko-smart-factory-pwa-old','sumeeko-smart-factory-pwa-new'],delete:async(k)=>true};
const self={location:{origin:'https://example.test'},addEventListener:(e,f)=>listeners[e]=f,clients:{claim:async()=>{}},skipWaiting:()=>{}};
const ctx={self,caches:cacheObj,fetch:mockedFetch,Request,Response,URL,console};vm.runInNewContext(script,ctx);
let installs=0;
async function dispatchFetch(url,mode='cors'){
 let pending;listeners.fetch({request:{url:resolve(url),method:'GET',mode},respondWith:p=>pending=p});assert.ok(pending,'intercepted');return await pending;}
(async()=>{
 let wait;listeners.install({waitUntil:p=>wait=p});await wait;assert.ok(local.has(resolve('./index.html')));assert.ok(local.has(resolve('./survival.html')));installs++;console.log('PASS precache shell & survival page');
 offline=true;
 assert.equal((await (await dispatchFetch('./index.html')).text()).startsWith('OK'),true);console.log('PASS offline cached assets');
 assert.equal((await dispatchFetch('./','navigate')).status,200);console.log('PASS offline root navigation');
 assert.equal((await dispatchFetch('./survival.html','navigate')).status,200);console.log('PASS offline survival navigation');
 assert.equal((await dispatchFetch('./unlisted-path','navigate')).status,200);console.log('PASS offline SPA fallback');
 assert.ok(listeners.message);console.log('PASS update message hook');
})().catch(e=>{console.error(e);process.exit(1)});
