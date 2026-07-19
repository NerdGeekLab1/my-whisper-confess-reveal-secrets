// Seed demo users (user@demo.com / admin@demo.com) and sample data
// Pass { reset: true } to wipe existing demo posts/diary first.
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
  {
    title: "Micro-cheating on Instagram DMs",
    content: "It wasn't 'physical' but the flirty DMs, the late-night 'you up?' pattern, the hiding of the screen — that was betrayal all the same. Naming it helped me leave.",
    category: "online",
  },
  {
    title: "Rebound became my healing",
    content: "Not romantic — a rebound into myself. Painting, boxing, therapy, journaling. Six months later I don't recognize the broken person from January.",
    category: "healing",
  },
  {
    title: "Family took her side",
    content: "His mother literally told me 'boys will be boys' when I showed her the proof. I lost a marriage AND an in-law family in one week. Chosen family is real family.",
    category: "family",
  },
  {
    title: "Two years of gaslighting exposed in one voicemail",
    content: "He butt-dialed me while bragging to his friend. Everything I doubted about myself — every 'you're crazy' — was recorded in 4 minutes.",
    category: "long-term",
  },
];

const SAMPLE_DIARY = [
  { title: "Day 1 — Free", content: "Today I packed my things and left. My hands wouldn't stop shaking but my mind has never been clearer.", mood: "anxious" },
  { title: "Small wins", content: "Made coffee without crying. Ate breakfast. Went for a walk. These tiny things feel like mountains.", mood: "neutral" },
  { title: "Therapy helped", content: "First session today. She said grief over betrayal is real grief. I felt validated for the first time in months.", mood: "hopeful" },
  { title: "Anger week", content: "Anger showed up this week. Punched a pillow. Screamed in the car. Better out than eating me alive.", mood: "angry" },
  { title: "First laugh", content: "Genuine belly laugh at a friend's dumb joke. Felt guilty for 2 seconds then decided joy is allowed.", mood: "hopeful" },
];

const SAMPLE_LOYALTY = [
  { partner_name: "Alex R.", overall_score: 34, trust_score: 30, communication_score: 40, commitment_score: 32, red_flags: ["Hides phone", "Vague about weekends", "Flirty DMs"], green_flags: ["Public about relationship"], recommendation: "High-risk pattern — consider a direct conversation with boundaries.", analysis: "Multiple secrecy signals, weak transparency." },
  { partner_name: "Jordan M.", overall_score: 78, trust_score: 82, communication_score: 75, commitment_score: 77, red_flags: ["Occasional jealousy"], green_flags: ["Transparent finances", "Meets your friends", "Consistent effort"], recommendation: "Strong foundation with minor friction — invest in communication rituals.", analysis: "Overall healthy dynamic with room to strengthen conflict resolution." },
  { partner_name: "Sam T.", overall_score: 55, trust_score: 50, communication_score: 60, commitment_score: 55, red_flags: ["Emotional distance", "Avoids future planning"], green_flags: ["Never lies overtly"], recommendation: "Mixed signals — clarify what commitment means to both of you.", analysis: "Not deceitful, but avoidant patterns dominate." },
];

const SAMPLE_SOUL_POSTS = [
  { title: "Numb after 3 years", content: "I feel like I've forgotten how to want things. Anyone else ever hit that wall where nothing excites you anymore?", mood: "numb", author_gender: "male", target_gender: "female" },
  { title: "Late-night thoughts", content: "It's 2am and my brain won't shut up. Would love to hear from someone who gets it.", mood: "anxious", author_gender: "female", target_gender: "male" },
  { title: "Trying to trust again", content: "Started dating someone new. He's kind. Why does kindness scare me so much?", mood: "hopeful", author_gender: "female", target_gender: "male" },
  { title: "Missing someone I shouldn't", content: "Blocked them 8 months ago. Still catch myself scrolling their name. What's wrong with me?", mood: "conflicted", author_gender: "male", target_gender: "female" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    let body: { reset?: boolean } = {};
    try { body = await req.json(); } catch { /* no body */ }
    const reset = body.reset === true;

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

    const accounts = [
      { email: "user@demo.com", password: "demo123", username: "demo_user", role: "user" as const },
      { email: "admin@demo.com", password: "admin123", username: "admin_user", role: "admin" as const },
    ];

    const created: Record<string, string> = {};

    for (const acc of accounts) {
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
        const { data: list } = await admin.auth.admin.listUsers();
        const existing = list?.users.find((u: any) => u.email === acc.email);
        if (existing) {
          userId = existing.id;
          // Reset the password so demo login is reliable even if it drifted
          await admin.auth.admin.updateUserById(existing.id, {
            password: acc.password,
            email_confirm: true,
          });
        }
      }

      if (!userId) continue;
      created[acc.email] = userId;

      await admin.from("profiles").upsert({
        id: userId,
        email: acc.email,
        username: acc.username,
        is_verified: true,
        joined_date: new Date().toISOString(),
      }, { onConflict: "id" });

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

    // Reset wipes only demo-user-owned records (preserves real user content)
    if (reset && demoUserId) {
      await admin.from("posts").delete().eq("user_id", demoUserId);
      await admin.from("diary_entries").delete().eq("user_id", demoUserId);
      await admin.from("loyalty_scores").delete().eq("user_id", demoUserId);
      await admin.from("soul_posts").delete().eq("author_id", demoUserId);
    }

    // Seed posts
    const { count: existingPosts } = await admin.from("posts").select("id", { count: "exact", head: true });
    let postsSeeded = false;
    if (demoUserId && (reset || (existingPosts ?? 0) < 5)) {
      const rows = SAMPLE_POSTS.map((p) => ({
        ...p,
        user_id: demoUserId,
        is_anonymous: true,
        status: "approved",
      }));
      await admin.from("posts").insert(rows);
      postsSeeded = true;
    }

    // Seed diary
    let diarySeeded = false;
    if (demoUserId) {
      const { count: existingDiary } = await admin
        .from("diary_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", demoUserId);
      if (reset || (existingDiary ?? 0) === 0) {
        await admin.from("diary_entries").insert(
          SAMPLE_DIARY.map((d) => ({ ...d, user_id: demoUserId, is_private: true }))
        );
        diarySeeded = true;
      }
    }

    // Seed loyalty scores (partner checks)
    let loyaltySeeded = false;
    if (demoUserId) {
      const { count } = await admin
        .from("loyalty_scores")
        .select("id", { count: "exact", head: true })
        .eq("user_id", demoUserId);
      if (reset || (count ?? 0) === 0) {
        await admin.from("loyalty_scores").insert(
          SAMPLE_LOYALTY.map((l) => ({ ...l, user_id: demoUserId }))
        );
        loyaltySeeded = true;
      }
    }

    // Seed soul_posts
    let soulSeeded = false;
    if (demoUserId) {
      const { count } = await admin
        .from("soul_posts")
        .select("id", { count: "exact", head: true })
        .eq("author_id", demoUserId);
      if (reset || (count ?? 0) === 0) {
        await admin.from("soul_posts").insert(
          SAMPLE_SOUL_POSTS.map((s) => ({ ...s, author_id: demoUserId, status: "open" }))
        );
        soulSeeded = true;
      }
    }

    return new Response(
      JSON.stringify({ success: true, reset, created, postsSeeded, diarySeeded, loyaltySeeded, soulSeeded }),
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
