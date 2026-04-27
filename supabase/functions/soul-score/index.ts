import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { thread } = await req.json();
    if (!Array.isArray(thread) || thread.length === 0) {
      return new Response(JSON.stringify({ score: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const transcript = thread
      .slice(-20)
      .map((m: any, i: number) => `${i % 2 === 0 ? "A" : "B"}: ${String(m?.content || "").slice(0, 500)}`)
      .join("\n");

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You score emotional resonance of an anonymous 1:1 thread. Output ONLY a JSON object: {\"score\": number 0-100, \"vibe\": short string}. Higher = more empathy, vulnerability, mutual care. No preamble.",
          },
          { role: "user", content: `Thread:\n${transcript}` },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.error("score error", resp.status, t);
      return new Response(JSON.stringify({ score: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(raw); } catch { parsed = {}; }
    const score = Math.max(0, Math.min(100, Math.round(Number(parsed.score) || 0)));
    return new Response(JSON.stringify({ score, vibe: parsed.vibe || "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ score: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
