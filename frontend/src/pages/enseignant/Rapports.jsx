import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ui, badgeClass, statutLabel } from '../../components/common/ui';

export default function Rapports() {
  const { user } = useAuth();
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [note, setNote] = useState('');
  const [commentaire, setCommentaire] = useState('');

  const load = async () => {
    try {
      const enseignants = await api.get('/enseignants');
      const moi = enseignants.data.find(e => e.email === user?.email);
      if (!moi) return;

      // Récupère les stages encadrés
      const stages = await api.get(`/stages/encadrant/${moi.codeUtilisateur}`);
      
      // Récupère tous les rapports de ces stages
      const rapportsPromises = stages.data.map(s =>
        api.get(`/rapports/stage/${s.refStage}`).catch(() => ({ data: null }))
      );
      const results = await Promise.all(rapportsPromises);
      const rapportsList = results
        .map(r => r.data)
        .filter(r => r !== null && r !== undefined);
      
      setRapports(rapportsList);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const evaluer = async (rapport, statut) => {
    try {
      await api.patch(`/rapports/${rapport.refRapport}/evaluer`, {
        note: parseFloat(note),
        commentaire,
        statut
      });
      setModal(null);
      setNote('');
      setCommentaire('');
      load();
    } catch (e) {
      alert('Erreur lors de l\'évaluation');
    }
  };

  if (loading) return <p className="text-ink-400 p-6">Chargement...</p>;

  return (
    <div>
      <header className={ui.pageHeader}>
        <p className={ui.kicker}>Évaluation</p>
        <h1 className={ui.pageTitle}>Rapports</h1>
        <p className={ui.pageLead}>{rapports.length} rapport{rapports.length > 1 ? 's' : ''} sur vos stages encadrés.</p>
      </header>

      {rapports.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink-200 bg-white p-8 text-center">
          <p className="text-ink-400">Aucun rapport déposé pour vos stages.</p>
        </div>
      ) : (
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead className={ui.thead}>
              <tr>
                <th className={ui.th}>Titre</th>
                <th className={ui.th}>Statut</th>
                <th className={ui.th}>Note</th>
                <th className={`${ui.th} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className={ui.tbody}>
              {rapports.map(r => (
                <tr key={r.refRapport} className={ui.tr}>
                  <td className={ui.tdStrong}>{r.titre}</td>
                  <td className="px-4 py-3"><span className={badgeClass(r.statut)}>{statutLabel(r.statut)}</span></td>
                  <td className={ui.td}>{r.note ? `${r.note}/20` : '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      {r.fichierPdf && (
                        <a href={`http://localhost:8080/${r.fichierPdf}`} target="_blank" rel="noreferrer"
                           className="text-sm text-brand-700 hover:underline">Consulter</a>
                      )}
                      {r.statut === 'DEPOSE' && (
                        <button onClick={() => setModal(r)} className="text-sm text-accent-600 hover:underline">Évaluer</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className={ui.modalOverlay}>
          <div className={ui.modalPanel}>
            <div className={ui.modalHeader}>
              <h2 className={ui.modalTitle}>Évaluer : {modal.titre}</h2>
            </div>
            <div className={ui.modalBody}>
              <div>
                <label className={ui.label}>Note /20 *</label>
                <input className={ui.input} type="number" min="0" max="20" step="0.5"
                  value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <div>
                <label className={ui.label}>Commentaire</label>
                <textarea className={ui.input} rows="3"
                  value={commentaire} onChange={e => setCommentaire(e.target.value)} />
              </div>
              <div className={ui.modalFooter}>
                <button onClick={() => setModal(null)} className={ui.btnSecondary}>Annuler</button>
                <button onClick={() => evaluer(modal, 'REJETE')} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white">Rejeter</button>
                <button onClick={() => evaluer(modal, 'VALIDE')} className={ui.btnPrimary}>Valider</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
