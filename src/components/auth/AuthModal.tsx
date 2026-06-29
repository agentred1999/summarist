'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setAuthModal } from '@/store/slices/uiSlice';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
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
      if (error.code === 'auth/popup-closed-by-user') {
        dispatch(setError('Sign-in cancelled'));
      } else if (error.code === 'auth/popup-blocked') {
        dispatch(setError('Please allow popups'));
      } else {
        dispatch(setError('Google sign-in failed'));
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
      dispatch(setError('Guest login failed'));
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
      zIndex: 99999,
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
        <button onClick={handleClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>✕</button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#032b41' }}>{isLogin ? 'Welcome back' : 'Create account'}</h2>
        </div>

        {error && <div style={{ padding: '12px', backgroundColor: '#fee', border: '1px solid #fcc', borderRadius: '8px', color: '#c33', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }} required disabled={loading} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }} required disabled={loading} minLength={6} />
          <button type="submit" disabled={loading} style={{ padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>{loading ? 'Loading...' : (isLogin ? 'Login' : 'Create Account')}</button>
        </form>

        <div style={{ margin: '24px 0', textAlign: 'center' }}>or continue with</div>

        <button onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', fontSize: '16px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <FcGoogle size={20} /> Sign in with Google
        </button>

        <button onClick={handleGuestLogin} disabled={loading} style={{ width: '100%', padding: '12px', marginTop: '12px', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>Continue as Guest</button>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: '#6b7280' }}>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
          <button onClick={() => { setIsLogin(!isLogin); dispatch(setError(null)); }} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '500', cursor: 'pointer', marginLeft: '4px' }}>{isLogin ? 'Sign up' : 'Login'}</button>
        </div>
      </div>
    </div>
  );
}
