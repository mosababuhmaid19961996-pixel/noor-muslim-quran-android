/* v21: reliable Android/PWA back navigation for the Quran reciter/surah list. */
(function(){
  'use strict';
  const baseUrl=()=>location.href.split('#')[0];
  const settings=()=>document.getElementById('settingsModal');
  const modal=()=>document.getElementById('modal');
  const settingsBtn=()=>document.getElementById('settingsBtn');
  const closeSettings=()=>document.getElementById('closeSettings');
  let settingsOpen=false, reciterOpen=false, internalNav=false;

  const isRoot=s=>!!(s&&s.__noorView==='root');
  const isGuard=s=>!!(s&&s.__noorView==='guard');
  const isReciter=s=>!!(s&&s.__noorView==='reciter');
  const isSettings=s=>!!(s&&s.__noorView==='settings');

  function seedHistory(){
    const s=history.state;
    if(!isRoot(s)&&!isGuard(s)&&!isReciter(s)&&!isSettings(s)){
      history.replaceState({__noorView:'root'},'',baseUrl());
      history.pushState({__noorView:'guard'},'',baseUrl());
    }else if(isRoot(s)){
      history.pushState({__noorView:'guard'},'',baseUrl());
    }
  }

  function hideSettings(){
    const el=settings();
    if(el){el.classList.add('hidden');el.setAttribute('aria-hidden','true');}
    settingsOpen=false;
  }
  function openSettings(){
    if(settingsOpen)return;
    settingsOpen=true;
    history.pushState({__noorView:'settings'},'',baseUrl()+'#settings');
    const el=settings();
    if(el){el.classList.remove('hidden');el.setAttribute('aria-hidden','false');}
    if(typeof refreshSettingsUI==='function')refreshSettingsUI();
  }

  function hideReciter(){
    const el=modal();
    if(el){el.classList.add('hidden');el.setAttribute('aria-hidden','true');}
    reciterOpen=false;
  }
  function openReciterHistory(){
    if(reciterOpen)return;
    reciterOpen=true;
    history.pushState({__noorView:'reciter'},'',baseUrl()+'#reciter');
  }

  if(settingsBtn())settingsBtn().onclick=openSettings;
  if(closeSettings())closeSettings().onclick=()=>{
    if(settingsOpen){internalNav=true;history.back();setTimeout(()=>{internalNav=false;hideSettings();},0);}
    else hideSettings();
  };
  const sm=settings();
  if(sm)sm.addEventListener('click',e=>{
    if(e.target.id==='settingsModal'&&settingsOpen){internalNav=true;history.back();setTimeout(()=>{internalNav=false;hideSettings();},0);}
  });

  // Every reciter card opens the modal in app.js. Add a history entry after the
  // modal is actually visible, including when the card button triggers download-all.
  document.addEventListener('click',e=>{
    const card=e.target.closest?.('.card');
    if(card&&!e.target.closest?.('.reciter-favorite,.reciter-download-all')){
      setTimeout(()=>{const m=modal();if(m&&!m.classList.contains('hidden'))openReciterHistory();},0);
    }
    if(e.target.closest?.('#closeModal')&&reciterOpen){
      internalNav=true;history.back();setTimeout(()=>{internalNav=false;if(reciterOpen)hideReciter();},0);
    }
  },true);

  // Programmatic openReciter calls (e.g. download-all) also get a history entry.
  try{
    const original=window.openReciter;
    if(typeof original==='function'){
      window.openReciter=function(){
        const out=original.apply(this,arguments);
        setTimeout(()=>{const m=modal();if(m&&!m.classList.contains('hidden'))openReciterHistory();},0);
        return out;
      };
    }
  }catch{}

  window.addEventListener('popstate',e=>{
    if(internalNav)return;
    const s=e.state||{};
    if(settingsOpen){hideSettings();return;}
    if(reciterOpen){
      hideReciter();
      // We have already gone back to the root/guard entry. Do not call back()
      // again: that second back is what can close a standalone PWA.
      return;
    }
    if(isGuard(s)){
      history.pushState({__noorView:'guard'},'',baseUrl());
      return;
    }
    if(isRoot(s)){
      history.pushState({__noorView:'guard'},'',baseUrl());
      return;
    }
    history.replaceState({__noorView:'root'},'',baseUrl());
    history.pushState({__noorView:'guard'},'',baseUrl());
  });

  window.addEventListener('hashchange',()=>{
    if(settingsOpen&&location.hash!=='#settings')hideSettings();
    if(reciterOpen&&location.hash!=='#reciter')hideReciter();
  });

  seedHistory();
})();
