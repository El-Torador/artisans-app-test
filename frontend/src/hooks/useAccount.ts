import { useSelector } from "react-redux";
import { selectAccount } from "../features/accountSlice";

export function useAccount() {
  const { account } = useSelector(selectAccount)

  if(!account) throw new Error("User is not authenticated")

  return {
    account
  }
}