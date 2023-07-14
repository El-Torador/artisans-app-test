import { useCallback, useState } from "react";
import { Account } from "../types";
import { apiFetch } from "../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { selectAccount, setAccount, setError } from "../features/accountSlice";
import { useHistory } from "react-router-dom";

export enum AuthStatus {
  Unknown = 0,
  Authenticated = 1,
  Guess = 2
}

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const account = useSelector(selectAccount)
  
  let status = AuthStatus.Unknown

  switch(account) {
    case null:
      status = AuthStatus.Guess
      break
    case undefined:
      status = AuthStatus.Unknown
      break
    default:
      status = AuthStatus.Authenticated
      break
  }

  const authenticate = useCallback(() => {
    setLoading(true)
    apiFetch<Account>("/user")
      .then(acc => {
        dispatch(setAccount({...acc}))
      })
      .catch(() => dispatch(setAccount(null)))
      .finally(() => setLoading(false))
  }, [dispatch])

  const login = useCallback((email: string, password: string) => {
    setLoading(true)
    apiFetch<Account>("/user/login", { json: {email, password} })
      .then(acc => {
        dispatch(setAccount({...acc}))
        history.push("/product")
      })
      .catch(() => {
        dispatch(setAccount(null))
        dispatch(setError("Identifiants incorrects."))
      })
      .finally(() => setLoading(false))
  }, [dispatch, history])

  const register = useCallback((username: string, email: string, password: string) => {
    setLoading(true)
    apiFetch<Account>("/user/register", { json: {username, email, password} })
      .then(()=> {
        history.push("/")
      })
      .catch(() => {
        dispatch(setError("Identifiants non conforme."))
      })
      .finally(() => setLoading(false))
  }, [dispatch, history])

  const logout = useCallback(() => {
    setLoading(true)
    apiFetch<Account>("/user/logout")
      .then(() => {
        history.push("/")
        dispatch(setAccount(null))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [dispatch, history])


  return {
    account,
    status,
    loading,
    authenticate,
    register,
    login,
    logout
  }
}