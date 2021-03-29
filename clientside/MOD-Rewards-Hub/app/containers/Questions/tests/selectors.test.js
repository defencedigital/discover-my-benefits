import { fromJS } from 'immutable';

import { selectQuestions, makeSelectQuestionById, makeSelectMultipleQuestionsById } from '../selectors';

import { additionalPropsPerQuestion } from '../reducer';
import Questions from '../../../json/squidex/questions.json';

const initialState = fromJS({
  items: Questions.map(q => Object.assign(q, additionalPropsPerQuestion)),
});

describe('selectQuestions', () => {
  it('should select the questions state', () => {
    const globalState = fromJS({
      items: [],
    });
    const mockedState = fromJS({
      questions: globalState,
    });
    expect(selectQuestions(mockedState)).toEqual(globalState);
  });

  it('should select 1 item by id', () => {
    const mockedState = fromJS({
      questions: initialState,
    });
    const mockQuestion = Questions[0];
    expect(makeSelectQuestionById(mockedState, mockQuestion.id).toJS()).toEqual(mockQuestion);
  });

  it('should select multiple items by id', () => {
    const mockedState = fromJS({
      questions: initialState,
    });
    const mockQuestions = [Questions[0], Questions[1]];
    expect(makeSelectMultipleQuestionsById(mockedState, [mockQuestions[0].id, mockQuestions[1].id]).toJS()).toEqual(mockQuestions);
  });
});
