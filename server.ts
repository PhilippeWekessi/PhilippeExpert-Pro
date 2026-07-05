import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Route for Gemini AI Cahier des Charges Generator
app.post("/api/generate-brief", async (req, res) => {
  try {
    const { projectDescription, budget, timeline, industry } = req.body;

    if (!projectDescription) {
      return res.status(400).json({ error: "La description du projet est requise." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY non configurée. Utilisation de données simulées.");
      // Fallback response if API key is not configured, to let user see how it works
      return res.json({
        title: `Projet de Solution Logicielle (${industry || 'Général'})`,
        executiveSummary: "Ce document présente l'analyse préliminaire de votre projet. (Note : Veuillez configurer votre clé API Gemini dans l'interface AI Studio pour une analyse personnalisée complète par IA).",
        coreFeatures: [
          { title: "Gestion des utilisateurs", description: "Connexion sécurisée, profils et gestion des droits.", complexity: "Simple" },
          { title: "Tableau de bord principal", description: "Visualisation des indicateurs clés et statistiques.", complexity: "Moyenne" },
          { title: "Notifications en temps réel", description: "Système de notifications push et emails automatisés.", complexity: "Moyenne" }
        ],
        recommendedTechStack: [
          { category: "Frontend", technologies: ["React", "Tailwind CSS", "TypeScript"], justification: "Interface utilisateur moderne, réactive et performante." },
          { category: "Backend", technologies: ["Node.js (Express)", "Firebase Firestore"], justification: "Base de données évolutive en temps réel et développement rapide." }
        ],
        developmentPhases: [
          { phase: "Phase 1 : Spécifications et Design", duration: "1-2 semaines", deliverables: ["Cahier des charges final", "Maquettes UI/UX"] },
          { phase: "Phase 2 : Développement Minimum Viable (MVP)", duration: "3-4 semaines", deliverables: ["Base de données configurée", "Fonctionnalités clés opérationnelles"] },
          { phase: "Phase 3 : Tests et Déploiement", duration: "1 semaine", deliverables: ["Application hébergée en production", "Formation"] }
        ],
        estimatedHours: { min: 60, max: 100 },
        estimatedCost: { min: 2500, max: 4500 }
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `En tant qu'expert en ingénierie logicielle et consultant SIL (Systèmes Informatiques et Logiciels), crée un cahier des charges détaillé et une estimation pour le projet suivant :
Description du projet : "${projectDescription}"
Budget cible : "${budget || 'Non spécifié'}"
Délai souhaité : "${timeline || 'Non spécifié'}"
Secteur d'activité : "${industry || 'Général'}"

Retourne obligatoirement le résultat sous la forme d'un objet JSON strict respectant exactement l'interface TypeScript suivante :
interface AIBrief {
  title: string; // Un titre accrocheur et professionnel pour le projet de logiciel
  executiveSummary: string; // Un résumé exécutif rédigé de manière professionnelle (en français) mettant en valeur l'intérêt du projet
  coreFeatures: {
    title: string;
    description: string;
    complexity: 'Simple' | 'Moyenne' | 'Complexe';
  }[]; // Liste de 3 à 5 fonctionnalités clés du projet
  recommendedTechStack: {
    category: string; // Ex: "Frontend", "Backend & Base de données", "Hébergement", "APIs"
    technologies: string[]; // Liste des technos adaptées, ex: ["React", "TailwindCSS"], ["Node.js", "Express", "PostgreSQL"], etc.
    justification: string; // Pourquoi ces choix techniques sont parfaits pour ce projet
  }[]; // Liste de 2 à 3 catégories
  developmentPhases: {
    phase: string;
    duration: string;
    deliverables: string[];
  }[]; // 3 étapes de développement logiques avec livrables
  estimatedHours: {
    min: number;
    max: number;
  }; // Estimation d'heures réaliste pour un freelance SIL compétent
  estimatedCost: {
    min: number;
    max: number;
  }; // Calcul basé sur un tarif journalier moyen (TJM) de 350€/jour (soit environ 45€/heure). Calcule des coûts qui correspondent de manière cohérente à l'estimation d'heures.
}

Garantis que le JSON retourné est valide et en français professionnel. Ne mets aucun texte d'enveloppe, seulement le JSON brut.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Réponse vide de Gemini.");
    }

    const briefData = JSON.parse(text);
    return res.json(briefData);

  } catch (error: any) {
    console.error("Erreur Gemini API:", error);
    return res.status(500).json({ error: "Erreur lors de la génération du cahier des charges par l'IA.", details: error.message });
  }
});

// Configure Vite or serve production static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express] Serveur démarré sur http://localhost:${PORT}`);
  });
}

startServer();
