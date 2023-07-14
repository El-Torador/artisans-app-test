import type { Params } from "../components/Confirm/ConfirmGlobal";
import { ProductStatus } from "../types";

  export const getTypeAlert = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ERROR:
        return 'error';
      default:
        return 'success';
    }
  };

  export const confirmAction = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  current: (_p: Params) => Promise.resolve(true)
};

  export function confirm(props: Params) {
  return confirmAction.current(props);
}

export const WS_SERVER_HOST = 'http://localhost:8080'