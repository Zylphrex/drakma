import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { formatISO, startOfDay, endOfDay } from 'date-fns';

import AccountSummaryChart from './charts/AccountSummaryChart';
import Dashboard from './base/Dashboard';
import api from "../api/client";
import { Activity } from "../app/types";
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
  activities: Activity[];
  startDate: Date | null;
  endDate: Date | null;
};

export class Main extends React.Component<Props, State> {
  state = {
    activities: [],
    startDate: null,
    endDate: null,
  };

  componentDidMount() {
    this.updateData();
  }

  async updateData() {
    const { match: { params: { slug } } } = this.props;
    const { startDate, endDate } = this.state;

    const url = `/api/accounts/${slug}/activities/`;
    const params = [{ key: 'startDate', val: startDate}, {key: 'endDate', val: endDate}]
      .filter(param => param.val !== null)
      .map(param => `${param.key}=${formatISO(param.val!)}`)
      .join('&');
    const query = params ? `?${params}` : '';

    const { data: activities } = await api.get(`${url}${query}`);

    this.setState({activities});
  }

  handleStartDateChange = (startDate: Date | null) => {
    this.setState({
      startDate: startDate === null ? null : startOfDay(startDate),
    }, () => this.updateData());
  }

  handleEndDateChange = (endDate: Date | null) => {
    this.setState({
      endDate: endDate === null ? null : endOfDay(endDate),
    }, () => this.updateData());
  }

  renderDateRangePicker() {
    const { startDate, endDate } = this.state;

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justify="space-around" alignContent="flex-end">
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="start-date"
            label="Start Date"
            value={startDate}
            onChange={this.handleStartDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change start date',
            }}
          />
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="end-date"
            label="End Date"
            value={endDate}
            onChange={this.handleEndDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change end date',
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>
    );
  }

  renderAccountSummary(dataKey: string) {
    const { classes } = this.props;
    const { activities } = this.state;
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
      <Grid item xs={12}>
        <Paper className={fixedHeightPaper}>
          <AccountSummaryChart 
            title={`Account ${dataKey.charAt(0).toUpperCase()}${dataKey.slice(1)}`}
            dataKey={dataKey}
            activities={activities}
          />
        </Paper>
      </Grid>
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
              {this.renderDateRangePicker()}
              {this.renderAccountSummary('balance')}
              {this.renderAccountSummary('deposit')}
              {this.renderAccountSummary('withdrawl')}
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
