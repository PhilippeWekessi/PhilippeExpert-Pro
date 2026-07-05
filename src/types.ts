export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectDescription: string;
  budget: string;
  timeline: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'negotiating' | 'signed' | 'archived';
  aiBrief?: AIBrief;
}

export interface AIBrief {
  title: string;
  executiveSummary: string;
  coreFeatures: {
    title: string;
    description: string;
    complexity: 'Simple' | 'Moyenne' | 'Complexe';
  }[];
  recommendedTechStack: {
    category: string;
    technologies: string[];
    justification: string;
  }[];
  developmentPhases: {
    phase: string;
    duration: string;
    deliverables: string[];
  }[];
  estimatedHours: {
    min: number;
    max: number;
  };
  estimatedCost: {
    min: number;
    max: number;
  };
}

export interface ServicePackage {
  id: string;
  title: string;
  price: string;
  description: string;
  icon: string;
  features: string[];
  target: string;
}

export interface AdviceResource {
  id: string;
  title: string;
  category: 'freelance' | 'client-hunting' | 'pricing' | 'skills';
  summary: string;
  content: string;
  steps?: string[];
  templates?: {
    title: string;
    body: string;
  }[];
}
