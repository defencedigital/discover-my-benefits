import { getCompleteStatus, getBenefitEligibilityStatus } from '../Benefits/helpers';

const getStatus = item => {
  const isCategory = item.categories;

  const { id } = item;

  return isCategory ? getCompleteStatus() : getBenefitEligibilityStatus(id);
};

const getCardStatus = (item, noQuestionsForCategory) => {
  const eligibleStatus = getStatus(item);

  let cardClass;

  if (eligibleStatus.code === 1) {
    cardClass = 'disabled';
  } else if (eligibleStatus.code === 2) {
    cardClass = 'not-eligible';
  } else {
    cardClass = '';
  }

  let status;
  status = !noQuestionsForCategory ? eligibleStatus.code : undefined;
  if (
    item.additionalQuestions === undefined ||
    item.additionalQuestions === null ||
    item.additionalQuestions.length <= 0
  ) {
    cardClass = '';
    status = undefined;
  }

  if (item.usefulStatus) {
    cardClass = 'useful';
    status = 3;
  }

  if (noQuestionsForCategory) {
    cardClass = '';
  }

  return { cardClass, status };
};

const getTags = (benefitTags, Alltags) => {
  let tags = [];
  if (benefitTags) {
    tags = benefitTags.map(id => Alltags.filter(e => id === e.id)).reduce((acc, val) => acc.concat(val), []);
  }
  return tags;
};

const getAllBenefitsIncludingCategories = (benefits, category, allCategories) => {
  const categoryLinkedCategories = category.categories
    ? allCategories.filter(c => category.categories.indexOf(c.id) !== -1)
    : [];
  return categoryLinkedCategories.concat(
    benefits.sort((a, b) => category.benefits.indexOf(a.id) - category.benefits.indexOf(b.id)),
  );
};

export { getCardStatus, getTags, getAllBenefitsIncludingCategories };
