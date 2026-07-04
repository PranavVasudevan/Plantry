/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { pageVariants } from "../components/ui/animations";
import { api } from "../services/api";
import type { PageView, ShoppingListItem } from "../types";

interface ActiveListPageProps {
  onNavigate: (page: PageView) => void;
  list: ShoppingListItem[];
}

export const ActiveListPage: React.FC<ActiveListPageProps> = ({ onNavigate, list }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeSession = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await api.completeShopping(list.map(i => i.name));
      onNavigate("feedback");
    } catch (err) {
      console.error("Failed to complete session", err);
      setError("Couldn't save your trip. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto pb-32">
      <div className="mb-8">
        <h2 className="font-serif text-3xl text-plantry-sageDark dark:text-plantry-cream">Shopping List</h2>
        <p className="text-stone-500">{list.length} items</p>
      </div>

      <div className="space-y-3">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center p-4 rounded-xl border bg-white border-stone-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-700"
          >
            <span className="text-lg text-plantry-text dark:text-stone-100">{item.name}</span>
            {item.type !== "manual" && (
              <span className="ml-auto text-xs font-bold text-plantry-sage bg-plantry-sage/10 px-2 py-1 rounded">AI</span>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      <div className="fixed bottom-24 left-0 right-0 px-6 md:px-0 max-w-xl mx-auto">
        <PrimaryButton onClick={completeSession} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Complete Session"}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};