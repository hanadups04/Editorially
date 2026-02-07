import React, { useEffect } from "react";
import "./ReaderTemplate.css";
import { Outlet, useParams } from "react-router-dom";
import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
// import { useBranch } from "../context/BranchContext.jsx";

export default function ReaderTemplate() {
  // Your logic here
  //   const { branchSlug } = useParams();
  //   const { setBranchFromSlug } = useBranch();

  //   useEffect(() => {
  //     if (branchSlug) setBranchFromSlug(branchSlug);
  //   }, [branchSlug, setBranchFromSlug]);

  return (
    <>
      <div className="ReaderPageTemplate-Parent">
        <div className="ReaderPageTemplate-Navbar">
          <Navbar />
        </div>
        <div className="ReaderPageTemplate-Body">
          <Outlet />
        </div>
        <div className="ReaderPageTemplate-Footer">
          <Footer />
        </div>
      </div>
    </>
  );
}
