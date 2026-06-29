"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

function BookPill({ required }: { required: boolean }) {
  return (
    <div style={{ position: "absolute", top: "8px", right: "8px", backgroundColor: "#032b41", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px" }}>Premium</div>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/book/${book.id}`} style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", cursor: "pointer", padding: "16px", borderRadius: "8px", position: "relative", width: "180px" }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f1f6f4")}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
        <div style={{ position: "relative", marginBottom: "12px" }}>
          <img src={book.imageLink} alt={book.title} style={{ width: "180px", height: "180px", objectFit: "cover", borderRadius: "4px" }} />
          <BookPill required={book.subscriptionRequired} />
        </div>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#032b41", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{book.title}</div>
        <div style={{ fontSize: "14px", color: "#6b757b", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }}>{book.author}</div>
        <div style={{ fontSize: "13px", color: "#6b757b", marginBottom: "8px", overflow: "hidden", maxWidth: "180px", height: "40px" }}>{book.subTitle}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6b757b" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><IoTimeOutline /> 4:52</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><AiOutlineStar /> {book.averageRating?.toFixed(1) || "4.0"}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ForYouPage() {
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
        return arr.filter(b => { const key = b.title + b.author; if (seen.has(key)) return false; seen.add(key); return true; });
      };
      setRecommended(dedup(rec));
      setSuggested(dedup(sug));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "24px 40px", maxWidth: "1100px" }}>
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "16px" }}>Selected just for you</h2>
        {loading ? <div style={{ height: "200px", backgroundColor: "#e8e8e8", borderRadius: "8px" }} /> : selected ? (
          <Link href={`/book/${selected.id}`} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", gap: "24px", backgroundColor: "#fff3d7", borderRadius: "8px", padding: "24px", cursor: "pointer", maxWidth: "700px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", color: "#032b41", marginBottom: "16px", lineHeight: 1.5 }}>{selected.subTitle}</div>
                <hr style={{ border: "none", borderTop: "1px solid #bac8ce", marginBottom: "16px" }} />
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img src={selected.imageLink} alt={selected.title} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "4px" }} />
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
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>Recommended For You</h2>
        <p style={{ fontSize: "14px", color: "#6b757b", marginBottom: "16px" }}>We think you will like these</p>
        {loading ? <div style={{ display: "flex", gap: "16px" }}>{[1,2,3,4].map(i => <div key={i} style={{ width: "180px", height: "260px", backgroundColor: "#e8e8e8", borderRadius: "8px" }} />)}</div>
        : <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>{recommended.map(book => <BookCard key={book.id} book={book} />)}</div>}
      </section>
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#032b41", marginBottom: "4px" }}>Suggested Books</h2>
        <p style={{ fontSize: "14px", color: "#6b757b", marginBottom: "16px" }}>Browse these books</p>
        {loading ? <div style={{ display: "flex", gap: "16px" }}>{[1,2,3,4].map(i => <div key={i} style={{ width: "180px", height: "260px", backgroundColor: "#e8e8e8", borderRadius: "8px" }} />)}</div>
        : <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>{suggested.map(book => <BookCard key={book.id} book={book} />)}</div>}
      </section>
    </div>
  );
}
