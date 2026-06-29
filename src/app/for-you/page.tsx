'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setRecommendedBooks, setSuggestedBooks, setLoading } from '@/store/slices/bookSlice';
import { Book } from '@/types';
import Link from 'next/link';
import { FiClock, FiStar } from 'react-icons/fi';

export default function ForYouPage() {
  const dispatch = useDispatch();
  const { recommendedBooks, suggestedBooks, loading } = useSelector((state: RootState) => state.books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch(setLoading(true));
      try {
        const selectedRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'
        );
        const selectedData = await selectedRes.json();
        setSelectedBook(selectedData);

        const recommendedRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'
        );
        const recommendedData = await recommendedRes.json();
        dispatch(setRecommendedBooks(recommendedData));

        const suggestedRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'
        );
        const suggestedData = await suggestedRes.json();
        dispatch(setSuggestedBooks(suggestedData));
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchBooks();
  }, [dispatch]);

  // Remove duplicates by title (since API returns duplicate IDs)
  const seenTitles = new Set();
  const uniqueRecommended = recommendedBooks.filter(book => {
    const key = book.title + book.author;
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });

  const seenTitlesSuggested = new Set();
  const uniqueSuggested = suggestedBooks.filter(book => {
    const key = book.title + book.author;
    if (seenTitlesSuggested.has(key)) return false;
    seenTitlesSuggested.add(key);
    return true;
  });

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

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
      {uniqueRecommended.length > 0 && (
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Recommended For You</h2>
          <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>We think you'll like these</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {uniqueRecommended.slice(0, 6).map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e8e8e8',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
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
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>{book.subTitle}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b757b', marginTop: 'auto' }}>
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
      {uniqueSuggested.length > 0 && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#032b41', marginBottom: '4px' }}>Suggested Books</h2>
          <p style={{ color: '#6b757b', fontSize: '14px', marginBottom: '16px' }}>Browse these books</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '24px'
          }}>
            {uniqueSuggested.slice(0, 6).map((book) => (
              <Link key={book.id} href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e8e8e8',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.2s',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
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
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>{book.subTitle}</p>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b757b', marginTop: 'auto' }}>
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
