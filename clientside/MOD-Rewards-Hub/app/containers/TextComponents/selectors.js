import { createSelector } from 'reselect';

/**
 * Direct selector to the textcomponents state domain
 */
const selectTextComponents = state => state.get('textcomponents');

/**
 * Select the textcomponent items
 */

const makeSelectTextComponents = createSelector(selectTextComponents, textcomponentState => textcomponentState.get('items'));

/**
 * Select a textcomponent by ID
 */

const makeSelectBenefitById = createSelector([makeSelectTextComponents, (state, id) => id], (textcomponents, id) => textcomponents.find(textcomponent => textcomponent.get('id') === id) || false);

/**
 * Select a multiple textcomponents by ID
 */

const makeSelectMultipleTextComponentsById = createSelector([makeSelectTextComponents, (state, ids) => ids], (textcomponents, ids) => textcomponents.filter(textcomponent => ids.indexOf(textcomponent.get('id')) !== -1));

export { selectTextComponents, makeSelectTextComponents, makeSelectBenefitById, makeSelectMultipleTextComponentsById };
