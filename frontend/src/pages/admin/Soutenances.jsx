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
            <label className={ui.label}>Date et heure *</label>
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
            <label className={ui.label}>Stage évalué *</label>
            <select className={ui.input} required
              value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })}>
              <option value="">Choisir un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>
                  {s.titre} {s.apprenantNom ? `— ${s.apprenantPrenom} ${s.apprenantNom}` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={ui.label}>Jury</label>
            <select className={ui.input}
              value={form.juryId} onChange={e => setForm({ ...form, juryId: e.target.value })}>
              <option value="">À constituer ultérieurement</option>
              {jurys.map(j => (
                <option key={j.codeJury} value={j.codeJury}>{j.intitule} — {j.dateConstitution || ''}</option>
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

function JuryModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ intitule: '', dateConstitution: '', roleJury: 'PRESIDENT' });
  const [enseignants, setEnseignants] = useState([]);
  const [membres, setMembres] = useState([]);
  const [createdJury, setCreatedJury] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/enseignants').then(res => setEnseignants(res.data)).catch(console.error);
  }, []);

  const handleCreateJury = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/jurys', {
        intitule: form.intitule,
        dateConstitution: form.dateConstitution || new Date().toISOString().split('T')[0],
        roleJury: form.roleJury
      });
      setCreatedJury(res.data);
    } catch (err) {
      alert('Erreur lors de la création du jury');
    }
    setLoading(false);
  };

  const toggleMembre = async (enseignantId) => {
    if (!createdJury) return;
    const isMembre = membres.includes(enseignantId);
    try {
      if (isMembre) {
        setMembres(membres.filter(m => m !== enseignantId));
      } else {
        await api.post(`/jurys/${createdJury.codeJury}/membres/${enseignantId}`);
        setMembres([...membres, enseignantId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">Jurys</p>
          <h2 className={ui.modalTitle}>Constituer un jury</h2>
        </div>
        <div className={ui.modalBody}>
          {!createdJury ? (
            <form onSubmit={handleCreateJury}>
              <div className="space-y-3">
                <div>
                  <label className={ui.label}>Intitulé du jury *</label>
                  <input className={ui.input} placeholder="Ex: Jury Juin 2026"
                    value={form.intitule} onChange={e => setForm({ ...form, intitule: e.target.value })} required />
                </div>
                <div>
                  <label className={ui.label}>Date de constitution</label>
                  <input className={ui.input} type="date"
                    value={form.dateConstitution} onChange={e => setForm({ ...form, dateConstitution: e.target.value })} />
                </div>
              </div>
              <div className={ui.modalFooter}>
                <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
                <button type="submit" className={ui.btnPrimary} disabled={loading}>
                  {loading ? 'Création...' : 'Créer le jury'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
                Jury <strong>{createdJury.intitule}</strong> créé. Sélectionnez les membres :
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {enseignants.map(e => (
                  <div key={e.codeUtilisateur}
                    onClick={() => toggleMembre(e.codeUtilisateur)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition ${
                      membres.includes(e.codeUtilisateur)
                        ? 'border-brand-400 bg-brand-50'
                        : 'border-ink-200 hover:bg-ink-50'
                    }`}>
                    <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
                      membres.includes(e.codeUtilisateur) ? 'border-brand-600 bg-brand-600' : 'border-ink-300'
                    }`}>
                      {membres.includes(e.codeUtilisateur) && (
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink-800">{e.prenom} {e.nom}</p>
                      {e.grade && <p className="text-xs text-ink-400">{e.grade} — {e.specialite}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-ink-400">{membres.length} membre{membres.length > 1 ? 's' : ''} sélectionné{membres.length > 1 ? 's' : ''}</div>
              <div className={ui.modalFooter}>
                <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
                <button onClick={() => { onSaved(); onClose(); }} className={ui.btnPrimary}>
                  Terminer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Soutenances() {
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showJuryModal, setShowJuryModal] = useState(false);
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
          <div className="flex gap-3">
            <button onClick={() => setShowJuryModal(true)} className={ui.btnSecondary}>
              Constituer un jury
            </button>
            <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
              Planifier une soutenance
            </button>
          </div>
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

      {showJuryModal && (
        <JuryModal
          onClose={() => setShowJuryModal(false)}
          onSaved={() => {}}
        />
      )}
    </div>
  );
}
