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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {soutenance ? 'Modifier' : 'Planifier'} une soutenance
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Date et heure *</label>
            <input className="w-full border rounded-lg px-3 py-2 text-sm" type="datetime-local"
              value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          </div>
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Salle"
            value={form.salle} onChange={e => setForm({ ...form, salle: e.target.value })} />
          <input className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="Durée (min)" type="number"
            value={form.duree} onChange={e => setForm({ ...form, duree: e.target.value })} />
          <div>
            <label className="text-xs text-gray-500">Stage *</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.stageId} onChange={e => setForm({ ...form, stageId: e.target.value })} required>
              <option value="">Sélectionner un stage</option>
              {stages.map(s => (
                <option key={s.refStage} value={s.refStage}>{s.titre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Jury</label>
            <select className="w-full border rounded-lg px-3 py-2 text-sm"
              value={form.juryId} onChange={e => setForm({ ...form, juryId: e.target.value })}>
              <option value="">Aucun jury</option>
              {jurys.map(j => (
                <option key={j.codeJury} value={j.codeJury}>{j.intitule}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-700">
              {soutenance ? 'Modifier' : 'Planifier'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 border rounded-lg py-2 text-sm font-medium hover:bg-gray-50">
              Annuler
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
    return <div className="flex items-center justify-center h-64"><p className="text-gray-400">Chargement...</p></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Soutenances</h1>
          <p className="text-sm text-gray-500 mt-1">{soutenances.length} soutenance(s)</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
          + Planifier
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Salle</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Jury</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {soutenances.map(s => (
              <tr key={s.refSoutenance}>
                <td className="px-4 py-3">{formatDate(s.date)}</td>
                <td className="px-4 py-3 text-gray-600">{s.salle || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{s.stageTitre || '-'}</td>
                <td className="px-4 py-3 text-gray-600">{s.juryIntitule || 'Non assigné'}</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                    {s.statut || 'PLANIFIEE'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setEditing(s); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-800 text-xs">Modifier</button>
                    <button onClick={() => handleDelete(s.refSoutenance)}
                      className="text-red-600 hover:text-red-800 text-xs">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
            {soutenances.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucune soutenance</td></tr>
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
