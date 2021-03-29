import { createSelector } from 'reselect';

/**
 * Direct selector to the benefits state domain
 */
const selectBenefits = state => state.get('benefits');

/**
 * Select the benefit items
 */

const makeSelectBenefits = createSelector(selectBenefits, benefitState => benefitState.get('items'));

/**
 * Select a benefit by ID
 */

const makeSelectBenefitById = createSelector(
  [makeSelectBenefits, (state, id) => id],
  (benefits, id) => benefits.find(benefit => benefit.get('id') === id) || false,
);

/**
 * Select a multiple benefits by ID
 */

const makeSelectMultipleBenefitsById = createSelector(
  [makeSelectBenefits, (state, ids) => ids],
  (benefits, ids) => benefits.filter(benefit => ids.indexOf(benefit.get('id')) !== -1),
);

export { selectBenefits, makeSelectBenefits, makeSelectBenefitById, makeSelectMultipleBenefitsById };
