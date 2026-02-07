// AppRedirector.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import * as ReadFunctions from "./context/functions/ReadFunctions";
import * as auth from "./context/auth";
import { useBranch } from "./context/BranchProvider";

const AppRedirector = () => {
  const navigate = useNavigate();
  const { setBranchId } = useBranch();

  const fetchUserAccessLvl = async () => {
    const user = await auth.isAuthenticated();

    if (user.code === 0) {
      console.log("no account found, going tto landing page instead");
      navigate("/AboutUs");
      return;
    }

    const { data, error } = await supabase
      .from("users_tbl")
      .select("uid, role_id, tenant_id, status, roles_tbl ( access_level )")
      .eq("uid", user.id)
      .maybeSingle();

    if (data) {
      setBranchId(data.tenant_id);

      if (data.status === "deleted") {
        // ask user if they want to recover their account
        alert(
          "your account has been deleted. proceed to login to continue recovering your account"
        );
        navigate("/AboutUs");
        return;
      }

      if (data.status === "disabled") {
        // ask user if they want to recover their account
        alert("your account has been disabled. ask your admin for assistance");
        navigate("/AboutUs");
        return;
      }

      const slug = await ReadFunctions.getSlugByBranchId(data.tenant_id);
      switch (data.roles_tbl.access_level) {
        case 6:
          navigate("/Adviser/AdminDashboard");
          console.log("navigating to adviser");
          break;
        case 5:
          navigate("/Admin/AdminDashboard");
          console.log("navigating to eic");
          break;
        case 4:
          navigate("/Admin/AdminDashboard");
          console.log("navigating to assoc or managing");
          break;
        case 3:
          navigate("/Admin/EbHomepage");
          console.log("navigating to section editor");
          break;
        case 2:
          navigate("/Admin/SwHomepage");
          console.log("navigating to section writer");
          break;
        case 1:
          navigate(`/${slug}`);
          console.log("navigating to reader");
          break;
      }
    } else {
      console.error("User row not found");
      navigate(`/AboutUs`);
    }
  };

  useEffect(() => {
    fetchUserAccessLvl();
  }, []);

  return null;
};

export default AppRedirector;
