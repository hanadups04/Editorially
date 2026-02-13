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

export async function uploadThumbnail(file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `article-thumbnails/${fileName}`;

  const { data, error } = await supabase.storage
    .from("Editorially-media-storage")
    .upload(filePath, file);

  if (error) {
    console.error("Upload failed:", error);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("Editorially-media-storage")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
