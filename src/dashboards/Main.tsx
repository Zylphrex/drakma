import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import clsx from 'clsx';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import AreaChart from './charts/AreaChart';
import Dashboard from './base/Dashboard';
import api from "../api/client";
import { ActivityStat } from "../app/types";
import { AccountRouteProps } from "../routes";


const styles = (theme: Theme) => createStyles({
  appBarSpacer: theme.mixins.toolbar,
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
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

type Props = WithStyles<typeof styles> & RouteComponentProps<AccountRouteProps>;

type State = {
  activities: ActivityStat[];
};

export class Main extends React.Component<Props, State> {
  state = {
    activities: [],
  };

  componentDidMount() {
    this.updateData();
  }

  async updateData() {
    const { match: { params: { slug } } } = this.props;

    const url = `/api/accounts/${slug}/activities/stats/`;
    const params = [
      'startDate=120d',
      'endDate=0d',
      'statsPeriod=10',
    ].join('&');
    const query = params ? `?${params}` : '';

    const { data: activities } = await api.get(`${url}${query}`);

    this.setState({activities});
  }

  renderAccountStats() {
    const { classes } = this.props;
    const { activities } = this.state;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <React.Fragment>
        <Grid item xs={12} md={6}>
          <Paper className={fixedHeightPaper}>
            <AreaChart
              title="Account Balance (120 Days)"
              xKey="period_date"
              yKey="period_balance"
              data={activities}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={fixedHeightPaper}>
            <AreaChart
              title="Account Activity (120 Days)"
              xKey="period_date"
              yKey={["period_deposit", "period_withdrawl"]}
              data={activities}
            />
          </Paper>
        </Grid>
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Dashboard>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {this.renderAccountStats()}
            </Grid>
          </Container>
        </main>
      </Dashboard>
    );
  }
}

export const StyledMain =  withStyles(styles)(Main);

export const RoutedStyledMain = withRouter(StyledMain);

export default RoutedStyledMain;
