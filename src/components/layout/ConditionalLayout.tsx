'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);

  const hideSidebar = pathname === '/';

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      <style>{`
        .main-layout { display: flex; min-height: 100vh; }
        .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-x: hidden; }
        .top-bar { height: 64px; border-bottom: 1px solid #e8e8e8; display: flex; align-items: center; padding: 0 24px; background: #fff; position: sticky; top: 0; z-index: 40; }
        .page-content { padding: 32px 24px; flex: 1; }
        @media (max-width: 768px) {
          .top-bar { padding-left: 64px; }
          .page-content { padding: 16px; }
        }
      `}</style>
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <div className="top-bar">
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
              {user && (
                <span style={{ fontSize: '14px', color: '#6b757b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {user.email}
                </span>
              )}
            </div>
          </div>
          <div className="page-content">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
