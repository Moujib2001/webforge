import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 420 }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Créer un compte</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input name="name" value={form.name} onChange={handle} required placeholder="Votre nom" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handle} required placeholder="exemple@email.com" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input name="password" type="password" value={form.password} onChange={handle} required placeholder="Min. 8 caractères" minLength={8} />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: '.5rem' }}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '.9rem', color: 'var(--gray)' }}>
          Déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
