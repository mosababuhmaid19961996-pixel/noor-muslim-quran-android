
let deferredInstallPrompt=null;
const installBtn=document.getElementById('installAppBtn');

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredInstallPrompt=e;
  if(installBtn){installBtn.hidden=false;}
});
if(installBtn){
  installBtn.addEventListener('click',async()=>{
    if(deferredInstallPrompt){
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt=null;
      installBtn.hidden=true;
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
window.addEventListener('appinstalled',()=>{if(installBtn)installBtn.hidden=true;});
