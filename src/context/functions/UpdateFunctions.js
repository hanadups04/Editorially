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
  console.log("assyy", subtask_id, formData);
  const { data, error} = await supabase
    .from("project_subtask_tbl")
    .update({
      subtask_type: formData.subtask_type, 
      section_id: formData.section_id,
      assignee_id: formData.assignee_id, 
      subtask_title: formData.subtask_title, 
      subtask_details: formData.subtask_details, 
      subtask_deadline: formData.subtask_deadline, 
      })
    .eq("subtask_id", subtask_id)
    

  if (error) throw error;
  return data;
}


export async function markRequestAsResolved(edit_id, is_resolved) {
  const { data, error } = await supabase
    .from("edit_request_tbl")
    .update({ resolved: is_resolved })
    .eq("edit_id", edit_id)
    .select()
    .single();

  if (error) return error;

  return data;
}

export async function featureArticle(article_id, featured) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .update({ is_featured: featured })
    .eq("article_id", article_id)
    .select()
    .single();

  if (error) return error;

  return data;
}

export async function updateArticle(article_id, payload) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .update({
      headline: payload.headline,
      content: payload.content,
      images: payload.images,
    })
    .eq("article_id", article_id)
    .select()
    .single();

  if (error) return error;

  return data;
}

export async function toggleNotification(uid, notif) {
  const { data, error } = await supabase
    .from("users_tbl")
    .update({
      is_notif: notif,
    })
    .eq("uid", uid)
    .select()
    .single();

  if (error) return error;

  return data;
}

export async function updateUser(uid, formdata) {
  const { data, error } = await supabase
    .from("users_tbl")
    .update({ formdata })
    .eq("uid", uid)
    .select()
    .single();

  if (error) return error;

  return data;
}
