import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

const NavButton = styled(Button)(({ theme }) => ({
	color: 'white',
	borderRadius: 0,
	padding: '12px 16px',
	transition: 'background-color 0.3s ease',
	width: '100%',
	textTransform: 'none',
	'&:hover': {
		backgroundColor: alpha(theme.palette.pink.default, 0.5),
	},
	'& .MuiTypography-root': {
		fontSize: theme.typography.navText.fontSize,
		fontWeight: theme.typography.navText.fontWeight,
	},
	'& .MuiSvgIcon-root': {
		fontSize: '3rem',
		color: theme.palette.purple.main,
		marginRight: theme.spacing(3),
	}
}));

export default NavButton;
