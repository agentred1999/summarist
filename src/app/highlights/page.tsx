'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function HighlightsPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>Highlights</h1>
      <p style={{ color: '#6b757b', marginBottom: '40px' }}>Your saved highlights from books you&apos;ve read.</p>

      <div style={{ textAlign: 'center', padding: '80px 24px', backgroundColor: '#f1f6f4', borderRadius: '12px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✏️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#032b41', marginBottom: '8px' }}>No highlights yet</h2>
        <p style={{ color: '#6b757b', fontSize: '15px' }}>
          {user
            ? 'Start reading books and highlight key passages to see them here.'
            : 'Log in and start reading to save highlights.'}
        </p>
      </div>
    </div>
  );
}
