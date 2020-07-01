import React from 'react';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from './AppBar';
import Drawer from './Drawer';


const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
});

type Props = WithStyles<typeof styles>;

interface State {
  open: boolean;
}

export class Dashboard extends React.Component<Props, State> {
  state = {
    open: false,
  };

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

  render() {
    const { children, classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {this.renderAppBar()}
        {this.renderDrawer()}
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
