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