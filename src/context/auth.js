import { supabase } from "../supabaseClient";

// sign up & also checks if email is already registered
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username,
      },
    },
  });
  if (error)
    return {
      code: 0,
      error,
    };
  return {
    code: 1,
    data,
  };
}

// login
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("error is: ", error);

    return {
      code: 0,
      error: error,
    };
  }
  console.log("data is: ", data);

  return {
    code: 1,
    data: data,
  };
}

export async function isAuthenticated() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  return user;
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
