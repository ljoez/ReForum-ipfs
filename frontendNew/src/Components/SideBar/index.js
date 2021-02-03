import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './styles';

// import Button from 'Components/Button';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
class SideBar extends Component {
  render() {
    const {
      currentForum,
    } = this.props;

    return (
      <div className={styles.sidebarContainer}>
        <Link to={`/${currentForum}/new_discussion`} style={{
  textDecoration:'none'}}>
          <Button variant="contained" color="primary" fullWidth 
            startIcon={<AddCircleRoundedIcon />}>
            New Discussion
          </Button>
        </Link>
      </div>
    );
  }
}


SideBar.defaultProps = {
  currentForum: 'general',
};

SideBar.propTypes = {
  currentForum: PropTypes.string,
};

export default SideBar;
