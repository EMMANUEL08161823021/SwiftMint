'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser } from '@/store/user/selectors';
import { toggleLoggedOutModal } from '@/store/user/slice';
import LogOutDialog from '@/app/(auth)/logout/dialog/LogOutDialog';
import { NavItem } from './nav/NavItem';
import { usePathname } from 'next/navigation';
import { LogOutIcon } from 'lucide-react';
import { footerConfig } from './nav/navConfig';
import UserPopup from './UserPopup';


export function SidebarFooter() {
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const initials = `${user?.firstName?.[0] || ''}${
    user?.lastName?.[0] || ''
  }`.toUpperCase();

  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-3 border-t-2 pt-4">
        {footerConfig.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            text={item.text}
            active={isActive(item.href)}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 items-center justify-between">
        <UserPopup user={user} initials={initials} onLogout={() => dispatch(toggleLoggedOutModal(true))} />

        {/* <div className="w-full">
          <div
            type="button"
            onClick={() => dispatch(toggleLoggedOutModal(true))}
            className="text-red-500 text-xs hover:text-red-700 cursor-pointer w-fit flex gap-3 items-center"
          >
            <LogOutIcon className="w-[16px] min-w-[12px]" /> Logout
          </div>
        </div> */}
      </div>

      <LogOutDialog />
    </div>
  );
}
