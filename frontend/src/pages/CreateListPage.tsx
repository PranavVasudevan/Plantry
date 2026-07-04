/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Loader2 } from "lucide-react";
import { pageVariants } from "../components/ui/animations";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { SectionHeader } from "../components/ui/SectionHeader";
import { api } from "../services/api";
import type { PageView, ShoppingListItem } from "../types";

interface CreateListPageProps {
  onNavigate: (page: PageView, params?: { shoppingEventId?: string }) => void;
  setShoppingList: (list: ShoppingListItem[]) => void;
  mode?: "list" | "forgotten";
  shoppingEventId?: string;
}

export const CreateListPage: React.FC<CreateListPageProps> = ({ onNavigate, setShoppingList, mode = "list", shoppingEventId }) => {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { items: parsedItems } = await api.parseItems(input);

      if (mode === "forgotten") {
        if (!shoppingEventId) {
          throw new Error("Missing shoppingEventId for forgotten mode");
        }
        await api.addForgottenItems(shoppingEventId, parsedItems);
        onNavigate("history");
        return;
      }

      const manualItems: ShoppingListItem[] = parsedItems.map(item => ({
        id: crypto.randomUUID(),
        name: item,
        type: "manual",
        checked: false
      }));

      setShoppingList(manualItems);
      onNavigate("suggestions");
    } catch (err) {
      console.error("Item parsing failed:", err);
      setError("Something went wrong processing your list. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-xl mx-auto h-full flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <SectionHeader
          title={mode === "forgotten" ? "What did you forget?" : "What do you need?"}
          subtitle={
            mode === "forgotten"
              ? "Add items you realized later. This helps us learn your habits."
              : "Type naturally. We'll organize it and remind you of what you might be missing."
          }
        />

        <div className="relative">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. Milk, eggs, tomatoes, basmati rice..."
            className="w-full h-64 bg-transparent text-3xl font-serif leading-relaxed text-plantry-sageDark dark:text-plantry-cream placeholder:text-stone-300 dark:placeholder:text-zinc-700 resize-none focus:outline-none"
            autoFocus
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="sticky bottom-6">
        <PrimaryButton onClick={handleGenerate} disabled={!input.trim() || isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" /> {mode === "forgotten" ? "Analyzing Forgotten Items..." : "Analyzing Habits..."}
            </>
          ) : (
            <>
              <BrainCircuit size={20} /> {mode === "forgotten" ? "Add Items..." : "Generate Smart Suggestions"}
            </>
          )}
        </PrimaryButton>
      </div>
    </motion.div>
  );
};