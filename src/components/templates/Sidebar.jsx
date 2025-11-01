import React, { useState, useEffect } from "react";
import { Button, Layout, theme } from "antd";
import "./Sidebar.css";
// import Logo from "./Logo.js";
import Menulist from "./Menulist.jsx";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

const { Header, Sider } = Layout;
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("UserPreference");
    return stored ? JSON.parse(stored).collapsed : false;
  });

  const [activeAccordionKey, setActiveAccordionKey] = useState(() => {
    const stored = localStorage.getItem("UserPreference");
    if (!stored) return null;

    const parsed = JSON.parse(stored).activeAccordionKey;

    if (parsed === "0") return "ProjectsNCms";
    if (parsed === "1") return "MembersNApplicants";
    return parsed ?? null;
  });

  useEffect(() => {
    const userPreference = {
      collapsed,
      activeAccordionKey,
    };
    localStorage.setItem("UserPreference", JSON.stringify(userPreference));
  }, [collapsed, activeAccordionKey]);

  return (
    <>
      <Layout className="Sidebar-Parent">
        <Sider
          collapsed={collapsed}
          collapsible
          theme={"dark"}
          trigger={null}
          className="Sidebar-Child"
        >
          {/* <Logo /> */}
          <div className="MenuBarCont">
            {" "}
            <Menulist
              collapsed={collapsed}
              activeAccordionKey={activeAccordionKey}
              setActiveAccordionKey={setActiveAccordionKey}
            />
          </div>
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!collapsed)}
            icon={
              collapsed ? (
                <CaretRightOutlined
                  style={{ color: "white", fontSize: "20px" }}
                />
              ) : (
                <CaretLeftOutlined
                  style={{ color: "white", fontSize: "20px" }}
                />
              )
            }
          />
        </Sider>
      </Layout>
    </>
  );
}
