/* eslint-disable array-callback-return */
/* eslint no-eval: 0 */
/*
 * CategoryPage
 *
 * This is what the user will see when visiting at the '/:service/:category' route
 *
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Card from '../../components/Card';
import ContainerInner from '../../components/ContainerInner';
import Progress from '../../components/HOC/Progress';
import { toJS } from '../../components/HOC/ToJS';
import Intro from '../../components/Intro';
import MastheadIntro from '../../components/MastheadIntro';
import Page from '../../components/Page';
import { chunk } from '../../utils/array';
import { categoryView } from '../App/actions';
import { getBenefitEligibilityStatus, getCompleteStatus } from '../Benefits/helpers';
import { BenefitPropType } from '../Benefits/propTypes';
import { makeSelectBenefits, makeSelectMultipleBenefitsById } from '../Benefits/selectors';
import { CalculationPropType } from '../Calculations/propTypes';
import { makeSelectCalculations } from '../Calculations/selectors';
import { CategoryPropType } from '../Categories/propTypes';
import { makeSelectCategories, makeSelectCategoryById } from '../Categories/selectors';
import { DependencyPropType } from '../Dependencies/propTypes';
import { makeSelectDependencies } from '../Dependencies/selectors';
import { FsCalculationPropType, FsCommitmentTypePropType } from '../FS/propTypes';
import { makeSelectCommitmentTypes, makeSelectFSCalculations } from '../FS/selectors';
import { OptionPropType } from '../Options/propTypes';
import { makeSelectOptions } from '../Options/selectors';
import { getProfile } from '../Questions/helpers';
import { QuestionPropType } from '../Questions/propTypes';
import { makeSelectMultipleQuestionsById, makeSelectQuestions } from '../Questions/selectors';
import { getServiceSlugFromService } from '../Services/helpers';
import { ServicePropType } from '../Services/propTypes';
import { SubAppPropType } from '../SubApps/propTypes';
import { makeSelectSubApps } from '../SubApps/selectors';
import { TagsPropType } from '../Tags/propTypes';
import { makeSelectTags } from '../Tags/selectors';
import CategoryPageLayoutBuilder from './CategoryPageLayoutBuilder';
import { getTags, getAllBenefitsIncludingCategories } from './helpers';
import MyBenefitsNumber from './MyBenefitsNumber';
import CategoryPageSubApps from './SubApps';

export class CategoryPage extends React.Component {
  // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      noQuestionsForCategory: false,
      showIntro: false,
      customLayout: false,
    };

    this.myRef = React.createRef();
  }

  componentDidMount() {
    window.dataLayer.push({ event: 'pageview' });
    const { benefits, onCategoryView, category } = this.props;
    onCategoryView();
    const benefitsWithQuestions = benefits.find(b => {
      if (b.additionalQuestions === null && b.internalQuestions === null) {
        return false;
      }
      return true;
    });

    if (!benefitsWithQuestions) {
      this.handleNoQuestions();
    }

    if (category.customLayout !== null && category.customLayout !== false) {
      this.handleCustomLayout();
    }
  }

  getBreadcrumb() {
    const { service, category } = this.props;

    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
        icon: 'home',
      },
      {
        text: category.name,
        active: false,
        icon: 'grid',
      },
    ];
  }

  getCommitmentTypes() {
    const { options, commitmentTypes } = this.props;

    return commitmentTypes.map(ct =>
      Object.assign({}, ct, {
        option: options.find(o => o.id === ct.option),
      }),
    );
  }

  getTopSubApps = () => {
    const { category, subApps } = this.props;
    const categorySubApps = category.subApps
      ? subApps.filter(sa => category.subApps.indexOf(sa.id) !== -1)
      : [];
    return categorySubApps;
  };

  getBottomSubApps = () => {
    const { category, subApps } = this.props;
    const categorySubApps = category.subAppsBottom
      ? subApps.filter(sa => category.subAppsBottom.indexOf(sa.id) !== -1)
      : [];
    return categorySubApps;
  };

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

  getStatus = item => {
    const isCategory = item.categories;

    const { id } = item;

    return isCategory ? getCompleteStatus() : this.getBenefitEligibilityStatus(id);
  };

  getCardStatus = item => {
    const { noQuestionsForCategory } = this.state;
    const eligibleStatus = this.getStatus(item);
    let cardClass;

    if (eligibleStatus.code === 1) {
      cardClass = 'disabled';
    } else if (eligibleStatus.code === 2) {
      cardClass = 'not-eligible';
    } else {
      cardClass = '';
    }

    let status;
    status = !noQuestionsForCategory ? eligibleStatus.code : undefined;
    if (
      item.additionalQuestions === undefined ||
      item.additionalQuestions === null ||
      item.additionalQuestions.length <= 0
    ) {
      cardClass = '';
      status = undefined;
    }

    if (item.usefulStatus) {
      cardClass = 'useful';
      status = 3;
    }

    if (noQuestionsForCategory) {
      cardClass = '';
    }

    return { cardClass, status };
  };

  getCards = allBenefitsIncludingCategories => {
    const { service, category, tags } = this.props;
    const { showIntro } = this.state;

    return (
      <>
        {!showIntro &&
          chunk(allBenefitsIncludingCategories, 4).map(row => (
            <Row key={`row-${row[0].id}`}>
              {row.map(item => {
                const isCategory = item.categories;
                const { id, strapline } = item;
                const title = isCategory ? item.name : item.title;
                let link = '';
                if (isCategory) {
                  link = `/${service.slug}/${item.slug}`;
                } else {
                  link = `/${service.slug}/${category.slug}/${item.slug}`;
                }

                return (
                  <Col key={id} xs="12" sm="6" lg="3" style={{ marginBottom: '28px' }}>
                    <Card
                      status={this.getCardStatus(item).status}
                      className={this.getCardStatus(item).cardClass}
                      link={link}
                      title={title}
                      text={strapline}
                      tags={getTags(item.benefitTags, tags, 'catpage')}
                    />
                  </Col>
                );
              })}
            </Row>
          ))}
      </>
    );
  };

  // eslint-disable-next-line consistent-return

  getMasthead = () => {
    const { category, service } = this.props;
    return (
      <>
        <MastheadIntro
          breadcrumbItems={this.getBreadcrumb()}
          title={category.name}
          description={category.description}
          imgSrc={this.getCategoryImage(category)}
          id={category.id}
          serviceName={service.serviceType}
        />
      </>
    );
  };

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

  handleNoQuestions = () => {
    this.setState({
      noQuestionsForCategory: true,
    });
  };

  handleCustomLayout = () => {
    this.setState({
      customLayout: true,
    });
  };

  render() {
    const { category, service, tags, benefits, allCategories } = this.props;
    const { index, showIntro, customLayout } = this.state;

    const allBenefitsIncludingCategories = getAllBenefitsIncludingCategories(
      benefits,
      category,
      allCategories,
    );
    const topSubApps = this.getTopSubApps();
    const bottomSubApps = this.getBottomSubApps();

    return (
      <Page
        title={`${category.name} | ${service.name}`}
        service={service}
        modalActive={showIntro}
        description="Based on the information you have provided so far:"
      >
        {this.getMasthead()}
        {!customLayout && (
          <>
            <ContainerInner className="no-padding-lrg">
              {!showIntro && (
                <CategoryPageSubApps service={service} category={category} allSubApps={topSubApps} />
              )}
              <Intro subtitle="Based on the information you have provided so far:" />
              {this.getCards(allBenefitsIncludingCategories)}
              {!showIntro && (
                <>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <CategoryPageSubApps service={service} category={category} allSubApps={bottomSubApps} />
                </>
              )}
            </ContainerInner>
            <Progress service={service}>
              <MyBenefitsNumber {...this.getStatus(allBenefitsIncludingCategories[index])} />
            </Progress>
          </>
        )}
        {customLayout && (
          <CategoryPageLayoutBuilder
            tags={tags}
            category={category}
            service={service}
            allBenefitsIncludingCategories={allBenefitsIncludingCategories}
            layout={category.pageLayout}
          ></CategoryPageLayoutBuilder>
        )}
      </Page>
    );
  }
}

CategoryPage.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  allBenefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  allCategories: PropTypes.arrayOf(CategoryPropType).isRequired,
  subApps: PropTypes.arrayOf(SubAppPropType).isRequired,
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  onCategoryView: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(TagsPropType).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const category = makeSelectCategoryById(state, ownProps.id);
  const benefits = makeSelectMultipleBenefitsById(state, category.toJS().benefits);

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
  const subApps = makeSelectSubApps(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);
  const fsCalculations = makeSelectFSCalculations(state);
  const tags = makeSelectTags(state);

  return {
    category,
    benefits,
    questions,
    options,
    dependencies,
    calculations,
    allQuestions,
    allBenefits,
    allCategories,
    subApps,
    commitmentTypes,
    fsCalculations,
    tags,
  };
};

const mapDispatchToProps = dispatch => ({
  onCategoryView: answers => dispatch(categoryView(answers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(CategoryPage)));
