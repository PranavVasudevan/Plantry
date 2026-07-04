/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Calendar, Sparkles, ArrowRight } from "lucide-react";
import { pageVariants, staggerContainer } from "../components/ui/animations";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SectionHeader } from "../components/ui/SectionHeader";
import { SuggestionCard } from "../components/suggestions/SuggestionCard";
import { api } from "../services/api";
import type { PageView, ShoppingListItem, Suggestion, SuggestionAction } from "../types";

interface SmartSuggestionsPageProps {
  onNavigate: (page: PageView) => void;
  currentList: ShoppingListItem[];
  setShoppingList: (list: ShoppingListItem[]) => void;
}

export const SmartSuggestionsPage: React.FC<SmartSuggestionsPageProps> = ({ onNavigate, currentList, setShoppingList }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (currentList.length === 0) return;

    setLoading(true);
    api
      .inferSuggestions(currentList.map(i => i.name))
      .then(data => setSuggestions(data.suggestions || []))
      .catch(err => {
        console.error("Suggestion fetch failed", err);
        setSuggestions([]);
      })
      .finally(() => setLoading(false));
  }, [currentList]);

  const handleAction = async (id: string, action: SuggestionAction) => {
    setSuggestions(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        return {
          ...s,
          added: action === "accept",
          rejected: action === "reject" || action === "block" || action === "penalize"
        };
      })
    );

    if (action === "accept") return;

    try {
      await api.sendSuggestionFeedback(id, action);
    } catch (err) {
      console.error("Failed to send feedback", err);
    }
  };

  const handleContinue = () => {
    const acceptedSuggestions: ShoppingListItem[] = suggestions
      .filter(s => s.added)
      .map(s => ({ id: s.id, name: s.name, type: s.type, checked: false }));
    setShoppingList([...currentList, ...acceptedSuggestions]);
    onNavigate("active-list");
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto pb-24">
      <SectionHeader title="We found a few things." subtitle="Based on your household history, you might be forgetting these." />

      <motion.div key={suggestions.length} variants={staggerContainer} initial={false} animate="show" className="space-y-6">
        {loading && <p className="text-center text-stone-400">Thinking based on your past lists…</p>}

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-plantry-sage mb-4 flex items-center gap-2">
            <RefreshCw size={14} /> Frequently Bought Together
          </h3>
          {suggestions
            .filter(s => s.type === "frequent")
            .map(s => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                onAction={handleAction}
              />
            ))}
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center gap-2">
            <Calendar size={14} /> You Usually Forget
          </h3>
          {suggestions
            .filter(s => s.type === "forgotten")
            .map(s => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                onAction={handleAction}
              />
            ))}
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-plantry-accent mb-4 flex items-center gap-2">
            <Sparkles size={14} /> Seasonal Reminders
          </h3>
          {suggestions
            .filter(s => s.type === "seasonal")
            .map(s => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                expanded={expandedId === s.id}
                onToggle={() => setExpandedId(expandedId === s.id ? null : s.id)}
                onAction={handleAction}
              />
            ))}
        </div>
      </motion.div>

      <div className="fixed bottom-24 left-0 right-0 px-6 md:px-0 max-w-xl mx-auto pointer-events-none">
        <div className="pointer-events-auto">
          <PrimaryButton onClick={handleContinue}>
            Review Final List <ArrowRight size={18} />
          </PrimaryButton>
        </div>
      </div>
    </motion.div>
  );
};