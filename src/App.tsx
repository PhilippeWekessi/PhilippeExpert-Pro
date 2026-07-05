import React, { useState, useEffect } from 'react';
import { Sparkles, Terminal, Mail, Phone, ExternalLink, ShieldAlert, CheckCircle, Code, Layers, UserCheck, Star, ArrowRight, Database, ChevronRight, HelpCircle, X, ShieldCheck } from 'lucide-react';
import { ServicePackage, AIBrief, Lead } from './types';
import ServiceCards from './components/ServiceCards';
import LeadCalculator from './components/LeadCalculator';
import AIBriefViewer from './components/AIBriefViewer';
import AdminDashboard from './components/AdminDashboard';
import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function App() {
  // Navigation: 'client' or 'consultant'
  const [viewMode, setViewMode] = useState<'client' | 'consultant'>('client');
  
  // Interactive simulator states
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | undefined>(undefined);
  const [generatedBrief, setGeneratedBrief] = useState<AIBrief | null>(null);
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");

  // Contact modal states
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Auto-scroll when brief is generated
  const handleBriefGenerated = (brief: AIBrief, desc: string, budget: string, timeline: string) => {
    setGeneratedBrief(brief);
    setProjectDescription(desc);
    setProjectBudget(budget);
    setProjectTimeline(timeline);
    
    // Smooth scroll to brief viewer
    setTimeout(() => {
      document.getElementById('brief-viewer-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectPackage = (pkg: ServicePackage) => {
    setSelectedPackage(pkg);
    // Smooth scroll to calculator
    document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) return;

    setIsSubmitting(true);

    const newLead: Omit<Lead, 'id'> = {
      name: clientName,
      email: clientEmail,
      phone: clientPhone || undefined,
      company: clientCompany || undefined,
      projectDescription: projectDescription,
      budget: projectBudget,
      timeline: projectTimeline,
      createdAt: new Date().toISOString(),
      status: 'new',
      aiBrief: generatedBrief || undefined
    };

    try {
      // 1. Save to Firestore
      const leadsCol = collection(db, 'leads');
      const docRef = await addDoc(leadsCol, newLead);
      const leadWithId = { id: docRef.id, ...newLead };

      // 2. Save to local storage as fallback
      const localLeadsRaw = localStorage.getItem("local_leads");
      const localLeads = localLeadsRaw ? JSON.parse(localLeadsRaw) : [];
      localLeads.push(leadWithId);
      localStorage.setItem("local_leads", JSON.stringify(localLeads));

    } catch (err) {
      console.warn("Échec d'enregistrement Firestore, sauvegarde locale activée.", err);
      // Save locally only
      const tempId = "local_" + Math.random().toString(36).substr(2, 9);
      const leadWithId = { id: tempId, ...newLead };
      
      const localLeadsRaw = localStorage.getItem("local_leads");
      const localLeads = localLeadsRaw ? JSON.parse(localLeadsRaw) : [];
      localLeads.push(leadWithId);
      localStorage.setItem("local_leads", JSON.stringify(localLeads));
    } finally {
      setIsSubmitting(false);
      setContactSubmitted(true);
      setTimeout(() => {
        setIsContactModalOpen(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white" id="main-layout-wrapper">
      {/* Top Professional Navigation */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200/80 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              <Terminal className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-sm md:text-base tracking-tight leading-none">
                SIL EXPERT <span className="text-indigo-600">PRO</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-medium">Consulting & Ingénierie Logicielle</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-xl flex gap-1 border border-slate-200/50">
              <button
                onClick={() => setViewMode('client')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'client'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🌍 Espace Client
              </button>
              <button
                onClick={() => setViewMode('consultant')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  viewMode === 'consultant'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                💼 Espace Consultant
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-16">
        
        {viewMode === 'client' ? (
          <>
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" id="client-hero">
              <div className="lg:col-span-7 space-y-5">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                  Licence SIL (Système Informatique & Logiciel)
                </span>
                
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                  Transformez vos idées en <span className="text-indigo-600">Solutions Logicielles</span> performantes.
                </h2>
                
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  Diplômé d'un diplôme de Licence SIL, je conçois des applications web sur-mesure, des bases de données robustes et des outils d'automatisation pour optimiser le chiffre d'affaires des commerces et TPE locaux. 
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="#calculator-section"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                  >
                    Estimer mon projet
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#services-section"
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-sm transition-all"
                  >
                    Voir mes offres
                  </a>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-3 gap-3 border-t border-slate-200/80 pt-6">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">100% Sur-Mesure</span>
                    <span className="text-[10px] text-slate-400">Pas de solutions d'usine</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">Moderne & Rapide</span>
                    <span className="text-[10px] text-slate-400">React • Node • Firestore</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900 block">Accompagnement</span>
                    <span className="text-[10px] text-slate-400">Cahier des charges fourni</span>
                  </div>
                </div>
              </div>

              {/* Decorative Right Panel */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-[300px] md:h-[350px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-85 -z-10"></div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                      Preuve de Compétences
                    </span>
                    <span className="text-xs font-mono text-slate-400">ID: SIL_GRADUATE</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Mon engagement de diplômé SIL :</h4>
                  <ul className="space-y-2.5">
                    <li className="text-xs text-slate-600 flex items-start gap-2">
                      <Code className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Code propre, documenté et livré avec les sources complètes.</span>
                    </li>
                    <li className="text-xs text-slate-600 flex items-start gap-2">
                      <Database className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Modélisation optimale de base de données relationnelle.</span>
                    </li>
                    <li className="text-xs text-slate-600 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Hébergement sécurisé à coût quasi nul la première année.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                    W P
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-800">Wekessi Philippe</div>
                    <div className="text-[10px] text-slate-400">Consultant & Développeur Principal</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Service packages Section */}
            <section id="services-section" className="scroll-mt-24">
              <ServiceCards onSelectPackage={handleSelectPackage} />
            </section>

            {/* Interactive Calculator Section */}
            <section id="calculator-section" className="scroll-mt-24">
              <LeadCalculator
                onBriefGenerated={handleBriefGenerated}
                selectedPackage={selectedPackage}
              />
            </section>

            {/* AI Brief Viewer Output */}
            {generatedBrief && (
              <section id="brief-viewer-section" className="scroll-mt-24 space-y-4">
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider justify-center">
                  <Sparkles className="w-4 h-4 animate-bounce" />
                  <span>Votre Document sur-mesure est prêt ci-dessous</span>
                </div>
                <AIBriefViewer
                  brief={generatedBrief}
                  onContactRequest={() => setIsContactModalOpen(true)}
                  contactSubmitted={contactSubmitted}
                />
              </section>
            )}

            {/* Frequently Asked Questions */}
            <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 text-center">Foire Aux Questions (Client)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm">Combien coûte réellement un site ou un logiciel sur-mesure ?</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Les prix varient de 800€ pour un site vitrine simple à 4000€+ pour un logiciel de gestion complet. L'estimation donnée par notre outil vous propose une fourchette cohérente par rapport à l'expertise requise.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-800 text-xs md:text-sm">Qu'est-ce que la Licence SIL garantit sur la qualité ?</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    La Licence SIL (Système Informatique et Logiciel) est un diplôme d'ingénierie qui met l'accent sur l'analyse UML, la structure rigoureuse des bases de données et la sécurité des applications, vous évitant les bugs fréquents.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Secret / Professional Admin dashboard view */
          <section id="consultant-dashboard">
            <AdminDashboard />
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-20 border-t border-slate-850">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="font-black text-white text-sm tracking-widest">
              SIL EXPERT <span className="text-indigo-400">SERVICES</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Conçu par un jeune ingénieur SIL motivé pour lancer son entreprise digitale.</p>
          </div>
          <div className="flex gap-4 text-xs font-medium">
            <button
              onClick={() => {
                setViewMode('consultant');
                document.getElementById('main-layout-wrapper')?.scrollIntoView();
              }}
              className="text-slate-400 hover:text-white"
            >
              Mode Consultant & Coaching
            </button>
            <span>•</span>
            <span className="text-slate-500">© 2026 Tous droits réservés.</span>
          </div>
        </div>
      </footer>

      {/* LEAD CAPTURE POPUP MODAL */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full bg-slate-50 border border-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black text-slate-900">Planifier mon Appel Gratuit</h3>
                <p className="text-xs text-slate-500">Préparez le lancement de votre projet avec le consultant SIL.</p>
              </div>

              {!contactSubmitted ? (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block">Votre Nom / Prénom *</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Jean Dupont"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold text-slate-500 block">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Ex: jean.dupont@entreprise.fr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold text-slate-500 block">Téléphone (Optionnel)</label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ex: 06 12 34 56 78"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold text-slate-500 block">Entreprise (Optionnel)</label>
                      <input
                        type="text"
                        value={clientCompany}
                        onChange={(e) => setClientCompany(e.target.value)}
                        placeholder="Ex: Pizzeria Milan"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Envoi en cours..." : "Valider & Recevoir le brief par Email"}
                  </button>
                </form>
              ) : (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">Demande enregistrée !</h4>
                  <p className="text-xs text-slate-500">
                    Merci pour votre intérêt. Philippe va analyser votre cahier des charges et vous recontacter très rapidement.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
