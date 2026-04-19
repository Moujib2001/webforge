import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

export default function Order() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ service_id: params.get('service') || '', description: '', budget: '' });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/services').then(({ data }) => setServices(data.data)).catch(console.error);
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('service_id', form.service_id);
      fd.append('description', form.description);
      if (form.budget) fd.append('budget', form.budget);
      files.forEach((f) => fd.append('files', f));

      await api.post('/orders', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Commande envoyée ! Nous vous contacterons prochainement.');
      setTimeout(() => navigate('/dashboard'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande');
    }
    setLoading(false);
  };

  return (
    <section style={{ padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 style={{ marginBottom: '2rem' }}>Passer une commande</h1>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={submit} className="card">
          <div className="form-group">
            <label>Service *</label>
            <select name="service_id" value={form.service_id} onChange={handle} required>
              <option value="">— Choisir un service —</option>
              {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Description du projet *</label>
            <textarea name="description" value={form.description} onChange={handle} required
              placeholder="Décrivez votre projet, vos attentes, votre audience cible…" />
          </div>
          <div className="form-group">
            <label>Budget estimé (MAD)</label>
            <input name="budget" type="number" min="0" value={form.budget} onChange={handle} placeholder="ex: 5000" />
          </div>
          <div className="form-group">
            <label>Fichiers de référence (logo, images, doc… max 5)</label>
            <input type="file" multiple accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip"
              onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))} />
            {files.length > 0 && (
              <small style={{ color: 'var(--gray)' }}>{files.length} fichier(s) sélectionné(s)</small>
            )}
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Envoi en cours…' : 'Envoyer la commande'}
          </button>
        </form>
      </div>
    </section>
  );
}
