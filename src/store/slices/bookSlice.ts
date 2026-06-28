import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '@/types';

interface BookState {
  selectedBook: Book | null;
  recommendedBooks: Book[];
  suggestedBooks: Book[];
  loading: boolean;
  error: string | null;
}

const initialState: BookState = {
  selectedBook: null,
  recommendedBooks: [],
  suggestedBooks: [],
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSelectedBook: (state, action: PayloadAction<Book>) => {
      state.selectedBook = action.payload;
    },
    setRecommendedBooks: (state, action: PayloadAction<Book[]>) => {
      state.recommendedBooks = action.payload;
    },
    setSuggestedBooks: (state, action: PayloadAction<Book[]>) => {
      state.suggestedBooks = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSelectedBook,
  setRecommendedBooks,
  setSuggestedBooks,
  setLoading,
  setError,
} = bookSlice.actions;
export default bookSlice.reducer;
