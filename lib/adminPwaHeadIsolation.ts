import {
  ADMIN_PWA_ICON,
  ADMIN_PWA_TITLE,
} from '@/lib/adminPwaConfig';

export const ADMIN_PWA_MANIFEST_HREF = '/manifest-admin-precios';

/** IDs únicos para que el panel admin no herede metadatos PWA de la web pública. */
export const ADMIN_PWA_HEAD_IDS = {
  manifest: 'admin-pwa-manifest',
  appleTitle: 'admin-pwa-apple-mobile-web-app-title',
  applicationName: 'admin-pwa-application-name',
  appleTouchIcon: 'admin-pwa-apple-touch-icon',
} as const;

const GLOBAL_MANIFEST_HREFS = ['/manifest.webmanifest', '/manifest.json'];

function isGlobalManifestHref(href: string | null): boolean {
  if (!href) return false;
  return GLOBAL_MANIFEST_HREFS.some(
    (globalHref) => href === globalHref || href.endsWith(globalHref)
  );
}

function safeRemove(node: Element): void {
  node.parentNode?.removeChild(node);
}

function ensureMeta(name: string, id: string, content: string): void {
  const tagged = document.getElementById(id) as HTMLMetaElement | null;
  if (tagged) {
    tagged.content = content;
    return;
  }

  const matches = document.querySelectorAll<HTMLMetaElement>(`meta[name="${name}"]`);
  matches.forEach((node, index) => {
    if (index === 0) {
      node.id = id;
      node.content = content;
    } else {
      safeRemove(node);
    }
  });

  if (!document.getElementById(id)) {
    const meta = document.createElement('meta');
    meta.id = id;
    meta.name = name;
    meta.content = content;
    document.head.appendChild(meta);
  }
}

function ensureAppleTouchIcon(): void {
  const tagged = document.getElementById(ADMIN_PWA_HEAD_IDS.appleTouchIcon) as HTMLLinkElement | null;
  if (tagged) {
    tagged.href = ADMIN_PWA_ICON;
    return;
  }

  const matches = document.querySelectorAll<HTMLLinkElement>('link[rel="apple-touch-icon"]');
  matches.forEach((node, index) => {
    if (index === 0) {
      node.id = ADMIN_PWA_HEAD_IDS.appleTouchIcon;
      node.href = ADMIN_PWA_ICON;
    } else {
      safeRemove(node);
    }
  });

  if (!document.getElementById(ADMIN_PWA_HEAD_IDS.appleTouchIcon)) {
    const icon = document.createElement('link');
    icon.id = ADMIN_PWA_HEAD_IDS.appleTouchIcon;
    icon.rel = 'apple-touch-icon';
    icon.href = ADMIN_PWA_ICON;
    document.head.appendChild(icon);
  }
}

function ensureManifestLink(): void {
  document.querySelectorAll('link[rel="manifest"]').forEach((node) => {
    const href = node.getAttribute('href');
    if (isGlobalManifestHref(href)) safeRemove(node);
  });

  const tagged = document.getElementById(ADMIN_PWA_HEAD_IDS.manifest) as HTMLLinkElement | null;
  if (tagged) {
    tagged.href = ADMIN_PWA_MANIFEST_HREF;
    return;
  }

  const adminManifest = document.querySelector<HTMLLinkElement>(
    `link[rel="manifest"][href="${ADMIN_PWA_MANIFEST_HREF}"]`
  );
  if (adminManifest) {
    adminManifest.id = ADMIN_PWA_HEAD_IDS.manifest;
    return;
  }

  const manifestLink = document.createElement('link');
  manifestLink.id = ADMIN_PWA_HEAD_IDS.manifest;
  manifestLink.rel = 'manifest';
  manifestLink.href = ADMIN_PWA_MANIFEST_HREF;
  document.head.appendChild(manifestLink);
}

/** Ejecuta en el navegador: deja solo el manifiesto y metadatos del panel admin. */
export function applyAdminPwaHeadIsolation(): void {
  if (typeof document === 'undefined' || !document.head) return;

  ensureManifestLink();
  ensureMeta('apple-mobile-web-app-title', ADMIN_PWA_HEAD_IDS.appleTitle, ADMIN_PWA_TITLE);
  ensureMeta('application-name', ADMIN_PWA_HEAD_IDS.applicationName, ADMIN_PWA_TITLE);
  ensureAppleTouchIcon();
}

/** Script inline (beforeInteractive) para ejecutar antes de que Safari lea el manifiesto global. */
export const ADMIN_PWA_ISOLATION_SCRIPT = `(function(){
  var MANIFEST='${ADMIN_PWA_MANIFEST_HREF}';
  var TITLE='${ADMIN_PWA_TITLE}';
  var ICON='${ADMIN_PWA_ICON}';
  var IDS={manifest:'${ADMIN_PWA_HEAD_IDS.manifest}',appleTitle:'${ADMIN_PWA_HEAD_IDS.appleTitle}',applicationName:'${ADMIN_PWA_HEAD_IDS.applicationName}',appleTouchIcon:'${ADMIN_PWA_HEAD_IDS.appleTouchIcon}'};
  var GLOBAL=['/manifest.webmanifest','/manifest.json'];
  function isGlobal(h){if(!h)return false;for(var i=0;i<GLOBAL.length;i++){if(h===GLOBAL[i]||h.slice(-GLOBAL[i].length)===GLOBAL[i])return true;}return false;}
  function safeRemove(n){if(n&&n.parentNode)n.parentNode.removeChild(n);}
  function ensureMeta(name,id,content){
    var tagged=document.getElementById(id);
    if(tagged){tagged.content=content;return;}
    var matches=document.querySelectorAll('meta[name="'+name+'"]');
    for(var i=0;i<matches.length;i++){
      if(i===0){matches[i].id=id;matches[i].content=content;}
      else safeRemove(matches[i]);
    }
    if(!document.getElementById(id)){
      var meta=document.createElement('meta');meta.id=id;meta.name=name;meta.content=content;document.head.appendChild(meta);
    }
  }
  function ensureIcon(){
    var tagged=document.getElementById(IDS.appleTouchIcon);
    if(tagged){tagged.href=ICON;return;}
    var matches=document.querySelectorAll('link[rel="apple-touch-icon"]');
    for(var i=0;i<matches.length;i++){
      if(i===0){matches[i].id=IDS.appleTouchIcon;matches[i].href=ICON;}
      else safeRemove(matches[i]);
    }
    if(!document.getElementById(IDS.appleTouchIcon)){
      var icon=document.createElement('link');icon.id=IDS.appleTouchIcon;icon.rel='apple-touch-icon';icon.href=ICON;document.head.appendChild(icon);
    }
  }
  function ensureManifest(){
    document.querySelectorAll('link[rel="manifest"]').forEach(function(n){
      if(isGlobal(n.getAttribute('href')))safeRemove(n);
    });
    var tagged=document.getElementById(IDS.manifest);
    if(tagged){tagged.href=MANIFEST;return;}
    var admin=document.querySelector('link[rel="manifest"][href="'+MANIFEST+'"]');
    if(admin){admin.id=IDS.manifest;return;}
    var link=document.createElement('link');link.id=IDS.manifest;link.rel='manifest';link.href=MANIFEST;document.head.appendChild(link);
  }
  function ensure(){
    if(!document.head)return;
    ensureManifest();
    ensureMeta('apple-mobile-web-app-title',IDS.appleTitle,TITLE);
    ensureMeta('application-name',IDS.applicationName,TITLE);
    ensureIcon();
  }
  ensure();
})();`;
