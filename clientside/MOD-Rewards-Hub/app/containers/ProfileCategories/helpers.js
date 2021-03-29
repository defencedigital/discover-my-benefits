import { chunk } from '../../utils/array';
import { questionsToFormBuilder } from '../Questions/helpers';
import { saveButton, checkForIndividualInternalQuestions } from '../Benefits/helpers';
import options from '../../json/squidex/options.json';
import fsCommitmentTypes from '../../json/squidex/fsCommitmentTypes.json';
import fsCalculations from '../../json/squidex/fsCalculations.json';

export const getProfileForms = (profileCategories, service, allQuestions, withSaveButton) =>
  profileCategories.map(category => {
    const categoryQuestions = category.questions.map(cq => {
      const question = allQuestions.find(q => q.id === cq);
      if (question !== undefined) {
        return Object.assign({}, checkForIndividualInternalQuestions(question, service, allQuestions, fsCommitmentTypes, options, fsCalculations), {
          dependencies: [],
        });
      }
      return false;
    });

    return chunk(questionsToFormBuilder(categoryQuestions, options), 2).concat(withSaveButton ? saveButton : [[]]);
  });
