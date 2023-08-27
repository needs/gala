import { useSyncedStore } from '@syncedstore/react';
import { withAuthGala } from '../../../lib/auth';
import { store } from '../../../lib/store';
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';
import { useState } from 'react';

function CurrencyField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [innerValue, setInnerValue] = useState(value.toString());
  const [error, setError] = useState(false);

  return (
    <TextField
      size="small"
      label="Prix"
      value={innerValue}
      error={error}
      onChange={(event) => {
        setError(isNaN(Number(event.target.value)));
        setInnerValue(event.target.value);
      }}
      onBlur={(event) => {
        const newValue = Number(event.target.value);

        if (!isNaN(newValue)) {
          onChange(newValue);
        }
      }}
      sx={{ width: '12ch' }}
      InputProps={{
        inputProps: {
          style: {
            textAlign: 'right',
          },
        },
        endAdornment: <InputAdornment position="end">€</InputAdornment>,
      }}
    />
  );
}

export default function BarPage() {
  const { bar } = useSyncedStore(store);

  return (
    <Stack direction="column" padding={4} gap={4}>
      <Stack direction="row" gap={2}>
        <Button variant="contained">Ajouter catégorie</Button>
      </Stack>
      {Object.entries(bar).map(([categoryName, items], index) => (
        <Paper key={categoryName} sx={{ overflow: 'hidden' }} elevation={1}>
          <Stack direction="column" divider={<Divider />}>
            <Stack
              direction="row"
              gap={2}
              justifyContent="space-between"
              alignItems="center"
              padding={2}
              sx={{
                backgroundColor: '#f5f5f5',
              }}
            >
              <TextField
                variant="standard"
                value={categoryName}
                onChange={(event) => {
                  const newValue = event.target.value;

                  if (newValue !== categoryName) {
                    bar[newValue] = bar[categoryName];
                    delete bar[categoryName];
                  }
                }}
                label="Catégorie"
                sx={{ width: 500 }}
              />
              <Stack direction="row" gap={1} alignItems="center">
                <IconButton
                  onClick={() => {
                    console.log('down');
                  }}
                  disabled={index === Object.entries(bar).length - 1}
                >
                  <ArrowDownward />
                </IconButton>
                <IconButton
                  onClick={() => {
                    console.log('up');
                  }}
                  disabled={index === 0}
                >
                  <ArrowUpward />
                </IconButton>

                <Tooltip title="Doubler cliquez pour supprimer">
                  <span>
                    <IconButton
                      onDoubleClick={() => {
                        delete bar[categoryName];
                      }}
                      sx={{ color: 'lightcoral' }}
                    >
                      <Delete />
                    </IconButton>
                  </span>
                </Tooltip>
              </Stack>
            </Stack>

            <Stack direction="column">
              {items !== undefined &&
                Object.entries(items).map(([itemName, prices], index) => (
                  <Stack
                    key={itemName}
                    direction="row"
                    gap={2}
                    padding={2}
                    divider={<Divider orientation="vertical" flexItem />}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: (theme) => theme.palette.grey[50],
                      },
                    }}
                  >
                    <Stack direction="row" gap={1}>
                      <IconButton
                        onClick={() => {
                          console.log('down');
                        }}
                        disabled={index === Object.entries(items).length - 1}
                      >
                        <ArrowDownward />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          console.log('up');
                        }}
                        disabled={index === 0}
                      >
                        <ArrowUpward />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" gap={2} flexGrow={1}>
                      <TextField
                        value={itemName}
                        label="Nom"
                        sx={{ width: 360 }}
                        size="small"
                      />
                      <Stack direction="row" gap={2} flexGrow={1}>
                        {prices.map((price, index) => (
                          <CurrencyField
                            key={index}
                            value={price}
                            onChange={(value) => {
                              prices.splice(index, 1, value);
                            }}
                          />
                        ))}
                      </Stack>
                    </Stack>
                    <Tooltip title="Doubler cliquez pour supprimer">
                      <span>
                        <IconButton
                          onDoubleClick={() => {
                            const category = bar[categoryName];
                            if (category !== undefined) {
                              delete category[itemName];
                            }
                          }}
                          sx={{ color: 'lightcoral' }}
                        >
                          <Delete />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Stack>
                ))}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('bar');
