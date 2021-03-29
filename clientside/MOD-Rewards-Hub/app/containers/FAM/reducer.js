/*
 *
 * FAM reducer
 *
 */

import { fromJS } from 'immutable';
import FAMS from '../../json/squidex/fam.json';
import TPS from '../../json/squidex/tp.json';
import famEligibleStatement from '../../json/squidex/famEligibleStatement.json';
import tpEligibleStatement from '../../json/squidex/tpEligibleStatement.json';

export const additionalPropsPerFam = {};
export const additionalPropsPerTp = {};
export const additionalPropsPerStatement = {};

export const initialState = fromJS({
  fam: FAMS.length > 0 ? FAMS.map(b => Object.assign(b, additionalPropsPerFam))[0] : null,
  tp: TPS.length > 0 ? TPS.map(b => Object.assign(b, additionalPropsPerTp))[0] : null,
  famEligibleStatements: famEligibleStatement.map(s => Object.assign(s, additionalPropsPerStatement)),
  tpEligibleStatements: tpEligibleStatement.map(s => Object.assign(s, additionalPropsPerStatement)),
});

function famReducer(state = initialState) {
  return state;
}

export default famReducer;
