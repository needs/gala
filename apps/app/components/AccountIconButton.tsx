import { useRouter } from 'next/router';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { trpc } from '../utils/trpc';
import { avatarUrl, getUserName } from '../lib/avatar';
import {
  Avatar,
  Box,
  Tooltip,
  MenuItem as MenuListItem,
  Menu as MenuList,
  Divider,
  ListItemIcon,
  Chip,
} from '@mui/material';
import Link from 'next/link';
import { EmojiEvents, Logout } from '@mui/icons-material';
import { getFirebaseAppAuth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export default function AccountIconButton() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const router = useRouter();
  const removeCookies = useCookies(['session'])[2];

  const { data: user } = trpc.user.useQuery(null);

  if (user === undefined) {
    return null;
  }

  const name = getUserName(user.email, user.name);

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Mon compte">
          <Chip
            label={name}
            avatar={
              <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl(name)} />
            }
            onClick={handleClick}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          />
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
            <Avatar>
              <EmojiEvents />
            </Avatar>{' '}
            Compétitions
          </MenuListItem>
        </Link>
        <Divider />
        <MenuListItem
          onClick={() => {
            const auth = getFirebaseAppAuth();
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
