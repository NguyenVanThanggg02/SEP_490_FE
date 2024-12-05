import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Header from './Dashboard/Header';
import SideMenu from './Dashboard/SideMenu';
import HomeAdmin from "./HomeAdmin";
import AdminMainContent from './Dashboard/AdminMainContent';


// eslint-disable-next-line react/prop-types
export const AdminLayout = () => {

    const [mainContent, setMainContent] = React.useState({
        text: 'Dashboard',
        component: <HomeAdmin />
    })
    {/* <AppTheme themeComponents={xThemeComponents}> */ }
    return (<Box>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
            <SideMenu setMainContent={setMainContent} />
            {/* <AppNavbar /> */}
            <Box
                component="main"
                sx={(theme) => ({
                    flexGrow: 1,
                    backgroundColor: theme.vars
                        ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                        : alpha(theme.palette.background.default, 1),
                    overflow: 'auto',
                })}
            >
                <Stack
                    spacing={2}
                    sx={{
                        alignItems: 'center',
                        mx: 3,
                        pb: 5,
                        mt: { xs: 8, md: 0 },
                    }}
                >
                    <Header mainContent={mainContent} />
                    <AdminMainContent>
                        {mainContent.component}
                    </AdminMainContent>
                </Stack>
            </Box>
        </Box>
    </Box>)
}