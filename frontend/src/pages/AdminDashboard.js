import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import MessageBox from '../components/MessageBox';

const TABS = ['Statistiques', 'Commandes', 'Services', 'Clients', 'Portfolio'];
const STATUS_OPTIONS = ['pending', 'in_progress', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Statistiques');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Service form
  const [svcForm, setSvcForm] = useState({ title: '', description: '', price: '', category: 'website' });
  const [svcImg, setSvcImg] = useState(null);
  const [svcEdit, setSvcEdit] = useState(null);

  // Portfolio form
  const [pfForm, setPfForm] = useState({ title: '', description: '', category: 'website', url: '' });
  const [pfImg, setPfImg] = useState(null);
  const [pfEdit, setPfEdit] = useState(null);

  useEffect(() => {
    if (tab === 'Statistiques') api.get('/admin/dashboard').then(({ data }) => setStats(data.data)).catch(console.error);
    if (tab === 'Commandes')    api.get('/orders').then(({ data }) => setOrders(data.data)).catch(console.error);
    if (tab === 'Services')     api.get('/services').then(({ data }) => setServices(data.data)).catch(console.error);
    if (tab === 'Clients')      api.get('/admin/clients').then(({ data }) => setClients(data.data)).catch(console.error);
    if (tab === 'Portfolio')    api.get('/portfolio').then(({ data }) => setPortfolio(data.data)).catch(console.error);
  }, [tab]);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  const saveService = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(svcForm).forEach(([k, v]) => fd.append(k, v));
    if (svcImg) fd.append('image', svcImg);
    if (svcEdit) {
      await api.put(`/services/${svcEdit}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await api.post('/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    api.get('/services').then(({ data }) => setServices(data.data));
    setSvcForm({ title: '', description: '', price: '', category: 'website' });
    setSvcImg(null);
    setSvcEdit(null);
  };

  const deleteService = async (id) => {
    await api.delete(`/services/${id}`);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const savePortfolio = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(pfForm).forEach(([k, v]) => fd.append(k, v));
    if (pfImg) fd.append('image', pfImg);
    if (pfEdit) {
      await api.put(`/portfolio/${pfEdit}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await api.post('/portfolio', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    api.get('/portfolio').then(({ data }) => setPortfolio(data.data));
    setPfForm({ title: '', description: '', category: 'website', url: '' });
    setPfImg(null);
    setPfEdit(null);
  };

  const deletePortfolio = async (id) => {
    await api.delete(`/portfolio/${id}`);
    setPortfolio((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section style={{ padding: '2rem 1rem' }}>
      <div className="container">
        <h1 style={{ marginBottom: '1.5rem' }}>Dashboard Admin</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-outline'}`}>{t}</button>
          ))}
        </div>

        {/* ---- STATS ---- */}
        {tab === 'Statistiques' && stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Total commandes', value: stats.totalOrders },
              { label: 'Clients actifs',  value: stats.totalClients },
              { label: 'Revenus livrés',  value: `${Number(stats.revenue).toLocaleString()} MAD` },
            ].map((s) => (
              <div key={s.label} className="card" style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--gray)', marginBottom: '.5rem' }}>{s.label}</p>
                <strong style={{ fontSize: '2rem', color: 'var(--primary)' }}>{s.value}</strong>
              </div>
            ))}
            <div className="card" style={{ gridColumn: '1 / -1' }}>
              <h3 style={{ marginBottom: '1rem' }}>Commandes par statut</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {stats.ordersByStatus?.map((s) => (
                  <div key={s.status} style={{ textAlign: 'center' }}>
                    <StatusBadge status={s.status} />
                    <strong style={{ display: 'block', marginTop: '.4rem' }}>{s.count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- ORDERS ---- */}
        {tab === 'Commandes' && (
          <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
            <div>
              {orders.map((o) => (
                <div key={o.id} className="card" style={{ marginBottom: '1rem', cursor: 'pointer', border: selectedOrder?.id === o.id ? '2px solid var(--primary)' : '2px solid transparent' }}
                  onClick={() => setSelectedOrder(selectedOrder?.id === o.id ? null : o)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '.5rem' }}>
                    <div>
                      <strong>{o.service?.title}</strong>
                      <p style={{ fontSize: '.85rem', color: 'var(--gray)' }}>{o.client?.name} · #{o.id}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                      <StatusBadge status={o.status} />
                      <select
                        value={o.status}
                        onChange={(e) => { e.stopPropagation(); updateStatus(o.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '.3rem .6rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {selectedOrder && <MessageBox orderId={selectedOrder.id} />}
          </div>
        )}

        {/* ---- SERVICES ---- */}
        {tab === 'Services' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>{svcEdit ? 'Modifier service' : 'Ajouter un service'}</h3>
              <form className="card" onSubmit={saveService}>
                {['title', 'description', 'price'].map((f) => (
                  <div className="form-group" key={f}>
                    <label style={{ textTransform: 'capitalize' }}>{f}</label>
                    {f === 'description'
                      ? <textarea value={svcForm[f]} onChange={(e) => setSvcForm({ ...svcForm, [f]: e.target.value })} required />
                      : <input value={svcForm[f]} onChange={(e) => setSvcForm({ ...svcForm, [f]: e.target.value })} required type={f === 'price' ? 'number' : 'text'} />
                    }
                  </div>
                ))}
                <div className="form-group">
                  <label>Catégorie</label>
                  <select value={svcForm.category} onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })}>
                    <option value="website">Site Web</option>
                    <option value="mobile">App Mobile</option>
                    <option value="redesign">Refonte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setSvcImg(e.target.files[0])} />
                </div>
                <div style={{ display: 'flex', gap: '.75rem' }}>
                  <button className="btn btn-primary" type="submit">{svcEdit ? 'Modifier' : 'Ajouter'}</button>
                  {svcEdit && <button className="btn btn-outline" type="button" onClick={() => { setSvcEdit(null); setSvcForm({ title: '', description: '', price: '', category: 'website' }); }}>Annuler</button>}
                </div>
              </form>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Services ({services.length})</h3>
              {services.map((s) => (
                <div key={s.id} className="card" style={{ marginBottom: '.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{s.title}</strong>
                    <p style={{ fontSize: '.85rem', color: 'var(--gray)' }}>{Number(s.price).toLocaleString()} MAD</p>
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => { setSvcEdit(s.id); setSvcForm({ title: s.title, description: s.description, price: s.price, category: s.category }); }}>Éditer</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteService(s.id)}>Suppr.</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- CLIENTS ---- */}
        {tab === 'Clients' && (
          <div>
            {clients.map((c) => (
              <div key={c.id} className="card" style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div>
                    <strong>{c.name}</strong>
                    <p style={{ fontSize: '.85rem', color: 'var(--gray)' }}>{c.email}</p>
                  </div>
                  <span style={{ color: 'var(--gray)', fontSize: '.85rem' }}>{c.orders?.length || 0} commande(s)</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---- PORTFOLIO ---- */}
        {tab === 'Portfolio' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>{pfEdit ? 'Modifier le projet' : 'Ajouter un projet'}</h3>
              <form className="card" onSubmit={savePortfolio}>
                {[{ f: 'title', label: 'Titre' }, { f: 'description', label: 'Description' }, { f: 'url', label: 'URL du projet' }].map(({ f, label }) => (
                  <div className="form-group" key={f}>
                    <label>{label}</label>
                    {f === 'description'
                      ? <textarea value={pfForm[f]} onChange={(e) => setPfForm({ ...pfForm, [f]: e.target.value })} />
                      : <input value={pfForm[f]} onChange={(e) => setPfForm({ ...pfForm, [f]: e.target.value })} required={f === 'title'} />
                    }
                  </div>
                ))}
                <div className="form-group">
                  <label>Catégorie</label>
                  <select value={pfForm.category} onChange={(e) => setPfForm({ ...pfForm, category: e.target.value })}>
                    <option value="website">Site Web</option>
                    <option value="mobile">App Mobile</option>
                    <option value="redesign">Refonte</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setPfImg(e.target.files[0])} />
                </div>
                <div style={{ display: 'flex', gap: '.75rem' }}>
                  <button className="btn btn-primary" type="submit">{pfEdit ? 'Modifier' : 'Ajouter'}</button>
                  {pfEdit && (
                    <button className="btn btn-outline" type="button" onClick={() => {
                      setPfEdit(null);
                      setPfForm({ title: '', description: '', category: 'website', url: '' });
                      setPfImg(null);
                    }}>
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Projets ({portfolio.length})</h3>
              {portfolio.map((p) => (
                <div key={p.id} className="card" style={{ marginBottom: '.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
                    {p.image && <img src={p.image} alt={p.title} style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
                    <div>
                      <strong>{p.title}</strong>
                      <p style={{ fontSize: '.8rem', color: 'var(--gray)' }}>{p.category}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      setPfEdit(p.id);
                      setPfForm({ title: p.title, description: p.description || '', category: p.category, url: p.url || '' });
                    }}>Éditer</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deletePortfolio(p.id)}>Suppr.</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
