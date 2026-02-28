import React, { useState } from 'react';
import { Mode } from './types';
import { NewMessage } from './components/NewMessage';
import { ReplyMessage } from './components/ReplyMessage';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquarePlus, MessageCircleReply, Sparkles } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<Mode>('new');

  return (
    <div className="min-h-screen w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col relative">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <header className="mb-12 text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-2 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
        >
          <Sparkles className="text-emerald-400 w-8 h-8" />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
          NextMsg AI
        </h1>
        <p className="text-white/50 text-sm sm:text-base font-medium tracking-wide">
          最適化されたコミュニケーションを、一瞬で。
        </p>
      </header>

      <main className="flex-1 w-full flex flex-col">
        {/* Mode Switcher */}
        <div className="glass-panel p-1 rounded-full flex relative mb-8 mx-auto w-full max-w-md">
          <div 
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-full transition-transform duration-500 ease-out shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
            style={{ transform: mode === 'new' ? 'translateX(0)' : 'translateX(calc(100% + 8px))' }}
          />
          <button
            onClick={() => setMode('new')}
            className={`flex-1 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 relative z-10 transition-colors duration-300 ${mode === 'new' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            <MessageSquarePlus size={16} />
            New Message
          </button>
          <button
            onClick={() => setMode('reply')}
            className={`flex-1 py-3 rounded-full text-sm font-medium flex items-center justify-center gap-2 relative z-10 transition-colors duration-300 ${mode === 'reply' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
          >
            <MessageCircleReply size={16} />
            Reply
          </button>
        </div>

        {/* Content Area */}
        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'new' ? -20 : 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: mode === 'new' ? 20 : -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="w-full"
            >
              {mode === 'new' ? <NewMessage /> : <ReplyMessage />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
