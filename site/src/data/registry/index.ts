import type { ComponentCategory, ComponentDoc } from './types';
import { foundations } from './foundations';
import { actions } from './actions';
import { inputs } from './inputs';
import { feedback } from './feedback';
import { overlays } from './overlays';
import { navigation } from './navigation';
import { dataComponents } from './data';

export type { ComponentCategory, ComponentDoc, ComponentExample } from './types';

/** Every documented component, alphabetical. */
export const registry: ComponentDoc[] = [
  ...foundations,
  ...actions,
  ...inputs,
  ...feedback,
  ...overlays,
  ...navigation,
  ...dataComponents,
].sort((a, b) => a.name.localeCompare(b.name));

export const categories: ComponentCategory[] = [
  'Foundations',
  'Actions & inputs',
  'Display & feedback',
  'Overlays',
  'Navigation',
  'Data',
];

export function bySlug(slug: string): ComponentDoc | undefined {
  return registry.find((c) => c.slug === slug);
}

export function byCategory(category: ComponentCategory): ComponentDoc[] {
  return registry.filter((c) => c.category === category);
}
