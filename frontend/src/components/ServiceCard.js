import { Link } from 'react-router-dom';

const categoryLabel = { website: 'Site Web', mobile: 'App Mobile', redesign: 'Refonte' };

export default function ServiceCard({ service }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
      {service.image && (
        <img
          src={service.image}
          alt={service.title}
          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 'var(--radius)' }}
        />
      )}
      <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
        {categoryLabel[service.category]}
      </span>
      <h3 style={{ fontSize: '1.1rem' }}>{service.title}</h3>
      <p style={{ color: 'var(--gray)', fontSize: '.9rem', flexGrow: 1 }}>
        {service.description.slice(0, 100)}…
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{Number(service.price).toLocaleString()} MAD</strong>
        <Link to={`/services/${service.id}`} className="btn btn-outline btn-sm">Détails</Link>
      </div>
    </div>
  );
}
