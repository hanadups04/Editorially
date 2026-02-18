import { supabase } from "../../supabaseClient";

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("*, roles_tbl( role_name ), sections_tbl( section_name )")
    .order("created_at", { ascending: false });

  if (error) return error;

  return data;
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select(
      "*, roles_tbl ( role_name, access_level ), sections_tbl ( section_name )",
    )
    .eq("uid", uid)
    .maybeSingle(); // avoids 406

  if (error) return error;

  return data; // null if none
}

export async function fetchAllSections() {
  const { data, error } = await supabase.from("sections_tbl").select("*");

  if (error) throw error;
  return data;
}

export async function fetchAllRoles() {
  const { data, error } = await supabase.from("roles_tbl").select("*");

  if (error) throw error;
  return data;
}

export async function fetchAllProjects() {
  const { data, error } = await supabase.from("projects_tbl").select("*");

  if (error) throw error;
  return data;
}

export async function fetchSingleProject(project_id) {
  const { data, error } = await supabase
    .from("projects_tbl")
    .select("*")
    .eq("project_id", project_id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSingleUser(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("*")
    .eq("uid", uid);

  if (error) throw error;
  return data;
}

export async function getPostedArticles() {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select("*, sections_tbl(section_name)")
    .order("date_posted", { ascending: false });

  if (error) return error;

  return data;
}

export async function getSingleArticle(article_id) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select(
      "*, users_tbl (username, roles_tbl (role_name)), sections_tbl (section_name) ",
    )
    .eq("article_id", article_id)
    .maybeSingle();

  if (error) return error;

  return data;
}

export async function getRequestsList(article_id) {
  const { data, error } = await supabase
    .from("edit_request_tbl")
    .select("*, users_tbl (username)")
    .eq("article_id", article_id);

  if (error) return error;
  return data;
}

export async function fetchAllTasks(project_id) {
  const { data, error } = await supabase
    .from("project_subtask_tbl")
    .select("*, users_tbl(username, roles_tbl(role_name))")
    .eq("project_id", project_id);

  if (error) throw error;
  return data;
}

//--------------------------------------------------------------------- <=3 TITI NI DON ANDREI TANEO -------------------------------------------------------- //
