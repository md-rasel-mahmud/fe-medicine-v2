import { ChevronLeft, Menu } from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { CSSObject, Theme, styled } from '@mui/material/styles';
import * as React from 'react';
import { Link } from 'react-router-dom';
import SideBarHeader from './SideBarHeader';
import SidebarCollapse from './SidebarCollapse';
import sidebarMenuItems from './sidebar-menu-items/SidebarMenuItems';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

type SidebarPropsType = {
  children: React.ReactNode;
};

const Sidebar: React.FC<SidebarPropsType> = ({ children }) => {
  const [open, setOpen] = React.useState(true);
  // const [listItemOpen, setListItemOpen] = React.useState(false);

  const handleDrawerOpenClose = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position='fixed'
        color='inherit'
        sx={{ boxShadow: 0, borderBottom: 1, borderColor: 'divider' }}
        open={open}
      >
        <Toolbar sx={{ paddingLeft: '.6rem !important' }}>
          <IconButton
            color='inherit'
            edge='start'
            sx={{
              ...(open && { display: 'none' }),
            }}
          >
            <Avatar sx={{ bgcolor: 'rgb(245, 245, 245)' }} />
          </IconButton>

          <IconButton onClick={handleDrawerOpenClose}>
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>
          <Typography variant='h6' noWrap component='div'>
            Mini variant drawer
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant='permanent' open={open}>
        <SideBarHeader />
        <Divider />
        <List>
          {sidebarMenuItems.map((menuItem, index) => {
            if (menuItem.children) {
              if (open) {
                return (
                  <React.Fragment key={menuItem.id}>
                    <SidebarCollapse collapseData={menuItem} open={open} />
                  </React.Fragment>
                );
              } else {
                // hover list item to show children and hide children when mouse leaves
                return (
                  <Tooltip
                    placement='right'
                    key={index}
                    arrow
                    title={
                      <>
                        {menuItem.children.map((childMenuItem, index) => (
                          <ListItem
                            key={index}
                            disablePadding
                            sx={{ display: 'block' }}
                          >
                            <ListItemButton
                              {...{
                                component: Link,
                                to: childMenuItem.path,
                                sx: {
                                  display: 'flex',
                                  justifyContent: 'start',
                                  alignItems: 'start',
                                },
                              }}
                            >
                              <ListItemIcon
                                sx={{ color: 'inherit', mr: 'auto' }}
                              >
                                {childMenuItem.icon}
                              </ListItemIcon>
                              <ListItemText primary={childMenuItem.label} />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </>
                    }
                  >
                    <ListItem
                      key={`${menuItem.id}-${index}`}
                      disablePadding
                      sx={{ display: 'block' }}
                    >
                      <ListItemButton
                        {...{
                          component: Link,
                          to: menuItem.path,
                          sx: {
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : 'auto',
                            justifyContent: 'center',
                          }}
                        >
                          {menuItem.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={menuItem.label}
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Tooltip>
                );
              }
            }
            return (
              <ListItem
                key={`${menuItem.id}-${index}`}
                disablePadding
                sx={{ display: 'block' }}
              >
                <ListItemButton
                  {...{
                    component: Link,
                    to: menuItem.path,
                    sx: {
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {menuItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={menuItem.label}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component='main'
        bgcolor='rgb(245, 245, 245)'
        sx={{ flexGrow: 1, p: 3, minHeight: '100vh', pt: 10 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;
