import React, { Component } from 'react';
import classnames from 'classnames';
import Moment from 'moment';
import styles from './styles';

import DiscussionBox from './DiscussionBox';
import PropTypes from 'prop-types';

class FeedBox extends Component {
  renderSort() {
    const {
      activeSortingMethod,
      onChangeSortingMethod,
    } = this.props;

    if (this.props.type === 'general') {
      return (
        <div className={styles.sortList}>
          <span
            className={classnames(styles.sort, (activeSortingMethod === 'date') && styles.sortActive)}
            onClick={() => onChangeSortingMethod('date')}
          >
            Latest
          </span>
          <span
            className={classnames(styles.sort, (activeSortingMethod === 'popularity') && styles.sortActive)}
            onClick={() => onChangeSortingMethod('popularity')}
          >
            Popular
          </span>
        </div>
      );
    }
    return null;
  }

  renderEmptyDiscussionLine(loading, discussions) {
    if (!loading) {
      if (!discussions || discussions.length === 0) {
        return <div className={styles.loading}>No discussions...</div>;
      }
    }
  }

  render() {
    const {
      type,
      loading,
      discussions,
      currentForum,
      userProfile,
    } = this.props;

    let discussionBoxTitle = '';
    if (type === 'general') discussionBoxTitle = 'Discussions';
    if (type === 'pinned') discussionBoxTitle = 'Pinned';

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.header}>
            <span className={styles.title}>{discussionBoxTitle}</span>
            { !userProfile && this.renderSort() }
          </div>
          { loading && <div className={styles.loading}>Loading...</div> }
          { this.renderEmptyDiscussionLine(loading, discussions) }
          { !loading &&
            <div className={styles.discussions}>
              { discussions && discussions.map((discussion) =>
                <DiscussionBox
                  userProfile={userProfile}
                  key={discussion._id}
                  userName={discussion.user.username}
                  avatarBase64={discussion.user.avatarBase64}
                  userGitHandler={discussion.user.username}
                  discussionTitle={discussion.title}
                  time={discussion.date}
                  tags={discussion.tags}
                  opinionCount={discussion.opinion_count}
                  voteCount={discussion.favorites.length}
                  link={`/${userProfile ? discussion.forum.forum_slug : currentForum}/discussion/${discussion.discussion_slug}`}
                />
              )}

            </div>
          }
        </div>
      
      </div>
    );
  }
}

FeedBox.defaultProps = {
  type: 'general',
  loading: false,
  discussions: [],
  currentForum: 'general',
  activeSortingMethod: 'date',
  onChangeSortingMethod: (val) => { },
  userProfile: false,
};

FeedBox.propTypes = {
  type: PropTypes.oneOf(['general', 'pinned']),
  loading: PropTypes.bool,
  discussions: PropTypes.array,
  currentForum: PropTypes.string,
  activeSortingMethod: PropTypes.string,
  onChangeSortingMethod: PropTypes.func,
  userProfile: PropTypes.bool,
};

export default FeedBox;
