/* eslint-disable react/prop-types */

import React, { useState } from 'react';
import '../style/Header.css';
import NewLogo from '../assets/images/newlogo_2.png';
import AccountMenu from './Menu';
import { Link, useLocation } from 'react-router-dom';
import { Box, Stack, Link as MuiLink, useTheme, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { useUser } from '../hooks/useUser';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ setIsLoggedIn, isLoggedIn }) => {
<<<<<<< HEAD
  return (
    <Row className="d-flex align-items-center justify-content-between headerr">
      <Col md={2}>
        <div className="logo">
          <Link to={"/"}>
            <img
              src={NewLogo}
              style={{ height: "180px", width: "190px" }}
              alt="logo"
            />
          </Link>
        </div>
      </Col>
      <Col md={9}>
        <div class="navbar">
          <div class="nav-links">
            <Link to={"/"}>Trang chủ</Link>
            <Link to={"/list_space"}>Danh sách địa điểm</Link>
            <Link to={"/blog"}>Bài viết</Link>
            <Link to={"/contact"}>Liên hệ</Link>
          </div>
          <AccountMenu setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
=======
>>>>>>> 47514b67648931813a98242d365754072c066489

  const location = useLocation();
  const theme = useTheme();
  const { user } = useUser();
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/list_space', label: 'Danh sách địa điểm' },
    { to: '/blog', label: 'Bài viết' },
    // { to: '/#', label: 'Liên hệ' },
    { to: '/welcome', label: 'Cho thuê địa điểm qua SpaceHub', needLogin: true },
  ];
  const [menuOpen, setMenuOpen] = useState(false); // State to manage menu visibility

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box>
        <Link to="/">
          <img
            src={NewLogo}
            alt="logo"
            style={{ height: '80px', width: '80px', objectFit: 'contain' }}
          />
        </Link>
      </Box>

      {!isLg && (
        <>
          <IconButton sx={{ display: { sm: 'none', xs: 'block' } }} onClick={handleMenuToggle}>
            <MenuIcon sx={{ color: '#333' }} />
          </IconButton>


          {/* Mobile Menu Drawer */}
          <Drawer
            anchor="right"
            open={menuOpen}
            onClose={handleMenuToggle}
          >
            <List>
              {navLinks.map((link) => (
                (!link.needLogin || (link.needLogin && user)) && (
                  <ListItem key={link.to}>
                    <ListItemButton component={Link} to={link.to} sx={{ textDecoration: 'none' }} onClick={handleMenuToggle}>
                      <ListItemText
                        primary={
                          <MuiLink
                            sx={{
                              textDecoration: 'none',
                              color: location.pathname === link.to ? theme.palette.primary.main : '#333',
                              fontWeight: '600',
                              '&:hover': {
                                color: theme.palette.primary.main,
                                textDecoration: 'underline',
                              },
                            }}
                          >
                            {link.label}
                          </MuiLink>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                )
              ))}
            </List>
          </Drawer></>
      )}
      {
        isLg && <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Stack direction="row" spacing={4} alignItems="center" sx={{ mr: 6 }}>
            {navLinks.map((link) => (
              <>
                {
                  (!link.needLogin || (link.needLogin && user)) && <MuiLink
                    component={Link}
                    to={link.to}
                    key={link.to}
                    sx={{
                      textDecoration: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: location.pathname === link.to ? theme.palette.primary.main : '#333',
                      '&:hover': {
                        color: theme.palette.primary.main,
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {link.label}
                  </MuiLink>
                }
              </>
            ))}
          </Stack>

        <AccountMenu setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        </Box>
      }
    </Box>
  );
};

export default Header;
