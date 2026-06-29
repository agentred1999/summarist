'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useState } from 'react';

export default function ChoosePlanPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePremium = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user?.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to start checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px', textAlign: 'center' }}>
      <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#032b41', marginBottom: '16px' }}>
        Get unlimited access to many amazing books to read
      </h1>
      <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#394547', marginBottom: '40px' }}>
        Turn ordinary moments into amazing learning opportunities
      </p>

      {error && (
        <div style={{ marginBottom: '24px', padding: '12px', backgroundColor: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '8px', color: '#cc0000' }}>
          {error}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
        maxWidth: '700px',
        margin: '0 auto 48px'
      }}>
        {/* Basic Plan */}
        <div style={{
          border: '2px solid #e0e0e0', borderRadius: '8px', padding: '32px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>Basic</h2>
          <p style={{ fontSize: '36px', fontWeight: 700, color: '#032b41', marginBottom: '4px' }}>Free</p>
          <p style={{ color: '#6b757b', marginBottom: '24px' }}>Forever</p>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            {['Access to free books', '1 book summary per day', 'Audio & text formats'].map(f => (
              <li key={f} style={{ color: '#394547', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#2bd97c', fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={() => router.push('/for-you')}
            style={{
              width: '100%', padding: '12px', border: '2px solid #032b41',
              borderRadius: '4px', fontSize: '16px', fontWeight: 600,
              color: '#032b41', backgroundColor: '#fff', cursor: 'pointer'
            }}
          >
            Stay Basic
          </button>
        </div>

        {/* Premium Plan */}
        <div style={{
          border: '2px solid #2bd97c', borderRadius: '8px', padding: '32px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: '#f0fff8', position: 'relative'
        }}>
          <div style={{
            position: 'absolute', top: '-14px', backgroundColor: '#2bd97c',
            color: '#032b41', fontWeight: 700, fontSize: '13px',
            padding: '4px 16px', borderRadius: '20px'
          }}>RECOMMENDED</div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>Premium</h2>
          <p style={{ fontSize: '36px', fontWeight: 700, color: '#032b41', marginBottom: '4px' }}>$99.99</p>
          <p style={{ color: '#6b757b', marginBottom: '24px' }}>per year</p>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
            {['All Basic features', 'Unlimited book summaries', 'Offline listening', 'Exclusive content', 'Priority support'].map(f => (
              <li key={f} style={{ color: '#394547', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#2bd97c', fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            onClick={handlePremium}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', backgroundColor: loading ? '#a0e8c0' : '#2bd97c',
              border: 'none', borderRadius: '4px', fontSize: '16px',
              fontWeight: 600, color: '#032b41', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s'
            }}
          >
            {loading ? 'Redirecting...' : 'Start Premium'}
          </button>
        </div>
      </div>

      <p style={{ color: '#6b757b', fontSize: '14px' }}>
        Cancel anytime. No hidden fees.
      </p>
    </div>
  );
}
