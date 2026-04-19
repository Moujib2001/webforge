import { useState, useEffect } from 'react';
import api from '../api/axios';

const categories = [
  { value: '', label: 'Tous' },
  { value: 'website', label: 'Sites Web' },
  { value: 'mobile', label: 'Apps Mobile' },
  { value: 'redesign', label: 'Refonte' },
];

export default function Portfolio() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/portfolio', { params: cat ? { category: cat } : {} })
      .then(({ data }) => setItems(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <section style={{ padding: '3rem 1rem' }}>
      <div className="container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Notre Portfolio</h1>

        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((c) => (
            <button key={c.value} onClick={() => setCat(c.value)} className={`btn btn-sm ${cat === c.value ? 'btn-primary' : 'btn-outline'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Chargement…</p>
        ) : items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Aucun projet à afficher.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {items.map((item) => (
              <div key={item.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                {item.image && (
                  <img src={item.image} alt={item.title}
                    style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
                <div style={{ padding: '1.2rem' }}>
                  <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                  <h3 style={{ margin: '.4rem 0 .6rem' }}>{item.title}</h3>
                  {item.description && <p style={{ color: 'var(--gray)', fontSize: '.9rem' }}>{item.description}</p>}
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-outline btn-sm" style={{ marginTop: '.8rem' }}>
                      Voir le projet ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
