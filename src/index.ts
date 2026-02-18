// ---------------------------------------------------------------------------
// Cast Design System – Public API
// ---------------------------------------------------------------------------

// Theme system
export { CastThemeProvider, useTheme } from './theme';
export type { CastThemeProviderProps } from './theme';
export type {
  CastTheme,
  ThemeName,
  SemanticTokens,
  ComponentTokens,
  ButtonTokens,
  CardTokens,
  TextFieldTokens,
  CheckboxTokens,
  FABTokens,
  AutocompleteTokens,
  SelectTokens,
  SwitchTokens,
  BadgeTokens,
  ChipTokens,
  DividerTokens,
  IconTokens,
  TableTokens,
  AlertTokens,
  BackdropTokens,
  SkeletonTokens,
  SnackbarTokens,
  DialogTokens,
  AppBarTokens,
  LinkTokens,
  SpeedDialTokens,
} from './theme';
export { createTheme } from './theme';
export type { DeepPartial } from './theme';
export { getThemeFontFamilies, googleFontsUrl, resolveFont, ANDROID_WEIGHT_SUFFIX } from './theme';

// Theme objects
export { defaultTheme } from './tokens/generated';

// Components
export { Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant } from './components/Button/Button';

export { Card } from './components/Card/Card';
export type { CardProps } from './components/Card/Card';

export { Typography } from './components/Typography/Typography';
export type { TypographyProps, TypographyVariant } from './components/Typography/Typography';

export { TextField } from './components/TextField/TextField';
export type { TextFieldProps } from './components/TextField/TextField';

export { Checkbox } from './components/Checkbox/Checkbox';
export type { CheckboxProps } from './components/Checkbox/Checkbox';

export { FAB } from './components/FAB/FAB';
export type { FABProps, FABVariant } from './components/FAB/FAB';

export { Autocomplete } from './components/Autocomplete/Autocomplete';
export type { AutocompleteProps, AutocompleteOption } from './components/Autocomplete/Autocomplete';

export { Select } from './components/Select/Select';
export type { SelectProps, SelectOption } from './components/Select/Select';

export { Switch } from './components/Switch/Switch';
export type { SwitchProps } from './components/Switch/Switch';

export { Badge } from './components/Badge/Badge';
export type { BadgeProps } from './components/Badge/Badge';

export { Chip } from './components/Chip/Chip';
export type { ChipProps } from './components/Chip/Chip';

export { Divider } from './components/Divider/Divider';
export type { DividerProps } from './components/Divider/Divider';

export { Icon } from './components/Icon/Icon';
export type { IconProps, IconSize } from './components/Icon/Icon';

export { Table } from './components/Table/Table';
export type { TableProps, TableColumn } from './components/Table/Table';

export { Alert } from './components/Alert/Alert';
export type { AlertProps, AlertSeverity } from './components/Alert/Alert';

export { Backdrop } from './components/Backdrop/Backdrop';
export type { BackdropProps } from './components/Backdrop/Backdrop';

export { Skeleton } from './components/Skeleton/Skeleton';
export type { SkeletonProps, SkeletonVariant } from './components/Skeleton/Skeleton';

export { Snackbar } from './components/Snackbar/Snackbar';
export type { SnackbarProps } from './components/Snackbar/Snackbar';

export { Dialog } from './components/Dialog/Dialog';
export type { DialogProps } from './components/Dialog/Dialog';

export { AppBar } from './components/AppBar/AppBar';
export type { AppBarProps } from './components/AppBar/AppBar';

export { Link } from './components/Link/Link';
export type { LinkProps } from './components/Link/Link';

export { SpeedDial } from './components/SpeedDial/SpeedDial';
export type { SpeedDialProps, SpeedDialAction } from './components/SpeedDial/SpeedDial';
