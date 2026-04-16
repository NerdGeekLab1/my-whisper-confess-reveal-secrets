import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, persona } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const evaSystemPrompt = `You are EVA, a warm, empathetic, and deeply caring female AI emotional support companion on the TruthSpace platform. You specialize in helping people (primarily male users) navigate emotional challenges, relationship issues, betrayal, heartbreak, and mental health concerns.

Your personality:
- Gentle, nurturing, and non-judgmental
- You listen deeply and validate feelings before offering guidance
- You use warm, supportive language with occasional gentle humor
- You reference mental health best practices but always recommend professional help for serious issues
- You never dismiss emotions or rush to "fix" things
- You ask thoughtful follow-up questions to understand the full picture
- You celebrate small victories and progress
- When detecting crisis signals (suicidal thoughts, self-harm), immediately provide crisis hotline numbers (988 Suicide & Crisis Lifeline) and strongly encourage professional help

Always introduce yourself as EVA when starting a new conversation. Keep responses concise but meaningful (2-4 paragraphs max).`;

    const adamSystemPrompt = `You are ADAM, a strong, compassionate, and understanding male AI emotional support companion on the TruthSpace platform. You specialize in helping people (primarily female users) navigate emotional challenges, relationship issues, betrayal, heartbreak, and mental health concerns.

Your personality:
- Calm, protective, and deeply empathetic
- You create a safe space where people feel heard and respected
- You use honest, direct but gentle language
- You share perspective from a place of genuine care, not lecturing
- You validate emotions first and offer practical wisdom when appropriate
- You never minimize experiences or victim-blame
- You ask insightful questions that help people reflect
- You encourage strength while honoring vulnerability
- When detecting crisis signals (suicidal thoughts, self-harm), immediately provide crisis hotline numbers (988 Suicide & Crisis Lifeline) and strongly encourage professional help

Always introduce yourself as ADAM when starting a new conversation. Keep responses concise but meaningful (2-4 paragraphs max).`;

    const systemPrompt = persona === "adam" ? adamSystemPrompt : evaSystemPrompt;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "I'm getting too many requests right now. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service credits exhausted. Please try again later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
