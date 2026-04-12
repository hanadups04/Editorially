import React, { useEffect } from "react";
import "./ReaderPageTemplate.css";
import { Outlet, useParams } from "react-router-dom";
// import Footer from "./Footer.jsx";
// import Navbar from "./NavBar";
// import PwaInstall from "./pwa.jsx";
// import { useBranch } from "../context/BranchContext.jsx";

const Layout = ({ children }) => {
  //   const { branchSlug } = useParams();
  //   const { setBranchFromSlug } = useBranch();

  //   useEffect(() => {
  //     if (branchSlug) setBranchFromSlug(branchSlug);
  //   }, [branchSlug, setBranchFromSlug]);

  return (
    <div className="ReaderPageTemplate-Parent">
      <div className="ReaderPageTemplate-Navbar">{/* <Navbar /> */}</div>
      <div className="ReaderPageTemplate-Body">
        <main className="content">{children}</main>
      </div>
      <div className="ReaderPageTemplate-Footer">{/* <Footer /> */}</div>
    </div>
  );
};

export default Layout;
