import { supabase } from "../../supabaseClient";

const DeleteFunctions = () => {

  return {

  };
};

export default DeleteFunctions;


// import { supabase } from "../../supabaseClient";

// export async function fetchAllUsers() {
//   const { data, error } = await supabase
//     .from("projects")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) throw error;
//   return data;
// }