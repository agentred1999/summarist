'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function UpgradeHandler() {
  const searchParams = useSearchParams();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const upgraded = searchParams.get('upgraded');
    if (upgraded === 'true' && user?.uid) {
      setDoc(doc(db, 'users', user.uid), {
        subscription: 'premium',
        email: user.email,
        upgradedAt: new Date().toISOString(),
      }, { merge: true }).then(() => {
        // Remove ?upgraded=true from URL
        window.history.replaceState({}, '', '/for-you');
      }).catch(console.error);
    }
  }, [searchParams, user]);

  return null;
}
