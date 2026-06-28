'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { setUser, setError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthModal() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state: RootState) => state.ui.isAuthModalOpen);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleClose = () => dispatch(setAuthModal(false));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName, subscription: 'basic', savedBooks: [], finishedBooks: [] }));
      dispatch(setAuthModal(false));
      router.push('/for-you');
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') setErrorMsg('Invalid email address');
      else if (error.code === 'auth/weak-password') setErrorMsg('Password should be at least 6 characters');
      else if (error.code === 'auth/user-not-found') setErrorMsg('User not found');
      else if (error.code === 'auth/wrong-password') setErrorMsg('Wrong password');
      else if (error.code === 'auth/invalid-credential') setErrorMsg('Invalid email or password');
      else setErrorMsg('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'guest@gmail.com', 'guest123');
      const user = userCredential.user;
      dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName, subscription: 'basic', savedBooks: [], finishedBooks: [] }));
      dispatch(setAuthModal(false));
      router.push('/for-you');
    } catch (error) {
      setErrorMsg('Guest login failed. Please create guest@gmail.com user in Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName, subscription: 'basic', savedBooks: [], finishedBooks: [] }));
      dispatch(setAuthModal(false));
      router.push('/for-you');
    } catch (error: any) {
      setErrorMsg('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '40px 32px',
        width: '100%', maxWidth: '400px', position: 'relative'
      }}>
        <button onClick={handleClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', fontSize: '20px',
          cursor: 'pointer', color: '#6b757b'
        }}>✕</button>

        <figure style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <Image src="/assets/logo.png" alt="logo" width={150} height={40} />
        </figure>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#032b41', textAlign: 'center', marginBottom: '16px' }}>
          {isLogin ? 'Log in to Summarist' : 'Sign up to Summarist'}
        </h2>

        {errorMsg && (
          <div style={{ color: 'red', fontSize: '14px', textAlign: 'center', marginBottom: '12px' }}>
            {errorMsg}
          </div>
        )}

        <button onClick={handleGuestLogin} disabled={loading} style={{
          width: '100%', padding: '12px', marginBottom: '12px',
          backgroundColor: '#032b41', color: '#fff', border: 'none',
          borderRadius: '4px', fontSize: '16px', cursor: 'pointer',
        }}>
          {loading ? 'Loading...' : 'Login as Guest'}
        </button>

        <button onClick={handleGoogleLogin} disabled={loading} style={{
          width: '100%', padding: '12px', marginBottom: '16px',
          backgroundColor: '#fff', color: '#032b41',
          border: '1px solid #e0e0e0', borderRadius: '4px',
          fontSize: '16px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
        }}>
          <Image src="/assets/google.png" alt="google" width={20} height={20} />
          Login with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0e0e0' }} />
          <span style={{ color: '#6b757b', fontSize: '14px' }}>or</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e0e0e0' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            style={{
              width: '100%', padding: '12px', marginBottom: '12px',
              border: '1px solid #e0e0e0', borderRadius: '4px',
              fontSize: '16px', outline: 'none', boxSizing: 'border-box'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{
              width: '100%', padding: '12px', marginBottom: '16px',
              border: '1px solid #e0e0e0', borderRadius: '4px',
              fontSize: '16px', outline: 'none', boxSizing: 'border-box'
            }}
          />
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', backgroundColor: '#2bd97c',
            color: '#032b41', border: 'none', borderRadius: '4px',
            fontSize: '16px', fontWeight: 600, cursor: 'pointer'
          }}>
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button onClick={() => setIsLogin(!isLogin)} style={{
            background: 'none', border: 'none', color: '#2bd97c',
            fontSize: '14px', cursor: 'pointer', textDecoration: 'underline'
          }}>
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
