import React, { useState } from 'react';
import { RelationshipSelector } from './RelationshipSelector';
import { Relationship, RewriteResult } from '../types';
import { rewriteMessage } from '../services/geminiService';
import { ResultCard } from './ResultCard';
import { Loader2, ReplyAll } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ReplyMessage() {
  const [receivedMessage, setReceivedMessage] = useState('');
  const [draft, setDraft] = useState('');
  const [selectedRels, setSelectedRels] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<Relationship, RewriteResult[]>>({} as any);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !receivedMessage.trim() || selectedRels.length === 0) return;

    setLoading(true);
    setError(null);
    setResults({} as any);

    try {
      const newResults: Record<Relationship, RewriteResult[]> = {} as any;
      
      await Promise.all(
        selectedRels.map(async (rel) => {
          try {
            const res = await rewriteMessage('reply', draft, rel, receivedMessage);
            newResults[rel] = res;
          } catch (err) {
            console.error(`Failed to rewrite for ${rel}:`, err);
            throw new Error(`Failed to generate message for ${rel}`);
          }
        })
      );

      setResults(newResults);
      
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="received" className="text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
            Received Message
          </label>
          <textarea
            id="received"
            value={receivedMessage}
            onChange={(e) => setReceivedMessage(e.target.value)}
            placeholder="相手からのメッセージを貼り付けてください..."
            className="w-full h-24 glass-input rounded-2xl p-4 text-white placeholder:text-white/30 resize-none text-base"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="draft" className="text-xs font-semibold uppercase tracking-wider text-white/50 px-1">
            Your Reply Draft
          </label>
          <textarea
            id="draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="返信したい内容をラフに入力してください..."
            className="w-full h-24 glass-input rounded-2xl p-4 text-white placeholder:text-white/30 resize-none text-base"
            required
          />
        </div>

        <RelationshipSelector selected={selectedRels} onChange={setSelectedRels} />

        <button
          type="submit"
          disabled={loading || !draft.trim() || !receivedMessage.trim() || selectedRels.length === 0}
          className="w-full glass-button py-4 rounded-2xl text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <ReplyAll size={18} className="group-hover:-translate-y-1 transition-transform" />
              <span>Generate Reply</span>
            </>
          )}
          {loading && (
            <div className="absolute inset-0 bg-white/5 animate-pulse" />
          )}
        </button>
      </form>

      {error && (
        <div className="glass-panel border-red-500/30 bg-red-500/10 text-red-200 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <AnimatePresence>
        {Object.entries(results).map(([rel, res]) => {
          const resultsArray = res as RewriteResult[];
          return (
          <motion.div
            key={rel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium text-white/70 border-b border-white/10 pb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              To: {rel}
            </h3>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
              {resultsArray.map((r, i) => (
                <ResultCard key={i} result={r} />
              ))}
            </div>
          </motion.div>
        )})}
      </AnimatePresence>
    </div>
  );
}
