import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Divider,
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const drawerWidth = 240;
const appBarHeight = 64; // default MUI AppBar height

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Orders", path: "/orders", icon: <ShoppingCartIcon /> },
];

const user = {
  name: "Bharat Kashyap",
  email: "bharatkashyap@outlook.com",
  avatar: "https://avatars.githubusercontent.com/u/19550456",
};

const UserLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleThemeToggle = () => setDarkMode(!darkMode);
  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSignOut = () => {
    console.log("Sign out clicked");
    handleClose();
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      {/* <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            transition: "width 0.3s",
            top: `${appBarHeight}px`, // push drawer below navbar
            zIndex: 1100, // lower than AppBar
          },
        }}
      > */}
        {/* <Box
          sx={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        > */}
          {/* <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List> */}
          {/* <Box sx={{ flexGrow: 1 }} /> {/* push footer to bottom */}
          {/* <Divider />  */}
          {/* Sidebar Footer - User Account */}
          {/* <Stack direction="row" alignItems="center" spacing={1} p={2}> */}
            {/* <IconButton onClick={handleAvatarClick}> */}
              <Avatar src={user.avatar} alt={user.name} />
            {/* </IconButton> */}
            {/* <Stack> */}
              <Typography variant="body2">{user.name}</Typography>
              <Typography variant="caption">{user.email}</Typography>
            {/* </Stack> */}
          {/* </Stack> */}
          {/* <Menu */}
            {/* anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
>          
            <MenuItem onClick={handleSignOut}>Sign Out</MenuItem> */}
          {/* </Menu> */}
        {/* </Box> */}
      {/* </Drawer> */}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s",
          marginLeft: sidebarOpen ? `${drawerWidth}px` : 0,
        }}
      >
        {/* Top Navbar */}
        <AppBar
          position="fixed"
          sx={{ zIndex: 1200, ml: sidebarOpen ? `${drawerWidth}px` : 0 }}
        >
          <Toolbar>...</Toolbar>
        </AppBar>

        {/* Spacer so content is below AppBar */}
        <Toolbar />

        {/* Page content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserLayout;
