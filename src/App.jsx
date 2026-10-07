import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import PageTransition from './components/layout/PageTransition.jsx';
import ScrollProgress from './components/ui/ScrollProgress.jsx';
import BackToTop from './components/ui/BackToTop.jsx';

import Home from './pages/Home.jsx';
import Icons from './pages/Icons.jsx';
import Grids from './pages/Grids.jsx';
import Colors from './pages/Colors.jsx';
import Shadows from './pages/Shadows.jsx';
import Motion from './pages/Motion.jsx';
import NotFound from './pages/NotFound.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <ScrollProgress />
      <Navbar />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/icons" element={<PageTransition><Icons /></PageTransition>} />
          <Route path="/grids" element={<PageTransition><Grids /></PageTransition>} />
          <Route path="/colors" element={<PageTransition><Colors /></PageTransition>} />
          <Route path="/shadows" element={<PageTransition><Shadows /></PageTransition>} />
          <Route path="/motion" element={<PageTransition><Motion /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <BackToTop />
    </>
  );
}
