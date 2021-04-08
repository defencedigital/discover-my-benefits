import { createSelector } from 'reselect';

/**
 * Direct selector to the ctacomponents state domain
 */
const selectCTAComponents = state => state.get('ctacomponents');

/**
 * Select the ctacomponent items
 */

const makeSelectCTAComponents = createSelector(selectCTAComponents, ctacomponentState => ctacomponentState.get('items'));

/**
 * Select a ctacomponent by ID
 */

const makeSelectCTAById = createSelector([makeSelectCTAComponents, (state, id) => id], (ctacomponents, id) => ctacomponents.find(ctacomponent => ctacomponent.get('id') === id) || false);

/**
 * Select a multiple ctacomponents by ID
 */

const makeSelectMultipleCTAComponentsById = createSelector([makeSelectCTAComponents, (state, ids) => ids], (ctacomponents, ids) => ctacomponents.filter(ctacomponent => ids.indexOf(ctacomponent.get('id')) !== -1));

export { selectCTAComponents, makeSelectCTAComponents, makeSelectCTAById, makeSelectMultipleCTAComponentsById };
