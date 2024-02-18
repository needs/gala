import { Avatar, AvatarGroup } from '@mui/material';
import { useAwareness } from './StoreProvider';
import { avatarUrl } from '../lib/avatar';

const maxAvatars = 3;

export default function AwarenessAvatars() {
  const awareness = useAwareness();

  return (
    awareness !== undefined && (
      <AvatarGroup
        max={maxAvatars}
        total={awareness.states.length}
        sx={{
          '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 15 },
        }}
      >
        {awareness.states.slice(0, maxAvatars).map((state) => (
          <Avatar
            key={state.clientId}
            src={avatarUrl(state.user?.name ?? "Anonymous")}
            sx={{ width: 24, height: 24 }}
          />
        ))}
      </AvatarGroup>
    )
  );
}
