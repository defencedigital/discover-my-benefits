import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { removeFavourites, closeFlyout } from '../../containers/App/actions';
import { makeSelectFavourites } from '../../containers/App/selectors';
import { BenefitPropType } from '../../containers/Benefits/propTypes';
import { makeSelectBenefits } from '../../containers/Benefits/selectors';
import { CategoryPropType } from '../../containers/Categories/propTypes';
import { makeSelectCategories } from '../../containers/Categories/selectors';
import { toJS } from '../HOC/ToJS';

export class FF extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      anim: false,
    };
  }

  componentDidUpdate() {
    const { active, flyoutActive } = this.props;
    if (active && flyoutActive) {
      this.setState({
        anim: true,
      });
    } else {
      this.setState({
        anim: false,
      });
    }
  }

  getBenefitImage(benefit) {
    const { service } = this.props;

    switch (service.serviceType) {
      case 'navy':
        return benefit.benefitImageNavy;
      case 'army':
        return benefit.benefitImageArmy;
      case 'raf':
        return benefit.benefitImageRaf;
      case 'marines':
        return benefit.benefitImageMarines;
      case '_test_-service':
        return benefit.benefitImageMarines;
      default:
        return '';
    }
  }

  getCategoryImage(category) {
    const { service } = this.props;

    switch (service.serviceType) {
      case 'navy':
        return category.catImageNavy;
      case 'army':
        return category.catImageArmy;
      case 'raf':
        return category.catImageRaf;
      case 'marines':
        return category.catImageMarines;
      case '_test_-service':
        return category.catImageMarines;
      default:
        return '';
    }
  }

  getFavourite(id) {
    const { service } = this.props;
    const allFavourites = JSON.parse(localStorage.getItem(`${service.serviceType}:favourites`)) || [];
    const currentFavourite = allFavourites.find(item => item === id);
    return { currentFavourite, allFavourites };
  }

  getBenefitStatus(itemID) {
    const { progress } = this.props;
    let status;
    Object.keys(progress.benefits).forEach(id => {
      const category = progress.benefits[id];
      category.map(b => {
        if (itemID === b.benefitId) {
          status = <span className={`flyout-card__status icon icon-${b.class}`}></span>;
        }
        return false;
      });
    });

    return status;
  }

  getFavourites() {
    const { benefits, service, categories } = this.props;
    const localFavourites = JSON.parse(localStorage.getItem(`${service.serviceType}:favourites`)) || [];

    const favourites = localFavourites.map(itemID => {
      const benefit = benefits.find(b => b.id === itemID);
      const category = benefit
        ? categories.find(c => c.id === benefit.primaryCategory)
        : categories.find(c => c.id === itemID);
      if (!benefit && !category) {
        return false;
      }

      const id = benefit ? benefit.id : category.id;
      const title = benefit ? benefit.title : category.name;
      const tags = benefit ? benefit.benefitTags : null;
      const catId = benefit ? category.id : null;
      const img = benefit ? this.getBenefitImage(benefit) : this.getCategoryImage(category);
      const slug = benefit
        ? `/${service.slug}/${category.slug}/${benefit.slug}`
        : `/${service.slug}/${category.slug}`;
      return {
        slug,
        id,
        title,
        tags,
        img,
        catId,
      };
    });

    return favourites;
  }

  removeThisFavourite(e) {
    const { service, onRemoveFavourites } = this.props;
    const { id } = e.target.dataset;
    const { allFavourites } = this.getFavourite(id);
    const { currentFavourite } = this.getFavourite(id);
    if (currentFavourite) {
      const newFavourites = allFavourites.filter(i => i !== id);
      localStorage.setItem(`${service.serviceType}:favourites`, JSON.stringify(newFavourites));
      onRemoveFavourites();
    }
  }

  closeTheFlyout() {
    const { onCloseFlyout } = this.props;
    onCloseFlyout();
  }

  renderDefaultMessage() {
    return (
      <div className="flyout-favourites__default">
        <span className="flyout-favourites-default__star"></span>
        <p className="flyout-favourites-default__txt">
          You can favourite most pages of this site and they will all appear in this section. If you are
          interested in a benefit, click the star icon on its page to send it here.
        </p>
      </div>
    );
  }

  render() {
    const favourites = this.getFavourites();
    const { anim } = this.state;
    const animClass = anim ? 'animate-in' : '';

    return (
      <div className={`flyout-favourites ${animClass}`}>
        {favourites.length > 0 &&
          favourites.map(item => (
            <React.Fragment key={`flyout-card-${item.id}`}>
              {item.id && item.slug && (
                <div className="flyout-card" key={`${item.id}${item.slug}`}>
                  <div className="flyout-card__link" to={item.slug}>
                    <Row>
                      <Col className="flyout-card__col" xs="5">
                        <div
                          className="flyout-card__img"
                          style={{ backgroundImage: `url(${item.img})` }}
                        ></div>
                        {this.getBenefitStatus(item.id)}
                      </Col>
                      <Col className="flyout-card__col" xs="7">
                        <Link
                          data-ga-category="My Benefits Flyout"
                          data-ga-action="Favourites"
                          data-ga-label={item.title}
                          onClick={e => this.closeTheFlyout(e)}
                          to={item.slug}
                        >
                          <div className="flyout-card__title">{item.title}</div>
                        </Link>
                      </Col>
                    </Row>
                  </div>
                  <button
                    type="button"
                    className="btn flyout-card__close"
                    data-id={item.id}
                    onClick={e => this.removeThisFavourite(e)}
                  >
                    close
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        {favourites.length <= 0 && this.renderDefaultMessage()}
      </div>
    );
  }
}

FF.propTypes = {
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  categories: PropTypes.arrayOf(CategoryPropType).isRequired,
  service: PropTypes.object.isRequired,
  onRemoveFavourites: PropTypes.func.isRequired,
  onCloseFlyout: PropTypes.func.isRequired,
  progress: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired,
  flyoutActive: PropTypes.bool.isRequired,
};

const mapStateToProps = state => {
  const favourites = makeSelectFavourites(state);
  const benefits = makeSelectBenefits(state);
  const categories = makeSelectCategories(state);

  return {
    favourites,
    benefits,
    categories,
  };
};

const mapDispatchToProps = dispatch => ({
  onRemoveFavourites: () => dispatch(removeFavourites()),
  onCloseFlyout: () => dispatch(closeFlyout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(withRouter(FF))));
