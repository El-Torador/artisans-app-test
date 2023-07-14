import { Backdrop, CircularProgress, Stack } from '@mui/material';

function Loader({ name = 'normal' }: { name?: 'backdrop' | 'normal' }) {
  if (name === 'backdrop') {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }
  return (
    <Stack direction="column" justifyContent="flex-end" alignItems="center" spacing={2} marginTop={25}>
      <CircularProgress variant="indeterminate" />
    </Stack>
  );
}

export default Loader;
