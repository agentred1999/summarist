export interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: string[];
  type: 'audio' | 'text' | 'audio & text';
  status: 'selected' | 'recommended' | 'suggested';
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  subscription: 'basic' | 'premium' | 'premium-plus';
  savedBooks: string[];
  finishedBooks: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface UIState {
  isAuthModalOpen: boolean;
  isSidebarOpen: boolean;
}
