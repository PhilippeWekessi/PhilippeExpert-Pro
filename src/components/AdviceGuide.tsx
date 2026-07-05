import React, { useState } from 'react';
import { BookOpen, User, DollarSign, Target, Award, Mail, MessageSquare, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function AdviceGuide() {
  const [activeTab, setActiveTab] = useState<'intro' | 'hunt' | 'pricing' | 'templates'>('intro');

  const strategies = [
    {
      title: "1. Le marché local (La mine d'or sous vos pieds)",
      desc: "Les petits commerces locaux (boulangeries, restaurants, cliniques, écoles privées) ont des outils de gestion obsolètes ou pas de site web. Allez les voir physiquement.",
      tips: [
        "Identifiez un commerce avec un site non-mobile ou sans présence en ligne.",
        "Créez une maquette simple de 1 page en 2 heures.",
        "Présentez-vous poliment : 'Bonjour, je suis diplômé SIL local. J'ai remarqué que vos clients ont du mal à commander sur mobile. J'ai préparé un prototype gratuit pour vous montrer...'"
      ]
    },
    {
      title: "2. Les plateformes de Freelance (Malt, Fiverr, Upwork)",
      desc: "Indispensables pour débuter et accumuler des avis. Malt est roi en France pour le consulting informatique.",
      tips: [
        "Mettez en avant votre diplôme de Licence SIL (Compétences : Bases de données, SQL, React, Node).",
        "Tarif de départ attractif (TJM à 250€-300€) pour décrocher vos 3 premiers projets.",
        "Répondez aux appels d'offres en moins de 15 minutes en personnalisant chaque message."
      ]
    },
    {
      title: "3. La spécialisation de niche",
      desc: "Ne dites pas 'Je fais du code'. Dites 'J'automatise la facturation des cabinets médicaux' ou 'Je crée des systèmes d'inventaire simples pour commerçants'.",
      tips: [
        "Un client achète un résultat business, pas un langage de programmation.",
        "Créez 2-3 offres packagées claires pour dissiper la peur du prix chez le client."
      ]
    }
  ];

  const pricingModels = [
    {
      type: "Le Taux Journalier Moyen (TJM)",
      value: "250€ à 350€ / Jour",
      when: "Pour les missions de conseil ou de renfort d'équipe en entreprise.",
      pros: "Revenu garanti à la journée, idéal pour des contrats de 1 à 3 mois.",
      cons: "Difficile à facturer très cher aux petits commerçants locaux."
    },
    {
      type: "La Facturation au Forfait (Recommandé)",
      value: "800€ à 4000€ par Projet",
      when: "Pour la création de sites vitrines, d'applications spécifiques, ou d'outils d'automatisation.",
      pros: "Si vous travaillez vite, votre taux horaire réel explose. Le client connaît le prix exact dès le départ.",
      cons: "Nécessite un cahier des charges ultra précis pour éviter le travail supplémentaire non payé."
    },
    {
      type: "L'Abonnement de Maintenance",
      value: "49€ à 149€ / Mois",
      when: "À proposer systématiquement après la livraison d'un site.",
      pros: "Crée un revenu récurrent prévisible. 10 clients à 99€/mois = ~1000€ de fixe sans rien faire.",
      cons: "Nécessite d'être réactif en cas de bug de serveur."
    }
  ];

  const templates = [
    {
      title: "✉️ Email de Prospection Locale (Commerces/TPE)",
      subject: "Proposition d'amélioration digitale pour [Nom du Commerce]",
      body: `Bonjour [Nom du gérant],

Je suis [Votre Nom], développeur logiciel diplômé d'une Licence SIL et basé à [Votre Ville]. En passant devant votre superbe établissement, j'ai eu l'idée de regarder votre présence en ligne.

Votre activité mérite d'être mise en valeur. J'ai remarqué qu'il serait possible de doubler vos réservations/commandes en ligne grâce à :
1. Un site web ultra-rapide optimisé pour les smartphones.
2. Un système de prise de rendez-vous ou de commande simple pour vos clients.

J'ai préparé une maquette rapide de ce à quoi cela pourrait ressembler pour vous (sans aucun engagement).

Seriez-vous disponible pour un appel de 10 minutes ce [Jour] à [Heure] pour que je vous montre cela ?

Bien cordialement,
[Votre Nom]
[Votre Téléphone] / [Votre Email]`
    },
    {
      title: "✉️ Message de réponse Upwork / Malt ultra-convertisseur",
      subject: "Candidature - [Titre de l'offre]",
      body: `Bonjour [Nom du Recruteur],

J'ai attentivement lu votre besoin concernant [Description courte du projet]. En tant que spécialiste SIL (Systèmes d'Information et Logiciels), c'est exactement le type de solution que je conçois régulièrement.

Pour ce projet, je vous préconise l'architecture suivante :
- Frontend : React pour une interface fluide et instantanée.
- Backend : Node.js ou Firebase pour une gestion de base de données ultra-sécurisée et économique.

Pour vous aider à avancer au plus vite, j'ai déjà généré une ébauche de cahier des charges et d'étapes de développement clés pour votre projet.

Discutons-en de vive voix ! Quand seriez-vous disponible pour un court appel de cadrage ?

Excellente journée,
[Votre Nom]`
    }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100" id="advice-guide-root">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-5 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="text-emerald-400 w-6 h-6" />
            Guide de Lancement SIL Freelance
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Comment transformer votre diplôme Licence SIL en source de revenus régulière (100€+ par jour)
          </p>
        </div>
        <div className="flex bg-slate-800 p-1 rounded-lg mt-4 md:mt-0 gap-1">
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'intro' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Stratégie
          </button>
          <button
            onClick={() => setActiveTab('hunt')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'hunt' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Trouver des Clients
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'pricing' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Tarification
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'templates' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Modèles d'emails
          </button>
        </div>
      </div>

      {activeTab === 'intro' && (
        <div className="space-y-6">
          <div className="bg-emerald-950/40 border border-emerald-800/60 p-4 rounded-xl">
            <h3 className="text-emerald-400 font-semibold text-base mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              Pourquoi votre Licence SIL a une valeur inestimable aujourd'hui :
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Vous maîtrisez la modélisation de données (Merise, UML), les bases de données (SQL), et le développement de logiciels. La plupart des entreprises n'ont aucune idée de comment structurer leurs données. Vous avez l'avantage technique. Ce site est conçu pour être votre <strong>aimant à clients</strong>. Faites tester le "Générateur de Cahier des Charges" à des prospects pour capter leurs coordonnées automatiquement !
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
                <Briefcase className="text-emerald-400 w-4 h-4" /> Offre n°1 : Le Site Vitrine TPE
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                Créez de superbes sites pour restaurants, boutiques et artisans de votre ville. Rapide à faire avec React + Tailwind, facturable entre 800€ et 1200€.
              </p>
              <div className="text-emerald-400 text-xs font-bold">Objectif : 1 par mois = ~1000€</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-1.5">
                <Target className="text-emerald-400 w-4 h-4" /> Offre n°2 : Outil Métier / Gestion d'Inventaire
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed mb-3">
                Votre spécialité SIL ! Des petits logiciels web d'inventaire, de facturation, ou de suivi de clients pour les entreprises locales. Facturable de 1500€ à 4000€.
              </p>
              <div className="text-emerald-400 text-xs font-bold">Objectif : 1 tous les 2 mois = ~1500€/mois</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'hunt' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300 mb-2">
            La clé pour faire de l'argent quotidiennement n'est pas d'attendre les clients, mais d'aller là où ils ont besoin d'aide avec des propositions prêtes à l'emploi.
          </p>
          {strategies.map((s, idx) => (
            <div key={idx} className="bg-slate-800/30 border border-slate-800 p-4 rounded-xl">
              <h4 className="text-white font-bold text-sm mb-1">{s.title}</h4>
              <p className="text-slate-400 text-xs mb-3">{s.desc}</p>
              <ul className="space-y-1.5 pl-1">
                {s.tips.map((tip, tIdx) => (
                  <li key={tIdx} className="text-slate-300 text-xs flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-emerald-400 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pricing' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            En tant que diplômé SIL, votre temps est précieux. Voici les 3 structures tarifaires pour assurer un revenu régulier :
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {pricingModels.map((p, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-800/80 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-1">{p.type}</h4>
                  <div className="text-emerald-400 text-lg font-bold mb-3">{p.value}</div>
                  <p className="text-slate-300 text-xs leading-relaxed mb-3"><strong>Idéal pour :</strong> {p.when}</p>
                  <p className="text-slate-400 text-xs leading-relaxed mb-2">✅ {p.pros}</p>
                </div>
                <div className="text-slate-500 text-xs border-t border-slate-800 pt-2 mt-2">
                  ❌ {p.cons}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-5">
          <p className="text-sm text-slate-300">
            Copiez-collez ces messages, ajustez les crochets <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400">[ ]</code> et envoyez-les à 5 prospects par jour. C'est mathématique : avec 150 contacts par mois, vous signerez 2 à 4 projets de développement !
          </p>
          <div className="space-y-4">
            {templates.map((t, idx) => (
              <div key={idx} className="bg-slate-850 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-semibold text-xs flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400" /> {t.title}
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`Objet : ${t.subject}\n\n${t.body}`);
                      alert("Copié dans le presse-papiers !");
                    }}
                    className="text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded transition-colors"
                  >
                    Copier
                  </button>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded text-xs text-slate-300 font-mono space-y-1 select-all overflow-x-auto whitespace-pre-wrap">
                  <span className="text-emerald-400">Objet :</span> {t.subject}
                  {"\n\n"}
                  {t.body}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
