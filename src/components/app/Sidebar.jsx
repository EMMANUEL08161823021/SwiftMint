import React, { Suspense } from 'react';
import SidebarClient from './SidebarClient';
import Link from 'next/link';
import { BrandIcon } from './BrandIcon';
import { SidebarFooter } from './SidebarFooter';

export default function Sidebar() {
  return (
    <aside className="border-r border-border h-full w-[12rem] flex flex-col justify-between overflow-auto no-scrollbar">
      <div>
        <Link
          href={'/dashboard'}
          className={'flex items-center gap-2 border-b-2 mx-4 py-4'}
        >
          <BrandIcon className={'w-10'} />
          <span className={'font-bold'}>Control Panel</span>
        </Link>
        <Suspense
          fallback={
            <div className="p-4 text-sm text-muted-foreground">
              Loading menu…
            </div>
          }
        >
          <SidebarClient />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="p-4 text-sm text-muted-foreground">Loading menu…</div>
        }
      >
        <SidebarFooter />
      </Suspense>
    </aside>
  );
}
