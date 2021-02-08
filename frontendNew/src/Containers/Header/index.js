import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { connect } from 'react-redux';
import classnames from 'classnames';

import appLayout from 'SharedStyles/appLayout';
import styles from './styles';

// components for Header
import UserMenu from 'Components/Header/UserMenu';
import Logo from 'Components/Header/Logo';
import NavigationBar from 'Components/Header/NavigationBar';
import PlaceholderImage from 'SharedStyles/placeholder.jpg';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

class Header extends Component {
  constructor(props) {
    super(props);
    const { forums} = this.props;
    if (forums){
      this.state = { value: 0};
    }
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange (event, newValue){
    const { forums} = this.props;
    this.setState({ value: newValue });
    hashHistory.push(`/${forums[newValue].forum_slug}`);
  };
  renderNavLinks() {
    const { forums} = this.props;
    
    const { value} = this.state;
    if (forums) {
        return (
          <div style={{marginTop:'20px',marginBottom:'20px'}}>
          <AppBar position="static"  color="default">
            <Tabs
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              value={value}
              onChange={this.handleChange}
              aria-label="nav tabs example"
            >
            {
              forums.map((forum,index) => {
                return <LinkTab value ={index} label={forum.forum_name} href={forum.forum_slug}/>
              })
            }
            </Tabs>
          </AppBar>
          </div>
        )
    }

    return null;
  }

  render() {
    const {
      authenticated,
      name,
      username,
      avatarBase64,
    } = this.props.user;

    return (
      <div className={classnames(appLayout.constraintWidth)}>
        <div className={styles.headerTop}>
          <Logo />
          <UserMenu
            signedIn={authenticated}
            userName={name || username}
            gitHandler={username}
            avatarBase64={avatarBase64}
          />
        </div>
        
          {this.renderNavLinks()}
        {/* <NavigationBar
          navigationLinks={}
        /> */}
      </div>
    );
  }
}

export default connect(
  (state) => { return {
    user: state.user,
    forums: state.app.forums,
  }; }
)(Header);
