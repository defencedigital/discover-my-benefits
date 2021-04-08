import { fromJS } from 'immutable';
import get from 'lodash/get';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import questionsReducer, { additionalPropsPerQuestion } from '../reducer';
import Questions from '../../../json/squidex/questions.json';

Enzyme.configure({ adapter: new Adapter() });

const localStorageQuestions = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('questions')) : undefined;

const initialState = fromJS({
  items: Questions.map(q =>
    Object.assign(q, additionalPropsPerQuestion, {
      value: get(localStorageQuestions, q.namespace) || q.value,
    }),
  ),
});

describe('questionsReducer', () => {
  it('returns the initial state', () => {
    expect(questionsReducer(undefined, {})).toEqual(fromJS(initialState));
  });
});
