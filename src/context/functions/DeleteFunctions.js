import { supabase } from "../../supabaseClient";

export async function deleteArticle(article_id) {
  const { error } = await supabase
    .from("articles_tbl")
    .delete()
    .eq("article_id", article_id);

  if (error) {
    console.error("Delete Failed: ", error);
    return error;
  }
  return true;
}

export async function archiveArticle(article_id, archiveStatus) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .update({
      visible: archiveStatus,
    })
    .eq("article_id", article_id)
    .select()
    .single();

  if (error) {
    console.error("Update failed:", error.message);
    throw error;
  }

  return data;
}

export async function deleteProject(project_id) {
  const {error} = await supabase
    .from("projects_tbl")
    .delete()
    .eq("project_id", project_id);

  if (error) {
    console.error("Delete Project Failed", error);
    return error;
  }
  return true;
}

export async function deleteTask(subtask_id) {
  const {error} = await supabase
    .from("projects_subtask_tbl")
    .delete()
    .eq("subtask_id", subtask_id);

  if (error) {
    console.error("Delete Task Failed", error);
    return error;
  }
  return true;
}
