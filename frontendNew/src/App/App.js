import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import Header from 'Containers/Header';
import Footer from 'Components/Footer';
import appLayout from 'SharedStyles/appLayout';
import styles from './styles';

import { getForums, updateCurrentForum, getUser,getNetworkStatus } from './actions';

class AppContainer extends Component {
  componentDidMount() {
    const {
      params,
      updateCurrentForum,
      getForums,
      getUser,
      getNetworkStatus,
    } = this.props;

    getNetworkStatus();


    setTimeout(function(){
      // get all forum list
      getForums();

      // check for authenticated user
      getUser();

      // set current forum based on route
      const currentForum = params.forum || '';
      updateCurrentForum(currentForum);
    },2000)
  }

  componentDidUpdate() {
    const {
      forums,
      params,
      currentForum,
      updateCurrentForum,
    } = this.props;

    let newCurrentForum = '';
    if (params.forum) newCurrentForum = params.forum;
    else if (forums) newCurrentForum = forums[0].forum_slug;

    // update current forum if necessery
    if (newCurrentForum !== currentForum) updateCurrentForum(newCurrentForum);
  }

  render() {
    const { forums } = this.props;

    // render only if we get the forum lists
    if (forums) {
      return (
        <div>
          <Helmet><title> </title></Helmet>

          <div className={styles.gitForkTag}>
            <a className={styles.gitLink} href="https://github.com/ReForum-ipfs/ReForum-ipfs" target="_blank">Fork on Github</a>
          </div>

          <Header />
          {this.props.children}
          <Footer />
        </div>
      );
    }

    return (
      <div className={styles.loadingWrapper}>Loading...</div>
    );
  }
}

export default connect(
  (state) => { return {
    forums: state.app.forums,
    currentForum: state.app.currentForum,
    networkStatus: state.app.networkStatus,
  }; },
  (dispatch) => { return {
    getNetworkStatus: () => { dispatch(getNetworkStatus()); },
    getForums: () => { dispatch(getForums()); },
    updateCurrentForum: (currentForum) => { dispatch(updateCurrentForum(currentForum)); },
    getUser: () => { dispatch(getUser()); },
  }; }
)(AppContainer);
