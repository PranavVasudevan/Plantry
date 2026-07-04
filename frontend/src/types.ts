/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Suggestion {
  id: string;
  name: string;
  reason: string;
  confidence: "high" | "medium" | "low";
  type: "frequent" | "forgotten" | "seasonal";
  added?: boolean;
  rejected?: boolean;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  type: "manual" | "frequent" | "forgotten" | "seasonal";
  checked: boolean;
}

export interface ShoppingHistoryEvent {
  id: string;
  date: string;
  items: string[];
  forgotten: string[];
}

export interface RecentActivityEvent {
  id: string;
  date: string;
  itemCount: number;
}

export interface HouseholdRhythm {
  avgDaysBetweenTrips: number;
  preferredDay: string | null;
  preferredTime: string;
}

export interface ForgottenInsight {
  name: string;
  percent: number;
  evidence: number;
}

export interface HouseholdInsights {
  rhythm: HouseholdRhythm | null;
  forgotten: ForgottenInsight[];
  pairs: string[][];
}

export interface RandomFact {
  type: "temporal" | "forgotten";
  text: string;
}

export type SuggestionAction = "accept" | "reject" | "penalize" | "block";

export type PageView =
  | "dashboard"
  | "create-list"
  | "suggestions"
  | "active-list"
  | "feedback"
  | "history"
  | "insights"
  | "settings"
  | "add-forgotten";

export interface PageParams {
  shoppingEventId?: string;
}