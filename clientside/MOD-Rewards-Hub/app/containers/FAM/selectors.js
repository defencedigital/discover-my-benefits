import { createSelector } from 'reselect';

/**
 * Direct selector to the fams state domain
 */
const selectFam = state => state.get('fam');

/**
 * Select the fam item
 */

const makeSelectFam = createSelector(selectFam, famState => famState.get('fam'));

/**
 * Select the tp item
 */

const makeSelectTp = createSelector(selectFam, famState => famState.get('tp'));

/**
 * Select the FAM statements
 */

const makeSelectFamStatements = createSelector(selectFam, famState => famState.get('famEligibleStatements'));

/**
 * Select the TP statements
 */

const makeSelectTpStatements = createSelector(selectFam, famState => famState.get('tpEligibleStatements'));

export { selectFam, makeSelectFam, makeSelectTp, makeSelectFamStatements, makeSelectTpStatements };
