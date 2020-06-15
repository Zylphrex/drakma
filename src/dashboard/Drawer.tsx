import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import MuiDrawer from '@material-ui/core/Drawer';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MailIcon from '@material-ui/icons/Mail';
import { Theme, WithStyles, createStyles, withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = (theme: Theme) => createStyles({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
});

interface Props extends WithStyles<typeof styles> {
  open: boolean;
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const LogoutButton = React.memo(
  React.forwardRef<any, Omit<ButtonProps, 'type'>>((props, ref) => (
    <Button
      ref={ref}
      style={{textTransform: 'none'}}
      type="submit"
      {...props}
    />
  )),
);

export class Drawer extends React.Component<Props> {
  renderLogout() {
    return (
      <List>
        <form
          action="/logout/"
          method="POST"
          noValidate
        >
          <ListItem component={LogoutButton}>
            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </form>
      </List>
    );
  }

  renderDrawer() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        {this.renderLogout()}
      </div>
    );
  }

  renderTemporary() {
    const { classes, open, onClose, onOpen } = this.props;

    return (
      <SwipeableDrawer
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        anchor="left"
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        variant="temporary"
      >
        {this.renderDrawer()}
      </SwipeableDrawer>
    );
  }

  renderPermanent() {
    const { classes } = this.props;

    return (
      <MuiDrawer
        classes={{
          paper: classes.drawerPaper,
        }}
        open
        variant="permanent"
      >
        {this.renderDrawer()}
      </MuiDrawer>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          {this.renderTemporary()}
        </Hidden>
        <Hidden xsDown implementation="css">
          {this.renderPermanent()}
        </Hidden>
      </nav>
    )
  }
}

export default withStyles(styles)(Drawer);
