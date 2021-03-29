import PropTypes from 'prop-types';

export const CalculationPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  eligible: PropTypes.string,
});
