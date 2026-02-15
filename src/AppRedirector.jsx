// AppRedirector.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import * as ReadFunctions from "./context/functions/ReadFunctions";
import * as auth from "./context/auth";

const AppRedirector = () => {
  const navigate = useNavigate();

  const fetchUserAccessLvl = async () => {
    const user = await auth.isAuthenticated();

    if (user.code === 0) {
      console.log("no account found, going tto landing page instead");
      navigate("/aboutus");
      return;
    }

    const { data, error } = await supabase
      .from("users_tbl")
      .select("uid, role_id, status, roles_tbl ( access_level )")
      .eq("uid", user.data.id)
      .maybeSingle();

    if (data) {
      if (data.status === "inactive") {
        // ask user if they want to recover their account
        alert("your account has been disabled. ask your admin for assistance");
        navigate("/aboutus");
        return;
      }

      if (
        data.roles_tbl.access_level >= 1 &&
        data.roles_tbl.access_level <= 5
      ) {
        navigate("/dashboard");
      }

      //navigate to reader here
    } else {
      console.error("User row not found");
      navigate(`/aboutus`);
    }
  };

  useEffect(() => {
    fetchUserAccessLvl();
  }, []);

  return null;
};

export default AppRedirector;
