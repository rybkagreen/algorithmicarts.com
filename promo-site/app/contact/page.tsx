import { Metadata } from 'next';
import { Mail, Send, MapPin, Clock } from 'lucide-react';
import { Card } from '@/components/ui';
import { ContactForm } from '@/components/forms/ContactForm';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Контакты | ' + SITE_CONFIG.name,
  description: 'Свяжитесь со мной для обсуждения вашего проекта',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono">
            <span className="text-accent-primary">&gt; </span>
            Связаться со мной
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Готов обсудить ваш проект и найти оптимальное решение.
            Отвечаю в течение 24 часов.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="md:col-span-1 space-y-6">
            <Card hoverable={false}>
              <div className="flex items-start gap-3">
                <Mail className="text-accent-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>
            </Card>

            <Card hoverable={false}>
              <div className="flex items-start gap-3">
                <Send className="text-accent-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Telegram</h3>
                  <a
                    href={SITE_CONFIG.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-accent-primary transition-colors text-sm"
                  >
                    @{SITE_CONFIG.telegram.split('/').pop()}
                  </a>
                </div>
              </div>
            </Card>

            <Card hoverable={false}>
              <div className="flex items-start gap-3">
                <MapPin className="text-accent-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Локация</h3>
                  <p className="text-text-secondary text-sm">
                    Работаю удаленно<br />
                    Москва, Россия
                  </p>
                </div>
              </div>
            </Card>

            <Card hoverable={false}>
              <div className="flex items-start gap-3">
                <Clock className="text-accent-primary mt-1" size={20} />
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Время ответа</h3>
                  <p className="text-text-secondary text-sm">
                    Обычно отвечаю в течение 24 часов
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card hoverable={false}>
              <h2 className="text-2xl font-bold mb-6 text-text-primary">
                Оставьте заявку
              </h2>
              <ContactForm />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}