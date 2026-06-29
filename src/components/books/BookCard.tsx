'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Book } from '@/types';
import { FiClock, FiStar } from 'react-icons/fi';

interface BookCardProps {
  book: Book;
  featured?: boolean;
}

export default function BookCard({ book, featured = false }: BookCardProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const isPremiumUser = user?.subscription === 'premium' || user?.subscription === 'premium-plus';

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '4:52';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (featured) {
    return (
      <Link href={`/book/${book.id}`} className="block">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img
                src={book.imageLink}
                alt={book.title}
                className="w-full h-56 md:h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-book.png';
                }}
              />
            </div>
            <div className="p-6 md:w-2/3 flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
              <p className="text-gray-500 text-sm mt-1">{book.subTitle}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" /> {formatDuration()}
                </span>
                <span className="flex items-center gap-1">
                  <FiStar className="w-4 h-4 text-yellow-400" /> {book.averageRating?.toFixed(1) || '4.0'}
                </span>
              </div>
              {book.subscriptionRequired && !isPremiumUser && (
                <span className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full w-fit">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/book/${book.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition h-full flex flex-col">
        <img
          src={book.imageLink}
          alt={book.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-book.png';
          }}
        />
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
          <p className="text-sm text-gray-600">{book.author}</p>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1 flex-1">{book.subTitle}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <FiClock className="w-3 h-3" /> {formatDuration()}
            </span>
            <span className="flex items-center gap-1">
              <FiStar className="w-3 h-3 text-yellow-400" /> {book.averageRating?.toFixed(1) || '4.0'}
            </span>
          </div>
          {book.subscriptionRequired && !isPremiumUser && (
            <span className="mt-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
