import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router';
import classnames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import styles from './styles';
import { signIn, signout } from './api';
import env from '../../../env.js';
import CustomButton from 'Components/Button';
import storage from '../../../App/storage';
import store from '../../../App/store.js';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Popover from '@material-ui/core/Popover';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SnackbarProvider, useSnackbar } from 'notistack';

// import { Form, Icon, Input, Button as AntButton, Checkbox } from 'antd';

import { getForums, updateCurrentForum, getUser, getNetworkStatus } from '../../../App/actions';

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { activeSubMenu: false, subMenuStatus: 'signUp', username: '', password: '', anchorEl: null,snackbarOpen:false };
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.toggleSignUpMenu = this.toggleSignUpMenu.bind(this);
    this.userNameHandleChange = this.userNameHandleChange.bind(this);
    this.passwordHandleChange = this.passwordHandleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.signoutClick = this.signoutClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.gotoProfile = this.gotoProfile.bind(this);
    this.snackbarClose = this.snackbarClose.bind(this);
  }
  snackbarClose(){
    this.snackbarClose = false;
  }
  handleClose() {

    this.setState({ activeSubMenu: false });
  }
  // handleClickOutside() {
  //   this.setState({ activeSubMenu: false });
  // }

  toggleSubMenu(event) {
    var currentTarget = event.currentTarget;
    this.setState((prevState) => {
      return {
        activeSubMenu: !prevState.activeSubMenu,
        subMenuStatus: 'signIn',
        anchorEl: currentTarget
      };
    });
  }
  toggleSignUpMenu() {
    this.setState((prevState) => {
      return {
        activeSubMenu: !prevState.activeSubMenu,
        subMenuStatus: 'signUp'
      };
    });
  }
  userNameHandleChange(event) {
    this.setState({ username: event.target.value });
  }
  passwordHandleChange(event) {
    this.setState({ password: event.target.value });
  }
  submit() {
    var that = this;
    signIn({ username: this.state.username, password: this.state.password }).then(
      data => {
        if (data.data.error != null) {    
          enqueueSnackbar('This is a success message!', 'error');

        } else {
          storage.set('token', data.data);
          store.dispatch(getUser());
        }
      },
      error => {
      }
    );
  }
  signoutClick() {
    storage.set('token', '');
    store.dispatch(getUser());
    this.setState({ activeSubMenu: false });
  }
  gotoProfile(){
    const {
      signedIn,
      gitHandler,
    } = this.props;
    hashHistory.push(`/user/${gitHandler}`);
  }
  renderSubMenu() {
    const { activeSubMenu, subMenuStatus,
      username,
      password,
      anchorEl } = this.state;
    const {
      signedIn,
      gitHandler,
    } = this.props;

    if (activeSubMenu) {
      return (
        <div className={styles.subMenu}>
          { !signedIn &&
            <Dialog
              onClose={this.handleClose}
              open
              aria-labelledby="simple-dialog"
            >
              <DialogTitle id="simple-dialog-tilte">Sign In/Sign up</DialogTitle>
              <DialogContent>
                <Avatar style={{ margin: '0 auto', backgroundColor: '#dc004e' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username} onChange={this.userNameHandleChange}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password} onChange={this.passwordHandleChange}
                />
                <Button
                  style={{ marginTop: '20px' }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={this.submit}
                >
                  Submit!
              </Button>
                <Button
                  style={{ marginTop: '20px' }}
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={this.handleClose}
                >
                  Cancel
                </Button>
              </DialogContent>

            </Dialog>
          }
          { signedIn && <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuItem onClick={this.gotoProfile}>My Profile</MenuItem>
            <MenuItem onClick={this.signoutClick}>Sign Out</MenuItem>
          </Menu>}
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      signedIn,
      userName,
      avatar,
      signOutAction,
    } = this.props;

    if (signedIn) {
      return (
        <div style={{ position: 'relative' }}>
          <div className={styles.container} onClick={this.toggleSubMenu}>
            {/* <img className={styles.userAvatar} src={avatar} alt={`${userName} Avatar`} /> */}
            <span className={styles.title}>{userName}</span>
          </div>
          {this.renderSubMenu()}
        </div>
      );
    }

    return (
      <div className={styles.container}>
        <CustomButton
          alwaysActive
          className={classnames(styles.signInBtn, styles.title)}
          onClick={this.toggleSignUpMenu}
          style={{ justifyContent: 'flex-end' }}
        >
          Sign Up / Sign In
        </CustomButton>
        
        {/*         
        <CustomButton
          alwaysActive
          className={classnames(styles.signInBtn, styles.title)}
          onClick={this.toggleSubMenu}
          style={{justifyContent:'flex-start'}}
          // style={{alignItems:'flex-start'}}
        >
           
        </CustomButton> */}

        {this.renderSubMenu()}
      </div>
    );
  }
}

UserMenu.defaultProps = {
  signedIn: false,
  userName: '',
  gitHandler: '',
  avatar: '',
};

UserMenu.propTypes = {
  signedIn: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  gitHandler: PropTypes.string,
  avatar: PropTypes.string,
};

export default UserMenu;
