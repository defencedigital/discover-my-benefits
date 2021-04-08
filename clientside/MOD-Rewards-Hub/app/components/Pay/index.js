import React, { PureComponent } from 'react';
import R from 'ramda/src/groupBy';
import { ServicePropType } from '../../containers/Services/propTypes';
import FormBuilder from '../FormBuilder';

import Ranks from '../../json/pay/ranks.json';
import Pay from '../../json/pay/pay.json';
import PayTable from '../../json/pay/payTable.json';

class PayForm extends PureComponent {
  state = {
    serviceMap: {
      navy: 1,
      army: 3,
      raf: 4,
      marines: 2,
    },
  };

  getService() {
    return this.props.service;
  }

  getServiceId() {
    return this.state.serviceMap[this.getService().slug];
  }

  getRanksQuestion() {
    const serviceId = this.getServiceId();
    const ranks = Ranks.filter(r => r.ServiceID === serviceId)
      .sort((a, b) => a.Order < b.Order)
      .reverse();

    return {
      type: 'select',
      value: null,
      label: 'What is your rank?',
      id: 'rank',
      name: 'profile.rank',
      options: ranks.map(r => ({
        id: r.ID,
        value: JSON.stringify(r),
        name: r.Name,
      })),
    };
  }

  getUniquePayTableQuestion() {
    return {
      type: 'select',
      value: null,
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
          id: 'profile.pay.unique.maybe',
          value: 'maybe',
          name: 'Maybe',
        },
      ],
      dependencies: [
        {
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer) {
              return false;
            }

            const rank = JSON.parse(currentAnswer);

            return rank.AllowsUniquePayTable === -1;
          },
        },
      ],
    };
  }

  getPayLevelQuestions() {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);
    const questions = [];

    Object.keys(ranges).forEach(rangeKey => {
      questions.push(ranges[rangeKey]);
    });

    return questions.map(range => ({
      type: 'select',
      value: null,
      label: 'What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: range
        .map(r => ({
          id: r.ID,
          value: r.ID,
          name: `${r.Level} - £${r.Salary}`,
        }))
        .sort((a, b) => a.ID < b.ID),
      dependencies: [
        {
          id: `${range[0].PayRangeID}:${range[0].PayTableID}`,
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer) {
              return false;
            }

            const rank = JSON.parse(currentAnswer);
            return rank.AllowsUniquePayTable === 0 && rank.PayRangeID === range[0].PayRangeID && rank.CorePayTableID === range[0].PayTableID;
          },
        },
        {
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'false' || currentAnswer === null,
        },
      ],
    }));
  }

  getNonUniquePayLevelQuestions() {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);
    const questions = [];

    Object.keys(ranges).forEach(rangeKey => {
      questions.push(ranges[rangeKey]);
    });

    const finalQuestions = questions.map(range => ({
      type: 'select',
      value: null,
      label: 'What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: range.map(r => ({
        id: r.ID,
        value: r.ID,
        name: `${r.Level} - £${r.Salary}`,
      })),
      dependencies: [
        {
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer) {
              return false;
            }

            const rank = JSON.parse(currentAnswer);
            return range[0].PayRangeID === rank.PayRangeID && range[0].PayTableID === rank.CorePayTableID;
          },
        },
        {
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'false',
        },
      ],
    }));

    return finalQuestions;
  }

  getWhichPayLevelQuestionsEdgeCase() {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);

    return {
      type: 'select',
      value: null,
      label: 'Which What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: ranges[':6'].map(r => ({
        id: r.ID,
        value: r.ID,
        name: `${r.Level} - £${r.Salary}`,
      })),
      dependencies: [
        {
          id: 'which-unique-Pay-table',
          question: 'profile.pay.unique.which',
          value: currentAnswer => currentAnswer === '6',
        },
        {
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer) {
              return false;
            }
            const rank = JSON.parse(currentAnswer);
            const result = PayTable.find(item => item.ID === rank.CorePayTableID);

            return !result || (result && result.IsUniquePayTable === 0);
          },
        },
        {
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'true' || currentAnswer === 'maybe',
        },
      ],
    };
  }

  getWhichPayLevelQuestions() {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);
    const questions = [];

    Object.keys(ranges).forEach(rangeKey => {
      questions.push(ranges[rangeKey]);
    });

    const finalQuestions = questions.map(range => ({
      type: 'select',
      value: null,
      label: 'Which What is your Pay level?',
      id: 'level',
      name: 'profile.pay.level',
      options: range.map(r => ({
        id: r.ID,
        value: r.ID,
        name: `${r.Level} - £${r.Salary}`,
      })),
      dependencies: [
        {
          id: 'which-unique-Pay-table',
          question: 'profile.pay.unique.which',
          value: currentAnswer => currentAnswer === range[0].PayTableID.toString(),
        },
        {
          id: 'profile.rank',
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer) {
              return false;
            }

            const rank = JSON.parse(currentAnswer);
            return range[0].PayRangeID === rank.PayRangeID;
          },
        },
        {
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'true' || currentAnswer === 'maybe',
        },
      ],
    }));

    finalQuestions.push(this.getWhichPayLevelQuestionsEdgeCase());

    return finalQuestions;
  }

  getWhichUniquePayQuestion() {
    const allPayRanges = Pay.map(item => item.PayRangeID).filter((item, position, array) => array.indexOf(item) === position);
    const tables = {};
    const questions = [];

    allPayRanges.forEach(range => {
      tables[range] = Pay.filter(item => item.PayRangeID === range || item.PayRangeID === '')
        .map(item => item.PayTableID)
        .filter((item, position, array) => array.indexOf(item) === position);
    });

    Object.keys(tables).forEach(tableKey => {
      const table = tables[tableKey];
      const tableOptions = PayTable.filter(item => table.indexOf(item.ID) !== -1 && item.IsUniquePayTable === -1);

      questions.push({
        type: 'select',
        value: null,
        label: 'Which Unique Pay Table are you paid from?',
        id: 'profile.pay.unique.which',
        name: 'profile.pay.unique.which',
        options: tableOptions.map(option => ({
          id: option.ID,
          value: option.ID,
          name: option.TableName,
        })),
        dependencies: [
          {
            id: `${tableKey}`,
            question: 'rank',
            value: currentAnswer => {
              if (!currentAnswer) {
                return false;
              }

              const PayRangeID = tableKey;
              const rank = JSON.parse(currentAnswer);

              return parseInt(PayRangeID, 10) === rank.PayRangeID;
            },
          },
          {
            id: 'unique-Pay-table',
            question: 'unique.pay.table',
            value: currentAnswer => currentAnswer === 'true' || currentAnswer === 'maybe',
          },
          {
            id: 'profile.rank',
            question: 'rank',
            value: currentAnswer => {
              if (!currentAnswer) {
                return false;
              }

              const rank = JSON.parse(currentAnswer);
              return rank.AllowsUniquePayTable === -1;
            },
          },
        ],
      });
    });

    return questions;
  }

  getSupplementLevelQuestions() {
    const ranksThatNeedSupplement = Ranks.filter(r => r.ServiceID === this.getServiceId() && r.CorePayTableID === '');

    return ranksThatNeedSupplement.map(rank => ({
      type: 'select',
      value: null,
      label: 'What is your supplement level?',
      id: 'supplement.level',
      name: 'profile.supplement.level',
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
          id: `${rank.ID}`,
          question: 'rank',
          value: currentAnswer => {
            if (!currentAnswer) {
              return false;
            }

            const r = JSON.parse(currentAnswer);
            return r.ID === rank.ID;
          },
        },
        {
          id: 'unique-Pay-table',
          question: 'unique.pay.table',
          value: currentAnswer => currentAnswer === 'false',
        },
      ],
    }));
  }

  getSalarySupplementPayLevelQuestions() {
    const byPayRangeID = R(pay => `${pay.PayRangeID}:${pay.PayTableID}`);
    const ranges = byPayRangeID(Pay);

    const ranksThatNeedSupplement = Ranks.filter(r => r.ServiceID === this.getServiceId() && r.CorePayTableID === '');
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
              value: null,
              label: 'What is your current Pay level?',
              id: 'level',
              name: 'profile.pay.level',
              options: ranges[rangeKey]
                .map(r => ({
                  id: r.ID,
                  value: r.ID,
                  name: `${r.Level} - £${r.Salary}`,
                }))
                .sort((a, b) => a.ID < b.ID),
              dependencies: [
                {
                  id: `${ranges[rangeKey][0].PayRangeID}:${ranges[rangeKey][0].PayTableID}`,
                  question: 'rank',
                  value: currentAnswer => {
                    if (!currentAnswer) {
                      return false;
                    }

                    const currentRank = JSON.parse(currentAnswer);
                    return currentRank.ID === rank.ID;
                  },
                },
                {
                  id: 'supplement.level',
                  question: 'supplement.level',
                  value: currentAnswer => parseInt(currentAnswer, 10) === level.id,
                },
                {
                  id: 'unique-Pay-table',
                  question: 'unique.pay.table',
                  value: currentAnswer => currentAnswer === 'false',
                },
              ],
            });
          }
        });
      });
    });

    return questions;
  }

  getForm() {
    const form = [];

    form.push([this.getRanksQuestion()]);

    form.push([this.getUniquePayTableQuestion()]);

    form.push(this.getWhichUniquePayQuestion());

    form.push(this.getPayLevelQuestions());
    form.push(this.getNonUniquePayLevelQuestions());
    form.push(this.getWhichPayLevelQuestions());
    form.push(this.getSupplementLevelQuestions());
    form.push(this.getSalarySupplementPayLevelQuestions());

    return form;
  }

  render() {
    const form = this.getForm();

    return <FormBuilder formOptions={{ className: null, questionHeading: false }} form={form} onUpdate={() => {}} />;
  }
}

PayForm.propTypes = {
  service: ServicePropType,
};

export default PayForm;
