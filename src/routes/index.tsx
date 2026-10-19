import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect } from "react";

// The original app reads localStorage/IndexedDB on startup, so it renders in the browser only.
const ChokurApp = lazy(() => import("@/chokur/App"));

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
  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch((err) => {
        console.warn("[SW] Registration failed:", err);
      });
    }
  }, []);
  return (
    <ClientOnly fallback={<Fallback />}>
      <Suspense fallback={<Fallback />}>
        <ChokurApp />
      </Suspense>
    </ClientOnly>
  );
}
