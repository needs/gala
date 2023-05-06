import { ref, set, push, child } from 'firebase/database';
import { z } from 'zod';
import {
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

const teamsRef = ref(database, 'teams');
const categoriesRef = ref(database, 'categories');

export function Teams() {
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);
  const teams = useDatabaseValue(teamsRef, teamsSchema);

  const addRandomCategory = () => {
    const newCategoryKey = push(categoriesRef).key;

    if (newCategoryKey === null) {
      throw new Error('newCategoryKey is null');
    }

    const newCategory: z.infer<typeof categoriesSchema>[string] = {
      name: 'Category ' + newCategoryKey,
      sex: "female",
      apparatuses: {
      },
    };

    set(child(categoriesRef, newCategoryKey), newCategory);

    return newCategoryKey;
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
            {Object.entries(categories).map(([uuid, category]) => (
              <TableRow
                key={uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell>
                  {Object.values(teams).filter((team) => team.category === uuid).length} équipe(s)
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={addRandomCategory}>
        Ajouter
      </Button>
    </Stack>
  );
}

export default Teams;
