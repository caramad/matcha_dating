import { styled } from '@mui/material/styles';

const MainBackground = styled('div')(({ theme }) => ({
	height: '100vh',
	width: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	background: theme.palette.background.gradient,
	boxSizing: 'border-box',
	overflow: 'hidden',
}));

export default MainBackground;