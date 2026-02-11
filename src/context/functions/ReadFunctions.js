import { supabase } from "../../supabaseClient";

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("uid, role_id, status, roles_tbl ( access_level )")
    .eq("uid", uid)
    .maybeSingle(); // avoids 406

  if (error) throw error;
  return data; // null if none
}

export async function getPostedArticles() {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select("*")
    .order("date_posted", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSingleArticle(article_id) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select("*")
    .eq("article_id", article_id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

//--------------------------------------------------------------------- <=3 TITI NI DON ANDREI TANEO -------------------------------------------------------- //
