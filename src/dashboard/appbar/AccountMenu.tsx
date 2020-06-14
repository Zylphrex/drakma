import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Account } from "../../drakma";


const styles = (theme: Theme) => createStyles({
  menuButton: {
    boxShadow: 'none',
    marginLeft: theme.spacing(2),
  },
  buttonText: {
    marginRight: theme.spacing(1),
  },
});

interface Props extends WithStyles<typeof styles> {
  account: Account;
  accounts: Account[];
}

interface State {
  anchor: HTMLElement | null;
}

export class AccountMenu extends React.Component<Props, State> {
  state = {
    anchor: null,
  };

  handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      anchor: event.currentTarget,
    });
  }

  handleMenuClose = () => {
    this.setState({
      anchor: null,
    });
  }

  handleMenuSelect = (event: React.MouseEvent<HTMLLIElement>) => {
    console.log(event);
  }

  render() {
    const { account, accounts, classes } = this.props;
    const { anchor } = this.state;

    return (
      <div>
        <Button
          aria-controls="customized-menu"
          aria-haspopup="true"
          className={classes.menuButton}
          color="primary"
          onClick={this.handleMenuOpen}
          variant="contained"
        >
          <Typography className={classes.buttonText}>
            {account.slug}
          </Typography>
          <ExpandMoreIcon fontSize="small" />
        </Button>
        <Menu
          id="customized-menu"
          anchorEl={anchor}
          keepMounted
          open={Boolean(anchor)}
          onClose={this.handleMenuClose}
        >
          {
            accounts.map((account) => (
              <MenuItem key={account.slug}>
                <ListItemText primary={account.slug} />
              </MenuItem>
            ))
          }
        </Menu>
      </div>
    )
  }
}

export default withStyles(styles)(AccountMenu);
