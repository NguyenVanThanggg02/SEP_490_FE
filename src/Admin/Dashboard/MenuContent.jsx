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
import { GearFill } from 'react-bootstrap-icons';

const mainListItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, component: <HomeAdmin /> },
  { text: 'Quản lí bài đăng', icon: <PostAddIcon />, component: <PostManagement /> },
  { text: 'Quản lí người dùng', icon: <PeopleAltIcon />, component: <UserManagement /> },
  { text: 'Quản lí giao dịch', icon: <PaymentIcon />, component: <TransactionManagement /> },
  { text: 'Cài đặt', icon: <GearFill />, component: <ProfileAdmin /> },
];

// eslint-disable-next-line react/prop-types
export default function MenuContent({ setMainContent }) {

  const [selected, setSelected] = React.useState(0);

  const handleSelected = (i) => {
    setSelected(i)
    setMainContent(mainListItems[i])
  }


  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#manage-spaces") {
      handleSelected(mainListItems[1]);
    }

    window.history.pushState({}, '', window.location.href.replace(/#manage-spaces/, ''));
  }, [])

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={index === selected} onClick={() => handleSelected(index)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
