/* eslint-disable */
const expand = require('../../utils/object').expand;
const isJSON = require('../../utils/object').isJSON;

const getOptionsForQuestion = (options, question) => options.filter((option) => question.options.indexOf(option.id) !== -1).sort((a, b) => {
  if (question.options.indexOf(a.id) > question.options.indexOf(b.id)) {
    return 1;
  }

  return -1;
});

const getDefaultValue = (question) => {
  if (question.type === 'select' || question.type === 'radio') {
    try {
      return null;
    } catch(e) {
      throw new Error('A question has a dependency that is missing');
    }
  }

  if (question.type === 'number') {
    return 0;
  }

  return null;
};

const questionsToFormBuilder = (questions, options) => {
  let key = 999999999999;

  return questions.map((question) => {
    if (!question.title) {
      return question;
    }

    key += 1;

    return {
      id: question.id,
      label: question.title,
      type: question.type,
      name: question.namespace,
      hint: question.hint,
      value: question.value || getDefaultValue(question, options),
      options: getOptionsForQuestion(options, question),
      dependencies: (question.dependencies) ? question.dependencies.map((d) => {
        if (typeof d === 'object') {
          return Object.assign(d, { key });
        }

        return d;
      }) : [],
    };
  });
}

const getProfile = (questions) => {
  const profile = {
    profile: {},
  };

  const valuesById = {};

  questions.forEach((question) => {
    const jsonValue = isJSON(question.value);

    valuesById[question.id] = jsonValue || question.value;
    profile[question.namespace] = jsonValue || question.value;
  });

  profile.profile.valuesById = valuesById;

  return expand(profile).profile;
}

const mergeObjectValuesWithQuestions = (values, questions) => {
  return questions.map((q) => {
    if (typeof values[q.namespace] !== 'undefined') {
      return Object.assign({}, q, { value: values[q.namespace] });
    }

    return q;
  });
}

module.exports = {
  getProfile,
  questionsToFormBuilder,
  mergeObjectValuesWithQuestions,
  getOptionsForQuestion,
};
