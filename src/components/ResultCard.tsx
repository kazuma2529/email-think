import { Copy, Check } from 'lucide-react';
import React, { useState } from 'react';
import { RewriteResult } from '../types';
import { motion } from 'motion/react';

interface ResultCardProps {
  key?: React.Key;
  result: RewriteResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
      
      // Haptic feedback
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-2xl p-5 relative group overflow-hidden cursor-pointer"
      onClick={handleCopy}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
          {result.type}
        </span>
        <button
          className="text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          aria-label="Copy to clipboard"
        >
          {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
        </button>
      </div>
      <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
        {result.text}
      </p>
      
      {/* Shimmer effect on copy */}
      {copied && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_0.5s_ease-in-out]" />
      )}
    </motion.div>
  );
}
