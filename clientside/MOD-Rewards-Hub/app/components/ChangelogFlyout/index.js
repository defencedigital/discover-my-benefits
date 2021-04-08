import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toJS } from '../HOC/ToJS';

import { makeSelectChangelogOpen, makeSelectChangelogHistory } from '../../containers/App/selectors';
import { closeChangelog } from '../../containers/App/actions';

import Changelog from '../Changelog';

export class ChangelogFlyout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  render() {
    const { changelogOpen, changelogHistory, onCloseChangelogFlyout } = this.props;
    const isActive = changelogOpen ? 'changelog-flyout changelog-flyout-is-active' : 'changelog-flyout';

    return (
      <div ref={this.myRef} className={isActive}>
        <button type="button" onClick={onCloseChangelogFlyout} className="changelog-flyout-close">
          <span>Close</span>
        </button>
        <Changelog benefits={changelogHistory} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const changelogOpen = makeSelectChangelogOpen(state);
  const changelogHistory = makeSelectChangelogHistory(state);

  return {
    changelogOpen,
    changelogHistory,
  };
};

ChangelogFlyout.propTypes = {
  changelogOpen: PropTypes.bool.isRequired,
  changelogHistory: PropTypes.array.isRequired,
  onCloseChangelogFlyout: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onCloseChangelogFlyout: () => dispatch(closeChangelog()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ChangelogFlyout));
