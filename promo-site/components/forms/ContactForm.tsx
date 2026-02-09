'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { contactSchema, type ContactFormData } from '@/lib/validations';

export const ContactForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: result.message,
        });
        reset();
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Произошла ошибка. Попробуйте позже.',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Не удалось отправить сообщение. Проверьте подключение к интернету.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        label="Ваше имя *"
        placeholder="Иван Иванов"
        error={errors.name?.message}
        {...register('name')}
      />

      {/* Email */}
      <Input
        label="Email *"
        type="email"
        placeholder="ivan@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      {/* Phone */}
      <Input
        label="Телефон"
        type="tel"
        placeholder="+7 (999) 123-45-67"
        error={errors.phone?.message}
        {...register('phone')}
      />

      {/* Project Type */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">Тип проекта</label>
        <select
          className="w-full px-4 py-2.5 bg-background-secondary border border-border-primary rounded-lg
                     text-text-primary focus:outline-none focus:border-accent-primary
                     focus:ring-1 focus:ring-accent-primary transition-colors duration-150"
          {...register('projectType')}
        >
          <option value="">Выберите тип проекта</option>
          <option value="bot">Telegram-бот</option>
          <option value="website">Веб-сайт</option>
          <option value="pwa">PWA приложение</option>
          <option value="automation">Автоматизация</option>
          <option value="other">Другое</option>
        </select>
        {errors.projectType && (
          <p className="mt-1 text-sm text-accent-error">{errors.projectType.message}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Примерный бюджет
        </label>
        <select
          className="w-full px-4 py-2.5 bg-background-secondary border border-border-primary rounded-lg
                     text-text-primary focus:outline-none focus:border-accent-primary
                     focus:ring-1 focus:ring-accent-primary transition-colors duration-150"
          {...register('budget')}
        >
          <option value="">Выберите диапазон</option>
          <option value="&lt; 50k">До 50 000 ₽</option>
          <option value="50k-100k">50 000 - 100 000 ₽</option>
          <option value="100k-200k">100 000 - 200 000 ₽</option>
          <option value="200k+">От 200 000 ₽</option>
          <option value="discuss">Обсудим</option>
        </select>
      </div>

      {/* Message */}
      <Textarea
        label="Сообщение *"
        placeholder="Расскажите о вашем проекте..."
        rows={6}
        error={errors.message?.message}
        {...register('message')}
      />

      {/* Status Message */}
      {submitStatus && (
        <div
          className={`p-4 rounded-lg border ${
            submitStatus.type === 'success'
              ? 'bg-accent-success/10 border-accent-success text-accent-success'
              : 'bg-accent-error/10 border-accent-error text-accent-error'
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {!isSubmitting && <Send size={20} />}
        {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
      </Button>

      <p className="text-sm text-text-muted text-center">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
};
