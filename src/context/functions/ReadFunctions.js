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
    .select("uid, role_id, tenant_id, status, roles_tbl ( access_level )")
    .eq("uid", uid)
    .maybeSingle(); // avoids 406

  if (error) throw error;
  return data; // null if none
}

  export async function fetchAllSections() {
  const { data, error} = await supabase
    .from("sections_tbl")
    .select("*")

  if (error) throw error;
  return data;
}

export async function fetchAllProjects() {
  const { data, error} = await supabase
    .from("projects_tbl")
    .select("*")

  if (error) throw error;
  return data;
}

export async function fetchSingleProjects(project_id) {
  const { data, error} = await supabase
    .from("projects_tbl")
    .select("*")
    .eq("project_id", project_id)
    

  if (error) throw error;
  return data;
}


//--------------------------------------------------------------------- <=3 TITI NI DON ANDREI TANEO -------------------------------------------------------- //
