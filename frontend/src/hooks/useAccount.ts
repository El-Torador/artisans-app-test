import { useSelector } from "react-redux";
import { selectAccount } from "../features/accountSlice";
import { UnAuthenticatedError } from "../utils";

export function useAccount() {
  const { account } = useSelector(selectAccount)

  if(!account) throw new UnAuthenticatedError()

  return {
    account
  }
}