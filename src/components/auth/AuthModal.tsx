'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup
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
      if (error.code === 'auth/invalid-email') errorMessage = 'Invalid email address';
      else if (error.code === 'auth/weak-password') errorMessage = 'Password should be at least 6 characters';
      else if (error.code === 'auth/user-not-found') errorMessage = 'User not found';
      else if (error.code === 'auth/wrong-password') errorMessage = 'Wrong password';
      else if (error.code === 'auth/email-already-in-use') errorMessage = 'Email already in use';
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
      dispatch(setError('Google sign-in failed. Please try again.'));
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
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        padding: '32px'
      }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#032b41' }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ color: '#6b757b', marginTop: '8px', fontSize: '14px' }}>
            {isLogin ? 'Login to continue learning' : 'Start your learning journey today'}
          </p>
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            color: '#c33',
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <FiMail />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                <FiLock />
              </div>
              <input
                type="password"
                placeholder={isLogin ? 'Enter your password' : 'Create a password (min 6 characters)'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  outline: 'none'
                }}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div style={{ margin: '24px 0', position: 'relative', textAlign: 'center' }}>
          <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '0 12px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            or continue with
          </span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            background: 'white',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>

        <button
          onClick={handleGuestLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            marginTop: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            background: 'white',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          Continue as Guest
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#6b7280' }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              dispatch(setError(null));
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontWeight: '500',
              cursor: 'pointer',
              marginLeft: '4px'
            }}
            disabled={loading}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
