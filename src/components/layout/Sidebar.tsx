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
import { useState, useEffect, useRef } from 'react';

const bottomItems = [
  { name: 'Settings', path: '/settings', icon: AiOutlineSetting },
  { name: 'Help & Support', path: null, icon: AiOutlineQuestionCircle },
];

interface SearchBook {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  subscriptionRequired: boolean;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchBook[]>([]);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    setSearching(true);
    const timer = setTimeout(() => {
      fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${searchQuery}`)
        .then(r => r.json())
        .then(data => { setSearchResults(data || []); setSearching(false); })
        .catch(() => setSearching(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    }
    if (searchOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [searchOpen]);

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

  const linkStyle = (path: string | null, active = false): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '12px 28px', fontSize: '16px', fontWeight: 300,
    color: active ? '#032b41' : '#6b757b',
    backgroundColor: active ? '#f1f6f4' : 'transparent',
    cursor: path || active ? 'pointer' : 'not-allowed',
    textDecoration: 'none',
    borderLeft: active ? '4px solid #2bd97c' : '4px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <>
      {/* Search overlay */}
      {searchOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 998
        }} />
      )}

      <div style={{
        width: '228px', minHeight: '100vh', backgroundColor: '#fff',
        borderRight: '1px solid #e8e8e8', display: 'flex',
        flexDirection: 'column', justifyContent: 'space-between',
        position: 'sticky', top: 0, flexShrink: 0, zIndex: 999
      }}>
        <div>
          <div style={{ padding: '24px 28px 32px' }}>
            <Image src="/assets/logo.png" alt="logo" width={160} height={40} />
          </div>
          <nav>
            <Link href="/for-you" style={linkStyle('/for-you', pathname === '/for-you')}>
              <AiOutlineHome style={{ fontSize: '24px' }} />
              <span>For You</span>
            </Link>
            <Link href="/library" style={linkStyle('/library', pathname === '/library')}>
              <AiOutlineContainer style={{ fontSize: '24px' }} />
              <span>Library</span>
            </Link>
            <div style={linkStyle(null)} title="Coming soon">
              <AiOutlineBulb style={{ fontSize: '24px' }} />
              <span>Highlights</span>
            </div>
            <div
              style={{ ...linkStyle(null, searchOpen), cursor: 'pointer' }}
              onClick={() => setSearchOpen(true)}
            >
              <AiOutlineSearch style={{ fontSize: '24px' }} />
              <span>Search</span>
            </div>
          </nav>
        </div>

        <div style={{ paddingBottom: '32px' }}>
          {bottomItems.map(item => (
            item.path ? (
              <Link key={item.name} href={item.path} style={linkStyle(item.path, pathname === item.path)}>
                <item.icon style={{ fontSize: '24px' }} />
                <span>{item.name}</span>
              </Link>
            ) : (
              <div key={item.name} style={linkStyle(null)} title="Coming soon">
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

      {/* Search panel */}
      {searchOpen && (
        <div ref={searchRef} style={{
          position: 'fixed', top: 0, left: '228px', right: 0,
          backgroundColor: '#fff', zIndex: 1000, padding: '24px 40px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minHeight: '100vh'
        }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <AiOutlineSearch style={{
                position: 'absolute', left: '12px', top: '50%',
                transform: 'translateY(-50%)', fontSize: '20px', color: '#6b757b'
              }} />
              <input
                autoFocus
                type="text"
                placeholder="Search for books"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '12px 12px 12px 40px',
                  border: '1px solid #e8e8e8', borderRadius: '8px',
                  fontSize: '16px', outline: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            {searching && <div style={{ color: '#6b757b', textAlign: 'center' }}>Searching...</div>}

            {!searching && searchQuery && searchResults.length === 0 && (
              <div style={{ color: '#6b757b', textAlign: 'center' }}>No results found</div>
            )}

            <div>
              {searchResults.map(book => (
                <Link key={book.id} href={`/book/${book.id}`}
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '12px', borderRadius: '8px', cursor: 'pointer',
                    borderBottom: '1px solid #f1f6f4'
                  }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f1f6f4')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <img src={book.imageLink} alt={book.title}
                      style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#032b41' }}>{book.title}</div>
                      <div style={{ fontSize: '14px', color: '#6b757b' }}>{book.author}</div>
                    </div>
                    {book.subscriptionRequired && (
                      <div style={{
                        marginLeft: 'auto', backgroundColor: '#032b41', color: '#fff',
                        fontSize: '10px', padding: '2px 8px', borderRadius: '20px'
                      }}>Premium</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
