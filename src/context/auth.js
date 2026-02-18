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
  if (userError)
    return {
      code: 0,
      error: userError,
    };
  return {
    code: 1,
    data: user,
  };
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
  return data;
}

export async function changePass(newPassword) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error(error.message);
    return 0;
  } else {
    console.log("Password updated successfully");
    return 1;
  }
}

export async function createUser(formdata) {
  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Must be logged in");
  }

  // Call your Edge Function with Authorization header
  const response = await fetch(
    "https://pdusaixsvxbquoqkkprr.supabase.co/functions/v1/create-user",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        email: formdata.email,
        password: formdata.password,
        username: formdata.username,
        section_id: formdata.section_id,
        role_id: formdata.role_id,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    return null;
  }

  return data.user;
}
