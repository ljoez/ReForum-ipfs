import React, { Component } from 'react';
import { Link,hashHistory } from 'react-router';
import classnames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import styles from './styles';
import { signIn,signout } from './api';
import env from '../../../env.js';
import  CustomButton from 'Components/Button' ;
import storage from '../../../App/storage';
import store from '../../../App/store.js';

// import { Form, Icon, Input, Button as AntButton, Checkbox } from 'antd';

import 'antd/dist/antd.css';
import { getForums, updateCurrentForum, getUser,getNetworkStatus } from '../../../App/actions';

class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = { activeSubMenu: false , subMenuStatus: 'signUp',username:'',password:''};
    this.toggleSubMenu = this.toggleSubMenu.bind(this);
    this.toggleSignUpMenu = this.toggleSignUpMenu.bind(this);
    this.userNameHandleChange = this.userNameHandleChange.bind(this);
    this.passwordHandleChange = this.passwordHandleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.signoutClick = this.signoutClick.bind(this);
  }

  handleClickOutside() {
    this.setState({ activeSubMenu: false });
  }

  toggleSubMenu() {
    this.setState((prevState) => {
      return { activeSubMenu: !prevState.activeSubMenu ,
                subMenuStatus: 'signIn'};
    });
  }
  toggleSignUpMenu() {
    this.setState((prevState) => {
      return { activeSubMenu: !prevState.activeSubMenu,
               subMenuStatus: 'signUp'};
    });
  }
  userNameHandleChange(event) {
    this.setState({username: event.target.value});
  }
  passwordHandleChange(event) {
    this.setState({password: event.target.value});
  }
  submit(){
    var that = this;
    signIn({username:this.state.username,password:this.state.password}).then(
      data => {
        if (data.data.error != null){
          alert("password is incorrect");
        }else {
          storage.set('token',data.data);
          store.dispatch(getUser());
        }
      },
      error => {
      }
    );
  }
  signoutClick(){
      storage.set('token','');
      store.dispatch(getUser());
  }

  renderSubMenu() {
    const { activeSubMenu,subMenuStatus,
      username,
      password} = this.state;
    const {
      signedIn,
      gitHandler,
    } = this.props;


    if (activeSubMenu) {
      return (
        <div className={styles.subMenu}>
          <CustomButton className={styles.subMenuClose} onClick={this.toggleSubMenu} alwaysActive>
            <i className={classnames('fa fa-close')}></i>
          </CustomButton>

          { !signedIn && subMenuStatus=='signUp' && 
              <div style={{height:'100px'}}>
                {/* <form action={env.url+'/api/user/signIn'} method="post"> */}
                  {/* <a className={styles.signInLink} href={'/api/user/authViaGitHub'}>asdsad</a> */}
                    <div style={{display:'flex'}}>
                      <div style={{flex:'1'}}>username:
                        </div>
                        <div style={{flex:'1',marginLeft:'10px'}}><input type="text" name="username" value={username} onChange={this.userNameHandleChange}></input>
                        </div>
                    </div>
                    <div style={{display:'flex',marginTop:'10px'}}>
                      <div style={{flex:'1'}}>password:</div>
                      <div style={{flex:'1',marginLeft:'10px'}}><input type="password" name="password" value={password} onChange={this.passwordHandleChange}></input></div>
                      {/* <Button className={styles.gitLoginBtn} alwaysActive>
                    </Button> */}
                    </div>
                    <div style={{textAlign:'center'}}>
                      {/* <AntButton type="primary">Primary Button</AntButton> */}
                      <button onClick={this.submit} style={{justifyContent:'center',borderRadius: '6px',textAlign:'center',marginTop:'8px',backgroundColor: '#555555',color: 'white',padding: '7px 15px',fontSize: '16px' }}>Submit!</button>
                    </div>
                {/* </form> */}
              </div>
              // <Form onSubmit={this.handleSubmit} className="login-form">
              //   <Form.Item>
              //     {getFieldDecorator('username', {
              //       rules: [{ required: true, message: 'Please input your username!' }],
              //     })(
              //       <Input
              //         prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              //         placeholder="Username"
              //       />,
              //     )}
              //   </Form.Item>
              //   <Form.Item>
              //     {getFieldDecorator('password', {
              //       rules: [{ required: true, message: 'Please input your Password!' }],
              //     })(
              //       <Input
              //         prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              //         type="password"
              //         placeholder="Password"
              //       />,
              //     )}
              //   </Form.Item>
              //   <Form.Item>
              //     {getFieldDecorator('remember', {
              //       valuePropName: 'checked',
              //       initialValue: true,
              //     })(<Checkbox>Remember me</Checkbox>)}
              //     <a className="login-form-forgot" href="">
              //       Forgot password
              //     </a>
              //     <Button type="primary" htmlType="submit" className="login-form-button">
              //       Log in
              //     </Button>
              //     Or <a href="">register now!</a>
              //   </Form.Item>
              // </Form>
            }
          { signedIn && <span onClick={this.toggleSubMenu}><Link className={styles.subMenuItem} to={`/user/${gitHandler}`}>My Profile</Link></span> }
          {/* { signedIn && <a className={styles.subMenuItem} href={'#'}>Settings</a> } */}
          { signedIn && <a className={styles.subMenuItem} onClick={this.signoutClick} >Sign Out</a> }
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
          style={{justifyContent:'flex-end'}}
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
  signedIn: React.PropTypes.bool.isRequired,
  userName: React.PropTypes.string,
  gitHandler: React.PropTypes.string,
  avatar: React.PropTypes.string,
};

export default onClickOutside(UserMenu);
