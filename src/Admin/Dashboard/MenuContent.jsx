import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PostAddIcon from '@mui/icons-material/PostAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeAdmin from '../HomeAdmin';
import PostManagement from '../PostManagement';
import UserManagement from '../UserManagement ';
import { TransactionManagement } from '../TransactionManagement';
import ProfileAdmin from '../profile/ProfileAdmin';
import { GearFill, House, HouseFill } from 'react-bootstrap-icons';
import PostReportMana from '../PostReportMana';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { AdminWallet } from '../AdminWallet';
import { useNavigate } from 'react-router-dom';

const mainListItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, component: <HomeAdmin /> },
  { text: 'Quản lí bài đăng', icon: <PostAddIcon />, component: <PostManagement /> },
  { text: 'Quản lí bài báo cáo', icon: <PostAddIcon />, component: <PostReportMana /> },
  { text: 'Quản lí người dùng', icon: <PeopleAltIcon />, component: <UserManagement /> },
  { text: 'Quản lí giao dịch', icon: <PaymentIcon />, component: <TransactionManagement /> },
  { text: 'Ví admin', icon: <AccountBalanceWalletIcon />, component: <AdminWallet /> },
  { text: 'Cài đặt', icon: <GearFill />, component: <ProfileAdmin /> },
  { text: 'Trang chủ', icon: <HouseFill />},
];

// eslint-disable-next-line react/prop-types
export default function MenuContent({ setMainContent }) {

  const [selected, setSelected] = React.useState(0);
  const nav = useNavigate()
  
  const handleSelected = (i) => {
    setSelected(i);
    if (i === 7) { 
      nav('/'); 
    } else {
      setMainContent(mainListItems[i]);
    }
  };

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#manage-spaces") {
        handleSelected(1);
      } else if (hash === "#manage-spaces-report") {
        handleSelected(2);
      }
      window.history.pushState({}, '', window.location.pathname);
    };
    handleHashChange(); 
    window.addEventListener("hashchange", handleHashChange); 
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between', backgroundColor:'#23283a', color:'white' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === selected} onClick={() => handleSelected(index)}>
            <ListItemIcon sx={{color:'white'}}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
