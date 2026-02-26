'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { NavItem } from './nav/NavItem';
import { navConfig } from './nav/navConfig';


export default function SidebarClient() {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="flex flex-col gap-3 p-4 w-full">
      {navConfig.map((item) => (
        <NavItem
          key={item.href}
          href={item.href}
          text={item.text}
          icon={item.icon}
          active={isActive(item.href)}
        />
      ))}
    </nav>
  );
}
