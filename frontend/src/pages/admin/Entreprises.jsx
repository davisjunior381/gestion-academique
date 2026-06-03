import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui } from '../../components/common/ui';

function EntrepriseModal({ entreprise, onClose, onSave }) {
  const [form, setForm] = useState({
    nom: '', secteur: '', adresse: '', emailContact: ''
  });

  useEffect(() => {
    if (entreprise) {
      setForm({
        nom: entreprise.nom || '', secteur: entreprise.secteur || '',
        adresse: entreprise.adresse || '', emailContact: entreprise.emailContact || ''
      });
    }
  }, [entreprise]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            {entreprise ? 'Édition' : 'Nouveau partenaire'}
          </p>
          <h2 className={ui.modalTitle}>
            {entreprise ? entreprise.nom : 'Ajouter une entreprise'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div>
            <label className={ui.label}>Raison sociale</label>
            <input className={ui.input} value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })} required />
          </div>
          <div>
            <label className={ui.label}>Secteur d'activité</label>
            <input className={ui.input} placeholder="Conseil, industrie, services..." value={form.secteur}
              onChange={e => setForm({ ...form, secteur: e.target.value })} />
          </div>
          <div>
            <label className={ui.label}>Adresse postale</label>
            <textarea className={ui.input} rows={2} value={form.adresse}
              onChange={e => setForm({ ...form, adresse: e.target.value })} />
          </div>
          <div>
            <label className={ui.label}>Email de contact</label>
            <input className={ui.input} type="email" value={form.emailContact}
              onChange={e => setForm({ ...form, emailContact: e.target.value })} />
          </div>
          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" className={ui.btnPrimary}>
              {entreprise ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Entreprises() {
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadEntreprises(); }, []);

  const loadEntreprises = () => {
    api.get('/entreprises')
      .then(res => setEntreprises(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (form) => {
    const request = editing
      ? api.put(`/entreprises/${editing.siretEntreprise}`, form)
      : api.post('/entreprises', form);
    request.then(() => { loadEntreprises(); setShowModal(false); setEditing(null); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirmer la suppression de cette entreprise ?')) return;
    api.delete(`/entreprises/${id}`).then(() => loadEntreprises()).catch(console.error);
  };

  const filtered = entreprises.filter(e =>
    `${e.nom} ${e.secteur || ''} ${e.emailContact || ''}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div>
      <header className={ui.pageHeader}>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className={ui.kicker}>Entreprises</p>
            <h1 className={ui.pageTitle}>Entreprises partenaires</h1>
            <p className={ui.pageLead}>
              {entreprises.length} entreprise{entreprises.length > 1 ? 's' : ''} qui accueille
              {entreprises.length > 1 ? 'nt' : ''} des stagiaires de l'ESEO.
            </p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
            Ajouter une entreprise
          </button>
        </div>
      </header>

      <div className="mb-4 max-w-md">
        <input className={ui.input} placeholder="Rechercher par raison sociale, secteur..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.thead}>
            <tr>
              <th className={ui.th}>Raison sociale</th>
              <th className={ui.th}>Secteur</th>
              <th className={ui.th}>Adresse</th>
              <th className={ui.th}>Contact</th>
              <th className={`${ui.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {filtered.map(e => (
              <tr key={e.siretEntreprise} className={ui.tr}>
                <td className={ui.tdStrong}>
                  <span className="font-display text-base">{e.nom}</span>
                </td>
                <td className={ui.td}>{e.secteur || '-'}</td>
                <td className={`${ui.td} max-w-xs truncate`}>{e.adresse || '-'}</td>
                <td className={ui.td}>{e.emailContact || '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(e); setShowModal(true); }}
                      className="text-sm text-ink-600 transition hover:text-brand-700">Éditer</button>
                    <button onClick={() => handleDelete(e.siretEntreprise)}
                      className="text-sm text-accent-600 transition hover:text-accent-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-ink-500">
                  Aucune entreprise ne correspond à votre recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EntrepriseModal entreprise={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave} />
      )}
    </div>
  );
}
