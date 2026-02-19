import { Text, type TextProps, type TextStyle } from 'react-native';
import { useTheme, resolveFont } from '../../theme';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'subtitle'
  | 'body'
  | 'small'
  | 'caption'
  | 'overline'
  | 'label';

export interface TypographyProps extends Omit<TextProps, 'style'> {
  /** Text style variant. @default 'body' */
  variant?: TypographyVariant;
  /** Override text color. */
  color?: string;
  /** Text alignment. @default 'left' */
  align?: 'left' | 'center' | 'right';
  /** Text content. */
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Variant → semantic-token key mapping
// ---------------------------------------------------------------------------

type FontWeightKey = 'heading' | 'body' | 'button';
type LetterSpacingKey = 'heading' | 'body' | 'label';
type FontFamilyKey = 'brand' | 'interface';

interface VariantMapping {
  fontWeight: FontWeightKey;
  letterSpacing: LetterSpacingKey;
  fontFamily: FontFamilyKey;
}

const VARIANT_MAP: Record<TypographyVariant, VariantMapping> = {
  display:  { fontWeight: 'heading', letterSpacing: 'heading', fontFamily: 'brand' },
  h1:       { fontWeight: 'heading', letterSpacing: 'heading', fontFamily: 'brand' },
  h2:       { fontWeight: 'heading', letterSpacing: 'heading', fontFamily: 'brand' },
  h3:       { fontWeight: 'heading', letterSpacing: 'heading', fontFamily: 'brand' },
  subtitle: { fontWeight: 'button',  letterSpacing: 'body',    fontFamily: 'interface' },
  body:     { fontWeight: 'body',    letterSpacing: 'body',    fontFamily: 'interface' },
  small:    { fontWeight: 'body',    letterSpacing: 'body',    fontFamily: 'interface' },
  caption:  { fontWeight: 'body',    letterSpacing: 'body',    fontFamily: 'interface' },
  overline: { fontWeight: 'button',  letterSpacing: 'label',   fontFamily: 'interface' },
  label:    { fontWeight: 'button',  letterSpacing: 'body',    fontFamily: 'interface' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Typography component for rendering themed text.
 *
 * Maps each variant to the Cast semantic text tokens (fontSize, fontWeight,
 * lineHeight, letterSpacing, fontFamily). Uses `resolveFont()` for
 * cross-platform font handling.
 */
export function Typography({
  variant = 'body',
  color,
  align,
  children,
  ...textProps
}: TypographyProps) {
  const theme = useTheme();
  const sem = theme.semantic;
  const mapping = VARIANT_MAP[variant];

  const textStyle: TextStyle = {
    fontSize: sem.fontSize[variant],
    lineHeight: sem.lineHeight[variant],
    letterSpacing: sem.letterSpacing[mapping.letterSpacing],
    color: color ?? sem.colour.onSurface,
    ...(align && { textAlign: align }),
    ...(variant === 'overline' && { textTransform: 'uppercase' }),
    ...resolveFont(
      sem.fontFamily[mapping.fontFamily],
      sem.fontWeight[mapping.fontWeight],
    ),
  };

  return (
    <Text {...textProps} style={textStyle}>
      {children}
    </Text>
  );
}
