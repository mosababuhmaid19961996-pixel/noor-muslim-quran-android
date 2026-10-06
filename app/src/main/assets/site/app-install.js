function isAndroidQuranApp(){try{return !!window.AndroidQuran && typeof window.AndroidQuran.isNative==='function' && window.AndroidQuran.isNative();}catch(e){return false;}}

const installBtn=document.getElementById('installAppBtn');

// The Android APK is already installed, so the website-install control must never appear inside it.
if(isAndroidQuranApp()){
  if(installBtn){installBtn.hidden=true; installBtn.style.display='none'; installBtn.setAttribute('aria-hidden','true');}
}else{
  let deferredInstallPrompt=null;
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    deferredInstallPrompt=e;
    if(installBtn){installBtn.hidden=false; installBtn.style.display='';}
  });
  if(installBtn){
    installBtn.addEventListener('click',async()=>{
      if(deferredInstallPrompt){
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt=null;
        installBtn.hidden=true;
        installBtn.style.display='none';
        return;
      }
      const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent);
      if(isIOS){
        alert('لتثبيت الموقع على iPhone أو iPad: اضغط زر المشاركة ⬆️ في Safari ثم اختر «إضافة إلى الشاشة الرئيسية».');
      }else{
        alert('إذا ظهر خيار «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» في قائمة المتصفح، اختره لتثبيت الموقع.');
      }
    });
  }
  window.addEventListener('appinstalled',()=>{if(installBtn){installBtn.hidden=true;installBtn.style.display='none';}});
}
