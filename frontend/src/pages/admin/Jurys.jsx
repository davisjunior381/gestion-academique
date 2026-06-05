import { useState, useEffect } from 'react';
import api from '../../services/api';
import { ui, formatDateFR } from '../../components/common/ui';

const inputClass = ui.input;

function JuryModal({ jury, onClose, onSave }) {
  const [form, setForm] = useState({
    intitule: jury?.intitule || '',
    roleJury: jury?.roleJury || 'JURY_SOUTENANCE',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({ ...form });
      onClose();
    } catch (err) {
      setSubmitting(false);
    }
  };

  return (
    <div className={ui.modalOverlay}>
      <div className={ui.modalPanel}>
        <div className={ui.modalHeader}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent-600">
            {jury ? 'Modification' : 'Nouveau jury'}
          </p>
          <h2 className={ui.modalTitle}>{jury ? 'Modifier le jury' : 'Créer un jury'}</h2>
        </div>
        <form onSubmit={handleSubmit} className={ui.modalBody}>
          <div>
            <label className={ui.label}>Intitulé</label>
            <input
              className={inputClass}
              placeholder="Ex : Jury Soutenances Juin 2026"
              value={form.intitule}
              onChange={e => setForm({ ...form, intitule: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={ui.label}>Type</label>
            <select
              className={inputClass}
              value={form.roleJury}
              onChange={e => setForm({ ...form, roleJury: e.target.value })}>
              <option value="JURY_SOUTENANCE">Jury de soutenance</option>
              <option value="JURY_RAPPORT">Jury de rapport</option>
              <option value="JURY_GENERAL">Jury général</option>
            </select>
          </div>
          <div className={ui.modalFooter}>
            <button type="button" onClick={onClose} className={ui.btnSecondary}>Annuler</button>
            <button type="submit" disabled={submitting} className={ui.btnPrimary}>
              {submitting ? 'Envoi...' : (jury ? 'Enregistrer' : 'Créer le jury')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MembresSection({ juryId }) {
  const [membres, setMembres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [selectedEnseignantId, setSelectedEnseignantId] = useState('');
  const [loading, setLoading] = useState(true);

  const loadJury = () => {
    Promise.all([
      api.get(`/jurys/${juryId}`).then(r => r.data),
      api.get('/enseignants').then(r => r.data),
    ])
      .then(([jury, ens]) => {
        setMembres(jury.membresNoms || []);
        setEnseignants(ens);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJury(); }, [juryId]);

  const ajouter = async () => {
    if (!selectedEnseignantId) return;
    try {
      await api.post(`/jurys/${juryId}/membres/${selectedEnseignantId}`);
      setSelectedEnseignantId('');
      loadJury();
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-400">Chargement des membres...</p>
    );
  }

  return (
    <div className="mt-3 rounded-sm border border-ink-200 bg-ink-50 p-3">
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-500">
        Membres ({membres.length})
      </p>
      {membres.length === 0 ? (
        <p className="text-xs italic text-ink-400">Aucun membre rattaché.</p>
      ) : (
        <ul className="mb-3 flex flex-wrap gap-2">
          {membres.map((nom, idx) => (
            <li key={idx}
              className="inline-flex items-center gap-2 rounded-sm bg-white px-2 py-1 text-xs text-ink-700 ring-1 ring-inset ring-ink-200">
              {nom}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-2 flex gap-2">
        <select
          className="flex-1 rounded-sm border border-ink-200 px-2 py-1 text-xs text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          value={selectedEnseignantId}
          onChange={e => setSelectedEnseignantId(e.target.value)}>
          <option value="">Ajouter un enseignant...</option>
          {enseignants.map(e => (
            <option key={e.codeUtilisateur} value={e.codeUtilisateur}>
              {e.prenom} {e.nom}
            </option>
          ))}
        </select>
        <button onClick={ajouter}
          className="rounded-sm bg-brand-700 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-800">
          Ajouter
        </button>
      </div>
    </div>
  );
}

export default function Jurys() {
  const [jurys, setJurys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const loadJurys = () => {
    api.get('/jurys')
      .then(res => setJurys(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJurys(); }, []);

  const handleSave = async (data) => {
    if (editing) {
      await api.put(`/jurys/${editing.codeJury}`, data);
    } else {
      await api.post('/jurys', data);
    }
    loadJurys();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce jury ?')) return;
    try {
      await api.delete(`/jurys/${id}`);
      loadJurys();
    } catch (err) { console.error(err); }
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
            <p className={ui.kicker}>Jurys de soutenance</p>
            <h1 className={ui.pageTitle}>Jurys</h1>
            <p className={ui.pageLead}>
              {jurys.length} jury{jurys.length > 1 ? 's' : ''} constitué{jurys.length > 1 ? 's' : ''} pour
              les soutenances. Ajoutez ou retirez des membres enseignants pour chaque jury.
            </p>
          </div>
          <button onClick={() => { setEditing(null); setShowModal(true); }} className={ui.btnPrimary}>
            Créer un jury
          </button>
        </div>
      </header>

      {jurys.length === 0 ? (
        <div className="rounded-sm border border-dashed border-ink-300 bg-white px-8 py-16 text-center">
          <p className="font-display text-xl font-medium text-ink-800">
            Aucun jury constitué pour l'instant.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-500">
            Créez un premier jury pour pouvoir le rattacher aux soutenances planifiées.
          </p>
          <button onClick={() => { setEditing(null); setShowModal(true); }}
            className={`${ui.btnPrimary} mt-6`}>
            Créer un jury
          </button>
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead className={ui.thead}>
              <tr>
                <th className={ui.th}>Intitulé</th>
                <th className={ui.th}>Type</th>
                <th className={ui.th}>Date de constitution</th>
                <th className={`${ui.th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={ui.tbody}>
              {jurys.map(j => (
                <tr key={j.codeJury} className={ui.tr}>
                  <td className={ui.tdStrong}>
                    <button
                      onClick={() => setExpandedId(expandedId === j.codeJury ? null : j.codeJury)}
                      className="font-medium text-ink-900 hover:underline">
                      {j.intitule || `Jury n°${j.codeJury}`}
                    </button>
                    {expandedId === j.codeJury && <MembresSection juryId={j.codeJury} />}
                  </td>
                  <td className={`${ui.td} font-mono text-xs`}>{j.roleJury || '-'}</td>
                  <td className={`${ui.td} font-mono text-xs`}>{formatDateFR(j.dateConstitution)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => { setEditing(j); setShowModal(true); }}
                        className="text-sm text-brand-700 transition hover:text-brand-800">Modifier</button>
                      <button onClick={() => handleDelete(j.codeJury)}
                        className="text-sm text-accent-600 transition hover:text-accent-700">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <JuryModal
          jury={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
