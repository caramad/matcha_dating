import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

const NavButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'selected',
})(({ theme, selected }) => ({
	color: 'white',
	borderRadius: 0,
	padding: '12px 16px',
	height: '100px',
	width: '100%',
	textTransform: 'none',
	transition: 'background-color 0.3s ease',
	backgroundColor: selected ?
		alpha(theme.palette.pink.default, 0.2) : 'transparent',
	'&:hover': {
		backgroundColor: alpha(theme.palette.pink.default, 0.5),
	},
	'& .MuiTypography-root': {
		...(selected ? theme.typography.navTextSelected : theme.typography.navText),
	},
	'& .MuiSvgIcon-root': {
		fontSize: selected ? '3.5rem' : '3rem',
		color: selected ? theme.palette.pink.main : theme.palette.purple.main,
		marginRight: theme.spacing(3),
		transition: 'font-size 0.6s ease',
		filter: selected ? 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.5))' : 'none',
	},
}));

export default NavButton;
