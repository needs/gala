import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {
  Category,
  FoodBank,
  Gavel,
  Group,
  Menu,
  Tv,
  ViewAgenda,
  ViewDay,
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { IconButton } from '@mui/material';

const drawerWidth = 240;

const menu = [
  {
    label: 'Équipes',
    href: '/teams',
    icon: <Group />,
    showLayout: true,
  },
  {
    label: 'Catégories',
    href: '/categories',
    icon: <Category />,
    showLayout: true,
  },
  {
    label: 'Juges',
    href: '/judges',
    icon: <Gavel />,
    showLayout: true,
  },
  {
    label: 'Déroulement',
    href: '/progress',
    icon: <ViewDay />,
    showLayout: true,
  },
  {
    label: 'Screen 1',
    href: '/screens/1',
    icon: <Tv />,
    showLayout: false,
  },
  {
    label: 'Screen 2',
    href: '/screens/2',
    icon: <Tv />,
    showLayout: false,
  },
  {
    label: 'Buvette',
    href: '/screens/bar',
    icon: <FoodBank />,
    showLayout: false,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItem = menu.find(({ href }) => href === router.asPath);

  if (menuItem !== undefined && !menuItem.showLayout) {
    return <>{children}</>;
  }

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menu.map(({ label, href, icon }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton selected={href === router.asPath} href={href}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  );

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const container = undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            GALA de l&apos;Arbresle
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
