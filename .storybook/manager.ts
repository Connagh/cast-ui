import { addons } from 'storybook/manager-api';
import { castTheme } from './theme';

addons.setConfig({ theme: castTheme });
