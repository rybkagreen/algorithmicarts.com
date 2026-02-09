export type ProjectType = 'commercial' | 'demo' | 'pet-project' | 'opensource';

export interface Project {
  id: string;
  type: ProjectType;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  liveDemo?: string;
  github?: string;
  results?: {
    [key: string]: string;
  };
  features?: string[];
  testimonial?: {
    author: string;
    role: string;
    text: string;
  };
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  problem: string;
  solution: string;
  technologies: string[];
  benefits: string[];
  pricing?: {
    from: number;
    to: number;
    currency: string;
  };
}

export interface Testimonial {
  id: number;
  author: string;
  role: string;
  content: string;
  rating: number;
  project?: string;
}