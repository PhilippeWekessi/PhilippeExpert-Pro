import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { Lead } from '../types';
import { LayoutDashboard, Users, Award, TrendingUp, Sparkles, Phone, Mail, FolderOpen, Calendar, Trash2, CheckCircle, RefreshCw, KeyRound, Info, BookOpen } from 'lucide-react';
import AdviceGuide from './AdviceGuide';

export default function AdminDashboard() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'leads' | 'guide'>('leads');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Hardcoded simple PIN code for demo & easy student login
  const CORRECT_PIN = "1234";

  useEffect(() => {
    // Check if authenticated in session storage
    if (sessionStorage.getItem("admin_auth") === "true") {
      setIsAuthenticated(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
      setPinError("");
      fetchLeads();
    } else {
      setPinError("Code PIN incorrect. Indice: Le code par défaut est '1234'.");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // 1. Fetch from Firestore
      const leadsCol = collection(db, 'leads');
      const q = query(leadsCol, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const firestoreLeads: Lead[] = [];
      querySnapshot.forEach((docSnap) => {
        firestoreLeads.push({ id: docSnap.id, ...docSnap.data() } as Lead);
      });

      // 2. Fetch from LocalStorage as backup
      const localLeadsRaw = localStorage.getItem("local_leads");
      const localLeads: Lead[] = localLeadsRaw ? JSON.parse(localLeadsRaw) : [];

      // Combine both lists, deduplicating by ID or using email + createdAt
      const combined = [...firestoreLeads];
      localLeads.forEach(local => {
        if (!combined.some(f => f.id === local.id || (f.email === local.email && f.createdAt === local.createdAt))) {
          combined.push(local);
        }
      });

      // Sort combined by date descending
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setLeads(combined);
    } catch (err) {
      console.error("Erreur lors de la récupération des prospects Firestore:", err);
      // Fallback only to local storage
      const localLeadsRaw = localStorage.getItem("local_leads");
      if (localLeadsRaw) {
        setLeads(JSON.parse(localLeadsRaw));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      // 1. Update in local storage
      const updatedLocal = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      setLeads(updatedLocal);
      localStorage.setItem("local_leads", JSON.stringify(updatedLocal));

      // 2. Update in Firestore
      const leadDocRef = doc(db, "leads", leadId);
      await updateDoc(leadDocRef, { status: newStatus });
    } catch (err) {
      console.warn("Échec de la mise à jour Firestore, statut mis à jour en local.", err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce prospect ?")) return;
    try {
      // 1. Delete in local storage
      const updatedLocal = leads.filter(l => l.id !== leadId);
      setLeads(updatedLocal);
      localStorage.setItem("local_leads", JSON.stringify(updatedLocal));

      if (selectedLead?.id === leadId) setSelectedLead(null);

      // 2. Delete from Firestore
      const leadDocRef = doc(db, "leads", leadId);
      await deleteDoc(leadDocRef);
    } catch (err) {
      console.warn("Échec de la suppression Firestore, supprimé en local.", err);
    }
  };

  // Stats calculation
  const totalLeads = leads.length;
  const pendingLeads = leads.filter(l => l.status === 'new').length;
  const signedLeads = leads.filter(l => l.status === 'signed').length;
  
  // Potential revenue
  const totalPotentialRevenue = leads.reduce((acc, curr) => {
    if (curr.aiBrief) {
      return acc + (curr.aiBrief.estimatedCost?.min || 1000);
    }
    return acc + 1000;
  }, 0);

  const totalSignedRevenue = leads
    .filter(l => l.status === 'signed')
    .reduce((acc, curr) => {
      if (curr.aiBrief) {
        return acc + (curr.aiBrief.estimatedCost?.min || 1000);
      }
      return acc + 1000;
    }, 0);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8 text-center" id="admin-login-card">
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Espace Consultant SIL</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Accédez à votre tableau de bord sécurisé pour gérer vos demandes clients et consulter les stratégies de vente.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[10px] uppercase font-bold text-slate-500 block">Code PIN d'accès</label>
            <input
              type="password"
              placeholder="Saisissez votre PIN (Ex: 1234)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-center text-sm tracking-widest font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-800"
            />
            {pinError && <p className="text-rose-500 text-[11px] mt-1 font-medium">{pinError}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow transition-colors cursor-pointer"
          >
            Se Connecter
          </button>
        </form>

        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mt-6 text-[11px] text-amber-800 text-left flex items-start gap-2">
          <Info className="w-4 h-4 flex-shrink-0 text-amber-600 mt-0.5" />
          <p>
            <strong>Astuce :</strong> Le code d'accès par défaut est <strong>1234</strong>. Vous pouvez utiliser ce dashboard pour stocker vos prospects réels, voir leurs cahiers des charges rédigés par l'IA et piloter vos ventes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="admin-dashboard-panel">
      {/* Dashboard Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Tableau de Bord Actif
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Espace de Vente & Suivi SIL</h2>
          <p className="text-xs text-slate-500">Gérez vos rendez-vous clients, suivez vos contrats et apprenez à closer.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 gap-1">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'leads' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
          >
            <Users className="w-4 h-4" />
            Prospects ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'guide' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-850'}`}
          >
            <BookOpen className="w-4 h-4" />
            Guide & Stratégie
          </button>
        </div>
      </div>

      {activeTab === 'leads' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Main List column */}
          <div className="xl:col-span-8 space-y-6">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Total Inquiries</span>
                <div className="text-2xl font-black text-slate-800 mt-1">{totalLeads}</div>
                <span className="text-[10px] text-slate-500">Prospects captés</span>
              </div>
              
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Nouveaux</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">{pendingLeads}</div>
                <span className="text-[10px] text-indigo-400 font-medium">À contacter sous 24h</span>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Chiffre Potentiel</span>
                <div className="text-2xl font-black text-slate-800 mt-1 font-mono">{totalPotentialRevenue}€</div>
                <span className="text-[10px] text-slate-500">Pipeline de devis</span>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Chiffre Gagné</span>
                <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">{totalSignedRevenue}€</div>
                <span className="text-[10px] text-emerald-500 font-medium">Contrats signés 🎉</span>
              </div>
            </div>

            {/* List block */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider">Liste des Prospects Captés</h3>
                <button
                  onClick={fetchLeads}
                  disabled={loading}
                  className="text-slate-500 hover:text-slate-850 text-xs flex items-center gap-1 transition-colors bg-white border border-slate-200 px-2 py-1 rounded"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">Aucun prospect enregistré pour le moment.</p>
                  <p className="text-xs text-slate-400">Remplissez l'estimateur de projet sur la page d'accueil pour tester le système !</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center gap-4 ${selectedLead?.id === lead.id ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                          {lead.company && (
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-medium">{lead.company}</span>
                          )}
                          <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                            lead.status === 'new' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            lead.status === 'contacted' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                            lead.status === 'signed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            'bg-slate-100 text-slate-500'
                          }`}>
                            {lead.status === 'new' ? 'Nouveau' :
                             lead.status === 'contacted' ? 'Contacté' :
                             lead.status === 'signed' ? 'Signé' : lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 max-w-md">{lead.projectDescription}</p>
                        <div className="text-[10px] text-slate-400 flex items-center gap-3">
                          <span>📅 {new Date(lead.createdAt).toLocaleDateString()}</span>
                          <span>💰 Budget: {lead.budget}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value as Lead['status'])}
                          className="bg-white border border-slate-200 text-[10px] font-semibold rounded px-2 py-1 text-slate-700"
                        >
                          <option value="new">Nouveau</option>
                          <option value="contacted">Contacté</option>
                          <option value="signed">Signé</option>
                          <option value="archived">Archivé</option>
                        </select>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="text-rose-500 hover:bg-rose-50 p-1 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Details column */}
          <div className="xl:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-sm pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <FolderOpen className="text-indigo-600 w-4 h-4" /> Détails du Prospect
            </h3>

            {selectedLead ? (
              <div className="space-y-5 text-slate-700 text-xs">
                {/* Contact Coordinates */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-slate-800 text-sm">{selectedLead.name}</div>
                  {selectedLead.company && <div className="text-slate-500">🏢 {selectedLead.company}</div>}
                  <div className="flex items-center gap-2 mt-1.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5" />
                    <a href={`mailto:${selectedLead.email}`} className="text-indigo-600 hover:underline">{selectedLead.email}</a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="w-3.5 h-3.5" />
                      <a href={`tel:${selectedLead.phone}`} className="text-indigo-600 hover:underline">{selectedLead.phone}</a>
                    </div>
                  )}
                </div>

                {/* Brief details */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Idée Client :</span>
                  <p className="bg-slate-50 p-3 rounded-lg leading-relaxed">{selectedLead.projectDescription}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Budget</span>
                    <span className="text-xs font-bold text-slate-800">{selectedLead.budget}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Délai</span>
                    <span className="text-xs font-bold text-slate-800">{selectedLead.timeline}</span>
                  </div>
                </div>

                {/* Action recommendations based on silent coaching */}
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-950 p-4 rounded-xl space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Comment conclure cette vente :
                  </h4>
                  <ul className="space-y-1.5 pl-3 list-disc text-[11px] text-emerald-900 leading-relaxed">
                    <li>
                      <strong>Appelez le client en moins de 2 heures :</strong> "Bonjour, j'ai bien reçu votre demande de cahier des charges d'application. Je l'ai sous les yeux..."
                    </li>
                    <li>
                      <strong>Validez le budget :</strong> S'ils ont sélectionné {selectedLead.budget}, proposez-leur un MVP à {selectedLead.budget.split('-')[0]}€ pour sécuriser le deal.
                    </li>
                    <li>
                      Utilisez l'estimation de temps fournie par l'IA ({selectedLead.aiBrief?.estimatedHours.min || 60}h - {selectedLead.aiBrief?.estimatedHours.max || 100}h) pour justifier votre devis de manière professionnelle.
                    </li>
                  </ul>
                </div>

                {selectedLead.aiBrief && (
                  <div className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/50 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Tech Stack Proposée par l'IA :</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedLead.aiBrief.recommendedTechStack?.map((tech, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-700 text-[10px] font-mono px-1.5 py-0.5 rounded border border-indigo-100/40">
                          {tech.category}: {tech.technologies.slice(0, 2).join(', ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-12">
                <p className="text-xs">Sélectionnez un prospect dans la liste pour voir ses coordonnées et l'analyse commerciale.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <AdviceGuide />
      )}
    </div>
  );
}
