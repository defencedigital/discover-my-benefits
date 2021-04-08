import { fromJS } from 'immutable';

import dependenciesReducer, { additionalPropsPerDependency } from '../reducer';
import Dependencies from '../../../json/squidex/dependencies.json';

const initialState = fromJS({
  items: Dependencies.map(b => Object.assign(b, additionalPropsPerDependency)),
});

describe('dependenciesReducer', () => {
  it('returns the initial state', () => {
    expect(dependenciesReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
