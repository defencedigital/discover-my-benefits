import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toJS } from '../ToJS';
import { makeSelectBenefits } from '../../../containers/Benefits/selectors';
import { makeSelectQuestions } from '../../../containers/Questions/selectors';
import { makeSelectDependencies } from '../../../containers/Dependencies/selectors';
import { makeSelectSubApps } from '../../../containers/SubApps/selectors';
import { makeSelectCommitmentTypes, makeSelectFSCalculations } from '../../../containers/FS/selectors';
import { makeSelectMultipleCategoriesById } from '../../../containers/Categories/selectors';
import { makeSelectOptions } from '../../../containers/Options/selectors';
import { makeSelectCalculations } from '../../../containers/Calculations/selectors';
import { BenefitPropType } from '../../../containers/Benefits/propTypes';
import { OptionPropType } from '../../../containers/Options/propTypes';
import { ServicePropType } from '../../../containers/Services/propTypes';
import { DependencyPropType } from '../../../containers/Dependencies/propTypes';
import { CalculationPropType } from '../../../containers/Calculations/propTypes';
import { QuestionPropType } from '../../../containers/Questions/propTypes';
import { FsCalculationPropType, FsCommitmentTypePropType } from '../../../containers/FS/propTypes';
import { getProfile } from '../../../containers/Questions/helpers';
import { getProfileProgress } from '../../../containers/Benefits/helpers';
import { CategoryPropType } from '../../../containers/Categories/propTypes';
import { makeSelectFavourites } from '../../../containers/App/selectors';

class Progress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: null,
    };
  }

  componentDidMount() {
    const { questions } = this.props;
    this.setProgress(this.getProgress(questions));
  }

  componentWillReceiveProps(nextProps) {
    const { questions } = this.props;

    if (JSON.stringify(this.getProfile(questions)) !== JSON.stringify(this.getProfile(nextProps.questions))) {
      const progress = this.getProgress(nextProps.questions);
      this.setProgress(progress);
    } else {
      const progress = this.getProgress(questions);
      this.setProgress(progress);
    }
  }

  getProfile = questions => getProfile(questions);

  getProgress = givenQuestions => {
    const {
      service,
      categories,
      benefits,
      calculations,
      dependencies,
      options,
      commitmentTypes,
      fsCalculations,
      favourites,
    } = this.props;
    const allCategoryBenefitIds = benefits
      .filter(b => categories.find(c => c.benefits.indexOf(b.id) !== -1))
      .map(b => b.id);
    const benefitsForThisService = benefits.filter(b => allCategoryBenefitIds.indexOf(b.id) !== -1);
    const progress = getProfileProgress(
      this.getProfile(givenQuestions),
      benefitsForThisService,
      givenQuestions,
      calculations,
      dependencies,
      options,
      service,
      commitmentTypes,
      categories,
      fsCalculations,
      favourites,
    );
    return progress;
  };

  setProgress = progress => {
    this.setState({
      progress,
    });
  };

  render() {
    const { progress } = this.state;
    return progress !== null ? React.cloneElement(this.props.children, { progress }) : null;
  }
}

Progress.propTypes = {
  service: ServicePropType,
  categories: PropTypes.arrayOf(CategoryPropType).isRequired,
  benefits: PropTypes.arrayOf(BenefitPropType).isRequired,
  questions: PropTypes.arrayOf(QuestionPropType).isRequired,
  options: PropTypes.arrayOf(OptionPropType).isRequired,
  dependencies: PropTypes.arrayOf(DependencyPropType).isRequired,
  calculations: PropTypes.arrayOf(CalculationPropType).isRequired,
  commitmentTypes: PropTypes.arrayOf(FsCommitmentTypePropType).isRequired,
  fsCalculations: PropTypes.arrayOf(FsCalculationPropType).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  favourites: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const categories = makeSelectMultipleCategoriesById(state, ownProps.service.categories).sort(
    (a, b) =>
      ownProps.service.categories.indexOf(a.toJS().id) - ownProps.service.categories.indexOf(b.toJS().id),
  );

  const questions = ownProps.questions || makeSelectQuestions(state);
  const benefits = makeSelectBenefits(state);
  const options = makeSelectOptions(state);
  const dependencies = makeSelectDependencies(state);
  const calculations = makeSelectCalculations(state);
  const subApps = makeSelectSubApps(state);
  const commitmentTypes = makeSelectCommitmentTypes(state);
  const fsCalculations = makeSelectFSCalculations(state);
  const favourites = makeSelectFavourites(state);

  return {
    options,
    dependencies,
    calculations,
    questions,
    benefits,
    categories,
    subApps,
    commitmentTypes,
    fsCalculations,
    favourites,
  };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(toJS(Progress));
