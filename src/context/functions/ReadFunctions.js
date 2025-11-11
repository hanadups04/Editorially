import { supabase } from "../../supabaseClient";

export async function fetchAllUsers() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSlugByBranchId(tenant_id) {
  const { data, error } = await supabase
    .from("tenants_tbl")
    .select("publication_name")
    .eq("tenant_id", tenant_id)
    .single();

  if (error)
    return {
      code: 0,
      error: error,
    };
  return {
    code: 1,
    data: data,
  };
}

export async function getBranchBySlug(branch_name) {
  const { data, error } = await supabase
    .from("tenants_tbl")
    .select("*")
    .eq("publication_name", branch_name)
    .single();

  if (error)
    return {
      code: 0,
      error: error,
    };
  return {
    code: 1,
    data: data,
  };
}

//--------------------------------------------------------------------- <=3 TITI NI DON ANDREI TANEO -------------------------------------------------------- //
