import React from "react";
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

import AccountMenu from "./AccountMenu";


const styles = (theme: Theme) => createStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
});

interface Props extends WithStyles<typeof styles> {
  onOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export class AppBar extends React.Component<Props> {
  renderMenuButton() {
    const { classes, onOpen } = this.props;

    return (
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={onOpen}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
    );
  }

  renderAccountMenu() {
    const accounts = [
      { slug: "a" },
      { slug: "b" },
      { slug: "c" },
      { slug: "d" },
    ];

    return (
      <AccountMenu
        account={accounts[0]}
        accounts={accounts}
      />
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <MuiAppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {this.renderMenuButton}
          <Typography variant="h6" noWrap>
            Dashboard
          </Typography>
          {this.renderAccountMenu()}
        </Toolbar>
      </MuiAppBar>
    );
  }
}

export default withStyles(styles)(AppBar);
