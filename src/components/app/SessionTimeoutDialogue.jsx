'use client';

import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LogOut } from 'lucide-react';
import { logoutUser } from '@/store/user/actions';

const KEY = 'SESSION_TIMEOUT_SIGNAL';

export default function SessionTimeoutDialog() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const bcRef = useRef(null);
  const autoRef = useRef(null);

  const triggerOpen = () => {
    if (open) return;
    setOpen(true);
    // consume the signal so refresh doesn't instantly reopen
    localStorage.removeItem(KEY);
  };

  useEffect(() => {
    // 1) BroadcastChannel
    bcRef.current = new BroadcastChannel('session');
    bcRef.current.onmessage = (e) => {
      if (e?.data?.type === 'timeout') triggerOpen();
    };
    // 2) storage event (cross-tab)
    const onStorage = (e) => {
      if (e.key === KEY && e.newValue) triggerOpen();
    };
    window.addEventListener('storage', onStorage);
    // 3) same-tab fallback custom event
    const onCustom = () => triggerOpen();
    window.addEventListener('session-timeout', onCustom);

    // In case the key was set before this mounted
    if (localStorage.getItem(KEY)) triggerOpen();

    return () => {
      bcRef.current?.close();
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('session-timeout', onCustom);
      if (autoRef.current) clearTimeout(autoRef.current);
    };
  }, [open]);

  // Auto logout after 10s when dialog opens
  useEffect(() => {
    if (!open) return;
    autoRef.current = setTimeout(() => dispatch(logoutUser(router)), 10_000);
    return () => autoRef.current && clearTimeout(autoRef.current);
  }, [open, dispatch, router]);

  const goNow = () => dispatch(logoutUser(router));

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        /* locked */
      }}
    >
      <DialogContent
        className="p-10 w-[800px] max-w-[90%]"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl flex items-center justify-center gap-2">
            Session timed out
            <span className="text-red-500">
              <LogOut className="h-5 w-5" />
            </span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm font-semibold text-center mt-5 bg-red-100 p-4 rounded">
          Your session has expired.{' '}
          <span className="text-red-500">Please log in again.</span>
        </p>

        <div className="flex items-center justify-center gap-4 mt-7">
          <Button variant="destructive" className="w-[200px]" onClick={goNow}>
            Go to Login
          </Button>
        </div>

        <p className="text-xs text-center mt-3 opacity-70">
          You will be redirected automatically in 10 seconds.
        </p>
      </DialogContent>
    </Dialog>
  );
}
