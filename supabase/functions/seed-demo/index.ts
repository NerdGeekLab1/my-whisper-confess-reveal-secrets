// Seed demo users (user@demo.com / admin@demo.com) and sample data
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SAMPLE_POSTS = [
  {
    title: "He cheated after 7 years together",
    content: "We were planning our wedding when I found the messages. Years of trust gone in one night. I'm sharing this because I know I'm not alone — and reading other stories here gave me strength to leave.",
    category: "long-term",
  },
  {
    title: "My best friend slept with my husband",
    content: "Two people I trusted most in this world. They both knew what they were doing. I'm rebuilding from zero but every day is a step forward. To anyone going through this — you will survive.",
    category: "marriage",
  },
  {
    title: "Discovered a second family",
    content: "Twelve years of marriage, and he had another woman with two kids in the next city. The lies, the financial deception — everything makes sense now. Lawyer is hired. I'm reclaiming my life.",
    category: "marriage",
  },
  {
    title: "Caught him on a dating app",
    content: "We had agreed we were exclusive. A friend showed me his profile, active two hours ago. He denied it until I showed him the screenshots. Done with the gaslighting.",
    category: "dating",
  },
  {
    title: "She left right before our engagement",
    content: "I had the ring. I had the venue. She had been seeing someone from work for 4 months. The hardest part is the public humiliation. But better now than after vows.",
    category: "engagement",
  },
  {
    title: "Office affair revealed at the Christmas party",
    content: "Everyone knew except me. The look of pity from coworkers told me before he did. Working through this with therapy. Workplace cheating hits different.",
    category: "workplace",
  },
  {
    title: "Online emotional affair for 3 years",
    content: "He never met her in person but they exchanged thousands of messages. Some were more intimate than what we shared. Emotional cheating IS cheating.",
    category: "online",
  },
  {
    title: "Found a hidden phone in his car",
    content: "Second SIM card. Locked. He claimed it was for work. The truth came out three weeks later. Trust your gut — it's almost always right.",
    category: "marriage",
  },
];

const SAMPLE_DIARY = [
  { title: "Day 1 — Free", content: "Today I packed my things and left. My hands wouldn't stop shaking but my mind has never been clearer.", mood: "anxious" },
  { title: "Small wins", content: "Made coffee without crying. Ate breakfast. Went for a walk. These tiny things feel like mountains.", mood: "neutral" },
  { title: "Therapy helped", content: "First session today. She said grief over betrayal is real grief. I felt validated for the first time in months.", mood: "hopeful" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    const accounts = [
      { email: "user@demo.com", password: "demo123", username: "demo_user", role: "user" as const },
      { email: "admin@demo.com", password: "admin123", username: "admin_user", role: "admin" as const },
    ];

    const created: Record<string, string> = {};

    for (const acc of accounts) {
      // Try to create user — if exists, fetch
      let userId: string | null = null;
      const { data: createData, error: createErr } = await admin.auth.admin.createUser({
        email: acc.email,
        password: acc.password,
        email_confirm: true,
        user_metadata: { username: acc.username },
      });

      if (createErr && !createErr.message.toLowerCase().includes("already")) {
        console.error("create error", acc.email, createErr.message);
      }
      if (createData?.user) {
        userId = createData.user.id;
      } else {
        // Look up existing user
        const { data: list } = await admin.auth.admin.listUsers();
        const existing = list?.users.find((u: any) => u.email === acc.email);
        if (existing) userId = existing.id;
      }

      if (!userId) continue;
      created[acc.email] = userId;

      // Ensure profile exists
      await admin.from("profiles").upsert({
        id: userId,
        email: acc.email,
        username: acc.username,
        is_verified: true,
        joined_date: new Date().toISOString(),
      }, { onConflict: "id" });

      // Ensure role
      if (acc.role === "admin") {
        await admin.from("user_roles").upsert(
          { user_id: userId, role: "admin" },
          { onConflict: "user_id,role" }
        );
      }
      await admin.from("user_roles").upsert(
        { user_id: userId, role: "user" },
        { onConflict: "user_id,role" }
      );
    }

    const demoUserId = created["user@demo.com"];

    // Seed posts (only if posts table is empty-ish)
    const { count: existingPosts } = await admin.from("posts").select("id", { count: "exact", head: true });
    if (demoUserId && (existingPosts ?? 0) < 3) {
      const rows = SAMPLE_POSTS.map((p) => ({
        ...p,
        user_id: demoUserId,
        is_anonymous: true,
        status: "approved",
      }));
      await admin.from("posts").insert(rows);
    }

    // Seed diary
    if (demoUserId) {
      const { count: existingDiary } = await admin
        .from("diary_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", demoUserId);
      if ((existingDiary ?? 0) === 0) {
        await admin.from("diary_entries").insert(
          SAMPLE_DIARY.map((d) => ({ ...d, user_id: demoUserId, is_private: true }))
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, created, postsSeeded: (existingPosts ?? 0) < 3 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("seed-demo error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
