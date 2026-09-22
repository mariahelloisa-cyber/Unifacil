"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { CourseNivel } from "@/lib/data/courses";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";

// O painel /admin tem seu próprio chrome (sidebar) — sem header/footer/
// anúncio do site institucional.
export default function SiteChrome({
  children,
  courseNiveis,
}: {
  children: ReactNode;
  courseNiveis: CourseNivel[];
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
      return <>{children}</>;
  }

  return (
    <>
      {/* data-site-chrome: animações com pin medem a altura daqui. */}
      <div className="sticky top-0 z-50" data-site-chrome>
        <AnnouncementBar />
        <Header courseNiveis={courseNiveis} />
      </div>
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
