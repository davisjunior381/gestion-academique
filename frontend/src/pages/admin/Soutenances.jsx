import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, badgeClass, statutLabel, formatDateTimeFR } from '../../components/common/ui';

function SoutenanceModal({ soutenance, onClose, onSave }) {
  const [form, setForm] = useState({
    date: '', salle: '', duree: 60, stageId: '', juryId: ''
  });
  const [stages, setStages] = useState([]);
  const [jurys, setJurys] = useState([]);

  useEffect(() => {
    api.get('/stages').then(res => setStages(res.data)).catch(console.error);
    api.get('/jurys').then(res => setJurys(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (soutenance) {
      setForm({
        date: soutenance.date ? soutenance.date.slice(0, 16) : '',
        salle: soutenance.salle || '',
        duree: soutenance.duree || 60,
        stageId: soutenance.stageId || '',
        juryId: soutenance.juryId || ''
      });
    }
  }, [soutenance]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      stageId: Number(form.stageId),
      juryId: form.juryId ? Number(form.juryId) : null,
      duree: Number(form.duree)
    });
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            {soutenance ? 'Édition' : 'Nouvelle soutenance'}
          </p>
          <h2 className={ui.modalTitle}>
            {soutenance ? 'Modifier la planification' : 'Planifier une soutenance'}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Renseignez la date, la salle, le stage évalué et le jury composé.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div>
            <label className={ui.label}>Date et heure</label>
            <input className={ui.input} type="datetime-local"
              value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={ui.label}>Salle</label>
              <input className={ui.input} placeholder="Amphi A, B204..."
                value={form.salle} onChange={e => setForm({ ...form, salle: e.target.value })} />
            </div>
            <div>
              <label className={ui.label}>Durée (minutes)</label>
              <input className={ui.input} type="number" min="15" step="5"
                value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={ui.label}>Stage évalué</label>
            <select className={ui.input} required
              value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })}>
              <option value="">Choisir un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>{s.titre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={ui.label}>Jury</label>
            <select className={ui.input}
              value={form.juryId} onChange={e => setForm({ ...form, juryId: e.target.value })}>
              <option value="">À constituer ultérieurement</option>
              {jurys.map(j => (
                <option key={j.codeJury} value={j.codeJury}>{j.intitule}</option>
              ))}
            </select>
          </div>

          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" className={ui.btnPrimary}>
              {soutenance ? 'Enregistrer' : 'Planifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Soutenances() {
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => { loadSoutenances(); }, []);

  const loadSoutenances = () => {
    api.get('/soutenances')
      .then(res => setSoutenances(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = (form) => {
    const request = editing
      ? api.put(`/soutenances/${editing.refSoutenance}`, form)
      : api.post('/soutenances', form);
    request.then(() => {
      loadSoutenances();
      setShowModal(false);
      setEditing(null);
    }).catch(console.error);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Confirmer la suppression de cette soutenance ?')) return;
    api.delete(`/soutenances/${id}`).then(() => loadSoutenances()).catch(console.error);
  };

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
            <p className={ui.kicker}>Planning</p>
            <h1 className={ui.pageTitle}>Soutenances</h1>
            <p className={ui.pageLead}>
              {soutenances.length} soutenance{soutenances.length > 1 ? 's' : ''} prévue{soutenances.length > 1 ? 's' : ''}.
              Vous pouvez modifier la date, la salle ou le jury jusqu'à la veille.
            </p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
            Planifier une soutenance
          </button>
        </div>
      </header>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead className={ui.thead}>
            <tr>
              <th className={ui.th}>Date</th>
              <th className={ui.th}>Salle</th>
              <th className={ui.th}>Stage</th>
              <th className={ui.th}>Jury</th>
              <th className={ui.th}>Statut</th>
              <th className={`${ui.th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className={ui.tbody}>
            {soutenances.map(s => (
              <tr key={s.refSoutenance} className={ui.tr}>
                <td className={`${ui.tdStrong} font-mono text-xs`}>{formatDateTimeFR(s.date)}</td>
                <td className={ui.td}>{s.salle || '-'}</td>
                <td className={ui.td}>{s.stageTitre || '-'}</td>
                <td className={ui.td}>
                  {s.juryIntitule || <span className="italic text-ink-400">À constituer</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={badgeClass(s.statut || 'PLANIFIEE')}>
                    {statutLabel(s.statut || 'PLANIFIEE')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(s); setShowModal(true); }}
                      className="text-sm text-ink-600 transition hover:text-brand-700">Éditer</button>
                    <button onClick={() => handleDelete(s.refSoutenance)}
                      className="text-sm text-accent-600 transition hover:text-accent-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {soutenances.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-ink-500">
                  Aucune soutenance n'est planifiée pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SoutenanceModal
          soutenance={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
