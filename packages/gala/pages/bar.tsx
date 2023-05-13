import { ref } from "firebase/database";
import Loading from "../components/Loading";
import { database, useDatabaseValue, barSchema } from "../lib/database";
import { Divider, Stack, Typography } from "@mui/material";

const barRef = ref(database, 'bar');

export default function Bar() {
  const bar = useDatabaseValue(barRef, barSchema);

  const toEuro = (value: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

  if (bar === undefined) {
    return <Loading />
  }

  return (
    <Stack direction="column" divider={<Divider />}>
      {Object.entries(bar).map(([category, items]) => (
        <Stack direction="column" gap={2} padding={4} key={category}>
          <Typography variant="h4" component="h2">{category}</Typography>
          {Object.entries(items).map(([item, prices]) => (
            <Stack direction="row" justifyContent="space-between" key={item}>
              <Typography variant="h5" component="h3">{item}</Typography>
              <Typography variant="h5" component="h3">
                {prices
                  .map((price) => (price === 0 ? 'Gratuit' : toEuro(price)))
                  .join(' / ')}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
