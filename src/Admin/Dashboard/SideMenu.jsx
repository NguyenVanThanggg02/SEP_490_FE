import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuContent from './MenuContent';
import Logo from '../../assets/images/newlogo_2.png';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

// eslint-disable-next-line react/prop-types
export default function SideMenu({ setMainContent }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box component="div" sx={{ display: 'flex', alignItems: 'center', width: "100%", justifyContent: "center", mt: 3, mb: 2 }}>
        <img src={Logo} height="72" width="72" alt="logo" />
      </Box>
      <Divider />
      <MenuContent setMainContent={setMainContent} />
    </Drawer>
  );
}
