import React, { Component } from 'react';
import styles from './styles';

import RichMediaEditor from 'Components/RichMediaEditor';
import PropTypes from 'prop-types';

class ReplyBox extends Component {
  render() {
    const {
      posting,
      onSubmit,
      onChange,
    } = this.props;

    if (posting) return <div className={styles.loadingWrapper}>Posting your opinion...</div>;

    return (
      <RichMediaEditor
        type="newOpinion"
        onSave={onSubmit}
        onChange={onChange}
      />
    );
  }
}

ReplyBox.defaultProps = {
  posting: false,
  onSubmit: () => { },
  onChange: (value) => { },
};

ReplyBox.propTypes = {
  posting: PropTypes.bool,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};

export default ReplyBox;
