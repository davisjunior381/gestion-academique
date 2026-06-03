import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateFR } from '../../components/common/ui';

const FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'DEPOSE', label: 'Déposés' },
  { value: 'EVALUE', label: 'Évalués' },
  { value: 'VALIDE', label: 'Validés' },
  { value: 'REJETE', label: 'Rejetés' },
];

function EvaluationModal({ rapport, onClose, onSave }) {
  const [form, setForm] = useState({ note: '', commentaire: '', evaluateurId: '' });
  const [enseignants, setEnseignants] = useState([]);

  useEffect(() => {
    api.get('/enseignants').then(res => setEnseignants(res.data)).catch(console.error);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(rapport.refRapport, {
      note: Number(form.note),
      commentaire: form.commentaire,
      evaluateurId: Number(form.evaluateurId)
    });
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            Notation
          </p>
          <h2 className={ui.modalTitle}>{rapport.stageTitre || 'Rapport de stage'}</h2>
        </div>
        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div>
            <label className={ui.label}>Note sur 20</label>
            <input className={ui.input} type="number" min="0" max="20" step="0.5"
              placeholder="15,5"
              value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} required />
          </div>
          <div>
            <label className={ui.label}>Commentaire</label>
            <textarea className={ui.input} rows={4}
              placeholder="Ce qui est bien, ce qui peut être amélioré..."
              value={form.commentaire}
              onChange={e => setForm({ ...form, commentaire: e.target.value })} />
          </div>
          <div>
            <label className={ui.label}>Prof qui note</label>
            <select className={ui.input} required
              value={form.evaluateurId}
              onChange={e => setForm({ ...form, evaluateurId: e.target.value })}>
              <option value="">Choisir un enseignant</option>
              {enseignants.map(e => (
                <option key={e.codeUtilisateur} value={e.codeUtilisateur}>
                  {e.prenom} {e.nom}
                </option>
              ))}
            </select>
          </div>
          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" className={ui.btnPrimary}>Enregistrer la note</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Rapports() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadRapports(); }, []);

  const loadRapports = () => {
    api.get('/rapports')
      .then(res => setRapports(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleEvaluer = (rapportId, evaluation) => {
    api.post(`/rapports/${rapportId}/evaluer`, evaluation)
      .then(() => { loadRapports(); setEvaluating(null); })
      .catch(console.error);
  };

  const handleValider = (id) => {
    api.patch(`/rapports/${id}/valider`).then(() => loadRapports()).catch(console.error);
  };

  const handleRejeter = (id) => {
    api.patch(`/rapports/${id}/rejeter`).then(() => loadRapports()).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirmer la suppression de ce rapport ?')) return;
    api.delete(`/rapports/${id}`).then(() => loadRapports()).catch(console.error);
  };

  const filtered = filter ? rapports.filter(r => r.statut === filter) : rapports;

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
        <p className={ui.kicker}>Suivi des rapports</p>
        <h1 className={ui.pageTitle}>Rapports de stage</h1>
        <p className={ui.pageLead}>
          {rapports.length} rapport{rapports.length > 1 ? 's' : ''} déposé{rapports.length > 1 ? 's' : ''}, en cours de
          notation par les profs ou de validation par l'admin.
        </p>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-1 border-b border-ink-200 pb-3">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`rounded-sm px-3 py-1 font-mono text-[11px] uppercase tracking-wider transition ${
              filter === f.value
                ? 'bg-ink-900 text-ink-50'
                : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
            }`}>
            {f.label}
          </button>
        ))}
        <span className="ml-auto font-mono text-[11px] uppercase tracking-wider text-ink-400">
          {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.thead}>
            <tr>
              <th className={ui.th}>Stage</th>
              <th className={ui.th}>Déposé le</th>
              <th className={ui.th}>Note</th>
              <th className={ui.th}>Noté par</th>
              <th className={ui.th}>Statut</th>
              <th className={`${ui.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {filtered.map(r => (
              <tr key={r.refRapport} className={ui.tr}>
                <td className={ui.tdStrong}>{r.stageTitre || 'Sans titre'}</td>
                <td className={`${ui.td} font-mono text-xs`}>{formatDateFR(r.dateDepot)}</td>
                <td className={`${ui.td} font-mono`}>
                  {r.note != null
                    ? <span className="text-ink-900">{r.note}<span className="text-ink-400">/20</span></span>
                    : '-'}
                </td>
                <td className={ui.td}>
                  {r.evaluateurNom ? `${r.evaluateurPrenom || ''} ${r.evaluateurNom}`.trim() : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={badgeClass(r.statut)}>{statutLabel(r.statut)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    {r.statut === 'DEPOSE' && (
                      <button onClick={() => setEvaluating(r)}
                        className="text-sm text-brand-700 transition hover:text-brand-800">Évaluer</button>
                    )}
                    {r.statut === 'EVALUE' && (
                      <>
                        <button onClick={() => handleValider(r.refRapport)}
                          className="text-sm text-success-700 transition hover:text-success-500">Valider</button>
                        <button onClick={() => handleRejeter(r.refRapport)}
                          className="text-sm text-accent-600 transition hover:text-accent-700">Rejeter</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(r.refRapport)}
                      className="text-sm text-ink-400 transition hover:text-accent-600">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink-500">
                  Aucun rapport dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {evaluating && <EvaluationModal rapport={evaluating} onClose={() => setEvaluating(null)} onSave={handleEvaluer} />}
    </div>
  );
}
