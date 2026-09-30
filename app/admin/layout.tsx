import type { Metadata } from "next";

import { DemoBanner } from "@/components/demo-banner";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Kamshin Admin" },
  robots: { index: false, follow: false },
};

// DESIGN PREVIEW: open at /admin on the same site. Phase 3 serves the admin only on
// ADMIN_HOST (admin.yourdomain.com) and Phase 2/7 add requireAdmin() checks everywhere.
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <DemoBanner />
      {children}
    </>
  );
}
