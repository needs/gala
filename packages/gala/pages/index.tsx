import { Stack } from '@mui/material';
import Link from 'next/link';

export function Index() {
  return (
    <Stack>
      <Link href="/teams">Teams</Link>
      <Link href="/categories">Catégories</Link>
    </Stack>
  );
}

export default Index;
