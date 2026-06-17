/**
 * Table — rows and columns of data.
 *
 * Compound component:
 *   <Table>
 *     <TableHead><TableRow><TableCell>Name</TableCell>…</TableRow></TableHead>
 *     <TableBody>
 *       <TableRow><TableCell>Ada</TableCell>…</TableRow>
 *     </TableBody>
 *   </Table>
 *
 * Maps 1:1 to the Figma <Table> component:
 *   size → small | default | large   (cell padding + typography)
 *   row state → default | hover | selected | disabled
 *
 * React Native has no <table>, so the table is built from Views: each row is a
 * flex row of cells. Keep the cell widths (flex or width) consistent across rows
 * so columns line up. striped shades alternate body rows; hoverable highlights a
 * row on hover; a row with onPress is pressable and can be selected.
 *
 * Colours come from the dedicated scheme.table slice (header, borders, row
 * states), which reuses existing semantic values (surface, neutral, brand
 * subtle), so no new semantic variables. Cell padding varies by density; the
 * size prop drives typography. Fonts are consumer-loaded.
 *
 * Exports: Table, TableHead, TableBody, TableRow, TableCell.
 */

import React, { createContext, useContext, useState } from 'react';
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
  type GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../../theme';
import { controlTokens } from '../../tokens';
import { Text, type TextType } from '../Text';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TableSize = 'small' | 'default' | 'large';
export type TableCellAlign = 'left' | 'center' | 'right';

export type TableProps = {
  children: React.ReactNode;
  /** Size variant — cell padding and typography. */
  size?: TableSize;
  /** Shade alternate body rows. */
  striped?: boolean;
  /** Highlight a row on hover. */
  hoverable?: boolean;
  /** Outer style. */
  style?: StyleProp<ViewStyle>;
  /** Accessibility label for the table. */
  accessibilityLabel?: string;
};

export type TableSectionProps = { children: React.ReactNode };

export type TableRowProps = {
  children: React.ReactNode;
  /** Press handler — makes the row pressable. */
  onPress?: (e: GestureResponderEvent) => void;
  /** Selected (active) row styling. */
  selected?: boolean;
  /** Disabled row styling. */
  disabled?: boolean;
  /** Internal: row index, set by <TableBody> for striping. */
  __index?: number;
};

export type TableCellProps = {
  children?: React.ReactNode;
  /** Text alignment. Defaults to left (right when numeric). */
  align?: TableCellAlign;
  /** Right-align for numbers. */
  numeric?: boolean;
  /** Flex grow factor. Defaults to 1. */
  flex?: number;
  /** Fixed width (overrides flex). */
  width?: number;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

type TableContextValue = { size: TableSize; striped: boolean; hoverable: boolean };
const TableCtx = createContext<TableContextValue | null>(null);
function useTableContext(c: string): TableContextValue {
  const ctx = useContext(TableCtx);
  if (!ctx) throw new Error(`<${c}> must be used within <Table>`);
  return ctx;
}

/** Set by TableHead / TableBody so cells know whether they are headers. */
const SectionCtx = createContext<{ isHeader: boolean }>({ isHeader: false });

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HEADER_TYPE: Record<TableSize, TextType> = {
  small: 'label-sm',
  default: 'label-md',
  large: 'label-lg',
};
const BODY_TYPE: Record<TableSize, TextType> = {
  small: 'body-sm',
  default: 'body-md',
  large: 'body-lg',
};

// ---------------------------------------------------------------------------
// TableCell
// ---------------------------------------------------------------------------

export function TableCell({ children, align, numeric = false, flex = 1, width }: TableCellProps) {
  const { size } = useTableContext('TableCell');
  const { isHeader } = useContext(SectionCtx);
  const { components, scheme } = useTheme();
  const tokens = components.table[size];

  const effectiveAlign: TableCellAlign = align ?? (numeric ? 'right' : 'left');
  const justify =
    effectiveAlign === 'right' ? 'flex-end' : effectiveAlign === 'center' ? 'center' : 'flex-start';

  return (
    <View
      style={{
        ...(width != null ? { width } : { flex }),
        paddingHorizontal: tokens.cellPaddingX,
        paddingVertical: tokens.cellPaddingY,
        justifyContent: 'center',
        alignItems: justify,
      }}
    >
      {typeof children === 'string' ? (
        <Text
          type={isHeader ? HEADER_TYPE[size] : BODY_TYPE[size]}
          color={scheme.text.primary}
          numberOfLines={1}
          style={{ textAlign: effectiveAlign }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// TableRow
// ---------------------------------------------------------------------------

export function TableRow({
  children,
  onPress,
  selected = false,
  disabled = false,
  __index = 0,
}: TableRowProps) {
  const { striped, hoverable } = useTableContext('TableRow');
  const { isHeader } = useContext(SectionCtx);
  const { scheme } = useTheme();
  const table = scheme.table;
  const [isHovered, setIsHovered] = useState(false);

  const interactive = !isHeader && !disabled && (hoverable || Boolean(onPress));

  const backgroundColor = isHeader
    ? table.headerBg
    : selected
      ? isHovered
        ? table.selectedHoverBg
        : table.selectedBg
      : isHovered
        ? table.rowHover
        : striped && __index % 2 === 1
          ? table.stripe
          : 'transparent';

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor,
    borderBottomWidth: controlTokens.borderWidth,
    borderBottomColor: table.border,
    opacity: disabled ? 0.5 : 1,
  };

  if (interactive) {
    return (
      <Pressable
        onPress={onPress}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityState={{ selected, disabled }}
        style={rowStyle}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={rowStyle}>{children}</View>;
}

// ---------------------------------------------------------------------------
// TableHead / TableBody
// ---------------------------------------------------------------------------

export function TableHead({ children }: TableSectionProps) {
  return <SectionCtx.Provider value={{ isHeader: true }}>{children}</SectionCtx.Provider>;
}

export function TableBody({ children }: TableSectionProps) {
  const rows = React.Children.toArray(children).filter(Boolean);
  return (
    <SectionCtx.Provider value={{ isHeader: false }}>
      {rows.map((child, i) =>
        React.cloneElement(child as React.ReactElement<TableRowProps>, {
          key: `row-${i}`,
          __index: i,
        }),
      )}
    </SectionCtx.Provider>
  );
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export function Table({
  children,
  size = 'default',
  striped = false,
  hoverable = false,
  style,
  accessibilityLabel,
}: TableProps) {
  const { scheme } = useTheme();

  return (
    <TableCtx.Provider value={{ size, striped, hoverable }}>
      <View
        accessibilityLabel={accessibilityLabel}
        style={[
          {
            borderWidth: controlTokens.borderWidth,
            borderColor: scheme.table.border,
            borderRadius: scheme.surface.overlay.borderRadius,
            overflow: 'hidden',
            backgroundColor: scheme.surface.overlay.bg,
          },
          style,
        ]}
      >
        {children}
      </View>
    </TableCtx.Provider>
  );
}
