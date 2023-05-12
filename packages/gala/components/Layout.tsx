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
import { Category, Gavel, Group, ViewAgenda, ViewDay } from '@mui/icons-material';
import { useRouter } from 'next/router';

const drawerWidth = 240;

const menu = [
  {
    label: 'Équipes',
    href: '/teams',
    icon: <Group />,
  },
  {
    label: 'Catégories',
    href: '/categories',
    icon: <Category />,
  },
  {
    label: 'Juges',
    href: '/judges',
    icon: <Gavel />,
  },
  {
    label: 'Déroulement',
    href: '/progress',
    icon: <ViewDay />
  }
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            GALA de l&apos;Arbresle
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menu.map(({label, href, icon}) => (
              <ListItem key={label} disablePadding>
                <ListItemButton selected={href === router.asPath} href={href}>
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        { children }
      </Box>
    </Box>
  );
}
