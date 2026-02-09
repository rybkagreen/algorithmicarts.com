'use client';

import type { FC } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui';
import { SITE_CONFIG } from '@/lib/constants';

export const ContactPreview: FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-mono">
            <span className="text-accent-primary">&gt; </span>
            Готовы начать проект?
          </h2>

          <p className="text-text-secondary text-lg mb-8">
            Обсудим вашу задачу и найдем оптимальное решение. Отвечаю в течение 24 часов.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="primary" size="lg">
              <Send size={20} />
              Telegram
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = `mailto:${SITE_CONFIG.email}`)}
            >
              <Mail size={20} />
              Email
            </Button>
          </div>

          {/* Quick contact info */}
          <div className="pt-8 border-t border-border-primary">
            <p className="text-text-muted text-sm mb-2">Или напишите напрямую:</p>
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="text-accent-primary hover:underline font-mono"
            >
              {SITE_CONFIG.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
