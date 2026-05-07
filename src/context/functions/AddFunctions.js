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

export async function createArticle(data) {
  const { error } = await supabase.from("articles_tbl").insert({
    headline: data.headline,
    content: data.content,
    images: data.images,
    is_featured: false,
    author_id2: data.author_id2,
    author_id1: data.author_id1,
    section_id: data.section_id,
  });

  if (error) {
    console.log("error moy ay: ", error);
  }
}
