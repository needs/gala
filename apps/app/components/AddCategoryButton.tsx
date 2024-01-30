import { useState } from 'react';
import { useCompetition } from './StoreProvider';
import EditCategoryDialog from './EditCategoryDialog';
import { Button, ButtonProps } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Add } from '@mui/icons-material';

export default function AddCategoryButton({
  onAddCategory,
  variant,
}: {
  onAddCategory?: (categoryKey: string) => void;
  variant?: ButtonProps['variant'];
}) {
  const [open, setOpen] = useState(false);
  const { categories } = useCompetition();
  const [categoryKey, setCategoryKey] = useState<string | undefined>(undefined);
  const category =
    categoryKey !== undefined ? categories[categoryKey] : undefined;

  return (
    <>
      {category !== undefined && (
        <EditCategoryDialog
          open={open}
          onClose={() => {
            setOpen(false);
            if (onAddCategory !== undefined && categoryKey !== undefined) {
              onAddCategory(categoryKey);
            }
          }}
          category={category}
        />
      )}
      <Button
        variant={variant}
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
        startIcon={<Add />}
      >
        Catégorie
      </Button>
    </>
  );
}
