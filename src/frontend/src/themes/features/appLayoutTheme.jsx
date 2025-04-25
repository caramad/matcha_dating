const drawerWidth = 400;

const appLayoutTheme = {
	palette: {
		background: {
			gradient: 'linear-gradient(90deg, #E63946 45%, #8A4FFF 100%)',
		},
	},
	typography: {
		body1: {
			fontSize: '15px',
		},
		navText: {
			fontFamily: 'Sora, sans-serif',
			fontSize: '2rem',
			fontWeight: 'bold',
		},
		navTextSelected: {
			fontFamily: 'Sora, sans-serif',
			fontSize: '40px',
			fontWeight: 'bold',
		},
	},
	components: {
		MuiDrawer: {
			styleOverrides: {
				root: {
					width: drawerWidth,
					flexShrink: 0,
				},
				paper: {
					width: drawerWidth,
					background: 'linear-gradient(to right, rgba(18, 18, 18, 0.8) 0%, rgba(18, 18, 18, 0.5) 70%, rgba(18, 18, 18, 0.3) 100%)',
					borderWidth: 0,
					backdropFilter: 'blur(16px)',
					color: 'white',
					boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
				},
			},
		},
		MuiToolbar: {
			styleOverrides: {
				root: {
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 20,
					paddingBottom: 20,
					minHeight: 'auto',
					height: 'auto',
					'@media (min-width:600px)': {
						paddingLeft: 0,
						paddingRight: 0,
					},
				},
			},
		},
	},
};

export default appLayoutTheme;
