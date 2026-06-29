'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { Book } from '@/types';
import { FiPlay, FiBookOpen, FiPlus, FiClock, FiStar, FiMic } from 'react-icons/fi';

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

        // Get audio duration
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
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto p-8">
        <div className="flex gap-8">
          <div className="w-48 h-64 bg-gray-300 rounded flex-shrink-0"></div>
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-2/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) return <div className="p-8">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top section: image + info */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <img
          src={book.imageLink}
          alt={book.title}
          className="w-48 h-64 object-cover rounded-lg shadow-md flex-shrink-0 mx-auto md:mx-0"
          onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-book.png'; }}
        />
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
          <p className="text-gray-500 mt-2 italic">{book.subTitle}</p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FiStar className="text-yellow-400" />
              {book.averageRating?.toFixed(1) || '4.0'} ({book.totalRating || 0} ratings)
            </span>
            {audioDuration && (
              <span className="flex items-center gap-1">
                <FiClock /> {audioDuration}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiMic /> Audio & Text
            </span>
            {book.subscriptionRequired && !isPremiumUser && (
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Premium
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {book.tags?.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleReadOrListen}
              className="flex items-center gap-2 px-6 py-3 bg-[#2bd97c] text-[#032b41] font-semibold rounded-lg hover:bg-[#20c56e] transition"
            >
              <FiPlay />
              {book.type === 'audio' ? 'Listen' : 'Read'}
            </button>
            <button
              onClick={handleSaveToLibrary}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
            >
              <FiPlus />
              Add to Library
            </button>
          </div>

          {book.subscriptionRequired && !isPremiumUser && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">This book requires a Premium subscription.{' '}
                <span className="underline cursor-pointer font-semibold" onClick={() => router.push('/choose-plan')}>
                  Upgrade now
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Audio section */}
      {book.audioLink && (
        <div className="mb-8 p-6 bg-[#f1f6f4] rounded-xl">
          <h2 className="text-lg font-bold text-[#032b41] mb-2 flex items-center gap-2">
            <FiMic /> Audio Preview
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {audioDuration ? `Runtime: ${audioDuration}` : 'Loading duration...'}
          </p>
          <audio controls className="w-full" src={book.audioLink}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#032b41] mb-3">About the Book</h2>
        <p className="text-gray-700 leading-relaxed">{book.bookDescription}</p>
      </div>

      {/* Author */}
      {book.authorDescription && (
        <div className="p-6 bg-white border border-gray-200 rounded-xl">
          <h2 className="text-xl font-bold text-[#032b41] mb-3">About the Author</h2>
          <p className="text-gray-700 leading-relaxed">{book.authorDescription}</p>
        </div>
      )}
    </div>
  );
}
