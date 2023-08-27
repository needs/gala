import { useSyncedStore } from '@syncedstore/react';
import { withAuthGala } from '../../../lib/auth';
import { BarCategory, barDefault, store } from '../../../lib/store';
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
import { Add, ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty, sortBy } from 'lodash';

function CurrencyField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [innerValue, setInnerValue] = useState('');
  const [error, setError] = useState(false);

  const toEuro = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      useGrouping: false,
    }).format(value);
  };

  useEffect(() => {
    setInnerValue(toEuro(value));
  }, [value]);

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
          setInnerValue(toEuro(newValue));
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

  const swapCategories = (index1: number, index2: number) => {
    for (const category of Object.values(bar)) {
      if (category?.order === index1) {
        category.order = index2;
      } else if (category?.order === index2) {
        category.order = index1;
      }
    }
  };

  const swapItems = (category: BarCategory, index1: number, index2: number) => {
    for (const item of Object.values(category.items)) {
      if (item?.order === index1) {
        item.order = index2;
      } else if (item?.order === index2) {
        item.order = index1;
      }
    }
  };

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
          {isEmpty(bar) && (
            <Button
              variant="outlined"
              onClick={() => {
                Object.assign(bar, barDefault);
              }}
            >
              {"Buvette d'exemple"}
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              bar[uuidv4()] = {
                name: '',
                items: {},
                order: Object.keys(bar).length,
              };
            }}
          >
            Catégorie
          </Button>
        </Stack>
      </Stack>
      {bar !== undefined &&
        sortBy(
          Object.entries(bar),
          ([categoryKey, category]) => category?.order
        ).map(
          ([categoryKey, category], index) =>
            category !== undefined && (
              <Paper
                key={categoryKey}
                sx={{ overflow: 'hidden' }}
                elevation={1}
              >
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
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => {
                          category.items[uuidv4()] = {
                            name: '',
                            price: 1.0,
                            order: Object.keys(category.items).length,
                          };
                        }}
                      >
                        Article
                      </Button>

                      <IconButton
                        onClick={() => {
                          swapCategories(index, index + 1);
                        }}
                        disabled={index === Object.keys(bar).length - 1}
                      >
                        <ArrowDownward />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          swapCategories(index, index - 1);
                        }}
                        disabled={index === 0}
                      >
                        <ArrowUpward />
                      </IconButton>

                      <Tooltip title="Doubler cliquez pour supprimer">
                        <span>
                          <IconButton
                            onDoubleClick={() => {
                              delete bar[categoryKey];
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
                    {category.items !== undefined &&
                      sortBy(
                        Object.entries(category.items),
                        ([itemKey, item]) => item?.order
                      ).map(([itemKey, item], index) => (
                        <Stack
                          key={itemKey}
                          direction="row"
                          gap={2}
                          padding={2}
                          divider={<Divider orientation="vertical" flexItem />}
                          sx={{
                            '&:nth-of-type(odd)': {
                              backgroundColor: (theme) =>
                                theme.palette.grey[50],
                            },
                          }}
                        >
                          <Stack direction="row" gap={1}>
                            <IconButton
                              onClick={() => {
                                swapItems(category, index, index + 1);
                              }}
                              disabled={
                                index === Object.keys(category.items).length - 1
                              }
                            >
                              <ArrowDownward />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                swapItems(category, index, index - 1);
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
                                  delete category.items[itemKey];
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
            )
        )}
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('bar');
