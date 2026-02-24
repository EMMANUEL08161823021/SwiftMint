'use client';

import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { LogOutIcon } from 'lucide-react';

export default function UserPopup({
  user,
  initials = '',
  onLogout = () => {},
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex gap-2 min-w-0 hover:opacity-90 cursor-pointer w-full"
        >
          <div className="w-[30px] h-[30px] rounded-full bg-gray-500 text-white grid place-items-center text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="text-[11px] flex flex-col items-start leading-tight text-gray-800 dark:text-gray-200 min-w-0">
            <p className="font-bold truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate w-full">{user?.email}</p>
          </div>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="right"
        sideOffset={20}
        className="w-60 p-0 overflow-hidden"
      >
        {/* Header */}
        <div className="m-2 pb-2 border-b flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gray-600 text-white grid place-items-center text-sm font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-tight truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-2 text-sm space-y-1">
          {user?.role && (
            <p>
              <span className="text-muted-foreground">Role:</span> {user.role}
            </p>
          )}
          {user?.phone && (
            <p>
              <span className="text-muted-foreground">Phone:</span> {user.phone}
            </p>
          )}
        </div>

        {/* Footer (Logout pinned bottom) */}
        <div
          type="button"
          onClick={onLogout}
          className="text-red-500 text-xs hover:text-red-700 cursor-pointer p-2 w-fit flex gap-3 items-center"
        >
          <LogOutIcon className="w-[16px] min-w-[12px]" /> Logout
        </div>
      </PopoverContent>
    </Popover>
  );
}
