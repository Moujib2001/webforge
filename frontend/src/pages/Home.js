import { Link } from 'react-router-dom';

const features = [
  { icon: '🌐', title: 'Création de site web', desc: 'Sites vitrine, e-commerce, blogs — modernes et performants.' },
  { icon: '📱', title: 'Application mobile', desc: 'Apps iOS & Android sur mesure pour vos besoins métiers.' },
  { icon: '♻️', title: 'Refonte de site', desc: 'Donnez un nouveau souffle à votre présence en ligne.' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: '#fff', padding: '6rem 1rem', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: '1rem' }}>
            Transformez vos idées en réalité digitale
          </h1>
          <p style={{ fontSize: '1.15rem', opacity: .9, maxWidth: 600, margin: '0 auto 2rem' }}>
            WebForge crée des sites web, applications mobiles et refonte de sites pour des entreprises ambitieuses.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn" style={{ background: '#fff', color: 'var(--primary)' }}>Voir les services</Link>
            <Link to="/register" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>Commencer maintenant</Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 1rem' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Nos services</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '.5rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--gray)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--dark)', color: '#fff', padding: '4rem 1rem', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Prêt à démarrer votre projet ?</h2>
          <p style={{ opacity: .8, marginBottom: '2rem' }}>Créez votre compte et passez commande en quelques minutes.</p>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.05rem' }}>Créer un compte gratuit</Link>
        </div>
      </section>
    </div>
  );
}
