import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateFR } from '../../components/common/ui';

const FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINE', label: 'Terminés' },
  { value: 'VALIDE', label: 'Validés' },
  { value: 'REFUSE', label: 'Refusés' },
];

function StageModal({ stage, onClose, onSave }) {
  const [form, setForm] = useState({
    titre: '', dateDebut: '', dateFin: '', duree: '', objectif: '',
    apprenantId: '', encadrantId: '', entrepriseId: ''
  });
  const [apprenants, setApprenants] = useState([]);
  const [enseignants, setEnseignants] = useState([]);

  useEffect(() => {
    api.get('/apprenants').then(res => setApprenants(res.data)).catch(() => setApprenants([]));
    api.get('/enseignants').then(res => setEnseignants(res.data)).catch(() => setEnseignants([]));
  }, []);

  useEffect(() => {
    if (stage) {
      setForm({
        titre: stage.titre || '', dateDebut: stage.dateDebut || '',
        dateFin: stage.dateFin || '', duree: stage.duree || '',
        objectif: stage.objectif || '', apprenantId: stage.apprenantId || '',
        encadrantId: stage.encadrantId || '', entrepriseId: stage.entrepriseId || ''
      });
    }
  }, [stage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, duree: Number(form.duree) };
    if (payload.apprenantId) payload.apprenantId = Number(payload.apprenantId);
    else delete payload.apprenantId;
    if (payload.encadrantId) payload.encadrantId = Number(payload.encadrantId);
    else delete payload.encadrantId;
    if (payload.entrepriseId) payload.entrepriseId = Number(payload.entrepriseId);
    else delete payload.entrepriseId;
    onSave(payload);
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={`${ui.modalPanel} max-w-lg`}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            {stage ? 'Édition' : 'Nouveau stage'}
          </p>
          <h2 className={ui.modalTitle}>
            {stage ? stage.titre : 'Créer une convention de stage'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div>
            <label className={ui.label}>Intitulé du stage</label>
            <input className={ui.input} placeholder="Développement d'une plateforme..."
              value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} required />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={ui.label}>Début</label>
              <input className={ui.input} type="date"
                value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required />
            </div>
            <div>
              <label className={ui.label}>Fin</label>
              <input className={ui.input} type="date"
                value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} required />
            </div>
            <div>
              <label className={ui.label}>Durée (sem.)</label>
              <input className={ui.input} type="number"
                value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className={ui.label}>Objectif du stage</label>
            <textarea className={ui.input} rows={3}
              placeholder="Mission de l'élève, ce qu'il doit apprendre..."
              value={form.objectif} onChange={e => setForm({ ...form, objectif: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Apprenant</label>
              <select className={ui.input}
                value={form.apprenantId} onChange={e => setForm({ ...form, apprenantId: e.target.value })}>
                <option value="">Non affecté</option>
                {apprenants.map(a => (
                  <option key={a.codeUtilisateur} value={a.codeUtilisateur}>{a.prenom} {a.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={ui.label}>Tuteur école</label>
              <select className={ui.input}
                value={form.encadrantId} onChange={e => setForm({ ...form, encadrantId: e.target.value })}>
                <option value="">Non affecté</option>
                {enseignants.map(e => (
                  <option key={e.codeUtilisateur} value={e.codeUtilisateur}>{e.prenom} {e.nom}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" className={ui.btnPrimary}>
              {stage ? 'Enregistrer' : 'Créer le stage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Stages() {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadStages(); }, []);

  const loadStages = () => {
    api.get('/stages')
      .then(res => setStages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (payload) => {
    const request = editing
      ? api.put(`/stages/${editing.refStage}`, payload)
      : api.post('/stages', payload);
    request.then(() => { loadStages(); setShowModal(false); setEditing(null); }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirmer la suppression de ce stage ?')) return;
    api.delete(`/stages/${id}`).then(() => loadStages()).catch(console.error);
  };

  const filtered = filter ? stages.filter(s => s.statut === filter) : stages;

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
            <p className={ui.kicker}>Liste des stages</p>
            <h1 className={ui.pageTitle}>Stages</h1>
            <p className={ui.pageLead}>
              {stages.length} stage{stages.length > 1 ? 's' : ''} en cours ou terminé{stages.length > 1 ? 's' : ''}.
              Triez par statut pour voir ce qu'il reste à traiter.
            </p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
            Créer un stage
          </button>
        </div>
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
              <th className={ui.th}>Intitulé</th>
              <th className={ui.th}>Début</th>
              <th className={ui.th}>Fin</th>
              <th className={ui.th}>Apprenant</th>
              <th className={ui.th}>Encadrant</th>
              <th className={ui.th}>Statut</th>
              <th className={`${ui.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {filtered.map(s => (
              <tr key={s.refStage} className={ui.tr}>
                <td className={ui.tdStrong}>
                  <span className="font-display text-base">{s.titre}</span>
                </td>
                <td className={`${ui.td} font-mono text-xs`}>{formatDateFR(s.dateDebut)}</td>
                <td className={`${ui.td} font-mono text-xs`}>{formatDateFR(s.dateFin)}</td>
                <td className={ui.td}>
                  {s.apprenantNom ? `${s.apprenantPrenom || ''} ${s.apprenantNom}`.trim() : '-'}
                </td>
                <td className={ui.td}>
                  {s.encadrantNom ? `${s.encadrantPrenom || ''} ${s.encadrantNom}`.trim() : '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={badgeClass(s.statut)}>{statutLabel(s.statut)}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(s); setShowModal(true); }}
                      className="text-sm text-ink-600 transition hover:text-brand-700">Éditer</button>
                    <button onClick={() => handleDelete(s.refStage)}
                      className="text-sm text-accent-600 transition hover:text-accent-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-sm text-ink-500">
                  Aucun stage dans cette catégorie.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && <StageModal stage={editing} onClose={() => { setShowModal(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
