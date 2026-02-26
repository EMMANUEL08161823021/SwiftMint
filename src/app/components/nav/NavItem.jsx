'use client';

import Link from 'next/link';
import React from 'react';

export function NavItem({
  href,
  text,
  icon: Icon,
  active = false,
  className = '',
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`
        flex items-center gap-3 transition-colors text-nowrap
        ${
          active
            ? 'text-panel-red'
            : 'text-muted-foreground hover:text-accent-foreground'
        }
        ${className}
      `}
    >
      {Icon && <Icon className="h-5 w-5 min-w-5" />}
      <span className="text-xs font-semibold">{text}</span>
    </Link>
  );
}
