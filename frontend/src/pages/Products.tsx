import { Alert, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { getProducts, productCreated, productDeleted, productUpdated, selectProducts } from '../features/productSlice';
import { useSelector } from 'react-redux';
import DisplayProduct from '../components/Product/DisplayProduct';
import AddProduct from '../components/Product/AddProduct';
import { AppDispatch } from '../store';
import Loader from '../components/Loader';
import { Socket, io } from 'socket.io-client';
import { ProductType } from '../types';

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const socket = useRef<Socket>(null);

  const { products, loading } = useSelector(selectProducts);

  useEffect(() => {
    void dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SOCKET_SERVER_URL as string);

    socket.current.on('connect', () => {
      console.log('Connected to server with id: ', socket.current.id);
    });

    socket.current.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    socket.current.on('productCreated', (product: ProductType) => {
      dispatch(productCreated(product));
    });

    socket.current.on('productUpdated', (product: ProductType) => {
      dispatch(productUpdated(product));
    });

    socket.current.on('productDeleted', (_id: string) => {
      dispatch(productDeleted(_id));
    });

    return () => {
      socket.current.disconnect();
    };
  }, [dispatch]);

  return (
    <Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" marginTop={10}>
        <Typography variant="h4" component="h4" fontWeight="bold">
          Produits
        </Typography>
        <Typography variant="h6" component="h6" color="gray">
          {products.length}
        </Typography>
        <AddProduct />
      </Stack>
      <Stack direction="row" alignItems="center" flexWrap="wrap" marginTop={3} gap={2}>
        {loading && products.length === 0 && <Loader />}
        {!loading && products.length > 0 && products.map((p) => <DisplayProduct key={p._id} {...p} />)}
        {!loading && products.length === 0 && (
          <Stack alignItems="center" justifyContent="center" width="100vh" height="50vh">
            <Alert severity="info">Aucun produit enregistré pour l'instant !</Alert>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
