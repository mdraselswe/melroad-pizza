import { STORAGE_KEYS } from "@/constants/storage";

/**
 * Applies the saved theme before first paint so there is no light/dark flash.
 * Runs synchronously while the HTML is parsed (see Next docs:
 * "preventing flash before hydration"); <html> has suppressHydrationWarning.
 */
export function ThemeScript() {
  const code = `try{var m=localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)});if(m==="light"||m==="dark")document.documentElement.dataset.theme=m}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
