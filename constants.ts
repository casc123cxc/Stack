import { Constraint, TechStack, Template } from './types';

export const TECH_STACKS: TechStack[] = [
  'Python', 'TypeScript', 'React', 'Node.js', 'Next.js', 'Tailwind CSS',
  'Vue', 'Svelte', 'Angular',
  'Go', 'Rust', 'C++', 'Java', 'C#',
  'SQL', 'PostgreSQL', 'MongoDB',
  'Docker', 'AWS', 'Swift', 'Flutter', 'Generic'
];

export const DEFAULT_CONSTRAINTS: Constraint[] = [
  {
    id: 'no-break-changes',
    label: 'Prevent Breaking Changes',
    description: 'Explicitly instruct the LLM to prioritize backward compatibility and avoid deprecated methods.',
    active: true,
    category: 'compatibility'
  },
  {
    id: 'syntax-strict',
    label: 'Strict Syntax Adherence',
    description: 'Enforce specific language versions and idiomatic patterns (e.g., Python 3.10+ match case, ES6+).',
    active: true,
    category: 'style'
  },
  {
    id: 'example-code',
    label: 'Require Code Examples',
    description: 'Instruct the LLM to always provide a code snippet demonstrating the solution.',
    active: true,
    category: 'style'
  },
  {
    id: 'error-handling',
    label: 'Robust Error Handling',
    description: 'Require try/except or try/catch blocks for all external operations.',
    active: false,
    category: 'safety'
  },
  {
    id: 'comments-docs',
    label: 'Documentation & Comments',
    description: 'Require JSDoc/Docstrings for all functions.',
    active: false,
    category: 'style'
  },
  {
    id: 'concise-code',
    label: 'Concise Implementation',
    description: 'Avoid boilerplate; prefer functional patterns where applicable.',
    active: false,
    category: 'style'
  },
  {
    id: 'allow-mistakes',
    label: 'Allow Creative Hallucination',
    description: 'Loosen constraints to allow the LLM to invent libraries or patterns (experimental).',
    active: false,
    category: 'safety' 
  }
];

export const PROJECT_TEMPLATES: Template[] = [
  {
    name: "Modern Fullstack",
    description: "Next.js, TypeScript, Tailwind",
    icon: "layers",
    config: {
      selectedStacks: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      tone: 'Professional',
      description: "Build a responsive web application with server-side rendering and type safety. Ensure components are modular and styled using utility classes."
    }
  },
  {
    name: "Data Science Core",
    description: "Python, SQL, Docker",
    icon: "database",
    config: {
      selectedStacks: ['Python', 'SQL', 'Docker'],
      tone: 'Educational',
      description: "Create a data processing pipeline. Include pandas for manipulation and SQLAlchemy for database interactions. Containerize the script."
    }
  },
  {
    name: "Systems Programming",
    description: "Rust, AWS",
    icon: "cpu",
    config: {
      selectedStacks: ['Rust', 'AWS'],
      tone: 'Concise',
      description: "Develop a high-performance lambda function. Focus on memory safety, concurrency, and efficient error handling."
    }
  }
];

export const MOCK_LOADING_STEPS = [
  "Analyzing technology stack requirements...",
  "Formulating constraints and guardrails...",
  "Structuring output format...",
  "Optimizing for token efficiency...",
  "Finalizing system instruction..."
];