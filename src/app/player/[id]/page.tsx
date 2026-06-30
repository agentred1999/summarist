'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { Book } from '@/types';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from 'react-icons/fi';

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const authLoading = useSelector((state: RootState) => state.auth.loading);
  const [book, setBook] = useState<Book | null>(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const id = params.id as string;

  // Wait for auth to resolve before deciding to redirect
  useEffect(() => {
    if (authLoading) return; // auth state not confirmed yet, wait
    if (!user) {
      dispatch(setAuthModal(true));
      router.push('/for-you');
    }
  }, [user, authLoading]);

  // Fetch book independently of auth redirect logic
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setBookLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const skip = (secs: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(Math.max(0, audioRef.current.currentTime + secs), duration);
    }
  };

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Show loading while either auth or book data is resolving
  if (authLoading || bookLoading) {
    return <div style={{ padding: '40px', color: '#032b41' }}>Loading...</div>;
  }
  if (!user) return null; // redirect effect will handle navigation
  if (!book) return <div style={{ padding: '40px', color: '#032b41' }}>Book not found.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>{book.title}</h1>
      <p style={{ color: '#6b757b', marginBottom: '32px' }}>by {book.author}</p>

      <div style={{
        backgroundColor: '#f1f6f4', borderRadius: '8px', padding: '24px',
        marginBottom: '32px', lineHeight: '1.8', color: '#394547', fontSize: '16px',
        maxHeight: '400px', overflowY: 'auto'
      }}>
        {book.summary || 'No summary available for this book.'}
      </div>

      {book.audioLink && (
        <div style={{
          backgroundColor: '#032b41', borderRadius: '12px', padding: '24px',
          color: '#fff'
        }}>
          <audio
            ref={audioRef}
            src={book.audioLink}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', minWidth: '40px' }}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              style={{ flex: 1, accentColor: '#2bd97c' }}
            />
            <span style={{ fontSize: '13px', minWidth: '40px', textAlign: 'right' }}>{formatTime(duration)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
            <button onClick={() => skip(-10)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <FiSkipBack size={28} />
            </button>
            <button
              onClick={togglePlay}
              style={{
                width: '56px', height: '56px', borderRadius: '50%',
                backgroundColor: '#2bd97c', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {isPlaying ? <FiPause size={24} color="#032b41" /> : <FiPlay size={24} color="#032b41" />}
            </button>
            <button onClick={() => skip(10)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <FiSkipForward size={28} />
            </button>
          </div>
        </div>
      )}

      {!book.audioLink && (
        <div style={{ backgroundColor: '#f1f6f4', borderRadius: '8px', padding: '24px', textAlign: 'center', color: '#6b757b' }}>
          No audio available for this book.
        </div>
      )}
    </div>
  );
}
