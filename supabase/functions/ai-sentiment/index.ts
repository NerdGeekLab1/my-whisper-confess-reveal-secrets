import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const tools = type === "moderate" ? [
      {
        type: "function",
        function: {
          name: "moderation_result",
          description: "Return content moderation analysis",
          parameters: {
            type: "object",
            properties: {
              isApproved: { type: "boolean", description: "Whether content is safe to publish" },
              flaggedContent: { type: "array", items: { type: "string" }, description: "List of flagged phrases" },
              moderationScore: { type: "number", description: "0-1 score, higher = more concerning" },
              suggestedAction: { type: "string", enum: ["approve", "review", "reject"] }
            },
            required: ["isApproved", "flaggedContent", "moderationScore", "suggestedAction"],
            additionalProperties: false
          }
        }
      }
    ] : [
      {
        type: "function",
        function: {
          name: "sentiment_result",
          description: "Return sentiment analysis of the text",
          parameters: {
            type: "object",
            properties: {
              sentiment: { type: "string", enum: ["positive", "negative", "neutral"] },
              confidence: { type: "number", description: "0-1 confidence score" },
              crisisRisk: { type: "string", enum: ["low", "medium", "high"] },
              flaggedTerms: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } }
            },
            required: ["sentiment", "confidence", "crisisRisk", "flaggedTerms", "recommendations"],
            additionalProperties: false
          }
        }
      }
    ];

    const systemPrompt = type === "moderate"
      ? "You are a content moderation AI. Analyze the text for harmful content, hate speech, threats, self-harm references, and inappropriate material. Be thorough but not overly restrictive - allow honest emotional expression while flagging genuinely harmful content."
      : "You are a mental health sentiment analysis AI. Analyze the emotional content of the text. Detect crisis signals (suicidal ideation, self-harm, extreme distress). Provide appropriate mental health resource recommendations. Be sensitive and accurate.";

    const toolChoice = type === "moderate"
      ? { type: "function", function: { name: "moderation_result" } }
      : { type: "function", function: { name: "sentiment_result" } };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this text:\n\n${text}` },
        ],
        tools,
        tool_choice: toolChoice,
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI analysis temporarily unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const result = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("sentiment error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
