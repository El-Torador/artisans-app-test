import { Alert, Box, Container, Snackbar } from '@mui/material';

import Header from '../components/Header';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useCallback } from 'react';
import { closeSnackBar, selectProducts } from '../features/productSlice';
import { useSelector } from 'react-redux';
import { ProductStatus } from '../types';
import { getTypeAlert } from '../utils';
import ConfirmGlobal from '../components/Confirm/ConfirmGlobal';
import { useAccount } from '../hooks/useAccount';

export default function SecureLayout({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch<AppDispatch>();
  const { account } = useAccount();

  const { status, message } = useSelector(selectProducts);
  const handleClose = useCallback(() => {
    void dispatch(closeSnackBar());
  }, [dispatch]);

  if (!account) {
    return null;
  }
  return (
    <Box flexGrow={1} style={{ backgroundColor: '#f8fafc' }} height="100vh">
      <Header />
      <Snackbar open={status !== ProductStatus.INIT} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={getTypeAlert(status)} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <ConfirmGlobal />
      <Container component="main">{children}</Container>
    </Box>
  );
}
