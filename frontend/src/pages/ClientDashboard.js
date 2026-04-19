import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import MessageBox from '../components/MessageBox';

export default function ClientDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine')
      .then(({ data }) => setOrders(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={{ padding: '2.5rem 1rem' }}>
      <div className="container">
        <h1 style={{ marginBottom: '.5rem' }}>Bonjour, {user.name} 👋</h1>
        <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>Suivi de vos commandes</p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <Link to="/order" className="btn btn-primary">+ Nouvelle commande</Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--gray)' }}>Chargement…</p>
        ) : orders.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--gray)', marginBottom: '1.5rem' }}>Vous n'avez aucune commande pour le moment.</p>
            <Link to="/services" className="btn btn-primary">Voir les services</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="card"
                  style={{ cursor: 'pointer', border: selected?.id === o.id ? '2px solid var(--primary)' : '2px solid transparent' }}
                  onClick={() => setSelected(selected?.id === o.id ? null : o)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
                    <div>
                      <strong>{o.service?.title}</strong>
                      <p style={{ color: 'var(--gray)', fontSize: '.85rem', marginTop: 2 }}>
                        Commande #{o.id} · {new Date(o.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <StatusBadge status={o.status} />
                  </div>
                  <p style={{ color: 'var(--gray)', fontSize: '.9rem', marginTop: '.75rem' }}>
                    {o.description.slice(0, 120)}{o.description.length > 120 ? '…' : ''}
                  </p>
                </div>
              ))}
            </div>

            {selected && (
              <div>
                <MessageBox orderId={selected.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
