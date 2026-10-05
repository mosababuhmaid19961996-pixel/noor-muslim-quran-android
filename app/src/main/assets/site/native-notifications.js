(function(){
  'use strict';

  function ready(){
    const box=document.getElementById('notificationsSetting');
    const status=document.getElementById('notificationStatus');
    const test=document.getElementById('testNotificationBtn');
    const settingsBtn=document.getElementById('settingsBtn');
    const isNative=!!(window.AndroidQuran && typeof window.AndroidQuran.isNative==='function' && window.AndroidQuran.isNative());
    if(!box || !isNative) return;

    function nativeEnabled(){
      try{return !!window.AndroidQuran.isReminderEnabled();}catch(e){return false;}
    }

    function setStatus(text){
      if(status) status.textContent=text;
    }

    function sync(){
      const on=nativeEnabled();
      box.checked=on;
      if(on){
        setStatus('تم تفعيل تذكيرات القرآن كل 4 ساعات.');
      }else if(box.dataset.waiting!=='1'){
        setStatus('التنبيهات اختيارية، وتصل كتذكيرات من القرآن الكريم كل 4 ساعات، ولن تُستخدم للإعلانات.');
      }
    }

    window.__quranNativeNotificationResult=function(granted){
      box.dataset.waiting='0';
      if(!granted){
        box.checked=false;
        setStatus('لم يتم السماح بإشعارات Android. يمكنك السماح بها من إعدادات إشعارات التطبيق.');
        return;
      }
      try{window.AndroidQuran.setReminderEnabled(true);}catch(e){}
      box.checked=true;
      setStatus('تم تفعيل تذكيرات القرآن كل 4 ساعات.');
      try{window.AndroidQuran.testReminder();}catch(e){}
    };

    box.onchange=function(){
      const want=!!box.checked;
      if(!want){
        try{window.AndroidQuran.setReminderEnabled(false);}catch(e){}
        box.dataset.waiting='0';
        box.checked=false;
        setStatus('تم إيقاف تذكيرات القرآن.');
        return;
      }

      box.checked=false;
      box.dataset.waiting='1';
      setStatus('جارٍ طلب إذن الإشعارات من Android…');

      try{
        if(window.AndroidQuran.hasNotificationPermission &&
           window.AndroidQuran.hasNotificationPermission()){
          window.__quranNativeNotificationResult(true);
        }else if(window.AndroidQuran.requestNotificationPermission){
          window.AndroidQuran.requestNotificationPermission();
        }else{
          box.dataset.waiting='0';
          setStatus('تعذر الوصول إلى نظام إشعارات Android.');
        }
      }catch(e){
        box.dataset.waiting='0';
        setStatus('تعذر طلب إذن الإشعارات من Android.');
      }
    };

    if(test){
      test.onclick=function(){
        try{
          if(nativeEnabled()) window.AndroidQuran.testReminder();
          else setStatus('فعّل التنبيهات أولًا.');
        }catch(e){}
      };
    }

    if(settingsBtn){
      const old=settingsBtn.onclick;
      settingsBtn.onclick=function(e){
        if(typeof old==='function') old.call(this,e);
        setTimeout(sync,0);
      };
    }

    if(status){
      status.onclick=function(){
        if(!nativeEnabled()){
          try{window.AndroidQuran.openNotificationSettings();}catch(e){}
        }
      };
    }

    window.addEventListener('pageshow',sync);
    document.addEventListener('visibilitychange',function(){
      if(document.visibilityState==='visible') setTimeout(sync,100);
    });

    setTimeout(sync,0);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();