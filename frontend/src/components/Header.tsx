import React, { useCallback, useState } from "react";
import { AppBar, Button, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Logout } from "@mui/icons-material";

import { useAccount } from "../hooks/useAccount";
import { useAuth } from "../hooks/useAuth";

function Header() {
  const { logout } = useAuth()
  const account = useAccount()
  const [anchorEl, setAnchorEl] = useState <null | HTMLElement> (null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }, [setAnchorEl])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  return <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Artisans App
      </Typography>
      <Button
        color="inherit"
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {account.account.username}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Se Deconnecter
        </MenuItem>
      </Menu>
    </Toolbar>
  </AppBar>
}

export default Header