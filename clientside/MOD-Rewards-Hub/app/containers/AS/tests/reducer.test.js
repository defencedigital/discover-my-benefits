import { fromJS } from 'immutable';

import asReducer, { additionalPropsPerAS } from '../reducer';
import AS from '../../../json/squidex/accessibilityStatement.json';

const initialState = fromJS({
  items: AS.map(sa => Object.assign(sa, additionalPropsPerAS)),
});

describe('asReducer', () => {
  it('returns the initial state', () => {
    expect(asReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
