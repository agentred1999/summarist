'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#032b41', marginBottom: '32px' }}>Settings</h1>

      <div style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)', marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#032b41', marginBottom: '16px' }}>Account</h2>
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6b757b', marginBottom: '4px' }}>Email</p>
              <p style={{ fontSize: '16px', color: '#032b41' }}>{user.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6b757b', marginBottom: '4px' }}>Subscription</p>
              <p style={{ fontSize: '16px', color: '#032b41', textTransform: 'capitalize' }}>{user.subscription}</p>
            </div>
          </div>
        ) : (
          <p style={{ color: '#6b757b' }}>Please log in to view account details.</p>
        )}
      </div>

      <div style={{
        backgroundColor: '#fff', borderRadius: '8px', padding: '24px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#032b41', marginBottom: '16px' }}>Subscription</h2>
        <p style={{ color: '#394547', marginBottom: '20px' }}>
          {user?.subscription === 'premium'
            ? 'You have a Premium subscription with full access to all books.'
            : 'You are on the Basic plan. Upgrade to access all premium books.'}
        </p>
        {user?.subscription !== 'premium' && (
          <button
            onClick={() => router.push('/choose-plan')}
            style={{
              padding: '10px 24px', backgroundColor: '#2bd97c',
              color: '#032b41', border: 'none', borderRadius: '4px',
              fontWeight: 600, fontSize: '15px', cursor: 'pointer'
            }}
          >
            Upgrade to Premium
          </button>
        )}
      </div>
    </div>
  );
}
