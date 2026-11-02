/* Install PWA: Chrome prompts where allowed, iOS/manual fallback, update without silent reload. */
(() => {
  'use strict';
  const standalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const add = (tag, props, html) => { const node=document.createElement(tag);Object.entries(props||{}).forEach(([k,v])=>node.setAttribute(k,v));if(html!==undefined)node.innerHTML=html;return node;};
  const prompt=add('aside',{id:'pwa-prompt',role:'region','aria-label':'安裝智慧工廠 App'});
  prompt.innerHTML='<div class="pwa-word"><strong>將智慧工廠安裝到手機</strong><small>可從主畫面啟動，核心功能支援離線</small></div><button id="pwa-install" type="button">安裝</button><button class="pwa-dismiss" id="pwa-hide" aria-label="關閉安裝提示" type="button">✕</button>';
  const update=add('aside',{id:'pwa-update',role:'status'},'<span>發現智慧工廠新版本，更新前請確認操作與資料已保存。</span><button id="pwa-upgrade" type="button">更新</button>');
  const note=add('div',{id:'pwa-note',role:'dialog','aria-label':'安裝教學'});
  document.body.append(prompt,update,note);
  const get=id=>document.getElementById(id);
  // Android installed PWA has no native Java back bridge: translate system back history to the existing React back stack.
  // Keep a single sentinel history entry only in standalone mode; at Home, a second Back exits normally.
  if (standalone() && history && history.pushState) {
    history.replaceState(Object.assign({},history.state,{__sumeekoBase:true}), '', location.href);
    history.pushState({__sumeekoGuard:true}, '', location.href);
    addEventListener('popstate', () => {
      const handled=typeof window.__handleBack==='function' ? window.__handleBack() : false;
      if (handled) history.pushState({__sumeekoGuard:true}, '', location.href);
    });
  }
  let deferredPrompt=null,swReg=null,refreshing=false;
  const isMobile=/Android|iPad|iPhone|iPod/i.test(navigator.userAgent);
  const showPrompt=()=>{if(!standalone() && isMobile && !sessionStorage.getItem('pwa-install-hide'))prompt.dataset.show='true';};
  const manualGuide=()=>{
    let words;
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) words='在 Safari 點選「分享」→「加入主畫面」。';
    else if (/Android/.test(navigator.userAgent)) words='在 Chrome 開啟本網站，點右上角「⋮」→「安裝應用程式」或「新增至主畫面」。若無法安裝，請確認網站使用 HTTPS 且瀏覽器支援 PWA。';
    else words='請使用支援 PWA 的瀏覽器，開啟選單並選擇「安裝應用程式」。';
    note.innerHTML='<b>安裝智慧工廠</b><div>'+words+'</div><button id="pwa-close-note" type="button">知道了</button>';
    note.dataset.show='true';get('pwa-close-note').addEventListener('click',()=>{note.dataset.show='false';});
  };
  window.addEventListener('beforeinstallprompt',evt=>{evt.preventDefault();deferredPrompt=evt;showPrompt();});
  window.addEventListener('appinstalled',()=>{prompt.dataset.show='false';deferredPrompt=null;});
  get('pwa-install').addEventListener('click',async()=>{
    if(!deferredPrompt){manualGuide();return;}
    const p=deferredPrompt;deferredPrompt=null;
    try{await p.prompt();await p.userChoice;}catch(e){console.warn('Install prompt unavailable',e);manualGuide();}
    prompt.dataset.show='false';
  });
  get('pwa-hide').addEventListener('click',()=>{prompt.dataset.show='false';sessionStorage.setItem('pwa-install-hide','1');});
  // Some browsers don't emit beforeinstallprompt: users still need installation help.
  if(isMobile)setTimeout(showPrompt,2600);
  get('pwa-upgrade').addEventListener('click',()=>{
    if(swReg?.waiting)swReg.waiting.postMessage({type:'SKIP_WAITING'});
  });
  const showUpdate=()=>{if(swReg?.waiting && navigator.serviceWorker.controller)update.dataset.show='true';};
  if('serviceWorker' in navigator && (location.protocol==='https:' || ['localhost','127.0.0.1'].includes(location.hostname))){
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!refreshing){refreshing=true;location.reload();}});
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'})
      .then(reg=>{swReg=reg;showUpdate();reg.addEventListener('updatefound',()=>{const worker=reg.installing;if(!worker)return;worker.addEventListener('statechange',()=>{if(worker.state==='installed')showUpdate();});});})
      .catch(err=>console.warn('離線服務註冊失敗',err));
    });
  }
})();
