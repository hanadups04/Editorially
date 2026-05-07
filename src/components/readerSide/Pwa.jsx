import React, { useEffect, useState } from "react";
import NuntiumLogo from "../../assets/images/NuntiumLogo.png";

export default function Pwa() {
  const [InstallPrompt, setInstallPrompt] = useState(null);
  const [Installable, setInstallable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [PromtInstruction, setPromptInstruction] = useState("");
  const [ShowBtns, setShowBtns] = useState(true);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
    const isOperaGX = ua.includes("OPR");
    const isFirefox = ua.toLowerCase().includes("firefox");
    const isChrome = ua.toLowerCase().includes("chrome");

    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isInStandaloneMode) {
      // already running as installed app
      setInstallable(false);
      return;
    }

    if (isSafari) {
      setPromptInstructions(
        "Tap the Share icon → ‘Add to Home Screen’ to install this app.",
      );
    } else if (isFirefox) {
      setPromptInstruction(
        "Use the browser menu → ‘Install’ or ‘Add to Home Screen’.",
      );
    } else if (isChrome) {
      setPromptInstruction(
        "Use our app so you don't have to miss the latest news",
      );
    }

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt) setInstallable(true);
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, [InstallPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    InstallPrompt.prompt();
    const { outcome } = await InstallPrompt.userChoice;
    // Hide banner after user decides
    setInstallPrompt(null);
    setInstallable(false);
    setDismissed(true);
    // console.log(`User's response: ${outcome}`);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!Installable || Dismissed) return null;

  return (
    <>
      <div className="Pwa-Parent" role="region">
        <div className="Pwa-Child">
          <div className="Pwa-Cont">
            <img src={NuntiumLogo} className="Pwa-Logo" />
            <div className="Pwa-ContText">
              <p>Install it in your app</p>
              <p>{PromtInstruction}</p>
            </div>
          </div>
          {showButtons && (
            <div className="Pwa-BtnCont">
              <button
                className="PwaBtn Pwa-InstallBtn"
                onClick={() => handleInstallClick()}
              >
                Install
              </button>
              <button className="PwaBtn Pwa-DismissBtn" onClick={handleDismiss}>
                Not Now
              </button>
            </div>
          )}
        </div>
        <button
          className="PWA-Close"
          aria-label="Close install banner"
          onClick={handleDismiss}
        >
          ×
        </button>
      </div>
    </>
  );
}
