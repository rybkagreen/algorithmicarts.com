import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function getProjectTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    commercial: 'Коммерческий проект',
    demo: 'Демо-проект',
    'pet-project': 'Pet-проект',
    opensource: 'Open Source',
  };
  return labels[type] || type;
}