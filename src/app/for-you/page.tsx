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
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // Fetch all books from both endpoints
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested')
        ]);

        const selectedData = await selectedRes.json();
        const recommendedData = await recommendedRes.json();
        const suggestedData = await suggestedRes.json();

        // Set selected book
        setSelectedBook(selectedData);

        // Combine all books and remove duplicates by title+author
        const allBooksData = [...recommendedData, ...suggestedData];
        const seen = new Set();
        const uniqueBooks = allBooksData.filter(book => {
          const key = `${book.title}|${book.author}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        setAllBooks(uniqueBooks);
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b757b' }}>Loading books...</div>
      </div>
    );
  }

  // Split books into recommended and suggested (first 4 = recommended, rest = suggested)
  const recommendedBooks = allBooks.slice(0, 4);
  const suggestedBooks = allBooks.slice(4, 8);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#032b41', marginBottom: '8px' }}>For You</h1>
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', fontSize: '14px', color: '#6b757b' }}>
        <span style={{ color: '#032b41', fontWeight: '500' }}>My Library</span>
        <span>Highlights</span>
        <span>Search</span>
      </div>

      {/* Selected Book */}
      {selectedBook && (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Selected just for you</h2>
          <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>Selected just for you</p>
          <Link href={`/book/${selectedBook.id}`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <img
                src={selectedBook.imageLink}
                alt={selectedBook.title}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#032b41' }}>{selectedBook.title}</h3>
                <p style={{ color: '#6b757b' }}>{selectedBook.author}</p>
                <p style={{ color: '#6b757b', fontSize: '14px', marginTop: '4px' }}>{selectedBook.subTitle}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '14px', color: '#6b757b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiClock size={14} /> 4:52
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FiStar size={14} color="#f5a623" /> {selectedBook.averageRating?.toFixed(1) || '4.0'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Recommended Books */}
      {recommendedBooks.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Recommended For You</h2>
          <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>We think you'll like these</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {recommendedBooks.map((book) => (
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
      )}

      {/* Suggested Books */}
      {suggestedBooks.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Suggested Books</h2>
          <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>Browse these books</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            {suggestedBooks.map((book) => (
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
      )}
    </div>
  );
}
