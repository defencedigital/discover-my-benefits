import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row, Button } from 'reactstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import BenefitsSummary from '../BenefitsSummary';
import FormBuilder from '../FormBuilder';
import { toJS } from '../HOC/ToJS';
import { questionsToFormBuilder, getProfile } from '../../containers/Questions/helpers';
import { QuestionPropType } from '../../containers/Questions/propTypes';
import { makeSelectQuestions } from '../../containers/Questions/selectors';
import { OptionPropType } from '../../containers/Options/propTypes';
import { makeSelectOptions } from '../../containers/Options/selectors';
import Options from '../../json/squidex/options.json';

import { updateAnswers } from '../../containers/Questions/actions';

class MastheadQuestions extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      step1: true,
      step2: false,
      servingType: '',
    };

    this.myRef = React.createRef();
  }

  componentDidMount() {
    const { progress } = this.props;
    if (progress.totalEligible) {
      this.setState({
        step1: false,
        step2: true,
      });
    }
  }

  componentDidUpdate() {
    this.setState({
      servingType: this.getServingType(),
    });
  }

  getServingType() {
    const { allQuestions } = this.props;
    if (getProfile(allQuestions).servingtype !== null || getProfile(allQuestions).servingtype !== '-1') {
      return this.getCommitmentTypeFullName(getProfile(allQuestions).servingtype);
    }
    return null;
  }

  getForm() {
    const form = [];

    form.push([this.getServingPersonnelQuestion()]);
    return form;
  }

  getServingPersonnelQuestion() {
    const { allQuestions } = this.props;
    const servingQuestion = allQuestions.find(q => q.namespace === 'profile.servingtype');
    const question = questionsToFormBuilder([servingQuestion], Options);

    return Object.assign(question[0], {
      onChangeReset: ['profile.pay.level', 'profile.pay.supplement.level'],
    });
  }

  getServingQuestion() {
    return this.servingQuestion;
  }

  getCommitmentTypeFullName = ct => {
    const { options } = this.props;
    const option = options.find(o => o.value === ct);
    if (option !== undefined) return option.name;
  };

  handleTriggerSubmit = () => {
    const node = this.myRef.current;
    this.setState({
      step1: false,
      step2: true,
    });
    node.handleSubmit();
  };

  handleSubmitAnswers = answers => {
    const { onUpdateAnswers } = this.props;
    onUpdateAnswers(answers);
  };

  render() {
    const { title, description, service, progress } = this.props;
    const { step1, step2, servingType } = this.state;
    return (
      <div className="masthead-questions-panel">
        <div className={`masthead-questions-panel__step-1 ${!step1 ? 'hidden' : ''}`}>
          <Row>
            <Col xs="12">
              <div className="masthead-questions-panel__inr">
                <h2 className="h1">{title}</h2>
                <h4>{description}</h4>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
              <FormBuilder
                formOptions={{ className: null, questionHeading: false }}
                id={`masthead-questions-${title}`}
                form={this.getForm()}
                options={[]}
                dependencies={[]}
                chunkBy={1}
                onSubmit={this.handleSubmitAnswers}
                onUpdate={this.handleHistoryUpdate}
                ref={this.myRef}
                style={{ marginTop: '20px' }}
              />
              <Button
                type="button"
                id="masthead-questions-submit"
                className="tab-control-btn masthead-questions-panel__btn"
                onClick={this.handleTriggerSubmit}
                style={{ marginTop: '20px' }}
              >
                Send {'>'}
              </Button>
            </Col>
          </Row>
        </div>
        <div className={`masthead-questions-panel__step-2 ${!step2 ? 'hidden' : ''}`}>
          <Row>
            <Col xs="12">
              <div className="masthead-questions-panel__inr">
                <BenefitsSummary
                  title={title}
                  service={service}
                  progress={progress}
                  servingType={servingType}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

MastheadQuestions.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  service: PropTypes.object,
  allQuestions: PropTypes.arrayOf(QuestionPropType).isRequired,
  onUpdateAnswers: PropTypes.func.isRequired,
  progress: PropTypes.object,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
};

const mapStateToProps = state => {
  const allQuestions = makeSelectQuestions(state);
  const options = makeSelectOptions(state);
  return {
    allQuestions,
    options,
  };
};

const mapDispatchToProps = dispatch => ({
  onUpdateAnswers: answers => dispatch(updateAnswers(answers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(injectIntl(MastheadQuestions)));
