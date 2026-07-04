/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { Header } from "./components/layout/Header";
import { BottomNavigation } from "./components/layout/BottomNavigation";
import { AuthPage } from "./pages/AuthPage";
import { DashboardPage } from "./pages/DashboardPage";
import { CreateListPage } from "./pages/CreateListPage";
import { SmartSuggestionsPage } from "./pages/SmartSuggestionsPage";
import { ActiveListPage } from "./pages/ActiveListPage";
import { FeedbackPage } from "./pages/FeedbackPage";
import { HistoryPage } from "./pages/HistoryPage";
import { InsightsPage } from "./pages/InsightsPage";
import { SettingsPage } from "./pages/SettingsPage";
import type { PageView, PageParams, ShoppingListItem } from "./types";


const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>("dashboard");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [pageParams, setPageParams] = useState<PageParams | null>(null);

  const onNavigate = (page: PageView, params?: PageParams) => {
    setCurrentPage(page);
    setPageParams(params ?? null);
  };

  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Reset to a sensible landing page whenever a user signs in, so nobody
  // lands on e.g. "feedback" from a previous session.
  useEffect(() => {
    if (user) setCurrentPage("dashboard");
  }, [user]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plantry-light dark:bg-zinc-950">
        <Loader2 className="animate-spin text-plantry-sage" size={32} />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage onNavigate={onNavigate} />;
      case "create-list":
        return <CreateListPage onNavigate={onNavigate} setShoppingList={setShoppingList} />;
      case "suggestions":
        return <SmartSuggestionsPage onNavigate={onNavigate} currentList={shoppingList} setShoppingList={setShoppingList} />;
      case "active-list":
        return <ActiveListPage onNavigate={onNavigate} list={shoppingList} />;
      case "feedback":
        return <FeedbackPage onNavigate={onNavigate} />;
      case "history":
        return <HistoryPage onNavigate={onNavigate} />;
      case "insights":
        return <InsightsPage />;
      case "settings":
        return <SettingsPage isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
      case "add-forgotten":
        return (
          <CreateListPage
            onNavigate={onNavigate}
            setShoppingList={() => {}}
            mode="forgotten"
            shoppingEventId={pageParams?.shoppingEventId}
          />
        );
      default:
        return <DashboardPage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} onNavigate={onNavigate} />

      <main className="flex-1 container mx-auto px-4 md:px-6 pb-24 pt-24 transition-all duration-300">{renderPage()}</main>

      <BottomNavigation activePage={currentPage} onNavigate={onNavigate} />
    </div>
  );
};

export default App;