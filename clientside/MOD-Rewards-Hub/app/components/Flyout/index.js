import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Nav, NavItem, TabContent, TabPane } from 'reactstrap';
import BenefitsList from '../BenefitsList';
import BenefitsPackage from '../BenefitsPackage';
import { closeFlyout, setActiveAllTab, setActiveFavouritesTab } from '../../containers/App/actions';
import {
  makeSelectFlyoutOpen,
  makeSelectSearchOpen,
  makeSelectFavouritesTab,
  makeSelectAllTab,
} from '../../containers/App/selectors';
import { ServicePropType } from '../../containers/Services/propTypes';
import FlyoutFavourites from '../FlyoutFavourites';
import ClickOutside from '../HOC/ClickOutside';
import ProgressHOC from '../HOC/Progress';
import { toJS } from '../HOC/ToJS';

export class Flyout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
    this.state = {
      activeTab: 1,
    };
  }

  toggle = tab => {
    const { onSetActiveFavouritesTab, onSetActiveAllTab } = this.props;
    const { activeTab } = this.state;
    if (tab === 1) {
      onSetActiveFavouritesTab();
    } else {
      onSetActiveAllTab();
    }

    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.flyoutOpen) {
      document.body.classList.add('flyout-open');
    } else {
      document.body.classList.remove('flyout-open');
    }
    if (nextProps.searchOpen) {
      document.body.classList.add('search-open');
    } else {
      document.body.classList.remove('search-open');
    }

    if (nextProps.activeFavTab) {
      this.toggle(1);
    }
    if (nextProps.activeAllTab) {
      this.toggle(2);
    }
  }

  render() {
    const { flyoutOpen, searchOpen, service, activeFavTab } = this.props;
    const { activeTab } = this.state;

    const isActive = flyoutOpen && !searchOpen ? 'flyout flyout-is-active' : 'flyout';
    const isActiveIndex = flyoutOpen && !searchOpen ? '0' : '-1';

    return (
      <div ref={this.myRef} className={isActive} tabIndex={isActiveIndex}>
        <ClickOutside onOutsideClick={flyoutOpen ? this.props.onCloseFlyout : () => {}}>
          <>
            <div className="flyout-header">
              <ProgressHOC service={service}>
                <BenefitsPackage service={service} flyoutOpen={flyoutOpen} />
              </ProgressHOC>
            </div>
            <div className="flyout-main">
              <Nav className="flyout-tabs" tabs>
                <NavItem className={`${activeTab === 1 ? 'active' : ''}`}>
                  <button
                    type="button"
                    className={`nav-link font-weight-bold pb-4 ${activeTab === 1 ? 'active' : ''}`}
                    onClick={() => {
                      this.toggle(1);
                    }}
                  >
                    Your Favourites
                  </button>
                </NavItem>
                <NavItem className={` ${activeTab === 2 ? 'active' : ''}`}>
                  <button
                    type="button"
                    className={`nav-link font-weight-bold pb-4 ${activeTab === 2 ? 'active' : ''}`}
                    onClick={() => {
                      this.toggle(2);
                    }}
                  >
                    All Benefits
                  </button>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className={`${activeTab === 1 ? 'active' : ''}`}>
                  <ProgressHOC service={service}>
                    <FlyoutFavourites service={service} flyoutActive={flyoutOpen} active={activeFavTab} />
                  </ProgressHOC>
                </TabPane>
                <TabPane tabId="2" className={`${activeTab === 2 ? 'active' : ''}`}>
                  <ProgressHOC service={service}>
                    <BenefitsList flyout />
                  </ProgressHOC>
                </TabPane>
              </TabContent>
            </div>
          </>
        </ClickOutside>
      </div>
    );
  }
}

Flyout.propTypes = {
  flyoutOpen: PropTypes.bool.isRequired,
  searchOpen: PropTypes.bool.isRequired,
  activeFavTab: PropTypes.bool.isRequired,
  activeAllTab: PropTypes.bool.isRequired,
  onCloseFlyout: PropTypes.func.isRequired,
  onSetActiveFavouritesTab: PropTypes.func.isRequired,
  onSetActiveAllTab: PropTypes.func.isRequired,
  service: ServicePropType,
};

const mapStateToProps = state => {
  const flyoutOpen = makeSelectFlyoutOpen(state);
  const searchOpen = makeSelectSearchOpen(state);
  const activeFavTab = makeSelectFavouritesTab(state);
  const activeAllTab = makeSelectAllTab(state);

  return {
    flyoutOpen,
    searchOpen,
    activeFavTab,
    activeAllTab,
  };
};

const mapDispatchToProps = dispatch => ({
  onCloseFlyout: () => dispatch(closeFlyout()),
  onSetActiveFavouritesTab: () => dispatch(setActiveFavouritesTab()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Flyout));
