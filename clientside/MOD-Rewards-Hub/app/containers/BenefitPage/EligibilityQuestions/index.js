/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FormBuilder from '../../../components/FormBuilder';
import { toJS } from '../../../components/HOC/ToJS';
import { chunk } from '../../../utils/array';
import { togglePinnedNav } from '../../App/actions';
import { makeSelectPinNav } from '../../App/selectors';
import { getBenefitEligibilityStatus, getInternalQuestionsForBenefit } from '../../Benefits/helpers';
import { BenefitPropType } from '../../Benefits/propTypes';
import { makeSelectBenefits } from '../../Benefits/selectors';
import { CalculationPropType } from '../../Calculations/propTypes';
import { makeSelectCalculations } from '../../Calculations/selectors';
import { CategoryPropType } from '../../Categories/propTypes';
import { makeSelectCategories } from '../../Categories/selectors';
import { DependencyPropType } from '../../Dependencies/propTypes';
import { makeSelectDependencies } from '../../Dependencies/selectors';
import { FsCalculationPropType, FsCommitmentTypePropType } from '../../FS/propTypes';
import { makeSelectCommitmentTypes, makeSelectFSCalculations } from '../../FS/selectors';
import { OptionPropType } from '../../Options/propTypes';
import { makeSelectOptions } from '../../Options/selectors';
import { updateAnswers } from '../../Questions/actions';
import { getProfile, mergeObjectValuesWithQuestions, questionsToFormBuilder } from '../../Questions/helpers';
import { QuestionPropType } from '../../Questions/propTypes';
import { makeSelectQuestions } from '../../Questions/selectors';
import { ServicePropType } from '../../Services/propTypes';
import Disclaimer from '../Disclaimer';

export class EQ extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      historyLength: 0,
      history: {},
      errors: 0,
      anim: false,
    };

    this.myRef = React.createRef();
  }

  componentWillReceiveProps(nextProps) {
    const { questions } = this.props;
    if (JSON.stringify(this.getProfile(questions)) !== JSON.stringify(this.getProfile(nextProps.questions))) {
      // we only want this to run if the questions have changed

      this.setState({ anim: true });

      setTimeout(() => {
        this.setState({
          anim: false,
        });
        this.pinNav();
      }, 2000);
    }
  }

  getProfile = questions => getProfile(questions);

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

  getStatus = benefit => {
    const { id } = benefit;
    return this.getBenefitEligibilityStatus(id);
  };

  getInternalQuestionsForBenefit(benefit) {
    const { service, allBenefits, allQuestions, commitmentTypes, options, fsCalculations } = this.props;
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

  getBenefitQuestions = () => {
    const { questions, options, benefit } = this.props;
    const additionalQuestions = benefit.additionalQuestions || [];

    return chunk(
      questionsToFormBuilder(
        questions
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
    ).concat([].concat(...[this.getInternalQuestionsForBenefit(benefit)]));
  };

  pinNav() {
    const { onTogglePinnedNav } = this.props;
    onTogglePinnedNav();
  }

  handleTriggerSubmit = () => {
    const node = this.myRef.current;
    node.handleSubmit();
  };

  handleSubmitAnswers = answers => {
    const { onUpdateAnswers } = this.props;
    onUpdateAnswers(answers);
    this.setState({
      historyLength: 0,
      history: {},
    });
  };

  handleErrors = errors => {
    this.setState({
      errors,
    });
  };

  handleHistoryUpdate = history => {
    const { historyLength } = this.state;
    this.setState(prevState => ({
      historyLength: historyLength + 1,
      history: Object.assign({}, prevState.history, history),
    }));
  };

  render() {
    const { benefit, options, dependencies } = this.props;
    const { historyLength, errors, anim } = this.state;
    const animClass = anim ? 'run-anim' : '';
    const eligibleStatus = this.getStatus(benefit);
    if (this.getBenefitQuestions().length === 0) {
      return null;
    }
    return (
      <div className="eligibility-questions">
        <Row>
          {this.getBenefitQuestions().length !== 0 && (
            <>
              <Col xs="12" md="8" className="eligibility-questions__col">
                <h2>Eligibility check:</h2>
                <FormBuilder
                  formOptions={{ className: null, questionHeading: false }}
                  id="benefit-questions"
                  form={this.getBenefitQuestions()}
                  ref={this.myRef}
                  options={options}
                  dependencies={dependencies}
                  onSubmit={this.handleSubmitAnswers}
                  onUpdate={this.handleHistoryUpdate}
                  // onHistory={this.handleHistoryUpdate}
                  onError={this.handleErrors}
                  chunkBy={1}
                />
                <Button
                  type="button"
                  id="category-submit"
                  disabled={historyLength === 0 || errors > 0}
                  className={`btn-${eligibleStatus.class}`}
                  onClick={this.handleTriggerSubmit}
                  data-ga-category="my details"
                  data-ga-label="benefit-save"
                  data-ga-action="benefit-save"
                  style={{ marginTop: '20px' }}
                >
                  Check eligibility
                </Button>
                {benefit.disclaimer && <Disclaimer code={eligibleStatus.code} text={benefit.disclaimer} />}
              </Col>
              <Col xs="12" md="4" className="eligibility-questions__col">
                <div className={`eligibility-questions__status ${animClass} ${eligibleStatus.class}`}>
                  <h3 className="h2">
                    {' '}
                    <span className={`icon icon-${eligibleStatus.class}`}></span> {eligibleStatus.status}
                  </h3>
                  <p dangerouslySetInnerHTML={{ __html: eligibleStatus.info }} />
                </div>
              </Col>
            </>
          )}
        </Row>
      </div>
    );
  }
}

EQ.propTypes = {
  benefit: PropTypes.object,
  service: ServicePropType,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  allQuestions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  allBenefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  allCategories: PropTypes.arrayOf(CategoryPropType).isRequired,
  onUpdateAnswers: PropTypes.func.isRequired,
  onTogglePinnedNav: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  const allQuestions = makeSelectQuestions(state);
  const allBenefits = makeSelectBenefits(state);
  const options = makeSelectOptions(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);
  const fsCalculations = makeSelectFSCalculations(state);
  const dependencies = makeSelectDependencies(state);
  const allCategories = makeSelectCategories(state);
  const calculations = makeSelectCalculations(state);
  const pinNav = makeSelectPinNav(state);

  return {
    allCategories,
    options,
    allQuestions,
    allBenefits,
    commitmentTypes,
    fsCalculations,
    dependencies,
    calculations,
    pinNav,
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateAnswers: answers => dispatch(updateAnswers(answers)),
  onTogglePinnedNav: () => dispatch(togglePinnedNav()),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(EQ)));
