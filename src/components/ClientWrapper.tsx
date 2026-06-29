'use client';
import { useEffect, useState } from 'react';
import AuthModal from '@/components/auth/AuthModal';

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {children}
      {mounted && <AuthModal />}
    </>
  );
}
