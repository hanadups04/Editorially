import { supabase } from "../../supabaseClient";

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("*")

  if (error) throw error;
  return data;
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("uid, username, email, role_id, section_id, status, roles_tbl ( access_level )")
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

export async function fetchSingleProject(project_id) {
  const { data, error} = await supabase
    .from("projects_tbl")
    .select("*")
    .eq("project_id", project_id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSingleUser(uid){
  const { data, error} = await supabase
    .from("users_tbl")
    .select("*")
    .eq("uid", uid)
    

  if (error) throw error;
  return data;
}

export async function fetchAllTasks(project_id) {
  const { data, error} = await supabase
    .from("project_subtask_tbl")
    .select("*, users_tbl(username, roles_tbl(role_name))")
    .eq("project_id", project_id)

  if (error) throw error;
  return data;
}



//--------------------------------------------------------------------- <=3 TITI NI DON ANDREI TANEO -------------------------------------------------------- //
