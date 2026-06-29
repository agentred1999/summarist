'use client';

import { useState } from 'react';

const faqs = [
  { q: 'What is Summarist?', a: 'Summarist is a book summary app that lets you read or listen to key ideas from the best nonfiction books in minutes.' },
  { q: 'How do I upgrade to Premium?', a: 'Go to Settings and click Upgrade to Premium, or visit the Choose Plan page. Premium gives you unlimited access to all books.' },
  { q: 'Can I listen to books offline?', a: 'Offline listening is available for Premium subscribers. Download books from the book page while connected to save them for later.' },
  { q: 'How do I cancel my subscription?', a: 'You can cancel anytime from the Settings page under Subscription. Your access will continue until the end of your billing period.' },
  { q: 'What formats are available?', a: 'Books are available in audio, text, or both formats depending on the title. Look for the format badge on each book card.' },
  { q: 'How do I save books to my library?', a: 'Click Add to Library on any book page. You can find all saved books under My Library in the sidebar.' },
];

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>Help & Support</h1>
      <p style={{ color: '#6b757b', marginBottom: '40px' }}>Frequently asked questions</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', backgroundColor: '#e8e8e8', borderRadius: '8px', overflow: 'hidden', marginBottom: '48px' }}>
        {faqs.map((faq, i) => (
          <div key={i} style={{ backgroundColor: '#fff' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', textAlign: 'left' }}
            >
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#032b41' }}>{faq.q}</span>
              <span style={{ fontSize: '20px', color: '#6b757b', marginLeft: '16px', flexShrink: 0 }}>{open === i ? '-' : '+'}</span>
            </button>
            {open === i && (
              <div style={{ padding: '0 24px 18px', fontSize: '15px', color: '#394547', lineHeight: 1.7 }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#f1f6f4', borderRadius: '12px', padding: '32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#032b41', marginBottom: '8px' }}>Still need help?</h2>
        <p style={{ color: '#6b757b', marginBottom: '20px' }}>Our support team is here for you.</p>
        
          href="mailto:support@summarist.app"
          style={{ display: 'inline-block', padding: '12px 32px', backgroundColor: '#032b41', color: '#fff', borderRadius: '4px', fontWeight: 600, fontSize: '15px', textDecoration: 'none' }}
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}