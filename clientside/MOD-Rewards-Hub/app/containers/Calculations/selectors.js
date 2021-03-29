import { createSelector } from 'reselect';

/**
 * Direct selector to the calculations state domain
 */
const selectCalculations = state => state.get('calculations');

/**
 * Select the calculation items
 */

const makeSelectCalculations = createSelector(selectCalculations, calculationState => calculationState.get('items'));

/**
 * Select a calculation by ID
 */

const makeSelectCalculationById = createSelector([makeSelectCalculations, (state, id) => id], (calculations, id) => calculations.find(calculation => calculation.get('id') === id) || false);

/**
 * Select a multiple calculations by ID
 */

const makeSelectMultipleCalculationsById = createSelector([makeSelectCalculations, (state, ids) => ids], (calculations, ids) => calculations.filter(calculation => ids.indexOf(calculation.get('id')) !== -1));

export { selectCalculations, makeSelectCalculations, makeSelectCalculationById, makeSelectMultipleCalculationsById };
