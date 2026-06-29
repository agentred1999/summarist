'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleAuthModal } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AiOutlineHome, AiOutlineContainer, AiOutlineBulb, AiOutlineSearch, AiOutlineSetting, AiOutlineQuestionCircle, AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import Image from 'next/image';

const menuItems = [
  { name: 'For You', path: '/for-you', icon: AiOutlineHome },
  { name: 'Library', path: '/library', icon: AiOutlineContainer },
  { name: 'Highlights', path: null, icon: AiOutlineBulb },
  { name: 'Search', path: null, icon: AiOutlineSearch },
];

const bottomItems = [
  { name: 'Settings', path: '/settings', icon: AiOutlineSetting },
  { name: 'Help & Support', path: null, icon: AiOutlineQuestionCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleAuthAction = async () => {
    if (user) {
      await signOut(auth);
      dispatch(logout());
      router.push('/');
    } else {
      dispatch(toggleAuthModal());
    }
  };

  if (pathname === '/' || pathname === '/choose-plan') return null;

  const linkStyle = (path: string | null): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '12px 28px', fontSize: '16px', fontWeight: 300,
    color: pathname === path ? '#032b41' : '#6b757b',
    backgroundColor: pathname === path ? '#f1f6f4' : 'transparent',
    cursor: path ? 'pointer' : 'not-allowed',
    textDecoration: 'none',
    borderLeft: pathname === path ? '4px solid #2bd97c' : '4px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <div style={{
      width: '228px', minHeight: '100vh', backgroundColor: '#fff',
      borderRight: '1px solid #e8e8e8', display: 'flex',
      flexDirection: 'column', justifyContent: 'space-between',
      position: 'sticky', top: 0, flexShrink: 0
    }}>
      <div>
        <div style={{ padding: '24px 28px 32px' }}>
          <Image src="/assets/logo.png" alt="logo" width={160} height={40} />
        </div>
        <nav>
          {menuItems.map(item => (
            item.path ? (
              <Link key={item.name} href={item.path} style={linkStyle(item.path)}>
                <item.icon style={{ fontSize: '24px' }} />
                <span>{item.name}</span>
              </Link>
            ) : (
              <div key={item.name} style={linkStyle(null)}>
                <item.icon style={{ fontSize: '24px' }} />
                <span>{item.name}</span>
              </div>
            )
          ))}
        </nav>
      </div>

      <div style={{ paddingBottom: '32px' }}>
        {bottomItems.map(item => (
          item.path ? (
            <Link key={item.name} href={item.path} style={linkStyle(item.path)}>
              <item.icon style={{ fontSize: '24px' }} />
              <span>{item.name}</span>
            </Link>
          ) : (
            <div key={item.name} style={linkStyle(null)}>
              <item.icon style={{ fontSize: '24px' }} />
              <span>{item.name}</span>
            </div>
          )
        ))}
        <div onClick={handleAuthAction} style={{ ...linkStyle(null), cursor: 'pointer' }}>
          {user ? <AiOutlineLogout style={{ fontSize: '24px' }} /> : <AiOutlineLogin style={{ fontSize: '24px' }} />}
          <span>{user ? 'Logout' : 'Login'}</span>
        </div>
        {user && (
          <div style={{ padding: '12px 28px', fontSize: '13px', color: '#6b757b' }}>
            {user.email}
          </div>
        )}
      </div>
    </div>
  );
}
