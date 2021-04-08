import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Search from '../Search';
import { makeSelectBenefits } from '../../containers/Benefits/selectors';
import { CategoryPropType } from '../../containers/Categories/propTypes';
import { BenefitPropType } from '../../containers/Benefits/propTypes';
import { makeSelectCategories } from '../../containers/Categories/selectors';
import { getServiceSlugFromService } from '../../containers/Services/helpers';
import { ServicePropType } from '../../containers/Services/propTypes';
import { removeDuplicates } from '../../utils/array';
import { toJS } from '../HOC/ToJS';

const SearchPanel = ({
  renderInputOnly,
  service,
  benefits,
  categories,
  hasSubmitted,
  bgColor,
  history,
  title,
  text,
}) => {
  const getOptions = () => {
    const serviceCategories = categories.filter(category => service.categories.indexOf(category.id) !== -1);
    const serviceBenefits = [].concat(...serviceCategories.map(category => category.benefits));

    const BOptions = removeDuplicates(
      serviceBenefits.map(benefitId => {
        const benefit = benefits.find(b => b.id === benefitId);
        const category = categories.find(c => c.id === benefit.primaryCategory);
        if (!category) {
          throw new Error(
            'A benefit has a primary category that is not published or assigned to this service.',
          );
        }

        return {
          value: `${category.slug}`,
          label: `${category.name}`,
        };
      }),
      'value',
    ).sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });

    const COptions = removeDuplicates(
      serviceBenefits.map(benefitId => {
        const benefit = benefits.find(b => b.id === benefitId);
        const category = categories.find(c => c.id === benefit.primaryCategory);
        if (!category) {
          throw new Error(
            'A benefit has a primary category that is not published or assigned to this service.',
          );
        }

        return {
          value: `${category.slug}/${benefit.slug}`,
          label: `${benefit.title} | ${benefit.description}`,
        };
      }),
      'value',
    ).sort((a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    });
    return [...COptions, ...BOptions];
  };

  const getSearchPanel = () => (
    <Search
      options={getOptions()}
      placeholder="Search Benefits and Categories..."
      buttonText="Search"
      onSubmit={handleSubmit}
    />
  );

  const handleSubmit = value => {
    if (value === null) {
      return;
    }

    if (hasSubmitted) {
      hasSubmitted();
    }

    const url = `/${getServiceSlugFromService(service)}/${value}`;
    history.push(`${url}`);
  };

  if (renderInputOnly) {
    return getSearchPanel();
  }

  return (
    <div className={`search-panel search-panel-${bgColor}`}>
      <Row>
        <Col xs="12">
          {title && (
            <div className="search-panel-txt">
              <h1 className="h1-large">{title}</h1>
              <h2 className="h3">{text}</h2>
            </div>
          )}
          <div className="search-panel-search">
            <Row>
              <Col xs="12">{getSearchPanel()}</Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

SearchPanel.propTypes = {
  renderInputOnly: PropTypes.bool.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  bgColor: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  categories: PropTypes.arrayOf(CategoryPropType).isRequired,
  service: ServicePropType.isRequired,
  hasSubmitted: PropTypes.func,
};

const mapStateToProps = state => {
  const benefits = makeSelectBenefits(state);
  const categories = makeSelectCategories(state);
  return {
    benefits,
    categories,
  };
};

export default connect(mapStateToProps)(toJS(withRouter(SearchPanel)));
