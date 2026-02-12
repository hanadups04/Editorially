import { supabase } from "../../supabaseClient";

export async function markRequestAsResolved(edit_id, is_resolved) {
  const { data, error } = await supabase
    .from("edit_request_tbl")
    .update({ resolved: is_resolved })
    .eq("edit_id", edit_id)
    .select()
    .single();

      if(error) return error;

  return data;
}

export async function featureArticle(article_id, featured) {
  const {data, error} = await supabase
  .from("articles_tbl")
  .update({is_featured: featured})
  .eq("article_id", article_id)
  .select()
  .single();

    if(error) return error;
    
  return data;
}

export async function updateArticle(article_id, payload) {
  const {data, error} = await supabase
  .from("articles_tbl")
  .update({
    headline: payload.headline,
    content: payload.content,
    images: payload.images,
  })
  .eq("article_id", article_id)
  .select()
  .single();

    if(error) return error;
    
  return data;
}