import React, { Component } from 'react';
import classnames from 'classnames';
import styles from './styles';
import PropTypes from 'prop-types';

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = `${styles.controlButton}`;
    if (this.props.active) {
      className += ` ${styles.controlButtonActive}`;
    }

    return (
      <div className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </div>
    );
  }
}

StyleButton.propTypes = {
  onToggle: PropTypes.func.isRequired,
  active: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  style: PropTypes.string.isRequired,
};

export default StyleButton;
