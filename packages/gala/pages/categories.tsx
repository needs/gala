import { ref, set, push, child } from 'firebase/database';
import {
  Category,
  categoriesSchema,
  database,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import {
  Button,
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
import { Add } from '@mui/icons-material';

const teamsRef = ref(database, 'teams');
const categoriesRef = ref(database, 'categories');

function CategoryButton({
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
        onValidate={onChange}
        category={category}
      />
      <Button variant="text">{`${category.name}`}</Button>
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
          onAdd(player);
          setOpen(false);
        }}
        category={{
          name: "",
          sex: "female",
          apparatuses: {},
        }}
      />
      <Button onClick={() => setOpen(true)}>
        <Add />
      </Button>
    </>
  );
}

export function Teams() {
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

  if (categories === undefined || teams === undefined) {
    return <p>Loading...</p>;
  }

  return (
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
                  {category.name}
                </TableCell>
                <TableCell>
                  {Object.values(teams).filter((team) => team.category === categoryKey).length} équipe(s)
                </TableCell>
                <TableCell>
                  <CategoryButton category={category} onChange={(category) => updateCategory(categoryKey, category)}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddCategoryButton onAdd={addCategory} />
    </Stack>
  );
}

export default Teams;
