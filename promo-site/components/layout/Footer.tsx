import type { FC } from 'react';
import Link from 'next/link';
import { Github, Linkedin, Send } from 'lucide-react';
import { SITE_CONFIG, NAVIGATION, TECH_STACK } from '@/lib/constants';
import { Badge } from '@/components/ui';

export const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-secondary border-t border-border-primary mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-accent-primary font-mono text-xl">&gt;</span>
              <span className="text-xl font-bold font-mono">{SITE_CONFIG.name}</span>
            </Link>
            <p className="text-text-secondary mb-4 max-w-md">{SITE_CONFIG.description}</p>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.frontend.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="default">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary font-semibold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-text-secondary hover:text-accent-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Send size={16} />
                  Email
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONFIG.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-accent-primary transition-colors text-sm flex items-center gap-2"
                >
                  <Send size={16} />
                  Telegram
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-primary flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-sm">
            © {currentYear} {SITE_CONFIG.name}. Все права защищены.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href={SITE_CONFIG.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href={SITE_CONFIG.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent-primary transition-colors"
              aria-label="Telegram"
            >
              <Send size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
