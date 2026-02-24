import Image from 'next/image';

export function BrandIcon({ className }) {
  return (
    <Image
      src={'/pivetra-icon.png'}
      width={60}
      height={60}
      alt="Pivetra BrandLogo"
      className={className}
    />
  );
}
