import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';

import {
  getDiscussions,
  getPinnedDiscussions,
  updateSortingMethod,
} from './actions';

import Button from 'Components/Button';
import FeedBox from 'Components/FeedBox';
import SideBar from 'Components/SideBar';

import appLayout from 'SharedStyles/appLayout.css';
import styles from './styles.css';

class ForumFeed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pageNum: 1,
    };
  }
  componentDidMount() {
    const {
      currentForumId,
      getDiscussions,
      getPinnedDiscussions,
    } = this.props;

    // get the discussions and pinned discussions
    getDiscussions(currentForumId());
    getPinnedDiscussions(currentForumId());
  }

  componentDidUpdate(prevProps) {
    const {
      currentForum,
      currentForumId,
      getDiscussions,
      getPinnedDiscussions,
    } = this.props;
    const{
      pageNum
    } = this.state;

    // get the discussions again
    // if the forum didn't matched
    if (prevProps.currentForum !== currentForum) {
      const feedChanged = true;
      getDiscussions(currentForumId(), feedChanged,pageNum);
      getPinnedDiscussions(currentForumId(), feedChanged);
    }
  }
  previousPage(){
    const{
      pageNum
    } = this.state;
    
    const {
      currentForumId,
      getDiscussions,
    } = this.props;

    
    if (pageNum==1){
      alert("no more discussions");
    }else{
      this.setState({
        pageNum:pageNum-1
      })
      getDiscussions(currentForumId(), false,false,pageNum-1);
    }
    
  }
  nextPage(){
    const{
      pageNum
    } = this.state;

    const {
      currentForumId,
      getDiscussions,
      discussions
    } = this.props;
    
    if (discussions.length>=10){
      this.setState({
        pageNum:pageNum+1
      })
      getDiscussions(currentForumId(), false,false,pageNum+1);
    }else{
      alert("no more discussions");
    }
  }

  handleSortingChange(newSortingMethod) {
    const {
      currentForum,
      getDiscussions,
      updateSortingMethod,
      sortingMethod,
      currentForumId,
    } = this.props;

    if (sortingMethod !== newSortingMethod) {
      updateSortingMethod(newSortingMethod);
      getDiscussions(currentForumId(), false, true);
    }
  }

  renderNewDiscussionButtion() {
    const { currentForum } = this.props;

    return (
      <div className={classnames(appLayout.showOnMediumBP, styles.newDiscussionBtn)}>
        <Link to={`/${currentForum}/new_discussion`}>
          <Button type='outline' fullWidth noUppercase>
            New Discussion
          </Button>
        </Link>
      </div>
    );
  }

  render() {
    const {
      currentForum,
      discussions,
      fetchingDiscussions,
      pinnedDiscussions,
      fetchingPinnedDiscussions,
      sortingMethod,
      error,
    } = this.props;
    const{
      pageNum
    } = this.state;

    if (error) {
      return (
        <div className={classnames(styles.errorMsg)}>
          {error}
        </div>
      );
    }

    return (
      <div className={classnames(appLayout.constraintWidth, styles.contentArea)}>
        <Helmet><title>{`ReForum | ${currentForum}`}</title></Helmet>

        <div className={appLayout.primaryContent}>
          <FeedBox
            type='pinned'
            loading={fetchingPinnedDiscussions}
            discussions={pinnedDiscussions}
            currentForum={currentForum}
          />

          <FeedBox
            type='general'
            loading={fetchingDiscussions}
            discussions={discussions}
            currentForum={currentForum}
            onChangeSortingMethod={this.handleSortingChange.bind(this)}
            activeSortingMethod={sortingMethod}
          />

          <div style={{display:'flex',paddingTop:'15px',paddingBottom:'15px'}}>
            <button type="button" style={{flex:'1'}} onClick={this.previousPage.bind(this)}>Previous</button>
            <div style={{flex:'1',textAlign:'center'}}>{pageNum}</div>
            <button type="button" style={{flex:'1'}} onClick={this.nextPage.bind(this)}>Next</button>
          </div>
          { this.renderNewDiscussionButtion() }
        </div>

        <div className={appLayout.secondaryContent}>
          <SideBar currentForum={currentForum} />
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => { return {
    currentForum: state.app.currentForum,
    currentForumId: () => {
      const currentForumObj = _.find(state.app.forums, { forum_slug: state.app.currentForum });
      if (currentForumObj) return currentForumObj._id;
      else return null;
    },
    fetchingDiscussions: state.feed.fetchingDiscussions,
    discussions: state.feed.discussions,
    fetchingPinnedDiscussions: state.feed.fetchingPinnedDiscussions,
    sortingMethod: state.feed.sortingMethod,
    pinnedDiscussions: state.feed.pinnedDiscussions,
    error: state.feed.error,
  }; },
  (dispatch) => { return {
    getDiscussions: (currentForumId, feedChanged, sortingMethod, sortingChanged) => { dispatch(getDiscussions(currentForumId, feedChanged, sortingMethod, sortingChanged)); },
    getPinnedDiscussions: (currentForumId, feedChanged) => { dispatch(getPinnedDiscussions(currentForumId, feedChanged)); },
    updateSortingMethod: (method) => { dispatch(updateSortingMethod(method)); },
  }; }
)(ForumFeed);
