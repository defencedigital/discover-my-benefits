import { chunk } from '../../utils/array';
import { questionsToFormBuilder } from '../Questions/helpers';
import { getInternalQuestionsForBenefit, saveButton, checkForIndividualInternalQuestions } from '../Benefits/helpers';
import options from '../../json/squidex/options.json';
import fsCommitmentTypes from '../../json/squidex/fsCommitmentTypes.json';
import fsCalculations from '../../json/squidex/fsCalculations.json';
import benefits from '../../json/squidex/benefits.json';

export const getInternalQuestionsForCategory = (category, allQuestions, service) => {
  const benefitsWithInternalQuestions = category.benefits
    .filter(cb => {
      const benefit = benefits.find(b => b.id === cb);
      if (benefit.internalQuestions) {
        return true;
      }

      return false;
    })
    .map(cb => benefits.find(b => b.id === cb));

  return benefitsWithInternalQuestions.map(benefit => getInternalQuestionsForBenefit(service, benefit, benefits, allQuestions, fsCommitmentTypes, options, fsCalculations));
};

export const getCategoryForms = (service, categories, allQuestions, withSaveButton) =>
  categories.map(category => {
    const allCategoryQuestions = [].concat(...[].concat(...category.benefits.map(cb => benefits.find(b => b.id === cb).additionalQuestions || [])));

    const internalQuestionsForCategory = getInternalQuestionsForCategory(category, allQuestions, service);
    const flattenedInternalQuestionsForCategory = [].concat(...[].concat(...internalQuestionsForCategory));

    const internalQuestionsForCategoryWithoutDuplicates = [...new Set(flattenedInternalQuestionsForCategory.map(q => q.id))];

    return chunk(
      questionsToFormBuilder(
        allQuestions
          .filter(q => allCategoryQuestions.indexOf(q.id) !== -1 && internalQuestionsForCategoryWithoutDuplicates.indexOf(q.id) === -1)
          .map(cq => checkForIndividualInternalQuestions(cq, service, allQuestions, fsCommitmentTypes, options, fsCalculations))
          .sort((a, b) => {
            if (allCategoryQuestions.indexOf(a.id) > allCategoryQuestions.indexOf(b.id)) {
              return 1;
            }
            return -1;
          }),
        options,
      ),
      2,
    )
      .concat([].concat(...internalQuestionsForCategory))
      .concat(withSaveButton ? saveButton : [[]]);
  });
