/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { useAuth } from "../context/AuthContext";

type Mode = "signin" | "signup";

export const AuthPage: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, error, clearError } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const switchMode = (next: Mode) => {
    clearError();
    setMode(next);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch {
      // error already captured in AuthContext state
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // error already captured in AuthContext state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center bg-plantry-light dark:bg-zinc-950 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 rounded-full mx-auto mb-6 shadow-xl shadow-plantry-sage/30 overflow-hidden"
          >
            <img src="/logo.png" alt="Plantry" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="font-serif text-5xl text-plantry-sageDark dark:text-plantry-cream mb-4">Plantry</h1>
          <p className="text-lg text-plantry-textLight dark:text-stone-400">The intelligent assistant for your household.</p>
        </div>

        <form className="space-y-4" onSubmit={handleEmailSubmit}>
          <div className="bg-white dark:bg-zinc-900 p-1 rounded-2xl border border-stone-200 dark:border-zinc-800 flex shadow-sm">
            <button
              type="button"
              onClick={() => switchMode("signin")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                mode === "signin"
                  ? "bg-plantry-light dark:bg-zinc-800 text-plantry-sageDark dark:text-white shadow-sm"
                  : "text-stone-500 dark:text-stone-400 hover:text-plantry-sageDark"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                mode === "signup"
                  ? "bg-plantry-light dark:bg-zinc-800 text-plantry-sageDark dark:text-white shadow-sm"
                  : "text-stone-500 dark:text-stone-400 hover:text-plantry-sageDark"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-4 mt-8">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Household Email"
              autoComplete="email"
              required
              className="w-full p-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-plantry-sage/50 transition-all dark:text-white"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              className="w-full p-4 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-plantry-sage/50 transition-all dark:text-white"
            />
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="pt-2">
            <PrimaryButton type="submit" disabled={isLoading || !email || !password}>
              {isLoading ? <Loader2 className="animate-spin" /> : mode === "signin" ? "Enter Household" : "Create Household"}
            </PrimaryButton>
          </div>

          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px bg-stone-200 dark:bg-zinc-800" />
            <span className="text-xs text-stone-400 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-zinc-800" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full py-4 px-6 bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 text-plantry-text dark:text-white rounded-2xl font-medium tracking-wide shadow-sm hover:shadow-md active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Continue with Google
          </button>

          <p className="text-center text-sm text-stone-400 mt-6">Plantry learns from your habits to simplify planning.</p>
        </form>
      </div>
    </motion.div>
  );
};
