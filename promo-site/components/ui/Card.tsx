'use client';

import type { HTMLAttributes } from 'react';
import type { HTMLMotionProps } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CardProps = HTMLAttributes<HTMLDivElement> &
  HTMLMotionProps<'div'> & {
    hoverable?: boolean;
    children: React.ReactNode;
  };

export const Card = ({ hoverable = true, children, className = '', ...props }: CardProps) => {
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
