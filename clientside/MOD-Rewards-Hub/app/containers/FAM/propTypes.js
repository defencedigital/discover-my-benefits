import PropTypes from 'prop-types';

export const FamPropType = PropTypes.shape({
  exploreIntro: PropTypes.string.isRequired,
  exploreDescription: PropTypes.string.isRequired,
  exploreCtaIntro: PropTypes.string.isRequired,
  exploreCtaDescription: PropTypes.string.isRequired,
  allowanceIntro: PropTypes.string.isRequired,
  allowanceDescription: PropTypes.string.isRequired,
  allowanceRentingQuestion: PropTypes.string.isRequired,
  allowanceBaseQuestion: PropTypes.string.isRequired,
  allowanceBaseQuestionDescription: PropTypes.string.isRequired,
  allowanceDependantsQuestion: PropTypes.string.isRequired,
  allowanceDependantsQuestionDescription: PropTypes.string.isRequired,
  allowanceBenchmarkTitle: PropTypes.string.isRequired,
  allowanceBenchmarkDescription: PropTypes.string.isRequired,
  allowanceBreakdownTitle: PropTypes.string.isRequired,
  allowanceBreakdownRentTitle: PropTypes.string.isRequired,
  allowanceBreakdownRentDescription: PropTypes.string.isRequired,
  allowanceBreakdownCoreTitle: PropTypes.string.isRequired,
  allowanceBreakdownCoreDescription: PropTypes.string.isRequired,
  allowanceBreakdownRentalTitle: PropTypes.string.isRequired,
  allowanceBreakdownRentalDescription: PropTypes.string.isRequired,
  allowanceBreakdownTotalTitle: PropTypes.string.isRequired,
  allowanceBreakdownTotalDescription: PropTypes.string.isRequired,
  allowancePersonalTitle: PropTypes.string.isRequired,
  allowancePersonalDescription: PropTypes.string.isRequired,
  allowanceRentPayTitle: PropTypes.string.isRequired,
  allowanceRentPayDescription: PropTypes.string.isRequired,
  depositIntro: PropTypes.string.isRequired,
  depositDescription: PropTypes.string.isRequired,
  depositRentalQuestion: PropTypes.string.isRequired,
  depositRentalDescription: PropTypes.string.isRequired,
  depositAmountQuestion: PropTypes.string.isRequired,
  depositAmountQuestionDescription: PropTypes.string.isRequired,
  depositBreakdownIntro: PropTypes.string.isRequired,
  depositBreakdownDescription: PropTypes.string.isRequired,
  cashflowIntro: PropTypes.string.isRequired,
  cashflowDescription: PropTypes.string.isRequired,
  cashflowRentalQuestion: PropTypes.string.isRequired,
  cashflowRentalDescription: PropTypes.string.isRequired,
  cashflowRentalStartQuestion: PropTypes.string.isRequired,
  cashflowRentalStartDescription: PropTypes.string.isRequired,
  cashflowBreakdownTitle: PropTypes.string.isRequired,
  cashflowBreakdownTitleHint: PropTypes.string.isRequired,
  cashflowBreakdownDescription: PropTypes.string.isRequired,
  eligibleIntro: PropTypes.string.isRequired,
  eligibleDescription: PropTypes.string.isRequired,
  eligibleTitle: PropTypes.string.isRequired,
  links: PropTypes.array,
  depositAndRentalLinks: PropTypes.array,
});

export const TpPropType = PropTypes.shape({
  exploreIntro: PropTypes.string.isRequired,
  exploreDescription: PropTypes.string.isRequired,
  exploreCtaIntro: PropTypes.string.isRequired,
  exploreCtaDescription: PropTypes.string.isRequired,
  allowanceIntro: PropTypes.string.isRequired,
  allowanceDescription: PropTypes.string.isRequired,
  allowanceRentingQuestion: PropTypes.string.isRequired,
  allowanceBaseQuestion: PropTypes.string.isRequired,
  allowanceBaseQuestionDescription: PropTypes.string.isRequired,
  allowanceDependantsQuestion: PropTypes.string.isRequired,
  allowanceDependantsQuestionDescription: PropTypes.string.isRequired,
  allowanceBenchmarkTitle: PropTypes.string.isRequired,
  allowanceBenchmarkDescription: PropTypes.string.isRequired,
  allowanceBreakdownTitle: PropTypes.string.isRequired,
  allowanceBreakdownRentTitle: PropTypes.string.isRequired,
  allowanceBreakdownRentDescription: PropTypes.string.isRequired,
  allowanceBreakdownCoreTitle: PropTypes.string.isRequired,
  allowanceBreakdownCoreDescription: PropTypes.string.isRequired,
  allowanceBreakdownRentalTitle: PropTypes.string.isRequired,
  allowanceBreakdownRentalDescription: PropTypes.string.isRequired,
  allowanceBreakdownTotalTitle: PropTypes.string.isRequired,
  allowanceBreakdownTotalDescription: PropTypes.string.isRequired,
  allowancePersonalTitle: PropTypes.string.isRequired,
  allowancePersonalDescription: PropTypes.string.isRequired,
  allowanceRentPayTitle: PropTypes.string.isRequired,
  allowanceRentPayDescription: PropTypes.string.isRequired,
  depositIntro: PropTypes.string.isRequired,
  depositDescription: PropTypes.string.isRequired,
  depositRentalQuestion: PropTypes.string.isRequired,
  depositRentalDescription: PropTypes.string.isRequired,
  depositAmountQuestion: PropTypes.string.isRequired,
  depositAmountQuestionDescription: PropTypes.string.isRequired,
  depositBreakdownIntro: PropTypes.string.isRequired,
  depositBreakdownDescription: PropTypes.string.isRequired,
  cashflowIntro: PropTypes.string.isRequired,
  cashflowDescription: PropTypes.string.isRequired,
  cashflowRentalQuestion: PropTypes.string.isRequired,
  cashflowRentalDescription: PropTypes.string.isRequired,
  cashflowRentalStartQuestion: PropTypes.string.isRequired,
  cashflowRentalStartDescription: PropTypes.string.isRequired,
  cashflowBreakdownTitle: PropTypes.string.isRequired,
  cashflowBreakdownTitleHint: PropTypes.string.isRequired,
  cashflowBreakdownDescription: PropTypes.string.isRequired,
  eligibleIntro: PropTypes.string.isRequired,
  eligibleDescription: PropTypes.string.isRequired,
  eligibleTitle: PropTypes.string.isRequired,
});

export const FamStatementsPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});

export const TpStatementsPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
});
