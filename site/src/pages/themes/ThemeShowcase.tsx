/**
 * ThemeShowcase — a believable SaaS product screen assembled entirely from
 * Cast UI. It reads only from useTheme(), so wrapping it in a ThemeProvider
 * with a `brand` seed and `fonts` restyles every pixel. This is the live
 * proof on the Themes page: one theme object, a whole product reskinned.
 *
 * Nothing here is hardcoded colour. Surfaces, text, borders and the brand all
 * come from the active scheme, and headings pick up the theme's display font
 * through the Text component.
 */

import React from 'react';
import { View } from 'react-native';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  Input,
  List,
  ListItem,
  ListSubheader,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  useMinWidth,
  useTheme,
} from '@castui/cast-ui';

// ---------------------------------------------------------------------------
// Small themed data-viz primitives (Views coloured from the brand intent)
// ---------------------------------------------------------------------------

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data, 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 34 }}>
      {data.map((v, i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: Math.max(4, (v / max) * 34),
            borderRadius: 3,
            backgroundColor: color,
            opacity: 0.35 + (i / data.length) * 0.65,
          }}
        />
      ))}
    </View>
  );
}

function BarChart({ data, color, track }: { data: number[]; color: string; track: string }) {
  const max = Math.max(...data, 1);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 168 }}>
      {data.map((v, i) => (
        <View key={i} style={{ flex: 1, alignItems: 'center', gap: 8 }}>
          <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end', backgroundColor: track, borderRadius: 8 }}>
            <View
              style={{
                height: `${Math.max(6, (v / max) * 100)}%` as unknown as number,
                backgroundColor: color,
                borderRadius: 8,
                opacity: i === data.length - 1 ? 1 : 0.85,
              }}
            />
          </View>
          <Text type="caption" color={track === color ? '#FFFFFF' : undefined}>
            {MONTHS[i]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const REVENUE = [42, 55, 48, 62, 70, 66, 82, 78, 90, 104, 98, 128];

const NAV = [
  { icon: 'dashboard', label: 'Overview' },
  { icon: 'insights', label: 'Analytics' },
  { icon: 'group', label: 'Customers' },
  { icon: 'receipt_long', label: 'Invoices' },
  { icon: 'description', label: 'Reports' },
];

const CUSTOMERS = [
  { initials: 'MK', name: 'Maya Kessler', email: 'maya@northwind.io', plan: 'Scale', status: 'Active', mrr: '£1,280', ok: true },
  { initials: 'JT', name: 'Jonah Tran', email: 'jonah@arcadia.co', plan: 'Pro', status: 'Active', mrr: '£640', ok: true },
  { initials: 'SR', name: 'Sofia Ruiz', email: 'sofia@lumen.app', plan: 'Pro', status: 'Trialing', mrr: '£0', ok: null },
  { initials: 'DA', name: 'Dan Adeyemi', email: 'dan@fathom.dev', plan: 'Scale', status: 'Past due', mrr: '£1,280', ok: false },
];

// ---------------------------------------------------------------------------
// KPI card
// ---------------------------------------------------------------------------

function Kpi({
  label,
  value,
  delta,
  up,
  data,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  data: number[];
}) {
  const { colors, scheme } = useTheme();
  const brand = colors.brand.bold.default.bg;
  return (
    <Card variant="elevated" size="small" style={{ flex: 1, minWidth: 190 }}>
      <View style={{ gap: 10 }}>
        <Text type="label-sm" color={scheme.text.description}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Text type="heading-sm">{value}</Text>
          <Badge intent={up ? 'brand' : 'danger'} variant="subtle" size="small" leadingIcon={up ? 'trending_up' : 'trending_down'}>
            {delta}
          </Badge>
        </View>
        <Sparkline data={data} color={brand} />
      </View>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// The screen
// ---------------------------------------------------------------------------

export function ThemeShowcase() {
  const { scheme, colors } = useTheme();
  const wide = useMinWidth('md');
  const brand = colors.brand.bold.default.bg;
  const onBrand = colors.brand.bold.default.fg;

  const statusBadge = (status: string, ok: boolean | null) =>
    ok === true ? (
      <Badge intent="brand" variant="subtle" size="small" dot>{status}</Badge>
    ) : ok === false ? (
      <Badge intent="danger" variant="subtle" size="small" dot>{status}</Badge>
    ) : (
      <Badge intent="neutral" variant="subtle" size="small" dot>{status}</Badge>
    );

  return (
    <View style={{ flexDirection: 'row', backgroundColor: scheme.surface.base, minHeight: 560 }}>
      {/* Sidebar */}
      {wide ? (
        <View
          style={{
            width: 232,
            backgroundColor: scheme.surface.overlay.bg,
            borderRightWidth: 1,
            borderRightColor: scheme.surface.overlay.border,
            padding: 16,
            justifyContent: 'space-between',
          }}
        >
          <View style={{ gap: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: brand, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bolt" size="small" color={onBrand} fill />
              </View>
              <Text type="title-sm">Northwind</Text>
            </View>
            <List>
              <ListSubheader>Workspace</ListSubheader>
              {NAV.map((item, i) => (
                <ListItem key={item.label} icon={item.icon} selected={i === 0} onPress={() => {}}>
                  {item.label}
                </ListItem>
              ))}
            </List>
          </View>
          <View style={{ gap: 14 }}>
            <View style={{ gap: 6 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text type="caption" color={scheme.text.description}>Storage</Text>
                <Text type="caption" color={scheme.text.description}>68%</Text>
              </View>
              <Progress value={68} size="small" />
            </View>
            <Divider />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar initials="AV" size="small" />
              <View style={{ flex: 1 }}>
                <Text type="label-sm">Ava Marchetti</Text>
                <Text type="caption" color={scheme.text.description}>Admin</Text>
              </View>
              <Icon name="unfold_more" size="small" color={scheme.text.description} />
            </View>
          </View>
        </View>
      ) : null}

      {/* Main */}
      <View style={{ flex: 1, padding: wide ? 24 : 16, gap: 18, minWidth: 0 }}>
        {/* Top bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ minWidth: 0 }}>
            <Text type="label-sm" color={colors.brand.subtle.default.fg}>OVERVIEW</Text>
            <Text type="heading-sm">Good morning, Ava</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {wide ? <Input size="small" placeholder="Search" leadingIcon="search" style={{ width: 180 }} /> : null}
            <Button intent="neutral" prominence="subtle" size="small" leadingIcon="notifications" accessibilityLabel="Notifications" onPress={() => {}}>{''}</Button>
            <Avatar initials="AV" size="small" />
          </View>
        </View>

        {/* Controls row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <ToggleButtonGroup size="small" value="week" onValueChange={() => {}}>
            <ToggleButton value="day">Day</ToggleButton>
            <ToggleButton value="week">Week</ToggleButton>
            <ToggleButton value="month">Month</ToggleButton>
          </ToggleButtonGroup>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button intent="neutral" prominence="default" size="small" leadingIcon="ios_share" onPress={() => {}}>Export</Button>
            <Button intent="brand" prominence="bold" size="small" leadingIcon="add" onPress={() => {}}>New report</Button>
          </View>
        </View>

        {/* KPI row */}
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          <Kpi label="REVENUE" value="£128.4k" delta="12.5%" up data={[30, 44, 38, 52, 60, 58, 72, 90]} />
          <Kpi label="ACTIVE USERS" value="8,942" delta="4.2%" up data={[50, 48, 55, 53, 62, 66, 70, 74]} />
          <Kpi label="CHURN" value="1.8%" delta="0.4%" up={false} data={[40, 38, 42, 36, 30, 28, 24, 22]} />
        </View>

        {/* Chart + goal */}
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 14 }}>
          <Card variant="elevated" style={{ flex: 2, minWidth: 0 }}>
            <View style={{ gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text type="title-sm">Revenue</Text>
                  <Text type="body-sm" color={scheme.text.description}>Last 12 months</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <Chip size="small" intent="brand" selected onPress={() => {}}>MRR</Chip>
                  <Chip size="small" onPress={() => {}}>New</Chip>
                </View>
              </View>
              <BarChart data={REVENUE} color={brand} track={scheme.surface.subtle} />
            </View>
          </Card>

          <Card variant="elevated" style={{ flex: 1, minWidth: 220 }}>
            <View style={{ gap: 14 }}>
              <Text type="title-sm">Monthly goal</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
                <Text type="heading-md">82%</Text>
                <View style={{ paddingBottom: 6 }}>
                  <Badge intent="brand" variant="subtle" size="small">on track</Badge>
                </View>
              </View>
              <Progress value={82} />
              <Divider />
              <View style={{ gap: 10 }}>
                {[
                  { label: 'New signups', value: '1,204' },
                  { label: 'Conversions', value: '318' },
                  { label: 'Avg. deal size', value: '£420' },
                ].map((row) => (
                  <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text type="body-sm" color={scheme.text.description}>{row.label}</Text>
                    <Text type="label-sm">{row.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Card>
        </View>

        {/* Table */}
        <Card variant="elevated">
          <View style={{ gap: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text type="title-sm">Recent customers</Text>
              <Button intent="neutral" prominence="subtle" size="small" trailingIcon="chevron_right" onPress={() => {}}>View all</Button>
            </View>
            <Table striped hoverable size="small">
              <TableHead>
                <TableRow>
                  <TableCell flex={3}>Customer</TableCell>
                  {wide ? <TableCell flex={1}>Plan</TableCell> : null}
                  <TableCell flex={1}>Status</TableCell>
                  <TableCell flex={1} align="right">MRR</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CUSTOMERS.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell flex={3}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Avatar initials={c.initials} size="small" />
                        <View style={{ minWidth: 0 }}>
                          <Text type="label-sm">{c.name}</Text>
                          <Text type="caption" color={scheme.text.description}>{c.email}</Text>
                        </View>
                      </View>
                    </TableCell>
                    {wide ? (
                      <TableCell flex={1}>
                        <Chip size="small" intent={c.plan === 'Scale' ? 'brand' : 'neutral'} onPress={() => {}}>{c.plan}</Chip>
                      </TableCell>
                    ) : null}
                    <TableCell flex={1}>{statusBadge(c.status, c.ok)}</TableCell>
                    <TableCell flex={1} align="right">
                      <Text type="label-sm">{c.mrr}</Text>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </View>
        </Card>
      </View>
    </View>
  );
}
