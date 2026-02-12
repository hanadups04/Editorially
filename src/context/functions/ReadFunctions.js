import { supabase } from "../../supabaseClient";

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

      if(error) return error;

  return data;
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("uid, role_id, status, roles_tbl ( access_level )")
    .eq("uid", uid)
    .maybeSingle(); // avoids 406

      if(error) return error;

  return data; // null if none
}

export async function getPostedArticles() {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select("*")
    .order("date_posted", { ascending: false });

      if(error) return error;

  return data;
}

export async function getSingleArticle(article_id) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select("*, users_tbl (username, roles_tbl (role_name)), sections_tbl (section_name) ")
    .eq("article_id", article_id)
    .maybeSingle();

      if(error) return error;

  return data;
}

export async function getRequestsList(article_id) {
  const {data, error} = await supabase
    .from("edit_request_tbl")
    .select("*, users_tbl (username)")
    .eq("article_id", article_id)

    if(error) return error;
    return data;

}

//--------------------------------------------------------------------- <=3 TITI NI DON ANDREI TANEO -------------------------------------------------------- //
