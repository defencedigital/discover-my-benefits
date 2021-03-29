import PropTypes from 'prop-types';

export const BenefitPropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  strapline: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  additionalQuestions: PropTypes.array,
  internalQuestions: PropTypes.string,
  links: PropTypes.array,
  benefitTags: PropTypes.array,
  benefitsImageNavy: PropTypes.string,
  benefitsImageArmy: PropTypes.string,
  benefitsImageMarines: PropTypes.string,
  benefitsImageRaf: PropTypes.string,
  usefulStatus: PropTypes.bool,
  disclaimer: PropTypes.string,
});
