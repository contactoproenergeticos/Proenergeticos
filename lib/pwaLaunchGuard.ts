import { ADMIN_PWA_SCOPE } from '@/lib/adminPwaConfig';

export const PWA_SCOPE_STORAGE_KEY = 'proener-pwa-scope';

/** Marca en localStorage que el acceso directo debe abrir el panel admin. */
export const PWA_ADMIN_SCOPE_SCRIPT = `(function(){
  try{localStorage.setItem('${PWA_SCOPE_STORAGE_KEY}','admin');}catch(e){}
})();`;

/**
 * Redirige en iOS/Android si el acceso directo admin abrió / por un manifiesto global antiguo.
 * Debe ejecutarse lo antes posible (beforeInteractive).
 */
export const PWA_LAUNCH_GUARD_SCRIPT = `(function(){
  var isStandalone=window.matchMedia('(display-mode: standalone)').matches||window.matchMedia('(display-mode: fullscreen)').matches||(typeof navigator!=='undefined'&&'standalone'in navigator&&navigator.standalone===true);
  if(!isStandalone)return;
  var scope=null;
  try{scope=localStorage.getItem('${PWA_SCOPE_STORAGE_KEY}');}catch(e){}
  var path=location.pathname||'/';
  if(scope==='admin'&&path.indexOf('${ADMIN_PWA_SCOPE}')!==0){
    location.replace('${ADMIN_PWA_SCOPE}');
  }
  if(scope==='public'&&path.indexOf('${ADMIN_PWA_SCOPE}')===0){
    location.replace('/');
  }
})();`;
