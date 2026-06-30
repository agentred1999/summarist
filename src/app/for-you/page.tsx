"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { IoTimeOutline } from "react-icons/io5";
import { AiOutlineStar } from "react-icons/ai";

interface Book {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
  type: string;
}

function BookCard({ book, isPremiumUser }: { book: Book; isPremiumUser: boolean }) {
  return (
    <Link href={`/book/${book.id}`} style={{ textDecoration: "none", flexShrink: 0, width: "180px", display: "block" }}>
      <div
        style={{ display: "flex", flexDirection: "column", cursor: "pointer", padding: "12px", borderRadius: "8px", position: "relative", width: "180px", boxSizing: "border-box" }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f1f6f4")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <img
            src={book.imageLink}
            alt={book.title}
            style={{ width: "156px", height: "156px", objectFit: "cover", borderRadius: "4px", display: "block" }}
          />
          {book.subscriptionRequired && !isPremiumUser && (
            <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#032b41", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px" }}>
              Premium
            </div>
          )}
        </div>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#032b41", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {book.title}
        </div>
        <div style={{ fontSize: "13px", color: "#6b757b", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {book.author}
        </div>
        <div style={{ fontSize: "12px", color: "#6b757b", marginBottom: "8px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {book.subTitle}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#6b757b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><IoTimeOutline /> 4:52</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><AiOutlineStar /> {book.averageRating?.toFixed(1) || "4.0"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ForYouPage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isPremiumUser = user?.subscription === "premium" || user?.subscription === "premium-plus";
  const [selected, setSelected] = useState<Book | null>(null);
  const [recommended, setRecommended] = useState<Book[]>([]);
  const [suggested, setSuggested] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected").then(r => r.json()),
      fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended").then(r => r.json()),
      fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested").then(r => r.json()),
    ]).then(([sel, rec, sug]) => {
      setSelected(Array.isArray(sel) ? sel[0] : sel);
      const dedup = (arr: Book[]) => {
        const seen = new Set();
        return arr.filter(b => {
          const key = b.title + b.author;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      };
      setRecommended(dedup(rec));
      setSuggested(dedup(sug));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        .for-you-wrap { padding: 24px 40px; max-width: 1200px; }
        .selected-card { display: flex; gap: 24px; background: #fff3d7; border-radius: 8px; padding: 24px; cursor: pointer; max-width: 700px; }
        .book-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; -webkit-overflow-scrolling: touch; }
        .book-scroll::-webkit-scrollbar { height: 4px; }
        .book-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 2px; }
        .book-scroll::-webkit-scrollbar-thumb { background: #bac8ce; border-radius: 2px; }
        @media (max-width: 768px) {
          .for-you-wrap { padding: 56px 16px 16px; }
          .selected-card { flex-direction: column; gap: 16px; max-width: 100%; }
        }
      `}</style>
      <div className="for-you-wrap">

        {/* Selected just for you */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>Selected just for you</h2>
          {loading ? (
            <div style={{ height: "160px", backgroundColor: "#e8e8e8", borderRadius: "8px", maxWidth: "700px" }} />
          ) : selected ? (
            <Link href={`/book/${selected.id}`} style={{ textDecoration: "none" }}>
              <div className="selected-card">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", color: "#032b41", marginBottom: "16px", lineHeight: 1.6 }}>{selected.subTitle}</div>
                  <hr style={{ border: "none", borderTop: "1px solid #bac8ce", marginBottom: "16px" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                    <img src={selected.imageLink} alt={selected.title} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "#032b41" }}>{selected.title}</div>
                      <div style={{ fontSize: "14px", color: "#6b757b" }}>{selected.author}</div>
                      <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#6b757b", marginTop: "8px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><IoTimeOutline /> 4:52</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><AiOutlineStar /> {selected.averageRating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </section>

        {/* Recommended */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>Recommended For You</h2>
          <p style={{ fontSize: "14px", color: "#6b757b", marginBottom: "16px" }}>We think you will like these</p>
          {loading ? (
            <div style={{ display: "flex", gap: "16px" }}>
              {[1,2,3,4].map(i => <div key={i} style={{ width: "180px", height: "260px", backgroundColor: "#e8e8e8", borderRadius: "8px", flexShrink: 0 }} />)}
            </div>
          ) : (
            <div className="book-scroll">
              {recommended.map(book => <BookCard key={book.id} book={book} isPremiumUser={isPremiumUser} />)}
            </div>
          )}
        </section>

        {/* Suggested */}
        <section style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>Suggested Books</h2>
          <p style={{ fontSize: "14px", color: "#6b757b", marginBottom: "16px" }}>Browse these books</p>
          {loading ? (
            <div style={{ display: "flex", gap: "16px" }}>
              {[1,2,3,4].map(i => <div key={i} style={{ width: "180px", height: "260px", backgroundColor: "#e8e8e8", borderRadius: "8px", flexShrink: 0 }} />)}
            </div>
          ) : (
            <div className="book-scroll">
              {suggested.map(book => <BookCard key={book.id} book={book} isPremiumUser={isPremiumUser} />)}
            </div>
          )}
        </section>

      </div>
    </>
  );
}
