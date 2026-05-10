// Strict sanitizer for admin-supplied <head> snippets (GA, FB Pixel, etc.)
// Allowlist approach: only specific tags + attributes pass through.
// Returns { html, warnings, removed } so the admin UI can show what was stripped.

const ALLOWED_TAGS = new Set(["script", "noscript", "meta", "link", "style"]);

const ALLOWED_ATTRS: Record<string, Set<string>> = {
  script: new Set(["src", "async", "defer", "type", "crossorigin", "integrity", "nonce", "id", "data-*"]),
  noscript: new Set(["id"]),
  meta: new Set(["name", "content", "property", "http-equiv", "charset"]),
  link: new Set(["rel", "href", "as", "type", "crossorigin", "integrity", "media", "sizes"]),
  style: new Set(["type", "media", "nonce"]),
};

// Block obviously dangerous URL schemes
const BAD_URL = /^\s*(javascript:|data:text\/html|vbscript:)/i;

// Block attempts to break out of <head> or load entire pages
const BAD_INLINE = /<\s*(iframe|object|embed|form|input|svg|math)\b/i;

export interface SanitizeResult {
  html: string;
  warnings: string[];
  removedTags: string[];
}

const isAttrAllowed = (tag: string, attr: string): boolean => {
  const set = ALLOWED_ATTRS[tag];
  if (!set) return false;
  if (set.has(attr)) return true;
  // data-* allowance
  if (set.has("data-*") && attr.startsWith("data-")) return true;
  return false;
};

export function sanitizeHeadScripts(input: string): SanitizeResult {
  const warnings: string[] = [];
  const removedTags: string[] = [];

  if (!input || !input.trim()) {
    return { html: "", warnings, removedTags };
  }

  if (BAD_INLINE.test(input)) {
    warnings.push("Removed disallowed embed-like tag (iframe/object/embed/form/svg).");
  }

  // Parse inside a template element so <script> isn't executed.
  const doc = new DOMParser().parseFromString(
    `<!doctype html><html><head>${input}</head><body></body></html>`,
    "text/html"
  );
  const head = doc.head;
  const out: string[] = [];

  Array.from(head.children).forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      removedTags.push(tag);
      return;
    }

    // Strip event handlers + disallowed attributes
    Array.from(el.attributes).forEach((a) => {
      const name = a.name.toLowerCase();
      if (name.startsWith("on")) {
        warnings.push(`Stripped inline event handler "${name}" on <${tag}>.`);
        el.removeAttribute(a.name);
        return;
      }
      if (!isAttrAllowed(tag, name)) {
        warnings.push(`Stripped disallowed attribute "${name}" on <${tag}>.`);
        el.removeAttribute(a.name);
        return;
      }
      if ((name === "src" || name === "href") && BAD_URL.test(a.value)) {
        warnings.push(`Blocked unsafe URL on <${tag} ${name}>.`);
        el.removeAttribute(a.name);
      }
    });

    // For inline <script>, block javascript: protocol smuggling already covered;
    // we keep textContent as-is since admins explicitly opted in.
    out.push(el.outerHTML);
  });

  return { html: out.join("\n"), warnings, removedTags };
}
