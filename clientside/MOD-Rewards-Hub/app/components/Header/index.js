import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import debounce from 'lodash/debounce';
import SearchPanel from '../SearchPanel';
import { toggleFlyout, toggleSearch, togglePinnedNav, toggleFixedNav } from '../../containers/App/actions';
import {
  makeSelectFlyoutOpen,
  makeSelectSearchOpen,
  makeSelectPinNav,
  makeSelectFixNav,
  makeSelectFavourites,
} from '../../containers/App/selectors';
import { makeSelectUpdates } from '../../containers/Updates/selectors';
import { UpdatePropType } from '../../containers/Updates/propTypes';
import CompareIcon from '../../images/svg/compare.svg';
import CloseIcon from '../../images/svg/cross-white.svg';
import ClearAll from '../../images/svg/clear-all-questions.svg';
import StarIcon from '../../images/svg/star-grey.svg';
import SearchIcon from '../../images/svg/search.svg';
import UpdatesIcon from '../../images/svg/updates.svg';
import Flyout from '../Flyout';
import ProgressHOC from '../HOC/Progress';
import { toJS } from '../HOC/ToJS';
import TotalBenefits from './TotalBenefits';
import { getNumOfServiceFavourites } from '../../containers/Services/helpers';
import { getNumOfUpdates } from '../../containers/Updates/helpers';

export class H extends React.PureComponent {
  constructor(props) {
    super(props);
    this.headerRef = React.createRef();
    this.debouncedFunction = debounce(this.handleNavPin, 200);
    this.state = {
      scrollPos: null,
      favourites: 0,
      updates: 0,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.debouncedFunction);
    const { service } = this.props;
    const favourites = getNumOfServiceFavourites(service);
    const newUpdates = this.getNumUpdates().NewUpdates;
    if (this.state.favourites !== favourites) {
      this.setState({
        favourites,
      });
    }
    if (this.state.updates !== newUpdates) {
      this.setState({
        updates: newUpdates,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.searchOpen === false && nextProps.searchOpen === true) {
      setTimeout(() => {
        const searchElement = document.querySelector('#Search');
        if (searchElement) {
          searchElement.focus();
        }
      }, 500);
    }
  }

  componentDidUpdate() {
    const { service } = this.props;
    const favourites = getNumOfServiceFavourites(service);
    const newUpdates = this.getNumUpdates().NewUpdates;

    if (this.state.favourites !== favourites) {
      this.setState({
        favourites,
      });
    }
    if (this.state.updates !== newUpdates) {
      this.setState({
        newUpdates,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.debouncedFunction);
  }

  getFavouritesItem() {
    return (
      <React.Fragment>
        <li role="none" className="nav-item nav-item-favourites">
          <button
            type="button"
            id="favourites"
            data-ga-category="header"
            data-ga-action="delete"
            data-ga-label="Favourites"
            className="nav-link"
            onClick={e => {
              this.handleFavouritesClick(e);
            }}
          >
            <span
              data-ga-category="header"
              data-ga-action="click"
              data-ga-label="Favourites"
              className="nav-icon icon-favourite"
            >
              <StarIcon />
            </span>
            <span
              data-ga-category="header"
              data-ga-action="click"
              data-ga-label="Favourites"
              className="nav-link-text"
            >
              Favourites
            </span>
          </button>
        </li>
      </React.Fragment>
    );
  }

  getProgressAndRestart(id) {
    return (
      <React.Fragment>
        <li role="none" className="nav-item nav-item-reset">
          <button
            id={id}
            data-ga-category="header"
            data-ga-action="delete"
            data-ga-label="Reset details"
            className="nav-link"
            type="button"
            onClick={e => {
              this.handleDeleteProfile(e);
            }}
          >
            <span
              data-ga-category="header"
              data-ga-action="click"
              data-ga-label="Reset details"
              className="nav-icon icon-reset"
            >
              <ClearAll />
            </span>
            <span
              data-ga-category="header"
              data-ga-action="click"
              data-ga-label="Reset details"
              className="nav-link-text"
            >
              Clear all eligibility questions
            </span>
          </button>
        </li>
      </React.Fragment>
    );
  }

  resetUpdates = () => {
    this.setState({
      updates: 0,
    });
  };

  handleProgressClick = () => {
    const { history, profileLink } = this.props;
    history.push(profileLink);
  };

  handleDeleteProfile = e => {
    const { service, deleteProfile } = this.props;
    e.preventDefault();

    deleteProfile(service);
  };

  toggleActive = type => {
    this.setState(prevstate => ({
      [`${type}Active`]: !prevstate[`${type}Active`],
    }));
  };

  handleCloseClick = e => {
    e.preventDefault();
    const { onToggleFlyout, flyoutOpen } = this.props;
    this.toggleActive('benefits');

    if (!flyoutOpen) {
      onToggleFlyout();
    }
  };

  handleFavouritesClick = e => {
    e.preventDefault();
    const { onToggleFlyout, flyoutOpen, onToggleFixedNav, onTogglePinnedNav, pinNav, fixNav } = this.props;
    this.toggleActive('benefits');

    if (!pinNav) {
      onTogglePinnedNav();
    }
    if (!fixNav) {
      onToggleFixedNav();
    }

    if (!flyoutOpen) {
      onToggleFlyout();
    }
  };

  handleNavPin = e => {
    e.preventDefault();
    const { onToggleFixedNav, onTogglePinnedNav, pinNav, fixNav } = this.props;

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = winScroll / height;

    if (scrolled === 0 || this.state.scrollPos === null || this.state.scrollPos < 0.04) {
      if (!pinNav) {
        onTogglePinnedNav();
      }
      if (!fixNav) {
        onToggleFixedNav();
      }
    } else if (this.state.scrollPos > scrolled && this.state.scrollPos > 0.1) {
      // scrolled up
      if (!pinNav) {
        onTogglePinnedNav();
      }
      if (!fixNav) {
        onToggleFixedNav();
      }
    } else if (this.state.scrollPos < scrolled && this.state.scrollPos > 0.1) {
      // scrolled down
      if (pinNav) {
        onTogglePinnedNav();
      }
      if (fixNav) {
        onToggleFixedNav();
      }
    }

    this.setState({
      scrollPos: scrolled,
    });
  };

  getNumUpdates() {
    const { updates, service } = this.props;
    return getNumOfUpdates(updates, service);
  }

  render() {
    const { favourites, updates } = this.state;
    const { service, onToggleSearch, searchOpen, flyoutOpen, pinNav, fixNav } = this.props;
    return (
      <React.Fragment>
        <nav
          ref={this.headerRef}
          className={`header-nav ${fixNav ? 'is-fixed' : ''} ${pinNav ? 'is-pinned' : 'is-unpinned'} ${
            flyoutOpen ? 'is-stuck' : ''
          }`}
        >
          <ul role="menubar" className="nav-row nav-row-first">
            <li role="none" className="nav-item nav-item-logo">
              <Link
                data-ga-category="header"
                data-ga-action="click"
                data-ga-label="Home"
                role="menuitem"
                className="nav-link"
                to={`/${service.slug}`}
              >
                <div
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="Home"
                  style={{ backgroundImage: `url(${service.logo})` }}
                  className={`nav-logo ${service.name.toLowerCase()}-logo`}
                  alt={`${service.name}-logo`}
                ></div>
              </Link>
            </li>
            <li role="none" className="nav-item nav-item-compare">
              <Link
                data-ga-category="header"
                data-ga-action="click"
                data-ga-label="change-of-circumstances"
                role="menuitem"
                className="nav-link"
                to={`/${service.slug}/change-of-circumstances`}
              >
                <span
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="change-of-circumstances"
                  className="nav-icon icon-compare"
                >
                  <CompareIcon />
                </span>
                <span
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="change-of-circumstances"
                  className="nav-link-text"
                >
                  <span>Change of </span>circumstances
                </span>
              </Link>
            </li>
            <li role="none" className="nav-item nav-item-search">
              <button
                onClick={e => {
                  e.preventDefault();
                  onToggleSearch();
                }}
                type="button"
                role="menuitem"
                className={`nav-link ${searchOpen ? 'is-active' : ''}`}
                data-ga-category="header"
                data-ga-action="click"
                data-ga-label="open search"
              >
                <span
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="open search"
                  className="nav-icon icon-search"
                >
                  <SearchIcon />
                </span>
                <span
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="open search"
                  className="nav-link-text"
                >
                  Search <span>benefits</span>
                </span>
              </button>
            </li>
            <li role="none" className="nav-item nav-item-updates">
              <Link
                onClick={() => {
                  this.toggleActive('updates');
                  this.resetUpdates();
                }}
                role="menuitem"
                data-ga-category="header"
                data-ga-action="click"
                data-ga-label="Updates"
                className="nav-link"
                to={`/${service.slug}/updates`}
              >
                <span
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="Updates"
                  className="nav-icon icon-updates"
                >
                  <UpdatesIcon />
                  {updates > 0 && <span className="nav-item-updates__counter">{updates}</span>}
                </span>
                <span
                  data-ga-category="header"
                  data-ga-action="click"
                  data-ga-label="Updates"
                  className="nav-link-text"
                >
                  Updates
                </span>
              </Link>
            </li>
            {this.getFavouritesItem()}
            {this.getProgressAndRestart('desktop-reset-details')}
            <li role="none" className="nav-item nav-item-benefits">
              <div
                role="menuitem"
                className={`nav-link has-submenu ${flyoutOpen ? 'is-active' : ''}`}
                data-ga-category="my benefits flyout"
                data-ga-action="link click"
                data-ga-label="flyout"
              >
                {!flyoutOpen && (
                  <ProgressHOC service={service}>
                    <TotalBenefits favourites={favourites} />
                  </ProgressHOC>
                )}
                {flyoutOpen && (
                  <button type="button" onClick={this.handleCloseClick}>
                    <span className="nav-icon icon-close">
                      <CloseIcon />
                    </span>
                    <span className="nav-link-text">Close</span>
                  </button>
                )}
              </div>
            </li>
          </ul>
          <div className={`header-searchbar ${searchOpen ? 'is-active' : ''}`}>
            {searchOpen && (
              <SearchPanel
                bgColor="bg-gray"
                title="Welcome"
                text="Explore all of your personal benefits, entitlements and allowances."
                service={service}
                hasSubmitted={onToggleSearch}
                renderInputOnly
                data-ga-category="header"
                data-ga-action="select"
                data-ga-label="Search"
              />
            )}
          </div>
          <ul className="nav-row nav-row-last">{this.getProgressAndRestart('mobile-reset-details')}</ul>
          <Flyout service={service} />
        </nav>
      </React.Fragment>
    );
  }
}

H.propTypes = {
  profileLink: PropTypes.string,
  service: PropTypes.object,
  onToggleFlyout: PropTypes.func.isRequired,
  onToggleSearch: PropTypes.func.isRequired,
  onToggleFixedNav: PropTypes.func.isRequired,
  onTogglePinnedNav: PropTypes.func.isRequired,
  searchOpen: PropTypes.bool.isRequired,
  flyoutOpen: PropTypes.bool.isRequired,
  pinNav: PropTypes.bool.isRequired,
  fixNav: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  deleteProfile: PropTypes.func.isRequired,
  updates: PropTypes.arrayOf(UpdatePropType),
};

const mapStateToProps = state => {
  const searchOpen = makeSelectSearchOpen(state);
  const flyoutOpen = makeSelectFlyoutOpen(state);
  const pinNav = makeSelectPinNav(state);
  const fixNav = makeSelectFixNav(state);
  const favourites = makeSelectFavourites(state);
  const updates = makeSelectUpdates(state);

  return {
    searchOpen,
    flyoutOpen,
    pinNav,
    fixNav,
    favourites,
    updates,
  };
};

const mapDispatchToProps = dispatch => ({
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onToggleSearch: () => dispatch(toggleSearch()),
  onTogglePinnedNav: () => dispatch(togglePinnedNav()),
  onToggleFixedNav: () => dispatch(toggleFixedNav()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(withRouter(H)));
