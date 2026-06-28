'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
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
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          {children}
        </div>
      </div>
      {mounted && <AuthModal />}
    </>
  );
}
