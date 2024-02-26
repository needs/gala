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
  Close,
  EmojiEvents,
  EventNote,
  FoodBank,
  Group,
  Home,
  Menu as MenuIcon,
  Redo,
  Schedule,
  SportsBar,
  Tv,
  Undo,
  Villa,
} from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Collapse,
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
import { trpc } from '../utils/trpc';
import LoginButton from './LoginButton';
import { Role } from '@prisma/client';

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
      label: 'Accueil',
      icon: <Home />,
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
  competitionUuid,
}: {
  children: React.ReactNode;
  layoutInfo: LayoutInfo;
  competitionUuid?: string;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isReadOnlyBannerOpen, setIsReadOnlyBannerOpen] = React.useState(true);
  const { info } = useCompetition();
  const undoManager = useUndoManager();
  const { data: user } = trpc.user.useQuery({ competitionUuid });

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
          {layoutInfo.menu === 'admin' && (
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
                {user !== undefined && user.isAuthenticated ? (
                  <AccountIconButton />
                ) : (
                  <LoginButton />
                )}
              </Stack>
            </Stack>
          )}
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

        {user !== undefined && user.role === Role.READER && layoutInfo.menu === "admin" && (
          <Collapse in={isReadOnlyBannerOpen}>
            <Box paddingX={4} paddingTop={4}>
              <Alert
                variant="outlined"
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setIsReadOnlyBannerOpen(false);
                    }}
                  >
                    <Close fontSize="inherit" />
                  </IconButton>
                }
              >
                <AlertTitle>Lecture seule</AlertTitle>
                {user.isAuthenticated
                  ? "Vous n'avez pas les droits pour modifier cette compétition."
                  : "Vous n'êtes pas connecté."}
                {
                  'Vous pouvez consulter les informations, mais vous ne pouvez pas les modifier.'
                }
              </Alert>
            </Box>
          </Collapse>
        )}
        {children}
      </Box>
    </Box>
  );
}

export default function Layout({
  children,
  layoutInfo,
  competitionUuid,
}: {
  children: React.ReactNode;
  layoutInfo?: LayoutInfo;
  competitionUuid?: string;
}) {
  if (layoutInfo === undefined) {
    return <>{children}</>;
  } else {
    return (
      <AppLayout layoutInfo={layoutInfo} competitionUuid={competitionUuid}>
        {children}
      </AppLayout>
    );
  }
}
