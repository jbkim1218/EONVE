'use client';
import Image from 'next/image';
import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
export function Photo({
  src,
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 600px) 50vw, (max-width: 1100px) 33vw, 25vw',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const [failedSrc, setFailedSrc] = useState('');
  if (failedSrc === src)
    return (
      <div role="img" aria-label={alt} className="image-fallback">
        이미지를 불러올 수 없습니다.
      </div>
    );
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith('https:')}
      className={className}
      onError={() => setFailedSrc(src)}
    />
  );
}
export function Drawer({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="backdrop" />
        <Dialog.Popup className="drawer">
          <div className="drawer-title">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="닫기">
              <X size={22} />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">{title} 옵션을 확인하세요.</Dialog.Description>
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
