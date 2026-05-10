import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeHeadScripts } from "@/lib/sanitizeHeadScripts";

const MARKER_ATTR = "data-injected-head-scripts";

/**
 * Fetches the CUSTOM_HEAD_SCRIPTS app setting (publicly readable for analytics)
 * and injects sanitized tags into <head>. Re-runs on mount only.
 */
const HeadScripts = () => {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "CUSTOM_HEAD_SCRIPTS")
        .maybeSingle();

      if (cancelled || error || !data) return;
      const raw: string = (data.value as any)?.value ?? "";
      const { html } = sanitizeHeadScripts(raw);
      if (!html) return;

      // Clear previous injections
      document
        .head
        .querySelectorAll(`[${MARKER_ATTR}]`)
        .forEach((n) => n.remove());

      const tpl = document.createElement("template");
      tpl.innerHTML = html;
      Array.from(tpl.content.children).forEach((child) => {
        const el = child as HTMLElement;
        el.setAttribute(MARKER_ATTR, "true");
        // Recreate <script> so the browser actually executes it
        if (el.tagName.toLowerCase() === "script") {
          const s = document.createElement("script");
          Array.from(el.attributes).forEach((a) => s.setAttribute(a.name, a.value));
          s.text = el.textContent || "";
          document.head.appendChild(s);
        } else {
          document.head.appendChild(el);
        }
      });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
};

export default HeadScripts;
