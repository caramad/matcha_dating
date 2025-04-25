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
			fontSize: '30px',
			fontWeight: 20,
		},
		navTextSelected: {
			fontSize: '40px',
			fontWeight: 600,
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
					backgroundColor: '#1E1E1E',
					color: 'white',
					backdropFilter: 'blur(16px)',
					background: '#121212',
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
