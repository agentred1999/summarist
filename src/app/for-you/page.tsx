'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ForYouPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended')
      .then(r => r.json())
      .then(data => {
        // Remove duplicates by title
        const seen = new Set();
        const unique = data.filter(b => {
          const key = b.title + b.author;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setBooks(unique);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding:'40px',textAlign:'center'}}>Loading...</div>;

  return (
    <div style={{maxWidth:'1100px',margin:'0 auto',padding:'24px'}}>
      <h1 style={{fontSize:'28px',fontWeight:'bold',color:'#032b41'}}>For You</h1>
      <div style={{display:'flex',gap:'24px',margin:'8px 0 32px',fontSize:'14px'}}>
        <span style={{fontWeight:'600',color:'#032b41'}}>My Library</span>
        <span style={{color:'#6b757b'}}>Highlights</span>
        <span style={{color:'#6b757b'}}>Search</span>
      </div>

      <h2 style={{fontSize:'18px',fontWeight:'600',color:'#032b41'}}>Recommended For You</h2>
      <p style={{color:'#6b757b',fontSize:'14px',margin:'4px 0 16px'}}>We think you'll like these</p>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'20px'}}>
        {books.slice(0,4).map(b => (
          <Link key={b.id} href={`/book/${b.id}`} style={{textDecoration:'none'}}>
            <div style={{background:'#fff',borderRadius:'12px',border:'1px solid #e8e8e8',overflow:'hidden'}}>
              <img src={b.imageLink} alt={b.title} style={{width:'100%',height:'180px',objectFit:'cover',display:'block'}} />
              <div style={{padding:'14px'}}>
                <div style={{fontSize:'15px',fontWeight:'600',color:'#032b41',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{b.title}</div>
                <div style={{fontSize:'13px',color:'#6b757b'}}>{b.author}</div>
                <div style={{fontSize:'12px',color:'#6b757b',margin:'4px 0 8px',height:'36px',overflow:'hidden'}}>{b.subTitle}</div>
                <div style={{display:'flex',gap:'12px',fontSize:'12px',color:'#6b757b'}}>
                  <span>🕐 4:52</span>
                  <span>⭐ {b.averageRating?.toFixed(1) || '4.0'}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
