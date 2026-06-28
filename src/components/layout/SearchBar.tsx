'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiSearch } from 'react-icons/fi';
import { Book } from '@/types';

export default function SearchBar() {
  const pathname = usePathname();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (search.length > 0) {
        setLoading(true);
        try {
          const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(search)}`);
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
          setIsOpen(true);
        } catch { setResults([]); }
        finally { setLoading(false); }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  if (pathname === '/' || pathname === '/choose-plan') return null;

  return (
    <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '500px', marginLeft: '24px' }}>
      <div style={{ position: 'relative' }}>
        <FiSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b757b', pointerEvents: 'none' }} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={() => search.length > 0 && setIsOpen(true)}
          placeholder="Search for books"
          style={{ width: '100%', padding: '10px 16px 10px 38px', border: '1px solid #e8e8e8', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f5f5f5', boxSizing: 'border-box' }}
        />
      </div>

      {isOpen && (results.length > 0 || loading) && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', border: '1px solid #e8e8e8', maxHeight: '400px', overflowY: 'auto', zIndex: 100 }}>
          {loading ? (
            <div style={{ padding: '16px', textAlign: 'center', color: '#6b757b' }}>Searching...</div>
          ) : results.map(book => (
            <Link key={book.id} href={`/book/${book.id}`} onClick={() => { setIsOpen(false); setSearch(''); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', textDecoration: 'none', cursor: 'pointer' }}>
              <img src={book.imageLink} alt={book.title} style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#032b41', marginBottom: '2px' }}>{book.title}</p>
                <p style={{ fontSize: '13px', color: '#6b757b' }}>{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
