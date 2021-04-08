/*
 *
 * FS reducer
 *
 */

import { fromJS } from 'immutable';
import FS from '../../json/squidex/fs.json';
import FSCommitmentTypes from '../../json/squidex/fsCommitmentTypes.json';
import FSCalculations from '../../json/squidex/fsCalculations.json';

export const additionalPropsPerItem = {};
export const additionalPropsPerCommitmentType = {};
export const additionalPropsPerCalculation = {};

export const initialState = fromJS({
  items: FS.map(b => Object.assign(b, additionalPropsPerItem)),
  commitmentTypes: FSCommitmentTypes.map(ct => Object.assign(ct, additionalPropsPerCommitmentType)),
  calculations: FSCalculations.map(ct => Object.assign(ct, additionalPropsPerCalculation)),
});

function fsReducer(state = initialState) {
  return state;
}

export default fsReducer;
