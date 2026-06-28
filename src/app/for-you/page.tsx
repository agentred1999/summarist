'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setRecommendedBooks, setSuggestedBooks, setLoading } from '@/store/slices/bookSlice';
import BookCard from '@/components/books/BookCard';
import { Book } from '@/types';

export default function ForYouPage() {
  const dispatch = useDispatch();
  const { recommendedBooks, suggestedBooks, loading } = useSelector((state: RootState) => state.books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch(setLoading(true));
      try {
        const [selectedRes, recommendedRes, suggestedRes] = await Promise.all([
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'),
          fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested'),
        ]);
        const [selectedData, recommendedData, suggestedData] = await Promise.all([
          selectedRes.json(), recommendedRes.json(), suggestedRes.json()
        ]);

        // API may return array or single object
        const featured = Array.isArray(selectedData) ? selectedData[0] : selectedData;
        setSelectedBook(featured);
        dispatch(setRecommendedBooks(Array.isArray(recommendedData) ? recommendedData : []));
        dispatch(setSuggestedBooks(Array.isArray(suggestedData) ? suggestedData : []));
      } catch (error) {
        console.error('Failed to fetch books:', error);
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchBooks();
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ height: '180px', backgroundColor: '#e5e7eb', borderRadius: '8px' }} />
        <div style={{ display: 'flex', gap: '16px' }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} style={{ minWidth: '180px', height: '280px', backgroundColor: '#e5e7eb', borderRadius: '8px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
      {selectedBook && (
        <section>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#032b41', marginBottom: '16px' }}>Selected just for you</h2>
          <BookCard book={selectedBook} featured />
        </section>
      )}

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#032b41', marginBottom: '4px' }}>Recommended For You</h2>
        <p style={{ fontSize: '14px', color: '#6b757b', marginBottom: '16px' }}>We think you&apos;ll like these</p>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
          {recommendedBooks.map((book) => (
            <div key={book.id} style={{ minWidth: '180px', maxWidth: '180px' }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#032b41', marginBottom: '4px' }}>Suggested Books</h2>
        <p style={{ fontSize: '14px', color: '#6b757b', marginBottom: '16px' }}>Browse those books</p>
        <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
          {suggestedBooks.map((book) => (
            <div key={book.id} style={{ minWidth: '180px', maxWidth: '180px' }}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
