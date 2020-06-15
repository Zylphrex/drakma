import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Account, AccountState, load, select } from "./accountInfo";
import api from "../../api/client";
import { RootState } from "../../app/store";


const styles = (theme: Theme) => createStyles({
  menuButton: {
    boxShadow: 'none',
    marginLeft: theme.spacing(2),
  },
  buttonText: {
    height: '24px',
    marginRight: theme.spacing(1),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    width: '76px',
  },
});

type StateProps = AccountState;

interface DispatchProps {
  load: (accountState: AccountState) => void;
  select: (accountId: number) => void;
}

type Props = WithStyles<typeof styles> & StateProps & DispatchProps;

interface State {
  anchor: HTMLElement | null;
}

class AccountMenu extends React.Component<Props, State> {
  state = {
    anchor: null,
  };

  async componentDidMount() {
    const { load } = this.props;

    const response = await api.get("/api/accounts");
    const accounts = response.data;

    const allAccounts: Record<number, Account> = {};
    const defaultAccountId = accounts[0].id;
    accounts.forEach((account: Account) => {
      allAccounts[account.id] = account;
    });

    load({
      selected: defaultAccountId,
      allAccounts,
    });
  }

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

  handleMenuSelect(i: number) {
    const { select } = this.props;
    return (event: React.MouseEvent<HTMLLIElement>) => {
      this.setState({
        anchor: null,
      });
      select(i);
    };
  }

  renderAccountButton() {
    const { classes, selected, allAccounts } = this.props;

    return (
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        className={classes.menuButton}
        color="primary"
        onClick={this.handleMenuOpen}
        variant="contained"
      >
        <Typography className={classes.buttonText}>
          {(allAccounts[selected!] as unknown as Account).slug}
        </Typography>
        <ExpandMoreIcon fontSize="small" />
      </Button>
    );
  }

  renderAccountMenu() {
    const { allAccounts } = this.props;
    const { anchor } = this.state;

    return (
      <Menu
        id="customized-menu"
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={this.handleMenuClose}
      >
        {
          Object.keys(allAccounts).map((id: string) => {
            const accountId = id as unknown as keyof typeof allAccounts;
            const slug = allAccounts[accountId].slug;

            return (
              <MenuItem key={id} onClick={this.handleMenuSelect(accountId)}>
                <ListItemText primary={slug} />
              </MenuItem>
            );
          })
        }
      </Menu>
    );
  }

  render() {
    const { selected } = this.props;

    return selected === null ? null : (
      <div>
        {this.renderAccountButton()}
        {this.renderAccountMenu()}
      </div>
    );
  }
}

const StyledAccountMenu = withStyles(styles)(AccountMenu);

const mapStateToProps = (state: RootState): StateProps => ({
  ...state.accountInfo,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  load: (accountState: AccountState) => dispatch(load(accountState)),
  select: (accountId: number) => dispatch(select(accountId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledAccountMenu);
