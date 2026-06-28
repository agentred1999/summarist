'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebar = pathname === '/' || pathname === '/choose-plan';

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ marginLeft: '256px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '64px', borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', paddingRight: '24px', backgroundColor: '#fff', position: 'sticky', top: 0, zIndex: 40 }}>
          <SearchBar />
        </div>
        <div style={{ padding: '32px', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
