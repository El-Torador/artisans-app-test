import { createSlice } from '@reduxjs/toolkit';
import { Account } from '../types';
import { RootState } from '../store';


const accountSlice = createSlice({
  name: 'loginSlice',
  initialState: {
    account: null as null | null | Account,
    error: null as string
  },
  reducers: {
    setAccount: (state, { payload } : {payload: undefined | null | Account }) => {
      state.account = payload ? {...payload } : payload
    },
    setError: (state, { payload } : { payload: string }) =>{
      state.error = payload
    },
    resetError: state => {
      state.error = null
    }
  }
})

export const { setAccount, setError, resetError } = accountSlice.actions;

export const selectAccount = (state: RootState) => state.accountState;

export default accountSlice.reducer