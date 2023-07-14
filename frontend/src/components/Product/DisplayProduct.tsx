/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { Card, CardContent, Chip, Rating, Stack, Typography } from '@mui/material';

import type { ProductType } from '../../types';
import DeleteProduct from './DeleteProduct';
import EditProduct from './EditProduct';

const DiaplayProduct: React.FC<ProductType> = ({ _id, name, type, price, rating, warranty_years, available }) => {
  return (
    <Card style={{ minWidth: 300 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2" style={{ fontWeight: 'bold' }}>
            {name}
          </Typography>
          <Typography variant="body2" component="p">
            {available ? (
              <Chip label="En stock" color="success" size="small" />
            ) : (
              <Chip label="En rupture de stock" color="error" size="small" />
            )}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" component="small" color="gray" fontSize="small">
            {type}
          </Typography>
          <Typography variant="body2" component="p" color="gray">
            Garantie sur: {warranty_years} {warranty_years === 1 ? 'an' : 'ans'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Rating size="small" title="Notes" name="read-only" value={rating} readOnly />
          <Typography variant="h5" component="p" fontWeight="bold" color="green">
            {price.toFixed(2)}€
          </Typography>
        </Stack>
      </CardContent>
      <Stack direction="row">
        <EditProduct product={{ _id, name, type, price, rating, warranty_years, available }} />
        <DeleteProduct _id={_id} name={name} />
      </Stack>
    </Card>
  );
};

export default DiaplayProduct;
