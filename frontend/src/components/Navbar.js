import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>Web<span style={{ color: 'var(--secondary)' }}>Forge</span></Link>

        <button style={styles.burger} onClick={() => setOpen(!open)} aria-label="menu">☰</button>

        <ul style={{ ...styles.links, ...(open ? styles.linksOpen : {}) }}>
          <li><Link to="/services" onClick={() => setOpen(false)}>Services</Link></li>
          <li><Link to="/portfolio" onClick={() => setOpen(false)}>Portfolio</Link></li>
          {user ? (
            <>
              <li>
                <Link to={isAdmin ? '/admin' : '/dashboard'} onClick={() => setOpen(false)}>
                  {isAdmin ? 'Admin' : 'Mon espace'}
                </Link>
              </li>
              <li>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Déconnexion</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setOpen(false)}>Connexion</Link></li>
              <li><Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>S'inscrire</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

const styles = {
  nav: { background: '#fff', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '.9rem 1rem' },
  logo: { fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' },
  burger: { display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  links: { display: 'flex', alignItems: 'center', gap: '1.5rem', listStyle: 'none' },
  linksOpen: {},
};
