/**
 * The system graph: every token, component, and tool as nodes in a live
 * force-directed canvas. Two lenses: the ecosystem (how the pieces connect)
 * and the tokens (alias chains from component values down to primitives).
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { Badge, Chip, Input, Text, useTheme } from '@castui/cast-ui';
import { Page, PageHeader } from '../../ui/Page';
import graphData from '../../data/graph.json';

type GraphNode = {
  id: string;
  label: string;
  kind: string;
  set?: string;
  value?: string | number;
  type?: string;
};
type GraphLink = { source: string; target: string; kind: string };

type SimNode = GraphNode & { x: number; y: number; vx: number; vy: number; r: number };

const KIND_COLOR: Record<string, string> = {
  ecosystem: '#2563EB',
  component: '#7C3AED',
  'component-token': '#8B5CF6',
  semantic: '#059669',
  primitive: '#D97706',
  motion: '#E11D48',
};

const KIND_LABEL: Record<string, string> = {
  ecosystem: 'Ecosystem',
  component: 'Components',
  'component-token': 'Component tokens',
  semantic: 'Semantic',
  primitive: 'Primitive',
  motion: 'Motion',
};

function radiusFor(node: GraphNode, degree: number): number {
  if (node.kind === 'ecosystem') return 14;
  if (node.kind === 'component') return 9 + Math.min(degree * 0.15, 5);
  return 3.5 + Math.min(degree * 0.4, 5);
}

export default function Architecture() {
  const { scheme, colorMode } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [lens, setLens] = useState<'ecosystem' | 'tokens'>('ecosystem');
  const [query, setQuery] = useState('');
  const [focusId, setFocusId] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  const data = graphData as { nodes: GraphNode[]; links: GraphLink[] };

  // The visible slice of the graph for the current lens + focus.
  const visible = useMemo(() => {
    let nodeIds: Set<string>;
    if (lens === 'ecosystem') {
      nodeIds = new Set(
        data.nodes.filter((n) => n.kind === 'ecosystem' || n.kind === 'component').map((n) => n.id),
      );
    } else {
      nodeIds = new Set(data.nodes.map((n) => n.id));
    }
    let links = data.links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target));

    if (focusId && nodeIds.has(focusId)) {
      // Two hops around the focus.
      const keep = new Set([focusId]);
      for (let hop = 0; hop < 2; hop++) {
        for (const l of links) {
          if (keep.has(l.source)) keep.add(l.target);
          if (keep.has(l.target)) keep.add(l.source);
        }
      }
      nodeIds = new Set([...nodeIds].filter((id) => keep.has(id)));
      links = links.filter((l) => nodeIds.has(l.source) && nodeIds.has(l.target));
    }

    const nodes = data.nodes.filter((n) => nodeIds.has(n.id));
    return { nodes, links };
  }, [data, lens, focusId]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return data.nodes
      .filter((n) => n.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [data, query]);

  // --- The simulation --------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const maybeCtx = canvas.getContext('2d');
    if (!maybeCtx) return;
    const ctx = maybeCtx;

    let width = wrap.clientWidth;
    let height = Math.max(560, Math.min(width * 0.66, 760));
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      width = wrap.clientWidth;
      height = Math.max(560, Math.min(width * 0.66, 760));
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();

    const degree = new Map<string, number>();
    for (const l of visible.links) {
      degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
      degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
    }

    // Seed positions: ring per kind so the layers untangle fast.
    const kindAngle: Record<string, number> = {
      ecosystem: 0, component: 1, 'component-token': 2, semantic: 3, primitive: 4, motion: 5,
    };
    const simNodes: SimNode[] = visible.nodes.map((n, i) => {
      const ring = (kindAngle[n.kind] ?? 0) * 60 + 80;
      const angle = (i / visible.nodes.length) * Math.PI * 2 * 7 + (kindAngle[n.kind] ?? 0);
      return {
        ...n,
        x: width / 2 + Math.cos(angle) * ring * (0.6 + Math.random() * 0.5),
        y: height / 2 + Math.sin(angle) * ring * (0.6 + Math.random() * 0.5),
        vx: 0,
        vy: 0,
        r: radiusFor(n, degree.get(n.id) ?? 0),
      };
    });
    const byId = new Map(simNodes.map((n) => [n.id, n]));
    const simLinks = visible.links
      .map((l) => ({ a: byId.get(l.source), b: byId.get(l.target), kind: l.kind }))
      .filter((l): l is { a: SimNode; b: SimNode; kind: string } => !!l.a && !!l.b);

    const big = simNodes.length > 400;
    let alpha = 1;
    let raf = 0;
    let scale = big ? 0.7 : 1;
    let offsetX = 0;
    let offsetY = 0;
    let dragNode: SimNode | null = null;
    let panning = false;
    let lastX = 0;
    let lastY = 0;
    let hovered: SimNode | null = null;

    const linkColor = colorMode === 'dark' ? 'rgba(148,163,184,0.25)' : 'rgba(100,116,139,0.28)';
    const flowColor = colorMode === 'dark' ? 'rgba(37,99,235,0.5)' : 'rgba(37,99,235,0.45)';
    const labelColor = colorMode === 'dark' ? '#E2E8F0' : '#1E293B';

    function tick() {
      // Repulsion (with a cheap cutoff), springs, centring, damping.
      const repulsion = big ? 320 : 900;
      for (let i = 0; i < simNodes.length; i++) {
        const a = simNodes[i];
        for (let j = i + 1; j < simNodes.length; j++) {
          const b = simNodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 40000 || d2 === 0) continue;
          const force = (repulsion / d2) * alpha;
          const d = Math.sqrt(d2);
          dx /= d; dy /= d;
          a.vx += dx * force; a.vy += dy * force;
          b.vx -= dx * force; b.vy -= dy * force;
        }
      }
      for (const { a, b, kind } of simLinks) {
        const rest = kind === 'flow' ? 120 : kind === 'contains' ? 46 : 70;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = ((d - rest) / d) * 0.02 * alpha * (kind === 'flow' ? 2.4 : 1);
        a.vx += dx * force; a.vy += dy * force;
        b.vx -= dx * force; b.vy -= dy * force;
      }
      for (const n of simNodes) {
        n.vx += (width / 2 - n.x) * 0.0015 * alpha;
        n.vy += (height / 2 - n.y) * 0.0015 * alpha;
        if (n !== dragNode) {
          n.x += n.vx; n.y += n.vy;
        }
        n.vx *= 0.86; n.vy *= 0.86;
      }
      alpha = Math.max(alpha * 0.995, 0.06);
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      for (const { a, b, kind } of simLinks) {
        ctx.strokeStyle = kind === 'flow' ? flowColor : linkColor;
        ctx.lineWidth = kind === 'flow' ? 1.6 : 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (const n of simNodes) {
        ctx.fillStyle = KIND_COLOR[n.kind] ?? '#94A3B8';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (n === hovered || n.id === focusId) {
          ctx.strokeStyle = labelColor;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
      }

      ctx.fillStyle = labelColor;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      for (const n of simNodes) {
        const showLabel =
          n.kind === 'ecosystem' ||
          n.kind === 'component' ||
          simNodes.length < 90 ||
          n === hovered ||
          n.id === focusId;
        if (showLabel) ctx.fillText(n.label, n.x, n.y - n.r - 5);
      }
    }

    function loop() {
      tick();
      draw();
      raf = requestAnimationFrame(loop);
    }
    loop();

    const toWorld = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - offsetX) / scale,
        y: (e.clientY - rect.top - offsetY) / scale,
      };
    };
    const findNode = (p: { x: number; y: number }) => {
      for (let i = simNodes.length - 1; i >= 0; i--) {
        const n = simNodes[i];
        const dx = n.x - p.x;
        const dy = n.y - p.y;
        if (dx * dx + dy * dy < (n.r + 4) * (n.r + 4)) return n;
      }
      return null;
    };

    const onDown = (e: MouseEvent) => {
      const node = findNode(toWorld(e));
      if (node) {
        dragNode = node;
        alpha = Math.max(alpha, 0.3);
      } else {
        panning = true;
      }
      lastX = e.clientX; lastY = e.clientY;
    };
    const onMove = (e: MouseEvent) => {
      const p = toWorld(e);
      if (dragNode) {
        dragNode.x = p.x; dragNode.y = p.y;
        dragNode.vx = 0; dragNode.vy = 0;
        alpha = Math.max(alpha, 0.25);
      } else if (panning) {
        offsetX += e.clientX - lastX;
        offsetY += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
      } else {
        hovered = findNode(p);
        canvas.style.cursor = hovered ? 'pointer' : 'grab';
        setHoverNode(hovered);
      }
    };
    const onUp = (e: MouseEvent) => {
      if (dragNode) {
        const moved = Math.abs(e.clientX - lastX) + Math.abs(e.clientY - lastY);
        if (moved < 4) setFocusId((prev) => (prev === dragNode?.id ? null : dragNode?.id ?? null));
      }
      dragNode = null;
      panning = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const next = Math.min(Math.max(scale * (e.deltaY < 0 ? 1.1 : 0.9), 0.25), 3);
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      offsetX = mx - ((mx - offsetX) / scale) * next;
      offsetY = my - ((my - offsetY) / scale) * next;
      scale = next;
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', resize);
    };
  }, [visible, colorMode, focusId]);

  const focusNode = focusId ? data.nodes.find((n) => n.id === focusId) : null;

  return (
    <Page wide>
      <PageHeader
        eyebrow="Architecture"
        title="The whole system, as a graph"
        lede="Every token, component, and tool is a node. Flow lines carry the pipeline from Figma to shipped apps; thin lines are real alias edges read from the token files. Drag to arrange, scroll to zoom, click a node to isolate its neighbourhood."
      />
      <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Chip intent="brand" selected={lens === 'ecosystem'} onPress={() => { setLens('ecosystem'); setFocusId(null); }}>
          Ecosystem
        </Chip>
        <Chip intent="brand" selected={lens === 'tokens'} onPress={() => { setLens('tokens'); setFocusId(null); }}>
          {`All ${data.nodes.length} nodes`}
        </Chip>
        <View style={{ width: 260 }}>
          <Input
            size="small"
            placeholder="Find a token or component…"
            leadingIcon="search"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        {focusNode ? (
          <Chip size="small" onRemove={() => setFocusId(null)}>{`Focused: ${focusNode.label}`}</Chip>
        ) : null}
      </View>
      {matches.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          {matches.map((m) => (
            <Chip
              key={m.id}
              size="small"
              onPress={() => {
                setLens('tokens');
                setFocusId(m.id);
                setQuery('');
              }}
            >
              {`${m.label} · ${KIND_LABEL[m.kind] ?? m.kind}`}
            </Chip>
          ))}
        </View>
      ) : null}

      <View
        style={{
          borderWidth: 1,
          borderColor: scheme.surface.overlay.border,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundColor: scheme.surface.subtle,
        }}
      >
        <div ref={wrapRef} style={{ width: '100%' }}>
          <canvas ref={canvasRef} />
        </div>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            padding: 12,
            borderTopWidth: 1,
            borderTopColor: scheme.surface.overlay.border,
            alignItems: 'center',
          }}
        >
          {Object.entries(KIND_LABEL).map(([kind, label]) => (
            <View key={kind} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: KIND_COLOR[kind] }} />
              <Text type="caption">{label}</Text>
            </View>
          ))}
          <View style={{ flex: 1 }} />
          {hoverNode ? (
            <Badge size="small">
              {`${hoverNode.label}${hoverNode.value !== undefined ? ` = ${String(hoverNode.value)}` : ''}`}
            </Badge>
          ) : (
            <Text type="caption" color={scheme.text.description}>
              {`${visible.nodes.length} nodes · ${visible.links.length} edges`}
            </Text>
          )}
        </View>
      </View>

      <Text type="body-sm" color={scheme.text.description} style={{ maxWidth: 760 }}>
        The data behind this view is generated from the committed token exports by site/scripts/build-graph.mjs, so the graph is always as honest as the repo. The kit's Welcome page in Figma carries the same map for designers.
      </Text>
    </Page>
  );
}
