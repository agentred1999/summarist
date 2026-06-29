'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { setUser, setError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { FiX, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.ui.isAuthModalOpen);
  const error = useSelector((state: RootState) => state.auth.error);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          subscription: 'basic',
          savedBooks: [],
          finishedBooks: [],
        }));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleClose = () => {
    dispatch(setAuthModal(false));
    dispatch(setError(null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(setError(null));

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        subscription: 'basic',
        savedBooks: [],
        finishedBooks: [],
      }));
      dispatch(setAuthModal(false));
      router.push('/for-you');
    } catch (error: any) {
      let errorMessage = 'An error occurred';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Wrong password';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already in use';
      }
      dispatch(setError(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    dispatch(setError(null));
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      dispatch(setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        subscription: 'basic',
        savedBooks: [],
        finishedBooks: [],
      }));
      dispatch(setAuthModal(false));
      router.push('/for-you');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        dispatch(setError('Google sign-in was cancelled'));
      } else {
        dispatch(setError('Google sign-in failed. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    dispatch(setError(null));
    try {
      await signInWithEmailAndPassword(auth, 'guest@gmail.com', 'guest123');
      dispatch(setAuthModal(false));
      router.push('/for-you');
    } catch (error) {
      dispatch(setError('Guest login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 rounded-full hover:bg-gray-100"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              {isLogin ? 'Login to continue learning' : 'Start your learning journey today'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 characters)'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Sign in with Google
          </button>

          <button
            onClick={handleGuestLogin}
            disabled={loading}
            className="w-full mt-3 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue as Guest
          </button>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(setError(null));
              }}
              className="ml-1 text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
              disabled={loading}
            >
              {isLogin ? 'Sign up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
