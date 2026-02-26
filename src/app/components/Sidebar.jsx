import React, { Suspense } from "react";
import SidebarClient from "./SidebarClient";

export default function Sidebar() {
  // header height = 64px -> top-[64px], height = calc(100vh-64px)
  return (
    <aside className="w-64 border-r border-border py-6 px-4 flex flex-col justify-between overflow-auto no-scrollbar
                       sticky top-[64px] z-10 h-[calc(100vh-64px)]">
      <div>
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading menu…</div>}>
          <SidebarClient />
        </Suspense>
      </div>

      <div className="p-4 text-sm text-muted-foreground">
        {/* footer links or account info */}
      </div>
    </aside>
  );
}