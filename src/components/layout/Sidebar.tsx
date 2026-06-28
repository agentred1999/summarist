'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { FiHome, FiBookmark, FiPenTool, FiSearch, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';

const topItems = [
  { name: 'For you', path: '/for-you', icon: FiHome },
  { name: 'My Library', path: '/library', icon: FiBookmark },
  { name: 'Highlights', path: '/highlights', icon: FiPenTool },
  { name: 'Search', path: '/search', icon: FiSearch },
];

const bottomItems = [
  { name: 'Settings', path: '/settings', icon: FiSettings },
  { name: 'Help & Support', path: '/help', icon: FiHelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      router.push('/');
    } catch (err) { console.error(err); }
  };

  if (pathname === '/' || pathname === '/choose-plan') return null;

  const item = (path: string) => ({
    display: 'flex' as const, alignItems: 'center' as const, gap: '16px',
    padding: '14px 28px', fontSize: '15px', fontWeight: 500,
    color: pathname === path ? '#032b41' : '#6b757b',
    backgroundColor: pathname === path ? '#f1f6f4' : 'transparent',
    borderLeft: pathname === path ? '4px solid #2bd97c' : '4px solid transparent',
    textDecoration: 'none', cursor: 'pointer', transition: 'all 0.15s',
  });

  return (
    <div style={{ width: '256px', height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #e8e8e8', position: 'fixed', left: 0, top: 0, display: 'flex', flexDirection: 'column', zIndex: 50 }}>
      <div style={{ padding: '24px 28px 32px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <img src="/assets/logo.png" alt="logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#032b41' }}>Summarist</span>
        </Link>
      </div>

      <nav style={{ flex: 1 }}>
        {topItems.map(i => (
          <Link key={i.name} href={i.path} style={item(i.path)}>
            <i.icon size={20} />
            <span>{i.name}</span>
          </Link>
        ))}
      </nav>

      <div style={{ paddingBottom: '24px' }}>
        {bottomItems.map(i => (
          <Link key={i.name} href={i.path} style={item(i.path)}>
            <i.icon size={20} />
            <span>{i.name}</span>
          </Link>
        ))}
        <button onClick={handleLogout} style={{ ...item('#'), border: 'none', background: 'none', width: '100%' }}>
          <FiLogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
