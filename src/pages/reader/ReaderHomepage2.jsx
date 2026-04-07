import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./ReaderHomepage.css";
import Layout from "../../components/templates/ReaderPageTemplate.jsx";
import Card from "./FeaturedCardTemplate.jsx";
// import TrendingNewsTemp from "./TrendingNewsTemp.jsx";
// import Pic from "../../assets/images/SamplePicNu.jpg";
import Carousel from "react-bootstrap/Carousel";
// import RecentArticlesSection from "./RecentArticlesSection.jsx";
// import { useProjectContext } from "../context/Context.jsx";
// import { onMessage } from "firebase/messaging";
// import { messaging } from "../../firebaseConfig.js";
// import AddFunctions from "../../context/functions/AddFunctions.js";
// import ReactLoading from "react-loading";
// import NUbranch from "../LoginSignUp/NUbranch.jsx";
// import { useBranch } from "../../context/BranchContext.jsx";
// import { useAdminContext } from "../../context/AdminContext.jsx";
// import NotifIcon from "../../assets/images/notifications.png";
// import Change from "../../assets/images/Change.png";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";
// import Popover from "react-bootstrap/Popover";
// import NotifItemTemp from "./NotifItemTemp.jsx";
import Tooltip from "react-bootstrap/Tooltip";
import EditoriallyWhite from "../../assets/images/EditoriallyWhite.png";
import * as ReadFunctions from "../../context/functions/ReadFunctions.js";
import ReactLoading from "react-loading";

export default function ReaderHomepage() {
  //   const handleCardClick = (id, topicId) => {
  //     navigate(`/${currentSlug}/ViewArticle?article=${id}&topic=${topicId}`);
  //     writeInUserActivityLog(` viewed article ${id},`, id, "Informative");
  //     console.log("post id is: ", id, "topic id is:", topicId);
  //   };

  // useEffect(() => {
  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     console.log("Foreground message received:", payload);

  //     const { title, body } = payload.notification;
  //     alert(`${title}: ${body}`);
  //   });

  //   return () => unsubscribe(); // clean up listener on unmount
  // }, []);
  const getTooltipText = (type) => {
    switch (type) {
      case 1:
        return "Change Branch";
      default:
        return "";
    }
  };

  const renderTooltip = (type) => (props) => (
    <Tooltip id={`button-tooltip-${type}`} {...props}>
      {getTooltipText(type)}
    </Tooltip>
  );

  //   const currentBranchName = useMemo(() => {
  //     if (!allBranches || allBranches.length === 0) return "Loading...";

  //     const currentBranch = allBranches.find((branch) => branch.id === branchId);
  //     console.log("branch id in memo is,", branchId);
  //     return currentBranch ? currentBranch.branchName : "Unknown Branch";
  //   }, [allBranches, branchId]);

  // const trendingArticlesText = useMemo(() => {
  //   if (!trendReady || !trendingArticles || trendingArticles.length === 0) {
  //     return "LOADING TRENDING ARTICLES...";
  //   }

  //   return trendingArticles.map((article) => article.title).join(" ▫️ ");
  // }, [trendingArticles, trendReady]);
  const [loading, setIsLoading] = useState(true);
  const [contents, setContents] = useState([]);
  //   const [contentsReady, setContentsReady] = useState(true);
  useEffect(() => {
    let isMounted = true;

    async function fetchArticles() {
      try {
        const data = await ReadFunctions.getPostedArticles();
        if (isMounted) {
          console.log("data is: ", data);
          setContents(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchArticles();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="content-detail">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="ReaderHomepage-Parent">
        <div className="ReaderHomepage-Annoucement">
          <div className="ScrollingTextCont">
            <div className="ticker-wrap" style={{ display: "flex" }}>
              <p className="ScrollingText">
                NOW VIEWING: <span className="BranchName">The Nuntium</span> |
                TRENDING NOW:
                <span className="BranchName">
                  {/* {trendReady && trendingArticles && trendingArticles.length > 0
                    ? trendingArticles
                        .map((article) => article.title)
                        .join(" ▫️ ")
                    : ""} */}
                </span>
              </p>
              <p className="ScrollingText" aria-hidden="true">
                NOW VIEWING: <span className="BranchName">The Nuntium</span> |
                TRENDING NOW:
                <span className="BranchName">
                  {/* {trendReady && trendingArticles && trendingArticles.length > 0
                    ? trendingArticles
                        .map((article) => article.title)
                        .join(" ▫️ ")
                    : ""} */}
                </span>
              </p>
              <p className="ScrollingText">
                NOW VIEWING: <span className="BranchName">The Nuntium</span> |
                TRENDING NOW:
                <span className="BranchName">
                  {/* {trendReady && trendingArticles && trendingArticles.length > 0
                    ? trendingArticles
                        .map((article) => article.title)
                        .join(" ▫️ ")
                    : ""} */}
                </span>
              </p>
            </div>
            {/* <NUbranch selectedBranch={branchId} onChange={setBranchId} /> */}
            {/* <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--text-color)",
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color)",
              }}
            >
              {theme === "dark" ? "Switch to Light 🌞" : "Switch to Dark 🌙"}
            </button> */}
          </div>
        </div>
        {!contents || Object.keys(contents).length === 0 ? (
          <div className="EmptySection">
            <img src={EditoriallyWhite} className="Logo" />
            <div className="EmptySection-Headline">
              {" "}
              <p className="Title"> No articles yet!</p>
              <p className="Descrip">
                Our writers are working on it. Stay tuned!
              </p>
            </div>
          </div>
        ) : (
          <div className="ReaderHomepage-BodyCont">
            <div className="ReaderHomepage-Content">
              <div className="ReaderHomepage-Featured">
                {/* {loading ? ( */}
                <Carousel
                  className="CustomCarousel"
                  data-bs-theme="dark"
                  controls={false}
                  indicators={false}
                >
                  {contents.map((featuredArticle) => (
                    <Carousel.Item
                      key={featuredArticle.article_id}
                      interval={2000}
                    >
                      <Card
                        image={featuredArticle.images}
                        section={featuredArticle.sections_tbl.section_name}
                        title={featuredArticle.headline}
                        date={featuredArticle.date_posted}
                        onClick={() =>
                          handleCardClick(featuredArticle.article_id)
                        }
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                {/* ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <ReactLoading
                      type="spinningBubbles"
                      color="#133e87"
                      height={100}
                      width={100}
                    />
                  </div>
                )} */}
              </div>
              <div className="ReaderHomepage-Trending">
                {/* <TrendingNewsTemp
                  Width="100%"
                  maxHeight={"clamp(300px, 80vh, 550px)"}
                /> */}
              </div>
              {/* <div className="ReaderHomepage-LatestInSec">
                {homeSecReady ? (
                  <>
                    <p className="Recenttitle">More Recent Articles</p>
                    <hr className="RH-hr" />

                    {branchSections &&
                      branchSections.sections &&
                      Object.entries(branchSections.sections)
                        .filter(([key, value]) => value.submissionType !== 3) 
                        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB)) 
                        .map(([key, value]) => {
                          const articles = homeSectionsArticles[key] || [];
                          if (articles.length === 0) return null;
                          return (
                            <>
                              <RecentArticlesSection
                                Width="100%"
                                articles={articles}
                                sectionName={key}
                              />

                              <hr className="RH-hr" />
                            </>
                          );
                        })}
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <ReactLoading
                      type="spinningBubbles"
                      color="#133e87"
                      height={100}
                      width={100}
                    />
                  </div>
                )}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
