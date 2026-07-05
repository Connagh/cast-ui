import type { PropRow } from '../../ui/PropsTable';

export type ComponentCategory =
  | 'Foundations'
  | 'Actions & inputs'
  | 'Display & feedback'
  | 'Overlays'
  | 'Navigation'
  | 'Data';

export type ComponentExample = {
  title: string;
  code: string;
  /** Centre the preview (default true). Set false for full-width demos. */
  centered?: boolean;
};

export type ComponentDoc = {
  slug: string;
  name: string;
  category: ComponentCategory;
  /** One line for index cards and search. */
  summary: string;
  /** Page lede: when to reach for it. */
  description: string;
  /** Names to show in the import line. */
  importNames: string;
  props: PropRow[];
  subProps?: { title: string; rows: PropRow[] }[];
  examples: ComponentExample[];
  dos: string[];
  donts: string[];
  /** Which motion roles the component consumes, if any. */
  motionRole?: string;
  related: string[];
};
