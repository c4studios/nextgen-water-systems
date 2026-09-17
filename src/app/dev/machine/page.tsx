import dynamic from "next/dynamic";

/**
 * The model viewer. A development aid for checking the machine against the
 * supplier's photographs; in production it renders nothing of note and is
 * kept out of the sitemap and the nav.
 */
const MachineDev = dynamic(() => import("@/components/machine/MachineDev").then((m) => m.MachineDev), { ssr: false });

export const metadata = { title: "Model viewer", robots: { index: false, follow: false } };

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    return <main id="main" style={{ padding: 40, fontFamily: "sans-serif" }}>Not available.</main>;
  }
  return <MachineDev />;
}
