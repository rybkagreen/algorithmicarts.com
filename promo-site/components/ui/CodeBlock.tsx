'use client';

import type { FC } from 'react';
import { useState } from 'react';
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
          <code className="font-mono text-sm text-text-primary">{code}</code>
        </pre>
      </div>
    </div>
  );
};
