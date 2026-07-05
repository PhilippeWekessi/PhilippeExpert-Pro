import React, { useRef } from 'react';
import { AIBrief } from '../types';
import { FileText, Calendar, Shield, Cpu, Clock, DollarSign, CheckCircle2, ChevronRight, UserCheck, AlertTriangle, Printer } from 'lucide-react';

interface AIBriefViewerProps {
  brief: AIBrief;
  onContactRequest: () => void;
  contactSubmitted: boolean;
}

export default function AIBriefViewer({ brief, onContactRequest, contactSubmitted }: AIBriefViewerProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printContent) {
      const win = window.open('', '', 'height=700,width=900');
      if (win) {
        win.document.write('<html><head><title>Cahier des charges SIL - Expert</title>');
        win.document.write('<link href="https://cdn.jsdelivr.net/npm/tailwindcss@4.0.0/dist/tailwind.min.css" rel="stylesheet">');
        win.document.write('<style>body { font-family: sans-serif; padding: 40px; color: #1e293b; }</style></head><body>');
        win.document.write(printContent);
        win.document.write('</body></html>');
        win.document.close();
        setTimeout(() => {
          win.print();
        }, 500);
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-md overflow-hidden" id="ai-brief-viewer-root">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 px-6 py-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Généré par IA • Expert SIL
          </span>
          <h3 className="text-xl md:text-2xl font-bold mt-2 text-white">{brief.title || "Cahier des charges d'application"}</h3>
          <p className="text-slate-300 text-xs mt-1">Cadrage technique et budgétaire préliminaire complet.</p>
        </div>
        <button
          onClick={handlePrint}
          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all self-end md:self-auto"
        >
          <Printer className="w-4 h-4" />
          Imprimer / PDF
        </button>
      </div>

      <div className="p-6 md:p-8 space-y-8" ref={printRef}>
        {/* Résumé Exécutif */}
        <div className="space-y-2">
          <h4 className="text-slate-900 font-bold text-sm tracking-tight uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <FileText className="text-indigo-600 w-4 h-4" />
            Résumé Exécutif
          </h4>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
            {brief.executiveSummary}
          </p>
        </div>

        {/* Chiffres Clés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold">Temps Estimé</span>
              <div className="text-xl font-black text-indigo-950">
                {brief.estimatedHours.min} - {brief.estimatedHours.max} heures
              </div>
              <p className="text-[10px] text-slate-400">Équivalent à env. {Math.round(brief.estimatedHours.min / 7)} à {Math.round(brief.estimatedHours.max / 7)} jours de travail</p>
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase font-semibold">Budget Estimé</span>
              <div className="text-xl font-black text-emerald-950">
                {brief.estimatedCost.min}€ - {brief.estimatedCost.max}€
              </div>
              <p className="text-[10px] text-slate-400">Tarif junior SIL optimisé (Moyenne 350€/jour)</p>
            </div>
          </div>
        </div>

        {/* Fonctionnalités clés */}
        <div className="space-y-4">
          <h4 className="text-slate-900 font-bold text-sm tracking-tight uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Shield className="text-indigo-600 w-4 h-4" />
            Spécifications Fonctionnelles
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {brief.coreFeatures.map((feat, idx) => (
              <div key={idx} className="bg-white border border-slate-200/60 p-4 rounded-xl hover:border-indigo-200 transition-colors">
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <h5 className="font-bold text-slate-800 text-xs md:text-sm">{feat.title}</h5>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    feat.complexity === 'Simple' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    feat.complexity === 'Moyenne' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                    'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    {feat.complexity}
                  </span>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture & Tech Stack */}
        <div className="space-y-4">
          <h4 className="text-slate-900 font-bold text-sm tracking-tight uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Cpu className="text-indigo-600 w-4 h-4" />
            Architecture Technique Préconisée
          </h4>
          <div className="space-y-3">
            {brief.recommendedTechStack.map((tech, idx) => (
              <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="md:w-1/3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">{tech.category}</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tech.technologies.map((t, tIdx) => (
                      <span key={tIdx} className="bg-indigo-50 text-indigo-700 border border-indigo-100/60 text-[10px] font-mono px-2 py-0.5 rounded-md">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <p className="text-slate-600 text-xs leading-relaxed">
                    <strong>Justification :</strong> {tech.justification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan de Développement & Jalons */}
        <div className="space-y-4">
          <h4 className="text-slate-900 font-bold text-sm tracking-tight uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Calendar className="text-indigo-600 w-4 h-4" />
            Phases de Développement & Livrables
          </h4>
          <div className="space-y-3">
            {brief.developmentPhases.map((phase, idx) => (
              <div key={idx} className="flex gap-4 items-start relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:hidden">
                <div className="absolute left-0 top-1.5 w-4.5 h-4.5 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center">
                  <span className="text-[9px] font-bold text-indigo-600">{idx + 1}</span>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                    <h5 className="font-bold text-slate-800 text-xs md:text-sm">{phase.phase}</h5>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {phase.duration}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Livrables clés :</span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {phase.deliverables.map((del, dIdx) => (
                        <li key={dIdx} className="text-xs text-slate-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to action panel */}
      <div className="bg-slate-50 border-t border-slate-100 p-6 flex flex-col items-center text-center space-y-4">
        <div className="max-w-md">
          <h4 className="text-slate-900 font-bold text-base">Prêt à transformer ce cahier des charges en code ?</h4>
          <p className="text-slate-500 text-xs mt-1">
            Profitez de mon expertise en Licence SIL pour lancer votre solution logicielle rapidement. Envoyez-moi ce brief en un clic pour organiser notre appel de cadrage gratuit de 30 min.
          </p>
        </div>

        {!contactSubmitted ? (
          <button
            onClick={onContactRequest}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            Envoyer ma demande & planifier l'appel
          </button>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold max-w-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            Demande envoyée avec succès ! Le consultant SIL vous contactera sous 24h.
          </div>
        )}
      </div>
    </div>
  );
}
