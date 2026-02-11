import { supabase } from "../../supabaseClient";

export async function insertEditRequest(data) {
  await supabase.from("edit_request_tbl").insert({
    article_id: data.article_id,
    owner_id: data.owner_id,
    resolved: false,
    content: data.content,
    is_urgent: data.is_urgent,
  });
}
