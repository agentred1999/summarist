'use client';

import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Hide sidebar on home page only (show on sales page)
  const isHomePage = pathname === '/';
  const hideSidebar = isHomePage;

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '256px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '64px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', padding: '0 24px', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 40 }}>
          <SearchBar />
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {user && (
              <span style={{ fontSize: '14px', color: '#6b757b' }}>
                {user.email}
              </span>
            )}
          </div>
        </div>
        <div style={{ padding: '32px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
