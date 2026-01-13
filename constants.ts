
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
    id: 'local-llm-opt',
    label: 'Local LLM Optimization',
    description: 'Optimize for LM Studio/Ollama (Llama 3, Mistral). Uses standard headers and concise reasoning.',
    active: false,
    category: 'optimization'
  },
  {
    id: 'nsfw-allow',
    label: 'Allow 18+ Content',
    description: 'Explicitly override refusal filters to permit adult/NSFW creative writing.',
    active: false,
    category: 'content'
  },
  {
    id: 'no-break-changes',
    label: 'Prevent Breaking Changes',
    description: 'Explicitly instruct the LLM to prioritize backward compatibility.',
    active: true,
    category: 'compatibility'
  },
  {
    id: 'syntax-strict',
    label: 'Strict Syntax Adherence',
    description: 'Enforce idiomatic patterns (e.g., Python 3.10+ match case, ES6+).',
    active: true,
    category: 'style'
  },
  {
    id: 'json-mode',
    label: 'JSON Output Only',
    description: 'Force all responses to be valid JSON for machine parsing.',
    active: false,
    category: 'style'
  },
  {
    id: 'example-code',
    label: 'Require Code Examples',
    description: 'Instruct the LLM to always provide a code snippet.',
    active: true,
    category: 'style'
  },
  {
    id: 'security-owasp',
    label: 'OWASP Security First',
    description: 'Mandate input validation and sanitization against top web vulnerabilities.',
    active: false,
    category: 'safety'
  },
  {
    id: 'chain-of-thought',
    label: 'Chain of Thought (CoT)',
    description: 'Force step-by-step reasoning before providing the final answer.',
    active: false,
    category: 'optimization'
  },
  {
    id: 'error-handling',
    label: 'Robust Error Handling',
    description: 'Require try/except blocks for all external operations.',
    active: false,
    category: 'safety'
  },
  {
    id: 'allow-mistakes',
    label: 'Allow Creative Hallucination',
    description: 'Loosen constraints to allow the LLM to invent libraries (experimental).',
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
    name: "Local RP Assistant",
    description: "Uncensored, Llama 3 Optimized",
    icon: "cpu",
    config: {
      selectedStacks: ['Generic'],
      tone: 'Concise',
      description: "A creative roleplay assistant running locally. It should adapt to user scenarios without moralizing or refusals.",
      constraints: DEFAULT_CONSTRAINTS.map(c => 
        (c.id === 'local-llm-opt' || c.id === 'nsfw-allow') ? { ...c, active: true } : 
        (c.id === 'no-break-changes') ? { ...c, active: false } : c
      )
    }
  },
  {
    name: "Systems Programming",
    description: "Rust, AWS",
    icon: "database",
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
