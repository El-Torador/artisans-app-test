import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  SpeedDialIcon,
  Stack,
  TextField
} from '@mui/material';
import React, { FormEvent, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';

import { ProductStatus, ProductType } from '../../types';
import { AppDispatch } from '../../store';
import { createProduct, selectProducts } from '../../features/productSlice';

function AddProduct() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, status } = useSelector(selectProducts);

  const handleClickOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (status === ProductStatus.CREATED) setOpen(false);
  }, [status]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      const product: ProductType = {
        name: data.get('name').toString(),
        type: data.get('type').toString(),
        price: +data.get('price').toString(),
        rating: +data.get('rating').toString(),
        warranty_years: +data.get('warranty_years').toString(),
        available: !!data.get('available')
      };

      void dispatch(createProduct({ product }));
    },
    [dispatch]
  );
  return (
    <>
      <Button
        title="Ajouter un produit"
        sx={{ position: 'absolute', bottom: 70, right: 70, borderRadius: '999px', padding: '30px' }}
        variant="contained"
        onClick={handleClickOpen}
      >
        <SpeedDialIcon />
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>Ajouter un Produit</DialogTitle>
          <DialogContent style={{ minWidth: 500 }}>
            <Stack direction="row" gap={2}>
              <TextField
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
                margin="dense"
                id="type"
                name="type"
                label="Type du produit"
                type="text"
                fullWidth
                variant="standard"
                required
              />
            </Stack>
            <Stack direction="row" gap={2}>
              <TextField
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
                margin="dense"
                id="warranty_years"
                name="warranty_years"
                label="Garantie en année"
                type="number"
                fullWidth
                required
                variant="standard"
              />
            </Stack>
            <FormControlLabel name="available" control={<Checkbox />} label="Disponible ?" />
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} color="error" onClick={handleClose}>
              Fermer
            </Button>
            <LoadingButton loading={loading} type="submit">
              Enregistrer
            </LoadingButton>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}

export default AddProduct;
