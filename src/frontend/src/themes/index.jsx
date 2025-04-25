import { createTheme } from '@mui/material/styles';
import merge from 'lodash.merge';

import palette from './base/palette';
import typography from './base/typography';
import shape from './base/shape';

import appLayoutTheme from './features/appLayoutTheme';

const baseTheme = {
	palette,
	typography,
	shape,
};

export const defaultTheme = createTheme(baseTheme);
export const appLayoutMuiTheme = createTheme(merge({}, baseTheme, appLayoutTheme));
