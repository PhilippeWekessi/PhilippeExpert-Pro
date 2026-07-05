import React from 'react';
import { Layers, Globe, Server, CheckCircle2, ChevronRight, MessageSquare, Zap } from 'lucide-react';
import { ServicePackage } from '../types';

interface ServiceCardsProps {
  onSelectPackage: (pkg: ServicePackage) => void;
}

export default function ServiceCards({ onSelectPackage }: ServiceCardsProps) {
  const packages: ServicePackage[] = [
    {
      id: "vitrine",
      title: "Site Vitrine & SEO Local",
      price: "À partir de 800€",
      description: "Idéal pour les artisans, commerces, restaurants et professions libérales souhaitant attirer des clients locaux.",
      icon: "globe",
      features: [
        "Design sur-mesure et 100% responsive",
        "Optimisation Google My Business & SEO local",
        "Formulaire de contact & Plan Google Maps",
        "Hébergement ultra-rapide et sécurisé",
        "Statistiques de visites (Google Analytics)",
        "Formation de 1h pour modifier vos textes"
      ],
      target: "Boulangerie, Restaurant, Cabinet médical, Coiffeur, Artisan"
    },
    {
      id: "webapp",
      title: "Application Web Métier (SIL)",
      price: "À partir de 2200€",
      description: "Automatisez vos processus internes, gérez votre stock, vos factures ou votre base clients avec un outil sur-mesure.",
      icon: "layers",
      features: [
        "Base de données relationnelle sécurisée",
        "Tableau de bord administrateur complet",
        "Système d'authentification des employés",
        "Génération de rapports PDF automatisés",
        "Export Excel/CSV et import intelligent",
        "Support technique garanti pendant 3 mois"
      ],
      target: "PME, Agences immobilières, Écoles, Entreprises de logistique"
    },
    {
      id: "audit",
      title: "Audit & Optimisation BDD",
      price: "À partir de 450€",
      description: "Votre base de données ou votre site actuel rame ? J'analyse, optimise et sécurise votre infrastructure de données.",
      icon: "server",
      features: [
        "Analyse complète des requêtes lentes",
        "Optimisation des index et de la structure SQL",
        "Mise en place de sauvegardes automatiques",
        "Sécurisation contre les failles d'injection",
        "Rapport détaillé avant/après l'optimisation",
        "Conseil en hébergement Cloud économique"
      ],
      target: "Sites e-commerce, Startups, Applications existantes lentes"
    }
  ];

  return (
    <div className="space-y-6" id="service-packages-root">
      <div className="text-center max-w-xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Mes Offres de Services Prêtes à Vendre</h3>
        <p className="text-slate-500 text-sm mt-1">
          Voici les packs de services informatiques les plus demandés. Vous pouvez les proposer directement à vos prospects locaux ou sur les plateformes.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden relative group"
          >
            {pkg.id === 'webapp' && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl shadow-sm z-10">
                Spécialité SIL
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl ${
                  pkg.id === 'vitrine' ? 'bg-indigo-50 text-indigo-600' :
                  pkg.id === 'webapp' ? 'bg-emerald-50 text-emerald-600' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {pkg.icon === 'globe' && <Globe className="w-6 h-6" />}
                  {pkg.icon === 'layers' && <Layers className="w-6 h-6" />}
                  {pkg.icon === 'server' && <Server className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base group-hover:text-emerald-600 transition-colors">
                    {pkg.title}
                  </h4>
                  <span className="text-slate-400 text-xs font-mono">{pkg.target.split(',')[0]} & Co</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-xl font-extrabold text-slate-900">{pkg.price}</div>
                <p className="text-xs text-slate-400 mt-1">Estimé selon le cahier des charges</p>
              </div>

              <p className="text-slate-500 text-xs mb-5 leading-relaxed">
                {pkg.description}
              </p>

              <div className="border-t border-slate-100 pt-4">
                <h5 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-2">Ce qui est inclus :</h5>
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">Idéal pour : {pkg.target}</span>
              <button
                onClick={() => onSelectPackage(pkg)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors"
              >
                Simuler
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
