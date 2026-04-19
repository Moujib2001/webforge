import { useState, useEffect } from 'react';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';

const categories = [
  { value: '', label: 'Tous' },
  { value: 'website', label: 'Sites Web' },
  { value: 'mobile', label: 'Apps Mobile' },
  { value: 'redesign', label: 'Refonte' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/services', { params: cat ? { category: cat } : {} })
      .then(({ data }) => setServices(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [cat]);

  return (
    <section style={{ padding: '3rem 1rem' }}>
      <div className="container">
        <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Nos Services</h1>

        <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={`btn btn-sm ${cat === c.value ? 'btn-primary' : 'btn-outline'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Chargement…</p>
        ) : services.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Aucun service disponible.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        )}
      </div>
    </section>
  );
}
