/*
 * FS Comparator
 */

import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Breadcrumb from '../../../components/Breadcrumb/index';
import Button from '../../../components/Button';
import ComparatorComponent from '../../../components/Comparator';
import ContainerInner from '../../../components/ContainerInner/index';
import FormBuilder from '../../../components/FormBuilder';
import { toJS } from '../../../components/HOC/ToJS';
import Intro from '../../../components/Intro/index';
import Jumbotron from '../../../components/Jumbotron';
import Page from '../../../components/Page/index';
import PayRange from '../../../json/pay/payRange.json';
import { isOF5AndAbove } from '../../../modules/Pay/utils';
import { chunk } from '../../../utils/array';
import { formatCurrency } from '../../../utils/currency';
import BenefitPage from '../../BenefitPage/Loadable';
import { getInternalQuestionsForBenefit } from '../../Benefits/helpers';
import { BenefitPropType } from '../../Benefits/propTypes';
import { makeSelectBenefits } from '../../Benefits/selectors';
import { makeSelectCalculations } from '../../Calculations/selectors';
import { CategoryPropType } from '../../Categories/propTypes';
import { DependencyPropType } from '../../Dependencies/propTypes';
import { makeSelectDependencies } from '../../Dependencies/selectors';
import { OptionPropType } from '../../Options/propTypes';
import { makeSelectOptions } from '../../Options/selectors';
import { updateAnswers } from '../../Questions/actions';
import { getProfile, mergeObjectValuesWithQuestions, questionsToFormBuilder } from '../../Questions/helpers';
import { QuestionPropType } from '../../Questions/propTypes';
import { makeSelectQuestions } from '../../Questions/selectors';
import { getServiceSlugFromService } from '../../Services/helpers';
import { ServicePropType } from '../../Services/propTypes';
import { SubAppPropType } from '../../SubApps/propTypes';
import { makeSelectSubAppById } from '../../SubApps/selectors';
import { FsCalculationPropType, FsCommitmentTypePropType, FsPropType } from '../propTypes';
import { makeSelectCommitmentTypes, makeSelectFS, makeSelectFSCalculations } from '../selectors';

export class Comparator extends React.PureComponent {
  static calculateLeaveByDays(days, multiple, expressLeaveAsHalfDay) {
    if (expressLeaveAsHalfDay) {
      return (Math.round(days * multiple * 2) / 2).toFixed(1);
    }
    return Math.ceil(days * multiple);
  }

  static scrollComparatorIntoView() {
    const comparator = document.getElementById('comparator');

    if (comparator) {
      comparator.scrollIntoView();
    }
  }

  static calculateSalaryTotal(payLevel, fromDailyRate, days, percentage, xFactor) {
    const salaryWithoutXFactor = payLevel / (100 + 14.5);
    const salaryWithXFactor = salaryWithoutXFactor * (100 + xFactor);
    const salaryWithReduction = salaryWithXFactor * (1 - percentage / 100);

    if (!fromDailyRate) {
      return formatCurrency(salaryWithReduction);
    }

    const payLevelInDays = salaryWithReduction / 365.23;
    return formatCurrency(payLevelInDays * days);
  }

  state = {
    showComparator: false,
    currentCommitmentType: null,
    formError: false,
    answers: {},
    currentProfile: getProfile(this.props.allQuestions),
    isMPGS: false,
  };

  componentDidMount() {
    const { allQuestions } = this.props;
    const profile = getProfile(allQuestions);

    this.setState({
      currentCommitmentType: profile.servingtype,
      currentProfile: profile,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { allQuestions } = nextProps;
    const profile = getProfile(allQuestions);

    this.setState({
      currentCommitmentType: profile.servingtype,
      currentProfile: profile,
    });
  }

  getBreadcrumb() {
    const { service, category, fs } = this.props;

    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
        icon: 'home',
      },
      {
        text: category.name,
        slug: `/${getServiceSlugFromService(service)}/${category.slug}`,
        active: true,
        icon: 'grid',
      },
      {
        text: fs.title,
        active: false,
      },
    ];
  }

  getPayBenefitForm = () => {
    const { allBenefits, allQuestions, options } = this.props;
    const payBenefit = allBenefits.find(b => b.internalQuestions === 'pay');

    const additionalQuestions = payBenefit.additionalQuestions || [];

    return chunk(
      questionsToFormBuilder(
        allQuestions
          .filter(q => additionalQuestions.indexOf(q.id) !== -1)
          .sort((a, b) => {
            if (additionalQuestions.indexOf(a.id) > additionalQuestions.indexOf(b.id)) {
              return 1;
            }
            return -1;
          }),
        options,
      ),
      2,
    ).concat([].concat(...[this.getInternalQuestionsForBenefit(payBenefit)]));
  };

  getInternalQuestionsForBenefit(benefit) {
    const { service, allBenefits, allQuestions, commitmentTypes, options, fsCalculations } = this.props;
    const { answers } = this.state;

    return getInternalQuestionsForBenefit(
      service,
      benefit,
      allBenefits,
      mergeObjectValuesWithQuestions(answers, allQuestions),
      commitmentTypes,
      options,
      fsCalculations,
    );
  }

  getCurrentCommitmentType() {
    const { options, commitmentTypes } = this.props;
    const { currentCommitmentType } = this.state;
    if (currentCommitmentType === 'mpgs') {
      this.setState({ isMPGS: true });
    } else {
      this.setState({ isMPGS: false });
    }
    const currentCommitmentTypeOption = options.find(o => o.value === currentCommitmentType);
    if (!currentCommitmentTypeOption) {
      return null;
    }
    return commitmentTypes.find(ct => ct.option === currentCommitmentTypeOption.id);
  }

  getCurrentCommitmentTypeCommitmentTypes() {
    const current = this.getCurrentCommitmentType();

    if (current) {
      return current.commitmentTypes;
    }

    return [];
  }

  checkMGPS() {}

  getCurrentCommitmentTypeXFactorAsPercentage() {
    const currentCommitmentType = this.getCurrentCommitmentType();
    if (this.getIsOF5AndAbove()) {
      return currentCommitmentType.xFactorOF5AndAboveXFactorMessage;
    }

    return `${currentCommitmentType.xFactor}%`;
  }

  getUserIsNotServing() {
    const profile = this.getCurrentProfile();
    return profile.servingtype === 'ns' || profile.servingtype === 'sr' || profile.servingtype === 'cfav';
  }

  getUserHasNotSelectedAPayLevel() {
    const profile = this.getCurrentProfile();
    return (
      typeof profile.pay.level === 'undefined' || profile.pay.level === '-1' || profile.pay.level === null
    );
  }

  getUserHasSelectedAServingTypeWithoutMatchingCommitmentType() {
    return this.getCommitmentTypes().length < 1;
  }

  getCurrentSalary() {
    const profile = this.getCurrentProfile();

    return profile.pay.level.meta.salary;
  }

  getRank() {
    const profile = this.getCurrentProfile();

    return profile.rank;
  }

  getIsCurrentCommitmentUsingDays() {
    const currentCommitmentType = this.getCurrentCommitmentType();
    return currentCommitmentType.dailyRate;
  }

  getDays() {
    const profile = this.getCurrentProfile();

    return this.getIsCurrentCommitmentUsingDays() ? profile.pay.days : 1;
  }

  getCurrentSalaryWithDays() {
    const currentSalary = this.getCurrentSalary();
    const days = this.getDays();

    if (this.getIsCurrentCommitmentUsingDays()) {
      return (currentSalary / 365.23) * days;
    }

    return currentSalary;
  }

  getCurrentSalaryWithDaysAndPercentage() {
    const currentCommitmentType = this.getCurrentCommitmentType();
    const currentSalaryWithDays = this.getCurrentSalaryWithDays();

    return currentSalaryWithDays * (1 - currentCommitmentType.percentage / 100);
  }

  getNeedToBeConvertedToAnnual(commitmentType) {
    const currentCommitmentType = this.getCurrentCommitmentType();

    return currentCommitmentType.dailyRate && !commitmentType.dailyRate;
  }

  getIsOF5AndAbove() {
    const rangeId = this.getRank().meta.PayRangeID;
    const rangeFound = PayRange.find(range => range.ID === rangeId);

    return isOF5AndAbove(rangeFound);
  }

  getXFactorOF5AndAboveCalculation(commitmentType) {
    const { fsCalculationTypes, commitmentTypes } = this.props;
    const xFactorOF5AndAboveCalculation = fsCalculationTypes.find(c => c.id === commitmentType);
    return Object.assign({}, xFactorOF5AndAboveCalculation, {
      commitmentTypeOne: commitmentTypes.find(
        type => type.id === xFactorOF5AndAboveCalculation.commitmentTypeOne,
      ),
      commitmentTypeTwo: commitmentTypes.find(
        type => type.id === xFactorOF5AndAboveCalculation.commitmentTypeTwo,
      ),
    });
  }

  getCommitmentTypeSalary(commitmentType, doNotApplyPercentageReduction) {
    const days = this.getDays();
    const currentSalary = this.getCurrentSalary();

    if (commitmentType.xFactorOF5AndAboveCalculation && this.getIsOF5AndAbove()) {
      const xFactorOF5AndAboveCalculation = this.getXFactorOF5AndAboveCalculation(
        commitmentType.xFactorOF5AndAboveCalculation,
      );
      const commitmentTypeOneSalary = this.getCommitmentTypeSalary(
        xFactorOF5AndAboveCalculation.commitmentTypeOne,
        true,
      );
      const commitmentTypeTwoSalary = this.getCommitmentTypeSalary(
        xFactorOF5AndAboveCalculation.commitmentTypeTwo,
        true,
      );

      const salaryWithCustomCalculation =
        commitmentTypeOneSalary * (1 - xFactorOF5AndAboveCalculation.percentageOne / 100) +
        (commitmentTypeTwoSalary - commitmentTypeOneSalary) *
          (1 - xFactorOF5AndAboveCalculation.percentageOne / 100) *
          0.8;
      return salaryWithCustomCalculation;
    }

    const salaryWithoutXFactor = currentSalary / (100 + 14.5);
    const salaryWithNewXFactor = salaryWithoutXFactor * (commitmentType.xFactor + 100);

    let salaryWithPercentageReduction = salaryWithNewXFactor;
    if (doNotApplyPercentageReduction !== true) {
      salaryWithPercentageReduction = salaryWithNewXFactor * (1 - commitmentType.percentage / 100);
    }

    const salaryByDays = commitmentType.dailyRate
      ? (salaryWithPercentageReduction / 365.23) * Math.min(commitmentType.maxDays || 1, days)
      : salaryWithPercentageReduction; //* ((needsToBeConvertedToAnnual) ? 365.23 : Math.min(commitmentType.maxDays || 1, days));

    return salaryByDays;
  }

  getCommitmentTypes() {
    const { commitmentTypes, allBenefits, options } = this.props;
    const { isMPGS } = this.state;
    if (this.getUserHasNotSelectedAPayLevel()) {
      return [];
    }

    const commitmentTypesByCommitmentTypeOption = this.getCurrentCommitmentTypeCommitmentTypes();
    const currentCommitmentType = this.getCurrentCommitmentType();

    return commitmentTypesByCommitmentTypeOption
      .sort(
        (a, b) =>
          currentCommitmentType.commitmentTypes.indexOf(a.id) -
          currentCommitmentType.commitmentTypes.indexOf(b.id),
      )
      .map(commitment => {
        const thisCommitment = commitmentTypes.find(ct => ct.id === commitment);

        const benefit = allBenefits.find(b => b.id === thisCommitment.benefit);

        if (!benefit) {
          throw new Error('The benefit attached to a commitment type has not been published.');
        }

        const option = options.find(b => b.id === thisCommitment.option);

        if (!option) {
          throw new Error('The option attached to a commitment type has not been published.');
        }

        const days = this.getDays();

        // const currentSalaryWithDaysAndPercentage = this.getCurrentSalaryWithDaysAndPercentage();
        const thisCommitmentTypeSalary = this.getCommitmentTypeSalary(thisCommitment);

        let thisCommitmentTypeLeave = 0;
        let salaryTooltip = false;

        let finalDays = 38;

        if (thisCommitment.maxDays) {
          const { maxDays } = thisCommitment;
          const percentageDays = maxDays / 365.23;
          finalDays = 38 * percentageDays;
        }

        if (currentCommitmentType.dailyRate) {
          if (thisCommitment.dailyRate) {
            if (
              currentCommitmentType.id !== thisCommitment.id &&
              thisCommitment.maxDays < currentCommitmentType.maxDays &&
              thisCommitment.maxDays < days
            ) {
              salaryTooltip = `This salary is for ${thisCommitment.maxDays} commitment days`;
            }
            thisCommitmentTypeLeave =
              Comparator.calculateLeaveByDays(
                Math.min(thisCommitment.maxDays, parseInt(days, 10)),
                thisCommitment.xFactorOF5AndAboveLeaveFigure,
                thisCommitment.expressLeaveAsHalfDay,
              ) *
              (1 - thisCommitment.percentage / 100);
          } else {
            thisCommitmentTypeLeave = Math.ceil(38 * (1 - thisCommitment.percentage / 100));
          }
        } else {
          thisCommitmentTypeLeave = Math.ceil(
            Math.min(finalDays, 38) * (1 - thisCommitment.percentage / 100),
          );
        }

        const thisCommitmentSalaryNormalised = Math.ceil(thisCommitmentTypeSalary);
        // const currentSalaryWithDaysAndPercentageNormalised = Math.ceil(currentSalaryWithDaysAndPercentage);

        const actualSalary = Math.ceil(this.getCommitmentTypeSalary(currentCommitmentType));
        let salaryChange = 0;

        if (thisCommitmentSalaryNormalised > actualSalary) {
          salaryChange = 1;
        } else if (thisCommitmentSalaryNormalised < actualSalary) {
          salaryChange = -1;
        }

        let xFactorChange = 0;

        const thisCommitmentXFactor = isMPGS ? 5 : thisCommitment.xFactor;
        const currentCommitmentXFactor = currentCommitmentType.xFactor;

        if (thisCommitmentXFactor > currentCommitmentXFactor) {
          xFactorChange = 1;
        } else if (thisCommitmentXFactor < currentCommitmentXFactor) {
          xFactorChange = -1;
        }

        let leaveChange = 0;

        const currentLeave = this.getComparatorRewardsPackageLeaveTotal(); // (currentCommitmentType.dailyRate) ? Comparator.calculateLeaveByDays(days) : (38 * (1 - (currentCommitmentType.percentage / 100)));

        if (thisCommitmentTypeLeave > currentLeave) {
          leaveChange = 1;
        } else if (thisCommitmentTypeLeave < currentLeave) {
          leaveChange = -1;
        }

        return {
          id: thisCommitment.id,
          title: benefit.title,
          slug: `comparator/${benefit.slug}`,
          salary: {
            change: salaryChange,
            value: formatCurrency(thisCommitmentTypeSalary),
            tooltip: thisCommitment.salaryTooltip || salaryTooltip,
          },
          xFactor: {
            showIcon: this.getIsOF5AndAbove() === false,
            change: this.getIsOF5AndAbove() ? 0 : xFactorChange,
            value: this.getIsOF5AndAbove()
              ? `<span>${thisCommitment.xFactorOF5AndAboveXFactorMessage}</span>`
              : `${thisCommitmentXFactor}%`,
          },
          leave: {
            change: leaveChange,
            value: thisCommitmentTypeLeave,
            tooltip: thisCommitment.leaveMessage || false,
          },
        };
      });
  }

  getComparatorRewardsPackageSalaryTotal() {
    const currentCommitmentType = this.getCurrentCommitmentType();

    return formatCurrency(this.getCommitmentTypeSalary(currentCommitmentType));
  }

  getComparatorRewardsPackageLeaveTotal() {
    const profile = this.getCurrentProfile();

    const currentCommitmentType = this.getCurrentCommitmentType();

    return currentCommitmentType.dailyRate
      ? Comparator.calculateLeaveByDays(
          profile.pay.days,
          currentCommitmentType.xFactorOF5AndAboveLeaveFigure,
          currentCommitmentType.expressLeaveAsHalfDay,
        )
      : Math.ceil(38 * (1 - currentCommitmentType.percentage / 100));
  }

  getBenefitRoutes() {
    const { service, category, match, allBenefits, commitmentTypes } = this.props;

    return commitmentTypes.map(commitment => {
      const benefit = allBenefits.find(b => b.id === commitment.benefit);
      return (
        <Route
          key={`${service.id}:${category.id}:${benefit.id}:${commitment.id}`}
          path={`${match.url}/${benefit.slug}`}
          render={props => (
            <BenefitPage
              id={benefit.id}
              service={service}
              category={category}
              {...props}
              backLink={match.url}
            />
          )}
        />
      );
    });
  }

  getCurrentProfile = () => this.state.currentProfile;

  getXFactorSlug = () => {
    const { allBenefits, fs } = this.props;
    return allBenefits.find(benefit => benefit.id === fs.xFactor.id).slug;
  };

  createCurrentProfile = answers => {
    const { allQuestions } = this.props;

    const allQuestionsWithCurrentAnswers = mergeObjectValuesWithQuestions(answers, allQuestions);
    return getProfile(allQuestionsWithCurrentAnswers);
  };

  handleFormError = errorCount => {
    this.setState({
      formError: errorCount !== 0,
    });
  };

  handleClickCompare = () => {
    const { onUpdateAnswers } = this.props;
    onUpdateAnswers(this.state.answers);

    this.setState(
      {
        showComparator: true,
      },
      () => {
        Comparator.scrollComparatorIntoView();
      },
    );
  };

  handleUpdateAnswers = answers => {
    const servingTypeSelected =
      answers['profile.servingtype'] === '-1' ? null : answers['profile.servingtype'];

    this.setState(
      {
        showComparator: false,
        currentCommitmentType: servingTypeSelected,
        currentProfile: this.createCurrentProfile(answers),
        answers,
      },
      () => {
        if (!this.getCurrentCommitmentType()) {
          // eslint-disable-next-line no-console
          console.warn(
            'The serving type question has an option that does not have a matching commitment type.',
          );
        }
      },
    );
  };

  render() {
    const { service, fs, fss, options, dependencies } = this.props;
    const { title } = fs;
    const { showComparator, formError } = this.state;

    const disableForm =
      formError ||
      this.getUserHasNotSelectedAPayLevel() ||
      this.getUserHasSelectedAServingTypeWithoutMatchingCommitmentType();

    const showJumbatron = this.getUserIsNotServing();

    return (
      <div>
        <Page title={`${title} | ${service.name}`} service={service} description={fss[0].description}>
          <ContainerInner className="no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro title={fss[0].title} tagName="h1" text={fss[0].description} />
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <FormBuilder
                  formOptions={{ className: null, questionHeading: false }}
                  id="fs-comparator"
                  form={this.getPayBenefitForm()}
                  options={options}
                  dependencies={dependencies}
                  onUpdate={this.handleUpdateAnswers}
                  onError={this.handleFormError}
                  chunkBy={1}
                />
              </Col>
            </Row>
            {showJumbatron && (
              <Jumbotron>
                <span className="text-white">This module can only used by Serving Personnel.</span>
              </Jumbotron>
            )}
            <Row>
              <Col xs="12">
                <Button
                  type="button"
                  data-ga-category="comparator"
                  data-ga-action="flexible service"
                  data-ga-label="compare"
                  disabled={disableForm}
                  onClick={this.handleClickCompare}
                >
                  Compare
                </Button>
              </Col>
            </Row>
          </ContainerInner>
          {!formError && showComparator && !showJumbatron && (
            <Row>
              <Col xs="12">
                <ComparatorComponent
                  salary={this.getComparatorRewardsPackageSalaryTotal()}
                  xFactor={`${this.getCurrentCommitmentTypeXFactorAsPercentage()}`}
                  leave={this.getComparatorRewardsPackageLeaveTotal().toString()}
                  commitmentTypes={this.getCommitmentTypes()}
                  slug={this.getXFactorSlug()}
                />
              </Col>
            </Row>
          )}
          <br />
          <br />
          <br />
          <br />
          <br />
          {!formError && showComparator && !showJumbatron && (
            <ContainerInner>
              <Row>
                <Col xs="12">
                  {
                    // eslint-disable-next-line react/no-danger}
                  }
                  <div dangerouslySetInnerHTML={{ __html: fss[0].details }} />
                </Col>
              </Row>
            </ContainerInner>
          )}
          {this.getBenefitRoutes()}
        </Page>
      </div>
    );
  }
}

Comparator.propTypes = {
  service: ServicePropType,
  category: CategoryPropType,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType),
  allBenefits: PropTypes.arrayOf(BenefitPropType),
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType),
  fsCalculationTypes: PropTypes.arrayOf(FsCalculationPropType),
  fs: SubAppPropType,
  fss: PropTypes.arrayOf(FsPropType).isRequired,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  onUpdateAnswers: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object.isRequired,
  }).isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const fs = makeSelectSubAppById(state, ownProps.id);
  const fss = makeSelectFS(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);
  const fsCalculationTypes = makeSelectFSCalculations(state);

  const allQuestions = makeSelectQuestions(state);
  const allBenefits = makeSelectBenefits(state);
  const options = makeSelectOptions(state);
  const dependencies = makeSelectDependencies(state);
  const calculations = makeSelectCalculations(state);
  const fsCalculations = makeSelectFSCalculations(state);

  return {
    fs,
    fss,
    allQuestions,
    allBenefits,
    calculations,
    options,
    dependencies,
    commitmentTypes,
    fsCalculationTypes,
    fsCalculations,
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateAnswers: answers => dispatch(updateAnswers(answers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Comparator));
