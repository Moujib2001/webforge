const labels = {
  pending:     'En attente',
  in_progress: 'En cours',
  delivered:   'Livré',
  cancelled:   'Annulé',
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{labels[status] || status}</span>;
}
