/**
 * Architecture model — turns the generated graph.json into two shapes a person
 * can actually read.
 *
 *   buildPipeline()   The ecosystem as a left-to-right pipeline. Every tool is
 *                     placed in a named stage: Design, Sync, Source, Ship, Use.
 *   buildCascade()    The token tiers as a Sankey-style cascade: Component to
 *                     Semantic to Primitive, sized by how many aliases flow
 *                     between them. Motion is shown alongside as its own system.
 *   traceToken() /    The exact alias chain a token resolves through, down to
 *   traceComponent()  the primitive value it finally lands on.
 *
 * Everything here is pure and reads only the committed graph.json, so the view
 * stays as honest as the repo. No layout maths live here; the page turns these
 * structures into pixels.
 */

import graph from '../../data/graph.json';

export type RawNode = {
  id: string;
  label: string;
  kind: string;
  set?: string;
  value?: string | number;
  type?: string;
};
export type RawLink = { source: string; target: string; kind: string };

const DATA = graph as { nodes: RawNode[]; links: RawLink[] };
const NODES = DATA.nodes;
const LINKS = DATA.links;
const BY_ID = new Map(NODES.map((n) => [n.id, n]));

export function nodeById(id: string): RawNode | undefined {
  return BY_ID.get(id);
}

export const NODE_COUNT = NODES.length;
export const LINK_COUNT = LINKS.length;

// --- The ecosystem pipeline -------------------------------------------------

export type StageId = 'design' | 'sync' | 'source' | 'ship' | 'use';

export const STAGES: { id: StageId; title: string; blurb: string }[] = [
  { id: 'design', title: 'Design', blurb: 'One source of truth, in Figma.' },
  { id: 'sync', title: 'Sync', blurb: 'Move the decisions into the repo.' },
  { id: 'source', title: 'Source', blurb: 'Tokens and code, versioned together.' },
  { id: 'ship', title: 'Ship', blurb: 'Build, test and publish on every merge.' },
  { id: 'use', title: 'Use', blurb: 'Themed apps, docs and agents.' },
];

/** Per-tool metadata: which stage it sits in, its glyph, and its one line. */
const ECO: Record<string, { icon: string; blurb: string; stage: StageId }> = {
  'eco:figma-kit': {
    stage: 'design',
    icon: 'palette',
    blurb: 'The cast-ui-kit file. Every colour, size and component starts here.',
  },
  'eco:variables': {
    stage: 'design',
    icon: 'tune',
    blurb: 'Figma variables: the four token collections, edited by designers.',
  },
  'eco:cast-sync': {
    stage: 'sync',
    icon: 'sync',
    blurb: 'The plugin that reads the kit and writes the theme out.',
  },
  'eco:cast-theme': {
    stage: 'sync',
    icon: 'data_object',
    blurb: 'cast-theme.json. A whole brand, ready to drop into an app.',
  },
  'eco:mcp': {
    stage: 'sync',
    icon: 'hub',
    blurb: 'Figma MCP. Lets coding agents read the kit for themselves.',
  },
  'eco:design-tokens': {
    stage: 'source',
    icon: 'folder',
    blurb: 'design-tokens/. The exported tokens, committed to the repo.',
  },
  'eco:package': {
    stage: 'source',
    icon: 'widgets',
    blurb: '@castui/cast-ui. The component library itself.',
  },
  'eco:actions': {
    stage: 'ship',
    icon: 'rocket_launch',
    blurb: 'GitHub Actions. Runs the whole pipeline on every merge.',
  },
  'eco:storybook': {
    stage: 'ship',
    icon: 'auto_stories',
    blurb: 'Storybook. Every component, in every state.',
  },
  'eco:chromatic': {
    stage: 'ship',
    icon: 'photo_camera',
    blurb: 'Chromatic. Catches visual changes before they ship.',
  },
  'eco:npm': {
    stage: 'ship',
    icon: 'inventory_2',
    blurb: 'npm. Where the package is published.',
  },
  'eco:site': {
    stage: 'ship',
    icon: 'public',
    blurb: 'This docs site. Built from the same source, on the same branch.',
  },
  'eco:theme-provider': {
    stage: 'use',
    icon: 'format_paint',
    blurb: 'ThemeProvider. Applies a theme to a whole app at runtime.',
  },
  'eco:skills': {
    stage: 'use',
    icon: 'school',
    blurb: 'Agent skills. Teach an agent to use the library well.',
  },
  'eco:agents': {
    stage: 'use',
    icon: 'smart_toy',
    blurb: 'Coding agents. Assemble screens from the kit.',
  },
  'eco:snack': {
    stage: 'use',
    icon: 'bolt',
    blurb: 'Expo Snack. Try the library live in the browser.',
  },
  'eco:apps': {
    stage: 'use',
    icon: 'devices',
    blurb: 'Your apps. iOS, Android and web from one set.',
  },
};

export type PipeNode = {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  stage: StageId;
  col: number;
};
export type PipeLink = { source: string; target: string };
export type Pipeline = {
  stages: typeof STAGES;
  nodes: PipeNode[];
  links: PipeLink[];
};

export function buildPipeline(): Pipeline {
  const col = new Map(STAGES.map((s, i) => [s.id, i]));
  const nodes: PipeNode[] = NODES.filter((n) => n.kind === 'ecosystem' && ECO[n.id]).map((n) => {
    const meta = ECO[n.id];
    return {
      id: n.id,
      label: n.label,
      icon: meta.icon,
      blurb: meta.blurb,
      stage: meta.stage,
      col: col.get(meta.stage) ?? 0,
    };
  });
  const ids = new Set(nodes.map((n) => n.id));
  const links: PipeLink[] = LINKS.filter(
    (l) => l.kind === 'flow' && ids.has(l.source) && ids.has(l.target),
  ).map((l) => ({ source: l.source, target: l.target }));
  return { stages: STAGES, nodes, links };
}

/** The nodes reachable up- and down-stream of one pipeline node (its path). */
export function pipelinePath(links: PipeLink[], id: string): Set<string> {
  const out = new Map<string, string[]>();
  const inc = new Map<string, string[]>();
  for (const l of links) {
    (out.get(l.source) ?? out.set(l.source, []).get(l.source)!).push(l.target);
    (inc.get(l.target) ?? inc.set(l.target, []).get(l.target)!).push(l.source);
  }
  const keep = new Set<string>([id]);
  const walk = (start: string, adj: Map<string, string[]>) => {
    const stack = [start];
    while (stack.length) {
      const cur = stack.pop()!;
      for (const next of adj.get(cur) ?? []) {
        if (!keep.has(next)) {
          keep.add(next);
          stack.push(next);
        }
      }
    }
  };
  walk(id, out);
  walk(id, inc);
  return keep;
}

// --- The token cascade ------------------------------------------------------

export type TierId = 'component' | 'semantic' | 'primitive' | 'motion';

const KIND_TIER: Record<string, TierId> = {
  'component-token': 'component',
  semantic: 'semantic',
  primitive: 'primitive',
  motion: 'motion',
};

export const TIERS: Record<TierId, { title: string; blurb: string; col: number }> = {
  component: { title: 'Component', blurb: 'Bound to one component and one of its parts.', col: 0 },
  semantic: { title: 'Semantic', blurb: 'Named by role, like action or text.', col: 1 },
  primitive: { title: 'Primitive', blurb: 'The raw value it all lands on.', col: 2 },
  motion: { title: 'Motion', blurb: 'Timings, easings and springs.', col: 2 },
};

/** Cascade reads left to right: the three tiers the Sankey draws between. */
export const CASCADE_TIERS: TierId[] = ['component', 'semantic', 'primitive'];

function tierOf(n: RawNode): TierId | undefined {
  if (KIND_TIER[n.kind]) return KIND_TIER[n.kind];
  if (n.kind === 'component') return 'component'; // the comp: grouping nodes
  return undefined;
}

/** The top-level bucket a token sorts into, e.g. "action/brand/bg" -> "action". */
function groupOf(n: RawNode): string {
  return n.label.split('/')[0];
}

function prettyGroup(group: string): string {
  return group
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type GroupCard = {
  id: string; // `${tier}:${group}`
  tier: TierId;
  group: string;
  title: string;
  count: number;
};

export type Band = {
  id: string;
  source: string; // GroupCard id
  target: string; // GroupCard id
  count: number;
  span: number; // how many columns it crosses (2 = a bypass)
};

export type TierFlow = { source: TierId; target: TierId; count: number };

export type Cascade = {
  groups: GroupCard[];
  bands: Band[];
  tierFlows: TierFlow[];
  motion: { groups: GroupCard[]; internal: number };
};

export function buildCascade(): Cascade {
  const cards = new Map<string, GroupCard>();
  for (const n of NODES) {
    const tier = KIND_TIER[n.kind];
    if (!tier) continue; // only real token nodes carry counts
    const group = groupOf(n);
    const id = `${tier}:${group}`;
    const card = cards.get(id) ?? { id, tier, group, title: prettyGroup(group), count: 0 };
    card.count += 1;
    cards.set(id, card);
  }

  const bandMap = new Map<string, Band>();
  const tierMap = new Map<string, TierFlow>();
  let motionInternal = 0;

  for (const l of LINKS) {
    if (l.kind !== 'alias') continue;
    const s = BY_ID.get(l.source);
    const t = BY_ID.get(l.target);
    if (!s || !t) continue;
    const st = tierOf(s);
    const tt = tierOf(t);
    if (!st || !tt) continue;

    if (st === 'motion' || tt === 'motion') {
      if (st === 'motion' && tt === 'motion') motionInternal += 1;
      continue; // motion is a parallel system; no cross-tier ribbons in the data
    }

    const sid = `${st}:${groupOf(s)}`;
    const tid = `${tt}:${groupOf(t)}`;
    if (sid === tid) continue;

    const key = `${sid}->${tid}`;
    const span = Math.abs(TIERS[st].col - TIERS[tt].col);
    const band =
      bandMap.get(key) ?? { id: key, source: sid, target: tid, count: 0, span: span || 1 };
    band.count += 1;
    bandMap.set(key, band);

    const tkey = `${st}->${tt}`;
    const flow = tierMap.get(tkey) ?? { source: st, target: tt, count: 0 };
    flow.count += 1;
    tierMap.set(tkey, flow);
  }

  const groups = [...cards.values()];
  return {
    groups: groups.filter((g) => g.tier !== 'motion'),
    bands: [...bandMap.values()].sort((a, b) => b.count - a.count),
    tierFlows: [...tierMap.values()].sort((a, b) => b.count - a.count),
    motion: {
      groups: groups.filter((g) => g.tier === 'motion').sort((a, b) => b.count - a.count),
      internal: motionInternal,
    },
  };
}

// --- Tracing a single alias chain -------------------------------------------

const ALIAS_OUT = new Map<string, string[]>();
for (const l of LINKS) {
  if (l.kind !== 'alias') continue;
  const list = ALIAS_OUT.get(l.source) ?? [];
  list.push(l.target);
  ALIAS_OUT.set(l.source, list);
}

export type TraceStep = { id: string; label: string; tier: TierId | 'unknown'; value?: string };
export type Trace = { steps: TraceStep[]; value?: string };

function stepFor(n: RawNode): TraceStep {
  return {
    id: n.id,
    label: n.label,
    tier: tierOf(n) ?? 'unknown',
    value: typeof n.value === 'string' || typeof n.value === 'number' ? String(n.value) : undefined,
  };
}

/** Follow a token's alias edges to the primitive it resolves to. */
export function traceToken(id: string): Trace {
  const steps: TraceStep[] = [];
  const seen = new Set<string>();
  let cur = BY_ID.get(id);
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    steps.push(stepFor(cur));
    const next = (ALIAS_OUT.get(cur.id) ?? [])[0];
    cur = next ? BY_ID.get(next) : undefined;
  }
  const last = steps[steps.length - 1];
  return { steps, value: last?.value };
}

/** Every token that belongs to a component, each with its resolved chain. */
export function traceComponent(compName: string): Trace[] {
  return NODES.filter((n) => n.kind === 'component-token' && groupOf(n) === compName)
    .map((n) => traceToken(n.id))
    .filter((t) => t.steps.length > 0);
}

// --- Search -----------------------------------------------------------------

export type Match = { id: string; label: string; kind: string };

export function searchNodes(query: string, limit = 8): Match[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const scored = NODES.filter((n) => n.kind !== 'ecosystem' && n.label.toLowerCase().includes(q))
    .map((n) => ({
      node: n,
      score: n.label.toLowerCase().startsWith(q) ? 0 : 1,
    }))
    .sort((a, b) => a.score - b.score || a.node.label.length - b.node.label.length)
    .slice(0, limit);
  return scored.map(({ node }) => ({ id: node.id, label: node.label, kind: node.kind }));
}
