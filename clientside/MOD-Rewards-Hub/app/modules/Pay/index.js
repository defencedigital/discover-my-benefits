import R from 'ramda/src/groupBy';
import memoize from 'fast-memoize';
import Ranks from '../../json/pay/ranks.json';
import Pay from '../../json/pay/pay.json';
import PayTable from '../../json/pay/payTable.json';
import PayRange from '../../json/pay/payRange.json';
import Options from '../../json/squidex/options.json';
import { questionsToFormBuilder } from '../../containers/Questions/helpers';
import { isOF5AndAbove } from './utils';
import { getId } from '../../utils/id';

export default class PayService {
  static toFixed(salary) {
    return parseFloat(salary).toFixed(2);
  }

  getSalary = memoize(this.getSalaryFN.bind(this));

  getSalaryFN(salary, xFactor, useDailyRate, percentageReduction, xFactorOF5AndAboveCalculation) {
    const percentageReductionValue = 1 - percentageReduction / 100;

    let finalSalary = null;

    if (xFactorOF5AndAboveCalculation) {
      const commitmentTypeOneSalary = this.getSalary(
        salary,
        xFactorOF5AndAboveCalculation.commitmentTypeOne.xFactor,
        xFactorOF5AndAboveCalculation.commitmentTypeOne.dailyRate,
        xFactorOF5AndAboveCalculation.commitmentTypeOne.percentage,
        false,
      ).value;
      const commitmentTypeTwoSalary = this.getSalary(
        salary,
        xFactorOF5AndAboveCalculation.commitmentTypeTwo.xFactor,
        xFactorOF5AndAboveCalculation.commitmentTypeTwo.dailyRate,
        xFactorOF5AndAboveCalculation.commitmentTypeTwo.percentage,
        false,
      ).value;
      const salaryWithCustomCalculation =
        commitmentTypeOneSalary * (1 - xFactorOF5AndAboveCalculation.percentageOne / 100) +
        (commitmentTypeTwoSalary - commitmentTypeOneSalary) *
          (1 - xFactorOF5AndAboveCalculation.percentageOne / 100) *
          0.8;

      finalSalary = {
        value: salaryWithCustomCalculation,
        meta: {
          salary,
        },
      };
    } else {
      const salaryWithXFactor = (salary / (100 + 14.5)) * (100 + xFactor);
      const salaryWithPercentageReductionAndXFactor = salaryWithXFactor * percentageReductionValue;
      finalSalary = {
        value: salaryWithPercentageReductionAndXFactor,
        meta: {
          salary,
        },
      };
    }

    if (useDailyRate) {
      finalSalary.value = `${PayService.toFixed(finalSalary.value / 365.23)} per day`;
      return finalSalary;
    }

    finalSalary.value = PayService.toFixed(finalSalary.value);
    return finalSalary;
  }

  constructor(service, servingQuestion, profile, commitmentTypes, fsCalculations) {
    this.service = service;
    this.serviceMap = {
      navy: 1,
      army: 3,
      raf: 4,
      marines: 2,
    };
    this.servingQuestion = servingQuestion;
    this.profile = profile;
    this.commitmentTypes = commitmentTypes;
    this.fsCalculations = fsCalculations;
  }

  getService() {
    return this.service;
  }

  getServiceId() {
    return this.serviceMap[this.getService().serviceType];
  }

  getServingQuestion() {
    return this.servingQuestion;
  }

  getServingPersonnelQuestion() {
    const servingQuestion = this.getServingQuestion();
    const question = questionsToFormBuilder([servingQuestion], Options);

    return Object.assign(question[0], {
      onChangeReset: ['profile.pay.level', 'profile.pay.supplement.level'],
    });
  }

  getServingPersonnelQuestionOptions() {
    return this.commitmentTypes.map(commitmentType => commitmentType.option);
  }

  getDaysQuestion = memoize(this.getDaysQuestionFN.bind(this));

  getDaysQuestionFN(maxDays, servingType) {
    const servingQuestion = this.getServingQuestion();

    return {
      type: 'number',
      value: this.profile.pay.days || 1,
      label: 'How many days, on average, do you work?',
      hint: '(Per Year)',
      id: 'days',
      name: 'profile.pay.days',
      dependencies: [
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => currentAnswer === servingType,
        },
      ],
      validation: [
        currentAnswer => {
          if (typeof currentAnswer === 'undefined') {
            return true;
          }

          const max = maxDays || 365;
          const min = 1;

          if (parseFloat(currentAnswer) < min || parseFloat(currentAnswer) > max) {
            return `Your days must be between ${min} and ${max}`;
          }

          return true;
        },
      ],
    };
  }

  getRanksQuestion = memoize(this.getRanksQuestionFN.bind(this));

  getRanksQuestionFN() {
    const serviceId = this.getServiceId();
    const ranks = Ranks.filter(r => r.ServiceID === serviceId)
      .sort((a, b) => b.Order - a.Order)
      .reverse();

    const servingQuestion = this.getServingQuestion();
    const availableOptionValues = this.getServingPersonnelQuestionOptions().map(option => option.value);

    return {
      type: 'select',
      value: this.profile.rank,
      label: 'What is your rank?',
      id: 'rank',
      name: 'profile.rank',
      options: ranks.map(r => ({
        id: r.ID,
        value: JSON.stringify({ value: r.Name, meta: r }),
        name: r.Name,
      })),
      dependencies: [
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => availableOptionValues.indexOf(currentAnswer) !== -1,
        },
      ],
      onChangeReset: [
        'profile.pay.level',
        'profile.pay.supplement.level',
        'profile.pay.unique',
        'profile.pay.which',
      ],
      cacheDependency: false,
    };
  }

  getUniquePayTableQuestion() {
    const servingQuestion = this.getServingQuestion();
    const availableOptionValues = this.getServingPersonnelQuestionOptions().map(option => option.value);

    return {
      type: 'select',
      value: this.profile.pay.unique,
      label: 'Are you paid from a Unique Pay Table?',
      id: 'unique.pay.table',
      name: 'profile.pay.unique',
      options: [
        {
          id: 'profile.pay.unique.yes',
          value: true,
          name: 'Yes',
        },
        {
          id: 'profile.pay.unique.no',
          value: false,
          name: 'No',
        },
        {
          id: 'profile.pay.unique.notSure',
          value: false,
          name: 'Not Sure',
        },
      ],
      dependencies: [
        {
          key: getId(),
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer || currentAnswer === '-1') {
              return false;
            }

            const rank = currentAnswer.meta;
            return rank.AllowsUniquePayTable === -1;
          },
        },
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => availableOptionValues.indexOf(currentAnswer) !== -1,
        },
      ],
      cacheDependency: false,
    };
  }

  getPayLevelQuestions(
    xFactor,
    servingType,
    useDailyRate,
    percentageReduction,
    xFactorOF5AndAboveCalculation,
    xFactorOF5AndAboveCalculationExists,
  ) {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);
    const questions = [];

    const servingQuestion = this.getServingQuestion();

    Object.keys(ranges).forEach(rangeKey => {
      questions.push(ranges[rangeKey]);
    });

    return questions.map(range => ({
      type: 'select',
      value: this.profile.pay.level,
      label: 'What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: range
        .map(r => ({
          id: r.ID,
          value: `${JSON.stringify(
            this.getSalary(
              r.Salary2020,
              xFactor,
              useDailyRate,
              percentageReduction,
              xFactorOF5AndAboveCalculation,
            ),
          )}`,
          name: `${r.Level} - £${
            this.getSalary(
              r.Salary2020,
              xFactor,
              useDailyRate,
              percentageReduction,
              xFactorOF5AndAboveCalculation,
            ).value
          }`,
        }))
        .sort((a, b) => a.ID < b.ID),
      dependencies: [
        {
          key: getId(),
          id: `${range[0].PayRangeID}:${range[0].PayTableID}`,
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer || currentAnswer === '-1') {
              return false;
            }

            const rank = currentAnswer.meta;
            const rangeFound = PayRange.find(r => r.ID === rank.PayRangeID);

            if (xFactorOF5AndAboveCalculation !== false && !isOF5AndAbove(rangeFound)) {
              return false;
            }

            if (
              xFactorOF5AndAboveCalculation === false &&
              isOF5AndAbove(rangeFound) &&
              xFactorOF5AndAboveCalculationExists
            ) {
              return false;
            }

            return (
              rank.AllowsUniquePayTable === 0 &&
              rank.PayRangeID === range[0].PayRangeID &&
              rank.CorePayTableID === range[0].PayTableID
            );
          },
        },
        {
          key: getId(),
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'false' || currentAnswer === null,
        },
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => currentAnswer === servingType,
        },
      ],
      cacheDependency: false,
    }));
  }

  getNonUniquePayLevelQuestions(
    xFactor,
    servingType,
    useDailyRate,
    percentageReduction,
    xFactorOF5AndAboveCalculation,
    xFactorOF5AndAboveCalculationExists,
  ) {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);
    const questions = [];

    const servingQuestion = this.getServingQuestion();

    Object.keys(ranges).forEach(rangeKey => {
      questions.push(ranges[rangeKey]);
    });

    const finalQuestions = questions.map(range => ({
      type: 'select',
      value: this.profile.pay.level,
      label: 'What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: range.map(r => ({
        id: r.ID,
        value: `${JSON.stringify(
          this.getSalary(
            r.Salary2020,
            xFactor,
            useDailyRate,
            percentageReduction,
            xFactorOF5AndAboveCalculation,
          ),
        )}`,
        name: `${r.Level} - £${
          this.getSalary(
            r.Salary2020,
            xFactor,
            useDailyRate,
            percentageReduction,
            xFactorOF5AndAboveCalculation,
          ).value
        }`,
      })),
      dependencies: [
        {
          key: getId(),
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer || currentAnswer === '-1') {
              return false;
            }

            const rank = currentAnswer.meta;
            const rangeFound = PayRange.find(r => r.ID === rank.PayRangeID);

            if (xFactorOF5AndAboveCalculation !== false && !isOF5AndAbove(rangeFound)) {
              return false;
            }

            if (
              xFactorOF5AndAboveCalculation === false &&
              isOF5AndAbove(rangeFound) &&
              xFactorOF5AndAboveCalculationExists
            ) {
              return false;
            }

            return range[0].PayRangeID === rank.PayRangeID && range[0].PayTableID === rank.CorePayTableID;
          },
        },
        {
          key: getId(),
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'false',
        },
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => currentAnswer === servingType,
        },
      ],
      cacheDependency: false,
    }));

    return finalQuestions;
  }

  getWhichPayLevelQuestionsEdgeCase(
    xFactor,
    servingType,
    useDailyRate,
    percentageReduction,
    xFactorOF5AndAboveCalculation,
    xFactorOF5AndAboveCalculationExists,
  ) {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);

    const servingQuestion = this.getServingQuestion();

    return {
      type: 'select',
      value: this.profile.pay.level,
      label: 'What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: ranges[':6'].map(r => ({
        id: r.ID,
        value: `${JSON.stringify(
          this.getSalary(
            r.Salary2020,
            xFactor,
            useDailyRate,
            percentageReduction,
            xFactorOF5AndAboveCalculation,
          ),
        )}`,
        name: `${r.Level} - £${
          this.getSalary(
            r.Salary2020,
            xFactor,
            useDailyRate,
            percentageReduction,
            xFactorOF5AndAboveCalculation,
          ).value
        }`,
      })),
      dependencies: [
        {
          key: getId(),
          id: 'which-unique-Pay-table',
          question: 'profile.pay.which',
          value: currentAnswer => currentAnswer === '6',
        },
        {
          key: getId(),
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer || currentAnswer === '-1') {
              return false;
            }
            const rank = currentAnswer.meta;
            const rangeFound = PayRange.find(r => r.ID === rank.PayRangeID);

            if (xFactorOF5AndAboveCalculation !== false && !isOF5AndAbove(rangeFound)) {
              return false;
            }

            if (
              xFactorOF5AndAboveCalculation === false &&
              isOF5AndAbove(rangeFound) &&
              xFactorOF5AndAboveCalculationExists
            ) {
              return false;
            }

            const result = PayTable.find(item => item.ID === rank.CorePayTableID);

            return !result || (result && result.IsUniquePayTable === 0);
          },
        },
        {
          key: getId(),
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'true' || currentAnswer === 'maybe',
        },
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => currentAnswer === servingType,
        },
      ],
      cacheDependency: false,
    };
  }

  getWhichPayLevelQuestions(
    xFactor,
    servingType,
    useDailyRate,
    percentageReduction,
    xFactorOF5AndAboveCalculation,
    xFactorOF5AndAboveCalculationExists,
  ) {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);
    const questions = [];

    const servingQuestion = this.getServingQuestion();

    Object.keys(ranges).forEach(rangeKey => {
      questions.push(ranges[rangeKey]);
    });

    const finalQuestions = questions.map(range => ({
      type: 'select',
      value: this.profile.pay.level,
      label: 'What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: range.map(r => ({
        id: r.ID,
        value: `${JSON.stringify(
          this.getSalary(
            r.Salary2020,
            xFactor,
            useDailyRate,
            percentageReduction,
            xFactorOF5AndAboveCalculation,
          ),
        )}`,
        name: `${r.Level} - £${
          this.getSalary(
            r.Salary2020,
            xFactor,
            useDailyRate,
            percentageReduction,
            xFactorOF5AndAboveCalculation,
          ).value
        }`,
      })),
      dependencies: [
        {
          key: getId(),
          id: 'which-unique-Pay-table',
          question: 'profile.pay.which',
          value: currentAnswer => currentAnswer === range[0].PayTableID.toString(),
        },
        {
          key: getId(),
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer || currentAnswer === '-1') {
              return false;
            }

            const rank = currentAnswer.meta;
            const rangeFound = PayRange.find(r => r.ID === rank.PayRangeID);

            if (xFactorOF5AndAboveCalculation !== false && !isOF5AndAbove(rangeFound)) {
              return false;
            }

            if (
              xFactorOF5AndAboveCalculation === false &&
              isOF5AndAbove(rangeFound) &&
              xFactorOF5AndAboveCalculationExists
            ) {
              return false;
            }

            return range[0].PayRangeID === rank.PayRangeID;
          },
        },
        {
          key: getId(),
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'true' || currentAnswer === 'maybe',
        },
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => currentAnswer === servingType,
        },
      ],
      cacheDependency: false,
    }));

    // finalQuestions.push(this.getWhichPayLevelQuestionsEdgeCase(xFactor, servingType, useDailyRate, percentageReduction, xFactorOF5AndAboveCalculation, xFactorOF5AndAboveCalculationExists));

    return finalQuestions;
  }

  filterDiversPayTableFromAllServicesExceptNavy(service, options) {
    if (service.serviceType !== 'navy') {
      const filteredOptions = options.filter(i => i.ID !== 12);
      return filteredOptions;
    }
    return options;
  }

  filterVetinaryOfficersPayTableFromAllServicesExceptArmy(service, options) {
    if (service.serviceType !== 'army') {
      const filteredOptions = options.filter(i => i.ID !== 29);
      return filteredOptions;
    }
    return options;
  }

  filterCustomAviatorsRange(service, options, range) {
    // Aviators pay ranges currently cover these pay tables: 8,9,10,11,25,26,27,28
    const num = parseInt(range, 10);
    // we want to filter out the aviators pay table from pay range except 25,26,27,28,11 in all services except army
    if (service.serviceType !== 'army' && service.serviceType !== 'raf') {
      // range to filter out below
      const arr = [11, 26, 27, 28, 29];
      // if we aren't in army filter out the extra pay ranges
      if (arr.includes(num)) {
        const filteredOptions = options.filter(i => i.ID !== 6);
        return filteredOptions;
      }
    }
    if (service.serviceType === 'raf') {
      const RAFarr = [11, 27, 29, 8];
      // if we are in raf filter out the extra pay ranges
      if (RAFarr.includes(num)) {
        const raffilteredOptions = options.filter(i => i.ID !== 6);
        return raffilteredOptions;
      }
    }
    if (service.serviceType === 'army') {
      const RAFarr = [8];
      // if we are in army filter out the extra pay ranges
      if (RAFarr.includes(num)) {
        const raffilteredOptions = options.filter(i => i.ID !== 6);
        return raffilteredOptions;
      }
    }
    return options;
  }

  getWhichUniquePayQuestion() {
    const allPayRanges = Pay.map(item => item.PayRangeID).filter(
      (item, position, array) => array.indexOf(item) === position,
    );
    const service = this.getService();
    const tables = {};
    const questions = [];

    const servingQuestion = this.getServingQuestion();
    const availableOptionValues = this.getServingPersonnelQuestionOptions().map(option => option.value);

    allPayRanges.forEach(range => {
      tables[range] = Pay.filter(item => item.PayRangeID === range)
        .map(item => item.PayTableID)
        .filter((item, position, array) => array.indexOf(item) === position);
    });

    Object.keys(tables).forEach(tableKey => {
      const table = tables[tableKey];
      const tableOptions = PayTable.filter(
        item => table.indexOf(item.ID) !== -1 && item.IsUniquePayTable === -1,
      );
      const filteredOptionList = this.filterDiversPayTableFromAllServicesExceptNavy(service, tableOptions);
      const aviatorFilteredOptionList = this.filterCustomAviatorsRange(service, filteredOptionList, tableKey);
      const vetinaryFilteredOptionList = this.filterVetinaryOfficersPayTableFromAllServicesExceptArmy(
        service,
        aviatorFilteredOptionList,
        tableKey,
      );

      let dropdownOptions;
      if (vetinaryFilteredOptionList.length) {
        dropdownOptions = vetinaryFilteredOptionList;
      } else if (aviatorFilteredOptionList.length) {
        dropdownOptions = aviatorFilteredOptionList;
      } else {
        dropdownOptions = filteredOptionList;
      }

      questions.push({
        type: 'select',
        value: this.profile.pay.which,
        label: 'Which Unique Pay Table are you paid from?',
        id: 'profile.pay.which',
        name: 'profile.pay.which',
        options: dropdownOptions.map(option => ({
          id: option.ID,
          value: option.ID,
          name: option.TableName,
        })),
        dependencies: [
          {
            key: getId(),
            id: `${tableKey}`,
            question: 'rank',
            value: currentAnswer => {
              if (!currentAnswer || currentAnswer === '-1') {
                return false;
              }

              const PayRangeID = tableKey;
              const rank = currentAnswer.meta;

              return parseInt(PayRangeID, 10) === rank.PayRangeID;
            },
          },
          {
            key: getId(),
            id: 'unique-Pay-table',
            question: 'unique.pay.table',
            value: currentAnswer => currentAnswer === 'true' || currentAnswer === 'maybe',
          },
          {
            key: getId(),
            id: 'profile.rank',
            question: 'rank',
            value: currentAnswer => {
              if (!currentAnswer || currentAnswer === '-1') {
                return false;
              }

              const rank = currentAnswer.meta;
              return rank.AllowsUniquePayTable === -1;
            },
          },
          {
            key: getId(),
            id: 'profile.servingtype',
            question: servingQuestion.id,
            value: currentAnswer => availableOptionValues.indexOf(currentAnswer) !== -1,
          },
        ],
        cacheDependency: false,
      });
    });

    return questions;
  }

  getSupplementLevelQuestions() {
    const servingQuestion = this.getServingQuestion();
    const availableOptionValues = this.getServingPersonnelQuestionOptions().map(option => option.value);

    const ranksThatNeedSupplement = Ranks.filter(
      r => r.ServiceID === this.getServiceId() && r.CorePayTableID === '',
    );

    return ranksThatNeedSupplement.map(rank => ({
      type: 'select',
      value: this.profile.pay.supplement.level,
      label: 'What is your supplement level?',
      id: 'supplement.level',
      name: 'profile.pay.supplement.level',
      options: [
        {
          id: 'level.1',
          value: 24,
          name: 'Level 1',
        },
        {
          id: 'level.2',
          value: 25,
          name: 'Level 2',
        },
        {
          id: 'level.3',
          value: 26,
          name: 'Level 3',
        },
        {
          id: 'level.4',
          value: 27,
          name: 'Level 4',
        },
      ],
      dependencies: [
        {
          key: getId(),
          id: `${rank.ID}`,
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer || currentAnswer === '-1') {
              return false;
            }

            const r = currentAnswer.meta;
            return r.ID === rank.ID;
          },
        },
        {
          key: getId(),
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'false',
        },
        {
          key: getId(),
          id: 'profile.servingtype',
          question: servingQuestion.id,
          value: currentAnswer => availableOptionValues.indexOf(currentAnswer) !== -1,
        },
      ],
      cacheDependency: false,
    }));
  }

  getSalarySupplementPayLevelQuestions(
    xFactor,
    servingType,
    useDailyRate,
    percentageReduction,
    xFactorOF5AndAboveCalculation,
    xFactorOF5AndAboveCalculationExists,
  ) {
    const servingQuestion = this.getServingQuestion();

    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);

    const ranksThatNeedSupplement = Ranks.filter(
      r => r.ServiceID === this.getServiceId() && r.CorePayTableID === '',
    );
    const levels = [{ id: 24 }, { id: 25 }, { id: 26 }, { id: 27 }];

    const questions = [];

    Object.keys(ranges).forEach(rangeKey => {
      const rangeID = parseInt(rangeKey.split(':')[0], 10);
      const payTableID = parseInt(rangeKey.split(':')[1], 10);

      ranksThatNeedSupplement.forEach(rank => {
        levels.forEach(level => {
          if (payTableID === level.id && rangeID === rank.PayRangeID) {
            questions.push({
              type: 'select',
              value: this.profile.pay.level,
              label: 'What is your current Pay level?',
              id: 'level',
              name: 'profile.pay.level',
              options: ranges[rangeKey]
                .map(r => ({
                  id: r.ID,
                  value: `${JSON.stringify(
                    this.getSalary(
                      r.Salary2020,
                      xFactor,
                      useDailyRate,
                      percentageReduction,
                      xFactorOF5AndAboveCalculation,
                    ),
                  )}`,
                  name: `${r.Level} - £${
                    this.getSalary(
                      r.Salary2020,
                      xFactor,
                      useDailyRate,
                      percentageReduction,
                      xFactorOF5AndAboveCalculation,
                    ).value
                  }`,
                }))
                .sort((a, b) => a.ID < b.ID),
              dependencies: [
                {
                  key: getId(),
                  id: `${ranges[rangeKey][0].PayRangeID}:${ranges[rangeKey][0].PayTableID}`,
                  question: 'rank',
                  value: currentAnswer => {
                    if (!currentAnswer || currentAnswer === '-1') {
                      return false;
                    }

                    const currentRank = currentAnswer.meta;
                    const rangeFound = PayRange.find(r => r.ID === rank.PayRangeID);

                    if (xFactorOF5AndAboveCalculation !== false && !isOF5AndAbove(rangeFound)) {
                      return false;
                    }

                    if (
                      xFactorOF5AndAboveCalculation === false &&
                      isOF5AndAbove(rangeFound) &&
                      xFactorOF5AndAboveCalculationExists
                    ) {
                      return false;
                    }

                    return currentRank.ID === rank.ID;
                  },
                },
                {
                  key: getId(),
                  id: 'supplement.level',
                  question: 'supplement.level',
                  value: currentAnswer => parseInt(currentAnswer, 10) === level.id,
                },
                {
                  key: getId(),
                  id: 'unique-Pay-table',
                  question: 'unique.pay.table',
                  value: currentAnswer => currentAnswer === 'false',
                },
                {
                  key: getId(),
                  id: 'profile.servingtype',
                  question: servingQuestion.id,
                  value: currentAnswer => currentAnswer === servingType,
                },
              ],
              cacheDependency: false,
            });
          }
        });
      });
    });

    return questions;
  }

  getXFactorOF5AndAboveCalculation(commitmentType) {
    const xFactorOF5AndAboveCalculation = this.fsCalculations.find(c => c.id === commitmentType);
    return Object.assign({}, xFactorOF5AndAboveCalculation, {
      commitmentTypeOne: this.commitmentTypes.find(
        type => type.id === xFactorOF5AndAboveCalculation.commitmentTypeOne,
      ),
      commitmentTypeTwo: this.commitmentTypes.find(
        type => type.id === xFactorOF5AndAboveCalculation.commitmentTypeTwo,
      ),
    });
  }

  getForm() {
    const form = [];

    form.push([this.getServingPersonnelQuestion()]);

    // these commintmentTypes are pulled from FS-Commitment-Type in squidex!

    this.commitmentTypes
      .filter(commitmentType => commitmentType.dailyRate)
      .forEach(commitmentType => {
        form.push([this.getDaysQuestion(commitmentType.maxDays, commitmentType.option.value)]);
      });

    form.push([this.getRanksQuestion()]);

    form.push([this.getUniquePayTableQuestion()]);

    form.push(this.getWhichUniquePayQuestion());

    this.commitmentTypes.forEach(commitmentType => {
      form.push(
        this.getPayLevelQuestions(
          commitmentType.xFactor,
          commitmentType.option.value,
          commitmentType.dailyRate,
          commitmentType.percentage,
          false,
          commitmentType.xFactorOF5AndAboveCalculation !== null,
        ),
      );
      form.push(
        this.getNonUniquePayLevelQuestions(
          commitmentType.xFactor,
          commitmentType.option.value,
          commitmentType.dailyRate,
          commitmentType.percentage,
          false,
          commitmentType.xFactorOF5AndAboveCalculation !== null,
        ),
      );
      form.push(
        this.getWhichPayLevelQuestions(
          commitmentType.xFactor,
          commitmentType.option.value,
          commitmentType.dailyRate,
          commitmentType.percentage,
          false,
          commitmentType.xFactorOF5AndAboveCalculation !== null,
        ),
      );

      if (commitmentType.xFactorOF5AndAboveCalculation) {
        const xFactorOF5AndAboveCalculation = this.getXFactorOF5AndAboveCalculation(
          commitmentType.xFactorOF5AndAboveCalculation,
        );
        form.push(
          this.getPayLevelQuestions(
            commitmentType.xFactor,
            commitmentType.option.value,
            commitmentType.dailyRate,
            commitmentType.percentage,
            xFactorOF5AndAboveCalculation,
          ),
        );
        form.push(
          this.getNonUniquePayLevelQuestions(
            commitmentType.xFactor,
            commitmentType.option.value,
            commitmentType.dailyRate,
            commitmentType.percentage,
            xFactorOF5AndAboveCalculation,
          ),
        );
        form.push(
          this.getWhichPayLevelQuestions(
            commitmentType.xFactor,
            commitmentType.option.value,
            commitmentType.dailyRate,
            commitmentType.percentage,
            xFactorOF5AndAboveCalculation,
          ),
        );
      }
    });

    form.push(this.getSupplementLevelQuestions());

    this.commitmentTypes.forEach(commitmentType => {
      form.push(
        this.getSalarySupplementPayLevelQuestions(
          commitmentType.xFactor,
          commitmentType.option.value,
          commitmentType.dailyRate,
          commitmentType.percentage,
          false,
          commitmentType.xFactorOF5AndAboveCalculation !== null,
        ),
      );
      if (commitmentType.xFactorOF5AndAboveCalculation) {
        const xFactorOF5AndAboveCalculation = this.getXFactorOF5AndAboveCalculation(
          commitmentType.xFactorOF5AndAboveCalculation,
        );
        form.push(
          this.getSalarySupplementPayLevelQuestions(
            commitmentType.xFactor,
            commitmentType.option.value,
            commitmentType.dailyRate,
            commitmentType.percentage,
            xFactorOF5AndAboveCalculation,
          ),
        );
      }
    });

    return form;
  }
}
