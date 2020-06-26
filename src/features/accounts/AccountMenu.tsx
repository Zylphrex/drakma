import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { Account, AccountState, load } from './account';
import api from "../../api/client";
import { RootState } from "../../app/store";
import { AccountRouteProps } from "../../routes";


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

interface StateProps {
  account: AccountState;
}

interface DispatchProps {
  load: (accounts: Account[]) => void;
}

type Props = WithStyles<typeof styles> &
  RouteComponentProps<AccountRouteProps> &
  StateProps &
  DispatchProps;

interface State {
  anchor: HTMLElement | null;
}

class AccountMenu extends React.Component<Props, State> {
  state = {
    anchor: null,
  };

  async componentDidMount() {
    const { load } = this.props;
    const { data: accounts } = await api.get("/api/accounts/");
    load(accounts);
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

  handleMenuSelect(account: Account) {
    return () => {
      this.handleMenuClose();
      return api.post("/api/current_account/", {...account});
    };
  }

  renderAccountButton() {
    const { classes, match: { params: { slug } } } = this.props;

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
          {slug}
        </Typography>
        <ExpandMoreIcon fontSize="small" />
      </Button>
    );
  }

  renderAccountMenu() {
    const { account: { accounts } } = this.props;
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
          Object.keys(accounts).map((id) => {
            const account = accounts[id as unknown as keyof typeof accounts];
            const slug = account.slug;

            return (
              <MenuItem
                key={id}
                component={Link}
                to={`/accounts/${slug}/`}
                onClick={this.handleMenuSelect(account)}
              >
                <ListItemText primary={slug} />
              </MenuItem>
            );
          })
        }
      </Menu>
    );
  }

  render() {
    return (
      <div>
        {this.renderAccountButton()}
        {this.renderAccountMenu()}
      </div>
    );
  }
}

export const StyledAccountMenu = withStyles(styles)(AccountMenu);

export const RoutedStyledAccountMenu = withRouter(StyledAccountMenu);

const mapStateToProps = (state: RootState): StateProps => ({
  account: state.account,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  load: (accounts: Account[]) => dispatch(load(accounts)),
});

export const ConnectedRoutedStyledAccountMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoutedStyledAccountMenu);

export default ConnectedRoutedStyledAccountMenu;
