'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setRecommendedBooks, setSuggestedBooks, setLoading } from '@/store/slices/bookSlice';
import BookCard from '@/components/books/BookCard';
import BookSkeleton from '@/components/books/BookSkeleton';
import { Book } from '@/types';
import Link from 'next/link';
import { FiClock, FiStar, FiBookOpen } from 'react-icons/fi';

export default function ForYouPage() {
  const dispatch = useDispatch();
  const { recommendedBooks, suggestedBooks, loading } = useSelector((state: RootState) => state.books);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      dispatch(setLoading(true));
      try {
        // Fetch selected book
        const selectedRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected'
        );
        const selectedData = await selectedRes.json();
        setSelectedBook(selectedData);

        // Fetch recommended books
        const recommendedRes = await fetch(
          'https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended'
        );
        const recommendedData = await recommendedRes.json();
        dispatch(setRecommendedBooks(recommendedData));

        // Fetch suggested books
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

  if (loading) {
    return (
      <div className="space-y-8">
        <BookSkeleton featured />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Filter out duplicate books by ID
  const uniqueRecommended = recommendedBooks.filter((book, index, self) => 
    index === self.findIndex((b) => b.id === book.id)
  );

  const uniqueSuggested = suggestedBooks.filter((book, index, self) => 
    index === self.findIndex((b) => b.id === book.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">For You</h1>
        <div className="flex gap-6 mt-2 text-sm text-gray-600">
          <span className="text-blue-600 font-medium">My Library</span>
          <span>Highlights</span>
          <span>Search</span>
        </div>
      </div>

      {/* Selected Book - Featured */}
      {selectedBook && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Selected just for you</h2>
          <p className="text-gray-600 text-sm mb-6">Selected just for you</p>
          <Link href={`/book/${selectedBook.id}`} className="block">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img
                    src={selectedBook.imageLink}
                    alt={selectedBook.title}
                    className="w-full h-56 md:h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-book.png';
                    }}
                  />
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-gray-900">{selectedBook.title}</h3>
                  <p className="text-gray-600">{selectedBook.author}</p>
                  <p className="text-gray-500 text-sm mt-1">{selectedBook.subTitle}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock className="w-4 h-4" /> 4:52
                    </span>
                    <span className="flex items-center gap-1">
                      <FiStar className="w-4 h-4 text-yellow-400" /> {selectedBook.averageRating?.toFixed(1) || '4.0'}
                    </span>
                  </div>
                  {selectedBook.subscriptionRequired && (
                    <span className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full w-fit">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Recommended Books Grid */}
      {uniqueRecommended.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Recommended For You</h2>
          <p className="text-gray-600 text-sm mb-6">We think you'll like these</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueRecommended.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Books */}
      {uniqueSuggested.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Suggested Books</h2>
          <p className="text-gray-600 text-sm mb-6">Browse these books</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueSuggested.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no books */}
      {!loading && uniqueRecommended.length === 0 && uniqueSuggested.length === 0 && !selectedBook && (
        <div className="text-center py-12">
          <p className="text-gray-500">No books available. Please try again later.</p>
        </div>
      )}
    </div>
  );
}
