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
  ViewDay,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

const drawerWidth = 240;

export const menuAdmin = {
  '/x4Hz8/teams': {
    label: 'Équipes',
    icon: <Group />,
  },
  '/x4Hz8/categories': {
    label: 'Catégories',
    icon: <Category />,
  },
  '/x4Hz8/judges': {
    label: 'Juges',
    icon: <Gavel />,
  },
  '/x4Hz8/progress': {
    label: 'Déroulement',
    icon: <ViewDay />,
  },
  '/screens/1': {
    label: 'Screen 1',
    icon: <Tv />,
  },
  '/screens/2': {
    label: 'Screen 2',
    icon: <Tv />,
  },
  '/screens/bar': {
    label: 'Buvette',
    icon: <FoodBank />,
  },
};

export const menuVisitor = {
  '/': {
    label: 'Plateaux',
    icon: <ViewDay />,
  },
  '/bar': {
    label: 'Buvette',
    icon: <FoodBank />,
  },
};

type Menu = typeof menuAdmin | typeof menuVisitor;

export interface LayoutInfo<T = Menu> {
  menu: T,
  menuItemHref: keyof T;
};

export function getLayoutInfo<T = Menu>(menu: T, href: keyof T): LayoutInfo<T> {
  return {
    menu,
    menuItemHref: href,
  }
}

export default function Layout({ children, layoutInfo }: { children: React.ReactNode, layoutInfo?: LayoutInfo }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  if (layoutInfo === undefined) {
    return <>{children}</>;
  }

  const { menu, menuItemHref } = layoutInfo;

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {Object.entries(menu).map(([href, { label, icon }]) => (
            <ListItem key={label} disablePadding>
              <ListItemButton selected={href === menuItemHref} href={href}>
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
