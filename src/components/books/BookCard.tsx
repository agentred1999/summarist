'use client';

import Link from 'next/link';
import { Book } from '@/types';
import { FiClock, FiStar } from 'react-icons/fi';

interface BookCardProps {
  book: Book;
  featured?: boolean;
}

export default function BookCard({ book, featured = false }: BookCardProps) {
  if (featured) {
    return (
      <Link href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ backgroundColor: '#fff3d7', borderRadius: '8px', padding: '24px', display: 'flex', gap: '24px', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', color: '#6b757b', marginBottom: '8px' }}>Selected just for you</p>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#032b41', marginBottom: '16px', lineHeight: 1.4 }}>{book.subTitle}</p>
            <hr style={{ border: 'none', borderTop: '1px solid #bdc8ce', marginBottom: '16px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <img src={book.imageLink} alt={book.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#032b41' }}>{book.title}</p>
                <p style={{ fontSize: '14px', color: '#6b757b', margin: '4px 0' }}>{book.author}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#6b757b' }}>
                  <FiClock size={14} />
                  <span>{book?.duration ?? '3 mins'}</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#032b41', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <p style={{ fontSize: '12px', color: '#6b757b' }}>3 mins 23 secs</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/book/${book.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ cursor: 'pointer', padding: '8px 0' }}>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          {book.subscriptionRequired && (
            <span style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#032b41', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', zIndex: 1 }}>
              Premium
            </span>
          )}
          <img
            src={book.imageLink}
            alt={book.title}
            style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
          />
        </div>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#032b41', marginBottom: '4px', lineHeight: 1.3 }}>{book.title}</h3>
        <p style={{ fontSize: '14px', color: '#6b757b', marginBottom: '4px' }}>{book.author}</p>
        <p style={{ fontSize: '13px', color: '#6b757b', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{book.subTitle}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#6b757b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiClock size={13} /> {book?.duration ?? '4:52'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FiStar size={13} /> {book?.averageRating?.toFixed(1) ?? 'N/A'}
          </span>
        </div>
      </div>
    </Link>
  );
}
