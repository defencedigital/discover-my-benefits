import { fromJS } from 'immutable';
import calculationsReducer, { additionalPropsPerCalculation } from '../reducer';
import Calculations from '../../../json/squidex/calculations.json';

const initialState = fromJS({
  items: Calculations.map(c => Object.assign(c, additionalPropsPerCalculation)),
});

describe('calculationsReducer', () => {
  it('returns the initial state', () => {
    expect(calculationsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
