/* GitHub Pages-friendly PWA registration and install information. */
(()=>{let deferred=null;const button=document.getElementById('install-btn');const text=document.getElementById('install-help');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;});
button?.addEventListener('click',async()=>{
 if(deferred){const event=deferred;deferred=null;await event.prompt();return;}
 text.textContent=/Android/i.test(navigator.userAgent)?'在 Chrome 右上角選單中點選「安裝應用程式」；若尚未出現，請先使用 HTTPS 並重新開啟。':'使用支援 PWA 的瀏覽器，從選單選擇「安裝」；iPhone 可由 Safari 分享選單選擇「加入主畫面」。';
});
if('serviceWorker' in navigator && (location.protocol==='https:'||['localhost','127.0.0.1'].includes(location.hostname))){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(console.warn));}
})();
