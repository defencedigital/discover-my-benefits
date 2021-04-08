import { createSelector } from 'reselect';

/**
 * Direct selector to the fs state domain
 */
const selectFS = state => state.get('fs');

/**
 * Select the fs items
 */

const makeSelectFS = createSelector(selectFS, fsState => fsState.get('items'));

/**
 * Select the commitment items
 */

const makeSelectCommitmentTypes = createSelector(selectFS, fsState => fsState.get('commitmentTypes'));

/**
 * Select the fs calculation items
 */

const makeSelectFSCalculations = createSelector(selectFS, fsState => fsState.get('calculations'));

export { selectFS, makeSelectFS, makeSelectFSCalculations, makeSelectCommitmentTypes };
