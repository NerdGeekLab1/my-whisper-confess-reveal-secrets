import { supabase } from "@/integrations/supabase/client";

export interface AdminAuditInput {
  actionType: string;
  targetTable: string;
  summary: string;
  targetId?: string | null;
  metadata?: Record<string, unknown>;
}

export const logAdminAction = async ({
  actionType,
  targetTable,
  summary,
  targetId = null,
  metadata = {},
}: AdminAuditInput) => {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return;
  }

  const { error } = await (supabase as any)
    .from("admin_audit_logs")
    .insert({
      actor_user_id: data.user.id,
      action_type: actionType,
      target_table: targetTable,
      target_id: targetId,
      summary,
      metadata,
    });

  if (error) {
    console.warn("Failed to write admin audit log", error);
  }
};