export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const SKILL_CATEGORIES = [
  { value: 'TECHNICAL', label: 'Technical Skill' },
  { value: 'SOFT', label: 'Soft Skill' },
  { value: 'CERTIFICATION', label: 'Certification' },
  { value: 'METHODOLOGY', label: 'Methodology & Process' },
];

export const PROFICIENCY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
];

export const EXPERIENCE_LEVELS = [
  { value: 'ENTRY_LEVEL', label: 'Entry Level (0-2 yrs)' },
  { value: 'MID_LEVEL', label: 'Mid Level (2-5 yrs)' },
  { value: 'SENIOR_LEVEL', label: 'Senior Level (5+ yrs)' },
  { value: 'LEAD', label: 'Lead / Principal' },
];

export const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
];
