import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Col, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
  addFavourites,
  removeFavourites,
  toggleFlyout,
  setActiveFavouritesTab,
  togglePinnedNav,
  toggleFixedNav,
} from '../../containers/App/actions';
import {
  makeSelectFlyoutOpen,
  makeSelectFavourites,
  makeSelectPinNav,
  makeSelectFixNav,
} from '../../containers/App/selectors';
import Breadcrumb from '../Breadcrumb';
import { toJS } from '../HOC/ToJS';

class MastheadIntro extends PureComponent {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.myTagNameRef = React.createRef();
  }

  componentDidMount() {
    this.toggleFavouriteBtn();
  }

  componentDidUpdate() {
    this.toggleFavouriteBtn();
  }

  getFavourite() {
    const { id, serviceName } = this.props;
    const allFavourites = JSON.parse(localStorage.getItem(`${serviceName}:favourites`)) || [];
    const currentFavourite = allFavourites.find(item => item === id);
    return { currentFavourite, allFavourites };
  }

  saveFavourite() {
    const {
      id,
      onToggleFlyout,
      flyoutOpen,
      pinNav,
      onaddFavourites,
      onRemoveFavourites,
      onSetActiveFavouritesTab,
      onTogglePinnedNav,
      onToggleFixedNav,
      serviceName,
      fixNav,
    } = this.props;
    const { currentFavourite } = this.getFavourite();
    const { allFavourites } = this.getFavourite();
    if (!currentFavourite) {
      allFavourites.unshift(id);
      this.toggleFavouriteBtn();
      localStorage.setItem(`${serviceName}:favourites`, JSON.stringify(allFavourites));
      onaddFavourites();
      onSetActiveFavouritesTab();
      if (!flyoutOpen) {
        setTimeout(() => {
          if (!fixNav) {
            onToggleFixedNav();
          }
          if (!pinNav) {
            onTogglePinnedNav();
          }

          onToggleFlyout();
        }, 200);
      }
    } else {
      allFavourites.shift(id);
      this.toggleFavouriteBtn();
      localStorage.setItem(`${serviceName}:favourites`, JSON.stringify(allFavourites));
      onRemoveFavourites();
    }
  }

  toggleFavouriteBtn() {
    const el = this.myRef.current;
    const tagname = this.myTagNameRef.current;
    const { id } = this.props;
    if (!id) {
      return;
    }
    const { currentFavourite } = this.getFavourite();

    if (currentFavourite) {
      el.classList.add('active');
      tagname.innerHTML = 'Favourited';
    } else {
      el.classList.remove('active');
      tagname.innerHTML = 'Favourite';
    }
  }

  render() {
    const { breadcrumbItems, title, description, imgSrc, tags, closeBtn, id } = this.props;

    return (
      <div className="masthead-intro">
        {closeBtn}
        <Row center="xs">
          <Col className="masthead-intro__col" lg="6" md="12">
            <div className="masthead-intro-col__inr">
              <Breadcrumb items={breadcrumbItems} />
              <h1 className="h1 masthead-intro__title" data-title={title}>
                {title}
              </h1>
              <h3>{description}</h3>
              <div className="masthead-intro__tags">
                {tags &&
                  tags.map((tag, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <span
                      className={`${
                        tag.globalFamilyTag ? 'masthead-intro__tag--fam ' : ''
                      } masthead-intro__tag`}
                      key={`benefitTag-${index}`}
                    >
                      {tag.name}
                    </span>
                  ))}
              </div>
            </div>
          </Col>
          <Col className="masthead-intro__col" lg="6" md="12">
            <div className="masthead-intro__bg" style={{ backgroundImage: `url(${imgSrc})` }}></div>
            {id && (
              <button
                ref={this.myRef}
                data-ga-category="Favourite"
                data-ga-action="Star Icon Click"
                data-ga-label={title}
                type="button"
                className="masthead-intro__favourite"
                onClick={() => this.saveFavourite()}
              >
                <span ref={this.myTagNameRef} className="masthead-intro-favourite__txt">
                  Favourite
                </span>
              </button>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

MastheadIntro.propTypes = {
  breadcrumbItems: PropTypes.array.isRequired,
  title: PropTypes.string,
  imgSrc: PropTypes.string,
  id: PropTypes.string,
  description: PropTypes.string,
  serviceName: PropTypes.string,
  tags: PropTypes.array,
  closeBtn: PropTypes.object,
  onaddFavourites: PropTypes.func.isRequired,
  onRemoveFavourites: PropTypes.func.isRequired,
  flyoutOpen: PropTypes.bool.isRequired,
  pinNav: PropTypes.bool.isRequired,
  fixNav: PropTypes.bool.isRequired,
  onToggleFlyout: PropTypes.func.isRequired,
  onSetActiveFavouritesTab: PropTypes.func.isRequired,
  onTogglePinnedNav: PropTypes.func.isRequired,
  onToggleFixedNav: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onaddFavourites: () => dispatch(addFavourites()),
  onRemoveFavourites: () => dispatch(removeFavourites()),
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onSetActiveFavouritesTab: () => dispatch(setActiveFavouritesTab()),
  onTogglePinnedNav: () => dispatch(togglePinnedNav()),
  onToggleFixedNav: () => dispatch(toggleFixedNav()),
});

const mapStateToProps = state => {
  const flyoutOpen = makeSelectFlyoutOpen(state);
  const favourites = makeSelectFavourites(state);
  const pinNav = makeSelectPinNav(state);
  const fixNav = makeSelectFixNav(state);
  return {
    flyoutOpen,
    favourites,
    pinNav,
    fixNav,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(MastheadIntro)));
