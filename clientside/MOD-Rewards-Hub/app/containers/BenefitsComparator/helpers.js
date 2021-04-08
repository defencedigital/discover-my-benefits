/**
 * Select a multiple benefits by ID
 */

const multipleBenefitsById = (allBenefits, ids) =>
  allBenefits.filter(benefit => ids.indexOf(benefit.id) !== -1);

const getQuestionIDByNameSpace = (allQuestions, namespace) => {
  const questionObject = allQuestions.find(question => namespace.indexOf(question.namespace) !== -1);
  return questionObject.id;
};

const getLinkedBenefitsFromCoCCategories = (allBenefits, category) => {
  const categoryLinkedCategories = allBenefits.sort(
    (a, b) => category.benefits.indexOf(a.id) - category.benefits.indexOf(b.id),
  );
  return categoryLinkedCategories;
};

export { multipleBenefitsById, getLinkedBenefitsFromCoCCategories, getQuestionIDByNameSpace };
