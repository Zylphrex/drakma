import React from 'react';
import DjangoCSRFToken from 'django-react-csrftoken'
import { RouteComponentProps, withRouter } from 'react-router';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Dashboard from './base/Dashboard';
import api from "../api/client";
import { AccountRouteProps } from "../routes";


const styles = (theme: Theme) => createStyles({
  appBarSpacer: theme.mixins.toolbar,
  button: {
    margin: theme.spacing(1),
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  primary: {
    color: theme.palette.getContrastText(theme.palette.secondary.dark),
    backgroundColor: theme.palette.secondary.dark,
  },
  paper: {
    width: '100%',
  },
  input: {
    display: 'none',
  },
});

type Props = WithStyles<typeof styles> &
  RouteComponentProps<AccountRouteProps>;

interface State {
  activitiesCsv: File | null;
  showSnackbar: boolean;
  uploadSuccess: boolean;
}

export class Import extends React.Component<Props, State> {
  state = {
    activitiesCsv: null,
    showSnackbar: false,
    uploadSuccess: false,
  };

  constructor(props: Props) {
    super(props);

    this.handleUpload = this.handleUpload.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      activitiesCsv: event.target.files?.[0] ?? null,
    });
  }

  async handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
    const { match: { params: { slug } } } = this.props;
    const { activitiesCsv } = this.state;

    event.preventDefault();

    const data = new FormData();
    data.append('activities', activitiesCsv!);

    const name = (activitiesCsv as unknown as File).name;
    try {
      await api.put(`/api/accounts/${slug}/upload/${name}/`, data);
      this.openSuccessSnackbar()
    } catch (error) {
      this.openErrorSnackbar()
    }
  }

  handleSnackbarClose() {
    this.setState({
      showSnackbar: false,
    });
  }

  openSuccessSnackbar() {
    this.setState({
      showSnackbar: true,
      uploadSuccess: true,
    });
  }

  openErrorSnackbar() {
    this.setState({
      showSnackbar: true,
      uploadSuccess: false,
    });
  }

  renderImportAccountActivities() {
    const { classes } = this.props;

    return (
      <ListItem>
        <ListItemAvatar>
          <Avatar className={classes.primary}>
            <AccountBalanceIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary="Account Activities"
          secondary="CSV"
        />
        <ListItemSecondaryAction>
          <input
            accept=".csv"
            className={classes.input}
            id="account-activities-csv-upload"
            onChange={this.handleUpload}
            type="file"
          />
          <label htmlFor="account-activities-csv-upload">
            <IconButton edge="end" aria-label="add" component="span">
              <AddIcon />
            </IconButton>
          </label>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  renderSubmitButton() {
    const { classes } = this.props;
    const { activitiesCsv } = this.state;

    const disabled = activitiesCsv === null;

    return (
      <Grid container justify="flex-end">
        <Button
          className={classes.button}
          color="primary"
          disabled={disabled}
          size="large"
          startIcon={<CloudUploadIcon />}
          type="submit"
          variant="text"
          onClick={this.handleSubmit}
        >
          Upload
        </Button>
      </Grid>
    );
  }

  renderContent() {
    const { classes } = this.props;

    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <form
                method="POST"
                noValidate
              >
                <DjangoCSRFToken />
                <List>
                  {this.renderImportAccountActivities()}
                </List>
                {this.renderSubmitButton()}
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  renderSnackbar() {
    const { showSnackbar, uploadSuccess } = this.state;

    const severity = uploadSuccess ? "success" : "error";
    const message = uploadSuccess
      ? "Successfully uploaded activities CSV."
      : "Error uploading activities CSV.";

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        autoHideDuration={10000}
        onClose={this.handleSnackbarClose}
        open={showSnackbar}
      >
        <Alert onClose={this.handleSnackbarClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <Dashboard>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          {this.renderContent()}
          {this.renderSnackbar()}
        </main>
      </Dashboard>
    );
  }
}

export const StyledImport =  withStyles(styles)(Import);

export const RoutedStyledImport = withRouter(StyledImport);

export default RoutedStyledImport;
