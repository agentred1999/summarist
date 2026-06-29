'use client';

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';
import { Book } from '@/types';
import { FiClock, FiStar } from 'react-icons/fi';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (query.length > 0) {
        setLoading(true);
        try {
          const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        } catch { setResults([]); }
        finally { setLoading(false); }
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#032b41', marginBottom: '24px' }}>Search</h1>

      <div style={{ position: 'relative', marginBottom: '32px' }}>
        <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#6b757b' }} size={18} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by title or author..."
          autoFocus
          style={{ width: '100%', padding: '14px 16px 14px 44px', border: '1px solid #e8e8e8', borderRadius: '8px', fontSize: '16px', outline: 'none', backgroundColor: '#f5f5f5', boxSizing: 'border-box' }}
        />
      </div>

      {loading && <p style={{ color: '#6b757b', textAlign: 'center' }}>Searching...</p>}

      {!loading && query && results.length === 0 && (
        <p style={{ color: '#6b757b', textAlign: 'center' }}>No results found for &quot;{query}&quot;</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
        {results.map(book => (
          <Link key={book.id} href={`/book/${book.id}`} style={{ display: 'flex', gap: '16px', padding: '16px', backgroundColor: '#fff', textDecoration: 'none', alignItems: 'center' }}>
            <img src={book.imageLink} alt={book.title} style={{ width: '48px', height: '68px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#032b41', marginBottom: '4px' }}>{book.title}</p>
              <p style={{ fontSize: '14px', color: '#6b757b', marginBottom: '8px' }}>{book.author}</p>
              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b757b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiClock size={12} /> 4:52</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiStar size={12} /> {book?.averageRating?.toFixed(1) ?? 'N/A'}</span>
                {book.subscriptionRequired && <span style={{ backgroundColor: '#032b41', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>Premium</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
