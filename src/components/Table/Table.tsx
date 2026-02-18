import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TableColumn {
  key: string;
  header: string;
  width?: number;
}

export interface TableProps {
  /** Column definitions. */
  columns: TableColumn[];
  /** Row data. */
  data: Record<string, unknown>[];
  /** Row press handler. */
  onRowPress?: (row: Record<string, unknown>) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Table({ columns, data, onRowPress }: TableProps) {
  const theme = useTheme();
  const tb = theme.component.table;

  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // --- styles ----------------------------------------------------------------

  const tableStyle: ViewStyle = {
    borderRadius: tb.cornerRadius,
    overflow: 'hidden',
  };

  const headerRowStyle: ViewStyle = {
    flexDirection: 'row',
    backgroundColor: tb.headerBackground,
  };

  const headerCellStyle = (col: TableColumn): ViewStyle => ({
    paddingHorizontal: tb.cellPaddingHorizontal,
    paddingVertical: tb.cellPaddingVertical,
    ...(col.width ? { width: col.width } : { flex: 1 }),
  });

  const headerTextStyle: TextStyle = {
    fontSize: tb.headerTextSize,
    color: tb.headerTextColor,
    ...resolveFont(tb.fontFamily, tb.headerFontWeight),
  };

  const rowStyle = (index: number): ViewStyle => ({
    flexDirection: 'row',
    borderTopWidth: tb.rowBorderWidth,
    borderTopColor: tb.rowBorderColor,
    ...(hoveredRow === index ? { backgroundColor: tb.rowHoverBackground } : {}),
  });

  const cellStyle = (col: TableColumn): ViewStyle => ({
    paddingHorizontal: tb.cellPaddingHorizontal,
    paddingVertical: tb.cellPaddingVertical,
    ...(col.width ? { width: col.width } : { flex: 1 }),
  });

  const cellTextStyle: TextStyle = {
    fontSize: tb.cellTextSize,
    color: tb.cellTextColor,
    ...resolveFont(tb.fontFamily, theme.semantic.fontWeight.body),
  };

  return (
    <View style={tableStyle}>
      <View style={headerRowStyle}>
        {columns.map((col) => (
          <View key={col.key} style={headerCellStyle(col)}>
            <Text style={headerTextStyle}>{col.header}</Text>
          </View>
        ))}
      </View>
      {data.map((row, index) => {
        const RowWrapper = onRowPress ? Pressable : View;
        return (
          <RowWrapper
            key={index}
            style={rowStyle(index)}
            {...(onRowPress
              ? {
                  onPress: () => onRowPress(row),
                  ...({
                    onHoverIn: () => setHoveredRow(index),
                    onHoverOut: () => setHoveredRow(null),
                  } as Record<string, unknown>),
                }
              : {})}
          >
            {columns.map((col) => (
              <View key={col.key} style={cellStyle(col)}>
                <Text style={cellTextStyle}>{String(row[col.key] ?? '')}</Text>
              </View>
            ))}
          </RowWrapper>
        );
      })}
    </View>
  );
}
