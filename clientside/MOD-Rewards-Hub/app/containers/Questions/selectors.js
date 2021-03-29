import { createSelector } from 'reselect';

/**
 * Direct selector to the questions state domain
 */
const selectQuestions = state => state.get('questions');

/**
 * Select the question items
 */

const makeSelectQuestions = createSelector(selectQuestions, questionState => questionState.get('items'));

/**
 * Select a question by ID
 */

const makeSelectQuestionById = createSelector([makeSelectQuestions, (state, id) => id], (questions, id) => questions.find(question => question.get('id') === id) || false);

/**
 * Select a multiple questions by ID
 */

const makeSelectMultipleQuestionsById = createSelector([makeSelectQuestions, (state, ids) => ids], (questions, ids) => questions.filter(question => ids.indexOf(question.get('id')) !== -1).sort((a, b) => ids.indexOf(a.toJS().id) > ids.indexOf(b.toJS().id)));

/**
 * Select a currentProfileType
 */

const makeSelectCurrentProfileType = createSelector([selectQuestions], questionsState => questionsState.get('currentProfileType'));

export { selectQuestions, makeSelectQuestions, makeSelectQuestionById, makeSelectMultipleQuestionsById, makeSelectCurrentProfileType };
