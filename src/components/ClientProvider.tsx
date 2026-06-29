'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';

function AuthListener({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let subscription: 'basic' | 'premium' | 'premium-plus' = 'premium';
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            subscription = docSnap.data().subscription || 'premium';
          }
        } catch (e) {
          // fallback to premium if Firestore read fails
        }
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          subscription,
          savedBooks: [],
          finishedBooks: [],
        }));
      } else {
        dispatch(setUser(null));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);
  return <>{children}</>;
}

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthListener>{children}</AuthListener>
    </Provider>
  );
}
