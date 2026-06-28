'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { Book } from '@/types';
import { FiPlay, FiBookOpen, FiPlus } from 'react-icons/fi';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const id = params.id as string;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await response.json();
        setBook(data);
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

    if (book?.subscriptionRequired && user.subscription === 'basic') {
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
      <div className="animate-pulse space-y-4">
        <div className="h-64 bg-gray-300 rounded"></div>
        <div className="h-8 bg-gray-300 rounded w-1/3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={book.imageLink}
          alt={book.title}
          className="w-full h-96 object-cover"
        />
        
        <div className="p-8">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-xl text-gray-600 mt-1">by {book.author}</p>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {book.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="mt-6 text-gray-700 leading-relaxed">{book.bookDescription}</p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleReadOrListen}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiPlay />
              {book.type === 'audio' ? 'Listen' : 'Read'}
            </button>
            
            <button
              onClick={handleSaveToLibrary}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FiPlus />
              Add to Library
            </button>
          </div>

          {book.subscriptionRequired && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">This book requires a premium subscription</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
