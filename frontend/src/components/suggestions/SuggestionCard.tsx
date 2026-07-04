/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ThumbsDown, X, BrainCircuit } from "lucide-react";
import { fadeUpItem } from "../ui/animations";
import type { Suggestion, SuggestionAction } from "../../types";

interface SuggestionCardProps {
  suggestion: Suggestion;
  expanded: boolean;
  onToggle: () => void;
  onAction: (id: string, action: SuggestionAction) => void;
}

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, expanded, onToggle, onAction }) => {
  const isInteracted = suggestion.added || suggestion.rejected;

  if (isInteracted && suggestion.rejected) return null;

  return (
    <motion.div
      variants={fadeUpItem}
      className={`glass-card overflow-hidden transition-all duration-300 ${
        suggestion.added ? "border-plantry-sage bg-plantry-sage/5" : ""
      }`}
    >
      <div className="p-5 flex items-center justify-between cursor-pointer" onClick={!isInteracted ? onToggle : undefined}>
        <div className="flex items-center gap-4">
          <div
            className={`w-2 h-2 rounded-full ${
              suggestion.confidence === "high" ? "bg-green-500" : suggestion.confidence === "medium" ? "bg-yellow-500" : "bg-stone-300"
            }`}
          ></div>
          <div>
            <h4 className="font-serif text-xl text-plantry-sageDark dark:text-white">{suggestion.name}</h4>
            {suggestion.added && <span className="text-xs font-bold text-plantry-sage uppercase tracking-wider">Added to list</span>}
          </div>
        </div>
        {!isInteracted && (
          <div className="flex items-center gap-2">
            <button
              onClick={e => {
                e.stopPropagation();
                onAction(suggestion.id, "accept");
              }}
              className="p-3 bg-stone-100 hover:bg-plantry-sage hover:text-white rounded-full transition-colors dark:bg-zinc-800"
            >
              <Plus size={20} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && !isInteracted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-stone-50/50 dark:bg-zinc-800/30 border-t border-stone-100 dark:border-zinc-800 px-5 py-4"
          >
            <div className="flex items-start gap-3 mb-4">
              <BrainCircuit size={16} className="text-plantry-sage mt-1" />
              <div>
                <p className="text-sm font-bold text-plantry-sageDark dark:text-stone-200 mb-1">Why this?</p>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">{suggestion.reason}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onAction(suggestion.id, "reject");
                }}
                className="flex-1 py-2 text-sm font-medium text-stone-500 hover:bg-stone-100 rounded-lg flex items-center justify-center gap-2 transition-colors dark:hover:bg-zinc-700"
              >
                <ThumbsDown size={14} /> Not now
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onAction(suggestion.id, "penalize");
                }}
                className="flex-1 py-2 text-sm font-medium text-red-400 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 transition-colors dark:hover:bg-red-900/20"
              >
                <X size={14} /> Suggest less often
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onAction(suggestion.id, "block");
                }}
                className="flex-1 py-2 text-sm font-medium text-red-400 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 transition-colors dark:hover:bg-red-900/20"
              >
                <X size={14} /> Never suggest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};