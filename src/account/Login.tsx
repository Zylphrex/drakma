import React from 'react';
import DjangoCSRFToken from 'django-react-csrftoken'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const styles = (theme: Theme) => createStyles({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

type Props = WithStyles<typeof styles>;

export class Login extends React.Component<Props> {
  renderUsernameField() {
    return (
      <TextField
        autoComplete="username"
        autoFocus
        fullWidth
        id="username"
        label="Username"
        margin="normal"
        name="username"
        required
        variant="outlined"
      />
    );
  }

  renderPasswordField() {
    return (
      <TextField
        autoComplete="current-password"
        fullWidth
        id="password"
        label="Password"
        name="password"
        required
        type="password"
        variant="outlined"
      />
    );
  }

  renderSubmitButton() {
    const { classes } = this.props;

    return (
      <Button
        className={classes.submit}
        color="primary"
        fullWidth
        type="submit"
        variant="contained"
      >
        Log In
      </Button>
    );
  }

  renderLogInForm() {
    const { classes } = this.props;

    return (
      <form
        action="/account/login/"
        className={classes.form}
        method="POST"
        noValidate
      >
        <DjangoCSRFToken />
        <input type="hidden" name="next" value="/" />
        {this.renderUsernameField()}
        {this.renderPasswordField()}
        {this.renderSubmitButton()}
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </form>
    )
  }

  render() {
    const { classes } = this.props;

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          {this.renderLogInForm()}
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

export default withStyles(styles)(Login);
