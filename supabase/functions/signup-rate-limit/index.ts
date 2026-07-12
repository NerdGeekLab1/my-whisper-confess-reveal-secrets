// Signup rate-limiting edge function.
// Deployed with verify_jwt = false so unauthenticated visitors can call it before signing up.
// Limits: max 5 signup attempts per IP per hour, max 3 per email per hour.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const MAX_PER_IP_PER_HOUR = 5;
const MAX_PER_EMAIL_PER_HOUR = 3;
const WINDOW_MS = 60 * 60 * 1000;

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip") ?? req.headers.get("x-real-ip") ?? "0.0.0.0";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 255;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const record = body?.record === true; // set true AFTER a signup call to record the attempt outcome
    const success = body?.success === true;

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ allowed: false, error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const ip = getClientIp(req);
    const [ipHash, emailHash] = await Promise.all([sha256Hex(ip), sha256Hex(email)]);
    const since = new Date(Date.now() - WINDOW_MS).toISOString();

    // Opportunistic cleanup (best-effort).
    admin.rpc("cleanup_old_signup_attempts").then(() => {}, () => {});

    if (record) {
      await admin.from("signup_attempts").insert({
        ip_hash: ipHash,
        email_hash: emailHash,
        success,
      });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [{ count: ipCount }, { count: emailCount }] = await Promise.all([
      admin
        .from("signup_attempts")
        .select("*", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("attempted_at", since),
      admin
        .from("signup_attempts")
        .select("*", { count: "exact", head: true })
        .eq("email_hash", emailHash)
        .gte("attempted_at", since),
    ]);

    if ((ipCount ?? 0) >= MAX_PER_IP_PER_HOUR) {
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "ip_rate_limit",
          message: "Too many signup attempts from your network. Please try again in an hour.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if ((emailCount ?? 0) >= MAX_PER_EMAIL_PER_HOUR) {
      return new Response(
        JSON.stringify({
          allowed: false,
          reason: "email_rate_limit",
          message: "Too many signup attempts for this email. Please try again in an hour.",
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ allowed: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("signup-rate-limit error", err);
    // Fail-open on unexpected errors so we don't block real users, but log it.
    return new Response(JSON.stringify({ allowed: true, warning: "rate_limit_check_failed" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
