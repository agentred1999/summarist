'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiClock, FiStar } from 'react-icons/fi';

interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
}

export default function ForYouPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'
        );
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#032b41' }}>For You</h1>
      <div style={{ display: 'flex', gap: '24px', marginTop: '8px', marginBottom: '32px', fontSize: '14px', color: '#6b757b' }}>
        <span style={{ color: '#032b41', fontWeight: '500' }}>My Library</span>
        <span>Highlights</span>
        <span>Search</span>
      </div>

      <div style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Recommended For You</h2>
        <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>We think you'll like these</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px'
        }}>
          {books.slice(0, 4).map((book) => (
            <Link key={book.id} href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s'
              }}>
                <img
                  src={book.imageLink}
                  alt={book.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '16px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#032b41',
                    marginBottom: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{book.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b757b', marginBottom: '4px' }}>{book.author}</p>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b757b',
                    marginBottom: '8px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    height: '40px'
                  }}>{book.subTitle}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b757b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiClock size={12} /> 4:52
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FiStar size={12} color="#f5a623" /> {book.averageRating?.toFixed(1) || '4.0'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
