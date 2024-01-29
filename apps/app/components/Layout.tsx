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
  EmojiEvents,
  EventNote,
  FoodBank,
  Group,
  Menu as MenuIcon,
  Redo,
  Schedule,
  SportsBar,
  Tv,
  Undo,
  ViewDay,
  Villa,
} from '@mui/icons-material';
import {
  Divider,
  IconButton,
  Menu as MenuList,
  MenuItem as MenuListItem,
  Stack,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import { useCompetition, useUndoManager } from './StoreProvider';
import AccountIconButton from './AccountIconButton';
import AwarenessAvatars from './AwarenessAvatars';

const drawerWidth = 240;

type MenuListItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

type MenuList = Record<string, MenuListItem>;
type Menu = MenuList[];

export const menuAdmin = (uuid: string): Menu => [
  {
    info: {
      href: `/competition/${uuid}`,
      label: 'Général',
      icon: <EmojiEvents />,
    },
    teams: {
      href: `/competition/${uuid}/registrations`,
      label: 'Inscriptions',
      icon: <Group />,
    },
    stages: {
      href: `/competition/${uuid}/stages`,
      label: 'Plateaux',
      icon: <Villa />,
    },
    timeline: {
      href: `/competition/${uuid}/timeline`,
      label: 'Échéancier',
      icon: <EventNote />,
    },
    progress: {
      href: `/competition/${uuid}/progress`,
      label: 'Déroulement',
      icon: <Schedule />,
    },
  },
  {
    bar: {
      href: `/competition/${uuid}/bar`,
      label: 'Buvette',
      icon: <SportsBar />,
    },
    screens: {
      href: `/competition/${uuid}/screens`,
      label: 'Écrans',
      icon: <Tv />,
    },
  },
];

export const menuVisitor = (uuid: string): Menu => [
  {
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
  },
];

type LayoutInfoAdmin = {
  menu: 'admin';
  selected: keyof ReturnType<typeof menuAdmin>[number];
  uuid: string;
};

type LayoutInfoVisitor = {
  menu: 'visitor';
  selected: keyof ReturnType<typeof menuVisitor>[number];
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

function AppLayout({
  children,
  layoutInfo,
}: {
  children: React.ReactNode;
  layoutInfo: LayoutInfo;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { info } = useCompetition();
  const undoManager = useUndoManager();

  const menu = getMenu(layoutInfo);

  const drawer = (
    <>
      <Toolbar />
      <Stack sx={{ overflow: 'auto' }} divider={<Divider />}>
        {menu.map((menuList, index) => (
          <List key={index}>
            {Object.entries(menuList).map(([key, { label, icon, href }]) => (
              <ListItem key={label} disablePadding>
                <Link href={href} legacyBehavior>
                  <ListItemButton selected={key === layoutInfo.selected}>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={label} />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        ))}
      </Stack>
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
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundImage: 'url("/background.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {!info.name ? 'Compétition sans nom' : info.name}
          </Typography>
          <Stack direction="row" gap={2} alignItems="center">
            <AwarenessAvatars />
            <Stack direction="row" bgcolor="#ffffffaa" borderRadius={999}>
              <Tooltip title="Annuler">
                <span>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      undoManager.undo();
                    }}
                    disabled={!undoManager.canUndo()}
                  >
                    <Undo />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Refaire">
                <span>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      undoManager.redo();
                    }}
                    disabled={!undoManager.canRedo()}
                  >
                    <Redo />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            <Stack
              direction="row"
              bgcolor="#ffffffaa"
              borderRadius={999}
              p={0.5}
            >
              <AccountIconButton />
            </Stack>
          </Stack>
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

export default function Layout({
  children,
  layoutInfo,
}: {
  children: React.ReactNode;
  layoutInfo?: LayoutInfo;
}) {
  if (layoutInfo === undefined) {
    return <>{children}</>;
  } else {
    return <AppLayout layoutInfo={layoutInfo}>{children}</AppLayout>;
  }
}
