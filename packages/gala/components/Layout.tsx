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
  EmojiEvents,
  FoodBank,
  Gavel,
  Group,
  Menu,
  Tv,
  ViewDay,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { useSyncedStore } from '@syncedstore/react';
import { store } from '../lib/store';

const drawerWidth = 240;

type MenuItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type Menu = Record<string, MenuItem>;

export const menuAdmin = (uuid: string): Menu => ({
  info: {
    href: `/gala/${uuid}`,
    label: 'Général',
    icon: <EmojiEvents />,
  },
  teams: {
    href: `/gala/${uuid}/teams`,
    label: 'Équipes',
    icon: <Group />,
  },
  categories: {
    href: `/gala/${uuid}/categories`,
    label: 'Catégories',
    icon: <Category />,
  },
  judges: {
    href: `/gala/${uuid}/judges`,
    label: 'Juges',
    icon: <Gavel />,
  },
  progress: {
    href: `/gala/${uuid}/progress`,
    label: 'Déroulement',
    icon: <ViewDay />,
  },
  'screens-1': {
    href: `/gala/${uuid}/screens/1`,
    label: 'Screen 1',
    icon: <Tv />,
  },
  'screens-2': {
    href: `/gala/${uuid}/screens/2`,
    label: 'Screen 2',
    icon: <Tv />,
  },
  'screens-bar': {
    href: `/gala/${uuid}/screens/bar`,
    label: 'Buvette',
    icon: <FoodBank />,
  },
});

export const menuVisitor = (uuid: string): Menu => ({
  home: {
    href: `/public/${uuid}`,
    label: 'Plateaux',
    icon: <ViewDay />,
  },
  bar: {
    href: `/public/${uuid}/bar`,
    label: 'Buvette',
    icon: <FoodBank />,
  },
});

type LayoutInfoAdmin = {
  menu: 'admin';
  selected: keyof ReturnType<typeof menuAdmin>;
  uuid: string;
};

type LayoutInfoVisitor = {
  menu: 'visitor';
  selected: keyof ReturnType<typeof menuVisitor>;
  uuid: string;
};

export type LayoutInfo = LayoutInfoAdmin | LayoutInfoVisitor;

function getMenu(layoutInfo: LayoutInfo): Menu {
  switch (layoutInfo.menu) {
    case 'admin':
      return menuAdmin(layoutInfo.uuid);
    case 'visitor':
      return menuVisitor(layoutInfo.uuid);
  }
}

export default function Layout({
  children,
  layoutInfo,
}: {
  children: React.ReactNode;
  layoutInfo?: LayoutInfo;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { info } = useSyncedStore(store);

  if (layoutInfo === undefined) {
    return <>{children}</>;
  }

  const menu = getMenu(layoutInfo);

  const drawer = (
    <>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {Object.entries(menu).map(([key, { label, icon, href }]) => (
            <ListItem key={label} disablePadding>
              <Link href={href} legacyBehavior>
                <ListItemButton
                  selected={key === layoutInfo.selected}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </Link>
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
            {!info.galaName ? "GALA sans nom" : info.galaName}
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
