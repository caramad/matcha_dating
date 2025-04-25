import React from "react";
import { appLayoutMuiTheme } from '@/themes';
import commonStyles from '@/common/styles/Common.module.css';
import SideBar from '@/features/appLayout/components/SideBar'
import { ThemeProvider } from '@mui/material/styles';
import MainBackground from "@/common/components/MainBackground";

const styles = { ...commonStyles };

function AppLayoutPage() {

	return (
		<ThemeProvider theme={appLayoutMuiTheme}>
			<MainBackground>
				<SideBar />
			</MainBackground>
		</ThemeProvider>

	);
}

export default AppLayoutPage;