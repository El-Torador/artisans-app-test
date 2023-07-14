import { Link, Typography } from "@mui/material";
import { DefaultComponentProps, OverridableTypeMap } from "@mui/material/OverridableComponent";

export function Copyright<T extends OverridableTypeMap>(props: DefaultComponentProps<T>) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.lesbonsartisans.fr">
        Bons Artisans
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}