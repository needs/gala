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
  Logout,
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
  Avatar,
  Divider,
  IconButton,
  Menu as MenuList,
  MenuItem as MenuListItem,
  Stack,
  Tooltip,
} from '@mui/material';
import Link from 'next/link';
import { undoManager, useGala } from '../lib/store';
import { avatarUrl, getUserName } from '../lib/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/router';
import { useCookies } from 'react-cookie';
import { trpc } from '../utils/trpc';

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
      href: `/gala/${uuid}`,
      label: 'Général',
      icon: <EmojiEvents />,
    },
    teams: {
      href: `/gala/${uuid}/registrations`,
      label: 'Inscriptions',
      icon: <Group />,
    },
    stages: {
      href: `/gala/${uuid}/stages`,
      label: 'Plateaux',
      icon: <Villa />,
    },
    timeline: {
      href: `/gala/${uuid}/timeline`,
      label: 'Échéancier',
      icon: <EventNote />,
    },
    progress: {
      href: `/gala/${uuid}/progress`,
      label: 'Déroulement',
      icon: <Schedule />,
    },
  },
  {
    bar: {
      href: `/gala/${uuid}/bar`,
      label: 'Buvette',
      icon: <SportsBar />,
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
      label: 'Buvette (bis)',
      icon: <FoodBank />,
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

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const [cookies, setCookies, removeCookies] = useCookies(['session']);

  const { data: user } = trpc.user.useQuery(null);

  if (user === undefined) {
    return null;
  }

  const name = getUserName(user.email, user.name);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Mon compte">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl(name)} />
          </IconButton>
        </Tooltip>
      </Box>
      <MenuList
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            width: 200,
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href="/account" legacyBehavior>
        <MenuListItem onClick={handleClose}>
          <Avatar /> Profil
        </MenuListItem>
        </Link>
        <Link href="/" legacyBehavior>
          <MenuListItem onClick={handleClose}>
            <Avatar /> GALAs
          </MenuListItem>
        </Link>
        <Divider />
        <MenuListItem
          onClick={() => {
            removeCookies('session');
            signOut(auth).then(() => {
              router.push('/login');
            });
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Déconnexion
        </MenuListItem>
      </MenuList>
    </>
  );
}

export default function Layout({
  children,
  layoutInfo,
}: {
  children: React.ReactNode;
  layoutInfo?: LayoutInfo;
}) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { info } = useGala();

  if (layoutInfo === undefined) {
    return <>{children}</>;
  }

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
            {!info.galaName ? 'GALA sans nom' : info.galaName}
          </Typography>
          <Tooltip title="Annuler">
            <IconButton
              color="inherit"
              onClick={() => {
                undoManager.undo();
              }}
              disabled={!undoManager.canUndo()}
            >
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refaire">
            <IconButton
              color="inherit"
              onClick={() => {
                undoManager.redo();
              }}
              disabled={!undoManager.canRedo()}
            >
              <Redo />
            </IconButton>
          </Tooltip>
          <AccountMenu />
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
