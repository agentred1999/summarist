'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function ChoosePlanPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 700, color: '#032b41', marginBottom: '16px' }}>
        Get unlimited access to many amazing books to read
      </h1>
      <p style={{ fontSize: '18px', color: '#394547', marginBottom: '48px' }}>
        Turn ordinary moments into amazing learning opportunities
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '700px', margin: '0 auto 48px' }}>
        {/* Basic Plan */}
        <div style={{
          border: '2px solid #e0e0e0', borderRadius: '8px', padding: '32px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>Basic</h2>
          <p style={{ fontSize: '36px', fontWeight: 700, color: '#032b41', marginBottom: '4px' }}>Free</p>
          <p style={{ color: '#6b757b', marginBottom: '24px' }}>Forever</p>
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
          <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['All Basic features', 'Unlimited book summaries', 'Offline listening', 'Exclusive content', 'Priority support'].map(f => (
              <li key={f} style={{ color: '#394547', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#2bd97c', fontWeight: 700 }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <button
            style={{
              width: '100%', padding: '12px', backgroundColor: '#2bd97c',
              border: 'none', borderRadius: '4px', fontSize: '16px',
              fontWeight: 600, color: '#032b41', cursor: 'pointer'
            }}
          >
            Start Premium
          </button>
        </div>
      </div>

      <p style={{ color: '#6b757b', fontSize: '14px' }}>
        Cancel anytime. No hidden fees.
      </p>
    </div>
  );
}
