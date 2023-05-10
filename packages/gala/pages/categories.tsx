import { ref, set, push, child, remove } from 'firebase/database';
import {
  Category,
  categoriesSchema,
  database,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
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
import EditCategoryDialog from '../components/EditCategoryDialog';
import { Delete, Edit } from '@mui/icons-material';
import Head from 'next/head';
import GenderAvatar from '../components/GenderAvatar';
import Loading from '../components/Loading';

const teamsRef = ref(database, 'teams');
const categoriesRef = ref(database, 'categories');

function EditCategoryButton({
  category,
  onChange,
}: {
  category: Category;
  onChange: (category: Category) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditCategoryDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(category) => {
          onChange(category);
          setOpen(false);
        }}
        category={category}
      />
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
    </>
  );
}

function AddCategoryButton({ onAdd }: { onAdd: (category: Category) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditCategoryDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(player) => {
          setOpen(false);
          onAdd(player);
        }}
        category={{
          name: '',
          gender: 'woman',
          apparatuses: {},
        }}
      />
      <Button variant="contained" onClick={() => setOpen(true)}>
        Ajouter
      </Button>
    </>
  );
}

export default function Categories() {
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);
  const teams = useDatabaseValue(teamsRef, teamsSchema);

  const addCategory = (category: Category) => {
    const newCategoryKey = push(categoriesRef).key;

    if (newCategoryKey === null) {
      throw new Error('newCategoryKey is null');
    }

    set(child(categoriesRef, newCategoryKey), category);
    return newCategoryKey;
  };

  const updateCategory = (categoryKey: string, category: Category) => {
    set(child(categoriesRef, categoryKey), category);
  };

  const deleteCategory = (categoryKey: string) => {
    remove(child(categoriesRef, categoryKey));
  };

  if (categories === undefined || teams === undefined) {
    return <Loading />;
  }

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
              {Object.entries(categories).map(([categoryKey, category]) => (
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
                        (team) => team.category === categoryKey
                      ).length
                    }{' '}
                    équipe(s)
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={1}>
                      <EditCategoryButton
                        category={category}
                        onChange={(category) =>
                          updateCategory(categoryKey, category)
                        }
                      />
                      <IconButton
                        onDoubleClick={() => deleteCategory(categoryKey)}
                        sx={{ color: 'lightcoral' }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddCategoryButton onAdd={addCategory} />
      </Stack>
    </>
  );
}
