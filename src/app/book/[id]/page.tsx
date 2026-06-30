'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { Book } from '@/types';
import { FiPlay, FiPlus, FiClock, FiStar, FiHeadphones } from 'react-icons/fi';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioDuration, setAudioDuration] = useState<string | null>(null);

  const id = params.id as string;
  const isPremiumUser = user?.subscription === 'premium' || user?.subscription === 'premium-plus';

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await response.json();
        setBook(data);

        if (data.audioLink) {
          const audio = new Audio(data.audioLink);
          audio.addEventListener('loadedmetadata', () => {
            const mins = Math.floor(audio.duration / 60);
            const secs = Math.floor(audio.duration % 60).toString().padStart(2, '0');
            setAudioDuration(`${mins}:${secs}`);
          });
        }
      } catch (error) {
        console.error('Failed to fetch book:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleReadOrListen = () => {
    if (!user) {
      dispatch(setAuthModal(true));
      return;
    }
    if (book?.subscriptionRequired && !isPremiumUser) {
      router.push('/choose-plan');
      return;
    }
    router.push(`/player/${id}`);
  };

  const handleSaveToLibrary = () => {
    if (!user) {
      dispatch(setAuthModal(true));
      return;
    }
    console.log('Saving book to library:', id);
  };

  if (loading) {
    return (
      <div className="animate-pulse" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ width: '200px', height: '280px', backgroundColor: '#e8e8e8', borderRadius: '8px', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ height: '32px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '70%', marginBottom: '12px' }} />
            <div style={{ height: '18px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '40%', marginBottom: '24px' }} />
            <div style={{ height: '14px', backgroundColor: '#e8e8e8', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '14px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '80%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!book) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b757b' }}>Book not found</div>;

  return (
    <>
      <style>{`
        .book-detail-wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
        .book-top { display: flex; gap: 32px; margin-bottom: 32px; flex-wrap: wrap; }
        .book-cover { width: 200px; height: 280px; object-fit: cover; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); flex-shrink: 0; }
        .book-actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
        @media (max-width: 640px) {
          .book-top { flex-direction: column; align-items: center; text-align: center; }
          .book-cover { width: 160px; height: 224px; }
          .book-actions { justify-content: center; }
        }
      `}</style>
      <div className="book-detail-wrap">
        <div className="book-top">
          <img
            src={book.imageLink}
            alt={book.title}
            className="book-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-book.png'; }}
          />
          <div style={{ flex: 1, minWidth: '240px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#032b41', lineHeight: 1.3 }}>{book.title}</h1>
            <p style={{ fontSize: '16px', color: '#6b757b', marginTop: '4px' }}>by {book.author}</p>
            <p style={{ fontSize: '14px', color: '#6b757b', marginTop: '8px', fontStyle: 'italic' }}>{book.subTitle}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginTop: '16px', fontSize: '14px', color: '#394547' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiStar color="#f6b400" /> {book.averageRating?.toFixed(1) || '4.0'} ({book.totalRating || 0})
              </span>
              {audioDuration && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FiClock /> {audioDuration}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiHeadphones /> Audio &amp; Text
              </span>
              {book.subscriptionRequired && !isPremiumUser && (
                <span style={{ padding: '2px 10px', backgroundColor: '#032b41', color: '#fff', fontSize: '11px', fontWeight: 600, borderRadius: '20px' }}>
                  Premium
                </span>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {book.tags?.map((tag) => (
                <span key={tag} style={{ padding: '4px 12px', backgroundColor: '#f1f6f4', color: '#394547', fontSize: '13px', borderRadius: '20px' }}>
                  {tag}
                </span>
              ))}
            </div>

            <div className="book-actions">
              <button
                onClick={handleReadOrListen}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 28px', backgroundColor: '#2bd97c', color: '#032b41',
                  fontWeight: 600, fontSize: '15px', borderRadius: '8px', border: 'none', cursor: 'pointer'
                }}
              >
                <FiPlay /> {book.type === 'audio' ? 'Listen' : 'Read'}
              </button>
              <button
                onClick={handleSaveToLibrary}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 28px', backgroundColor: '#fff', color: '#032b41',
                  fontWeight: 600, fontSize: '15px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer'
                }}
              >
                <FiPlus /> Add to Library
              </button>
            </div>

            {book.subscriptionRequired && !isPremiumUser && (
              <div style={{ marginTop: '20px', padding: '12px 16px', backgroundColor: '#fff8e6', border: '1px solid #ffe9b3', borderRadius: '8px', fontSize: '14px', color: '#7a5a00' }}>
                This book requires a Premium subscription.{' '}
                <span
                  onClick={() => router.push('/choose-plan')}
                  style={{ textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
                >
                  Upgrade now
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#032b41', marginBottom: '12px' }}>About the Book</h2>
          <p style={{ color: '#394547', lineHeight: 1.7, fontSize: '15px' }}>{book.bookDescription}</p>
        </div>

        {book.authorDescription && (
          <div style={{ padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #eee' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#032b41', marginBottom: '12px' }}>About the Author</h2>
            <p style={{ color: '#394547', lineHeight: 1.7, fontSize: '15px' }}>{book.authorDescription}</p>
          </div>
        )}
      </div>
    </>
  );
}
