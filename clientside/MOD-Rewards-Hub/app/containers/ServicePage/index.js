/*
 * ServicePage
 *
 * This is what the user will see when visiting at the '/:service' route
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import ContainerInner from '../../components/ContainerInner';
import { toJS } from '../../components/HOC/ToJS';
import MastheadQuestions from '../../components/MastheadQuestions';
import Masthead from '../../components/Masthead';
import ServicePageIntro from '../../components/ServicePageIntro';
import Page from '../../components/Page';
import SearchPanel from '../../components/SearchPanel';
import { chunk } from '../../utils/array';
import { getBenefitEligibilityStatus } from '../Benefits/helpers';
import { BenefitPropType } from '../Benefits/propTypes';
import { makeSelectBenefits } from '../Benefits/selectors';
import { CalculationPropType } from '../Calculations/propTypes';
import { makeSelectCalculations } from '../Calculations/selectors';
import { CategoryPropType } from '../Categories/propTypes';
import { makeSelectCategories, makeSelectMultipleCategoriesById } from '../Categories/selectors';
import { DependencyPropType } from '../Dependencies/propTypes';
import { makeSelectDependencies } from '../Dependencies/selectors';
import { FsCalculationPropType } from '../FS/propTypes';
import { makeSelectCommitmentTypes, makeSelectFSCalculations } from '../FS/selectors';
import { OptionPropType } from '../Options/propTypes';
import { makeSelectOptions } from '../Options/selectors';
import { getProfile } from '../Questions/helpers';
import { QuestionPropType } from '../Questions/propTypes';
import { makeSelectMultipleQuestionsById, makeSelectQuestions } from '../Questions/selectors';
import { getServiceSlugFromService } from '../Services/helpers';
import { ServicePropType } from '../Services/propTypes';
import { makeSelectServiceById } from '../Services/selectors';
import servicePageMessages from './messages';
import ProgressHOC from '../../components/HOC/Progress';
import { makeSelectFlyoutOpen } from '../App/selectors';
import { toggleFlyout, setActiveAllTab } from '../App/actions';

export class ServicePage extends React.PureComponent {
  componentDidMount() {
    window.dataLayer.push({ event: 'pageview' });

    if (window.location.search === '?=menuOpen') {
      window.dataLayer.push({ event: 'pageview' });
      const { onToggleFlyout, flyoutOpen, onSetActiveAllTab } = this.props;

      if (!flyoutOpen) {
        setTimeout(() => {
          onToggleFlyout();
          onSetActiveAllTab();
        }, 3000);
      }
    }
  }

  getBreadcrumb() {
    const { service } = this.props;
    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: false,
        icon: 'home',
      },
    ];
  }

  getCategoryImage(category) {
    const { service } = this.props;

    switch (service.serviceType) {
      case 'navy':
        return category.cardImageNavy;
      case 'army':
        return category.cardImageArmy;
      case 'raf':
        return category.cardImageRaf;
      case 'marines':
        return category.cardImageMarines;
      case '_test_-service':
        return category.cardImageMarines;
      default:
        return '';
    }
  }

  getBenefitEligibilityStatus(id) {
    const {
      allQuestions,
      allBenefits,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      allCategories,
      fsCalculations,
    } = this.props;
    const profile = getProfile(allQuestions);
    return getBenefitEligibilityStatus(
      id,
      profile,
      allBenefits,
      allQuestions,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      allCategories,
      fsCalculations,
    );
  }

  getCategoryEligibilityStatus(category) {
    const {
      benefits,
      questions,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      categories,
      fsCalculations,
      allQuestions,
    } = this.props;
    const profile = getProfile(allQuestions);
    const categoryBenefits = category.benefits;
    const catBenefits = benefits
      .filter(benefit => categoryBenefits.find(id => benefit.id === id))
      .filter(b => b.additionalQuestions && b.additionalQuestions.length > 0)
      .map(benefit =>
        getBenefitEligibilityStatus(
          benefit.id,
          profile,
          benefits,
          questions,
          calculations,
          dependencies,
          options,
          service,
          commitmentTypes,
          categories,
          fsCalculations,
        ),
      );

    const statusBenefits = catBenefits.map(b => ({
      benefitID: `${b.benefitId}`,
      benefit: `${b.benefit}`,
      status: `${b.status}`,
      code: `${b.code}`,
      class: `${b.class}`,
    }));

    let Eltotal = 0;
    let Mtotal = 0;
    statusBenefits.forEach(b => {
      if (b.code === '0') {
        Eltotal += 1;
      } else if (b.code === '1') {
        Mtotal += 1;
      }
    });

    return {
      category: `${category.name}`,
      eligibileBenefits: statusBenefits.length || null,
      Eltotal,
      Mtotal,
    };
  }

  render() {
    const { categories, service, intl } = this.props;
    const { slug } = service;
    const sortedCategories = categories.sort(
      (a, b) => service.categories.indexOf(a.id) - service.categories.indexOf(b.id),
    );
    const chunkCategories = chunk(sortedCategories, 4);
    // const title = intl.formatMessage({ id: servicePageMessages.header.id });
    const searchTitle = intl.formatMessage({ id: servicePageMessages.header.searchTitle });
    const searchSubtitle = intl.formatMessage({ id: servicePageMessages.header.searchSubtitle });

    return (
      <Page title={service.name} service={service} description={searchSubtitle}>
        <ContainerInner className="no-padding-lrg">
          <Row>
            <Col xs="12">
              <ServicePageIntro service={service} title={searchTitle} text={searchSubtitle} />
            </Col>
          </Row>

          <Row>
            <Col xs="12">
              <div className="masthead-wrap">
                <Masthead imgSrc={service.headerImage} />
                <ProgressHOC service={service}>
                  <MastheadQuestions
                    service={service}
                    title="Your benefit package:"
                    description="Answer one question about yourself to find out some of the benefits and allowances you are likely to be eligible for."
                  />
                </ProgressHOC>
              </div>
              <SearchPanel service={service} renderInputOnly={false} />
            </Col>
          </Row>
          {chunkCategories.map(categoryGroup => (
            <Row key={`ServicePage-row:${categoryGroup[0].id}`}>
              {categoryGroup.map(category => (
                <Col
                  key={`ServicePage-col:${category.id}`}
                  xs="12"
                  sm="6"
                  lg="3"
                  style={{ marginBottom: '28px' }}
                >
                  <Card
                    link={`/${slug}/${category.slug}`}
                    title={category.name}
                    text={category.strapline}
                    hideTextOnXs
                    image={this.getCategoryImage(category)}
                    buttonText={`${category.name}`}
                    eligibility={this.getCategoryEligibilityStatus(category)}
                  />
                </Col>
              ))}
            </Row>
          ))}
        </ContainerInner>
      </Page>
    );
  }
}

ServicePage.propTypes = {
  intl: PropTypes.object.isRequired,
  service: ServicePropType,
  flyoutOpen: PropTypes.bool,
  categories: PropTypes.arrayOf(CategoryPropType).isRequired,
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  allBenefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  allCategories: PropTypes.arrayOf(CategoryPropType).isRequired,
  commitmentTypes: PropTypes.array.isRequired,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  onToggleFlyout: PropTypes.func,
  onSetActiveAllTab: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const service = makeSelectServiceById(state, ownProps.id);
  const categories = makeSelectMultipleCategoriesById(state, service.toJS().categories);
  const benefits = makeSelectBenefits(state);
  const allBenefitQuestionIds = benefits.toJS().map(benefit => benefit.additionalQuestions);
  const questions = makeSelectMultipleQuestionsById(
    state,
    Array.from(new Set([].concat(...allBenefitQuestionIds))),
  );
  const allCategories = makeSelectCategories(state);
  const allQuestions = makeSelectQuestions(state);
  const allBenefits = makeSelectBenefits(state);
  const options = makeSelectOptions(state);
  const dependencies = makeSelectDependencies(state);
  const calculations = makeSelectCalculations(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);
  const fsCalculations = makeSelectFSCalculations(state);
  const flyoutOpen = makeSelectFlyoutOpen(state);

  return {
    service,
    categories,
    flyoutOpen,
    benefits,
    questions,
    allCategories,
    allQuestions,
    allBenefits,
    options,
    dependencies,
    calculations,
    commitmentTypes,
    fsCalculations,
  };
};

const mapDispatchToProps = dispatch => ({
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(ServicePage)));
