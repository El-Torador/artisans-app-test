import { Box, Button, Checkbox, Drawer, FormControlLabel, Stack, TextField, Typography } from '@mui/material';
import { FormEvent, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProductType } from '../../types';
import { selectProducts, updateProduct } from '../../features/productSlice';
import { AppDispatch } from '../../store';
import { LoadingButton } from '@mui/lab';

function EditProduct({ product }: { product: ProductType }) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const { loading } = useSelector(selectProducts);

  const _toggleDrawer = useCallback(() => {
    setOpen((s) => !s);
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const p: ProductType = {
        _id: product._id,
        name: data.get('name').toString(),
        type: data.get('type').toString(),
        price: +data.get('price').toString(),
        rating: +data.get('rating').toString(),
        warranty_years: +data.get('warranty_years').toString(),
        available: !!data.get('available')
      };

      void dispatch(updateProduct({ product: p }));
    },
    [dispatch, product._id]
  );

  return (
    <>
      <Button fullWidth onClick={_toggleDrawer}>
        Editer
      </Button>
      <Drawer anchor="right" open={open}>
        <Box component="form" onSubmit={handleSubmit} width={350} padding={5}>
          <Typography variant="h6" component="h6" fontWeight="bold">
            Edition du produit {product.name}
          </Typography>
          <Stack gap={2} marginTop={5}>
            <TextField
              defaultValue={product.name}
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Nom du produit"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              defaultValue={product.type}
              margin="dense"
              id="type"
              name="type"
              label="Type du produit"
              type="text"
              fullWidth
              variant="standard"
              required
            />
            <TextField
              defaultValue={product.price}
              margin="dense"
              id="price"
              name="price"
              label="Prix du produit"
              inputProps={{ inputMode: 'decimal' }}
              fullWidth
              variant="standard"
              required
            />
            <TextField
              defaultValue={product.rating}
              margin="dense"
              id="rating"
              name="rating"
              label="Note du produit"
              inputProps={{ inputMode: 'numeric', pattern: '[0-5]*' }}
              fullWidth
              required
              variant="standard"
            />
            <TextField
              defaultValue={product.warranty_years}
              margin="dense"
              id="warranty_years"
              name="warranty_years"
              label="Garantie en année"
              type="number"
              fullWidth
              required
              variant="standard"
            />
            <FormControlLabel
              name="available"
              control={<Checkbox defaultChecked={product.available} />}
              label="Disponible ?"
            />

            <Stack direction="row">
              <LoadingButton fullWidth loading={false} type="submit" variant="contained">
                Enregistrer
              </LoadingButton>
              <Button fullWidth disabled={loading} onClick={_toggleDrawer} color="error">
                Annuler
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}

export default EditProduct;
