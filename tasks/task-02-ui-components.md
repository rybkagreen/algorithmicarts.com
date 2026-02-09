# ЗАДАНИЕ 2: Создание библиотеки UI компонентов

## Цель
Создать переиспользуемые UI компоненты в стиле Warp/Cursor: Button, Card, Badge, Input, CodeBlock.

## Контекст
Все компоненты должны быть темными, с высоким контрастом, поддерживать анимации через Framer Motion.

## Требования к выполнению

### 1. Button Component

Создайте файл `components/ui/Button.tsx`:

```typescript
'use client';

import { FC, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-lg transition-all duration-150 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent-primary text-background-primary hover:bg-accent-primary/90 shadow-lg hover:shadow-accent-primary/50',
    secondary: 'bg-background-secondary text-text-primary border border-border-primary hover:border-accent-primary',
    ghost: 'text-text-secondary hover:text-accent-primary hover:bg-background-secondary',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3.5 text-lg',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="animate-spin" size={18} />}
      {children}
    </motion.button>
  );
};
```

### 2. Card Component

Создайте файл `components/ui/Card.tsx`:

```typescript
'use client';

import { FC, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: React.ReactNode;
}

export const Card: FC<CardProps> = ({ 
  hoverable = true, 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hoverable ? { y: -5 } : {}}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-background-secondary border border-border-primary rounded-xl p-6',
        hoverable && 'hover:border-accent-primary hover:shadow-lg hover:shadow-accent-primary/10',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
```

### 3. Badge Component

Создайте файл `components/ui/Badge.tsx`:

```typescript
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'muted';
  className?: string;
}

export const Badge: FC<BadgeProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variants = {
    default: 'bg-background-tertiary text-text-secondary border-border-primary',
    accent: 'bg-accent-primary/10 text-accent-primary border-accent-primary/30',
    muted: 'bg-background-secondary text-text-muted border-border-secondary',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono border transition-colors duration-150',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
```

### 4. Input Component

Создайте файл `components/ui/Input.tsx`:

```typescript
import { FC, InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 bg-background-secondary border border-border-primary rounded-lg',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary',
            'transition-colors duration-150',
            error && 'border-accent-error focus:border-accent-error focus:ring-accent-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### 5. Textarea Component

Создайте файл `components/ui/Textarea.tsx`:

```typescript
import { FC, TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 bg-background-secondary border border-border-primary rounded-lg',
            'text-text-primary placeholder:text-text-muted',
            'focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary',
            'transition-colors duration-150 resize-none',
            error && 'border-accent-error focus:border-accent-error focus:ring-accent-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-accent-error">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
```

### 6. CodeBlock Component

Создайте файл `components/ui/CodeBlock.tsx`:

```typescript
'use client';

import { FC, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CodeBlockProps {
  code: string;
  language?: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({ code, language = 'typescript' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-background-tertiary/80 backdrop-blur-sm 
                     border border-border-primary hover:border-accent-primary
                     transition-all duration-150 opacity-0 group-hover:opacity-100"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Check size={16} className="text-accent-success" />
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <Copy size={16} className="text-text-secondary" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
      
      <div className="bg-background-tertiary rounded-lg border border-border-primary overflow-hidden">
        <div className="px-4 py-2 border-b border-border-primary flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <span className="text-xs text-text-muted font-mono ml-2">{language}</span>
        </div>
        
        <pre className="p-4 overflow-x-auto">
          <code className="font-mono text-sm text-text-primary">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
```

### 7. Modal Component

Создайте файл `components/ui/Modal.tsx`:

```typescript
'use client';

import { FC, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background-secondary border border-border-primary rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-border-primary">
                  <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-background-tertiary rounded-lg transition-colors"
                  >
                    <X size={20} className="text-text-secondary" />
                  </button>
                </div>
              )}
              
              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
```

### 8. Loader Component

Создайте файл `components/ui/Loader.tsx`:

```typescript
'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

export const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 bg-accent-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

### 9. Index file для экспорта

Создайте файл `components/ui/index.ts`:

```typescript
export { Button } from './Button';
export { Card } from './Card';
export { Badge } from './Badge';
export { Input } from './Input';
export { Textarea } from './Textarea';
export { CodeBlock } from './CodeBlock';
export { Modal } from './Modal';
export { Loader } from './Loader';
```

### 10. Установка недостающих зависимостей

Если `clsx` и `tailwind-merge` еще не установлены:

```bash
npm install clsx tailwind-merge
```

## Критерии приемки

✅ Все 8 UI компонентов созданы  
✅ Компоненты используют TypeScript с правильными типами  
✅ Применены Tailwind классы из кастомной темы  
✅ Анимации работают (Framer Motion)  
✅ Компоненты адаптивны  
✅ Accessibility: focus states, ARIA labels где нужно  
✅ Все компоненты экспортированы через index.ts  
✅ Нет TypeScript ошибок  
✅ Нет предупреждений в консоли  

## Тестирование

Создайте тестовую страницу `app/ui-test/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Button, Card, Badge, Input, Textarea, CodeBlock, Modal, Loader } from '@/components/ui';
import { Github } from 'lucide-react';

export default function UITestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-4xl font-bold">UI Components Test</h1>

      {/* Buttons */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="lg">Large</Button>
          <Button variant="primary" isLoading>Loading</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary">
            <Github size={18} />
            With Icon
          </Button>
        </div>
      </Card>

      {/* Badges */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="muted">Muted</Badge>
          <Badge variant="accent">React</Badge>
          <Badge variant="accent">TypeScript</Badge>
          <Badge variant="accent">Next.js</Badge>
        </div>
      </Card>

      {/* Inputs */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Inputs</h2>
        <div className="space-y-4 max-w-md">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="your@email.com" />
          <Input label="With Error" error="This field is required" />
          <Textarea label="Message" placeholder="Your message..." rows={4} />
        </div>
      </Card>

      {/* Code Block */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Code Block</h2>
        <CodeBlock
          language="typescript"
          code={`const greeting = "Hello, World!";
console.log(greeting);`}
        />
      </Card>

      {/* Modal */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Test Modal"
        >
          <p className="text-text-secondary">This is a test modal content.</p>
        </Modal>
      </Card>

      {/* Loader */}
      <Card>
        <h2 className="text-2xl font-semibold mb-4">Loader</h2>
        <Loader />
      </Card>
    </div>
  );
}
```

Откройте http://localhost:3000/ui-test для проверки всех компонентов.

## Примечания

- Все компоненты должны быть 'use client' если используют hooks или события
- Используйте forwardRef для Input/Textarea для работы с react-hook-form
- Анимации должны учитывать prefers-reduced-motion
- Все интерактивные элементы должны иметь hover и focus states

## Git Commit

После выполнения:
```bash
git add .
git commit -m "feat: add UI components library"
```
