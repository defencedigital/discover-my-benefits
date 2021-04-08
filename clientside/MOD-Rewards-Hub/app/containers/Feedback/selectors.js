import { createSelector } from 'reselect';

const selectFeedback = state => state.get('feedback');
const selectRouter = state => state.get('router');

const makeSelectFeedbackStatus = createSelector([selectFeedback], feedbackState => feedbackState.get('status'));
const makeSelectFeedbackData = createSelector([selectFeedback], feedbackState => feedbackState.get('data'));
const makeSelectFeedbackError = createSelector([selectFeedback], feedbackState => feedbackState.get('error'));

const makeSelectRouterStatus = createSelector([selectRouter], routerState => routerState.get('location'));

export { makeSelectFeedbackStatus, makeSelectFeedbackData, makeSelectFeedbackError, makeSelectRouterStatus };
