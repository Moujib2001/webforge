import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const categoryLabel = { website: 'Site Web', mobile: 'App Mobile', redesign: 'Refonte' };

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/services/${id}`)
      .then(({ data }) => setService(data.data))
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ textAlign: 'center', padding: '4rem' }}>Chargement…</p>;
  if (!service) return null;

  return (
    <section style={{ padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {service.image && (
          <img src={service.image} alt={service.title}
            style={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: '2rem' }} />
        )}
        <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '.85rem' }}>
          {categoryLabel[service.category]}
        </span>
        <h1 style={{ fontSize: '2rem', margin: '.5rem 0 1rem' }}>{service.title}</h1>
        <p style={{ color: 'var(--gray)', lineHeight: 1.8, marginBottom: '2rem' }}>{service.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <strong style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{Number(service.price).toLocaleString()} MAD</strong>
          {user ? (
            <Link to={`/order?service=${service.id}`} className="btn btn-primary">Commander ce service</Link>
          ) : (
            <Link to="/login" className="btn btn-primary">Se connecter pour commander</Link>
          )}
        </div>
      </div>
    </section>
  );
}
