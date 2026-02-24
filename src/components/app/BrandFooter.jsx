export function BrandFooter() {
  const year = new Date().getUTCFullYear(); // stable for SSR
  return (
    <div className="text-center text-sm text-gray-500 py-4">
      Control Panel — a Pivetra product. © {year} All rights reserved.
    </div>
  );
}
