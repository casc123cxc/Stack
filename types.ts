export type TechStack = 
  'React' | 'Python' | 'Node.js' | 'Vue' | 'Go' | 'Rust' | 'SQL' | 'Generic' | 
  'TypeScript' | 'Next.js' | 'Tailwind CSS' | 'PostgreSQL' | 'MongoDB' | 
  'Docker' | 'AWS' | 'C#' | 'Java' | 'C++' | 'Swift' | 'Flutter' | 'Svelte' | 'Angular';

export interface Constraint {
  id: string;
  label: string;
  description: string;
  active: boolean;
  category: 'safety' | 'style' | 'performance' | 'compatibility';
}

export interface ProjectConfig {
  name: string;
  description: string;
  selectedStacks: TechStack[];
  additionalContext: string;
  constraints: Constraint[];
  tone: 'Professional' | 'Educational' | 'Concise' | 'Socratic';
}

export interface GeneratedPromptResponse {
  markdown: string;
  tips: string[];
}

export interface Template {
  name: string;
  description: string;
  icon: string;
  config: Partial<ProjectConfig>;
}