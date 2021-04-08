import { createSelector } from 'reselect';

/**
 * Direct selector to the accordions state domain
 */
const selectAccordions = state => state.get('accordions');

/**
 * Select the acc items
 */

const makeSelectAccordions = createSelector(selectAccordions, accState => accState.get('items'));

/**
 * Select a acc by ID
 */

const makeSelectAccordionById = createSelector([makeSelectAccordions, (state, id) => id], (accordions, id) => accordions.find(acc => acc.get('id') === id) || false);

/**
 * Select a multiple accordions by ID
 */

const makeSelectMultipleAccordionsById = createSelector([makeSelectAccordions, (state, ids) => ids], (accordions, ids) => accordions.filter(acc => ids.indexOf(acc.get('id')) !== -1));

export { selectAccordions, makeSelectAccordions, makeSelectAccordionById, makeSelectMultipleAccordionsById };
