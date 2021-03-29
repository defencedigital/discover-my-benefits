import PropTypes from 'prop-types';

export const FsPropType = PropTypes.shape({
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  details: PropTypes.string,
});

export const FsCommitmentTypePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  xFactor: PropTypes.number.isRequired,
  xFactorOF5AndAboveCalculation: PropTypes.string,
  xFactorOF5AndAboveLeaveFigure: PropTypes.number,
  xFactorOF5AndAboveXFactorMessage: PropTypes.string,
  percentage: PropTypes.number.isRequired,
  benefit: PropTypes.string.isRequired,
  commitmentTypes: PropTypes.array.isRequired,
  option: PropTypes.string.isRequired,
  dailyRate: PropTypes.bool,
  salaryTooltip: PropTypes.string,
  leaveMessage: PropTypes.string,
  expressLeaveAsHalfDay: PropTypes.bool,
});

export const FsCalculationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  percentageOne: PropTypes.number.isRequired,
  commitmentTypeOne: PropTypes.string.isRequired,
  commitmentTypeTwo: PropTypes.string.isRequired,
});
