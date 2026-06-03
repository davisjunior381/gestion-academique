import { useState, useEffect } from 'react';
import api from '../../services/api';

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

  const inputClass = 'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            {soutenance ? 'Modifier la soutenance' : 'Planifier une soutenance'}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">Renseignez la date, le stage concerné et, si besoin, le jury.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Date et heure</label>
            <input className={inputClass} type="datetime-local"
              value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Salle</label>
              <input className={inputClass} placeholder="Ex. Amphi A"
                value={form.salle} onChange={e => setForm({ ...form, salle: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Durée (min)</label>
              <input className={inputClass} type="number"
                value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Stage</label>
            <select className={inputClass}
              value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })} required>
              <option value="">Sélectionner un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>{s.titre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Jury</label>
            <select className={inputClass}
              value={form.juryId} onChange={e => setForm({ ...form, juryId: e.target.value })}>
              <option value="">Aucun jury</option>
              {jurys.map(j => (
                <option key={j.codeJury} value={j.codeJury}>{j.intitule}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Annuler
            </button>
            <button type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
              {soutenance ? 'Enregistrer' : 'Planifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Soutenances() {
  const [soutenances, setSoutenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    loadSoutenances();
  }, []);

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
    if (!window.confirm('Supprimer cette soutenance ?')) return;
    api.delete(`/soutenances/${id}`)
      .then(() => loadSoutenances())
      .catch(console.error);
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-sm text-slate-400">Chargement...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Soutenances</h1>
          <p className="mt-1 text-sm text-slate-500">
            {soutenances.length} soutenance{soutenances.length > 1 ? 's' : ''} planifiée{soutenances.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Planifier une soutenance
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Salle</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Jury</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {soutenances.map(s => (
              <tr key={s.refSoutenance} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{formatDate(s.date)}</td>
                <td className="px-4 py-3 text-slate-600">{s.salle || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{s.stageTitre || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{s.juryIntitule || 'Non assigné'}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                    {s.statut || 'PLANIFIEE'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setEditing(s); setShowModal(true); }}
                      className="text-sm font-medium text-slate-700 hover:text-slate-900">Modifier</button>
                    <button onClick={() => handleDelete(s.refSoutenance)}
                      className="text-sm font-medium text-red-600 hover:text-red-700">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {soutenances.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-400">Aucune soutenance planifiée</td></tr>
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
