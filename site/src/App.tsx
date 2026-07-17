/**
 * Cast UI documentation site.
 *
 * Route map (mirrors the top navigation):
 *   /              Landing — live, themeable hero built from the library
 *   /docs/*        Guides — getting started, theming, tokens, and so on
 *   /components/*  Every component, generated from the registry
 *   /patterns      Composition recipes
 *   /themes        Brand theming and cast-theme.json round-trip
 *   /motion        The motion system, animated
 *   /playground    Editable live code
 *   /architecture  The system graph
 *
 * Pages lazy-load so the landing bundle stays lean.
 */

import React, { Suspense, useEffect } from 'react';
import { View } from 'react-native';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Spinner, useTheme } from '@castui/cast-ui';
import { SiteThemeRoot } from './theme/SiteTheme';
import { TopNav } from './shell/TopNav';
import { Footer } from './shell/Footer';
import { CookieConsent } from './consent/CookieConsent';

const Landing = React.lazy(() => import('./pages/Landing'));
const Docs = React.lazy(() => import('./pages/docs/Docs'));
const ComponentsIndex = React.lazy(() => import('./pages/components/ComponentsIndex'));
const ComponentPage = React.lazy(() => import('./pages/components/ComponentPage'));
const Patterns = React.lazy(() => import('./pages/patterns/Patterns'));
const Themes = React.lazy(() => import('./pages/themes/Themes'));
const Motion = React.lazy(() => import('./pages/motion/Motion'));
const Playground = React.lazy(() => import('./pages/playground/Playground'));
const Architecture = React.lazy(() => import('./pages/architecture/Architecture'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageFallback() {
  return (
    <View style={{ minHeight: 320, alignItems: 'center', justifyContent: 'center' }}>
      <Spinner intent="brand" />
    </View>
  );
}

function Shell() {
  const { scheme, colorMode } = useTheme();

  // Cast UI themes the React tree, not the document. The <html>/<body> element
  // sits outside it, so mirror the page-background token onto the document root
  // and set color-scheme — this keeps the browser's overscroll area, scrollbars
  // and native controls matching the active mode instead of showing white.
  useEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = scheme.surface.base;
    root.style.colorScheme = colorMode;
  }, [scheme.surface.base, colorMode]);

  return (
    <View style={{ minHeight: '100vh' as never, backgroundColor: scheme.surface.base }}>
      <TopNav />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs/*" element={<Docs />} />
          <Route path="/components" element={<ComponentsIndex />} />
          <Route path="/components/:slug" element={<ComponentPage />} />
          <Route path="/patterns" element={<Patterns />} />
          <Route path="/themes" element={<Themes />} />
          <Route path="/motion" element={<Motion />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/architecture" element={<Architecture />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </Suspense>
      <Footer />
      <CookieConsent />
    </View>
  );
}

export function App() {
  return (
    <SiteThemeRoot>
      <ScrollToTop />
      <Shell />
    </SiteThemeRoot>
  );
}
