import { fromJS } from 'immutable';

import optionsReducer, { additionalPropsPerOption } from '../reducer';

import Options from '../../../json/squidex/options.json';

const initialState = fromJS({
  items: Options.map(o => Object.assign(o, additionalPropsPerOption)),
});

describe('optionsReducer', () => {
  it('returns the initial state', () => {
    expect(optionsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
