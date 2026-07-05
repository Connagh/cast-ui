/**
 * Real coverage smoke test, two passes:
 *   1. Render every page statically (no lazy loading) to a string.
 *   2. Evaluate every registry + pattern + playground example through the
 *      same transpile path react-live uses, then render the result.
 *
 * Build + run:
 *   npx vite build --ssr scripts/ssrSmoke.tsx --outDir dist-ssr
 *   node dist-ssr/ssrSmoke.js
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { transform } from 'sucrase';

import { SiteThemeRoot } from '../src/theme/SiteTheme';
import { registry } from '../src/data/registry';
import { liveScope } from '../src/ui/scope';

import Landing from '../src/pages/Landing';
import Docs from '../src/pages/docs/Docs';
import ComponentsIndex from '../src/pages/components/ComponentsIndex';
import ComponentPage from '../src/pages/components/ComponentPage';
import Patterns, { PATTERN_EXAMPLES } from '../src/pages/patterns/Patterns';
import Templates from '../src/pages/templates/Templates';
import TemplateScreen from '../src/pages/templates/TemplateScreen';
import Themes from '../src/pages/themes/Themes';
import Motion from '../src/pages/motion/Motion';
import Playground, { STARTERS } from '../src/pages/playground/Playground';
import Architecture from '../src/pages/architecture/Architecture';

const pageRoutes: Array<[string, React.ReactElement]> = [
  ['/', <Landing />],
  ['/components', <ComponentsIndex />],
  ...registry.map((c): [string, React.ReactElement] => [`/components/${c.slug}`, <ComponentPage />]),
  ['/patterns', <Patterns />],
  ['/templates', <Templates />],
  ['/templates/assistant/full', <TemplateScreen />],
  ['/templates/dashboard/full', <TemplateScreen />],
  ['/templates/auth/full', <TemplateScreen />],
  ['/templates/storefront/full', <TemplateScreen />],
  ['/themes', <Themes />],
  ['/motion', <Motion />],
  ['/playground', <Playground />],
  ['/architecture', <Architecture />],
  ['/docs/getting-started', <Docs />],
  ['/docs/theming', <Docs />],
  ['/docs/design-tokens', <Docs />],
  ['/docs/icons-and-fonts', <Docs />],
  ['/docs/breakpoints', <Docs />],
  ['/docs/cast-sync', <Docs />],
  ['/docs/agents', <Docs />],
];

const ERROR_PATTERNS = [/is not defined/i, /SyntaxError/, /Unexpected token/i, /\[object Object\]/];

function renderRoute(route: string, element: React.ReactElement): string {
  return renderToString(
    <SiteThemeRoot>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={element} />
          <Route path="/components" element={element} />
          <Route path="/components/:slug" element={element} />
          <Route path="/patterns" element={element} />
          <Route path="/templates" element={element} />
          <Route path="/templates/:slug/full" element={element} />
          <Route path="/themes" element={element} />
          <Route path="/motion" element={element} />
          <Route path="/playground" element={element} />
          <Route path="/architecture" element={element} />
          <Route path="/docs/*" element={element} />
        </Routes>
      </MemoryRouter>
    </SiteThemeRoot>,
  );
}

/** Evaluate one example exactly the way LiveDemo does. */
function evalExample(code: string): React.ReactElement {
  const definesDemo = /(function|const)\s+Demo\b/.test(code);
  const body = definesDemo ? `${code}\nreturn React.createElement(Demo);` : `return (${code.trim()});`;
  const compiled = transform(body, { transforms: ['jsx', 'typescript'], production: true }).code;
  const keys = Object.keys(liveScope);
  const fn = new Function(...keys, compiled);
  return fn(...keys.map((k) => (liveScope as Record<string, unknown>)[k])) as React.ReactElement;
}

async function main() {
  let failures = 0;

  console.log('— pages —');
  for (const [route, element] of pageRoutes) {
    try {
      const html = renderRoute(route, element);
      const hit = ERROR_PATTERNS.find((p) => p.test(html));
      if (hit) {
        failures++;
        const at = html.search(hit);
        console.error(`ERROR-TEXT ${route} :: …${html.slice(Math.max(0, at - 100), at + 140).replace(/<[^>]+>/g, ' ')}…`);
      } else {
        console.log(`ok ${route} (${(html.length / 1024).toFixed(1)} kB)`);
      }
    } catch (error) {
      failures++;
      console.error(`THROW ${route} :: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log('— examples —');
  let checked = 0;
  for (const doc of registry) {
    for (const example of doc.examples) {
      checked++;
      try {
        const element = evalExample(example.code);
        renderToString(
          <SiteThemeRoot>
            <MemoryRouter>{element}</MemoryRouter>
          </SiteThemeRoot>,
        );
      } catch (error) {
        failures++;
        console.error(`EXAMPLE ${doc.slug} / ${example.title} :: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
  for (const [name, code] of Object.entries(PATTERN_EXAMPLES)) {
    checked++;
    try {
      renderToString(
        <SiteThemeRoot>
          <MemoryRouter>{evalExample(code)}</MemoryRouter>
        </SiteThemeRoot>,
      );
    } catch (error) {
      failures++;
      console.error(`PATTERN ${name} :: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  for (const [name, starter] of Object.entries(STARTERS)) {
    checked++;
    try {
      renderToString(
        <SiteThemeRoot>
          <MemoryRouter>{evalExample(starter.code)}</MemoryRouter>
        </SiteThemeRoot>,
      );
    } catch (error) {
      failures++;
      console.error(`STARTER ${name} :: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  console.log(`${checked} examples evaluated (registry + patterns + starters)`);

  if (failures > 0) {
    console.error(`\n${failures} failure(s)`);
    process.exit(1);
  }
  console.log('\nAll pages and examples rendered clean.');
}

main();
