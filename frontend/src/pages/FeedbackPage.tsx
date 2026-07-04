/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import type { PageView } from "../types";

interface FeedbackPageProps {
  onNavigate: (page: PageView) => void;
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({ onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto h-full flex flex-col justify-center items-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8"
      >
        <Check size={48} />
      </motion.div>

      <h2 className="font-serif text-4xl text-plantry-sageDark dark:text-white mb-4">Shopping Complete!</h2>
      <p className="text-lg text-stone-500 mb-8 max-w-sm mx-auto">
        We've updated your household inventory logic. Upcoming suggestions will be even smarter!
      </p>

      <div className="mt-12 w-full">
        <PrimaryButton onClick={() => onNavigate("dashboard")}>Back to Dashboard</PrimaryButton>
      </div>
    </motion.div>
  );
};