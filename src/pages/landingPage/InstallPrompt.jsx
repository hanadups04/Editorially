import { useState, useEffect } from "react";
import { Button } from "../../components/landing/Button";
import { Smartphone, X } from "lucide-react";
import "./InstallPrompt.css";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt">
      <button onClick={() => setShowPrompt(false)} className="close-button">
        <X />
      </button>

      <div className="prompt-content">
        <div className="icon-wrapper">
          <Smartphone />
        </div>
        <div className="prompt-text">
          <h3 className="prompt-title">Install Our App</h3>
          <p className="prompt-description">
            Install this app on your device for quick access and offline
            support.
          </p>
          <Button onClick={handleInstall} className="w-full">
            Install Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
