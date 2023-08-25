import {
  Button,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import EditCategoryDialog from '../../../components/EditCategoryDialog';
import { Delete, Edit } from '@mui/icons-material';
import Head from 'next/head';
import GenderAvatar from '../../../components/GenderAvatar';
import { useSyncedStore } from '@syncedstore/react';
import { Category, store } from '../../../lib/store';
import { v4 as uuidv4 } from 'uuid';
import { withAuthGala } from '../../../lib/auth';

function EditCategoryButton({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditCategoryDialog
        open={open}
        onClose={() => setOpen(false)}
        category={category}
      />
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
    </>
  );
}

function AddCategoryButton() {
  const [open, setOpen] = useState(false);
  const { categories } = useSyncedStore(store);
  const [categoryKey, setCategoryKey] = useState<string | undefined>(undefined);
  const category =
    categoryKey !== undefined ? categories[categoryKey] : undefined;

  return (
    <>
      {category !== undefined && (
        <EditCategoryDialog
          open={open}
          onClose={() => setOpen(false)}
          category={category}
        />
      )}
      <Button
        variant="contained"
        onClick={() => {
          const categoryKey = uuidv4();
          categories[categoryKey] = {
            name: '',
            gender: 'woman',
            apparatuses: {},
          };
          setCategoryKey(categoryKey);
          setOpen(true);
        }}
      >
        Ajouter
      </Button>
    </>
  );
}

export default function Categories() {
  const { categories, teams } = useSyncedStore(store);

  const deleteCategory = (categoryKey: string) => {
    delete categories[categoryKey];
  };

  return (
    <>
      <Head>
        <title>Catégories</title>
      </Head>
      <Stack padding={2} gap={2}>
        <Typography variant="h1">Catégories</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              {Object.entries(categories).map(
                ([categoryKey, category]) =>
                  category !== undefined && (
                    <TableRow
                      key={categoryKey}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <GenderAvatar gender={category.gender} />
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {category.name}
                      </TableCell>
                      <TableCell>
                        {
                          Object.values(teams).filter(
                            (team) =>
                              team !== undefined &&
                              team.categoryKey === categoryKey
                          ).length
                        }{' '}
                        équipe(s)
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" gap={1}>
                          <EditCategoryButton category={category} />
                          <IconButton
                            onDoubleClick={() => deleteCategory(categoryKey)}
                            sx={{ color: 'lightcoral' }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <AddCategoryButton />
      </Stack>
    </>
  );
}

export const getServerSideProps = withAuthGala("categories");
