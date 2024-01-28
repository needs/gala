import { Avatar, AvatarGroup } from '@mui/material';
import { useAwareness } from './StoreProvider';
import { avatarUrl } from '../lib/avatar';

export default function AwarenessAvatars() {
  const awareness = useAwareness();

  console.log(awareness);

  return (
    <AvatarGroup max={4}>
      {awareness.states.map((state) => (
        <Avatar
          key={state.clientId}
          src={avatarUrl(state.user.name)}
          sx={{ width: 24, height: 24 }}
        />
      ))}
    </AvatarGroup>
  );
}
