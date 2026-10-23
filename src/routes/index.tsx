import { createFileRoute } from "@tanstack/react-router";
import { Suspense, useEffect, useState } from "react";
import { GradingProvider } from "@/chokur/context/GradingContext";
import { LandingPageView } from "@/chokur/views/LandingPageView";

const TITLE = "Chokur System — Marks to insight in one pass. Offline.";
const DESC =
  "Kenyan secondary school (KCSE) 12-point grading ledger, rapid spreadsheet marks entry, class rankings, subject analysis, and official printable report cards.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESC },
    ],
  }),
  component: Index,
});

function Fallback() {
  return <div className="min-h-screen bg-[#FEF9EF]" />;
}

function Index() {
  const [showLanding, setShowLanding] = useState(true);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    const hasUsedApp = localStorage.getItem("chokur.has_used_app");
    if (hasUsedApp) setShowLanding(false);
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
    }
  }, []);
  return (
    <Suspense fallback={<Fallback />}>
      <GradingProvider>{showLanding ? <LandingPageView /> : null}</GradingProvider>
    </Suspense>
  );
}
