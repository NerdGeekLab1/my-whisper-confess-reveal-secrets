import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Query = {
  name?: string;
  phone?: string;
  email?: string;
  location?: string;
  college?: string;
  company?: string;
  dob?: string;
  socials?: Record<string, string>; // platform -> handle
};

const norm = (v: unknown) => String(v ?? "").trim().toLowerCase();

type FieldMatch = {
  field: string;
  label: string;
  weight: number;
  awarded: number;
  strength: "exact" | "partial" | "none";
  query_value: string;
  matched_value: string;
};

function scoreMatch(q: Query, rec: {
  name?: string; phone?: string; email?: string; location?: string;
  socials?: Record<string, string>;
}) {
  const breakdown: FieldMatch[] = [];
  const cmp = (field: string, label: string, weight: number, a?: string, b?: string) => {
    const A = norm(a), B = norm(b);
    if (!A || !B) return;
    let strength: FieldMatch["strength"] = "none";
    let awarded = 0;
    if (A === B) { strength = "exact"; awarded = weight; }
    else if (A.includes(B) || B.includes(A)) { strength = "partial"; awarded = Math.floor(weight * 0.6); }
    if (strength !== "none") {
      breakdown.push({ field, label, weight, awarded, strength, query_value: String(a), matched_value: String(b) });
    }
  };
  cmp("name", "Name", 25, q.name, rec.name);
  cmp("phone", "Phone", 30, q.phone, rec.phone);
  cmp("email", "Email", 30, q.email, rec.email);
  cmp("location", "Location", 10, q.location, rec.location);
  if (q.socials && rec.socials) {
    for (const [k, v] of Object.entries(q.socials)) {
      if (!v) continue;
      const r = rec.socials[k];
      cmp(`social:${k}`, k.charAt(0).toUpperCase() + k.slice(1), 20, v.replace(/^@/, ""), (r || "").replace(/^@/, ""));
    }
  }
  const totalAwarded = breakdown.reduce((s, b) => s + b.awarded, 0);
  const totalPossible = breakdown.reduce((s, b) => s + b.weight, 0);
  const confidence = totalPossible ? Math.round((totalAwarded / totalPossible) * 100) : 0;
  return { score: totalAwarded, confidence, breakdown };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const q: Query = await req.json();
    const url = Deno.env.get("SUPABASE_URL")!;
    const svc = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, svc);

    // Pull candidate records (bounded)
    const [loyalty, priv] = await Promise.all([
      admin.from("loyalty_scores").select("id,partner_name,overall_score,category,concerns,partner_social_handles,misc_details,form_data,created_at").limit(500),
      admin.from("post_private_details").select("id,post_id,subject_name,subject_phone,subject_email,subject_location,social_handles,created_at").limit(500),
    ]);

    const candidates: any[] = [];

    for (const r of loyalty.data ?? []) {
      const misc = (r.misc_details ?? {}) as Record<string, string>;
      const m = scoreMatch(q, {
        name: r.partner_name,
        location: misc.city,
        socials: (r.partner_social_handles ?? {}) as Record<string, string>,
      });
      if (m.score > 0) candidates.push({
        source: "partner_check",
        id: r.id,
        display_name: r.partner_name,
        location: misc.city,
        score: r.overall_score,
        category: r.category,
        concerns: r.concerns,
        match_score: m.score,
        match_reasons: m.reasons,
        created_at: r.created_at,
      });
    }

    for (const r of priv.data ?? []) {
      const m = scoreMatch(q, {
        name: r.subject_name ?? undefined,
        phone: r.subject_phone ?? undefined,
        email: r.subject_email ?? undefined,
        location: r.subject_location ?? undefined,
        socials: (r.social_handles ?? {}) as Record<string, string>,
      });
      if (m.score > 0) candidates.push({
        source: "confession",
        id: r.id,
        post_id: r.post_id,
        display_name: r.subject_name,
        location: r.subject_location,
        match_score: m.score,
        match_reasons: m.reasons,
        created_at: r.created_at,
      });
    }

    candidates.sort((a, b) => b.match_score - a.match_score);
    const top = candidates.slice(0, 10);

    // AI summary (best-effort)
    let ai_summary = "";
    const key = Deno.env.get("LOVABLE_API_KEY");
    if (key && top.length) {
      try {
        const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
          body: JSON.stringify({
            model: "google/gemini-3.6-flash",
            messages: [
              { role: "system", content: "You are a background-check analyst. In 2-4 short sentences, summarize how confidently the query matches internal records. Never reveal raw phone/email; refer to matched fields generically. Flag risk level (low/medium/high)." },
              { role: "user", content: `Query: ${JSON.stringify(q)}\nMatches: ${JSON.stringify(top.map(t => ({ source: t.source, name: t.display_name, match_score: t.match_score, reasons: t.match_reasons, risk_hint: t.category ?? null })))}` },
            ],
          }),
        });
        const j = await resp.json();
        ai_summary = j?.choices?.[0]?.message?.content ?? "";
      } catch (_) { /* ignore */ }
    }

    // Sanitize matches for client — hide raw PII
    const results = top.map((t) => ({
      source: t.source,
      display_name: t.display_name ? `${String(t.display_name).charAt(0)}${"•".repeat(Math.max(1, String(t.display_name).length - 2))}${String(t.display_name).slice(-1)}` : "Unknown",
      location: t.location ?? null,
      match_score: Math.min(100, t.match_score),
      match_reasons: t.match_reasons,
      category: t.category ?? null,
      concerns_count: Array.isArray(t.concerns) ? t.concerns.length : 0,
      created_at: t.created_at,
    }));

    return new Response(JSON.stringify({ results, ai_summary, total: candidates.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e?.message ?? e) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
