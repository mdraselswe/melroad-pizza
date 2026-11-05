import { STORAGE_KEYS } from "@/constants/storage";

/**
 * Applies the saved theme before first paint so there is no light/dark flash.
 * The server HTML already carries the tenant's default; this only overrides it
 * with the visitor's own choice.
 * Runs synchronously while the HTML is parsed (see Next docs:
 * "preventing flash before hydration"); <html> has suppressHydrationWarning.
 */
export function ThemeScript() {
  const code = `try{var m=localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)});var r=document.documentElement;if(m==="light"||m==="dark")r.dataset.theme=m;else if(m==="system")r.removeAttribute("data-theme")}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
