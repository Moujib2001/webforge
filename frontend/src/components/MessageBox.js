import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MessageBox({ orderId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/messages/order/${orderId}`);
      setMessages(data.data);
    } catch {}
  };

  useEffect(() => { fetchMessages(); }, [orderId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/messages', { order_id: orderId, content });
      setMessages((prev) => [...prev, data.data]);
      setContent('');
    } catch {}
    setLoading(false);
  };

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <div style={{ padding: '.75rem 1rem', background: 'var(--primary)', color: '#fff', fontWeight: 700 }}>
        Messagerie
      </div>
      <div style={{ height: 280, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.6rem', background: '#f8f9ff' }}>
        {messages.length === 0 && <p style={{ color: 'var(--gray)', fontSize: '.9rem' }}>Aucun message.</p>}
        {messages.map((m) => {
          const mine = m.sender_id === user.id;
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '.5rem .9rem', borderRadius: 16,
                background: mine ? 'var(--primary)' : '#fff',
                color: mine ? '#fff' : 'var(--dark)',
                boxShadow: 'var(--shadow)',
                fontSize: '.9rem',
              }}>
                {!mine && <div style={{ fontSize: '.75rem', fontWeight: 700, marginBottom: 2, opacity: .7 }}>{m.sender?.name}</div>}
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ display: 'flex', borderTop: '1px solid var(--border)' }}>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Votre message…"
          disabled={loading}
          style={{ flex: 1, border: 'none', padding: '.75rem 1rem', outline: 'none', fontSize: '.9rem' }}
        />
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ borderRadius: 0 }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
