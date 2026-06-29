'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleAuthModal } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  FiHome, 
  FiBook, 
  FiStar, 
  FiSearch, 
  FiSettings, 
  FiHelpCircle, 
  FiLogIn, 
  FiLogOut 
} from 'react-icons/fi';

const menuItems = [
  { name: 'For You', path: '/for-you', icon: FiHome },
  { name: 'Library', path: '/library', icon: FiBook },
  { name: 'Highlights', path: '#', icon: FiStar, disabled: true },
  { name: 'Search', path: '#', icon: FiSearch, disabled: true },
  { name: 'Settings', path: '/settings', icon: FiSettings },
  { name: 'Help & Support', path: '#', icon: FiHelpCircle, disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleAuthAction = async () => {
    if (user) {
      try {
        await signOut(auth);
        dispatch(logout());
        router.push('/');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else {
      dispatch(toggleAuthModal());
    }
  };

  // Hide sidebar on home and sales page
  if (pathname === '/' || pathname === '/choose-plan') {
    return null;
  }

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
      <div className="p-4">
        <div className="mb-8">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Summarist
          </Link>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.disabled ? (
                <div className="flex items-center gap-3 px-4 py-2 text-gray-400 cursor-not-allowed">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </div>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    pathname === item.path
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}

          <button
            onClick={handleAuthAction}
            className="flex items-center gap-3 px-4 py-2 w-full text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            {user ? (
              <>
                <FiLogOut className="w-5 h-5" />
                <span>Logout</span>
              </>
            ) : (
              <>
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </button>
        </nav>

        {user && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
              <p className="text-xs text-gray-500">Subscription: {user.subscription}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
