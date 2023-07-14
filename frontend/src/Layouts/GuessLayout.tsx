import { Alert, Snackbar } from '@mui/material';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { resetError, selectAccount } from '../features/accountSlice';

export default function GuessLayout({ children }: { children: JSX.Element }) {
  const dispatch = useDispatch<AppDispatch>();

  const { error } = useSelector(selectAccount);
  const handleClose = useCallback(() => {
    void dispatch(resetError());
  }, [dispatch]);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={!!error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      {children}
    </>
  );
}
