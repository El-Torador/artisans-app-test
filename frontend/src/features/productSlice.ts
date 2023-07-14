import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";
import { ProductStatus, ProductType } from "../types";
import { RootState } from "../store";

export const getProducts = createAsyncThunk('product/getAll', async () => {
  return await apiFetch<ProductType[]>('/products')
})

export const createProduct = createAsyncThunk('product/create', async ({ product }: { product: ProductType }) => {
  return await apiFetch<ProductType>('/products', { json: { ...product }})
})

export const updateProduct = createAsyncThunk('product/update', async ({ product }: { product: ProductType }) => {
  await apiFetch('/products/'+product._id, { json: { ...product }, method: 'PUT' })
  return product
})

export const deleteProduct = createAsyncThunk('product/delete', async ({ _id }: { _id: string }) => {
  await apiFetch('/products/'+ _id, { method: 'DELETE'})
  return _id
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [] as ProductType[],
    loading: false,
    status: ProductStatus.INIT,
    message: null as string,
  },
  reducers: {
    closeSnackBar: (state) => {
      state.status = ProductStatus.INIT
    },
    productCreated: (state, { payload }: PayloadAction<ProductType>) => {
      const productExist = state.products.filter(p => p._id === payload._id)
      if (productExist.length > 0) return
      state.products.push(payload);
    },
    productUpdated: (state, { payload }: PayloadAction<ProductType>) => {
      state.products = state.products.map(product => {
        if (product._id !== payload._id) return product
        return payload
      })
    },
    productDeleted: (state, { payload }: PayloadAction<string>) => {
      state.products = state.products.filter(product => product._id !== payload)
    },
  },
  extraReducers: builder => {
    builder.addCase(getProducts.pending, state => {
      state.loading = true
    })
    .addCase(getProducts.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = payload
    })
    .addCase(getProducts.rejected, state => {
      state.loading = false
      state.status = ProductStatus.ERROR
      state.message = "Oups, nous avons rencontré un problème lors de la récupération des produits, Veuillez réactualiser la page pour réessayer."
    })
    .addCase(createProduct.pending, state => {
      state.loading = true
      state.status = ProductStatus.INIT
    })
    .addCase(createProduct.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products.push(payload)
      state.status = ProductStatus.CREATED
      state.message = "Votre produit a bien été ajouté."
    })
    .addCase(createProduct.rejected, (state, { error }) => {
      state.loading = false
      state.status = ProductStatus.ERROR
      console.log(error)
      state.message = "Oups, nous avons rencontré un problème lors de la création de votre produit."
    })
    .addCase(updateProduct.pending, state => {
      state.loading = true
      state.status = ProductStatus.INIT
    })
    .addCase(updateProduct.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = state.products.map(product => {
        if (product._id !== payload._id) return product
        return payload
      })
      state.status = ProductStatus.UPDATED
      state.message = "Votre produit a bien été mis à jour."
    })
    .addCase(updateProduct.rejected, (state, { error }) => {
      state.loading = false
      state.status = ProductStatus.ERROR
      console.log(error)
      state.message = "Oups, nous avons rencontré un problème lors de la mise à jour de votre produit."
    })
    .addCase(deleteProduct.pending, state => {
      state.loading = true
      state.status = ProductStatus.INIT
    })
    .addCase(deleteProduct.fulfilled, (state, { payload }) => {
      state.loading = false
      state.products = state.products.filter(product => product._id !== payload)
      state.status = ProductStatus.DELETED
      state.message = "Votre produit a bien été supprimé."
    })
    .addCase(deleteProduct.rejected, (state, { error }) => {
      state.loading = false
      state.status = ProductStatus.ERROR
      console.log(error)
      state.message = "Oups, nous avons rencontré un problème lors de la suppression de votre produit."
    })
  }
})
export const { closeSnackBar, productCreated, productUpdated, productDeleted } = productSlice.actions
export const selectProducts = (state: RootState) => state.productState;

export default productSlice.reducer