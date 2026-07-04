/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { auth } from "../lib/firebase";
import type { HouseholdInsights, RandomFact, RecentActivityEvent, ShoppingHistoryEvent, Suggestion, SuggestionAction } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function authHeader(): Promise<Record<string, string>> {
  const user = auth.currentUser;
  if (!user) throw new ApiError(401, "Not signed in.");
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeader()),
    ...(options.headers || {})
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  parseItems: (rawInput: string) =>
    request<{ items: string[] }>("/api/items/parse", {
      method: "POST",
      body: JSON.stringify({ rawInput })
    }),

  inferSuggestions: (currentList: string[]) =>
    request<{ suggestions: Suggestion[] }>("/api/suggestions/infer", {
      method: "POST",
      body: JSON.stringify({ currentList })
    }),

  sendSuggestionFeedback: (item: string, action: SuggestionAction) =>
    request<{ ok: boolean }>("/api/suggestions/feedback", {
      method: "POST",
      body: JSON.stringify({ item, action })
    }),

  completeShopping: (items: string[]) =>
    request<{ ok: boolean }>("/api/shopping/complete", {
      method: "POST",
      body: JSON.stringify({ items })
    }),

  addForgottenItems: (shoppingEventId: string, items: string[]) =>
    request<{ success: boolean }>("/api/forgotten/add", {
      method: "POST",
      body: JSON.stringify({ shoppingEventId, items })
    }),

  getRecentActivity: () => request<{ events: RecentActivityEvent[] }>("/api/activity/recent"),

  getHistory: () => request<{ events: ShoppingHistoryEvent[] }>("/api/activity/history"),

  getInsights: () => request<HouseholdInsights>("/api/insights/household"),

  getFact: () => request<{ fact: RandomFact | null }>("/api/insights/fact")
};

export { ApiError };