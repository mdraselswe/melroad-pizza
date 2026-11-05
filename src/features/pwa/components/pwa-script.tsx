import { PROMPT_READY_EVENT } from "../use-install";

/**
 * Catches Chromium's install prompt as early as possible (it can fire before
 * hydration) so our own install card can offer it, and installs the offline
 * service worker after the page has loaded.
 */
export function PwaScript({ serviceWorker }: { serviceWorker: boolean }) {
  const ready = JSON.stringify(PROMPT_READY_EVENT);
  const code =
    `window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__installPrompt=e;window.dispatchEvent(new Event(${ready}))});` +
    `window.addEventListener("appinstalled",function(){window.__installPrompt=null});` +
    (serviceWorker
      ? `if("serviceWorker"in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("/sw.js",{scope:"/",updateViaCache:"none"}).catch(function(){})});`
      : "");
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
