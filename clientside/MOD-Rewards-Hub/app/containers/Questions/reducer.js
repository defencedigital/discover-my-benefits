/*
 *
 * Questions reducer
 *
 */

import { fromJS } from 'immutable';
import get from 'lodash/get';
import { UPDATE_ANSWERS } from './constants';
import { SET_ACTIVE_SERVICE_SLUG } from '../App/constants';

import Questions from '../../json/squidex/questions.json';

export const additionalPropsPerQuestion = {
  value: null,
};

export const initialState = fromJS({
  items: Questions.map(q => Object.assign(q, additionalPropsPerQuestion)),
  currentProfileType: null,
});

function questionsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ANSWERS: {
      const items = state.get('items').toJS();
      items
        .filter(item => typeof action.answers[item.namespace] !== 'undefined')
        .forEach(item => {
          const itemToUpdate = item;
          itemToUpdate.value = action.answers[item.namespace];
        });
      return state.merge({
        items: fromJS(items),
      });
    }
    case SET_ACTIVE_SERVICE_SLUG: {
      if (state.get('currentProfileType') === action.slug) {
        return state;
      }

      const localStorageQuestions = typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem(`${action.slug}:questions`)) : undefined;

      return state.merge({
        items: Questions.map(q =>
          Object.assign(q, additionalPropsPerQuestion, {
            value: get(localStorageQuestions, q.namespace) || q.value,
          }),
        ),
        currentProfileType: action.slug,
      });
    }
    default:
      return state;
  }
}

export default questionsReducer;
