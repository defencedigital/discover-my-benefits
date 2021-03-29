import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { toJS } from '../HOC/ToJS';

import ContainerInner from '../ContainerInner';
import { QuestionPropType } from '../../containers/Questions/propTypes';
import { OptionPropType } from '../../containers/Options/propTypes';
import { makeSelectQuestions } from '../../containers/Questions/selectors';
import { makeSelectOptions } from '../../containers/Options/selectors';

import { formatCurrency } from '../../utils/currency';
import { FsCommitmentTypePropType } from '../../containers/FS/propTypes';
import { makeSelectCommitmentTypes } from '../../containers/FS/selectors';
import { ServicePropType } from '../../containers/Services/propTypes';

export class FloatingFooter extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  isServingByExpressedInDays = servingType => {
    const { commitmentTypes, options } = this.props;

    return commitmentTypes.find(ct => {
      const option = options.find(o => o.id === ct.option);

      return option && option.value === servingType.value && ct.dailyRate === true;
    });
  };

  render() {
    const { questions, service } = this.props;

    let value = '--';

    const servingType = questions.find(q => q.namespace === 'profile.servingtype');

    if (servingType) {
      const levelQuestion = questions.find(q => q.namespace === 'profile.pay.level');
      const daysQuestion = questions.find(q => q.namespace === 'profile.pay.days');
      const expressedInDays = this.isServingByExpressedInDays(servingType);

      if (levelQuestion && levelQuestion.value) {
        value = !expressedInDays
          ? levelQuestion.value.value
          : levelQuestion.value.value * parseFloat(daysQuestion.value);
      }
    }

    return (
      <footer className="floating-footer">
        <ContainerInner className="no-padding-lrg">
          <Row>
            <Col xs="12" lg="4">
              <h3 className="h4">Number of Benefits:</h3>
              <h4 className="h2">48</h4>
            </Col>
            <Col xs="12" lg="4">
              <h3 className="h4">Salary:</h3>
              <h4 className="h2">{formatCurrency(value)}</h4>
            </Col>
            <Col xs="12" lg="4">
              <h3 className="h5">
                {"What's your package worth? Get a more accurate estimate by "}{' '}
                <Link to={`/${service.slug}/my-details`}>telling us more about yourself</Link>
              </h3>
            </Col>
          </Row>
        </ContainerInner>
      </footer>
    );
  }
}

FloatingFooter.propTypes = {
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  service: ServicePropType,
};

const mapStateToProps = state => {
  const questions = makeSelectQuestions(state);
  const options = makeSelectOptions(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);

  return {
    questions,
    options,
    commitmentTypes,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(FloatingFooter));
