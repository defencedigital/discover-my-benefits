import { fromJS } from 'immutable';

import benefitsReducer, { additionalPropsPerBenefit } from '../reducer';
import Benefits from '../../../json/squidex/benefits.json';

const initialState = fromJS({
  items: Benefits.map(b => Object.assign(b, additionalPropsPerBenefit)),
});

describe('benefitsReducer', () => {
  it('returns the initial state', () => {
    expect(benefitsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
