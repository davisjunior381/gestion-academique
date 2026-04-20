import api from './api';

export const getStats = async () => {
  const [apprenants, enseignants, stages, rapports, soutenances] = await Promise.all([
    api.get('/apprenants').catch(() => ({ data: [] })),
    api.get('/enseignants').catch(() => ({ data: [] })),
    api.get('/stages').catch(() => ({ data: [] })),
    api.get('/rapports').catch(() => ({ data: [] })),
    api.get('/soutenances').catch(() => ({ data: [] })),
  ]);

  const stagesData = stages.data;
  const rapportsData = rapports.data;

  return {
    totalApprenants: apprenants.data.length,
    totalEnseignants: enseignants.data.length,
    totalStages: stagesData.length,
    stagesEnCours: stagesData.filter(s => s.statut === 'EN_COURS').length,
    stagesTermines: stagesData.filter(s => s.statut === 'TERMINE').length,
    stagesValides: stagesData.filter(s => s.statut === 'VALIDE').length,
    totalRapports: rapportsData.length,
    rapportsDeposes: rapportsData.filter(r => r.statut === 'DEPOSE').length,
    rapportsEvalues: rapportsData.filter(r => r.statut === 'EVALUE').length,
    rapportsValides: rapportsData.filter(r => r.statut === 'VALIDE').length,
    totalSoutenances: soutenances.data.length,
  };
};
