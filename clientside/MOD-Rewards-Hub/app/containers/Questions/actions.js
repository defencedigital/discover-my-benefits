/*
 *
 * Question actions
 *
 */

import { UPDATE_ANSWERS } from './constants';

export function updateAnswers(answers) {
  return {
    type: UPDATE_ANSWERS,
    answers,
  };
}
