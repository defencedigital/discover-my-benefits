/* eslint-disable no-console */
import R from 'ramda/src/groupBy';
import memoize from 'fast-memoize';
import get from 'lodash/get';
import { getProfile, questionsToFormBuilder } from '../Questions/helpers';
import Pay from '../../modules/Pay';
import { isJSON } from '../../utils/object';

const internalQuestions = {
  pay: Pay,
};

export const getCompleteStatus = () => ({
  code: 0,
  class: 'eligible',
  status: 'Eligible',
  info:
    '<p>Based on the information that you have provided, you are likely to be eligible for this benefit.</p><p><strong>Scroll down this page to find out how to claim.</strong></p>',
});

export const getMissingStatus = () => ({
  code: 1,
  class: 'missing',
  status: 'Missing information',
  info: '<p>Answer the questions to see if you are likely to be eligible.<p>',
});

export const getNotEligibleStatus = () => ({
  code: 2,
  class: 'not-eligible',
  status: 'Not Eligible',
  info:
    '<p>From the information you have provided we can see that you are not currently eligible for this benefit. You can check out the comparator to compare how eligibility might change in line with your circumstance. </p>',
});

export const statuses = {
  0: 'Eligible',
  1: 'Missing information',
  2: 'Not Eligible',
  3: 'Useful Information',
};

export const statusClasses = {
  0: 'eligible',
  1: 'missing',
  2: 'not-eligible',
  3: 'useful',
};

export const saveButton = [
  [
    {
      type: 'button',
      value: 'Save to Profile',
    },
  ],
];

export const serviceCache = {};
export const serviceCacheHash = {};

export const getCommitmentTypesByOption = (commitmentTypes, options) =>
  commitmentTypes.map(ct => Object.assign({}, ct, { option: options.find(o => o.id === ct.option) }));

export const checkForIndividualInternalQuestions = (
  question,
  service,
  allQuestions,
  commitmentTypes,
  options,
  fsCalculations,
) => {
  if (question.namespace === 'profile.rank') {
    const profile = getProfile(allQuestions);
    const Service = internalQuestions.pay;
    const servingQuestion = allQuestions.find(q => q.namespace === 'profile.servingtype');
    const ranksQuestion = new Service(
      service,
      servingQuestion,
      profile,
      getCommitmentTypesByOption(commitmentTypes, options),
      fsCalculations,
    ).getRanksQuestion();
    ranksQuestion.dependencies = [];

    return ranksQuestion;
  }

  return question;
};

export const getInternalQuestionsForBenefit = (
  service,
  benefit,
  allBenefits,
  questions,
  commitmentTypes,
  options,
  fsCalculations,
) => {
  if (!benefit.internalQuestions) {
    return [];
  }

  const profile = getProfile(questions);
  const Service = internalQuestions[benefit.internalQuestions];

  let serviceForm = serviceCache[benefit.internalQuestions];

  if (serviceForm) {
    Object.keys(serviceCacheHash[benefit.internalQuestions]).forEach(name => {
      const n = name.replace('profile.', '');
      const val = get(profile, n);
      if (val !== serviceCacheHash[benefit.internalQuestions][name][0].value) {
        serviceCacheHash[benefit.internalQuestions][name].forEach(formField => {
          const item = formField;
          item.value = val;
        });
      }
    });

    return serviceForm;
  }

  const servingQuestion = questions.find(q => q.namespace === 'profile.servingtype');
  serviceForm = new Service(
    service,
    servingQuestion,
    profile,
    getCommitmentTypesByOption(commitmentTypes, options),
    fsCalculations,
  ).getForm();
  serviceCache[benefit.internalQuestions] = serviceForm;

  const byName = R(result => result.name);
  const questionsByName = byName([].concat(...[].concat(...serviceCache[benefit.internalQuestions])));

  serviceCacheHash[benefit.internalQuestions] = questionsByName;

  return serviceForm;
};

const getProfileProgressFN = (
  profile,
  benefits,
  questions,
  calculations,
  dependencies,
  options,
  service,
  commitmentTypes,
  categories,
  fsCalculations,
) => {
  const results = benefits
    .filter(b => b.additionalQuestions && b.additionalQuestions.length > 0)
    .map(benefit =>
      getBenefitEligibilityStatus(
        benefit.id,
        profile,
        benefits,
        questions,
        calculations,
        dependencies,
        options,
        service,
        commitmentTypes,
        categories,
        fsCalculations,
      ),
    );

  const totalBenefits = results.length;
  const totalWithMissing = results.filter(result => result.code === 1).length;
  const totalEligible = results.filter(result => result.code === 0).length;
  const brokenBenefits = results.filter(result => result.primaryCategory === undefined);
  if (brokenBenefits.length > 0) {
    console.error('Uh Oh! These benefits do not have a primary category assigned');
    console.error(`How many in total: ${brokenBenefits.length}`);
    console.error(brokenBenefits);
    throw new Error('Error with benefits');
  }
  const byPrimaryCategory = R(result => result.primaryCategory.id);

  const ranges = byPrimaryCategory(results);

  const resultOrderedByCategory = {};
  Object.keys(ranges)
    .sort((a, b) => {
      if (service.categories.indexOf(a) > service.categories.indexOf(b)) {
        return 1;
      }

      return -1;
    })
    .forEach(key => {
      resultOrderedByCategory[key] = ranges[key];
    });

  Object.entries(resultOrderedByCategory).forEach(entries => {
    entries[1].sort((a, b) => {
      if (a.primaryCategory.benefits.indexOf(a.benefitId) > b.primaryCategory.benefits.indexOf(b.benefitId)) {
        return 1;
      }

      return -1;
    });
  });

  let localFavourites = JSON.parse(localStorage.getItem(`${service.serviceType}:favourites`)) || [];
  localFavourites.forEach(itemID => {
    const benefit = benefits.find(b => b.id === itemID);
    const category = benefit
      ? categories.find(c => c.id === benefit.primaryCategory)
      : categories.find(c => c.id === itemID);
    if (!benefit && !category) {
      // this happens if the user has favourited a benefit or category that has been removed since their last visit
      localFavourites = localFavourites.filter(item => item !== itemID);
    }
  });

  const totalFavourite = localFavourites ? localFavourites.length : 0;

  return {
    percentage: Math.floor((100 / totalBenefits) * (totalBenefits - totalWithMissing)),
    benefits: resultOrderedByCategory,
    totalBenefits,
    totalEligible,
    totalFavourite,
    totalWithMissing,
  };
};

export const getProfileProgress = memoize(getProfileProgressFN);

const getEligibleBenefitsFN = (benefits, calculations, allQuestions) => {
  const profile = getProfile(allQuestions);

  return benefits.filter(benefit => {
    const benefitCalculations = calculations.find(calculation => calculation.id === benefit.calculation);

    let eligible = true;

    if (benefitCalculations && benefitCalculations.eligible) {
      try {
        const test = eval(`(${benefitCalculations.eligible})`); // eslint-disable-line

        if (typeof test === 'function') {
          try {
            eligible = test(profile);
          } catch (e) {
            eligible = false;
          }
        }
      } catch (e) {
        eligible = false;

        console.warn('There is a calculation with a syntax error');
        console.warn('Benefit:', benefit.title);
      }
    }

    return eligible;
  });
};

export const getEligibleBenefits = memoize(getEligibleBenefitsFN);

const findDependencyFN = (dependencies, id) => dependencies.find(d => d.id === id);
const findDependency = memoize(findDependencyFN);

const findDependencyValuesFN = (options, dependencyObject) =>
  options.filter(option => dependencyObject.value.indexOf(option.id) !== -1);
const findDependencyValues = memoize(findDependencyValuesFN);

const cache = {};

export const getBenefitsQuestionsWithDependenciesRemoved = (
  flattenedForm,
  valuesById,
  dependencies,
  options,
) =>
  flattenedForm.filter(item => {
    if (!item.dependencies || item.dependencies.length < 1) {
      return true;
    }

    const key = item.dependencies
      .map(d => `${typeof d === 'string' ? 'no-key' : d.key}:${d.question}:${valuesById[d.question]}`)
      .join();

    if (key.indexOf('no-key') === -1) {
      const cachedVersion = cache[key];

      if (typeof cache[key] !== 'undefined') {
        if (typeof item.cacheDependency === 'undefined' || item.cacheDependency !== false) {
          return cachedVersion;
        }
      }
    }

    const check =
      item.dependencies.filter(dependency => {
        if (typeof dependency.value === 'function') {
          const value = valuesById[dependency.question];
          const dependencyQuestionValue = isJSON(value) || value;

          const result = dependency.value(dependencyQuestionValue);
          return result;
        }

        const dependencyObject = findDependency(dependencies, dependency);
        const dependencyQuestionValue = valuesById[dependencyObject.question];
        const dependencyValues = findDependencyValues(options, dependencyObject);

    if (valuesById.hasOwnProperty(dependencyObject.question) === false) { // eslint-disable-line
          throw new Error(
            `A question has a dependency on another question that has not been assigned to a benefit. ${dependency.name}`,
          );
        }

        return dependencyValues.some(dependencyValue => dependencyValue.value === dependencyQuestionValue);
      }).length === item.dependencies.length;

    if (key.indexOf('no-key') === -1) {
      cache[key] = check;
    }

    return check;
  });

export const getPrimaryCategoryByBenefit = (categories, benefit) =>
  categories.find(c => c.id === benefit.primaryCategory);

const getBenefitEligibilityStatusFN = (
  id,
  profile,
  allBenefits,
  questions,
  calculations,
  dependencies,
  options,
  service,
  commitmentTypes,
  categories,
  fsCalculations,
) => {
  const benefit = allBenefits.find(b => b.id === id);

  if (!benefit) {
    return getCompleteStatus();
  }

  const returnObject = {
    serviceSlug: service.slug,
    benefitId: benefit.id,
    benefit: benefit.title,
    benefitSlug: benefit.slug,
    primaryCategory: getPrimaryCategoryByBenefit(categories, benefit),
  };

  const additionalQuestions = benefit.additionalQuestions || [];

  const benefitInternalQuestions = getInternalQuestionsForBenefit(
    service,
    benefit,
    allBenefits,
    questions,
    commitmentTypes,
    options,
    fsCalculations,
  );
  const benefitQuestions = questionsToFormBuilder(
    questions
      .filter(q => additionalQuestions.indexOf(q.id) !== -1)
      .concat([].concat(...benefitInternalQuestions)),
    options,
  );
  const eligibleBenefits = getEligibleBenefits(allBenefits, calculations, questions);

  const flattenedForm = [].concat(...benefitQuestions);

  const benefitsQuestionsWithDependenciesRemoved = getBenefitsQuestionsWithDependenciesRemoved(
    flattenedForm,
    profile.valuesById,
    dependencies,
    options,
  );

  // if there no questions for a benefit
  if (benefitsQuestionsWithDependenciesRemoved.find(q => q.value === null || q.value === '-1')) {
    return Object.assign({}, returnObject, getMissingStatus());
    // if there are questions AND the answers the user has given for those questions makes them legible
  }
  if (eligibleBenefits.find(b => b.id === id)) {
    return Object.assign({}, returnObject, getCompleteStatus());
  }

  return Object.assign({}, returnObject, getNotEligibleStatus());
};

export const getBenefitEligibilityStatus = memoize(getBenefitEligibilityStatusFN);
