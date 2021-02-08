import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router';
import Link from '@material-ui/core/Link';
import classnames from 'classnames';
import Moment from 'moment';
import styles from './styles';

import Tag from 'Components/Tag';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';


class DiscussionBox extends Component {
  render() {
    const {
      voteCount,
      userName,
      avatarBase64,
      userGitHandler,
      discussionTitle,
      time,
      opinionCount,
      tags,
      link,
      userProfile,
    } = this.props;

    const postTime = Moment(time);
    const timeDisplay = postTime.from(Moment());

    return (
      <div className={styles.container}>
        
        <div className={classnames(styles.title, userProfile && styles.titleBottomMargin)}><Link variant="h6" component={RouterLink} to={link} color="textPrimary">{discussionTitle}</Link></div>

        { !userProfile && <div className={styles.posterInfo}>
          <Grid container direction="row" justify="flex-start" alignItems="center">
              <div style={{display:'flex'}}>
               <Avatar src={avatarBase64} style={{ height: '20px', width: '20px' }}/>
              </div>
              <Link component={RouterLink}  to={`/user/${userGitHandler}`} className={styles.name} >{userName}</Link>
          </Grid>

          {/* <a target="_blank" href={`https://www.github.com/${userGitHandler}`} className={styles.gitHandler}>
            - <i className={classnames('fa fa-github-alt', styles.gitIcon)}></i> {userGitHandler}
          </a> */}
        </div> }

        <div className={styles.boxFooter}>
          <div className={styles.tagsArea}  >
            { tags.map((tag) => <Tag key={tag} name={tag} />) }
          </div>

          <div className={styles.postInfo}>
            <span className={styles.info}>{timeDisplay}</span>
            <span className={styles.info} style={{color:'#ff80ab'}}>{voteCount} favorites</span>
            <span className={styles.info} style={{color:'#90caf9'}}>{opinionCount} opinions</span>
          </div>
        </div>
      </div>
    );
  }
}

DiscussionBox.defaultProps = {
  discussionId: 1,
  voteCount: 20,
  userName: 'Hello World',
  userGitHandler: 'github',
  avatarBase64: null,
  discussionTitle: 'This is a default post title',
  time: Moment(),
  opinionCount: 12,
  tags: ['react', 'redux', 'nodejs'],
  link: '',
  userProfile: false,
};

DiscussionBox.propTypes = {
  discussionId: PropTypes.number,
  voteCount: PropTypes.number,
  userName: PropTypes.string,
  avatarBase64: PropTypes.string,
  userGitHandler: PropTypes.string,
  discussionTitle: PropTypes.string,
  time: PropTypes.any,
  opinionCount: PropTypes.number,
  tags: PropTypes.array,
  link: PropTypes.string,
  userProfile: PropTypes.bool,
};

export default DiscussionBox;
