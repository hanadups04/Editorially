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

export async function updateProject(project_id, formData){
  const { data, error} = await supabase
    .from("projects_tbl")
    .update({title: formData.title, deadline: formData.deadline, details: formData.details})
    .eq("project_id", project_id)
    

  if (error) throw error;
  return data;
}

export async function updateTask(subtask_id, formData){
  const { data, error} = await supabase
    .from("subtasks_tbl")
    .update({subtask_title: formData.subtask_title, subtask_deadline: formData.subtask_deadline, 
      subtask_details: formData.subtask_details, assignee_id: formData.assignee_id, subtask_type: formData.subtask_title})
    .eq("subtask_id", subtask_id)
    

  if (error) throw error;
  return data;
}




