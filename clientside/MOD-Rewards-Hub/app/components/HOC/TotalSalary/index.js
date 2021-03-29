import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { toJS } from '../ToJS';
import { FsCommitmentTypePropType } from '../../../containers/FS/propTypes';
import { QuestionPropType } from '../../../containers/Questions/propTypes';
import { OptionPropType } from '../../../containers/Options/propTypes';
import { makeSelectQuestions } from '../../../containers/Questions/selectors';
import { makeSelectOptions } from '../../../containers/Options/selectors';
import { makeSelectCommitmentTypes } from '../../../containers/FS/selectors';
import { formatCurrency } from '../../../utils/currency';
import { isJSON } from '../../../utils/object';
import { NON_APPLICIABLE_SALARY_TEXT } from './constants';
import { SERVING_TYPES } from '../../../containers/App/constants';
import MissingIcon from '../../../images/svg/question.svg';
class TotalSalary extends React.PureComponent {
  // eslint-disable-line react/prefer-stateless-function
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

  getCommitmentType = servingType => {
    const { commitmentTypes, options } = this.props;

    return commitmentTypes.find(ct => {
      const option = options.find(o => o.id === ct.option);

      return option && option.value === servingType.value && ct.dailyRate === true;
    });
  };

  isServingByExpressedInDays = servingType => {
    const commitmentType = this.getCommitmentType(servingType);
    return commitmentType ? commitmentType.dailyRate : false;
  };

  getNotApplicableSalaryText = servingType => {
    const servingTypeRole = servingType.value;

    if (servingTypeRole === SERVING_TYPES.SR || servingTypeRole === SERVING_TYPES.NS)
      return NON_APPLICIABLE_SALARY_TEXT.NOT_APPLICABLE;
    return NON_APPLICIABLE_SALARY_TEXT.MISSING_INFORMATION;
  };

  getServingType = collection => collection.filter(item => item.namespace === 'profile.servingtype');

  hasPayLevel = collection =>
    collection.some(item => item.namespace === 'profile.pay.level' && item.value !== null);

  hasServingType = collection => collection.find(q => q.namespace === 'profile.servingtype');

  render() {
    const { questions, service, handleCloseClick } = this.props;

    const hasServingType = this.hasServingType(questions);
    const hasPayLevel = this.hasPayLevel(questions);
    let salaryValueasString = this.getNotApplicableSalaryText(hasServingType);

    const servingTypeObject = this.getServingType(questions);
    const servingTypeRole = servingTypeObject[0].value ? servingTypeObject[0].value : false;
    const hasLevelQuestion = questions.find(q => q.namespace === 'profile.pay.level');

    const valueArr = questions.map(item => item.namespace);
    const isDuplicate = valueArr.some((item, idx) => valueArr.indexOf(item) !== idx);

    if (isDuplicate) throw new Error('Duplicate Namespace');

    // Calculate Salary amount
    // This really needs extracting into a function
    // Missing information returned if salary level not filled out
    // Not Applicable if Special reserve

    // const levelQuestion = questions.find(q => q.namespace === 'profile.pay.level');

    if (hasLevelQuestion === undefined) {
      // const thisQ = questions.find(q => q.namespace);
      throw new Error('There is a problem with the above question!');
    }

    const daysQuestion = questions.find(q => q.namespace === 'profile.pay.days');
    const expressedInDays = this.isServingByExpressedInDays(hasServingType);

    const levelQuestionValue = isJSON(hasLevelQuestion.value)
      ? JSON.parse(hasLevelQuestion.value)
      : hasLevelQuestion.value;

    const levelQuestionValueValue = levelQuestionValue && levelQuestionValue.value;

    if (hasPayLevel && servingTypeRole) {
      // Salary amount entered
      if (expressedInDays) {
        salaryValueasString = TotalSalary.calculateSalaryTotal(
          levelQuestionValue.meta.salary,
          true,
          parseInt(daysQuestion.value, 10),
          this.getCommitmentType(hasServingType).percentage,
          this.getCommitmentType(hasServingType).xFactor,
        );
      }
      // Special reserve not applicable
      if (servingTypeRole === SERVING_TYPES.SR)
        salaryValueasString = NON_APPLICIABLE_SALARY_TEXT.NOT_APPLICABLE;

      // Salary question not answered
      if (servingTypeRole && !levelQuestionValueValue)
        salaryValueasString = NON_APPLICIABLE_SALARY_TEXT.MISSING_INFORMATION;
      else {
        salaryValueasString = levelQuestionValueValue;
      }
    }

    return (
      <span>
        {hasPayLevel && servingTypeRole && hasLevelQuestion ? (
          formatCurrency(salaryValueasString)
        ) : (
          <React.Fragment>
            <Link
              onClick={handleCloseClick}
              className="text-white"
              to={`/${service.slug}/your-pay-and-pension/your-pay-and-pension-annual-salary`}
            >
              {salaryValueasString}
            </Link>
            <MissingIcon className="ml-2" />
          </React.Fragment>
        )}
      </span>
    );
  }
}

TotalSalary.propTypes = {
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  service: PropTypes.object,
  handleCloseClick: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  const questions = ownProps.questions || makeSelectQuestions(state);
  const options = makeSelectOptions(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);

  return {
    questions,
    options,
    commitmentTypes,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(TotalSalary));
