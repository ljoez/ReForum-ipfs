import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';

class Profile extends Component {
  render() {
    const {
      name,
      gitHandler,
      location,
      avatarBase64,
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.avatarContainer}>            
          <Avatar  src={avatarBase64} style={{ height: '100px', width: '100px' }}/>

          {/* <img className={styles.avatar} src={avatarUrl} alt={`${name} avatar`} /> */}
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.name}>{ name }</div>
          {/* <div className={styles.gitHandler}><i className={classnames('fa fa-github-alt', styles.gitIcon)}></i> { gitHandler }</div>
          <div className={styles.location}>{ location }</div> */}
        </div>
      </div>
    );
  }
}

Profile.defaultProps = {
  name: 'Hello World',
  gitHandler: 'helloWorld',
  location: 'Somewhere in the world',
  avatarUrl: 'https://google.com',
};

Profile.propTypes = {
  name: PropTypes.string,
  gitHandler: PropTypes.string,
  location: PropTypes.string,
  avatarUrl: PropTypes.string,
};

export default Profile;
