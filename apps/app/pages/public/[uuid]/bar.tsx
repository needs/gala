import { Divider, Stack, Typography } from '@mui/material';
import { barDefault } from '../../../lib/store';
import { GetServerSideProps } from 'next';
import { PageProps } from '../../_app';

export default function Bar() {
  const bar = barDefault;

  const toEuro = (value: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  return (
    <Stack direction="column" divider={<Divider />}>
      {Object.entries(bar).map(([categoryKey, category]) => (
        <Stack direction="column" gap={2} padding={4} key={categoryKey}>
          <Typography variant="h4" component="h2">
            {category.name}
          </Typography>
          {Object.entries(category.items).map(([itemKey, item]) => (
            <Stack direction="row" justifyContent="space-between" key={itemKey}>
              <Typography variant="h5" component="h3">
                {item.name}
              </Typography>
              <Typography variant="h5" component="h3">
                {item.price === 0 ? 'Gratuit' : toEuro(item.price)}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const competitionUuid = context.query.uuid as string;
  return {
    props: {
      competitionUuid: competitionUuid,

      layoutInfo: {
        menu: 'visitor',
        selected: 'bar',
        uuid: competitionUuid,
      },
    },
  };
};
