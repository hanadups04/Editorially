import { supabase } from "../../supabaseClient";

export async function approveProject(project_id) {
  const { error } = await supabase
    .from("projects_tbl")
    .update({step_id: 3, status: "Approved - Pending Assignment"})
    .eq("project_id", project_id);

  if (error) {
    console.error("Update Failed", error);
    return error;
  }
  return true;
}

export async function rejectProject(project_id) {
  const { error } = await supabase
    .from("projects_tbl")
    .update({status: "Rejected"})
    .eq("project_id", project_id);

  if (error) {
    console.error("Update Failed", error);
    return error;
  }
  return true;
}


