import { ComponentProps, useRef, useState } from 'react';

import ConfirmDialog from './ConfirmDialog';
import { confirmAction } from '../../utils';

export type Params = Partial<Omit<ComponentProps<typeof ConfirmDialog>, 'open' | 'onConfirm' | 'onCancel'>>;

const ConfirmGlobal = () => {
  const [open, setOpen] = useState(false);
  const [props, setProps] = useState<Params>({});

  const resolveRef = useRef<(v: boolean) => void>();

  confirmAction.current = (props) =>
    new Promise((resolve) => {
      setProps(props);
      setOpen(true);
      resolveRef.current = resolve;
    });

  return (
    <ConfirmDialog
      open={open}
      onConfirm={() => {
        resolveRef.current(true);
        setOpen(false);
      }}
      onCancel={() => {
        resolveRef.current(false);
        setOpen(false);
      }}
      {...props}
    />
  );
};

export default ConfirmGlobal;
