import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { SearchModal } from './components/search/SearchModal.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { LeaguePage } from './pages/LeaguePage.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { useMatchData } from './context/MatchDataContext.jsx';

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSearchOpen, openSearch, closeSearch } = useMatchData();

  // Global hotkey: Cmd+K / Ctrl+K opens SearchModal anywhere
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  // Extract active league slug if on /league/:slug route
  const isLeagueRoute = location.pathname.startsWith('/league/');
  const currentLeagueSlug = isLeagueRoute ? location.pathname.split('/')[2] : null;

  return (
    <div className="min-h-screen bg-pitch-bg text-sport-text flex flex-col font-sans transition-colors duration-200">
      {/* Sticky Global Navigation */}
      <Navbar
        onOpenSearch={openSearch}
        onNavigateHome={() => navigate('/')}
        onSelectLeague={(slug) => navigate(`/league/${slug}`)}
        activeLeagueSlug={currentLeagueSlug}
      />

      {/* Main Routed Page Container with Framer Motion Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/league/:leagueSlug" element={<LeaguePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Accessible Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={closeSearch}
        onSelectLeague={(slug) => navigate(`/league/${slug}`)}
        onSelectMatch={(match) => {
          if (match.league?.id) {
            navigate(`/league/${match.league.id}`);
          }
        }}
        onSelectSearchPage={(query) => {
          navigate(`/search?q=${encodeURIComponent(query)}`);
        }}
      />

      {/* Global Sports Footer */}
      <Footer />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
