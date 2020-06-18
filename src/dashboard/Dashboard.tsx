import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import clsx from 'clsx';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from './AppBar';
import Chart from './Chart';
import Deposits from './Deposits';
import Drawer from './Drawer';
import Orders from './Orders';

import api from '../api/client';
import { RootState } from "../app/store";
import { Account, select } from '../features/accounts/account';


const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
});

interface StateProps {
  accountId: number | null;
}

interface DispatchProps {
  select: (account: Account) => void;
}

type Props = WithStyles<typeof styles> & StateProps & DispatchProps;

interface State {
  open: boolean;
}

export class Dashboard extends React.Component<Props, State> {
  state = {
    open: false,
  };

  async componentDidMount() {
    const { select } = this.props;
    const { data: account } = await api.get("/api/current_account/");
    select(account);
  }

  handleDrawerOpen = () => {
    this.setState({
      open: true,
    });
  }

  handleDrawerClose = () => {
    this.setState({
      open: false,
    });
  }

  renderAppBar() {
    return (
      <AppBar onOpen={this.handleDrawerOpen} />
    );
  }

  renderDrawer() {
    const { open } = this.state;

    return (
      <Drawer
        open={open}
        onClose={this.handleDrawerClose}
        onOpen={this.handleDrawerOpen}
      />
    );
  }

  renderMain() {
    const { classes } = this.props;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Deposits />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Orders />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    );
  }

  render() {
    const { accountId, classes } = this.props;

    return accountId === null ? null : (
      <div className={classes.root}>
        <CssBaseline />
        {this.renderAppBar()}
        {this.renderDrawer()}
        {this.renderMain()}
      </div>
    );
  }
}

export const StyledDashboard = withStyles(styles)(Dashboard);

const mapStateToProps = (state: RootState) => ({
  accountId: state.account.id,
})

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  select: (account: Account) => dispatch(select(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledDashboard);
