import React, { useState } from 'react';
import { Sparkles, Calculator, HelpCircle, Code, ShieldCheck, Mail, Database, Send, ArrowRight, Star, RefreshCw } from 'lucide-react';
import { ServicePackage, AIBrief } from '../types';

interface LeadCalculatorProps {
  onBriefGenerated: (brief: AIBrief, projectDesc: string, budget: string, timeline: string) => void;
  selectedPackage?: ServicePackage;
}

export default function LeadCalculator({ onBriefGenerated, selectedPackage }: LeadCalculatorProps) {
  const [projectDesc, setProjectDesc] = useState(
    selectedPackage
      ? `Je souhaite concevoir un(e) : ${selectedPackage.title}. Description du besoin : `
      : ""
  );
  const [industry, setIndustry] = useState("Restourant/Commerce");
  const [budget, setBudget] = useState("1000-2500");
  const [timeline, setTimeline] = useState("1-mois");
  
  // Custom interactive features
  const [features, setFeatures] = useState([
    { id: 'auth', name: 'Authentification / Profils', price: 400, selected: false, desc: 'Connexion sécurisée pour vos clients ou employés' },
    { id: 'pay', name: 'Paiement en ligne (Stripe)', price: 500, selected: false, desc: 'Acceptez les cartes bancaires en toute sécurité' },
    { id: 'db', name: 'Base de données dynamique', price: 600, selected: true, desc: 'Sauvegardez vos produits, commandes ou utilisateurs' },
    { id: 'admin', name: 'Tableau de bord Admin', price: 700, selected: false, desc: 'Gérez tout depuis un espace privé' },
    { id: 'notif', name: 'Emails / Notifications automatiques', price: 300, selected: false, desc: 'Restez en contact avec vos clients' },
    { id: 'api', name: 'Intégration d\'API tierce', price: 500, selected: false, desc: 'Connexion à votre ERP, Google Maps ou CRM' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  // Base price + features
  const baseCost = selectedPackage?.id === 'vitrine' ? 800 : selectedPackage?.id === 'webapp' ? 2200 : selectedPackage?.id === 'audit' ? 450 : 600;
  const featuresCost = features.filter(f => f.selected).reduce((acc, curr) => acc + curr.price, 0);
  const totalEstimatedCost = baseCost + featuresCost;
  const totalHours = Math.round(totalEstimatedCost / 45); // ~45€ per hour

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectDesc || projectDesc.trim().length < 15) {
      setError("Veuillez fournir une description un peu plus détaillée de votre projet (au moins 15 caractères).");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const selectedFeaturesList = features.filter(f => f.selected).map(f => f.name).join(", ");
      const combinedDescription = `${projectDesc}\n\n[Fonctionnalités souhaitées : ${selectedFeaturesList}]`;

      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projectDescription: combinedDescription,
          budget: `${budget} €`,
          timeline: timeline,
          industry: industry
        })
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'appel au serveur de génération.");
      }

      const data = await response.json();
      
      // Override or adapt prices with interactive estimates if Gemini gives default ones
      if (data.estimatedCost) {
        // Enforce coherence with client preferences if needed
      }

      onBriefGenerated(data, projectDesc, `${budget} €`, timeline);
    } catch (err: any) {
      console.error(err);
      setError("Désolé, une erreur s'est produite lors de l'analyse IA. Réessayez ou utilisez les valeurs estimées ci-dessous.");
      
      // Generate a client-side fallback brief so the experience never breaks!
      const fallbackBrief: AIBrief = {
        title: `Projet Logiciel : ${industry}`,
        executiveSummary: `Analyse préliminaire pour votre projet. Description : "${projectDesc}". Notre expertise d'ingénieurs SIL garantit une exécution rapide et sécurisée de cette architecture.`,
        coreFeatures: features.filter(f => f.selected).map(f => ({
          title: f.name,
          description: f.desc,
          complexity: f.price > 500 ? 'Complexe' : 'Moyenne'
        })),
        recommendedTechStack: [
          { category: "Frontend", technologies: ["React.js", "Tailwind CSS"], justification: "Pour une interface web rapide, moderne et fluide." },
          { category: "Base de données", technologies: ["PostgreSQL", "Supabase"], justification: "Idéal pour stocker de manière structurée et sécurisée vos données." }
        ],
        developmentPhases: [
          { phase: "Cadrage & Design", duration: "1 semaine", deliverables: ["Cahier des charges", "Maquettes de l'application"] },
          { phase: "Développement actif", duration: "3 semaines", deliverables: ["Interface fonctionnelle", "Base de données connectée"] },
          { phase: "Validation & Mise en ligne", duration: "1 semaine", deliverables: ["Hébergement configuré", "Tests et recette finalisée"] }
        ],
        estimatedHours: { min: Math.round(totalHours * 0.9), max: Math.round(totalHours * 1.2) },
        estimatedCost: { min: Math.round(totalEstimatedCost * 0.9), max: Math.round(totalEstimatedCost * 1.2) }
      };

      onBriefGenerated(fallbackBrief, projectDesc, `${budget} €`, timeline);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 md:p-8" id="calculator-lead-form">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Estimateur de Budget & Générateur de Cahier des Charges</h3>
          <p className="text-xs text-slate-500">Sélectionnez vos critères et laissez notre IA SIL structurer votre projet technique.</p>
        </div>
      </div>

      <form onSubmit={handleGenerateBrief} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column - choices */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Industry, budget, timeline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Secteur</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
              >
                <option value="Restaurant / Food">Restauration</option>
                <option value="Commerce / Boutique">E-commerce / Boutique</option>
                <option value="Santé / Médical">Santé / Médical</option>
                <option value="Immobilier">Immobilier</option>
                <option value="Éducation">Éducation / Formation</option>
                <option value="Autre Service">Autre secteur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Budget Cible</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
              >
                <option value="500-1200">500€ - 1200€</option>
                <option value="1200-2500">1200€ - 2500€</option>
                <option value="2500-5000">2500€ - 5000€</option>
                <option value="5000+">Plus de 5000€</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5">Délai souhaité</label>
              <select
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700"
              >
                <option value="2-semaines">2 semaines (Urgent)</option>
                <option value="1-mois">1 mois (Standard)</option>
                <option value="2-mois">2 mois (Tranquille)</option>
              </select>
            </div>
          </div>

          {/* Interactive Feature Selectors */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-3">Fonctionnalités Requises (Ajuste le devis)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.id}
                  onClick={() => toggleFeature(f.id)}
                  className={`border rounded-xl p-3 cursor-pointer transition-all flex items-start gap-3 select-none ${
                    f.selected
                      ? 'bg-indigo-50 border-indigo-400 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={f.selected}
                    onChange={() => {}} // toggled on div click
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 flex-shrink-0"
                  />
                  <div className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">{f.name}</span>
                      <span className="text-[10px] font-semibold text-indigo-600">+{f.price}€</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Description (The prompt input) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-600 uppercase flex items-center justify-between">
              <span>Décrivez votre besoin en français libre</span>
              <span className="text-[10px] font-normal text-slate-400">Ex: Je veux un site de commande pour ma pizzeria...</span>
            </label>
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Décrivez ici votre idée d'application ou de site web. Quels sont les utilisateurs ? Quelle est la valeur ajoutée ? Plus votre description est riche, plus le cahier des charges généré par l'IA sera précis."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs md:text-sm h-28 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-700 leading-relaxed shadow-inner"
            ></textarea>
          </div>

          {error && <p className="text-rose-500 text-xs font-medium">{error}</p>}
        </div>

        {/* Right column - Real-time calculation and button */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-70 -z-10"></div>
          
          <div className="space-y-5">
            <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider pb-3 border-b border-slate-100">
              Estimation Instantanée
            </h4>

            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Tarif de base (Forfait)</span>
                <span className="text-xs font-mono font-bold text-slate-800">{baseCost} €</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Options sélectionnées ({features.filter(f => f.selected).length})</span>
                <span className="text-xs font-mono font-bold text-slate-800">+{featuresCost} €</span>
              </div>
              
              <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Total Estimé</span>
                  <span className="text-[10px] text-slate-400">TJM Junior SIL : 350€/j</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 font-mono">~{totalEstimatedCost}€</span>
                  <span className="text-[10px] text-slate-400 block">Soit env. {totalHours}h de dev</span>
                </div>
              </div>
            </div>

            {/* Micro-incentives for client */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  <strong>Zéro engagement :</strong> Utilisez ce cahier des charges généré pour vos besoins ou pour comparer les offres du marché.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-500 leading-normal">
                  <strong>Analyse par IA :</strong> Notre modèle analyse les fonctionnalités clés pour vous proposer la pile technique la plus rentable et moderne.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
                loading
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Génération du plan par l'IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer mon cahier des charges
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Estimation gratuite • Génération en moins de 10 secondes
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
