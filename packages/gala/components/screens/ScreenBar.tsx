import { Box, CssBaseline, Stack, Typography } from '@mui/material';
import { ScreenBar, useGala } from '../../lib/store';
import { useEffect, useRef, useState } from 'react';
import * as Muicon from '@mui/icons-material';
import { sortBy } from 'lodash';

export default function ScreenBar({ screen }: { screen: ScreenBar }) {
  const { bar } = useGala();

  const [scrollIndex, setScrollIndex] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, Object.keys(bar).length);
  }, [bar]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((scrollIndex) => scrollIndex + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [refs.current.length, setScrollIndex]);

  useEffect(() => {
    refs.current[scrollIndex % refs.current.length]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }, [scrollIndex]);

  const renderIcon = (icon: keyof typeof Muicon) => {
    if (icon === undefined) {
      return null;
    } else {
      const Element = Muicon[icon];
      return <Element />;
    }
  };

  const toEuro = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      useGrouping: false,
    }).format(value);
  };

  return (
    <Box>
      <CssBaseline />
      <Stack
        minHeight="100vh"
        maxHeight="100vh"
        sx={{
          backgroundImage: 'url("/tv-background.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Stack
          gap={4}
          padding={4}
          flexGrow="1"
          alignItems="center"
          overflow="hidden"
        >
          {sortBy(Object.entries(bar), ([_, category]) => category.order).map(
            ([categoryKey, category], index) => {
              return (
                <Stack
                  key={categoryKey}
                  flexGrow="1"
                  bgcolor="#ffffff87"
                  borderRadius={8}
                  width="50vw"
                  minWidth={400}
                  ref={(el) => (refs.current[index] = el)}
                >
                  <Stack
                    direction="row"
                    gap={4}
                    alignItems="center"
                    padding={4}
                  >
                    {category.icon !== undefined && renderIcon(category.icon)}
                    <Typography variant="h2" fontWeight="bold">
                      {category.name}
                    </Typography>
                  </Stack>

                  <Stack bgcolor="white" borderRadius={8} padding={2}>
                    {Object.entries(category.items).map(([itemKey, item]) => {
                      return (
                        <Stack
                          key={itemKey}
                          direction="row"
                          gap={4}
                          alignItems="center"
                          justifyContent="space-between"
                          padding={2}
                        >
                          <Typography variant="h4">{item.name}</Typography>
                          <Typography variant="h4">{toEuro(item.price)} €</Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Stack>
              );
            }
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
