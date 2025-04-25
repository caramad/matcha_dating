import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import StyleIcon from '@mui/icons-material/Style';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Logo from '@/common/components/Logo';
import sideBarStyles from './SideBar.module.css';
import NavButton from './NavButton';


const drawerWidth = 240;

function SideBar() {
	const [selectedPath, setSelectedPath] = React.useState('/swipe');


	const navItems = [
		{ label: 'Swipe', path: '/swipe', icon: <StyleIcon /> },
		{ label: 'Search', path: '/search', icon: <SearchIcon /> },
		{ label: 'Messages', path: '/messages', icon: <ChatRoundedIcon /> },
		{ label: 'Profile', path: '/profile', icon: <AccountCircleIcon /> },
	];

	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<Drawer variant="permanent" anchor="left">
				<Toolbar>
					<Logo />
				</Toolbar>

				<Divider />
				<List sx={{
					display: 'flex',
					flexDirection: 'column',
					height: '100%',
					pt: 0,
					pb: 0,
					gap: '15px',
				}}>
					{navItems.map(({ label, path, icon }) => (
						<ListItem key={label} disablePadding>
							<NavButton
								onClick={() => {
									setSelectedPath(path);
									console.log("Navigating to: " + path)
								}}
								selected={selectedPath === path}
							>
								<ListItemIcon>{icon}</ListItemIcon>
								<ListItemText primary={label} />
							</NavButton>
						</ListItem>
					))}
				</List>
				<Divider />
				<Box sx={{ display: 'flex', flexDirection: 'column-reverse', height: '100%' }}>
					<List>
						{['Log out'].map((text) => (
							<ListItem key={text} disablePadding>
								<NavButton>
									<LogoutRoundedIcon />
									<ListItemText primary={text} />
								</NavButton>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>


		</Box>
	);
}

export default SideBar;