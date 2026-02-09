# ЗАДАНИЕ 5: Форма связи с интеграцией Telegram

## Цель
Создать рабочую форму связи с валидацией и отправкой уведомлений в Telegram.

## Контекст
Форма должна собирать данные клиента и отправлять их в ваш Telegram через Bot API.

## Требования к выполнению

### 1. Validation Schemas

Создайте файл `lib/validations.ts`:

```typescript
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  email: z.string()
    .email('Некорректный email адрес'),
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(val),
      'Некорректный номер телефона'
    ),
  projectType: z.enum(['bot', 'website', 'pwa', 'automation', 'other'])
    .optional(),
  budget: z.string().optional(),
  message: z.string()
    .min(10, 'Сообщение должно содержать минимум 10 символов')
    .max(1000, 'Сообщение не должно превышать 1000 символов'),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

### 2. Telegram Helper

Создайте файл `lib/telegram.ts`:

```typescript
import { ContactFormData } from './validations';

export async function sendToTelegram(data: ContactFormData): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Telegram credentials not configured');
    return false;
  }

  const projectTypes: Record<string, string> = {
    bot: 'Telegram-бот',
    website: 'Веб-сайт',
    pwa: 'PWA приложение',
    automation: 'Автоматизация',
    other: 'Другое',
  };

  const message = `
🔔 <b>Новая заявка с сайта!</b>

👤 <b>Имя:</b> ${data.name}
📧 <b>Email:</b> ${data.email}
${data.phone ? `📱 <b>Телефон:</b> ${data.phone}` : ''}
${data.projectType ? `📋 <b>Тип проекта:</b> ${projectTypes[data.projectType]}` : ''}
${data.budget ? `💰 <b>Бюджет:</b> ${data.budget}` : ''}

💬 <b>Сообщение:</b>
${data.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
  `.trim();

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    return false;
  }
}
```

### 3. API Route

Создайте файл `app/api/contact/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { sendToTelegram } from '@/lib/telegram';

// Simple in-memory rate limiting
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = requestCounts.get(ip);

  if (!limit || now > limit.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 3) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Слишком много запросов. Попробуйте позже.' },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Send to Telegram
    const sent = await sendToTelegram(validatedData);

    if (!sent) {
      return NextResponse.json(
        { error: 'Ошибка при отправке сообщения. Попробуйте позже.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Заявка успешно отправлена! Свяжемся с вами в ближайшее время.' 
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Проверьте правильность заполнения формы', details: error },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
```

### 4. Contact Form Component

Создайте файл `components/forms/ContactForm.tsx`:

```typescript
'use client';

import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { Button, Input, Textarea } from '@/components/ui';
import { contactSchema, ContactFormData } from '@/lib/validations';

export const ContactForm: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmit = async (data: ContactFormData) => {
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
        <label className="block text-sm font-medium text-text-secondary mb-2">
          Тип проекта
        </label>
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
          <option value="< 50k">До 50 000 ₽</option>
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
```

### 5. Contact Page

Создайте файл `app/contact/page.tsx`:

```typescript
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
```

### 6. Обновление .env

Обновите `.env.local`:

```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
TELEGRAM_CHAT_ID=your_actual_chat_id_here
```

## Критерии приемки

✅ Форма с валидацией (react-hook-form + zod)  
✅ API route для обработки формы  
✅ Интеграция с Telegram Bot API  
✅ Rate limiting (3 запроса в минуту)  
✅ Обработка ошибок  
✅ Success/Error states  
✅ Responsive дизайн  
✅ Loading states на кнопке  
✅ Форма очищается после успешной отправки  
✅ Accessibility: labels, error messages  

## Тестирование

### Настройка Telegram бота:

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Получите свой chat_id (можно через @userinfobot)
4. Добавьте в `.env.local`

### Тестирование формы:

1. Откройте http://localhost:3000/contact
2. Заполните форму корректными данными
3. Отправьте - должно прийти уведомление в Telegram
4. Попробуйте некорректные данные - должны появиться ошибки
5. Попробуйте отправить 4 раза подряд - должна сработать rate limit

## Примечания

- Rate limiting простой (in-memory), для production использовать Redis
- HTML форматирование в Telegram использует parse_mode: 'HTML'
- Обязательны поля: name, email, message
- Форма автоматически reset() после успешной отправки
- Environment variables проверяются перед отправкой

## Git Commit

```bash
git add .
git commit -m "feat: add contact form with telegram integration"
```
