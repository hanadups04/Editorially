import ErrorList from "antd/es/form/ErrorList";
import { supabase } from "../../supabaseClient";
import ColumnGroup from "antd/es/table/ColumnGroup";

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("*, roles_tbl( role_name ), sections_tbl( section_name )")
    .order("created_at", { ascending: false });

  if (error) return error;

  return data;
}

export async function fetchStatus() {
  const { data, error } = await supabase
    .from("project_steps_tbl")
    .select("*")
    .not("step_id", "in", "(0,4)");

  if (error) return error;

  return data;
}

export async function fetchSectionMembers(section_id) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("*, roles_tbl( role_name ), sections_tbl( section_name )")
    .order("created_at", { ascending: false })
    .eq("section_id", section_id);

  if (error) return error;

  return data;
}

export async function getUserProfile(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select(
      "*, roles_tbl ( role_id, role_name, access_level ), sections_tbl ( section_id, section_name )",
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
  const { data, error } = await supabase
    .from("projects_tbl")
    .select("*, project_steps_tbl ( step_name ), sections_tbl ( section_name )")
    .not("step_id", "in", "(4,0)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchSingleProject(project_id) {
  const { data, error } = await supabase
    .from("projects_tbl")
    .select("*, project_steps_tbl ( step_name ), sections_tbl ( section_name )")
    .eq("project_id", project_id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSingleUser(uid) {
  const { data, error } = await supabase
    .from("users_tbl")
    .select("*, roles_tbl ( access_level )")
    .eq("uid", uid)
    .maybeSingle();

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

export async function getAssignee(subtask_id) {
  const { data, error } = await supabase
    .from("project_subtask_tbl")
    .select("users_tbl (uid)")
    .eq("subtask_id", subtask_id)
    .maybeSingle();

  if (error) return error;

  return data;
}

export async function getSingleArticle(article_id) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select(
      "*, sections_tbl (section_name), author1:users_tbl!author_id1(username), author2:users_tbl!author_id2(username)",
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

export async function getProjectsLength() {
  const { count, error } = await supabase
    .from("projects_tbl")
    .select("*", { count: "exact", head: true })
    .in("step_id", ["2", "3"]);

  if (error) throw error;
  return count;
}

export async function getForProposal() {
  const { count, error } = await supabase
    .from("projects_tbl")
    .select("*", { count: "exact", head: true })
    .eq("step_id", 1);

  if (error) throw error;
  return count;
}

export async function getPosted() {
  const { count, error } = await supabase
    .from("articles_tbl")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  return count;
}

export async function getOverdue() {
  const { count, error } = await supabase
    .from("projects_tbl")
    .select("*", { count: "exact", head: true })
    .lt("deadline", new Date().toISOString())
    .not("step_id", "in", "(0,4)");

  if (error) throw error;
  return count;
}

export async function projectsByMonth() {
  const year = new Date().getFullYear();

  const { data, error } = await supabase.rpc("projects_by_month", {
    selected_year: year,
  });

  if (error) throw error;
  console.log(data, "month projects");
  return data;
}

export async function getProjectByStep() {
  const year = new Date().getFullYear();

  const { data, error } = await supabase.rpc("projects_by_step", {
    current_year: year,
  });

  if (error) {
    console.error(error);
    return;
  }

  return data;

  // console.log(data);
}

export async function avengersAssemble(ironman_id) {
  const { data, error } = await supabase
    .from("contents_tbl")
    .select("*, project_subtask_tbl ( users_tbl ( username, uid ) )")
    .eq("project_id", ironman_id);

  console.log("avengers: ", data);

  if (error) {
    throw error;
  }

  return data;
}

export async function getFeaturedArticles() {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select(
      "*, sections_tbl(section_name), author1:users_tbl!author_id1(username), author2:users_tbl!author_id2(username)",
    )
    .lt("date_posted", new Date().toISOString())
    .order("date_posted", { ascending: false })
    .eq("is_featured", true)
    .limit(5);

  if (error) return error;
  return data;
}

export async function getRecentArticles() {
  const { data, error } = await supabase.rpc("recent_articles_per_section");

  if (error) return error;
  console.log(data);
  return data;
}

export async function getAllArticles() {
  const { data, error } = await supabase.rpc("all_articles");

  if (error) return error;
  console.log(data);
  return data;
}

export async function fetchSingleArticle(articleId) {
  const { data, error } = await supabase
    .from("articles_tbl")
    .select(
      `*, sections_tbl(section_name),
      author1:users_tbl!author_id1(username),
      author2:users_tbl!author_id2(username)`,
    )
    .eq("article_id", articleId)
    .maybeSingle();

  if (error) return error;
  return data;
}

export async function getSectionArticles(sectionName) {
  const { data, error } = await supabase.rpc("articles_per_section", {
    section_name_param: sectionName,
  });

  if (error) return error;
  console.log(data);
  return data;
}

export async function readWork(taskId) {
  const { data, error } = await supabase
    .from("contents_tbl")
    .select(`content, category, content_id`)
    .eq("subtask_id", taskId);

  if (error) return error;
  return data;
}

export async function readImages(taskId) {
  const { data, error } = await supabase
    .from("contents_tbl")
    .select(`content, category, content_id`)
    .eq("subtask_id", taskId);

  if (error) return error;
  return data;
}
