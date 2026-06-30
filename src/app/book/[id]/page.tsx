'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { Book } from '@/types';
import { FiBookOpen, FiMic, FiBookmark, FiStar, FiClock } from 'react-icons/fi';
import { AiOutlineBulb } from 'react-icons/ai';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [audioDuration, setAudioDuration] = useState<string>('--:--');

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
            setAudioDuration(`${String(mins).padStart(2, '0')}:${secs}`);
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

  const goToContent = (mode: 'read' | 'listen') => {
    if (!user) {
      dispatch(setAuthModal(true));
      return;
    }
    if (book?.subscriptionRequired && !isPremiumUser) {
      router.push('/choose-plan');
      return;
    }
    router.push(`/player/${id}${mode === 'listen' ? '?audio=true' : ''}`);
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
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap-reverse' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ height: '32px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '70%', marginBottom: '12px' }} />
            <div style={{ height: '18px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '40%', marginBottom: '24px' }} />
            <div style={{ height: '14px', backgroundColor: '#e8e8e8', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ height: '14px', backgroundColor: '#e8e8e8', borderRadius: '4px', width: '80%' }} />
          </div>
          <div style={{ width: '180px', height: '252px', backgroundColor: '#e8e8e8', borderRadius: '8px', flexShrink: 0 }} />
        </div>
      </div>
    );
  }

  if (!book) return <div style={{ padding: '40px', textAlign: 'center', color: '#6b757b' }}>Book not found</div>;

  return (
    <>
      <style>{`
        .book-detail-wrap { max-width: 900px; margin: 0 auto; padding: 24px 16px; }
        .book-top { display: flex; justify-content: space-between; gap: 32px; margin-bottom: 24px; flex-wrap: wrap-reverse; }
        .book-info { flex: 1; min-width: 260px; }
        .book-cover { width: 180px; height: 252px; object-fit: cover; border-radius: 4px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); flex-shrink: 0; }
        .stat-row { display: flex; flex-wrap: wrap; gap: 24px; padding: 16px 0; border-top: 1px solid #e8e8e8; border-bottom: 1px solid #e8e8e8; margin: 16px 0 24px; }
        .stat-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #032b41; font-weight: 600; }
        .action-buttons { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
        .tag-pill { padding: 10px 18px; background: #f1f6f4; color: #032b41; font-size: 14px; font-weight: 600; border-radius: 4px; }
        @media (max-width: 640px) {
          .book-top { flex-direction: column-reverse; align-items: center; text-align: center; }
          .book-cover { width: 160px; height: 224px; }
          .stat-row { justify-content: center; }
          .action-buttons { justify-content: center; }
        }
      `}</style>
      <div className="book-detail-wrap">
        <div className="book-top">
          <div className="book-info">
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#032b41', lineHeight: 1.3, marginBottom: '8px' }}>
              {book.title}
            </h1>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#032b41', marginBottom: '8px' }}>{book.author}</p>
            <p style={{ fontSize: '15px', color: '#394547' }}>{book.subTitle}</p>

            <div className="stat-row">
              <span className="stat-item"><FiStar color="#f6b400" /> {book.averageRating?.toFixed(1) || '4.0'} ({book.totalRating || 0} ratings)</span>
              <span className="stat-item"><FiClock /> {audioDuration}</span>
              <span className="stat-item"><FiMic /> Audio &amp; Text</span>
              <span className="stat-item"><AiOutlineBulb /> {book.keyIdeas?.length || 0} Key ideas</span>
            </div>

            <div className="action-buttons">
              <button
                onClick={() => goToContent('read')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', backgroundColor: '#032b41', color: '#fff',
                  fontWeight: 600, fontSize: '15px', borderRadius: '4px', border: 'none', cursor: 'pointer'
                }}
              >
                <FiBookOpen /> Read
              </button>
              <button
                onClick={() => goToContent('listen')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '14px 28px', backgroundColor: '#032b41', color: '#fff',
                  fontWeight: 600, fontSize: '15px', borderRadius: '4px', border: 'none', cursor: 'pointer'
                }}
              >
                <FiMic /> Listen
              </button>
            </div>

            <div
              onClick={handleSaveToLibrary}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#032b41', fontSize: '14px', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', width: 'fit-content' }}
            >
              <FiBookmark /> Add title to My Library
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

          <img
            src={book.imageLink}
            alt={book.title}
            className="book-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-book.png'; }}
          />
        </div>

        {book.tags && book.tags.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#032b41', marginBottom: '16px' }}>What's it about?</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {book.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <p style={{ color: '#394547', lineHeight: 1.7, fontSize: '15px' }}>{book.bookDescription}</p>
        </div>

        {book.authorDescription && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#032b41', marginBottom: '12px' }}>About the author</h2>
            <p style={{ color: '#394547', lineHeight: 1.7, fontSize: '15px' }}>{book.authorDescription}</p>
          </div>
        )}
      </div>
    </>
  );
}
