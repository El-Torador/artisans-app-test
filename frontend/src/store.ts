import { configureStore } from "@reduxjs/toolkit";

import accountSlice from './features/accountSlice'
import productSlice from './features/productSlice'


export const store = configureStore({
  reducer: {
    accountState: accountSlice,
    productState: productSlice
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch