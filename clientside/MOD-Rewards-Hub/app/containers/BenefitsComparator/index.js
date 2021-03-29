/*
 * Benefits Comparator Questions Page
 */
// import detectIE from 'detectie';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import differenceWith from 'ramda/src/differenceWith';
// Components
import Accordion from '../../components/Accordion';
import Breadcrumb from '../../components/Breadcrumb';
import Changelog from '../../components/Changelog';
import ContainerInner from '../../components/ContainerInner';
import { toJS } from '../../components/HOC/ToJS';
import Intro from '../../components/Intro';
import Page from '../../components/Page';
import StickyCompare from '../../components/StickyCompare';
import FormBuilder from '../../components/FormBuilder';
import BenefitHeading from './status';
import Comparison from './Comparison';
import profilePageMessages from './messages';
import ProgressHOC from '../../components/HOC/Progress';
import CurrentBenefitsPanel from '../../components/CurrentBenefitsPanel';
// selectors
import { makeSelectFlyoutOpen } from '../App/selectors';
import { makeSelectProfileCategories } from '../ProfileCategories/selectors';
import { makeSelectMultipleCategoriesById, makeSelectCategories } from '../Categories/selectors';
import { makeSelectQuestions } from '../Questions/selectors';
import { getServiceSlugFromService } from '../Services/helpers';
import { makeSelectServiceById } from '../Services/selectors';
import { makeSelectCocCategories } from '../CoCCategories/selectors';
import { makeSelectBenefits } from '../Benefits/selectors';
import { makeSelectCalculations } from '../Calculations/selectors';
import { makeSelectCommitmentTypes, makeSelectFSCalculations } from '../FS/selectors';
import { makeSelectDependencies } from '../Dependencies/selectors';
import { makeSelectOptions } from '../Options/selectors';
// helpers
import { getCategoryForms } from '../Categories/helpers';
import { getBenefitEligibilityStatus, getInternalQuestionsForBenefit } from '../Benefits/helpers';
import { getProfile, mergeObjectValuesWithQuestions, questionsToFormBuilder } from '../Questions/helpers';
import { multipleBenefitsById, getQuestionIDByNameSpace } from './helpers';
import { chunk } from '../../utils/array';

// Prop types
import { FsCalculationPropType, FsCommitmentTypePropType } from '../FS/propTypes';
import { DependencyPropType } from '../Dependencies/propTypes';
import { OptionPropType } from '../Options/propTypes';
import { CocCategoriesPropType } from '../CoCCategories/propTypes';

import { QuestionPropType } from '../Questions/propTypes';
import { CategoryPropType } from '../Categories/propTypes';
import { CalculationPropType } from '../Calculations/propTypes';
import { BenefitPropType } from '../Benefits/propTypes';
// actions
import {
  deleteChangelogHistory,
  updateChangelogHistory,
  toggleFlyout,
  setActiveAllTab,
} from '../App/actions';

import { updateAnswers } from '../Questions/actions';

// Constants
import { COC_NAMESPACES, COC_FORM_ID, ID_LENGTH } from './constants';
import { ELIGIBILITY_STATUS } from '../App/constants';

export class BenefitsComparator extends React.PureComponent {
  constructor(props) {
    super(props);

    const { service, allQuestions, cocCategories } = props;
    let hasServingType;
    if (getProfile(allQuestions).servingtype) {
      if (getProfile(allQuestions).servingtype === null || getProfile(allQuestions).servingtype === '-1') {
        hasServingType = false;
      } else {
        hasServingType = true;
      }
    } else {
      hasServingType = false;
    }

    this.state = {
      cocCategoryForms: getCategoryForms(service, cocCategories, allQuestions, false),
      accordionIndex: null,
      history: [],
      comparing: false,
      hasServingType,
      servingTypeHasChanged: false,
      firstChange: true,
      changelogHistory: [],
      currentProfile: getProfile(allQuestions),
      newProfile: getProfile(allQuestions),
      currentQuestions: [...allQuestions],
      newQuestions: [...allQuestions],
      formId: COC_FORM_ID,
      // calculating: false,
    };
  }

  getBreadcrumb() {
    const { service } = this.props;
    return [
      {
        text: 'Home',
        slug: `/${getServiceSlugFromService(service)}`,
        active: true,
      },
      {
        text: 'Change of circumstances',
        slug: `/${getServiceSlugFromService(service)}/COC_FORM_ID`,
        active: false,
      },
    ];
  }

  getBenefitEligibilityStatus(id, questions) {
    const {
      allBenefits,
      calculations,
      service,
      commitmentTypes,
      allCategories,
      fsCalculations,
      options,
      dependencies,
    } = this.props;
    const profile = getProfile(questions);
    return getBenefitEligibilityStatus(
      id,
      profile,
      allBenefits,
      questions,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      allCategories,
      fsCalculations,
    );
  }

  getCurrentBenefitsfromProfile = () => {
    const { progress } = this.props;
    const currentBenefits = Object.keys(progress.benefits)
      .map(id => {
        const category = progress.benefits[id];
        return category.map(b => ({
          id: b.benefitId,
          benefitTitle: b.benefit,
          status: b.status,
        }));
      })
      .flat();
    return currentBenefits;
  };

  getBenefitStatus = (item, questions) => {
    const benefit = this.getBenefitEligibilityStatus(item, questions);
    return benefit.status;
  };

  handleFormHistoryUpdated = update => {
    const { history } = this.state;
    const { onUpdateChangelogHistory, allQuestions } = this.props;
    const updateQuestionNamespaces = Object.keys(update);
    const questions = allQuestions.filter(q => updateQuestionNamespaces.find(a => a === q.namespace));
    const newHistory = [];

    Object.entries(update).forEach(([key, value]) => {
      questions.forEach(q => {
        if (q.namespace === key) {
          newHistory.push({
            question: key,
            title: q.title,
            value: value === '-1' ? 'Unanswered' : value,
            id: key,
          });
        }
      });
    });

    const mergedHistory = Object.values(
      [...history, ...newHistory].reduce((result, { id, ...rest }) => {
        // eslint-disable-next-line no-param-reassign
        result[id] = {
          ...(result[id] || {}),
          id,
          ...rest,
        };
        return result;
      }, {}),
    );

    this.setState(
      {
        history: mergedHistory,
      },
      () => onUpdateChangelogHistory(this.state.history),
    );
  };

  getInternalQuestionsForBenefit(benefit) {
    const { service, allBenefits, allQuestions, commitmentTypes, fsCalculations, options } = this.props;
    const { history } = this.state;

    return getInternalQuestionsForBenefit(
      service,
      benefit,
      allBenefits,
      mergeObjectValuesWithQuestions(history, allQuestions),
      commitmentTypes,
      options,
      fsCalculations,
    );
  }

  removeServingType = (collection, property, namespace) => {
    const transformedCol = collection.map(category =>
      category.filter(question => question[property] !== namespace),
    );
    return transformedCol.filter(el => el.length > 0);
  };

  getBenefitQuestions = (questions, benefit) => {
    const { options } = this.props;
    const additionalQuestions = benefit.additionalQuestions || [];
    // If single question ID is passed in eg: service commitment type
    if (typeof benefit === 'string' && benefit.length === ID_LENGTH) {
      additionalQuestions.push(benefit);
    }
    return chunk(
      questionsToFormBuilder(
        questions
          .filter(question => additionalQuestions.indexOf(question.id) !== -1)
          .sort((a, b) => {
            if (additionalQuestions.indexOf(a.id) > additionalQuestions.indexOf(b.id)) {
              return 1;
            }
            return -1;
          }),
        options,
      ),
      1,
    ).concat([].concat(...[this.getInternalQuestionsForBenefit(benefit)]));
  };

  getCommitmentTypeFullName = ct => {
    const { options } = this.props;
    const option = options.find(o => o.value === ct);
    return option.name;
  };

  getCategoryAccordion = () => {
    const { cocCategories, allQuestions, allBenefits, options, dependencies } = this.props;
    const {
      accordionIndex,
      formId,
      cocCategoryForms,
      currentQuestions,
      newQuestions,
      hasServingType,
    } = this.state;

    const serviceTypeQuestion = getQuestionIDByNameSpace(allQuestions, COC_NAMESPACES.SERVING_TYPE);

    const servingTypeQuestions = this.getBenefitQuestions(newQuestions, serviceTypeQuestion);
    const profileBenefitsObject = [];

    let servingtype;

    if (this.state.currentProfile.servingtype === null) {
      servingtype = ELIGIBILITY_STATUS.MISSING_INFORMATION;
    } else {
      // eslint-disable-next-line prefer-destructuring
      servingtype = this.state.currentProfile.servingtype;
    }

    let rank;

    if (this.state.currentProfile.rank === null) {
      rank = ELIGIBILITY_STATUS.MISSING_INFORMATION;
    } else {
      // eslint-disable-next-line prefer-destructuring
      rank = this.state.currentProfile.rank.value;
    }

    const profileBenefits = this.getCurrentBenefitsfromProfile();
    return (
      <Row>
        <Col md="12" lg="8" className="bg-gray-lighter">
          <div className="accordions">
            <h4 className="h2 mb-5">Select whats changing:</h4>
            {hasServingType &&
              cocCategoryForms.map((form, index) => {
                const { id, image, title, namespace } = cocCategories[index];
                let { subheading } = cocCategories[index];
                const cocBenefits = multipleBenefitsById(allBenefits, cocCategories[index].benefits);
                const isServiceCommitmentType =
                  namespace.toLowerCase().trim() === COC_NAMESPACES.SERVICE_COMMITMENT_TYPE;

                const ctFullName = this.getCommitmentTypeFullName(servingtype);

                if (isServiceCommitmentType) {
                  subheading = `Current: ${ctFullName}`;
                }

                const BenefitAndQuestionsJSX = cocBenefits.map(benefit => {
                  const hasAdditonalQuestions =
                    benefit.additionalQuestions !== null && benefit.additionalQuestions.length > 1;
                  const profileStatus = this.getBenefitStatus(benefit.id, currentQuestions);
                  const heading = benefit.title;
                  const profileBenefit = {
                    id: benefit.id,
                    benefitTitle: heading,
                    benefitStatus: profileStatus,
                  };

                  const draftStatus = this.getBenefitStatus(benefit.id, newQuestions);

                  profileBenefitsObject.push(profileBenefit);
                  if (namespace.toLowerCase().trim() === COC_NAMESPACES.RANK) {
                    subheading = `Current: ${rank}`;
                  }

                  if (namespace.toLowerCase().trim() === COC_NAMESPACES.TRAINING_PHASE) {
                    subheading =
                      this.state.currentProfile.compp1training !== null
                        ? this.state.currentProfile.compp1training
                        : ELIGIBILITY_STATUS.MISSING_INFORMATION;
                  }

                  const questions = isServiceCommitmentType
                    ? servingTypeQuestions
                    : this.getBenefitQuestions(newQuestions, benefit);

                  if (hasAdditonalQuestions) {
                    return (
                      <div
                        className="coc-benefit"
                        data-component="CoC benefit"
                        data-status={draftStatus}
                        key={`coc-benefit-${formId}:${id}${benefit.id}${id}`}
                      >
                        {!isServiceCommitmentType && (
                          <BenefitHeading status={draftStatus} heading={heading} />
                        )}
                        <FormBuilder
                          key={`form-${formId}:${id}${benefit.id}${id}`}
                          id={`${formId}:${cocCategories[index].id}`}
                          form={questions}
                          options={options}
                          name={title}
                          profileBenefit={profileBenefit}
                          profileBenefits={profileBenefitsObject}
                          servingType={false}
                          dependencies={dependencies}
                          onUpdate={this.handleFormUpdated}
                          onHistory={this.handleFormHistoryUpdated}
                          chunkBy={1}
                          formOptions={{
                            hideLabel: !isServiceCommitmentType,
                            className: 'coc-form',
                          }}
                        />
                      </div>
                    );
                  }
                  return (
                    <div
                      className="coc-benefit"
                      data-component="CoC benefit"
                      data-status={draftStatus}
                      key={`coc-benefit-${formId}:${id}${benefit.id}${id}`}
                    >
                      <BenefitHeading status={draftStatus} heading={heading} />
                    </div>
                  );
                });

                return (
                  <Accordion
                    key={`COC_ACCORDION:${id}`}
                    imgSrc={image}
                    accordionIndex={accordionIndex}
                    id={id}
                    title={title}
                    index={index}
                    subheading={subheading}
                    handleAccordionClick={this.handleUpdateAccordionIndex}
                  >
                    {isServiceCommitmentType ? (
                      <FormBuilder
                        key={`${formId}:${id}`}
                        id={`${formId}:${cocCategories[index].id}`}
                        form={servingTypeQuestions}
                        options={options}
                        name={title}
                        dependencies={dependencies}
                        profileBenefits={profileBenefits}
                        onUpdate={this.handleServingTypeFormUpdated}
                        onHistory={this.handleFormHistoryUpdated}
                        servingType
                        chunkBy={1}
                        formOptions={{
                          hideLabel: !isServiceCommitmentType,
                          className: 'coc-form',
                        }}
                      />
                    ) : (
                      BenefitAndQuestionsJSX
                    )}
                  </Accordion>
                );
              })}
          </div>
        </Col>

        {this.getHistory()}
      </Row>
    );
  };

  getHistory() {
    const { changelogHistory, history } = this.state;
    const { service } = this.props;

    window.dataLayer.push({ event: 'your_changes', changes: history });

    return (
      <Col md="12" lg="4" className="bg-gray-light hide-md">
        <Row className="current-benefits bg-gray-dark p-5" xs="8">
          <Col xs="8">
            <ProgressHOC service={service}>
              <CurrentBenefitsPanel />
            </ProgressHOC>
          </Col>
        </Row>
        {changelogHistory && changelogHistory.length > 0 && (
          <Changelog benefits={changelogHistory} click={this.handleClickCompare} />
        )}
      </Col>
    );
  }

  // eslint-disable-next-line consistent-return
  compareBenefits = (current, updates, servingType) => {
    const { changelogHistory, servingTypeHasChanged, firstChange } = this.state;
    const { onUpdateChangelogHistory } = this.props;
    const currentBenefitStatus = current.map(benefit => benefit.benefitStatus);
    const updatedBenefitStatus = updates.map(benefit => benefit.benefitStatus);

    // objects equal = no change in benefits so reset so it doesn't appear in changelog
    if (currentBenefitStatus !== updatedBenefitStatus) {
      const diff = differenceWith(
        (x, y) => x.benefitStatus === y.benefitStatus && x.benefitTitle === y.benefitTitle,
      );

      const updatedBenefits = diff(updates, current);

      if (firstChange) {
        // if no updated benefits reset changes
        return this.setState(
          {
            changelogHistory: updatedBenefits,
            firstChange: false,
          },
          () => onUpdateChangelogHistory([].concat(this.state.changelogHistory)),
        );
      }
      // if its your first visit then just add the benefit/s
      // if the serving type has been changed recalculate all benefits
      if (servingType && !servingTypeHasChanged) {
        this.setState({
          servingTypeHasChanged: true,
        });
      }

      if (!servingType && !firstChange) {
        let BenefithasNewUpdate = false;
        let Benefits;
        if (updatedBenefits.length > 0) {
          Benefits = changelogHistory.map(benefit => {
            if (updatedBenefits[0].id === benefit.id) {
              BenefithasNewUpdate = true;
              return updatedBenefits[0];
            }
            return benefit;
          });
          if (!BenefithasNewUpdate) {
            Benefits = [...changelogHistory, updatedBenefits[0]];
          }
          return this.setState(
            {
              changelogHistory: Benefits,
            },
            () => onUpdateChangelogHistory([].concat(this.state.changelogHistory)),
          );
        }
      }

      if (servingType && !firstChange) {
        const newChangelogHistoy = changelogHistory.filter(item => updatedBenefits.includes(item));
        const Benefits = [...newChangelogHistoy, updatedBenefits].flat();

        return this.setState(
          {
            changelogHistory: Benefits,
          },
          () => onUpdateChangelogHistory([].concat(this.state.changelogHistory)),
        );
      }
    }
  };

  getComparePanel = () => {
    const { changelogHistory, history } = this.state;
    // const answeredQuestions = newQuestions.filter(question => question.value !== null);
    return (
      <StickyCompare
        historyCount={changelogHistory.length}
        questions={history}
        click={this.handleClickCompare}
      />
    );
  };

  getServingTypeMessage = () => (
    <div className="bg-secondary-beta text-center text-white p-5 m-auto">
      <h3 className="m-auto">
        You must fill out your serving commitment type before you can compare your changed circumstances, this
        can be found on the main landing page after choosing your service under {'"'}Your benefit package
        {'"'}.
      </h3>
    </div>
  );

  handleUpdateAccordionIndex = (index, e) => {
    e.preventDefault();

    this.setState(prevState => ({
      accordionIndex: index !== prevState.accordionIndex ? index : -1,
    }));
  };

  handleClickCompare = () => {
    this.setState({
      comparing: true,
    });
  };

  handleSave = () => {
    window.scrollTo(0, 0);

    const {
      service,
      onDeleteChangelogHistory,
      cocCategories,
      onUpdateAnswers,
      onToggleFlyout,
      onSetActiveAllTab,
      flyoutOpen,
    } = this.props;
    const location = this.props.history;
    const { newQuestions, history } = this.state;

    history.forEach(item => {
      const answer = { [item.question]: item.value };
      onUpdateAnswers(answer);
    });

    this.setState(
      {
        history: [],
        changelogHistory: [],
        comparing: false,
        currentProfile: getProfile(newQuestions),
        newProfile: getProfile(newQuestions),
        currentQuestions: [].concat(newQuestions),
        newQuestions: [].concat(newQuestions),
        cocCategoryForms: getCategoryForms(service, cocCategories, newQuestions, false),
        accordionIndex: null,
        servingTypeHasChanged: false,
        firstChange: true,
      },
      () => {
        onDeleteChangelogHistory([]);
        if (!flyoutOpen) {
          location.push(`/${service.slug}`);
          setTimeout(() => {
            onSetActiveAllTab();
            onToggleFlyout();
          }, 0.5);
        }
      },
    );
  };

  handleRestart = () => {
    window.scrollTo(0, 0);

    const { service, allQuestions, onDeleteChangelogHistory, cocCategories } = this.props;

    this.setState(
      {
        accordionIndex: null,
        servingTypeHasChanged: false,
        firstChange: true,
        history: [],
        changelogHistory: [],
        comparing: false,
        currentProfile: getProfile(allQuestions),
        newProfile: getProfile(allQuestions),
        currentQuestions: [].concat(allQuestions),
        newQuestions: [].concat(allQuestions),
        cocCategoryForms: getCategoryForms(service, cocCategories, allQuestions, false),
      },
      () => onDeleteChangelogHistory([]),
    );
  };

  formObjectToQuestionArray(result) {
    const keys = Object.keys(result);
    return keys.map((key, index) => ({
      id: index,
      namespace: key,
      value: result[key] === null ? undefined : result[key],
    }));
  }

  handleFormUpdated = (values, profileBenefit) => {
    const { newProfile, newQuestions, currentQuestions } = this.state;
    const { service, cocCategories } = this.props;

    const benefit = {
      id: profileBenefit.id,
      benefitTitle: profileBenefit.benefitTitle,
      status: this.getBenefitStatus(profileBenefit.id, currentQuestions),
    };

    const mockProfileForFormResult = getProfile(this.formObjectToQuestionArray(values));

    const currentNewProfileWithMergedMock = Object.assign({}, newProfile, mockProfileForFormResult);

    const updatedQuestions = newQuestions.map(question => {
      if (values[question.namespace]) {
        return Object.assign({}, question, {
          value: values[question.namespace],
        });
      }
      return question;
    });

    if (benefit) {
      const status = this.getBenefitStatus(benefit.id, updatedQuestions);
      const draftBenefits = [];
      const oldBenefits = [];
      oldBenefits.push(benefit);
      draftBenefits.push({
        id: benefit.id,
        benefitTitle: benefit.benefitTitle,
        benefitStatus: status,
      });

      const profileBenefitObject = [];
      profileBenefitObject.push(profileBenefit);

      this.setState(
        {
          newProfile: currentNewProfileWithMergedMock,
          // currentQuestions: updatedQuestions,
          newQuestions: updatedQuestions,
          cocCategoryForms: getCategoryForms(service, cocCategories, updatedQuestions, false),
        },
        () => {
          this.compareBenefits(oldBenefits, draftBenefits, false);
        },
      );
    }
  };

  handleServingTypeFormUpdated = (result, profileBenefits) => {
    // when serving type form is updated we have to reset all questions to recalculate eligibilty
    const { newProfile, currentQuestions, newQuestions } = this.state;
    const { service, cocCategories } = this.props;
    const mockProfileForFormResult = getProfile(this.formObjectToQuestionArray(result));
    const currentNewProfileWithMergedMock = Object.assign({}, newProfile, mockProfileForFormResult);

    const updatedQuestions = newQuestions.map(question => {
      if (result[question.namespace]) {
        return Object.assign({}, question, {
          value: result[question.namespace],
        });
      }
      return question;
    });
    const draftBenefits = [];
    const oldBenefits = [];

    profileBenefits.forEach(benefit => {
      const status = this.getBenefitStatus(benefit.id, updatedQuestions);
      draftBenefits.push({
        id: benefit.id,
        benefitTitle: benefit.benefitTitle,
        benefitStatus: status,
      });
      const oldStatus = this.getBenefitStatus(benefit.id, currentQuestions);

      oldBenefits.push({
        id: benefit.id,
        benefitTitle: benefit.benefitTitle,
        benefitStatus: oldStatus,
      });

      this.handleFormUpdated(result, benefit);
    });

    // map over all single question benefits

    this.setState(
      {
        newProfile: currentNewProfileWithMergedMock,
        newQuestions: updatedQuestions,
        // currentQuestions: updatedQuestions,
        cocCategoryForms: getCategoryForms(service, cocCategories, updatedQuestions, false),
      },
      () => {
        this.compareBenefits(oldBenefits, draftBenefits, true);
      },
    );
  };

  render() {
    const { service, intl } = this.props;
    const { comparing, newQuestions, hasServingType, changelogHistory, history } = this.state;
    const title = intl.formatMessage({ id: profilePageMessages.header.id });

    return (
      <React.Fragment>
        <Page
          title={`Change of circumstances | ${service.name}`}
          service={service}
          description={
            comparing
              ? 'This is how your benefits, allowances and salary will be affected based on the changes you made. You can do another comparison at any time, but please be aware that it will erase and replace the previous comparison.'
              : 'These are the details you gave us while exploring your benefits. You can use this tool to make changes to your details and see how your benefits would be affected. You may want to do this if your personal circumstances have changed – for example, if you have married/entered a civil partnership or become a parent. To see all of your details in one place, visit the ‘benefits’ tab above.'
          }
        >
          <ContainerInner className="comparator-container no-padding-lrg">
            <Row>
              <Col xs="12">
                <Breadcrumb items={this.getBreadcrumb()} />
                <Intro
                  tagName="h1"
                  title={comparing ? 'Personal comparison tool' : title}
                  subtitle={
                    comparing
                      ? 'This is how your benefits, allowances and salary will be affected based on the changes you made. You can do another comparison at any time, but please be aware that it will erase and replace the previous comparison.'
                      : `Here you can discover the effect that changes to your personal circumstances, like becoming a parent, deploying or changing location, would have on your benefits. You can save the changes to your profile, if you wish, or just explore possible changes to see what difference they would make.
To see all your details in one place, select Benefits above.`
                  }
                />
              </Col>
            </Row>
          </ContainerInner>
          {!hasServingType && this.getServingTypeMessage()}
          {hasServingType && !comparing && this.getCategoryAccordion()}
          {hasServingType && !comparing && this.getComparePanel()}
          {hasServingType && comparing && (
            <Comparison
              service={service}
              handleRestart={this.handleRestart}
              handleSave={this.handleSave}
              newProfileQuestions={newQuestions}
              changelogHistory={changelogHistory}
              comparing={comparing}
              history={history}
            />
          )}
        </Page>
      </React.Fragment>
    );
  }
}

BenefitsComparator.propTypes = {
  intl: PropTypes.object.isRequired,
  service: PropTypes.object.isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType).isRequired,
  cocCategories: PropTypes.arrayOf(CocCategoriesPropType).isRequired,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  allBenefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  allCategories: PropTypes.arrayOf(CategoryPropType).isRequired,
  onUpdateChangelogHistory: PropTypes.func.isRequired,
  onDeleteChangelogHistory: PropTypes.func.isRequired,
  progress: PropTypes.object.isRequired,
  onUpdateAnswers: PropTypes.func.isRequired,
  onToggleFlyout: PropTypes.func.isRequired,
  onSetActiveAllTab: PropTypes.func.isRequired,
  flyoutOpen: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

const mapStateToProps = (state, ownProps) => {
  const profileCategories = makeSelectProfileCategories(state);
  const cocCategories = makeSelectCocCategories(state);
  const allQuestions = makeSelectQuestions(state);
  const allBenefits = makeSelectBenefits(state);
  const calculations = makeSelectCalculations(state);
  const options = makeSelectOptions(state);
  const dependencies = makeSelectDependencies(state);

  const commitmentTypes = makeSelectCommitmentTypes(state);
  const allCategories = makeSelectCategories(state);
  const fsCalculations = makeSelectFSCalculations(state);
  const service = makeSelectServiceById(state, ownProps.service.id);
  const serviceCategoryIds = service.toJS().categories;
  const categories = makeSelectMultipleCategoriesById(state, serviceCategoryIds).sort(
    (a, b) => serviceCategoryIds.indexOf(a.toJS().id) - serviceCategoryIds.indexOf(b.toJS().id),
  );
  const flyoutOpen = makeSelectFlyoutOpen(state);

  return {
    flyoutOpen,
    allBenefits,
    calculations,
    dependencies,
    options,
    commitmentTypes,
    allCategories,
    fsCalculations,
    profileCategories,
    cocCategories,
    allQuestions,
    categories,
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateChangelogHistory: history => dispatch(updateChangelogHistory(history)),
  onDeleteChangelogHistory: () => dispatch(deleteChangelogHistory()),
  onUpdateAnswers: answers => dispatch(updateAnswers(answers)),
  onToggleFlyout: () => dispatch(toggleFlyout()),
  onSetActiveAllTab: () => dispatch(setActiveAllTab()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(BenefitsComparator)));
