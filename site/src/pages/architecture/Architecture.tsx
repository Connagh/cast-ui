/**
 * The architecture, drawn the way it actually works: as a pipeline.
 *
 * Cast UI is not a cloud of equal nodes. It is a directed system with a clear
 * reading order, so this page draws two deterministic, layered diagrams instead
 * of a force-directed hairball:
 *
 *   Pipeline   the ecosystem left to right, each tool in a named stage
 *              (Design, Sync, Source, Ship, Use). Hover a tool to light up its
 *              whole path; click to pin it.
 *   Cascade    the token tiers as a Sankey: Component resolves to Semantic
 *              resolves to Primitive, with the alias volume between each tier.
 *              Click a component to trace its tokens to the raw value.
 *
 * Both read from the generated graph.json through model.ts, so the picture
 * stays exactly as honest as the repo. Rendering is plain SVG (the site is
 * web only), themed entirely through Cast UI tokens.
 */

import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Badge, Chip, Input, Text, useMotion, useTheme } from '@castui/cast-ui';
import { Page, PageHeader } from '../../ui/Page';
import {
  buildCascade,
  buildPipeline,
  pipelinePath,
  searchNodes,
  traceComponent,
  traceToken,
  TIERS,
  NODE_COUNT,
  LINK_COUNT,
  type Band,
  type GroupCard,
  type PipeNode,
  type StageId,
  type TierId,
  type Trace,
} from './model';

// --- Palette ----------------------------------------------------------------
// One accent per stage / tier, matching the brand preset swatches so the whole
// site stays of a piece. Everything else is drawn from the live theme.

const STAGE_COLOR: Record<StageId, string> = {
  design: '#2563EB',
  sync: '#7C3AED',
  source: '#0891B2',
  ship: '#059669',
  use: '#D97706',
};

const TIER_COLOR: Record<TierId, string> = {
  component: '#7C3AED',
  semantic: '#2563EB',
  primitive: '#D97706',
  motion: '#E11D48',
};

function hexA(hex: string, a: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function wrapLines(text: string, max: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (t.length <= max || !cur) {
      cur = t;
    } else {
      lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) break;
    }
  }
  if (lines.length < maxLines && cur) lines.push(cur);
  const full = text.replace(/\s+/g, ' ');
  if (lines.join(' ').length < full.length && lines.length) {
    const last = lines[lines.length - 1].replace(/\s*\S*$/, '');
    lines[lines.length - 1] = `${last}…`;
  }
  return lines;
}

/** Smooth S-curve from a right edge to a left edge (or a bow if it turns back). */
function connector(sx: number, sy: number, tx: number, ty: number): string {
  const dx = tx - sx;
  if (dx > 12) {
    const c = Math.max(dx * 0.5, 44);
    return `M ${sx} ${sy} C ${sx + c} ${sy}, ${tx - c} ${ty}, ${tx} ${ty}`;
  }
  const bow = 54 + Math.abs(ty - sy) * 0.14;
  return `M ${sx} ${sy} C ${sx + bow} ${sy}, ${tx + bow} ${ty}, ${tx} ${ty}`;
}

/** A filled Sankey ribbon between two vertical centres; `dip` bows it downward. */
function ribbonPath(
  x1: number,
  yc1: number,
  x2: number,
  yc2: number,
  th1: number,
  th2: number,
  dip = 0,
): string {
  const t1 = th1 / 2;
  const t2 = th2 / 2;
  const c = (x2 - x1) * 0.5;
  return [
    `M ${x1} ${yc1 - t1}`,
    `C ${x1 + c} ${yc1 - t1 + dip}, ${x2 - c} ${yc2 - t2 + dip}, ${x2} ${yc2 - t2}`,
    `L ${x2} ${yc2 + t2}`,
    `C ${x2 - c} ${yc2 + t2 + dip}, ${x1 + c} ${yc1 + t1 + dip}, ${x1} ${yc1 + t1}`,
    'Z',
  ].join(' ');
}

const isHex = (v?: string) => !!v && /^#([0-9a-f]{3,8})$/i.test(v);

// ============================================================================
// Pipeline lens
// ============================================================================

const P = {
  W: 1280,
  padX: 26,
  cardW: 204,
  cardH: 96,
  colGap: 52,
  rowGap: 20,
  headY: 78,
};

function PipelineView({
  active,
  selected,
  onHover,
  onSelect,
  reduceMotion,
}: {
  active: string | null;
  selected: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  reduceMotion: boolean;
}) {
  const { scheme } = useTheme();
  const pipeline = useMemo(buildPipeline, []);

  const layout = useMemo(() => {
    const byCol: PipeNode[][] = pipeline.stages.map(() => []);
    for (const n of pipeline.nodes) byCol[n.col].push(n);
    const maxRows = Math.max(...byCol.map((c) => c.length));
    const step = P.cardH + P.rowGap;
    const pos = new Map<string, { x: number; y: number }>();
    byCol.forEach((col, ci) => {
      const x = P.padX + ci * (P.cardW + P.colGap);
      const startY = P.headY + ((maxRows - col.length) / 2) * step;
      col.forEach((n, ri) => pos.set(n.id, { x, y: startY + ri * step }));
    });
    const H = P.headY + maxRows * step - P.rowGap + 30;
    return { pos, H, maxRows };
  }, [pipeline]);

  const keep = useMemo(
    () => (active ? pipelinePath(pipeline.links, active) : null),
    [active, pipeline.links],
  );

  const dim = (on: boolean) => (keep && !on ? 0.22 : 1);

  return (
    <svg
      viewBox={`0 0 ${P.W} ${layout.H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', height: 'auto' }}
    >
      <defs>
        <style>{`.cast-flow{stroke-dasharray:5 9;${
          reduceMotion ? '' : 'animation:castflow 1.1s linear infinite;'
        }} @keyframes castflow{to{stroke-dashoffset:-28}}`}</style>
      </defs>

      {/* Stage lanes + headers */}
      {pipeline.stages.map((s, i) => {
        const x = P.padX + i * (P.cardW + P.colGap);
        return (
          <g key={s.id}>
            <rect
              x={x - 10}
              y={P.headY - 14}
              width={P.cardW + 20}
              height={layout.H - P.headY - 4}
              rx={16}
              fill={hexA(STAGE_COLOR[s.id], 0.04)}
            />
            <text x={x} y={30} fontFamily="Inter" fontSize={12} fontWeight={700} fill={STAGE_COLOR[s.id]}>
              {`${i + 1}. ${s.title.toUpperCase()}`}
            </text>
            <text x={x} y={50} fontFamily="Inter" fontSize={11.5} fill={scheme.text.description}>
              {s.blurb}
            </text>
          </g>
        );
      })}

      {/* Connectors */}
      {pipeline.links.map((l, i) => {
        const a = layout.pos.get(l.source)!;
        const b = layout.pos.get(l.target)!;
        const sx = a.x + P.cardW;
        const sy = a.y + P.cardH / 2;
        const tx = b.x;
        const ty = b.y + P.cardH / 2;
        const on = !!keep && keep.has(l.source) && keep.has(l.target);
        return (
          <g key={i} opacity={dim(on)}>
            <path
              d={connector(sx, sy, tx, ty)}
              fill="none"
              stroke={on ? hexA(STAGE_COLOR[nodeStage(pipeline.nodes, l.source)], 0.9) : scheme.surface.overlay.border}
              strokeWidth={on ? 2.4 : 1.4}
              className={on ? 'cast-flow' : undefined}
            />
            <circle cx={tx} cy={ty} r={on ? 3 : 2.2} fill={on ? hexA(STAGE_COLOR[nodeStage(pipeline.nodes, l.target)], 0.95) : scheme.surface.overlay.border} />
          </g>
        );
      })}

      {/* Nodes */}
      {pipeline.nodes.map((n) => {
        const p = layout.pos.get(n.id)!;
        const on = !keep || keep.has(n.id);
        const isActive = selected === n.id;
        const accent = STAGE_COLOR[n.stage];
        const lines = wrapLines(n.blurb, 30, 2);
        return (
          <g
            key={n.id}
            opacity={on ? 1 : 0.22}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(n.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(n.id)}
          >
            {isActive ? (
              <rect x={p.x - 3} y={p.y - 3} width={P.cardW + 6} height={P.cardH + 6} rx={15} fill={hexA(accent, 0.14)} />
            ) : null}
            <rect
              x={p.x}
              y={p.y}
              width={P.cardW}
              height={P.cardH}
              rx={13}
              fill={scheme.surface.overlay.bg}
              stroke={isActive ? accent : scheme.surface.overlay.border}
              strokeWidth={isActive ? 2 : 1}
            />
            <rect x={p.x} y={p.y + 12} width={4} height={P.cardH - 24} rx={2} fill={accent} />
            <rect x={p.x + 16} y={p.y + 15} width={34} height={34} rx={10} fill={hexA(accent, 0.16)} />
            <text
              x={p.x + 33}
              y={p.y + 38}
              fontFamily="Material Symbols Outlined"
              fontSize={20}
              fill={accent}
              textAnchor="middle"
            >
              {n.icon}
            </text>
            <text x={p.x + 60} y={p.y + 30} fontFamily="Inter" fontSize={13.5} fontWeight={600} fill={scheme.text.primary}>
              {n.label}
            </text>
            {lines.map((ln, li) => (
              <text key={li} x={p.x + 18} y={p.y + 60 + li * 15} fontFamily="Inter" fontSize={11} fill={scheme.text.description}>
                {ln}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function nodeStage(nodes: PipeNode[], id: string): StageId {
  return nodes.find((n) => n.id === id)?.stage ?? 'design';
}

// ============================================================================
// Cascade lens
// ============================================================================

const C = {
  W: 1184,
  padX: 24,
  panelW: 300,
  colGap: 118,
  top: 92,
  headerH: 66,
  innerPad: 14,
  chipH: 26,
  chipVGap: 8,
  subGap: 10,
};

type ChipBox = GroupCard & { x: number; y: number; w: number; cx: number; cy: number };
type PanelBox = { tier: TierId; x: number; top: number; height: number; count: number };

function CascadeView({
  active,
  onHover,
  onPick,
  reduceMotion,
}: {
  active: string | null;
  onHover: (id: string | null) => void;
  onPick: (chip: ChipBox) => void;
  reduceMotion: boolean;
}) {
  const { scheme } = useTheme();
  const cascade = useMemo(buildCascade, []);

  const layout = useMemo(() => {
    const chipW = (C.panelW - 2 * C.innerPad - C.subGap) / 2;
    const cols: TierId[] = ['component', 'semantic', 'primitive'];
    const chips: ChipBox[] = [];
    const panels: PanelBox[] = [];

    cols.forEach((tier) => {
      const col = TIERS[tier].col;
      const x = C.padX + col * (C.panelW + C.colGap);
      const groups = cascade.groups
        .filter((g) => g.tier === tier)
        .sort((a, b) => b.count - a.count);
      const rows = Math.ceil(groups.length / 2);
      const gridTop = C.top + C.headerH;
      groups.forEach((g, i) => {
        const sub = i % 2;
        const row = Math.floor(i / 2);
        const cx0 = x + C.innerPad + sub * (chipW + C.subGap);
        const cy0 = gridTop + row * (C.chipH + C.chipVGap);
        chips.push({ ...g, x: cx0, y: cy0, w: chipW, cx: cx0 + chipW / 2, cy: cy0 + C.chipH / 2 });
      });
      const height = C.headerH + rows * (C.chipH + C.chipVGap) - C.chipVGap + C.innerPad;
      panels.push({ tier, x, top: C.top, height, count: groups.reduce((s, g) => s + g.count, 0) });
    });

    const maxPanelH = Math.max(...panels.map((p) => p.height));
    const motionTop = C.top + maxPanelH + 42;
    const H = motionTop + 104 + 24;
    return { chips, panels, chipW, maxPanelH, motionTop, H };
  }, [cascade]);

  const chipById = useMemo(() => new Map(layout.chips.map((c) => [c.id, c])), [layout.chips]);

  // Which chips + bands to spotlight for the active group.
  const focus = useMemo(() => {
    if (!active) return null;
    const links = cascade.bands.filter((b) => b.source === active || b.target === active);
    const ids = new Set<string>([active]);
    links.forEach((b) => {
      ids.add(b.source);
      ids.add(b.target);
    });
    return { links, ids };
  }, [active, cascade.bands]);

  const panelByTier = useMemo(() => new Map(layout.panels.map((p) => [p.tier, p])), [layout.panels]);
  const maxTierFlow = Math.max(...cascade.tierFlows.map((f) => f.count), 1);
  const maxBand = Math.max(...cascade.bands.map((b) => b.count), 1);

  const center = (t: TierId) => {
    const p = panelByTier.get(t)!;
    return { xL: p.x, xR: p.x + C.panelW, yc: p.top + p.height / 2 };
  };

  return (
    <svg
      viewBox={`0 0 ${C.W} ${layout.H}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', height: 'auto' }}
    >
      <defs>
        <style>{`.cast-flow2{stroke-dasharray:5 9;${
          reduceMotion ? '' : 'animation:castflow2 1.2s linear infinite;'
        }} @keyframes castflow2{to{stroke-dashoffset:-28}}`}</style>
      </defs>

      {/* Aggregate tier ribbons (dim when a group is focused) */}
      <g opacity={focus ? 0.12 : 1}>
        {cascade.tierFlows.map((f, i) => {
          const s = center(f.source);
          const t = center(f.target);
          const th1 = 8 + (f.count / maxTierFlow) * 52;
          const bypass = TIERS[f.target].col - TIERS[f.source].col > 1;
          const dip = bypass ? layout.maxPanelH * 0.62 : 0;
          return (
            <path
              key={i}
              d={ribbonPath(s.xR, s.yc, t.xL, t.yc, th1, th1, dip)}
              fill={hexA(TIER_COLOR[f.source], 0.16)}
              stroke={hexA(TIER_COLOR[f.source], 0.28)}
              strokeWidth={1}
            />
          );
        })}
      </g>

      {/* Focused group bands (thin, animated) */}
      {focus
        ? focus.links.map((b: Band, i) => {
            const s = chipById.get(b.source);
            const t = chipById.get(b.target);
            if (!s || !t) return null;
            const forward = TIERS[s.tier].col <= TIERS[t.tier].col;
            const sx = forward ? s.x + s.w : s.x;
            const tx = forward ? t.x : t.x + t.w;
            const w = 1.5 + (b.count / maxBand) * 6;
            return (
              <path
                key={i}
                d={connector(sx, s.cy, tx, t.cy)}
                fill="none"
                stroke={hexA(TIER_COLOR[s.tier], 0.9)}
                strokeWidth={w}
                strokeLinecap="round"
                className="cast-flow2"
              />
            );
          })
        : null}

      {/* Tier panels */}
      {layout.panels.map((p) => {
        const accent = TIER_COLOR[p.tier];
        return (
          <g key={p.tier}>
            <rect
              x={p.x}
              y={p.top}
              width={C.panelW}
              height={p.height}
              rx={16}
              fill={scheme.surface.overlay.bg}
              stroke={scheme.surface.overlay.border}
              strokeWidth={1}
            />
            <rect x={p.x} y={p.top} width={C.panelW} height={4} rx={2} fill={accent} />
            <text x={p.x + C.innerPad} y={p.top + 28} fontFamily="Inter" fontSize={15} fontWeight={700} fill={scheme.text.primary}>
              {TIERS[p.tier].title}
            </text>
            <text x={p.x + C.panelW - C.innerPad} y={p.top + 28} fontFamily="Inter" fontSize={12} fontWeight={600} fill={accent} textAnchor="end">
              {`${p.count} tokens`}
            </text>
            <text x={p.x + C.innerPad} y={p.top + 48} fontFamily="Inter" fontSize={11.5} fill={scheme.text.description}>
              {TIERS[p.tier].blurb}
            </text>
          </g>
        );
      })}

      {/* Group chips */}
      {layout.chips.map((ch) => {
        const on = !focus || focus.ids.has(ch.id);
        const isActive = active === ch.id;
        const accent = TIER_COLOR[ch.tier];
        return (
          <g
            key={ch.id}
            opacity={on ? 1 : 0.25}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(ch.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onPick(ch)}
          >
            <rect
              x={ch.x}
              y={ch.y}
              width={ch.w}
              height={C.chipH}
              rx={8}
              fill={isActive ? hexA(accent, 0.16) : scheme.surface.subtle}
              stroke={isActive ? accent : scheme.surface.overlay.border}
              strokeWidth={isActive ? 1.5 : 1}
            />
            <circle cx={ch.x + 13} cy={ch.cy} r={3.5} fill={accent} />
            <text x={ch.x + 24} y={ch.cy + 4} fontFamily="Inter" fontSize={11.5} fontWeight={500} fill={scheme.text.primary}>
              {ch.title.length > 13 ? `${ch.title.slice(0, 12)}…` : ch.title}
            </text>
            <text x={ch.x + ch.w - 10} y={ch.cy + 4} fontFamily="Inter" fontSize={10.5} fill={scheme.text.description} textAnchor="end">
              {ch.count}
            </text>
          </g>
        );
      })}

      {/* Motion — the parallel system */}
      <g>
        <rect
          x={C.padX}
          y={layout.motionTop}
          width={C.W - 2 * C.padX}
          height={96}
          rx={16}
          fill={scheme.surface.overlay.bg}
          stroke={scheme.surface.overlay.border}
          strokeWidth={1}
        />
        <rect x={C.padX} y={layout.motionTop} width={4} height={96} rx={2} fill={TIER_COLOR.motion} />
        <text x={C.padX + 18} y={layout.motionTop + 28} fontFamily="Inter" fontSize={15} fontWeight={700} fill={scheme.text.primary}>
          Motion
        </text>
        <text x={C.padX + 92} y={layout.motionTop + 28} fontFamily="Inter" fontSize={11.5} fill={scheme.text.description}>
          A parallel system. Components read these at runtime; the values stay separate from colour and space.
        </text>
        {cascade.motion.groups.map((g, i) => {
          const gx = C.padX + 18 + i * 158;
          const gy = layout.motionTop + 48;
          return (
            <g key={g.id}>
              <rect x={gx} y={gy} width={146} height={30} rx={8} fill={scheme.surface.subtle} stroke={scheme.surface.overlay.border} strokeWidth={1} />
              <circle cx={gx + 13} cy={gy + 15} r={3.5} fill={TIER_COLOR.motion} />
              <text x={gx + 24} y={gy + 19} fontFamily="Inter" fontSize={11.5} fontWeight={500} fill={scheme.text.primary}>
                {g.title}
              </text>
              <text x={gx + 136} y={gy + 19} fontFamily="Inter" fontSize={10.5} fill={scheme.text.description} textAnchor="end">
                {g.count}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ============================================================================
// Trace panel — a token's exact alias chain to the raw value
// ============================================================================

function TraceRow({ trace }: { trace: Trace }) {
  const { scheme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingVertical: 4 }}>
      {trace.steps.map((step, i) => (
        <React.Fragment key={step.id}>
          {i > 0 ? <Text type="caption" color={scheme.text.description}>{'→'}</Text> : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 7,
              backgroundColor: scheme.surface.subtle,
              borderWidth: 1,
              borderColor: scheme.surface.overlay.border,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: step.tier === 'unknown' ? scheme.text.description : TIER_COLOR[step.tier as TierId],
              }}
            />
            <Text type="caption" color={scheme.text.primary}>{step.label}</Text>
            {i === trace.steps.length - 1 && step.value ? (
              <>
                {isHex(step.value) ? (
                  <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: step.value, borderWidth: 1, borderColor: scheme.surface.overlay.border }} />
                ) : null}
                <Text type="caption" color={scheme.text.description}>{step.value}</Text>
              </>
            ) : null}
          </View>
        </React.Fragment>
      ))}
    </View>
  );
}

function TracePanel({ title, traces, onClose }: { title: string; traces: Trace[]; onClose: () => void }) {
  const { scheme, colors } = useTheme();
  const shown = traces.slice(0, 24);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: scheme.surface.overlay.border,
        borderRadius: 16,
        backgroundColor: scheme.surface.subtle,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Text type="label-lg" color={colors.brand.subtle.default.fg}>{title}</Text>
        <Badge size="small">{`${traces.length} token${traces.length === 1 ? '' : 's'}`}</Badge>
        <View style={{ flex: 1 }} />
        <Chip size="small" onRemove={onClose}>Close</Chip>
      </View>
      <Text type="body-sm" color={scheme.text.description}>
        Each row follows one token through its aliases to the primitive value it lands on. It comes straight from the token files.
      </Text>
      <View style={{ gap: 2 }}>
        {shown.map((t, i) => (
          <TraceRow key={i} trace={t} />
        ))}
      </View>
      {traces.length > shown.length ? (
        <Text type="caption" color={scheme.text.description}>{`+ ${traces.length - shown.length} more`}</Text>
      ) : null}
    </View>
  );
}

// ============================================================================
// Page
// ============================================================================

type Lens = 'pipeline' | 'cascade';

function Segmented({ value, onChange }: { value: Lens; onChange: (v: Lens) => void }) {
  const { scheme, colors } = useTheme();
  const opts: { id: Lens; label: string }[] = [
    { id: 'pipeline', label: 'Pipeline' },
    { id: 'cascade', label: 'Token cascade' },
  ];
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 2,
        padding: 3,
        borderRadius: 11,
        backgroundColor: scheme.surface.subtle,
        borderWidth: 1,
        borderColor: scheme.surface.overlay.border,
      }}
    >
      {opts.map((o) => {
        const on = value === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 8,
              backgroundColor: on ? colors.brand.bold.default.bg : 'transparent',
            }}
          >
            <Text type="label-md" color={on ? colors.brand.bold.default.fg : scheme.text.description}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Architecture() {
  const { scheme } = useTheme();
  const motion = useMotion();
  const reduceMotion = !!motion.reduceMotion;

  const [lens, setLens] = useState<Lens>('pipeline');
  const [query, setQuery] = useState('');
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [trace, setTrace] = useState<{ title: string; traces: Trace[] } | null>(null);

  const pipeline = useMemo(buildPipeline, []);
  const cascade = useMemo(buildCascade, []);
  const matches = useMemo(() => searchNodes(query), [query]);

  const active = hover ?? pinned;

  const reset = () => {
    setPinned(null);
    setHover(null);
    setTrace(null);
  };

  // Readout for the footer bar.
  const readout = useMemo(() => {
    if (!active) return null;
    if (lens === 'pipeline') {
      const n = pipeline.nodes.find((x) => x.id === active);
      return n ? `${n.label} · ${n.blurb}` : null;
    }
    const chip = cascade.groups.find((g) => g.id === active) ?? cascade.motion.groups.find((g) => g.id === active);
    if (!chip) return null;
    const outs = cascade.bands.filter((b) => b.source === active).map((b) => b.target.split(':')[1]);
    const ins = cascade.bands.filter((b) => b.target === active).map((b) => b.source.split(':')[1]);
    const tail = outs.length
      ? `resolves to ${uniq(outs).slice(0, 4).join(', ')}`
      : ins.length
        ? `used by ${uniq(ins).slice(0, 4).join(', ')}`
        : 'a raw value';
    return `${chip.title} · ${chip.count} tokens · ${tail}`;
  }, [active, lens, pipeline.nodes, cascade]);

  const onPickChip = (chip: ChipBox) => {
    if (chip.tier === 'component') {
      setTrace({ title: chip.title, traces: traceComponent(chip.group) });
      setPinned(chip.id);
    } else {
      setPinned((prev) => (prev === chip.id ? null : chip.id));
      setTrace(null);
    }
  };

  const detail = active && lens === 'pipeline' ? pipeline.nodes.find((n) => n.id === active) : null;

  return (
    <Page wide>
      <PageHeader
        eyebrow="Architecture"
        title="How Cast UI fits together"
        lede="Cast UI is a pipeline. One source of truth in Figma flows through sync, code, and CI out to your apps. Every token resolves down a short chain to a raw value. Pick a lens, then hover a node to trace its path."
      />

      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Segmented value={lens} onChange={(v) => { setLens(v); reset(); }} />
        <View style={{ width: 260 }}>
          <Input
            size="small"
            placeholder={lens === 'pipeline' ? 'Search tokens and components…' : 'Find a token or component…'}
            leadingIcon="search"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {pinned ? <Chip size="small" onRemove={reset}>Clear selection</Chip> : null}
        <View style={{ flex: 1 }} />
        <Text type="caption" color={scheme.text.description}>
          {reduceMotion ? 'Hover to trace a path. Click to pin it.' : 'Hover to trace a path · click to pin · flow shows direction'}
        </Text>
      </View>

      {matches.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {matches.map((m) => (
            <Chip
              key={m.id}
              size="small"
              leadingIcon="conversion_path"
              onPress={() => {
                setLens('cascade');
                setQuery('');
                if (m.kind === 'component-token' || m.kind === 'semantic' || m.kind === 'primitive' || m.kind === 'motion') {
                  setTrace({ title: m.label, traces: [traceToken(m.id)] });
                }
              }}
            >
              {m.label}
            </Chip>
          ))}
        </View>
      ) : null}

      <View
        style={{
          borderWidth: 1,
          borderColor: scheme.surface.overlay.border,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: scheme.surface.subtle,
        }}
      >
        <View style={{ padding: 14 }}>
          <div style={{ width: '100%' }}>
            {lens === 'pipeline' ? (
              <PipelineView
                active={active}
                selected={pinned}
                onHover={setHover}
                onSelect={(id) => setPinned((prev) => (prev === id ? null : id))}
                reduceMotion={reduceMotion}
              />
            ) : (
              <CascadeView active={active} onHover={setHover} onPick={onPickChip} reduceMotion={reduceMotion} />
            )}
          </div>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 14,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderTopWidth: 1,
            borderTopColor: scheme.surface.overlay.border,
            alignItems: 'center',
          }}
        >
          {(lens === 'pipeline'
            ? pipeline.stages.map((s) => ({ key: s.id, label: s.title, color: STAGE_COLOR[s.id] }))
            : (['component', 'semantic', 'primitive', 'motion'] as TierId[]).map((t) => ({ key: t, label: TIERS[t].title, color: TIER_COLOR[t] }))
          ).map((item) => (
            <View key={item.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: item.color }} />
              <Text type="caption">{item.label}</Text>
            </View>
          ))}
          <View style={{ flex: 1, minWidth: 40 }} />
          {readout ? (
            <Badge size="small">{readout.length > 96 ? `${readout.slice(0, 95)}…` : readout}</Badge>
          ) : (
            <Text type="caption" color={scheme.text.description}>
              {lens === 'pipeline'
                ? `${pipeline.nodes.length} tools · ${pipeline.links.length} steps`
                : `${cascade.groups.length + cascade.motion.groups.length} groups · ${NODE_COUNT} tokens`}
            </Text>
          )}
        </View>
      </View>

      {detail ? <PipelineDetail node={detail} pipeline={pipeline} /> : null}
      {trace ? <TracePanel title={trace.title} traces={trace.traces} onClose={() => setTrace(null)} /> : null}

      <Text type="body-sm" color={scheme.text.description} style={{ maxWidth: 760 }}>
        {`This runs on real data. site/scripts/build-graph.mjs reads the committed token files and writes graph.json (${NODE_COUNT} nodes, ${LINK_COUNT} links), which both lenses draw from. Change a token, rebuild, and the picture changes with it. The same map ships to designers on the kit's Welcome page in Figma.`}
      </Text>
    </Page>
  );
}

function PipelineDetail({ node, pipeline }: { node: PipeNode; pipeline: ReturnType<typeof buildPipeline> }) {
  const { scheme } = useTheme();
  const feeds = pipeline.links.filter((l) => l.source === node.id).map((l) => label(pipeline, l.target));
  const fedBy = pipeline.links.filter((l) => l.target === node.id).map((l) => label(pipeline, l.source));
  const accent = STAGE_COLOR[node.stage];
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: scheme.surface.overlay.border,
        borderRadius: 16,
        backgroundColor: scheme.surface.subtle,
        padding: 18,
        gap: 12,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: accent }} />
        <Text type="label-lg" color={scheme.text.primary}>{node.label}</Text>
        <Badge size="small" intent="brand" variant="subtle">{node.stage.toUpperCase()}</Badge>
      </View>
      <Text type="body-sm" color={scheme.text.description}>{node.blurb}</Text>
      <View style={{ flexDirection: 'row', gap: 28, flexWrap: 'wrap' }}>
        <ConnList heading="Fed by" items={fedBy} empty="Nothing. This is where it starts." />
        <ConnList heading="Feeds" items={feeds} empty="Nothing. This is the end of the line." />
      </View>
    </View>
  );
}

function ConnList({ heading, items, empty }: { heading: string; items: string[]; empty: string }) {
  const { scheme, colors } = useTheme();
  return (
    <View style={{ gap: 6, minWidth: 220 }}>
      <Text type="label-sm" color={colors.brand.subtle.default.fg}>{heading.toUpperCase()}</Text>
      {items.length ? (
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {items.map((it) => (
            <Badge key={it} size="small" variant="outline">{it}</Badge>
          ))}
        </View>
      ) : (
        <Text type="caption" color={scheme.text.description}>{empty}</Text>
      )}
    </View>
  );
}

function label(pipeline: ReturnType<typeof buildPipeline>, id: string): string {
  return pipeline.nodes.find((n) => n.id === id)?.label ?? id;
}

function uniq(xs: string[]): string[] {
  return [...new Set(xs)];
}
