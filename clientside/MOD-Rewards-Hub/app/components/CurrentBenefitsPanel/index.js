import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { togglePinnedNav, toggleFlyout, setActiveAllTab } from '../../containers/App/actions';
import { toJS } from '../HOC/ToJS';
import { makeSelectFlyoutOpen, makeSelectPinNav } from '../../containers/App/selectors';

export class CBP extends React.PureComponent {
  toggleFlyoutAllTab = () => {
    const { onToggleFlyout, flyoutOpen, onTogglePinnedNav, onSetActiveAllTab } = this.props;

    if (!flyoutOpen) {
      onTogglePinnedNav();
      setTimeout(() => {
        onSetActiveAllTab();
        onToggleFlyout();
      }, 200);
    }
  };

  render() {
    const { progress } = this.props;
    return (
      <Row className="text-white w-100">
        <Col xs="12">
          <p className="h3">
            <span className="icon icon-eligible icon-left"></span>You are likely to be eligible for{' '}
            {progress.totalEligible} benefits{' '}
          </p>
        </Col>
        <button
          onClick={() => {
            this.toggleFlyoutAllTab();
          }}
          type="button"
          className="btn-primary btn btn-block"
        >
          Current package
        </button>
      </Row>
    );
  }
}

CBP.propTypes = {
  progress: PropTypes.object.isRequired,
  onToggleFlyout: PropTypes.func.isRequired,
  onSetActiveAllTab: PropTypes.func.isRequired,
  onTogglePinnedNav: PropTypes.func.isRequired,
  flyoutOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  const flyoutOpen = makeSelectFlyoutOpen(state);
  const pinNav = makeSelectPinNav(state);

  return {
    flyoutOpen,
    pinNav,
  };
};

const mapDispatchToProps = dispatch => ({
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onTogglePinnedNav: () => dispatch(togglePinnedNav()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(CBP));
