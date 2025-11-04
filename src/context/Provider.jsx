import React, { useEffect, useState } from "react";
import { Context } from "./Context";
import { supabase } from "../supabaseClient";

const Provider = ({ children }) => {
  return <Context.Provider value={{}}>{children}</Context.Provider>;
};

export { Provider };
