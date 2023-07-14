import { useCallback } from 'react';
import { LoadingButton } from '@mui/lab';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../store';
import { deleteProduct, selectProducts } from '../../features/productSlice';
import { confirm } from '../../utils';

function DeleteProduct({ _id, name }: { _id: string; name: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector(selectProducts);

  const _deleteProduct = useCallback(async () => {
    if (await confirm({ content: `Voulez-vous vraiment supprimer le produit ${name} ?` }))
      void dispatch(deleteProduct({ _id }));
  }, [_id, dispatch, name]);
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <LoadingButton loading={loading} onClick={_deleteProduct} fullWidth color="error">
      Supprimer
    </LoadingButton>
  );
}

export default DeleteProduct;
