import { Divider, Stack, Typography } from "@mui/material";
import { barDefault } from "../../../lib/store";
import { GetServerSideProps } from "next";
import { PageProps } from "../../_app";

export default function Bar() {
  const bar = barDefault;

  const toEuro = (value: number) =>
    new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);

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

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const galaUuid = context.query.uuid as string;
  return {
    props: {
      galaUuid,

      layoutInfo: {
        menu: "visitor",
        selected: "bar",
        uuid: galaUuid,
      }
    },
  };
};
