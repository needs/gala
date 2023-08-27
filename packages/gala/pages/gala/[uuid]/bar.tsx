import { useSyncedStore } from '@syncedstore/react';
import { withAuthGala } from '../../../lib/auth';
import { barDefault, store } from '../../../lib/store';
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
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
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" component="h1">
          Buvette
        </Typography>
        <Stack direction="row" gap={2}>
          <Button
            variant="outlined"
            onClick={() => {
              bar.splice(0, bar.length, ...barDefault);
            }}
          >
            Example
          </Button>
          <Button variant="contained">Ajouter catégorie</Button>
        </Stack>
      </Stack>
      {bar.map((category, index) => (
        <Paper key={index} sx={{ overflow: 'hidden' }} elevation={1}>
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
                value={category.name}
                onChange={(event) => {
                  category.name = event.target.value;
                }}
                label="Catégorie"
                sx={{ width: 500 }}
              />
              <Stack direction="row" gap={1} alignItems="center">
                <IconButton
                  onClick={() => {
                    const category = bar.splice(index, 1);
                    bar.splice(index + 1, 0, ...category);
                  }}
                  disabled={index === bar.length - 1}
                >
                  <ArrowDownward />
                </IconButton>
                <IconButton
                  onClick={() => {
                    const category = bar.splice(index, 1);
                    bar.splice(index - 1, 0, ...category);
                  }}
                  disabled={index === 0}
                >
                  <ArrowUpward />
                </IconButton>

                <Tooltip title="Doubler cliquez pour supprimer">
                  <span>
                    <IconButton
                      onDoubleClick={() => {
                        bar.splice(index, 1);
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
              {category.items !== undefined && category.items.map((item, index) => (
                <Stack
                  key={index}
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
                      disabled={index === category.items.length - 1}
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
                      value={item.name}
                      onChange={(event) => {
                        item.name = event.target.value;
                      }}
                      label="Nom"
                      sx={{ width: 360 }}
                      size="small"
                    />
                    <Stack direction="row" gap={2} flexGrow={1}>
                      <CurrencyField
                        key={index}
                        value={item.price}
                        onChange={(value) => {
                          item.price = value;
                        }}
                      />
                    </Stack>
                  </Stack>
                  <Tooltip title="Doubler cliquez pour supprimer">
                    <span>
                      <IconButton
                        onDoubleClick={() => {
                          category.items.splice(index, 1);
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
