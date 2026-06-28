'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleAuthModal } from '@/store/slices/uiSlice';
import BookCard from '@/components/books/BookCard';

export default function LibraryPage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '80px' }}>
        <h2 style={{ fontSize: '24px', color: '#032b41', marginBottom: '16px' }}>
          Your Library
        </h2>
        <p style={{ color: '#6b757b', marginBottom: '24px' }}>
          Log in to see your saved books.
        </p>
        <button
          onClick={() => dispatch(toggleAuthModal())}
          style={{
            padding: '12px 32px', backgroundColor: '#2bd97c',
            color: '#032b41', border: 'none', borderRadius: '4px',
            fontSize: '16px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#032b41', marginBottom: '32px' }}>
        My Library
      </h1>
      {(!user.savedBooks || user.savedBooks.length === 0) ? (
        <div style={{ textAlign: 'center', marginTop: '80px', color: '#6b757b' }}>
          <p style={{ fontSize: '20px', marginBottom: '8px' }}>Your library is empty.</p>
          <p>Save books from the For You page to see them here.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '24px' }}>
          {user.savedBooks.map((book: any) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
