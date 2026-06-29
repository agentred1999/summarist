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
  const [featuredBook, setFeaturedBook] = useState<Book | null>(null);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const featuredRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'
        );
        const featuredData = await featuredRes.json();
        setFeaturedBook(featuredData);

        const recommendedRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'
        );
        const recommendedData = await recommendedRes.json();
        setRecommendedBooks(recommendedData);
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

      {/* Featured Book */}
      {featuredBook && (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Selected just for you</h2>
          <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>Selected just for you</p>
          <Link href={`/book/${featuredBook.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <img
                src={featuredBook.imageLink}
                alt={featuredBook.title}
                style={{ width: '200px', height: '200px', objectFit: 'cover', flexShrink: 0 }}
              />
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#032b41' }}>{featuredBook.title}</h3>
                <p style={{ color: '#6b757b' }}>{featuredBook.author}</p>
                <p style={{ color: '#6b757b', fontSize: '14px', marginTop: '4px' }}>{featuredBook.subTitle}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '14px', color: '#6b757b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={14} /> 4:52
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar size={14} color="#f5a623" /> {featuredBook.averageRating?.toFixed(1) || '4.0'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Recommended Books - Fixed width grid */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41' }}>Recommended For You</h2>
        <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>We think you'll like these</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
          width: '100%'
        }}>
          {recommendedBooks.slice(0, 4).map((book) => (
            <Link key={book.id} href={`/book/${book.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                overflow: 'hidden',
                transition: 'box-shadow 0.2s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}>
                <div style={{ width: '100%', paddingTop: '100%', position: 'relative' }}>
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                    height: '40px',
                    flex: 1
                  }}>{book.subTitle}</p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    fontSize: '13px', 
                    color: '#6b757b',
                    marginTop: 'auto',
                    paddingTop: '8px'
                  }}>
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
