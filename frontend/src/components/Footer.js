export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', color: '#d1d5db', padding: '2rem 1rem', marginTop: '4rem' }}>
      <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
          Web<span style={{ color: 'var(--secondary)' }}>Forge</span>
        </span>
        <p style={{ fontSize: '.85rem' }}>© {new Date().getFullYear()} WebForge. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
