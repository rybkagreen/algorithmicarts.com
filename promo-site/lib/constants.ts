export const SITE_CONFIG = {
  name: 'Ваше Имя',
  title: 'Ваше Имя | Fullstack Developer',
  description: 'Разрабатываю digital-инструменты, которые решают задачи бизнеса',
  email: 'your-email@example.com',
  github: 'https://github.com/your-username',
  linkedin: 'https://linkedin.com/in/your-username',
  telegram: 'https://t.me/your-username',
  avatar: '/images/avatar.jpg',
};

export const TECH_STACK = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Redux', 'Jest'],
  backend: ['Node.js', 'Express', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'],
  tools: ['Git', 'CI/CD', 'Jira', 'Figma', 'VS Code', 'Linux', 'AWS'],
};

export const NAVIGATION = [
  { name: 'Главная', href: '/' },
  { name: 'Портфолио', href: '/portfolio' },
  { name: 'Услуги', href: '/services' },
  { name: 'О себе', href: '/about' },
  { name: 'Контакты', href: '/contact' },
];

export const SOCIAL_LINKS = {
  github: SITE_CONFIG.github,
  linkedin: SITE_CONFIG.linkedin,
  telegram: SITE_CONFIG.telegram,
  email: `mailto:${SITE_CONFIG.email}`,
};
