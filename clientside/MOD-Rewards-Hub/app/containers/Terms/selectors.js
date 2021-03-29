import { createSelector } from 'reselect';

/**
 * Direct selector to the terms state domain
 */
const selectTerms = state => state.get('terms');

/**
 * Select the term items
 */

const makeSelectTerms = createSelector(selectTerms, termState => termState.get('items'));

/**
 * Select a term by ID
 */

const makeSelectTermById = createSelector([makeSelectTerms, (state, id) => id], (terms, id) => terms.find(term => term.get('id') === id) || false);

/**
 * Select a multiple terms by ID
 */

const makeSelectMultipleTermsById = createSelector([makeSelectTerms, (state, ids) => ids], (terms, ids) => terms.filter(term => ids.indexOf(term.get('id')) !== -1));

export { selectTerms, makeSelectTerms, makeSelectTermById, makeSelectMultipleTermsById };
